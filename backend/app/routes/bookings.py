"""
Booking route handlers.

Thin layer: HTTP parameter extraction, input format validation,
service delegation, error translation.
No SQL here.
"""

from __future__ import annotations

from typing import Optional

from fastapi import APIRouter, HTTPException, Query

from app.schemas.booking import (
    BookingCreateRequest,
    BookingResponse,
    BookingWithListingResponse,
)
from app.services.booking_service import BookingValidationError, create_booking, get_guest_bookings

router = APIRouter(prefix="/api/bookings", tags=["bookings"])


@router.post("", response_model=BookingResponse, status_code=201)
def post_booking(body: BookingCreateRequest):
    """
    Create a new booking.

    Returns 201 on success.
    Returns 400 for invalid input or business-rule violations.
    Returns 404 if listing or guest not found.
    Returns 409 if dates conflict with an existing booking.
    """
    try:
        result = create_booking(
            listing_id=body.listing_id,
            guest_id=body.guest_id,
            check_in=body.check_in,
            check_out=body.check_out,
            guest_count=body.guest_count,
        )
        return result
    except BookingValidationError as exc:
        raise HTTPException(status_code=exc.status, detail=exc.detail)


@router.get("", response_model=list[BookingWithListingResponse])
def get_bookings(guest_id: int = Query(..., description="Return bookings for this guest user ID")):
    """
    Return all bookings for a guest (My Trips).

    Ordered by check_in DESC (newest first).
    Each booking includes a listing snippet (title, city, first image).
    """
    try:
        return get_guest_bookings(guest_id)
    except BookingValidationError as exc:
        raise HTTPException(status_code=exc.status, detail=exc.detail)
