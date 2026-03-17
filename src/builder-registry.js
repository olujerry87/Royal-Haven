"use client";

import { Builder } from "@builder.io/react";
import Hero from "./components/Hero";
import ProductCard from "./components/ProductCard";
import HeritageAnimation from "./components/HeritageAnimation";
import ScrollProgress from "./components/ScrollProgress";
import LiquidBackground from "./components/LiquidBackground";
import PromoBanner from "./components/PromoBanner";
import Reviews from "./components/Reviews";
import HomeClient from "./app/HomeClient";
import FeaturedSpotlight from "./components/FeaturedSpotlight";
import FAQ from "./components/FAQ";

// Register components for Builder.io Visual Editor
Builder.registerComponent(HomeClient, {
    name: "Home Page Layout",
    inputs: [
        { name: "wuraSubtitle", type: "string", defaultValue: "Modern Indigenous Fashion. <br /> Unisex & Female Collections." },
        { name: "wuraBgImage", type: "file", allowedFileTypes: ["jpeg", "jpg", "png", "webp"], defaultValue: "/images/wura-idle.jpg" },
        { name: "wuraBgVideo", type: "file", allowedFileTypes: ["mp4", "webm"], defaultValue: "/videos/wura-bg.mp4" },
        { name: "ewaSubtitle", type: "string", defaultValue: "Luxury Artistry. <br /> Bridal, Editorial & Hair." },
        { name: "ewaBgImage", type: "file", allowedFileTypes: ["jpeg", "jpg", "png", "webp"], defaultValue: "/images/ewa-idle.jpg" },
        { name: "ewaBgVideo", type: "file", allowedFileTypes: ["mp4", "webm"], defaultValue: "/videos/ewa-bg.mp4" },
        { name: "spotlight1Title", type: "string", defaultValue: "Set For Effortless Intentions" },
        { name: "spotlight1Desc", type: "text", defaultValue: "Move with purpose. Breathe with ease. <br /> Our new Heritage Silk collection is designed." },
        { name: "spotlight1Image", type: "file", allowedFileTypes: ["jpeg", "jpg", "png", "webp"], defaultValue: "/images/spotlight.jpg" },
        { name: "spotlight2Image", type: "file", allowedFileTypes: ["jpeg", "jpg", "png", "webp"], defaultValue: "/images/journal.jpg" },
    ],
    // This tells Builder 100% width is fine
    defaults: {
        styles: {
            width: "100%",
        }
    }
});
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
    image: "https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2F72c80f114dc149019051b6852a9e3b7a",
    inputs: [
        {
            name: "productId",
            type: "number",
            friendlyName: "WooCommerce Product ID",
            helperText: "Get the product ID from WooCommerce → Products → edit product → URL",
            defaultValue: null,
        },
        {
            // Hardcoded fallback shown in editor preview when productId is null
            name: "product",
            type: "object",
            hideFromUI: true,
            defaultValue: {
                id: 999,
                name: "Sample Product",
                price: "150.00",
                images: [{ src: "/images/spotlight.jpg" }, { src: "/images/wura-idle.jpg" }],
                slug: "sample-product",
            },
        },
    ],
});

Builder.registerComponent(HeritageAnimation, {
    name: "Heritage Title",
    inputs: [
        { name: "title", type: "string", defaultValue: "Where Heritage Meets Modern Luxury" },
        { name: "text", type: "text", defaultValue: "Wura & Ewa represents the duality of the modern individual. The intersection of timeless fashion and transformative artistry." }
    ],
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
    name: "Promo Banner Component",
    inputs: [
        {
            name: "slides",
            type: "list",
            subFields: [
                { name: "type", type: "string", enum: ["text", "image"], defaultValue: "text" },
                { name: "content", type: "string", defaultValue: "SPECIAL OFFER" },
                { name: "sub", type: "string", defaultValue: "Shop now" },
                { name: "image", type: "file", allowedFileTypes: ["jpeg", "jpg", "png"] },
                { name: "link", type: "string", defaultValue: "/shop" },
                { name: "alt", type: "string", defaultValue: "Promo banner" }
            ],
            defaultValue: [
                { type: "text", content: "THE DRAW IS FINALLY OPEN", sub: "Shop the Exclusive Drop", link: "/shop" },
                { type: "image", image: "/images/banner-1.jpg", alt: "New Season Collection", link: "/shop" }
            ]
        }
    ],
});

Builder.registerComponent(Reviews, {
    name: "Google Reviews Component",
    inputs: [
        {
            name: "reviews",
            type: "list",
            subFields: [
                { name: "author_name", type: "string" },
                { name: "rating", type: "number", min: 1, max: 5 },
                { name: "text", type: "text" },
                { name: "relative_time_description", type: "string" }
            ],
            defaultValue: [
                { author_name: "Sarah Jenkins", rating: 5, text: "Absolutely stunning craftsmanship. The silk tunic I bought is my new favorite piece.", relative_time_description: "2 weeks ago" }
            ]
        }
    ],
});

Builder.registerComponent(FeaturedSpotlight, {
    name: "Featured Spotlight",
    inputs: [
        { name: "title", type: "string", defaultValue: "Set For Effortless Intentions" },
        { name: "description", type: "text", defaultValue: "Move with purpose. Breathe with ease. <br /> Our new Heritage Silk collection is designed for moments of pure clarity." },
        { name: "ctaText", type: "string", defaultValue: "Explore The Collection" },
        { name: "ctaLink", type: "string", defaultValue: "/shop" },
        { name: "imagePath", type: "file", allowedFileTypes: ["jpeg", "jpg", "png", "webp"], defaultValue: "/images/spotlight.jpg" },
        { name: "hasGlassCard", type: "boolean", defaultValue: true }
    ],
});

Builder.registerComponent(FAQ, {
    name: "FAQ Section",
    inputs: [
        {
            name: "faqs",
            type: "list",
            subFields: [
                { name: "question", type: "string" },
                { name: "answer", type: "text" }
            ],
            defaultValue: [
                { question: "How do I book an appointment with Ewa?", answer: "You can book directly through our Services page." },
                { question: "Can I request custom measurements?", answer: "Absolutely. Many of our Heritage pieces can be tailored." }
            ]
        }
    ],
});
