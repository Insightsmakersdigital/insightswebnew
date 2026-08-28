"use client";

import { useEffect, useRef } from "react";
import type { ServiceStep } from "../data/site";

// "How it works" horizontal reading line -- see the .approach-* rules in
// global.css for the full rationale. Everything hangs off one continuous
// scroll-progress value, computed from how far .approach-track has
// scrolled past while .approach-stage stays pinned inside it. Ported
// verbatim from services/[slug].astro's inline script.
export default function ApproachTrack({ steps }: { steps: ServiceStep[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const approachTrack = trackRef.current;
    const approachStage = stageRef.current;
    const approachFill = fillRef.current;
    const approachCounter = counterRef.current;
    if (!approachTrack || !approachStage || !approachFill) return;

    const approachMarkers = Array.from(approachStage.querySelectorAll<HTMLElement>("[data-approach-marker]"));
    const approachColumns = Array.from(approachStage.querySelectorAll<HTMLElement>("[data-approach-column]"));

    const approachCanEnhance =
      approachColumns.length > 0 &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
      window.matchMedia("(min-width: 900px)").matches;

    if (!approachCanEnhance) return;

    approachStage.classList.add("is-enhanced");
    const total = approachColumns.length;
    const ACTIVE_INDEX_BIAS = 0.08;

    let ticking = false;
    function updateApproach() {
      ticking = false;
      const rect = approachTrack!.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      const progress = scrollable > 0 ? Math.min(1, Math.max(0, -rect.top / scrollable)) : 0;

      approachFill!.style.transform = `scaleX(${progress})`;

      approachMarkers.forEach((marker, i) => {
        marker.classList.toggle("is-filled", progress >= i / total);
      });

      const activeIndex = Math.min(total - 1, Math.max(0, Math.floor(progress * total + ACTIVE_INDEX_BIAS)));
      approachColumns.forEach((col, i) => col.classList.toggle("is-active", i === activeIndex));
      if (approachCounter) approachCounter.textContent = String(activeIndex + 1).padStart(2, "0");
    }

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateApproach);
      }
    };

    updateApproach();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateApproach, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateApproach);
    };
  }, []);

  return (
    <div className="approach-track" data-approach-track ref={trackRef}>
      <div className="approach-stage" data-approach-stage ref={stageRef}>
        <div className="approach-stage-head">
          <div className="approach-eyebrow-row">
            <span className="approach-index">03</span>
            <p className="approach-eyebrow">How it works</p>
          </div>
          <span className="approach-counter">
            <strong data-approach-counter-current ref={counterRef}>
              01
            </strong>{" "}
            / {String(steps.length).padStart(2, "0")}
          </span>
        </div>
        <h2 className="approach-heading">Our approach</h2>

        <div className="approach-rail" aria-hidden="true">
          <div className="approach-rail-track"></div>
          <div className="approach-rail-fill" data-approach-fill ref={fillRef}></div>
          <div className="approach-rail-markers">
            {steps.map((_, i) => (
              <span className="approach-rail-marker" data-approach-marker key={i}></span>
            ))}
          </div>
        </div>

        <div className="approach-columns">
          {steps.map((step, i) => (
            <div className="approach-column" data-approach-column key={step.title}>
              <span className="approach-column-num">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="approach-column-title">{step.title}</h3>
              <p className="approach-column-desc">{step.body}</p>
              <div className="approach-column-detail">
                <p className="approach-detail-label">You get</p>
                <p className="approach-detail-value">{step.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
