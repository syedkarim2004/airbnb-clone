export interface Review {
  id: number;
  listing_id: number;
  user_id: number;
  rating: number;
  comment: string | null;
  reviewer_name: string;
  created_at: string;
}

export interface ReviewCreateRequest {
  listing_id: number;
  user_id?: number;
  reviewer_id?: number;
  rating: number;
  comment?: string;
}
