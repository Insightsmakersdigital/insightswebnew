"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import "./OptionWheel.css";

interface OptionWheelProps {
  items: string[];
  defaultSelected?: number;
  onChange?: (index: number, item: string) => void;
  textColor?: string;
  activeColor?: string;
  side?: "left" | "right";
  fontSize?: number;
  spacing?: number;
  curve?: number;
  tilt?: number;
  blur?: number;
  fade?: number;
  minOpacity?: number;
  smoothing?: number;
  inset?: number;
  loop?: boolean;
  draggable?: boolean;
  soundUrl?: string;
  soundVolume?: number;
  className?: string;
}

interface WheelConfig {
  count: number;
  items: string[];
  rowH: number;
  curve: number;
  tilt: number;
  blur: number;
  fade: number;
  minOpacity: number;
  side: "left" | "right";
  loop: boolean;
  smoothing: number;
  draggable: boolean;
  soundUrl: string;
  soundVolume: number;
}

export default function OptionWheel({
  items,
  defaultSelected = 0,
  onChange,
  textColor = "#a6a6a6",
  activeColor = "#ffffff",
  side = "left",
  fontSize = 3,
  spacing = 1.4,
  curve = 1,
  tilt = 6,
  blur = 2,
  fade = 0.25,
  minOpacity = 0.05,
  smoothing = 200,
  inset = 80,
  loop = false,
  draggable = true,
  soundUrl = "",
  soundVolume = 0.5,
  className = "",
}: OptionWheelProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const posRef = useRef(defaultSelected);
  const targetRef = useRef(defaultSelected);
  const rafRef = useRef<number | undefined>(undefined);
  const lastRef = useRef<number | undefined>(undefined);
  const cfgRef = useRef<WheelConfig | null>(null);
  const onChangeRef = useRef(onChange);
  const selectedRef = useRef(defaultSelected);
  const wheelTimerRef = useRef<number | undefined>(undefined);
  const dragRef = useRef<{ startY: number; startPos: number } | null>(null);
  const dragMovedRef = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef("");
  const lastTickRef = useRef(0);

  const [selectedIndex, setSelectedIndex] = useState(defaultSelected);
  const [isDragging, setIsDragging] = useState(false);

  const remPx =
    typeof document !== "undefined"
      ? parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
      : 16;
  const rowH = fontSize * spacing * remPx;

  onChangeRef.current = onChange;

  cfgRef.current = {
    count: items.length,
    items,
    rowH,
    curve,
    tilt,
    blur,
    fade,
    minOpacity,
    side,
    loop,
    smoothing,
    draggable,
    soundUrl,
    soundVolume,
  };

  const playTick = useCallback(() => {
    const cfg = cfgRef.current;
    if (!cfg || !cfg.soundUrl) return;
    const now = performance.now();
    if (now - lastTickRef.current < 70) return;
    lastTickRef.current = now;

    if (!audioRef.current || audioUrlRef.current !== cfg.soundUrl) {
      audioRef.current = new Audio(cfg.soundUrl);
      audioUrlRef.current = cfg.soundUrl;
    }
    const audio = audioRef.current;
    audio.currentTime = 0;
    audio.volume = cfg.soundVolume;
    audio.play().catch(() => {});
  }, []);

  const runFrame = useCallback(
    (now: number) => {
      const cfg = cfgRef.current;
      const root = rootRef.current;
      if (!cfg || !root) return;

      const last = lastRef.current ?? now;
      const dt = Math.max(0, now - last);
      lastRef.current = now;

      const tau = Math.max(1, cfg.smoothing) / 1000;
      const alpha = 1 - Math.exp(-dt / 1000 / tau);
      let pos = posRef.current + (targetRef.current - posRef.current) * alpha;

      if (Math.abs(targetRef.current - pos) < 0.0005) pos = targetRef.current;
      posRef.current = pos;

      const tiltRad = (cfg.tilt * Math.PI) / 180;
      const R = tiltRad > 0.0001 ? cfg.rowH / tiltRad : Infinity;

      for (let i = 0; i < cfg.count; i++) {
        const el = itemRefs.current[i];
        if (!el) continue;

        let dist = i - pos;
        if (cfg.loop) {
          const half = cfg.count / 2;
          if (dist > half) dist -= cfg.count;
          if (dist < -half) dist += cfg.count;
        }

        const y = dist * cfg.rowH;
        const angle = dist * (cfg.tilt * cfg.curve);
        const angleRad = (angle * Math.PI) / 180;
        const x = Number.isFinite(R) ? R * (1 - Math.cos(angleRad)) * cfg.curve : 0;
        const sign = cfg.side === "right" ? -1 : 1;

        const opacity = Math.max(cfg.minOpacity, 1 - Math.abs(dist) * cfg.fade);
        const blurPx = Math.abs(dist) * cfg.blur;
        const p = Math.max(0, 1 - Math.abs(dist));

        el.style.transform = `translateY(calc(-50% + ${y}px)) translateX(${sign * x}px) rotate(${sign * -angle}deg)`;
        el.style.opacity = String(opacity);
        el.style.filter = blurPx > 0.05 ? `blur(${blurPx}px)` : "none";
        el.style.setProperty("--ow-p", String(p));
      }

      const nearestIndex = cfg.loop
        ? ((Math.round(pos) % cfg.count) + cfg.count) % cfg.count
        : Math.min(cfg.count - 1, Math.max(0, Math.round(pos)));

      if (nearestIndex !== selectedRef.current && Math.abs(pos - Math.round(pos)) < 0.02) {
        selectedRef.current = nearestIndex;
        setSelectedIndex(nearestIndex);
      }

      if (Math.abs(targetRef.current - posRef.current) > 0.0005) {
        rafRef.current = requestAnimationFrame(runFrame);
      } else {
        rafRef.current = undefined;
        lastRef.current = undefined;
      }
    },
    []
  );

  const startLoop = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    lastRef.current = undefined;
    rafRef.current = requestAnimationFrame(runFrame);
  }, [runFrame]);

  const applyTarget = useCallback(
    (value: number, snap: boolean) => {
      const cfg = cfgRef.current;
      if (!cfg) return;

      let next = value;
      if (cfg.loop) {
        next = ((next % cfg.count) + cfg.count) % cfg.count;
      } else {
        next = Math.min(cfg.count - 1, Math.max(0, next));
      }
      if (snap) next = Math.round(next);

      targetRef.current = next;

      const idx = cfg.loop
        ? ((Math.round(next) % cfg.count) + cfg.count) % cfg.count
        : Math.min(cfg.count - 1, Math.max(0, Math.round(next)));

      if (idx !== selectedRef.current) {
        selectedRef.current = idx;
        onChangeRef.current?.(idx, cfg.items[idx]);
        playTick();
      }

      startLoop();
    },
    [playTick, startLoop]
  );

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    function handleWheel(e: WheelEvent) {
      const cfg = cfgRef.current;
      if (!cfg) return;
      e.preventDefault();

      const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? cfg.rowH : 1;
      let delta = (e.deltaY * unit) / cfg.rowH;
      delta = Math.max(-1, Math.min(1, delta));

      applyTarget(targetRef.current + delta, false);

      window.clearTimeout(wheelTimerRef.current);
      wheelTimerRef.current = window.setTimeout(() => {
        applyTarget(Math.round(targetRef.current), true);
      }, 140);
    }

    root.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      root.removeEventListener("wheel", handleWheel);
      window.clearTimeout(wheelTimerRef.current);
    };
  }, [applyTarget]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    const cfg = cfgRef.current;
    if (!cfg || !cfg.draggable) return;
    dragRef.current = { startY: e.clientY, startPos: targetRef.current };
    dragMovedRef.current = false;
  }, []);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      const cfg = cfgRef.current;
      const drag = dragRef.current;
      if (!cfg || !drag) return;

      const dy = e.clientY - drag.startY;
      if (!dragMovedRef.current) {
        if (Math.abs(dy) < 4) return;
        dragMovedRef.current = true;
        setIsDragging(true);
        (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
      }

      applyTarget(drag.startPos - dy / cfg.rowH, false);
    },
    [applyTarget]
  );

  const handlePointerEnd = useCallback(() => {
    if (!dragRef.current) return;
    const wasDrag = dragMovedRef.current;
    dragRef.current = null;
    dragMovedRef.current = false;
    setIsDragging(false);
    if (wasDrag) applyTarget(Math.round(targetRef.current), true);
  }, [applyTarget]);

  const handleItemClick = useCallback(
    (index: number) => {
      if (dragMovedRef.current) return;
      const cfg = cfgRef.current;
      if (!cfg) return;

      let delta = index - targetRef.current;
      if (cfg.loop) {
        const half = cfg.count / 2;
        delta = ((delta % cfg.count) + cfg.count) % cfg.count;
        if (delta > half) delta -= cfg.count;
      }
      applyTarget(targetRef.current + delta, true);
    },
    [applyTarget]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        applyTarget(targetRef.current - 1, true);
      } else if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        applyTarget(targetRef.current + 1, true);
      }
    },
    [applyTarget]
  );

  useEffect(() => {
    applyTarget(targetRef.current, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, fontSize, spacing, curve, tilt, blur, fade, minOpacity, side, loop, smoothing]);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      audioRef.current?.pause();
    };
  }, []);

  return (
    <div
      ref={rootRef}
      role="listbox"
      tabIndex={0}
      aria-label="Option wheel"
      className={`option-wheel${side === "right" ? " option-wheel--right" : ""}${
        isDragging ? " option-wheel--dragging" : ""
      }${className ? ` ${className}` : ""}`}
      style={
        {
          "--ow-text-color": textColor,
          "--ow-active-color": activeColor,
          "--ow-font-size": `${fontSize}rem`,
          "--ow-inset": `${inset}px`,
        } as React.CSSProperties
      }
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
      onKeyDown={handleKeyDown}
    >
      {items.map((label, i) => (
        <div
          key={label}
          ref={(el) => {
            itemRefs.current[i] = el;
          }}
          role="option"
          aria-selected={i === selectedIndex}
          className={`option-wheel__item${i === selectedIndex ? " option-wheel__item--selected" : ""}`}
          onClick={() => handleItemClick(i)}
        >
          {label}
        </div>
      ))}
    </div>
  );
}
