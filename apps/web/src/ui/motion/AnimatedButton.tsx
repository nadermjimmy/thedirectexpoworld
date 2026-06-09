import { motion } from "framer-motion";
import type { ReactNode, CSSProperties } from "react";

interface AnimatedButtonProps {
  children: ReactNode;
  variant?: "scale" | "glow" | "slide";
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
  style?: CSSProperties;
}

const presets = {
  scale: {
    whileHover: { scale: 1.06 },
    whileTap: { scale: 0.95 },
  },
  glow: {
    whileHover: {
      scale: 1.04,
      boxShadow: "0 0 20px rgba(99, 102, 241, 0.5)",
    },
    whileTap: { scale: 0.97 },
  },
  slide: {
    whileHover: { x: 4, scale: 1.02 },
    whileTap: { x: 0, scale: 0.98 },
  },
};

export function AnimatedButton({
  children,
  variant = "scale",
  onClick,
  disabled,
  type = "button",
  className,
  style,
}: AnimatedButtonProps) {
  return (
    <motion.button
      {...presets[variant]}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={className}
      style={style}
    >
      {children}
    </motion.button>
  );
}
