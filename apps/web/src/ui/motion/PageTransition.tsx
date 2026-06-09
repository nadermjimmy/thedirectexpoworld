import { motion, AnimatePresence, type TargetAndTransition } from "framer-motion";
import type { ReactNode, CSSProperties } from "react";

type Preset = "fade" | "slide" | "scale" | "flip";

interface PresetDef {
  initial: TargetAndTransition;
  animate: TargetAndTransition;
  exit: TargetAndTransition;
}

interface PageTransitionProps {
  pageKey: string;
  children: ReactNode;
  preset?: Preset;
  duration?: number;
  className?: string;
  style?: CSSProperties;
}

const presets: Record<Preset, PresetDef> = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slide: {
    initial: { opacity: 0, x: 60 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -60 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.92 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.05 },
  },
  flip: {
    initial: { opacity: 0, rotateY: 90 },
    animate: { opacity: 1, rotateY: 0 },
    exit: { opacity: 0, rotateY: -90 },
  },
};

export function PageTransition({
  pageKey,
  children,
  preset = "fade",
  duration = 0.35,
  className,
  style,
}: PageTransitionProps) {
  const v = presets[preset];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pageKey}
        initial={v.initial}
        animate={v.animate}
        exit={v.exit}
        transition={{ duration, ease: "easeInOut" }}
        className={className}
        style={style}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
