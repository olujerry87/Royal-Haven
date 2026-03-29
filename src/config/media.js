/**
 * Royal Haven - Central Media Configuration
 * -----------------------------------------
 * This file is the single "Source of Truth" for all brand and UI images.
 * Update these paths to your Supabase URLs to swap images site-wide.
 */

export const SITE_MEDIA = {
    // Brand Identity
    logos: {
        header: "/logos/header-logo.png",
        footer: "/logos/header-logo.png", // Reusing header logo for now
        wura: "/logos/wura-logo.png",
        ewa: "/logos/ewa-logo.png",
    },

    // Homepage
    home: {
        spotlight_1: "/images/spotlight.jpg",
        spotlight_2: "/images/journal.jpg",
        hero_video: "/videos/hero-bg.mp4",
    },

    // Heritage Page
    heritage: {
        hero: "/images/spotlight.jpg",
        duality_wura: "/images/wura-idle.jpg",
        duality_ewa: "/images/ewa-idle.jpg",
    },

    // Services (Ewa Artistry)
    services: {
        hero: "/images/spotlight.jpg",
        hair_banner: "/images/ewa-hair.jpg",
        makeup_banner: "/images/ewa-makeup.jpg",
        gele_banner: "/images/ewa-gele.jpg",
    },

    // UI Fallbacks / Placeholders
    placeholders: {
        hero: "/images/spotlight.jpg",
        product: "/images/spotlight.jpg",
        spotlight: "/images/spotlight.jpg",
    }
};
