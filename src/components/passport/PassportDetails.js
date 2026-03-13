"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Info, Sparkles, Droplets } from "lucide-react";
import styles from "./PassportDetails.module.css";
import SocialShare from "./SocialShare";
import WeatherStyling from "./WeatherStyling";

export default function PassportDetails({ garment }) {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={styles.passportCard}
        >
            <div className={styles.header}>
                <div className={styles.statusBadge}>
                    <ShieldCheck size={16} />
                    <span>Verified Active</span>
                </div>
                <h1 className={styles.title}>{garment.garment_name}</h1>
                {garment.collection && (
                    <p className={styles.collection}>From the {garment.collection} Collection</p>
                )}
            </div>

            <div className={styles.grid}>
                {/* Story Section */}
                <div className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <Info size={20} className={styles.icon} />
                        <h2>The Origin Story</h2>
                    </div>
                    <div className={styles.contentBox}>
                        <p>{garment.origin_story || "A masterpiece born from the intersection of heritage and modern luxury. Meticulously crafted for the discerning eye."}</p>
                    </div>
                </div>

                {/* Care Section */}
                <div className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <Droplets size={20} className={styles.icon} />
                        <h2>Care Instructions</h2>
                    </div>
                    <div className={styles.contentBox}>
                        <p>{garment.care_instructions || "Dry clean only. Store in a cool, dry place. Handle with the dignity it commands."}</p>
                    </div>
                </div>
            </div>

            {/* Weather Styling Intelligence */}
            <div className={styles.fullWidthSection}>
                <div className={styles.sectionHeader}>
                    <Sparkles size={20} className={styles.icon} />
                    <h2>Styling Intelligence</h2>
                </div>
                <WeatherStyling garmentName={garment.garment_name} />
            </div>

            <div className={styles.footer}>
                <SocialShare garment={garment} context="passport" />
            </div>
        </motion.div>
    );
}
