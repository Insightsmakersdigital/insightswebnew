"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import HoldButton from "./HoldButton";
import { CONTACT, SITE_SHORT, PILLARS, servicesByPillar } from "../data/site";
import { isCurrent, type NavItem } from "./navUtils";

/* Mobile nav: logo and menu bubbles (one island once scrolled), and a glass
   card that grows down out of them. The page stays visible, dimmed. */
export default function MobileNav({ navItems, whatsappHref }: { navItems: NavItem[]; whatsappHref: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const close = () => setOpen(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
        return;
      }
      if (e.key !== "Tab" || !rootRef.current) return;
      // keep keyboard focus inside the bar + card while the menu is open
      const items = Array.from(rootRef.current.querySelectorAll<HTMLElement>("a[href], button")).filter(
        (el) => !el.closest("[inert]") && el.offsetParent !== null
      );
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };
    const desktop = window.matchMedia("(min-width: 901px)");
    const onDesktop = () => desktop.matches && setOpen(false);

    document.addEventListener("keydown", onKey);
    desktop.addEventListener("change", onDesktop);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onDesktop);
    };
  }, [open]);

  const toggle = () => {
    if (!open) setServicesOpen(false);
    setOpen(!open);
  };

  return (
    <div className={`nav-mobile${open ? " is-open" : ""}`} ref={rootRef}>
      <div className="nav-island nav-mobile-bar">
        <Link href="/" className="nav-bubble nav-bubble-logo" onClick={close}>
          <img src="/logo.png" alt={SITE_SHORT} />
        </Link>
        <div className="nav-bubble nav-bubble-toggle">
          <button
            ref={toggleRef}
            type="button"
            className="nav-mobile-toggle"
            aria-expanded={open}
            aria-controls="mobileNavPanel"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={toggle}
          >
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      <div className="nav-mobile__scrim" aria-hidden="true" onClick={close}></div>

      <div className="nav-mobile__panel" id="mobileNavPanel" inert={!open}>
        <nav className="nav-mobile-items" aria-label="Mobile">
          {navItems.map((item, i) => {
            const current = isCurrent(pathname, item.href);
            const link = (
              <Link href={item.href} className="nav-mobile-link" aria-current={current ? "page" : undefined} onClick={close}>
                {item.label}
              </Link>
            );
            const style = { "--i": i } as CSSProperties;

            if (item.href !== "/services") {
              return (
                <div className="nav-mobile-row" style={style} key={item.href}>
                  {link}
                </div>
              );
            }
            return (
              <div className="nav-mobile-row" style={style} key={item.href}>
                <div className="nav-mobile-split">
                  {link}
                  <button
                    type="button"
                    className="nav-mobile-expand"
                    aria-expanded={servicesOpen}
                    aria-controls="mobileServices"
                    aria-label={servicesOpen ? "Hide all services" : "Show all services"}
                    onClick={() => setServicesOpen(!servicesOpen)}
                  >
                    <span className="nav-caret" aria-hidden="true"></span>
                  </button>
                </div>
                <div
                  id="mobileServices"
                  className={`nav-mobile-sub${servicesOpen ? " is-open" : ""}`}
                  inert={!servicesOpen}
                >
                  <div>
                    {PILLARS.map((pillar) => (
                      <div className="nav-mobile-pillar" key={pillar}>
                        <p>{pillar}</p>
                        <ul>
                          {servicesByPillar(pillar).map((s) => (
                            <li key={s.slug}>
                              <Link href={`/services/${s.slug}`} onClick={close}>
                                {s.title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </nav>
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
            onHold={() => window.open(whatsappHref, "_blank", "noopener,noreferrer")}
            className="nav-mobile-cta"
          >
            Start a project
          </HoldButton>
          <div className="nav-mobile-contact">
            <a href={`tel:${CONTACT.phones[0].replace(/\s/g, "")}`}>Call us</a>
            <a href={`mailto:${CONTACT.email}`}>Email us</a>
          </div>
        </div>
      </div>
    </div>
  );
}
