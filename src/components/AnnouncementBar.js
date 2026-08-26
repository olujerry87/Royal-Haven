"use client";

import styles from "./AnnouncementBar.module.css";
import LanguageToggle from "./LanguageToggle";
import { useLanguage } from "@/context/LanguageContext";

export default function AnnouncementBar() {
    const { t } = useLanguage();

    const announcementText = t("announcement.text", "FREE SHIPPING over $150 | Proudly Made in Canada");

    return (
        <aside className={styles.bar} aria-label="Announcement">
            <div className={styles.container}>
                {/* Left Spacer on Desktop to balance the center text */}
                <div className={styles.spacerLeft} aria-hidden="true" />

                {/* Centered Announcement Message */}
                <div className={styles.centerText}>
                    <p>{announcementText}</p>
                </div>

                {/* Right Side Desktop Language Toggle */}
                <div className={styles.desktopToggle}>
                    <LanguageToggle variant="announcement" />
                </div>
            </div>
        </aside>
    );
}
