"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgress() {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <motion.div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                height: "4px",
                backgroundColor: "var(--gold, #D4AF37)",
                transformOrigin: "0%",
                zIndex: 2000,
                boxShadow: "0 0 10px rgba(212, 175, 55, 0.5)",
                scaleX
            }}
        />
    );
}
