import { motion, AnimatePresence } from "framer-motion";
import { useState, type ReactNode, type CSSProperties } from "react";

type Placement = "top" | "bottom" | "left" | "right";

interface TooltipProps {
  label: ReactNode;
  placement?: Placement;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  tooltipStyle?: CSSProperties;
}

const offsets: Record<Placement, CSSProperties & Record<string, unknown>> = {
  top: { bottom: "100%", left: "50%", transform: "translateX(-50%)", marginBottom: 8 },
  bottom: { top: "100%", left: "50%", transform: "translateX(-50%)", marginTop: 8 },
  left: { right: "100%", top: "50%", transform: "translateY(-50%)", marginRight: 8 },
  right: { left: "100%", top: "50%", transform: "translateY(-50%)", marginLeft: 8 },
};

const origins: Record<Placement, { x: number; y: number }> = {
  top: { x: 0, y: 6 },
  bottom: { x: 0, y: -6 },
  left: { x: 6, y: 0 },
  right: { x: -6, y: 0 },
};

export function Tooltip({
  label,
  placement = "top",
  children,
  className,
  style,
  tooltipStyle,
}: TooltipProps) {
  const [show, setShow] = useState(false);

  return (
    <div
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onFocus={() => setShow(true)}
      onBlur={() => setShow(false)}
      className={className}
      style={{ position: "relative", display: "inline-block", ...style }}
    >
      {children}
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, ...origins[placement] }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, ...origins[placement] }}
            transition={{ duration: 0.15 }}
            style={{
              position: "absolute",
              pointerEvents: "none",
              whiteSpace: "nowrap",
              padding: "6px 12px",
              borderRadius: 6,
              background: "rgba(15, 15, 15, 0.9)",
              color: "#fff",
              fontSize: 13,
              zIndex: 50,
              ...offsets[placement],
              ...tooltipStyle,
            }}
          >
            {label}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
