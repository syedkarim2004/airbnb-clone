/**
 * Isolated frontend mock data for Airbnb Experiences.
 * Used strictly for UI demonstration on the Experiences tab.
 * Does NOT originate from or affect the SQLite backend.
 */

export interface Experience {
  id: string;
  title: string;
  location: string;
  timeBadge: string;
  pricePerGuest: number;
  rating: number;
  reviewCount: number;
  image: string;
  section: "today" | "tomorrow" | "popular";
}

export const MOCK_EXPERIENCES: Experience[] = [
  {
    id: "exp-1",
    title: "Old Delhi Food-Temples-Spice Market & Rickshaw",
    location: "New Delhi, India",
    timeBadge: "3:30 pm",
    pricePerGuest: 48,
    rating: 5.0,
    reviewCount: 342,
    image: "https://images.unsplash.com/photo-1596178065887-1198b6148b2b",
    section: "today",
  },
  {
    id: "exp-2",
    title: "Old Delhi Street Food Spice Market & Heritage Walk",
    location: "New Delhi, India",
    timeBadge: "5 pm",
    pricePerGuest: 35,
    rating: 5.0,
    reviewCount: 189,
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc",
    section: "today",
  },
  {
    id: "exp-3",
    title: "Old Delhi: Hidden Gems with Local's Life & Tuk-Tuk",
    location: "New Delhi, India",
    timeBadge: "4 pm",
    pricePerGuest: 42,
    rating: 5.0,
    reviewCount: 215,
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa",
    section: "today",
  },
  {
    id: "exp-4",
    title: "Hands-on Indian Cooking in a Real Indian Home",
    location: "New Delhi, India",
    timeBadge: "4:30 pm",
    pricePerGuest: 58,
    rating: 5.0,
    reviewCount: 412,
    image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d",
    section: "today",
  },
  {
    id: "exp-5",
    title: "Handblock Printing Workshop in Heritage Haveli",
    location: "Jaipur / Delhi, India",
    timeBadge: "6 pm",
    pricePerGuest: 72,
    rating: 4.9,
    reviewCount: 98,
    image: "https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2",
    section: "today",
  },
  {
    id: "exp-6",
    title: "A Mughal Evening in a 19th-Century UNESCO Haveli",
    location: "Old Delhi, India",
    timeBadge: "7 pm",
    pricePerGuest: 65,
    rating: 4.8,
    reviewCount: 140,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945",
    section: "today",
  },
  {
    id: "exp-7",
    title: "Sunrise Taj Mahal Tour with Professional Guide",
    location: "Agra, India",
    timeBadge: "5:30 am",
    pricePerGuest: 85,
    rating: 5.0,
    reviewCount: 520,
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523",
    section: "tomorrow",
  },
  {
    id: "exp-8",
    title: "Heritage Walk around India Gate & Lodhi Art District",
    location: "New Delhi, India",
    timeBadge: "8:30 am",
    pricePerGuest: 30,
    rating: 4.9,
    reviewCount: 88,
    image: "https://images.unsplash.com/photo-1587474260584-136574528ed5",
    section: "tomorrow",
  },
  {
    id: "exp-9",
    title: "Morning Yoga & Meditation by the Ganges",
    location: "Rishikesh, India",
    timeBadge: "6:30 am",
    pricePerGuest: 25,
    rating: 5.0,
    reviewCount: 310,
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773",
    section: "tomorrow",
  },
  {
    id: "exp-10",
    title: "Paris Pastry & Macaron Masterclass in Montmartre",
    location: "Paris, France",
    timeBadge: "10 am",
    pricePerGuest: 90,
    rating: 5.0,
    reviewCount: 640,
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff",
    section: "tomorrow",
  },
];
