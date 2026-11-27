"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SERVICES, PILLARS, servicesByPillar } from "../data/site";
import { isCurrent, type NavItem } from "./navUtils";

/* Every page renders its own Header, so the tabs remount on each route
   change. Remembering where the pill was lets it glide from the old tab to
   the new one instead of just appearing there. */
let lastPill: { x: number; w: number } | null = null;

export default function DesktopTabs({ navItems }: { navItems: NavItem[] }) {
  const pathname = usePathname();
  const rowRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const currentHref = navItems.find((item) => isCurrent(pathname, item.href))?.href ?? null;
  const target = hovered ?? currentHref;

  useEffect(() => {
    const row = rowRef.current;
    const pill = pillRef.current;
    if (!row || !pill) return;

    const place = (x: number, w: number) => {
      pill.style.transform = `translateX(${x}px)`;
      pill.style.width = `${w}px`;
      pill.style.opacity = "1";
    };

    const move = () => {
      const tab = target ? row.querySelector<HTMLElement>(`[data-tab="${target}"]`) : null;
      if (!tab) {
        pill.style.opacity = "0";
        return;
      }
      const box = tab.getBoundingClientRect();
      if (!box.width) return; // desktop nav is hidden at this width
      const next = { x: box.left - row.getBoundingClientRect().left, w: box.width };
      if (!pill.dataset.ready) {
        // first placement: start at the remembered spot (or the target) with no transition
        pill.style.transition = "none";
        const start = lastPill ?? next;
        place(start.x, start.w);
        void pill.offsetWidth;
        pill.style.transition = "";
        pill.dataset.ready = "true";
      }
      place(next.x, next.w);
      lastPill = next;
    };

    move();
    // tab widths change once the web font arrives, and on resize
    const observer = new ResizeObserver(move);
    observer.observe(row);
    document.fonts?.ready.then(move);
    return () => observer.disconnect();
  }, [target]);

  return (
    <div className="nav-desktop-links" ref={rowRef} onMouseLeave={() => setHovered(null)}>
      <span className="nav-pill" ref={pillRef} aria-hidden="true"></span>
      {navItems.map((item) => {
        const tabProps = {
          href: item.href,
          "data-tab": item.href,
          "aria-current": item.href === currentHref ? ("page" as const) : undefined,
          onFocus: () => setHovered(item.href),
          onBlur: () => setHovered(null),
        };
        if (item.href !== "/services") {
          return (
            <Link key={item.href} {...tabProps} className="nav-tab" onMouseEnter={() => setHovered(item.href)}>
              {item.label}
            </Link>
          );
        }
        return (
          // the whole wrapper (tab + dropdown) keeps the pill on Services
          <div className="nav-services" key={item.href} onMouseEnter={() => setHovered(item.href)}>
            <Link {...tabProps} className="nav-tab nav-services-trigger">
              {item.label}
              <span className="nav-caret" aria-hidden="true"></span>
            </Link>
            <div className="nav-services-panel">
              <div className="nav-services-inner">
                {PILLARS.map((pillar) => (
                  <div className="nav-services-col" key={pillar}>
                    <p className="nav-services-heading">{pillar}</p>
                    <ul>
                      {servicesByPillar(pillar).map((s) => (
                        <li key={s.slug}>
                          <Link href={`/services/${s.slug}`}>{s.title}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                <div className="nav-services-col nav-services-cta">
                  <p className="nav-services-heading">All services</p>
                  <p className="nav-services-copy">{SERVICES.length} disciplines under three pillars: Marketing, Branding, and Build.</p>
                  <Link href="/services" className="nav-services-viewall">
                    View all <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
