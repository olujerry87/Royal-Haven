"use client";

import { motion } from "framer-motion";
import { User, UserPlus, Sparkles } from "lucide-react";
import styles from "./IdentityPicker.module.css";

export default function IdentityPicker({ onSelect }) {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Sparkles size={24} className={styles.icon} />
                <h2>Who are we styling today?</h2>
                <p>Select your identity to personalize your digital closet and outfit formulas.</p>
            </div>

            <div className={styles.selectionGrid}>
                <motion.button
                    className={styles.optionCard}
                    whileHover={{ scale: 1.05, borderColor: "var(--gold)" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onSelect("female")}
                >
                    <div className={styles.iconCircle}>
                        <User size={40} strokeWidth={1.5} />
                    </div>
                    <span>Female</span>
                </motion.button>

                <motion.button
                    className={styles.optionCard}
                    whileHover={{ scale: 1.05, borderColor: "var(--gold)" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onSelect("male")}
                >
                    <div className={styles.iconCircle}>
                        <UserPlus size={40} strokeWidth={1.5} />
                    </div>
                    <span>Male / Unisex</span>
                </motion.button>
            </div>
            
            <p className={styles.footerNote}>
                This helps us show you the right silhouettes (Dresses, Blazers, etc.)
            </p>
        </div>
    );
}
