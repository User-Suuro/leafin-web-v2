"use client";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ScaleFadeProps {
    children: ReactNode;
    delay?: number;
}

export default function ScaleFade({ children, delay = 0 }: ScaleFadeProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut", delay }}
        >
            {children}
        </motion.div>
    );
}
