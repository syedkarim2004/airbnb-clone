"use client";

import React, { useState, useRef } from "react";
import styles from "./CategoryNav.module.css";

interface Category {
  id: string;
  label: string;
  icon: string;
}

const CATEGORIES: Category[] = [
  { id: "all", label: "All stays", icon: "🏠" },
  { id: "pools", label: "Amazing pools", icon: "🏊" },
  { id: "beach", label: "Beach", icon: "🏖️" },
  { id: "countryside", label: "Countryside", icon: "🌾" },
  { id: "mountains", label: "Mountains", icon: "⛰️" },
  { id: "cabins", label: "Cabins", icon: "🪵" },
  { id: "views", label: "Amazing views", icon: "🌅" },
  { id: "design", label: "Design", icon: "✨" },
  { id: "farms", label: "Farms", icon: "🚜" },
  { id: "tropical", label: "Tropical", icon: "🌴" },
  { id: "lakefront", label: "Lakefront", icon: "⛵" },
  { id: "cities", label: "Iconic cities", icon: "🏙️" },
  { id: "mansions", label: "Mansions", icon: "🏰" },
];

export function CategoryNav() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -300 : 300;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className={styles.categoryWrapper}>
      <button
        type="button"
        className={`${styles.arrowButton} ${styles.leftArrow}`}
        onClick={() => handleScroll("left")}
        aria-label="Scroll categories left"
      >
        ‹
      </button>

      <div className={styles.scrollContainer} ref={scrollRef}>
        {CATEGORIES.map((cat) => (
          <button
            type="button"
            key={cat.id}
            className={`${styles.categoryItem} ${
              selectedCategory === cat.id ? styles.categoryItemActive : ""
            }`}
            onClick={() => setSelectedCategory(cat.id)}
          >
            <span style={{ fontSize: "1.25rem" }}>{cat.icon}</span>
            <span className={styles.categoryLabel}>{cat.label}</span>
          </button>
        ))}
      </div>

      <button
        type="button"
        className={`${styles.arrowButton} ${styles.rightArrow}`}
        onClick={() => handleScroll("right")}
        aria-label="Scroll categories right"
      >
        ›
      </button>
    </div>
  );
}
