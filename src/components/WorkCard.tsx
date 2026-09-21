"use client";

import { useState } from "react";
import Link from "next/link";

interface Props {
  href: string; // where this card goes -- its /work/[service] category page
  image: string; // dedicated cover, tried first
  fallbackImage?: string; // gallery[0], used only if `image` fails to load
  title: string; // the project -- what was done, leads the card
  client: string; // who it was for -- byline, not headline
  services: string; // joined service titles, e.g. "Branding + Website Development"
  result: string; // the outcome
  tint: string;
}

export default function WorkCard({ href, image, fallbackImage, title, client, services, result, tint }: Props) {
  const [src, setSrc] = useState(image);

  return (
    <Link href={href} className="work-card reveal work-card-clickable" style={{ "--tint": tint } as React.CSSProperties}>
      <div className="work-col-name">
        <div className="work-name-block">
          <h3>{title}</h3>
          <p>{client}</p>
          {/* Always visible (not hover-gated): a client name can repeat
              across multiple work items, so the service is what tells
              two cards apart at rest, before any hover reveal. */}
          <p className="work-card-service">{services}</p>
        </div>
        <p className="work-jump">View case study</p>
      </div>

      <div className="work-media">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="work-media-fill"
          src={src}
          alt={`${title} — ${client}`}
          loading="lazy"
          onError={() => {
            if (fallbackImage && src !== fallbackImage) setSrc(fallbackImage);
          }}
        />
      </div>

      <div className="work-col-detail">
        <span className="work-arrow" aria-hidden="true">
          ↗
        </span>
        <div className="work-meta">
          <div className="work-meta-pair">
            <span className="work-meta-label">Result</span>
            <span className="work-meta-value">{result}</span>
          </div>
          <div className="work-meta-pair">
            <span className="work-meta-label">Discipline</span>
            <span className="work-meta-value">{services}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
