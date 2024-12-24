"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";

import { cn } from "@/lib/cn";

interface ClipFromLeftAnimationProps {
  children?: React.ReactNode;
  show: boolean;
  className?: string;
  duration?: number;
}

const ClipFromLeftAnimation: React.FC<ClipFromLeftAnimationProps> = (props) => {
  return (
    <AnimatePresence initial={false}>
      {props.show && (
        <motion.span
          transition={{
            duration: props.duration || 0.05,
            ease: "linear",
          }}
          initial={{
            width: "0px",
            clipPath: "polygon(0 0, 0 0, 0 100%, 0% 100%)",
          }}
          animate={{
            width: "auto",
            clipPath: "polygon(0 0, 100% 0%, 100% 100%, 0% 100%)",
          }}
          exit={{
            width: "0px",
            clipPath: "polygon(0 0, 0 0, 0 100%, 0% 100%)",
          }}
          className={cn(["inline-block overflow-hidden", props.className])}
        >
          {props.children}
        </motion.span>
      )}
    </AnimatePresence>
  );
};

export { ClipFromLeftAnimation };

