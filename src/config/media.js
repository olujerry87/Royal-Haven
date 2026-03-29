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
        footer: "/logos/header-logo.png",
        wura: "/logos/wura-logo.png",
        ewa: "/logos/ewa-logo.png",
    },

    // Homepage
    home: {
        spotlight_1: "/images/spotlight.jpg",
        spotlight_2: "/images/journal.jpg", // The image before FAQ
        hero_video: "/videos/hero-bg.mp4",
    },

    // Heritage Page
    heritage: {
        hero: "/images/spotlight.jpg",
        center_model: "/images/ewa-idle.jpg",
        duality_wura: "/images/wura-idle.jpg",
        duality_ewa: "/images/ewa-idle.jpg",
        
        // Floating "Living Heritage" Cards
        floating_cards: {
            precision_cut: "/images/spotlight.jpg",
            silk_textures: "/images/spotlight.jpg",
            royal_gems: "/images/spotlight.jpg",
            artistic_vision: "/images/spotlight.jpg",
            custom_fit: "/images/spotlight.jpg",
            beaded_detail: "/images/spotlight.jpg",
        }
    },

    // Services (Ewa Artistry)
    services: {
        hero: "/images/spotlight.jpg",
        hair_banner: "/images/ewa-hair.jpg",
        makeup_banner: "/images/ewa-makeup.jpg",
        gele_banner: "/images/ewa-gele.jpg",

        // Selected Works Portfolio
        portfolio: [
            { id: 1, image: "/images/spotlight.jpg", title: "Bridal Glamour" },
            { id: 2, image: "/images/banner-1.jpg", title: "Editorial Campaign" },
            { id: 3, image: "/images/ewa-idle.jpg", title: "Traditional Elegance" },
            { id: 4, image: "/images/journal.jpg", title: "Studio Portraits" }
        ]
    },

    // Shop Page
    shop: {
        hero: "/images/shop-hero.jpg",
    },

    // Lookbook Page
    lookbook: {
        hero: "/images/spotlight.jpg",
    },

    // UI Fallbacks / Placeholders
    placeholders: {
        hero: "/images/spotlight.jpg",
        product: "/images/spotlight.jpg",
        spotlight: "/images/spotlight.jpg",
    }
};
