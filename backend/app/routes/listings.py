"""
Listing route handlers.

Thin route layer — defines HTTP endpoints, validates query parameters,
calls the service, and translates results into HTTP responses.
Contains no SQL and no business logic beyond input validation.
"""

from datetime import date
from typing import Optional

from fastapi import APIRouter, HTTPException, Query

from app.schemas.listing import ListingResponse, ListingsPageResponse
from app.services import listing_service, booking_service
from app.services.listing_service import SearchParams

router = APIRouter(prefix="/api/listings", tags=["listings"])


@router.get("", response_model=ListingsPageResponse)
def get_listings(
    city: Optional[str] = Query(default=None, description="Filter by city (case-insensitive)"),
    guests: Optional[int] = Query(default=None, description="Minimum guest capacity required"),
    min_price: Optional[float] = Query(default=None, description="Minimum nightly price (inclusive)"),
    max_price: Optional[float] = Query(default=None, description="Maximum nightly price (inclusive)"),
    check_in: Optional[date] = Query(default=None, description="Check-in date (YYYY-MM-DD)"),
    check_out: Optional[date] = Query(default=None, description="Check-out date (YYYY-MM-DD)"),
    page: int = Query(default=1, description="Page number (1-indexed)"),
    page_size: int = Query(default=12, description="Results per page (max 50)"),
):
    """
    Return a paginated list of active listings, with optional filters.

    All filters are optional and may be combined freely.
    Returns a JSON envelope with items, page metadata, and total count.
    """
    # ── Input validation ─────────────────────────────────────────────────────
    if guests is not None and guests < 1:
        raise HTTPException(status_code=400, detail="guests must be at least 1")

    if min_price is not None and min_price < 0:
        raise HTTPException(status_code=400, detail="min_price must be 0 or greater")

    if max_price is not None and max_price < 0:
        raise HTTPException(status_code=400, detail="max_price must be 0 or greater")

    if min_price is not None and max_price is not None and min_price > max_price:
        raise HTTPException(status_code=400, detail="min_price must not exceed max_price")

    if check_in is not None and check_out is None:
        raise HTTPException(status_code=400, detail="check_out is required when check_in is provided")

    if check_out is not None and check_in is None:
        raise HTTPException(status_code=400, detail="check_in is required when check_out is provided")

    if check_in is not None and check_out is not None and check_out <= check_in:
        raise HTTPException(status_code=400, detail="check_out must be after check_in")

    if page < 1:
        raise HTTPException(status_code=400, detail="page must be at least 1")

    if page_size < 1:
        raise HTTPException(status_code=400, detail="page_size must be at least 1")

    if page_size > 50:
        raise HTTPException(status_code=400, detail="page_size must not exceed 50")

    # ── Build service params and delegate ────────────────────────────────────
    params = SearchParams(
        city=city,
        guests=guests,
        min_price=min_price,
        max_price=max_price,
        check_in=check_in.isoformat() if check_in else None,
        check_out=check_out.isoformat() if check_out else None,
        page=page,
        page_size=page_size,
    )

    return listing_service.search_listings(params)


@router.get("/{listing_id}/availability")
def get_listing_availability(listing_id: int):
    """Return unavailable dates and booked ranges for a listing."""
    try:
        return booking_service.get_listing_availability(listing_id)
    except booking_service.BookingValidationError as e:
        raise HTTPException(status_code=e.status, detail=e.detail)


@router.get("/{listing_id}", response_model=ListingResponse)
def get_listing(listing_id: int):
    """Return a single active listing by ID."""
    listing = listing_service.get_active_listing_by_id(listing_id)
    if listing is None:
        raise HTTPException(status_code=404, detail="Listing not found")
    return listing

