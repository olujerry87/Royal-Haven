import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envContent = fs.readFileSync('.env.local', 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const [key, ...val] = line.split('=');
  if (key && val.length > 0) env[key.trim()] = val.join('=').trim().replace(/['"]/g, '');
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY || env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupGarmentDB() {
    console.log("Setting up the NTAG Garment ledger schema...");

    const STARTER_GARMENT = [
        { 
            id: "123", // This matches the NTAG ID
            name: "Wura Asoke Trench", 
            collection: "Heritage AW24", 
            origin: "Woven in the heart of Abeokuta, Nigeria, this authentic Aso-Oke textile was crafted using centuries-old horizontal loom techniques by third-generation artisans before being structurally tailored in our London atelier.",
            care: "This is a living textile. Dry clean only. Do not machine wash or tumble dry. Store folded or on a padded hanger to preserve the structural integrity of the spun cotton.",
            styling: "Pair this statement trench with monochrome base layers (black turtleneck and tailored trousers) to let the metallic threading command the room. Ideal for art galleries or evening galas.",
            founder_note: "I designed this piece to be a bridge between my two worlds. Wearing this isn't just a fashion statement; it's wearing a piece of history. Carry it with pride.",
            founder: "Wura & Ewa Official",
            image_url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800"
        }
    ];

    console.log("Attempting to seed NTAG garments database...");
    const { error } = await supabase.from('garments').insert(STARTER_GARMENT);
    
    if (error) {
        console.error("Note: Please ensure the 'garments' table exists in Supabase with columns: id (text), name (text), collection (text), origin (text), care (text), styling (text), founder_note (text), founder (text), image_url (text). Error:", error.message);
    } else {
        console.log("Successfully seeded starter NFC garment!");
    }
}

setupGarmentDB();
