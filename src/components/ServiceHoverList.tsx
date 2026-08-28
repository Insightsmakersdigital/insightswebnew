"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Service } from "../data/site";
import styles from "../app/services/services.module.css";

interface Row {
  service: Service;
  number: string;
  image: string;
}

// Tunable knobs for the effect. imageSize scales the preview image (see
// --preview-scale in services.module.css); duration/smoothness drive the
// highlight-band and image reveal/hide tweens (smoothness maps to a GSAP
// ease "power" -- higher is a slower, softer settle); lerp is the
// per-frame interpolation factor for the image's cursor-follow, same
// `pos += (target - pos) * lerp` pattern already used in TeamHero's
// cursor parallax, rather than a discrete GSAP tween.
const CONFIG = {
  imageSize: 1,
  duration: 0.4,
  smoothness: 0.85,
  lerp: 0.49,
} as const;

const EASE_POWER = Math.min(4, Math.max(1, Math.round(CONFIG.smoothness * 4)));
const EASE_OUT = `power${EASE_POWER}.out`;
const IMAGE_OFFSET_MULTIPLIER = 16;
const HIDDEN_CLIP = "inset(50%)";
const VISIBLE_CLIP = "inset(0%)";

// Row-hover list: a highlight band tracks the hovered row and a clipped,
// difference-blended preview image reveals next to it. Adapted from the
// Hyperiux "interactive list preview" pattern (see services.module.css's
// header comment for what changed vs. the original) -- geometry (band
// position, image clip-path, cursor parallax) is GSAP-driven exactly like
// this file's siblings (StatementSection, ApproachTrack, TeamHero); color
// state is a plain `.isActive` CSS class so it stays theme-token-correct.
export default function ServiceHoverList({ rows }: { rows: Row[] }) {
  const router = useRouter();
  const stageRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLTableElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const imageLayerRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<Array<HTMLDivElement | null>>([]);
  const rowRefs = useRef<Array<HTMLTableRowElement | null>>([]);

  useEffect(() => {
    const stage = stageRef.current;
    const table = tableRef.current;
    const highlight = highlightRef.current;
    const imageLayer = imageLayerRef.current;
    if (!stage || !table || !highlight || !imageLayer) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return; // CSS-only static state is the whole experience here

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    (async () => {
      const { default: gsap } = await import("gsap");
      if (cancelled) return;

      let activeIndex: number | null = null;
      let zIndex = 10;

      const moveHighlight = (row: HTMLTableRowElement) => {
        const tableBounds = table.getBoundingClientRect();
        const rowBounds = row.getBoundingClientRect();
        gsap.to(highlight, {
          y: rowBounds.top - tableBounds.top,
          height: rowBounds.height,
          opacity: 1,
          duration: CONFIG.duration,
          ease: EASE_OUT,
          overwrite: "auto",
        });
      };

      const hideImage = (index: number) => {
        const el = imageRefs.current[index];
        if (!el) return;
        gsap.to(el, {
          clipPath: HIDDEN_CLIP,
          opacity: 0,
          duration: CONFIG.duration,
          ease: EASE_OUT,
          onComplete: () => gsap.set(el, { visibility: "hidden" }),
        });
      };

      const showImage = (index: number) => {
        const el = imageRefs.current[index];
        if (!el) return;
        zIndex += 1;
        gsap.killTweensOf(el);
        gsap.set(el, { zIndex, visibility: "visible", clipPath: HIDDEN_CLIP, opacity: 1 });
        gsap.to(el, { clipPath: VISIBLE_CLIP, duration: CONFIG.duration, ease: EASE_OUT });
      };

      const rowHandlers: Array<{ row: HTMLTableRowElement; enter: () => void; leave: () => void }> = [];

      rowRefs.current.forEach((row, index) => {
        if (!row) return;
        const enter = () => {
          if (activeIndex !== null && activeIndex !== index) {
            rowRefs.current[activeIndex]?.classList.remove(styles.isActive);
            hideImage(activeIndex);
          }
          activeIndex = index;
          row.classList.add(styles.isActive);
          showImage(index);
          moveHighlight(row);
        };
        const leave = () => {
          hideImage(index);
        };
        row.addEventListener("mouseenter", enter);
        row.addEventListener("mouseleave", leave);
        rowHandlers.push({ row, enter, leave });
      });

      const onTableLeave = () => {
        if (activeIndex !== null) {
          rowRefs.current[activeIndex]?.classList.remove(styles.isActive);
          activeIndex = null;
        }
        gsap.to(highlight, { opacity: 0, duration: 0.3, ease: "power2.out", overwrite: "auto" });
      };
      table.addEventListener("mouseleave", onTableLeave);

      // Cursor parallax on the preview image -- a continuous per-frame
      // lerp toward the pointer target (CONFIG.lerp is the interpolation
      // factor) rather than a discrete GSAP tween per mousemove event, so
      // the image trails the cursor smoothly instead of re-easing on
      // every pixel of movement.
      let targetX = 0;
      let targetY = 0;
      let currentX = 0;
      let currentY = 0;
      let rafId = 0;

      const tick = () => {
        currentX += (targetX - currentX) * CONFIG.lerp;
        currentY += (targetY - currentY) * CONFIG.lerp;
        gsap.set(imageLayer, { x: currentX, y: currentY });
        rafId = requestAnimationFrame(tick);
      };
      rafId = requestAnimationFrame(tick);

      const onMouseMove = (e: MouseEvent) => {
        const bounds = stage.getBoundingClientRect();
        const x = (e.clientX - bounds.left) / bounds.width - 0.5;
        const y = (e.clientY - bounds.top) / bounds.height - 0.5;
        targetX = x * IMAGE_OFFSET_MULTIPLIER;
        targetY = y * IMAGE_OFFSET_MULTIPLIER;
      };
      stage.addEventListener("mousemove", onMouseMove);

      cleanup = () => {
        rowHandlers.forEach(({ row, enter, leave }) => {
          row.removeEventListener("mouseenter", enter);
          row.removeEventListener("mouseleave", leave);
        });
        table.removeEventListener("mouseleave", onTableLeave);
        stage.removeEventListener("mousemove", onMouseMove);
        cancelAnimationFrame(rafId);
        gsap.killTweensOf(highlight);
        imageRefs.current.forEach((el) => el && gsap.killTweensOf(el));
      };
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [rows]);

  const goTo = (slug: string) => router.push(`/services/${slug}`);

  return (
    <>
      <div className={styles.stage} ref={stageRef} style={{ "--preview-scale": CONFIG.imageSize } as React.CSSProperties}>
        <div className={styles.highlight} ref={highlightRef} aria-hidden="true" />
        <div className={styles.imageLayer} ref={imageLayerRef} aria-hidden="true">
          {rows.map((r, i) => (
            <div className={styles.previewImage} ref={(el) => { imageRefs.current[i] = el; }} key={r.service.slug}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={r.image} alt="" />
            </div>
          ))}
        </div>

        <table className={styles.table} ref={tableRef}>
          <tbody>
            {rows.map((r, i) => (
              <tr
                className={styles.row}
                ref={(el) => { rowRefs.current[i] = el; }}
                key={r.service.slug}
                onClick={() => goTo(r.service.slug)}
                tabIndex={0}
                role="link"
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    goTo(r.service.slug);
                  }
                }}
              >
                <td className={`${styles.cell} ${styles.cellIndex}`}>{r.number}</td>
                <td className={`${styles.cell} ${styles.cellTitle}`}>
                  <Link href={`/services/${r.service.slug}`} tabIndex={-1}>
                    {r.service.title}
                  </Link>
                </td>
                <td className={`${styles.cell} ${styles.cellPillar}`}>{r.service.pillar}</td>
                <td className={`${styles.cell} ${styles.cellHeadline}`}>{r.service.headline}</td>
                <td className={`${styles.cell} ${styles.cellArrow}`} aria-hidden="true">
                  →
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.mobileList}>
        {rows.map((r) => (
          <Link href={`/services/${r.service.slug}`} className={styles.mobileRow} key={r.service.slug}>
            <div className={styles.mobileText}>
              <p className={styles.mobileIndex}>{r.number}</p>
              <p className={styles.mobileTitle}>{r.service.title}</p>
              <p className={styles.mobilePillar}>{r.service.pillar}</p>
              <p className={styles.mobileHeadline}>{r.service.headline}</p>
            </div>
            <div className={styles.mobileImage}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={r.image} alt={r.service.title} />
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
