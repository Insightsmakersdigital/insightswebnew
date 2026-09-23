"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import WorkTile from "./WorkTile";
import InstagramCaseStudy, { isVideoUrl, type GridPost } from "./InstagramCaseStudy";
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
  heading: string; // used as the section's React key only -- the hero above already shows this as its <h1>, so it's not rendered again here
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
  const hasGallery = !isSmm && !!active?.gallery && active.gallery.length > 0;

  // Reel videos are Cloudinary-hosted and only ever requested once someone
  // opens a card's popup -- without this, that first playback starts cold.
  // Warming the browser's HTTP cache for every direct-file reel across
  // this page as soon as it mounts means whichever card gets opened is
  // already local. Landing on a /work/[service] page is a stronger signal
  // of intent than the homepage, so prefetching everything here (rather
  // than gating per-card on hover) is a reasonable trade against the
  // extra bandwidth on a visitor who never opens a single card.
  useEffect(() => {
    const urls = new Set<string>();
    for (const section of sections) {
      for (const item of section.items) {
        for (const url of Object.values(item.instagram?.reels ?? {})) {
          if (isVideoUrl(url)) urls.add(url);
        }
      }
    }
    urls.forEach((url) => {
      fetch(url, { cache: "force-cache" }).catch(() => {});
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
            <div className="work-tile-grid">
              {section.items.map((item) => (
                <WorkTile
                  key={item.slug}
                  image={seededImage(item.slug, item.category)}
                  fallbackImage={item.gallery?.[0]}
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

      {active &&
        createPortal(
          <div className="case-modal-backdrop" onClick={() => setOpenSlug(null)}>
            <div
              className={`case-modal${isSmm ? " case-modal--ig" : ""}${hasGallery ? " case-modal--gallery" : ""}`}
              role="dialog"
              aria-modal="true"
              aria-labelledby={isSmm ? undefined : "case-modal-heading"}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="case-modal-close" aria-label="Close case study" onClick={() => setOpenSlug(null)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>

              {isSmm ? (
                <InstagramCaseStudy
                  handle={active.instagram?.handle ?? `@${seededHandle(active.cardName ?? active.name)}`}
                  displayName={active.cardName ?? active.name}
                  category={active.instagram?.category}
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
              ) : hasGallery ? (
                <>
                  <div className="case-modal-body case-modal-body--gallery-head">
                    <p className="eyebrow">{active.cardName ?? active.name}</p>
                    <h2 id="case-modal-heading" className="case-modal-heading">
                      {active.project}
                    </h2>
                    <p className="case-modal-services">
                      {active.services.map((slug) => SERVICES.find((s) => s.slug === slug)?.title).filter(Boolean).join(" + ")}
                    </p>
                  </div>

                  {/* The slide deck already carries the challenge/approach/
                      outcome copy as baked-in text, so it's not repeated as
                      page text here -- it's still present for screen readers
                      and search, just moved onto the first slide's alt. */}
                  <div className="case-modal-gallery">
                    {active.gallery!.map((src, i) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={src}
                        className="case-modal-gallery-item"
                        src={src}
                        alt={
                          i === 0
                            ? `${active.project} — ${active.caseStudy.challenge} ${active.caseStudy.approach} ${active.caseStudy.outcome}`
                            : `${active.project} — slide ${i + 1}`
                        }
                      />
                    ))}
                  </div>

                  <div className="case-modal-body">
                    <Link href="/contact" className="text-link case-modal-cta">
                      Start a project like this <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  {/* No image here on purpose -- the card thumbnail
                      (seededImage) already shows this cover on the grid;
                      cropping it again into .case-modal-media's own
                      aspect ratio just duplicated it awkwardly. Items
                      that want a real popup image use `gallery` instead
                      (see the hasGallery branch above), not this cover. */}
                  <div className="case-modal-body case-modal-body--no-media">
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
          </div>,
          document.body
        )}
    </>
  );
}
