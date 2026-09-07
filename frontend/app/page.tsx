"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Listing } from "@/types/listing";
import { getListings } from "@/lib/api";
import { Header, HeaderTab } from "@/components/Header";
import { SearchBar } from "@/components/SearchBar";
import { CategoryNav } from "@/components/CategoryNav";
import { ListingCard } from "@/components/ListingCard";
import { ExperiencesView } from "@/components/ExperiencesView";
import { ServicesView } from "@/components/ServicesView";
import { Footer } from "@/components/Footer";
import { useScrolled } from "@/hooks/useScrolled";
import styles from "./page.module.css";

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

export default function Home() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<HeaderTab>("all");
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [destination, setDestination] = useState<string>("");
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [adults, setAdults] = useState<number>(0);
  const [children, setChildren] = useState<number>(0);
  const [infants, setInfants] = useState<number>(0);
  const [pets, setPets] = useState<number>(0);
  const [serviceType, setServiceType] = useState<string>("");

  const handleSearch = useCallback(() => {
    const params = new URLSearchParams();
    if (destination.trim()) {
      const city = destination.split(",")[0].trim();
      if (city && city !== "Nearby") {
        params.set("city", city);
      }
    }
    if (checkIn) {
      params.set("check_in", checkIn.toISOString().split("T")[0]);
    }
    if (checkOut) {
      params.set("check_out", checkOut.toISOString().split("T")[0]);
    }
    const totalGuests = adults + children;
    if (totalGuests > 0) {
      params.set("guests", totalGuests.toString());
    }
    router.push(`/search?${params.toString()}`);
  }, [destination, checkIn, checkOut, adults, children, router]);

  const isScrolled = useScrolled(70);
  const [isSearchExpanded, setIsSearchExpanded] = useState<boolean>(false);

  const fetchListings = useCallback(async () => {
    try {
      const page = await getListings();
      setListings(page.items);
      setError(null);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to load listings. Please check the backend service.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isCancelled = false;
    getListings()
      .then((page) => {
        if (!isCancelled) {
          setListings(page.items);
          setError(null);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (!isCancelled) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError("Failed to load listings. Please check the backend service.");
          }
          setLoading(false);
        }
      });
    return () => { isCancelled = true; };
  }, []);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    fetchListings();
  };

  const totalGuests = adults + children;
  const guestsLabel =
    totalGuests === 0 && infants === 0 && pets === 0
      ? "Add guests"
      : `${totalGuests > 0 ? `${totalGuests} guest${totalGuests > 1 ? "s" : ""}` : ""}${
          infants > 0 ? `, ${infants} infant${infants > 1 ? "s" : ""}` : ""
        }${pets > 0 ? `, ${pets} pet${pets > 1 ? "s" : ""}` : ""}`;

  const datesLabel = checkIn
    ? checkOut
      ? `${MONTH_NAMES[checkIn.getMonth()]} ${checkIn.getDate()} – ${MONTH_NAMES[checkOut.getMonth()]} ${checkOut.getDate()}`
      : `${MONTH_NAMES[checkIn.getMonth()]} ${checkIn.getDate()} – ?`
    : "Add dates";

  const isHomesOrAll = activeTab === "all" || activeTab === "homes";

  const primaryListings = listings.slice(0, 20);
  const moreListings = listings.slice(20);

  return (
    <div className={styles.pageLayout}>
      <Header
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setIsSearchExpanded(false);
        }}
        isScrolled={isScrolled}
        isSearchExpanded={isSearchExpanded}
        onOpenSearch={() => setIsSearchExpanded(true)}
        destination={destination}
        datesLabel={datesLabel}
        guestsLabel={guestsLabel}
        serviceType={serviceType}
      />

      <div
        className={`${styles.topSearchContainer} ${
          isScrolled ? styles.topSearchContainerScrolled : ""
        }`}
        aria-hidden={isScrolled}
      >
        <SearchBar
          activeTab={activeTab}
          destination={destination}
          onDestinationChange={setDestination}
          checkIn={checkIn}
          checkOut={checkOut}
          onDatesChange={(ci, co) => {
            setCheckIn(ci);
            setCheckOut(co);
          }}
          adults={adults}
          childrenCount={children}
          infants={infants}
          pets={pets}
          onGuestsChange={(a, c, inf, p) => {
            setAdults(a);
            setChildren(c);
            setInfants(inf);
            setPets(p);
          }}
          serviceType={serviceType}
          onServiceTypeChange={setServiceType}
          onSearch={handleSearch}
        />
      </div>

      {isScrolled && isSearchExpanded && (
        <SearchBar
          activeTab={activeTab}
          isFloating={true}
          onClose={() => setIsSearchExpanded(false)}
          destination={destination}
          onDestinationChange={setDestination}
          checkIn={checkIn}
          checkOut={checkOut}
          onDatesChange={(ci, co) => {
            setCheckIn(ci);
            setCheckOut(co);
          }}
          adults={adults}
          childrenCount={children}
          infants={infants}
          pets={pets}
          onGuestsChange={(a, c, inf, p) => {
            setAdults(a);
            setChildren(c);
            setInfants(inf);
            setPets(p);
          }}
          serviceType={serviceType}
          onServiceTypeChange={setServiceType}
          onSearch={handleSearch}
        />
      )}

      {activeTab === "homes" && (
        <div className={styles.categoryStickyRow}>
          <CategoryNav />
        </div>
      )}

      <main className={styles.mainContent}>
        <div key={activeTab} className={styles.tabContent}>

          {isHomesOrAll && (
            <>
              {loading && (
                <section aria-label="Loading listings">
                  <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Popular stays worldwide</h2>
                  </div>
                  <div className={styles.skeletonGrid}>
                    {Array.from({ length: 8 }).map((_, idx) => (
                      <div key={`skeleton-${idx}`} className={styles.skeletonCard}>
                        <div className={styles.skeletonImage} />
                        <div className={`${styles.skeletonLine} ${styles.skeletonLineShort}`} />
                        <div className={`${styles.skeletonLine} ${styles.skeletonLineLong}`} />
                        <div className={`${styles.skeletonLine} ${styles.skeletonLineShort}`} />
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {!loading && error && (
                <div className={styles.stateContainer}>
                  <span className={styles.errorIcon}>⚠️</span>
                  <h3 className={styles.stateTitle}>Unable to load listings</h3>
                  <p className={styles.stateText}>{error}</p>
                  <button type="button" className={styles.retryBtn} onClick={handleRetry}>
                    Try again
                  </button>
                </div>
              )}

              {!loading && !error && listings.length === 0 && (
                <div className={styles.stateContainer}>
                  <span className={styles.emptyIcon}>🏖️</span>
                  <h3 className={styles.stateTitle}>No stays found</h3>
                  <p className={styles.stateText}>
                    There are currently no active vacation rentals available. Please check back later.
                  </p>
                </div>
              )}

              {!loading && !error && primaryListings.length > 0 && (
                <section aria-label="Popular homes worldwide">
                  <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Popular homes worldwide</h2>
                  </div>
                  <div className={styles.listingsGrid}>
                    {primaryListings.map((listing) => (
                      <ListingCard key={`pop-${listing.id}`} listing={listing} />
                    ))}
                  </div>
                </section>
              )}

              {!loading && !error && moreListings.length > 0 && (
                <section aria-label="Explore more stays">
                  <div className={styles.sectionDivider} />
                  <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Explore more stays</h2>
                  </div>
                  <div className={styles.listingsGrid}>
                    {moreListings.map((listing) => (
                      <ListingCard key={`more-${listing.id}`} listing={listing} />
                    ))}
                  </div>
                </section>
              )}
            </>
          )}

          {activeTab === "experiences" && <ExperiencesView />}
          {activeTab === "services" && <ServicesView />}
        </div>
      </main>

      <Footer />
    </div>
  );
}
