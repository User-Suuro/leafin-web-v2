"use client";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ShrinkMoveProps {
    children: ReactNode;
    delay?: number;
}

export default function ShrinkMove({ children, delay = 0 }: ShrinkMoveProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 1.3, y: 60 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.7, ease: "easeOut", delay }}
        >
            {children}
        </motion.div>
    );
}
