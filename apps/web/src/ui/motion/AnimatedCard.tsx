import { motion } from "framer-motion";
import type { ReactNode, CSSProperties } from "react";

interface AnimatedCardProps {
  children: ReactNode;
  onClick?: () => void;
  hoverScale?: number;
  tapScale?: number;
  hoverY?: number;
  shadow?: boolean;
  className?: string;
  style?: CSSProperties;
}

export function AnimatedCard({
  children,
  onClick,
  hoverScale = 1.03,
  tapScale = 0.98,
  hoverY = -4,
  shadow = true,
  className,
  style,
}: AnimatedCardProps) {
  return (
    <motion.div
      whileHover={{
        scale: hoverScale,
        y: hoverY,
        boxShadow: shadow
          ? "0 20px 40px rgba(0, 0, 0, 0.15)"
          : undefined,
      }}
      whileTap={{ scale: tapScale }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      onClick={onClick}
      className={className}
      style={{ cursor: onClick ? "pointer" : undefined, ...style }}
    >
      {children}
    </motion.div>
  );
}
