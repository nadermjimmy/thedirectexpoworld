import { motion, type Variants } from "framer-motion";
import type { ReactNode, CSSProperties } from "react";

type Preset = "fade" | "slide-up" | "slide-left" | "zoom" | "flip";

interface ScrollRevealProps {
  children: ReactNode;
  preset?: Preset;
  duration?: number;
  delay?: number;
  once?: boolean;
  amount?: number;
  className?: string;
  style?: CSSProperties;
}

const presets: Record<Preset, Variants> = {
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  "slide-up": {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0 },
  },
  "slide-left": {
    hidden: { opacity: 0, x: 60 },
    visible: { opacity: 1, x: 0 },
  },
  zoom: {
    hidden: { opacity: 0, scale: 0.7 },
    visible: { opacity: 1, scale: 1 },
  },
  flip: {
    hidden: { opacity: 0, rotateX: 60 },
    visible: { opacity: 1, rotateX: 0 },
  },
};

export function ScrollReveal({
  children,
  preset = "slide-up",
  duration = 0.5,
  delay = 0,
  once = true,
  amount = 0.3,
  className,
  style,
}: ScrollRevealProps) {
  return (
    <motion.div
      variants={presets[preset]}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      transition={{ duration, delay, ease: "easeOut" }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}
