"use client";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface SlideFromLeftProps {
  children: ReactNode;
  delay?: number;
}

export default function SlideFromLeft({
  children,
  delay = 0,
}: SlideFromLeftProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: false, amount: 0.3 }}
      transition={{
        duration: 0.6,
        ease: "easeOut",
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}
