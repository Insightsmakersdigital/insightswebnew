"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { WorkItem } from "../data/site";
import WebStartPage, { type SiteItem } from "./WebStartPage";
import styles from "./WebAppShowcase.module.css";

type AppItem = WorkItem & { app: NonNullable<WorkItem["app"]> };

// The /work/web-app showcase: websites open from a browser start page (see
// WebStartPage), apps open inside a phone. Both are driven by
// WorkItem.website / WorkItem.app in data/site.ts, so a new project is images
// plus one data entry. Only what's on screen gets downloaded.
export default function WebAppShowcase({ items }: { items: WorkItem[] }) {
  const apps = items.filter((w): w is AppItem => !!w.app);
  const sites = items.filter((w): w is SiteItem => !!w.website);
  const [view, setView] = useState<"apps" | "websites">(sites.length ? "websites" : "apps");

  if (!apps.length && !sites.length) {
    return <p className={styles.empty}>More on the way</p>;
  }

  return (
    <section className={styles.section}>
      <div className="wrap">
        {apps.length > 0 && sites.length > 0 && (
          <div className={styles.switch} role="group" aria-label="Type of work">
            <button type="button" aria-pressed={view === "websites"} onClick={() => setView("websites")}>
              Websites
            </button>
            <button type="button" aria-pressed={view === "apps"} onClick={() => setView("apps")}>
              Apps
            </button>
          </div>
        )}
        <div className={styles.stage}>{view === "apps" ? <Phone apps={apps} /> : <WebStartPage sites={sites} />}</div>
      </div>
    </section>
  );
}

function Phone({ apps }: { apps: AppItem[] }) {
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [index, setIndex] = useState(0);
  // Furthest screen reached. Screens up to one past it have their <img>
  // mounted; the rest stay empty so they aren't downloaded yet.
  const [reached, setReached] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const lastOpened = useRef<string | null>(null);
  const iconRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const active = apps.find((a) => a.slug === openSlug) ?? null;
  const screens = active?.app.screens ?? [];

  useEffect(() => {
    if (openSlug) trackRef.current?.focus({ preventScroll: true });
    else if (lastOpened.current) iconRefs.current[lastOpened.current]?.focus({ preventScroll: true });
  }, [openSlug]);

  function open(slug: string) {
    lastOpened.current = slug;
    setIndex(0);
    setReached(0);
    setOpenSlug(slug);
  }

  function go(to: number) {
    const track = trackRef.current;
    if (!track) return;
    const next = Math.max(0, Math.min(screens.length - 1, to));
    setReached((r) => Math.max(r, next));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollTo({ left: next * track.clientWidth, behavior: reduce ? "auto" : "smooth" });
  }

  function onScroll() {
    const track = trackRef.current;
    if (!track || !track.clientWidth) return;
    const i = Math.round(track.scrollLeft / track.clientWidth);
    setIndex(i);
    setReached((r) => Math.max(r, i));
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (!active) return;
    if (e.key === "Escape") setOpenSlug(null);
    if (e.key === "ArrowRight") {
      e.preventDefault();
      go(index + 1);
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(index - 1);
    }
  }

  return (
    <div className={styles.phoneLayout} onKeyDown={onKeyDown}>
      <div className={styles.phone}>
        <div className={styles.speaker} aria-hidden="true" />
        <div className={styles.screen}>
          {active ? (
            <div
              key={active.slug}
              ref={trackRef}
              className={styles.track}
              onScroll={onScroll}
              tabIndex={0}
              role="region"
              aria-label={`${active.cardName ?? active.name} app screens. Swipe or use the arrow keys.`}
            >
              {screens.map((screen, i) => (
                <div className={styles.slide} key={screen.src}>
                  {i <= reached + 1 && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={screen.src} alt={screen.alt} draggable={false} />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <ul className={styles.icons}>
              {apps.map((item) => (
                <li key={item.slug}>
                  <button
                    type="button"
                    ref={(el) => {
                      iconRefs.current[item.slug] = el;
                    }}
                    onClick={() => open(item.slug)}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.app.icon} alt="" width={64} height={64} loading="lazy" />
                    <span>{item.cardName ?? item.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className={styles.homeBar}>
          {active && <button type="button" onClick={() => setOpenSlug(null)} aria-label="Back to all apps" />}
        </div>
      </div>

      <div className={styles.info}>
        {active ? (
          <>
            <h2>{active.cardName ?? active.name}</h2>
            <p className={styles.summary}>{active.app.summary}</p>
            <div className={styles.controls}>
              <button type="button" onClick={() => go(index - 1)} disabled={index === 0} aria-label="Previous screen">
                ←
              </button>
              <button type="button" onClick={() => go(index + 1)} disabled={index === screens.length - 1} aria-label="Next screen">
                →
              </button>
              <p aria-live="polite">
                {screens[index]?.caption && <strong>{screens[index].caption}</strong>}
                <span>
                  {index + 1} / {screens.length}
                </span>
              </p>
            </div>
            <button type="button" className={styles.back} onClick={() => setOpenSlug(null)}>
              All apps
            </button>
          </>
        ) : (
          <>
            <h2>Apps</h2>
            <p className={styles.summary}>Tap an app to open it, then swipe through its screens.</p>
          </>
        )}
        <Link href="/contact" className="text-link">
          Start a project like this <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  );
}
