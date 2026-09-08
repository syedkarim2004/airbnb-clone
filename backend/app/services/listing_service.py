"""
listing_service.py — Database queries and data assembly for listings.

All SQL lives here. Route handlers call these functions and never
touch the database directly.

Query strategy (avoids N+1):
  1. COUNT query: same WHERE clause as the main query, used for pagination metadata.
  2. Main query: listings LEFT JOIN reviews → rating_avg, review_count.
     Also joins users for host name. Applied LIMIT/OFFSET for pagination.
  3. Images query: all images for the returned listing IDs, ORDER BY position ASC.
  4. Amenities query: all amenities for the returned listing IDs via junction table.

Four simple queries instead of one massive join that would duplicate rows.
"""

from __future__ import annotations

import math
from dataclasses import dataclass, field
from typing import Optional

from database import get_connection


@dataclass
class SearchParams:
    """Validated search parameters passed from the route layer to the service."""
    city: Optional[str] = None
    guests: Optional[int] = None
    min_price: Optional[float] = None
    max_price: Optional[float] = None
    check_in: Optional[str] = None   # ISO date string "YYYY-MM-DD"
    check_out: Optional[str] = None  # ISO date string "YYYY-MM-DD"
    page: int = 1
    page_size: int = 12


def search_listings(params: SearchParams) -> dict:
    """
    Return a paginated, filtered list of active listings.

    Builds the WHERE clause dynamically based on which filters are present.
    All user-supplied values are bound as SQL parameters (never interpolated).
    """
    conn = get_connection()
    try:
        conditions: list[str] = ["l.is_active = 1"]
        bind_values: list = []

        # ── City filter (case-insensitive) ────────────────────────────────
        if params.city:
            conditions.append("LOWER(l.city) = LOWER(?)")
            bind_values.append(params.city)

        # ── Guest capacity filter ─────────────────────────────────────────
        if params.guests is not None:
            conditions.append("l.max_guests >= ?")
            bind_values.append(params.guests)

        # ── Price range filter ────────────────────────────────────────────
        if params.min_price is not None:
            conditions.append("l.price_per_night >= ?")
            bind_values.append(params.min_price)

        if params.max_price is not None:
            conditions.append("l.price_per_night <= ?")
            bind_values.append(params.max_price)

        # ── Date availability filter ──────────────────────────────────────
        # Overlap rule: an existing booking (b) conflicts with the requested
        # range [check_in, check_out) when:
        #   b.check_in  < requested_check_out   (existing starts before we leave)
        #   b.check_out > requested_check_in    (existing ends after we arrive)
        #
        # Boundary case: existing Oct 1–5, requested Oct 5–8 → NOT overlapping.
        # Oct 1 < Oct 8  (TRUE) AND Oct 5 > Oct 5  (FALSE) → no conflict → available.
        if params.check_in and params.check_out:
            conditions.append(
                """
                NOT EXISTS (
                    SELECT 1 FROM bookings b
                    WHERE b.listing_id = l.id
                      AND b.check_in  < ?
                      AND b.check_out > ?
                )
                """
            )
            bind_values.append(params.check_out)   # existing.check_in < requested_check_out
            bind_values.append(params.check_in)    # existing.check_out > requested_check_in

        where_clause = " AND ".join(conditions)

        # ── COUNT query (for pagination metadata) ─────────────────────────
        # We count distinct listing IDs rather than rows, because the
        # GROUP BY in the main query is not needed here.
        count_sql = f"""
            SELECT COUNT(*) AS total
            FROM listings l
            WHERE {where_clause}
        """
        total: int = conn.execute(count_sql, bind_values).fetchone()["total"]

        total_pages = math.ceil(total / params.page_size) if total > 0 else 1
        offset = (params.page - 1) * params.page_size

        # ── Main listings query ───────────────────────────────────────────
        main_sql = f"""
            SELECT
                l.id,
                l.title,
                l.description,
                l.city,
                l.country,
                l.latitude,
                l.longitude,
                l.price_per_night,
                l.cleaning_fee,
                l.max_guests,
                l.host_id,
                u.name AS host_name,
                AVG(r.rating)  AS rating_avg,
                COUNT(r.id)    AS review_count
            FROM listings l
            JOIN  users u    ON u.id = l.host_id
            LEFT JOIN reviews r ON r.listing_id = l.id
            WHERE {where_clause}
            GROUP BY l.id
            ORDER BY l.id
            LIMIT ? OFFSET ?
        """
        rows = conn.execute(
            main_sql, bind_values + [params.page_size, offset]
        ).fetchall()

        if not rows:
            return {
                "items": [],
                "page": params.page,
                "page_size": params.page_size,
                "total": total,
                "total_pages": total_pages,
            }

        listing_ids = [row["id"] for row in rows]
        images_map = _fetch_images(conn, listing_ids)
        amenities_map = _fetch_amenities(conn, listing_ids)

        items = [
            _assemble_listing(row, images_map, amenities_map)
            for row in rows
        ]

        return {
            "items": items,
            "page": params.page,
            "page_size": params.page_size,
            "total": total,
            "total_pages": total_pages,
        }
    finally:
        conn.close()


def get_active_listing_by_id(listing_id: int) -> dict | None:
    """Return one active listing with related data, or None if not found."""
    conn = get_connection()
    try:
        row = conn.execute("""
            SELECT
                l.id,
                l.title,
                l.description,
                l.city,
                l.country,
                l.latitude,
                l.longitude,
                l.price_per_night,
                l.cleaning_fee,
                l.max_guests,
                l.host_id,
                u.name AS host_name,
                AVG(r.rating) AS rating_avg,
                COUNT(r.id) AS review_count
            FROM listings l
            JOIN users u ON u.id = l.host_id
            LEFT JOIN reviews r ON r.listing_id = l.id
            WHERE l.id = ? AND l.is_active = 1
            GROUP BY l.id
        """, (listing_id,)).fetchone()

        if row is None:
            return None

        images_map = _fetch_images(conn, [listing_id])
        amenities_map = _fetch_amenities(conn, [listing_id])

        return _assemble_listing(row, images_map, amenities_map)
    finally:
        conn.close()


# ── Kept for backwards compatibility (used by old tests before Step 6) ────────
def get_all_active_listings() -> list[dict]:
    """
    Return all active listings. Deprecated — prefer search_listings().

    Retained so any legacy callers continue to work without modification.
    """
    result = search_listings(SearchParams(page=1, page_size=10_000))
    return result["items"]


def _fetch_images(conn, listing_ids: list[int]) -> dict[int, list[str]]:
    """Fetch image URLs for the given listing IDs, ordered by position ASC."""
    if not listing_ids:
        return {}

    placeholders = ",".join("?" for _ in listing_ids)
    rows = conn.execute(
        f"""
        SELECT listing_id, url
        FROM listing_images
        WHERE listing_id IN ({placeholders})
        ORDER BY listing_id, position ASC
        """,
        listing_ids,
    ).fetchall()

    images_map: dict[int, list[str]] = {}
    for row in rows:
        images_map.setdefault(row["listing_id"], []).append(row["url"])
    return images_map


def _fetch_amenities(conn, listing_ids: list[int]) -> dict[int, list[str]]:
    """Fetch amenity names for the given listing IDs."""
    if not listing_ids:
        return {}

    placeholders = ",".join("?" for _ in listing_ids)
    rows = conn.execute(
        f"""
        SELECT la.listing_id, a.name
        FROM listing_amenities la
        JOIN amenities a ON a.id = la.amenity_id
        WHERE la.listing_id IN ({placeholders})
        ORDER BY la.listing_id, a.name
        """,
        listing_ids,
    ).fetchall()

    amenities_map: dict[int, list[str]] = {}
    for row in rows:
        amenities_map.setdefault(row["listing_id"], []).append(row["name"])
    return amenities_map


def _assemble_listing(
    row,
    images_map: dict[int, list[str]],
    amenities_map: dict[int, list[str]],
) -> dict:
    """Combine a listing row with its images and amenities into an API-ready dict."""
    listing_id = row["id"]
    return {
        "id": listing_id,
        "title": row["title"],
        "description": row["description"],
        "city": row["city"],
        "country": row["country"],
        "latitude": row["latitude"],
        "longitude": row["longitude"],
        "price_per_night": row["price_per_night"],
        "cleaning_fee": row["cleaning_fee"],
        "max_guests": row["max_guests"],
        "rating_avg": round(row["rating_avg"], 2) if row["rating_avg"] is not None else None,
        "review_count": row["review_count"],
        "host": {"id": row["host_id"] if "host_id" in row.keys() else None, "name": row["host_name"]},
        "host_id": row["host_id"] if "host_id" in row.keys() else None,
        "host_name": row["host_name"],
        "images": images_map.get(listing_id, []),
        "amenities": amenities_map.get(listing_id, []),
    }
