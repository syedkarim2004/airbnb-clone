"""
Reviews route handlers.

MOCK AUTHENTICATION (permitted by assignment):
  The current user's ID is passed via the X-User-Id header.
  The service verifies the user exists and has a qualifying booking.
  This is NOT real authentication — it is a development mechanism.
"""

from __future__ import annotations

from fastapi import APIRouter, Header, HTTPException, Query

from app.schemas.review import ReviewCreateRequest, ReviewResponse
from app.services.review_service import ReviewError, create_review, get_listing_reviews

router = APIRouter(prefix="/api/reviews", tags=["reviews"])


def _get_user_id_header(x_user_id: str | None) -> int:
    """Extract and validate the X-User-Id header (mock auth)."""
    if not x_user_id:
        raise HTTPException(status_code=401, detail="X-User-Id header is required")
    try:
        return int(x_user_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="X-User-Id must be an integer")


@router.get("", response_model=list[ReviewResponse])
def get_reviews(
    listing_id: int = Query(..., description="Return reviews for this listing ID"),
):
    """
    Return all reviews for a listing, newest-first.

    This endpoint is public — no authentication required.
    """
    try:
        return get_listing_reviews(listing_id)
    except ReviewError as exc:
        raise HTTPException(status_code=exc.status, detail=exc.detail)


@router.post("", response_model=ReviewResponse, status_code=201)
def post_review(
    body: ReviewCreateRequest,
    x_user_id: str | None = Header(default=None),
):
    """
    Submit a review for a listing.

    Requires X-User-Id header matching body.reviewer_id.
    The user must have a qualifying booking for the listing.
    Duplicate reviews from the same user for the same listing are rejected (409).
    """
    current_uid = _get_user_id_header(x_user_id)
    body_uid = body.user_id if body.user_id is not None else body.reviewer_id
    if body_uid is not None and current_uid != body_uid:
        raise HTTPException(
            status_code=403,
            detail="X-User-Id must match user_id in request body",
        )
    try:
        return create_review(
            listing_id=body.listing_id,
            reviewer_id=current_uid,
            rating=body.rating,
            comment=body.comment,
        )
    except ReviewError as exc:
        raise HTTPException(status_code=exc.status, detail=exc.detail)
