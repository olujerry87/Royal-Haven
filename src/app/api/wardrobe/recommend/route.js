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

        return Response.json({
            formulaName: formula.name,
            matchRate,
            matchedItems,
            missingCategory: missingCategory || null,
            nudgeProduct,
            stylistAdvice: formula.advice,
            reasoning: buildRobustReasoning(weather, event, condition, matchedItems, missingCategory, formula, matchRate),
        });
    } catch (err) {
        console.error("[recommend]", err.message);
        return Response.json({ error: "Recommendation failed" }, { status: 500 });
    }
}

function buildRobustReasoning(weather, event, condition, matchedItems, missingCategory, formula, matchRate) {
    const temp = weather.temp;
    const condLabel = weather.conditionLabel || condition;
    
    let summary = `Our recommendation for **${formula.name}** is based on the ${temp}°C and ${condLabel.toLowerCase()} weather. `;
    
    if (matchRate === 100) {
        summary += `Great news: you have every piece of this formula ready to go (100% Match). `;
    } else {
        summary += `You're at ${matchRate}% capacity for this look. Adding a ${missingCategory.replace(/_/g, " ")} would complete it perfectly. `;
    }

    const whyItWorks = `The pairing of the ${formula.base.join(" and ").replace(/_/g, " ")} provides the core structure, while the stylist chosen ${formula.shoes.replace(/_/g, " ")} grounds the silhouette for a ${event} setting.`;

    return `${summary}\n\n**Why it works:** ${whyItWorks}`;
}
