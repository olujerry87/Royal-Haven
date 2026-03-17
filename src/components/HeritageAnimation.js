"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
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

function FloatingCard({ item, index }) {
    // Replaced complex scroll calculation with smooth continuous floating
    return (
        <motion.div
            className={styles.glassCard}
            style={{ 
                left: `calc(50% + ${item.x}px)`, 
                top: `calc(50% + ${item.y}px)`,
                transform: 'translate(-50%, -50%)'
            }}
            // Smooth continuous breathing animation
            animate={{
                y: [0, -15, 0],
                rotate: [0, item.x > 0 ? 2 : -2, 0]
            }}
            transition={{
                duration: 6,
                repeat: Infinity,
                repeatType: "mirror",
                delay: index * 0.5,
                ease: "easeInOut"
            }}
        >
            <div className={styles.iconPlaceholder}>
                <item.icon size={20} />
            </div>
            <div className={styles.cardText}>
                {item.text}
            </div>
        </motion.div>
    );
}

export default function HeritageAnimation() {
    return (
        <section className={styles.container}>
            <div className={styles.stickyWrapper}>

                {/* Central Model Placeholder */}
                <motion.div
                    className={styles.modelPlaceholder}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1 }}
                    viewport={{ once: true }}
                >
                    <div>Living Heritage</div>
                </motion.div>


                {/* Floating Elements */}
                {floatingElements.map((item, index) => (
                    <FloatingCard
                        key={item.id}
                        item={item}
                        index={index}
                    />
                ))}
            </div>
        </section>
    );
}
