import { motion, AnimatePresence } from "framer-motion";
import { useState, type ReactNode, type CSSProperties } from "react";

interface AccordionItem {
  id: string;
  title: ReactNode;
  content: ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  multiple?: boolean;
  className?: string;
  style?: CSSProperties;
  headerStyle?: CSSProperties;
  contentStyle?: CSSProperties;
}

export function Accordion({
  items,
  multiple = false,
  className,
  style,
  headerStyle,
  contentStyle,
}: AccordionProps) {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(multiple ? prev : []);
      if (prev.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className={className} style={style}>
      {items.map((item) => {
        const isOpen = openIds.has(item.id);
        return (
          <div key={item.id}>
            <button
              onClick={() => toggle(item.id)}
              aria-expanded={isOpen}
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 16px",
                background: "transparent",
                border: "none",
                borderBottom: "1px solid rgba(255,255,255,0.1)",
                color: "inherit",
                cursor: "pointer",
                textAlign: "left",
                fontSize: "inherit",
                ...headerStyle,
              }}
            >
              {item.title}
              <motion.span
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                style={{ display: "inline-block", marginLeft: 8 }}
              >
                &#9662;
              </motion.span>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  style={{ overflow: "hidden" }}
                >
                  <div style={{ padding: "12px 16px", ...contentStyle }}>
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
