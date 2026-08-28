"use client";

import styles from "./AnnouncementBar.module.css";
import LanguageToggle from "./LanguageToggle";
import { useLanguage } from "@/context/LanguageContext";

export default function AnnouncementBar() {
    const { t } = useLanguage();

    const announcements = [
        t("announcement.freeShipping", "🚚 FREE SHIPPING on orders over $150 (Canada-wide)"),
        t("announcement.launchSale", "✨ SITE-WIDE WEBSITE LAUNCH SALE LIVE NOW — LIMITED TIME ONLY"),
        t("announcement.madeInCanada", "🇨🇦 PROUDLY DESIGNED & HANDCRAFTED IN CANADA"),
    ];

    return (
        <aside className={styles.bar} aria-label="Announcements">
            <div className={styles.container}>
                {/* Scrolling Ticker Track */}
                <div className={styles.tickerWrapper}>
                    <div className={styles.tickerTrack}>
                        {/* Duplicate for seamless infinite loop */}
                        {[...announcements, ...announcements, ...announcements].map((item, idx) => (
                            <span key={idx} className={styles.tickerItem}>
                                {item}
                                <span className={styles.separator} aria-hidden="true">•</span>
                            </span>
                        ))}
                    </div>
                </div>

                {/* Right Side Desktop Language Toggle */}
                <div className={styles.desktopToggle}>
                    <LanguageToggle variant="announcement" />
                </div>
            </div>
        </aside>
    );
}

