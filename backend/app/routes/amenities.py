"""
Amenities route handlers.

Exposes available amenities from the database for listings and host creation.
"""

from fastapi import APIRouter
from database import get_connection

router = APIRouter(prefix="/api/amenities", tags=["amenities"])


@router.get("", response_model=list[str])
def get_amenities():
    """Return all available amenities from the database."""
    conn = get_connection()
    try:
        rows = conn.execute("SELECT name FROM amenities ORDER BY id ASC").fetchall()
        return [r["name"] for r in rows]
    finally:
        conn.close()
