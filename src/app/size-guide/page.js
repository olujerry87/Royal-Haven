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

                {/* PDF Download Button (placeholder — upload your PDF to /public/docs/royal-haven-size-guide.pdf) */}
                <div style={{ marginTop: "1.25rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                    <a
                        href="/docs/royal-haven-size-guide.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        download
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

            {/* PDF Inline Preview */}
            <div style={{
                marginBottom: "3rem",
                borderRadius: "12px",
                overflow: "hidden",
                border: "1px solid #e5e7eb",
                boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                background: "#f9fafb",
            }}>
                <div style={{
                    background: "var(--obsidian, #0B0B0B)",
                    padding: "0.75rem 1.25rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                }}>
                    <Ruler size={14} color="var(--gold, #D4AF37)" />
                    <span style={{
                        color: "#FAF9F6",
                        fontFamily: "var(--font-body)",
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                    }}>
                        Royal Haven — Official Size Guide PDF
                    </span>
                </div>
                <object
                    data="/docs/royal-haven-size-guide.pdf"
                    type="application/pdf"
                    width="100%"
                    height="700px"
                    style={{ display: "block" }}
                >
                    <div style={{
                        padding: "3rem",
                        textAlign: "center",
                        color: "#6b7280",
                        fontFamily: "var(--font-body)",
                    }}>
                        <Ruler size={40} color="#d1d5db" style={{ margin: "0 auto 1rem" }} />
                        <p style={{ fontWeight: 600, marginBottom: "0.5rem", color: "#374151" }}>PDF Preview Unavailable</p>
                        <p style={{ fontSize: "0.9rem", marginBottom: "1.25rem" }}>
                            Your browser cannot display this PDF inline. Please download or view it directly.
                        </p>
                        <a
                            href="/docs/royal-haven-size-guide.pdf"
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.4rem",
                                padding: "0.65rem 1.25rem",
                                background: "var(--obsidian, #0B0B0B)",
                                color: "var(--gold, #D4AF37)",
                                borderRadius: "6px",
                                textDecoration: "none",
                                fontWeight: 600,
                                fontSize: "0.85rem",
                            }}
                        >
                            <Download size={13} /> Download Size Guide PDF
                        </a>
                    </div>
                </object>
            </div>

            {/* Interactive Measurement Tables */}
            <SizeGuideClient />
        </main>
    );
}
