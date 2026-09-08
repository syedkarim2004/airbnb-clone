"""
test_availability.py — Verification tests for listing availability and host relationships.
"""

from fastapi.testclient import TestClient
from main import app
import sys

client = TestClient(app)

def run_tests():
    passed = 0
    failed = 0

    def check(name: str, cond: bool):
        nonlocal passed, failed
        if cond:
            passed += 1
            print(f"  PASS  {name}")
        else:
            failed += 1
            print(f"  FAIL  {name}")

    print("\n── 1. Availability API Tests ─────────────────────────────")
    # Active listing returns availability
    res = client.get("/api/listings/1/availability")
    check("GET /api/listings/1/availability returns 200", res.status_code == 200)
    data = res.json()
    check("Availability response has 'listing_id'", data.get("listing_id") == 1)
    check("Availability response has 'unavailable_dates' list", isinstance(data.get("unavailable_dates"), list))
    check("Availability response has 'booked_ranges' list", isinstance(data.get("booked_ranges"), list))

    # Inactive/nonexistent listing returns 404
    res_404 = client.get("/api/listings/999999/availability")
    check("Nonexistent listing returns 404", res_404.status_code == 404)

    # Inactive listing returns 404
    res_inactive = client.get("/api/listings/25/availability")
    check("Inactive listing returns 404", res_inactive.status_code == 404)

    print("\n── 2. Host Relationship Tests ────────────────────────────")
    # Listing 1 is hosted by Alice Martin (host_id = 1)
    res_l1 = client.get("/api/listings/1")
    check("Listing 1 returns 200", res_l1.status_code == 200)
    l1 = res_l1.json()
    check("Listing 1 host name is Alice Martin", l1.get("host", {}).get("name") == "Alice Martin")
    check("Listing 1 host id is 1", l1.get("host", {}).get("id") == 1)
    check("Listing 1 host_id is 1", l1.get("host_id") == 1)

    # Listing 3 is hosted by Elena Rossi (host_id = 7)
    res_l3 = client.get("/api/listings/3")
    check("Listing 3 returns 200", res_l3.status_code == 200)
    l3 = res_l3.json()
    check("Listing 3 host name is Elena Rossi", l3.get("host", {}).get("name") == "Elena Rossi")
    check("Listing 3 host id is 7", l3.get("host", {}).get("id") == 7)
    check("Listing 3 host_id is 7", l3.get("host_id") == 7)

    # Listing 4 is hosted by Bob Chen (host_id = 2)
    res_l4 = client.get("/api/listings/4")
    check("Listing 4 returns 200", res_l4.status_code == 200)
    l4 = res_l4.json()
    check("Listing 4 host name is Bob Chen", l4.get("host", {}).get("name") == "Bob Chen")
    check("Listing 4 host id is 2", l4.get("host", {}).get("id") == 2)
    check("Listing 4 host_id is 2", l4.get("host_id") == 2)

    print("\n── 3. Host Dashboard Isolation Tests ─────────────────────")
    # Elena Rossi sees Listing 3 in host dashboard
    res_elena = client.get("/api/host/listings?host_id=7", headers={"X-User-Id": "7"})
    check("Elena Rossi GET /api/host/listings returns 200", res_elena.status_code == 200)
    elena_listings = res_elena.json()
    check("Listing 3 is in Elena's dashboard", any(l["id"] == 3 for l in elena_listings))
    check("Listing 1 is NOT in Elena's dashboard", not any(l["id"] == 1 for l in elena_listings))

    # Alice Martin sees Listing 1, not Listing 3
    res_alice = client.get("/api/host/listings?host_id=1", headers={"X-User-Id": "1"})
    check("Alice Martin GET /api/host/listings returns 200", res_alice.status_code == 200)
    alice_listings = res_alice.json()
    check("Listing 1 is in Alice's dashboard", any(l["id"] == 1 for l in alice_listings))
    check("Listing 3 is NOT in Alice's dashboard", not any(l["id"] == 3 for l in alice_listings))

    # Bob Chen sees Listing 4, not Listing 1 or 3
    res_bob = client.get("/api/host/listings?host_id=2", headers={"X-User-Id": "2"})
    check("Bob Chen GET /api/host/listings returns 200", res_bob.status_code == 200)
    bob_listings = res_bob.json()
    check("Listing 4 is in Bob's dashboard", any(l["id"] == 4 for l in bob_listings))
    check("Listing 3 is NOT in Bob's dashboard", not any(l["id"] == 3 for l in bob_listings))

    print(f"\nResults: {passed}/{passed + failed} passed, {failed} failed")
    if failed > 0:
        sys.exit(1)

if __name__ == "__main__":
    run_tests()
