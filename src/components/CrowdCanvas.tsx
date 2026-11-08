"use client";

// Adapted from Skiper UI "skiper39" (Canvas crowd) — inspired by
// https://codepen.io/zadvorsky/pen/xxwbBQV, illustration by openpeeps.com.
import { gsap } from "gsap";
import { useEffect, useRef } from "react";

interface CrowdCanvasProps {
  src: string;
  rows?: number;
  cols?: number;
  className?: string;
}

type Stage = { width: number; height: number };
type Peep = {
  rect: number[];
  width: number;
  height: number;
  x: number;
  y: number;
  anchorY: number;
  scaleX: number;
  walk: gsap.core.Timeline | null;
};

export default function CrowdCanvas({ src, rows = 15, cols = 7, className }: CrowdCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const img = new Image();
    const stage: Stage = { width: 0, height: 0 };
    const allPeeps: Peep[] = [];
    const available: Peep[] = [];
    const crowd: Peep[] = [];
    let disposed = false;

    const rand = (min: number, max: number) => min + Math.random() * (max - min);
    const takeRandom = (arr: Peep[]) => arr.splice((rand(0, arr.length) | 0), 1)[0];

    const resetPeep = (peep: Peep) => {
      const dir = Math.random() > 0.5 ? 1 : -1;
      const offsetY = 100 - 250 * gsap.parseEase("power2.in")(Math.random());
      const startY = stage.height - peep.height + offsetY;
      const startX = dir === 1 ? -peep.width : stage.width + peep.width;
      const endX = dir === 1 ? stage.width : 0;
      peep.scaleX = dir;
      peep.x = startX;
      peep.y = startY;
      peep.anchorY = startY;
      return { startY, endX };
    };

    const addPeep = () => {
      const peep = takeRandom(available);
      if (!peep) return null;
      const { startY, endX } = resetPeep(peep);
      const xDuration = 10;
      const yDuration = 0.25;
      const tl = gsap.timeline();
      tl.timeScale(rand(0.5, 1.5));
      tl.to(peep, { duration: xDuration, x: endX, ease: "none" }, 0);
      tl.to(
        peep,
        { duration: yDuration, repeat: xDuration / yDuration, yoyo: true, y: startY - 10 },
        0,
      );
      tl.eventCallback("onComplete", () => {
        crowd.splice(crowd.indexOf(peep), 1);
        available.push(peep);
        if (!disposed) addPeep();
      });
      peep.walk = tl;
      crowd.push(peep);
      crowd.sort((a, b) => a.anchorY - b.anchorY);
      return peep;
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(devicePixelRatio, devicePixelRatio);
      crowd.forEach((p) => {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.scale(p.scaleX, 1);
        ctx.drawImage(img, p.rect[0], p.rect[1], p.rect[2], p.rect[3], 0, 0, p.width, p.height);
        ctx.restore();
      });
      ctx.restore();
    };

    const resize = () => {
      stage.width = canvas.clientWidth;
      stage.height = canvas.clientHeight;
      canvas.width = stage.width * devicePixelRatio;
      canvas.height = stage.height * devicePixelRatio;
      crowd.forEach((p) => p.walk?.kill());
      crowd.length = 0;
      available.length = 0;
      available.push(...allPeeps);
      // Fewer walkers on small screens keeps it readable and cheap.
      const max = stage.width < 600 ? Math.round(allPeeps.length * 0.4) : allPeeps.length;
      while (available.length > allPeeps.length - max) {
        const p = addPeep();
        if (!p) break;
        p.walk?.progress(Math.random());
      }
      if (reduced) {
        crowd.forEach((p) => p.walk?.pause());
        render();
      }
    };

    const onLoad = () => {
      if (disposed) return;
      const w = img.naturalWidth / rows;
      const h = img.naturalHeight / cols;
      for (let i = 0; i < rows * cols; i++) {
        allPeeps.push({
          rect: [(i % rows) * w, ((i / rows) | 0) * h, w, h],
          width: w,
          height: h,
          x: 0,
          y: 0,
          anchorY: 0,
          scaleX: 1,
          walk: null,
        });
      }
      resize();
      if (!reduced) gsap.ticker.add(render);
    };

    img.onload = onLoad;
    img.src = src;
    window.addEventListener("resize", resize);

    return () => {
      disposed = true;
      window.removeEventListener("resize", resize);
      gsap.ticker.remove(render);
      crowd.forEach((p) => p.walk?.kill());
    };
  }, [src, rows, cols]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
