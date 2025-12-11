"use client";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface SlideFadeProps {
    children: ReactNode;
    delay?: number;
}

export default function SlideFade({ children, delay = 0 }: SlideFadeProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut", delay }}
        >
            {children}
        </motion.div>
    );
}
