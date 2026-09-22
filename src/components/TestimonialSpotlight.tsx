"use client";

import { useState, useEffect, useCallback } from "react";

interface TestimonialData {
  name: string;
  company: string;
  rating: number;
  quote: string;
}

const AUTOPLAY_MS = 2500;

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function StarIcon({ filled, size }: { filled: boolean; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth={filled ? 0 : 1.5}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 2.5l2.9 6.6 7.1.7-5.4 4.8 1.6 7-6.2-3.7-6.2 3.7 1.6-7-5.4-4.8 7.1-.7z"
      />
    </svg>
  );
}

function StarRow({ rating, size = 14 }: { rating: number; size?: number }) {
  const full = Math.round(rating);
  return (
    <span className="spotlight-stars" role="img" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < full ? "on" : "off"}>
          <StarIcon filled={i < full} size={size} />
        </span>
      ))}
    </span>
  );
}

export function TestimonialSpotlight({ items }: { items: TestimonialData[] }) {
  const [index, setIndex] = useState(0);
  // state, not a ref -- a ref mutation here wouldn't re-render, so the
  // very first autoplayActive computation below would run with the
  // pre-check default (false) and schedule an interval before the media
  // query result ever lands, defeating "never starts if reduce motion".
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const next = useCallback(() => setIndex((i) => (i + 1) % items.length), [items.length]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + items.length) % items.length), [items.length]);

  useEffect(() => {
    if (reducedMotion) return;
    const id = window.setInterval(next, AUTOPLAY_MS);
    return () => window.clearInterval(id);
    // index isn't a dependency on purpose: manual nav just restarts this
    // effect's count instead of permanently stopping autoplay. No hover/
    // focus pause -- it always keeps cycling regardless of interaction.
  }, [reducedMotion, next, index]);

  const t = items[index];

  return (
    <div className="spotlight">
      <blockquote aria-live="polite">&ldquo;{t.quote}&rdquo;</blockquote>
      <StarRow rating={t.rating} size={17} />
      <div className="spotlight-who">
        <span className="spotlight-avatar" aria-hidden="true">
          {initials(t.name)}
        </span>
        <p className="spotlight-name">{t.name}</p>
        <p className="spotlight-company">{t.company}</p>
      </div>
      <div className="spotlight-nav">
        <button type="button" className="spotlight-nav-btn ghost" onClick={prev} aria-label="Previous testimonial">
          ←
        </button>
        <span className="spotlight-counter">
          {String(index + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
        </span>
        <button type="button" className="spotlight-nav-btn" onClick={next} aria-label="Next testimonial">
          →
        </button>
      </div>
    </div>
  );
}
