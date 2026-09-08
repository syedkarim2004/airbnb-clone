"""
Pydantic response models for listing API endpoints.

These define the API contract — what the client receives.
They do NOT mirror the database schema directly.
"""

from pydantic import BaseModel


class HostResponse(BaseModel):
    """Public host information."""
    id: int | None = None
    name: str


class ListingResponse(BaseModel):
    """Full listing representation returned by the API."""
    id: int
    title: str
    description: str
    city: str
    country: str
    latitude: float | None
    longitude: float | None
    price_per_night: float
    cleaning_fee: float
    max_guests: int
    rating_avg: float | None
    review_count: int
    host: HostResponse
    host_id: int | None = None
    host_name: str | None = None
    images: list[str]
    amenities: list[str]


class ListingsPageResponse(BaseModel):
    """Paginated response envelope for the listings collection endpoint."""
    items: list[ListingResponse]
    page: int
    page_size: int
    total: int
    total_pages: int
