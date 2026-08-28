"use client";

import { useEffect, useRef } from "react";
import styles from "../app/not-found.module.css";

export default function NotFoundFlipCards() {
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const row = rowRef.current;
    const cards = row ? Array.from(row.querySelectorAll<HTMLElement>(`.${styles.flipCard}`)) : [];
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const STAGGER_MS = 90;

    let flipped = false;
    function apply() {
      cards.forEach((card, i) => {
        const order = flipped ? i : cards.length - 1 - i;
        card.style.setProperty("--flip-delay", reduced ? "0ms" : `${order * STAGGER_MS}ms`);
        card.style.setProperty("--flip-duration", reduced ? "0ms" : "600ms");
        card.classList.toggle(styles.isFlipped, flipped);
      });
    }

    if (!row || !cards.length) return;

    if (fine) {
      const onEnter = () => {
        flipped = true;
        apply();
      };
      const onLeave = () => {
        flipped = false;
        apply();
      };
      row.addEventListener("pointerenter", onEnter);
      row.addEventListener("pointerleave", onLeave);
      return () => {
        row.removeEventListener("pointerenter", onEnter);
        row.removeEventListener("pointerleave", onLeave);
      };
    } else {
      const onClick = () => {
        flipped = !flipped;
        apply();
      };
      row.addEventListener("click", onClick);
      return () => row.removeEventListener("click", onClick);
    }
  }, []);

  return (
    <div className={styles.flipRow} ref={rowRef} aria-hidden="true">
      <div className={styles.flipCard}>
        <div className={styles.flipCardInner}>
          <div className={`${styles.flipFace} ${styles.flipFaceFront}`}>
            <span>4</span>
          </div>
          <div className={`${styles.flipFace} ${styles.flipFaceBack}`}>
            <span>4</span>
          </div>
        </div>
      </div>
      <div className={`${styles.flipCard} ${styles.flipCardAccent}`}>
        <div className={styles.flipCardInner}>
          <div className={`${styles.flipFace} ${styles.flipFaceFront}`}>
            <span>0</span>
          </div>
          <div className={`${styles.flipFace} ${styles.flipFaceBack}`}>
            <span>0</span>
          </div>
        </div>
      </div>
      <div className={styles.flipCard}>
        <div className={styles.flipCardInner}>
          <div className={`${styles.flipFace} ${styles.flipFaceFront}`}>
            <span>4</span>
          </div>
          <div className={`${styles.flipFace} ${styles.flipFaceBack}`}>
            <span>4</span>
          </div>
        </div>
      </div>
    </div>
  );
}
