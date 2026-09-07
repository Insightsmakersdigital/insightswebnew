"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import WorkTile from "./WorkTile";
import SectionHead from "./SectionHead";
import InstagramCaseStudy, { type GridPost } from "./InstagramCaseStudy";
import { SERVICES, seededImage, seededLogo, seededHandle, seededInstagramPosts, type WorkItem } from "../data/site";

// Post thumbnails come from the fixed post-1..post-N folder convention;
// any post number with a matching WorkItem.instagram.reels entry becomes
// a video/reel instead of a plain image, same thumbnail either way.
function buildGridPosts(item: WorkItem): GridPost[] {
  const thumbnails = seededInstagramPosts(item.slug);
  const reels = item.instagram?.reels ?? {};
  return thumbnails.map((thumbnail, i) => {
    const video = reels[i + 1];
    return video ? { thumbnail, video } : thumbnail;
  });
}

export interface WorkSection {
  index: string;
  heading: string;
  items: WorkItem[];
  pendingNote?: string; // e.g. "More on the way" -- a real, honestly labeled empty slot, not a fabricated card
}

interface Props {
  sections: WorkSection[];
}

export default function WorkGrid({ sections }: Props) {
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  const active = sections.flatMap((s) => s.items).find((w) => w.slug === openSlug) ?? null;
  const isSmm = active?.category === "smm";

  useEffect(() => {
    if (!openSlug) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenSlug(null);
    };
    document.body.style.overflow = "hidden";
    // The Instagram chrome has its own top bar -- the site nav peeking
    // through the dimmed backdrop above it looks like two navbars stacked.
    if (isSmm) document.body.classList.add("ig-modal-open");
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.body.classList.remove("ig-modal-open");
      window.removeEventListener("keydown", onKey);
    };
  }, [openSlug, isSmm]);

  return (
    <>
      {sections.map((section) => (
        <section key={section.heading} className="work-section">
          <div className="wrap">
            <SectionHead eyebrow="Case studies" heading={section.heading} index={section.index} />
            <div className="work-tile-grid">
              {section.items.map((item) => (
                <WorkTile
                  key={item.slug}
                  slug={item.slug}
                  category={item.category}
                  title={item.project}
                  client={item.cardName ?? item.name}
                  tint={item.tint}
                  onClick={() => setOpenSlug(item.slug)}
                />
              ))}
              {section.pendingNote && (
                <div className="work-tile work-tile--pending">
                  <p className="work-tile-pending-note">{section.pendingNote}</p>
                </div>
              )}
            </div>
          </div>
        </section>
      ))}

      {active && (
        <div className="case-modal-backdrop" onClick={() => setOpenSlug(null)}>
          <div
            className={`case-modal${isSmm ? " case-modal--ig" : ""}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby={isSmm ? undefined : "case-modal-heading"}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="case-modal-close" aria-label="Close case study" onClick={() => setOpenSlug(null)}>
              &times;
            </button>

            {isSmm ? (
              <InstagramCaseStudy
                handle={active.instagram?.handle ?? `@${seededHandle(active.cardName ?? active.name)}`}
                displayName={active.cardName ?? active.name}
                bio={
                  active.instagram?.bio ??
                  active.services.map((slug) => SERVICES.find((s) => s.slug === slug)?.title).filter(Boolean).join(" · ")
                }
                avatarSrc={seededLogo(active.slug)}
                posts={active.instagram?.posts}
                followers={active.instagram?.followers}
                following={active.instagram?.following}
                tint={active.tint}
                gridImages={buildGridPosts(active)}
              />
            ) : (
              <>
                <div className="case-modal-media">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={seededImage(active.slug, active.category)} alt={`${active.project} — ${active.cardName ?? active.name}`} />
                </div>

                <div className="case-modal-body">
                  <p className="eyebrow">{active.cardName ?? active.name}</p>
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
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
