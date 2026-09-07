"""
Favorites route handlers.

MOCK AUTHENTICATION (permitted by assignment):
  The current user's ID is passed via the X-User-Id header.
  The service layer independently verifies the user exists.
  This is NOT real authentication — it is a development mechanism.
"""

from __future__ import annotations

from fastapi import APIRouter, Header, HTTPException, Path, Query

from app.schemas.favorite import FavoriteCreateRequest, FavoriteResponse
from app.services.favorite_service import FavoriteError, add_favorite, get_user_favorites, is_favorited, remove_favorite

router = APIRouter(prefix="/api/favorites", tags=["favorites"])


def _get_user_id_header(x_user_id: str | None) -> int:
    """Extract and validate the X-User-Id header (mock auth)."""
    if not x_user_id:
        raise HTTPException(status_code=401, detail="X-User-Id header is required")
    try:
        uid = int(x_user_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="X-User-Id must be an integer")
    return uid


@router.get("", response_model=list[dict])
def get_favorites(
    user_id: int = Query(..., description="Return favorites for this user ID"),
    x_user_id: str | None = Header(default=None),
):
    """
    Return all favorited listings for a user.

    Requires X-User-Id header matching the requested user_id.
    """
    current_uid = _get_user_id_header(x_user_id)
    if current_uid != user_id:
        raise HTTPException(status_code=403, detail="You can only view your own favorites")
    try:
        return get_user_favorites(user_id)
    except FavoriteError as exc:
        raise HTTPException(status_code=exc.status, detail=exc.detail)


@router.get("/check", response_model=dict)
def check_favorite(
    user_id: int = Query(...),
    listing_id: int = Query(...),
    x_user_id: str | None = Header(default=None),
):
    """Check if a specific listing is favorited by the user."""
    current_uid = _get_user_id_header(x_user_id)
    if current_uid != user_id:
        raise HTTPException(status_code=403, detail="You can only check your own favorites")
    return {"is_favorited": is_favorited(user_id, listing_id)}


@router.post("", response_model=FavoriteResponse, status_code=201)
def post_favorite(
    body: FavoriteCreateRequest,
    x_user_id: str | None = Header(default=None),
):
    """
    Add a listing to the current user's favorites. Idempotent.

    Returns 201 on new addition, or the existing row if already favorited.
    """
    current_uid = _get_user_id_header(x_user_id)
    if current_uid != body.user_id:
        raise HTTPException(
            status_code=403,
            detail="X-User-Id must match user_id in request body",
        )
    try:
        result = add_favorite(body.user_id, body.listing_id)
        return result
    except FavoriteError as exc:
        raise HTTPException(status_code=exc.status, detail=exc.detail)


@router.delete("/{listing_id}", status_code=200)
def delete_favorite(
    listing_id: int = Path(..., description="Listing ID to remove from favorites"),
    user_id: int = Query(..., description="User removing the favorite"),
    x_user_id: str | None = Header(default=None),
):
    """
    Remove a listing from favorites.

    Returns 200 with a confirmation message. Returns 404 if not favorited.
    """
    current_uid = _get_user_id_header(x_user_id)
    if current_uid != user_id:
        raise HTTPException(
            status_code=403,
            detail="X-User-Id must match user_id query parameter",
        )
    deleted = remove_favorite(user_id, listing_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Favorite not found")
    return {"message": "Removed from favorites"}
