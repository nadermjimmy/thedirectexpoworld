import { motion, type Variants } from "framer-motion";
import type { CSSProperties } from "react";

type Mode = "chars" | "words" | "lines";

interface AnimatedTextProps {
  text: string;
  mode?: Mode;
  stagger?: number;
  duration?: number;
  delay?: number;
  once?: boolean;
  tag?: "p" | "h1" | "h2" | "h3" | "h4" | "span";
  className?: string;
  style?: CSSProperties;
}

const containerVariants = (stagger: number, delay: number): Variants => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: stagger, delayChildren: delay },
  },
});

const tokenVariants: Variants = {
  hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

function split(text: string, mode: Mode): string[] {
  if (mode === "chars") return text.split("");
  if (mode === "words") return text.split(/(\s+)/);
  return text.split("\n");
}

export function AnimatedText({
  text,
  mode = "words",
  stagger = 0.04,
  duration: _duration,
  delay = 0,
  once = true,
  tag: Tag = "p",
  className,
  style,
}: AnimatedTextProps) {
  const MotionTag = motion.create(Tag);
  const tokens = split(text, mode);

  return (
    <MotionTag
      variants={containerVariants(stagger, delay)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.5 }}
      className={className}
      style={{ display: "flex", flexWrap: "wrap", ...style }}
    >
      {tokens.map((token, i) => (
        <motion.span
          key={i}
          variants={tokenVariants}
          style={{ display: "inline-block", whiteSpace: "pre" }}
        >
          {token}
        </motion.span>
      ))}
    </MotionTag>
  );
}
