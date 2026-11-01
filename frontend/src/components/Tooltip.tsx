import React, { useState, ReactNode } from "react";
import { cn } from "../lib/utils";
import { AnimatePresence, motion } from "motion/react";

export function Tooltip({ children, content, position = "top", className, wrapperClassName }: { children: ReactNode; content: ReactNode; position?: "top" | "bottom" | "left" | "right"; className?: string; wrapperClassName?: string }) {
  const [isVisible, setIsVisible] = useState(false);

  const positions = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  return (
    <div 
      className={cn("relative flex items-center justify-center", wrapperClassName)}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && content && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={cn(
              "absolute z-50 whitespace-nowrap px-2.5 py-1.5 text-xs font-medium text-white bg-[#172B24] rounded shadow-md pointer-events-none",
              positions[position],
              className
            )}
            role="tooltip"
          >
            {content}
            <div className={cn(
              "absolute w-2 h-2 bg-[#172B24] transform rotate-45",
              position === "top" ? "bottom-[-4px] left-1/2 -translate-x-1/2" :
              position === "bottom" ? "top-[-4px] left-1/2 -translate-x-1/2" :
              position === "left" ? "right-[-4px] top-1/2 -translate-y-1/2" :
              "left-[-4px] top-1/2 -translate-y-1/2"
            )} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
