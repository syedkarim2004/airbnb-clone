/**
 * Lightweight listing snippet returned by GET /api/favorites.
 * The favorites endpoint only returns a subset of listing fields
 * (not the full Listing type, which requires amenities, host, images array etc.)
 */
export interface FavoriteListingSnippet {
  id: number;
  title: string;
  city: string;
  country: string;
  price_per_night: number;
  is_active: boolean;
  /** Single primary image URL (not an array) */
  image: string | null;
}

export interface FavoriteItem {
  id: number;
  user_id: number;
  listing_id: number;
  created_at: string;
  listing: FavoriteListingSnippet;
}

export interface FavoriteResponse {
  id: number;
  user_id: number;
  listing_id: number;
  created_at: string;
}
