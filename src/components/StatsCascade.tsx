"use client";

import { useEffect, useRef } from "react";
import styles from "./StatsCascade.module.css";

export interface CascadeStat {
  label: string;
  value: string;
  emoji: string;
  /** count-up start value (defaults to 0) */
  from?: number;
}

const POINTS = 9;
const GRAVITY = 0.45;
const DAMPING = 0.985;
const ITERATIONS = 5;
const REACH_SQ = 40 * 40;
const SLEEP_ENERGY = 0.05;
const SLEEP_FRAMES = 20;

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

// One stat: a thin line + pagination dots, a pin on the line, an emoji hung
// from it on a hand-rolled verlet rope, and the label/number row below. The
// rope runs on requestAnimationFrame only while it's moving and on screen.
function StatBlock({ stat, index }: { stat: CascadeStat; index: number }) {
  const blockRef = useRef<HTMLDivElement>(null);
  const hangRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const pinRef = useRef<SVGCircleElement>(null);
  const emojiRef = useRef<HTMLSpanElement>(null);
  const numberRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const block = blockRef.current;
    const hang = hangRef.current;
    const path = pathRef.current;
    const pin = pinRef.current;
    const emoji = emojiRef.current;
    const numEl = numberRef.current;
    if (!block || !hang || !path || !pin || !emoji || !numEl) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pts: { x: number; y: number; px: number; py: number }[] = [];
    let w = 0;
    let thread = 140;
    let rest = thread / (POINTS - 1);
    let raf = 0;
    let awake = false;
    let visible = false;
    let started = false;
    let calm = 0;
    let drag = -1;
    let last: { x: number; y: number } | null = null;

    const draw = () => {
      let d = `M${pts[0].x},${pts[0].y}`;
      for (let i = 1; i < POINTS - 1; i++) {
        const mx = (pts[i].x + pts[i + 1].x) / 2;
        const my = (pts[i].y + pts[i + 1].y) / 2;
        d += ` Q${pts[i].x},${pts[i].y} ${mx},${my}`;
      }
      const end = pts[POINTS - 1];
      d += ` L${end.x},${end.y}`;
      path.setAttribute("d", d);
      pin.setAttribute("cx", String(pts[0].x));
      pin.setAttribute("cy", String(pts[0].y));
      const prev = pts[POINTS - 2];
      const angle = Math.atan2(-(end.x - prev.x), end.y - prev.y);
      emoji.style.transform = `translate(${end.x}px, ${end.y}px) rotate(${angle}rad) translate(-50%, 0)`;
    };

    // `dropped` starts every point at the pin so gravity unfolds the rope.
    const build = (dropped: boolean) => {
      const cs = getComputedStyle(hang);
      thread = parseFloat(cs.getPropertyValue("--thread")) || 140;
      const anchorRatio = parseFloat(cs.getPropertyValue("--anchor")) || 0.75;
      w = hang.clientWidth;
      rest = thread / (POINTS - 1);
      const ax = w * anchorRatio;
      pts.length = 0;
      for (let i = 0; i < POINTS; i++) {
        const x = ax + (dropped ? i * 0.3 : 0);
        const y = dropped ? 0 : i * rest;
        pts.push({ x, y, px: x, py: y });
      }
      draw();
    };

    const step = () => {
      for (let i = 1; i < POINTS; i++) {
        if (i === drag) continue;
        const p = pts[i];
        const vx = (p.x - p.px) * DAMPING;
        const vy = (p.y - p.py) * DAMPING;
        p.px = p.x;
        p.py = p.y;
        p.x += vx;
        p.y += vy + GRAVITY;
      }
      for (let it = 0; it < ITERATIONS; it++) {
        for (let i = 0; i < POINTS - 1; i++) {
          const a = pts[i];
          const b = pts[i + 1];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.hypot(dx, dy) || 1e-6;
          const diff = (dist - rest) / dist;
          const aFixed = i === 0 || i === drag;
          const bFixed = i + 1 === drag;
          if (aFixed && bFixed) continue;
          if (aFixed) {
            b.x -= dx * diff;
            b.y -= dy * diff;
          } else if (bFixed) {
            a.x += dx * diff;
            a.y += dy * diff;
          } else {
            a.x += dx * diff * 0.5;
            a.y += dy * diff * 0.5;
            b.x -= dx * diff * 0.5;
            b.y -= dy * diff * 0.5;
          }
        }
      }
    };

    const tick = () => {
      raf = 0;
      step();
      draw();
      let energy = 0;
      for (let i = 1; i < POINTS; i++) energy += Math.abs(pts[i].x - pts[i].px) + Math.abs(pts[i].y - pts[i].py);
      calm = energy < SLEEP_ENERGY && drag < 0 ? calm + 1 : 0;
      if (calm >= SLEEP_FRAMES) {
        awake = false;
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    const wake = () => {
      awake = true;
      calm = 0;
      if (visible && !raf) raf = requestAnimationFrame(tick);
    };

    const pointerLocal = (e: PointerEvent) => {
      const r = hang.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };

    const onMove = (e: PointerEvent) => {
      if (!visible) return;
      const vx = last ? clamp(e.clientX - last.x, -30, 30) : 0;
      const vy = last ? clamp(e.clientY - last.y, -30, 30) : 0;
      last = { x: e.clientX, y: e.clientY };
      const { x, y } = pointerLocal(e);
      if (drag >= 0) {
        const p = pts[drag];
        p.px = p.x;
        p.py = p.y;
        p.x = x;
        p.y = y;
        wake();
        return;
      }
      if (e.pointerType === "touch") return;
      let hit = false;
      for (let i = 1; i < POINTS; i++) {
        const dx = pts[i].x - x;
        const dy = pts[i].y - y;
        if (dx * dx + dy * dy < REACH_SQ) {
          pts[i].x += vx * 0.5;
          pts[i].y += vy * 0.5;
          hit = true;
        }
      }
      if (hit) wake();
    };

    const onDown = (e: PointerEvent) => {
      drag = POINTS - 1;
      emoji.setPointerCapture(e.pointerId);
      last = { x: e.clientX, y: e.clientY };
      wake();
    };
    const onUp = () => {
      if (drag < 0) return;
      drag = -1;
      wake();
    };

    // number count-up (the final value is server-rendered, so no-JS and
    // reduced-motion readers just see it)
    const match = /^(\d+)(.*)$/.exec(stat.value);
    const target = match ? Number(match[1]) : 0;
    const suffix = match ? match[2] : "";
    const from = stat.from ?? 0;
    if (!reduce && match) numEl.textContent = `${from}${suffix}`;
    const countUp = () => {
      if (reduce || !match) return;
      const t0 = performance.now();
      const run = (now: number) => {
        const t = clamp((now - t0) / 1400, 0, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        numEl.textContent = `${Math.round(from + (target - from) * eased)}${suffix}`;
        if (t < 1) requestAnimationFrame(run);
      };
      requestAnimationFrame(run);
    };

    build(false);

    const ro = new ResizeObserver(() => {
      const cs = getComputedStyle(hang);
      const nextThread = parseFloat(cs.getPropertyValue("--thread")) || 140;
      if (hang.clientWidth === w && nextThread === thread) return;
      build(false);
    });
    ro.observe(hang);

    if (reduce) {
      return () => ro.disconnect();
    }

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !started) {
        started = true;
        // staggered drop + count-up on first scroll-in
        window.setTimeout(() => {
          build(true);
          wake();
          countUp();
        }, index * 140);
      } else if (visible && awake && !raf) {
        raf = requestAnimationFrame(tick);
      } else if (!visible && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    });
    io.observe(block);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    emoji.addEventListener("pointerdown", onDown);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      emoji.removeEventListener("pointerdown", onDown);
    };
  }, [stat.value, stat.from, index]);

  return (
    <div className={styles.block} ref={blockRef}>
      <div className={styles.dots} aria-hidden="true">
        {[0, 1, 2].map((d) => (
          <span className={d === index ? styles.active : ""} key={d}></span>
        ))}
      </div>
      <div className={styles.hang} ref={hangRef}>
        <svg className={styles.rope} aria-hidden="true">
          <path ref={pathRef} className={styles.thread} />
          <circle ref={pinRef} className={styles.pin} r="3" />
        </svg>
        <span className={styles.emoji} ref={emojiRef} aria-hidden="true">
          {stat.emoji}
        </span>
      </div>
      <div className={styles.row}>
        <p className={styles.label}>{stat.label}</p>
        <p className={styles.number} ref={numberRef}>
          {stat.value}
        </p>
      </div>
    </div>
  );
}

export default function StatsCascade({ stats }: { stats: CascadeStat[] }) {
  return (
    <div className={styles.cascade}>
      {stats.map((stat, i) => (
        <StatBlock stat={stat} index={i} key={stat.label} />
      ))}
    </div>
  );
}
