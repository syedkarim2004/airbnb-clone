export interface BookingListingSnippet {
  id: number;
  title: string;
  city: string;
  country: string;
  image: string | null;
}

export interface BookingWithListing {
  id: number;
  listing_id: number;
  guest_id: number;
  check_in: string;
  check_out: string;
  nightly_rate: number;
  nights: number;
  cleaning_fee: number;
  service_fee: number;
  total_price: number;
  created_at: string;
  listing: BookingListingSnippet;
}

export interface BookingCreateRequest {
  listing_id: number;
  guest_id: number;
  check_in: string;
  check_out: string;
  guest_count: number;
}

export interface BookingResponse {
  id: number;
  listing_id: number;
  guest_id: number;
  check_in: string;
  check_out: string;
  nightly_rate: number;
  nights: number;
  cleaning_fee: number;
  service_fee: number;
  total_price: number;
  created_at: string;
}
