"use client";

import React, { useState } from "react";
import styles from "./Footer.module.css";

const INSPIRATION_TABS = [
  "Popular",
  "Arts & culture",
  "Beach",
  "Mountains",
  "Outdoors",
  "Things to do",
];

const INSPIRATION_DESTINATIONS = [
  { city: "Dallas", type: "Holiday rentals" },
  { city: "North Myrtle Beach", type: "Apartment rentals" },
  { city: "Portland", type: "Cabin rentals" },
  { city: "Nice", type: "Villa rentals" },
  { city: "Barcelona", type: "Apartment rentals" },
  { city: "Cleveland", type: "Apartment rentals" },
  { city: "Galveston", type: "Apartment rentals" },
  { city: "Kauai", type: "Apartment rentals" },
  { city: "Portland", type: "Cabin rentals" },
  { city: "Minneapolis", type: "Holiday rentals" },
  { city: "Raleigh", type: "Flat rentals" },
  { city: "Philadelphia", type: "Monthly Rentals" },
  { city: "Orange Beach", type: "Flat rentals" },
  { city: "Amsterdam", type: "Apartment rentals" },
  { city: "Gulf Shores", type: "Apartment rentals" },
  { city: "Tokyo", type: "Holiday rentals" },
  { city: "St. Petersburg", type: "Monthly Rentals" },
  { city: "Paris", type: "Villa rentals" },
];

export function Footer() {
  const [activeTab, setActiveTab] = useState("Popular");

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Inspiration for future getaways */}
        <div className={styles.inspirationSection}>
          <h2 className={styles.inspirationHeading}>
            Inspiration for future getaways
          </h2>

          <div className={styles.inspirationTabs}>
            {INSPIRATION_TABS.map((tab) => (
              <button
                type="button"
                key={tab}
                className={`${styles.inspTabBtn} ${
                  activeTab === tab ? styles.inspTabBtnActive : ""
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className={styles.destinationsGrid}>
            {INSPIRATION_DESTINATIONS.map((dest, idx) => (
              <div key={`${dest.city}-${idx}`} className={styles.destColItem}>
                <span className={styles.destColCity}>{dest.city}</span>
                <span className={styles.destColType}>{dest.type}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 3 Columns: Support, Hosting, Airbnb */}
        <div className={styles.linksColumns}>
          {/* Column 1: Support */}
          <div className={styles.column}>
            <h3 className={styles.columnHeading}>Support</h3>
            <a href="#help" className={styles.footerLink}>Help Centre</a>
            <a href="#safety" className={styles.footerLink}>Get help with a safety issue</a>
            <a href="#aircover" className={styles.footerLink}>AirCover</a>
            <a href="#anti-discrimination" className={styles.footerLink}>Anti-discrimination</a>
            <a href="#disability" className={styles.footerLink}>Disability support</a>
            <a href="#cancellation" className={styles.footerLink}>Cancellation options</a>
            <a href="#neighbourhood" className={styles.footerLink}>Report neighbourhood concern</a>
          </div>

          {/* Column 2: Hosting */}
          <div className={styles.column}>
            <h3 className={styles.columnHeading}>Hosting</h3>
            <a href="#airbnb-your-home" className={styles.footerLink}>Airbnb your home</a>
            <a href="#airbnb-your-experience" className={styles.footerLink}>Airbnb your experience</a>
            <a href="#airbnb-your-service" className={styles.footerLink}>Airbnb your service</a>
            <a href="#aircover-hosts" className={styles.footerLink}>AirCover for Hosts</a>
            <a href="#hosting-resources" className={styles.footerLink}>Hosting resources</a>
            <a href="#community-forum" className={styles.footerLink}>Community forum</a>
            <a href="#hosting-responsibly" className={styles.footerLink}>Hosting responsibly</a>
            <a href="#hosting-class" className={styles.footerLink}>Join a free hosting class</a>
          </div>

          {/* Column 3: Airbnb */}
          <div className={styles.column}>
            <h3 className={styles.columnHeading}>Airbnb</h3>
            <a href="#summer-release" className={styles.footerLink}>2026 Summer Release</a>
            <a href="#newsroom" className={styles.footerLink}>Newsroom</a>
            <a href="#careers" className={styles.footerLink}>Careers</a>
            <a href="#investors" className={styles.footerLink}>Investors</a>
            <a href="#emergency" className={styles.footerLink}>Airbnb.org emergency stays</a>
          </div>
        </div>

        {/* Bottom Row */}
        <div className={styles.bottomRow}>
          <div className={styles.bottomLeft}>
            <span>© 2026 Airbnb Clone, Inc.</span>
            <span className={styles.dot}>·</span>
            <a href="#privacy" className={styles.footerLink}>Privacy</a>
            <span className={styles.dot}>·</span>
            <a href="#terms" className={styles.footerLink}>Terms</a>
            <span className={styles.dot}>·</span>
            <a href="#sitemap" className={styles.footerLink}>Sitemap</a>
            <span className={styles.dot}>·</span>
            <a href="#company" className={styles.footerLink}>Company details</a>
          </div>

          <div className={styles.bottomRight}>
            <div className={styles.localeItem}>
              <span>🌐 English (IN)</span>
            </div>
            <div className={styles.localeItem}>
              <span>$ USD</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
