"""
host_service.py — Business logic and SQL for the host dashboard.

All SQL lives here. Routes call these functions.

Authorization model (MOCK — permitted by assignment):
  The X-User-Id request header carries the current user's ID.
  The route layer extracts it and passes it as current_host_id.
  This service independently verifies:
    - The user exists and has role 'host' or 'both'.
    - For mutations: listing.host_id == current_host_id.

Deletion strategy:
  "Deleting" a listing is always a soft-delete (is_active = 0).
  This preserves the listing row, all booking rows, and all price
  snapshots in bookings. All FK references remain intact.
  No cascade deletes are triggered.
"""

from __future__ import annotations

from typing import Optional

from database import get_connection


class HostError(Exception):
    """Raised when a host operation fails. Carries an HTTP status."""
    def __init__(self, status: int, detail: str):
        self.status = status
        self.detail = detail
        super().__init__(detail)


# ─── Public functions ───────────────────────────────────────────────────────

def get_host_listings(host_id: int) -> list[dict]:
    """
    Return all listings owned by this host (active and inactive),
    enriched with booking counts and total revenue.
    """
    conn = get_connection()
    try:
        _verify_host(conn, host_id)

        rows = conn.execute(
            """
            SELECT
                l.id, l.host_id, l.title, l.description,
                l.city, l.country, l.latitude, l.longitude,
                l.price_per_night, l.cleaning_fee, l.max_guests,
                l.is_active, l.created_at,
                COUNT(b.id)         AS booking_count,
                COALESCE(SUM(b.total_price), 0) AS total_revenue
            FROM listings l
            LEFT JOIN bookings b ON b.listing_id = l.id
            WHERE l.host_id = ?
            GROUP BY l.id
            ORDER BY l.created_at DESC
            """,
            (host_id,),
        ).fetchall()

        if not rows:
            return []

        listing_ids = [r["id"] for r in rows]
        images_map = _fetch_images(conn, listing_ids)
        amenities_map = _fetch_amenities(conn, listing_ids)

        return [_assemble_host_listing(row, images_map, amenities_map) for row in rows]
    finally:
        conn.close()


def create_listing(
    host_id: int,
    title: str,
    description: str,
    city: str,
    country: str,
    price_per_night: float,
    cleaning_fee: float,
    max_guests: int,
    latitude: Optional[float] = None,
    longitude: Optional[float] = None,
    images: Optional[list[str]] = None,
    amenities: Optional[list[str]] = None,
) -> dict:
    """Create and return a new active listing owned by host_id."""
    conn = get_connection()
    try:
        _verify_host(conn, host_id)

        cursor = conn.execute(
            """
            INSERT INTO listings
              (host_id, title, description, city, country,
               latitude, longitude, price_per_night, cleaning_fee, max_guests, is_active)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
            """,
            (
                host_id, title, description, city, country,
                latitude, longitude, price_per_night, cleaning_fee, max_guests,
            ),
        )
        new_id = cursor.lastrowid

        if images:
            valid_images = [img.strip() for img in images if img and img.strip()]
            for pos, img_url in enumerate(valid_images):
                conn.execute(
                    """
                    INSERT INTO listing_images (listing_id, url, position)
                    VALUES (?, ?, ?)
                    """,
                    (new_id, img_url, pos),
                )

        if amenities:
            for amenity_name in amenities:
                name = amenity_name.strip()
                if not name:
                    continue
                row_amenity = conn.execute(
                    "SELECT id FROM amenities WHERE name = ? COLLATE NOCASE",
                    (name,),
                ).fetchone()
                if row_amenity:
                    amenity_id = row_amenity["id"]
                else:
                    cur = conn.execute(
                        "INSERT OR IGNORE INTO amenities (name) VALUES (?)",
                        (name,),
                    )
                    amenity_id = cur.lastrowid
                    if not amenity_id:
                        row_amenity = conn.execute(
                            "SELECT id FROM amenities WHERE name = ?", (name,)
                        ).fetchone()
                        amenity_id = row_amenity["id"]

                conn.execute(
                    """
                    INSERT OR IGNORE INTO listing_amenities (listing_id, amenity_id)
                    VALUES (?, ?)
                    """,
                    (new_id, amenity_id),
                )

        conn.commit()

        row = conn.execute(
            """
            SELECT l.id, l.host_id, l.title, l.description,
                   l.city, l.country, l.latitude, l.longitude,
                   l.price_per_night, l.cleaning_fee, l.max_guests,
                   l.is_active, l.created_at,
                   0 AS booking_count, 0.0 AS total_revenue
            FROM listings l
            WHERE l.id = ?
            """,
            (new_id,),
        ).fetchone()

        images_map = _fetch_images(conn, [new_id])
        amenities_map = _fetch_amenities(conn, [new_id])
        return _assemble_host_listing(row, images_map, amenities_map)
    finally:
        conn.close()


def update_listing(
    listing_id: int,
    host_id: int,
    title: Optional[str] = None,
    description: Optional[str] = None,
    price_per_night: Optional[float] = None,
    cleaning_fee: Optional[float] = None,
    max_guests: Optional[int] = None,
    images: Optional[list[str]] = None,
    amenities: Optional[list[str]] = None,
) -> dict:
    """
    Partially update a listing. Only provided (non-None) fields are changed.

    Raises HostError(403) if the listing does not belong to host_id.
    """
    conn = get_connection()
    try:
        _verify_host(conn, host_id)
        _verify_ownership(conn, listing_id, host_id)

        updates: list[str] = []
        values: list = []

        if title is not None:
            updates.append("title = ?")
            values.append(title)
        if description is not None:
            updates.append("description = ?")
            values.append(description)
        if price_per_night is not None:
            updates.append("price_per_night = ?")
            values.append(price_per_night)
        if cleaning_fee is not None:
            updates.append("cleaning_fee = ?")
            values.append(cleaning_fee)
        if max_guests is not None:
            updates.append("max_guests = ?")
            values.append(max_guests)

        if updates:
            values.append(listing_id)
            conn.execute(
                f"UPDATE listings SET {', '.join(updates)} WHERE id = ?",
                values,
            )

        if images is not None:
            conn.execute("DELETE FROM listing_images WHERE listing_id = ?", (listing_id,))
            valid_images = [img.strip() for img in images if img and img.strip()]
            for pos, img_url in enumerate(valid_images):
                conn.execute(
                    """
                    INSERT INTO listing_images (listing_id, url, position)
                    VALUES (?, ?, ?)
                    """,
                    (listing_id, img_url, pos),
                )

        if amenities is not None:
            conn.execute("DELETE FROM listing_amenities WHERE listing_id = ?", (listing_id,))
            for amenity_name in amenities:
                name = amenity_name.strip()
                if not name:
                    continue
                row_amenity = conn.execute(
                    "SELECT id FROM amenities WHERE name = ? COLLATE NOCASE",
                    (name,),
                ).fetchone()
                if row_amenity:
                    amenity_id = row_amenity["id"]
                else:
                    cur = conn.execute(
                        "INSERT OR IGNORE INTO amenities (name) VALUES (?)",
                        (name,),
                    )
                    amenity_id = cur.lastrowid
                    if not amenity_id:
                        row_amenity = conn.execute(
                            "SELECT id FROM amenities WHERE name = ?", (name,)
                        ).fetchone()
                        amenity_id = row_amenity["id"]

                conn.execute(
                    """
                    INSERT OR IGNORE INTO listing_amenities (listing_id, amenity_id)
                    VALUES (?, ?)
                    """,
                    (listing_id, amenity_id),
                )

        if not updates and images is None and amenities is None:
            raise HostError(400, "No fields to update were provided")

        conn.commit()

        row = conn.execute(
            """
            SELECT l.id, l.host_id, l.title, l.description,
                   l.city, l.country, l.latitude, l.longitude,
                   l.price_per_night, l.cleaning_fee, l.max_guests,
                   l.is_active, l.created_at,
                   COUNT(b.id)         AS booking_count,
                   COALESCE(SUM(b.total_price), 0) AS total_revenue
            FROM listings l
            LEFT JOIN bookings b ON b.listing_id = l.id
            WHERE l.id = ?
            GROUP BY l.id
            """,
            (listing_id,),
        ).fetchone()

        images_map = _fetch_images(conn, [listing_id])
        amenities_map = _fetch_amenities(conn, [listing_id])
        return _assemble_host_listing(row, images_map, amenities_map)
    finally:
        conn.close()


def deactivate_listing(listing_id: int, host_id: int) -> dict:
    """
    Soft-delete a listing by setting is_active = 0.

    Preserves the listing row, all bookings, and all price snapshots.
    No cascade deletes occur. The listing will not appear in public search
    results but all historical data remains intact.

    Raises HostError(403) if the listing does not belong to host_id.
    """
    conn = get_connection()
    try:
        _verify_host(conn, host_id)
        _verify_ownership(conn, listing_id, host_id)

        conn.execute(
            "UPDATE listings SET is_active = 0 WHERE id = ?",
            (listing_id,),
        )
        conn.commit()

        row = conn.execute(
            """
            SELECT l.id, l.host_id, l.title, l.description,
                   l.city, l.country, l.latitude, l.longitude,
                   l.price_per_night, l.cleaning_fee, l.max_guests,
                   l.is_active, l.created_at,
                   COUNT(b.id)         AS booking_count,
                   COALESCE(SUM(b.total_price), 0) AS total_revenue
            FROM listings l
            LEFT JOIN bookings b ON b.listing_id = l.id
            WHERE l.id = ?
            GROUP BY l.id
            """,
            (listing_id,),
        ).fetchone()

        images_map = _fetch_images(conn, [listing_id])
        amenities_map = _fetch_amenities(conn, [listing_id])
        return _assemble_host_listing(row, images_map, amenities_map)
    finally:
        conn.close()


def reactivate_listing(listing_id: int, host_id: int) -> dict:
    """Re-activate a soft-deleted listing (set is_active = 1)."""
    conn = get_connection()
    try:
        _verify_host(conn, host_id)
        _verify_ownership(conn, listing_id, host_id)

        conn.execute(
            "UPDATE listings SET is_active = 1 WHERE id = ?",
            (listing_id,),
        )
        conn.commit()

        row = conn.execute(
            """
            SELECT l.id, l.host_id, l.title, l.description,
                   l.city, l.country, l.latitude, l.longitude,
                   l.price_per_night, l.cleaning_fee, l.max_guests,
                   l.is_active, l.created_at,
                   COUNT(b.id)         AS booking_count,
                   COALESCE(SUM(b.total_price), 0) AS total_revenue
            FROM listings l
            LEFT JOIN bookings b ON b.listing_id = l.id
            WHERE l.id = ?
            GROUP BY l.id
            """,
            (listing_id,),
        ).fetchone()

        images_map = _fetch_images(conn, [listing_id])
        amenities_map = _fetch_amenities(conn, [listing_id])
        return _assemble_host_listing(row, images_map, amenities_map)
    finally:
        conn.close()


def get_host_bookings(host_id: int) -> list[dict]:
    """
    Return all bookings across all listings owned by this host, newest first.
    Includes listing title and guest name.
    """
    conn = get_connection()
    try:
        _verify_host(conn, host_id)

        rows = conn.execute(
            """
            SELECT b.id, b.listing_id, l.title AS listing_title,
                   b.guest_id, u.name AS guest_name,
                   b.check_in, b.check_out, b.nights, b.total_price, b.created_at
            FROM bookings b
            JOIN listings l ON l.id = b.listing_id
            JOIN users u ON u.id = b.guest_id
            WHERE l.host_id = ?
            ORDER BY b.check_in DESC
            """,
            (host_id,),
        ).fetchall()

        return [
            {
                "id": r["id"],
                "listing_id": r["listing_id"],
                "listing_title": r["listing_title"],
                "guest_id": r["guest_id"],
                "guest_name": r["guest_name"],
                "check_in": r["check_in"],
                "check_out": r["check_out"],
                "nights": r["nights"],
                "total_price": r["total_price"],
                "created_at": r["created_at"],
            }
            for r in rows
        ]
    finally:
        conn.close()


# ─── Private helpers ────────────────────────────────────────────────────────

def _verify_host(conn, host_id: int) -> None:
    """Raise HostError if user does not exist or is not a host/both."""
    user = conn.execute(
        "SELECT id, role FROM users WHERE id = ?", (host_id,)
    ).fetchone()
    if user is None:
        raise HostError(404, "Host user not found")
    if user["role"] not in ("host", "both"):
        raise HostError(403, "User does not have host privileges")


def _verify_ownership(conn, listing_id: int, host_id: int) -> None:
    """Raise HostError if listing does not exist or belongs to a different host."""
    listing = conn.execute(
        "SELECT id, host_id FROM listings WHERE id = ?", (listing_id,)
    ).fetchone()
    if listing is None:
        raise HostError(404, "Listing not found")
    if listing["host_id"] != host_id:
        raise HostError(403, "You do not own this listing")


def _fetch_images(conn, listing_ids: list[int]) -> dict[int, list[str]]:
    if not listing_ids:
        return {}
    placeholders = ",".join("?" for _ in listing_ids)
    rows = conn.execute(
        f"""
        SELECT listing_id, url FROM listing_images
        WHERE listing_id IN ({placeholders})
        ORDER BY listing_id, position ASC
        """,
        listing_ids,
    ).fetchall()
    result: dict[int, list[str]] = {}
    for row in rows:
        result.setdefault(row["listing_id"], []).append(row["url"])
    return result


def _fetch_amenities(conn, listing_ids: list[int]) -> dict[int, list[str]]:
    if not listing_ids:
        return {}
    placeholders = ",".join("?" for _ in listing_ids)
    rows = conn.execute(
        f"""
        SELECT la.listing_id, a.name FROM listing_amenities la
        JOIN amenities a ON a.id = la.amenity_id
        WHERE la.listing_id IN ({placeholders})
        ORDER BY la.listing_id, a.name
        """,
        listing_ids,
    ).fetchall()
    result: dict[int, list[str]] = {}
    for row in rows:
        result.setdefault(row["listing_id"], []).append(row["name"])
    return result


def _assemble_host_listing(row, images_map: dict, amenities_map: dict) -> dict:
    lid = row["id"]
    return {
        "id": lid,
        "host_id": row["host_id"],
        "title": row["title"],
        "description": row["description"],
        "city": row["city"],
        "country": row["country"],
        "latitude": row["latitude"],
        "longitude": row["longitude"],
        "price_per_night": row["price_per_night"],
        "cleaning_fee": row["cleaning_fee"],
        "max_guests": row["max_guests"],
        "is_active": bool(row["is_active"]),
        "created_at": row["created_at"],
        "images": images_map.get(lid, []),
        "amenities": amenities_map.get(lid, []),
        "booking_count": row["booking_count"],
        "total_revenue": row["total_revenue"],
    }
