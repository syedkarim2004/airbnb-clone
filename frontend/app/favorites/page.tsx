"use client";

import React from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ListingCard } from "@/components/ListingCard";
import { useAuth } from "@/context/AuthContext";
import { useFavorites } from "@/context/FavoritesContext";
import { FavoriteListingSnippet } from "@/types/favorite";
import { Listing } from "@/types/listing";
import styles from "./page.module.css";

/**
 * The favorites API returns a FavoriteListingSnippet:
 *   { id, title, city, country, price_per_night, is_active, image: string | null }
 * ListingCard expects the full Listing type (images: string[], rating_avg, review_count, etc.)
 * This function safely coerces the snippet into a ListingCard-compatible Listing object.
 */
function snippetToListing(snippet: FavoriteListingSnippet): Listing {
  return {
    id: snippet.id,
    title: snippet.title,
    description: "",
    city: snippet.city,
    country: snippet.country,
    latitude: null,
    longitude: null,
    price_per_night: snippet.price_per_night,
    cleaning_fee: 0,
    max_guests: 1,
    rating_avg: null,
    review_count: 0,
    host: { name: "" },
    images: snippet.image ? [snippet.image] : [],
    amenities: [],
  };
}

export default function FavoritesPage() {
  const { currentUser } = useAuth();
  const { favorites, isLoading } = useFavorites();

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
            <h1 className={styles.title}>Wishlists</h1>
            <p className={styles.subtitle}>
              {favorites.length} {favorites.length === 1 ? "saved stay" : "saved stays"}
            </p>
          </div>
          <div className={styles.currentUserBadge}>
            Viewing as {currentUser?.name}
          </div>
        </div>

        {isLoading ? (
          <div className={styles.loadingGrid}>
            <div className={styles.skeletonCard} />
            <div className={styles.skeletonCard} />
            <div className={styles.skeletonCard} />
          </div>
        ) : favorites.length === 0 ? (
          <div className={styles.emptyContainer}>
            <svg
              className={styles.emptyIcon}
              viewBox="0 0 32 32"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M16 28c7-4.733 14-10 14-17 0-4.418-3.582-8-8-8-3.078 0-5.753 1.737-7.078 4.316C13.593 4.737 10.918 3 7.84 3 3.422 3-.16 6.582-.16 11c0 7 7 12.267 14 17h2.16z" />
            </svg>
            <h2 className={styles.emptyTitle}>Your wishlist is empty</h2>
            <p className={styles.emptyText}>
              As you search, tap the heart icon on any listing to save your favorite
              stays and experiences to your wishlist.
            </p>
            <Link href="/" className={styles.exploreBtn}>
              Start exploring
            </Link>
          </div>
        ) : (
          <div className={styles.grid}>
            {favorites.map((fav) => (
              <ListingCard key={fav.id} listing={snippetToListing(fav.listing)} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
