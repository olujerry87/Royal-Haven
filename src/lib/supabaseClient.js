/**
 * Supabase Client Utilities
 *
 * Two clients are exported:
 * 1. createSupabaseBrowserClient() — for use in "use client" components.
 * 2. createSupabaseServerClient() — for use in Server Components, Route Handlers, and Middleware.
 *    (Requires Next.js cookies() from next/headers)
 */
import { createBrowserClient } from "@supabase/ssr";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY || SUPABASE_URL.includes("your-project")) {
    console.warn(
        "[Supabase] Missing or placeholder keys detected. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local"
    );
}

/**
 * Browser-side Supabase client.
 * Use inside "use client" components for auth, realtime, etc.
 */
export function createSupabaseBrowserClient() {
    return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

/**
 * Server-side Supabase client.
 * Use inside Server Components or Route Handlers.
 * Requires cookies from next/headers.
 */
export async function createSupabaseServerClient() {
    const { cookies } = await import("next/headers");
    const { createServerClient } = await import("@supabase/ssr");
    const cookieStore = await cookies();

    return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        cookies: {
            getAll() {
                return cookieStore.getAll();
            },
            setAll(cookiesToSet) {
                try {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        cookieStore.set(name, value, options)
                    );
                } catch {
                    // In Server Components, cookies can only be set in middleware.
                    // This is safe to ignore for read-only access.
                }
            },
        },
    });
}

/**
 * Legacy singleton export (for backwards compatibility with existing components)
 * Prefer createSupabaseBrowserClient() in new client components.
 */
export const supabase = SUPABASE_URL && !SUPABASE_URL.includes("your-project")
    ? createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : null;
