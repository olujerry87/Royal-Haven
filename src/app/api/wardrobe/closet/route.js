/**
 * GET  /api/wardrobe/closet?wardrobe_id=...
 * Returns all items in a user's closet.
 *
 * POST /api/wardrobe/closet
 * Body: { wardrobe_id, template_id, action: "add" | "remove" }
 * Adds or removes a single item from the closet.
 */
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const wardrobe_id = searchParams.get("wardrobe_id");

    if (!wardrobe_id) {
        return Response.json({ error: "wardrobe_id is required" }, { status: 400 });
    }

    try {
        const { data, error } = await supabase
            .from("user_closets")
            .select("template_id, item_templates(id, name, category, image_url, weather_tags, event_tags)")
            .eq("wardrobe_id", wardrobe_id);

        if (error) throw error;

        const items = (data || []).map((row) => row.item_templates).filter(Boolean);
        return Response.json({ items });
    } catch (err) {
        console.error("[closet GET]", err.message);
        return Response.json({ error: "Failed to fetch closet" }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const { wardrobe_id, template_id, action } = await request.json();

        if (!wardrobe_id || !template_id || !action) {
            return Response.json({ error: "Missing required fields" }, { status: 400 });
        }

        if (action === "add") {
            const { error } = await supabase
                .from("user_closets")
                .upsert({ wardrobe_id, template_id }, { onConflict: "wardrobe_id,template_id" });
            if (error) throw error;
            return Response.json({ success: true, action: "added" });
        }

        if (action === "remove") {
            const { error } = await supabase
                .from("user_closets")
                .delete()
                .eq("wardrobe_id", wardrobe_id)
                .eq("template_id", template_id);
            if (error) throw error;
            return Response.json({ success: true, action: "removed" });
        }

        return Response.json({ error: "Invalid action" }, { status: 400 });
    } catch (err) {
        console.error("[closet POST]", err.message);
        return Response.json({ error: "Failed to update closet" }, { status: 500 });
    }
}
