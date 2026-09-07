"""
test_bookings.py — Step 8 (listing detail) + Step 9 (booking) tests.

Run:  python test_bookings.py

Isolated temporary database; does NOT touch the production airbnb.db.
"""

from __future__ import annotations

import os
import sys
import tempfile

from fastapi.testclient import TestClient

_test_db_fd, _test_db_path = tempfile.mkstemp(suffix=".db")
os.close(_test_db_fd)

import database
database.DEFAULT_DB_PATH = _test_db_path

from database import init_db
from main import app

client = TestClient(app)

passed = 0
failed = 0


def test(name: str, condition: bool) -> None:
    global passed, failed
    if condition:
        passed += 1
        print(f"  PASS  {name}")
    else:
        failed += 1
        print(f"  FAIL  {name}")


def setup_db() -> None:
    conn = init_db(_test_db_path)
    cur = conn.cursor()

    # Users: 1 host, 2 guests, 1 both, 1 host-only (cannot book)
    cur.executemany(
        "INSERT INTO users (name, email, role) VALUES (?, ?, ?)",
        [
            ("Alice Host",   "alice@t.com",  "host"),   # id=1
            ("Bob Guest",    "bob@t.com",    "guest"),  # id=2
            ("Carol Both",   "carol@t.com",  "both"),   # id=3
            ("Dan HostOnly", "dan@t.com",    "host"),   # id=4
            ("Eve Guest",    "eve@t.com",    "guest"),  # id=5
        ],
    )

    # Listings: active (Paris $100, 2 guests), active (Tokyo $80, 4 guests), inactive
    cur.executemany(
        """INSERT INTO listings
           (host_id, title, description, city, country,
            latitude, longitude, price_per_night, cleaning_fee, max_guests, is_active)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
        [
            # id=1: Paris, $100, max 2, active
            (1, "Paris Place", "Nice flat", "Paris", "France", 48.85, 2.35, 100.0, 20.0, 2, 1),
            # id=2: Tokyo, $80, max 4, active
            (1, "Tokyo View",  "Near tower", "Tokyo", "Japan",  35.66, 139.7, 80.0, 15.0, 4, 1),
            # id=3: inactive
            (1, "Closed Place","Inactive",   "Rome",  "Italy",  41.9,  12.5,  50.0,  0.0, 2, 0),
        ],
    )

    # Images for listing 1: inserted out of order to verify position ASC
    cur.executemany(
        "INSERT INTO listing_images (listing_id, url, caption, position) VALUES (?, ?, ?, ?)",
        [
            (1, "https://ex.com/p2.jpg", "B", 2),
            (1, "https://ex.com/p0.jpg", "A", 0),
            (1, "https://ex.com/p1.jpg", "C", 1),
            (2, "https://ex.com/t0.jpg", "T", 0),
        ],
    )

    cur.executemany("INSERT INTO amenities (name) VALUES (?)", [("WiFi",), ("Pool",)])
    cur.executemany(
        "INSERT INTO listing_amenities (listing_id, amenity_id) VALUES (?, ?)",
        [(1, 1), (1, 2), (2, 1)],
    )

    cur.executemany(
        "INSERT INTO reviews (listing_id, user_id, rating, comment) VALUES (?, ?, ?, ?)",
        [(1, 2, 5, "Great"), (1, 2, 3, "OK")],
    )

    # Pre-existing booking: Paris (id=1) is booked Oct 1–5, 2026
    cur.execute(
        """INSERT INTO bookings
           (listing_id, guest_id, check_in, check_out,
            nightly_rate, nights, cleaning_fee, service_fee, total_price)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)""",
        (1, 2, "2026-10-01", "2026-10-05", 100.0, 4, 20.0, 20.0, 440.0),
    )

    conn.commit()
    conn.close()


def teardown_db() -> None:
    if os.path.exists(_test_db_path):
        os.remove(_test_db_path)


def run_tests() -> None:
    setup_db()
    try:
        # ══════════════════════════════════════════════════════════════════
        # STEP 8 — LISTING DETAIL
        # ══════════════════════════════════════════════════════════════════

        print("\n── Step 8: Listing Detail ───────────────────────────────────────────")

        # Active listing
        resp = client.get("/api/listings/1")
        test("Active listing returns 200", resp.status_code == 200)
        d = resp.json()
        test("Has id", d.get("id") == 1)
        test("Has title", d.get("title") == "Paris Place")
        test("Has description", "description" in d)
        test("Has city", d.get("city") == "Paris")
        test("Has country", d.get("country") == "France")
        test("Has price_per_night", d.get("price_per_night") == 100.0)
        test("Has cleaning_fee", d.get("cleaning_fee") == 20.0)
        test("Has max_guests", d.get("max_guests") == 2)
        test("Has latitude", d.get("latitude") is not None)
        test("Has longitude", d.get("longitude") is not None)
        test("Host is object with name", isinstance(d.get("host"), dict) and "name" in d["host"])
        test("Host email NOT exposed", "email" not in d.get("host", {}))
        test("Images is list", isinstance(d.get("images"), list))
        test("Images count is 3", len(d.get("images", [])) == 3)
        test("Images ordered by position ASC",
             d["images"] == [
                 "https://ex.com/p0.jpg",
                 "https://ex.com/p1.jpg",
                 "https://ex.com/p2.jpg",
             ])
        test("Amenities is list", isinstance(d.get("amenities"), list))
        test("Amenities correct", set(d["amenities"]) == {"WiFi", "Pool"})
        test("rating_avg is 4.0", d.get("rating_avg") == 4.0)
        test("review_count is 2", d.get("review_count") == 2)
        test("Detail is flat (no 'items' key)", "items" not in d)

        # No-review listing (listing 2)
        resp2 = client.get("/api/listings/2")
        d2 = resp2.json()
        test("No-review listing: rating_avg null", d2.get("rating_avg") is None)
        test("No-review listing: review_count 0", d2.get("review_count") == 0)

        # Nullable coordinates — listing 2 has coords, still check
        resp2 = client.get("/api/listings/2")
        test("Listing 2 returns 200", resp2.status_code == 200)

        # Nonexistent listing
        resp = client.get("/api/listings/99999")
        test("Nonexistent listing returns 404", resp.status_code == 404)

        # Inactive listing
        resp = client.get("/api/listings/3")
        test("Inactive listing returns 404", resp.status_code == 404)

        # ══════════════════════════════════════════════════════════════════
        # STEP 9 — BOOKING CREATION
        # ══════════════════════════════════════════════════════════════════

        print("\n── Step 9: POST /api/bookings ───────────────────────────────────────")

        # ── Valid booking ─────────────────────────────────────────────────
        resp = client.post("/api/bookings", json={
            "listing_id": 1, "guest_id": 2,
            "check_in": "2026-11-01", "check_out": "2026-11-04",
            "guest_count": 2,
        })
        test("Valid booking returns 201", resp.status_code == 201)
        b = resp.json()
        test("Booking has id", "id" in b)
        test("Booking listing_id correct", b["listing_id"] == 1)
        test("Booking guest_id correct", b["guest_id"] == 2)
        test("Booking check_in correct", b["check_in"] == "2026-11-01")
        test("Booking check_out correct", b["check_out"] == "2026-11-04")
        test("Booking nights correct (3)", b["nights"] == 3)
        test("Booking nightly_rate correct (100.0)", b["nightly_rate"] == 100.0)
        test("Booking cleaning_fee correct (20.0)", b["cleaning_fee"] == 20.0)
        # service_fee = round(100 * 3 * 0.05, 2) = 15.0
        test("Booking service_fee correct (15.0)", abs(b["service_fee"] - 15.0) < 0.01)
        # total = 300 + 20 + 15 = 335
        test("Booking total_price correct (335.0)", abs(b["total_price"] - 335.0) < 0.01)
        test("Booking has created_at", "created_at" in b)

        # ── Price snapshots ───────────────────────────────────────────────
        print("\n── Price snapshots ──────────────────────────────────────────────────")
        test("Price snapshot: nightly_rate stored", b["nightly_rate"] == 100.0)
        test("Price snapshot: nights stored", b["nights"] == 3)
        test("Price snapshot: cleaning_fee stored", b["cleaning_fee"] == 20.0)
        test("Price snapshot: service_fee stored", abs(b["service_fee"] - 15.0) < 0.01)
        test("Price snapshot: total_price stored", abs(b["total_price"] - 335.0) < 0.01)

        # ── Booking persistence ───────────────────────────────────────────
        print("\n── Booking persistence ──────────────────────────────────────────────")
        new_id = b["id"]
        # Retrieve via GET
        resp_get = client.get(f"/api/bookings?guest_id=2")
        test("GET bookings returns 200", resp_get.status_code == 200)
        bookings_list = resp_get.json()
        test("Bookings list is a list", isinstance(bookings_list, list))
        found_ids = [bk["id"] for bk in bookings_list]
        test("New booking appears in guest bookings", new_id in found_ids)

        # ── role=both user can book ───────────────────────────────────────
        resp = client.post("/api/bookings", json={
            "listing_id": 2, "guest_id": 3,
            "check_in": "2026-12-01", "check_out": "2026-12-03",
            "guest_count": 1,
        })
        test("User with role=both can book (201)", resp.status_code == 201)

        # ── Invalid listing ───────────────────────────────────────────────
        print("\n── Validation: listing ─────────────────────────────────────────────")
        resp = client.post("/api/bookings", json={
            "listing_id": 99999, "guest_id": 2,
            "check_in": "2027-01-01", "check_out": "2027-01-03",
            "guest_count": 1,
        })
        test("Nonexistent listing → 404", resp.status_code == 404)

        # ── Inactive listing ──────────────────────────────────────────────
        resp = client.post("/api/bookings", json={
            "listing_id": 3, "guest_id": 2,
            "check_in": "2027-01-01", "check_out": "2027-01-03",
            "guest_count": 1,
        })
        test("Inactive listing → 404", resp.status_code == 404)

        # ── Invalid guest ─────────────────────────────────────────────────
        print("\n── Validation: guest ───────────────────────────────────────────────")
        resp = client.post("/api/bookings", json={
            "listing_id": 1, "guest_id": 99999,
            "check_in": "2027-01-01", "check_out": "2027-01-03",
            "guest_count": 1,
        })
        test("Nonexistent guest → 404", resp.status_code == 404)

        # ── Host-only role cannot book ────────────────────────────────────
        resp = client.post("/api/bookings", json={
            "listing_id": 1, "guest_id": 4,   # Dan = host-only
            "check_in": "2027-01-01", "check_out": "2027-01-03",
            "guest_count": 1,
        })
        test("Host-only user cannot book → 400", resp.status_code == 400)

        # ── Guest count validation ────────────────────────────────────────
        print("\n── Validation: guest count ─────────────────────────────────────────")
        resp = client.post("/api/bookings", json={
            "listing_id": 1, "guest_id": 2,
            "check_in": "2027-02-01", "check_out": "2027-02-03",
            "guest_count": 0,
        })
        test("guest_count=0 → 400", resp.status_code == 400)

        # Listing 1 has max_guests=2; requesting 3
        resp = client.post("/api/bookings", json={
            "listing_id": 1, "guest_id": 2,
            "check_in": "2027-02-01", "check_out": "2027-02-03",
            "guest_count": 3,
        })
        test("guest_count > max_guests → 400", resp.status_code == 400)

        # ── Date validation ───────────────────────────────────────────────
        print("\n── Validation: dates ───────────────────────────────────────────────")
        resp = client.post("/api/bookings", json={
            "listing_id": 1, "guest_id": 2,
            "check_in": "2027-03-05", "check_out": "2027-03-03",
            "guest_count": 1,
        })
        test("check_out before check_in → 400", resp.status_code == 400)

        resp = client.post("/api/bookings", json={
            "listing_id": 1, "guest_id": 2,
            "check_in": "2027-04-01", "check_out": "2027-04-01",
            "guest_count": 1,
        })
        test("Same-day (zero nights) → 400", resp.status_code == 400)

        resp = client.post("/api/bookings", json={
            "listing_id": 1, "guest_id": 2,
            "check_in": "not-a-date", "check_out": "2027-04-05",
            "guest_count": 1,
        })
        test("Invalid date format → 400", resp.status_code == 400)

        # ── Overlapping booking → 409 ─────────────────────────────────────
        print("\n── Availability: overlap ───────────────────────────────────────────")
        # Paris (id=1) already has a booking: Oct 1–5 2026
        resp = client.post("/api/bookings", json={
            "listing_id": 1, "guest_id": 2,
            "check_in": "2026-10-03", "check_out": "2026-10-07",
            "guest_count": 1,
        })
        test("Overlapping booking → 409", resp.status_code == 409)

        # ── Boundary: checkout = existing checkin → allowed ───────────────
        # Existing ends Oct 5; new starts Oct 5 → allowed
        resp = client.post("/api/bookings", json={
            "listing_id": 1, "guest_id": 2,
            "check_in": "2026-10-05", "check_out": "2026-10-08",
            "guest_count": 1,
        })
        test("Boundary check-in on existing check-out → 201 (allowed)", resp.status_code == 201)

        # ── Non-overlapping dates → allowed ──────────────────────────────
        resp = client.post("/api/bookings", json={
            "listing_id": 1, "guest_id": 2,
            "check_in": "2026-12-01", "check_out": "2026-12-04",
            "guest_count": 1,
        })
        test("Non-overlapping dates → 201 (allowed)", resp.status_code == 201)

        # ══════════════════════════════════════════════════════════════════
        # GET /api/bookings — MY TRIPS
        # ══════════════════════════════════════════════════════════════════

        print("\n── Step 9: GET /api/bookings?guest_id ──────────────────────────────")

        resp = client.get("/api/bookings?guest_id=2")
        test("GET bookings 200", resp.status_code == 200)
        trips = resp.json()
        test("Returns list", isinstance(trips, list))
        test("Has multiple bookings", len(trips) >= 2)

        # Check structure of first item
        first = trips[0]
        test("Trip has id", "id" in first)
        test("Trip has listing_id", "listing_id" in first)
        test("Trip has check_in", "check_in" in first)
        test("Trip has check_out", "check_out" in first)
        test("Trip has nightly_rate", "nightly_rate" in first)
        test("Trip has total_price", "total_price" in first)
        test("Trip has listing object", isinstance(first.get("listing"), dict))
        test("Listing snippet has title", "title" in first["listing"])
        test("Listing snippet has city", "city" in first["listing"])
        test("Listing snippet has country", "country" in first["listing"])
        test("Listing snippet has image key", "image" in first["listing"])

        # Guest with no bookings
        resp = client.get("/api/bookings?guest_id=5")
        test("Guest with no bookings returns 200 + empty list",
             resp.status_code == 200 and resp.json() == [])

        # Missing guest_id → 422 (FastAPI validation)
        resp = client.get("/api/bookings")
        test("Missing guest_id → 422", resp.status_code == 422)

        # ══════════════════════════════════════════════════════════════════
        # REGRESSION — existing Step 6 endpoints
        # ══════════════════════════════════════════════════════════════════

        print("\n── Regression: existing endpoints ──────────────────────────────────")

        resp = client.get("/api/listings")
        body = resp.json()
        test("GET /api/listings still works (200)", resp.status_code == 200)
        test("Still returns paginated envelope", "items" in body and "total" in body)
        test("Active listings in items", len(body["items"]) == 2)

        resp = client.get("/api/listings?city=Paris")
        test("City filter still works", resp.status_code == 200)
        test("City filter total=1", resp.json()["total"] == 1)

        resp = client.get("/api/health")
        test("Health endpoint still 200", resp.status_code == 200)

    finally:
        teardown_db()

    total = passed + failed
    print(f"\n{'='*56}")
    print(f"Results: {passed}/{total} passed, {failed} failed")
    print(f"{'='*56}")
    if failed > 0:
        sys.exit(1)


if __name__ == "__main__":
    run_tests()
