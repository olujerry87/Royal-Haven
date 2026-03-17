/**
 * lib/supabase.js — Standardized Supabase client exports.
 *
 * Reads exclusively from:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY
 *
 * Exports:
 *   createSupabaseBrowserClient() — "use client" components
 *   createSupabaseServerClient()  — Server Components / Route Handlers
 *   supabase                       — legacy singleton (client-side)
 */
import { createBrowserClient } from "@supabase/ssr";

// Naming Audit: EXACT variable names required across the entire project
const URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

// Client-side guard — same logic as proxy.js so both fail consistently
const isConfigured =
    URL.length > 10 &&
    KEY.length > 10 &&
    !URL.includes("your-project") &&
    URL !== "your_project_url_here";

if (!isConfigured && typeof window === "undefined") {
    // Only warn on the server so it doesn't spam the browser console
    console.warn(
        "[Supabase] NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is not set. " +
        "Auth features will be disabled until these are configured."
    );
}

/**
 * Client-side Supabase client.
 * Use inside "use client" components.
 */
export function createSupabaseBrowserClient() {
    if (!isConfigured) return null;
    return createBrowserClient(URL, KEY);
}

/**
 * Server-side Supabase client.
 * Use inside Server Components or Route Handlers.
 */
export async function createSupabaseServerClient() {
    if (!isConfigured) return null;
    const { cookies } = await import("next/headers");
    const { createServerClient } = await import("@supabase/ssr");
    const cookieStore = await cookies();

    return createServerClient(URL, KEY, {
        cookies: {
            getAll: () => cookieStore.getAll(),
            setAll: (list) => {
                try {
                    list.forEach(({ name, value, options }) =>
                        cookieStore.set(name, value, options)
                    );
                } catch {
                    // Read-only in Server Components — safe to ignore
                }
            },
        },
    });
}

/**
 * Legacy singleton for backwards-compatible imports.
 * Prefer createSupabaseBrowserClient() in new code.
 */
export const supabase = isConfigured ? createBrowserClient(URL, KEY) : null;
