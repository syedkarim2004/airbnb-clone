/**
 * CheckoutModal — Airbnb-style mock payment + booking confirmation flow.
 *
 * Flow:
 *  1. "payment" screen: trip summary + card form
 *  2. "processing" screen: 1 s spinner
 *  3. Call existing createBooking API
 *  4a. "confirmed" screen on success
 *  4b. "error" screen on booking API failure
 *
 * Card data is NEVER sent to the backend.
 * Card data is NEVER stored anywhere.
 * Payment validation is 100% client-side mock logic.
 *
 * Test card: 4242 4242 4242 4242 / any future MM/YY / any 3-digit CVV
 */
"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { createBooking, getImageUrl, BookingResponse } from "@/lib/api";
import { Listing } from "@/types/listing";
import styles from "./CheckoutModal.module.css";

// ─── Mock payment validator ───────────────────────────────────────────────

function luhnCheck(num: string): boolean {
  let sum = 0;
  let alternate = false;
  for (let i = num.length - 1; i >= 0; i--) {
    let n = parseInt(num[i], 10);
    if (alternate) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alternate = !alternate;
  }
  return sum % 10 === 0;
}

interface PaymentValidationResult {
  ok: boolean;
  field?: "card" | "expiry" | "cvv" | "name";
  message?: string;
}

function validateMockPayment(
  cardNumber: string,
  expiry: string,
  cvv: string,
  name: string
): PaymentValidationResult {
  const digits = cardNumber.replace(/\s/g, "");

  if (digits.length !== 16 || !/^\d+$/.test(digits)) {
    return { ok: false, field: "card", message: "Card number must be 16 digits." };
  }
  if (!luhnCheck(digits)) {
    return { ok: false, field: "card", message: "Invalid card number. Try 4242 4242 4242 4242." };
  }

  // Expiry: MM/YY
  const expiryMatch = expiry.match(/^(\d{2})\/(\d{2})$/);
  if (!expiryMatch) {
    return { ok: false, field: "expiry", message: "Expiry must be MM/YY." };
  }
  const month = parseInt(expiryMatch[1], 10);
  const year = 2000 + parseInt(expiryMatch[2], 10);
  if (month < 1 || month > 12) {
    return { ok: false, field: "expiry", message: "Invalid expiry month." };
  }
  const now = new Date();
  const expiryDate = new Date(year, month, 1); // first day of the month after expiry
  if (expiryDate <= now) {
    return { ok: false, field: "expiry", message: "Card has expired. Use a future date." };
  }

  if (!/^\d{3,4}$/.test(cvv)) {
    return { ok: false, field: "cvv", message: "CVV must be 3 digits." };
  }

  if (!name.trim() || name.trim().length < 2) {
    return { ok: false, field: "name", message: "Please enter the name on your card." };
  }

  return { ok: true };
}

// ─── Human-readable booking error mapper ──────────────────────────────────

function mapBookingError(rawMessage: string): string {
  const msg = rawMessage.toLowerCase();
  if (msg.includes("does not have a guest role") || msg.includes("guest role")) {
    return "Please switch to a guest account to reserve this stay.";
  }
  if (msg.includes("overlap") || msg.includes("dates")) {
    return "These dates are no longer available. Please go back and choose different dates.";
  }
  if (msg.includes("in the past")) {
    return "Check-in date must be in the future.";
  }
  if (msg.includes("listing not found") || msg.includes("not available")) {
    return "This listing is no longer available for booking.";
  }
  if (msg.includes("guest_count") || msg.includes("capacity")) {
    return "The selected guest count exceeds the listing capacity.";
  }
  return rawMessage || "An error occurred. Please try again.";
}

// ─── Card number formatter ─────────────────────────────────────────────────

function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length >= 3) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }
  return digits;
}

// ─── Month names ───────────────────────────────────────────────────────────

const MONTH_NAMES_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function formatDateRange(checkIn: string, checkOut: string): string {
  if (!checkIn) return "";
  const ci = new Date(checkIn + "T00:00:00");
  if (!checkOut) return `${MONTH_NAMES_SHORT[ci.getMonth()]} ${ci.getDate()}`;
  const co = new Date(checkOut + "T00:00:00");
  const ciStr = `${MONTH_NAMES_SHORT[ci.getMonth()]} ${ci.getDate()}`;
  const coStr = `${MONTH_NAMES_SHORT[co.getMonth()]} ${co.getDate()}, ${co.getFullYear()}`;
  return `${ciStr} – ${coStr}`;
}

// ─── Props ─────────────────────────────────────────────────────────────────

interface CheckoutModalProps {
  listing: Listing;
  guestId: number;
  guestName: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guestCount: number;
  priceSubtotal: number;
  cleaningFee: number;
  serviceFee: number;
  totalPrice: number;
  primaryPhotoUrl: string;
  onClose: () => void;
  onConfirmed: (booking: BookingResponse) => void;
}

type ModalScreen = "payment" | "processing" | "confirmed" | "error";

// ─── Component ─────────────────────────────────────────────────────────────

export function CheckoutModal({
  listing,
  guestId,
  guestName,
  checkIn,
  checkOut,
  nights,
  guestCount,
  priceSubtotal,
  cleaningFee,
  serviceFee,
  totalPrice,
  primaryPhotoUrl,
  onClose,
  onConfirmed,
}: CheckoutModalProps) {
  const [screen, setScreen] = useState<ModalScreen>("payment");
  const [confirmedBooking, setConfirmedBooking] = useState<BookingResponse | null>(null);
  const [bookingErrorMsg, setBookingErrorMsg] = useState<string>("");

  // Payment form state
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardName, setCardName] = useState(guestName);
  const [saveCard, setSaveCard] = useState(false);

  // Validation errors per field
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<"card" | "expiry" | "cvv" | "name", string>>>({});

  const overlayRef = useRef<HTMLDivElement>(null);

  // Trap focus & ESC key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && screen !== "processing") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKey);
    // Prevent body scroll
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose, screen]);

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (screen === "processing") return;
      if (e.target === overlayRef.current) {
        onClose();
      }
    },
    [onClose, screen]
  );

  const handlePay = async () => {
    const validation = validateMockPayment(cardNumber, expiry, cvv, cardName);
    if (!validation.ok) {
      setFieldErrors({ [validation.field!]: validation.message });
      return;
    }
    setFieldErrors({});
    setScreen("processing");

    // Simulate 1-second payment processing
    await new Promise((resolve) => setTimeout(resolve, 1200));

    // Call the real booking API
    try {
      const booking = await createBooking(
        {
          listing_id: listing.id,
          guest_id: guestId,
          check_in: checkIn,
          check_out: checkOut,
          guest_count: guestCount,
        },
        guestId
      );
      setConfirmedBooking(booking);
      setScreen("confirmed");
      onConfirmed(booking);
    } catch (err: unknown) {
      const raw = err instanceof Error ? err.message : "Booking failed. Please try again.";
      setBookingErrorMsg(mapBookingError(raw));
      setScreen("error");
    }
  };

  const resolvedPhoto = primaryPhotoUrl ? getImageUrl(primaryPhotoUrl) : "";

  return (
    <div
      className={styles.overlay}
      ref={overlayRef}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label="Checkout"
    >
      <div className={styles.modal}>
        {/* ── Close button (hidden during processing) ── */}
        {screen !== "processing" && (
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close checkout"
          >
            ✕
          </button>
        )}

        {/* ── PAYMENT SCREEN ── */}
        {screen === "payment" && (
          <div className={styles.content}>
            <h2 className={styles.modalTitle}>Confirm and pay</h2>

            {/* Trip summary */}
            <div className={styles.tripSummary}>
              {resolvedPhoto && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={resolvedPhoto}
                  alt={listing.title}
                  className={styles.tripThumb}
                />
              )}
              <div className={styles.tripInfo}>
                <p className={styles.tripListingType}>Entire rental unit</p>
                <p className={styles.tripListingName}>{listing.title}</p>
                <p className={styles.tripLocation}>
                  {listing.city}, {listing.country}
                </p>
              </div>
            </div>

            <div className={styles.divider} />

            {/* Your trip */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Your trip</h3>
              <div className={styles.tripDetailRow}>
                <span className={styles.tripDetailLabel}>Dates</span>
                <span className={styles.tripDetailValue}>
                  {formatDateRange(checkIn, checkOut)}
                </span>
              </div>
              <div className={styles.tripDetailRow}>
                <span className={styles.tripDetailLabel}>Guests</span>
                <span className={styles.tripDetailValue}>
                  {guestCount} {guestCount === 1 ? "guest" : "guests"}
                </span>
              </div>
            </div>

            <div className={styles.divider} />

            {/* Price details */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Price details</h3>
              <div className={styles.priceRow}>
                <span className={styles.priceLabel}>
                  ${listing.price_per_night} × {nights} {nights === 1 ? "night" : "nights"}
                </span>
                <span>${priceSubtotal}</span>
              </div>
              {cleaningFee > 0 && (
                <div className={styles.priceRow}>
                  <span className={styles.priceLabel}>Cleaning fee</span>
                  <span>${cleaningFee}</span>
                </div>
              )}
              <div className={styles.priceRow}>
                <span className={styles.priceLabel}>Airbnb service fee</span>
                <span>${serviceFee}</span>
              </div>
              <div className={styles.divider} />
              <div className={`${styles.priceRow} ${styles.priceTotal}`}>
                <span>Total (USD)</span>
                <span>${totalPrice}</span>
              </div>
            </div>

            <div className={styles.divider} />

            {/* Payment form */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Pay with</h3>
              <div className={styles.payMethodChip}>
                <span className={styles.payMethodIcon}>💳</span>
                <span>Card</span>
              </div>

              {/* Card number */}
              <div className={styles.fieldGroup}>
                <label htmlFor="checkout-card-number" className={styles.fieldLabel}>
                  Card number
                </label>
                <input
                  id="checkout-card-number"
                  type="text"
                  inputMode="numeric"
                  autoComplete="cc-number"
                  placeholder="4242 4242 4242 4242"
                  className={`${styles.fieldInput} ${fieldErrors.card ? styles.fieldInputError : ""}`}
                  value={cardNumber}
                  onChange={(e) => {
                    setCardNumber(formatCardNumber(e.target.value));
                    setFieldErrors((prev) => ({ ...prev, card: undefined }));
                  }}
                  maxLength={19}
                />
                {fieldErrors.card && (
                  <p className={styles.fieldError}>{fieldErrors.card}</p>
                )}
              </div>

              {/* Expiry + CVV row */}
              <div className={styles.fieldRow}>
                <div className={styles.fieldGroup}>
                  <label htmlFor="checkout-expiry" className={styles.fieldLabel}>
                    Expiration
                  </label>
                  <input
                    id="checkout-expiry"
                    type="text"
                    inputMode="numeric"
                    autoComplete="cc-exp"
                    placeholder="MM/YY"
                    className={`${styles.fieldInput} ${fieldErrors.expiry ? styles.fieldInputError : ""}`}
                    value={expiry}
                    onChange={(e) => {
                      setExpiry(formatExpiry(e.target.value));
                      setFieldErrors((prev) => ({ ...prev, expiry: undefined }));
                    }}
                    maxLength={5}
                  />
                  {fieldErrors.expiry && (
                    <p className={styles.fieldError}>{fieldErrors.expiry}</p>
                  )}
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor="checkout-cvv" className={styles.fieldLabel}>
                    CVV
                  </label>
                  <input
                    id="checkout-cvv"
                    type="password"
                    inputMode="numeric"
                    autoComplete="cc-csc"
                    placeholder="•••"
                    className={`${styles.fieldInput} ${fieldErrors.cvv ? styles.fieldInputError : ""}`}
                    value={cvv}
                    onChange={(e) => {
                      setCvv(e.target.value.replace(/\D/g, "").slice(0, 3));
                      setFieldErrors((prev) => ({ ...prev, cvv: undefined }));
                    }}
                    maxLength={3}
                  />
                  {fieldErrors.cvv && (
                    <p className={styles.fieldError}>{fieldErrors.cvv}</p>
                  )}
                </div>
              </div>

              {/* Name on card */}
              <div className={styles.fieldGroup}>
                <label htmlFor="checkout-card-name" className={styles.fieldLabel}>
                  Name on card
                </label>
                <input
                  id="checkout-card-name"
                  type="text"
                  autoComplete="cc-name"
                  placeholder="Demo Guest"
                  className={`${styles.fieldInput} ${fieldErrors.name ? styles.fieldInputError : ""}`}
                  value={cardName}
                  onChange={(e) => {
                    setCardName(e.target.value);
                    setFieldErrors((prev) => ({ ...prev, name: undefined }));
                  }}
                />
                {fieldErrors.name && (
                  <p className={styles.fieldError}>{fieldErrors.name}</p>
                )}
              </div>

              {/* Save card (visual only) */}
              <label className={styles.saveCardLabel}>
                <input
                  type="checkbox"
                  checked={saveCard}
                  onChange={(e) => setSaveCard(e.target.checked)}
                  className={styles.saveCardCheck}
                />
                Save payment method for future trips
              </label>
            </div>

            {/* Pay button */}
            <button
              type="button"
              className={styles.payBtn}
              onClick={handlePay}
            >
              Pay ${totalPrice}
            </button>

            <p className={styles.secureNotice}>
              🔒 Secure payment &nbsp;•&nbsp; This is a demo — no real charge is made
            </p>
          </div>
        )}

        {/* ── PROCESSING SCREEN ── */}
        {screen === "processing" && (
          <div className={styles.centeredScreen}>
            <div className={styles.spinner} aria-label="Processing payment" />
            <p className={styles.processingText}>Processing payment…</p>
            <p className={styles.processingSubtext}>Please don&apos;t close this window</p>
          </div>
        )}

        {/* ── CONFIRMED SCREEN ── */}
        {screen === "confirmed" && confirmedBooking && (
          <div className={styles.content}>
            <div className={styles.confirmedHero}>
              <div className={styles.confirmedCheckmark}>✓</div>
              <h2 className={styles.confirmedTitle}>Reservation confirmed!</h2>
              <p className={styles.confirmedSubtitle}>
                You&apos;re going to {listing.city}!
              </p>
            </div>

            {/* Trip details */}
            <div className={styles.confirmedCard}>
              {resolvedPhoto && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={resolvedPhoto}
                  alt={listing.title}
                  className={styles.confirmedThumb}
                />
              )}
              <div className={styles.confirmedListingInfo}>
                <p className={styles.confirmedListingName}>{listing.title}</p>
                <p className={styles.confirmedMeta}>
                  {listing.city}, {listing.country}
                </p>
                <p className={styles.confirmedMeta}>
                  {formatDateRange(checkIn, checkOut)}
                </p>
                <p className={styles.confirmedMeta}>
                  {guestCount} {guestCount === 1 ? "guest" : "guests"}
                </p>
              </div>
            </div>

            <div className={styles.divider} />

            <div className={styles.confirmedTotalRow}>
              <span className={styles.confirmedTotalLabel}>Total paid</span>
              <span className={styles.confirmedTotalValue}>
                ${confirmedBooking.total_price}
              </span>
            </div>

            <p className={styles.demoPaymentNotice}>
              ✓ Payment processed successfully (demo) · Booking #{confirmedBooking.id}
            </p>

            <div className={styles.confirmedActions}>
              <Link href="/trips" className={styles.tripsBtn} onClick={onClose}>
                View My Trips
              </Link>
              <button type="button" className={styles.continueBtn} onClick={onClose}>
                Continue exploring
              </button>
            </div>
          </div>
        )}

        {/* ── ERROR SCREEN ── */}
        {screen === "error" && (
          <div className={styles.centeredScreen}>
            <div className={styles.errorIcon}>⚠️</div>
            <h2 className={styles.errorTitle}>Booking failed</h2>
            <p className={styles.errorMessage}>{bookingErrorMsg}</p>
            <button
              type="button"
              className={styles.retryBtn}
              onClick={() => {
                setScreen("payment");
                setBookingErrorMsg("");
              }}
            >
              ← Go back and try again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
