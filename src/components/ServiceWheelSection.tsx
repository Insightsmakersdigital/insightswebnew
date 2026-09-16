"use client";

import { useState } from "react";
import Link from "next/link";
import OptionWheel from "./OptionWheel";
import ServiceAccordionMobile from "./ServiceAccordionMobile";
import BlurText from "./BlurText";
import type { Service } from "../data/site";

interface Props {
  services: Service[];
}

// Desktop (>=810px) keeps the vertical drag-to-spin wheel. Below that,
// mobile/tablet gets a ledger-style accordion (ServiceAccordionMobile)
// instead -- grouped by pillar, each service a real link to its own
// /services/[slug] page, tap-to-expand rather than drag-to-spin. Both
// markup blocks render always; CSS decides which is visible per
// breakpoint (.wheel-mobile-block), same pattern as the site header's
// .nav-desktop/.nav-mobile split. The accordion is self-contained (no
// shared activeIndex wiring needed) since .wheel-detail, the only thing
// that reacted to wheel selection, is already desktop-only.
export default function ServiceWheelSection({ services }: Props) {
  const [activeIndex, setActiveIndex] = useState(2);
  const active = services[activeIndex];

  return (
    <section className="wheel-section panel-light">
      <div className="wrap wheel-grid">
        <div className="wheel-col wheel-col--desktop reveal">
          <OptionWheel
            items={services.map((s) => s.title)}
            defaultSelected={2}
            textColor="#000000"
            activeColor="#3d3737"
            side="right"
            fontSize={2}
            spacing={4.4}
            curve={1.35}
            tilt={6}
            blur={2}
            fade={0.25}
            smoothing={180}
            inset={60}
            draggable
            soundVolume={0.5}
            onChange={(index) => setActiveIndex(index)}
          />
        </div>

        <div className="wheel-mobile-block reveal">
          <ServiceAccordionMobile services={services} />
        </div>

        <div className="wheel-detail reveal">
          <div className="wheel-detail-copy">
            <span className="wheel-detail-eyebrow">What we do</span>
            <BlurText
              key={`${active.slug}-heading`}
              as="h3"
              text={active.headline}
              className="wheel-detail-heading"
              animateBy="words"
              direction="bottom"
              delay={45}
              stepDuration={0.3}
            />
            <BlurText
              key={`${active.slug}-body`}
              as="p"
              text={active.description}
              className="wheel-detail-body"
              animateBy="words"
              direction="bottom"
              delay={12}
              stepDuration={0.25}
            />
            <Link href={`/services/${active.slug}`} className="wheel-detail-link">
              View this service <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
