"""
Host schemas — Pydantic models for the host dashboard API.
"""

from __future__ import annotations

from typing import Optional

from pydantic import BaseModel, Field


class HostListingCreateRequest(BaseModel):
    host_id: int = Field(..., description="Host creating the listing (must match X-User-Id header)")
    title: str = Field(..., min_length=5, max_length=200)
    description: str = Field(..., min_length=10)
    city: str = Field(..., min_length=1, max_length=100)
    country: str = Field(..., min_length=1, max_length=100)
    price_per_night: float = Field(..., gt=0)
    cleaning_fee: float = Field(default=0, ge=0)
    max_guests: int = Field(..., ge=1, le=50)
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    images: list[str] = Field(default_factory=list, description="List of image URLs in order")
    amenities: list[str] = Field(default_factory=list, description="List of amenity names")


class HostListingUpdateRequest(BaseModel):
    title: Optional[str] = Field(default=None, min_length=5, max_length=200)
    description: Optional[str] = Field(default=None, min_length=10)
    price_per_night: Optional[float] = Field(default=None, gt=0)
    cleaning_fee: Optional[float] = Field(default=None, ge=0)
    max_guests: Optional[int] = Field(default=None, ge=1, le=50)
    images: Optional[list[str]] = Field(default=None, description="Updated list of image URLs")
    amenities: Optional[list[str]] = Field(default=None, description="Updated list of amenity names")


class HostListingResponse(BaseModel):
    id: int
    host_id: int
    title: str
    description: str
    city: str
    country: str
    latitude: Optional[float]
    longitude: Optional[float]
    price_per_night: float
    cleaning_fee: float
    max_guests: int
    is_active: bool
    created_at: str
    images: list[str]
    amenities: list[str]
    booking_count: int
    total_revenue: float


class HostBookingResponse(BaseModel):
    id: int
    listing_id: int
    listing_title: str
    guest_id: int
    guest_name: str
    check_in: str
    check_out: str
    nights: int
    total_price: float
    created_at: str
