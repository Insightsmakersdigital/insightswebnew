"use client";

import { useState } from "react";
import Link from "next/link";
import OptionWheel from "./OptionWheel";
import BlurText from "./BlurText";
import type { Service } from "../data/site";

interface Props {
  services: Service[];
}

export default function ServiceWheelSection({ services }: Props) {
  const [activeIndex, setActiveIndex] = useState(2);
  const active = services[activeIndex];

  return (
    <section className="wheel-section panel-light">
      <div className="wrap wheel-grid">
        <div className="wheel-col reveal">
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

        <div className="wheel-detail reveal">
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
    </section>
  );
}
