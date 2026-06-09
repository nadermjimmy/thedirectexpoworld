import { motion, type Variants } from "framer-motion";
import type { ReactNode, CSSProperties } from "react";

interface StaggerListProps {
  children: ReactNode[];
  stagger?: number;
  direction?: "up" | "down" | "left" | "right";
  once?: boolean;
  className?: string;
  itemClassName?: string;
  style?: CSSProperties;
}

const containerVariants = (stagger: number): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: stagger, when: "beforeChildren" },
  },
});

const dirOffsets = {
  up: { x: 0, y: 24 },
  down: { x: 0, y: -24 },
  left: { x: 24, y: 0 },
  right: { x: -24, y: 0 },
};

const itemVariants = (dir: "up" | "down" | "left" | "right"): Variants => ({
  hidden: { opacity: 0, ...dirOffsets[dir] },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" },
  },
});

export function StaggerList({
  children,
  stagger = 0.08,
  direction = "up",
  once = true,
  className,
  itemClassName,
  style,
}: StaggerListProps) {
  return (
    <motion.ul
      variants={containerVariants(stagger)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.2 }}
      className={className}
      style={{ listStyle: "none", padding: 0, margin: 0, ...style }}
    >
      {children.map((child, i) => (
        <motion.li key={i} variants={itemVariants(direction)} className={itemClassName}>
          {child}
        </motion.li>
      ))}
    </motion.ul>
  );
}
