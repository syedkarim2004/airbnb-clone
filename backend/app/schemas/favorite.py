"""
Favorite schemas — Pydantic models for the favorites API.
"""

from __future__ import annotations

from pydantic import BaseModel, Field


class FavoriteCreateRequest(BaseModel):
    user_id: int = Field(..., description="ID of the user adding the favorite")
    listing_id: int = Field(..., description="ID of the listing to favorite")


class FavoriteResponse(BaseModel):
    id: int
    user_id: int
    listing_id: int
    created_at: str
