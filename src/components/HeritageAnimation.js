"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Scissors, Feather, Gem, Sparkles, User, Palette } from "lucide-react";
import styles from "./HeritageAnimation.module.css";

const floatingElements = [
    { id: 1, text: "Precision Cut", icon: Scissors, x: -250, y: -150 },
    { id: 2, text: "Silk Textures", icon: Feather, x: 250, y: -150 },
    { id: 3, text: "Royal Gems", icon: Gem, x: -300, y: 0 },
    { id: 4, text: "Artistic Vision", icon: Palette, x: 300, y: 0 },
    { id: 5, text: "Custom Fit", icon: User, x: -250, y: 150 },
    { id: 6, text: "Beaded Detail", icon: Sparkles, x: 250, y: 150 },
];

function FloatingCard({ item, index, convergence }) {
    // Hooks at component level - correct usage
    const x = useTransform(convergence, (factor) => item.x * factor);
    const y = useTransform(convergence, (factor) => item.y * factor);

    return (
        <motion.div
            className={styles.glassCard}
            style={{ x, y }}
            // Breathing animation with Framer Motion
            animate={{
                scale: [1, 1.05, 1],
            }}
            transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: "mirror",
                delay: index * 0.5,
                ease: "easeInOut"
            }}
        >
            <div className={styles.iconPlaceholder}>
                <item.icon size={20} />
            </div>
            <div
                className={styles.cardText}
                contentEditable
                suppressContentEditableWarning
            >
                {item.text}
            </div>
        </motion.div>
    );
}

export default function HeritageAnimation() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    // Convergence Effect
    const convergence = useTransform(scrollYProgress, [0, 0.5, 1], [1.5, 0.6, 1.5]);
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

    return (
        <section ref={containerRef} className={styles.container}>
            <div className={styles.stickyWrapper}>

                {/* Central Model Placeholder */}
                <motion.div
                    className={styles.modelPlaceholder}
                    style={{ opacity }}
                >
                    <div>Living Heritage</div>
                </motion.div>

                {/* Floating Elements */}
                {floatingElements.map((item, index) => (
                    <FloatingCard
                        key={item.id}
                        item={item}
                        index={index}
                        convergence={convergence}
                    />
                ))}
            </div>
        </section>
    );
}
