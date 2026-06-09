import { motion, type Variants } from "framer-motion";
import type { ReactNode, CSSProperties } from "react";

type Direction = "up" | "down" | "left" | "right" | "none";

interface FadeInProps {
  children: ReactNode;
  direction?: Direction;
  distance?: number;
  duration?: number;
  delay?: number;
  once?: boolean;
  className?: string;
  style?: CSSProperties;
}

const offsets: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 40 },
  down: { x: 0, y: -40 },
  left: { x: 40, y: 0 },
  right: { x: -40, y: 0 },
  none: { x: 0, y: 0 },
};

export function FadeIn({
  children,
  direction = "up",
  distance,
  duration = 0.5,
  delay = 0,
  once = true,
  className,
  style,
}: FadeInProps) {
  const d = distance ?? Math.abs(offsets[direction].x || offsets[direction].y);
  const scale = d / (Math.abs(offsets[direction].x || offsets[direction].y) || 1);

  const variants: Variants = {
    hidden: {
      opacity: 0,
      x: offsets[direction].x * scale,
      y: offsets[direction].y * scale,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration, delay, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.3 }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}
