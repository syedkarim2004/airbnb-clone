"use client";

import React, { useState } from "react";
import { MOCK_SERVICES, ServiceItem } from "@/data/mockServices";
import styles from "./ServicesView.module.css";

function ServiceCardItem({ item }: { item: ServiceItem }) {
  const [favorite, setFavorite] = useState(false);

  return (
    <article className={styles.serviceCard} tabIndex={0}>
      <div className={styles.imageWrapper}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.image}
          alt={item.title}
          className={styles.image}
          loading="lazy"
        />
        <button
          type="button"
          className={styles.heartBtn}
          onClick={(e) => {
            e.stopPropagation();
            setFavorite(!favorite);
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
        <h3 className={styles.title} title={item.title}>
          {item.title}
        </h3>
        <p className={styles.provider}>By {item.provider}</p>
        <div className={styles.priceRating}>
          <span className={styles.priceBold}>{item.priceDisplay}</span> ·{" "}
          <span className={styles.ratingText}>★ {item.rating.toFixed(1)}</span>
        </div>
      </div>
    </article>
  );
}

export function ServicesView() {
  const photoServices = MOCK_SERVICES.filter((s) => s.category === "Photography");
  const wellnessServices = MOCK_SERVICES.filter(
    (s) => s.category === "Wellness" || s.category === "Training"
  );
  const chefServices = MOCK_SERVICES.filter((s) => s.category === "Chef");

  return (
    <div className={styles.container}>
      {/* Section 1: Photography */}
      <section className={styles.section} aria-label="Photography services">
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            Photography <span className={styles.arrowRight}>→</span>
          </h2>
        </div>
        <div className={styles.cardsGrid}>
          {photoServices.map((srv) => (
            <ServiceCardItem key={srv.id} item={srv} />
          ))}
        </div>
      </section>

      {/* Section 2: Training & Wellness */}
      <section className={styles.section} aria-label="Training and wellness">
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            Training & Wellness <span className={styles.arrowRight}>→</span>
          </h2>
        </div>
        <div className={styles.cardsGrid}>
          {wellnessServices.map((srv) => (
            <ServiceCardItem key={srv.id} item={srv} />
          ))}
        </div>
      </section>

      {/* Section 3: Private Chef */}
      <section className={styles.section} aria-label="Private chef">
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            Private Chef <span className={styles.arrowRight}>→</span>
          </h2>
        </div>
        <div className={styles.cardsGrid}>
          {chefServices.map((srv) => (
            <ServiceCardItem key={srv.id} item={srv} />
          ))}
        </div>
      </section>
    </div>
  );
}
