import { motion, AnimatePresence } from "framer-motion";
import type { ReactNode, CSSProperties } from "react";

type Side = "left" | "right" | "top" | "bottom";

interface SlidePanelProps {
  open: boolean;
  side?: Side;
  children: ReactNode;
  onClose?: () => void;
  overlay?: boolean;
  width?: string | number;
  className?: string;
  style?: CSSProperties;
}

const axis: Record<Side, Record<string, string | number>> = {
  left: { x: "-100%", y: 0 },
  right: { x: "100%", y: 0 },
  top: { x: 0, y: "-100%" },
  bottom: { x: 0, y: "100%" },
};

const placement: Record<Side, CSSProperties> = {
  left: { top: 0, left: 0, height: "100%" },
  right: { top: 0, right: 0, height: "100%" },
  top: { top: 0, left: 0, width: "100%" },
  bottom: { bottom: 0, left: 0, width: "100%" },
};

export function SlidePanel({
  open,
  side = "right",
  children,
  onClose,
  overlay = true,
  width = 360,
  className,
  style,
}: SlidePanelProps) {
  const isHorizontal = side === "left" || side === "right";

  return (
    <AnimatePresence>
      {open && (
        <>
          {overlay && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onClose}
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.4)",
                zIndex: 999,
              }}
            />
          )}
          <motion.aside
            initial={axis[side]}
            animate={{ x: 0, y: 0 }}
            exit={axis[side]}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={className}
            style={{
              position: "fixed",
              zIndex: 1000,
              ...(isHorizontal ? { width } : { height: width }),
              ...placement[side],
              ...style,
            }}
          >
            {children}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
