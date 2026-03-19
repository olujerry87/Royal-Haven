/**
 * POST /api/wardrobe/recommend
 * Body: { wardrobe_id, weather: { temp, condition }, event }
 *
 * Core recommendation engine:
 * 1. Fetches user's closet from Supabase.
 * 2. Determines which categories are needed for this weather + event.
 * 3. Matches against user's existing items.
 * 4. Detects "Missing Category" and fetches a WooCommerce product as the upsell nudge.
 */
import { createClient } from "@supabase/supabase-js";
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const woo = new WooCommerceRestApi({
    url: process.env.NEXT_PUBLIC_WORDPRESS_URL,
    consumerKey: process.env.WC_CONSUMER_KEY,
    consumerSecret: process.env.WC_CONSUMER_SECRET,
    version: "wc/v3",
    queryStringAuth: true,
});

// ── Outfit Formula Engine ──────────────────────────────────────────
// Vibe + Event + Weather → Formula
const OUTFIT_FORMULAS = {
    // MINIMALIST VIBE
    "minimalist+work": {
        name: "The Corporate Minimalist",
        base: ["white_tee", "trousers"],
        layer: "blazer",
        shoes: "loafers",
        advice: "Neutral tones and clean lines are your power move. It conveys authority without shouting."
    },
    "minimalist+casual": {
        name: "Elevated Daily",
        base: ["white_tee", "slim_jeans"],
        layer: "hoodie", // if cold
        shoes: "white_sneakers",
        advice: "Focus on the fit. A perfectly weighted tee and slim denim is the ultimate uniform."
    },
    "minimalist+date": {
        name: "The Soft Silhouette",
        base: ["linen_shirt", "chinos"],
        layer: "blazer",
        shoes: "loafers",
        advice: "Subtle textures like linen and cotton create a high-end feel that's approachable."
    },

    // EXPRESSIVE VIBE
    "expressive+work": {
        name: "The Creative Professional",
        base: ["graphic_tee", "trousers"],
        layer: "black_blazer",
        shoes: "sneakers",
        advice: "Breaking the rules, intentionally. The blazer keeps it professional; the tee keeps it you."
    },
    "expressive+casual": {
        name: "Street Heritage",
        base: ["graphic_tee", "cargo_pants"],
        layer: "hoodie",
        shoes: "sneakers",
        advice: "Volume and contrast. Don't be afraid to mix your textures today."
    },
    "expressive+date": {
        name: "Midnight Maven",
        base: ["satin_blouse", "slim_jeans"],
        layer: "black_blazer",
        shoes: "ankle_boots",
        advice: "Rich fabrics and slightly edgy pairings make for a look they won't forget."
    },

    // SHARP VIBE
    "sharp+work": {
        name: "The Executive",
        base: ["dress_shirt", "trousers"],
        layer: "blazer",
        shoes: "dress_shoes",
        advice: "Crisp, ironed, and intentional. This look demands the room's attention."
    },
    "sharp+casual": {
        name: "Weekend Tailored",
        base: ["linen_shirt", "chinos"],
        layer: null,
        shoes: "loafers",
        advice: "Even off the clock, you stay polished. Tucking in the shirt is the key here."
    },
    "sharp+date": {
        name: "The Dapper Gent/Lady",
        base: ["dress_shirt", "slim_jeans"],
        layer: "blazer",
        shoes: "dress_shoes",
        advice: "High-low styling: Formal on top, versatile on the bottom. Perfect for a changing evening."
    }
};

// Fallback logic for gym across any vibe
const GYM_FORMULA = {
    name: "Performance First",
    base: ["athletic_top", "shorts"],
    layer: "hoodie",
    shoes: "sneakers",
    advice: "Functional, breathable, and focused. Let the gear do the work."
};

// Category → WooCommerce product search term
const CATEGORY_TO_SEARCH = {
    trenchcoat:   "coat",
    blazer:       "blazer",
    black_blazer: "blazer",
    ankle_boots:  "boots",
    dress_shoes:  "shoes",
    loafers:      "loafers",
    linen_shirt:  "shirt",
    dress_shirt:  "shirt",
    chinos:       "trousers",
    trousers:     "trousers",
    slim_jeans:   "jeans",
    hoodie:       "hoodie",
    joggers:      "trousers",
    sneakers:     "sneakers",
    athletic_top: "top",
    shorts:       "shorts",
    white_tee:    "tee",
};

export async function POST(request) {
    try {
        const { wardrobe_id, weather, event, vibe = "minimalist" } = await request.json();

        if (!wardrobe_id || !weather || !event) {
            return Response.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Simplify weather
        const condition = weather.temp < 15 ? "cold" : weather.condition || "clear";
        
        // Select Formula
        const formulaKey = event === "gym" ? "gym" : `${vibe}+${event}`;
        const formula = event === "gym" ? GYM_FORMULA : (OUTFIT_FORMULAS[formulaKey] || OUTFIT_FORMULAS["minimalist+casual"]);

        // Build list of categories we need for this look
        let neededCategories = [...formula.base, formula.shoes];
        if (condition === "cold" || condition === "rain" || condition === "snow") {
            if (formula.layer) neededCategories.unshift(formula.layer);
        }

        // Fetch user's closet
        const { data, error: cErr } = await supabase
            .from("user_closets")
            .select("item_templates(id, name, category, image_url)")
            .eq("wardrobe_id", wardrobe_id);

        if (cErr) throw cErr;

        const userItems = (data || []).map((r) => r.item_templates).filter(Boolean);
        const userCategories = new Set(userItems.map((i) => i.category));

        // Match items
        const matchedItems = neededCategories
            .map((cat) => userItems.find((i) => i.category === cat))
            .filter(Boolean);

        const matchRate = Math.round((matchedItems.length / neededCategories.length) * 100);
        const missingCategory = neededCategories.find((cat) => !userCategories.has(cat));

        let nudgeProduct = null;
        if (missingCategory) {
            const searchTerm = CATEGORY_TO_SEARCH[missingCategory] || missingCategory;
            try {
                const { data: products } = await woo.get("products", {
                    search: searchTerm,
                    stock_status: "instock",
                    per_page: 1,
                });
                nudgeProduct = products?.[0] || null;
            } catch (wErr) {
                console.warn("[recommend] WooCommerce nudge failed:", wErr.message);
            }
        }

        // Determine Stylist Rules and Tips based on Vibe and Event
        const { stylingTips, colorPalette, stylingPersona } = getStylistAdvice(vibe, event, gender, matchedItems);

        return Response.json({
            formulaName: formula.name,
            matchRate,
            matchedItems,
            missingCategory: missingCategory || null,
            nudgeProduct,
            stylistAdvice: stylingPersona || formula.advice,
            stylingTips,
            colorPalette,
            reasoning: buildRobustReasoning(weather, event, condition, matchedItems, missingCategory, formula, matchRate, stylingTips),
        });
    } catch (err) {
        console.error("[recommend]", err.message);
        return Response.json({ error: "Recommendation failed" }, { status: 500 });
    }
}

function getStylistAdvice(vibe, event, gender, items) {
    const tips = [];
    let palette = { primary: "#E5E5E5", secondary: "#1A1A1A", accent: "#D4AF37" }; // Default
    let persona = "Elegance is refusal.";

    // 1. Apply Sandwich Rule (if we have tops and shoes)
    const hasTop = items.some(i => i.category.includes('shirt') || i.category.includes('tee') || i.category.includes('blouse'));
    const hasShoes = items.some(i => i.category === 'shoes' || i.category.includes('sneakers') || i.category.includes('boots'));
    if (hasTop && hasShoes) {
        tips.push("Apply the **Sandwich Rule**: Ensure your shoes match the color or 'visual weight' of your top or accessories.");
    }

    // 2. Third Piece Rule
    const hasLayer = items.some(i => i.category === 'blazer' || i.category === 'trenchcoat' || i.category === 'hoodie');
    if (hasLayer) {
        tips.push("The **Third Piece Rule**: Your outerwear isn't just for warmth; it completes the silhouette.");
    } else {
        tips.push("Consider a **Third Piece**: Adding a lightweight blazer or cardigan would transition this from 'clothed' to 'styled'.");
    }

    // 3. Proportion & Tucking
    if (gender === 'female' && event === 'date') {
        tips.push("Try a **French Tuck**: Just the front center of your top to define the waist without bulk.");
    } else if (gender === 'male' && event === 'work') {
        tips.push("Go for a **Full Tuck**: It anchors the look and highlights the belt line for a sharper executive presence.");
    }

    // 4. Color Palettes (Elevated Trends)
    const palettes = [
        { name: "Camel & Navy", primary: "#C19A6B", secondary: "#000080", accent: "#FFFFFF", tip: "The gold standard for classic, Vogue-style elevation." },
        { name: "Chocolate & Ice Blue", primary: "#3D2B1F", secondary: "#99CCFF", accent: "#E5E5E5", tip: "A modern, expensive pairing that's trending now." },
        { name: "Monochrome Grey & Red", primary: "#808080", secondary: "#A9A9A9", accent: "#FF0000", tip: "Use a single bold red accessory to ground the grey look." }
    ];
    
    // Pick palette based on vibe
    const selectedPalette = vibe === 'minimalist' ? palettes[0] : vibe === 'sharp' ? palettes[1] : palettes[2];
    palette = selectedPalette;
    persona = selectedPalette.tip;

    return { stylingTips: tips, colorPalette: selectedPalette, stylingPersona: persona };
}

function buildRobustReasoning(weather, event, condition, matchedItems, missingCategory, formula, matchRate, tips) {
    const temp = weather.temp;
    const condLabel = weather.conditionLabel || condition;
    
    let summary = `Our recommendation for **${formula.name}** is optimized for **${temp}°C** and **${condLabel.toLowerCase()}** weather. `;
    
    if (matchRate === 100) {
        summary += `You have the full 3-piece structure ready (100% Match). `;
    } else {
        summary += `You're at ${matchRate}% capacity. A ${missingCategory?.replace(/_/g, " ")} would bridge the gap. `;
    }

    const tipSummary = tips.length > 0 ? `\n\n**Stylist Rules Applied:**\n- ${tips.join('\n- ')}` : "";

    return `${summary}${tipSummary}`;
}
