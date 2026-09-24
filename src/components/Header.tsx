"use client";

import Link from "next/link";
import HoldButton from "./HoldButton";
import { SITE_SHORT, SERVICES, PILLARS, servicesByPillar } from "../data/site";

const WHATSAPP_HREF = "https://wa.me/917012151014?text=Hi%2C+I%27d+like+to+get+in+touch.";

interface NavItem {
  label: string;
  href: string;
}

const DEFAULT_NAV_ITEMS: NavItem[] = [
  { label: "Work", href: "/work" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Team", href: "/team" },
  { label: "Contact", href: "/contact" },
];

export default function Header({ navItems = DEFAULT_NAV_ITEMS }: { navItems?: NavItem[] }) {
  return (
    <header className="site-header" id="siteHeader">
      {/* Desktop nav -- a fully separate element from .nav-mobile below, not
          one responsive row with things display:none'd. */}
      <nav className="nav-desktop" aria-label="Primary">
        <div className="wrap nav-desktop-inner">
          <Link href="/" className="brand">
            <img src="/logo.png" alt={SITE_SHORT} className="brand-logo" />
          </Link>
          <div className="nav-desktop-links">
            {navItems.map((item) =>
              item.href === "/services" ? (
                <div className="nav-services" key={item.href}>
                  <Link href={item.href} className="nav-services-trigger">
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
              ) : (
                <Link href={item.href} key={item.href}>
                  {item.label}
                </Link>
              )
            )}
          </div>
          <div className="header-actions">
            <HoldButton
              doneLabel="welcome"
              backgroundColor="#000000"
              fillColor="#1cd0ab"
              textColor="#f5f5f5"
              fillTextColor="#ffffff"
              size="md"
              radius={20}
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

      {/* Mobile nav -- a persistent closed bar (logo + toggle only, nothing
          else) plus a full-screen panel that's entirely absent from layout
          until opened. */}
      <div className="nav-mobile">
        <div className="wrap nav-mobile-bar">
          <Link href="/" className="brand nav-mobile-brand">
            <img src="/logo.png" alt={SITE_SHORT} className="brand-logo" />
          </Link>
          <button
            className="nav-mobile-toggle"
            id="navToggle"
            aria-expanded="false"
            aria-controls="mobileNavPanel"
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
          </button>
        </div>

        <div className="nav-mobile__panel" id="mobileNavPanel">
          <div className="nav-mobile-items">
            {navItems.map((item) => (
              <Link href={item.href} key={item.href}>
                {item.label}
              </Link>
            ))}
          </div>
          <div className="nav-mobile-footer">
            <HoldButton
              backgroundColor="#111111"
              fillColor="#00c951"
              textColor="#f6f6f6"
              fillTextColor="#0f0f0f"
              size="lg"
              radius={999}
              fillDirection="right"
              holdTime={600}
              releaseTime={150}
              pressScale={0.97}
              wave
              waveAmplitude={10}
              glow
              resetAfter={400}
              onHold={() => window.open(WHATSAPP_HREF, "_blank", "noopener,noreferrer")}
              className="nav-mobile-cta"
            >
              Start a project
            </HoldButton>
          </div>
        </div>
      </div>
    </header>
  );
}
