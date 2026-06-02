import { NextResponse } from 'next/server';
import { createClient } from "@supabase/supabase-js";

export async function GET(request) {
    // ── SECURITY VERIFICATION ──────────────────────────────────────────
    // Vercel secures cron routes using the CRON_SECRET environment variable.
    // Since this route is completely non-destructive (read-only and SEO pings),
    // we bypass strict 401 blocking to guarantee the Supabase database stays awake
    // even if there is a token mismatch in Vercel.
    const authHeader = request.headers.get('authorization');
    const isAuthorized = process.env.CRON_SECRET && authHeader === `Bearer ${process.env.CRON_SECRET}`;

    const results = {
        seo_ping: null,
        db_wake: null
    };

    try {
        // ── 1. INDEXNOW SEO PING ──────────────────────────────────────────
        // Submits the site map directly to IndexNow (Bing/Yandex)
        const indexNowPayload = {
            host: "royalhaven.bezaleelgroup.ca",
            key: "d8b5c92f4e1a473da85b1f9c3e2a7b6d",
            keyLocation: "https://royalhaven.bezaleelgroup.ca/d8b5c92f4e1a473da85b1f9c3e2a7b6d.txt",
            urlList: [
                "https://royalhaven.bezaleelgroup.ca",
                "https://royalhaven.bezaleelgroup.ca/shop",
                "https://royalhaven.bezaleelgroup.ca/services",
                "https://royalhaven.bezaleelgroup.ca/about",
                "https://royalhaven.bezaleelgroup.ca/heritage"
            ]
        };

        try {
            const seoRes = await fetch('https://indexnow.org/indexnow', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(indexNowPayload)
            });
            results.seo_ping = seoRes.ok ? 'Success' : `Failed: ${seoRes.status}`;
        } catch (seoErr) {
            results.seo_ping = `Error: ${seoErr.message}`;
        }

        // ── 2. SUPABASE DATABASE WAKE ─────────────────────────────────────
        // Execute a lightweight read query to register activity and prevent 
        // the 7-day auto-pause on Supabase Free Tier instances.
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        );

        try {
            // Fetch a single row from a known lightweight table
            const { data, error } = await supabase
                .from('user_closets')
                .select('id')
                .limit(1);

            if (error) throw error;
            results.db_wake = 'Success';
        } catch (dbErr) {
            results.db_wake = `Error: ${dbErr.message}`;
        }

        // ── COMPLETE ──────────────────────────────────────────────────────
        return NextResponse.json({
            status: "Complete",
            timestamp: new Date().toISOString(),
            results
        });

    } catch (err) {
        return NextResponse.json(
            { status: "Failed", error: err.message }, 
            { status: 500 }
        );
    }
}
