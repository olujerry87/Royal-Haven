import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function renameItems() {
  console.log("Fetching items...");
  const { data: items, error: fetchErr } = await supabase.from('item_templates').select('id, name');
  if (fetchErr) {
    console.error("Fetch Error:", fetchErr);
    return;
  }
  
  console.log(`Found ${items.length} items.`);
  
  const renames = {
    "Classic Cotton T-Shirt": "T-Shirt",
    "Boxy Graphic Hoodie": "Hoodie",
    "Cashmere Turtleneck": "Turtleneck",
    "Slim-Fit Chinos": "Chinos",
    "Baggy Heritage Jeans": "Baggy Jeans",
    "Relaxed Cotton Joggers": "Joggers",
    "Wide-Leg Pleated Trousers": "Wide Leg Trousers",
    "Tailored Wool Blazer": "Blazer",
    "Denim Trucker Jacket": "Denim Jacket",
    "Oversized Wool Sweater": "Oversized Sweater",
    "Ribbed Knit Crop-Top": "Crop Top",
    "High-Waist Palazzo Pants": "Palazzo Pants"
  };

  for (const item of items) {
    const newName = renames[item.name];
    if (newName && newName !== item.name) {
      console.log(`Renaming: ${item.name} -> ${newName}`);
      const { error: updateErr } = await supabase
        .from('item_templates')
        .update({ name: newName })
        .eq('id', item.id);
        
      if (updateErr) console.error("Update Error:", updateErr);
    }
  }
  console.log("Done updating item names.");
}

renameItems();
