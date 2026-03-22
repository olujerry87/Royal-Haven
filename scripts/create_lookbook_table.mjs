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

async function setupLookbookDB() {
    console.log("Setting up the Ewa Lookbook schema...");

    const STARTER_IMAGES = [
        { category: "Makeup", image_url: "https://images.unsplash.com/photo-1512496015851-a1dc8a477858?auto=format&fit=crop&q=80&w=800", title: "Bridal Soft Glam" },
        { category: "Makeup", image_url: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=800", title: "Editorial Look" },
        { category: "Hair", image_url: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&q=80&w=800", title: "Bridal Updo" },
        { category: "Gele", image_url: "https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?auto=format&fit=crop&q=80&w=800", title: "Traditional Headtie" },
        { category: "Fashion", image_url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800", title: "Heritage Shoot" }
    ];

    console.log("Attempting to seed lookbook_images...");
    const { error } = await supabase.from('lookbook_images').insert(STARTER_IMAGES);
    
    if (error) {
        console.error("Note: Please ensure the 'lookbook_images' table exists in Supabase with columns: id (uuid), category (text), image_url (text), title (text). Error:", error.message);
    } else {
        console.log("Successfully seeded starter images!");
    }
}

setupLookbookDB();
