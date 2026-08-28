"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "motion/react";

export interface TooltipPerson {
  id: number;
  name: string;
  designation: string;
  initials?: string;
  open?: boolean;
}

interface Props {
  items: TooltipPerson[];
}

export default function AnimatedTooltip({ items }: Props) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const springConfig = { stiffness: 100, damping: 15 };
  const x = useMotionValue(0);
  const animationFrameRef = useRef<number | null>(null);

  const rotate = useSpring(useTransform(x, [-100, 100], [-45, 45]), springConfig);
  const translateX = useSpring(useTransform(x, [-100, 100], [-50, 50]), springConfig);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);

    const target = event.currentTarget;
    const clientX = event.clientX;
    animationFrameRef.current = requestAnimationFrame(() => {
      const rect = target.getBoundingClientRect();
      const halfWidth = rect.width / 2;
      x.set(clientX - rect.left - halfWidth);
    });
  };

  return (
    <div className="avatar-tooltip-row">
      {items.map((item) => (
        <div
          className="avatar-tooltip-item"
          key={item.id}
          onMouseEnter={() => setHoveredIndex(item.id)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === item.id && (
              <div className="avatar-tooltip-card-wrap">
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.6 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: { type: "spring", stiffness: 260, damping: 10 },
                  }}
                  exit={{ opacity: 0, y: 20, scale: 0.6 }}
                  style={{ translateX, rotate, whiteSpace: "nowrap" }}
                  className="avatar-tooltip-card"
                >
                  <div className="avatar-tooltip-name">{item.name}</div>
                  <div className="avatar-tooltip-role">{item.designation}</div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
          <div
            onMouseMove={handleMouseMove}
            className={`avatar-tooltip-circle${item.open ? " avatar-tooltip-circle--open" : ""}`}
            aria-label={`${item.name}, ${item.designation}`}
          >
            {!item.open && (item.initials ?? "")}
          </div>
        </div>
      ))}
    </div>
  );
}
