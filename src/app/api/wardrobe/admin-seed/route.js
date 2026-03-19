import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const ITEMS = [
  { "name": "Oversized Wool Sweater", "category": "sweater", "weather_tags": ["unisex"] },
  { "name": "Cashmere Turtleneck", "category": "turtleneck", "weather_tags": ["unisex"] },
  { "name": "Wide-Leg Pleated Trousers", "category": "big_pants", "weather_tags": ["unisex"] },
  { "name": "Baggy Heritage Jeans", "category": "big_jeans", "weather_tags": ["unisex"] },
  { "name": "Slim Fit Pleated Chinos", "category": "chinos", "weather_tags": ["male"] },
  { "name": "Ribbed Knit Crop-Top", "category": "crop_top", "weather_tags": ["female"] },
  { "name": "High-Waist Palazzo Pants", "category": "big_pants", "weather_tags": ["female"] },
  { "name": "Boxy Graphic Hoodie", "category": "hoodie", "weather_tags": ["unisex"] },
  { "name": "Relaxed Cotton Joggers", "category": "joggers", "weather_tags": ["unisex"] },
  { "name": "Classic Cotton T-Shirt", "category": "white_tee", "weather_tags": ["unisex"] },
  { "name": "Denim Trucker Jacket", "category": "layers", "weather_tags": ["unisex"] },
  { "name": "Tailored Wool Blazer", "category": "blazer", "weather_tags": ["unisex"] }
];

export async function GET() {
    try {
        // 1. Fetch existing names to avoid duplicates manually
        const { data: existing } = await supabase.from("item_templates").select("name");
        const existingNames = new Set(existing?.map(i => i.name) || []);

        // 1. Insert new items
        let insertedCount = 0;
        if (toInsert.length > 0) {
            console.log(`Attempting to insert ${toInsert.length} items...`);
            const { error: iErr } = await supabase.from("item_templates").insert(toInsert);
            if (iErr) {
                console.error("Insert Error:", iErr.message);
                throw new Error(`Insert failed: ${iErr.message}`);
            }
            insertedCount = toInsert.length;
        }

        // 2. Update existing items
        console.log("Attempting to update existing items to unisex...");
        const { error: uErr } = await supabase
            .from("item_templates")
            .update({ weather_tags: ["unisex"] })
            .is("weather_tags", null);
        
        if (uErr) {
            console.error("Update Error:", uErr.message);
            // Don't throw here, just log it so we can see if inserts worked
        }

        return Response.json({ 
            success: true, 
            inserted: insertedCount,
            updateError: uErr ? uErr.message : null,
            message: "Database synchronized with robust items."
        });
    } catch (err) {
        console.error("Admin Seed Catch:", err.message);
        return Response.json({ error: err.message }, { status: 500 });
    }
}
