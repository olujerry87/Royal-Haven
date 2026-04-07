/**
 * src/proxy.js — Route Protection & Supabase Session Refresh
 *
 * Single security file for this project. Contains:
 *   - export async function proxy()  ← the middleware function
 *   - export const config            ← the route matcher
 *
 * DO NOT create a middleware.js alongside this file.
 */
import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

// Lightweight Edge-compatible in-memory rate limiter.
const rateLimitMap = new Map();
const RATE_LIMIT_POINTS = 50; // 50 requests
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // Per 1 minute

function checkRateLimit(ip) {
    const now = Date.now();
    const entry = rateLimitMap.get(ip) || { count: 0, firstHit: now };

    if (now - entry.firstHit > RATE_LIMIT_WINDOW_MS) {
        entry.count = 0;
        entry.firstHit = now;
    }

    entry.count++;
    rateLimitMap.set(ip, entry);

    if (rateLimitMap.size > 1000) {
        for (const [key, val] of rateLimitMap.entries()) {
            if (now - val.firstHit > RATE_LIMIT_WINDOW_MS) {
                rateLimitMap.delete(key);
            }
        }
    }

    return entry.count <= RATE_LIMIT_POINTS;
}

const PROTECTED_ROUTES = ["/account", "/wishlist", "/checkout"];

/**
 * Validate that a string is a real HTTPS URL.
 * Returns false for undefined, empty strings, or placeholder values.
 */
function isValidHttpsUrl(str) {
    if (!str || typeof str !== "string") return false;
    try {
        const url = new URL(str);
        return url.protocol === "https:";
    } catch {
        return false;
    }
}

export async function proxy(request) {
    let response = NextResponse.next({ request });
    const { pathname, searchParams } = request.nextUrl;

    // ── 1. Builder.io editor — always pass through ────────────────────────
    if (searchParams.has("builder.preview") || searchParams.has("builder.frameEditing")) {
        return response;
    }

    // ── 1.5 Rate Limiting for API routes ──────────────────────────────────
    if (pathname.startsWith("/api")) {
        const ip = request.ip || 
                   request.headers.get("x-real-ip") || 
                   request.headers.get("x-forwarded-for") || 
                   "127.0.0.1";
        
        if (!checkRateLimit(ip)) {
            console.warn(`[RATE LIMIT] IP ${ip} exceeded API quota on ${pathname}`);
            return NextResponse.json(
                { error: "Too Many Requests", message: "Rate limit exceeded. Please wait a moment." },
                { status: 429, headers: { "Retry-After": "60" } }
            );
        }
    }

    // ── 2. BULLETPROOF SUPABASE URL GUARD ─────────────────────────────────
    //    Use new URL() to validate — catches every malformed value including
    //    duplicated keys, embedded `=` signs, and placeholder strings.
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

    if (!isValidHttpsUrl(supabaseUrl) || supabaseKey.length < 20) {
        // Not configured or invalid — pass all traffic through silently
        return response;
    }

    // ── 3. Create Supabase client + refresh session ───────────────────────
    try {
        const supabase = createServerClient(supabaseUrl, supabaseKey, {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    );
                    response = NextResponse.next({ request });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    );
                },
            },
        });

        const { data: { user } } = await supabase.auth.getUser();

        // ── 4. Protect private routes ─────────────────────────────────────
        const isProtected = PROTECTED_ROUTES.some((r) => pathname.startsWith(r));
        if (isProtected && !user) {
            const loginUrl = new URL("/login", request.url);
            loginUrl.searchParams.set("redirectTo", pathname);
            return NextResponse.redirect(loginUrl);
        }
    } catch (err) {
        // Never let a Supabase error crash a page — log and continue
        console.error("[proxy] Supabase error:", err.message);
    }

    return response;
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|api/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
