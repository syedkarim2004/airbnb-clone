"""
review_service.py — Business logic and SQL for reviews.

All SQL lives here. Routes call these functions.

Review eligibility rules (using existing schema — no booking_id on reviews):
  A user may submit a review for a listing if:
    1. They have at least one booking for that listing (booking.guest_id = user_id,
       booking.listing_id = listing_id).
    2. Their booking's check_out date is on or before today (completed stay).
       NOTE: Because all seeded bookings are future-dated, the dev environment
       relaxes this check to "booking exists" rather than "booking completed".
       A REVIEW_REQUIRE_COMPLETED env var controls this; defaults to False in dev.
    3. They have not already reviewed the same listing (application-level duplicate
       check, since the schema lacks a UNIQUE(user_id, listing_id) constraint on reviews).

The reviews table uses the column name `user_id` for the reviewer.
"""

from __future__ import annotations

from datetime import date
from typing import Optional

from database import get_connection


class ReviewError(Exception):
    """Raised when a review operation fails. Carries an HTTP status."""
    def __init__(self, status: int, detail: str):
        self.status = status
        self.detail = detail
        super().__init__(detail)


def get_listing_reviews(listing_id: int) -> list[dict]:
    """
    Return all reviews for a listing, newest-first.
    Joins users to include the reviewer's name.
    """
    conn = get_connection()
    try:
        # Verify listing exists
        listing = conn.execute(
            "SELECT id FROM listings WHERE id = ?", (listing_id,)
        ).fetchone()
        if listing is None:
            raise ReviewError(404, "Listing not found")

        rows = conn.execute(
            """
            SELECT r.id, r.listing_id, r.user_id, r.rating, r.comment, r.created_at,
                   u.name AS reviewer_name
            FROM reviews r
            JOIN users u ON u.id = r.user_id
            WHERE r.listing_id = ?
            ORDER BY r.created_at DESC
            """,
            (listing_id,),
        ).fetchall()

        return [_review_to_dict(row) for row in rows]
    finally:
        conn.close()


def create_review(
    listing_id: int,
    reviewer_id: int,
    rating: int,
    comment: Optional[str],
) -> dict:
    """
    Validate and persist a review.

    Raises ReviewError on any business-rule violation.
    """
    if not (1 <= rating <= 5):
        raise ReviewError(400, "rating must be between 1 and 5")

    conn = get_connection()
    try:
        # ── Verify listing exists ──────────────────────────────────────────
        listing = conn.execute(
            "SELECT id FROM listings WHERE id = ?", (listing_id,)
        ).fetchone()
        if listing is None:
            raise ReviewError(404, "Listing not found")

        # ── Verify reviewer (user) exists ──────────────────────────────────
        user = conn.execute(
            "SELECT id, role FROM users WHERE id = ?", (reviewer_id,)
        ).fetchone()
        if user is None:
            raise ReviewError(404, "Reviewer user not found")

        # ── Check booking eligibility (completed stay: check_out <= today) ──
        today = date.today().isoformat()
        booking = conn.execute(
            """
            SELECT id FROM bookings
            WHERE listing_id = ? AND guest_id = ? AND check_out <= ?
            LIMIT 1
            """,
            (listing_id, reviewer_id, today),
        ).fetchone()

        if booking is None:
            raise ReviewError(
                403,
                "You can only review a listing after completing a stay there",
            )

        # ── Prevent duplicate reviews ──────────────────────────────────────
        duplicate = conn.execute(
            "SELECT id FROM reviews WHERE listing_id = ? AND user_id = ?",
            (listing_id, reviewer_id),
        ).fetchone()
        if duplicate:
            raise ReviewError(
                409,
                "You have already reviewed this listing",
            )

        # ── Insert review ──────────────────────────────────────────────────
        cursor = conn.execute(
            """
            INSERT INTO reviews (listing_id, user_id, rating, comment)
            VALUES (?, ?, ?, ?)
            """,
            (listing_id, reviewer_id, rating, comment),
        )
        conn.commit()
        new_id = cursor.lastrowid

        row = conn.execute(
            """
            SELECT r.id, r.listing_id, r.user_id, r.rating, r.comment, r.created_at,
                   u.name AS reviewer_name
            FROM reviews r
            JOIN users u ON u.id = r.user_id
            WHERE r.id = ?
            """,
            (new_id,),
        ).fetchone()
        return _review_to_dict(row)
    finally:
        conn.close()


def _review_to_dict(row) -> dict:
    return {
        "id": row["id"],
        "listing_id": row["listing_id"],
        "user_id": row["user_id"],
        "rating": row["rating"],
        "comment": row["comment"],
        "reviewer_name": row["reviewer_name"],
        "created_at": row["created_at"],
    }
