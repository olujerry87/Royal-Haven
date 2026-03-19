/**
 * POST /api/wardrobe/init
 * Body: { wardrobe_id: string, vibe: string }
 *
 * Creates a guest wardrobe and seeds it with templates
 * matching the selected vibe. Idempotent — safe to call twice.
 */
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Vibe → category filter map
const VIBE_CATEGORIES = {
    minimalist: ["white_tee", "slim_jeans", "black_blazer", "white_sneakers", "chinos", "loafers"],
    street:     ["hoodie", "cargo_pants", "sneakers", "graphic_tee", "joggers", "cap"],
    formal:     ["dress_shirt", "trousers", "blazer", "dress_shoes", "tie", "chinos"],
};

export async function POST(request) {
    try {
        const { wardrobe_id, vibe } = await request.json();

        if (!wardrobe_id || !vibe) {
            return Response.json({ error: "wardrobe_id and vibe are required" }, { status: 400 });
        }

        const categories = VIBE_CATEGORIES[vibe] || VIBE_CATEGORIES.minimalist;

        // Fetch templates matching this vibe's categories
        const { data: templates, error: tErr } = await supabase
            .from("item_templates")
            .select("id, name, category, image_url, gender")
            .in("category", categories);

        if (tErr) throw tErr;

        if (!templates || templates.length === 0) {
            return Response.json({ wardrobe_id, items: [], seeded: false });
        }

        // Check which items are already in the closet
        const { data: existing } = await supabase
            .from("user_closets")
            .select("template_id")
            .eq("wardrobe_id", wardrobe_id);

        const existingIds = new Set((existing || []).map((r) => r.template_id));
        const toInsert = templates
            .filter((t) => !existingIds.has(t.id))
            .map((t) => ({ wardrobe_id, template_id: t.id }));

        if (toInsert.length > 0) {
            const { error: iErr } = await supabase.from("user_closets").insert(toInsert);
            if (iErr) throw iErr;
        }

        return Response.json({ wardrobe_id, items: templates, seeded: true });
    } catch (err) {
        console.error("[wardrobe/init]", err.message);
        return Response.json({ error: "Failed to initialize wardrobe" }, { status: 500 });
    }
}
