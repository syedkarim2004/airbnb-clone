"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { getUserBookings, getImageUrl } from "@/lib/api";
import { BookingWithListing } from "@/types/booking";
import styles from "./page.module.css";

export default function TripsPage() {
  const { currentUser } = useAuth();
  const [bookings, setBookings] = useState<BookingWithListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrips = useCallback(async () => {
    if (!currentUser || !currentUser.id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getUserBookings(currentUser.id);
      setBookings(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  // Split into upcoming and completed stays
  const today = new Date().toISOString().split("T")[0];
  const upcomingTrips = bookings.filter((b) => b.check_out > today);
  const pastTrips = bookings.filter((b) => b.check_out <= today);

  return (
    <div className={styles.main}>
      <Header
        activeTab="homes"
        onTabChange={() => {}}
        showCompactAlways
      />

      <main className={styles.container}>
        <div className={styles.headerRow}>
          <div>
            <h1 className={styles.title}>Trips</h1>
            <p className={styles.subtitle}>Manage your upcoming and past reservations</p>
          </div>
          <div className={styles.userBadge}>Guest: {currentUser?.name}</div>
        </div>

        {loading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.skeletonCard} />
            <div className={styles.skeletonCard} />
          </div>
        ) : error ? (
          <div className={styles.errorBox}>
            <p>{error}</p>
            <button type="button" className={styles.retryBtn} onClick={fetchTrips}>
              Try Again
            </button>
          </div>
        ) : bookings.length === 0 ? (
          <div className={styles.emptyState}>
            <svg
              className={styles.emptyIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              aria-hidden="true"
            >
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
            <h2 className={styles.emptyTitle}>No trips booked... yet!</h2>
            <p className={styles.emptyText}>
              Time to dust off your bags and start planning your next great adventure.
            </p>
            <Link href="/" className={styles.exploreBtn}>
              Start searching
            </Link>
          </div>
        ) : (
          <>
            {/* Upcoming Trips */}
            {upcomingTrips.length > 0 && (
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>
                  Upcoming Stays
                  <span className={styles.sectionBadge}>{upcomingTrips.length}</span>
                </h2>
                <div className={styles.tripsGrid}>
                  {upcomingTrips.map((trip) => (
                    <TripCard key={trip.id} trip={trip} isUpcoming />
                  ))}
                </div>
              </section>
            )}

            {/* Past Stays */}
            {pastTrips.length > 0 && (
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>
                  Where you&apos;ve been
                  <span className={styles.sectionBadge}>{pastTrips.length}</span>
                </h2>
                <div className={styles.tripsGrid}>
                  {pastTrips.map((trip) => (
                    <TripCard key={trip.id} trip={trip} isUpcoming={false} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

function TripCard({
  trip,
  isUpcoming,
}: {
  trip: BookingWithListing;
  isUpcoming: boolean;
}) {
  const defaultImage =
    "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80";

  return (
    <div className={styles.tripCard}>
      <div className={styles.imageWrapper}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={getImageUrl(trip.listing.image || defaultImage)}
          alt={trip.listing.title}
          className={styles.tripImage}
        />
        <div
          className={`${styles.statusPill} ${
            isUpcoming ? styles.statusUpcoming : styles.statusCompleted
          }`}
        >
          {isUpcoming ? "Upcoming" : "Completed"}
        </div>
      </div>

      <div className={styles.cardBody}>
        <div className={styles.cardHeader}>
          <h3 className={styles.listingTitle}>{trip.listing.title}</h3>
          <span className={styles.bookingId}>#BK-{trip.id}</span>
        </div>

        <div className={styles.location}>
          {trip.listing.city}, {trip.listing.country}
        </div>

        <div className={styles.detailsRow}>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Check-in</span>
            <span className={styles.detailValue}>{trip.check_in}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Check-out</span>
            <span className={styles.detailValue}>{trip.check_out}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Nights</span>
            <span className={styles.detailValue}>{trip.nights}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Total Paid</span>
            <span className={styles.detailValue}>${trip.total_price.toFixed(2)}</span>
          </div>
        </div>

        <div className={styles.cardActions}>
          <Link href={`/listings/${trip.listing_id}`} className={styles.viewBtn}>
            View Listing
          </Link>
          {!isUpcoming && (
            <Link
              href={`/listings/${trip.listing_id}#reviews`}
              className={styles.reviewBtn}
            >
              Write a Review
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
