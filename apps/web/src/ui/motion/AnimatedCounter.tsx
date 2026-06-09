import { useEffect, useRef, useState } from "react";
import { useInView, useSpring, useMotionValue } from "framer-motion";
import type { CSSProperties } from "react";

interface AnimatedCounterProps {
  to: number;
  from?: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  once?: boolean;
  className?: string;
  style?: CSSProperties;
}

export function AnimatedCounter({
  to,
  from = 0,
  duration = 1.5,
  decimals = 0,
  prefix = "",
  suffix = "",
  once = true,
  className,
  style,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once, amount: 0.5 });
  const motionValue = useMotionValue(from);
  const springValue = useSpring(motionValue, {
    stiffness: 60,
    damping: 20,
    duration: duration * 1000,
  });
  const [display, setDisplay] = useState(from.toFixed(decimals));

  useEffect(() => {
    if (isInView) motionValue.set(to);
  }, [isInView, to, motionValue]);

  useEffect(() => {
    const unsub = springValue.on("change", (v) => {
      setDisplay(v.toFixed(decimals));
    });
    return unsub;
  }, [springValue, decimals]);

  return (
    <span ref={ref} className={className} style={style}>
      {prefix}{display}{suffix}
    </span>
  );
}
