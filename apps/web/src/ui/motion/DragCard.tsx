import { motion } from "framer-motion";
import { useRef, type ReactNode, type CSSProperties } from "react";

interface DragCardProps {
  children: ReactNode;
  axis?: "x" | "y" | true;
  elastic?: number;
  className?: string;
  style?: CSSProperties;
  constrainToParent?: boolean;
}

export function DragCard({
  children,
  axis = true,
  elastic = 0.15,
  constrainToParent = true,
  className,
  style,
}: DragCardProps) {
  const constraintsRef = useRef<HTMLDivElement>(null);

  const inner = (
    <motion.div
      drag={axis}
      dragElastic={elastic}
      dragConstraints={constrainToParent ? constraintsRef : undefined}
      dragTransition={{ bounceStiffness: 300, bounceDamping: 20 }}
      whileDrag={{
        scale: 1.05,
        boxShadow: "0 16px 40px rgba(0,0,0,0.2)",
        cursor: "grabbing",
      }}
      whileHover={{ cursor: "grab" }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );

  if (!constrainToParent) return inner;

  return (
    <div ref={constraintsRef} style={{ overflow: "hidden", position: "relative", width: "100%", height: "100%" }}>
      {inner}
    </div>
  );
}
