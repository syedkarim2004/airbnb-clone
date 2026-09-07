"""
seed.py — Populate the database with realistic sample data for development.

Run:  python seed.py

Creates airbnb.db (if it doesn't exist), builds the schema, and inserts
a realistic dataset of 25 listings (24 active + 1 inactive) spanning 10 global/regional destinations,
multiple hosts, guests, image sets with positions, reviews, bookings, and favorites.
"""

import os
import sys

from database import DEFAULT_DB_PATH, init_db


def populate_seed_data(conn) -> None:
    """Populate initial seed dataset into the provided open connection."""
    cur = conn.cursor()

    # ── 1. Users (Hosts, Guests, and Both) ─────────────────────────────────
    users = [
        # Original 4 users (ids: 1..4)
        ("Alice Martin", "alice@example.com", "host"),
        ("Bob Chen", "bob@example.com", "host"),
        ("Carol Davis", "carol@example.com", "guest"),
        ("David Wilson", "david@example.com", "both"),
        # Additional Hosts (ids: 5..8)
        ("Priya Sharma", "priya.sharma@example.com", "host"),
        ("Vikram Malhotra", "vikram.malhotra@example.com", "host"),
        ("Elena Rossi", "elena.rossi@example.com", "host"),
        ("Kenji Sato", "kenji.sato@example.com", "host"),
        # Additional Both (id: 9)
        ("Rohan Mehra", "rohan.mehra@example.com", "both"),
        # Additional Guests (ids: 10..13)
        ("Marcus Vance", "marcus.vance@example.com", "guest"),
        ("Sophia Dubois", "sophia.dubois@example.com", "guest"),
        ("Ananya Patel", "ananya.patel@example.com", "guest"),
        ("Liam O'Connor", "liam.oconnor@example.com", "guest"),
    ]
    cur.executemany(
        "INSERT INTO users (name, email, role) VALUES (?, ?, ?)", users
    )
    print(f"Inserted {len(users)} users")

    # ── 2. Listings (24 Active + 1 Inactive) ───────────────────────────────
    # (host_id, title, description, city, country, lat, lng, price, cleaning, max_guests, is_active)
    # Valid hosts: 1 (Alice), 2 (Bob), 4 (David), 5 (Priya), 6 (Vikram), 7 (Elena), 8 (Kenji), 9 (Rohan)
    listings = [
        # ── Paris, France (3 active) ──
        (1, "Cozy Apartment near Eiffel Tower",
         "Charming one-bedroom apartment in the heart of Paris with classic parquet floors and balcony views of the Eiffel Tower.",
         "Paris", "France", 48.8584, 2.2945, 120.0, 30.0, 2, 1),

        (1, "Modern Loft in Le Marais",
         "Sun-drenched architectural loft featuring exposed timber beams, industrial finishes, and designer furniture in historic Le Marais.",
         "Paris", "France", 48.8590, 2.3600, 155.0, 35.0, 3, 1),

        (7, "Haussmannian Flat near Montmartre",
         "Spacious Parisian residence with high molded ceilings, marble fireplace, and floor-to-ceiling French windows minutes from Sacré-Cœur.",
         "Paris", "France", 48.8867, 2.3431, 185.0, 40.0, 4, 1),

        # ── Tokyo, Japan (3 active) ──
        (2, "Traditional Townhouse in Shibuya",
         "Authentic two-story machiya townhouse with tatami mats, sliding shoji screens, and a serene private bamboo courtyard garden.",
         "Tokyo", "Japan", 35.6618, 139.7041, 95.0, 25.0, 4, 1),

        (8, "Minimalist Designer Studio in Shinjuku",
         "Sleek, ultra-efficient modern studio featuring smart home automation, custom built-ins, and floor-to-ceiling city views.",
         "Tokyo", "Japan", 35.6938, 139.7034, 85.0, 20.0, 2, 1),

        (8, "Modern High-Rise Suite with Skyline Views",
         "Luxury 35th-floor executive corner apartment overlooking Tokyo Tower with panoramic floor-to-ceiling glass and deep soaking tub.",
         "Tokyo", "Japan", 35.6586, 139.7454, 210.0, 45.0, 4, 1),

        # ── Bali, Indonesia (3 active) ──
        (2, "Beachfront Luxury Villa in Seminyak",
         "Exclusive 3-bedroom private sanctuary with open-air tropical living pavilion, turquoise plunge pool, and direct sandy beach access.",
         "Bali", "Indonesia", -8.6913, 115.1588, 225.0, 50.0, 6, 1),

        (4, "Tropical Bamboo Eco-Cottage in Ubud",
         "Handcrafted two-story bamboo treehouse nestled above lush rice paddies with gentle breezes, outdoor shower, and peaceful sunrise vistas.",
         "Bali", "Indonesia", -8.5069, 115.2625, 75.0, 20.0, 2, 1),

        (7, "Clifftop Infinity Pool Villa in Uluwatu",
         "Spectacular oceanfront estate perched 100 meters above the Indian Ocean with private chef service, clifftop deck, and sunset panoramas.",
         "Bali", "Indonesia", -8.8149, 115.0884, 310.0, 60.0, 8, 1),

        # ── New York, USA (3 active) ──
        (4, "Midtown Manhattan Studio with Skyline Views",
         "Light-filled designer studio on the 28th floor in Midtown with polished hardwood floors, full kitchen, and views of the Empire State Building.",
         "New York", "USA", 40.7549, -73.9840, 180.0, 40.0, 2, 1),

        (1, "Historic Brownstone Suite in Brooklyn",
         "Original details abound in this parlor-floor suite featuring exposed brick, decorative fireplaces, and a leafy private backyard in Fort Greene.",
         "New York", "USA", 40.6925, -73.9742, 145.0, 35.0, 3, 1),

        (4, "Penthouse Loft in SoHo",
         "Exclusive full-floor cast-iron loft with soaring 14-foot ceilings, oversized windows, exposed brick, chef kitchen, and private rooftop terrace.",
         "New York", "USA", 40.7233, -74.0030, 360.0, 75.0, 5, 1),

        # ── Interlaken, Switzerland (2 active) ──
        (4, "Rustic Alpine Chalet with Mountain Views",
         "Cozy timber chalet nestled beneath the Eiger and Jungfrau peaks with stone fireplace, heated pine floors, and wraparound sun deck.",
         "Interlaken", "Switzerland", 46.6863, 7.8632, 165.0, 40.0, 5, 1),

        (7, "Lakeside Wooden Cabin near Lake Brienz",
         "Peaceful waterfront cabin right at the water edge with private rowboat, outdoor fondue kettle, and stunning glacier water reflections.",
         "Interlaken", "Switzerland", 46.7020, 7.9150, 190.0, 45.0, 4, 1),

        # ── Goa, India (3 active) ──
        (5, "Heritage Portuguese Villa with Private Pool",
         "Restored 150-year-old Goan-Portuguese estate in Assagao with antique rosewood furniture, private courtyard pool, and lush bougainvillea.",
         "Goa", "India", 15.5898, 73.7744, 175.0, 30.0, 6, 1),

        (5, "Sunlit Beachside Cottage in Anjuna",
         "Breezy coastal cottage steps from Anjuna beach featuring open-air kitchenette, hammock patio, outdoor shower, and swaying coconut palms.",
         "Goa", "India", 15.5786, 73.7420, 90.0, 20.0, 3, 1),

        (6, "Luxury Sea-View Apartment in Candolim",
         "Modern third-floor condo with infinity pool access, floor-to-ceiling glass doors, and panoramic views of the Arabian Sea.",
         "Goa", "India", 15.5173, 73.7667, 130.0, 25.0, 4, 1),

        # ── Noida, India (2 active) ──
        (6, "Contemporary Serviced Flat in Sector 62",
         "Smart two-bedroom apartment near IT hubs with high-speed fiber WiFi, dedicated workstation, modular kitchen, and 24/7 security.",
         "Noida", "India", 28.6258, 77.3653, 65.0, 15.0, 3, 1),

        (9, "Spacious Executive Penthouse in Sector 75",
         "Premium top-floor duplex with expansive city terrace, designer lighting, home theatre corner, and covered reserved parking.",
         "Noida", "India", 28.5672, 77.3789, 110.0, 25.0, 5, 1),

        # ── Dehradun, India (2 active) ──
        (6, "Colonial Hillside Retreat near Rajpur",
         "Historic colonial-style villa surrounded by lychee orchards with spacious stone verandas, fireplace, and fresh mountain air.",
         "Dehradun", "India", 30.3842, 78.0934, 80.0, 20.0, 4, 1),

        (5, "Pine Forest Wooden Cottage in Mussoorie Foothills",
         "Peaceful wooden sanctuary among Himalayan pines with floor-to-ceiling glass, private barbecue deck, and nature trails from the doorstep.",
         "Dehradun", "India", 30.4055, 78.0782, 95.0, 20.0, 4, 1),

        # ── Gurgaon, India (2 active) ──
        (9, "Modern High-Rise Apartment on Golf Course Road",
         "Upscale 2-bedroom luxury condo overlooking the golf greens with gym access, club amenities, and 5 minutes to DLF Phase 5.",
         "Gurgaon", "India", 28.4595, 77.0975, 105.0, 25.0, 3, 1),

        (9, "Minimalist Urban Studio near Cyber City",
         "Efficient, cozy design studio tailored for business travelers and digital nomads with ergonomic desk, fast WiFi, and metro proximity.",
         "Gurgaon", "India", 28.4908, 77.0902, 70.0, 15.0, 2, 1),

        # ── Rishikesh, India (1 active) ──
        (5, "Riverside Yoga Sanctuary overlooking the Ganges",
         "Peaceful spiritual haven on the banks of the sacred Ganges with meditation deck, organic herb garden, and mountain sunset views.",
         "Rishikesh", "India", 30.1250, 78.3200, 85.0, 20.0, 4, 1),

        # ── London, UK (1 INACTIVE listing for soft-delete testing) ──
        (1, "Charming Victorian Mews House in Kensington",
         "Delightful cobblestone mews property currently undergoing interior refurbishment, featuring quiet courtyard and period charm.",
         "London", "UK", 51.5014, -0.1917, 240.0, 50.0, 4, 0),
    ]

    cur.executemany(
        """INSERT INTO listings
           (host_id, title, description, city, country,
            latitude, longitude, price_per_night, cleaning_fee, max_guests, is_active)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
        listings,
    )
    print(f"Inserted {len(listings)} listings (24 active, 1 inactive)")

    # ── 3. Listing Images (3 to 5 images per listing) ───────────────────────
    images = [
        # Listing 1: Paris Cozy
        (1, "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80", "Eiffel Tower view from balcony", 0),
        (1, "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80", "Comfortable living room", 1),
        (1, "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80", "Serene bedroom", 2),
        (1, "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80", "Equipped kitchen", 3),

        # Listing 2: Paris Loft
        (2, "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80", "Spacious open loft area", 0),
        (2, "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80", "Living room with wood beams", 1),
        (2, "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80", "Courtyard garden view", 2),
        (2, "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80", "Modern breakfast bar", 3),

        # Listing 3: Paris Haussmannian
        (3, "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80", "High ceilings and French windows", 0),
        (3, "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80", "Formal dining room", 1),
        (3, "https://images.unsplash.com/photo-1540518614846-7ede433c4b18?auto=format&fit=crop&w=800&q=80", "Master bedroom with fireplace", 2),
        (3, "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=80", "Balcony overlooking Parisian street", 3),

        # Listing 4: Tokyo Shibuya
        (4, "https://images.unsplash.com/photo-1480796927426-f609979314bd?auto=format&fit=crop&w=800&q=80", "Traditional Tokyo townhouse entrance", 0),
        (4, "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80", "Tatami tea room", 1),
        (4, "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=800&q=80", "Private bamboo courtyard", 2),
        (4, "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80", "Japanese dining corner", 3),

        # Listing 5: Tokyo Shinjuku
        (5, "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80", "Tokyo cityscape from window", 0),
        (5, "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80", "Minimalist studio interior", 1),
        (5, "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=800&q=80", "Platform bed and lighting", 2),

        # Listing 6: Tokyo Skyline
        (6, "https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=800&q=80", "Stunning Tokyo night view", 0),
        (6, "https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=800&q=80", "Executive corner living room", 1),
        (6, "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80", "Master bedroom panoramic view", 2),
        (6, "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80", "Deep soaking Japanese bath", 3),

        # Listing 7: Bali Seminyak
        (7, "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80", "Beachfront villa exterior", 0),
        (7, "https://images.unsplash.com/photo-1570213489059-0aac6626cade?auto=format&fit=crop&w=800&q=80", "Private plunge pool", 1),
        (7, "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80", "Open-air living pavilion", 2),
        (7, "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80", "Outdoor garden bathroom", 3),

        # Listing 8: Bali Bamboo
        (8, "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800&q=80", "Bamboo treehouse above paddies", 0),
        (8, "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80", "Rice terrace sunrise view", 1),
        (8, "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80", "Open-air bamboo bedroom", 2),
        (8, "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80", "Eco hammock lounge", 3),

        # Listing 9: Bali Uluwatu
        (9, "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80", "Clifftop infinity pool overlooking sea", 0),
        (9, "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=800&q=80", "Luxury living room pavilion", 1),
        (9, "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80", "Master suite oceanfront", 2),
        (9, "https://images.unsplash.com/photo-1544984243-ec57ea16fe25?auto=format&fit=crop&w=800&q=80", "Sunset cocktail terrace", 3),

        # Listing 10: NYC Studio
        (10, "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80", "Midtown Manhattan cityscape", 0),
        (10, "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80", "Sunlit studio interior", 1),
        (10, "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80", "Cozy queen bed nook", 2),
        (10, "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80", "Sleek stainless kitchen", 3),

        # Listing 11: NYC Brownstone
        (11, "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80", "Classic Brooklyn brownstone facade", 0),
        (11, "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80", "Exposed brick parlor room", 1),
        (11, "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80", "Private leafy garden patio", 2),

        # Listing 12: NYC SoHo Loft
        (12, "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=800&q=80", "Grand SoHo cast-iron loft", 0),
        (12, "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80", "Private landscaped rooftop", 1),
        (12, "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80", "Gourmet chef kitchen island", 2),
        (12, "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80", "Primary suite with walk-in closet", 3),

        # Listing 13: Interlaken Chalet
        (13, "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=800&q=80", "Swiss alpine chalet in snow", 0),
        (13, "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&w=800&q=80", "Panoramic Alps mountain view", 1),
        (13, "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80", "Warm timber wood interior", 2),
        (13, "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80", "Cozy stone fireplace lounge", 3),

        # Listing 14: Interlaken Lake Cabin
        (14, "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80", "Turquoise Lake Brienz waterfront", 0),
        (14, "https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=800&q=80", "Private boat dock and deck", 1),
        (14, "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=800&q=80", "Lakeside dining area", 2),
        (14, "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80", "Mountain sunset reflection", 3),

        # Listing 15: Goa Portuguese Villa
        (15, "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=800&q=80", "Colonial Goan villa and private pool", 0),
        (15, "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80", "Arched balcony with garden views", 1),
        (15, "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80", "Four-poster bed master suite", 2),
        (15, "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80", "Tropical garden courtyard", 3),

        # Listing 16: Goa Beachside Cottage
        (16, "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80", "Beachside cottage under coconut palms", 0),
        (16, "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80", "Sunny outdoor sit-out", 1),
        (16, "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80", "Airy coastal bedroom", 2),

        # Listing 17: Goa Sea-View Apartment
        (17, "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=800&q=80", "Modern sea-view apartment balcony", 0),
        (17, "https://images.unsplash.com/photo-1570213489059-0aac6626cade?auto=format&fit=crop&w=800&q=80", "Rooftop infinity pool", 1),
        (17, "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80", "Bright open living room", 2),
        (17, "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80", "Ocean-facing bedroom", 3),

        # Listing 18: Noida Sector 62 Flat
        (18, "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80", "Modern serviced apartment living", 0),
        (18, "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80", "Clean modular kitchen", 1),
        (18, "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80", "Quiet master bedroom", 2),

        # Listing 19: Noida Sector 75 Penthouse
        (19, "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80", "Expansive terrace view of skyline", 0),
        (19, "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80", "Double-height living lounge", 1),
        (19, "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80", "Executive suite with balcony", 2),
        (19, "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80", "Dining room for entertaining", 3),

        # Listing 20: Dehradun Colonial Retreat
        (20, "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80", "Colonial bungalow in green valley", 0),
        (20, "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80", "Heritage living room with fireplace", 1),
        (20, "https://images.unsplash.com/photo-1540518614846-7ede433c4b18?auto=format&fit=crop&w=800&q=80", "Large sunlit bedroom", 2),
        (20, "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&w=800&q=80", "Mountain orchard surroundings", 3),

        # Listing 21: Dehradun Pine Cottage
        (21, "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=800&q=80", "Wooden cabin among Himalayan pines", 0),
        (21, "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80", "Rustic wooden living room", 1),
        (21, "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80", "Forest view observation deck", 2),
        (21, "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80", "Upper attic bedroom", 3),

        # Listing 22: Gurgaon Golf Course Road
        (22, "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80", "Luxury high-rise tower exterior", 0),
        (22, "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80", "Designer minimalist living area", 1),
        (22, "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80", "Sleek kitchen island", 2),

        # Listing 23: Gurgaon Studio
        (23, "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=800&q=80", "Modern compact studio apartment", 0),
        (23, "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80", "Dedicated workstation setup", 1),
        (23, "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80", "Plush queen mattress", 2),

        # Listing 24: Rishikesh Yoga Sanctuary
        (24, "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80", "Breathtaking Ganges river view", 0),
        (24, "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80", "Covered open-air yoga deck", 1),
        (24, "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80", "Peaceful veranda with river sound", 2),
        (24, "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80", "Clean natural bedroom", 3),

        # Listing 25: London Inactive Mews
        (25, "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80", "Historic Victorian mews street", 0),
        (25, "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80", "Renovating interior space", 1),
    ]

    cur.executemany(
        "INSERT INTO listing_images (listing_id, url, caption, position) VALUES (?, ?, ?, ?)",
        images,
    )
    print(f"Inserted {len(images)} listing images with explicit position ordering")

    # ── 4. Amenities ───────────────────────────────────────────────────────
    amenity_names = [
        "WiFi", "Kitchen", "Air Conditioning", "Heating",
        "Pool", "Free Parking", "Washer", "TV", "Dedicated Workspace",
    ]
    cur.executemany(
        "INSERT INTO amenities (name) VALUES (?)",
        [(name,) for name in amenity_names],
    )
    print(f"Inserted {len(amenity_names)} amenities")

    # ── 5. Listing ↔ Amenity Links ─────────────────────────────────────────
    # (1: WiFi, 2: Kitchen, 3: AC, 4: Heating, 5: Pool, 6: Parking, 7: Washer, 8: TV, 9: Workspace)
    pairs = [
        # Listing 1 (Paris Cozy): WiFi, Kitchen, Heating, TV
        (1, 1), (1, 2), (1, 4), (1, 8),
        # Listing 2 (Paris Loft): WiFi, Kitchen, AC, Washer, TV, Workspace
        (2, 1), (2, 2), (2, 3), (2, 7), (2, 8), (2, 9),
        # Listing 3 (Paris Haussmannian): WiFi, Kitchen, Heating, Washer, TV
        (3, 1), (3, 2), (3, 4), (3, 7), (3, 8),

        # Listing 4 (Tokyo Shibuya): WiFi, AC, Heating, Washer
        (4, 1), (4, 3), (4, 4), (4, 7),
        # Listing 5 (Tokyo Shinjuku): WiFi, AC, Washer, TV, Workspace
        (5, 1), (5, 3), (5, 7), (5, 8), (5, 9),
        # Listing 6 (Tokyo Skyline): WiFi, Kitchen, AC, Heating, Washer, TV, Workspace
        (6, 1), (6, 2), (6, 3), (6, 4), (6, 7), (6, 8), (6, 9),

        # Listing 7 (Bali Seminyak): WiFi, Kitchen, AC, Pool, Parking, TV
        (7, 1), (7, 2), (7, 3), (7, 5), (7, 6), (7, 8),
        # Listing 8 (Bali Bamboo): WiFi, Pool, Parking
        (8, 1), (8, 5), (8, 6),
        # Listing 9 (Bali Uluwatu): WiFi, Kitchen, AC, Pool, Parking, TV, Workspace
        (9, 1), (9, 2), (9, 3), (9, 5), (9, 6), (9, 8), (9, 9),

        # Listing 10 (NYC Studio): WiFi, AC, Heating, TV, Workspace
        (10, 1), (10, 3), (10, 4), (10, 8), (10, 9),
        # Listing 11 (NYC Brownstone): WiFi, Kitchen, AC, Heating, Washer
        (11, 1), (11, 2), (11, 3), (11, 4), (11, 7),
        # Listing 12 (NYC SoHo): WiFi, Kitchen, AC, Heating, Washer, TV, Workspace
        (12, 1), (12, 2), (12, 3), (12, 4), (12, 7), (12, 8), (12, 9),

        # Listing 13 (Interlaken Chalet): Kitchen, Heating, Parking, Washer, TV
        (13, 2), (13, 4), (13, 6), (13, 7), (13, 8),
        # Listing 14 (Interlaken Lake Cabin): Kitchen, Heating, Parking, WiFi
        (14, 1), (14, 2), (14, 4), (14, 6),

        # Listing 15 (Goa Portuguese Villa): WiFi, Kitchen, AC, Pool, Parking, Washer, TV
        (15, 1), (15, 2), (15, 3), (15, 5), (15, 6), (15, 7), (15, 8),
        # Listing 16 (Goa Beachside Cottage): WiFi, AC, Parking
        (16, 1), (16, 3), (16, 6),
        # Listing 17 (Goa Sea-View Apartment): WiFi, Kitchen, AC, Pool, Parking, TV
        (17, 1), (17, 2), (17, 3), (17, 5), (17, 6), (17, 8),

        # Listing 18 (Noida Sector 62): WiFi, Kitchen, AC, Washer, TV, Workspace
        (18, 1), (18, 2), (18, 3), (18, 7), (18, 8), (18, 9),
        # Listing 19 (Noida Sector 75): WiFi, Kitchen, AC, Parking, Washer, TV, Workspace
        (19, 1), (19, 2), (19, 3), (19, 6), (19, 7), (19, 8), (19, 9),

        # Listing 20 (Dehradun Colonial): Kitchen, Heating, Parking, Washer, TV
        (20, 2), (20, 4), (20, 6), (20, 7), (20, 8),
        # Listing 21 (Dehradun Pine): Kitchen, Heating, Parking, WiFi
        (21, 1), (21, 2), (21, 4), (21, 6),

        # Listing 22 (Gurgaon Golf Course): WiFi, Kitchen, AC, Pool, Parking, TV, Workspace
        (22, 1), (22, 2), (22, 3), (22, 5), (22, 6), (22, 8), (22, 9),
        # Listing 23 (Gurgaon Studio): WiFi, AC, TV, Workspace
        (23, 1), (23, 3), (23, 8), (23, 9),

        # Listing 24 (Rishikesh Yoga): WiFi, Kitchen, Parking, Workspace
        (24, 1), (24, 2), (24, 6), (24, 9),

        # Listing 25 (London Mews): Heating, Kitchen, WiFi
        (25, 1), (25, 2), (25, 4),
    ]
    cur.executemany(
        "INSERT INTO listing_amenities (listing_id, amenity_id) VALUES (?, ?)",
        pairs,
    )
    print(f"Inserted {len(pairs)} listing-amenity links")

    # ── 6. Bookings (Historical price snapshots, no overlaps) ──────────────
    bookings = [
        # (listing_id, guest_id, check_in, check_out, nightly_rate, nights, cleaning, service, total)
        # Listing 1 (Paris Cozy): 4 nights @ 120.0
        (1, 3, "2026-10-01", "2026-10-05", 120.0, 4, 30.0, 25.0, 535.0),
        # Listing 4 (Tokyo Shibuya): 4 nights @ 95.0
        (4, 3, "2026-11-10", "2026-11-14", 95.0, 4, 25.0, 20.0, 425.0),
        # Listing 7 (Bali Seminyak): 7 nights @ 225.0
        (7, 10, "2026-12-20", "2026-12-27", 225.0, 7, 50.0, 80.0, 1705.0),
        # Listing 10 (NYC Studio): 3 nights @ 180.0
        (10, 11, "2026-10-15", "2026-10-18", 180.0, 3, 40.0, 30.0, 610.0),
        # Listing 13 (Interlaken Chalet): 5 nights @ 165.0
        (13, 12, "2026-12-01", "2026-12-06", 165.0, 5, 40.0, 45.0, 910.0),
        # Listing 15 (Goa Portuguese): 5 nights @ 175.0
        (15, 13, "2026-11-01", "2026-11-06", 175.0, 5, 30.0, 45.0, 950.0),
        # Listing 18 (Noida Flat): 3 nights @ 65.0
        (18, 10, "2026-10-10", "2026-10-13", 65.0, 3, 15.0, 10.0, 220.0),
        # Listing 20 (Dehradun Colonial): 4 nights @ 80.0
        (20, 11, "2026-11-20", "2026-11-24", 80.0, 4, 20.0, 18.0, 358.0),
        # Listing 22 (Gurgaon Condo): 3 nights @ 105.0
        (22, 12, "2026-10-22", "2026-10-25", 105.0, 3, 25.0, 18.0, 358.0),
        # Listing 24 (Rishikesh Sanctuary): 6 nights @ 85.0
        (24, 3, "2026-11-15", "2026-11-21", 85.0, 6, 20.0, 28.0, 558.0),
    ]
    cur.executemany(
        """INSERT INTO bookings
           (listing_id, guest_id, check_in, check_out,
            nightly_rate, nights, cleaning_fee, service_fee, total_price)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)""",
        bookings,
    )
    print(f"Inserted {len(bookings)} bookings with consistent price snapshots")

    # ── 7. Reviews (Realistic ratings: 18 listings reviewed, 6 unreviewed) ──
    reviews = [
        # Listing 1 (Paris Cozy): 2 reviews -> avg 5.0
        (1, 3, 5, "Amazing location and view of the Eiffel Tower! Host was lovely and responsive."),
        (1, 10, 5, "Unbeatable location, pristine apartment, and very quiet at night."),

        # Listing 3 (Paris Haussmannian): 3 reviews -> avg 4.67
        (3, 3, 5, "The classic Parisian charm in this flat is unbelievable. High ceilings and lovely light."),
        (3, 11, 4, "Great neighborhood near Montmartre, though the stairs can be tiring with heavy luggage."),
        (3, 12, 5, "A gorgeous Parisian experience. The marble fireplaces and balcony are stunning."),

        # Listing 4 (Tokyo Shibuya): 2 reviews -> avg 4.0
        (4, 3, 4, "Authentic Japanese living in a quiet pocket of bustling Shibuya."),
        (4, 11, 4, "The tatami mats and garden gave us a peaceful escape from the city neon."),

        # Listing 5 (Tokyo Shinjuku): 1 review -> avg 5.0
        (5, 12, 5, "Ultra clean, modern, and super convenient location near the station."),

        # Listing 7 (Bali Seminyak): 3 reviews -> avg 4.67
        (7, 10, 5, "Direct beach access and our private pool made this an unforgettable holiday."),
        (7, 12, 5, "The open-air pavilion and tropical vibes were heavenly. Housekeeping was impeccable."),
        (7, 13, 4, "Spacious and beautiful villa, just a short walk to Seminyak's best beach clubs."),

        # Listing 8 (Bali Bamboo): 2 reviews -> avg 5.0
        (8, 3, 5, "Sleeping in this bamboo treehouse to the sound of crickets was pure magic."),
        (8, 11, 5, "Breathtaking sunrise over the rice paddies. A truly unique eco-stay."),

        # Listing 10 (NYC Studio): 2 reviews -> avg 4.0
        (10, 3, 4, "Great Midtown location. Perfect launchpad for sightseeing."),
        (10, 13, 4, "Compact but very smartly designed, with crisp skyline views."),

        # Listing 11 (NYC Brownstone): 1 review -> avg 5.0
        (11, 10, 5, "Fort Greene is lovely and the private garden patio was such a rare treat in NYC."),

        # Listing 12 (NYC SoHo Loft): 3 reviews -> avg 5.0
        (12, 10, 5, "One of the most impressive lofts I have ever stayed in. The roof deck is fabulous."),
        (12, 11, 5, "Pure luxury in the center of SoHo. High ceilings and flawless design."),
        (12, 13, 5, "Worth every penny. Incredible space, great chef kitchen, and wonderful host."),

        # Listing 13 (Interlaken Chalet): 2 reviews -> avg 4.5
        (13, 12, 5, "Waking up to the Eiger and Jungfrau mountains was awe-inspiring."),
        (13, 13, 4, "Cozy fireplace and warm wood everywhere. Very peaceful stay."),

        # Listing 15 (Goa Portuguese Villa): 4 reviews -> avg 4.75
        (15, 3, 5, "The heritage architecture and private courtyard pool are breathtaking."),
        (15, 10, 5, "Assagao is a culinary haven, and this villa was the ultimate relaxing base."),
        (15, 11, 4, "Spacious estate with lots of antique character. The garden is magnificent."),
        (15, 12, 5, "Best vacation in Goa yet. Spotlessly clean and full of historic charm."),

        # Listing 16 (Goa Beachside Cottage): 2 reviews -> avg 4.5
        (16, 3, 4, "Just a two minute walk to Anjuna beach. Loved the breezy hammock patio."),
        (16, 13, 5, "Simple, beautiful, and authentic beach living. We will definitely be back."),

        # Listing 18 (Noida Sector 62): 3 reviews -> avg 5.0
        (18, 10, 5, "Ideal stay for work. Ultra-fast WiFi, ergonomic desk, and spotlessly clean."),
        (18, 11, 5, "Check-in was seamless and the modular kitchen was fully equipped."),
        (18, 12, 5, "Quiet apartment complex with excellent security and great amenities."),

        # Listing 19 (Noida Sector 75): 1 review -> avg 4.0
        (19, 13, 4, "Huge terrace and grand living room. Perfect for family gatherings."),

        # Listing 20 (Dehradun Colonial): 2 reviews -> avg 5.0
        (20, 11, 5, "The old-world colonial charm and fresh mountain air were deeply rejuvenating."),
        (20, 12, 5, "Surrounded by quiet orchards. Evenings by the fireplace were magical."),

        # Listing 22 (Gurgaon Condo): 2 reviews -> avg 4.5
        (22, 10, 5, "Spectacular golf course views and world-class building amenities."),
        (22, 12, 4, "Super convenient location on Golf Course Road. Clean and modern."),

        # Listing 23 (Gurgaon Studio): 1 review -> avg 4.0
        (23, 13, 4, "Compact, very efficient, and right next to Cyber City offices."),

        # Listing 24 (Rishikesh Sanctuary): 3 reviews -> avg 5.0
        (24, 3, 5, "Listening to the holy Ganges flow while meditating on the deck was transcendental."),
        (24, 11, 5, "Soulful and serene sanctuary. The organic garden and river views were sublime."),
        (24, 13, 5, "A haven of peace. Priya was a wonderful and attentive host."),
    ]
    cur.executemany(
        "INSERT INTO reviews (listing_id, user_id, rating, comment) VALUES (?, ?, ?, ?)",
        reviews,
    )
    print(f"Inserted {len(reviews)} reviews across 18 listings (6 listings left unreviewed for 'New' status)")

    # ── 8. Favorites ───────────────────────────────────────────────────────
    favorites = [
        # (user_id, listing_id) - UNIQUE(user_id, listing_id)
        (3, 1),   # Carol loves Paris Cozy (Required by test_db.py)
        (3, 4),   # Carol loves Tokyo Shibuya
        (3, 8),   # Carol loves Bali Bamboo
        (3, 24),  # Carol loves Rishikesh
        (10, 7),  # Marcus loves Bali Seminyak
        (10, 12), # Marcus loves NYC SoHo
        (10, 15), # Marcus loves Goa Villa
        (10, 18), # Marcus loves Noida Flat
        (11, 2),  # Sophia loves Paris Loft
        (11, 10), # Sophia loves NYC Studio
        (11, 20), # Sophia loves Dehradun Colonial
        (12, 3),  # Ananya loves Paris Haussmannian
        (12, 13), # Ananya loves Interlaken Chalet
        (12, 22), # Ananya loves Gurgaon Condo
        (13, 14), # Liam loves Interlaken Lake
        (13, 16), # Liam loves Goa Cottage
    ]
    cur.executemany(
        "INSERT INTO favorites (user_id, listing_id) VALUES (?, ?)",
        favorites,
    )
    print(f"Inserted {len(favorites)} favorites")

    conn.commit()


def seed(db_path: str = DEFAULT_DB_PATH, force: bool = False) -> None:
    """
    Seed the database at db_path.
    If database already exists and contains data, skips seeding unless force=True.
    """
    from database import create_tables, get_connection

    if os.path.exists(db_path) and not force:
        conn = get_connection(db_path)
        try:
            create_tables(conn)
            user_count = conn.execute("SELECT COUNT(*) FROM users").fetchone()[0]
            if user_count > 0:
                print(
                    f"Database at {db_path} already contains {user_count} users. "
                    "Skipping seeding to preserve runtime data. (Pass force=True to overwrite)"
                )
                return
        except Exception:
            pass
        finally:
            conn.close()

    if force and os.path.exists(db_path):
        os.remove(db_path)
        print(f"Force reseed: removed existing database {db_path}")

    conn = init_db(db_path)
    try:
        populate_seed_data(conn)
        print(f"\nSeed complete. Database: {db_path}")
    finally:
        conn.close()


if __name__ == "__main__":
    force_reseed = "--force" in sys.argv
    seed(force=force_reseed)

