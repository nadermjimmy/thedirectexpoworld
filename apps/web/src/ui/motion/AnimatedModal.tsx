import { motion, AnimatePresence } from "framer-motion";
import type { ReactNode, CSSProperties } from "react";

interface AnimatedModalProps {
  open: boolean;
  onClose?: () => void;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function AnimatedModal({
  open,
  onClose,
  children,
  className,
  style,
}: AnimatedModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0, 0, 0, 0.5)",
              backdropFilter: "blur(4px)",
            }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className={className}
            style={{ position: "relative", zIndex: 1, ...style }}
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
