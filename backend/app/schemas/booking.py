"""
Pydantic schemas for the bookings API.

Request and response contracts only — not tied to database shape.
"""

from __future__ import annotations

from pydantic import BaseModel


# ── Request ────────────────────────────────────────────────────────────────

class BookingCreateRequest(BaseModel):
    """Body sent by the client to create a booking."""
    listing_id: int
    guest_id: int
    check_in: str        # "YYYY-MM-DD"
    check_out: str       # "YYYY-MM-DD"
    guest_count: int


# ── Responses ──────────────────────────────────────────────────────────────

class BookingResponse(BaseModel):
    """Full booking record returned after creation or lookup."""
    id: int
    listing_id: int
    guest_id: int
    check_in: str
    check_out: str
    nightly_rate: float
    nights: int
    cleaning_fee: float
    service_fee: float
    total_price: float
    created_at: str


class BookingListingSnippet(BaseModel):
    """Minimal listing data embedded in a booking for the My Trips view."""
    id: int
    title: str
    city: str
    country: str
    image: str | None       # first image (position=0), or None


class BookingWithListingResponse(BaseModel):
    """Booking + listing snippet — used for GET /api/bookings?guest_id=..."""
    id: int
    listing_id: int
    guest_id: int
    check_in: str
    check_out: str
    nightly_rate: float
    nights: int
    cleaning_fee: float
    service_fee: float
    total_price: float
    created_at: str
    listing: BookingListingSnippet
