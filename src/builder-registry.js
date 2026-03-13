"use client";

import { Builder } from "@builder.io/react";
import Hero from "./components/Hero";
import ProductCard from "./components/ProductCard";
import HeritageAnimation from "./components/HeritageAnimation";
import ScrollProgress from "./components/ScrollProgress";
import LiquidBackground from "./components/LiquidBackground";
import PromoBanner from "./components/PromoBanner";
import Reviews from "./components/Reviews";

// Register components for Builder.io Visual Editor
Builder.registerComponent(Hero, {
    name: "Hero",
    inputs: [
        { name: "title", type: "string", defaultValue: "Hero Title" },
        { name: "subtitle", type: "string", defaultValue: "Subtitle here" },
        { name: "backgroundImage", type: "file", allowedFileTypes: ["jpeg", "jpg", "png", "webp"] },
    ],
});

Builder.registerComponent(ProductCard, {
    name: "ProductCard",
    inputs: [
        {
            name: "product",
            type: "object",
            defaultValue: {
                id: 999,
                name: "Sample Product",
                price: 150,
                images: ["/images/spotlight.jpg", "/images/wura-idle.jpg"],
                slug: "sample-product"
            }
        },
    ],
});

Builder.registerComponent(HeritageAnimation, {
    name: "HeritageAnimation",
    inputs: [], // No inputs needed as it's self-contained
});

Builder.registerComponent(ScrollProgress, {
    name: "ScrollProgress",
    inputs: [],
});

Builder.registerComponent(LiquidBackground, {
    name: "LiquidBackground",
    inputs: [],
});

Builder.registerComponent(PromoBanner, {
    name: "PromoBanner",
    inputs: [],
});

Builder.registerComponent(Reviews, {
    name: "Reviews",
    inputs: [],
});
