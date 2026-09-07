export interface HostListing {
  id: number;
  host_id: number;
  title: string;
  description: string;
  city: string;
  country: string;
  latitude: number | null;
  longitude: number | null;
  price_per_night: number;
  cleaning_fee: number;
  max_guests: number;
  is_active: boolean;
  created_at: string;
  images: string[];
  amenities: string[];
  booking_count: number;
  total_revenue: number;
}

export interface HostListingCreate {
  host_id?: number;
  title: string;
  description: string;
  city: string;
  country: string;
  price_per_night: number;
  cleaning_fee: number;
  max_guests: number;
  latitude?: number | null;
  longitude?: number | null;
  images?: string[];
  amenities?: string[];
}

export interface HostListingUpdate {
  title?: string;
  description?: string;
  price_per_night?: number;
  cleaning_fee?: number;
  max_guests?: number;
  images?: string[];
  amenities?: string[];
}

export interface HostBooking {
  id: number;
  listing_id: number;
  listing_title: string;
  guest_id: number;
  guest_name: string;
  check_in: string;
  check_out: string;
  nights: number;
  total_price: number;
  created_at: string;
}
