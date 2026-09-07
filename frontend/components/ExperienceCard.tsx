"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Experience } from "@/data/experiences";
import styles from "./ExperienceCard.module.css";

interface ExperienceCardProps {
  experience: Experience;
}

export function ExperienceCard({ experience }: ExperienceCardProps) {
  const router = useRouter();
  const [favorite, setFavorite] = useState<boolean>(false);

  const handleCardClick = (e: React.MouseEvent) => {
    if (e.metaKey || e.ctrlKey) {
      window.open(`/experiences/${experience.id}`, "_blank");
      return;
    }
    router.push(`/experiences/${experience.id}`);
  };

  const handleAuxClick = (e: React.MouseEvent) => {
    if (e.button === 1) {
      window.open(`/experiences/${experience.id}`, "_blank");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      if (e.target !== e.currentTarget) return;
      e.preventDefault();
      router.push(`/experiences/${experience.id}`);
    }
  };

  const displayImage = experience.images && experience.images.length > 0
    ? experience.images[0]
    : "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=800&q=80";

  return (
    <article
      className={styles.card}
      tabIndex={0}
      aria-label={`${experience.title} in ${experience.location}`}
      onClick={handleCardClick}
      onAuxClick={handleAuxClick}
      onKeyDown={handleKeyDown}
    >
      <div className={styles.imageWrapper}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={displayImage}
          alt={experience.title}
          className={styles.image}
          loading="lazy"
        />

        <button
          type="button"
          className={styles.heartBtn}
          onClick={(e) => {
            e.stopPropagation();
            setFavorite((prev) => !prev);
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
        <p className={styles.categoryLine}>
          {experience.category} · {experience.duration}
        </p>

        <h3 className={styles.title} title={experience.title}>
          {experience.title}
        </h3>

        <div className={styles.priceRating}>
          <span className={styles.priceBold}>
            From {experience.currency}{experience.pricePerGuest.toLocaleString()}{" "}
            <span style={{ fontWeight: 400, color: "#717171" }}>
              / {experience.priceUnit || "guest"}
            </span>
            {" · "}
            <span style={{ fontWeight: 500, color: "#222222" }}>
              ★ {experience.rating.toFixed(1)}
            </span>
          </span>
        </div>
      </div>
    </article>
  );
}
