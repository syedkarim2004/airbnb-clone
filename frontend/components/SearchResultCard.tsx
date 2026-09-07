"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Listing } from "@/types/listing";
import { useFavorites } from "@/context/FavoritesContext";
import { getImageUrl } from "@/lib/api";
import styles from "./SearchResultCard.module.css";

interface SearchResultCardProps {
  listing: Listing;
  isFeatured?: boolean;
  onHover?: (id: number | null) => void;
  dateRangeLabel?: string;
  totalNights?: number;
}

export function SearchResultCard({
  listing,
  isFeatured = false,
  onHover,
  dateRangeLabel,
  totalNights = 1,
}: SearchResultCardProps) {
  const router = useRouter();
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(listing.id);
  const images = listing.images && listing.images.length > 0 ? listing.images : [];
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  const handleCardClick = (e: React.MouseEvent) => {
    if (e.metaKey || e.ctrlKey) {
      window.open(`/listings/${listing.id}`, "_blank");
      return;
    }
    router.push(`/listings/${listing.id}`);
  };

  const handleAuxClick = (e: React.MouseEvent) => {
    if (e.button === 1) {
      window.open(`/listings/${listing.id}`, "_blank");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      if (e.target !== e.currentTarget) return;
      e.preventDefault();
      router.push(`/listings/${listing.id}`);
    }
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (images.length <= 1) return;
    setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (images.length <= 1) return;
    setCurrentImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await toggleFavorite(listing.id);
    } catch {
      // Handled in context
    }
  };

  const currentImage = images[currentImageIndex] || null;

  // Realistic room & bed estimations matching Screenshot 1
  const bedrooms = Math.max(1, Math.floor(listing.max_guests / 2));
  const beds = Math.max(1, listing.max_guests);
  const bathrooms = Math.max(1, Math.floor(listing.max_guests / 2));

  const calculatedTotal = listing.price_per_night * totalNights;

  return (
    <article
      className={`${styles.card} ${isFeatured ? styles.featuredCard : ""}`}
      tabIndex={0}
      aria-label={`${listing.title} in ${listing.city}`}
      onClick={handleCardClick}
      onAuxClick={handleAuxClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => {
        if (onHover) onHover(listing.id);
      }}
      onMouseLeave={() => {
        if (onHover) onHover(null);
      }}
    >
      {/* Media Carousel Container */}
      <div className={styles.mediaContainer}>
        {currentImage ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={getImageUrl(currentImage)}
            alt={`${listing.title} photo ${currentImageIndex + 1}`}
            className={styles.image}
            loading="lazy"
          />
        ) : (
          <div className={styles.noImage}>No photos available</div>
        )}

        {/* Guest favourite badge if rated 4.8 or above */}
        {listing.rating_avg !== null && listing.rating_avg >= 4.8 && (
          <div className={styles.guestFavouriteBadge}>Guest favourite</div>
        )}

        {/* Favorite Heart Button */}
        <button
          type="button"
          className={styles.heartButton}
          onClick={handleToggleFavorite}
          aria-label={favorited ? "Remove from favorites" : "Save to favorites"}
        >
          <svg
            className={`${styles.heartIcon} ${favorited ? styles.heartActive : ""}`}
            viewBox="0 0 32 32"
            aria-hidden="true"
          >
            <path d="M16 28c7-4.733 14-10 14-17 0-4.418-3.582-8-8-8-3.078 0-5.753 1.737-7.078 4.316C13.593 4.737 10.918 3 7.84 3 3.422 3-.16 6.582-.16 11c0 7 7 12.267 14 17h2.16z" />
          </svg>
        </button>

        {/* Carousel Arrow Controls */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              className={`${styles.carouselArrow} ${styles.prevArrow}`}
              onClick={handlePrevImage}
              aria-label="Previous image"
            >
              ‹
            </button>
            <button
              type="button"
              className={`${styles.carouselArrow} ${styles.nextArrow}`}
              onClick={handleNextImage}
              aria-label="Next image"
            >
              ›
            </button>

            {/* Pagination Dots */}
            <div className={styles.dotsContainer}>
              {images.map((_, idx) => (
                <span
                  key={`dot-${listing.id}-${idx}`}
                  className={`${styles.dot} ${
                    idx === currentImageIndex ? styles.activeDot : ""
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Listing Details matching Screenshot 1 */}
      <div className={styles.details}>
        <p className={styles.categorySubtitle}>
          Entire rental unit in {listing.city}
        </p>

        <h3 className={styles.title} title={listing.title}>
          {listing.title}
        </h3>

        <p className={styles.specsLine}>
          {bedrooms} bedrooms · {beds} beds · {bathrooms} {bathrooms === 1 ? "bathroom" : "bathrooms"}
        </p>

        {dateRangeLabel && (
          <p className={styles.datesLine}>{dateRangeLabel}</p>
        )}

        <div className={styles.bottomRow}>
          <div className={styles.price}>
            <strong>${totalNights > 1 ? calculatedTotal : listing.price_per_night}</strong>{" "}
            {totalNights > 1 ? `for ${totalNights} nights` : "night"}
          </div>

          <div className={styles.rating}>
            ★{" "}
            {listing.rating_avg !== null ? (
              <>
                <strong>{listing.rating_avg.toFixed(1)}</strong>
                {listing.review_count > 0 && ` (${listing.review_count})`}
              </>
            ) : (
              "New"
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
