"""
booking_service.py — Business logic and SQL for bookings.

All SQL lives here. Routes call these functions.

Pricing convention (matches existing seed data):
  nightly_subtotal = price_per_night * nights
  service_fee      = round(nightly_subtotal * 0.05)   # 5% of subtotal
  total_price      = nightly_subtotal + cleaning_fee + service_fee

Transaction safety:
  The availability re-check and INSERT are performed inside a single
  SQLite transaction (BEGIN IMMEDIATE) so two concurrent requests
  cannot create overlapping bookings.
"""

from __future__ import annotations

import math
from datetime import date

from database import get_connection


# ─── Public errors ─────────────────────────────────────────────────────────

class BookingValidationError(Exception):
    """Raised when business rules reject the booking. Carries an HTTP status."""
    def __init__(self, status: int, detail: str):
        self.status = status
        self.detail = detail
        super().__init__(detail)


# ─── Public functions ───────────────────────────────────────────────────────

def create_booking(
    listing_id: int,
    guest_id: int,
    check_in: str,
    check_out: str,
    guest_count: int,
) -> dict:
    """
    Validate, price, and persist a booking. Returns the new booking dict.

    Raises BookingValidationError on any business-rule violation.
    """
    ci = _parse_date(check_in, "check_in")
    co = _parse_date(check_out, "check_out")

    if co <= ci:
        raise BookingValidationError(400, "check_out must be after check_in")

    nights = (co - ci).days

    if guest_count < 1:
        raise BookingValidationError(400, "guest_count must be at least 1")

    conn = get_connection()
    try:
        # ── Fetch listing ──────────────────────────────────────────────────
        listing = conn.execute(
            """
            SELECT id, is_active, max_guests, price_per_night, cleaning_fee
            FROM listings WHERE id = ?
            """,
            (listing_id,),
        ).fetchone()

        if listing is None:
            raise BookingValidationError(404, "Listing not found")
        if not listing["is_active"]:
            raise BookingValidationError(404, "Listing is not available for booking")
        if guest_count > listing["max_guests"]:
            raise BookingValidationError(
                400,
                f"guest_count {guest_count} exceeds listing capacity of {listing['max_guests']}",
            )

        # ── Fetch guest ────────────────────────────────────────────────────
        guest = conn.execute(
            "SELECT id, role FROM users WHERE id = ?", (guest_id,)
        ).fetchone()

        if guest is None:
            raise BookingValidationError(404, "Guest user not found")
        if guest["role"] not in ("guest", "both"):
            raise BookingValidationError(
                400, "User does not have a guest role and cannot make bookings"
            )

        # ── Price calculation ──────────────────────────────────────────────
        nightly_rate: float = listing["price_per_night"]
        cleaning_fee: float = listing["cleaning_fee"]
        nightly_subtotal = nightly_rate * nights
        service_fee = round(nightly_subtotal * 0.05, 2)
        total_price = round(nightly_subtotal + cleaning_fee + service_fee, 2)

        # ── Availability check + INSERT inside a single transaction ────────
        # BEGIN IMMEDIATE acquires a write lock immediately, preventing
        # a second concurrent transaction from slipping in between the
        # check and the insert.
        conn.execute("BEGIN IMMEDIATE")

        overlapping = conn.execute(
            """
            SELECT 1 FROM bookings
            WHERE listing_id = ?
              AND check_in  < ?
              AND check_out > ?
            LIMIT 1
            """,
            (listing_id, check_out, check_in),
        ).fetchone()

        if overlapping:
            conn.execute("ROLLBACK")
            raise BookingValidationError(
                409, "The requested dates overlap an existing booking"
            )

        cursor = conn.execute(
            """
            INSERT INTO bookings
              (listing_id, guest_id, check_in, check_out,
               nightly_rate, nights, cleaning_fee, service_fee, total_price)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                listing_id, guest_id,
                check_in, check_out,
                nightly_rate, nights,
                cleaning_fee, service_fee, total_price,
            ),
        )
        conn.execute("COMMIT")

        new_id = cursor.lastrowid
        row = conn.execute(
            "SELECT * FROM bookings WHERE id = ?", (new_id,)
        ).fetchone()

        return _booking_to_dict(row)

    finally:
        conn.close()


def get_guest_bookings(guest_id: int) -> list[dict]:
    """
    Return all bookings for a guest, newest-first, with a listing snippet.

    Uses three queries — bookings, then bulk-fetch listing rows, then one
    image per listing — to avoid N+1.
    """
    conn = get_connection()
    try:
        rows = conn.execute(
            """
            SELECT id, listing_id, guest_id, check_in, check_out,
                   nightly_rate, nights, cleaning_fee, service_fee,
                   total_price, created_at
            FROM bookings
            WHERE guest_id = ?
            ORDER BY check_in DESC
            """,
            (guest_id,),
        ).fetchall()

        if not rows:
            return []

        listing_ids = list({r["listing_id"] for r in rows})
        placeholders = ",".join("?" for _ in listing_ids)

        listing_rows = conn.execute(
            f"""
            SELECT id, title, city, country
            FROM listings WHERE id IN ({placeholders})
            """,
            listing_ids,
        ).fetchall()
        listings_map = {r["id"]: dict(r) for r in listing_rows}

        # One primary image per listing (position = 0 or lowest available)
        img_rows = conn.execute(
            f"""
            SELECT listing_id, url
            FROM listing_images
            WHERE listing_id IN ({placeholders})
            ORDER BY listing_id, position ASC
            """,
            listing_ids,
        ).fetchall()
        images_map: dict[int, str] = {}
        for img in img_rows:
            if img["listing_id"] not in images_map:
                images_map[img["listing_id"]] = img["url"]

        results = []
        for row in rows:
            lid = row["listing_id"]
            info = listings_map.get(lid, {})
            results.append({
                **_booking_to_dict(row),
                "listing": {
                    "id": lid,
                    "title": info.get("title", ""),
                    "city": info.get("city", ""),
                    "country": info.get("country", ""),
                    "image": images_map.get(lid),
                },
            })
        return results
    finally:
        conn.close()


# ─── Private helpers ────────────────────────────────────────────────────────

def _parse_date(value: str, field: str) -> date:
    try:
        return date.fromisoformat(value)
    except (ValueError, TypeError):
        raise BookingValidationError(400, f"{field} must be a valid date (YYYY-MM-DD)")


def _booking_to_dict(row) -> dict:
    return {
        "id": row["id"],
        "listing_id": row["listing_id"],
        "guest_id": row["guest_id"],
        "check_in": row["check_in"],
        "check_out": row["check_out"],
        "nightly_rate": row["nightly_rate"],
        "nights": row["nights"],
        "cleaning_fee": row["cleaning_fee"],
        "service_fee": row["service_fee"],
        "total_price": row["total_price"],
        "created_at": row["created_at"],
    }
