"""
Review schemas — Pydantic models for the reviews API.
"""

from __future__ import annotations

from typing import Optional

from pydantic import BaseModel, Field


class ReviewCreateRequest(BaseModel):
    listing_id: int = Field(..., description="Listing being reviewed")
    user_id: Optional[int] = Field(default=None, description="User submitting the review (must match X-User-Id)")
    reviewer_id: Optional[int] = Field(default=None, description="User submitting the review (must match X-User-Id)")
    rating: int = Field(..., ge=1, le=5, description="Rating 1–5")
    comment: Optional[str] = Field(default=None, description="Optional written review")


class ReviewResponse(BaseModel):
    id: int
    listing_id: int
    user_id: int
    rating: int
    comment: Optional[str]
    reviewer_name: str
    created_at: str
