"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Listing } from "@/types/listing";
import styles from "./SearchMap.module.css";

interface SearchMapProps {
  listings: Listing[];
  hoveredListingId: number | null;
  onMarkerHover?: (id: number | null) => void;
  selectedCity?: string;
}

export function SearchMap({
  listings,
  hoveredListingId,
  onMarkerHover,
  selectedCity,
}: SearchMapProps) {
  const router = useRouter();
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

  // Compute map bounding box and coordinate projection
  const { centerLat, centerLon, spanLat, spanLon } = useMemo(() => {
    const valid = listings.filter(
      (l) => l.latitude !== null && l.longitude !== null
    );

    if (valid.length === 0) {
      return { centerLat: 48.8566, centerLon: 2.3522, spanLat: 0.1, spanLon: 0.15 };
    }

    const lats = valid.map((l) => l.latitude as number);
    const lons = valid.map((l) => l.longitude as number);

    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLon = Math.min(...lons);
    const maxLon = Math.max(...lons);

    return {
      centerLat: (minLat + maxLat) / 2,
      centerLon: (minLon + maxLon) / 2,
      spanLat: Math.max(0.04, (maxLat - minLat) * 1.5),
      spanLon: Math.max(0.06, (maxLon - minLon) * 1.5),
    };
  }, [listings]);

  // Project latitude/longitude to percentage [0, 100]
  const getMarkerPosition = (lat: number | null, lon: number | null) => {
    if (lat === null || lon === null) return { x: 50, y: 50 };

    const effectiveSpanLat = spanLat / zoomLevel;
    const effectiveSpanLon = spanLon / zoomLevel;

    const x = 50 + ((lon - centerLon) / effectiveSpanLon) * 70;
    const y = 50 - ((lat - centerLat) / effectiveSpanLat) * 70;

    // Clamp inside viewport for visual safety
    return {
      x: Math.min(92, Math.max(8, x)),
      y: Math.min(92, Math.max(8, y)),
    };
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev * 1.3, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev / 1.3, 0.6));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
    setSelectedListing(null);
  };

  return (
    <div className={styles.mapContainer} aria-label="Interactive listings map">
      {/* Background Stylized Map Canvas SVG matching Screenshot 1 */}
      <svg
        className={styles.mapSvg}
        viewBox="0 0 1000 800"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="terrainGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#eef4e8" />
            <stop offset="50%" stopColor="#f5f8f0" />
            <stop offset="100%" stopColor="#e8efe2" />
          </linearGradient>
          <pattern id="gridPattern" width="100" height="100" patternUnits="userSpaceOnUse">
            <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#e0e8d8" strokeWidth="0.8" strokeDasharray="4 4" />
          </pattern>
        </defs>

        {/* Terrain base */}
        <rect width="1000" height="800" fill="url(#terrainGrad)" />
        <rect width="1000" height="800" fill="url(#gridPattern)" opacity="0.6" />

        {/* Major Waterways / Rivers (Soft blue tones) */}
        <path
          d="M -50 250 Q 200 320 400 280 T 750 420 T 1050 380"
          fill="none"
          stroke="#bddfe8"
          strokeWidth="24"
          strokeLinecap="round"
          opacity="0.8"
        />
        <path
          d="M 350 0 Q 380 200 400 280 T 450 600 T 550 850"
          fill="none"
          stroke="#c8e5ed"
          strokeWidth="16"
          strokeLinecap="round"
          opacity="0.7"
        />

        {/* Regional Major Roads & Highways (Muted yellow-grey) */}
        <path
          d="M 100 850 L 300 500 L 500 400 L 800 200 L 950 -50"
          fill="none"
          stroke="#ffffff"
          strokeWidth="8"
          strokeLinejoin="round"
        />
        <path
          d="M 100 850 L 300 500 L 500 400 L 800 200 L 950 -50"
          fill="none"
          stroke="#f8ecd0"
          strokeWidth="4"
          strokeLinejoin="round"
        />

        <path
          d="M -50 450 Q 300 480 600 520 T 1050 620"
          fill="none"
          stroke="#ffffff"
          strokeWidth="6"
        />
        <path
          d="M -50 450 Q 300 480 600 520 T 1050 620"
          fill="none"
          stroke="#e9e5d7"
          strokeWidth="3"
        />

        {/* Geographic Area & City Labels */}
        <text x="350" y="240" fill="#718070" fontSize="18" fontWeight="600" letterSpacing="4" opacity="0.6">
          {selectedCity ? selectedCity.toUpperCase() : "METROPOLITAN REGION"}
        </text>
        <text x="680" y="160" fill="#889886" fontSize="14" fontWeight="600" letterSpacing="3" opacity="0.5">
          NORTH DISTRICT
        </text>
        <text x="240" y="580" fill="#889886" fontSize="14" fontWeight="600" letterSpacing="3" opacity="0.5">
          CENTRAL AREA
        </text>
      </svg>

      {/* Map Control Buttons: Zoom In, Zoom Out, Reset */}
      <div className={styles.controlsGroup}>
        <button
          type="button"
          className={styles.controlBtn}
          onClick={handleResetZoom}
          aria-label="Expand or fit map"
          title="Reset map view"
        >
          ⤢
        </button>
        <button
          type="button"
          className={styles.controlBtn}
          onClick={handleZoomIn}
          aria-label="Zoom in"
          title="Zoom in"
        >
          +
        </button>
        <button
          type="button"
          className={styles.controlBtn}
          onClick={handleZoomOut}
          aria-label="Zoom out"
          title="Zoom out"
        >
          −
        </button>
      </div>

      {/* Price Pill Markers Positioned on Map */}
      {listings.map((listing) => {
        const { x, y } = getMarkerPosition(listing.latitude, listing.longitude);
        const isHovered = hoveredListingId === listing.id;
        const isSelected = selectedListing?.id === listing.id;
        const active = isHovered || isSelected;

        return (
          <div
            key={`map-pin-${listing.id}`}
            className={styles.markerWrapper}
            style={{
              left: `${x}%`,
              top: `${y}%`,
              zIndex: active ? 26 : 12,
            }}
            onMouseEnter={() => {
              if (onMarkerHover) onMarkerHover(listing.id);
            }}
            onMouseLeave={() => {
              if (onMarkerHover) onMarkerHover(null);
            }}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedListing(isSelected ? null : listing);
            }}
          >
            <div
              className={`${styles.pricePill} ${active ? styles.pricePillActive : ""}`}
              role="button"
              tabIndex={0}
              aria-label={`$${listing.price_per_night} per night`}
            >
              ${listing.price_per_night}
            </div>

            {/* Popup Card when marker is clicked/selected */}
            {isSelected && (
              <div
                className={styles.previewCard}
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/listings/${listing.id}`);
                }}
              >
                <button
                  type="button"
                  className={styles.closePreviewBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedListing(null);
                  }}
                  aria-label="Close preview"
                >
                  ✕
                </button>

                {listing.images && listing.images.length > 0 && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={listing.images[0]}
                    alt={listing.title}
                    className={styles.previewImage}
                  />
                )}

                <div className={styles.previewInfo}>
                  <div className={styles.previewHeader}>
                    <h4 className={styles.previewTitle}>{listing.title}</h4>
                    {listing.rating_avg && (
                      <span className={styles.previewRating}>
                        ★ {listing.rating_avg.toFixed(1)}
                      </span>
                    )}
                  </div>
                  <div className={styles.previewPrice}>
                    ${listing.price_per_night} <span>night</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Attribution bar matching real Airbnb Screenshot 1 */}
      <div className={styles.googleWatermark}>Google</div>
      <div className={styles.attributionBar}>
        <span>Map Data ©2026</span>
        <span>Terms</span>
        <span>Report a map error</span>
      </div>
    </div>
  );
}
