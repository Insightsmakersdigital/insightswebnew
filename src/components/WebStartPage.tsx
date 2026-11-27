"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { SITE_SHORT, type WorkItem } from "../data/site";
import styles from "./WebStartPage.module.css";

export type SiteItem = WorkItem & { website: NonNullable<WorkItem["website"]> };

// History-state key: opening a site pushes one entry, so the phone's Back
// button closes the site instead of leaving the page.
const HISTORY_KEY = "openWebsite";
// Placeholder shape for a screenshot piece until its file arrives.
const PIECE = { desktop: { width: 1920, height: 1400 }, mobile: { width: 786, height: 1400 } };

const siteName = (site: SiteItem) => site.cardName ?? site.name;
const prettyUrl = (url: string) => url.replace(/^https?:\/\/|\/$/g, "");

// The websites half of /work/web-app: a browser start page with one pinned
// shortcut per client. Opening one fills the whole window with that site's
// captured pages. A new site is images plus WorkItem.website in data/site.ts.
export default function WebStartPage({ sites }: { sites: SiteItem[] }) {
  const [query, setQuery] = useState("");
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  // Where the clicked shortcut sat, so the full-screen view can grow from it.
  const [origin, setOrigin] = useState<CSSProperties>({});
  const shortcutRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const lastOpened = useRef<string | null>(null);
  const pushed = useRef(false);

  const needle = query.trim().toLowerCase();
  const matches = needle
    ? sites.filter((s) => `${siteName(s)} ${s.project} ${s.website.summary}`.toLowerCase().includes(needle))
    : sites;
  const active = sites.find((s) => s.slug === openSlug) ?? null;

  useEffect(() => {
    // Back closes the open site; Forward reopens it.
    const onPop = (e: PopStateEvent) => {
      const slug: string | null = e.state?.[HISTORY_KEY] ?? null;
      pushed.current = !!slug;
      setOrigin({});
      setOpenSlug(slug);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    if (!openSlug && lastOpened.current) shortcutRefs.current[lastOpened.current]?.focus({ preventScroll: true });
  }, [openSlug]);

  function open(slug: string, from: HTMLElement | null) {
    const r = from?.getBoundingClientRect();
    setOrigin(
      r
        ? ({
            "--from-top": `${r.top}px`,
            "--from-right": `${window.innerWidth - r.right}px`,
            "--from-bottom": `${window.innerHeight - r.bottom}px`,
            "--from-left": `${r.left}px`,
          } as CSSProperties)
        : {}
    );
    lastOpened.current = slug;
    window.history.pushState({ ...window.history.state, [HISTORY_KEY]: slug }, "");
    pushed.current = true;
    setOpenSlug(slug);
  }

  const close = useCallback(() => {
    // Going back removes the entry we added; onPop then clears the state.
    if (pushed.current) {
      pushed.current = false;
      window.history.back();
    }
    setOpenSlug(null);
  }, []);

  return (
    <div className={styles.window}>
      <div className={styles.titlebar} aria-hidden="true">
        <span className={styles.dots}>
          <i />
          <i />
          <i />
        </span>
        <span className={styles.newTab}>New tab</span>
      </div>

      <div className={styles.home}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={styles.logo} src="/logo.png" alt={SITE_SHORT} width={2322} height={694} />

        <form
          className={styles.search}
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            if (needle && matches[0]) open(matches[0].slug, shortcutRefs.current[matches[0].slug]);
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-4-4" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search our websites"
            aria-label="Search our websites"
            autoComplete="off"
            enterKeyHint="go"
          />
        </form>

        {matches.length > 0 ? (
          <ul className={styles.shortcuts}>
            {matches.map((site) => (
              <li key={site.slug}>
                <button
                  type="button"
                  ref={(el) => {
                    shortcutRefs.current[site.slug] = el;
                  }}
                  onClick={(e) => open(site.slug, e.currentTarget)}
                >
                  <span className={styles.tile}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={site.website.icon} alt="" width={64} height={64} loading="lazy" />
                  </span>
                  <span className={styles.label}>{siteName(site)}</span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className={styles.noMatch}>
            <p>No website matches &ldquo;{query.trim()}&rdquo;.</p>
            <button type="button" onClick={() => setQuery("")}>
              Show all websites
            </button>
          </div>
        )}
        <p className="sr-status" role="status">
          {needle ? `${matches.length} ${matches.length === 1 ? "website" : "websites"} found` : ""}
        </p>

        <Link href="/contact" className={styles.cta}>
          Want yours on this page? <strong>Start a project</strong> <span aria-hidden="true">→</span>
        </Link>
      </div>

      {active && <FullScreenSite key={active.slug} site={active} origin={origin} onClose={close} />}
    </div>
  );
}

// A modal <dialog>: sits above the site header, traps focus and handles
// Escape without extra code.
function FullScreenSite({ site, origin, onClose }: { site: SiteItem; origin: CSSProperties; onClose: () => void }) {
  const [pageIndex, setPageIndex] = useState(0);
  // Handsets start on the mobile capture, where one exists. Read up front
  // (this only ever renders in the browser) so a phone never starts
  // downloading the desktop image first.
  const [device, setDevice] = useState<"desktop" | "mobile">(() =>
    window.matchMedia("(max-width: 809px)").matches ? "mobile" : "desktop"
  );
  const dialogRef = useRef<HTMLDialogElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { pages, url } = site.website;
  const page = pages[pageIndex];
  const mobile = device === "mobile" && !!page.mobile?.length;
  const images = (mobile ? page.mobile : page.desktop) ?? [];
  const name = siteName(site);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (!dialog.open) dialog.showModal();
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = previous;
      if (dialog.open) dialog.close();
    };
  }, []);

  useEffect(() => {
    scrollRef.current?.focus({ preventScroll: true });
  }, [pageIndex, mobile]);

  return (
    <dialog
      ref={dialogRef}
      className={styles.full}
      style={origin}
      aria-label={`${name} website`}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
    >
      <div className={styles.chrome}>
        <div className={styles.tabRow}>
          <button type="button" className={styles.close} onClick={onClose} aria-label="Close website">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
          <div className={styles.tabs} role="group" aria-label={`${name} pages`}>
            {pages.map((p, i) => (
              <button type="button" key={p.label} aria-pressed={i === pageIndex} onClick={() => setPageIndex(i)}>
                {p.label}
              </button>
            ))}
          </div>
        </div>
        <div className={styles.toolbar}>
          <span className={styles.address}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={site.website.icon} alt="" width={20} height={20} />
            <span>{url ? prettyUrl(url) : name}</span>
          </span>
          {!!page.mobile?.length && (
            <span className={styles.devices} role="group" aria-label="Screen size">
              <button type="button" aria-pressed={!mobile} onClick={() => setDevice("desktop")}>
                Desktop
              </button>
              <button type="button" aria-pressed={mobile} onClick={() => setDevice("mobile")}>
                Mobile
              </button>
            </span>
          )}
          {url && (
            <a className={styles.action} href={url} target="_blank" rel="noopener noreferrer">
              Visit live site
            </a>
          )}
          <Link href="/contact" className={`${styles.action} ${styles.primary}`}>
            Start a project
          </Link>
        </div>
      </div>

      {/* Keyed so switching page or screen size starts at the top. */}
      <div key={`${pageIndex}-${mobile}`} ref={scrollRef} className={styles.page} tabIndex={0} role="region" aria-label={`${name} ${page.label} page, scrollable`}>
        <div className={mobile ? styles.pageMobile : styles.pageDesktop}>
          {images.map((src, i) => (
            // width/height only reserve space until the file arrives (its real
            // shape then wins). Without them every unloaded piece is 0px tall,
            // so they would all load at once.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={src}
              src={src}
              width={PIECE[mobile ? "mobile" : "desktop"].width}
              height={PIECE[mobile ? "mobile" : "desktop"].height}
              loading={i === 0 ? "eager" : "lazy"}
              alt={i === 0 ? `${name} ${page.label} page, ${mobile ? "mobile" : "desktop"} view` : ""}
            />
          ))}
        </div>
      </div>
    </dialog>
  );
}
