import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const ITEMS = [
  { "name": "Oversized Wool Sweater", "category": "sweater", "weather_tags": "unisex" },
  { "name": "Cashmere Turtleneck", "category": "turtleneck", "weather_tags": "unisex" },
  { "name": "Wide-Leg Pleated Trousers", "category": "big_pants", "weather_tags": "unisex" },
  { "name": "Baggy Heritage Jeans", "category": "big_jeans", "weather_tags": "unisex" },
  { "name": "Slim Fit Pleated Chinos", "category": "chinos", "weather_tags": "male" },
  { "name": "Ribbed Knit Crop-Top", "category": "crop_top", "weather_tags": "female" },
  { "name": "High-Waist Palazzo Pants", "category": "big_pants", "weather_tags": "female" },
  { "name": "Boxy Graphic Hoodie", "category": "hoodie", "weather_tags": "unisex" },
  { "name": "Relaxed Cotton Joggers", "category": "joggers", "weather_tags": "unisex" },
  { "name": "Classic Cotton T-Shirt", "category": "white_tee", "weather_tags": "unisex" },
  { "name": "Denim Trucker Jacket", "category": "layers", "weather_tags": "unisex" },
  { "name": "Tailored Wool Blazer", "category": "blazer", "weather_tags": "unisex" }
];

export async function GET() {
    try {
        // 1. Fetch existing names to avoid duplicates manually
        const { data: existing } = await supabase.from("item_templates").select("name");
        const existingNames = new Set(existing?.map(i => i.name) || []);

        const toInsert = ITEMS.filter(i => !existingNames.has(i.name));
        
        if (toInsert.length > 0) {
            const { error: iErr } = await supabase.from("item_templates").insert(toInsert);
            if (iErr) throw iErr;
        }

        // 2. Update existing items to be 'unisex' if they have no tag
        // (This ensures existing items don't disappear from the UI)
        const { error: uErr } = await supabase
            .from("item_templates")
            .update({ weather_tags: "unisex" })
            .is("weather_tags", null);
        
        if (uErr) console.warn("Update existing warning:", uErr.message);

        return Response.json({ 
            success: true, 
            inserted: toInsert.length,
            message: "Database synchronized with robust items."
        });
    } catch (err) {
        return Response.json({ error: err.message }, { status: 500 });
    }
}
