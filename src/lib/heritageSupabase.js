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

// Rich 6-card spatial matrix matching Square's canvas array
export const DEFAULT_HERITAGE_MICRO_CARDS = [
    {
        id: "card-wura-couture",
        title: "Wura Couture",
        subtitle: "Tactile Indigenous Fashion",
        badge: "COUTURE",
        image_url: SITE_MEDIA.heritage.duality_wura,
        link_url: "/shop",
        position: 1
    },
    {
        id: "card-ewa-artistry",
        title: "Ewa Artistry",
        subtitle: "Bridal & Beauty Services",
        badge: "ARTISTRY",
        image_url: SITE_MEDIA.heritage.duality_ewa,
        link_url: "/services",
        position: 2
    },
    {
        id: "card-ntag-passport",
        title: "NTAG Passport",
        subtitle: "Digital Provenance & Weather Styling",
        badge: "INNOVATION",
        image_url: SITE_MEDIA.heritage.hero,
        link_url: "#styling",
        position: 3
    },
    {
        id: "card-royal-archives",
        title: "Royal Archives",
        subtitle: "African Craftsmanship & Legacy",
        badge: "HERITAGE",
        image_url: "https://cdn.builder.io/api/v1/image/assets%2F48904b6ada2c4086ab7af82900bb21db%2Ff7dee33d8cd74ba183c59b0e10d0912d",
        link_url: "/lookbook",
        position: 4
    },
    {
        id: "card-atelier",
        title: "Besano Atelier",
        subtitle: "Custom Bespoke Tailoring",
        badge: "BESPOKE",
        image_url: SITE_MEDIA.lookbook.slide1,
        link_url: "/services/book",
        position: 5
    },
    {
        id: "card-runway",
        title: "2026 Lookbook",
        subtitle: "Modern Luxury Runway",
        badge: "LOOKBOOK",
        image_url: SITE_MEDIA.lookbook.slide2,
        link_url: "/lookbook",
        position: 6
    }
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
        const cards = (cardsData && cardsData.length >= 4) ? cardsData : DEFAULT_HERITAGE_MICRO_CARDS;

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
