/**
 * TypeScript type definitions for the Listings API.
 * Accurately mirrors the backend Pydantic models (HostResponse, ListingResponse).
 */

export interface Host {
  id?: number;
  name: string;
}

export interface Listing {
  id: number;
  title: string;
  description: string;
  city: string;
  country: string;
  latitude: number | null;
  longitude: number | null;
  price_per_night: number;
  cleaning_fee: number;
  max_guests: number;
  rating_avg: number | null;
  review_count: number;
  host: Host;
  host_id?: number;
  host_name?: string;
  images: string[];
  amenities: string[];
}

export interface ListingAvailability {
  listing_id: number;
  unavailable_dates: string[];
  booked_ranges: Array<{ check_in: string; check_out: string }>;
}

/**
 * Paginated response envelope returned by GET /api/listings.
 * Mirrors backend ListingsPageResponse.
 */
export interface ListingsPage {
  items: Listing[];
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
}

/**
 * Conceptual type representing an image entity.
 * Note: The API returns listing images as an array of URL strings (images: string[]).
 */
export interface ListingImage {
  id?: number;
  url: string;
  caption?: string | null;
  position?: number;
}

/**
 * Conceptual type representing an amenity entity.
 * Note: The API returns amenities as an array of name strings (amenities: string[]).
 */
export interface Amenity {
  id?: number;
  name: string;
}
