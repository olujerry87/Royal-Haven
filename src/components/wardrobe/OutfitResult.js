"use client";

import { motion } from "framer-motion";
import { CloudRain, Sun, Cloud, Snowflake, Loader2 } from "lucide-react";
import styles from "./OutfitResult.module.css";

const EVENTS = ["work", "casual", "date", "gym"];

const WEATHER_ICONS = {
    rain: CloudRain,
    snow: Snowflake,
    clear: Sun,
    cloudy: Cloud,
    cold: Cloud,
    warm: Sun,
};

export default function OutfitResult({ weather, event, onEventChange, items, loading }) {
    const WeatherIcon = WEATHER_ICONS[weather?.condition] || Sun;

    return (
        <div className={styles.container}>
            {/* Weather + Event Controls */}
            <div className={styles.context}>
                <div className={styles.weatherBadge}>
                    <WeatherIcon size={22} className={styles.weatherIcon} />
                    <span>{weather?.temp ?? "--"}°C</span>
                </div>

                <div className={styles.eventToggle}>
                    {EVENTS.map((e) => (
                        <button
                            key={e}
                            className={`${styles.eventBtn} ${event === e ? styles.active : ""}`}
                            onClick={() => onEventChange(e)}
                        >
                            {e.charAt(0).toUpperCase() + e.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Outfit Items */}
            {loading ? (
                <div className={styles.loading}>
                    <Loader2 className={styles.spinner} size={28} />
                    <p>Styling your look...</p>
                </div>
            ) : items.length === 0 ? (
                <div className={styles.empty}>
                    <p>No items matched in your closet for this combo.</p>
                    <p style={{ opacity: 0.5, fontSize: "0.85rem" }}>Try a different event or add more items to your closet.</p>
                </div>
            ) : (
                <motion.div
                    className={styles.outfitGrid}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    {items.map((item, i) => (
                        <motion.div
                            key={item.id}
                            className={styles.outfitCard}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <div className={styles.itemIcon}>
                                {item.image_url ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={item.image_url} alt={item.name} className={styles.itemImg} />
                                ) : (
                                    <span>👕</span>
                                )}
                            </div>
                            <p className={styles.itemName}>{item.name}</p>
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </div>
    );
}
