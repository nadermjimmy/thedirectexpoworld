import { motion, AnimatePresence } from "framer-motion";
import { useState, type ReactNode, type CSSProperties } from "react";

interface Tab {
  id: string;
  label: string;
  content: ReactNode;
}

interface AnimatedTabsProps {
  tabs: Tab[];
  defaultTab?: string;
  className?: string;
  style?: CSSProperties;
  tabStyle?: CSSProperties;
  activeTabStyle?: CSSProperties;
  contentStyle?: CSSProperties;
}

export function AnimatedTabs({
  tabs,
  defaultTab,
  className,
  style,
  tabStyle,
  activeTabStyle,
  contentStyle,
}: AnimatedTabsProps) {
  const [active, setActive] = useState(defaultTab ?? tabs[0]?.id ?? "");

  const current = tabs.find((t) => t.id === active);

  return (
    <div className={className} style={style}>
      <div style={{ display: "flex", gap: 4, position: "relative" }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            style={{
              position: "relative",
              padding: "8px 16px",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: active === tab.id ? "#fff" : "#888",
              fontWeight: active === tab.id ? 600 : 400,
              zIndex: 1,
              ...tabStyle,
              ...(active === tab.id ? activeTabStyle : undefined),
            }}
          >
            {active === tab.id && (
              <motion.div
                layoutId="tab-indicator"
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: 8,
                  background: "rgba(99, 102, 241, 0.8)",
                  zIndex: -1,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {current && (
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            style={contentStyle}
          >
            {current.content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
