"use client";

import React, { Suspense, useEffect, useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/components/Header";
import { SearchMap } from "@/components/SearchMap";
import { SearchResultCard } from "@/components/SearchResultCard";
import { getListings, ListingSearchParams } from "@/lib/api";
import { Listing } from "@/types/listing";
import styles from "./page.module.css";

function SearchResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Extract search params from URL
  const city = searchParams.get("city") || "";
  const checkIn = searchParams.get("check_in") || "";
  const checkOut = searchParams.get("check_out") || "";
  const guestsParam = searchParams.get("guests");
  const guests = guestsParam ? parseInt(guestsParam, 10) : undefined;
  const minPriceParam = searchParams.get("min_price");
  const maxPriceParam = searchParams.get("max_price");
  const minPrice = minPriceParam ? parseFloat(minPriceParam) : undefined;
  const maxPrice = maxPriceParam ? parseFloat(maxPriceParam) : undefined;

  const [listings, setListings] = useState<Listing[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filter UI states
  const [isPriceOpen, setIsPriceOpen] = useState<boolean>(false);
  const [isTypeOpen, setIsTypeOpen] = useState<boolean>(false);
  const [isFiltersModalOpen, setIsFiltersModalOpen] = useState<boolean>(false);

  // Local filter inputs
  const [tempMinPrice, setTempMinPrice] = useState<string>(minPriceParam || "");
  const [tempMaxPrice, setTempMaxPrice] = useState<string>(maxPriceParam || "");

  // Hover sync between list and map
  const [hoveredListingId, setHoveredListingId] = useState<number | null>(null);
  const [showMobileMap, setShowMobileMap] = useState<boolean>(false);

  // Calculate nights from dates
  const totalNights = useMemo(() => {
    if (!checkIn || !checkOut) return 1;
    const d1 = new Date(checkIn);
    const d2 = new Date(checkOut);
    const diff = Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  }, [checkIn, checkOut]);

  // Formatted date label for cards and header
  const dateRangeLabel = useMemo(() => {
    if (!checkIn || !checkOut) return undefined;
    const d1 = new Date(checkIn);
    const d2 = new Date(checkOut);
    const m1 = d1.toLocaleString("en-US", { month: "short" });
    const m2 = d2.toLocaleString("en-US", { month: "short" });
    if (m1 === m2) {
      return `${d1.getDate()}–${d2.getDate()} ${m1}`;
    }
    return `${d1.getDate()} ${m1} – ${d2.getDate()} ${m2}`;
  }, [checkIn, checkOut]);

  // Query the real backend API with active search parameters
  useEffect(() => {
    let isCancelled = false;

    const apiParams: ListingSearchParams = {
      city: city || undefined,
      guests: guests && guests > 0 ? guests : undefined,
      min_price: minPrice,
      max_price: maxPrice,
      check_in: checkIn || undefined,
      check_out: checkOut || undefined,
      page_size: 50,
    };

    getListings(apiParams)
      .then((data) => {
        if (!isCancelled) {
          setListings(data.items);
          setTotal(data.total);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (!isCancelled) {
          setError(err instanceof Error ? err.message : "Failed to load listings");
          setLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [city, guests, minPrice, maxPrice, checkIn, checkOut]);

  // Apply price filter to URL
  const handleApplyPrice = () => {
    const params = new URLSearchParams(searchParams.toString());
    const minVal = parseFloat(tempMinPrice);
    const maxVal = parseFloat(tempMaxPrice);

    if (!isNaN(minVal) && minVal >= 0) {
      params.set("min_price", minVal.toString());
    } else {
      params.delete("min_price");
    }

    if (!isNaN(maxVal) && maxVal >= 0) {
      params.set("max_price", maxVal.toString());
    } else {
      params.delete("max_price");
    }

    setIsPriceOpen(false);
    router.push(`/search?${params.toString()}`);
  };

  const handleClearPrice = () => {
    setTempMinPrice("");
    setTempMaxPrice("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("min_price");
    params.delete("max_price");
    setIsPriceOpen(false);
    router.push(`/search?${params.toString()}`);
  };

  const isPriceActive = minPrice !== undefined || maxPrice !== undefined;

  const destinationDisplay = city || "Homes in map area";
  const datesDisplay = dateRangeLabel || "Anytime";
  const guestsDisplay = guests && guests > 0 ? `${guests} ${guests === 1 ? "guest" : "guests"}` : "Add guests";

  return (
    <div className={styles.pageWrapper}>
      {/* Header with compact search bar matching Screenshot 1 */}
      <Header
        activeTab="homes"
        onTabChange={() => {}}
        showCompactAlways={true}
        destination={destinationDisplay}
        datesLabel={datesDisplay}
        guestsLabel={guestsDisplay}
        onOpenSearch={() => router.push("/")}
      />

      {/* Filter Bar below Header */}
      <div className={styles.filterBar}>
        {/* FILTERS BUTTON */}
        <button
          type="button"
          className={`${styles.filterBtn} ${isFiltersModalOpen ? styles.filterBtnActive : ""}`}
          onClick={() => setIsFiltersModalOpen((prev) => !prev)}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M2 4h12v1.5H2V4zm2 4h8v1.5H4V8zm3 4h2v1.5H7V12z" />
          </svg>
          Filters
        </button>

        {/* PRICE FILTER BUTTON & POPOVER */}
        <div style={{ position: "relative" }}>
          <button
            type="button"
            className={`${styles.filterBtn} ${isPriceActive ? styles.filterBtnActive : ""}`}
            onClick={() => setIsPriceOpen((prev) => !prev)}
          >
            Price
            {isPriceActive && (
              <span className={styles.filterBadge}>
                ${minPrice || 0}–${maxPrice ? `$${maxPrice}` : "+"}
              </span>
            )}
            <span className={`${styles.caretIcon} ${isPriceOpen ? styles.caretOpen : ""}`}>
              ▼
            </span>
          </button>

          {isPriceOpen && (
            <>
              <div
                className={styles.popoverBackdrop}
                onClick={() => setIsPriceOpen(false)}
              />
              <div className={styles.filterPopover}>
                <h4 className={styles.popoverTitle}>Price range</h4>
                <p className={styles.popoverSubtitle}>Nightly prices before taxes and fees</p>

                <div className={styles.priceInputsRow}>
                  <div className={styles.priceInputGroup}>
                    <span className={styles.priceLabel}>Minimum</span>
                    <div className={styles.priceInputField}>
                      <span className={styles.currencySign}>$</span>
                      <input
                        type="number"
                        min="0"
                        placeholder="0"
                        value={tempMinPrice}
                        onChange={(e) => setTempMinPrice(e.target.value)}
                        className={styles.priceInput}
                      />
                    </div>
                  </div>

                  <span style={{ color: "#717171" }}>–</span>

                  <div className={styles.priceInputGroup}>
                    <span className={styles.priceLabel}>Maximum</span>
                    <div className={styles.priceInputField}>
                      <span className={styles.currencySign}>$</span>
                      <input
                        type="number"
                        min="0"
                        placeholder="500+"
                        value={tempMaxPrice}
                        onChange={(e) => setTempMaxPrice(e.target.value)}
                        className={styles.priceInput}
                      />
                    </div>
                  </div>
                </div>

                <div className={styles.popoverFooter}>
                  <button
                    type="button"
                    className={styles.clearBtn}
                    onClick={handleClearPrice}
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    className={styles.applyBtn}
                    onClick={handleApplyPrice}
                  >
                    Apply
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* TYPE OF PLACE FILTER BUTTON & POPOVER */}
        <div style={{ position: "relative" }}>
          <button
            type="button"
            className={`${styles.filterBtn} ${isTypeOpen ? styles.filterBtnActive : ""}`}
            onClick={() => setIsTypeOpen((prev) => !prev)}
          >
            Type of place
            <span className={`${styles.caretIcon} ${isTypeOpen ? styles.caretOpen : ""}`}>
              ▼
            </span>
          </button>

          {isTypeOpen && (
            <>
              <div
                className={styles.popoverBackdrop}
                onClick={() => setIsTypeOpen(false)}
              />
              <div className={styles.filterPopover} style={{ width: "340px" }}>
                <h4 className={styles.popoverTitle}>Type of place</h4>
                <p className={styles.popoverSubtitle}>Search rooms, entire homes, or shared spaces</p>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <label style={{ display: "flex", gap: "10px", alignItems: "flex-start", cursor: "pointer" }}>
                    <input type="checkbox" defaultChecked disabled style={{ marginTop: "4px" }} />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>Entire place</div>
                      <div style={{ fontSize: "0.78rem", color: "#717171" }}>A place all to yourself</div>
                    </div>
                  </label>

                  <label style={{ display: "flex", gap: "10px", alignItems: "flex-start", opacity: 0.6, cursor: "not-allowed" }}>
                    <input type="checkbox" disabled style={{ marginTop: "4px" }} />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>Room</div>
                      <div style={{ fontSize: "0.78rem", color: "#717171" }}>Your own room plus shared areas</div>
                    </div>
                  </label>
                </div>

                {/* Honest backend limitation disclosure as instructed */}
                <div className={styles.noticeBox}>
                  ℹ️ <strong>Backend Notice:</strong> All properties currently seeded in the database are entire vacation rentals. The SQLite database schema does not contain a separate room-type column.
                </div>

                <div className={styles.popoverFooter} style={{ marginTop: "16px" }}>
                  <button
                    type="button"
                    className={styles.applyBtn}
                    style={{ width: "100%" }}
                    onClick={() => setIsTypeOpen(false)}
                  >
                    Done
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Main Split Layout: Results Column on left, Map on right */}
      <main className={styles.mainSplit}>
        {/* Left: Listing Results */}
        <section className={styles.resultsColumn} aria-label="Search results">
          {/* Results Header matching Screenshot 1 */}
          <div className={styles.resultsHeader}>
            <h1 className={styles.resultsCountTitle}>
              {loading
                ? "Searching homes…"
                : total > 0
                ? `Over ${total} ${total === 1 ? "home" : "homes"} within map area`
                : "No homes found"}
            </h1>

            {/* Pink Price Tag Badge matching Screenshot 1 */}
            <div className={styles.priceTagBadge}>
              <svg className={styles.priceTagIcon} viewBox="0 0 24 24">
                <path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z" />
              </svg>
              <span>Prices include all fees</span>
            </div>
          </div>

          {/* Loading state */}
          {loading && (
            <div className={styles.stateBox}>
              <div className={styles.stateIcon}>⏳</div>
              <p>Finding the best stays for you…</p>
            </div>
          )}

          {/* Error state */}
          {!loading && error && (
            <div className={styles.stateBox}>
              <div className={styles.stateIcon}>⚠️</div>
              <p>{error}</p>
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && listings.length === 0 && (
            <div className={styles.stateBox}>
              <div className={styles.stateIcon}>🏖️</div>
              <h3 style={{ margin: "0 0 8px 0", color: "#222" }}>No stays match your search</h3>
              <p>Try expanding your price range, changing dates, or searching another destination.</p>
              {isPriceActive && (
                <button
                  type="button"
                  onClick={handleClearPrice}
                  style={{
                    marginTop: "16px",
                    padding: "8px 16px",
                    background: "#222",
                    color: "#fff",
                    borderRadius: "8px",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Clear price filter
                </button>
              )}
            </div>
          )}

          {/* Results List */}
          {!loading && !error && listings.length > 0 && (
            <div className={styles.listingsGrid}>
              {/* Featured First Card matching top horizontal card in Screenshot 1 */}
              <SearchResultCard
                listing={listings[0]}
                isFeatured={true}
                dateRangeLabel={dateRangeLabel}
                totalNights={totalNights}
                onHover={setHoveredListingId}
              />

              {/* Remaining listings in 2-column grid matching Screenshot 1 */}
              {listings.length > 1 && (
                <div className={styles.twoColumnGrid}>
                  {listings.slice(1).map((listing) => (
                    <SearchResultCard
                      key={`search-${listing.id}`}
                      listing={listing}
                      isFeatured={false}
                      dateRangeLabel={dateRangeLabel}
                      totalNights={totalNights}
                      onHover={setHoveredListingId}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </section>

        {/* Right: Interactive Sticky Map with Price Markers */}
        <aside
          className={`${styles.mapColumn} ${
            showMobileMap ? styles.mapColumnVisibleMobile : ""
          }`}
          aria-label="Listings map view"
        >
          <SearchMap
            listings={listings}
            hoveredListingId={hoveredListingId}
            onMarkerHover={setHoveredListingId}
            selectedCity={city}
          />
        </aside>
      </main>

      {/* Floating button on Mobile to toggle between Map and List */}
      <button
        type="button"
        className={styles.mobileMapToggle}
        onClick={() => setShowMobileMap((prev) => !prev)}
      >
        {showMobileMap ? "Show list ☰" : "Show map 🗺️"}
      </button>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div style={{ padding: "2rem" }}>Loading search results…</div>}>
      <SearchResultsContent />
    </Suspense>
  );
}
