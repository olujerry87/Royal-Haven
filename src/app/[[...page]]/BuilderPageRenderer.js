"use client";

/**
 * BuilderPageRenderer — Client Component
 *
 * "use client" must be the VERY FIRST LINE — no exceptions.
 * Receives pre-fetched content as a prop from the Server Component.
 * Uses useIsPreviewing() so the Builder.io editor canvas always loads,
 * even before any content is published to this URL.
 */
import { BuilderComponent, builder, useIsPreviewing } from "@builder.io/react";
import { useEffect } from "react";
import "../../builder-registry";

const BUILDER_KEY = process.env.NEXT_PUBLIC_BUILDER_API_KEY;
if (BUILDER_KEY && BUILDER_KEY !== "your_builder_public_key_here" && BUILDER_KEY.length > 10) {
    builder.init(BUILDER_KEY);
}

export default function BuilderPageRenderer({ content, urlPath }) {
    // isPreviewing is TRUE when the Builder.io editor has your site open
    const isPreviewing = useIsPreviewing();

    // Gate window access inside useEffect to prevent Next.js hydration mismatch
    useEffect(() => {
        if (typeof window !== "undefined" && window.builder) {
            window.builder.trackImpression?.(content?.id);
        }
    }, [content]);

    // ── Rendering Guard ───────────────────────────────────────────────────
    // Always render BuilderComponent if previewing — the editor canvas
    // needs to mount even when there's no published content yet.
    if (content || isPreviewing) {
        return (
            <BuilderComponent
                model="page"
                content={content ?? undefined}
            />
        );
    }

    // No content and not in editor — show a clear diagnostic message
    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "60vh",
            padding: "4rem",
            textAlign: "center",
            color: "rgba(255,255,255,0.6)",
            background: "var(--obsidian, #0b0b0b)"
        }}>
            <p style={{ fontSize: "1.1rem" }}>
                No Builder.io content found for <code style={{ color: "#D4AF37" }}>{urlPath}</code>.
            </p>
            <p style={{ fontSize: "0.85rem", marginTop: "1rem", opacity: 0.5 }}>
                Create a page in the Builder.io editor targeting this URL to see it here.
            </p>
        </div>
    );
}
