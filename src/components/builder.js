"use client";
import { Component } from "react";
import { BuilderComponent, useIsPreviewing } from "@builder.io/react";
import { builder } from "@builder.io/react";

// Initialize Builder with API Key
builder.init("25e5eaee7d1c42fb84ae738159147ca4");

export function RenderBuilderContent({ content, model, children }) {
    const isPreviewing = useIsPreviewing();

    if (content || isPreviewing) {
        return <BuilderComponent content={content} model={model} />;
    }

    // If no content and not previewing, render children (fallback) or 404
    if (children) {
        return children;
    }

    return (
        <div style={{ padding: 50, textAlign: "center", color: "white" }}>
            <h1>404 - Page Not Found</h1>
            <p>The page you are looking for does not exist or has not been created in Builder.io yet.</p>
        </div>
    );
}
