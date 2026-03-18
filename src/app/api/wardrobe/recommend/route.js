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

// Weather + Event → Required Category Map
const OUTFIT_MAP = {
    "rain+work":    ["trenchcoat", "trousers", "dress_shirt", "loafers"],
    "rain+casual":  ["hoodie", "joggers", "sneakers"],
    "rain+date":    ["trenchcoat", "slim_jeans", "ankle_boots"],
    "rain+gym":     ["athletic_top", "shorts", "sneakers"],
    "cold+work":    ["blazer", "dress_shirt", "trousers", "dress_shoes"],
    "cold+casual":  ["black_blazer", "slim_jeans", "white_sneakers"],
    "cold+date":    ["blazer", "chinos", "loafers"],
    "cold+gym":     ["hoodie", "joggers", "sneakers"],
    "warm+work":    ["dress_shirt", "chinos", "loafers"],
    "warm+casual":  ["white_tee", "slim_jeans", "white_sneakers"],
    "warm+date":    ["linen_shirt", "chinos", "loafers"],
    "warm+gym":     ["athletic_top", "shorts", "sneakers"],
    "clear+work":   ["dress_shirt", "chinos", "loafers"],
    "clear+casual": ["white_tee", "slim_jeans", "white_sneakers"],
    "clear+date":   ["linen_shirt", "chinos", "loafers"],
    "clear+gym":    ["athletic_top", "shorts", "sneakers"],
    "snow+work":    ["blazer", "trousers", "dress_shoes"],
    "snow+casual":  ["hoodie", "slim_jeans", "sneakers"],
    "snow+date":    ["black_blazer", "chinos", "ankle_boots"],
    "snow+gym":     ["hoodie", "joggers", "sneakers"],
    "cloudy+work":  ["blazer", "dress_shirt", "trousers", "loafers"],
    "cloudy+casual":["white_tee", "slim_jeans", "sneakers"],
    "cloudy+date":  ["blazer", "chinos", "loafers"],
    "cloudy+gym":   ["athletic_top", "shorts", "sneakers"],
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
        const { wardrobe_id, weather, event } = await request.json();

        if (!wardrobe_id || !weather || !event) {
            return Response.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Simplify weather condition to cold/warm/rain/snow/clear/cloudy
        const condition = weather.temp < 15 ? "cold" : weather.condition || "clear";
        const key = `${condition}+${event}`;
        const neededCategories = OUTFIT_MAP[key] || OUTFIT_MAP["clear+casual"];

        // Fetch user's closet
        const { data, error: cErr } = await supabase
            .from("user_closets")
            .select("item_templates(id, name, category, image_url)")
            .eq("wardrobe_id", wardrobe_id);

        if (cErr) throw cErr;

        const userItems = (data || []).map((r) => r.item_templates).filter(Boolean);
        const userCategories = new Set(userItems.map((i) => i.category));

        // Match owned items to needed categories
        const matchedItems = neededCategories
            .map((cat) => userItems.find((i) => i.category === cat))
            .filter(Boolean);

        // Identify the first missing category
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
            key,
            neededCategories,
            matchedItems,
            missingCategory: missingCategory || null,
            nudgeProduct,
            tip: `For ${event} in ${weather.temp}°C ${condition} weather — here is your look.`,
            reasoning: buildReasoning(weather, event, condition, matchedItems, missingCategory),
        });
    } catch (err) {
        console.error("[recommend]", err.message);
        return Response.json({ error: "Recommendation failed" }, { status: 500 });
    }
}

function buildReasoning(weather, event, condition, matchedItems, missingCategory) {
    const condLabel = weather.conditionLabel || condition;
    const temp = weather.temp;
    const city = weather.cityName ? ` in ${weather.cityName}` : "";
    const humidity = weather.humidity ? `, ${weather.humidity}% humidity` : "";
    const wind = weather.windspeed ? ` with ${weather.windspeed} km/h winds` : "";

    const weatherSentence = `It\'s ${temp}°C and ${condLabel.toLowerCase()}${city}${humidity}${wind}.`;

    const eventReasons = {
        work:   "For a work setting, we\'ve prioritised polished, professional pieces that keep you structured and sharp.",
        casual: "A casual day calls for comfort-first styling — relaxed fits that still look intentional.",
        date:   "For a date, we went with a balanced look: elevated but effortless. You want to look like you tried without looking like you tried.",
        gym:    "Your gym look is all about performance and ease — breathable, flexible, and still put-together.",
    };

    const conditionReasons = {
        rain:   " Given the rain, we prioritised weather-resistant and darker tones that won\'t show water.",
        snow:   " With snow expected, layering and warm fabrics take priority without sacrificing the look.",
        cold:   " The cool temperature calls for structured layers to trap warmth while maintaining your silhouette.",
        cloudy: " An overcast day suits richer, deeper tones that pop against neutral skies.",
        clear:  " Clear skies mean you can lean into lighter, more breathable fabrics and bolder colour.",
    };

    const matched = matchedItems.length > 0
        ? ` We found ${matchedItems.length} item${matchedItems.length > 1 ? "s" : ""} in your closet that fit perfectly.`
        : " We\'re working with your current closet to build the best possible look.";

    const nudge = missingCategory
        ? ` One missing piece — ${missingCategory.replace(/_/g, " ")} — could complete the look.`
        : " Your closet has everything needed for this outfit.";

    return `${weatherSentence} ${eventReasons[event] || ""} ${conditionReasons[condition] || ""}${matched}${nudge}`;
}
