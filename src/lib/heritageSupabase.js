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
};

export const DEFAULT_HERITAGE_MICRO_CARDS = [
    {
        id: "card-wura-1",
        title: "Wura Collection",
        subtitle: "Tactile Indigenous Couture",
        badge: "Couture",
        image_url: SITE_MEDIA.heritage.duality_wura,
        video_url: null,
        link_url: "/shop",
        position: 1
    },
    {
        id: "card-ewa-2",
        title: "Ewa Artistry",
        subtitle: "Luxury Bridal & Styling",
        badge: "Artistry",
        image_url: SITE_MEDIA.heritage.duality_ewa,
        video_url: null,
        link_url: "/services",
        position: 2
    },
    {
        id: "card-passport-3",
        title: "NTAG Garment Passport",
        subtitle: "Digital Provenance & Weather Styling",
        badge: "Innovation",
        image_url: SITE_MEDIA.heritage.hero,
        video_url: null,
        link_url: "#styling",
        position: 3
    }
];

/**
 * Fetch Heritage Morph Configuration & Micro Cards from Supabase.
 * Falls back gracefully to default luxury assets if database tables are uninitialized.
 */
export async function getHeritageMorphData() {
    if (!supabase) {
        return {
            config: DEFAULT_HERITAGE_MORPH_CONFIG,
            cards: DEFAULT_HERITAGE_MICRO_CARDS
        };
    }

    try {
        // Fetch config
        const { data: configData } = await supabase
            .from("heritage_morph_config")
            .select("*")
            .single();

        // Fetch micro cards
        const { data: cardsData } = await supabase
            .from("heritage_micro_cards")
            .select("*")
            .order("position", { ascending: true });

        const config = configData ? { ...DEFAULT_HERITAGE_MORPH_CONFIG, ...configData } : DEFAULT_HERITAGE_MORPH_CONFIG;
        const cards = (cardsData && cardsData.length > 0) ? cardsData : DEFAULT_HERITAGE_MICRO_CARDS;

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
