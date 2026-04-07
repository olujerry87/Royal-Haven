"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import styles from "./ScrollProgress.module.css";

export default function ScrollProgress() {
    const { scrollYProgress } = useScroll();

    // Smooth out the progress bar movement
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <div className={styles.container}>
            <motion.div
                className={styles.progressBar}
                style={{ scaleX }}
            />
        </div>
    );
}
