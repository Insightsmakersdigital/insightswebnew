"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

interface Stat {
  value: string;
  label: string;
}

interface Props {
  brand: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  stats: Stat[];
}

const RING_RADIUS = 7;
const RING_CIRCUMFERENCE = (2 * Math.PI * RING_RADIUS).toFixed(2);

export default function Hero({ brand, primaryCta, secondaryCta, stats }: Props) {
  const carouselRef = useRef<HTMLDivElement>(null);

  // Stat carousel: one stat visible at a time, auto-advancing every 4000ms,
  // pausable on hover. Slide 0 / dot 0 are already marked is-active in the
  // server-rendered markup below so there's a correct, visible baseline
  // even if this effect never runs -- init here just starts the timer.
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const slides = Array.from(carousel.querySelectorAll<HTMLElement>("[data-stat-slide]"));
    const dots = Array.from(carousel.querySelectorAll<HTMLElement>("[data-stat-dot]"));
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const DURATION = 4000;

    let current = 0;
    let timer: number | undefined;
    let hovered = false;

    function show(index: number) {
      const outgoing = slides[current];
      const incoming = slides[index];
      if (outgoing && outgoing !== incoming) {
        outgoing.classList.remove("is-active");
        outgoing.classList.add("is-leaving");
        window.setTimeout(() => outgoing.classList.remove("is-leaving"), 350);
      }
      incoming?.classList.add("is-active");

      dots.forEach((dot, i) => {
        if (i !== index) dot.classList.remove("is-active");
      });
      const activeDot = dots[index];
      if (activeDot) {
        activeDot.classList.remove("is-active");
        void activeDot.offsetWidth;
        activeDot.classList.add("is-active");
      }

      current = index;
    }

    function resetTimer() {
      window.clearInterval(timer);
      if (reduceMotion || hovered) return;
      timer = window.setInterval(() => show((current + 1) % slides.length), DURATION);
    }

    const dotHandlers = dots.map((dot, i) => {
      const handler = () => {
        show(i);
        resetTimer();
      };
      dot.addEventListener("click", handler);
      return handler;
    });

    const handleEnter = () => {
      hovered = true;
      carousel.classList.add("is-paused");
      window.clearInterval(timer);
    };
    const handleLeave = () => {
      hovered = false;
      carousel.classList.remove("is-paused");
      resetTimer();
    };
    carousel.addEventListener("mouseenter", handleEnter);
    carousel.addEventListener("mouseleave", handleLeave);

    resetTimer();

    return () => {
      window.clearInterval(timer);
      dots.forEach((dot, i) => dot.removeEventListener("click", dotHandlers[i]));
      carousel.removeEventListener("mouseenter", handleEnter);
      carousel.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  return (
    <section className="hero panel-light" id="top">
      <div className="wrap hero-grid">
        <div className="hero-main">
          <h1 className="hero-brand" id="heroBrand">
            <span className="reveal-line">
              <span>{brand}</span>
            </span>
          </h1>
          <div className="hero-actions reveal">
            <Link href={primaryCta.href} className="btn btn-primary btn-lg magnetic">
              <span>{primaryCta.label}</span>
            </Link>
            <Link href={secondaryCta.href} className="btn btn-outline btn-lg">
              <span>{secondaryCta.label}</span>
            </Link>
          </div>
        </div>

        <div className="hero-aside reveal">
          <div className="hero-stat-carousel" data-stat-carousel ref={carouselRef}>
            <div className="hero-stat-indicators" data-stat-indicators>
              {stats.map((_, i) => (
                <button
                  type="button"
                  className={`hero-stat-dot${i === 0 ? " is-active" : ""}`}
                  data-stat-dot
                  aria-label={`Show stat ${i + 1} of ${stats.length}`}
                  key={i}
                >
                  <span className="hero-stat-dot-fill" aria-hidden="true"></span>
                  <svg className="hero-stat-ring" viewBox="0 0 20 20" aria-hidden="true">
                    <circle className="hero-stat-ring-track" cx="10" cy="10" r={RING_RADIUS} />
                    <circle
                      className="hero-stat-ring-progress"
                      cx="10"
                      cy="10"
                      r={RING_RADIUS}
                      strokeDasharray={RING_CIRCUMFERENCE}
                      strokeDashoffset={RING_CIRCUMFERENCE}
                    />
                  </svg>
                </button>
              ))}
            </div>
            <div className="hero-stat-display">
              {stats.map((stat, i) => (
                <div className={`hero-stat-slide${i === 0 ? " is-active" : ""}`} data-stat-slide key={i}>
                  <span className="hero-stat-value">{stat.value}</span>
                  <span className="hero-stat-label">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
