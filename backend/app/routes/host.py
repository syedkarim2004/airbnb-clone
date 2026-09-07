"""
Host dashboard route handlers.

MOCK AUTHENTICATION (permitted by assignment):
  The current user's ID is passed via the X-User-Id header.
  The service independently verifies:
    - The user exists and has role 'host' or 'both'.
    - For mutations: listing.host_id == current_user.id.
  This is NOT real authentication — it is a development mechanism.
"""

from __future__ import annotations

from fastapi import APIRouter, Header, HTTPException, Path, Query

from app.schemas.host import (
    HostBookingResponse,
    HostListingCreateRequest,
    HostListingResponse,
    HostListingUpdateRequest,
)
from app.services.host_service import (
    HostError,
    create_listing,
    deactivate_listing,
    get_host_bookings,
    get_host_listings,
    reactivate_listing,
    update_listing,
)

router = APIRouter(prefix="/api/host", tags=["host"])


def _get_host_id_header(x_user_id: str | None) -> int:
    """Extract and validate the X-User-Id header (mock auth)."""
    if not x_user_id:
        raise HTTPException(status_code=401, detail="X-User-Id header is required")
    try:
        return int(x_user_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="X-User-Id must be an integer")


@router.get("/listings", response_model=list[HostListingResponse])
def get_my_listings(
    host_id: int = Query(..., description="Host user ID"),
    x_user_id: str | None = Header(default=None),
):
    """
    Return all listings (active and inactive) owned by this host.
    Includes booking counts and total revenue per listing.
    """
    current_uid = _get_host_id_header(x_user_id)
    if current_uid != host_id:
        raise HTTPException(status_code=403, detail="X-User-Id must match host_id")
    try:
        return get_host_listings(host_id)
    except HostError as exc:
        raise HTTPException(status_code=exc.status, detail=exc.detail)


@router.post("/listings", response_model=HostListingResponse, status_code=201)
def post_listing(
    body: HostListingCreateRequest,
    x_user_id: str | None = Header(default=None),
):
    """
    Create a new listing for the host.

    Returns 201 with the new listing on success.
    """
    current_uid = _get_host_id_header(x_user_id)
    if current_uid != body.host_id:
        raise HTTPException(
            status_code=403,
            detail="X-User-Id must match host_id in request body",
        )
    try:
        return create_listing(
            host_id=body.host_id,
            title=body.title,
            description=body.description,
            city=body.city,
            country=body.country,
            price_per_night=body.price_per_night,
            cleaning_fee=body.cleaning_fee,
            max_guests=body.max_guests,
            latitude=body.latitude,
            longitude=body.longitude,
            images=body.images,
            amenities=body.amenities,
        )
    except HostError as exc:
        raise HTTPException(status_code=exc.status, detail=exc.detail)


@router.patch("/listings/{listing_id}", response_model=HostListingResponse)
def patch_listing(
    body: HostListingUpdateRequest,
    listing_id: int = Path(..., description="Listing ID to update"),
    x_user_id: str | None = Header(default=None),
):
    """
    Partially update a listing. Only provided fields are changed.

    Returns 403 if the listing belongs to a different host.
    """
    current_uid = _get_host_id_header(x_user_id)
    try:
        return update_listing(
            listing_id=listing_id,
            host_id=current_uid,
            title=body.title,
            description=body.description,
            price_per_night=body.price_per_night,
            cleaning_fee=body.cleaning_fee,
            max_guests=body.max_guests,
            images=body.images,
            amenities=body.amenities,
        )
    except HostError as exc:
        raise HTTPException(status_code=exc.status, detail=exc.detail)


@router.delete("/listings/{listing_id}", response_model=HostListingResponse)
def delete_listing(
    listing_id: int = Path(..., description="Listing ID to deactivate"),
    x_user_id: str | None = Header(default=None),
):
    """
    Soft-delete a listing (sets is_active = 0).

    The listing row, all bookings, and all price snapshots are preserved.
    The listing will no longer appear in public search results.
    Returns 403 if the listing belongs to a different host.
    """
    current_uid = _get_host_id_header(x_user_id)
    try:
        return deactivate_listing(listing_id=listing_id, host_id=current_uid)
    except HostError as exc:
        raise HTTPException(status_code=exc.status, detail=exc.detail)


@router.post("/listings/{listing_id}/reactivate", response_model=HostListingResponse)
def post_reactivate_listing(
    listing_id: int = Path(..., description="Listing ID to reactivate"),
    x_user_id: str | None = Header(default=None),
):
    """Re-activate a previously soft-deleted listing."""
    current_uid = _get_host_id_header(x_user_id)
    try:
        return reactivate_listing(listing_id=listing_id, host_id=current_uid)
    except HostError as exc:
        raise HTTPException(status_code=exc.status, detail=exc.detail)


@router.get("/bookings", response_model=list[HostBookingResponse])
def get_my_bookings(
    host_id: int = Query(..., description="Host user ID"),
    x_user_id: str | None = Header(default=None),
):
    """
    Return all bookings on the host's listings, ordered by check-in date descending.
    Includes listing title and guest name.
    """
    current_uid = _get_host_id_header(x_user_id)
    if current_uid != host_id:
        raise HTTPException(status_code=403, detail="X-User-Id must match host_id")
    try:
        return get_host_bookings(host_id)
    except HostError as exc:
        raise HTTPException(status_code=exc.status, detail=exc.detail)
