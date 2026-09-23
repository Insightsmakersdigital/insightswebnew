"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  image: string; // seededImage(slug, category) -- the dedicated cover, tried first
  fallbackImage?: string; // the WorkItem's own gallery[0], used only if `image` fails to load
  title: string;
  client: string;
  tint: string;
  onClick: () => void;
}

// Static grid card for the /work page's 3-column category grids. No hover
// transforms of any kind -- interaction is click-only, per spec. No
// services line either -- each card already sits under its section
// heading (Social Media Marketing / Branding / Web + App Development),
// so re-listing the service(s) here was just repeating that context.
//
// image/fallbackImage exist because there's no way to know at render time
// whether a dedicated public/images/work/{category}/{slug}.jpg has
// actually been uploaded yet -- this file is shared by both the server
// page and this client component, so a Node fs.existsSync check isn't an
// option (fs doesn't exist in the browser bundle). onError is the
// standard web-native way to do "try A, fall back to B" for an <img>
// without needing to know in advance which one exists.
export default function WorkTile({ image, fallbackImage, title, client, tint, onClick }: Props) {
  const [src, setSrc] = useState(image);
  const imgRef = useRef<HTMLImageElement>(null);

  // The <img> starts loading from the SSR-rendered src before React
  // hydrates and attaches onError below -- if that request 404s fast
  // enough (no real network latency, e.g. a local/static build), the
  // error event fires and is lost before any listener exists to catch
  // it, leaving a permanently broken image despite a valid fallback.
  // This catches that already-failed state once on mount; onError below
  // still handles the normal case where hydration wins the race.
  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth === 0 && fallbackImage && src !== fallbackImage) {
      setSrc(fallbackImage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <article
      className="work-tile"
      style={{ "--tint": tint } as React.CSSProperties}
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className="work-tile-media">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imgRef}
          src={src}
          alt={`${title} — ${client}`}
          loading="lazy"
          onError={() => {
            if (fallbackImage && src !== fallbackImage) setSrc(fallbackImage);
          }}
        />
      </div>
      <div className="work-tile-info">
        <h3>{client}</h3>
      </div>
    </article>
  );
}
