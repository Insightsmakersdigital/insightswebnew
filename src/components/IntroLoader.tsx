"use client";

import { useEffect, useRef, useState } from "react";
import { animate as rawAnimate } from "motion";

const animate = rawAnimate as unknown as (
  target: Element | Element[] | NodeListOf<Element> | string | null | undefined,
  keyframes: Record<string, unknown>,
  options?: Record<string, unknown>
) => ReturnType<typeof rawAnimate>;

// Intro loader — two stacked wordmark copies at identical fixed
// center-screen coordinates: a dark one sitting under the overlay
// (.loader-decoy) and a light one inside it (.loader-text). The overlay is
// erased via clip-path, never a transform -- transforming the overlay
// would drag its light wordmark (a child) along with it. As the clip edge
// sweeps up through the letters, the dark copy shows through underneath,
// reading as a hard colour swap rather than motion. Only after the overlay
// is gone does the (now-revealed) dark copy get its own, separate
// transform: a measured move+scale onto the real H1's exact position.
//
// This is a self-contained component (not driven by SiteChrome) so that
// unmounting it goes through React's own state (`visible` -> render
// nothing) rather than a raw `element.remove()` call. Removing a node
// that React also renders via DOM APIs desyncs React's fiber tree from
// the real DOM -- the next time React reconciles this part of the tree
// (e.g. a client-side route change swapping the page below), it computes
// sibling insertion points based on children it still believes exist,
// and throws "insertBefore"/"removeChild: not a child of this node".
export default function IntroLoader({ brand }: { brand: string }) {
  const [visible, setVisible] = useState(true);
  const ranRef = useRef(false);

  useEffect(() => {
    if (ranRef.current) return;
    ranRef.current = true;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const easeReveal = [0.75, 0, 0.25, 1] as const;
    const easeSweep = [0.76, 0, 0.24, 1] as const;
    const easeHandoff = [0.4, 0, 0.2, 1] as const;

    const loader = document.getElementById("loader");
    const loaderDecoyStage = document.querySelector<HTMLElement>(".loader-decoy-stage");
    const loaderText = document.getElementById("loaderText");
    const loaderDecoy = document.getElementById("loaderDecoy");
    const heroBrand = document.getElementById("heroBrand");

    if (reduceMotion || !loaderDecoyStage || !loaderText || !loaderDecoy || !heroBrand || !loader) {
      setVisible(false);
      return;
    }

    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
    document.body.style.overflow = "hidden";
    heroBrand.style.visibility = "hidden";

    let cleaned = false;
    const cleanup = () => {
      if (cleaned) return;
      cleaned = true;
      document.body.style.overflow = "";
      heroBrand.style.visibility = "";
      setVisible(false);
    };
    const safety = window.setTimeout(cleanup, 4000);

    (async () => {
      try {
        if (document.fonts?.ready) {
          await document.fonts.ready;
        }

        await animate(loaderText, { opacity: [0, 1] }, { duration: 0.3, easing: easeReveal });

        const from = loaderDecoy.getBoundingClientRect();
        const to = heroBrand.getBoundingClientRect();
        const fromSize = parseFloat(getComputedStyle(loaderDecoy).fontSize);
        const toSize = parseFloat(getComputedStyle(heroBrand).fontSize);
        const dx = to.left - from.left;
        const dy = to.top - from.top;
        const scale = toSize / fromSize;
        await animate(
          [loaderText, loaderDecoy],
          { x: [0, dx], y: [0, dy], scale: [1, scale] },
          { duration: 0.6, easing: easeHandoff }
        );

        await animate(loader, { clipPath: ["inset(0 0 0 0)", "inset(0 0 100% 0)"] }, { duration: 0.9, easing: easeSweep });
      } catch {
        // swallow -- cleanup() below runs regardless of how we got here
      } finally {
        window.clearTimeout(safety);
        cleanup();
      }
    })();

    return () => window.clearTimeout(safety);
  }, []);

  if (!visible) return null;

  return (
    <>
      <div className="loader-decoy-stage" aria-hidden="true">
        <span className="loader-wordmark loader-decoy" id="loaderDecoy">
          {brand}
        </span>
      </div>
      <div className="loader" id="loader" aria-hidden="true">
        <span className="loader-wordmark loader-text" id="loaderText">
          {brand}
        </span>
      </div>
    </>
  );
}
