"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Globe } from "lucide-react";
import styles from "./LanguageToggle.module.css";

export default function LanguageToggle({ variant = "announcement", className = "" }) {
    const { language, toggleLanguage } = useLanguage();

    // When language is "en", target is "Français"
    // When language is "fr", target is "English"
    const targetLabel = language === "en" ? "Français" : "English";
    const currentCode = language === "en" ? "EN" : "FR";
    const targetCode = language === "en" ? "FR" : "EN";

    if (variant === "drawer") {
        return (
            <button
                type="button"
                onClick={toggleLanguage}
                className={`${styles.drawerToggle} ${className}`}
                aria-label={`Switch language to ${targetLabel}`}
            >
                <span className={styles.drawerLabel}>
                    <Globe size={16} /> Language / Langue
                </span>
                <span className={styles.drawerTarget}>
                    {targetLabel} ({targetCode})
                </span>
            </button>
        );
    }

    if (variant === "mobile-header") {
        return (
            <button
                type="button"
                onClick={toggleLanguage}
                className={`${styles.mobileHeaderToggle} ${className}`}
                aria-label={`Switch language to ${targetLabel}`}
                title={`Switch language to ${targetLabel}`}
            >
                <Globe size={13} />
                <span style={{ fontWeight: 700, letterSpacing: '0.5px' }}>{targetCode}</span>
            </button>
        );
    }

    // Default: announcement bar desktop variant
    return (
        <button
            type="button"
            onClick={toggleLanguage}
            className={`${styles.announcementToggle} ${className}`}
            aria-label={`Switch language to ${targetLabel}`}
            title={`Switch to ${targetLabel}`}
        >
            <Globe size={12} />
            <span>{targetLabel}</span>
        </button>
    );
}
