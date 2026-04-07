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
                top: "var(--header-height)",
                left: 0,
                right: 0,
                height: "4px",
                backgroundImage: "linear-gradient(90deg, #D4AF37, #F4C430, var(--off-white), #F4C430, #D4AF37)",
                backgroundSize: "200% 100%",
                animation: "shimmer 3s infinite linear",
                transformOrigin: "0%",
                zIndex: 2000,
                boxShadow: "0 0 10px rgba(212, 175, 55, 0.5)",
                scaleX
            }}
        />
    );
}
