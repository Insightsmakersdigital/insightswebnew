"use client";

import { useEffect, useRef } from "react";
import type { IncludedSegment } from "../data/site";

interface IncludedCard {
  number: string;
  title: string;
  description: string;
}

// "What's included" running sentence -- see the .included-* rules in
// global.css for the visual spec. One card element, reused and
// repositioned/repopulated per term rather than six stacked. Positioning
// is clamped to the stage (never the viewport) and recomputed on every
// open, never cached, since the sentence reflows on resize. Ported
// verbatim from services/[slug].astro's inline define:vars script.
export default function IncludedSentence({ slug, sentence }: { slug: string; sentence: IncludedSegment[] }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  let termIndex = 0;
  const segments = sentence.map((seg) => (seg.kind === "term" ? { ...seg, dataIndex: termIndex++ } : seg));
  const cards: IncludedCard[] = sentence
    .filter((seg): seg is Extract<IncludedSegment, { kind: "term" }> => seg.kind === "term")
    .map((seg, i) => ({ number: String(i + 1).padStart(2, "0"), title: seg.title, description: seg.description }));

  useEffect(() => {
    const includedStage = stageRef.current;
    const includedCard = cardRef.current;
    const includedTerms = includedStage ? Array.from(includedStage.querySelectorAll<HTMLElement>(".term")) : [];

    if (!includedStage || !includedCard || !includedTerms.length) return;

    const cardNum = includedCard.querySelector<HTMLElement>("[data-card-num]");
    const cardTitle = includedCard.querySelector<HTMLElement>("[data-card-title]");
    const cardDesc = includedCard.querySelector<HTMLElement>("[data-card-desc]");
    const hoverCapable = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    let openIndex: number | null = null;

    function positionCard(term: HTMLElement) {
      const s = includedStage!.getBoundingClientRect();
      const t = term.getBoundingClientRect();
      const W = 280;
      const GAP = 16;
      let x = t.left - s.left;
      x = Math.min(Math.max(x, 0), s.width - W);
      includedCard!.style.left = x + "px";
      includedCard!.style.top = t.bottom - s.top + GAP + "px";
    }

    function openTerm(term: HTMLElement) {
      const index = Number(term.dataset.i);
      const data = cards[index];
      if (!data) return;

      if (cardNum) cardNum.textContent = data.number;
      if (cardTitle) cardTitle.textContent = data.title;
      if (cardDesc) cardDesc.textContent = data.description;

      includedTerms.forEach((t) => t.setAttribute("aria-expanded", String(t === term)));
      includedStage!.dataset.open = "true";
      includedCard!.classList.add("is-visible");
      positionCard(term);
      openIndex = index;
    }

    function closeIncluded() {
      includedTerms.forEach((t) => t.setAttribute("aria-expanded", "false"));
      includedStage!.dataset.open = "false";
      includedCard!.classList.remove("is-visible");
      openIndex = null;
    }

    const cleanups: Array<() => void> = [];

    includedTerms.forEach((term) => {
      if (hoverCapable) {
        const onEnter = () => openTerm(term);
        term.addEventListener("pointerenter", onEnter);
        cleanups.push(() => term.removeEventListener("pointerenter", onEnter));
      }
      const onFocus = () => openTerm(term);
      term.addEventListener("focus", onFocus);
      cleanups.push(() => term.removeEventListener("focus", onFocus));

      const onClick = (e: Event) => {
        e.preventDefault();
        if (openIndex === Number(term.dataset.i)) {
          closeIncluded();
        } else {
          openTerm(term);
        }
      };
      term.addEventListener("click", onClick);
      cleanups.push(() => term.removeEventListener("click", onClick));
    });

    const onStageLeave = () => {
      if (hoverCapable) closeIncluded();
    };
    includedStage.addEventListener("pointerleave", onStageLeave);
    cleanups.push(() => includedStage.removeEventListener("pointerleave", onStageLeave));

    const onFocusOut = (e: FocusEvent) => {
      const related = e.relatedTarget as Node | null;
      if (!related || !includedStage.contains(related)) closeIncluded();
    };
    includedStage.addEventListener("focusout", onFocusOut);
    cleanups.push(() => includedStage.removeEventListener("focusout", onFocusOut));

    const onKeydown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeIncluded();
    };
    includedStage.addEventListener("keydown", onKeydown);
    cleanups.push(() => includedStage.removeEventListener("keydown", onKeydown));

    const onResize = () => {
      if (openIndex !== null && hoverCapable) positionCard(includedTerms[openIndex]);
    };
    window.addEventListener("resize", onResize, { passive: true });
    cleanups.push(() => window.removeEventListener("resize", onResize));

    return () => cleanups.forEach((fn) => fn());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  return (
    <div className="included-stage" data-included-stage data-open="false" ref={stageRef}>
      <p className="included-sentence">
        {segments.map((seg, i) =>
          seg.kind === "term" ? (
            <button
              className="term"
              type="button"
              data-i={seg.dataIndex}
              aria-expanded="false"
              aria-controls={`included-card-${slug}`}
              key={i}
            >
              {seg.term}
            </button>
          ) : (
            <span key={i}>{seg.text}</span>
          )
        )}
      </p>
      <div className="included-card" id={`included-card-${slug}`} data-included-card aria-live="polite" ref={cardRef}>
        <span className="included-card-num" data-card-num></span>
        <h3 className="included-card-title" data-card-title></h3>
        <p className="included-card-desc" data-card-desc></p>
      </div>
    </div>
  );
}
