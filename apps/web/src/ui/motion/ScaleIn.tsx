import { motion } from "framer-motion";
import type { ReactNode, CSSProperties } from "react";

interface ScaleInProps {
  children: ReactNode;
  initialScale?: number;
  duration?: number;
  delay?: number;
  once?: boolean;
  className?: string;
  style?: CSSProperties;
}

export function ScaleIn({
  children,
  initialScale = 0.8,
  duration = 0.4,
  delay = 0,
  once = true,
  className,
  style,
}: ScaleInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: initialScale }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once, amount: 0.3 }}
      transition={{
        duration,
        delay,
        scale: { type: "spring", stiffness: 200, damping: 20 },
      }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}
