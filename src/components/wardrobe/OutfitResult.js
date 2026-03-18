"use client";

import { motion } from "framer-motion";
import { CloudRain, Sun, Cloud, Snowflake, Loader2, Droplets, Wind, MapPin, Shirt, Archive, Layers, Footprints } from "lucide-react";
import styles from "./OutfitResult.module.css";

const CATEGORY_ICONS_SMALL = {
    trousers: Archive,
    slim_jeans: Archive,
    chinos: Archive,
    cargo_pants: Archive,
    joggers: Archive,
    shorts: Archive,
    trenchcoat: Layers,
    blazer: Layers,
    black_blazer: Layers,
    hoodie: Layers,
    sneakers: Footprints,
    white_sneakers: Footprints,
    dress_shoes: Footprints,
    loafers: Footprints,
    ankle_boots: Footprints,
};

const EVENTS = ["work", "casual", "date", "gym"];

const WEATHER_ICONS = {
    rain: CloudRain,
    snow: Snowflake,
    clear: Sun,
    cloudy: Cloud,
    cold: Cloud,
    warm: Sun,
};

export default function OutfitResult({ weather, event, onEventChange, items, loading, reasoning, formulaName, stylistAdvice, matchRate }) {
    const WeatherIcon = WEATHER_ICONS[weather?.condition] || Sun;

    return (
        <div className={styles.container}>
            {/* Rich Weather Panel */}
            <div className={styles.weatherPanel}>
                <div className={styles.weatherMain}>
                    <span className={styles.weatherEmoji}>{weather?.emoji || "☀️"}</span>
                    <div>
                        <p className={styles.weatherTemp}>{weather?.temp ?? "--"}°C</p>
                        <p className={styles.conditionLabel}>{weather?.conditionLabel || "Clear Skies"}</p>
                    </div>
                </div>
                <div className={styles.weatherMeta}>
                    {weather?.cityName && (
                        <span className={styles.metaChip}>
                            <MapPin size={12} /> {weather.cityName}
                        </span>
                    )}
                    {weather?.humidity != null && (
                        <span className={styles.metaChip}>
                            <Droplets size={12} /> {weather.humidity}% humidity
                        </span>
                    )}
                    {weather?.windspeed != null && (
                        <span className={styles.metaChip}>
                            <Wind size={12} /> {weather.windspeed} km/h
                        </span>
                    )}
                </div>
            </div>

            {/* Event Controls */}
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

            {/* Formula Header */}
            {formulaName && (
                <div className={styles.formulaHeader}>
                    <p className={styles.vibeLabel}>Stylist Rec:</p>
                    <h3 className={styles.formulaTitle}>{formulaName}</h3>
                    {stylistAdvice && <p className={styles.stylistAdvice}>&ldquo;{stylistAdvice}&rdquo;</p>}
                    
                    <div className={styles.matchBarContainer}>
                        <div className={styles.matchBarLabel}>
                            Closet Capacity: <span>{matchRate}%</span>
                        </div>
                        <div className={styles.matchBar}>
                            <motion.div 
                                className={styles.matchFill} 
                                initial={{ width: 0 }}
                                animate={{ width: `${matchRate}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                            />
                        </div>
                    </div>
                </div>
            )}

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
                                    <span>
                                        {(() => {
                                            const Icon = CATEGORY_ICONS_SMALL[item.category] || Shirt;
                                            return <Icon size={24} />;
                                        })()}
                                    </span>
                                )}
                            </div>
                            <p className={styles.itemName}>{item.name}</p>
                        </motion.div>
                    ))}
                </motion.div>
            )}

            {/* Why This Look */}
            {reasoning && (
                <motion.div
                    className={styles.reasoning}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    <p className={styles.reasoningLabel}>Strategic Breakdown</p>
                    <div className={styles.reasoningText} dangerouslySetInnerHTML={{ __html: reasoning?.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br/>') }} />
                </motion.div>
            )}
        </div>
    );
}
