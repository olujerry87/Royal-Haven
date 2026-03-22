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
        const { wardrobe_id, weather, event, vibe = "minimalist", gender = "unisex", itemColors = {} } = await request.json();

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

        const CATEGORY_FALLBACKS = {
            blazer: ["black_blazer", "trenchcoat", "hoodie"],
            black_blazer: ["blazer", "trenchcoat"],
            trousers: ["chinos", "cargo_pants", "slim_jeans", "baggy_jeans"],
            chinos: ["trousers", "slim_jeans", "cargo_pants"],
            slim_jeans: ["trousers", "chinos", "baggy_jeans", "cargo_pants"],
            dress_shirt: ["linen_shirt", "white_tee", "turtleneck", "shirt"],
            linen_shirt: ["dress_shirt", "white_tee", "shirt"],
            white_tee: ["graphic_tee", "athletic_top", "shirt"],
            sneakers: ["white_sneakers", "loafers", "ankle_boots"],
            loafers: ["dress_shoes", "ankle_boots", "sneakers"],
            sweaters: ["hoodie", "layers"]
        };

        // Match items with fallbacks
        let matchedItems = neededCategories
            .map((cat) => {
                let match = userItems.find((i) => i.category === cat);
                if (!match) {
                    const fallbacks = CATEGORY_FALLBACKS[cat] || [];
                    for (let f of fallbacks) {
                        match = userItems.find((i) => i.category === f);
                        if (match) break;
                    }
                }
                return match;
            })
            .filter(Boolean);

        matchedItems = [...new Map(matchedItems.map(i => [i.id, i])).values()];

        // FAILSAFE: If the user simply has no matching items or fallbacks for this specific Vibe,
        // we forcefully assign them the closest items they DO have so the system never returns an empty outfit.
        if (matchedItems.length === 0 && userItems.length > 0) {
            const forcedTop = userItems.find(i => ['shirt', 'tee', 'blouse', 'turtleneck', 'sweater', 'crop_top', 'white_tee', 'graphic_tee', 'dress_shirt', 'linen_shirt', 'athletic_top'].includes(i.category));
            const forcedBottom = userItems.find(i => ['trousers', 'chinos', 'slim_jeans', 'cargo_pants', 'shorts', 'joggers', 'baggy_jeans', 'big_pants'].includes(i.category));
            const forcedShoe = userItems.find(i => ['shoes', 'sneakers', 'boots', 'loafers'].includes(i.category));

            if (forcedTop) matchedItems.push(forcedTop);
            if (forcedBottom) matchedItems.push(forcedBottom);
            if (forcedShoe) matchedItems.push(forcedShoe);
            
            // Absolute nuclear fallback if their closet lacks clear categories
            if (matchedItems.length === 0) matchedItems.push(...userItems.slice(0, 3));
        }

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
        const { stylingTips, colorPalette, stylingPersona } = getStylistAdvice(vibe, event, gender, matchedItems, weather, itemColors);

        // Generate explicit "Todo" List based on the user's specific selected colors
        const explicitChecklist = matchedItems.map(item => {
            const colorsArray = itemColors[item.id] || [];
            // Capitalize the first color selected (e.g., 'blue') or fallback to empty string
            const colorName = colorsArray.length > 0 ? (colorsArray[0].charAt(0).toUpperCase() + colorsArray[0].slice(1)) + " " : "";
            return `Wear your ${colorName}<b>${item.name.toLowerCase()}</b>`;
        });
        
        // Unshift the core checklist to the very top of stylingTips so the user sees it immediately
        if (explicitChecklist.length > 0) {
            stylingTips.unshift(`**Outfit Blueprint**: For this ${weather.condition} weather, <br/> • ${explicitChecklist.join("<br/> • ")}`);
        }

        return Response.json({
            formulaName: formula.name,
            matchRate: isNaN(matchRate) ? 50 : matchRate,
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

function getStylistAdvice(vibe, event, gender, items, weather, itemColors) {
    const tips = [];
    let palette = { primary: "#E5E5E5", secondary: "#1A1A1A", accent: "#D4AF37" }; 
    let persona = "Elegance is refusal.";

    // Helper to check categories
    const hasCategory = (categories) => items.some(i => categories.some(c => i.category.includes(c)));

    // 1. Sandwich Rule
    const hasTop = hasCategory(['shirt', 'tee', 'blouse', 'turtleneck', 'sweater', 'crop_top']);
    const hasShoes = hasCategory(['shoes', 'sneakers', 'boots', 'loafers']);
    if (hasTop && hasShoes) {
        tips.push("**The Sandwich Rule**: Coordinate the color or 'vibe' of your top with your shoes. This 'sandwiches' the middle of your outfit and creates instant visual harmony.");
    }

    // 2. Third Piece Rule
    const hasLayer = hasCategory(['blazer', 'layer', 'hoodie', 'trenchcoat']);
    if (hasLayer) {
        tips.push("**The Third Piece Rule**: Your outerwear elevates a basic top-and-bottom combination into an intentionally 'styled' outfit.");
    } else {
        tips.push("**The Third Piece Rule**: Add a third piece (blazer, cardigan, or statement belt) to transform this from a 'clothed' look into a 'styled' outfit.");
    }

    // 3. Proportion Balance
    const hasBigTop = hasCategory(['sweater', 'hoodie', 'layers']);
    const hasBigBottom = hasCategory(['big_pants', 'big_jeans', 'cargo_pants']);
    const hasSmallTop = hasCategory(['white_tee', 'turtleneck', 'crop_top', 'dress_shirt']);
    const hasSmallBottom = hasCategory(['slim_jeans', 'chinos', 'trousers', 'shorts']);

    if (hasBigTop && hasSmallBottom) {
        tips.push("**Proportion Balance (Big-Small)**: An oversized top paired with slim-fitting bottoms creates a perfect modern silhouette.");
    } else if (hasSmallTop && hasBigBottom) {
        tips.push("**Proportion Balance (Small-Big)**: A fitted top paired with wide-leg bottoms beautifully highlights your waistline.");
    }

    // 4. Practical Shoe Pairings
    if (hasBigBottom) {
        tips.push("**Shoe Pairing**: Always use a pointed or elongated toe (or sleek sneaker) with wide legs to prevent the silhouette from looking 'stumpy'.");
    } else if (hasCategory(['slim_jeans'])) {
        tips.push("**Shoe Pairing**: Straight or slim-leg jeans with loafers is the ultimate formula for a 'Normal but Elevated' daily uniform.");
    }

    // 5. Tucking & Belting Techniques
    if (event === 'date' || event === 'casual') {
        tips.push("**Tucking Technique**: Try the 'French Tuck' (tuck only the front center to define the waistline without bulk). Add a statement belt to divide monochromatic looks.");
    } else if (event === 'work') {
        tips.push("**Tucking Technique**: Go for a 'Full Tuck' for a sharp, executive presence. Make sure to use a polished belt to transition the look.");
    }

    // 6. 7-Point Balance Rule
    const itemPoints = {
        white_tee: 1, slim_jeans: 1, chinos: 1, trousers: 1, dress_shirt: 1, turtleneck: 1, joggers: 1, shorts: 1, sneakers: 1, white_sneakers: 1,
        athletic_top: 1,
        blazer: 2, black_blazer: 2, hoodie: 2, graphic_tee: 2, cargo_pants: 2, loafers: 2, dress_shoes: 2, ankle_boots: 2, cap: 2,
        sweater: 2, big_pants: 2, big_jeans: 2, crop_top: 2, layers: 2
    };
    
    let score = 0;
    items.forEach(i => { score += (itemPoints[i.category] || 1); });
    
    // Suggest 3-3-3 rule if items are few
    if (items.length < 3) {
        tips.push("**The 3-3-3 Capsule Rule**: Combat 'closet paralysis' by selecting 3 tops, 3 bottoms, and 3 pairs of shoes to generate 27+ intentional outfits.");
    } else {
        if (score < 5) {
             tips.push(`**7-Point Balance (Score: ${score})**: Good basics, but try adding a statement item (bold color, pattern, heavy texture) to reach the sweet spot of 6-8 points.`);
        } else if (score >= 5 && score <= 8) {
             tips.push(`**7-Point Balance (Score: ${score})**: Perfect harmony! You've expertly balanced basic items (1pt) and statement pieces (2pts) preventing the look from being boring or overwhelming.`);
        } else {
             tips.push(`**7-Point Balance (Score: ${score})**: High-impact look! Just be careful not to overwhelm the eye; sometimes one statement piece is enough.`);
        }
    }

    // 7. Elevated Color Pairings
    const palettes = [
        { name: "Camel & Navy", primary: "#C19A6B", secondary: "#000080", accent: "#FFFFFF", tip: "The gold standard for classic, 'Vogue-style' elevation." },
        { name: "Chocolate & Ice Blue", primary: "#3D2B1F", secondary: "#99CCFF", accent: "#E5E5E5", tip: "The 'it' pairing for a modern, expensive look." },
        { name: "Monochrome Grey & Red", primary: "#808080", secondary: "#A9A9A9", accent: "#FF0000", tip: "Use a single bold red item (socks, bag, or lip) to ground a monochrome grey look." },
        { name: "Chocolate & Earthy Green", primary: "#3D2B1F", secondary: "#556B2F", accent: "#F5F5DC", tip: "Earthy but fresh pairing for a grounded aesthetic." }
    ];
    
    let selectedPalette;
    
    // Check if user's items are heavily earth tones or navy based on ColorPicker arrays
    const colorCounts = { earth: 0, navy: 0, black: 0, white: 0, bright: 0 };
    items.forEach(i => {
        const colors = itemColors[i.id] || [];
        colors.forEach(c => {
            if (colorCounts[c] !== undefined) {
                colorCounts[c]++;
            }
        });
    });

    if (colorCounts.earth >= 2) {
        selectedPalette = palettes[3]; // Chocolate & Earthy Green
        tips.push("**Elevated Pairings**: Your closet leans heavily into Earth Tones. These neutral browns and greens create an incredibly grounded and luxurious base.");
    } else if (colorCounts.navy >= 1 && colorCounts.earth >= 1) {
        selectedPalette = palettes[0]; // Camel & Navy
        tips.push("**Elevated Pairings**: You've selected earth tones mapped with navy pieces. This Camel & Navy contrast is the gold standard for 'Vogue-style' elevation.");
    } else if (vibe === 'minimalist' && event === 'work') {
        selectedPalette = palettes[0]; // Camel & Navy
    } else if (vibe === 'expressive' || vibe === 'sharp') {
        selectedPalette = palettes[1]; // Chocolate & Ice Blue
    } else if (vibe === 'minimalist' && event === 'casual') {
        selectedPalette = palettes[2]; // Grey & Red
    } else {
        selectedPalette = palettes[3]; // Chocolate & Green
    }
    
    palette = selectedPalette;
    persona = `Color Theory: ${selectedPalette.name} - ${selectedPalette.tip} Let's apply the 60-30-10 Rule: 60% dominant neutral, 30% secondary, 10% bold pop.`;

    // 8. Explicit Weather Protocols
    if (weather.feels_like < 10) {
        tips.push("**Weather Alert**: Because it feels like " + weather.feels_like + "°C, we highly recommend layering thermal tights or 'longjohns' under this outfit to stay warm without bulky outerwear.");
    }
    if (weather.condition === 'rain' || weather.condition === 'snow') {
        tips.push("**Weather Alert**: Precipitation is expected today. Don't forget your raincoat or umbrella, and prioritize boots over canvas sneakers!");
    }
    if ((weather.condition === 'clear' || weather.conditionLabel === 'Clear Skies') && weather.temp_max > 25) {
        tips.push("**Weather Alert**: It’s going to be hot today (up to " + weather.temp_max + "°C). Focus on breathable fabrics and don't forget your sunscreen and sunglasses.");
    }

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

    // We no longer append styling tips to the reasoning text, 
    // as the frontend 'OutfitResult' component renders them in a dedicated minimalist checklist.
    return summary;
}
