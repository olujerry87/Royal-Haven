"use client";
import { builder } from "@builder.io/react";
import "@/builder-registry";

// Initialize Builder with API Key from env
const BUILDER_KEY = process.env.NEXT_PUBLIC_BUILDER_API_KEY;
if (BUILDER_KEY && BUILDER_KEY !== "your_builder_public_key_here") {
    builder.init(BUILDER_KEY);
}

export default function BuilderRegistry() {
    return null;
}
