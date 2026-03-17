/**
 * app/[[...page]]/page.js — Builder.io Optional Catch-All Route (Server Component)
 *
 * [[...page]] (double brackets) matches EVERY route including "/" itself.
 * [...]       (single brackets) does NOT match "/" — that's why the homepage was blank.
 *
 * Priority: This route renders LAST (most specific routes like /shop, /about take priority).
 * It catches: "/" (homepage), and any URL not matched by a more specific route.
 *
 * Do NOT add "use client" — data fetching must stay server-side for SEO + ISR.
 */
import { builder } from "@builder.io/sdk";
import BuilderPageRenderer from "./BuilderPageRenderer";

const BUILDER_API_KEY = process.env.NEXT_PUBLIC_BUILDER_API_KEY;
const KEY_IS_VALID =
    !!BUILDER_API_KEY &&
    BUILDER_API_KEY !== "your_builder_public_key_here" &&
    BUILDER_API_KEY.length > 10;

if (!KEY_IS_VALID) {
    console.warn(
        "[Builder.io] NEXT_PUBLIC_BUILDER_API_KEY is not set. " +
        "Add it to .env.local to enable visual editing."
    );
} else {
    builder.init(BUILDER_API_KEY);
}

/** Generate static params from all published Builder.io pages at build time */
export async function generateStaticParams() {
    if (!KEY_IS_VALID) return [];
    try {
        const pages = await builder.getAll("page", {
            options: { noTargeting: true },
            omit: "data.blocks",
        });
        return pages
            .map(({ data }) => ({
                page: data?.url?.replace(/^\//, "").split("/") ?? [],
            }))
            .filter(({ page }) => page.length > 0);
    } catch (err) {
        console.error("[Builder.io] generateStaticParams error:", err.message);
        return [];
    }
}

export default async function Page({ params }) {
    // params.page is undefined for "/" and an array for "/any/path"
    const resolvedParams = await params;
    const segments = resolvedParams?.page;
    const urlPath = "/" + (Array.isArray(segments) ? segments.join("/") : "");

    let content = null;

    if (KEY_IS_VALID) {
        try {
            content = await builder
                .get("page", {
                    userAttributes: { urlPath },
                    prerender: false,
                })
                .toPromise();
        } catch (err) {
            console.error(`[Builder.io] Fetch error for "${urlPath}":`, err.message);
        }
    }

    // ── Rendering Guard ───────────────────────────────────────────────────
    // IMPORTANT: Do NOT return notFound() here.
    // Builder.io's editor uses isPreviewing mode to show the canvas even
    // before any content is published. If we 404 when content is null,
    // the editor shows "Your site is not loading."
    //
    // Instead, pass content (possibly null) to the Client Component which
    // handles the isPreviewing check and shows the appropriate UI.

    if (!KEY_IS_VALID) {
        return (
            <main style={{ padding: "4rem", textAlign: "center", color: "#ccc", background: "#0b0b0b", minHeight: "100vh" }}>
                <h1 style={{ color: "#D4AF37" }}>Builder.io Not Connected</h1>
                <p>Add <code>NEXT_PUBLIC_BUILDER_API_KEY</code> to your <code>.env.local</code> file and restart the server.</p>
                <p style={{ fontSize: "0.85rem", opacity: 0.6 }}>Your key is at: app.builder.io → Settings → API Key</p>
            </main>
        );
    }

    return (
        <main>
            <BuilderPageRenderer content={content} urlPath={urlPath} />
        </main>
    );
}

export const revalidate = 60;
