"use client";
import { motion } from "framer-motion";
import { Plus, Check } from "lucide-react";
import styles from "./ClosetBuilder.module.css";

export default function ClosetBuilder({ items, closetIds, onToggle, onDone, loading }) {
    if (loading) {
        return (
            <div className={styles.loading}>
                <div className={styles.spinner} />
                <p>Building your starter closet...</p>
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
                Your Starter Kit
            </motion.h3>
            <p className={styles.subtitle}>
                Tap to remove anything you don&apos;t own. Add it back any time.
            </p>

            <div className={styles.grid}>
                {items.map((item, i) => {
                    const owned = closetIds.has(item.id);
                    return (
                        <motion.button
                            key={item.id}
                            className={`${styles.item} ${owned ? styles.owned : styles.notOwned}`}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                            onClick={() => onToggle(item.id, owned)}
                        >
                            <div className={styles.iconWrap}>
                                {item.image_url ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={item.image_url} alt={item.name} className={styles.itemImg} />
                                ) : (
                                    <span className={styles.placeholder}>👕</span>
                                )}
                            </div>
                            <span className={styles.itemName}>{item.name}</span>
                            <span className={styles.badge}>
                                {owned ? <Check size={14} /> : <Plus size={14} />}
                            </span>
                        </motion.button>
                    );
                })}
            </div>

            <motion.button
                className={styles.doneBtn}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onDone}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                See Today&apos;s Outfit →
            </motion.button>
        </div>
    );
}
