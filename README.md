# Airbnb Clone — SDE Fullstack Web Application

A fullstack Airbnb web application replicating Airbnb's core browse, search, booking, host management, favorites, and review workflows with high-fidelity UI/UX, robust relational SQLite data modeling, and clean Python/FastAPI backend architecture.

---

## 1. Project Overview

This project implements a decoupled fullstack Airbnb marketplace clone. The application provides guests with real-time property search, interactive maps, date-range availability validation, and reservation management. Hosts are equipped with a dedicated dashboard to publish listings with multiple photo URLs and amenities, manage pricing, soft-delete/reactivate properties, and track incoming reservations and revenues.

---

## 2. Key Features

- **Explore & Search:**
  - Responsive listing card grid with multi-photo image carousels, pricing breakdown, and review averages.
  - Interactive search bar supporting location, check-in / check-out dates, and guest capacity.
  - Category navigation bar with active category filtering.
  - Advanced filters (price range, property type, amenities) and pagination.
  - Interactive map with dynamic price pins and hover synchronization.
- **Listing Detail & Gallery:**
  - 5-photo mosaic gallery and full photo viewer.
  - Property description, host details, amenities grid, and location map.
  - Sticky booking widget with dynamic date calculation and breakdown (nightly rate $\times$ nights + cleaning fee + service fee).
- **Booking Flow & Availability:**
  - Date availability checking and conflict prevention (returns `409 Conflict` on overlapping dates).
  - Immediate booking persistence and reflection in "My Trips" dashboard.
- **Wishlist & Favorites:**
  - Optimistic heart toggle on cards and detail view.
  - Dedicated `/favorites` page backed by relational database persistence.
- **Reviews & Completed-Stay Validation:**
  - Verified review system enforcing that only guests with completed stays (`check_out <= today`) can submit a review.
  - 1–5 star rating validation and duplicate review prevention.
- **Host Dashboard & Full Listing CRUD:**
  - Create listings with custom title, description, location, price, cleaning fee, guest limit, multiple ordered image URLs (positions 0, 1, 2, ...), and selectable amenities.
  - Edit existing listings (pricing, title, description, photos, amenities).
  - Soft-delete properties (`is_active = 0`) to hide from public search while preserving historical bookings.
  - Host metrics (total listings, active listings, total reservations, total payout).
  - Host reservations ledger tracking guest names and reservation payouts.
- **Mock User Switcher:**
  - Switch between pre-seeded users (Guest, Host, Both roles) with automatic persistence in `localStorage` and `X-User-Id` request header injection.

---

## 3. Technology Stack

- **Frontend:**
  - [Next.js 16.3 (App Router)](https://nextjs.org/)
  - [React 19](https://react.dev/)
  - [TypeScript 5](https://www.typescriptlang.org/)
  - Vanilla CSS Modules (Strict Airbnb Design System styling without Tailwind ad-hoc bloat)
- **Backend:**
  - [Python 3.10+](https://www.python.org/)
  - [FastAPI](https://fastapi.tiangolo.com/) & [Uvicorn](https://www.uvicorn.org/)
  - [Pydantic v2](https://docs.pydantic.dev/) for request/response contract validation
  - Built-in `sqlite3` driver with foreign key enforcement (`PRAGMA foreign_keys = ON`)
- **Database:**
  - [SQLite 3](https://www.sqlite.org/) (`backend/airbnb.db`)

---

## 4. Project Structure

```text
airbnb-clone/
├── backend/
│   ├── app/
│   │   ├── routes/
│   │   │   ├── listings.py       # Public listings, search, detail
│   │   │   ├── bookings.py       # Guest booking creation & trips
│   │   │   ├── favorites.py      # Wishlist / favorites endpoints
│   │   │   ├── reviews.py        # Reviews & completed-stay validation
│   │   │   ├── host.py           # Host dashboard, listing CRUD & reservations
│   │   │   └── amenities.py      # Available amenities endpoint
│   │   ├── schemas/              # Pydantic contract models
│   │   │   ├── listing.py
│   │   │   ├── booking.py
│   │   │   ├── favorite.py
│   │   │   ├── review.py
│   │   │   └── host.py
│   │   └── services/             # Core business logic & raw parameterized SQL
│   │       ├── listing_service.py
│   │       ├── booking_service.py
│   │       ├── favorite_service.py
│   │       ├── review_service.py
│   │       └── host_service.py
│   ├── database.py               # SQLite connection factory & table creation
│   ├── seed.py                   # Initial dataset seeder
│   ├── main.py                   # FastAPI entrypoint & CORS middleware
│   ├── requirements.txt          # Python dependencies
│   ├── test_db.py                # Database integrity test suite
│   ├── test_bookings.py          # Booking & availability test suite
│   └── test_api.py               # Comprehensive API integration test suite
├── frontend/
│   ├── app/
│   │   ├── page.tsx              # Homepage / Explore grid
│   │   ├── search/page.tsx       # Search results & split map view
│   │   ├── listings/[id]/        # Listing detail & booking widget
│   │   ├── trips/page.tsx        # My Trips (Guest reservations)
│   │   ├── favorites/page.tsx    # Wishlist / Favorites view
│   │   ├── host/page.tsx         # Host Dashboard (CRUD & metrics)
│   │   └── layout.tsx            # Global root layout & providers
│   ├── components/               # Reusable UI components (Header, Footer, Cards, etc.)
│   ├── context/                  # React Contexts (AuthContext, FavoritesContext)
│   ├── lib/
│   │   └── api.ts                # Centralized typed HTTP API client
│   ├── types/                    # TypeScript data contracts
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

---

## 5. Architecture & Data Flow

The application follows a strict layered architecture:

```text
┌──────────────────────────────────────────────────────────────┐
│ Next.js Frontend (React / TypeScript / CSS Modules)          │
│                                                              │
│  UI Components ──> AuthContext & FavoritesContext            │
│                         │                                    │
│                         ▼                                    │
│       lib/api.ts (Central fetch with X-User-Id header)       │
└──────────────────────────────┬───────────────────────────────┘
                               │ HTTP REST (JSON)
                               ▼
┌──────────────────────────────────────────────────────────────┐
│ FastAPI Backend (Python)                                     │
│                                                              │
│  app/routes/ (HTTP request validation & status codes)         │
│         │                                                    │
│         ▼                                                    │
│  app/services/ (Authorization, validation & business rules)  │
│         │                                                    │
│         ▼                                                    │
│  app/schemas/ (Pydantic models & response envelopes)         │
└──────────────────────────────┬───────────────────────────────┘
                               │ Parameterized SQL
                               ▼
┌──────────────────────────────────────────────────────────────┐
│ SQLite Database (backend/airbnb.db)                          │
│  8 normalized tables with foreign keys and unique constraints│
└──────────────────────────────────────────────────────────────┘
```

---

## 6. Database Schema

The database uses 8 normalized tables with foreign key enforcement and indices:

```text
┌──────────┐       ┌──────────────┐       ┌─────────────────┐
│  users   │──────<│   listings   │──────<│ listing_images  │
└────┬─────┘       └──────┬───────┘       └─────────────────┘
     │                    │
     │                    ├──────────────<┌─────────────────┐
     │                    │               │listing_amenities│
     │                    │               └────────┬────────┘
     │                    │                        │
     │                    │               ┌────────┴────────┐
     │                    │               │    amenities    │
     │                    │               └─────────────────┘
     ├───────────────────>├──────────────<┌─────────────────┐
     │ (guest_id)         │ (listing_id)  │    bookings     │
     │                    │               └─────────────────┘
     ├───────────────────>├──────────────<┌─────────────────┐
     │ (user_id)          │ (listing_id)  │     reviews     │
     │                    │               └─────────────────┘
     └───────────────────>└──────────────<┌─────────────────┐
       (user_id)            (listing_id)  │    favorites    │
                                          └─────────────────┘
```

### Table Definitions:

1. **`users`**:
   - `id` (INTEGER PRIMARY KEY AUTOINCREMENT)
   - `name` (TEXT NOT NULL)
   - `email` (TEXT NOT NULL UNIQUE)
   - `role` (TEXT NOT NULL CHECK in `'guest'`, `'host'`, `'both'`)
   - `created_at` (TEXT NOT NULL DEFAULT `datetime('now')`)

2. **`listings`**:
   - `id` (INTEGER PRIMARY KEY AUTOINCREMENT)
   - `host_id` (INTEGER NOT NULL REFERENCES `users(id)`)
   - `title` (TEXT NOT NULL)
   - `description` (TEXT NOT NULL)
   - `city` (TEXT NOT NULL), `country` (TEXT NOT NULL)
   - `latitude` (REAL), `longitude` (REAL)
   - `price_per_night` (REAL NOT NULL)
   - `cleaning_fee` (REAL NOT NULL DEFAULT 0)
   - `max_guests` (INTEGER NOT NULL DEFAULT 1)
   - `is_active` (BOOLEAN NOT NULL DEFAULT 1)
   - `created_at` (TEXT NOT NULL DEFAULT `datetime('now')`)

3. **`listing_images`**:
   - `id` (INTEGER PRIMARY KEY AUTOINCREMENT)
   - `listing_id` (INTEGER NOT NULL REFERENCES `listings(id)`)
   - `url` (TEXT NOT NULL)
   - `caption` (TEXT)
   - `position` (INTEGER NOT NULL DEFAULT 0)

4. **`amenities`**:
   - `id` (INTEGER PRIMARY KEY AUTOINCREMENT)
   - `name` (TEXT NOT NULL UNIQUE)

5. **`listing_amenities`**:
   - `id` (INTEGER PRIMARY KEY AUTOINCREMENT)
   - `listing_id` (INTEGER NOT NULL REFERENCES `listings(id)`)
   - `amenity_id` (INTEGER NOT NULL REFERENCES `amenities(id)`)
   - `UNIQUE (listing_id, amenity_id)`

6. **`bookings`**:
   - `id` (INTEGER PRIMARY KEY AUTOINCREMENT)
   - `listing_id` (INTEGER NOT NULL REFERENCES `listings(id)`)
   - `guest_id` (INTEGER NOT NULL REFERENCES `users(id)`)
   - `check_in` (TEXT NOT NULL), `check_out` (TEXT NOT NULL)
   - `nightly_rate` (REAL NOT NULL), `nights` (INTEGER NOT NULL)
   - `cleaning_fee` (REAL NOT NULL DEFAULT 0), `service_fee` (REAL NOT NULL DEFAULT 0)
   - `total_price` (REAL NOT NULL)
   - `created_at` (TEXT NOT NULL DEFAULT `datetime('now')`)

7. **`reviews`**:
   - `id` (INTEGER PRIMARY KEY AUTOINCREMENT)
   - `listing_id` (INTEGER NOT NULL REFERENCES `listings(id)`)
   - `user_id` (INTEGER NOT NULL REFERENCES `users(id)`)
   - `rating` (INTEGER NOT NULL CHECK between 1 and 5)
   - `comment` (TEXT)
   - `created_at` (TEXT NOT NULL DEFAULT `datetime('now')`)

8. **`favorites`**:
   - `id` (INTEGER PRIMARY KEY AUTOINCREMENT)
   - `user_id` (INTEGER NOT NULL REFERENCES `users(id)`)
   - `listing_id` (INTEGER NOT NULL REFERENCES `listings(id)`)
   - `created_at` (TEXT NOT NULL DEFAULT `datetime('now')`)
   - `UNIQUE (user_id, listing_id)`

---

## 7. API Documentation

### Listings & Search
- **`GET /api/listings`**: Paginated active listings with optional filters.
  - Query params: `city`, `guests`, `min_price`, `max_price`, `check_in`, `check_out`, `page` (default 1), `page_size` (default 12, max 50).
- **`GET /api/listings/{id}`**: Fetch single active listing details with host name, images ordered by position, and amenities. Returns `404` if not found or inactive.
- **`GET /api/amenities`**: Returns all available amenities in the system.

### Bookings
- **`POST /api/bookings`**: Create a new reservation.
  - Body: `{ listing_id, guest_id, check_in, check_out, guest_count }`
  - Validates date order, listing capacity, and checks for overlaps against existing reservations. Returns `409 Conflict` if unavailable.
- **`GET /api/bookings?guest_id={id}`**: Fetch all bookings for a guest with listing snapshot info. Requires matching `X-User-Id` header.

### Favorites / Wishlist
- **`GET /api/favorites?user_id={id}`**: Fetch user's favorited listings. Requires matching `X-User-Id` header.
- **`POST /api/favorites`**: Add a favorite (`{ user_id, listing_id }`). Idempotent (`201`).
- **`DELETE /api/favorites/{id}?user_id={id}`**: Remove a favorite. Returns `200` on success, `404` if already removed.
- **`GET /api/favorites/check?user_id={id}&listing_id={lid}`**: Check favorite status (`{ is_favorited: boolean }`).

### Reviews
- **`GET /api/reviews?listing_id={id}`**: Public list of reviews for a listing with reviewer names.
- **`POST /api/reviews`**: Submit a review (`{ listing_id, user_id, rating, comment }`).
  - Enforces completed-stay rule (`check_out <= today`) and single review per user/listing (`409 Conflict` on duplicate).

### Host Dashboard
- **`GET /api/host/listings?host_id={id}`**: Fetch host's active & inactive listings with `booking_count` and `total_revenue`.
- **`POST /api/host/listings`**: Create listing with photos (`images: string[]`) and amenities (`amenities: string[]`).
- **`PATCH /api/host/listings/{id}`**: Partially update listing details, photos, or amenities.
- **`DELETE /api/host/listings/{id}`**: Soft-delete listing (`is_active = 0`).
- **`POST /api/host/listings/{id}/reactivate`**: Reactivate soft-deleted listing (`is_active = 1`).
- **`GET /api/host/bookings?host_id={id}`**: Fetch all incoming bookings across host's listings with guest names and total payouts.

---

## 8. Mock Authentication Model

In compliance with assignment instructions, real password authentication is replaced by a development **Mock User Switcher**:
- The client stores the currently active user profile in `localStorage`.
- All authenticated API requests attach the current user's ID in the `X-User-Id` HTTP header.
- The backend independently validates role permissions:
  - Guest actions (`/api/bookings`, `/api/favorites`, `/api/reviews`) require `guest` or `both` role.
  - Host actions (`/api/host/*`) require `host` or `both` role and ownership (`listing.host_id == current_user.id`).
- Switching users in the UI profile dropdown instantly updates context and triggers re-fetching.

---

## 9. Booking Logic & Concurrency

- **Date Range Validation:** Requires `check_out > check_in` and valid `YYYY-MM-DD` formatting.
- **Overlap Detection:** Uses exclusive boundary comparison:
  $$\text{Existing Booking Conflicts IF: } (\text{Requested Check-In} < \text{Existing Check-Out}) \land (\text{Requested Check-Out} > \text{Existing Check-In})$$
  *(Same-day turnover where check-in equals previous guest's check-out is permitted).*
- **Price Calculation:**
  $$\text{Nights} = \text{check\_out} - \text{check\_in}$$
  $$\text{Total} = (\text{Nightly Rate} \times \text{Nights}) + \text{Cleaning Fee} + \text{Service Fee (12\%)}$$
- **Snapshot Persistence:** Stores historical nightly rate, cleaning fee, service fee, and total at booking time so future host price changes do not alter historical records.

---

## 10. Reviews & Completed-Stay Rule

To ensure authentic feedback:
1. A user can only review a property if they have an existing booking where:
   - `booking.listing_id == listing_id`
   - `booking.guest_id == current_user_id`
   - `booking.check_out <= today`
2. Users with upcoming/future bookings are rejected (`403 Forbidden`).
3. Users who have already reviewed the property are prevented from submitting duplicates (`409 Conflict`).

---

## 11. Seed Dataset

The seed script initializes high-quality realistic data:
- **13 Users:** Mixed hosts, guests, and dual-role users (e.g., Alice Martin - Host, Bob Smith - Guest, David Wilson - Both).
- **27 Listings:** Distributed across Paris, Tokyo, Bali, New York, Rome, London, Barcelona, and Cape Town with high-resolution Unsplash photos.
- **9 Standard Amenities:** WiFi, Kitchen, Air Conditioning, Heating, Pool, Free Parking, Washer, TV, Dedicated Workspace.
- **14 Historical & Upcoming Bookings:** Providing immediate trip and host revenue data.
- **39 Reviews:** Varied ratings and descriptive feedback.

---

## 12. Running Locally

### Prerequisites
- Python 3.10+
- Node.js 18+ and npm

### 1. Backend Setup

```bash
cd backend

# Create and activate virtual environment
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Initialize & seed SQLite database
python seed.py

# Start FastAPI dev server (runs on http://localhost:8000)
uvicorn main:app --reload --port 8000
```

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start Next.js dev server (runs on http://localhost:3000)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 13. Test Suites & Verification

The project includes 329 comprehensive automated tests across 3 backend test runners alongside TypeScript and ESLint validation:

```bash
# 1. Database schema and constraint tests (34 tests)
cd backend && python test_db.py

# 2. Booking calculation and availability tests (81 tests)
cd backend && python test_bookings.py

# 3. Full API integration test suite (214 tests)
cd backend && python test_api.py

# 4. Frontend TypeScript validation
cd frontend && npx tsc --noEmit

# 5. Frontend ESLint validation
cd frontend && npm run lint
```

---

## 14. Environment Variables

| Variable | Location | Default | Description |
|---|---|---|---|
| `NEXT_PUBLIC_API_URL` | `frontend/.env.local` | `http://localhost:8000` | Backend API base URL |

---

## 15. Assumptions & Design Decisions

1. **Mock Authentication:** In accordance with the assignment specifications, authentication is handled via the `X-User-Id` header and UI user switcher.
2. **Soft Deletion:** Listings deleted by hosts have `is_active` set to `0`. They are hidden from public searches, but historical booking records and database rows are preserved.
3. **Map Pins:** Implemented with interactive leaflet-based coordinate mapping and custom price markers.
4. **Payments:** Checkout simulates successful reservation placement without charging real credit cards.

---

## 16. Deployment

- **Frontend Deployment (Vercel):** *TODO: Add hosted Vercel link upon deployment*
- **Backend Deployment (Render / Railway / Cloud Run):** *TODO: Add hosted API link upon deployment*
- **Public GitHub Repository:** *TODO: Add public GitHub link*
