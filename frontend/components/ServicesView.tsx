"use client";

import React, { useState, useEffect } from "react";
import { MOCK_SERVICES, ServiceItem } from "@/data/mockServices";
import styles from "./ServicesView.module.css";

interface ServiceCardItemProps {
  item: ServiceItem;
  onSelect: (item: ServiceItem) => void;
}

function ServiceCardItem({ item, onSelect }: ServiceCardItemProps) {
  const [favorite, setFavorite] = useState(false);

  return (
    <article
      className={styles.serviceCard}
      tabIndex={0}
      role="button"
      aria-label={`${item.title} by ${item.provider}`}
      onClick={() => onSelect(item)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(item);
        }
      }}
    >
      <div className={styles.imageWrapper}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.image}
          alt={item.title}
          className={styles.image}
          loading="lazy"
        />
        <span className={styles.categoryBadge}>{item.category}</span>
        <button
          type="button"
          className={styles.heartBtn}
          onClick={(e) => {
            e.stopPropagation();
            setFavorite(!favorite);
          }}
          aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
        >
          <svg
            className={`${styles.heartSvg} ${favorite ? styles.heartSvgActive : ""}`}
            viewBox="0 0 32 32"
            aria-hidden="true"
          >
            <path d="M16 28c7-4.733 14-10 14-17 0-4.418-3.582-8-8-8-3.078 0-5.753 1.737-7.078 4.316C13.593 4.737 10.918 3 7.84 3 3.422 3-.16 6.582-.16 11c0 7 7 12.267 14 17h2.16z" />
          </svg>
        </button>
      </div>

      <div className={styles.info}>
        {item.location && (
          <p className={styles.locationCategory}>
            {item.category} · {item.location}
          </p>
        )}
        <h3 className={styles.title} title={item.title}>
          {item.title}
        </h3>
        <p className={styles.provider}>Hosted by {item.provider}</p>
        <div className={styles.priceRating}>
          <span className={styles.priceBold}>{item.priceDisplay}</span>
          <span className={styles.ratingText}>
            ★ {item.rating.toFixed(1)}{" "}
            {item.reviewsCount && (
              <span className={styles.reviewCount}>({item.reviewsCount})</span>
            )}
          </span>
        </div>
      </div>
    </article>
  );
}

interface ServiceModalProps {
  item: ServiceItem;
  onClose: () => void;
}

function ServiceModal({ item, onClose }: ServiceModalProps) {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [timeSlot, setTimeSlot] = useState<string>("morning");
  const [guests, setGuests] = useState<number>(1);
  const [isBooked, setIsBooked] = useState<boolean>(false);

  // Today's date string for min date (prevents past booking dates)
  const todayStr = new Date().toISOString().split("T")[0];

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsBooked(true);
  };

  return (
    <div className={styles.modalBackdrop} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.modalDialog} onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className={styles.modalCloseBtn}
          onClick={onClose}
          aria-label="Close modal"
        >
          ✕
        </button>

        <div className={styles.modalImageBanner}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.image} alt={item.title} className={styles.modalImage} />
        </div>

        <div className={styles.modalBody}>
          {isBooked ? (
            <div className={styles.successContainer}>
              <span className={styles.successIcon}>🎉</span>
              <h3 className={styles.successTitle}>Booking Request Confirmed!</h3>
              <p className={styles.successText}>
                Your service reservation request with <strong>{item.provider}</strong> has been received
                {selectedDate ? ` for ${selectedDate}` : ""}.
                The specialist will contact you via email with preparation instructions.
              </p>
              <button
                type="button"
                className={styles.closeSuccessBtn}
                onClick={onClose}
              >
                Done
              </button>
            </div>
          ) : (
            <>
              <div className={styles.modalHeaderBlock}>
                <div className={styles.modalMetaRow}>
                  <span className={styles.modalCategoryPill}>{item.category}</span>
                  {item.location && <span>· {item.location}</span>}
                  {item.duration && <span>· {item.duration}</span>}
                </div>
                <h2 className={styles.modalTitle}>{item.title}</h2>
              </div>

              <div className={styles.modalHostRow}>
                <div className={styles.modalHostInfo}>
                  <div className={styles.hostAvatar}>
                    {item.provider.charAt(0)}
                  </div>
                  <div>
                    <h4 className={styles.hostName}>Hosted by {item.provider}</h4>
                    <p className={styles.hostRole}>Professional Specialist</p>
                  </div>
                </div>
                <div className={styles.modalRatingBadge}>
                  ★ {item.rating.toFixed(1)}{" "}
                  {item.reviewsCount && `(${item.reviewsCount} reviews)`}
                </div>
              </div>

              {item.description && (
                <p className={styles.modalDescription}>{item.description}</p>
              )}

              {item.includes && item.includes.length > 0 && (
                <div className={styles.includesSection}>
                  <h4 className={styles.includesHeading}>What’s included</h4>
                  <ul className={styles.includesList}>
                    {item.includes.map((inc, i) => (
                      <li key={i} className={styles.includesItem}>
                        <span className={styles.checkIcon}>✓</span>
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <form onSubmit={handleBookingSubmit} className={styles.bookingBox}>
                <div className={styles.bookingPriceHeader}>
                  <span className={styles.bookingPrice}>{item.priceDisplay}</span>
                  {item.duration && (
                    <span className={styles.bookingDuration}>Duration: {item.duration}</span>
                  )}
                </div>

                <div className={styles.bookingFieldsGrid}>
                  <div className={styles.bookingField}>
                    <label className={styles.bookingLabel} htmlFor="service-date">
                      Select Date
                    </label>
                    <input
                      id="service-date"
                      type="date"
                      min={todayStr}
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      required
                      className={styles.bookingInput}
                    />
                  </div>

                  <div className={styles.bookingField}>
                    <label className={styles.bookingLabel} htmlFor="service-time">
                      Time of Day
                    </label>
                    <select
                      id="service-time"
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                      className={styles.bookingSelect}
                    >
                      <option value="morning">Morning (9:00 AM)</option>
                      <option value="afternoon">Afternoon (1:30 PM)</option>
                      <option value="evening">Evening (5:30 PM)</option>
                    </select>
                  </div>
                </div>

                <div className={styles.bookingField}>
                  <label className={styles.bookingLabel}>Guests / Participants</label>
                  <div className={styles.guestStepper}>
                    <span>{guests} {guests > 1 ? "guests" : "guest"}</span>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        type="button"
                        className={styles.stepperBtn}
                        disabled={guests <= 1}
                        onClick={() => setGuests((prev) => Math.max(1, prev - 1))}
                      >
                        −
                      </button>
                      <button
                        type="button"
                        className={styles.stepperBtn}
                        onClick={() => setGuests((prev) => prev + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <button type="submit" className={styles.bookBtn}>
                  Request to Book
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

interface ServicesViewProps {
  selectedServiceType?: string;
  destinationFilter?: string;
  onClearFilters?: () => void;
}

export function ServicesView({
  selectedServiceType,
  destinationFilter,
  onClearFilters,
}: ServicesViewProps) {
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>("all");
  const [selectedItem, setSelectedItem] = useState<ServiceItem | null>(null);

  // Sync with search bar serviceType when provided
  useEffect(() => {
    if (selectedServiceType) {
      if (selectedServiceType.includes("Photo")) {
        setActiveCategoryFilter("Photography");
      } else if (selectedServiceType.includes("Chef")) {
        setActiveCategoryFilter("Chef");
      } else if (
        selectedServiceType.includes("Training") ||
        selectedServiceType.includes("Wellness") ||
        selectedServiceType.includes("Fitness") ||
        selectedServiceType.includes("Spa")
      ) {
        setActiveCategoryFilter("Wellness & Training");
      }
    }
  }, [selectedServiceType]);

  // Destination and search filtering
  const filteredServices = MOCK_SERVICES.filter((item) => {
    if (destinationFilter && destinationFilter.trim()) {
      const words = destinationFilter
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .split(/\s+/)
        .filter((w) => w.length > 1 && w !== "near" && w !== "nearby" && w !== "district");
      if (words.length > 0) {
        const locLower = (item.location || "").toLowerCase();
        const titleLower = item.title.toLowerCase();
        const matchesAny = words.some((w) => locLower.includes(w) || titleLower.includes(w));
        if (!matchesAny) return false;
      }
    }
    if (activeCategoryFilter !== "all") {
      if (activeCategoryFilter === "Wellness & Training") {
        return item.category === "Wellness" || item.category === "Training";
      }
      return item.category === activeCategoryFilter;
    }
    return true;
  });

  const photoServices = filteredServices.filter((s) => s.category === "Photography");
  const wellnessServices = filteredServices.filter(
    (s) => s.category === "Wellness" || s.category === "Training"
  );
  const chefServices = filteredServices.filter((s) => s.category === "Chef");

  const hasFilter =
    activeCategoryFilter !== "all" ||
    Boolean(destinationFilter?.trim()) ||
    Boolean(selectedServiceType?.trim());

  return (
    <div className={styles.container}>
      {/* Category Pills Bar */}
      <div className={styles.categoryPillsRow} role="tablist" aria-label="Service categories">
        {[
          { id: "all", label: "All Services", icon: "✨" },
          { id: "Photography", label: "Photography", icon: "📸" },
          { id: "Wellness & Training", label: "Training & Wellness", icon: "🧘" },
          { id: "Chef", label: "Private Chefs", icon: "🍳" },
        ].map((pill) => (
          <button
            key={pill.id}
            type="button"
            className={`${styles.categoryPill} ${
              activeCategoryFilter === pill.id ? styles.categoryPillActive : ""
            }`}
            onClick={() => setActiveCategoryFilter(pill.id)}
          >
            <span>{pill.icon}</span>
            <span>{pill.label}</span>
          </button>
        ))}
      </div>

      {/* Filter Notice when search is active */}
      {hasFilter && (
        <div className={styles.filterNotice}>
          <span>
            Showing results {destinationFilter ? `for "${destinationFilter}"` : ""}{" "}
            {activeCategoryFilter !== "all"
              ? `in ${
                  activeCategoryFilter === "Wellness & Training"
                    ? "Training & Wellness"
                    : activeCategoryFilter
                }`
              : ""}
            {" "}({filteredServices.length} {filteredServices.length === 1 ? "service" : "services"} available)
          </span>
          <button
            type="button"
            className={styles.clearFilterBtn}
            onClick={() => {
              setActiveCategoryFilter("all");
              if (onClearFilters) onClearFilters();
            }}
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Section 1: Photography */}
      {photoServices.length > 0 && (
        <section className={styles.section} aria-label="Photography services">
          <div className={styles.sectionHeader}>
            <h2
              className={styles.sectionTitle}
              onClick={() => setActiveCategoryFilter("Photography")}
            >
              Photography <span className={styles.titleArrowCircle}>›</span>
            </h2>
          </div>
          <div className={styles.cardsGrid}>
            {photoServices.map((srv) => (
              <ServiceCardItem key={srv.id} item={srv} onSelect={setSelectedItem} />
            ))}
          </div>
        </section>
      )}

      {/* Section Divider 1 */}
      {photoServices.length > 0 && (wellnessServices.length > 0 || chefServices.length > 0) && (
        <div className={styles.sectionDivider} />
      )}

      {/* Section 2: Training & Wellness */}
      {wellnessServices.length > 0 && (
        <section className={styles.section} aria-label="Training and wellness">
          <div className={styles.sectionHeader}>
            <h2
              className={styles.sectionTitle}
              onClick={() => setActiveCategoryFilter("Wellness & Training")}
            >
              Training & Wellness <span className={styles.titleArrowCircle}>›</span>
            </h2>
          </div>
          <div className={styles.cardsGrid}>
            {wellnessServices.map((srv) => (
              <ServiceCardItem key={srv.id} item={srv} onSelect={setSelectedItem} />
            ))}
          </div>
        </section>
      )}

      {/* Section Divider */}
      {wellnessServices.length > 0 && chefServices.length > 0 && (
        <div className={styles.sectionDivider} />
      )}

      {/* Section 3: Private Chef */}
      {chefServices.length > 0 && (
        <section className={styles.section} aria-label="Private chef">
          <div className={styles.sectionHeader}>
            <h2
              className={styles.sectionTitle}
              onClick={() => setActiveCategoryFilter("Chef")}
            >
              Private Chef <span className={styles.titleArrowCircle}>›</span>
            </h2>
          </div>
          <div className={styles.cardsGrid}>
            {chefServices.map((srv) => (
              <ServiceCardItem key={srv.id} item={srv} onSelect={setSelectedItem} />
            ))}
          </div>
        </section>
      )}

      {/* Empty State when no services match */}
      {filteredServices.length === 0 && (
        <div style={{ textAlign: "center", padding: "4rem 1rem" }}>
          <span style={{ fontSize: "3rem" }}>🔍</span>
          <h3 style={{ fontSize: "1.25rem", margin: "1rem 0 0.5rem", color: "#222" }}>
            No services found
          </h3>
          <p style={{ color: "#717171", marginBottom: "1.5rem" }}>
            Try adjusting your search filters or clearing the destination.
          </p>
          <button
            type="button"
            className={styles.categoryPill}
            onClick={() => {
              setActiveCategoryFilter("all");
              if (onClearFilters) onClearFilters();
            }}
          >
            View All Services
          </button>
        </div>
      )}

      {/* Service Detail / Booking Modal */}
      {selectedItem && (
        <ServiceModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </div>
  );
}
