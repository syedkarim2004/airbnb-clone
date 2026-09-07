/**
 * Isolated frontend mock data for Airbnb Services.
 * Used strictly for UI demonstration on the Services tab.
 * Does NOT originate from or affect the SQLite backend.
 */

export interface ServiceItem {
  id: string;
  title: string;
  category: "Photography" | "Training" | "Chef" | "Wellness";
  provider: string;
  priceDisplay: string;
  rating: number;
  image: string;
}

export const MOCK_SERVICES: ServiceItem[] = [
  // Photography
  {
    id: "srv-1",
    title: "New Delhi Photo Session by a Professional Portrait Artist",
    category: "Photography",
    provider: "Aarushi",
    priceDisplay: "From $105 / guest",
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
  },
  {
    id: "srv-2",
    title: "Editorial Love Stories & Romantic Couple Sessions",
    category: "Photography",
    provider: "Rishab",
    priceDisplay: "From $120 / guest",
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1519741497674-611481863552",
  },
  {
    id: "srv-3",
    title: "Candid Travel Portraits across Monuments & Old Bazaars",
    category: "Photography",
    provider: "Anurag",
    priceDisplay: "From $95 / guest",
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32",
  },
  {
    id: "srv-4",
    title: "Artful City Portraits with Natural Architectural Light",
    category: "Photography",
    provider: "Ashish",
    priceDisplay: "From $115 / group",
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
  },
  {
    id: "srv-5",
    title: "Intimate Cinematic Aesthetic Photos in Heritage Spots",
    category: "Photography",
    provider: "Bugzy",
    priceDisplay: "From $70 / group",
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4",
  },
  {
    id: "srv-6",
    title: "Paris Fashion & Portrait Photography in Le Marais",
    category: "Photography",
    provider: "Camille",
    priceDisplay: "From $130 / guest",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34",
  },

  // Training & Wellness
  {
    id: "srv-7",
    title: "Personalized Strength, Mobility & Calisthenics Coaching",
    category: "Training",
    provider: "Devendra",
    priceDisplay: "From $50 / session",
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd",
  },
  {
    id: "srv-8",
    title: "Private Yoga, Pranayama & Meditation in the Garden",
    category: "Wellness",
    provider: "Pooja",
    priceDisplay: "From $40 / session",
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597",
  },
  {
    id: "srv-9",
    title: "Tibetan Singing Bowl Sound Bath & Energy Healing",
    category: "Wellness",
    provider: "Tenzin",
    priceDisplay: "From $65 / person",
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773",
  },
  {
    id: "srv-10",
    title: "Private Chef: 5-Course Royal Mughlai Dinner at Home",
    category: "Chef",
    provider: "Chef Karim",
    priceDisplay: "From $85 / guest",
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5",
  },
];
