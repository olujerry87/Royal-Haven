import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Only create a client if the keys are defined. We show a warning otherwise.
let client = null;

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes("your-project-ref")) {
    console.warn("Supabase is missing configuration keys. Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.");
} else {
    client = createClient(supabaseUrl, supabaseAnonKey);
}

export const supabase = client;
