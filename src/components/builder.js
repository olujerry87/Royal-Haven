"use client";

/**
 * components/builder.js — Root Builder.io client wrapper
 *
 * Used by app/page.js (the home route) to conditionally render Builder.io
 * content when a page exists in the CMS, or fall back to the React children.
 *
 * API key reads from NEXT_PUBLIC_BUILDER_API_KEY env var.
 * Falls back gracefully to children when content is null / key is missing.
 */
import { BuilderComponent, builder, useIsPreviewing } from "@builder.io/react";

// Read key from env — never hardcode
const BUILDER_KEY = process.env.NEXT_PUBLIC_BUILDER_API_KEY;

// Initialize only when a valid key is present (prevents crash with placeholder value)
if (BUILDER_KEY && BUILDER_KEY !== "your_builder_public_key_here" && BUILDER_KEY.length > 10) {
    builder.init(BUILDER_KEY);
}

/**
 * RenderBuilderContent
 *
 * @param {{ content: object|null, model: string, children?: React.ReactNode }} props
 *
 * - Renders <BuilderComponent> when Builder.io content is available
 * - Renders `children` (e.g. HomeClient) as a fallback when content is null
 * - During Builder.io preview mode, always renders BuilderComponent so the
 *   editor sees a live canvas even before content is published
 */
export function RenderBuilderContent({ content, model, children }) {
    const isPreviewing = useIsPreviewing();

    // Content guard: show loading if Builder key is set but content hasn't arrived
    if (!content && !isPreviewing && BUILDER_KEY && BUILDER_KEY !== "your_builder_public_key_here") {
        // No published Builder.io page for this URL — show the React fallback
        return children ?? null;
    }

    if (content || isPreviewing) {
        return (
            <BuilderComponent
                content={content ?? undefined}
                model={model}
            />
        );
    }

    // No Builder key configured at all — always render children
    return children ?? null;
}
