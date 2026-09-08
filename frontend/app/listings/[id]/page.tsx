"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import {
  getListing,
  getListingReviews,
  getListingAvailability,
  createReview,
  getImageUrl,
  BookingResponse,
  ListingAvailability,
} from "@/lib/api";
import { CheckoutModal } from "@/components/CheckoutModal";
import { Listing } from "@/types/listing";
import { Review } from "@/types/review";
import { useAuth } from "@/context/AuthContext";
import { useFavorites } from "@/context/FavoritesContext";
import styles from "./page.module.css";

// Helper for amenities icons
function getAmenityIcon(name: string) {
  const lower = name.toLowerCase();
  if (lower.includes("wifi") || lower.includes("internet")) return "📶";
  if (lower.includes("kitchen") || lower.includes("cooking")) return "🍳";
  if (lower.includes("air condition") || lower.includes("ac")) return "❄️";
  if (lower.includes("heat")) return "🔥";
  if (lower.includes("tv") || lower.includes("cable")) return "📺";
  if (lower.includes("washer") || lower.includes("laundry")) return "🧺";
  if (lower.includes("work") || lower.includes("desk")) return "💼";
  if (lower.includes("pool") || lower.includes("hot tub")) return "🏊";
  if (lower.includes("park")) return "🅿️";
  if (lower.includes("gym")) return "🏋️";
  return "✨";
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// ── Date range availability validator ──────────────────────────────────────
function validateDateRange(
  ciStr: string,
  coStr: string,
  avail: ListingAvailability | null
): { valid: boolean; error?: string } {
  if (!ciStr || !coStr) return { valid: false };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const ci = new Date(ciStr + "T00:00:00");
  const co = new Date(coStr + "T00:00:00");

  if (ci.getTime() < today.getTime()) {
    return { valid: false, error: "Check-in date cannot be in the past." };
  }
  if (co.getTime() <= ci.getTime()) {
    return { valid: false, error: "Checkout must be after check-in." };
  }

  if (avail) {
    // 1. Authoritative overlap check matching backend formula:
    // an existing booking conflicts when: b.check_in < coStr AND b.check_out > ciStr
    for (const b of avail.booked_ranges) {
      if (b.check_in < coStr && b.check_out > ciStr) {
        return {
          valid: false,
          error: "Some dates in your stay are unavailable. Please choose different dates.",
        };
      }
    }

    // 2. Night-by-night check against unavailable occupied nights
    const unavailSet = new Set(avail.unavailable_dates);
    const cur = new Date(ci);
    while (cur < co) {
      const curStr = cur.toISOString().split("T")[0];
      if (unavailSet.has(curStr)) {
        return {
          valid: false,
          error: "Some dates in your stay are unavailable. Please choose different dates.",
        };
      }
      cur.setDate(cur.getDate() + 1);
    }
  }

  return { valid: true };
}

// ── Search for first available non-overlapping 3-night window ──────────────
function findFirstAvailableRange(
  avail: ListingAvailability | null,
  daysAhead: number = 7,
  stayLength: number = 3
): { checkIn: string; checkOut: string } {
  const unavailSet = new Set(avail?.unavailable_dates || []);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let offset = daysAhead; offset < 120; offset++) {
    const ci = new Date(today);
    ci.setDate(today.getDate() + offset);
    let allAvailable = true;

    for (let night = 0; night < stayLength; night++) {
      const nightDate = new Date(ci);
      nightDate.setDate(ci.getDate() + night);
      const nightStr = nightDate.toISOString().split("T")[0];
      if (unavailSet.has(nightStr)) {
        allAvailable = false;
        break;
      }
    }

    if (allAvailable) {
      const co = new Date(ci);
      co.setDate(ci.getDate() + stayLength);
      const ciStr = ci.toISOString().split("T")[0];
      const coStr = co.toISOString().split("T")[0];

      if (avail) {
        const overlap = avail.booked_ranges.some(
          (b) => b.check_in < coStr && b.check_out > ciStr
        );
        if (!overlap) {
          return { checkIn: ciStr, checkOut: coStr };
        }
      } else {
        return { checkIn: ciStr, checkOut: coStr };
      }
    }
  }

  const fallbackCi = new Date(today);
  fallbackCi.setDate(today.getDate() + daysAhead);
  const fallbackCo = new Date(today);
  fallbackCo.setDate(today.getDate() + daysAhead + stayLength);
  return {
    checkIn: fallbackCi.toISOString().split("T")[0],
    checkOut: fallbackCo.toISOString().split("T")[0],
  };
}

export default function ListingDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const { currentUser, isGuest, switchUser, allUsers } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Interaction states
  const [isShareCopied, setIsShareCopied] = useState<boolean>(false);
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);
  const [lightboxIndex, setLightboxIndex] = useState<number>(0);

  // Real backend reviews state
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState<boolean>(true);
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState<string>("");
  const [reviewSubmitting, setReviewSubmitting] = useState<boolean>(false);
  const [reviewSuccess, setReviewSuccess] = useState<string | null>(null);
  const [reviewError, setReviewError] = useState<string | null>(null);

  // Availability states
  const [availability, setAvailability] = useState<ListingAvailability | null>(null);
  const [availabilityLoading, setAvailabilityLoading] = useState<boolean>(true);
  const [availabilityError, setAvailabilityError] = useState<string | null>(null);
  const [rangeError, setRangeError] = useState<string | null>(null);

  // Booking widget state
  const [checkInDate, setCheckInDate] = useState<string>(() => {
    const today = new Date();
    const ci = new Date(today);
    ci.setDate(today.getDate() + 7);
    return ci.toISOString().split("T")[0];
  });
  const [checkOutDate, setCheckOutDate] = useState<string>(() => {
    const today = new Date();
    const co = new Date(today);
    co.setDate(today.getDate() + 10);
    return co.toISOString().split("T")[0];
  });
  const [guestCount, setGuestCount] = useState<number>(1);
  const [showCheckout, setShowCheckout] = useState<boolean>(false);
  const [bookingSuccess, setBookingSuccess] = useState<BookingResponse | null>(null);
  const [guestSwitchMsg, setGuestSwitchMsg] = useState<string | null>(null);

  const [calMonth, setCalMonth] = useState<number>(() => new Date().getMonth());
  const [calYear, setCalYear] = useState<number>(() => new Date().getFullYear());

  const isSaved = listing ? isFavorite(listing.id) : false;

  const unavailableSet = useMemo(() => {
    return new Set(availability?.unavailable_dates || []);
  }, [availability]);

  // Fetch availability from backend
  const fetchAvailability = useCallback(async () => {
    if (!id) return;
    setAvailabilityLoading(true);
    setAvailabilityError(null);
    try {
      const data = await getListingAvailability(id);
      setAvailability(data);

      // Validate or advance current dates if overlapping
      setCheckInDate((curCi) => {
        setCheckOutDate((curCo) => {
          if (curCi && curCo) {
            const check = validateDateRange(curCi, curCo, data);
            if (!check.valid) {
              const safe = findFirstAvailableRange(data, 7, 3);
              setCheckInDate(safe.checkIn);
              return safe.checkOut;
            }
          }
          return curCo;
        });
        return curCi;
      });
    } catch {
      setAvailabilityError("Couldn't check availability. Please try again.");
    } finally {
      setAvailabilityLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!id) return;
    fetchAvailability();
  }, [id, fetchAvailability]);

  useEffect(() => {
    if (!id) return;
    let isCancelled = false;

    getListing(id)
      .then((data) => {
        if (!isCancelled) {
          setListing(data);
          setError(null);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (!isCancelled) {
          setError(err instanceof Error ? err.message : "Failed to load listing");
          setLoading(false);
        }
      });

    setReviewsLoading(true);
    getListingReviews(parseInt(id, 10))
      .then((data) => {
        if (!isCancelled) {
          setReviews(data);
          setReviewsLoading(false);
        }
      })
      .catch(() => {
        if (!isCancelled) {
          setReviewsLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [id]);

  // Check date range validity whenever dates or availability change
  useEffect(() => {
    if (checkInDate && checkOutDate) {
      const check = validateDateRange(checkInDate, checkOutDate, availability);
      if (!check.valid) {
        setRangeError(check.error || "Some dates in your stay are unavailable. Please choose different dates.");
      } else {
        setRangeError(null);
      }
    }
  }, [checkInDate, checkOutDate, availability]);

  // Calculate nights
  const nights = useMemo(() => {
    if (!checkInDate || !checkOutDate) return 1;
    const d1 = new Date(checkInDate);
    const d2 = new Date(checkOutDate);
    const diff = Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  }, [checkInDate, checkOutDate]);

  // Price calculations matching backend convention (5% service fee)
  const priceSubtotal = useMemo(() => {
    if (!listing) return 0;
    return listing.price_per_night * nights;
  }, [listing, nights]);

  const serviceFee = useMemo(() => {
    return Math.round(priceSubtotal * 0.05);
  }, [priceSubtotal]);

  const cleaningFee = listing?.cleaning_fee || 0;
  const totalPrice = priceSubtotal + cleaningFee + serviceFee;

  const isReserveDisabled = useMemo(() => {
    if (!checkInDate || !checkOutDate) return true;
    if (availabilityLoading) return true;
    if (rangeError) return true;
    const check = validateDateRange(checkInDate, checkOutDate, availability);
    return !check.valid;
  }, [checkInDate, checkOutDate, availabilityLoading, rangeError, availability]);

  // Handle Share link
  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setIsShareCopied(true);
      setTimeout(() => setIsShareCopied(false), 2500);
    }
  };

  // Handle Reserve button click — opens checkout modal for guests,
  // shows friendly message for host-only users.
  const handleReserve = () => {
    if (!listing || !currentUser) return;
    if (isReserveDisabled) return;

    if (!isGuest) {
      setGuestSwitchMsg(
        "You're currently signed in as a host. Switch to a guest account (e.g. Carol Davis) in the top-right menu to make a reservation."
      );
      return;
    }
    setGuestSwitchMsg(null);
    setBookingSuccess(null);
    setShowCheckout(true);
  };

  // Handle Review submission to backend
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!listing || !currentUser) return;
    setReviewSubmitting(true);
    setReviewError(null);
    setReviewSuccess(null);

    try {
      const newReview = await createReview(currentUser.id, {
        listing_id: listing.id,
        rating: reviewRating,
        comment: reviewComment.trim() || undefined,
      });
      setReviews((prev) => [newReview, ...prev]);
      setReviewSuccess("Your review was posted successfully!");
      setReviewComment("");
    } catch (err: unknown) {
      setReviewError(err instanceof Error ? err.message : "Failed to submit review.");
    } finally {
      setReviewSubmitting(false);
    }
  };

  // Gallery photo list
  const photos = useMemo(() => {
    if (!listing || !listing.images || listing.images.length === 0) {
      return [
        "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
      ];
    }
    const resolved = listing.images.map((img) => getImageUrl(img));
    const arr = [...resolved];
    while (arr.length < 5) {
      arr.push(resolved[arr.length % resolved.length]);
    }
    return arr;
  }, [listing]);

  if (loading) {
    return (
      <div className={styles.pageWrapper}>
        <Header activeTab="homes" onTabChange={() => {}} showCompactAlways={true} />
        <div className={styles.detailContainer} style={{ textAlign: "center", padding: "80px 20px" }}>
          <h2>Loading stay details…</h2>
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className={styles.pageWrapper}>
        <Header activeTab="homes" onTabChange={() => {}} showCompactAlways={true} />
        <div className={styles.detailContainer} style={{ textAlign: "center", padding: "80px 20px" }}>
          <h2 style={{ color: "#c13515" }}>Stay not found</h2>
          <p>{error || "The listing you are looking for does not exist."}</p>
          <Link href="/" className={styles.backLink} style={{ marginTop: "20px" }}>
            ← Return to homepage
          </Link>
        </div>
      </div>
    );
  }

  const bedrooms = Math.max(1, Math.floor(listing.max_guests / 2));
  const beds = Math.max(1, listing.max_guests);
  const bathrooms = Math.max(1, Math.floor(listing.max_guests / 2));

  const handlePrevMonth = () => {
    const today = new Date();
    if (calYear === today.getFullYear() && calMonth <= today.getMonth()) {
      return;
    }
    if (calMonth === 0) {
      setCalMonth(11);
      setCalYear((y) => y - 1);
    } else {
      setCalMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (calMonth === 11) {
      setCalMonth(0);
      setCalYear((y) => y + 1);
    } else {
      setCalMonth((m) => m + 1);
    }
  };

  const isPrevMonthDisabled = () => {
    const today = new Date();
    return calYear === today.getFullYear() && calMonth <= today.getMonth();
  };

  const nextCalMonth = calMonth === 11 ? 0 : calMonth + 1;
  const nextCalYear = calMonth === 11 ? calYear + 1 : calYear;

  const handleCalDateClick = (year: number, month: number, day: number) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selected = new Date(year, month, day);
    selected.setHours(0, 0, 0, 0);
    if (selected.getTime() < today.getTime()) return;

    const formatted = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    if (!checkInDate || (checkInDate && checkOutDate)) {
      if (unavailableSet.has(formatted)) {
        setRangeError("That date is unavailable. Please select an available check-in date.");
        return;
      }
      setCheckInDate(formatted);
      setCheckOutDate("");
      setRangeError(null);
    } else {
      if (formatted <= checkInDate) {
        if (unavailableSet.has(formatted)) {
          setRangeError("That date is unavailable. Please select an available check-in date.");
          return;
        }
        setCheckInDate(formatted);
        setCheckOutDate("");
        setRangeError(null);
      } else {
        const check = validateDateRange(checkInDate, formatted, availability);
        if (!check.valid) {
          setRangeError(
            check.error ||
              "Some dates in your stay are unavailable. Please choose different dates."
          );
          return;
        }
        setCheckOutDate(formatted);
        setRangeError(null);
      }
    }
  };

  const renderDetailMonthGrid = (year: number, month: number) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return (
      <div className={styles.daysGrid}>
        {Array.from({ length: firstDayIndex }).map((_, i) => (
          <button
            key={`empty-${year}-${month}-${i}`}
            type="button"
            className={`${styles.dayBtn} ${styles.dayDisabled}`}
            disabled
          />
        ))}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const dayNum = i + 1;
          const currentDayDate = new Date(year, month, dayNum);
          currentDayDate.setHours(0, 0, 0, 0);
          const formatted = `${year}-${String(month + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
          const isPast = currentDayDate.getTime() < today.getTime();
          const isUnavailable = unavailableSet.has(formatted);
          const isDisabled = isPast || isUnavailable;
          const isCheckIn = checkInDate === formatted;
          const isCheckOut = checkOutDate === formatted;
          const inRange =
            checkInDate &&
            checkOutDate &&
            formatted > checkInDate &&
            formatted < checkOutDate;

          return (
            <button
              type="button"
              key={`day-${year}-${month}-${dayNum}`}
              disabled={isDisabled}
              aria-label={
                isUnavailable
                  ? `${dayNum} ${MONTH_NAMES[month]} (Unavailable)`
                  : `${dayNum} ${MONTH_NAMES[month]}`
              }
              title={isUnavailable ? "Unavailable / Booked" : undefined}
              className={`${styles.dayBtn} ${
                isPast
                  ? styles.dayDisabled
                  : isUnavailable
                  ? styles.dayUnavailable
                  : ""
              } ${isCheckIn || isCheckOut ? styles.daySelected : ""} ${
                inRange ? styles.dayInRange : ""
              }`}
              onClick={() => !isDisabled && handleCalDateClick(year, month, dayNum)}
            >
              {dayNum}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className={styles.pageWrapper}>
      {/* Header with compact search bar matching Screenshot 2 */}
      <Header
        activeTab="homes"
        onTabChange={() => {}}
        showCompactAlways={true}
        destination="Anywhere"
        datesLabel="Anytime"
        guestsLabel="Add guests"
        onOpenSearch={() => router.push("/")}
      />

      <main className={styles.detailContainer}>
        {/* Navigation Breadcrumb */}
        <Link href="/" className={styles.backLink}>
          ← Back to stays
        </Link>

        {/* Listing Title & Actions Row matching Screenshot 2 */}
        <div className={styles.titleRow}>
          <h1 className={styles.listingTitle}>{listing.title}</h1>

          <div className={styles.titleActions}>
            <button type="button" className={styles.actionBtn} onClick={handleShare}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M12 5a2 2 0 1 0-1.74-1H6.26a2 2 0 1 0 0 2h3.99A2 2 0 0 0 12 5zm-9 6a2 2 0 1 0 1.74 1h4.52a2 2 0 1 0 0-2H4.74A2 2 0 0 0 3 11z" />
              </svg>
              {isShareCopied ? "Link copied!" : "Share"}
            </button>

            <button
              type="button"
              className={styles.actionBtn}
              onClick={async () => {
                if (listing) {
                  try {
                    await toggleFavorite(listing.id);
                  } catch {
                    // Handled in context
                  }
                }
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 32 32"
                fill={isSaved ? "#ff385c" : "none"}
                stroke={isSaved ? "#ff385c" : "currentColor"}
                strokeWidth="2.5"
              >
                <path d="M16 28c7-4.733 14-10 14-17 0-4.418-3.582-8-8-8-3.078 0-5.753 1.737-7.078 4.316C13.593 4.737 10.918 3 7.84 3 3.422 3-.16 6.582-.16 11c0 7 7 12.267 14 17h2.16z" />
              </svg>
              {isSaved ? "Saved" : "Save"}
            </button>
          </div>
        </div>

        {/* 5-Photo Collage Grid matching Screenshot 2 Image 1 */}
        <div className={styles.photoCollage}>
          {/* Main Hero Photo (Left) */}
          <div
            className={styles.heroPhoto}
            onClick={() => {
              setLightboxIndex(0);
              setLightboxOpen(true);
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photos[0]}
              alt={`${listing.title} main`}
              className={styles.galleryImg}
            />
          </div>

          {/* 4 Side Photos in 2x2 Grid (Right) */}
          {photos.slice(1, 5).map((imgUrl, idx) => (
            <div
              key={`photo-${idx}`}
              className={styles.sidePhoto}
              onClick={() => {
                setLightboxIndex(idx + 1);
                setLightboxOpen(true);
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imgUrl}
                alt={`${listing.title} photo ${idx + 2}`}
                className={styles.galleryImg}
              />
            </div>
          ))}

          {/* "Show all photos" Button at Bottom Right */}
          <button
            type="button"
            className={styles.showAllPhotosBtn}
            onClick={() => {
              setLightboxIndex(0);
              setLightboxOpen(true);
            }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
              <path d="M1 1h4v4H1V1zm6 0h4v4H7V1zm6 0h4v4h-4V1zM1 7h4v4H1V7zm6 0h4v4H7V7zm6 0h4v4h-4V7zM1 13h4v4H1v-4zm6 0h4v4H7v-4zm6 0h4v4h-4v-4z" />
            </svg>
            Show all photos
          </button>
        </div>

        {/* Two-Column Split Content */}
        <div className={styles.contentSplit}>
          {/* LEFT COLUMN */}
          <div className={styles.leftColumn}>
            {/* Room Heading & Specs */}
            <h2 className={styles.roomHeading}>
              Entire rental unit in {listing.city}, {listing.country}
            </h2>
            <p className={styles.capacitySpecs}>
              {listing.max_guests} guests · {bedrooms} {bedrooms === 1 ? "bedroom" : "bedrooms"} · {beds} {beds === 1 ? "bed" : "beds"} · {bathrooms} {bathrooms === 1 ? "bathroom" : "bathrooms"}
            </p>
            <span className={styles.cancellationBadge}>Free cancellation</span>

            {/* Guest Favourite Banner Box matching Screenshot 2 Image 2 */}
            <div className={styles.guestFavouriteBanner}>
              <div className={styles.laurelGroup}>
                <span className={styles.laurelIcon}>🌿</span>
                <div>
                  <h3 className={styles.guestFavouriteTextTitle}>Guest favourite</h3>
                  <p className={styles.guestFavouriteTextSub}>
                    One of the most loved homes on Airbnb, according to guests
                  </p>
                </div>
              </div>

              <div className={styles.guestFavouriteScore}>
                <div className={styles.guestFavouriteScoreNum}>
                  {listing.rating_avg !== null ? listing.rating_avg.toFixed(1) : "5.0"}
                </div>
                <div className={styles.guestFavouriteStars}>★★★★★</div>
                <div className={styles.guestFavouriteReviews}>
                  {listing.review_count > 0 ? `${listing.review_count} Reviews` : "6 Reviews"}
                </div>
              </div>
            </div>

            {/* Host Row */}
            {(() => {
              const hostDisplayName = listing.host?.name || listing.host_name || "Host";
              const hostId = listing.host?.id ?? listing.host_id;
              const hostUserMatch = allUsers.find(
                (u) =>
                  (hostId !== undefined && u.id === hostId) ||
                  u.name.toLowerCase() === hostDisplayName.toLowerCase()
              );

              return (
                <div className={styles.hostRow}>
                  <div className={styles.hostAvatar}>
                    {hostDisplayName ? hostDisplayName.charAt(0).toUpperCase() : "H"}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 className={styles.hostName}>Hosted by {hostDisplayName}</h4>
                    <p className={styles.hostSubtitle}>Host on Airbnb</p>
                  </div>
                  {hostUserMatch && (
                    <button
                      type="button"
                      className={styles.switchHostBtn}
                      onClick={() => {
                        switchUser(hostUserMatch);
                        router.push("/host");
                      }}
                      title={`Switch to ${hostDisplayName} and open Host Dashboard`}
                    >
                      Manage as {hostDisplayName} →
                    </button>
                  )}
                </div>
              );
            })()}

            {/* Highlights List matching Screenshot 2 */}
            <div className={styles.highlightsList}>
              <div className={styles.highlightItem}>
                <span className={styles.highlightIcon}>🚪</span>
                <div>
                  <h4 className={styles.highlightTitle}>Self check-in</h4>
                  <p className={styles.highlightDesc}>Check yourself in with the smartlock.</p>
                </div>
              </div>

              <div className={styles.highlightItem}>
                <span className={styles.highlightIcon}>🏙️</span>
                <div>
                  <h4 className={styles.highlightTitle}>City and park views</h4>
                  <p className={styles.highlightDesc}>Soak up the views during your stay.</p>
                </div>
              </div>

              <div className={styles.highlightItem}>
                <span className={styles.highlightIcon}>💬</span>
                <div>
                  <h4 className={styles.highlightTitle}>Exceptional host communication</h4>
                  <p className={styles.highlightDesc}>
                    Recent guests gave {listing.host?.name || listing.host_name || "the host"} a 5-star rating for communication.
                  </p>
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div className={styles.descriptionSection}>
              <p className={styles.descriptionText}>{listing.description}</p>
            </div>

            {/* In-Page Sticky Nav Bar matching Screenshot 2 Image 3 */}
            <nav className={styles.subNavBar} aria-label="Listing sections">
              <a href="#photos" className={styles.subNavLink}>Photos</a>
              <a href="#amenities" className={styles.subNavLink}>Amenities</a>
              <a href="#reviews" className={styles.subNavLink}>Reviews</a>
              <a href="#location" className={styles.subNavLink}>Location</a>
            </nav>

            {/* Interactive Calendar & Availability Section matching Screenshot 2 Image 3 */}
            <section className={styles.calendarSection} id="calendar">
              <h3 className={styles.calendarHeading}>
                {nights} {nights === 1 ? "night" : "nights"} in {listing.city}
              </h3>
              <p className={styles.calendarSubtitle}>
                {checkInDate && checkOutDate
                  ? `${checkInDate} – ${checkOutDate}`
                  : checkInDate
                  ? `${checkInDate} – Select checkout`
                  : "Select dates"}
              </p>

              {availabilityLoading && (
                <div className={styles.checkingAvailabilityNotice} style={{ justifyContent: "flex-start", marginBottom: "8px" }}>
                  <span className={styles.spinnerIcon}>↻</span> Checking availability...
                </div>
              )}
              {rangeError && (
                <div className={styles.rangeErrorNotice} style={{ textAlign: "left", marginBottom: "8px" }}>
                  ⚠️ {rangeError}
                </div>
              )}
              {availabilityError && (
                <div className={styles.availabilityErrorNotice} style={{ textAlign: "left", marginBottom: "8px" }}>
                  ⚠️ {availabilityError}{" "}
                  <button type="button" onClick={fetchAvailability} className={styles.retryAvailBtn}>
                    Retry
                  </button>
                </div>
              )}

              <div className={styles.calendarMonthsRow}>
                {/* Month 1 */}
                <div className={styles.monthBlock}>
                  <div className={styles.monthHeader} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <button
                      type="button"
                      onClick={handlePrevMonth}
                      disabled={isPrevMonthDisabled()}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: isPrevMonthDisabled() ? "default" : "pointer",
                        opacity: isPrevMonthDisabled() ? 0.3 : 1,
                        fontSize: "1.1rem",
                        padding: "2px 8px",
                        borderRadius: "50%",
                      }}
                      aria-label="Previous month"
                    >
                      ‹
                    </button>
                    <span>{MONTH_NAMES[calMonth]} {calYear}</span>
                    <span style={{ width: "24px" }} />
                  </div>
                  <div className={styles.weekDaysRow}>
                    <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
                  </div>
                  {renderDetailMonthGrid(calYear, calMonth)}
                </div>

                {/* Month 2 */}
                <div className={styles.monthBlock}>
                  <div className={styles.monthHeader} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ width: "24px" }} />
                    <span>{MONTH_NAMES[nextCalMonth]} {nextCalYear}</span>
                    <button
                      type="button"
                      onClick={handleNextMonth}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "1.1rem",
                        padding: "2px 8px",
                        borderRadius: "50%",
                      }}
                      aria-label="Next month"
                    >
                      ›
                    </button>
                  </div>
                  <div className={styles.weekDaysRow}>
                    <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
                  </div>
                  {renderDetailMonthGrid(nextCalYear, nextCalMonth)}
                </div>
              </div>

              <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem" }}>
                <button
                  type="button"
                  className={styles.clearDatesBtn}
                  onClick={() => {
                    const safe = findFirstAvailableRange(availability, 7, 3);
                    setCheckInDate(safe.checkIn);
                    setCheckOutDate(safe.checkOut);
                    setRangeError(null);
                  }}
                >
                  Reset dates
                </button>
              </div>
            </section>

            {/* Amenities Section */}
            <section className={styles.amenitiesSection} id="amenities">
              <h3 className={styles.sectionTitle}>What this place offers</h3>
              <div className={styles.amenitiesGrid}>
                {listing.amenities.map((amenity) => (
                  <div key={amenity} className={styles.amenityItem}>
                    <span className={styles.amenityIcon}>{getAmenityIcon(amenity)}</span>
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Big Review Score & Reviews Section matching Screenshot 2 Image 4 */}
            <section className={styles.reviewsSection} id="reviews">
              <div className={styles.largeReviewScoreBanner}>
                <div className={styles.laurelBigScore}>
                  <span className={styles.laurelBranch}>🌿</span>
                  <span className={styles.bigScoreText}>
                    {listing.rating_avg !== null ? listing.rating_avg.toFixed(1) : "5.0"}
                  </span>
                  <span className={styles.laurelBranch} style={{ transform: "scaleX(-1)" }}>🌿</span>
                </div>
                <h3 className={styles.guestFavBigTitle}>Guest favourite</h3>
                <p className={styles.guestFavBigSub}>
                  This home is a guest favourite based on ratings, reviews and reliability
                </p>
              </div>

              {/* Category Ratings Bar */}
              <div className={styles.categoryRatingsRow}>
                <div className={styles.catRatingItem}>
                  <span className={styles.catRatingLabel}>Cleanliness</span>
                  <span className={styles.catRatingValue}>5.0</span>
                  <span className={styles.catRatingIcon}>🧴</span>
                </div>
                <div className={styles.catRatingItem}>
                  <span className={styles.catRatingLabel}>Accuracy</span>
                  <span className={styles.catRatingValue}>5.0</span>
                  <span className={styles.catRatingIcon}>✓</span>
                </div>
                <div className={styles.catRatingItem}>
                  <span className={styles.catRatingLabel}>Check-in</span>
                  <span className={styles.catRatingValue}>5.0</span>
                  <span className={styles.catRatingIcon}>🔑</span>
                </div>
                <div className={styles.catRatingItem}>
                  <span className={styles.catRatingLabel}>Communication</span>
                  <span className={styles.catRatingValue}>5.0</span>
                  <span className={styles.catRatingIcon}>💬</span>
                </div>
                <div className={styles.catRatingItem}>
                  <span className={styles.catRatingLabel}>Location</span>
                  <span className={styles.catRatingValue}>4.9</span>
                  <span className={styles.catRatingIcon}>🗺️</span>
                </div>
                <div className={styles.catRatingItem}>
                  <span className={styles.catRatingLabel}>Value</span>
                  <span className={styles.catRatingValue}>5.0</span>
                  <span className={styles.catRatingIcon}>🏷️</span>
                </div>
              </div>

              {/* Review Tags */}
              <div className={styles.reviewTagsRow}>
                <span className={styles.reviewTagPill}>🛋️ Comfort</span>
                <span className={styles.reviewTagPill}>🧼 Cleanliness</span>
                <span className={styles.reviewTagPill}>🎁 Hospitality</span>
              </div>

              {/* Guest Reviews List */}
              {reviewsLoading ? (
                <div style={{ color: "#717171", padding: "16px 0" }}>Loading reviews...</div>
              ) : reviews.length === 0 ? (
                <p className={styles.noReviews}>No reviews yet for this listing.</p>
              ) : (
                <div className={styles.reviewsList}>
                  {reviews.map((rev) => (
                    <div key={rev.id} className={styles.reviewCard}>
                      <div className={styles.reviewerRow}>
                        <div className={styles.reviewerAvatar}>
                          {rev.reviewer_name ? rev.reviewer_name.charAt(0).toUpperCase() : "G"}
                        </div>
                        <div>
                          <h4 className={styles.reviewerName}>{rev.reviewer_name}</h4>
                          <p className={styles.reviewDate}>
                            {"★".repeat(rev.rating)}{" "}
                            {rev.created_at
                              ? new Date(rev.created_at).toLocaleDateString(undefined, {
                                  year: "numeric",
                                  month: "short",
                                })
                              : ""}
                          </p>
                        </div>
                      </div>
                      <p className={styles.reviewComment}>
                        {rev.comment || "No written comment provided."}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Review Submission Form */}
              <div className={styles.reviewFormContainer}>
                <h4 className={styles.reviewFormTitle}>Leave a Review</h4>
                <p className={styles.reviewNotice}>
                  Airbnb verified stay policy: You may review this listing only after completing a stay here.
                  Submitting as <strong>{currentUser?.name}</strong>.
                </p>

                <form onSubmit={handleReviewSubmit}>
                  <div className={styles.ratingPicker}>
                    <span className={styles.ratingLabel}>Rating:</span>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className={`${styles.starBtn} ${
                          star <= reviewRating ? styles.starActive : ""
                        }`}
                        onClick={() => setReviewRating(star)}
                        aria-label={`${star} star`}
                      >
                        ★
                      </button>
                    ))}
                    <span style={{ marginLeft: "8px", fontWeight: 600 }}>
                      {reviewRating} / 5
                    </span>
                  </div>

                  <textarea
                    className={styles.commentTextarea}
                    placeholder="Share details of your stay at this place..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    rows={3}
                  />

                  <button
                    type="submit"
                    className={styles.submitReviewBtn}
                    disabled={reviewSubmitting}
                  >
                    {reviewSubmitting ? "Submitting..." : "Submit Review"}
                  </button>

                  {reviewSuccess && (
                    <div className={styles.reviewSuccessBox}>{reviewSuccess}</div>
                  )}
                  {reviewError && (
                    <div className={styles.reviewErrorBox}>{reviewError}</div>
                  )}
                </form>
              </div>
            </section>

            {/* Location Section */}
            <section id="location" style={{ paddingBottom: "32px" }}>
              <h3 className={styles.sectionTitle}>Where you’ll be</h3>
              <p style={{ color: "#717171", fontSize: "1rem", marginBottom: "16px" }}>
                {listing.city}, {listing.country}
              </p>
              <div
                style={{
                  height: "240px",
                  borderRadius: "14px",
                  backgroundColor: "#e8efe2",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#555",
                  fontWeight: 500,
                }}
              >
                📍 {listing.title} ({listing.city})
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN: STICKY RESERVATION WIDGET CARD */}
          <aside className={styles.reservationWidget} aria-label="Reservation widget">
            {/* Prices include all fees badge */}
            <div className={styles.widgetPriceTag}>
              <svg className={styles.widgetPriceTagIcon} viewBox="0 0 24 24">
                <path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z" />
              </svg>
              <span>Prices include all fees</span>
            </div>

            {/* Price & Rating Header */}
            <div className={styles.widgetPriceHeader}>
              <div className={styles.widgetPriceLarge}>
                ${nights > 1 ? totalPrice : listing.price_per_night}{" "}
                <span>{nights > 1 ? `for ${nights} nights` : "night"}</span>
              </div>
              <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                ★ {listing.rating_avg !== null ? listing.rating_avg.toFixed(1) : "5.0"}
              </div>
            </div>

            {/* Check-in / Checkout / Guests Box */}
            <div className={styles.datesGuestsBox}>
              <div className={styles.datesRow}>
                <div className={styles.dateInputCol}>
                  <label className={styles.boxLabel}>Check-in</label>
                  <input
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    className={styles.dateValueInput}
                    value={checkInDate}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCheckInDate(val);
                      if (checkOutDate) {
                        if (val >= checkOutDate) {
                          const nextDay = new Date(val);
                          nextDay.setDate(nextDay.getDate() + 1);
                          const nextStr = nextDay.toISOString().split("T")[0];
                          setCheckOutDate(nextStr);
                          const check = validateDateRange(val, nextStr, availability);
                          setRangeError(check.valid ? null : (check.error || "Selected dates are unavailable."));
                        } else {
                          const check = validateDateRange(val, checkOutDate, availability);
                          setRangeError(check.valid ? null : (check.error || "Selected dates are unavailable."));
                        }
                      }
                    }}
                  />
                </div>
                <div className={styles.dateInputCol}>
                  <label className={styles.boxLabel}>Checkout</label>
                  <input
                    type="date"
                    min={checkInDate || new Date().toISOString().split("T")[0]}
                    className={styles.dateValueInput}
                    value={checkOutDate}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCheckOutDate(val);
                      if (checkInDate) {
                        const check = validateDateRange(checkInDate, val, availability);
                        setRangeError(check.valid ? null : (check.error || "Selected dates are unavailable."));
                      }
                    }}
                  />
                </div>
              </div>

              <div className={styles.guestsInputRow}>
                <label className={styles.boxLabel}>Guests</label>
                <select
                  className={styles.guestsSelect}
                  value={guestCount}
                  onChange={(e) => setGuestCount(parseInt(e.target.value, 10))}
                >
                  {Array.from({ length: listing.max_guests }).map((_, idx) => (
                    <option key={`guest-opt-${idx + 1}`} value={idx + 1}>
                      {idx + 1} {idx + 1 === 1 ? "guest" : "guests"}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Availability / Range notices */}
            {availabilityLoading && (
              <div className={styles.checkingAvailabilityNotice}>
                <span className={styles.spinnerIcon}>↻</span> Checking availability...
              </div>
            )}
            {rangeError && (
              <div className={styles.rangeErrorNotice}>
                ⚠️ {rangeError}
              </div>
            )}
            {availabilityError && (
              <div className={styles.availabilityErrorNotice}>
                ⚠️ {availabilityError}{" "}
                <button type="button" onClick={fetchAvailability} className={styles.retryAvailBtn}>
                  Retry
                </button>
              </div>
            )}

            {/* Reserve Button */}
            <button
              type="button"
              className={`${styles.reserveBtn} ${isReserveDisabled ? styles.reserveBtnDisabled : ""}`}
              disabled={isReserveDisabled}
              onClick={handleReserve}
            >
              Reserve
            </button>

            {/* Non-guest friendly message */}
            {guestSwitchMsg && (
              <div style={{ color: "#c13515", fontSize: "0.83rem", marginTop: "10px", textAlign: "center", lineHeight: 1.45 }}>
                ⚠️ {guestSwitchMsg}
              </div>
            )}

            <p className={styles.noChargeNotice}>You won&apos;t be charged yet</p>

            {/* Price Breakdown */}
            <div className={styles.priceBreakdown}>
              <div className={styles.breakdownRow}>
                <span className={styles.breakdownItemText}>
                  ${listing.price_per_night} x {nights} {nights === 1 ? "night" : "nights"}
                </span>
                <span>${priceSubtotal}</span>
              </div>

              {cleaningFee > 0 && (
                <div className={styles.breakdownRow}>
                  <span className={styles.breakdownItemText}>Cleaning fee</span>
                  <span>${cleaningFee}</span>
                </div>
              )}

              <div className={styles.breakdownRow}>
                <span className={styles.breakdownItemText}>Airbnb service fee</span>
                <span>${serviceFee}</span>
              </div>

              <div className={styles.totalRow}>
                <span>Total before taxes</span>
                <span>${totalPrice}</span>
              </div>
            </div>

            {/* Post-checkout confirmation badge in widget */}
            {bookingSuccess && (
              <div className={styles.bookingSuccessCard}>
                <h4 className={styles.bookingSuccessTitle}>🎉 Reservation Confirmed!</h4>
                <p className={styles.bookingSuccessDetails}>
                  Booking #{bookingSuccess.id} · {bookingSuccess.nights} nights (${bookingSuccess.total_price} total)
                </p>
              </div>
            )}

            <button type="button" className={styles.reportLink}>
              🏳️ Report this listing
            </button>
          </aside>
        </div>
      </main>

      {/* Checkout Modal */}
      {showCheckout && listing && (
        <CheckoutModal
          listing={listing}
          guestId={currentUser.id}
          guestName={currentUser.name}
          checkIn={checkInDate}
          checkOut={checkOutDate}
          nights={nights}
          guestCount={guestCount}
          priceSubtotal={priceSubtotal}
          cleaningFee={cleaningFee}
          serviceFee={serviceFee}
          totalPrice={totalPrice}
          primaryPhotoUrl={photos[0] || ""}
          onClose={() => setShowCheckout(false)}
          onConfirmed={(booking) => {
            setBookingSuccess(booking);
            setShowCheckout(false);
            fetchAvailability();
          }}
          onAvailabilityChange={() => {
            fetchAvailability();
          }}
        />
      )}

      {/* Lightbox Modal for Full Photo Gallery */}
      {lightboxOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.92)",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
          onClick={() => setLightboxOpen(false)}
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            style={{
              position: "absolute",
              top: "24px",
              right: "24px",
              background: "none",
              border: "none",
              color: "#ffffff",
              fontSize: "1.8rem",
              cursor: "pointer",
            }}
          >
            ✕
          </button>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photos[lightboxIndex]}
            alt={`Photo ${lightboxIndex + 1}`}
            style={{
              maxHeight: "80vh",
              maxWidth: "90vw",
              objectFit: "contain",
              borderRadius: "8px",
            }}
            onClick={(e) => e.stopPropagation()}
          />

          <div
            style={{
              display: "flex",
              gap: "24px",
              marginTop: "20px",
              color: "#ffffff",
              alignItems: "center",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setLightboxIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1))}
              style={{
                background: "rgba(255, 255, 255, 0.2)",
                border: "none",
                color: "#fff",
                borderRadius: "50%",
                width: "44px",
                height: "44px",
                fontSize: "1.5rem",
                cursor: "pointer",
              }}
            >
              ‹
            </button>
            <span>
              {lightboxIndex + 1} / {photos.length}
            </span>
            <button
              type="button"
              onClick={() => setLightboxIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0))}
              style={{
                background: "rgba(255, 255, 255, 0.2)",
                border: "none",
                color: "#fff",
                borderRadius: "50%",
                width: "44px",
                height: "44px",
                fontSize: "1.5rem",
                cursor: "pointer",
              }}
            >
              ›
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
