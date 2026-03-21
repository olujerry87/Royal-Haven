"use client";
import { motion } from "framer-motion";
import { Plus, Check, Shirt, Archive, Layers, Footprints, Crown } from "lucide-react";
import styles from "./ClosetBuilder.module.css";

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

    const emoji = CATEGORY_EMOJIS[category] || CATEGORY_EMOJIS['shirt'];
    return <span style={{ fontSize: '24px', lineHeight: 1 }}>{emoji}</span>;
}

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
                Tap an icon to add/remove it. Click an item's <b>text name</b> to quickly copy it to your clipboard if you need to search it online.
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
                                    <span className={styles.placeholder}>{getIcon(item.category, item.name)}</span>
                                )}
                            </div>
                            <span 
                                className={styles.itemName}
                                title="Click to copy item name"
                                onClick={(e) => {
                                    e.stopPropagation(); // Don't toggle the item state
                                    navigator.clipboard.writeText(item.name);
                                    const orig = e.target.innerText;
                                    e.target.innerText = "✓ Copied";
                                    setTimeout(() => e.target.innerText = orig, 1000);
                                }}
                            >
                                {item.name}
                            </span>
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
