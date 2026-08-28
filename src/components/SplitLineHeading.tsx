"use client";

import { useEffect, useRef } from "react";

// Heading line-mask reveal -- splits the heading's words into spans, lets
// the browser wrap them normally, measures which words land on the same
// line (grouped by matching getBoundingClientRect().top), then rebuilds
// the heading as one block-level, overflow:hidden mask per detected line.
// Ported from index.astro's contact-heading split script; there's no way
// to know where the browser will actually break responsive text without
// asking it first, so this runs the same measure-then-rebuild dance on
// mount.
export default function SplitLineHeading({ text, className }: { text: string; className: string }) {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const heading = ref.current;
    if (!heading) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function splitIntoLines() {
      const words = text.split(/\s+/).filter(Boolean);
      heading!.innerHTML = "";
      const wordEls = words.map((w) => {
        const span = document.createElement("span");
        span.textContent = w;
        heading!.appendChild(span);
        heading!.appendChild(document.createTextNode(" "));
        return span;
      });

      const lineGroups: HTMLElement[][] = [];
      let lastTop: number | null = null;
      wordEls.forEach((word) => {
        const top = word.getBoundingClientRect().top;
        if (lastTop === null || Math.abs(top - lastTop) > 2) {
          lineGroups.push([word]);
          lastTop = top;
        } else {
          lineGroups[lineGroups.length - 1].push(word);
        }
      });

      heading!.innerHTML = "";
      lineGroups.forEach((group) => {
        const mask = document.createElement("span");
        mask.className = "contact-heading-line-mask";
        const inner = document.createElement("span");
        inner.className = "contact-heading-line-inner";
        group.forEach((word, i) => {
          inner.appendChild(word);
          if (i < group.length - 1) inner.appendChild(document.createTextNode(" "));
        });
        mask.appendChild(inner);
        heading!.appendChild(mask);
      });
    }

    splitIntoLines();

    let played = false;
    function play() {
      if (played) return;
      played = true;

      if (reduceMotion) {
        heading!.querySelectorAll<HTMLElement>(".contact-heading-line-inner").forEach((l) => (l.style.transform = "none"));
        return;
      }

      const lines = Array.from(heading!.querySelectorAll<HTMLElement>(".contact-heading-line-inner"));
      lines.forEach((line, i) => {
        line.style.transitionDelay = `${i * 90}ms`;
        line.style.transform = "translateY(0)";
      });
    }

    if (reduceMotion || !("IntersectionObserver" in window)) {
      play();
    } else {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              play();
              io.disconnect();
            }
          });
        },
        { threshold: 0.2 }
      );
      io.observe(heading);
      return () => io.disconnect();
    }
  }, [text]);

  return (
    // dangerouslySetInnerHTML (not a JSX text child) is deliberate here --
    // see the comment in StatementSection.tsx's equivalent split, which
    // uses the same pattern for the same reason: the effect below tears
    // down and rebuilds this element's DOM imperatively, and React must
    // not track individual children or it throws on unmount/navigation.
    <h2 className={className} ref={ref} dangerouslySetInnerHTML={{ __html: escapeHtml(text) }} />
  );
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]!);
}
