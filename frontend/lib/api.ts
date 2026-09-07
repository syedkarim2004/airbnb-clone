/**
 * Central API client for frontend-to-backend communication.
 * Centralizes X-User-Id header handling and provides fully typed methods
 * for Listings, Bookings, Favorites, Reviews, and Host operations.
 */

import { Listing, ListingsPage } from "@/types/listing";
import { BookingCreateRequest, BookingResponse, BookingWithListing } from "@/types/booking";
import { FavoriteItem, FavoriteResponse } from "@/types/favorite";
import { Review, ReviewCreateRequest } from "@/types/review";
import { HostBooking, HostListing, HostListingCreate, HostListingUpdate } from "@/types/host";

export type { BookingCreateRequest, BookingResponse, BookingWithListing } from "@/types/booking";
export type { FavoriteItem, FavoriteResponse } from "@/types/favorite";
export type { Review, ReviewCreateRequest } from "@/types/review";
export type { HostBooking, HostListing, HostListingCreate, HostListingUpdate } from "@/types/host";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/**
 * Custom error class for API errors to make error handling clean and typed.
 */
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Internal helper for handling fetch requests, status codes, and mock auth headers.
 */
async function fetchJson<T>(
  endpoint: string,
  options?: RequestInit,
  userId?: number
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options?.headers as Record<string, string>) || {}),
  };

  if (userId !== undefined && userId !== null) {
    headers["X-User-Id"] = userId.toString();
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorDetail = `HTTP ${response.status}: ${response.statusText}`;
    try {
      const data = await response.json();
      if (data && typeof data.detail === "string") {
        errorDetail = data.detail;
      }
    } catch {
      // Body was not JSON; keep fallback status text
    }
    throw new ApiError(response.status, errorDetail);
  }

  return response.json() as Promise<T>;
}

// ── Listings ───────────────────────────────────────────────────────────────

export interface ListingSearchParams {
  city?: string;
  guests?: number;
  min_price?: number;
  max_price?: number;
  check_in?: string;
  check_out?: string;
  page?: number;
  page_size?: number;
}

export async function getListings(params?: ListingSearchParams): Promise<ListingsPage> {
  const query = new URLSearchParams();
  if (params) {
    if (params.city && params.city.trim()) query.set("city", params.city.trim());
    if (params.guests && params.guests > 0) query.set("guests", params.guests.toString());
    if (params.min_price !== undefined && params.min_price !== null && !isNaN(params.min_price)) {
      query.set("min_price", params.min_price.toString());
    }
    if (params.max_price !== undefined && params.max_price !== null && !isNaN(params.max_price)) {
      query.set("max_price", params.max_price.toString());
    }
    if (params.check_in) query.set("check_in", params.check_in);
    if (params.check_out) query.set("check_out", params.check_out);
    if (params.page) query.set("page", params.page.toString());
    if (params.page_size) query.set("page_size", params.page_size.toString());
  }
  const queryString = query.toString();
  const endpoint = queryString ? `/api/listings?${queryString}` : "/api/listings";
  return fetchJson<ListingsPage>(endpoint);
}

export async function getListing(id: number | string): Promise<Listing> {
  return fetchJson<Listing>(`/api/listings/${id}`);
}

// ── Bookings (My Trips) ───────────────────────────────────────────────────

export async function createBooking(
  data: BookingCreateRequest,
  userId?: number
): Promise<BookingResponse> {
  return fetchJson<BookingResponse>(
    "/api/bookings",
    {
      method: "POST",
      body: JSON.stringify(data),
    },
    userId ?? data.guest_id
  );
}

export async function getUserBookings(guestId: number): Promise<BookingWithListing[]> {
  return fetchJson<BookingWithListing[]>(`/api/bookings?guest_id=${guestId}`);
}

// ── Favorites ──────────────────────────────────────────────────────────────

export async function getFavorites(userId: number): Promise<FavoriteItem[]> {
  return fetchJson<FavoriteItem[]>(
    `/api/favorites?user_id=${userId}`,
    undefined,
    userId
  );
}

export async function checkFavorite(
  userId: number,
  listingId: number
): Promise<{ is_favorited: boolean }> {
  return fetchJson<{ is_favorited: boolean }>(
    `/api/favorites/check?user_id=${userId}&listing_id=${listingId}`,
    undefined,
    userId
  );
}

export async function addFavorite(
  userId: number,
  listingId: number
): Promise<FavoriteResponse> {
  return fetchJson<FavoriteResponse>(
    "/api/favorites",
    {
      method: "POST",
      body: JSON.stringify({ user_id: userId, listing_id: listingId }),
    },
    userId
  );
}

export async function removeFavorite(
  userId: number,
  listingId: number
): Promise<{ message: string }> {
  return fetchJson<{ message: string }>(
    `/api/favorites/${listingId}?user_id=${userId}`,
    { method: "DELETE" },
    userId
  );
}

// ── Reviews ────────────────────────────────────────────────────────────────

export async function getListingReviews(listingId: number): Promise<Review[]> {
  return fetchJson<Review[]>(`/api/reviews?listing_id=${listingId}`);
}

export async function createReview(
  userId: number,
  data: ReviewCreateRequest
): Promise<Review> {
  return fetchJson<Review>(
    "/api/reviews",
    {
      method: "POST",
      body: JSON.stringify({
        listing_id: data.listing_id,
        user_id: userId,
        rating: data.rating,
        comment: data.comment,
      }),
    },
    userId
  );
}

// ── Host Dashboard ─────────────────────────────────────────────────────────

export async function getHostListings(hostId: number): Promise<HostListing[]> {
  return fetchJson<HostListing[]>(
    `/api/host/listings?host_id=${hostId}`,
    undefined,
    hostId
  );
}

export async function createHostListing(
  hostId: number,
  data: HostListingCreate
): Promise<HostListing> {
  return fetchJson<HostListing>(
    "/api/host/listings",
    {
      method: "POST",
      body: JSON.stringify({ ...data, host_id: hostId }),
    },
    hostId
  );
}

export async function updateHostListing(
  hostId: number,
  listingId: number,
  data: HostListingUpdate
): Promise<HostListing> {
  return fetchJson<HostListing>(
    `/api/host/listings/${listingId}`,
    {
      method: "PATCH",
      body: JSON.stringify(data),
    },
    hostId
  );
}

export async function deleteHostListing(
  hostId: number,
  listingId: number
): Promise<HostListing> {
  return fetchJson<HostListing>(
    `/api/host/listings/${listingId}`,
    { method: "DELETE" },
    hostId
  );
}

export async function reactivateHostListing(
  hostId: number,
  listingId: number
): Promise<HostListing> {
  return fetchJson<HostListing>(
    `/api/host/listings/${listingId}/reactivate`,
    { method: "POST" },
    hostId
  );
}

export async function getHostBookings(hostId: number): Promise<HostBooking[]> {
  return fetchJson<HostBooking[]>(
    `/api/host/bookings?host_id=${hostId}`,
    undefined,
    hostId
  );
}

export async function getAmenities(): Promise<string[]> {
  return fetchJson<string[]>("/api/amenities");
}
