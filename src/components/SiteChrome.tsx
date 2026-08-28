"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { animate as rawAnimate, inView, stagger } from "motion";

// Motion's vanilla animate(element, keyframes) overload types its
// keyframes as DOMKeyframesDefinition, which explicitly omits x/y/z
// (framer-motion/dom excludes them from CSSStyleDeclarationWithTransform,
// almost certainly to avoid colliding with SVG's own x/y attributes) --
// even though the runtime fully supports them as transform shortcuts.
// Every call in this file relies on that runtime behavior (x/y/scale/
// opacity on plain elements), so animate is retyped once here rather
// than fighting the same upstream mismatch at every call site.
const animate = rawAnimate as unknown as (
  target: Element | Element[] | NodeListOf<Element> | string | null | undefined,
  keyframes: Record<string, unknown>,
  options?: Record<string, unknown>
) => ReturnType<typeof rawAnimate>;

// Shared chrome behavior needed on every page — mobile nav, reveal-on-scroll,
// magnetic buttons, back-to-top, year. The intro loader lives in its own
// IntroLoader component (see that file for why). Ported verbatim from
// BaseLayout.astro's inline <script>, run once on mount instead of once per
// page load, and skipped entirely under prefers-reduced-motion.
export default function SiteChrome() {
  const pathname = usePathname();

  // Per-page bindings: mobile nav, reveal-on-scroll, magnetic buttons,
  // back-to-top, year. Re-runs on every client-side route change since
  // each page swaps in its own Header/Footer/.reveal nodes under this
  // persistent root layout.
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const easeReveal = [0.75, 0, 0.25, 1] as const;
    const revealDuration = 0.8;
    const inViewOptions = { amount: 0.15, margin: "0px 0px -8% 0px" } as const;

    // Every listener attached below is torn down in this effect's cleanup.
    // Without that, React dev mode's StrictMode double-invoke (mount ->
    // cleanup -> mount) leaves two listeners on the same element -- e.g.
    // two click handlers on navToggle that fire on the same click and
    // cancel each other out (one flips the panel open, the second flips it
    // straight back closed), which is exactly what made the mobile nav
    // look broken.
    const cleanups: Array<() => void> = [];

    const navToggle = document.getElementById("navToggle");
    const mobileNavPanel = document.getElementById("mobileNavPanel");
    if (navToggle && mobileNavPanel) {
      const onToggleClick = () => {
        const open = navToggle.getAttribute("aria-expanded") === "true";
        navToggle.setAttribute("aria-expanded", String(!open));
        mobileNavPanel.classList.toggle("is-open", !open);
        document.body.style.overflow = !open ? "hidden" : "";
      };
      navToggle.addEventListener("click", onToggleClick);
      cleanups.push(() => navToggle.removeEventListener("click", onToggleClick));

      const onLinkClick = () => {
        navToggle.setAttribute("aria-expanded", "false");
        mobileNavPanel.classList.remove("is-open");
        document.body.style.overflow = "";
      };
      const links = Array.from(mobileNavPanel.querySelectorAll("a"));
      links.forEach((a) => a.addEventListener("click", onLinkClick));
      cleanups.push(() => links.forEach((a) => a.removeEventListener("click", onLinkClick)));
    }

    if (!reduceMotion) {
      document.querySelectorAll<HTMLElement>(".reveal").forEach((el) => {
        inView(
          el,
          () => {
            animate(el, { opacity: [0, 1], y: [56, 0] }, { duration: revealDuration, easing: easeReveal });
          },
          inViewOptions
        );
      });

      let lineIndex = 0;
      document.querySelectorAll<HTMLElement>(".reveal-line").forEach((line) => {
        const span = line.querySelector("span");
        if (!span) return;
        const delay = (lineIndex++ % 3) * 0.07;
        inView(
          line,
          () => {
            animate(span, { y: ["110%", "0%"] }, { duration: revealDuration, easing: easeReveal, delay });
          },
          inViewOptions
        );
      });

      document.querySelectorAll<HTMLElement>(".reveal-words").forEach((group) => {
        const words = group.querySelectorAll<HTMLElement>(".word-mask > span");
        if (!words.length) return;
        inView(
          group,
          () => {
            animate(words, { y: ["110%", "0%"] }, { duration: revealDuration, easing: easeReveal, delay: stagger(0.055) });
          },
          { amount: 0.3 }
        );
      });
    }

    function animateCount(el: Element) {
      const target = parseFloat((el as HTMLElement).dataset.count ?? "0");
      const decimal = (el as HTMLElement).dataset.decimal;
      const duration = 1400;
      const start = performance.now();

      function frame(now: number) {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        const value = target * eased;
        el.textContent = decimal !== undefined ? `${Math.floor(value)}.${decimal}` : Math.round(value).toLocaleString();
        if (t < 1) requestAnimationFrame(frame);
        else el.textContent = decimal !== undefined ? `${target}.${decimal}` : target.toLocaleString();
      }
      requestAnimationFrame(frame);
    }

    const countEls = document.querySelectorAll("[data-count]");
    let countIo: IntersectionObserver | undefined;
    if (reduceMotion || !("IntersectionObserver" in window)) {
      countEls.forEach((el) => {
        const target = (el as HTMLElement).dataset.count ?? "0";
        const decimal = (el as HTMLElement).dataset.decimal;
        el.textContent = decimal !== undefined ? `${target}.${decimal}` : Number(target).toLocaleString();
      });
    } else {
      countIo = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animateCount(entry.target);
              countIo?.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.6 }
      );
      countEls.forEach((el) => countIo?.observe(el));
    }

    const glow = document.getElementById("ctaGlow");
    if (glow && !reduceMotion && matchMedia("(hover: hover)").matches) {
      let rect: DOMRect | null = null;
      let pendingX = 0;
      let pendingY = 0;
      let rafId = 0;

      const flush = () => {
        rafId = 0;
        glow.style.transform = `translate3d(${pendingX}px, ${pendingY}px, 0) translate(-50%, -50%)`;
      };

      document.querySelectorAll<HTMLElement>(".magnetic").forEach((btn) => {
        const strength = 14;
        const onEnter = () => {
          rect = btn.getBoundingClientRect();
          glow.style.opacity = "1";
        };
        const onMove = (e: MouseEvent) => {
          if (!rect) rect = btn.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          btn.style.transform = `translate(${(x / rect.width) * strength}px, ${(y / rect.height) * strength}px)`;
          pendingX = e.clientX;
          pendingY = e.clientY;
          if (!rafId) rafId = requestAnimationFrame(flush);
        };
        const onLeave = () => {
          btn.style.transform = "translate(0,0)";
          glow.style.opacity = "0";
          rect = null;
        };
        btn.addEventListener("mouseenter", onEnter);
        btn.addEventListener("mousemove", onMove);
        btn.addEventListener("mouseleave", onLeave);
        cleanups.push(() => {
          btn.removeEventListener("mouseenter", onEnter);
          btn.removeEventListener("mousemove", onMove);
          btn.removeEventListener("mouseleave", onLeave);
        });
      });
    }

    const toTop = document.getElementById("toTop");
    const handleToTop = () => {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    };
    toTop?.addEventListener("click", handleToTop);

    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());

    return () => {
      countIo?.disconnect();
      toTop?.removeEventListener("click", handleToTop);
      cleanups.forEach((fn) => fn());
    };
  }, [pathname]);

  return null;
}
