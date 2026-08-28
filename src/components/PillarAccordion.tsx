"use client";

import Link from "next/link";
import { useState } from "react";
import type { PILLARS, Service } from "../data/site";

interface PillarEntry {
  pillar: (typeof PILLARS)[number];
  headline: string;
  list: Service[];
}

// Single-open accordion -- same grid-template-rows 0fr/1fr technique the
// original page-level script drove via a toggled `.is-open` class; here
// it's plain React state instead of a DOM class toggle.
export default function PillarAccordion({ entries }: { entries: PillarEntry[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="pillar-accordion">
      {entries.map(({ pillar, headline, list }, i) => {
        const isOpen = openIndex === i;
        return (
          <div className={["pillar-row reveal", isOpen && "is-open"].filter(Boolean).join(" ")} key={pillar}>
            <button
              className="pillar-summary"
              aria-expanded={isOpen}
              onClick={() => setOpenIndex(isOpen ? null : i)}
            >
              <span className="pillar-number">{String(i + 1).padStart(2, "0")}</span>
              <span className="pillar-title">
                <span className="pillar-title-collapsed">{pillar}</span>
                <span className="pillar-title-expanded">{headline}</span>
              </span>
              <span className="pillar-icon" aria-hidden="true">
                +
              </span>
            </button>
            <div className="pillar-panel">
              <div className="pillar-panel-inner">
                <div className="pillar-panel-content">
                  <ul className="pillar-service-list">
                    {list.map((s) => (
                      <li key={s.slug}>{s.title}</li>
                    ))}
                  </ul>
                  <Link href="/services" className="text-link pillar-panel-link">
                    All services <span aria-hidden="true">→</span>
                  </Link>
                  <div className="pillar-stat">
                    <span className="pillar-stat-value">{list.length}</span>
                    <span className="pillar-stat-label">Disciplines</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
