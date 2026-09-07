"use client";

import React, { useState, useMemo, useRef } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { ExperienceCard } from "@/components/ExperienceCard";
import { EXPERIENCES_DATA, Experience, TimeSlot } from "@/data/experiences";
import styles from "./page.module.css";

export default function ExperienceDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  // Find experience by ID (fallback to first experience if not found)
  const experience: Experience = useMemo(() => {
    const found = EXPERIENCES_DATA.find((e) => e.id === id);
    return found || EXPERIENCES_DATA[0];
  }, [id]);

  // Gallery Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);
  const [lightboxIndex, setLightboxIndex] = useState<number>(0);

  // Interaction states
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isShareCopied, setIsShareCopied] = useState<boolean>(false);
  const [expandedReviews, setExpandedReviews] = useState<Record<string, boolean>>({});

  // Message Host modal state
  const [messageModalOpen, setMessageModalOpen] = useState<boolean>(false);
  const [hostMessageText, setHostMessageText] = useState<string>("");
  const [messageSentToast, setMessageSentToast] = useState<boolean>(false);

  // All reviews modal state
  const [reviewsModalOpen, setReviewsModalOpen] = useState<boolean>(false);

  // Booking Card & Availability state
  const [showDatesDrawer, setShowDatesDrawer] = useState<boolean>(false);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(
    experience.availabilitySlots && experience.availabilitySlots.length > 0
      ? experience.availabilitySlots[0]
      : null
  );
  const [guestCount, setGuestCount] = useState<number>(1);
  const [isBookingSuccess, setIsBookingSuccess] = useState<boolean>(false);
  const [bookingRef, setBookingRef] = useState<string>("");

  // Map state
  const [mapZoom, setMapZoom] = useState<number>(1);
  const [isMapExpanded, setIsMapExpanded] = useState<boolean>(false);

  // Horizontal carousel ref for More Experiences
  const moreRowRef = useRef<HTMLDivElement>(null);

  const handleScrollMore = (direction: "left" | "right") => {
    if (moreRowRef.current) {
      const scrollAmount = direction === "left" ? -420 : 420;
      moreRowRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setIsShareCopied(true);
      setTimeout(() => setIsShareCopied(false), 2500);
    }
  };

  const toggleReviewExpand = (revId: string) => {
    setExpandedReviews((prev) => ({
      ...prev,
      [revId]: !prev[revId],
    }));
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hostMessageText.trim()) return;
    setMessageSentToast(true);
    setMessageModalOpen(false);
    setHostMessageText("");
    setTimeout(() => setMessageSentToast(false), 3500);
  };

  const handleBookNow = () => {
    if (!selectedSlot) return;
    const ref = `EXP-${Math.floor(100000 + Math.random() * 900000)}`;
    setBookingRef(ref);
    setIsBookingSuccess(true);
  };

  // Filter other experiences in the same city or category
  const moreExperiences = useMemo(() => {
    return EXPERIENCES_DATA.filter(
      (e) => e.id !== experience.id && (e.city === experience.city || e.category === experience.category)
    ).slice(0, 10);
  }, [experience]);

  // Pricing calculation
  const isGroupPricing = experience.priceUnit === "group";
  const totalPrice = isGroupPricing
    ? experience.pricePerGuest
    : experience.pricePerGuest * guestCount;

  // Portfolio photos collection
  const portfolioPhotos = useMemo(() => {
    if (experience.portfolioImages && experience.portfolioImages.length > 0) {
      return experience.portfolioImages;
    }
    return experience.images || [experience.heroImage];
  }, [experience]);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const handleNextPhoto = () => {
    setLightboxIndex((prev) => (prev + 1) % portfolioPhotos.length);
  };

  const handlePrevPhoto = () => {
    setLightboxIndex((prev) => (prev - 1 + portfolioPhotos.length) % portfolioPhotos.length);
  };

  // Qualification icon renderer
  const renderQualIcon = (iconName: string) => {
    switch (iconName) {
      case "camera":
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
        );
      case "star":
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        );
      case "graduation":
      default:
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
            <path d="M6 12v5c3 3 9 3 12 0v-5" />
          </svg>
        );
    }
  };

  // Things to know icon renderer
  const renderThingIcon = (iconName: string) => {
    switch (iconName) {
      case "users":
        return (
          <svg className={styles.thingIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        );
      case "accessibility":
        return (
          <svg className={styles.thingIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="12" cy="4" r="2" />
            <path d="M12 7v7" />
            <path d="M7 11h10" />
            <path d="M9 20l3-6 3 6" />
          </svg>
        );
      case "backpack":
      case "sparkles":
        return (
          <svg className={styles.thingIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
        );
      case "shield":
      default:
        return (
          <svg className={styles.thingIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        );
    }
  };

  return (
    <div className={styles.pageWrapper}>
      {/* ── 1. GLOBAL HEADER (Sticky with compact search pill matching screenshots) ── */}
      <Header
        activeTab="experiences"
        onTabChange={(tab) => {
          if (tab === "homes") router.push("/");
          else if (tab === "services") router.push("/?tab=services");
          else router.push("/?tab=experiences");
        }}
        showCompactAlways={true}
        destination="Anywhere"
        datesLabel="Anytime"
        serviceType="Add service"
        onOpenSearch={() => router.push("/")}
      />

      <main className={styles.detailContainer}>
        {/* Navigation Breadcrumb */}
        <Link href="/" className={styles.backLink}>
          ← All experiences
        </Link>

        {/* ── 2. TWO-COLUMN LAYOUT: Sticky Left Profile + Natural Scrolling Right Content ── */}
        <div className={styles.experienceLayout}>
          
          {/* ═══════════════════════════════════════════════════════════════════════
              LEFT PROFILE COLUMN (Sticky on desktop matching Screenshot 2-5)
             ═══════════════════════════════════════════════════════════════════════ */}
          <aside className={styles.leftProfileColumn} aria-label="Experience Profile">
            {/* Primary Hero Image */}
            <div className={styles.heroImgWrapper} onClick={() => openLightbox(0)}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={experience.heroImage}
                alt={experience.title}
                className={styles.heroImg}
              />
            </div>

            {/* Circular Host Avatar Overlapping the Hero Image */}
            <div className={styles.avatarOverlapWrapper}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={experience.host.avatar}
                alt={experience.host.name}
                className={styles.avatarCircleImg}
              />
            </div>

            {/* Experience Title */}
            <h1 className={styles.profileTitle}>
              {experience.title}
            </h1>

            {/* Description / Host Personal Statement */}
            <p className={styles.profileDescription}>
              {experience.description}
            </p>

            {/* Rating & Provider Information */}
            <div className={styles.profileRatingLine}>
              <span>★ {experience.rating.toFixed(1)}</span>
              <span>·</span>
              <span>{experience.providerInfo || `${experience.host.role || "Host"} in ${experience.city}`}</span>
            </div>

            {/* Location subtext */}
            <div className={styles.profileLocationText}>
              {experience.locationText || "Provided at your home"}
            </div>

            {/* Share and Save Controls */}
            <div className={styles.shareSaveRow}>
              <button
                type="button"
                className={styles.iconControlBtn}
                onClick={handleShare}
                aria-label="Share experience"
                title={isShareCopied ? "Link copied!" : "Share"}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                  <polyline points="16 6 12 2 8 6" />
                  <line x1="12" y1="2" x2="12" y2="15" />
                </svg>
              </button>

              <button
                type="button"
                className={`${styles.iconControlBtn} ${isSaved ? styles.iconControlBtnActive : ""}`}
                onClick={() => setIsSaved((prev) => !prev)}
                aria-label={isSaved ? "Saved" : "Save experience"}
                title={isSaved ? "Saved" : "Save"}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 32 32"
                  fill={isSaved ? "#e00b41" : "none"}
                  stroke={isSaved ? "#e00b41" : "currentColor"}
                  strokeWidth="2.5"
                >
                  <path d="M16 28c7-4.733 14-10 14-17 0-4.418-3.582-8-8-8-3.078 0-5.753 1.737-7.078 4.316C13.593 4.737 10.918 3 7.84 3 3.422 3-.16 6.582-.16 11c0 7 7 12.267 14 17h2.16z" />
                </svg>
              </button>
            </div>

            {/* ── PERSISTENT BOOKING CARD (White Rounded Box matching reference) ── */}
            <div className={styles.bookingCardWrapper} id="booking-card">
              <div className={styles.bookingCardHeader}>
                <div className={styles.bookingPriceBlock}>
                  <span className={styles.bookingPriceText}>
                    From {experience.currency}{experience.pricePerGuest.toLocaleString()}{" "}
                    <span className={styles.bookingPriceUnit}>/ {experience.priceUnit || "group"}</span>
                  </span>
                  <span className={styles.freeCancelLabel}>Free cancellation</span>
                </div>

                <button
                  type="button"
                  className={styles.showDatesButton}
                  onClick={() => setShowDatesDrawer((prev) => !prev)}
                >
                  {showDatesDrawer ? "Hide dates" : "Show dates"}
                </button>
              </div>

              {/* Expandable Availability & Guest Reservation Drawer */}
              {showDatesDrawer && (
                <div className={styles.availabilityDrawer}>
                  <h4 className={styles.drawerHeading}>Available dates & time slots</h4>

                  <div className={styles.slotList}>
                    {experience.availabilitySlots.map((slot, idx) => {
                      const isSelected =
                        selectedSlot?.date === slot.date && selectedSlot?.time === slot.time;
                      return (
                        <button
                          key={`slot-${idx}`}
                          type="button"
                          className={`${styles.slotItem} ${isSelected ? styles.slotItemActive : ""}`}
                          onClick={() => setSelectedSlot(slot)}
                        >
                          <div>
                            <p className={styles.slotDateText}>{slot.date}</p>
                            <p className={styles.slotTimeText}>{slot.time}</p>
                          </div>
                          <span className={styles.slotBadge}>
                            {slot.availableSpots} spots available
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Guest Picker (Only for per_guest or capacity limits) */}
                  <div className={styles.guestPickerRow}>
                    <span className={styles.guestPickerLabel}>
                      {isGroupPricing ? "Group size (max 8)" : "Guests"}
                    </span>
                    <div className={styles.guestControls}>
                      <button
                        type="button"
                        className={styles.guestStepBtn}
                        onClick={() => setGuestCount((c) => Math.max(1, c - 1))}
                        disabled={guestCount <= 1}
                      >
                        –
                      </button>
                      <span className={styles.guestCountText}>{guestCount}</span>
                      <button
                        type="button"
                        className={styles.guestStepBtn}
                        onClick={() => setGuestCount((c) => Math.min(experience.guestCapacity, c + 1))}
                        disabled={guestCount >= experience.guestCapacity}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Total calculation */}
                  <div className={styles.totalRow}>
                    <span>Total ({isGroupPricing ? "1 group" : `${guestCount} guests`})</span>
                    <span>{experience.currency}{totalPrice.toLocaleString()}</span>
                  </div>

                  <button
                    type="button"
                    className={styles.reserveBtn}
                    onClick={handleBookNow}
                  >
                    Reserve
                  </button>
                </div>
              )}
            </div>
          </aside>

          {/* ═══════════════════════════════════════════════════════════════════════
              RIGHT CONTENT COLUMN (Natural Scroll matching Screenshots 2-5)
             ═══════════════════════════════════════════════════════════════════════ */}
          <div className={styles.rightContentColumn}>
            
            {/* ── SECTION 1: REVIEWS (Matches Screenshot 2) ── */}
            <section aria-labelledby="reviews-heading">
              <h2 id="reviews-heading" className={styles.reviewsSectionHeading}>
                ★ {experience.rating.toFixed(1)} · {experience.reviewCount} reviews
              </h2>

              <div className={styles.reviewsGrid}>
                {experience.reviews.slice(0, 2).map((rev) => {
                  const isExpanded = expandedReviews[rev.id];
                  const shouldTruncate = rev.comment.length > 150;

                  return (
                    <article key={rev.id} className={styles.reviewCard}>
                      <div className={styles.reviewerRow}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={rev.avatar}
                          alt={rev.author}
                          className={styles.reviewerAvatar}
                        />
                        <div className={styles.reviewerMeta}>
                          <h4 className={styles.reviewerName}>{rev.author}</h4>
                          <p className={styles.reviewerLocation}>{rev.location}</p>
                        </div>
                      </div>

                      <div className={styles.reviewStarsDate}>
                        <span className={styles.starsBlack}>★★★★★</span>
                        <span className={styles.reviewDateMuted}>· {rev.date}</span>
                      </div>

                      <p className={styles.reviewComment}>
                        {shouldTruncate && !isExpanded
                          ? `${rev.comment.substring(0, 150)}…`
                          : rev.comment}
                      </p>

                      {shouldTruncate && (
                        <button
                          type="button"
                          className={styles.showMoreLink}
                          onClick={() => toggleReviewExpand(rev.id)}
                        >
                          {isExpanded ? "Show less" : "Show more"}
                        </button>
                      )}
                    </article>
                  );
                })}
              </div>

              {/* Show All Reviews Button */}
              <button
                type="button"
                className={styles.showAllReviewsBtn}
                onClick={() => setReviewsModalOpen(true)}
              >
                Show all reviews
              </button>

              <div className={styles.reviewsFooterNotes}>
                <a href="#how-reviews-work">Learn how reviews work</a>
                <div className={styles.autoTranslateNotice}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                  <span>Some reviews have been automatically translated.</span>
                </div>
              </div>
            </section>

            <div className={styles.sectionDivider} />

            {/* ── SECTION 2: MY QUALIFICATIONS & HOST PROFILE CARD (Matches Screenshot 2 & 4) ── */}
            <section aria-labelledby="qualifications-heading">
              <h2 id="qualifications-heading" className={styles.qualificationsHeading}>
                My qualifications
              </h2>

              <div className={styles.qualificationsLayout}>
                {/* Host Profile Card */}
                <div className={styles.hostProfileCard}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={experience.host.avatar}
                    alt={experience.host.name}
                    className={styles.hostCardAvatar}
                  />
                  <h3 className={styles.hostCardName}>{experience.host.name}</h3>
                  <p className={styles.hostCardTitle}>{experience.host.role || "Photographer"}</p>

                  <button
                    type="button"
                    className={styles.messageHostBtn}
                    onClick={() => setMessageModalOpen(true)}
                  >
                    Message {experience.host.name}
                  </button>

                  <p className={styles.paymentProtectionNotice}>
                    To help protect your payment, always use Airbnb to send money and communicate with hosts.
                  </p>
                </div>

                {/* Qualifications List with Icons */}
                <div className={styles.qualificationsList}>
                  {experience.qualifications.map((q, idx) => (
                    <div key={`qual-${idx}`} className={styles.qualificationItem}>
                      <div className={styles.qualificationIconBox}>
                        {renderQualIcon(q.icon)}
                      </div>
                      <div>
                        <h4 className={styles.qualificationTitle}>{q.title}</h4>
                        <p className={styles.qualificationDesc}>{q.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* ── SECTION: RELATED OFFERINGS (If present) ── */}
            {experience.relatedOfferings && experience.relatedOfferings.length > 0 && (
              <>
                <div className={styles.sectionDivider} />
                <section aria-labelledby="offerings-heading">
                  <h2 id="offerings-heading" className={styles.qualificationsHeading}>
                    Other offerings by {experience.host.name}
                  </h2>
                  <div className={styles.relatedOfferingsGrid}>
                    {experience.relatedOfferings.map((off, idx) => (
                      <div key={`off-${idx}`} className={styles.relatedOfferingCard} onClick={() => openLightbox(idx)}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={off.image} alt={off.title} className={styles.relatedOfferingImg} />
                        <div className={styles.relatedOfferingContent}>
                          <h4 className={styles.relatedOfferingTitle}>{off.title}</h4>
                          <p className={styles.relatedOfferingPrice}>
                            {off.price} · {off.duration}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </>
            )}

            <div className={styles.sectionDivider} />

            {/* ── SECTION 3: MY PORTFOLIO (Matches Screenshot 3) ── */}
            <section aria-labelledby="portfolio-heading">
              <h2 id="portfolio-heading" className={styles.portfolioHeading}>
                My portfolio
              </h2>

              <div className={styles.portfolioContainer}>
                {/* Large primary photo on the left */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={portfolioPhotos[0]}
                  alt={`${experience.title} featured`}
                  className={styles.primaryPortfolioImage}
                  onClick={() => openLightbox(0)}
                />

                {/* 2-column grid of smaller thumbnails on the right */}
                <div className={styles.portfolioThumbnailsGrid}>
                  {portfolioPhotos.slice(1, 9).map((photo, pIdx) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={`port-${pIdx}`}
                      src={photo}
                      alt={`${experience.title} portfolio ${pIdx + 2}`}
                      className={styles.portfolioThumbImg}
                      onClick={() => openLightbox(pIdx + 1)}
                    />
                  ))}

                  {/* Show all photos overlay button */}
                  <button
                    type="button"
                    className={styles.showAllPhotosBadgeBtn}
                    onClick={() => openLightbox(0)}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                    <span>Photos</span>
                  </button>
                </div>
              </div>
            </section>

            <div className={styles.sectionDivider} />

            {/* ── SECTION 4: "I'LL COME TO YOU" & MAP (Matches Screenshots 3 & 5) ── */}
            <section aria-labelledby="come-to-you-heading">
              <h2 id="come-to-you-heading" className={styles.comeToYouHeading}>
                I&apos;ll come to you
              </h2>
              <p className={styles.comeToYouSubtext}>
                I travel to guests in the area outlined on the map. To book in a different location, you can message me.
              </p>

              <div
                className={styles.serviceMapCard}
                style={isMapExpanded ? { height: 480 } : undefined}
                aria-label={`Service area map for ${experience.serviceArea}`}
              >
                {/* Stylized vector map showing Delhi NCR and surrounding region */}
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 800 340"
                  preserveAspectRatio="xMidYMid slice"
                  style={{
                    transform: `scale(${mapZoom})`,
                    transformOrigin: "center center",
                    transition: "transform 0.25s ease",
                  }}
                >
                  <rect width="800" height="340" fill="#e7eed9" />

                  {/* Regional border divisions */}
                  <path d="M 0 110 Q 250 130 460 90 T 800 120" stroke="#d5dec2" strokeWidth="2" fill="none" />
                  <path d="M 280 0 Q 310 180 330 340" stroke="#d5dec2" strokeWidth="2" fill="none" />
                  <path d="M 520 0 Q 500 170 550 340" stroke="#d5dec2" strokeWidth="2" fill="none" />

                  {/* Major Highway Corridors */}
                  <path d="M 0 190 L 800 160" stroke="#ffffff" strokeWidth="8" fill="none" />
                  <path d="M 400 0 L 400 340" stroke="#ffffff" strokeWidth="9" fill="none" />
                  <path d="M 180 0 L 620 340" stroke="#ffffff" strokeWidth="6" fill="none" />
                  <path d="M 80 340 Q 380 180 720 0" stroke="#ffffff" strokeWidth="6" fill="none" />

                  {/* River Yamuna */}
                  <path d="M 440 0 Q 425 110 415 175 T 455 340" stroke="#bfdbe5" strokeWidth="12" fill="none" />

                  {/* SERVICE AREA BOUNDARY POLYGON (Matching Screenshot 5) */}
                  <polygon
                    points="340,110 430,95 475,135 480,205 435,245 365,240 330,185"
                    fill="rgba(110, 130, 90, 0.28)"
                    stroke="#505545"
                    strokeWidth="2.2"
                    strokeDasharray="5 4"
                  />

                  {/* Town / City location dots and labels matching Screenshot 5 */}
                  <circle cx="400" cy="155" r="4.5" fill="#222222" />
                  <text x="400" y="145" fill="#111111" fontSize="14" fontWeight="800" textAnchor="middle" letterSpacing="0.8">DELHI</text>

                  <circle cx="410" cy="180" r="3.5" fill="#444444" />
                  <text x="420" y="184" fill="#333333" fontSize="11" fontWeight="700">New Delhi</text>

                  <circle cx="360" cy="205" r="3.5" fill="#444444" />
                  <text x="350" y="209" fill="#333333" fontSize="11" fontWeight="700" textAnchor="end">Gurugram</text>

                  <circle cx="460" cy="195" r="3" fill="#555555" />
                  <text x="470" y="199" fill="#444444" fontSize="11" fontWeight="600">Noida</text>

                  <circle cx="410" cy="65" r="3" fill="#666666" />
                  <text x="410" y="55" fill="#555555" fontSize="11" fontWeight="600" textAnchor="middle">Karnal</text>

                  <circle cx="580" cy="135" r="3" fill="#666666" />
                  <text x="590" y="139" fill="#555555" fontSize="11" fontWeight="600">Meerut</text>

                  <circle cx="340" cy="290" r="3" fill="#666666" />
                  <text x="340" y="306" fill="#555555" fontSize="11" fontWeight="600" textAnchor="middle">Alwar</text>

                  <circle cx="490" cy="295" r="3" fill="#666666" />
                  <text x="490" y="311" fill="#555555" fontSize="11" fontWeight="600" textAnchor="middle">Mathura</text>

                  {/* State Name Labels */}
                  <text x="490" y="50" fill="#7a856a" fontSize="13" fontWeight="700" letterSpacing="1.2">HARYANA</text>
                  <text x="610" y="220" fill="#7a856a" fontSize="13" fontWeight="700" letterSpacing="1.2">UTTAR PRADESH</text>
                </svg>

                {/* Top-Right Expand Button */}
                <div className={styles.mapControlsTopRight}>
                  <button
                    type="button"
                    className={styles.mapIconBtn}
                    onClick={() => setIsMapExpanded((prev) => !prev)}
                    title="Toggle map view"
                    aria-label="Expand map"
                  >
                    ⤢
                  </button>
                </div>

                {/* Zoom In/Out Buttons */}
                <div className={styles.mapZoomControls}>
                  <button
                    type="button"
                    className={styles.zoomBtn}
                    onClick={() => setMapZoom((z) => Math.min(1.6, z + 0.2))}
                    aria-label="Zoom in"
                  >
                    +
                  </button>
                  <button
                    type="button"
                    className={styles.zoomBtn}
                    onClick={() => setMapZoom((z) => Math.max(0.8, z - 0.2))}
                    aria-label="Zoom out"
                  >
                    –
                  </button>
                </div>

                {/* Map Bottom Bar Labels */}
                <div className={styles.mapFooterBar}>
                  <span>Google · Keyboard shortcuts</span>
                  <span>Map Data ©2026 · 50 km ━━</span>
                </div>
              </div>
            </section>

            <div className={styles.sectionDivider} />

            {/* ── SECTION 5: THINGS TO KNOW (Matches Screenshot 5) ── */}
            <section aria-labelledby="things-to-know-heading">
              <h2 id="things-to-know-heading" className={styles.thingsHeading}>
                Things to know
              </h2>

              <div className={styles.thingsGrid}>
                {experience.thingsToKnow.map((item, idx) => (
                  <div key={`thing-${idx}`} className={styles.thingItem}>
                    {renderThingIcon(item.icon)}
                    <h4 className={styles.thingTitle}>{item.title}</h4>
                    <p className={styles.thingDesc}>{item.description}</p>
                  </div>
                ))}
              </div>
            </section>

            <div className={styles.sectionDivider} />

            {/* ── SECTION 6: MORE EXPERIENCES (Bottom Carousel) ── */}
            {moreExperiences.length > 0 && (
              <section className={styles.moreSection} aria-labelledby="more-experiences-heading">
                <div className={styles.moreHeader}>
                  <h2 id="more-experiences-heading" className={styles.moreTitle}>
                    More experiences in {experience.city}
                  </h2>

                  <div className={styles.carouselNav}>
                    <button
                      type="button"
                      className={styles.carouselNavBtn}
                      onClick={() => handleScrollMore("left")}
                      aria-label="Scroll left"
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      className={styles.carouselNavBtn}
                      onClick={() => handleScrollMore("right")}
                      aria-label="Scroll right"
                    >
                      ›
                    </button>
                  </div>
                </div>

                <div className={styles.moreCardsRow} ref={moreRowRef}>
                  {moreExperiences.map((exp) => (
                    <ExperienceCard key={`more-${exp.id}`} experience={exp} />
                  ))}
                </div>
              </section>
            )}

          </div>
        </div>
      </main>

      {/* ── FULL-SCREEN PHOTO GALLERY LIGHTBOX ── */}
      {lightboxOpen && (
        <div className={styles.modalBackdrop} onClick={() => setLightboxOpen(false)}>
          <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className={styles.lightboxCloseBtn}
              onClick={() => setLightboxOpen(false)}
              aria-label="Close photo gallery"
            >
              ✕
            </button>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={portfolioPhotos[lightboxIndex]}
              alt={`Photo ${lightboxIndex + 1} of ${portfolioPhotos.length}`}
              className={styles.lightboxImage}
            />

            <button
              type="button"
              className={`${styles.lightboxNavBtn} ${styles.lightboxPrev}`}
              onClick={handlePrevPhoto}
              aria-label="Previous photo"
            >
              ‹
            </button>

            <button
              type="button"
              className={`${styles.lightboxNavBtn} ${styles.lightboxNext}`}
              onClick={handleNextPhoto}
              aria-label="Next photo"
            >
              ›
            </button>

            <p className={styles.lightboxCounter}>
              {lightboxIndex + 1} / {portfolioPhotos.length}
            </p>
          </div>
        </div>
      )}

      {/* ── MESSAGE HOST MODAL ── */}
      {messageModalOpen && (
        <div className={styles.modalBackdrop} onClick={() => setMessageModalOpen(false)}>
          <div className={styles.dialogCard} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className={styles.dialogCloseBtn}
              onClick={() => setMessageModalOpen(false)}
              aria-label="Close modal"
            >
              ✕
            </button>
            <h3 className={styles.dialogTitle}>Message {experience.host.name}</h3>
            <p style={{ fontSize: "0.92rem", color: "#717171", marginBottom: 14 }}>
              Ask questions about custom locations, timings, outfits, or special requests.
            </p>
            <form onSubmit={handleSendMessage}>
              <textarea
                className={styles.messageTextarea}
                placeholder={`Hi ${experience.host.name}, I would love to ask about...`}
                value={hostMessageText}
                onChange={(e) => setHostMessageText(e.target.value)}
                required
              />
              <button type="submit" className={styles.dialogSubmitBtn}>
                Send message
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── ALL REVIEWS MODAL ── */}
      {reviewsModalOpen && (
        <div className={styles.modalBackdrop} onClick={() => setReviewsModalOpen(false)}>
          <div className={styles.dialogCard} style={{ maxWidth: 640, maxHeight: "80vh", overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className={styles.dialogCloseBtn}
              onClick={() => setReviewsModalOpen(false)}
              aria-label="Close modal"
            >
              ✕
            </button>
            <h3 className={styles.dialogTitle}>★ {experience.rating.toFixed(1)} · {experience.reviews.length} reviews</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {experience.reviews.map((rev) => (
                <div key={rev.id} style={{ borderBottom: "1px solid #eeeeee", paddingBottom: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={rev.avatar} alt={rev.author} style={{ width: 38, height: 38, borderRadius: "50%" }} />
                    <div>
                      <strong style={{ display: "block", fontSize: "0.95rem" }}>{rev.author}</strong>
                      <span style={{ fontSize: "0.82rem", color: "#717171" }}>{rev.location} · {rev.date}</span>
                    </div>
                  </div>
                  <p style={{ fontSize: "0.92rem", color: "#333333", margin: "4px 0 0 0", lineHeight: 1.45 }}>{rev.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── BOOKING SUCCESS CONFIRMATION MODAL ── */}
      {isBookingSuccess && (
        <div className={styles.modalBackdrop} onClick={() => setIsBookingSuccess(false)}>
          <div className={styles.dialogCard} style={{ textAlign: "center" }} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className={styles.dialogCloseBtn}
              onClick={() => setIsBookingSuccess(false)}
              aria-label="Close modal"
            >
              ✕
            </button>
            <div style={{ fontSize: "2.8rem", marginBottom: 12 }}>🎉</div>
            <h3 className={styles.dialogTitle} style={{ marginBottom: 8 }}>Your experience is reserved!</h3>
            <p style={{ fontSize: "0.95rem", color: "#717171", marginBottom: 16 }}>
              Confirmation reference: <strong>{bookingRef}</strong>
            </p>
            <div style={{ backgroundColor: "#f7f7f7", borderRadius: 12, padding: "16px", textAlign: "left", marginBottom: 20 }}>
              <p style={{ margin: "4px 0", fontSize: "0.9rem" }}><strong>Experience:</strong> {experience.title}</p>
              <p style={{ margin: "4px 0", fontSize: "0.9rem" }}><strong>Host:</strong> {experience.host.name}</p>
              <p style={{ margin: "4px 0", fontSize: "0.9rem" }}><strong>Date & Time:</strong> {selectedSlot?.date} ({selectedSlot?.time})</p>
              <p style={{ margin: "4px 0", fontSize: "0.9rem" }}><strong>Guests / Group:</strong> {guestCount} ({isGroupPricing ? "Per Group" : "Per Guest"})</p>
              <p style={{ margin: "4px 0", fontSize: "0.95rem", color: "#222" }}><strong>Total Paid:</strong> {experience.currency}{totalPrice.toLocaleString()}</p>
            </div>
            <button
              type="button"
              className={styles.dialogSubmitBtn}
              onClick={() => setIsBookingSuccess(false)}
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Toast feedback for message sent */}
      {messageSentToast && (
        <div style={{
          position: "fixed",
          bottom: 30,
          right: 30,
          backgroundColor: "#222222",
          color: "#ffffff",
          padding: "14px 22px",
          borderRadius: 12,
          boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
          zIndex: 1100,
          fontSize: "0.95rem",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}>
          <span>✓</span>
          <span>Message sent to {experience.host.name}!</span>
        </div>
      )}
    </div>
  );
}
