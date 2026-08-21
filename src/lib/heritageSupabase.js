import { createClient } from "@supabase/supabase-js";
import { SITE_MEDIA } from "@/config/media";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const supabase = (supabaseUrl && supabaseKey) 
    ? createClient(supabaseUrl, supabaseKey)
    : null;

// Default high-quality media fallbacks for Royal Haven Heritage
export const DEFAULT_HERITAGE_MORPH_CONFIG = {
    hero_title: "Our Heritage",
    hero_subtitle: "The Convergence of Indigenous Fashion & Modern Artistry",
    badge_text: "ROYAL HAVEN ARCHIVES — EST. 2017",
    video_url: "https://bezaleelgroup.ca/wp-content/uploads/2026/02/wura-ewa-hero-loop.mp4",
    poster_image: SITE_MEDIA.heritage.hero,
    cta_text: "Explore Living Heritage",
    cta_link: "#duality"
};

// 19 High-Res Visual Photo Cards (10 Top + 9 Bottom + 1 Morphing Hero Video)
export const DEFAULT_HERITAGE_MICRO_CARDS = [
    // ── TOP SECTION (10 CARDS ABOVE HEADLINE DIVIDER) ─────────────────────────
    { id: "top-1", image_url: SITE_MEDIA.heritage.duality_wura, position: 1 },
    { id: "top-2", image_url: SITE_MEDIA.heritage.duality_ewa, position: 2 },
    { id: "top-3", image_url: SITE_MEDIA.heritage.hero, position: 3 },
    { id: "top-4", image_url: SITE_MEDIA.lookbook.slide1, position: 4 },
    { id: "top-5", image_url: SITE_MEDIA.lookbook.slide2, position: 5 },
    { id: "top-6", image_url: SITE_MEDIA.heritage.duality_wura, position: 6 },
    { id: "top-7", image_url: SITE_MEDIA.heritage.duality_ewa, position: 7 },
    { id: "top-8", image_url: SITE_MEDIA.heritage.hero, position: 8 },
    { id: "top-9", image_url: SITE_MEDIA.lookbook.slide1, position: 9 },
    { id: "top-10", image_url: SITE_MEDIA.lookbook.slide2, position: 10 },

    // ── BOTTOM SECTION (9 CARDS BELOW HEADLINE DIVIDER) ──────────────────────
    { id: "bot-1", image_url: SITE_MEDIA.heritage.duality_wura, position: 11 },
    { id: "bot-2", image_url: SITE_MEDIA.heritage.duality_ewa, position: 12 },
    { id: "bot-3", image_url: SITE_MEDIA.heritage.hero, position: 13 },
    { id: "bot-4", image_url: SITE_MEDIA.lookbook.slide1, position: 14 },
    { id: "bot-5", image_url: SITE_MEDIA.lookbook.slide2, position: 15 },
    { id: "bot-6", image_url: SITE_MEDIA.heritage.duality_wura, position: 16 },
    { id: "bot-7", image_url: SITE_MEDIA.heritage.duality_ewa, position: 17 },
    { id: "bot-8", image_url: SITE_MEDIA.heritage.hero, position: 18 },
    { id: "bot-9", image_url: SITE_MEDIA.lookbook.slide1, position: 19 },
];

/**
 * Fetch Heritage Morph Configuration & Micro Cards from Supabase.
 */
export async function getHeritageMorphData() {
    if (!supabase) {
        return {
            config: DEFAULT_HERITAGE_MORPH_CONFIG,
            cards: DEFAULT_HERITAGE_MICRO_CARDS
        };
    }

    try {
        const { data: configData } = await supabase
            .from("heritage_morph_config")
            .select("*")
            .single();

        const { data: cardsData } = await supabase
            .from("heritage_micro_cards")
            .select("*")
            .order("position", { ascending: true });

        const config = configData ? { ...DEFAULT_HERITAGE_MORPH_CONFIG, ...configData } : DEFAULT_HERITAGE_MORPH_CONFIG;
        const cards = (cardsData && cardsData.length >= 10) ? cardsData : DEFAULT_HERITAGE_MICRO_CARDS;

        return { config, cards };
    } catch (err) {
        console.warn("[HeritageSupabase] Fetch notice:", err.message);
        return {
            config: DEFAULT_HERITAGE_MORPH_CONFIG,
            cards: DEFAULT_HERITAGE_MICRO_CARDS
        };
    }
}

/**
 * Update Heritage Morph Configuration in Supabase
 */
export async function updateHeritageMorphConfig(configPayload) {
    if (!supabase) throw new Error("Supabase environment variables not configured.");

    const { data, error } = await supabase
        .from("heritage_morph_config")
        .upsert({ id: 1, ...configPayload, updated_at: new Date().toISOString() });

    if (error) throw error;
    return data;
}

/**
 * Save/Update Micro Cards in Supabase
 */
export async function saveHeritageMicroCards(cardsArray) {
    if (!supabase) throw new Error("Supabase environment variables not configured.");

    const { data, error } = await supabase
        .from("heritage_micro_cards")
        .upsert(cardsArray);

    if (error) throw error;
    return data;
}
