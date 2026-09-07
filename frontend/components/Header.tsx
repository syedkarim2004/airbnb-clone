"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CompactSearchBar } from "./CompactSearchBar";
import { useAuth } from "@/context/AuthContext";
import styles from "./Header.module.css";

export type HeaderTab = "all" | "homes" | "experiences" | "services";

interface HeaderProps {
  activeTab: HeaderTab;
  onTabChange: (tab: HeaderTab) => void;
  isScrolled?: boolean;
  isSearchExpanded?: boolean;
  onOpenSearch?: () => void;
  destination?: string;
  datesLabel?: string;
  guestsLabel?: string;
  serviceType?: string;
  showCompactAlways?: boolean;
}

export function Header({
  activeTab,
  onTabChange,
  isScrolled = false,
  isSearchExpanded = false,
  onOpenSearch,
  destination,
  datesLabel,
  guestsLabel,
  serviceType,
  showCompactAlways = false,
}: HeaderProps) {
  const router = useRouter();
  const { currentUser, switchUser, allUsers, isHost } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  const showCompactSearch = showCompactAlways || (isScrolled && !isSearchExpanded);

  return (
    <header className={`${styles.header} ${isScrolled ? styles.headerScrolled : ""}`}>
      <div className={styles.container}>
        {/* Left: Brand Logo */}
        <div className={styles.leftSection}>
          <Link href="/" className={styles.brand} aria-label="Airbnb Home">
            <svg
              className={styles.logoIcon}
              viewBox="0 0 32 32"
              aria-hidden="true"
            >
              <path d="M16 1c2.008 0 3.463.963 4.751 3.269l.533 1.025c1.954 3.83 6.114 12.54 7.1 14.836l.145.353c.667 1.591.91 2.472.96 3.396l.011.315c0 4.545-3.415 8.006-8.23 8.006-2.585 0-4.999-1.077-6.77-3.003-1.77 1.926-4.185 3.003-6.77 3.003C2.915 32-.5 28.539-.5 23.994l.011-.315c.05-.924.293-1.805.96-3.396l.145-.353c.986-2.296 5.146-11.006 7.1-14.836l.533-1.025C9.537 1.963 10.992 1 13 1h3zm0 2.2c-1.34 0-2.316.634-3.39 2.551l-.547 1.053C10.155 10.53 6.074 19.066 5.12 21.29l-.128.312c-.524 1.25-.722 1.895-.76 2.579L4.22 24.4c0 3.329 2.41 5.8 5.78 5.8 2.378 0 4.537-1.325 5.67-3.473l.33-.667.33.667c1.133 2.148 3.292 3.473 5.67 3.473 3.37 0 5.78-2.471 5.78-5.8l-.012-.219c-.038-.684-.236-1.329-.76-2.579l-.128-.312c-.954-2.224-5.035-10.76-6.943-14.486l-.547-1.053C17.316 3.834 16.34 3.2 15 3.2h1zm0 10.3c2.723 0 4.8 2.062 4.8 4.755 0 2.215-1.405 4.34-3.64 5.928l-.51.345-.65.412-.65-.412c-1.748-1.242-3.14-3.08-3.33-5.188l-.02-.34c0-2.693 2.077-4.755 4.8-4.755zm0 2.2c-1.488 0-2.6 1.104-2.6 2.555 0 1.297.886 2.766 2.6 4.095 1.714-1.329 2.6-2.798 2.6-4.095 0-1.451-1.112-2.555-2.6-2.555z" />
            </svg>
            <span className={styles.brandText}>airbnb</span>
          </Link>
        </div>

        {/* Center: Main Navigation Tabs OR Compact Search (when scrolled) */}
        <div className={styles.centerSection}>
          {showCompactSearch ? (
            <div className={styles.compactSearchWrapper}>
              <CompactSearchBar
                activeTab={activeTab}
                destination={destination}
                datesLabel={datesLabel}
                guestsLabel={guestsLabel}
                serviceType={serviceType}
                onClick={onOpenSearch || (() => {})}
              />
            </div>
          ) : (
            <nav className={styles.centerNav} aria-label="Main Navigation">
              {/* ALL - Stand Globe Icon */}
              <button
                type="button"
                className={`${styles.navItem} ${activeTab === "all" ? styles.navItemActive : ""}`}
                onClick={() => onTabChange("all")}
              >
                <span className={styles.tabIcon}>
                  <svg viewBox="0 0 32 32" width="24" height="24" fill="none">
                    {/* Brass stand base and arc */}
                    <path d="M12 28h8M16 25v3M8 15a8.5 8.5 0 0 0 14.5 6l1.5 1.5" stroke="#b8860b" strokeWidth="2" strokeLinecap="round" />
                    <path d="M7 16A9 9 0 1 1 23 20" stroke="#d4af37" strokeWidth="2.2" strokeLinecap="round" />
                    {/* Tilted globe body */}
                    <circle cx="15" cy="14" r="8" fill="#5cb3e4" />
                    {/* Continents */}
                    <path d="M11 11c1-1 3-1 4 0s.5 2 2 2 2-1 3 0c-1 3-3 4-5 4s-3-1-3-3l-1-3z" fill="#78c257" />
                    <path d="M13 18c1.5 1 3 .5 4-.5" stroke="#4a8b38" strokeWidth="1.2" strokeLinecap="round" />
                    <circle cx="15" cy="14" r="8" stroke="#3a8bb8" strokeWidth="1" />
                    {/* Stand pivot pin */}
                    <circle cx="15" cy="5.5" r="1" fill="#b8860b" />
                    <circle cx="15" cy="22.5" r="1" fill="#b8860b" />
                  </svg>
                </span>
                <span className={styles.tabLabel}>All</span>
              </button>

              {/* HOMES - House with Tree */}
              <button
                type="button"
                className={`${styles.navItem} ${activeTab === "homes" ? styles.navItemActive : ""}`}
                onClick={() => onTabChange("homes")}
              >
                <span className={styles.tabIcon}>
                  <svg viewBox="0 0 32 32" width="24" height="24" fill="none">
                    {/* House body */}
                    <rect x="5" y="12" width="14" height="13" rx="1" fill="#f4f4f4" stroke="#484848" strokeWidth="1.5" />
                    {/* Gable roof */}
                    <path d="M3 13l9-8 9 8" stroke="#333333" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    {/* Door */}
                    <rect x="10" y="18" width="4" height="7" rx="0.5" fill="#e0565b" />
                    {/* Tree beside house */}
                    <rect x="23" y="19" width="2" height="6" fill="#8c6239" rx="0.5" />
                    <circle cx="24" cy="16" r="5" fill="#48a860" />
                    <circle cx="22" cy="14" r="3.5" fill="#5cb870" />
                  </svg>
                </span>
                <span className={styles.tabLabel}>Homes</span>
              </button>

              {/* EXPERIENCES - Hot Air Balloon */}
              <button
                type="button"
                className={`${styles.navItem} ${activeTab === "experiences" ? styles.navItemActive : ""}`}
                onClick={() => onTabChange("experiences")}
              >
                <span className={styles.tabIcon}>
                  <svg viewBox="0 0 32 32" width="24" height="24" fill="none">
                    {/* Balloon body */}
                    <path d="M16 3c-5.5 0-10 4.5-10 10 0 5 4 8 7 10.5l1 1.5h4l1-1.5c3-2.5 7-5.5 7-10.5 0-5.5-4.5-10-10-10z" fill="#ff5a5f" />
                    {/* Balloon center stripe */}
                    <path d="M16 3c-2.8 0-5 4.5-5 10s2.2 9.5 5 12c2.8-2.5 5-6.5 5-12S18.8 3 16 3z" fill="#ffa100" />
                    <path d="M16 3c-1.2 0-2 4.5-2 10s.8 9.5 2 12c1.2-2.5 2-6.5 2-12S17.2 3 16 3z" fill="#ffe066" />
                    {/* Rigging and basket */}
                    <line x1="14" y1="25" x2="14" y2="27" stroke="#717171" strokeWidth="1" />
                    <line x1="18" y1="25" x2="18" y2="27" stroke="#717171" strokeWidth="1" />
                    <rect x="13.5" y="27" width="5" height="3" rx="0.8" fill="#8c6239" stroke="#6d4c2b" strokeWidth="0.8" />
                  </svg>
                </span>
                <span className={styles.tabLabel}>Experiences</span>
              </button>

              {/* SERVICES - Cloche / Service Cover */}
              <button
                type="button"
                className={`${styles.navItem} ${activeTab === "services" ? styles.navItemActive : ""}`}
                onClick={() => onTabChange("services")}
              >
                <span className={styles.tabIcon}>
                  <svg viewBox="0 0 32 32" width="24" height="24" fill="none">
                    {/* Top knob handle */}
                    <circle cx="16" cy="8" r="2.5" fill="#4a5568" />
                    {/* Cloche dome */}
                    <path d="M4 22c0-6.6 5.4-12 12-12s12 5.4 12 12H4z" fill="#cbd5e0" stroke="#718096" strokeWidth="1.5" />
                    {/* Metallic highlight */}
                    <path d="M8 20c1.5-4 4.5-7 8-7" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
                    {/* Tray / Platter */}
                    <rect x="2" y="22" width="28" height="3" rx="1.5" fill="#2d3748" />
                    <path d="M6 25h20" stroke="#4a5568" strokeWidth="1" />
                  </svg>
                </span>
                <span className={styles.tabLabel}>Services</span>
              </button>
            </nav>
          )}
        </div>

        {/* Right: Controls (Become a host / Host dashboard, User Menu) */}
        <div className={styles.rightSection} ref={menuRef}>
          {isHost ? (
            <Link href="/host" className={styles.hostButton}>
              Switch to hosting
            </Link>
          ) : (
            <button
              type="button"
              className={styles.hostButton}
              onClick={() => router.push("/host")}
            >
              Become a host
            </button>
          )}

          {/* User Pill Button (Hamburger + Avatar) */}
          <div className={styles.userMenuContainer}>
            <button
              type="button"
              className={styles.userPillBtn}
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label="User menu and profile"
              aria-expanded={menuOpen}
            >
              <div className={styles.hamburgerIcon}>
                <span />
                <span />
                <span />
              </div>
              <div className={styles.userAvatar}>
                {currentUser?.name ? currentUser.name.charAt(0) : "U"}
              </div>
            </button>

            {/* Dropdown Menu */}
            {menuOpen && (
              <div className={styles.userDropdownMenu} role="menu">
                {/* Current User Info */}
                <div className={styles.menuHeader}>
                  <div className={styles.menuUserName}>
                    <span>{currentUser.name}</span>
                    <span
                      className={`${styles.menuUserRole} ${
                        currentUser.role === "host"
                          ? styles.roleHost
                          : currentUser.role === "both"
                          ? styles.roleBoth
                          : ""
                      }`}
                    >
                      {currentUser.role}
                    </span>
                  </div>
                  <div className={styles.menuUserEmail}>{currentUser.email}</div>
                </div>

                {/* Direct Navigation Links */}
                <Link
                  href="/trips"
                  className={styles.menuLink}
                  onClick={() => setMenuOpen(false)}
                >
                  My Trips
                </Link>
                <Link
                  href="/favorites"
                  className={styles.menuLink}
                  onClick={() => setMenuOpen(false)}
                >
                  Wishlists / Favorites
                </Link>
                {isHost && (
                  <Link
                    href="/host"
                    className={styles.menuLink}
                    onClick={() => setMenuOpen(false)}
                  >
                    Host Dashboard
                  </Link>
                )}

                <div className={styles.menuDivider} />

                {/* Mock User Switcher Section */}
                <div className={styles.menuSectionTitle}>Switch User (Mock Auth)</div>
                {allUsers.map((user) => {
                  const isSelected = user.id === currentUser.id;
                  return (
                    <button
                      key={user.id}
                      type="button"
                      className={`${styles.userSwitcherItem} ${
                        isSelected ? styles.userSwitcherActive : ""
                      }`}
                      onClick={() => {
                        switchUser(user);
                        setMenuOpen(false);
                      }}
                    >
                      <span className={styles.switcherName}>
                        {user.name} {isSelected && "✓"}
                      </span>
                      <span className={styles.switcherRole}>{user.role}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
