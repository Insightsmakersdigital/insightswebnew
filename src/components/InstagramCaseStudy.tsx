"use client";

import { useEffect, useRef, useState } from "react";
import { initialsAvatar } from "../data/site";

// Instagram-replica case-study presentation, used only for work items in
// the Social Media Marketing /work section. Adapted from a reference
// InstagramProfile component: same chrome (top bar, avatar ring, stats
// row, bio, Posts/Reels/Reposts/Tagged tabs, 3-col grid), parameterized
// per client instead of hardcoded. No performance numbers are invented --
// posts/followers/following render "—" until real figures are supplied on
// the WorkItem, and the grid falls back to plain tinted placeholder cells
// (no fabricated captions) until real post images are supplied.

const styles = `
.ig-profile-root {
  --bg: #000000;
  --border: #262626;
  --text: #f5f5f5;
  --text-dim: #a8a8a8;
  --text-dimmer: #737373;

  background: var(--bg);
  color: var(--text);
  display: flex;
  justify-content: center;
}
.ig-profile-root * { box-sizing: border-box; }

.ig-phone {
  width: 100%;
  max-width: 400px;
  background: var(--bg);
}

.ig-topbar { display: flex; align-items: center; justify-content: space-between; padding: 10px 16px; }
.ig-username-row { display: flex; align-items: center; gap: 6px; }
.ig-username-row .ig-handle { font-size: 17px; font-weight: 600; }
.ig-topbar-icons { display: flex; gap: 20px; align-items: center; }
.ig-topbar-icons svg { width: 22px; height: 22px; }

.ig-profile-top { display: flex; align-items: center; padding: 8px 16px 0; gap: 24px; }

.ig-avatar-ring {
  width: 86px; height: 86px; border-radius: 50%; padding: 3px;
  background: linear-gradient(135deg, #0f5132 0%, #14855c 50%, #1fbf87 100%);
  flex-shrink: 0;
}
.ig-avatar-inner {
  width: 100%; height: 100%; border-radius: 50%; background: #0d3b2e;
  display: flex; align-items: center; justify-content: center;
  border: 3px solid #000; overflow: hidden;
}
.ig-avatar-inner img { width: 100%; height: 100%; object-fit: cover; display: block; }

.ig-profile-stats { display: flex; flex: 1; justify-content: space-around; text-align: center; }
.ig-stat-num { font-size: 17px; font-weight: 600; line-height: 1.1; }
.ig-stat-label { font-size: 13px; color: var(--text-dim); margin-top: 2px; }

.ig-bio { padding: 12px 16px 4px; }
.ig-bio .ig-display-name { font-size: 14px; font-weight: 600; }
.ig-bio .ig-category { font-size: 13px; color: var(--text-dim); margin-top: 2px; }
.ig-bio .ig-line { font-size: 14px; line-height: 1.35; margin-top: 6px; white-space: pre-line; }

.ig-tabs { display: flex; border-top: 1px solid var(--border); margin-top: 20px; }
.ig-tab { flex: 1; display: flex; align-items: center; justify-content: center; padding: 12px 0 10px; border-top: 1px solid transparent; background: none; border-left: none; border-right: none; border-bottom: none; cursor: pointer; }
.ig-tab.active { border-top: 1px solid var(--text); margin-top: -1px; }
.ig-tab svg { width: 22px; height: 22px; color: var(--text-dimmer); }
.ig-tab.active svg { color: var(--text); }

.ig-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5px; }
.ig-cell { position: relative; aspect-ratio: 4 / 5; overflow: hidden; background: #111; }
.ig-cell img { width: 100%; height: 100%; object-fit: cover; display: block; }
.ig-cell--empty { display: flex; align-items: center; justify-content: center; color: #000; }
.ig-cell--post { padding: 0; border: none; margin: 0; display: block; width: 100%; cursor: pointer; }
.ig-cell-reel-badge { position: absolute; top: 6px; right: 6px; width: 15px; height: 15px; filter: drop-shadow(0 0 2px rgb(0 0 0 / 80%)); }

/* Reel/video posts: skip the image carousel entirely, one player. A
   generic hosted-page link (not a direct .mp4 etc.) goes in an iframe,
   with a plain link underneath in case that host refuses to embed. */
.ig-video-embed { width: min(90vw, 405px); max-height: 90vh; display: flex; flex-direction: column; align-items: center; gap: 10px; }
.ig-video-embed video { width: 100%; max-height: 90vh; display: block; background: #000; }
.ig-video-embed iframe { width: 100%; aspect-ratio: 9 / 16; border: none; background: #000; }
.ig-video-fallback-link { color: var(--text-dim); font-size: 13px; text-decoration: underline; }

/* Lightbox: click a real post to open it full-size, click the backdrop or
   the close button (or press Escape) to dismiss. */
.ig-lightbox {
  position: fixed; inset: 0; z-index: 400;
  display: flex; align-items: center; justify-content: center;
  padding: 24px;
  background: rgb(0 0 0 / 90%);
}
.ig-lightbox img { max-width: 100%; max-height: 100%; object-fit: contain; display: block; }
.ig-lightbox-close {
  position: absolute; top: 16px; right: 16px; z-index: 1;
  width: 36px; height: 36px; border-radius: 50%; border: none;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.5rem; line-height: 1; color: #fff; cursor: pointer;
  background: rgb(255 255 255 / 15%);
}
.ig-lightbox-close:hover { background: rgb(255 255 255 / 25%); }

/* Carousel -- swipe (touch) or arrow-click through extra slides on a
   post; dots show position. Hidden entirely for single-image posts. */
/* Fixed-size box, not shrink-wrapped to whichever slide is showing --
   otherwise a portrait slide next to a landscape one changes the
   container's height, and the dots (anchored to its bottom edge) jump
   or end up clipped when you swipe between them. */
.ig-carousel {
  position: relative; touch-action: pan-y;
  width: min(90vw, 600px); height: 90vh;
  display: flex; align-items: center; justify-content: center;
}
.ig-carousel img { max-width: 100%; max-height: 100%; object-fit: contain; display: block; }
.ig-carousel-arrow {
  position: absolute; top: 50%; transform: translateY(-50%);
  width: 36px; height: 36px; border-radius: 50%; border: none;
  display: flex; align-items: center; justify-content: center;
  color: #fff; cursor: pointer;
  background: rgb(0 0 0 / 45%);
}
.ig-carousel-arrow:hover { background: rgb(0 0 0 / 65%); }
.ig-carousel-arrow--prev { left: 8px; }
.ig-carousel-arrow--next { right: 8px; }
.ig-carousel-dots { position: absolute; left: 0; right: 0; bottom: 12px; display: flex; justify-content: center; gap: 6px; }
.ig-carousel-dot { width: 6px; height: 6px; border-radius: 50%; background: rgb(255 255 255 / 40%); }
.ig-carousel-dot.active { background: #fff; }

/* Web view: the phone-width layout reads too small once it's sitting in
   a modal on a real desktop screen -- scale the whole card up a step
   rather than leaving it at literal handset width. */
@media (min-width: 640px) {
  .ig-phone { max-width: 480px; }
  .ig-topbar { padding: 14px 22px; }
  .ig-username-row .ig-handle { font-size: 19px; }
  .ig-topbar-icons svg { width: 25px; height: 25px; }
  .ig-profile-top { padding: 12px 22px 0; gap: 30px; }
  .ig-avatar-ring { width: 104px; height: 104px; }
  .ig-stat-num { font-size: 19px; }
  .ig-stat-label { font-size: 14px; }
  .ig-bio { padding: 16px 22px 6px; }
  .ig-bio .ig-display-name { font-size: 16px; }
  .ig-bio .ig-category { font-size: 14px; }
  .ig-bio .ig-line { font-size: 15px; }
  .ig-tabs { margin-top: 26px; }
  .ig-tab svg { width: 25px; height: 25px; }
}
`;

const PostsIcon = () => (
  <svg fill="currentColor" height="22" viewBox="0 0 24 24" width="22">
    <rect height="6" rx="1" ry="1" width="4.667" x="3" y="1" />
    <rect height="6" rx="1" ry="1" width="4.667" x="16.333" y="1" />
    <rect height="6" rx="1" ry="1" width="4.667" x="9.667" y="1" />
    <rect height="6" rx="1" ry="1" width="4.667" x="3" y="9" />
    <rect height="6" rx="1" ry="1" width="4.667" x="16.333" y="9" />
    <rect height="6" rx="1" ry="1" width="4.667" x="9.667" y="9" />
    <rect height="6" rx="1" ry="1" width="4.667" x="3" y="17" />
    <rect height="6" rx="1" ry="1" width="4.667" x="16.333" y="17" />
    <rect height="6" rx="1" ry="1" width="4.667" x="9.667" y="17" />
  </svg>
);

const ReelsIcon = ({ className }: { className?: string } = {}) => (
  <svg height="22" viewBox="0 0 24 24" width="22" fill="currentColor" className={className}>
    <path d="M22.935 7.468c-.063-1.36-.307-2.142-.512-2.67a5.341 5.341 0 0 0-1.27-1.95 5.345 5.345 0 0 0-1.95-1.27c-.53-.206-1.311-.45-2.672-.513C15.333 1.012 14.976 1 12 1s-3.333.012-4.532.065c-1.36.063-2.142.307-2.67.512-.77.298-1.371.69-1.95 1.27a5.36 5.36 0 0 0-1.27 1.95c-.206.53-.45 1.311-.513 2.672C1.012 8.667 1 9.024 1 12s.012 3.333.065 4.532c.063 1.36.307 2.142.512 2.67.297.77.69 1.372 1.27 1.95.58.581 1.181.974 1.95 1.27.53.206 1.311.45 2.672.513C8.667 22.988 9.024 23 12 23s3.333-.012 4.532-.065c1.36-.063 2.142-.307 2.67-.512a5.33 5.33 0 0 0 1.95-1.27 5.356 5.356 0 0 0 1.27-1.95c.206-.53.45-1.311.513-2.672.053-1.198.065-1.555.065-4.531s-.012-3.333-.065-4.532Zm-1.998 8.972c-.05 1.07-.228 1.652-.38 2.04-.197.51-.434.874-.82 1.258a3.362 3.362 0 0 1-1.258.82c-.387.151-.97.33-2.038.379-1.162.052-1.51.063-4.441.063s-3.28-.01-4.44-.063c-1.07-.05-1.652-.228-2.04-.38a3.354 3.354 0 0 1-1.258-.82 3.362 3.362 0 0 1-.82-1.258c-.151-.387-.33-.97-.379-2.038C3.011 15.28 3 14.931 3 12s.01-3.28.063-4.44c.05-1.07.228-1.652.38-2.04.197-.51.434-.875.82-1.26a3.372 3.372 0 0 1 1.258-.819c.387-.15.97-.329 2.038-.378C8.72 3.011 9.069 3 12 3s3.28.01 4.44.063c1.07.05 1.652.228 2.04.38.51.197.874.433 1.258.82.385.382.622.747.82 1.258.151.387.33.97.379 2.038C20.989 8.72 21 9.069 21 12s-.01 3.28-.063 4.44Zm-4.584-6.828-5.25-3a2.725 2.725 0 0 0-2.745.01A2.722 2.722 0 0 0 6.988 9v6c0 .992.512 1.88 1.37 2.379.432.25.906.376 1.38.376.468 0 .937-.123 1.365-.367l5.25-3c.868-.496 1.385-1.389 1.385-2.388s-.517-1.892-1.385-2.388Zm-.993 3.04-5.25 3a.74.74 0 0 1-.748-.003.74.74 0 0 1-.374-.649V9a.74.74 0 0 1 .374-.65.737.737 0 0 1 .748-.002l5.25 3c.341.196.378.521.378.652s-.037.456-.378.651Z" />
  </svg>
);

const RepostsIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
    <path d="M19.998 9.497a1 1 0 0 0-1 1v4.228a3.274 3.274 0 0 1-3.27 3.27h-5.313l1.791-1.787a1 1 0 0 0-1.412-1.416L7.29 18.287a1.004 1.004 0 0 0-.294.707v.001c0 .023.012.042.013.065a.923.923 0 0 0 .281.643l3.502 3.504a1 1 0 0 0 1.414-1.414l-1.797-1.798h5.318a5.276 5.276 0 0 0 5.27-5.27v-4.228a1 1 0 0 0-1-1zm-6.41-3.496-1.795 1.795a1 1 0 1 0 1.414 1.414l3.5-3.5a1.003 1.003 0 0 0 0-1.417l-3.5-3.5a1 1 0 0 0-1.414 1.414l1.794 1.794H8.27A5.277 5.277 0 0 0 3 9.271V13.5a1 1 0 0 0 2 0V9.271a3.275 3.275 0 0 1 3.271-3.27z" />
  </svg>
);

const TaggedIcon = () => (
  <svg fill="currentColor" height="22" viewBox="0 0 24 24" width="22">
    <path d="M21 7.48a2 2 0 0 0-2-2h-3.046a2.002 2.002 0 0 1-1.506-.683l-1.695-1.939a1 1 0 0 0-1.506 0L9.552 4.797c-.38.434-.93.682-1.506.682H5a2 2 0 0 0-2 2V19l.01.206A2 2 0 0 0 5 21h14a2 2 0 0 0 2-2V7.48ZM23 19a4 4 0 0 1-4 4H5a4 4 0 0 1-3.995-3.794L1 19V7.48a4 4 0 0 1 4-4h3.046l1.696-1.94a3 3 0 0 1 4.516 0l1.696 1.94H19a4 4 0 0 1 4 4V19Z" />
    <path d="M14.5 10.419a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0Zm2 0a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM12 16.003c3.511 0 6.555 1.99 8.13 4.906a1 1 0 0 1-1.76.95c-1.248-2.31-3.64-3.857-6.37-3.857S6.878 19.55 5.63 21.86a1 1 0 0 1-1.76-.951c1.575-2.915 4.618-4.906 8.13-4.906Z" />
  </svg>
);

const LockIcon = () => (
  <svg width="12" height="12" viewBox="0 0 448 512" fill="currentColor">
    <path d="M144 144v48H304V144c0-44.2-35.8-80-80-80s-80 35.8-80 80zm-32 48V144C112 64.5 176.5 0 256 0s144 64.5 144 144v48h16c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V256c0-35.3 28.7-64 64-64h16z" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const ChevronLeftIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const PlusIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const MenuIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const ImagePlaceholderIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.55">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <path d="m21 15-5-5L5 21" />
  </svg>
);

// Carousel posts: for a grid image at .../post-3.jpg, extra slides are
// optionally named post-3-2.jpg, post-3-3.jpg, etc. (see
// MAX_CAROUSEL_SLIDES). None of that needs declaring in data -- the
// lightbox just probes for those files when it opens and swipes through
// whichever ones actually exist.
const MAX_CAROUSEL_SLIDES = 10; // Instagram's own real cap on images per post

function carouselCandidates(base: string) {
  const dot = base.lastIndexOf(".");
  const stem = dot === -1 ? base : base.slice(0, dot);
  const ext = dot === -1 ? "" : base.slice(dot);
  return Array.from({ length: MAX_CAROUSEL_SLIDES }, (_, i) => (i === 0 ? base : `${stem}-${i + 1}${ext}`));
}

function preload(src: string) {
  return new Promise<boolean>((resolve) => {
    const img = new window.Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = src;
  });
}

const TABS = [
  { key: "posts", icon: PostsIcon },
  { key: "reels", icon: ReelsIcon },
  { key: "reposts", icon: RepostsIcon },
  { key: "tagged", icon: TaggedIcon },
];

// A post is either a plain image (a string src, possibly a carousel via
// carouselCandidates) or a reel/video: a thumbnail to show in the grid,
// plus the video link to open when it's tapped.
export type GridPost = string | { thumbnail: string; video: string };

function isVideoUrl(src: string) {
  return /\.(mp4|webm|ogg|mov|m4v)(\?|#|$)/i.test(src);
}

// A real instagram.com/reel/ or /p/ permalink gets Instagram's own
// official rich embed (their embed.js script processing a blockquote),
// not a generic iframe -- it renders with Instagram's real chrome
// (profile pic, likes, caption) rather than a bare player.
function isInstagramPermalink(src: string) {
  return /^https:\/\/(www\.)?instagram\.com\/(reel|p|tv)\//i.test(src);
}

declare global {
  interface Window {
    instgrm?: { Embeds?: { process?: () => void } };
  }
}

interface Props {
  handle: string;
  displayName: string;
  category?: string;
  bio?: string;
  avatarSrc: string;
  posts?: string;
  followers?: string;
  following?: string;
  tint: string;
  gridImages?: GridPost[];
}

export default function InstagramCaseStudy({
  handle,
  displayName,
  category,
  bio,
  avatarSrc,
  posts,
  followers,
  following,
  tint,
  gridImages,
}: Props) {
  const [activeTab, setActiveTab] = useState("posts");
  const [failedCells, setFailedCells] = useState<Set<number>>(new Set());
  const [logoFailed, setLogoFailed] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [slides, setSlides] = useState<string[]>([]);
  const [slideIndex, setSlideIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  // Empty image-holder cells until real post images are supplied per
  // client -- 12 (4 rows) so the grid reads as a full profile, not a
  // half-empty one.
  const cells: (GridPost | undefined)[] = gridImages && gridImages.length > 0 ? gridImages : Array.from({ length: 12 });

  const activeCell = lightboxIndex !== null ? cells[lightboxIndex] : null;
  const activeVideo = activeCell && typeof activeCell === "object" ? activeCell.video : null;
  const lightboxSrc = typeof activeCell === "string" ? activeCell : null;

  // When an image post opens, probe for extra carousel slides
  // (post-N-2.jpg, post-N-3.jpg, ...) and swipe through whichever ones
  // actually load. Reels/videos skip this entirely -- a single player,
  // no carousel.
  useEffect(() => {
    if (typeof lightboxSrc !== "string") {
      setSlides([]);
      return;
    }
    let cancelled = false;
    setSlideIndex(0);
    (async () => {
      const found: string[] = [];
      for (const candidate of carouselCandidates(lightboxSrc)) {
        // eslint-disable-next-line no-await-in-loop
        const ok = await preload(candidate);
        if (!ok) break;
        found.push(candidate);
      }
      if (!cancelled) setSlides(found.length > 0 ? found : [lightboxSrc]);
    })();
    return () => {
      cancelled = true;
    };
  }, [lightboxSrc]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowRight") setSlideIndex((i) => Math.min(i + 1, slides.length - 1));
      if (e.key === "ArrowLeft") setSlideIndex((i) => Math.max(i - 1, 0));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIndex, slides.length]);

  // A real Instagram permalink renders via Instagram's own embed.js,
  // which scans the page for un-processed .instagram-media blockquotes
  // and swaps them for the real embed. Load the script once, then
  // re-run process() every time a new Instagram post's blockquote mounts.
  useEffect(() => {
    if (!activeVideo || !isInstagramPermalink(activeVideo)) return;
    const process = () => window.instgrm?.Embeds?.process?.();
    const existing = document.querySelector<HTMLScriptElement>('script[src*="instagram.com/embed.js"]');
    if (existing) {
      process();
    } else {
      const script = document.createElement("script");
      script.src = "https://www.instagram.com/embed.js";
      script.async = true;
      script.onload = process;
      document.body.appendChild(script);
    }
  }, [activeVideo]);

  return (
    <div className="ig-profile-root">
      <style>{styles}</style>
      <div className="ig-phone">
        <div className="ig-topbar">
          <div className="ig-username-row">
            <span className="ig-handle">{handle}</span>
            <LockIcon />
            <ChevronDownIcon />
          </div>
          <div className="ig-topbar-icons">
            <PlusIcon />
            <MenuIcon />
          </div>
        </div>

        <div className="ig-profile-top">
          <div className="ig-avatar-ring">
            <div className="ig-avatar-inner">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logoFailed ? initialsAvatar(displayName, tint) : avatarSrc}
                alt={`${displayName} logo`}
                onError={() => setLogoFailed(true)}
              />
            </div>
          </div>
          <div className="ig-profile-stats">
            <div>
              <div className="ig-stat-num">{posts ?? "—"}</div>
              <div className="ig-stat-label">posts</div>
            </div>
            <div>
              <div className="ig-stat-num">{followers ?? "—"}</div>
              <div className="ig-stat-label">followers</div>
            </div>
            <div>
              <div className="ig-stat-num">{following ?? "—"}</div>
              <div className="ig-stat-label">following</div>
            </div>
          </div>
        </div>

        <div className="ig-bio">
          <div className="ig-display-name">{displayName}</div>
          {category && <div className="ig-category">{category}</div>}
          {bio && <div className="ig-line">{bio}</div>}
        </div>

        <div className="ig-tabs">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`ig-tab${isActive ? " active" : ""}`}
                aria-label={tab.key}
              >
                <Icon />
              </button>
            );
          })}
        </div>

        <div className="ig-grid">
          {cells.map((cell, i) => {
            if (failedCells.has(i) || cell === undefined) {
              return (
                <div key={i} className="ig-cell ig-cell--empty" style={{ background: `hsl(${tint} / ${i % 2 === 0 ? "35%" : "22%"})` }}>
                  <ImagePlaceholderIcon />
                </div>
              );
            }
            const thumbnail = typeof cell === "string" ? cell : cell.thumbnail;
            return (
              <button key={i} type="button" className="ig-cell ig-cell--post" onClick={() => setLightboxIndex(i)} aria-label="Open post">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={thumbnail}
                  alt=""
                  onError={() => setFailedCells((prev) => new Set(prev).add(i))}
                />
                {typeof cell === "object" && <ReelsIcon className="ig-cell-reel-badge" />}
              </button>
            );
          })}
        </div>
      </div>

      {(typeof lightboxSrc === "string" || activeVideo) && (
        <div className="ig-lightbox" onClick={() => setLightboxIndex(null)}>
          <button
            type="button"
            className="ig-lightbox-close"
            aria-label="Close post"
            onClick={() => setLightboxIndex(null)}
          >
            &times;
          </button>

          {activeVideo ? (
            <div className="ig-video-embed" onClick={(e) => e.stopPropagation()}>
              {isInstagramPermalink(activeVideo) ? (
                <blockquote
                  key={activeVideo}
                  className="instagram-media"
                  data-instgrm-permalink={activeVideo}
                  data-instgrm-version="14"
                />
              ) : isVideoUrl(activeVideo) ? (
                // eslint-disable-next-line jsx-a11y/media-has-caption
                <video src={activeVideo} controls autoPlay playsInline />
              ) : (
                <>
                  <iframe src={activeVideo} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen title="Reel" />
                  <a href={activeVideo} target="_blank" rel="noopener noreferrer" className="ig-video-fallback-link">
                    Open original ↗
                  </a>
                </>
              )}
            </div>
          ) : (
          <div
            className="ig-carousel"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={(e) => {
              touchStartX.current = e.touches[0].clientX;
            }}
            onTouchEnd={(e) => {
              if (touchStartX.current === null) return;
              const delta = e.changedTouches[0].clientX - touchStartX.current;
              touchStartX.current = null;
              if (delta < -40) setSlideIndex((i) => Math.min(i + 1, slides.length - 1));
              if (delta > 40) setSlideIndex((i) => Math.max(i - 1, 0));
            }}
          >
            {slides.length > 1 && slideIndex > 0 && (
              <button
                type="button"
                className="ig-carousel-arrow ig-carousel-arrow--prev"
                aria-label="Previous image"
                onClick={() => setSlideIndex((i) => Math.max(i - 1, 0))}
              >
                <ChevronLeftIcon />
              </button>
            )}

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={slides[slideIndex] ?? lightboxSrc ?? undefined} alt="" />

            {slides.length > 1 && slideIndex < slides.length - 1 && (
              <button
                type="button"
                className="ig-carousel-arrow ig-carousel-arrow--next"
                aria-label="Next image"
                onClick={() => setSlideIndex((i) => Math.min(i + 1, slides.length - 1))}
              >
                <ChevronRightIcon />
              </button>
            )}

            {slides.length > 1 && (
              <div className="ig-carousel-dots">
                {slides.map((_, i) => (
                  <span key={i} className={`ig-carousel-dot${i === slideIndex ? " active" : ""}`} />
                ))}
              </div>
            )}
          </div>
          )}
        </div>
      )}
    </div>
  );
}
