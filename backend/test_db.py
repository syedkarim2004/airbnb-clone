"""
test_db.py — Verify the database schema, constraints, and seed data.

Run:  python test_db.py

Expects airbnb.db to already exist (run seed.py first).
Tests that foreign-key enforcement, unique constraints, and seed data
are all working correctly.
"""

import os
import sqlite3
import sys

from database import DEFAULT_DB_PATH, get_connection

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


def run_tests(db_path: str = DEFAULT_DB_PATH) -> None:
    global passed, failed

    if not os.path.exists(db_path):
        print(f"Database not found at {db_path}")
        print("Run 'python seed.py' first.")
        sys.exit(1)

    conn = get_connection(db_path)

    # ── Schema Tests ──────────────────────────────────────────────────────
    print("\n── Schema Tests ─────────────────────────────────────────")

    # Check all 8 tables exist
    cur = conn.execute(
        "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name"
    )
    tables = {row["name"] for row in cur.fetchall()}
    expected_tables = {
        "users", "listings", "listing_images", "amenities",
        "listing_amenities", "bookings", "reviews", "favorites",
    }
    test("All 8 tables exist", expected_tables.issubset(tables))

    # Check listings has city, country, latitude, longitude columns
    cur = conn.execute("PRAGMA table_info(listings)")
    listing_cols = {row["name"] for row in cur.fetchall()}
    test("listings has 'city' column", "city" in listing_cols)
    test("listings has 'country' column", "country" in listing_cols)
    test("listings has 'latitude' column", "latitude" in listing_cols)
    test("listings has 'longitude' column", "longitude" in listing_cols)

    # Check latitude/longitude are nullable (notnull == 0)
    cur = conn.execute("PRAGMA table_info(listings)")
    col_info = {row["name"]: row["notnull"] for row in cur.fetchall()}
    test("latitude is nullable", col_info.get("latitude") == 0)
    test("longitude is nullable", col_info.get("longitude") == 0)

    # Check bookings has price snapshot columns
    cur = conn.execute("PRAGMA table_info(bookings)")
    booking_cols = {row["name"] for row in cur.fetchall()}
    for col in ("nightly_rate", "nights", "cleaning_fee", "service_fee", "total_price"):
        test(f"bookings has '{col}' column", col in booking_cols)

    # ── FK Enforcement Tests ──────────────────────────────────────────────
    print("\n── Foreign Key Enforcement Tests ─────────────────────────")

    # Verify PRAGMA foreign_keys is ON
    fk_status = conn.execute("PRAGMA foreign_keys").fetchone()[0]
    test("PRAGMA foreign_keys = ON", fk_status == 1)

    # Attempt to insert a booking referencing a nonexistent listing
    fk_rejected = False
    try:
        conn.execute(
            """INSERT INTO bookings
               (listing_id, guest_id, check_in, check_out,
                nightly_rate, nights, cleaning_fee, service_fee, total_price)
               VALUES (999999, 1, '2026-01-01', '2026-01-03', 100, 2, 0, 0, 200)"""
        )
    except sqlite3.IntegrityError:
        fk_rejected = True
    test("FK violation rejected (nonexistent listing_id=999999)", fk_rejected)

    # Attempt to insert a booking referencing a nonexistent guest
    fk_rejected_guest = False
    try:
        conn.execute(
            """INSERT INTO bookings
               (listing_id, guest_id, check_in, check_out,
                nightly_rate, nights, cleaning_fee, service_fee, total_price)
               VALUES (1, 999999, '2026-01-01', '2026-01-03', 100, 2, 0, 0, 200)"""
        )
    except sqlite3.IntegrityError:
        fk_rejected_guest = True
    test("FK violation rejected (nonexistent guest_id=999999)", fk_rejected_guest)

    # Verify a valid FK insert succeeds
    valid_insert = False
    try:
        conn.execute(
            """INSERT INTO bookings
               (listing_id, guest_id, check_in, check_out,
                nightly_rate, nights, cleaning_fee, service_fee, total_price)
               VALUES (1, 3, '2099-01-01', '2099-01-03', 100, 2, 0, 0, 200)"""
        )
        valid_insert = True
        # Roll back so the test booking doesn't persist
        conn.rollback()
    except sqlite3.IntegrityError:
        valid_insert = False
    test("Valid FK insert succeeds", valid_insert)

    # ── Unique Constraint Tests ───────────────────────────────────────────
    print("\n── Unique Constraint Tests ──────────────────────────────")

    # Duplicate user email
    dup_email = False
    try:
        conn.execute(
            "INSERT INTO users (name, email, role) VALUES ('Test', 'alice@example.com', 'guest')"
        )
    except sqlite3.IntegrityError:
        dup_email = True
    test("Duplicate user email rejected", dup_email)

    # Duplicate listing-amenity pair
    dup_la = False
    try:
        conn.execute(
            "INSERT INTO listing_amenities (listing_id, amenity_id) VALUES (1, 1)"
        )
    except sqlite3.IntegrityError:
        dup_la = True
    test("Duplicate listing-amenity pair rejected", dup_la)

    # Duplicate favorite
    dup_fav = False
    try:
        conn.execute(
            "INSERT INTO favorites (user_id, listing_id) VALUES (3, 1)"
        )
    except sqlite3.IntegrityError:
        dup_fav = True
    test("Duplicate favorite rejected", dup_fav)

    # ── Data Tests ────────────────────────────────────────────────────────
    print("\n── Data Tests ──────────────────────────────────────────")

    # Users
    user_count = conn.execute("SELECT COUNT(*) FROM users").fetchone()[0]
    test(f"Multiple users exist ({user_count})", user_count >= 3)

    host_count = conn.execute(
        "SELECT COUNT(*) FROM users WHERE role IN ('host', 'both')"
    ).fetchone()[0]
    test(f"Multiple hosts exist ({host_count})", host_count >= 2)

    guest_count = conn.execute(
        "SELECT COUNT(*) FROM users WHERE role IN ('guest', 'both')"
    ).fetchone()[0]
    test(f"At least one guest exists ({guest_count})", guest_count >= 1)

    # Listings across multiple cities/countries
    city_count = conn.execute(
        "SELECT COUNT(DISTINCT city) FROM listings"
    ).fetchone()[0]
    test(f"Listings span multiple cities ({city_count})", city_count >= 3)

    country_count = conn.execute(
        "SELECT COUNT(DISTINCT country) FROM listings"
    ).fetchone()[0]
    test(f"Listings span multiple countries ({country_count})", country_count >= 3)

    # Listings have structured location (city + country, not free text)
    sample = conn.execute(
        "SELECT city, country FROM listings LIMIT 1"
    ).fetchone()
    test("Listing location is structured (city + country)",
         sample["city"] is not None and sample["country"] is not None)

    # Latitude/longitude present on some listings
    coord_count = conn.execute(
        "SELECT COUNT(*) FROM listings WHERE latitude IS NOT NULL AND longitude IS NOT NULL"
    ).fetchone()[0]
    test(f"Some listings have coordinates ({coord_count})", coord_count >= 1)

    # Bookings with price snapshots
    booking_count = conn.execute("SELECT COUNT(*) FROM bookings").fetchone()[0]
    test(f"Bookings exist ({booking_count})", booking_count >= 1)

    snapshot = conn.execute(
        "SELECT nightly_rate, nights, cleaning_fee, service_fee, total_price FROM bookings LIMIT 1"
    ).fetchone()
    test("Booking has price snapshot fields",
         all(snapshot[col] is not None for col in
             ("nightly_rate", "nights", "cleaning_fee", "service_fee", "total_price")))

    # is_active soft-delete field
    active_count = conn.execute(
        "SELECT COUNT(*) FROM listings WHERE is_active = 1"
    ).fetchone()[0]
    test(f"is_active soft-delete field works ({active_count} active)", active_count >= 1)

    # Reviews
    review_count = conn.execute("SELECT COUNT(*) FROM reviews").fetchone()[0]
    test(f"Reviews exist ({review_count})", review_count >= 1)

    # Favorites
    fav_count = conn.execute("SELECT COUNT(*) FROM favorites").fetchone()[0]
    test(f"Favorites exist ({fav_count})", fav_count >= 1)

    # Images
    img_count = conn.execute("SELECT COUNT(*) FROM listing_images").fetchone()[0]
    test(f"Listing images exist ({img_count})", img_count >= 1)

    # Amenities and links
    amenity_count = conn.execute("SELECT COUNT(*) FROM amenities").fetchone()[0]
    test(f"Amenities exist ({amenity_count})", amenity_count >= 1)

    link_count = conn.execute("SELECT COUNT(*) FROM listing_amenities").fetchone()[0]
    test(f"Listing-amenity links exist ({link_count})", link_count >= 1)

    # ── Summary ───────────────────────────────────────────────────────────
    conn.close()
    total = passed + failed
    print(f"\n{'='*56}")
    print(f"Results: {passed}/{total} passed, {failed} failed")
    print(f"{'='*56}")

    if failed > 0:
        sys.exit(1)


if __name__ == "__main__":
    run_tests()
