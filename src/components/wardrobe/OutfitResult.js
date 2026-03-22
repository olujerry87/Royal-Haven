"use client";

import { motion } from "framer-motion";
import { CloudRain, Sun, Cloud, Snowflake, Loader2, Droplets, Wind, MapPin, Shirt, Archive, Layers, Footprints, Crown } from "lucide-react";
import styles from "./OutfitResult.module.css";

const CATEGORY_EMOJIS = {
    shirt: "👕", blouse: "👚", crop_top: "👚",
    sweater: "🧥", athletic: "🎽",
    trousers: "👖", jeans: "👖", shorts: "🩳",
    skirt: "👗", jumpsuit: "🩱", suit: "👔",
    dress: "👗", coat: "🧥", jacket: "🧥", blazer: "🧥",
    hat: "🧢", shoes: "👟", accessory: "👔",
    scarf: "🧣", underwear: "🩲", socks: "🧦",
};

function getIcon(category, name) {
    if (!name) return CATEGORY_EMOJIS[category] || "👕";
    const lower = name.toLowerCase();
    
    if (lower.includes("boot")) return "👢";
    if (lower.includes("sneaker")) return "👟";
    if (lower.includes("sandal") || lower.includes("slide") || lower.includes("espadrille")) return "👡";
    if (lower.includes("loafer") || lower.includes("oxford") || lower.includes("brogue") || lower.includes("monk")) return "👞";
    if (lower.includes("stiletto") || lower.includes("pump") || lower.includes("heel")) return "👠";
    
    if (lower.includes("beanie") || lower.includes("trapper")) return "❄️🧢";
    if (lower.includes("fedora") || lower.includes("top hat") || lower.includes("homburg")) return "🎩";
    if (lower.includes("baseball") || lower.includes("snapback")) return "🧢";
    if (lower.includes("cowboy")) return "🤠";
    if (lower.includes("visor") || lower.includes("sun hat")) return "👒";
    
    if (lower.includes("tie") || lower.includes("cravat") || lower.includes("ascot")) return "👔";
    if (lower.includes("scarf")) return "🧣";
    if (lower.includes("jumpsuit") || lower.includes("romper") || lower.includes("dungaree")) return "🩱";
    if (lower.includes("suit") || lower.includes("tuxedo")) return "🕴️";

    return CATEGORY_EMOJIS[category] || CATEGORY_EMOJIS['shirt'];
}

const EVENTS = ["work", "casual", "date", "gym"];

const WEATHER_ICONS = {
    rain: CloudRain,
    snow: Snowflake,
    clear: Sun,
    cloudy: Cloud,
    cold: Cloud,
    warm: Sun,
};

export default function OutfitResult({ 
    weather, 
    event, 
    onEventChange, 
    items, 
    loading, 
    reasoning, 
    formulaName, 
    stylistAdvice, 
    matchRate,
    stylingTips,
    colorPalette,
    onResetVibe,
    onStartOver
}) {
    const { RefreshCcw, RotateCcw } = require("lucide-react");

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
                    {weather?.feels_like != null && (
                        <span className={styles.metaChip}>
                            Feels like {weather.feels_like}°C
                        </span>
                    )}
                    {weather?.temp_min != null && weather?.temp_max != null && (
                        <span className={styles.metaChip}>
                            H:{weather.temp_max}° / L:{weather.temp_min}°
                        </span>
                    )}
                    {weather?.humidity != null && (
                        <span className={styles.metaChip}>
                            <Droplets size={12} /> {weather.humidity}% Humidity
                        </span>
                    )}
                    {weather?.windspeed != null && (
                        <span className={styles.metaChip}>
                            <Wind size={12} /> {weather.windspeed} km/h Wind
                        </span>
                    )}
                    {weather?.hourly && weather.hourly.length > 0 && (
                        <span className={styles.metaChip} style={{ width: '100%', marginTop: '4px', overflowX: 'auto', whiteSpace: 'nowrap' }}>
                            <b>Next 24h:</b> {weather.hourly.filter((_, idx) => idx % 2 === 0).join('° ')}°
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
                    
                    {colorPalette && (
                        <div className={styles.palette}>
                            <div className={styles.swatch} style={{ background: colorPalette.primary }} title="Primary" />
                            <div className={styles.swatch} style={{ background: colorPalette.secondary }} title="Secondary" />
                            <div className={styles.swatch} style={{ background: colorPalette.accent }} title="Accent" />
                            <span className={styles.paletteName}>{colorPalette.name}</span>
                        </div>
                    )}

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
                                    <span style={{ fontSize: '24px', lineHeight: 1 }}>
                                        {getIcon(item.category, item.name)}
                                    </span>
                                )}
                            </div>
                            <p 
                                className={styles.itemName}
                                title="Click to copy item name"
                                style={{ cursor: 'pointer' }}
                                onClick={(e) => {
                                    navigator.clipboard.writeText(item.name);
                                    const orig = e.target.innerText;
                                    e.target.innerText = "✓ Copied";
                                    setTimeout(() => e.target.innerText = orig, 1000);
                                }}
                            >
                                {item.name}
                            </p>
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

            {/* Styling Checklist */}
            {stylingTips && stylingTips.length > 0 && (
                <div className={styles.checklist}>
                    <p className={styles.checklistLabel}>Stylist Checklist</p>
                    {stylingTips.map((tip, idx) => (
                        <div key={idx} className={styles.checkItem}>
                             <div className={styles.checkIcon}>✓</div>
                             <p dangerouslySetInnerHTML={{ __html: tip.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') }} />
                        </div>
                    ))}
                </div>
            )}

            {/* Footer Actions */}
            <div className={styles.footerActions}>
                <motion.button
                    className={`${styles.actionBtn} ${styles.vibeBtn}`}
                    onClick={onResetVibe}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <RefreshCcw size={16} /> Change Aesthetic
                </motion.button>
                <motion.button
                    className={`${styles.actionBtn} ${styles.startOverBtn}`}
                    onClick={onStartOver}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <RotateCcw size={16} /> Start Over
                </motion.button>
            </div>
        </div>
    );
}
