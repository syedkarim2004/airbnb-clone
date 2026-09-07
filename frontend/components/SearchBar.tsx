"use client";

import React, { useState, useRef, useEffect } from "react";
import { HeaderTab } from "./Header";
import styles from "./SearchBar.module.css";

interface DestinationItem {
  title: string;
  subtitle: string;
  icon: string;
  bgColor: string;
}

const SUGGESTED_DESTINATIONS: DestinationItem[] = [
  {
    title: "Nearby",
    subtitle: "Find what's around you",
    icon: "🧭",
    bgColor: "#e8f4fd",
  },
  {
    title: "Gurgaon District, Haryana",
    subtitle: "Near you",
    icon: "🏙️",
    bgColor: "#fdf8e8",
  },
  {
    title: "New Delhi, Delhi",
    subtitle: "For sights like India Gate",
    icon: "🏛️",
    bgColor: "#e8fdf6",
  },
  {
    title: "North Goa, Goa",
    subtitle: "Popular beach destination",
    icon: "🏖️",
    bgColor: "#fdeee8",
  },
  {
    title: "Varanasi, Uttar Pradesh",
    subtitle: "A hidden gem",
    icon: "🛕",
    bgColor: "#fdf0e8",
  },
  {
    title: "Mumbai, Maharashtra",
    subtitle: "For sights like Gateway of India",
    icon: "🌉",
    bgColor: "#e8f0fd",
  },
  {
    title: "Bengaluru, Karnataka",
    subtitle: "For its top-notch dining",
    icon: "🍽️",
    bgColor: "#fdf6e8",
  },
  {
    title: "Paris, France",
    subtitle: "City of lights & romance",
    icon: "🗼",
    bgColor: "#f3e8fd",
  },
  {
    title: "Dehradun, Uttarakhand",
    subtitle: "For nature lovers",
    icon: "🌲",
    bgColor: "#e8fdf0",
  },
  {
    title: "Noida, Uttar Pradesh",
    subtitle: "Near you",
    icon: "🏢",
    bgColor: "#fde8ec",
  },
  {
    title: "Rishikesh, Uttarakhand",
    subtitle: "For nature lovers",
    icon: "⛰️",
    bgColor: "#fde8e8",
  },
];

const SERVICE_TYPES = [
  { label: "Photography", icon: "📸", desc: "Portraits, couples & events" },
  { label: "Training & Fitness", icon: "💪", desc: "Coaching, mobility & strength" },
  { label: "Private Chef", icon: "🍳", desc: "Custom multi-course dinners" },
  { label: "Wellness & Spa", icon: "🧘", desc: "Yoga, sound baths & meditation" },
];

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const FLEXIBILITY_OPTIONS = [
  "Exact dates", "± 1 day", "± 2 days", "± 3 days", "± 7 days", "± 14 days"
];

interface SearchBarProps {
  activeTab?: HeaderTab;
  isFloating?: boolean;
  onClose?: () => void;
  destination?: string;
  onDestinationChange?: (dest: string) => void;
  checkIn?: Date | null;
  checkOut?: Date | null;
  onDatesChange?: (checkIn: Date | null, checkOut: Date | null) => void;
  adults?: number;
  childrenCount?: number;
  infants?: number;
  pets?: number;
  onGuestsChange?: (adults: number, children: number, infants: number, pets: number) => void;
  serviceType?: string;
  onServiceTypeChange?: (st: string) => void;
  onSearch?: () => void;
}

export function SearchBar({
  activeTab = "all",
  isFloating = false,
  onClose,
  destination: propDestination,
  onDestinationChange,
  checkIn: propCheckIn,
  checkOut: propCheckOut,
  onDatesChange,
  adults: propAdults,
  childrenCount: propChildren,
  infants: propInfants,
  pets: propPets,
  onGuestsChange,
  serviceType: propServiceType,
  onServiceTypeChange,
  onSearch,
}: SearchBarProps) {
  const [activeSection, setActiveSection] = useState<"where" | "when" | "who" | "serviceType" | null>(
    isFloating ? "where" : null
  );

  // Controlled search state directly synchronized with page single source of truth
  const destination = propDestination ?? "";
  const setDestination = (val: string) => {
    if (onDestinationChange) onDestinationChange(val);
  };

  const [dateMode, setDateMode] = useState<"dates" | "flexible">("dates");
  const [selectedFlexibility, setSelectedFlexibility] = useState<string>("Exact dates");

  const checkIn = propCheckIn ?? null;
  const checkOut = propCheckOut ?? null;
  const setDates = (ci: Date | null, co: Date | null) => {
    if (onDatesChange) onDatesChange(ci, co);
  };

  const [calMonth, setCalMonth] = useState<number>(new Date().getMonth());
  const [calYear, setCalYear] = useState<number>(new Date().getFullYear());

  const adults = propAdults ?? 0;
  const children = propChildren ?? 0;
  const infants = propInfants ?? 0;
  const pets = propPets ?? 0;

  const setGuests = (a: number, c: number, inf: number, p: number) => {
    if (onGuestsChange) onGuestsChange(a, c, inf, p);
  };

  const serviceType = propServiceType ?? "";
  const setServiceType = (st: string) => {
    if (onServiceTypeChange) onServiceTypeChange(st);
  };

  const containerRef = useRef<HTMLDivElement>(null);

  // Click outside to dismiss popover or close floating search
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        if (isFloating && onClose) {
          onClose();
        } else {
          setActiveSection(null);
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isFloating, onClose]);

  // Escape key handler
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        if (isFloating && onClose) {
          onClose();
        } else {
          setActiveSection(null);
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFloating, onClose]);

  // When floating overlay is open, scrolling the window dismisses it
  useEffect(() => {
    if (!isFloating || !onClose) return;
    const handleScroll = () => {
      onClose();
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isFloating, onClose]);

  const totalGuests = adults + children;
  const guestLabel = () => {
    if (totalGuests === 0 && infants === 0 && pets === 0) {
      return "Add guests";
    }
    const parts: string[] = [];
    if (totalGuests > 0) {
      parts.push(`${totalGuests} guest${totalGuests > 1 ? "s" : ""}`);
    }
    if (infants > 0) {
      parts.push(`${infants} infant${infants > 1 ? "s" : ""}`);
    }
    if (pets > 0) {
      parts.push(`${pets} pet${pets > 1 ? "s" : ""}`);
    }
    return parts.join(", ");
  };

  const datesLabel = () => {
    if (!checkIn) return "Add dates";
    const format = (d: Date) => `${MONTH_NAMES[d.getMonth()].slice(0, 3)} ${d.getDate()}`;
    if (!checkOut) return `${format(checkIn)} – ?`;
    return `${format(checkIn)} – ${format(checkOut)}`;
  };

  const handleDateClick = (year: number, month: number, day: number) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selected = new Date(year, month, day);
    selected.setHours(0, 0, 0, 0);
    if (selected.getTime() < today.getTime()) {
      return;
    }
    if (!checkIn || (checkIn && checkOut)) {
      setDates(selected, null);
    } else {
      if (selected.getTime() < checkIn.getTime()) {
        setDates(selected, null);
      } else {
        setDates(checkIn, selected);
      }
    }
  };

  const now = new Date();
  const currentMonthNum = now.getMonth();
  const currentYearNum = now.getFullYear();
  const canGoPrev =
    calYear > currentYearNum ||
    (calYear === currentYearNum && calMonth > currentMonthNum);

  const handlePrevMonth = () => {
    if (!canGoPrev) return;
    if (calMonth === 0) {
      setCalMonth(11);
      setCalYear(calYear - 1);
    } else {
      setCalMonth(calMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (calMonth === 11) {
      setCalMonth(0);
      setCalYear(calYear + 1);
    } else {
      setCalMonth(calMonth + 1);
    }
  };

  const nextMonthNum = calMonth === 11 ? 0 : calMonth + 1;
  const nextYearNum = calMonth === 11 ? calYear + 1 : calYear;

  const renderMonthGrid = (year: number, month: number) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return (
      <div className={styles.monthDaysGrid}>
        {Array.from({ length: firstDayIndex }).map((_, i) => (
          <div key={`empty-${year}-${month}-${i}`} className={`${styles.dayBtn} ${styles.dayEmpty}`} />
        ))}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const dayNum = i + 1;
          const currentDayDate = new Date(year, month, dayNum);
          currentDayDate.setHours(0, 0, 0, 0);
          const isPast = currentDayDate.getTime() < today.getTime();
          const isCheckIn = checkIn && currentDayDate.getTime() === checkIn.getTime();
          const isCheckOut = checkOut && currentDayDate.getTime() === checkOut.getTime();
          const inRange =
            checkIn &&
            checkOut &&
            currentDayDate.getTime() > checkIn.getTime() &&
            currentDayDate.getTime() < checkOut.getTime();

          return (
            <button
              type="button"
              key={`day-${year}-${month}-${dayNum}`}
              disabled={isPast}
              className={`${styles.dayBtn} ${
                isPast ? styles.dayDisabled : ""
              } ${isCheckIn || isCheckOut ? styles.daySelected : ""} ${
                inRange ? styles.dayInRange : ""
              }`}
              onClick={() => !isPast && handleDateClick(year, month, dayNum)}
            >
              {dayNum}
            </button>
          );
        })}
      </div>
    );
  };

  const isServices = activeTab === "services";
  const isExperiences = activeTab === "experiences";
  const wherePlaceholder = isExperiences ? "Search by city or landmark" : "Search destinations";

  const searchContent = (
    <div
      className={`${styles.searchBar} ${
        activeSection ? styles.searchBarFocused : ""
      }`}
      ref={containerRef}
    >
      {/* WHERE SEGMENT */}
      <button
        type="button"
        className={`${styles.segment} ${
          activeSection === "where" ? styles.segmentActive : ""
        }`}
        onClick={() =>
          setActiveSection(activeSection === "where" ? null : "where")
        }
      >
        <span className={styles.label}>Where</span>
        <span
          className={`${styles.value} ${
            destination ? styles.valueSelected : ""
          }`}
        >
          {destination || wherePlaceholder}
        </span>
      </button>

      <div className={styles.divider} />

      {/* WHEN SEGMENT */}
      <button
        type="button"
        className={`${styles.segment} ${
          activeSection === "when" ? styles.segmentActive : ""
        }`}
        onClick={() =>
          setActiveSection(activeSection === "when" ? null : "when")
        }
      >
        <span className={styles.label}>When</span>
        <span
          className={`${styles.value} ${
            checkIn ? styles.valueSelected : ""
          }`}
        >
          {datesLabel()}
        </span>
      </button>

      <div className={styles.divider} />

      {/* THIRD SEGMENT */}
      {isServices ? (
        <button
          type="button"
          className={`${styles.segment} ${
            activeSection === "serviceType" ? styles.segmentActive : ""
          }`}
          onClick={() =>
            setActiveSection(activeSection === "serviceType" ? null : "serviceType")
          }
        >
          <span className={styles.label}>Type of service</span>
          <span
            className={`${styles.value} ${
              serviceType ? styles.valueSelected : ""
            }`}
          >
            {serviceType || "Add service"}
          </span>
        </button>
      ) : (
        <button
          type="button"
          className={`${styles.segment} ${
            activeSection === "who" ? styles.segmentActive : ""
          }`}
          onClick={() =>
            setActiveSection(activeSection === "who" ? null : "who")
          }
        >
          <span className={styles.label}>Who</span>
          <span
            className={`${styles.value} ${
              totalGuests > 0 || infants > 0 || pets > 0
                ? styles.valueSelected
                : ""
            }`}
          >
            {guestLabel()}
          </span>
        </button>
      )}

      {/* SEARCH BUTTON */}
      <div className={styles.searchButtonWrapper}>
        <button
          type="button"
          className={styles.searchButton}
          onClick={() => {
            setActiveSection(null);
            if (isFloating && onClose) onClose();
            if (onSearch) onSearch();
          }}
          aria-label="Search"
        >
          <svg
            className={styles.searchIcon}
            viewBox="0 0 32 32"
            aria-hidden="true"
          >
            <path d="M13 24a11 11 0 1 0 0-22 11 11 0 0 0 0 22zm8-3 9 9" />
          </svg>
        </button>
      </div>

      {/* WHERE POPOVER */}
      {activeSection === "where" && (
        <div className={`${styles.popover} ${styles.wherePopover}`}>
          <div style={{ padding: "4px 0 12px 0" }}>
            <input
              type="text"
              placeholder="Search by city (e.g. Paris, Tokyo, Bali)..."
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setActiveSection("when");
                }
              }}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "8px",
                border: "1px solid #b0b0b0",
                fontSize: "0.95rem",
                outline: "none",
                fontFamily: "inherit",
                boxSizing: "border-box",
              }}
              autoFocus
            />
          </div>
          <h3 className={styles.popoverHeading}>Suggested destinations</h3>
          <div className={styles.destinationsList}>
            {SUGGESTED_DESTINATIONS.map((dest) => (
              <button
                type="button"
                key={dest.title}
                className={`${styles.destinationRow} ${
                  destination === dest.title ? styles.destinationRowActive : ""
                }`}
                onClick={() => {
                  setDestination(dest.title);
                  setActiveSection("when");
                }}
              >
                <div
                  className={styles.destTile}
                  style={{ backgroundColor: dest.bgColor }}
                >
                  {dest.icon}
                </div>
                <div className={styles.destTextGroup}>
                  <span className={styles.destTitle}>{dest.title}</span>
                  <span className={styles.destSubtitle}>{dest.subtitle}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* WHEN POPOVER */}
      {activeSection === "when" && (
        <div className={`${styles.popover} ${styles.whenPopover}`}>
          <div className={styles.pillSwitchWrapper}>
            <div className={styles.pillSwitch}>
              <button
                type="button"
                className={`${styles.pillOption} ${
                  dateMode === "dates" ? styles.pillOptionActive : ""
                }`}
                onClick={() => setDateMode("dates")}
              >
                Dates
              </button>
              <button
                type="button"
                className={`${styles.pillOption} ${
                  dateMode === "flexible" ? styles.pillOptionActive : ""
                }`}
                onClick={() => setDateMode("flexible")}
              >
                Flexible
              </button>
            </div>
          </div>

          <div className={styles.monthsContainer}>
            {/* Month 1 */}
            <div className={styles.monthBlock}>
              <div className={styles.monthHeader}>
                <button
                  type="button"
                  className={styles.calNavBtn}
                  onClick={handlePrevMonth}
                  aria-label="Previous month"
                >
                  ‹
                </button>
                <h4 className={styles.monthTitle}>
                  {MONTH_NAMES[calMonth]} {calYear}
                </h4>
                <div className={styles.calNavPlaceholder} />
              </div>

              <div className={styles.weekHeader}>
                <span>S</span>
                <span>M</span>
                <span>T</span>
                <span>W</span>
                <span>T</span>
                <span>F</span>
                <span>S</span>
              </div>

              {renderMonthGrid(calYear, calMonth)}
            </div>

            {/* Month 2 */}
            <div className={styles.monthBlock}>
              <div className={styles.monthHeader}>
                <div className={styles.calNavPlaceholder} />
                <h4 className={styles.monthTitle}>
                  {MONTH_NAMES[nextMonthNum]} {nextYearNum}
                </h4>
                <button
                  type="button"
                  className={styles.calNavBtn}
                  onClick={handleNextMonth}
                  aria-label="Next month"
                >
                  ›
                </button>
              </div>

              <div className={styles.weekHeader}>
                <span>S</span>
                <span>M</span>
                <span>T</span>
                <span>W</span>
                <span>T</span>
                <span>F</span>
                <span>S</span>
              </div>

              {renderMonthGrid(nextYearNum, nextMonthNum)}
            </div>
          </div>

          {/* Flexibility Pills */}
          <div className={styles.flexibilityRow}>
            {FLEXIBILITY_OPTIONS.map((opt) => (
              <button
                type="button"
                key={opt}
                className={`${styles.flexPill} ${
                  selectedFlexibility === opt ? styles.flexPillActive : ""
                }`}
                onClick={() => setSelectedFlexibility(opt)}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* WHO POPOVER */}
      {activeSection === "who" && (
        <div className={`${styles.popover} ${styles.whoPopover}`}>
          <div className={styles.guestRow}>
            <div className={styles.guestInfo}>
              <span className={styles.guestTitle}>Adults</span>
              <span className={styles.guestSubtitle}>Ages 13 or above</span>
            </div>
            <div className={styles.stepper}>
              <button
                type="button"
                className={styles.stepBtn}
                disabled={adults <= 0}
                onClick={() => setGuests(Math.max(0, adults - 1), children, infants, pets)}
                aria-label="Decrease adults"
              >
                −
              </button>
              <span className={styles.stepCount}>{adults}</span>
              <button
                type="button"
                className={styles.stepBtn}
                onClick={() => setGuests(adults + 1, children, infants, pets)}
                aria-label="Increase adults"
              >
                +
              </button>
            </div>
          </div>

          <div className={styles.guestRow}>
            <div className={styles.guestInfo}>
              <span className={styles.guestTitle}>Children</span>
              <span className={styles.guestSubtitle}>Ages 2–12</span>
            </div>
            <div className={styles.stepper}>
              <button
                type="button"
                className={styles.stepBtn}
                disabled={children <= 0}
                onClick={() => setGuests(adults, Math.max(0, children - 1), infants, pets)}
                aria-label="Decrease children"
              >
                −
              </button>
              <span className={styles.stepCount}>{children}</span>
              <button
                type="button"
                className={styles.stepBtn}
                onClick={() => setGuests(adults, children + 1, infants, pets)}
                aria-label="Increase children"
              >
                +
              </button>
            </div>
          </div>

          <div className={styles.guestRow}>
            <div className={styles.guestInfo}>
              <span className={styles.guestTitle}>Infants</span>
              <span className={styles.guestSubtitle}>Under 2</span>
            </div>
            <div className={styles.stepper}>
              <button
                type="button"
                className={styles.stepBtn}
                disabled={infants <= 0}
                onClick={() => setGuests(adults, children, Math.max(0, infants - 1), pets)}
                aria-label="Decrease infants"
              >
                −
              </button>
              <span className={styles.stepCount}>{infants}</span>
              <button
                type="button"
                className={styles.stepBtn}
                onClick={() => setGuests(adults, children, infants + 1, pets)}
                aria-label="Increase infants"
              >
                +
              </button>
            </div>
          </div>

          <div className={styles.guestRow}>
            <div className={styles.guestInfo}>
              <span className={styles.guestTitle}>Pets</span>
              <span className={styles.guestSubtitle}>Service animals welcome</span>
            </div>
            <div className={styles.stepper}>
              <button
                type="button"
                className={styles.stepBtn}
                disabled={pets <= 0}
                onClick={() => setGuests(adults, children, infants, Math.max(0, pets - 1))}
                aria-label="Decrease pets"
              >
                −
              </button>
              <span className={styles.stepCount}>{pets}</span>
              <button
                type="button"
                className={styles.stepBtn}
                onClick={() => setGuests(adults, children, infants, pets + 1)}
                aria-label="Increase pets"
              >
                +
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SERVICE TYPE POPOVER */}
      {activeSection === "serviceType" && (
        <div className={`${styles.popover} ${styles.serviceTypePopover}`}>
          <h3 className={styles.popoverHeading}>Popular services</h3>
          <div className={styles.serviceTypeList}>
            {SERVICE_TYPES.map((st) => (
              <button
                type="button"
                key={st.label}
                className={`${styles.serviceTypeItem} ${
                  serviceType === st.label ? styles.serviceTypeItemActive : ""
                }`}
                onClick={() => {
                  setServiceType(st.label);
                  setActiveSection(null);
                  if (isFloating && onClose) onClose();
                }}
              >
                <span style={{ fontSize: "1.25rem" }}>{st.icon}</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{st.label}</div>
                  <div style={{ fontSize: "0.75rem", color: "#717171" }}>{st.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  if (isFloating) {
    return (
      <div className={styles.floatingBackdrop} onClick={onClose}>
        <div className={styles.floatingContainer} onClick={(e) => e.stopPropagation()}>
          {searchContent}
        </div>
      </div>
    );
  }

  return <div className={styles.searchWrapper}>{searchContent}</div>;
}
