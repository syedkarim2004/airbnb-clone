"use client";

import React, { useRef } from "react";
import { EXPERIENCES_DATA } from "@/data/experiences";
import { ExperienceCard } from "./ExperienceCard";
import styles from "./ExperiencesView.module.css";

function ExperienceCarouselSection({
  title,
  items,
}: {
  title: string;
  items: typeof EXPERIENCES_DATA;
}) {
  const rowRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: "left" | "right") => {
    if (rowRef.current) {
      const scrollAmount = direction === "left" ? -450 : 450;
      rowRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  if (items.length === 0) return null;

  return (
    <section className={styles.section} aria-label={title}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>
          {title} <span className={styles.arrowRight}>›</span>
        </h2>
        <div className={styles.carouselNav}>
          <button
            type="button"
            className={styles.navBtn}
            onClick={() => handleScroll("left")}
            aria-label={`Previous ${title}`}
          >
            ‹
          </button>
          <button
            type="button"
            className={styles.navBtn}
            onClick={() => handleScroll("right")}
            aria-label={`Next ${title}`}
          >
            ›
          </button>
        </div>
      </div>

      <div className={styles.horizontalRow} ref={rowRef}>
        {items.map((exp) => (
          <ExperienceCard key={exp.id} experience={exp} />
        ))}
      </div>
    </section>
  );
}

export function ExperiencesView() {
  const photographyExperiences = EXPERIENCES_DATA.filter(
    (e) => e.category.toLowerCase().includes("photo")
  );

  const trainingExperiences = EXPERIENCES_DATA.filter(
    (e) => e.category.toLowerCase().includes("training")
  );

  const todayExperiences = EXPERIENCES_DATA.filter(
    (e) => e.city === "New Delhi"
  ).slice(0, 8);

  const popularExperiences = EXPERIENCES_DATA.filter(
    (e) => e.rating >= 4.98
  ).slice(0, 10);

  const foodExperiences = EXPERIENCES_DATA.filter(
    (e) => e.category.toLowerCase().includes("cook") || e.category.toLowerCase().includes("food")
  );

  const cultureExperiences = EXPERIENCES_DATA.filter(
    (e) => e.category.toLowerCase().includes("culture") || e.category.toLowerCase().includes("history")
  );

  const adventureExperiences = EXPERIENCES_DATA.filter(
    (e) => e.category.toLowerCase().includes("adventure")
  );

  const delhiExperiences = EXPERIENCES_DATA.filter(
    (e) => e.city === "New Delhi"
  );

  const worldwideExperiences = EXPERIENCES_DATA.filter(
    (e) => e.country !== "India"
  );

  return (
    <div className={styles.container}>
      {/* 1. Photography (Matches Screenshot 1) */}
      <ExperienceCarouselSection
        title="Photography"
        items={photographyExperiences}
      />

      {/* 2. Training (Matches Screenshot 1) */}
      <ExperienceCarouselSection
        title="Training"
        items={trainingExperiences}
      />

      {/* 3. Happening Today in New Delhi */}
      <ExperienceCarouselSection
        title="Happening today in New Delhi"
        items={todayExperiences}
      />

      {/* 4. Popular experiences */}
      <ExperienceCarouselSection
        title="Popular experiences"
        items={popularExperiences}
      />

      {/* 5. Food & drink */}
      <ExperienceCarouselSection
        title="Food & drink"
        items={foodExperiences}
      />

      {/* 6. Culture & history */}
      <ExperienceCarouselSection
        title="Culture & history"
        items={cultureExperiences}
      />

      {/* 7. Adventure & outdoors */}
      <ExperienceCarouselSection
        title="Adventure & outdoors"
        items={adventureExperiences}
      />

      {/* 8. Things to do in New Delhi */}
      <ExperienceCarouselSection
        title="Things to do in New Delhi"
        items={delhiExperiences}
      />

      {/* 9. Explore experiences worldwide */}
      <ExperienceCarouselSection
        title="Explore experiences worldwide"
        items={worldwideExperiences}
      />
    </div>
  );
}
