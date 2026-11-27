"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import HoldButton from "./HoldButton";
import DesktopTabs from "./DesktopTabs";
import MobileNav from "./MobileNav";
import type { NavItem } from "./navUtils";
import { SITE_SHORT } from "../data/site";

const WHATSAPP_HREF = "https://wa.me/917012151014?text=Hi%2C+I%27d+like+to+get+in+touch.";

const DEFAULT_NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/work" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Team", href: "/team" },
  { label: "Contact", href: "/contact" },
];

/* true once the page has scrolled: the bubbles merge into one island. Two
   thresholds so it can't flicker when the scroll rests near the edge. */
function useMerged() {
  const [merged, setMerged] = useState(false);
  useEffect(() => {
    const update = () => setMerged((was) => window.scrollY > (was ? 8 : 32));
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  return merged;
}

export default function Header({ navItems = DEFAULT_NAV_ITEMS }: { navItems?: NavItem[] }) {
  const merged = useMerged();

  return (
    <>
    <div className="nav-underlay" aria-hidden="true"></div>
    <header className="site-header" id="siteHeader" data-merged={merged}>
      {/* Desktop nav -- a fully separate element from .nav-mobile below, not
          one responsive row with things display:none'd. */}
      <nav className="nav-desktop" aria-label="Primary">
        <div className="nav-island nav-cluster">
          <Link href="/" className="nav-bubble nav-bubble-logo">
            <img src="/logo.png" alt={SITE_SHORT} />
          </Link>
          <div className="nav-bubble nav-bubble-tabs">
            <DesktopTabs navItems={navItems} />
          </div>
          <div className="nav-bubble nav-bubble-cta">
            <HoldButton
              doneLabel="welcome"
              backgroundColor="#000000"
              fillColor="#1cd0ab"
              textColor="#f5f5f5"
              fillTextColor="#ffffff"
              size="md"
              radius={999}
              fillDirection="up"
              holdTime={400}
              releaseTime={100}
              pressScale={0.92}
              wave
              waveAmplitude={12}
              glow
              resetAfter={500}
              onHold={() => window.open(WHATSAPP_HREF, "_blank", "noopener,noreferrer")}
              className="nav-cta-specular"
            >
              Start a project
            </HoldButton>
          </div>
        </div>
      </nav>

      <MobileNav navItems={navItems} whatsappHref={WHATSAPP_HREF} />
    </header>
    </>
  );
}
