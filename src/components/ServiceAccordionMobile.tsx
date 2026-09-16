"use client";

import Link from "next/link";
import { useState } from "react";
import RevealHeading from "./RevealHeading";
import { PILLARS, PILLAR_HEADLINES, type Service } from "../data/site";

interface Props {
  services: Service[];
}

// Mobile/tablet replacement for the OptionWheel below 810px -- a
// single-open ledger accordion grouped by pillar, each service a real
// link to its /services/[slug] page. Visual/motion language deliberately
// matches .pillar-accordion (see globals.css, used on /about) rather
// than inventing a new idiom: same "+" -> "x" rotate icon, same
// collapsed-name/expanded-headline title swap, same cubic-bezier(0.16,
// 1, 0.3, 1) accordion easing, same staggered slide-in for the revealed
// list -- so this reads as a sibling of an existing pattern instead of a
// pasted-in one. Desktop keeps the drag-to-spin wheel untouched.
export default function ServiceAccordionMobile({ services }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const groups = PILLARS.map((pillar) => ({
    pillar,
    headline: PILLAR_HEADLINES[pillar],
    list: services.filter((s) => s.pillar === pillar),
  })).filter((g) => g.list.length > 0);

  return (
    <div className="services-accordion">
      <div className="services-accordion-head reveal">
        <p className="eyebrow">What we do</p>
        <RevealHeading as="h2" text="Every discipline, one team." className="services-accordion-heading" />
      </div>

      <div className="services-accordion-list">
        {groups.map(({ pillar, headline, list }, i) => {
          const isOpen = openIndex === i;
          return (
            <div className={`services-accordion-row${isOpen ? " is-open" : ""}`} key={pillar}>
              <button
                type="button"
                className="services-accordion-toggle"
                aria-expanded={isOpen}
                onClick={() => setOpenIndex(isOpen ? null : i)}
              >
                <span className="services-accordion-index">{String(i + 1).padStart(2, "0")}</span>
                <span className="services-accordion-title">
                  <span className="services-accordion-title-collapsed">{pillar}</span>
                  <span className="services-accordion-title-expanded">{headline}</span>
                </span>
                <span className="services-accordion-icon" aria-hidden="true">
                  +
                </span>
              </button>
              <div className="services-accordion-panel">
                <div className="services-accordion-panel-inner">
                  {list.map((s, si) => (
                    <Link
                      key={s.slug}
                      href={`/services/${s.slug}`}
                      className="services-accordion-service"
                      style={{ transitionDelay: isOpen ? `${0.15 + si * 0.05}s` : "0s" }}
                    >
                      {s.title}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
