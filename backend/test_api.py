"""
test_api.py — Listing API endpoint tests.

Run:  python test_api.py

Uses FastAPI's TestClient (backed by httpx) to test actual API behavior.
Tests use an isolated temporary database to avoid modifying production seed data.
"""

import os
import sys
import tempfile

from fastapi.testclient import TestClient

# We need to set up an isolated test database BEFORE importing the app,
# so the service layer uses the test database path.
_test_db_fd, _test_db_path = tempfile.mkstemp(suffix=".db")
os.close(_test_db_fd)

# Patch database.py to use the test database
import database
database.DEFAULT_DB_PATH = _test_db_path

from database import init_db, get_connection
from main import app

client = TestClient(app)

passed = 0
failed = 0


def test(name: str, condition: bool) -> None:
    """Record and print a test result."""
    global passed, failed
    if condition:
        passed += 1
        print(f"  PASS  {name}")
    else:
        failed += 1
        print(f"  FAIL  {name}")


def setup_test_db() -> None:
    """Create tables and insert minimal test data into the isolated test DB."""
    conn = init_db(_test_db_path)
    cur = conn.cursor()

    # Users: id=1 host, id=2 guest (reviewer in new tests, has completed stay),
    # id=3 guest (reviewer 1, has future booking), id=4 guest (reviewer 2)
    cur.executemany(
        "INSERT INTO users (name, email, role) VALUES (?, ?, ?)",
        [
            ("Alice Host", "alice@test.com", "host"),       # id=1
            ("Bob Guest", "bob@test.com", "guest"),         # id=2  — used for new review test
            ("Carol Guest", "carol@test.com", "guest"),     # id=3  — pre-seeded reviewer 1
            ("David Guest", "david@test.com", "guest"),     # id=4  — pre-seeded reviewer 2
        ],
    )

    # Listings: 3 active (Paris x2, Tokyo x1) + 1 inactive
    # Prices deliberately varied: 100, 80, 60, 200 for price filter tests.
    # max_guests deliberately varied: 2, 4, 2, 4 for guest filter tests.
    cur.executemany(
        """INSERT INTO listings
           (host_id, title, description, city, country,
            latitude, longitude, price_per_night, cleaning_fee, max_guests, is_active)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
        [
            # id=1: Paris, $100/night, max 2 guests
            (1, "Paris Place", "A lovely spot", "Paris", "France",
             48.85, 2.35, 100.0, 20.0, 2, 1),
            # id=2: Tokyo, $80/night, max 4 guests
            (1, "Tokyo Tower View", "Near the tower", "Tokyo", "Japan",
             35.66, 139.70, 80.0, 15.0, 4, 1),
            # id=3: Berlin (no reviews), $60/night, max 2 guests
            (1, "No Review Listing", "Never reviewed", "Berlin", "Germany",
             52.52, 13.40, 60.0, 10.0, 2, 1),
            # id=4: Inactive — must NEVER appear in results
            (1, "Inactive Place", "Should not appear", "London", "UK",
             51.50, -0.12, 200.0, 30.0, 4, 0),
        ],
    )

    # Images with deliberate position ordering to test ORDER BY position ASC
    cur.executemany(
        "INSERT INTO listing_images (listing_id, url, caption, position) VALUES (?, ?, ?, ?)",
        [
            (1, "https://example.com/paris-2.jpg", "Second", 2),
            (1, "https://example.com/paris-0.jpg", "First", 0),
            (1, "https://example.com/paris-1.jpg", "Middle", 1),
            (2, "https://example.com/tokyo.jpg", "Main", 0),
        ],
    )

    # Amenities
    cur.executemany(
        "INSERT INTO amenities (name) VALUES (?)",
        [("WiFi",), ("Kitchen",), ("Pool",)],
    )

    # Listing-amenity links
    cur.executemany(
        "INSERT INTO listing_amenities (listing_id, amenity_id) VALUES (?, ?)",
        [(1, 1), (1, 2), (2, 1), (2, 3)],
    )

    # Reviews: listing 1 has 2 reviews from Carol (id=3) and David (id=4).
    # Avg = (5 + 3)/2 = 4.0, count = 2.
    # No user has duplicate reviews. Bob (id=2) has not reviewed yet.
    cur.executemany(
        "INSERT INTO reviews (listing_id, user_id, rating, comment) VALUES (?, ?, ?, ?)",
        [
            (1, 3, 5, "Great place!"),
            (1, 4, 3, "Decent stay."),
        ],
    )

    # Bookings for availability and review eligibility tests:
    #   Listing 1 (Paris):
    #     - Completed stay by Bob (id=2) in August: 2026-08-01 → 2026-08-05
    #       (check_out in past enables Bob to review listing 1)
    #     - Future stay by Carol (id=3) in October: 2026-10-01 → 2026-10-05
    #       (used for availability & overlap tests)
    #   Listing 2 (Tokyo) has no bookings (always available)
    cur.executemany(
        """INSERT INTO bookings
           (listing_id, guest_id, check_in, check_out,
            nightly_rate, nights, cleaning_fee, service_fee, total_price)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)""",
        [
            (1, 2, "2026-08-01", "2026-08-05", 100.0, 4, 20.0, 10.0, 230.0),
            (1, 3, "2026-10-01", "2026-10-05", 100.0, 4, 20.0, 10.0, 230.0),
        ],
    )

    conn.commit()
    conn.close()


def teardown_test_db() -> None:
    """Remove the temporary test database."""
    if os.path.exists(_test_db_path):
        os.remove(_test_db_path)


def run_tests() -> None:
    global passed, failed

    setup_test_db()

    try:
        # ── 1. Default listing request ────────────────────────────────────
        print("\n── 1. Default listing request ───────────────────────────────────")

        resp = client.get("/api/listings")
        test("Returns HTTP 200", resp.status_code == 200)

        body = resp.json()
        test("Response is an object (paginated envelope)", isinstance(body, dict))
        test("Envelope has 'items' key", "items" in body)
        test("Envelope has 'page' key", "page" in body)
        test("Envelope has 'page_size' key", "page_size" in body)
        test("Envelope has 'total' key", "total" in body)
        test("Envelope has 'total_pages' key", "total_pages" in body)

        # Default page=1, page_size=12 → 3 active listings fit on page 1
        test("Default page is 1", body["page"] == 1)
        test("Default page_size is 12", body["page_size"] == 12)
        test("Total is 3 (active only)", body["total"] == 3)
        test("Total pages is 1", body["total_pages"] == 1)

        listings = body["items"]
        test("items is a list", isinstance(listings, list))
        test("items contains 3 active listings", len(listings) == 3)

        # ── 24. Inactive listing never returned ───────────────────────────
        print("\n── 24. Inactive listing never returned ─────────────────────────────")

        listing_ids = [l["id"] for l in listings]
        test("Inactive listing (id=4) not in results", 4 not in listing_ids)

        # ── Response Structure ────────────────────────────────────────────
        print("\n── Response Structure ───────────────────────────────────────────────")

        first = listings[0]  # Should be listing id=1 (Paris Place)
        required_fields = [
            "id", "title", "description", "city", "country",
            "price_per_night", "cleaning_fee", "max_guests",
            "latitude", "longitude",
            "rating_avg", "review_count",
            "host", "images", "amenities",
        ]
        for field_name in required_fields:
            test(f"Listing has '{field_name}'", field_name in first)

        test("host is an object with 'name'",
             isinstance(first.get("host"), dict) and "name" in first["host"])
        test("images is a list", isinstance(first.get("images"), list))
        test("amenities is a list", isinstance(first.get("amenities"), list))

        # ── Host Privacy ──────────────────────────────────────────────────
        print("\n── Host Privacy ────────────────────────────────────────────────────")

        test("Host name is present", first["host"]["name"] == "Alice Host")
        test("Host email is NOT exposed", "email" not in first["host"])
        test("Host role is NOT exposed", "role" not in first["host"])

        # ── Ratings ───────────────────────────────────────────────────────
        print("\n── Ratings ─────────────────────────────────────────────────────────")

        # Listing 1: two reviews (5 + 3) → avg = 4.0, count = 2
        paris = next(l for l in listings if l["id"] == 1)
        test("rating_avg computed correctly (4.0)", paris["rating_avg"] == 4.0)
        test("review_count computed correctly (2)", paris["review_count"] == 2)

        # Listing 3: no reviews
        berlin = next(l for l in listings if l["id"] == 3)
        test("No-review listing: rating_avg is null", berlin["rating_avg"] is None)
        test("No-review listing: review_count is 0", berlin["review_count"] == 0)

        # ── Image Ordering ────────────────────────────────────────────────
        print("\n── Image Ordering ──────────────────────────────────────────────────")

        # Images were inserted in order position 2, 0, 1
        # API must return them in position order: 0, 1, 2
        paris_images = paris["images"]
        test("Images count correct (3)", len(paris_images) == 3)
        test("Images ordered by position ASC",
             paris_images == [
                 "https://example.com/paris-0.jpg",
                 "https://example.com/paris-1.jpg",
                 "https://example.com/paris-2.jpg",
             ])

        # ── Amenities ────────────────────────────────────────────────────
        print("\n── Amenities ───────────────────────────────────────────────────────")

        paris_amenities = paris["amenities"]
        test("Paris listing has amenities", len(paris_amenities) == 2)
        test("Amenity names returned correctly",
             set(paris_amenities) == {"WiFi", "Kitchen"})

        # ── 2. City filter ────────────────────────────────────────────────
        print("\n── 2. City filter ───────────────────────────────────────────────────")

        resp = client.get("/api/listings?city=Paris")
        test("City filter returns 200", resp.status_code == 200)
        city_body = resp.json()
        test("City filter returns 1 Paris listing", city_body["total"] == 1)
        test("All results are Paris", all(l["city"] == "Paris" for l in city_body["items"]))

        # ── 3. Case-insensitive city ──────────────────────────────────────
        print("\n── 3. Case-insensitive city ─────────────────────────────────────────")

        resp = client.get("/api/listings?city=paris")
        test("Lowercase city returns 200", resp.status_code == 200)
        lower_body = resp.json()
        test("Lowercase city returns 1 result", lower_body["total"] == 1)

        resp = client.get("/api/listings?city=PARIS")
        upper_body = resp.json()
        test("Uppercase PARIS returns same 1 result", upper_body["total"] == 1)

        # ── 4. Guests filter ──────────────────────────────────────────────
        print("\n── 4. Guests filter ─────────────────────────────────────────────────")

        # Only Tokyo (id=2) has max_guests=4; Paris and Berlin have max_guests=2
        resp = client.get("/api/listings?guests=4")
        test("guests=4 returns 200", resp.status_code == 200)
        guests_body = resp.json()
        test("guests=4 returns 1 listing (Tokyo)", guests_body["total"] == 1)
        test("Tokyo listing returned for guests=4", guests_body["items"][0]["id"] == 2)

        # guests=2 → all 3 listings qualify (max_guests >= 2)
        resp = client.get("/api/listings?guests=2")
        guests2_body = resp.json()
        test("guests=2 returns all 3 listings", guests2_body["total"] == 3)

        # ── 5. Min price ──────────────────────────────────────────────────
        print("\n── 5. Min price ─────────────────────────────────────────────────────")

        # Paris=$100, Tokyo=$80, Berlin=$60 → min_price=80 → Paris + Tokyo
        resp = client.get("/api/listings?min_price=80")
        test("min_price=80 returns 200", resp.status_code == 200)
        min_body = resp.json()
        test("min_price=80 returns 2 listings", min_body["total"] == 2)
        ids_min = {l["id"] for l in min_body["items"]}
        test("min_price=80 includes Paris(100) and Tokyo(80)", ids_min == {1, 2})

        # ── 6. Max price ──────────────────────────────────────────────────
        print("\n── 6. Max price ─────────────────────────────────────────────────────")

        # max_price=79 → only Berlin ($60)
        resp = client.get("/api/listings?max_price=79")
        test("max_price=79 returns 200", resp.status_code == 200)
        max_body = resp.json()
        test("max_price=79 returns 1 listing (Berlin)", max_body["total"] == 1)
        test("Berlin listing returned for max_price=79", max_body["items"][0]["id"] == 3)

        # ── 7. Min + max price ────────────────────────────────────────────
        print("\n── 7. Min + max price ───────────────────────────────────────────────")

        # min=70, max=90 → only Tokyo ($80)
        resp = client.get("/api/listings?min_price=70&max_price=90")
        test("min+max price returns 200", resp.status_code == 200)
        range_body = resp.json()
        test("min_price=70&max_price=90 returns 1 listing (Tokyo)", range_body["total"] == 1)
        test("Tokyo returned in price range", range_body["items"][0]["id"] == 2)

        # ── 8. Combined filters ───────────────────────────────────────────
        print("\n── 8. Combined filters ──────────────────────────────────────────────")

        # city=Tokyo, guests=2, min_price=50, max_price=100 → Tokyo qualifies
        resp = client.get("/api/listings?city=Tokyo&guests=2&min_price=50&max_price=100")
        test("Combined filters returns 200", resp.status_code == 200)
        combo_body = resp.json()
        test("Combined filters returns 1 listing", combo_body["total"] == 1)
        test("Combined filter result is Tokyo", combo_body["items"][0]["city"] == "Tokyo")

        # ── 9. Pagination page 1 ──────────────────────────────────────────
        print("\n── 9. Pagination page 1 ─────────────────────────────────────────────")

        # page_size=2 → page 1 has 2 items
        resp = client.get("/api/listings?page=1&page_size=2")
        test("page=1 returns 200", resp.status_code == 200)
        pg1 = resp.json()
        test("page=1 has 2 items", len(pg1["items"]) == 2)
        test("page metadata page=1", pg1["page"] == 1)
        test("page metadata page_size=2", pg1["page_size"] == 2)

        # ── 10. Pagination page 2 ─────────────────────────────────────────
        print("\n── 10. Pagination page 2 ────────────────────────────────────────────")

        resp = client.get("/api/listings?page=2&page_size=2")
        test("page=2 returns 200", resp.status_code == 200)
        pg2 = resp.json()
        test("page=2 has 1 item (3rd listing)", len(pg2["items"]) == 1)
        test("page metadata page=2", pg2["page"] == 2)

        # ── 11. Total ─────────────────────────────────────────────────────
        print("\n── 11. Total ────────────────────────────────────────────────────────")

        test("total across pages is consistent (3)", pg1["total"] == 3 and pg2["total"] == 3)

        # ── 12. Total pages ───────────────────────────────────────────────
        print("\n── 12. Total pages ──────────────────────────────────────────────────")

        test("total_pages is 2 (3 items, page_size=2)", pg1["total_pages"] == 2)

        # ── 13. Overlapping booking excluded ─────────────────────────────
        print("\n── 13. Overlapping booking excluded ─────────────────────────────────")

        # Listing 1 (Paris) is booked 2026-10-01 → 2026-10-05.
        # Requesting Oct 3–7 overlaps → listing 1 excluded from Paris results.
        resp = client.get("/api/listings?city=Paris&check_in=2026-10-03&check_out=2026-10-07")
        test("Overlapping date check returns 200", resp.status_code == 200)
        overlap_body = resp.json()
        overlap_ids = [l["id"] for l in overlap_body["items"]]
        test("Booked listing excluded when dates overlap", 1 not in overlap_ids)

        # ── 14. Checkout/check-in boundary allowed ────────────────────────
        print("\n── 14. Checkout/check-in boundary allowed ───────────────────────────")

        # Existing booking Oct 1–5. Requesting check-in Oct 5 (checkout = existing checkout)
        # Boundary: Oct 5 > Oct 5 is FALSE → no conflict → listing 1 IS available.
        resp = client.get("/api/listings?city=Paris&check_in=2026-10-05&check_out=2026-10-08")
        test("Boundary date returns 200", resp.status_code == 200)
        boundary_body = resp.json()
        boundary_ids = [l["id"] for l in boundary_body["items"]]
        test("Listing available when check-in equals existing check-out", 1 in boundary_ids)

        # ── 15. Non-overlapping booking allowed ──────────────────────────
        print("\n── 15. Non-overlapping booking allowed ──────────────────────────────")

        # Dates well after the booking: Nov 1–5 → all Paris available
        resp = client.get("/api/listings?city=Paris&check_in=2026-11-01&check_out=2026-11-05")
        test("Non-overlapping dates returns 200", resp.status_code == 200)
        nonoverlap_body = resp.json()
        nonoverlap_ids = [l["id"] for l in nonoverlap_body["items"]]
        test("All Paris listings available for non-overlapping dates", 1 in nonoverlap_ids)

        # ── 16. Only check_in → 400 ───────────────────────────────────────
        print("\n── 16. Only check_in → 400 ──────────────────────────────────────────")

        resp = client.get("/api/listings?check_in=2026-10-01")
        test("Only check_in returns 400", resp.status_code == 400)
        test("Only check_in error message mentions check_out",
             "check_out" in resp.json().get("detail", "").lower())

        # ── 17. Only check_out → 400 ──────────────────────────────────────
        print("\n── 17. Only check_out → 400 ─────────────────────────────────────────")

        resp = client.get("/api/listings?check_out=2026-10-05")
        test("Only check_out returns 400", resp.status_code == 400)
        test("Only check_out error message mentions check_in",
             "check_in" in resp.json().get("detail", "").lower())

        # ── 18. Invalid date range → 400 ─────────────────────────────────
        print("\n── 18. Invalid date range → 400 ─────────────────────────────────────")

        resp = client.get("/api/listings?check_in=2026-10-05&check_out=2026-10-01")
        test("check_out before check_in returns 400", resp.status_code == 400)

        # check_in == check_out is also invalid (same day)
        resp = client.get("/api/listings?check_in=2026-10-05&check_out=2026-10-05")
        test("check_out equal to check_in returns 400", resp.status_code == 400)

        # ── 19. Invalid page → 400 ────────────────────────────────────────
        print("\n── 19. Invalid page → 400 ───────────────────────────────────────────")

        resp = client.get("/api/listings?page=0")
        test("page=0 returns 400", resp.status_code == 400)

        resp = client.get("/api/listings?page=-1")
        test("page=-1 returns 400", resp.status_code == 400)

        # ── 20. Invalid page_size → 400 ───────────────────────────────────
        print("\n── 20. Invalid page_size → 400 ──────────────────────────────────────")

        resp = client.get("/api/listings?page_size=0")
        test("page_size=0 returns 400", resp.status_code == 400)

        resp = client.get("/api/listings?page_size=-5")
        test("page_size=-5 returns 400", resp.status_code == 400)

        # ── 21. Excessive page_size → 400 ────────────────────────────────
        print("\n── 21. Excessive page_size → 400 ────────────────────────────────────")

        resp = client.get("/api/listings?page_size=51")
        test("page_size=51 returns 400", resp.status_code == 400)
        test("page_size=51 error mentions 50",
             "50" in resp.json().get("detail", ""))

        # ── 22. Invalid guests → 400 ──────────────────────────────────────
        print("\n── 22. Invalid guests → 400 ─────────────────────────────────────────")

        resp = client.get("/api/listings?guests=0")
        test("guests=0 returns 400", resp.status_code == 400)

        resp = client.get("/api/listings?guests=-3")
        test("guests=-3 returns 400", resp.status_code == 400)

        # ── 23. Invalid price → 400 ───────────────────────────────────────
        print("\n── 23. Invalid price → 400 ──────────────────────────────────────────")

        resp = client.get("/api/listings?min_price=-10")
        test("min_price=-10 returns 400", resp.status_code == 400)

        resp = client.get("/api/listings?max_price=-5")
        test("max_price=-5 returns 400", resp.status_code == 400)

        resp = client.get("/api/listings?min_price=200&max_price=100")
        test("min_price > max_price returns 400", resp.status_code == 400)

        # ── 25. Detail endpoint still works ───────────────────────────────
        print("\n── 25. Detail endpoint still works ──────────────────────────────────")

        resp = client.get("/api/listings/1")
        test("Detail returns HTTP 200", resp.status_code == 200)

        detail = resp.json()
        test("Detail returns correct listing", detail["id"] == 1)
        test("Detail has all required fields",
             all(f in detail for f in required_fields))
        test("Detail is a flat object (not paginated)", "items" not in detail)

        resp = client.get("/api/listings/99999")
        test("Nonexistent listing returns 404", resp.status_code == 404)

        resp = client.get("/api/listings/4")
        test("Inactive listing returns 404", resp.status_code == 404)

        # ── 26. Health endpoint still works ──────────────────────────────
        print("\n── 26. Health endpoint still works ──────────────────────────────────")

        resp = client.get("/api/health")
        test("/api/health still returns 200", resp.status_code == 200)
        test("/api/health response intact",
             resp.json().get("status") == "healthy")

        # ── 12. Favorites API ─────────────────────────────────────────────
        print("\n── 12. Favorites API ────────────────────────────────────────────")

        HOST_ID = 1   # Alice Host (host)
        GUEST_ID = 2  # Bob Guest (guest)
        AUTH_H_HOST = {"X-User-Id": str(HOST_ID)}
        AUTH_H_GUEST = {"X-User-Id": str(GUEST_ID)}

        # 12a. No auth header → 401
        resp = client.get("/api/favorites?user_id=2")
        test("GET /api/favorites without auth → 401", resp.status_code == 401)

        # 12b. Wrong user_id in header → 403
        resp = client.get("/api/favorites?user_id=2", headers={"X-User-Id": "1"})
        test("GET /api/favorites with mismatched X-User-Id → 403", resp.status_code == 403)

        # 12c. Correct auth, no favorites yet → empty list
        resp = client.get("/api/favorites?user_id=2", headers=AUTH_H_GUEST)
        test("GET /api/favorites (empty) → 200", resp.status_code == 200)
        test("Empty favorites list → []", resp.json() == [])

        # 12d. Add favorite — no auth → 422 / 401
        resp = client.post("/api/favorites",
                           json={"user_id": 2, "listing_id": 1})
        test("POST /api/favorites without auth → 401", resp.status_code == 401)

        # 12e. Add favorite — body user_id mismatch → 403
        resp = client.post("/api/favorites",
                           json={"user_id": 2, "listing_id": 1},
                           headers={"X-User-Id": "1"})
        test("POST /api/favorites body/header mismatch → 403", resp.status_code == 403)

        # 12f. Add favorite — success
        resp = client.post("/api/favorites",
                           json={"user_id": 2, "listing_id": 1},
                           headers=AUTH_H_GUEST)
        test("POST /api/favorites success → 201", resp.status_code == 201)
        fav = resp.json()
        test("Favorite response has id", "id" in fav)
        test("Favorite user_id correct", fav["user_id"] == GUEST_ID)
        test("Favorite listing_id correct", fav["listing_id"] == 1)

        # 12g. Add same favorite again — idempotent → 201
        resp = client.post("/api/favorites",
                           json={"user_id": 2, "listing_id": 1},
                           headers=AUTH_H_GUEST)
        test("POST /api/favorites duplicate is idempotent → 201", resp.status_code == 201)

        # 12h. List favorites — contains the new entry
        resp = client.get("/api/favorites?user_id=2", headers=AUTH_H_GUEST)
        test("GET /api/favorites after add → 200", resp.status_code == 200)
        favs = resp.json()
        test("Favorites list has 1 entry", len(favs) == 1)
        test("Favorite entry has listing sub-object", "listing" in favs[0])
        test("Listing snippet has title", "title" in favs[0]["listing"])

        # 12i. Check endpoint — is_favorited = True
        resp = client.get("/api/favorites/check?user_id=2&listing_id=1", headers=AUTH_H_GUEST)
        test("GET /api/favorites/check → 200", resp.status_code == 200)
        test("is_favorited = true", resp.json()["is_favorited"] is True)

        # 12j. Check endpoint — not favorited
        resp = client.get("/api/favorites/check?user_id=2&listing_id=2", headers=AUTH_H_GUEST)
        test("is_favorited = false for un-favorited listing", resp.json()["is_favorited"] is False)

        # 12k. Add favorite for non-existent listing → 404
        resp = client.post("/api/favorites",
                           json={"user_id": 2, "listing_id": 9999},
                           headers=AUTH_H_GUEST)
        test("POST /api/favorites nonexistent listing → 404", resp.status_code == 404)

        # 12l. Remove favorite — success
        resp = client.delete("/api/favorites/1?user_id=2", headers=AUTH_H_GUEST)
        test("DELETE /api/favorites/{id} → 200", resp.status_code == 200)

        # 12m. Remove same favorite again → 404
        resp = client.delete("/api/favorites/1?user_id=2", headers=AUTH_H_GUEST)
        test("DELETE /api/favorites/{id} already removed → 404", resp.status_code == 404)

        # ── 13. Reviews API ───────────────────────────────────────────────
        print("\n── 13. Reviews API ──────────────────────────────────────────────")

        # Need a booking for review eligibility (guest=2 has a booking on listing_id=1
        # created in setup_test_db)

        # 13a. Get reviews for listing — public, no auth required
        resp = client.get("/api/reviews?listing_id=1")
        test("GET /api/reviews → 200", resp.status_code == 200)
        existing_reviews = resp.json()
        test("Existing reviews is a list", isinstance(existing_reviews, list))
        initial_count = len(existing_reviews)

        # 13b. Get reviews for nonexistent listing → 404
        resp = client.get("/api/reviews?listing_id=9999")
        test("GET /api/reviews nonexistent listing → 404", resp.status_code == 404)

        # 13c. POST review — no auth → 401
        resp = client.post("/api/reviews",
                           json={"listing_id": 1, "reviewer_id": 2,
                                 "rating": 5, "comment": "Great!"})
        test("POST /api/reviews without auth → 401", resp.status_code == 401)

        # 13d. POST review — header/body mismatch → 403
        resp = client.post("/api/reviews",
                           json={"listing_id": 1, "reviewer_id": 2,
                                 "rating": 5, "comment": "Great!"},
                           headers={"X-User-Id": "1"})
        test("POST /api/reviews header/body mismatch → 403", resp.status_code == 403)

        # 13e. POST review — no qualifying booking (use host user for listing 2)
        resp = client.post("/api/reviews",
                           json={"listing_id": 2, "reviewer_id": 1,
                                 "rating": 4, "comment": "Good."},
                           headers=AUTH_H_HOST)
        test("POST /api/reviews without qualifying booking → 403", resp.status_code == 403)

        # 13e2. POST review — future-dated booking cannot review (completed-stay rule)
        conn_rev = get_connection()
        cur_rev = conn_rev.cursor()
        cur_rev.execute("INSERT INTO users (name, email, role) VALUES ('Future Guest', 'future@test.com', 'guest')")
        future_user_id = cur_rev.lastrowid
        cur_rev.execute(
            """INSERT INTO bookings (listing_id, guest_id, check_in, check_out, nightly_rate, nights, cleaning_fee, service_fee, total_price)
               VALUES (2, ?, '2026-12-01', '2026-12-05', 80.0, 4, 15.0, 10.0, 345.0)""",
            (future_user_id,)
        )
        conn_rev.commit()
        conn_rev.close()

        resp = client.post("/api/reviews",
                           json={"listing_id": 2, "user_id": future_user_id,
                                 "rating": 5, "comment": "Can't review yet!"},
                           headers={"X-User-Id": str(future_user_id)})
        test("POST /api/reviews with future booking rejected → 403", resp.status_code == 403)
        test("Future booking error message mentions completed stay",
             "completed stay" in resp.json().get("detail", "").lower() or "completing" in resp.json().get("detail", "").lower())

        # 13f. POST review — success (guest has completed booking on listing 1)
        resp = client.post("/api/reviews",
                           json={"listing_id": 1, "user_id": 2,
                                 "rating": 4, "comment": "Loved it!"},
                           headers=AUTH_H_GUEST)
        test("POST /api/reviews success → 201", resp.status_code == 201)
        rev = resp.json()
        test("Review has id", "id" in rev)
        test("Review listing_id correct", rev["listing_id"] == 1)
        test("Review user_id correct", rev["user_id"] == GUEST_ID)
        test("Review rating correct", rev["rating"] == 4)
        test("Review has reviewer_name", "reviewer_name" in rev)

        # 13g. POST duplicate review → 409
        resp = client.post("/api/reviews",
                           json={"listing_id": 1, "reviewer_id": 2,
                                 "rating": 5, "comment": "Again!"},
                           headers=AUTH_H_GUEST)
        test("POST /api/reviews duplicate → 409", resp.status_code == 409)

        # 13h. GET reviews after submission — count increased
        resp = client.get("/api/reviews?listing_id=1")
        reviews_after = resp.json()
        test("Review count increased by 1", len(reviews_after) == initial_count + 1)
        test("New review appears in list",
             any(r["comment"] == "Loved it!" for r in reviews_after))

        # 13i. Invalid rating (0, 6) → 422
        resp = client.post("/api/reviews",
                           json={"listing_id": 1, "reviewer_id": 2, "rating": 0},
                           headers=AUTH_H_GUEST)
        test("POST /api/reviews rating=0 → 422", resp.status_code == 422)

        resp = client.post("/api/reviews",
                           json={"listing_id": 1, "reviewer_id": 2, "rating": 6},
                           headers=AUTH_H_GUEST)
        test("POST /api/reviews rating=6 → 422", resp.status_code == 422)

        # ── 14. Host Dashboard API ────────────────────────────────────────
        print("\n── 14. Host Dashboard API ───────────────────────────────────────")

        # 14a. GET /api/host/listings — no auth → 401
        resp = client.get("/api/host/listings?host_id=1")
        test("GET /api/host/listings without auth → 401", resp.status_code == 401)

        # 14b. GET /api/host/listings — mismatch → 403
        resp = client.get("/api/host/listings?host_id=1", headers={"X-User-Id": "2"})
        test("GET /api/host/listings header mismatch → 403", resp.status_code == 403)

        # 14c. GET /api/host/listings — guest tries to access host endpoint → 403
        resp = client.get("/api/host/listings?host_id=2", headers=AUTH_H_GUEST)
        test("GET /api/host/listings guest user → 403", resp.status_code == 403)

        # 14d. GET /api/host/listings — host user → 200
        resp = client.get("/api/host/listings?host_id=1", headers=AUTH_H_HOST)
        test("GET /api/host/listings host user → 200", resp.status_code == 200)
        host_listings = resp.json()
        test("Host listings is a list", isinstance(host_listings, list))
        test("Host has at least 3 listings (active + inactive)", len(host_listings) >= 3)
        test("Each listing has booking_count", all("booking_count" in l for l in host_listings))
        test("Each listing has total_revenue", all("total_revenue" in l for l in host_listings))
        test("Inactive listing included in host view",
             any(not l["is_active"] for l in host_listings))

        # 14e. POST /api/host/listings — create new listing
        new_listing_data = {
            "host_id": 1,
            "title": "Brand New Test Listing",
            "description": "A fresh test listing created by the host dashboard.",
            "city": "Vienna",
            "country": "Austria",
            "price_per_night": 120.0,
            "cleaning_fee": 25.0,
            "max_guests": 3,
        }
        resp = client.post("/api/host/listings",
                           json=new_listing_data,
                           headers=AUTH_H_HOST)
        test("POST /api/host/listings → 201", resp.status_code == 201)
        new_listing = resp.json()
        new_listing_id = new_listing.get("id")
        test("New listing has id", new_listing_id is not None)
        test("New listing title correct", new_listing["title"] == "Brand New Test Listing")
        test("New listing is_active = True", new_listing["is_active"] is True)
        test("New listing city correct", new_listing["city"] == "Vienna")

        # 14f. POST /api/host/listings — body/header mismatch → 403
        resp = client.post("/api/host/listings",
                           json={**new_listing_data, "host_id": 1},
                           headers={"X-User-Id": "2"})
        test("POST /api/host/listings body/header mismatch → 403", resp.status_code == 403)

        # 14g. POST /api/host/listings — guest cannot create → 403
        resp = client.post("/api/host/listings",
                           json={**new_listing_data, "host_id": 2},
                           headers=AUTH_H_GUEST)
        test("POST /api/host/listings guest user → 403", resp.status_code == 403)

        # 14h. PATCH listing — update price and title
        if new_listing_id:
            resp = client.patch(f"/api/host/listings/{new_listing_id}",
                                json={"price_per_night": 150.0, "title": "Updated Test Listing"},
                                headers=AUTH_H_HOST)
            test("PATCH /api/host/listings/{id} → 200", resp.status_code == 200)
            updated = resp.json()
            test("PATCH price updated", updated["price_per_night"] == 150.0)
            test("PATCH title updated", updated["title"] == "Updated Test Listing")

        # 14i. PATCH listing owned by different host → 403
        if new_listing_id:
            # Create a second host user for this test
            conn2 = get_connection()
            cur2 = conn2.cursor()
            cur2.execute("INSERT INTO users (name, email, role) VALUES ('Eve Host', 'eve@test.com', 'host')")
            conn2.commit()
            eve_id = cur2.lastrowid
            conn2.close()

            resp = client.patch(f"/api/host/listings/{new_listing_id}",
                                json={"price_per_night": 99.0},
                                headers={"X-User-Id": str(eve_id)})
            test("PATCH /api/host/listings/{id} wrong owner → 403", resp.status_code == 403)

        # 14j. DELETE (soft-delete) listing — success
        if new_listing_id:
            # Create a booking on this new listing to test preservation across soft-delete
            conn_b = get_connection()
            cur_b = conn_b.cursor()
            cur_b.execute(
                """INSERT INTO bookings (listing_id, guest_id, check_in, check_out, nightly_rate, nights, cleaning_fee, service_fee, total_price)
                   VALUES (?, 2, '2026-09-10', '2026-09-15', 120.0, 5, 25.0, 15.0, 640.0)""",
                (new_listing_id,)
            )
            conn_b.commit()
            test_booking_id = cur_b.lastrowid
            conn_b.close()

            resp = client.delete(f"/api/host/listings/{new_listing_id}",
                                 headers=AUTH_H_HOST)
            test("DELETE /api/host/listings/{id} → 200", resp.status_code == 200)
            deleted_listing = resp.json()
            test("Deleted listing is_active = False", deleted_listing["is_active"] is False)

            # Verify listing still exists in DB (soft-delete preserves row)
            conn3 = get_connection()
            row = conn3.execute(
                "SELECT is_active FROM listings WHERE id = ?", (new_listing_id,)
            ).fetchone()
            test("Soft-delete preserves row in DB", row is not None)
            test("Soft-delete sets is_active=0", row["is_active"] == 0)

            # Verify deactivated listing disappears from public listing detail & search results
            resp_pub = client.get(f"/api/listings/{new_listing_id}")
            test("Soft-deleted listing hidden from public detail → 404",
                 resp_pub.status_code == 404)
            resp_search = client.get(f"/api/listings?city={new_listing['city']}")
            search_ids = [l["id"] for l in resp_search.json()["items"]]
            test("Soft-deleted listing disappears from search results",
                 new_listing_id not in search_ids)

            # Verify existing booking rows remain intact
            booking_row = conn3.execute(
                "SELECT * FROM bookings WHERE id = ?", (test_booking_id,)
            ).fetchone()
            test("Existing booking row remains after soft delete", booking_row is not None)
            test("Booking listing_id unchanged", booking_row["listing_id"] == new_listing_id)

            # Verify historical booking price snapshots remain unchanged
            test("Historical nightly_rate intact", booking_row["nightly_rate"] == 120.0)
            test("Historical nights intact", booking_row["nights"] == 5)
            test("Historical cleaning_fee intact", booking_row["cleaning_fee"] == 25.0)
            test("Historical service_fee intact", booking_row["service_fee"] == 15.0)
            test("Historical total_price intact", booking_row["total_price"] == 640.0)
            conn3.close()

            # Reactivate listing
            resp = client.post(f"/api/host/listings/{new_listing_id}/reactivate",
                               headers=AUTH_H_HOST)
            test("POST /api/host/listings/{id}/reactivate → 200", resp.status_code == 200)
            reactivated = resp.json()
            test("Reactivated listing is_active = True", reactivated["is_active"] is True)

        # 14k. GET /api/host/bookings — host sees guest bookings on their listings
        resp = client.get("/api/host/bookings?host_id=1", headers=AUTH_H_HOST)
        test("GET /api/host/bookings → 200", resp.status_code == 200)
        host_bookings = resp.json()
        test("Host bookings is a list", isinstance(host_bookings, list))
        # Listing 1 has a booking by Bob, listing 2 has none
        test("Host bookings ≥ 1 (listing 1 is booked)", len(host_bookings) >= 1)
        test("Host booking has guest_name", all("guest_name" in b for b in host_bookings))
        test("Host booking has listing_title", all("listing_title" in b for b in host_bookings))

        # 14l. GET /api/host/bookings — wrong auth → 403
        resp = client.get("/api/host/bookings?host_id=1", headers={"X-User-Id": "2"})
        test("GET /api/host/bookings mismatch → 403", resp.status_code == 403)

        # ── 15. Booking concurrency guard ─────────────────────────────────
        print("\n── 15. Booking overlap / concurrency guard ──────────────────────")

        # Listing 1 is booked 2026-10-01 → 2026-10-05.
        # Attempt to book overlapping range from a different user.
        conn4 = get_connection()
        cur4 = conn4.cursor()
        cur4.execute(
            "INSERT INTO users (name, email, role) VALUES ('Zara Guest', 'zara@test.com', 'guest')"
        )
        conn4.commit()
        zara_id = cur4.lastrowid
        conn4.close()

        # Fully overlapping dates (2026-10-02 → 2026-10-04 inside existing 10-01 to 10-05)
        resp = client.post("/api/bookings", json={
            "listing_id": 1,
            "guest_id": zara_id,
            "check_in": "2026-10-02",
            "check_out": "2026-10-04",
            "guest_count": 1,
        })
        test("Overlapping booking → 409 Conflict", resp.status_code == 409)

        # Boundary-adjacent — check_in = existing check_out (2026-10-05 → 2026-10-07)
        # This should NOT conflict (boundary is exclusive)
        resp = client.post("/api/bookings", json={
            "listing_id": 1,
            "guest_id": zara_id,
            "check_in": "2026-10-05",
            "check_out": "2026-10-07",
            "guest_count": 1,
        })
        test("Boundary-adjacent booking (no overlap) → 201", resp.status_code == 201)

        # ── 16. Host Photos & Amenities CRUD ──────────────────────────
        print("\n── 16. Host Photos & Amenities CRUD ─────────────────────────")

        # 16a. GET /api/amenities
        resp = client.get("/api/amenities")
        test("GET /api/amenities → 200", resp.status_code == 200)
        amenities_list = resp.json()
        test("GET /api/amenities returns list", isinstance(amenities_list, list))
        test("WiFi is in amenities list", "WiFi" in amenities_list)
        test("Kitchen is in amenities list", "Kitchen" in amenities_list)

        # 16b. Create listing with multiple image URLs and amenities
        test_images = [
            "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
            "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
            "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800",
        ]
        test_amenities = ["WiFi", "Kitchen", "Pool", "Dedicated Workspace"]

        listing_with_media_data = {
            "host_id": 1,
            "title": "Luxury Penthouse with Pool",
            "description": "Stunning penthouse with panoramic skyline views, pool, and workspace.",
            "city": "Madrid",
            "country": "Spain",
            "price_per_night": 290.0,
            "cleaning_fee": 50.0,
            "max_guests": 4,
            "images": test_images,
            "amenities": test_amenities,
        }

        resp = client.post("/api/host/listings",
                           json=listing_with_media_data,
                           headers=AUTH_H_HOST)
        test("POST /api/host/listings with photos & amenities → 201", resp.status_code == 201)
        created_media_listing = resp.json()
        media_listing_id = created_media_listing.get("id")
        test("Created listing returns images list", "images" in created_media_listing)
        test("Created listing has 3 images", len(created_media_listing["images"]) == 3)
        test("Created listing returns amenities list", "amenities" in created_media_listing)
        test("Created listing has 4 amenities", len(created_media_listing["amenities"]) == 4)

        # 16c. Verify SQL positions 0, 1, 2 in database
        conn_img = get_connection()
        img_rows = conn_img.execute(
            "SELECT url, position FROM listing_images WHERE listing_id = ? ORDER BY position ASC",
            (media_listing_id,)
        ).fetchall()
        test("DB listing_images has 3 rows", len(img_rows) == 3)
        test("First image has position 0", img_rows[0]["position"] == 0 and img_rows[0]["url"] == test_images[0])
        test("Second image has position 1", img_rows[1]["position"] == 1 and img_rows[1]["url"] == test_images[1])
        test("Third image has position 2", img_rows[2]["position"] == 2 and img_rows[2]["url"] == test_images[2])

        # 16d. Verify public listing detail returns persisted images & amenities
        resp_detail = client.get(f"/api/listings/{media_listing_id}")
        test("Public GET /api/listings/{id} returns 200", resp_detail.status_code == 200)
        detail_data = resp_detail.json()
        test("Public detail has correct images in order", detail_data["images"] == test_images)
        test("Public detail has WiFi in amenities", "WiFi" in detail_data["amenities"])
        test("Public detail has Pool in amenities", "Pool" in detail_data["amenities"])

        # 16e. Update listing: replace photos and amenities
        new_test_images = [
            "https://images.unsplash.com/photo-updated-1?w=800",
            "https://images.unsplash.com/photo-updated-2?w=800",
        ]
        new_test_amenities = ["Air Conditioning", "TV"]

        resp = client.patch(f"/api/host/listings/{media_listing_id}",
                            json={"images": new_test_images, "amenities": new_test_amenities},
                            headers=AUTH_H_HOST)
        test("PATCH /api/host/listings/{id} with new photos/amenities → 200", resp.status_code == 200)
        updated_media = resp.json()
        test("Updated listing has 2 images", len(updated_media["images"]) == 2)
        test("Updated listing has 2 amenities", len(updated_media["amenities"]) == 2)

        # Verify public detail reflects update
        resp_detail_updated = client.get(f"/api/listings/{media_listing_id}")
        test("Public detail returns updated images", resp_detail_updated.json()["images"] == new_test_images)
        test("Public detail returns updated amenities", "Air Conditioning" in resp_detail_updated.json()["amenities"])

        # 16f. Empty / whitespace image strings are cleanly ignored
        dirty_images_data = {
            "host_id": 1,
            "title": "Clean Photo Test Listing",
            "description": "Testing empty string handling in photo array.",
            "city": "Berlin",
            "country": "Germany",
            "price_per_night": 110.0,
            "cleaning_fee": 20.0,
            "max_guests": 2,
            "images": ["", "   ", "https://images.unsplash.com/valid-photo?w=800", ""],
            "amenities": ["WiFi", "  ", ""],
        }
        resp = client.post("/api/host/listings",
                           json=dirty_images_data,
                           headers=AUTH_H_HOST)
        test("POST with whitespace images filters out empty URLs → 201", resp.status_code == 201)
        dirty_res = resp.json()
        test("Only 1 valid image was saved", len(dirty_res["images"]) == 1)
        test("Saved image is the valid URL", dirty_res["images"][0] == "https://images.unsplash.com/valid-photo?w=800")
        test("Only 1 valid amenity saved", len(dirty_res["amenities"]) == 1)
        conn_img.close()

    finally:
        teardown_test_db()

    # ── Summary ───────────────────────────────────────────────────────────
    total = passed + failed
    print(f"\n{'='*56}")
    print(f"Results: {passed}/{total} passed, {failed} failed")
    print(f"{'='*56}")

    if failed > 0:
        sys.exit(1)


if __name__ == "__main__":
    run_tests()

