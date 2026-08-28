"use client";

import { useEffect, useRef } from "react";
import styles from "../app/team/team.module.css";

interface HeroCard {
  seed: string;
  rot: number;
  depth: number;
}

const heroCards: HeroCard[] = [
  { seed: "im-01", rot: -9, depth: 14 },
  { seed: "im-02", rot: -5, depth: 10 },
  { seed: "im-03", rot: -2, depth: 8 },
  { seed: "im-04", rot: 3, depth: 12 },
  { seed: "im-05", rot: 0, depth: 6 },
  { seed: "im-06", rot: 4, depth: 11 },
  { seed: "im-07", rot: 7, depth: 9 },
  { seed: "im-08", rot: -4, depth: 13 },
];

const cardClassBySlot = [styles.card1, styles.card2, styles.card3, styles.card4, styles.card5, styles.card6, styles.card7, styles.card8];

export default function TeamHero() {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!hero || reduceMotion) return;

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    (async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);

      const cards = Array.from(hero.querySelectorAll<HTMLElement>(`.${styles.teamHeroCard}`));

      gsap.set(`#teamHeroTitle [data-word] > span`, { y: "105%" });
      gsap.set(`#teamHeroGhost [data-letter]`, { y: 60, opacity: 0 });
      gsap.set(`#teamHeroSub`, { opacity: 0, y: 20 });
      cards.forEach((card) => {
        const rot = parseFloat(card.dataset.rot || "0");
        card.dataset.restRot = String(rot);
        gsap.set(card, { y: -700, rotation: rot + 25, opacity: 0, scale: 0.7 });
      });

      const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
      intro
        .to(`#teamHeroTitle [data-word] > span`, { y: "0%", duration: 0.9, stagger: 0.08 }, 0.1)
        .to(`#teamHeroGhost [data-letter]`, { y: 0, opacity: 1, duration: 0.9, stagger: 0.04, ease: "back.out(1.6)" }, 0.35)
        .to(
          cards,
          {
            y: 0,
            opacity: 1,
            scale: 1,
            rotation: (_i: number, el: Element) => parseFloat((el as HTMLElement).dataset.restRot || "0"),
            duration: 1.1,
            stagger: { each: 0.08, from: "center" },
            ease: "back.out(1.4)",
          },
          0.6
        )
        .to(`#teamHeroSub`, { opacity: 1, y: 0, duration: 0.8 }, 1.4);

      // continuous idle float -- a confirmed, named exception (see
      // team.module.css); everything else on this site stays still at
      // rest on purpose.
      cards.forEach((card, i) => {
        const rot = parseFloat(card.dataset.restRot || "0");
        gsap.to(card, {
          y: `+=${8 + (i % 3) * 5}`,
          rotation: rot + (i % 2 === 0 ? 1.5 : -1.5),
          duration: 3 + (i % 4) * 0.5,
          delay: 1.6 + i * 0.1,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      });

      let mx = 0,
        my = 0,
        tx = 0,
        ty = 0;
      let parallaxId = 0;
      const onMouseMove = (e: MouseEvent) => {
        const r = hero.getBoundingClientRect();
        mx = ((e.clientX - r.left) / r.width - 0.5) * 2;
        my = ((e.clientY - r.top) / r.height - 0.5) * 2;
      };
      const onMouseLeave = () => {
        mx = 0;
        my = 0;
      };
      hero.addEventListener("mousemove", onMouseMove);
      hero.addEventListener("mouseleave", onMouseLeave);
      (function parallax() {
        tx += (mx - tx) * 0.05;
        ty += (my - ty) * 0.05;
        cards.forEach((card) => {
          const d = parseFloat(card.dataset.depth || "8");
          card.style.translate = `${tx * d}px ${ty * d * 0.5}px`;
        });
        parallaxId = requestAnimationFrame(parallax);
      })();

      const cardHandlers: Array<{ el: HTMLElement; move: (e: Event) => void; leave: () => void }> = [];
      cards.forEach((card) => {
        const move = (e: Event) => {
          const evt = e as MouseEvent;
          const r = card.getBoundingClientRect();
          const px = (evt.clientX - r.left) / r.width - 0.5;
          const py = (evt.clientY - r.top) / r.height - 0.5;
          gsap.to(card, {
            rotateX: -py * 16,
            rotateY: px * 16,
            scale: 1.12,
            zIndex: 20,
            duration: 0.4,
            ease: "power2.out",
            transformPerspective: 700,
            overwrite: "auto",
          });
        };
        const leave = () => {
          gsap.to(card, { rotateX: 0, rotateY: 0, scale: 1, duration: 0.8, ease: "elastic.out(1, 0.6)", overwrite: "auto" });
        };
        card.addEventListener("mousemove", move);
        card.addEventListener("mouseleave", leave);
        cardHandlers.push({ el: card, move, leave });
      });

      const scrollTrigger = ScrollTrigger.create({
        trigger: hero,
        start: "top top",
        end: "bottom top",
        scrub: 0.8,
        onUpdate: (self: { progress: number }) => {
          const p = self.progress;
          gsap.set(`#teamHeroGhost`, { scale: 1 + 0.15 * p, opacity: 1 - 0.4 * p });
          gsap.set(`#teamHeroTitle`, { y: -60 * p, opacity: 1 - p * 1.5 });
          const moves = [
            { x: -260, y: -40, rot: -25 },
            { x: -200, y: 20, rot: -18 },
            { x: -120, y: 80, rot: -10 },
            { x: -40, y: 120, rot: -4 },
            { x: 40, y: 120, rot: 4 },
            { x: 120, y: 80, rot: 12 },
            { x: 200, y: 20, rot: 22 },
            { x: 260, y: -40, rot: 28 },
          ];
          cards.forEach((card, i) => {
            const m = moves[i];
            const rest = parseFloat(card.dataset.restRot || "0");
            gsap.set(card, { x: m.x * p, y: m.y * p, rotation: rest + m.rot * p });
          });
          gsap.set(`#teamHeroSub`, { opacity: 1 - p * 2 });
        },
      });

      const pill = hero.querySelector<HTMLElement>(`.${styles.teamHeroPill}`);
      const onPillClick = () => {
        gsap.fromTo(pill, { scale: 1 }, { scale: 0.93, duration: 0.12, yoyo: true, repeat: 1, ease: "power2.inOut" });
      };
      pill?.addEventListener("click", onPillClick);

      cleanup = () => {
        cancelAnimationFrame(parallaxId);
        hero.removeEventListener("mousemove", onMouseMove);
        hero.removeEventListener("mouseleave", onMouseLeave);
        cardHandlers.forEach(({ el, move, leave }) => {
          el.removeEventListener("mousemove", move);
          el.removeEventListener("mouseleave", leave);
        });
        pill?.removeEventListener("click", onPillClick);
        scrollTrigger.kill();
        intro.kill();
      };
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  return (
    <section className={styles.teamHero} id="teamHero" ref={heroRef}>
      <h1 className={styles.teamHeroTitle} id="teamHeroTitle">
        <span data-word>
          <span>Small</span>
        </span>
        &nbsp;
        <span data-word>
          <span>team,</span>
        </span>
      </h1>

      <div className={styles.teamHeroGhostWrap}>
        <div className={styles.teamHeroGhost} id="teamHeroGhost">
          {"whole access".split("").map((ch, i) => (
            <span data-letter key={i}>
              {ch === " " ? " " : ch}
            </span>
          ))}
        </div>
      </div>

      <div className={styles.teamHeroCards} id="teamHeroCards" aria-hidden="true">
        {heroCards.map((c, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <div className={`${styles.teamHeroCard} ${cardClassBySlot[i]}`} data-rot={c.rot} data-depth={c.depth} key={c.seed}>
            <img src={`https://picsum.photos/seed/${c.seed}/400/600`} alt="" loading="lazy" />
          </div>
        ))}
      </div>

      <div className={styles.teamHeroSub} id="teamHeroSub">
        <a href="#founders" className={styles.teamHeroPill}>
          See who you&apos;ll work with
          <span data-arrow aria-hidden="true">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
              <line x1="7" y1="17" x2="17" y2="7" />
              <polyline points="7 7 17 7 17 17" />
            </svg>
          </span>
        </a>
        <div className={styles.teamHeroSubText}>2 founders. 9 disciplines. Every project, direct.</div>
      </div>
    </section>
  );
}
