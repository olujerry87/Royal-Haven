"use client";
import { motion } from "framer-motion";
import styles from "./ColorPicker.module.css";

const PALETTE_OPTIONS = [
    { id: "black", name: "Black", hex: "#1A1A1A" },
    { id: "white", name: "White", hex: "#F5F5F5" },
    { id: "navy", name: "Navy/Denim", hex: "#2C3E50" },
    { id: "earth", name: "Earth Tones", hex: "#8B5A2B" },
    { id: "bright", name: "Bright", hex: "#E74C3C" }
];

export default function ColorPicker({ items, closetIds, itemColors, onChange, onDone }) {
    const selectedItems = items.filter(i => closetIds.has(i.id));

    if (selectedItems.length === 0) {
        return (
            <div className={styles.container}>
                <p className={styles.subtitle}>No items selected. Go back to add items to your closet.</p>
                <button className={styles.doneBtn} onClick={onDone}>Skip →</button>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <motion.h3
                className={styles.title}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                Color Profiling
            </motion.h3>
            <p className={styles.subtitle}>
                What colors dominate your closet pieces? (Optional)
            </p>

            <div className={styles.list}>
                {selectedItems.map((item, i) => (
                    <motion.div 
                        key={item.id} 
                        className={styles.row}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                    >
                        <span className={styles.itemName}>{item.name}</span>
                        <div className={styles.swatchGroup}>
                            {PALETTE_OPTIONS.map(color => (
                                <button
                                    key={color.id}
                                    className={`${styles.swatch} ${itemColors[item.id] === color.id ? styles.selected : ""}`}
                                    style={{ backgroundColor: color.hex }}
                                    onClick={() => onChange(item.id, color.id)}
                                    title={color.name}
                                />
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>

            <motion.button
                className={styles.doneBtn}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onDone}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                Context & Weather →
            </motion.button>
        </div>
    );
}
