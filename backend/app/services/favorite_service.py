"""
favorite_service.py — Business logic and SQL for the favorites feature.

All SQL lives here. Routes call these functions.

The favorites table has a UNIQUE(user_id, listing_id) constraint.
add_favorite() is idempotent: if the row already exists, the existing
row is returned rather than raising an error.
"""

from __future__ import annotations

from database import get_connection


class FavoriteError(Exception):
    """Raised when a favorites operation fails. Carries an HTTP status."""
    def __init__(self, status: int, detail: str):
        self.status = status
        self.detail = detail
        super().__init__(detail)


def get_user_favorites(user_id: int) -> list[dict]:
    """
    Return all favorited listings for a user, newest-first.

    Each entry includes a listing snippet with title, city, country, and
    the first image URL.
    """
    conn = get_connection()
    try:
        # Verify user exists
        user = conn.execute(
            "SELECT id FROM users WHERE id = ?", (user_id,)
        ).fetchone()
        if user is None:
            raise FavoriteError(404, "User not found")

        rows = conn.execute(
            """
            SELECT f.id, f.user_id, f.listing_id, f.created_at,
                   l.title, l.city, l.country, l.price_per_night,
                   l.is_active
            FROM favorites f
            JOIN listings l ON l.id = f.listing_id
            WHERE f.user_id = ?
            ORDER BY f.created_at DESC
            """,
            (user_id,),
        ).fetchall()

        if not rows:
            return []

        listing_ids = [r["listing_id"] for r in rows]
        placeholders = ",".join("?" for _ in listing_ids)

        # One primary image per listing
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
            results.append({
                "id": row["id"],
                "user_id": row["user_id"],
                "listing_id": lid,
                "created_at": row["created_at"],
                "listing": {
                    "id": lid,
                    "title": row["title"],
                    "city": row["city"],
                    "country": row["country"],
                    "price_per_night": row["price_per_night"],
                    "is_active": bool(row["is_active"]),
                    "image": images_map.get(lid),
                },
            })
        return results
    finally:
        conn.close()


def add_favorite(user_id: int, listing_id: int) -> dict:
    """
    Add a listing to the user's favorites. Idempotent.

    If the (user_id, listing_id) pair already exists, the existing row
    is returned without an error (UNIQUE constraint is handled gracefully).
    """
    conn = get_connection()
    try:
        # Verify user exists
        user = conn.execute(
            "SELECT id FROM users WHERE id = ?", (user_id,)
        ).fetchone()
        if user is None:
            raise FavoriteError(404, "User not found")

        # Verify listing exists and is active
        listing = conn.execute(
            "SELECT id FROM listings WHERE id = ? AND is_active = 1", (listing_id,)
        ).fetchone()
        if listing is None:
            raise FavoriteError(404, "Listing not found or is not active")

        # Check if already favorited (handle idempotently)
        existing = conn.execute(
            "SELECT id, user_id, listing_id, created_at FROM favorites WHERE user_id = ? AND listing_id = ?",
            (user_id, listing_id),
        ).fetchone()
        if existing:
            return dict(existing)

        cursor = conn.execute(
            "INSERT INTO favorites (user_id, listing_id) VALUES (?, ?)",
            (user_id, listing_id),
        )
        conn.commit()
        new_id = cursor.lastrowid
        row = conn.execute(
            "SELECT id, user_id, listing_id, created_at FROM favorites WHERE id = ?",
            (new_id,),
        ).fetchone()
        return dict(row)
    finally:
        conn.close()


def remove_favorite(user_id: int, listing_id: int) -> bool:
    """
    Remove a listing from the user's favorites.

    Returns True if the row was deleted, False if it did not exist.
    """
    conn = get_connection()
    try:
        cursor = conn.execute(
            "DELETE FROM favorites WHERE user_id = ? AND listing_id = ?",
            (user_id, listing_id),
        )
        conn.commit()
        return cursor.rowcount > 0
    finally:
        conn.close()


def is_favorited(user_id: int, listing_id: int) -> bool:
    """Return True if the user has favorited the given listing."""
    conn = get_connection()
    try:
        row = conn.execute(
            "SELECT 1 FROM favorites WHERE user_id = ? AND listing_id = ?",
            (user_id, listing_id),
        ).fetchone()
        return row is not None
    finally:
        conn.close()
