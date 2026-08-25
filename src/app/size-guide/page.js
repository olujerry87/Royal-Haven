import { Ruler, Download, ExternalLink } from "lucide-react";
import Link from "next/link";
import SizeGuideClient from "./SizeGuideClient";

export const metadata = {
    title: "Size Guide | Royal Haven",
    description: "Royal Haven clothing size guide — find your perfect fit with our detailed measurement charts for Regular, Tall, and Petite sizing.",
};

export default function SizeGuidePage() {
    return (
        <main style={{
            paddingTop: "var(--page-top-offset, 130px)",
            minHeight: "100vh",
            maxWidth: "var(--max-width)",
            margin: "0 auto",
            paddingLeft: "1.5rem",
            paddingRight: "1.5rem",
            paddingBottom: "5rem",
            boxSizing: "border-box",
        }}>
            {/* Breadcrumb */}
            <div style={{ marginBottom: "2rem" }}>
                <Link href="/shop" style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    fontSize: "0.9rem",
                    color: "var(--gold, #D4AF37)",
                    textDecoration: "none",
                    background: "rgba(11,11,11,0.05)",
                    padding: "0.4rem 0.85rem",
                    borderRadius: "6px",
                    border: "1px solid rgba(212,175,55,0.2)",
                }}>
                    ← Back to Shop
                </Link>
            </div>

            {/* Page Header */}
            <div style={{ marginBottom: "3rem", borderBottom: "1px solid #e5e7eb", paddingBottom: "2rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                    <Ruler size={28} color="var(--gold, #D4AF37)" />
                    <h1 style={{
                        fontFamily: "var(--font-heritage, serif)",
                        fontSize: "clamp(2rem, 4vw, 3rem)",
                        fontWeight: 300,
                        margin: 0,
                        color: "var(--obsidian, #0B0B0B)",
                    }}>
                        Size Guide
                    </h1>
                </div>
                <p style={{
                    fontFamily: "var(--font-body, sans-serif)",
                    color: "#6b7280",
                    fontSize: "1rem",
                    margin: 0,
                    maxWidth: "600px",
                    lineHeight: 1.6,
                }}>
                    Find your perfect fit with our detailed measurement charts, available in inches and centimeters across Regular, Petite, and Tall sizing.
                </p>

                {/* PDF Download & View Buttons */}
                <div style={{ marginTop: "1.25rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                    <a
                        href="/docs/royal-haven-size-guide.pdf"
                        download="Royal-Haven-Size-Guide.pdf"
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            background: "var(--obsidian, #0B0B0B)",
                            color: "var(--gold, #D4AF37)",
                            padding: "0.75rem 1.5rem",
                            borderRadius: "8px",
                            fontFamily: "var(--font-body)",
                            fontWeight: 600,
                            fontSize: "0.88rem",
                            letterSpacing: "0.05em",
                            textTransform: "uppercase",
                            textDecoration: "none",
                            transition: "background 0.2s",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                        }}
                    >
                        <Download size={15} /> Download PDF Size Guide
                    </a>
                    <a
                        href="/docs/royal-haven-size-guide.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            background: "transparent",
                            color: "var(--obsidian, #0B0B0B)",
                            padding: "0.75rem 1.5rem",
                            borderRadius: "8px",
                            fontFamily: "var(--font-body)",
                            fontWeight: 600,
                            fontSize: "0.88rem",
                            letterSpacing: "0.05em",
                            textTransform: "uppercase",
                            textDecoration: "none",
                            border: "1.5px solid var(--obsidian, #0B0B0B)",
                        }}
                    >
                        <ExternalLink size={15} /> View PDF In Browser
                    </a>
                </div>
            </div>

            {/* Interactive Measurement Tables (replaces broken <object> PDF embed) */}
            <SizeGuideClient />
        </main>
    );
}
