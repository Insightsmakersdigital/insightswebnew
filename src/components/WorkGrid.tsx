"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import WorkCard from "./WorkCard";
import { SERVICES, seededImage, type WorkItem } from "../data/site";

interface Props {
  items: WorkItem[];
}

export default function WorkGrid({ items }: Props) {
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  useEffect(() => {
    if (!openSlug) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenSlug(null);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [openSlug]);

  const active = items.find((w) => w.slug === openSlug) ?? null;

  return (
    <>
      <div className="work-grid">
        {items.map((item) => (
          <WorkCard
            key={item.slug}
            title={item.project}
            client={item.name}
            services={item.services.map((slug) => SERVICES.find((s) => s.slug === slug)?.title).filter(Boolean).join(" + ")}
            result={item.result}
            tint={item.tint}
            onClick={() => setOpenSlug(item.slug)}
          />
        ))}
      </div>

      {active && (
        <div className="case-modal-backdrop" onClick={() => setOpenSlug(null)}>
          <div
            className="case-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="case-modal-heading"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="case-modal-close" aria-label="Close case study" onClick={() => setOpenSlug(null)}>
              &times;
            </button>

            <div className="case-modal-media">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={seededImage(active.name)} alt={`${active.project} — ${active.name}`} />
            </div>

            <div className="case-modal-body">
              <p className="eyebrow">{active.name}</p>
              <h2 id="case-modal-heading" className="case-modal-heading">
                {active.project}
              </h2>
              <p className="case-modal-services">
                {active.services.map((slug) => SERVICES.find((s) => s.slug === slug)?.title).filter(Boolean).join(" + ")}
              </p>

              <div className="case-modal-section">
                <h3>The challenge</h3>
                <p>{active.caseStudy.challenge}</p>
              </div>
              <div className="case-modal-section">
                <h3>What we did</h3>
                <p>{active.caseStudy.approach}</p>
              </div>
              <div className="case-modal-section">
                <h3>The outcome</h3>
                <p>{active.caseStudy.outcome}</p>
              </div>

              <Link href="/contact" className="text-link case-modal-cta">
                Start a project like this <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
