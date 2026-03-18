"use client";

import { motion } from "framer-motion";
import styles from "./VibeCheck.module.css";

const VIBES = [
    {
        id: "minimalist",
        label: "Clean & Minimal",
        description: "White tees, slim cuts, no fuss.",
        emoji: "🤍",
        palette: ["#FFFFFF", "#E5E5E5", "#000000"],
    },
    {
        id: "street",
        label: "Street & Edge",
        description: "Hoodies, cargos, bold silhouettes.",
        emoji: "🔥",
        palette: ["#1A1A1A", "#4A4A4A", "#D4AF37"],
    },
    {
        id: "formal",
        label: "Sharp & Formal",
        description: "Blazers, trousers, polished detail.",
        emoji: "✨",
        palette: ["#2C2C54", "#D4AF37", "#F9F9F9"],
    },
];

export default function VibeCheck({ onSelect }) {
    return (
        <div className={styles.container}>
            <motion.h3
                className={styles.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                What&apos;s your vibe?
            </motion.h3>
            <p className={styles.subtitle}>
                We&apos;ll pre-build your closet in seconds. No sign-up needed.
            </p>

            <div className={styles.grid}>
                {VIBES.map((vibe, i) => (
                    <motion.button
                        key={vibe.id}
                        className={styles.card}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.15, duration: 0.5 }}
                        whileHover={{ scale: 1.04, borderColor: "#D4AF37" }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => onSelect(vibe.id)}
                    >
                        <span className={styles.emoji}>{vibe.emoji}</span>
                        <div className={styles.palette}>
                            {vibe.palette.map((c) => (
                                <span key={c} className={styles.swatch} style={{ background: c }} />
                            ))}
                        </div>
                        <h4 className={styles.cardTitle}>{vibe.label}</h4>
                        <p className={styles.cardDesc}>{vibe.description}</p>
                    </motion.button>
                ))}
            </div>
        </div>
    );
}
