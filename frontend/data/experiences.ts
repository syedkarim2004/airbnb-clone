/**
 * Comprehensive dataset for Airbnb Experiences & Services.
 * Fully structured to match Airbnb reference screenshots from top to bottom.
 */

export interface ExperienceHost {
  name: string;
  avatar: string;
  role: string;
  description: string;
  joinedYear?: number;
}

export interface ActivityStep {
  title: string;
  description: string;
  image: string;
}

export interface TimeSlot {
  date: string;
  time: string;
  availableSpots: number;
  totalSpots: number;
}

export interface ExperienceReview {
  id: string;
  author: string;
  location: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Qualification {
  icon: string;
  title: string;
  description: string;
}

export interface ThingToKnow {
  icon: string;
  title: string;
  description: string;
}

export interface RelatedOffering {
  title: string;
  price: string;
  duration: string;
  image: string;
}

export interface Experience {
  id: string;
  title: string;
  tagline: string;
  description: string;
  location: string;
  neighborhood: string;
  city: string;
  country: string;
  category: string;
  providerInfo: string;
  locationText: string;
  pricePerGuest: number;
  priceUnit: "group" | "guest";
  currency: string;
  rating: number;
  reviewCount: number;
  duration: string;
  language: string;
  meetingPoint: string;
  meetingCoordinates: { lat: number; lng: number };
  whatIsIncluded: string[];
  guestCapacity: number;
  heroImage: string;
  images: string[];
  host: ExperienceHost;
  whatYoullDo: ActivityStep[];
  qualifications: Qualification[];
  portfolioImages: string[];
  serviceArea: string;
  serviceMapCenter?: { lat: number; lng: number };
  thingsToKnow: ThingToKnow[];
  availabilitySlots: TimeSlot[];
  reviews: ExperienceReview[];
  relatedOfferings?: RelatedOffering[];
  section: "photography" | "training" | "today" | "popular" | "food" | "culture" | "adventure" | "delhi" | "worldwide";
}

export const EXPERIENCES_DATA: Experience[] = [
  {
    "id": "1",
    "title": "Intimate candid aesthetic photos in Delhi by bugzy",
    "tagline": "Real moments, genuine love, and timeless aesthetic portraits in Delhi.",
    "description": "I love, love. To capture real moments for people, be it couple, family, solo is what brings me happiness. let's Make delhi your backdrop. This listing is to meet people from around the country/world.",
    "location": "Delhi, India",
    "neighborhood": "South Delhi & Old Delhi",
    "city": "New Delhi",
    "country": "India",
    "category": "Photography",
    "providerInfo": "Photographer in Delhi",
    "locationText": "Provided at your home",
    "pricePerGuest": 5000,
    "priceUnit": "group",
    "currency": "\u20b9",
    "rating": 5.0,
    "reviewCount": 2,
    "duration": "1\u20132 hours",
    "language": "Hosted in English and Hindi",
    "meetingPoint": "At your home, hotel, or iconic heritage backdrop in Delhi",
    "meetingCoordinates": {
      "lat": 28.6139,
      "lng": 77.209
    },
    "whatIsIncluded": [
      "35+ high-resolution edited photos",
      "Color graded online gallery",
      "Wardrobe and styling guidance",
      "Same-week delivery"
    ],
    "guestCapacity": 6,
    "heroImage": "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=1200&q=80",
    "images": [
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80"
    ],
    "host": {
      "name": "Bhagyashree",
      "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80",
      "role": "Photographer",
      "description": "Delhi-based visual artist specializing in intimate candid portraits, cinematic frames, and honest emotion.",
      "joinedYear": 2014
    },
    "qualifications": [
      {
        "icon": "camera",
        "title": "12 years of experience",
        "description": "I have lead a photography team for 13 years"
      },
      {
        "icon": "star",
        "title": "Career highlight",
        "description": "Featured in many blogs and competitions"
      },
      {
        "icon": "graduation",
        "title": "Education and training",
        "description": "I have participated and conducted various photography courses, workshops."
      }
    ],
    "portfolioImages": [
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80"
    ],
    "serviceArea": "Delhi National Capital Region",
    "serviceMapCenter": {
      "lat": 28.6139,
      "lng": 77.209
    },
    "thingsToKnow": [
      {
        "icon": "users",
        "title": "Guest requirements",
        "description": "Guests aged 18 and up can attend."
      },
      {
        "icon": "accessibility",
        "title": "Accessibility",
        "description": "Message your host for details. Learn more"
      },
      {
        "icon": "backpack",
        "title": "What to bring",
        "description": "Preferred wardrobe outfits, personal props, and comfortable walking shoes."
      },
      {
        "icon": "shield",
        "title": "Cancellation policy",
        "description": "Free cancellation up to 24 hours before start time."
      }
    ],
    "whatYoullDo": [
      {
        "title": "Style Consultation & Vibe Check",
        "description": "We will chat about the mood, aesthetic, and color palette you want for your session over coffee or tea.",
        "image": "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80"
      },
      {
        "title": "Candid Golden Hour Walk",
        "description": "We explore scenic architectural corners, heritage arches, or your cozy home space with natural lighting.",
        "image": "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=600&q=80"
      },
      {
        "title": "Intimate & Creative Frames",
        "description": "I guide you through effortless poses that feel completely organic, laughter-filled, and deeply personal.",
        "image": "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80"
      }
    ],
    "availabilitySlots": [
      {
        "date": "Tomorrow, 8 September",
        "time": "1:00\u20134:00 pm",
        "availableSpots": 10,
        "totalSpots": 10
      },
      {
        "date": "Tomorrow, 8 September",
        "time": "2:00\u20135:00 pm",
        "availableSpots": 10,
        "totalSpots": 10
      },
      {
        "date": "Wednesday, 9 September",
        "time": "1:00\u20134:00 pm",
        "availableSpots": 10,
        "totalSpots": 10
      },
      {
        "date": "Wednesday, 9 September",
        "time": "4:00\u20137:00 pm",
        "availableSpots": 8,
        "totalSpots": 10
      },
      {
        "date": "Thursday, 10 September",
        "time": "2:00\u20135:00 pm",
        "availableSpots": 10,
        "totalSpots": 10
      }
    ],
    "reviews": [
      {
        "id": "rev-101",
        "author": "Udit",
        "location": "New Delhi, India",
        "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
        "rating": 5,
        "date": "July 2026",
        "comment": "Booked Bugzy for my daughter's first ever photoshoot and honestly it was the best decision ever. Bugzy handled my daughter with so much kindness and care , she thoroughly enjoyed getting clicked. And the photos turned out magical!"
      },
      {
        "id": "rev-102",
        "author": "Rishabh",
        "location": "New Delhi, India",
        "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
        "rating": 5,
        "date": "May 2026",
        "comment": "I got my couple shoot done by Bugzy and I'm glad I found her to be my photographer. She is genuinely amazing! Not only has she taken photographs that we will cherish for a lifetime, she gave us a memorable experience."
      }
    ],
    "relatedOfferings": [
      {
        "title": "Express photoshoot for tourists",
        "price": "\u20b95,000 / group",
        "duration": "1 hr",
        "image": "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80"
      },
      {
        "title": "Aesthetic coupleshoot @Delhi",
        "price": "\u20b912,000 / group",
        "duration": "2 hrs",
        "image": "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=400&q=80"
      },
      {
        "title": "Life around babies",
        "price": "\u20b915,000 / group",
        "duration": "3 hrs",
        "image": "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80"
      }
    ],
    "section": "photography"
  },
  {
    "id": "2",
    "title": "Editorial love stories by Rishab",
    "tagline": "Vogue-style couples & editorial portraits across heritage Mughal monuments.",
    "description": "Step into a magazine-worthy editorial photoshoot. We craft cinematic narratives celebrating romance, royal heritage architecture, and delicate light across Delhi's greatest monuments.",
    "location": "New Delhi, India",
    "neighborhood": "Lodhi Estate & Humayun Tomb",
    "city": "New Delhi",
    "country": "India",
    "category": "Photography",
    "providerInfo": "Fashion & Editorial Photographer",
    "locationText": "On-location heritage monuments",
    "pricePerGuest": 10000,
    "priceUnit": "guest",
    "currency": "\u20b9",
    "rating": 5.0,
    "reviewCount": 48,
    "duration": "2 hours",
    "language": "Hosted in English and Hindi",
    "meetingPoint": "Main Gate, Humayun's Tomb, Nizamuddin East",
    "meetingCoordinates": {
      "lat": 28.5933,
      "lng": 77.2507
    },
    "whatIsIncluded": [
      "40 retouched editorial frames",
      "Color grade & monochrome collection",
      "Monument permit assistance",
      "Express 48-hour delivery"
    ],
    "guestCapacity": 4,
    "heroImage": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80",
    "images": [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80"
    ],
    "host": {
      "name": "Rishab",
      "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
      "role": "Editorial Photographer",
      "description": "Former fashion magazine photographer now capturing soulful couple stories in timeless frames.",
      "joinedYear": 2016
    },
    "qualifications": [
      {
        "icon": "camera",
        "title": "10 years in fashion & portraiture",
        "description": "Featured in Harper's Bazaar India and Vogue Weddings."
      },
      {
        "icon": "award",
        "title": "Sony Artisan of Imagery",
        "description": "Recipient of Indian Photography Awards 2024."
      },
      {
        "icon": "graduation",
        "title": "National Institute of Design",
        "description": "Masters in Visual Communication and Photography."
      }
    ],
    "portfolioImages": [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=600&q=80"
    ],
    "serviceArea": "Central & South Delhi Heritage Enclaves",
    "serviceMapCenter": {
      "lat": 28.5933,
      "lng": 77.2507
    },
    "thingsToKnow": [
      {
        "icon": "users",
        "title": "Guest requirements",
        "description": "Couples, solo travelers, and creative duos welcome."
      },
      {
        "icon": "backpack",
        "title": "What to bring",
        "description": "Two outfit options (ethnic or modern formal recommended)."
      },
      {
        "icon": "shield",
        "title": "Cancellation policy",
        "description": "Free cancellation up to 48 hours prior."
      }
    ],
    "whatYoullDo": [
      {
        "title": "Wardrobe Selection",
        "description": "Quick check of jewelry and matching tones with monuments.",
        "image": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80"
      },
      {
        "title": "Mughal Pavilions Shoot",
        "description": "Intricate stone jaalis and symmetrical gardens.",
        "image": "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80"
      }
    ],
    "availabilitySlots": [
      {
        "date": "Tomorrow, 8 September",
        "time": "6:30\u20138:30 am",
        "availableSpots": 4,
        "totalSpots": 4
      },
      {
        "date": "Tomorrow, 8 September",
        "time": "4:30\u20136:30 pm",
        "availableSpots": 2,
        "totalSpots": 4
      }
    ],
    "reviews": [
      {
        "id": "rev-201",
        "author": "Ananya",
        "location": "Mumbai, India",
        "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
        "rating": 5,
        "date": "August 2026",
        "comment": "Rishab made us feel like royalty! The photos look straight out of a couture catalogue."
      }
    ],
    "section": "photography"
  },
  {
    "id": "3",
    "title": "Candid travel portraits by Anurag",
    "tagline": "Vibrant street life, Old Delhi spice alleyways, and authentic portraits.",
    "description": "Explore the vibrant chaos of Shahjahanabad through the eyes of a street documentary photographer. Capture raw, cinematic candid moments amidst old spice markets and historic havelis.",
    "location": "Old Delhi, India",
    "neighborhood": "Chandni Chowk",
    "city": "New Delhi",
    "country": "India",
    "category": "Photography",
    "providerInfo": "Street Documentary Photographer",
    "locationText": "Historic Old Delhi routes",
    "pricePerGuest": 8000,
    "priceUnit": "guest",
    "currency": "\u20b9",
    "rating": 5.0,
    "reviewCount": 62,
    "duration": "2.5 hours",
    "language": "Hosted in English, Hindi, and Punjabi",
    "meetingPoint": "Town Hall, Chandni Chowk Metro Gate 3",
    "meetingCoordinates": {
      "lat": 28.6562,
      "lng": 77.23
    },
    "whatIsIncluded": [
      "50 high-res edited street portraits",
      "Old Delhi street tea and jalebi",
      "Secret rooftop access"
    ],
    "guestCapacity": 5,
    "heroImage": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80",
    "images": [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80"
    ],
    "host": {
      "name": "Anurag",
      "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
      "role": "Street Photographer",
      "description": "Born and raised in Old Delhi, capturing its soul through Leica and Fuji glass.",
      "joinedYear": 2018
    },
    "qualifications": [
      {
        "icon": "camera",
        "title": "National Geographic Traveler contributor",
        "description": "Published across leading global publications."
      },
      {
        "icon": "star",
        "title": "Over 500 happy photo walks",
        "description": "Top-rated Airbnb Experience host since 2018."
      }
    ],
    "portfolioImages": [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80"
    ],
    "serviceArea": "Old Delhi & Walled City",
    "serviceMapCenter": {
      "lat": 28.6562,
      "lng": 77.23
    },
    "thingsToKnow": [
      {
        "icon": "backpack",
        "title": "What to bring",
        "description": "Comfortable sneakers and light cotton clothes."
      },
      {
        "icon": "shield",
        "title": "Cancellation policy",
        "description": "Free cancellation up to 24 hours."
      }
    ],
    "whatYoullDo": [
      {
        "title": "Spice Market Alleyways",
        "description": "Vibrant colors of Khari Baoli.",
        "image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80"
      }
    ],
    "availabilitySlots": [
      {
        "date": "Tomorrow, 8 September",
        "time": "7:00\u20139:30 am",
        "availableSpots": 5,
        "totalSpots": 5
      }
    ],
    "reviews": [
      {
        "id": "rev-301",
        "author": "Sophie",
        "location": "London, UK",
        "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
        "rating": 5,
        "date": "June 2026",
        "comment": "Anurag is a magician with light. The best experience in Delhi!"
      }
    ],
    "section": "photography"
  },
  {
    "id": "4",
    "title": "Artful city portraits by Ashish",
    "tagline": "Fine art and heritage backdrop portraits in Lodhi Art District.",
    "description": "Explore South Delhi's colorful murals, Bauhaus lines, and open-air art galleries with fine-art portraiture. Perfect for couples, creatives, and artists looking for distinctive frames.",
    "location": "Lodhi Colony, Delhi",
    "neighborhood": "Lodhi Art District",
    "city": "New Delhi",
    "country": "India",
    "category": "Photography",
    "providerInfo": "Fine Art Photographer",
    "locationText": "Lodhi Art District & Lodhi Gardens",
    "pricePerGuest": 9500,
    "priceUnit": "group",
    "currency": "\u20b9",
    "rating": 5.0,
    "reviewCount": 39,
    "duration": "2 hours",
    "language": "Hosted in English and Hindi",
    "meetingPoint": "Lodhi Art District Block 15, New Delhi",
    "meetingCoordinates": {
      "lat": 28.5878,
      "lng": 77.2285
    },
    "whatIsIncluded": [
      "35 art-graded photos",
      "Online high-res gallery",
      "Creative styling advice"
    ],
    "guestCapacity": 4,
    "heroImage": "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80",
    "images": [
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80"
    ],
    "host": {
      "name": "Ashish",
      "avatar": "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=300&q=80",
      "role": "Visual Artist",
      "description": "Specializing in geometric street art portraits and creative lighting.",
      "joinedYear": 2017
    },
    "qualifications": [
      {
        "icon": "camera",
        "title": "8 years fine art photography",
        "description": "Exhibited at India Art Fair."
      },
      {
        "icon": "star",
        "title": "Featured in Architectural Digest",
        "description": "Delhi urban architecture series."
      }
    ],
    "portfolioImages": [
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80"
    ],
    "serviceArea": "South & Central Delhi",
    "thingsToKnow": [
      {
        "icon": "backpack",
        "title": "What to bring",
        "description": "Bright or contrasting wardrobe to pop against mural colors."
      },
      {
        "icon": "shield",
        "title": "Cancellation policy",
        "description": "Free cancellation 24h before."
      }
    ],
    "whatYoullDo": [
      {
        "title": "Mural Hunt & Light Mapping",
        "description": "Pairing your style with iconic wall murals.",
        "image": "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80"
      }
    ],
    "availabilitySlots": [
      {
        "date": "Tomorrow, 8 September",
        "time": "3:00\u20135:00 pm",
        "availableSpots": 4,
        "totalSpots": 4
      }
    ],
    "reviews": [
      {
        "id": "rev-401",
        "author": "Kavita",
        "location": "Bangalore, India",
        "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
        "rating": 5,
        "date": "July 2026",
        "comment": "Ashish has an incredible eye for color. Outstanding experience!"
      }
    ],
    "section": "photography"
  },
  {
    "id": "5",
    "title": "Cinematic portraits by Kreative Aperture",
    "tagline": "Dramatic night frames, neon backlight, and vintage aesthetics.",
    "description": "Experience Delhi after dusk. We use portable RGB cinema tubes and vintage prime lenses to capture mood-rich, cyberpunk and classic moody cinematic portraits in Connaught Place.",
    "location": "Connaught Place, Delhi",
    "neighborhood": "Connaught Place Inner Circle",
    "city": "New Delhi",
    "country": "India",
    "category": "Photography",
    "providerInfo": "Cinematographer & Photographer",
    "locationText": "Connaught Place & Agrasen ki Baoli",
    "pricePerGuest": 6400,
    "priceUnit": "guest",
    "currency": "\u20b9",
    "rating": 5.0,
    "reviewCount": 51,
    "duration": "2 hours",
    "language": "Hosted in English and Hindi",
    "meetingPoint": "Odeon Cinema, Radial Road 2, Connaught Place",
    "meetingCoordinates": {
      "lat": 28.6328,
      "lng": 77.2197
    },
    "whatIsIncluded": [
      "30 color-graded cinematic stills",
      "15-second teaser reel",
      "Online gallery"
    ],
    "guestCapacity": 4,
    "heroImage": "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=1200&q=80",
    "images": [
      "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80"
    ],
    "host": {
      "name": "Kreative Aperture",
      "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
      "role": "Cinematographer",
      "description": "Filmmaking duo creating cinematic stills with filmic color science.",
      "joinedYear": 2019
    },
    "qualifications": [
      {
        "icon": "camera",
        "title": "7 years cinema direction",
        "description": "Music video and indie film cinematography."
      }
    ],
    "portfolioImages": [
      "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80"
    ],
    "serviceArea": "Central Delhi",
    "thingsToKnow": [
      {
        "icon": "clock",
        "title": "Start time",
        "description": "Begins at twilight / blue hour."
      },
      {
        "icon": "shield",
        "title": "Cancellation policy",
        "description": "Free cancellation 24h."
      }
    ],
    "whatYoullDo": [
      {
        "title": "Colonnade Night Frames",
        "description": "White neoclassical pillars of CP lit with moody warm light.",
        "image": "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=600&q=80"
      }
    ],
    "availabilitySlots": [
      {
        "date": "Tomorrow, 8 September",
        "time": "6:30\u20138:30 pm",
        "availableSpots": 4,
        "totalSpots": 4
      }
    ],
    "reviews": [
      {
        "id": "rev-501",
        "author": "Arjun",
        "location": "Pune, India",
        "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
        "rating": 5,
        "date": "June 2026",
        "comment": "Unreal lighting technique. Looks like a movie poster!"
      }
    ],
    "section": "photography"
  },
  {
    "id": "6",
    "title": "Storytelling portraits by Akshay",
    "tagline": "Heartwarming couples, candid smiles, and warm natural frames.",
    "description": "Every face has an unforgettable story. I focus on natural conversations, easy laughter, and timeless documentary-style frames in peaceful green sanctuaries of Delhi.",
    "location": "South Delhi, India",
    "neighborhood": "Hauz Khas Village",
    "city": "New Delhi",
    "country": "India",
    "category": "Photography",
    "providerInfo": "Storyteller & Portraitist",
    "locationText": "Hauz Khas Village & Deer Park",
    "pricePerGuest": 8000,
    "priceUnit": "guest",
    "currency": "\u20b9",
    "rating": 5.0,
    "reviewCount": 44,
    "duration": "2 hours",
    "language": "Hosted in English and Hindi",
    "meetingPoint": "Social, Hauz Khas Village, New Delhi",
    "meetingCoordinates": {
      "lat": 28.5535,
      "lng": 77.1944
    },
    "whatIsIncluded": [
      "40 warm storytelling photos",
      "Coffee and pastry",
      "Same-week delivery"
    ],
    "guestCapacity": 4,
    "heroImage": "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
    "images": [
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80"
    ],
    "host": {
      "name": "Akshay",
      "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
      "role": "Portrait Photographer",
      "description": "Storyteller capturing soulful, genuine connections.",
      "joinedYear": 2018
    },
    "qualifications": [
      {
        "icon": "camera",
        "title": "9 years storytelling",
        "description": "Over 400 couples and families photographed."
      }
    ],
    "portfolioImages": [
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=600&q=80"
    ],
    "serviceArea": "South Delhi",
    "thingsToKnow": [
      {
        "icon": "shield",
        "title": "Cancellation policy",
        "description": "Free cancellation 24h."
      }
    ],
    "whatYoullDo": [
      {
        "title": "Fort Reservoir Walk",
        "description": "Medieval stone lake and trees.",
        "image": "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80"
      }
    ],
    "availabilitySlots": [
      {
        "date": "Tomorrow, 8 September",
        "time": "4:00\u20136:00 pm",
        "availableSpots": 4,
        "totalSpots": 4
      }
    ],
    "reviews": [
      {
        "id": "rev-601",
        "author": "Tanvi",
        "location": "Gurugram, India",
        "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
        "rating": 5,
        "date": "July 2026",
        "comment": "Akshay made us feel so comfortable and candid!"
      }
    ],
    "section": "photography"
  },
  {
    "id": "7",
    "title": "Portrait Photography : Khidki by Sanjeev",
    "tagline": "Architectural frames, shadows, and artistic Indian portraits.",
    "description": "Khidki (window) explores framing human emotion through architectural arches, shadows, and natural ventilation of historic Delhi monuments.",
    "location": "Mehrauli, Delhi",
    "neighborhood": "Qutub Complex & Mehrauli Archaeological Park",
    "city": "New Delhi",
    "country": "India",
    "category": "Photography",
    "providerInfo": "Architectural Portraitist",
    "locationText": "Qutub Minar & Mehrauli Archaeological Park",
    "pricePerGuest": 8000,
    "priceUnit": "guest",
    "currency": "\u20b9",
    "rating": 5.0,
    "reviewCount": 38,
    "duration": "2 hours",
    "language": "Hosted in English and Hindi",
    "meetingPoint": "Qutub Minar Metro Station Gate 2",
    "meetingCoordinates": {
      "lat": 28.5245,
      "lng": 77.1855
    },
    "whatIsIncluded": [
      "35 architectural portraits",
      "High-res online gallery",
      "Refreshment"
    ],
    "guestCapacity": 4,
    "heroImage": "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80",
    "images": [
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"
    ],
    "host": {
      "name": "Sanjeev",
      "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
      "role": "Architect & Photographer",
      "description": "Architectural researcher uncovering hidden geometric light in Delhi.",
      "joinedYear": 2015
    },
    "qualifications": [
      {
        "icon": "camera",
        "title": "11 years architectural photography",
        "description": "Author of Delhi Stone Windows photobook."
      }
    ],
    "portfolioImages": [
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80"
    ],
    "serviceArea": "South Delhi Heritage Zone",
    "thingsToKnow": [
      {
        "icon": "shield",
        "title": "Cancellation policy",
        "description": "Free cancellation 24h."
      }
    ],
    "whatYoullDo": [
      {
        "title": "Jaali & Silhouette Framing",
        "description": "Capture light streaming through historic lattices.",
        "image": "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80"
      }
    ],
    "availabilitySlots": [
      {
        "date": "Tomorrow, 8 September",
        "time": "7:00\u20139:00 am",
        "availableSpots": 4,
        "totalSpots": 4
      }
    ],
    "reviews": [
      {
        "id": "rev-701",
        "author": "Rahul",
        "location": "Delhi, India",
        "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
        "rating": 5,
        "date": "May 2026",
        "comment": "The angles Sanjeev finds are mind blowing."
      }
    ],
    "section": "photography"
  },
  {
    "id": "8",
    "title": "Yoga Energetic Healing by Dr. Meenakshi",
    "tagline": "Traditional Hatha flow, sound bath, and chakra balancing.",
    "description": "Restore deep vitality with classical Hatha yoga, pranayama breathwork, and healing Tibetan singing bowls in a serene rooftop terrace garden in South Delhi.",
    "location": "Sunder Nagar, Delhi",
    "neighborhood": "Sunder Nagar",
    "city": "New Delhi",
    "country": "India",
    "category": "Training",
    "providerInfo": "Yoga Acharya & Sound Healer",
    "locationText": "Rooftop Yoga Sanctuary or at your hotel",
    "pricePerGuest": 3500,
    "priceUnit": "guest",
    "currency": "\u20b9",
    "rating": 5.0,
    "reviewCount": 78,
    "duration": "1.5 hours",
    "language": "Hosted in English and Hindi",
    "meetingPoint": "Sunder Nagar Park Gate 1, New Delhi",
    "meetingCoordinates": {
      "lat": 28.6019,
      "lng": 77.2415
    },
    "whatIsIncluded": [
      "Organic cork yoga mat",
      "Sound bath meditation",
      "Herbal detox infusion"
    ],
    "guestCapacity": 8,
    "heroImage": "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1200&q=80",
    "images": [
      "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80"
    ],
    "host": {
      "name": "Dr. Meenakshi",
      "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80",
      "role": "Yoga Acharya",
      "description": "Ph.D. in Yogic Sciences with 16 years teaching mindfulness globally.",
      "joinedYear": 2013
    },
    "qualifications": [
      {
        "icon": "graduation",
        "title": "Ph.D. Yogic Sciences (SVYASA)",
        "description": "Gold medalist researcher."
      },
      {
        "icon": "star",
        "title": "500-Hour RYT Yoga Alliance Certified",
        "description": "Master trainer in Rishikesh."
      }
    ],
    "portfolioImages": [
      "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80"
    ],
    "serviceArea": "Central & South Delhi",
    "thingsToKnow": [
      {
        "icon": "backpack",
        "title": "What to bring",
        "description": "Comfortable stretch clothing."
      },
      {
        "icon": "shield",
        "title": "Cancellation policy",
        "description": "Free cancellation 24h."
      }
    ],
    "whatYoullDo": [
      {
        "title": "Pranayama Alignment",
        "description": "Awaken the breath with Kapalabhati & Anulom Vilom.",
        "image": "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80"
      }
    ],
    "availabilitySlots": [
      {
        "date": "Tomorrow, 8 September",
        "time": "8:00\u20139:30 am",
        "availableSpots": 6,
        "totalSpots": 8
      }
    ],
    "reviews": [
      {
        "id": "rev-801",
        "author": "Elena",
        "location": "Berlin, Germany",
        "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
        "rating": 5,
        "date": "August 2026",
        "comment": "Dr. Meenakshi cured my travel jetlag in 90 minutes. Profound healing."
      }
    ],
    "section": "training"
  },
  {
    "id": "9",
    "title": "Private Yoga & Meditation by Sunita",
    "tagline": "Tailored 1-on-1 and small group alignment in Lodhi Gardens.",
    "description": "Practice mindful movement among 15th-century Sayyid and Lodi tombs and sprawling verdant lawns. Customized for all skill levels from beginners to advanced yogis.",
    "location": "Lodhi Gardens, Delhi",
    "neighborhood": "Lodhi Gardens",
    "city": "New Delhi",
    "country": "India",
    "category": "Training",
    "providerInfo": "Senior Yoga Instructor",
    "locationText": "Lodhi Gardens or at your residence",
    "pricePerGuest": 2800,
    "priceUnit": "guest",
    "currency": "\u20b9",
    "rating": 5.0,
    "reviewCount": 65,
    "duration": "1.5 hours",
    "language": "Hosted in English and Hindi",
    "meetingPoint": "Gate 1, Lodhi Gardens, Amrita Shergill Marg",
    "meetingCoordinates": {
      "lat": 28.5933,
      "lng": 77.2185
    },
    "whatIsIncluded": [
      "Eco yoga mat & strap",
      "Cold-pressed coconut water",
      "Guided audio meditation file"
    ],
    "guestCapacity": 6,
    "heroImage": "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80",
    "images": [
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80"
    ],
    "host": {
      "name": "Sunita",
      "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80",
      "role": "Yoga Teacher",
      "description": "14 years conducting morning sessions at Lodhi Gardens.",
      "joinedYear": 2016
    },
    "qualifications": [
      {
        "icon": "graduation",
        "title": "The Yoga Institute Mumbai",
        "description": "Oldest organized yoga center in the world."
      }
    ],
    "portfolioImages": [
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80"
    ],
    "serviceArea": "Central Delhi",
    "thingsToKnow": [
      {
        "icon": "shield",
        "title": "Cancellation policy",
        "description": "Free cancellation 24h."
      }
    ],
    "whatYoullDo": [
      {
        "title": "Sun Salutations in the Garden",
        "description": "Flow under morning birdsong.",
        "image": "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80"
      }
    ],
    "availabilitySlots": [
      {
        "date": "Tomorrow, 8 September",
        "time": "6:30\u20138:00 am",
        "availableSpots": 6,
        "totalSpots": 6
      }
    ],
    "reviews": [
      {
        "id": "rev-901",
        "author": "Mark",
        "location": "San Francisco, USA",
        "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
        "rating": 5,
        "date": "July 2026",
        "comment": "Morning yoga in Lodhi Gardens was the highlight of our India trip."
      }
    ],
    "section": "training"
  },
  {
    "id": "10",
    "title": "Breath Flow & Inner Glow by Aarti",
    "tagline": "Holistic Vinyasa flow, breath awareness, and sound relaxation.",
    "description": "Awaken your energy centers through smooth dynamic Vinyasa sequences followed by deep Yin releases and restorative breathwork.",
    "location": "Greater Kailash, Delhi",
    "neighborhood": "Greater Kailash 2",
    "city": "New Delhi",
    "country": "India",
    "category": "Training",
    "providerInfo": "Vinyasa & Yin Yoga Specialist",
    "locationText": "Studio or at home",
    "pricePerGuest": 3000,
    "priceUnit": "guest",
    "currency": "\u20b9",
    "rating": 5.0,
    "reviewCount": 42,
    "duration": "1.5 hours",
    "language": "Hosted in English and Hindi",
    "meetingPoint": "M Block Market GK2, New Delhi",
    "meetingCoordinates": {
      "lat": 28.5355,
      "lng": 77.241
    },
    "whatIsIncluded": [
      "Yoga props & blankets",
      "Aromatherapy oils",
      "Herbal brew"
    ],
    "guestCapacity": 6,
    "heroImage": "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80",
    "images": [
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80"
    ],
    "host": {
      "name": "Aarti",
      "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
      "role": "Vinyasa Instructor",
      "description": "Former contemporary dancer turned somatic movement therapist.",
      "joinedYear": 2017
    },
    "qualifications": [
      {
        "icon": "graduation",
        "title": "500H Somatic Yoga Master",
        "description": "Goa International Yoga Academy."
      }
    ],
    "portfolioImages": [
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80"
    ],
    "serviceArea": "South Delhi",
    "thingsToKnow": [
      {
        "icon": "shield",
        "title": "Cancellation policy",
        "description": "Free cancellation 24h."
      }
    ],
    "whatYoullDo": [
      {
        "title": "Fluid Asana Flow",
        "description": "Synchronize breath with graceful movement.",
        "image": "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80"
      }
    ],
    "availabilitySlots": [
      {
        "date": "Tomorrow, 8 September",
        "time": "9:00\u201310:30 am",
        "availableSpots": 5,
        "totalSpots": 6
      }
    ],
    "reviews": [
      {
        "id": "rev-1001",
        "author": "Chloe",
        "location": "Paris, France",
        "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80",
        "rating": 5,
        "date": "June 2026",
        "comment": "Aarti has such gentle energy. Left floating!"
      }
    ],
    "section": "training"
  },
  {
    "id": "11",
    "title": "Calming yoga sessions by Priya",
    "tagline": "Gentle restorative therapy, nervous system soothing, and yoga nidra.",
    "description": "Escape city noise with restorative yoga using bolsters and cushions, concluding in a deeply tranquil 30-minute guided Yoga Nidra sleep meditation.",
    "location": "Vasant Vihar, Delhi",
    "neighborhood": "Vasant Vihar",
    "city": "New Delhi",
    "country": "India",
    "category": "Training",
    "providerInfo": "Restorative Therapist",
    "locationText": "Provided at your home or studio",
    "pricePerGuest": 2500,
    "priceUnit": "guest",
    "currency": "\u20b9",
    "rating": 5.0,
    "reviewCount": 56,
    "duration": "1 hr 15 min",
    "language": "Hosted in English and Hindi",
    "meetingPoint": "Basant Lok Community Centre, Vasant Vihar",
    "meetingCoordinates": {
      "lat": 28.5575,
      "lng": 77.1585
    },
    "whatIsIncluded": [
      "Organic eye pillows",
      "Lavender essential oil",
      "Herbal chamomile tea"
    ],
    "guestCapacity": 6,
    "heroImage": "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1200&q=80",
    "images": [
      "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1200&q=80"
    ],
    "host": {
      "name": "Priya",
      "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80",
      "role": "Restorative Yoga Instructor",
      "description": "Specializing in stress reduction and sleep improvement through gentle yoga.",
      "joinedYear": 2019
    },
    "qualifications": [
      {
        "icon": "graduation",
        "title": "Bihar School of Yoga",
        "description": "Certified Yoga Nidra instructor."
      }
    ],
    "portfolioImages": [
      "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80"
    ],
    "serviceArea": "South & West Delhi",
    "thingsToKnow": [
      {
        "icon": "shield",
        "title": "Cancellation policy",
        "description": "Free cancellation 24h."
      }
    ],
    "whatYoullDo": [
      {
        "title": "Yoga Nidra Guided Journey",
        "description": "Total conscious body relaxation.",
        "image": "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80"
      }
    ],
    "availabilitySlots": [
      {
        "date": "Tomorrow, 8 September",
        "time": "6:00\u20137:15 pm",
        "availableSpots": 6,
        "totalSpots": 6
      }
    ],
    "reviews": [
      {
        "id": "rev-1101",
        "author": "Liam",
        "location": "Sydney, Australia",
        "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
        "rating": 5,
        "date": "July 2026",
        "comment": "Best sleep of my entire life after Priya's session."
      }
    ],
    "section": "training"
  },
  {
    "id": "12",
    "title": "Yoga, sound and reiki by Kabir",
    "tagline": "Full sensory alignment with crystal bowls, gong, and gentle asanas.",
    "description": "Experience an ethereal sound bath journey combining 432Hz frosted quartz crystal bowls, wind gongs, and gentle restorative asanas designed to dissolve mental fatigue.",
    "location": "Hauz Khas, Delhi",
    "neighborhood": "Hauz Khas Enclave",
    "city": "New Delhi",
    "country": "India",
    "category": "Training",
    "providerInfo": "Sound Healer & Reiki Grandmaster",
    "locationText": "Sound Studio or provided at your home",
    "pricePerGuest": 4200,
    "priceUnit": "guest",
    "currency": "\u20b9",
    "rating": 5.0,
    "reviewCount": 73,
    "duration": "1.5 hours",
    "language": "Hosted in English and Hindi",
    "meetingPoint": "Hauz Khas Enclave Main Gate, New Delhi",
    "meetingCoordinates": {
      "lat": 28.5485,
      "lng": 77.2025
    },
    "whatIsIncluded": [
      "Crystal singing bowl immersion",
      "Reiki energy clearing",
      "Sacred sage smudge"
    ],
    "guestCapacity": 8,
    "heroImage": "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80",
    "images": [
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80"
    ],
    "host": {
      "name": "Kabir",
      "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
      "role": "Sound Alchemist",
      "description": "Certified Sound Therapist and Reiki Master with 12 years practice.",
      "joinedYear": 2015
    },
    "qualifications": [
      {
        "icon": "star",
        "title": "International Sound Therapy Association",
        "description": "Master Practitioner."
      }
    ],
    "portfolioImages": [
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80"
    ],
    "serviceArea": "Delhi NCR",
    "thingsToKnow": [
      {
        "icon": "shield",
        "title": "Cancellation policy",
        "description": "Free cancellation 24h."
      }
    ],
    "whatYoullDo": [
      {
        "title": "Quartz Crystal Sound Immersion",
        "description": "Pure sonic frequencies washing over tension.",
        "image": "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80"
      }
    ],
    "availabilitySlots": [
      {
        "date": "Tomorrow, 8 September",
        "time": "5:30\u20137:00 pm",
        "availableSpots": 8,
        "totalSpots": 8
      }
    ],
    "reviews": [
      {
        "id": "rev-1201",
        "author": "Maya",
        "location": "Toronto, Canada",
        "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
        "rating": 5,
        "date": "August 2026",
        "comment": "Transcendent! The vibrations resonated through my entire body."
      }
    ],
    "section": "training"
  },
  {
    "id": "13",
    "title": "Holistic mind body sessions by Tanvi",
    "tagline": "Pilates core integration, posture therapy, and mindful breath.",
    "description": "Strengthen spinal alignment and functional posture with classical mat Pilates combined with guided biomechanics and therapeutic stretches.",
    "location": "Defence Colony, Delhi",
    "neighborhood": "Defence Colony",
    "city": "New Delhi",
    "country": "India",
    "category": "Training",
    "providerInfo": "Pilates & Posture Coach",
    "locationText": "Provided at your home or fitness studio",
    "pricePerGuest": 3900,
    "priceUnit": "guest",
    "currency": "\u20b9",
    "rating": 5.0,
    "reviewCount": 49,
    "duration": "1 hour",
    "language": "Hosted in English and Hindi",
    "meetingPoint": "Defence Colony Club, New Delhi",
    "meetingCoordinates": {
      "lat": 28.5725,
      "lng": 77.2315
    },
    "whatIsIncluded": [
      "Resistance bands & Pilates ring",
      "Posture analysis report",
      "Electrolyte cooler"
    ],
    "guestCapacity": 5,
    "heroImage": "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80",
    "images": [
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80"
    ],
    "host": {
      "name": "Tanvi",
      "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80",
      "role": "Pilates Specialist",
      "description": "Stott Pilates certified trainer helping executives and travelers maintain posture.",
      "joinedYear": 2018
    },
    "qualifications": [
      {
        "icon": "graduation",
        "title": "Stott Pilates Certified",
        "description": "Comprehensive matwork and functional movement."
      }
    ],
    "portfolioImages": [
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80"
    ],
    "serviceArea": "South & Central Delhi",
    "thingsToKnow": [
      {
        "icon": "shield",
        "title": "Cancellation policy",
        "description": "Free cancellation 24h."
      }
    ],
    "whatYoullDo": [
      {
        "title": "Spine & Core Awakening",
        "description": "Realign posture with low-impact precision.",
        "image": "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80"
      }
    ],
    "availabilitySlots": [
      {
        "date": "Tomorrow, 8 September",
        "time": "10:00\u201311:00 am",
        "availableSpots": 5,
        "totalSpots": 5
      }
    ],
    "reviews": [
      {
        "id": "rev-1301",
        "author": "David",
        "location": "New York, USA",
        "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
        "rating": 5,
        "date": "July 2026",
        "comment": "My lower back pain disappeared after one session. Tanvi is fabulous."
      }
    ],
    "section": "training"
  },
  {
    "id": "14",
    "title": "Fitness Strength & Conditioning by Rohan",
    "tagline": "Kettlebell fundamentals, functional agility, and metabolic burn.",
    "description": "High-energy athletic training session using kettlebells, battle ropes, and bodyweight agility drills in outdoor parks or private gyms across Delhi.",
    "location": "Nehru Park, Delhi",
    "neighborhood": "Chanakyapuri",
    "city": "New Delhi",
    "country": "India",
    "category": "Training",
    "providerInfo": "Elite Strength Coach",
    "locationText": "Nehru Park Chanakyapuri or at your location",
    "pricePerGuest": 3200,
    "priceUnit": "guest",
    "currency": "\u20b9",
    "rating": 5.0,
    "reviewCount": 61,
    "duration": "1 hr 15 min",
    "language": "Hosted in English and Hindi",
    "meetingPoint": "Nehru Park Main Gate, Chanakyapuri, New Delhi",
    "meetingCoordinates": {
      "lat": 28.591,
      "lng": 77.195
    },
    "whatIsIncluded": [
      "Pro training gear provided",
      "Protein recovery shake",
      "Personalized workout plan"
    ],
    "guestCapacity": 6,
    "heroImage": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80",
    "images": [
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80"
    ],
    "host": {
      "name": "Rohan",
      "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
      "role": "Strength & Conditioning Coach",
      "description": "Former national athlete coaching functional movement and kettlebells.",
      "joinedYear": 2017
    },
    "qualifications": [
      {
        "icon": "graduation",
        "title": "CSCS & StrongFirst Certified",
        "description": "Kettlebell Instructor Level II."
      }
    ],
    "portfolioImages": [
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80"
    ],
    "serviceArea": "Central & South Delhi",
    "thingsToKnow": [
      {
        "icon": "shield",
        "title": "Cancellation policy",
        "description": "Free cancellation 24h."
      }
    ],
    "whatYoullDo": [
      {
        "title": "Kettlebell Dynamic Agility",
        "description": "Explosive swings, cleans, and stability drills.",
        "image": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80"
      }
    ],
    "availabilitySlots": [
      {
        "date": "Tomorrow, 8 September",
        "time": "7:00\u20138:15 am",
        "availableSpots": 6,
        "totalSpots": 6
      }
    ],
    "reviews": [
      {
        "id": "rev-1401",
        "author": "Vikram",
        "location": "Delhi, India",
        "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
        "rating": 5,
        "date": "August 2026",
        "comment": "Rohan's coaching cueing is world class. Challenging yet super safe!"
      }
    ],
    "section": "training"
  },
  {
    "id": "15",
    "title": "Hands-on Indian Cooking in a Real Indian Home",
    "tagline": "Cook authentic homestyle curries, roll fresh rotis, and savor a royal thali feast.",
    "description": "Step into our family home for a warm, fragrant culinary journey. Learn secret family spice blends, roll rotis on an open flame, and enjoy a traditional multi-course family feast.",
    "location": "Greater Kailash, Delhi",
    "neighborhood": "Greater Kailash 1",
    "city": "New Delhi",
    "country": "India",
    "category": "Food & drink",
    "providerInfo": "Culinary Host & Family Chef",
    "locationText": "At our heritage family home",
    "pricePerGuest": 4799,
    "priceUnit": "guest",
    "currency": "\u20b9",
    "rating": 5.0,
    "reviewCount": 156,
    "duration": "2 hr 30 min",
    "language": "Hosted in English and Hindi",
    "meetingPoint": "M Block Market, Greater Kailash-1, New Delhi",
    "meetingCoordinates": {
      "lat": 28.5535,
      "lng": 77.2345
    },
    "whatIsIncluded": [
      "Full multi-course meal",
      "Masala chai & coolers",
      "Recipe booklet & spice pack"
    ],
    "guestCapacity": 8,
    "heroImage": "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=1200&q=80",
    "images": [
      "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80"
    ],
    "host": {
      "name": "JD & Family",
      "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
      "role": "Master Chef & Host",
      "description": "Delhi native preserving three generations of culinary heritage.",
      "joinedYear": 2017
    },
    "qualifications": [
      {
        "icon": "graduation",
        "title": "15 years hosting masterclasses",
        "description": "Over 2,000 global travelers hosted."
      }
    ],
    "portfolioImages": [
      "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=800&q=80"
    ],
    "serviceArea": "South Delhi",
    "thingsToKnow": [
      {
        "icon": "shield",
        "title": "Cancellation policy",
        "description": "Free cancellation 24h."
      }
    ],
    "whatYoullDo": [
      {
        "title": "Tadka & Curry Masterclass",
        "description": "Master the art of spices.",
        "image": "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80"
      }
    ],
    "availabilitySlots": [
      {
        "date": "Tomorrow, 8 September",
        "time": "1:00\u20133:30 pm",
        "availableSpots": 6,
        "totalSpots": 8
      }
    ],
    "reviews": [
      {
        "id": "rev-1501",
        "author": "Nicole",
        "location": "Switzerland",
        "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
        "rating": 5,
        "date": "1 day ago",
        "comment": "Unforgettable food and warmest hospitality!"
      }
    ],
    "section": "food"
  },
  {
    "id": "16",
    "title": "Old Delhi Legendary Street Food Crawl",
    "tagline": "Experience the soul of New Delhi through old delhi legendary street food crawl.",
    "description": "Join us for an unforgettable authentic experience in New Delhi. You will be guided by an experienced host and immerse yourself in local culture, flavor, and hidden gems.",
    "location": "New Delhi, India",
    "neighborhood": "Chandni Chowk",
    "city": "New Delhi",
    "country": "India",
    "category": "Food & drink",
    "providerInfo": "Culinary Storyteller in New Delhi",
    "locationText": "Old Delhi Street Walk",
    "pricePerGuest": 2500,
    "priceUnit": "guest",
    "currency": "\u20b9",
    "rating": 4.96,
    "reviewCount": 72,
    "duration": "2\u20133 hours",
    "language": "Hosted in English and local language",
    "meetingPoint": "Chandni Chowk Landmark Station, New Delhi",
    "meetingCoordinates": {
      "lat": 28.6139,
      "lng": 77.209
    },
    "whatIsIncluded": [
      "All equipment & materials",
      "Tasting or finished deliverables",
      "Curated local guide notes"
    ],
    "guestCapacity": 8,
    "heroImage": "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1200&q=80",
    "images": [
      "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80"
    ],
    "host": {
      "name": "Local Host 16",
      "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
      "role": "Culinary Storyteller",
      "description": "Passionate local specialist sharing authentic traditions in New Delhi.",
      "joinedYear": 2017
    },
    "qualifications": [
      {
        "icon": "star",
        "title": "10+ years experience in Food & drink",
        "description": "Recognized expert and passionate educator in New Delhi."
      },
      {
        "icon": "graduation",
        "title": "Certified Professional Host",
        "description": "Top-rated Airbnb Experience host since 2018."
      }
    ],
    "portfolioImages": [
      "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80"
    ],
    "serviceArea": "New Delhi Metropolitan Area",
    "thingsToKnow": [
      {
        "icon": "users",
        "title": "Guest requirements",
        "description": "All ages welcome (under 18 accompanied by an adult)."
      },
      {
        "icon": "shield",
        "title": "Cancellation policy",
        "description": "Free cancellation up to 24 hours before."
      }
    ],
    "whatYoullDo": [
      {
        "title": "Introduction & Orientation",
        "description": "Gather and preview the journey across Chandni Chowk.",
        "image": "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1200&q=80"
      }
    ],
    "availabilitySlots": [
      {
        "date": "Tomorrow, 8 September",
        "time": "10:00 am \u2013 1:00 pm",
        "availableSpots": 6,
        "totalSpots": 8
      },
      {
        "date": "Wednesday, 9 September",
        "time": "3:00 \u2013 6:00 pm",
        "availableSpots": 8,
        "totalSpots": 8
      }
    ],
    "reviews": [
      {
        "id": "rev-1601",
        "author": "Traveler",
        "location": "Global Guest",
        "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
        "rating": 5,
        "date": "July 2026",
        "comment": "Incredible session! One of our most memorable moments in New Delhi."
      }
    ],
    "section": "food"
  },
  {
    "id": "17",
    "title": "Secret Mughal Biryani & Kebab Trail",
    "tagline": "Experience the soul of New Delhi through secret mughal biryani & kebab trail.",
    "description": "Join us for an unforgettable authentic experience in New Delhi. You will be guided by an experienced host and immerse yourself in local culture, flavor, and hidden gems.",
    "location": "New Delhi, India",
    "neighborhood": "Jama Masjid",
    "city": "New Delhi",
    "country": "India",
    "category": "Food & drink",
    "providerInfo": "Mughlai Heritage Chef in New Delhi",
    "locationText": "Jama Masjid Bazaar",
    "pricePerGuest": 2800,
    "priceUnit": "guest",
    "currency": "\u20b9",
    "rating": 4.96,
    "reviewCount": 75,
    "duration": "2\u20133 hours",
    "language": "Hosted in English and local language",
    "meetingPoint": "Jama Masjid Landmark Station, New Delhi",
    "meetingCoordinates": {
      "lat": 28.6139,
      "lng": 77.209
    },
    "whatIsIncluded": [
      "All equipment & materials",
      "Tasting or finished deliverables",
      "Curated local guide notes"
    ],
    "guestCapacity": 8,
    "heroImage": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1200&q=80",
    "images": [
      "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80"
    ],
    "host": {
      "name": "Local Host 17",
      "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
      "role": "Mughlai Heritage Chef",
      "description": "Passionate local specialist sharing authentic traditions in New Delhi.",
      "joinedYear": 2017
    },
    "qualifications": [
      {
        "icon": "star",
        "title": "10+ years experience in Food & drink",
        "description": "Recognized expert and passionate educator in New Delhi."
      },
      {
        "icon": "graduation",
        "title": "Certified Professional Host",
        "description": "Top-rated Airbnb Experience host since 2018."
      }
    ],
    "portfolioImages": [
      "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80"
    ],
    "serviceArea": "New Delhi Metropolitan Area",
    "thingsToKnow": [
      {
        "icon": "users",
        "title": "Guest requirements",
        "description": "All ages welcome (under 18 accompanied by an adult)."
      },
      {
        "icon": "shield",
        "title": "Cancellation policy",
        "description": "Free cancellation up to 24 hours before."
      }
    ],
    "whatYoullDo": [
      {
        "title": "Introduction & Orientation",
        "description": "Gather and preview the journey across Jama Masjid.",
        "image": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1200&q=80"
      }
    ],
    "availabilitySlots": [
      {
        "date": "Tomorrow, 8 September",
        "time": "10:00 am \u2013 1:00 pm",
        "availableSpots": 6,
        "totalSpots": 8
      },
      {
        "date": "Wednesday, 9 September",
        "time": "3:00 \u2013 6:00 pm",
        "availableSpots": 8,
        "totalSpots": 8
      }
    ],
    "reviews": [
      {
        "id": "rev-1701",
        "author": "Traveler",
        "location": "Global Guest",
        "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
        "rating": 5,
        "date": "July 2026",
        "comment": "Incredible session! One of our most memorable moments in New Delhi."
      }
    ],
    "section": "food"
  },
  {
    "id": "18",
    "title": "Artisan Chai & Samosa Masterclass",
    "tagline": "Experience the soul of New Delhi through artisan chai & samosa masterclass.",
    "description": "Join us for an unforgettable authentic experience in New Delhi. You will be guided by an experienced host and immerse yourself in local culture, flavor, and hidden gems.",
    "location": "New Delhi, India",
    "neighborhood": "Hauz Khas",
    "city": "New Delhi",
    "country": "India",
    "category": "Food & drink",
    "providerInfo": "Chai Sommelier in New Delhi",
    "locationText": "Hauz Khas Village",
    "pricePerGuest": 1800,
    "priceUnit": "guest",
    "currency": "\u20b9",
    "rating": 5.0,
    "reviewCount": 78,
    "duration": "2\u20133 hours",
    "language": "Hosted in English and local language",
    "meetingPoint": "Hauz Khas Landmark Station, New Delhi",
    "meetingCoordinates": {
      "lat": 28.6139,
      "lng": 77.209
    },
    "whatIsIncluded": [
      "All equipment & materials",
      "Tasting or finished deliverables",
      "Curated local guide notes"
    ],
    "guestCapacity": 8,
    "heroImage": "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=1200&q=80",
    "images": [
      "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80"
    ],
    "host": {
      "name": "Local Host 18",
      "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
      "role": "Chai Sommelier",
      "description": "Passionate local specialist sharing authentic traditions in New Delhi.",
      "joinedYear": 2017
    },
    "qualifications": [
      {
        "icon": "star",
        "title": "10+ years experience in Food & drink",
        "description": "Recognized expert and passionate educator in New Delhi."
      },
      {
        "icon": "graduation",
        "title": "Certified Professional Host",
        "description": "Top-rated Airbnb Experience host since 2018."
      }
    ],
    "portfolioImages": [
      "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80"
    ],
    "serviceArea": "New Delhi Metropolitan Area",
    "thingsToKnow": [
      {
        "icon": "users",
        "title": "Guest requirements",
        "description": "All ages welcome (under 18 accompanied by an adult)."
      },
      {
        "icon": "shield",
        "title": "Cancellation policy",
        "description": "Free cancellation up to 24 hours before."
      }
    ],
    "whatYoullDo": [
      {
        "title": "Introduction & Orientation",
        "description": "Gather and preview the journey across Hauz Khas.",
        "image": "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=1200&q=80"
      }
    ],
    "availabilitySlots": [
      {
        "date": "Tomorrow, 8 September",
        "time": "10:00 am \u2013 1:00 pm",
        "availableSpots": 6,
        "totalSpots": 8
      },
      {
        "date": "Wednesday, 9 September",
        "time": "3:00 \u2013 6:00 pm",
        "availableSpots": 8,
        "totalSpots": 8
      }
    ],
    "reviews": [
      {
        "id": "rev-1801",
        "author": "Traveler",
        "location": "Global Guest",
        "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
        "rating": 5,
        "date": "July 2026",
        "comment": "Incredible session! One of our most memorable moments in New Delhi."
      }
    ],
    "section": "food"
  },
  {
    "id": "19",
    "title": "Traditional Punjabi Feast & Clay Oven Naan",
    "tagline": "Experience the soul of New Delhi through traditional punjabi feast & clay oven naan.",
    "description": "Join us for an unforgettable authentic experience in New Delhi. You will be guided by an experienced host and immerse yourself in local culture, flavor, and hidden gems.",
    "location": "New Delhi, India",
    "neighborhood": "Connaught Place",
    "city": "New Delhi",
    "country": "India",
    "category": "Food & drink",
    "providerInfo": "Tandoor Master in New Delhi",
    "locationText": "Connaught Place",
    "pricePerGuest": 3200,
    "priceUnit": "guest",
    "currency": "\u20b9",
    "rating": 4.96,
    "reviewCount": 81,
    "duration": "2\u20133 hours",
    "language": "Hosted in English and local language",
    "meetingPoint": "Connaught Place Landmark Station, New Delhi",
    "meetingCoordinates": {
      "lat": 28.6139,
      "lng": 77.209
    },
    "whatIsIncluded": [
      "All equipment & materials",
      "Tasting or finished deliverables",
      "Curated local guide notes"
    ],
    "guestCapacity": 8,
    "heroImage": "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=1200&q=80",
    "images": [
      "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80"
    ],
    "host": {
      "name": "Local Host 19",
      "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
      "role": "Tandoor Master",
      "description": "Passionate local specialist sharing authentic traditions in New Delhi.",
      "joinedYear": 2017
    },
    "qualifications": [
      {
        "icon": "star",
        "title": "10+ years experience in Food & drink",
        "description": "Recognized expert and passionate educator in New Delhi."
      },
      {
        "icon": "graduation",
        "title": "Certified Professional Host",
        "description": "Top-rated Airbnb Experience host since 2018."
      }
    ],
    "portfolioImages": [
      "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80"
    ],
    "serviceArea": "New Delhi Metropolitan Area",
    "thingsToKnow": [
      {
        "icon": "users",
        "title": "Guest requirements",
        "description": "All ages welcome (under 18 accompanied by an adult)."
      },
      {
        "icon": "shield",
        "title": "Cancellation policy",
        "description": "Free cancellation up to 24 hours before."
      }
    ],
    "whatYoullDo": [
      {
        "title": "Introduction & Orientation",
        "description": "Gather and preview the journey across Connaught Place.",
        "image": "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=1200&q=80"
      }
    ],
    "availabilitySlots": [
      {
        "date": "Tomorrow, 8 September",
        "time": "10:00 am \u2013 1:00 pm",
        "availableSpots": 6,
        "totalSpots": 8
      },
      {
        "date": "Wednesday, 9 September",
        "time": "3:00 \u2013 6:00 pm",
        "availableSpots": 8,
        "totalSpots": 8
      }
    ],
    "reviews": [
      {
        "id": "rev-1901",
        "author": "Traveler",
        "location": "Global Guest",
        "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
        "rating": 5,
        "date": "July 2026",
        "comment": "Incredible session! One of our most memorable moments in New Delhi."
      }
    ],
    "section": "food"
  },
  {
    "id": "20",
    "title": "South Indian Dosa & Filter Coffee Workshop",
    "tagline": "Experience the soul of New Delhi through south indian dosa & filter coffee workshop.",
    "description": "Join us for an unforgettable authentic experience in New Delhi. You will be guided by an experienced host and immerse yourself in local culture, flavor, and hidden gems.",
    "location": "New Delhi, India",
    "neighborhood": "Lodhi Colony",
    "city": "New Delhi",
    "country": "India",
    "category": "Food & drink",
    "providerInfo": "Filter Coffee Expert in New Delhi",
    "locationText": "Lodhi Colony",
    "pricePerGuest": 2200,
    "priceUnit": "guest",
    "currency": "\u20b9",
    "rating": 4.96,
    "reviewCount": 84,
    "duration": "2\u20133 hours",
    "language": "Hosted in English and local language",
    "meetingPoint": "Lodhi Colony Landmark Station, New Delhi",
    "meetingCoordinates": {
      "lat": 28.6139,
      "lng": 77.209
    },
    "whatIsIncluded": [
      "All equipment & materials",
      "Tasting or finished deliverables",
      "Curated local guide notes"
    ],
    "guestCapacity": 8,
    "heroImage": "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=1200&q=80",
    "images": [
      "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80"
    ],
    "host": {
      "name": "Local Host 20",
      "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
      "role": "Filter Coffee Expert",
      "description": "Passionate local specialist sharing authentic traditions in New Delhi.",
      "joinedYear": 2017
    },
    "qualifications": [
      {
        "icon": "star",
        "title": "10+ years experience in Food & drink",
        "description": "Recognized expert and passionate educator in New Delhi."
      },
      {
        "icon": "graduation",
        "title": "Certified Professional Host",
        "description": "Top-rated Airbnb Experience host since 2018."
      }
    ],
    "portfolioImages": [
      "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80"
    ],
    "serviceArea": "New Delhi Metropolitan Area",
    "thingsToKnow": [
      {
        "icon": "users",
        "title": "Guest requirements",
        "description": "All ages welcome (under 18 accompanied by an adult)."
      },
      {
        "icon": "shield",
        "title": "Cancellation policy",
        "description": "Free cancellation up to 24 hours before."
      }
    ],
    "whatYoullDo": [
      {
        "title": "Introduction & Orientation",
        "description": "Gather and preview the journey across Lodhi Colony.",
        "image": "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=1200&q=80"
      }
    ],
    "availabilitySlots": [
      {
        "date": "Tomorrow, 8 September",
        "time": "10:00 am \u2013 1:00 pm",
        "availableSpots": 6,
        "totalSpots": 8
      },
      {
        "date": "Wednesday, 9 September",
        "time": "3:00 \u2013 6:00 pm",
        "availableSpots": 8,
        "totalSpots": 8
      }
    ],
    "reviews": [
      {
        "id": "rev-2001",
        "author": "Traveler",
        "location": "Global Guest",
        "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
        "rating": 5,
        "date": "July 2026",
        "comment": "Incredible session! One of our most memorable moments in New Delhi."
      }
    ],
    "section": "food"
  },
  {
    "id": "21",
    "title": "Sweet Alchemy: Jalebi & Rabri Tasting Tour",
    "tagline": "Experience the soul of New Delhi through sweet alchemy: jalebi & rabri tasting tour.",
    "description": "Join us for an unforgettable authentic experience in New Delhi. You will be guided by an experienced host and immerse yourself in local culture, flavor, and hidden gems.",
    "location": "New Delhi, India",
    "neighborhood": "Dariba Kalan",
    "city": "New Delhi",
    "country": "India",
    "category": "Food & drink",
    "providerInfo": "Confectionery Historian in New Delhi",
    "locationText": "Old Delhi Sweet Shops",
    "pricePerGuest": 1950,
    "priceUnit": "guest",
    "currency": "\u20b9",
    "rating": 5.0,
    "reviewCount": 87,
    "duration": "2\u20133 hours",
    "language": "Hosted in English and local language",
    "meetingPoint": "Dariba Kalan Landmark Station, New Delhi",
    "meetingCoordinates": {
      "lat": 28.6139,
      "lng": 77.209
    },
    "whatIsIncluded": [
      "All equipment & materials",
      "Tasting or finished deliverables",
      "Curated local guide notes"
    ],
    "guestCapacity": 8,
    "heroImage": "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=1200&q=80",
    "images": [
      "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80"
    ],
    "host": {
      "name": "Local Host 21",
      "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
      "role": "Confectionery Historian",
      "description": "Passionate local specialist sharing authentic traditions in New Delhi.",
      "joinedYear": 2017
    },
    "qualifications": [
      {
        "icon": "star",
        "title": "10+ years experience in Food & drink",
        "description": "Recognized expert and passionate educator in New Delhi."
      },
      {
        "icon": "graduation",
        "title": "Certified Professional Host",
        "description": "Top-rated Airbnb Experience host since 2018."
      }
    ],
    "portfolioImages": [
      "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80"
    ],
    "serviceArea": "New Delhi Metropolitan Area",
    "thingsToKnow": [
      {
        "icon": "users",
        "title": "Guest requirements",
        "description": "All ages welcome (under 18 accompanied by an adult)."
      },
      {
        "icon": "shield",
        "title": "Cancellation policy",
        "description": "Free cancellation up to 24 hours before."
      }
    ],
    "whatYoullDo": [
      {
        "title": "Introduction & Orientation",
        "description": "Gather and preview the journey across Dariba Kalan.",
        "image": "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=1200&q=80"
      }
    ],
    "availabilitySlots": [
      {
        "date": "Tomorrow, 8 September",
        "time": "10:00 am \u2013 1:00 pm",
        "availableSpots": 6,
        "totalSpots": 8
      },
      {
        "date": "Wednesday, 9 September",
        "time": "3:00 \u2013 6:00 pm",
        "availableSpots": 8,
        "totalSpots": 8
      }
    ],
    "reviews": [
      {
        "id": "rev-2101",
        "author": "Traveler",
        "location": "Global Guest",
        "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
        "rating": 5,
        "date": "July 2026",
        "comment": "Incredible session! One of our most memorable moments in New Delhi."
      }
    ],
    "section": "food"
  },
  {
    "id": "22",
    "title": "Sunrise Heritage Cycle Tour of Shahjahanabad",
    "tagline": "Experience the soul of New Delhi through sunrise heritage cycle tour of shahjahanabad.",
    "description": "Join us for an unforgettable authentic experience in New Delhi. You will be guided by an experienced host and immerse yourself in local culture, flavor, and hidden gems.",
    "location": "New Delhi, India",
    "neighborhood": "Red Fort",
    "city": "New Delhi",
    "country": "India",
    "category": "Culture & history",
    "providerInfo": "Delhi Historian & Cyclist in New Delhi",
    "locationText": "Red Fort & Yamuna Ghats",
    "pricePerGuest": 2999,
    "priceUnit": "guest",
    "currency": "\u20b9",
    "rating": 4.96,
    "reviewCount": 90,
    "duration": "2\u20133 hours",
    "language": "Hosted in English and local language",
    "meetingPoint": "Red Fort Landmark Station, New Delhi",
    "meetingCoordinates": {
      "lat": 28.6139,
      "lng": 77.209
    },
    "whatIsIncluded": [
      "All equipment & materials",
      "Tasting or finished deliverables",
      "Curated local guide notes"
    ],
    "guestCapacity": 8,
    "heroImage": "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80",
    "images": [
      "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80"
    ],
    "host": {
      "name": "Local Host 22",
      "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
      "role": "Delhi Historian & Cyclist",
      "description": "Passionate local specialist sharing authentic traditions in New Delhi.",
      "joinedYear": 2017
    },
    "qualifications": [
      {
        "icon": "star",
        "title": "10+ years experience in Culture & history",
        "description": "Recognized expert and passionate educator in New Delhi."
      },
      {
        "icon": "graduation",
        "title": "Certified Professional Host",
        "description": "Top-rated Airbnb Experience host since 2018."
      }
    ],
    "portfolioImages": [
      "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80"
    ],
    "serviceArea": "New Delhi Metropolitan Area",
    "thingsToKnow": [
      {
        "icon": "users",
        "title": "Guest requirements",
        "description": "All ages welcome (under 18 accompanied by an adult)."
      },
      {
        "icon": "shield",
        "title": "Cancellation policy",
        "description": "Free cancellation up to 24 hours before."
      }
    ],
    "whatYoullDo": [
      {
        "title": "Introduction & Orientation",
        "description": "Gather and preview the journey across Red Fort.",
        "image": "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80"
      }
    ],
    "availabilitySlots": [
      {
        "date": "Tomorrow, 8 September",
        "time": "10:00 am \u2013 1:00 pm",
        "availableSpots": 6,
        "totalSpots": 8
      },
      {
        "date": "Wednesday, 9 September",
        "time": "3:00 \u2013 6:00 pm",
        "availableSpots": 8,
        "totalSpots": 8
      }
    ],
    "reviews": [
      {
        "id": "rev-2201",
        "author": "Traveler",
        "location": "Global Guest",
        "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
        "rating": 5,
        "date": "July 2026",
        "comment": "Incredible session! One of our most memorable moments in New Delhi."
      }
    ],
    "section": "culture"
  },
  {
    "id": "23",
    "title": "Secret Sufi Music & Nizamuddin Dargah Evening",
    "tagline": "Experience the soul of New Delhi through secret sufi music & nizamuddin dargah evening.",
    "description": "Join us for an unforgettable authentic experience in New Delhi. You will be guided by an experienced host and immerse yourself in local culture, flavor, and hidden gems.",
    "location": "New Delhi, India",
    "neighborhood": "Nizamuddin",
    "city": "New Delhi",
    "country": "India",
    "category": "Culture & history",
    "providerInfo": "Sufi Heritage Scholar in New Delhi",
    "locationText": "Nizamuddin Basti",
    "pricePerGuest": 2100,
    "priceUnit": "guest",
    "currency": "\u20b9",
    "rating": 4.96,
    "reviewCount": 93,
    "duration": "2\u20133 hours",
    "language": "Hosted in English and local language",
    "meetingPoint": "Nizamuddin Landmark Station, New Delhi",
    "meetingCoordinates": {
      "lat": 28.6139,
      "lng": 77.209
    },
    "whatIsIncluded": [
      "All equipment & materials",
      "Tasting or finished deliverables",
      "Curated local guide notes"
    ],
    "guestCapacity": 8,
    "heroImage": "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80",
    "images": [
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80"
    ],
    "host": {
      "name": "Local Host 23",
      "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
      "role": "Sufi Heritage Scholar",
      "description": "Passionate local specialist sharing authentic traditions in New Delhi.",
      "joinedYear": 2017
    },
    "qualifications": [
      {
        "icon": "star",
        "title": "10+ years experience in Culture & history",
        "description": "Recognized expert and passionate educator in New Delhi."
      },
      {
        "icon": "graduation",
        "title": "Certified Professional Host",
        "description": "Top-rated Airbnb Experience host since 2018."
      }
    ],
    "portfolioImages": [
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80"
    ],
    "serviceArea": "New Delhi Metropolitan Area",
    "thingsToKnow": [
      {
        "icon": "users",
        "title": "Guest requirements",
        "description": "All ages welcome (under 18 accompanied by an adult)."
      },
      {
        "icon": "shield",
        "title": "Cancellation policy",
        "description": "Free cancellation up to 24 hours before."
      }
    ],
    "whatYoullDo": [
      {
        "title": "Introduction & Orientation",
        "description": "Gather and preview the journey across Nizamuddin.",
        "image": "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80"
      }
    ],
    "availabilitySlots": [
      {
        "date": "Tomorrow, 8 September",
        "time": "10:00 am \u2013 1:00 pm",
        "availableSpots": 6,
        "totalSpots": 8
      },
      {
        "date": "Wednesday, 9 September",
        "time": "3:00 \u2013 6:00 pm",
        "availableSpots": 8,
        "totalSpots": 8
      }
    ],
    "reviews": [
      {
        "id": "rev-2301",
        "author": "Traveler",
        "location": "Global Guest",
        "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
        "rating": 5,
        "date": "July 2026",
        "comment": "Incredible session! One of our most memorable moments in New Delhi."
      }
    ],
    "section": "culture"
  },
  {
    "id": "24",
    "title": "Qutub Minar & Forgotten Tombs Architecture Walk",
    "tagline": "Experience the soul of New Delhi through qutub minar & forgotten tombs architecture walk.",
    "description": "Join us for an unforgettable authentic experience in New Delhi. You will be guided by an experienced host and immerse yourself in local culture, flavor, and hidden gems.",
    "location": "New Delhi, India",
    "neighborhood": "Mehrauli",
    "city": "New Delhi",
    "country": "India",
    "category": "Culture & history",
    "providerInfo": "Conservation Architect in New Delhi",
    "locationText": "Qutub Complex",
    "pricePerGuest": 1850,
    "priceUnit": "guest",
    "currency": "\u20b9",
    "rating": 5.0,
    "reviewCount": 96,
    "duration": "2\u20133 hours",
    "language": "Hosted in English and local language",
    "meetingPoint": "Mehrauli Landmark Station, New Delhi",
    "meetingCoordinates": {
      "lat": 28.6139,
      "lng": 77.209
    },
    "whatIsIncluded": [
      "All equipment & materials",
      "Tasting or finished deliverables",
      "Curated local guide notes"
    ],
    "guestCapacity": 8,
    "heroImage": "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80",
    "images": [
      "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80"
    ],
    "host": {
      "name": "Local Host 24",
      "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
      "role": "Conservation Architect",
      "description": "Passionate local specialist sharing authentic traditions in New Delhi.",
      "joinedYear": 2017
    },
    "qualifications": [
      {
        "icon": "star",
        "title": "10+ years experience in Culture & history",
        "description": "Recognized expert and passionate educator in New Delhi."
      },
      {
        "icon": "graduation",
        "title": "Certified Professional Host",
        "description": "Top-rated Airbnb Experience host since 2018."
      }
    ],
    "portfolioImages": [
      "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80"
    ],
    "serviceArea": "New Delhi Metropolitan Area",
    "thingsToKnow": [
      {
        "icon": "users",
        "title": "Guest requirements",
        "description": "All ages welcome (under 18 accompanied by an adult)."
      },
      {
        "icon": "shield",
        "title": "Cancellation policy",
        "description": "Free cancellation up to 24 hours before."
      }
    ],
    "whatYoullDo": [
      {
        "title": "Introduction & Orientation",
        "description": "Gather and preview the journey across Mehrauli.",
        "image": "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80"
      }
    ],
    "availabilitySlots": [
      {
        "date": "Tomorrow, 8 September",
        "time": "10:00 am \u2013 1:00 pm",
        "availableSpots": 6,
        "totalSpots": 8
      },
      {
        "date": "Wednesday, 9 September",
        "time": "3:00 \u2013 6:00 pm",
        "availableSpots": 8,
        "totalSpots": 8
      }
    ],
    "reviews": [
      {
        "id": "rev-2401",
        "author": "Traveler",
        "location": "Global Guest",
        "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
        "rating": 5,
        "date": "July 2026",
        "comment": "Incredible session! One of our most memorable moments in New Delhi."
      }
    ],
    "section": "culture"
  },
  {
    "id": "25",
    "title": "Stepwells of Delhi: Agrasen ki Baoli & Rajon",
    "tagline": "Experience the soul of New Delhi through stepwells of delhi: agrasen ki baoli & rajon.",
    "description": "Join us for an unforgettable authentic experience in New Delhi. You will be guided by an experienced host and immerse yourself in local culture, flavor, and hidden gems.",
    "location": "New Delhi, India",
    "neighborhood": "Hailey Road",
    "city": "New Delhi",
    "country": "India",
    "category": "Culture & history",
    "providerInfo": "Water Heritage Historian in New Delhi",
    "locationText": "Baoli Monuments",
    "pricePerGuest": 1750,
    "priceUnit": "guest",
    "currency": "\u20b9",
    "rating": 4.96,
    "reviewCount": 99,
    "duration": "2\u20133 hours",
    "language": "Hosted in English and local language",
    "meetingPoint": "Hailey Road Landmark Station, New Delhi",
    "meetingCoordinates": {
      "lat": 28.6139,
      "lng": 77.209
    },
    "whatIsIncluded": [
      "All equipment & materials",
      "Tasting or finished deliverables",
      "Curated local guide notes"
    ],
    "guestCapacity": 8,
    "heroImage": "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80",
    "images": [
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80"
    ],
    "host": {
      "name": "Local Host 25",
      "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
      "role": "Water Heritage Historian",
      "description": "Passionate local specialist sharing authentic traditions in New Delhi.",
      "joinedYear": 2017
    },
    "qualifications": [
      {
        "icon": "star",
        "title": "10+ years experience in Culture & history",
        "description": "Recognized expert and passionate educator in New Delhi."
      },
      {
        "icon": "graduation",
        "title": "Certified Professional Host",
        "description": "Top-rated Airbnb Experience host since 2018."
      }
    ],
    "portfolioImages": [
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80"
    ],
    "serviceArea": "New Delhi Metropolitan Area",
    "thingsToKnow": [
      {
        "icon": "users",
        "title": "Guest requirements",
        "description": "All ages welcome (under 18 accompanied by an adult)."
      },
      {
        "icon": "shield",
        "title": "Cancellation policy",
        "description": "Free cancellation up to 24 hours before."
      }
    ],
    "whatYoullDo": [
      {
        "title": "Introduction & Orientation",
        "description": "Gather and preview the journey across Hailey Road.",
        "image": "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80"
      }
    ],
    "availabilitySlots": [
      {
        "date": "Tomorrow, 8 September",
        "time": "10:00 am \u2013 1:00 pm",
        "availableSpots": 6,
        "totalSpots": 8
      },
      {
        "date": "Wednesday, 9 September",
        "time": "3:00 \u2013 6:00 pm",
        "availableSpots": 8,
        "totalSpots": 8
      }
    ],
    "reviews": [
      {
        "id": "rev-2501",
        "author": "Traveler",
        "location": "Global Guest",
        "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
        "rating": 5,
        "date": "July 2026",
        "comment": "Incredible session! One of our most memorable moments in New Delhi."
      }
    ],
    "section": "culture"
  },
  {
    "id": "26",
    "title": "Humayun's Tomb Sunset Geometry & Persian Gardens",
    "tagline": "Experience the soul of New Delhi through humayun's tomb sunset geometry & persian gardens.",
    "description": "Join us for an unforgettable authentic experience in New Delhi. You will be guided by an experienced host and immerse yourself in local culture, flavor, and hidden gems.",
    "location": "New Delhi, India",
    "neighborhood": "Nizamuddin East",
    "city": "New Delhi",
    "country": "India",
    "category": "Culture & history",
    "providerInfo": "Mughal Garden Designer in New Delhi",
    "locationText": "Charbagh Gardens",
    "pricePerGuest": 2200,
    "priceUnit": "guest",
    "currency": "\u20b9",
    "rating": 4.96,
    "reviewCount": 102,
    "duration": "2\u20133 hours",
    "language": "Hosted in English and local language",
    "meetingPoint": "Nizamuddin East Landmark Station, New Delhi",
    "meetingCoordinates": {
      "lat": 28.6139,
      "lng": 77.209
    },
    "whatIsIncluded": [
      "All equipment & materials",
      "Tasting or finished deliverables",
      "Curated local guide notes"
    ],
    "guestCapacity": 8,
    "heroImage": "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80",
    "images": [
      "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80"
    ],
    "host": {
      "name": "Local Host 26",
      "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
      "role": "Mughal Garden Designer",
      "description": "Passionate local specialist sharing authentic traditions in New Delhi.",
      "joinedYear": 2017
    },
    "qualifications": [
      {
        "icon": "star",
        "title": "10+ years experience in Culture & history",
        "description": "Recognized expert and passionate educator in New Delhi."
      },
      {
        "icon": "graduation",
        "title": "Certified Professional Host",
        "description": "Top-rated Airbnb Experience host since 2018."
      }
    ],
    "portfolioImages": [
      "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80"
    ],
    "serviceArea": "New Delhi Metropolitan Area",
    "thingsToKnow": [
      {
        "icon": "users",
        "title": "Guest requirements",
        "description": "All ages welcome (under 18 accompanied by an adult)."
      },
      {
        "icon": "shield",
        "title": "Cancellation policy",
        "description": "Free cancellation up to 24 hours before."
      }
    ],
    "whatYoullDo": [
      {
        "title": "Introduction & Orientation",
        "description": "Gather and preview the journey across Nizamuddin East.",
        "image": "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80"
      }
    ],
    "availabilitySlots": [
      {
        "date": "Tomorrow, 8 September",
        "time": "10:00 am \u2013 1:00 pm",
        "availableSpots": 6,
        "totalSpots": 8
      },
      {
        "date": "Wednesday, 9 September",
        "time": "3:00 \u2013 6:00 pm",
        "availableSpots": 8,
        "totalSpots": 8
      }
    ],
    "reviews": [
      {
        "id": "rev-2601",
        "author": "Traveler",
        "location": "Global Guest",
        "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
        "rating": 5,
        "date": "July 2026",
        "comment": "Incredible session! One of our most memorable moments in New Delhi."
      }
    ],
    "section": "culture"
  },
  {
    "id": "27",
    "title": "Stories of Lodi Dynasty & Sunder Nursery",
    "tagline": "Experience the soul of New Delhi through stories of lodi dynasty & sunder nursery.",
    "description": "Join us for an unforgettable authentic experience in New Delhi. You will be guided by an experienced host and immerse yourself in local culture, flavor, and hidden gems.",
    "location": "New Delhi, India",
    "neighborhood": "Nizamuddin",
    "city": "New Delhi",
    "country": "India",
    "category": "Culture & history",
    "providerInfo": "Heritage Botanist in New Delhi",
    "locationText": "Sunder Nursery",
    "pricePerGuest": 1950,
    "priceUnit": "guest",
    "currency": "\u20b9",
    "rating": 5.0,
    "reviewCount": 105,
    "duration": "2\u20133 hours",
    "language": "Hosted in English and local language",
    "meetingPoint": "Nizamuddin Landmark Station, New Delhi",
    "meetingCoordinates": {
      "lat": 28.6139,
      "lng": 77.209
    },
    "whatIsIncluded": [
      "All equipment & materials",
      "Tasting or finished deliverables",
      "Curated local guide notes"
    ],
    "guestCapacity": 8,
    "heroImage": "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=1200&q=80",
    "images": [
      "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80"
    ],
    "host": {
      "name": "Local Host 27",
      "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
      "role": "Heritage Botanist",
      "description": "Passionate local specialist sharing authentic traditions in New Delhi.",
      "joinedYear": 2017
    },
    "qualifications": [
      {
        "icon": "star",
        "title": "10+ years experience in Culture & history",
        "description": "Recognized expert and passionate educator in New Delhi."
      },
      {
        "icon": "graduation",
        "title": "Certified Professional Host",
        "description": "Top-rated Airbnb Experience host since 2018."
      }
    ],
    "portfolioImages": [
      "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80"
    ],
    "serviceArea": "New Delhi Metropolitan Area",
    "thingsToKnow": [
      {
        "icon": "users",
        "title": "Guest requirements",
        "description": "All ages welcome (under 18 accompanied by an adult)."
      },
      {
        "icon": "shield",
        "title": "Cancellation policy",
        "description": "Free cancellation up to 24 hours before."
      }
    ],
    "whatYoullDo": [
      {
        "title": "Introduction & Orientation",
        "description": "Gather and preview the journey across Nizamuddin.",
        "image": "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=1200&q=80"
      }
    ],
    "availabilitySlots": [
      {
        "date": "Tomorrow, 8 September",
        "time": "10:00 am \u2013 1:00 pm",
        "availableSpots": 6,
        "totalSpots": 8
      },
      {
        "date": "Wednesday, 9 September",
        "time": "3:00 \u2013 6:00 pm",
        "availableSpots": 8,
        "totalSpots": 8
      }
    ],
    "reviews": [
      {
        "id": "rev-2701",
        "author": "Traveler",
        "location": "Global Guest",
        "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
        "rating": 5,
        "date": "July 2026",
        "comment": "Incredible session! One of our most memorable moments in New Delhi."
      }
    ],
    "section": "culture"
  },
  {
    "id": "28",
    "title": "Aravalli Ridge Mountain Bike Adventure",
    "tagline": "Experience the soul of New Delhi through aravalli ridge mountain bike adventure.",
    "description": "Join us for an unforgettable authentic experience in New Delhi. You will be guided by an experienced host and immerse yourself in local culture, flavor, and hidden gems.",
    "location": "New Delhi, India",
    "neighborhood": "Asola Bhatti",
    "city": "New Delhi",
    "country": "India",
    "category": "Adventure",
    "providerInfo": "MTB Guide & Naturalist in New Delhi",
    "locationText": "Aravalli Biodiversity Park",
    "pricePerGuest": 3500,
    "priceUnit": "guest",
    "currency": "\u20b9",
    "rating": 4.96,
    "reviewCount": 108,
    "duration": "2\u20133 hours",
    "language": "Hosted in English and local language",
    "meetingPoint": "Asola Bhatti Landmark Station, New Delhi",
    "meetingCoordinates": {
      "lat": 28.6139,
      "lng": 77.209
    },
    "whatIsIncluded": [
      "All equipment & materials",
      "Tasting or finished deliverables",
      "Curated local guide notes"
    ],
    "guestCapacity": 8,
    "heroImage": "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80",
    "images": [
      "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80"
    ],
    "host": {
      "name": "Local Host 28",
      "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
      "role": "MTB Guide & Naturalist",
      "description": "Passionate local specialist sharing authentic traditions in New Delhi.",
      "joinedYear": 2017
    },
    "qualifications": [
      {
        "icon": "star",
        "title": "10+ years experience in Adventure",
        "description": "Recognized expert and passionate educator in New Delhi."
      },
      {
        "icon": "graduation",
        "title": "Certified Professional Host",
        "description": "Top-rated Airbnb Experience host since 2018."
      }
    ],
    "portfolioImages": [
      "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80"
    ],
    "serviceArea": "New Delhi Metropolitan Area",
    "thingsToKnow": [
      {
        "icon": "users",
        "title": "Guest requirements",
        "description": "All ages welcome (under 18 accompanied by an adult)."
      },
      {
        "icon": "shield",
        "title": "Cancellation policy",
        "description": "Free cancellation up to 24 hours before."
      }
    ],
    "whatYoullDo": [
      {
        "title": "Introduction & Orientation",
        "description": "Gather and preview the journey across Asola Bhatti.",
        "image": "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80"
      }
    ],
    "availabilitySlots": [
      {
        "date": "Tomorrow, 8 September",
        "time": "10:00 am \u2013 1:00 pm",
        "availableSpots": 6,
        "totalSpots": 8
      },
      {
        "date": "Wednesday, 9 September",
        "time": "3:00 \u2013 6:00 pm",
        "availableSpots": 8,
        "totalSpots": 8
      }
    ],
    "reviews": [
      {
        "id": "rev-2801",
        "author": "Traveler",
        "location": "Global Guest",
        "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
        "rating": 5,
        "date": "July 2026",
        "comment": "Incredible session! One of our most memorable moments in New Delhi."
      }
    ],
    "section": "adventure"
  },
  {
    "id": "29",
    "title": "Yamuna River Dawn Kayaking & Migratory Birds",
    "tagline": "Experience the soul of New Delhi through yamuna river dawn kayaking & migratory birds.",
    "description": "Join us for an unforgettable authentic experience in New Delhi. You will be guided by an experienced host and immerse yourself in local culture, flavor, and hidden gems.",
    "location": "New Delhi, India",
    "neighborhood": "Wazirabad",
    "city": "New Delhi",
    "country": "India",
    "category": "Adventure",
    "providerInfo": "River Conservationist in New Delhi",
    "locationText": "Yamuna Ghats",
    "pricePerGuest": 2800,
    "priceUnit": "guest",
    "currency": "\u20b9",
    "rating": 4.96,
    "reviewCount": 111,
    "duration": "2\u20133 hours",
    "language": "Hosted in English and local language",
    "meetingPoint": "Wazirabad Landmark Station, New Delhi",
    "meetingCoordinates": {
      "lat": 28.6139,
      "lng": 77.209
    },
    "whatIsIncluded": [
      "All equipment & materials",
      "Tasting or finished deliverables",
      "Curated local guide notes"
    ],
    "guestCapacity": 8,
    "heroImage": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    "images": [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80"
    ],
    "host": {
      "name": "Local Host 29",
      "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
      "role": "River Conservationist",
      "description": "Passionate local specialist sharing authentic traditions in New Delhi.",
      "joinedYear": 2017
    },
    "qualifications": [
      {
        "icon": "star",
        "title": "10+ years experience in Adventure",
        "description": "Recognized expert and passionate educator in New Delhi."
      },
      {
        "icon": "graduation",
        "title": "Certified Professional Host",
        "description": "Top-rated Airbnb Experience host since 2018."
      }
    ],
    "portfolioImages": [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80"
    ],
    "serviceArea": "New Delhi Metropolitan Area",
    "thingsToKnow": [
      {
        "icon": "users",
        "title": "Guest requirements",
        "description": "All ages welcome (under 18 accompanied by an adult)."
      },
      {
        "icon": "shield",
        "title": "Cancellation policy",
        "description": "Free cancellation up to 24 hours before."
      }
    ],
    "whatYoullDo": [
      {
        "title": "Introduction & Orientation",
        "description": "Gather and preview the journey across Wazirabad.",
        "image": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
      }
    ],
    "availabilitySlots": [
      {
        "date": "Tomorrow, 8 September",
        "time": "10:00 am \u2013 1:00 pm",
        "availableSpots": 6,
        "totalSpots": 8
      },
      {
        "date": "Wednesday, 9 September",
        "time": "3:00 \u2013 6:00 pm",
        "availableSpots": 8,
        "totalSpots": 8
      }
    ],
    "reviews": [
      {
        "id": "rev-2901",
        "author": "Traveler",
        "location": "Global Guest",
        "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
        "rating": 5,
        "date": "July 2026",
        "comment": "Incredible session! One of our most memorable moments in New Delhi."
      }
    ],
    "section": "adventure"
  },
  {
    "id": "30",
    "title": "Rock Climbing & Bouldering at Dhauj Lake",
    "tagline": "Experience the soul of New Delhi through rock climbing & bouldering at dhauj lake.",
    "description": "Join us for an unforgettable authentic experience in New Delhi. You will be guided by an experienced host and immerse yourself in local culture, flavor, and hidden gems.",
    "location": "New Delhi, India",
    "neighborhood": "Faridabad",
    "city": "New Delhi",
    "country": "India",
    "category": "Adventure",
    "providerInfo": "Certified Rock Guide in New Delhi",
    "locationText": "Dhauj Camp",
    "pricePerGuest": 4200,
    "priceUnit": "guest",
    "currency": "\u20b9",
    "rating": 5.0,
    "reviewCount": 114,
    "duration": "2\u20133 hours",
    "language": "Hosted in English and local language",
    "meetingPoint": "Faridabad Landmark Station, New Delhi",
    "meetingCoordinates": {
      "lat": 28.6139,
      "lng": 77.209
    },
    "whatIsIncluded": [
      "All equipment & materials",
      "Tasting or finished deliverables",
      "Curated local guide notes"
    ],
    "guestCapacity": 8,
    "heroImage": "https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&w=1200&q=80",
    "images": [
      "https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80"
    ],
    "host": {
      "name": "Local Host 30",
      "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
      "role": "Certified Rock Guide",
      "description": "Passionate local specialist sharing authentic traditions in New Delhi.",
      "joinedYear": 2017
    },
    "qualifications": [
      {
        "icon": "star",
        "title": "10+ years experience in Adventure",
        "description": "Recognized expert and passionate educator in New Delhi."
      },
      {
        "icon": "graduation",
        "title": "Certified Professional Host",
        "description": "Top-rated Airbnb Experience host since 2018."
      }
    ],
    "portfolioImages": [
      "https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80"
    ],
    "serviceArea": "New Delhi Metropolitan Area",
    "thingsToKnow": [
      {
        "icon": "users",
        "title": "Guest requirements",
        "description": "All ages welcome (under 18 accompanied by an adult)."
      },
      {
        "icon": "shield",
        "title": "Cancellation policy",
        "description": "Free cancellation up to 24 hours before."
      }
    ],
    "whatYoullDo": [
      {
        "title": "Introduction & Orientation",
        "description": "Gather and preview the journey across Faridabad.",
        "image": "https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&w=1200&q=80"
      }
    ],
    "availabilitySlots": [
      {
        "date": "Tomorrow, 8 September",
        "time": "10:00 am \u2013 1:00 pm",
        "availableSpots": 6,
        "totalSpots": 8
      },
      {
        "date": "Wednesday, 9 September",
        "time": "3:00 \u2013 6:00 pm",
        "availableSpots": 8,
        "totalSpots": 8
      }
    ],
    "reviews": [
      {
        "id": "rev-3001",
        "author": "Traveler",
        "location": "Global Guest",
        "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
        "rating": 5,
        "date": "July 2026",
        "comment": "Incredible session! One of our most memorable moments in New Delhi."
      }
    ],
    "section": "adventure"
  },
  {
    "id": "31",
    "title": "Sunset Horseback Riding & Forest Trail",
    "tagline": "Experience the soul of New Delhi through sunset horseback riding & forest trail.",
    "description": "Join us for an unforgettable authentic experience in New Delhi. You will be guided by an experienced host and immerse yourself in local culture, flavor, and hidden gems.",
    "location": "New Delhi, India",
    "neighborhood": "Sultanpur",
    "city": "New Delhi",
    "country": "India",
    "category": "Adventure",
    "providerInfo": "Equestrian Trainer in New Delhi",
    "locationText": "Sultanpur Equestrian Center",
    "pricePerGuest": 4800,
    "priceUnit": "guest",
    "currency": "\u20b9",
    "rating": 4.96,
    "reviewCount": 117,
    "duration": "2\u20133 hours",
    "language": "Hosted in English and local language",
    "meetingPoint": "Sultanpur Landmark Station, New Delhi",
    "meetingCoordinates": {
      "lat": 28.6139,
      "lng": 77.209
    },
    "whatIsIncluded": [
      "All equipment & materials",
      "Tasting or finished deliverables",
      "Curated local guide notes"
    ],
    "guestCapacity": 8,
    "heroImage": "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80",
    "images": [
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80"
    ],
    "host": {
      "name": "Local Host 31",
      "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
      "role": "Equestrian Trainer",
      "description": "Passionate local specialist sharing authentic traditions in New Delhi.",
      "joinedYear": 2017
    },
    "qualifications": [
      {
        "icon": "star",
        "title": "10+ years experience in Adventure",
        "description": "Recognized expert and passionate educator in New Delhi."
      },
      {
        "icon": "graduation",
        "title": "Certified Professional Host",
        "description": "Top-rated Airbnb Experience host since 2018."
      }
    ],
    "portfolioImages": [
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80"
    ],
    "serviceArea": "New Delhi Metropolitan Area",
    "thingsToKnow": [
      {
        "icon": "users",
        "title": "Guest requirements",
        "description": "All ages welcome (under 18 accompanied by an adult)."
      },
      {
        "icon": "shield",
        "title": "Cancellation policy",
        "description": "Free cancellation up to 24 hours before."
      }
    ],
    "whatYoullDo": [
      {
        "title": "Introduction & Orientation",
        "description": "Gather and preview the journey across Sultanpur.",
        "image": "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80"
      }
    ],
    "availabilitySlots": [
      {
        "date": "Tomorrow, 8 September",
        "time": "10:00 am \u2013 1:00 pm",
        "availableSpots": 6,
        "totalSpots": 8
      },
      {
        "date": "Wednesday, 9 September",
        "time": "3:00 \u2013 6:00 pm",
        "availableSpots": 8,
        "totalSpots": 8
      }
    ],
    "reviews": [
      {
        "id": "rev-3101",
        "author": "Traveler",
        "location": "Global Guest",
        "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
        "rating": 5,
        "date": "July 2026",
        "comment": "Incredible session! One of our most memorable moments in New Delhi."
      }
    ],
    "section": "adventure"
  },
  {
    "id": "32",
    "title": "Hot Air Balloon Sunrise Float over Neemrana",
    "tagline": "Experience the soul of New Delhi through hot air balloon sunrise float over neemrana.",
    "description": "Join us for an unforgettable authentic experience in New Delhi. You will be guided by an experienced host and immerse yourself in local culture, flavor, and hidden gems.",
    "location": "New Delhi, India",
    "neighborhood": "Neemrana",
    "city": "New Delhi",
    "country": "India",
    "category": "Adventure",
    "providerInfo": "Commercial Balloon Pilot in New Delhi",
    "locationText": "Neemrana Fort Environs",
    "pricePerGuest": 12500,
    "priceUnit": "guest",
    "currency": "\u20b9",
    "rating": 4.96,
    "reviewCount": 120,
    "duration": "2\u20133 hours",
    "language": "Hosted in English and local language",
    "meetingPoint": "Neemrana Landmark Station, New Delhi",
    "meetingCoordinates": {
      "lat": 28.6139,
      "lng": 77.209
    },
    "whatIsIncluded": [
      "All equipment & materials",
      "Tasting or finished deliverables",
      "Curated local guide notes"
    ],
    "guestCapacity": 8,
    "heroImage": "https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?auto=format&fit=crop&w=1200&q=80",
    "images": [
      "https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80"
    ],
    "host": {
      "name": "Local Host 32",
      "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
      "role": "Commercial Balloon Pilot",
      "description": "Passionate local specialist sharing authentic traditions in New Delhi.",
      "joinedYear": 2017
    },
    "qualifications": [
      {
        "icon": "star",
        "title": "10+ years experience in Adventure",
        "description": "Recognized expert and passionate educator in New Delhi."
      },
      {
        "icon": "graduation",
        "title": "Certified Professional Host",
        "description": "Top-rated Airbnb Experience host since 2018."
      }
    ],
    "portfolioImages": [
      "https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80"
    ],
    "serviceArea": "New Delhi Metropolitan Area",
    "thingsToKnow": [
      {
        "icon": "users",
        "title": "Guest requirements",
        "description": "All ages welcome (under 18 accompanied by an adult)."
      },
      {
        "icon": "shield",
        "title": "Cancellation policy",
        "description": "Free cancellation up to 24 hours before."
      }
    ],
    "whatYoullDo": [
      {
        "title": "Introduction & Orientation",
        "description": "Gather and preview the journey across Neemrana.",
        "image": "https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?auto=format&fit=crop&w=1200&q=80"
      }
    ],
    "availabilitySlots": [
      {
        "date": "Tomorrow, 8 September",
        "time": "10:00 am \u2013 1:00 pm",
        "availableSpots": 6,
        "totalSpots": 8
      },
      {
        "date": "Wednesday, 9 September",
        "time": "3:00 \u2013 6:00 pm",
        "availableSpots": 8,
        "totalSpots": 8
      }
    ],
    "reviews": [
      {
        "id": "rev-3201",
        "author": "Traveler",
        "location": "Global Guest",
        "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
        "rating": 5,
        "date": "July 2026",
        "comment": "Incredible session! One of our most memorable moments in New Delhi."
      }
    ],
    "section": "adventure"
  },
  {
    "id": "33",
    "title": "Parisian Croissant & Macaron Masterclass",
    "tagline": "Experience the soul of Paris through parisian croissant & macaron masterclass.",
    "description": "Join us for an unforgettable authentic experience in Paris. You will be guided by an experienced host and immerse yourself in local culture, flavor, and hidden gems.",
    "location": "Paris, France",
    "neighborhood": "Le Marais",
    "city": "Paris",
    "country": "France",
    "category": "Food & drink",
    "providerInfo": "French Pastry Chef in Paris",
    "locationText": "At our Parisian Atelier",
    "pricePerGuest": 7500,
    "priceUnit": "guest",
    "currency": "\u20ac",
    "rating": 5.0,
    "reviewCount": 123,
    "duration": "2\u20133 hours",
    "language": "Hosted in English and local language",
    "meetingPoint": "Le Marais Landmark Station, Paris",
    "meetingCoordinates": {
      "lat": 48.8566,
      "lng": 2.3522
    },
    "whatIsIncluded": [
      "All equipment & materials",
      "Tasting or finished deliverables",
      "Curated local guide notes"
    ],
    "guestCapacity": 8,
    "heroImage": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80",
    "images": [
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80"
    ],
    "host": {
      "name": "Local Host 33",
      "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
      "role": "French Pastry Chef",
      "description": "Passionate local specialist sharing authentic traditions in Paris.",
      "joinedYear": 2017
    },
    "qualifications": [
      {
        "icon": "star",
        "title": "10+ years experience in Food & drink",
        "description": "Recognized expert and passionate educator in Paris."
      },
      {
        "icon": "graduation",
        "title": "Certified Professional Host",
        "description": "Top-rated Airbnb Experience host since 2018."
      }
    ],
    "portfolioImages": [
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80"
    ],
    "serviceArea": "Paris Metropolitan Area",
    "thingsToKnow": [
      {
        "icon": "users",
        "title": "Guest requirements",
        "description": "All ages welcome (under 18 accompanied by an adult)."
      },
      {
        "icon": "shield",
        "title": "Cancellation policy",
        "description": "Free cancellation up to 24 hours before."
      }
    ],
    "whatYoullDo": [
      {
        "title": "Introduction & Orientation",
        "description": "Gather and preview the journey across Le Marais.",
        "image": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80"
      }
    ],
    "availabilitySlots": [
      {
        "date": "Tomorrow, 8 September",
        "time": "10:00 am \u2013 1:00 pm",
        "availableSpots": 6,
        "totalSpots": 8
      },
      {
        "date": "Wednesday, 9 September",
        "time": "3:00 \u2013 6:00 pm",
        "availableSpots": 8,
        "totalSpots": 8
      }
    ],
    "reviews": [
      {
        "id": "rev-3301",
        "author": "Traveler",
        "location": "Global Guest",
        "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
        "rating": 5,
        "date": "July 2026",
        "comment": "Incredible session! One of our most memorable moments in Paris."
      }
    ],
    "section": "worldwide"
  },
  {
    "id": "34",
    "title": "Montmartre Golden Hour Portrait Walk",
    "tagline": "Experience the soul of Paris through montmartre golden hour portrait walk.",
    "description": "Join us for an unforgettable authentic experience in Paris. You will be guided by an experienced host and immerse yourself in local culture, flavor, and hidden gems.",
    "location": "Paris, France",
    "neighborhood": "Montmartre",
    "city": "Paris",
    "country": "France",
    "category": "Photography",
    "providerInfo": "Paris Fashion Photographer in Paris",
    "locationText": "Sacre-Coeur & Secret Stairs",
    "pricePerGuest": 9200,
    "priceUnit": "guest",
    "currency": "\u20ac",
    "rating": 4.96,
    "reviewCount": 126,
    "duration": "2\u20133 hours",
    "language": "Hosted in English and local language",
    "meetingPoint": "Montmartre Landmark Station, Paris",
    "meetingCoordinates": {
      "lat": 48.8566,
      "lng": 2.3522
    },
    "whatIsIncluded": [
      "All equipment & materials",
      "Tasting or finished deliverables",
      "Curated local guide notes"
    ],
    "guestCapacity": 8,
    "heroImage": "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80",
    "images": [
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80"
    ],
    "host": {
      "name": "Local Host 34",
      "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
      "role": "Paris Fashion Photographer",
      "description": "Passionate local specialist sharing authentic traditions in Paris.",
      "joinedYear": 2017
    },
    "qualifications": [
      {
        "icon": "camera",
        "title": "10+ years experience in Photography",
        "description": "Recognized expert and passionate educator in Paris."
      },
      {
        "icon": "graduation",
        "title": "Certified Professional Host",
        "description": "Top-rated Airbnb Experience host since 2018."
      }
    ],
    "portfolioImages": [
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80"
    ],
    "serviceArea": "Paris Metropolitan Area",
    "thingsToKnow": [
      {
        "icon": "users",
        "title": "Guest requirements",
        "description": "All ages welcome (under 18 accompanied by an adult)."
      },
      {
        "icon": "shield",
        "title": "Cancellation policy",
        "description": "Free cancellation up to 24 hours before."
      }
    ],
    "whatYoullDo": [
      {
        "title": "Introduction & Orientation",
        "description": "Gather and preview the journey across Montmartre.",
        "image": "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80"
      }
    ],
    "availabilitySlots": [
      {
        "date": "Tomorrow, 8 September",
        "time": "10:00 am \u2013 1:00 pm",
        "availableSpots": 6,
        "totalSpots": 8
      },
      {
        "date": "Wednesday, 9 September",
        "time": "3:00 \u2013 6:00 pm",
        "availableSpots": 8,
        "totalSpots": 8
      }
    ],
    "reviews": [
      {
        "id": "rev-3401",
        "author": "Traveler",
        "location": "Global Guest",
        "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
        "rating": 5,
        "date": "July 2026",
        "comment": "Incredible session! One of our most memorable moments in Paris."
      }
    ],
    "section": "worldwide"
  },
  {
    "id": "35",
    "title": "Traditional Kyoto Matcha Ceremony & Kimono",
    "tagline": "Experience the soul of Kyoto through traditional kyoto matcha ceremony & kimono.",
    "description": "Join us for an unforgettable authentic experience in Kyoto. You will be guided by an experienced host and immerse yourself in local culture, flavor, and hidden gems.",
    "location": "Kyoto, Japan",
    "neighborhood": "Gion",
    "city": "Kyoto",
    "country": "Japan",
    "category": "Culture & history",
    "providerInfo": "Licensed Tea Master in Kyoto",
    "locationText": "Century-old Machiya",
    "pricePerGuest": 6800,
    "priceUnit": "guest",
    "currency": "\u00a5",
    "rating": 4.96,
    "reviewCount": 129,
    "duration": "2\u20133 hours",
    "language": "Hosted in English and local language",
    "meetingPoint": "Gion Landmark Station, Kyoto",
    "meetingCoordinates": {
      "lat": 48.8566,
      "lng": 2.3522
    },
    "whatIsIncluded": [
      "All equipment & materials",
      "Tasting or finished deliverables",
      "Curated local guide notes"
    ],
    "guestCapacity": 8,
    "heroImage": "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80",
    "images": [
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80"
    ],
    "host": {
      "name": "Local Host 35",
      "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
      "role": "Licensed Tea Master",
      "description": "Passionate local specialist sharing authentic traditions in Kyoto.",
      "joinedYear": 2017
    },
    "qualifications": [
      {
        "icon": "star",
        "title": "10+ years experience in Culture & history",
        "description": "Recognized expert and passionate educator in Kyoto."
      },
      {
        "icon": "graduation",
        "title": "Certified Professional Host",
        "description": "Top-rated Airbnb Experience host since 2018."
      }
    ],
    "portfolioImages": [
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80"
    ],
    "serviceArea": "Kyoto Metropolitan Area",
    "thingsToKnow": [
      {
        "icon": "users",
        "title": "Guest requirements",
        "description": "All ages welcome (under 18 accompanied by an adult)."
      },
      {
        "icon": "shield",
        "title": "Cancellation policy",
        "description": "Free cancellation up to 24 hours before."
      }
    ],
    "whatYoullDo": [
      {
        "title": "Introduction & Orientation",
        "description": "Gather and preview the journey across Gion.",
        "image": "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80"
      }
    ],
    "availabilitySlots": [
      {
        "date": "Tomorrow, 8 September",
        "time": "10:00 am \u2013 1:00 pm",
        "availableSpots": 6,
        "totalSpots": 8
      },
      {
        "date": "Wednesday, 9 September",
        "time": "3:00 \u2013 6:00 pm",
        "availableSpots": 8,
        "totalSpots": 8
      }
    ],
    "reviews": [
      {
        "id": "rev-3501",
        "author": "Traveler",
        "location": "Global Guest",
        "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
        "rating": 5,
        "date": "July 2026",
        "comment": "Incredible session! One of our most memorable moments in Kyoto."
      }
    ],
    "section": "worldwide"
  },
  {
    "id": "36",
    "title": "Secret Rooftop Jazz & Wine Tasting in Rome",
    "tagline": "Experience the soul of Rome through secret rooftop jazz & wine tasting in rome.",
    "description": "Join us for an unforgettable authentic experience in Rome. You will be guided by an experienced host and immerse yourself in local culture, flavor, and hidden gems.",
    "location": "Rome, Italy",
    "neighborhood": "Trastevere",
    "city": "Rome",
    "country": "Italy",
    "category": "Food & drink",
    "providerInfo": "Sommelier & Jazz Musician in Rome",
    "locationText": "Trastevere Rooftop",
    "pricePerGuest": 8400,
    "priceUnit": "guest",
    "currency": "\u20ac",
    "rating": 5.0,
    "reviewCount": 132,
    "duration": "2\u20133 hours",
    "language": "Hosted in English and local language",
    "meetingPoint": "Trastevere Landmark Station, Rome",
    "meetingCoordinates": {
      "lat": 48.8566,
      "lng": 2.3522
    },
    "whatIsIncluded": [
      "All equipment & materials",
      "Tasting or finished deliverables",
      "Curated local guide notes"
    ],
    "guestCapacity": 8,
    "heroImage": "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=80",
    "images": [
      "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80"
    ],
    "host": {
      "name": "Local Host 36",
      "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
      "role": "Sommelier & Jazz Musician",
      "description": "Passionate local specialist sharing authentic traditions in Rome.",
      "joinedYear": 2017
    },
    "qualifications": [
      {
        "icon": "star",
        "title": "10+ years experience in Food & drink",
        "description": "Recognized expert and passionate educator in Rome."
      },
      {
        "icon": "graduation",
        "title": "Certified Professional Host",
        "description": "Top-rated Airbnb Experience host since 2018."
      }
    ],
    "portfolioImages": [
      "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80"
    ],
    "serviceArea": "Rome Metropolitan Area",
    "thingsToKnow": [
      {
        "icon": "users",
        "title": "Guest requirements",
        "description": "All ages welcome (under 18 accompanied by an adult)."
      },
      {
        "icon": "shield",
        "title": "Cancellation policy",
        "description": "Free cancellation up to 24 hours before."
      }
    ],
    "whatYoullDo": [
      {
        "title": "Introduction & Orientation",
        "description": "Gather and preview the journey across Trastevere.",
        "image": "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=80"
      }
    ],
    "availabilitySlots": [
      {
        "date": "Tomorrow, 8 September",
        "time": "10:00 am \u2013 1:00 pm",
        "availableSpots": 6,
        "totalSpots": 8
      },
      {
        "date": "Wednesday, 9 September",
        "time": "3:00 \u2013 6:00 pm",
        "availableSpots": 8,
        "totalSpots": 8
      }
    ],
    "reviews": [
      {
        "id": "rev-3601",
        "author": "Traveler",
        "location": "Global Guest",
        "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
        "rating": 5,
        "date": "July 2026",
        "comment": "Incredible session! One of our most memorable moments in Rome."
      }
    ],
    "section": "worldwide"
  },
  {
    "id": "37",
    "title": "Tokyo Neon Cyberpunk Night Photo Tour",
    "tagline": "Experience the soul of Tokyo through tokyo neon cyberpunk night photo tour.",
    "description": "Join us for an unforgettable authentic experience in Tokyo. You will be guided by an experienced host and immerse yourself in local culture, flavor, and hidden gems.",
    "location": "Tokyo, Japan",
    "neighborhood": "Shinjuku",
    "city": "Tokyo",
    "country": "Japan",
    "category": "Photography",
    "providerInfo": "Tokyo Night Photographer in Tokyo",
    "locationText": "Omoide Yokocho & Kabukicho",
    "pricePerGuest": 8900,
    "priceUnit": "guest",
    "currency": "\u00a5",
    "rating": 4.96,
    "reviewCount": 135,
    "duration": "2\u20133 hours",
    "language": "Hosted in English and local language",
    "meetingPoint": "Shinjuku Landmark Station, Tokyo",
    "meetingCoordinates": {
      "lat": 48.8566,
      "lng": 2.3522
    },
    "whatIsIncluded": [
      "All equipment & materials",
      "Tasting or finished deliverables",
      "Curated local guide notes"
    ],
    "guestCapacity": 8,
    "heroImage": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80",
    "images": [
      "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80"
    ],
    "host": {
      "name": "Local Host 37",
      "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
      "role": "Tokyo Night Photographer",
      "description": "Passionate local specialist sharing authentic traditions in Tokyo.",
      "joinedYear": 2017
    },
    "qualifications": [
      {
        "icon": "camera",
        "title": "10+ years experience in Photography",
        "description": "Recognized expert and passionate educator in Tokyo."
      },
      {
        "icon": "graduation",
        "title": "Certified Professional Host",
        "description": "Top-rated Airbnb Experience host since 2018."
      }
    ],
    "portfolioImages": [
      "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80"
    ],
    "serviceArea": "Tokyo Metropolitan Area",
    "thingsToKnow": [
      {
        "icon": "users",
        "title": "Guest requirements",
        "description": "All ages welcome (under 18 accompanied by an adult)."
      },
      {
        "icon": "shield",
        "title": "Cancellation policy",
        "description": "Free cancellation up to 24 hours before."
      }
    ],
    "whatYoullDo": [
      {
        "title": "Introduction & Orientation",
        "description": "Gather and preview the journey across Shinjuku.",
        "image": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80"
      }
    ],
    "availabilitySlots": [
      {
        "date": "Tomorrow, 8 September",
        "time": "10:00 am \u2013 1:00 pm",
        "availableSpots": 6,
        "totalSpots": 8
      },
      {
        "date": "Wednesday, 9 September",
        "time": "3:00 \u2013 6:00 pm",
        "availableSpots": 8,
        "totalSpots": 8
      }
    ],
    "reviews": [
      {
        "id": "rev-3701",
        "author": "Traveler",
        "location": "Global Guest",
        "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
        "rating": 5,
        "date": "July 2026",
        "comment": "Incredible session! One of our most memorable moments in Tokyo."
      }
    ],
    "section": "worldwide"
  },
  {
    "id": "38",
    "title": "Santorini Cliffside Wine & Caldera Sunset",
    "tagline": "Experience the soul of Santorini through santorini cliffside wine & caldera sunset.",
    "description": "Join us for an unforgettable authentic experience in Santorini. You will be guided by an experienced host and immerse yourself in local culture, flavor, and hidden gems.",
    "location": "Santorini, Greece",
    "neighborhood": "Oia",
    "city": "Santorini",
    "country": "Greece",
    "category": "Food & drink",
    "providerInfo": "Aegean Enologist in Santorini",
    "locationText": "Cliffside Vineyard",
    "pricePerGuest": 9600,
    "priceUnit": "guest",
    "currency": "\u20ac",
    "rating": 4.96,
    "reviewCount": 138,
    "duration": "2\u20133 hours",
    "language": "Hosted in English and local language",
    "meetingPoint": "Oia Landmark Station, Santorini",
    "meetingCoordinates": {
      "lat": 48.8566,
      "lng": 2.3522
    },
    "whatIsIncluded": [
      "All equipment & materials",
      "Tasting or finished deliverables",
      "Curated local guide notes"
    ],
    "guestCapacity": 8,
    "heroImage": "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80",
    "images": [
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80"
    ],
    "host": {
      "name": "Local Host 38",
      "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
      "role": "Aegean Enologist",
      "description": "Passionate local specialist sharing authentic traditions in Santorini.",
      "joinedYear": 2017
    },
    "qualifications": [
      {
        "icon": "star",
        "title": "10+ years experience in Food & drink",
        "description": "Recognized expert and passionate educator in Santorini."
      },
      {
        "icon": "graduation",
        "title": "Certified Professional Host",
        "description": "Top-rated Airbnb Experience host since 2018."
      }
    ],
    "portfolioImages": [
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80"
    ],
    "serviceArea": "Santorini Metropolitan Area",
    "thingsToKnow": [
      {
        "icon": "users",
        "title": "Guest requirements",
        "description": "All ages welcome (under 18 accompanied by an adult)."
      },
      {
        "icon": "shield",
        "title": "Cancellation policy",
        "description": "Free cancellation up to 24 hours before."
      }
    ],
    "whatYoullDo": [
      {
        "title": "Introduction & Orientation",
        "description": "Gather and preview the journey across Oia.",
        "image": "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80"
      }
    ],
    "availabilitySlots": [
      {
        "date": "Tomorrow, 8 September",
        "time": "10:00 am \u2013 1:00 pm",
        "availableSpots": 6,
        "totalSpots": 8
      },
      {
        "date": "Wednesday, 9 September",
        "time": "3:00 \u2013 6:00 pm",
        "availableSpots": 8,
        "totalSpots": 8
      }
    ],
    "reviews": [
      {
        "id": "rev-3801",
        "author": "Traveler",
        "location": "Global Guest",
        "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
        "rating": 5,
        "date": "July 2026",
        "comment": "Incredible session! One of our most memorable moments in Santorini."
      }
    ],
    "section": "worldwide"
  }
];
