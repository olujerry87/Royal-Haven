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
        const { data, error } = await supabase
            .from("item_templates")
            .upsert(ITEMS, { onConflict: 'name' });

        if (error) throw error;

        return Response.json({ success: true, seeded: ITEMS.length });
    } catch (err) {
        return Response.json({ error: err.message }, { status: 500 });
    }
}
