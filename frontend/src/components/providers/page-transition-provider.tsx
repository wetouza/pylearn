"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface PageTransitionProviderProps {
  children: ReactNode;
}

const pageVariants = {
  initial: {
    opacity: 0,
  },
  enter: {
    opacity: 1,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
};

export function PageTransitionProvider({ children }: PageTransitionProviderProps) {
  const pathname = usePathname();

  return (
    <motion.div
      key={pathname}
      variants={pageVariants}
      initial="initial"
      animate="enter"
      className="min-h-screen"
    >
      {children}
    </motion.div>
  );
}
