"use client";

import React from "react";
import { HeaderTab } from "./Header";
import styles from "./CompactSearchBar.module.css";

interface CompactSearchBarProps {
  activeTab: HeaderTab;
  destination?: string;
  datesLabel?: string;
  guestsLabel?: string;
  serviceType?: string;
  onClick: () => void;
}

export function CompactSearchBar({
  activeTab,
  destination,
  datesLabel,
  guestsLabel,
  serviceType,
  onClick,
}: CompactSearchBarProps) {
  const getTabIcon = () => {
    switch (activeTab) {
      case "homes":
        return (
          <svg viewBox="0 0 32 32" fill="none">
            <path d="M4 14L16 4l12 10v14H4V14z" fill="#f0f0f0" stroke="#717171" strokeWidth="2" strokeLinejoin="round" />
            <path d="M2 15l14-11 14 11" stroke="#333" strokeWidth="2.5" strokeLinecap="round" />
            <rect x="12" y="18" width="8" height="10" fill="#4a8b71" rx="1" />
          </svg>
        );
      case "experiences":
        return (
          <svg viewBox="0 0 32 32" fill="none">
            <path d="M16 2C9.5 2 5 7 5 13c0 5 4 8.5 7.5 11l1.5 2h4l1.5-2c3.5-2.5 7.5-6 7.5-11 0-6-4.5-11-11-11z" fill="#ff5a5f" />
            <path d="M16 2c-3.5 0-6 4.5-6 11 0 4 2 7.5 4 10.5h4c2-3 4-6.5 4-10.5 0-6.5-2.5-11-6-11z" fill="#ffb400" />
          </svg>
        );
      case "services":
        return (
          <svg viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="7" r="2.5" fill="#4a5568" />
            <path d="M4 22c0-7 5.5-11 12-11s12 4 12 11H4z" fill="#718096" />
            <path d="M2 24h28v3H2v-3z" fill="#2d3748" rx="1" />
          </svg>
        );
      case "all":
      default:
        return (
          <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="16" cy="16" r="14" stroke="#d49b5c" />
            <path d="M2 16h28M16 2a22 22 0 0 1 0 28M16 2a22 22 0 0 0 0 28" stroke="#4a8b71" />
          </svg>
        );
    }
  };

  const thirdSegmentText =
    serviceType
      ? serviceType
      : activeTab === "services"
      ? "Add service"
      : guestsLabel && guestsLabel !== "Add guests"
      ? guestsLabel
      : "Add guests";

  return (
    <div
      className={styles.compactPill}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label="Search destinations, dates, and guests"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className={styles.tabIconWrapper}>{getTabIcon()}</div>

      <span className={styles.itemBold}>
        {destination ? destination.split(",")[0] : "Anywhere"}
      </span>

      <span className={styles.divider} />

      <span className={styles.itemBold}>
        {datesLabel && datesLabel !== "Add dates" ? datesLabel : "Anytime"}
      </span>

      <span className={styles.divider} />

      <span className={styles.itemMuted}>{thirdSegmentText}</span>

      {/* Circular Red Search Button with ONLY Search Icon */}
      <div className={styles.searchCircle} aria-hidden="true">
        <svg
          className={styles.searchIcon}
          viewBox="0 0 32 32"
          aria-hidden="true"
        >
          <path d="M13 24a11 11 0 1 0 0-22 11 11 0 0 0 0 22zm8-3 9 9" />
        </svg>
      </div>
    </div>
  );
}
