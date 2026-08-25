"use client";

import { useState } from "react";
import { ROYAL_HAVEN_DESIGNS } from "@/lib/sizeGuideData";
import { Ruler, Sparkles, Check } from "lucide-react";

export default function SizeGuideClient() {
    const [activeTab, setActiveTab] = useState("charts"); // 'charts' | 'tips'
    const [selectedDesignId, setSelectedDesignId] = useState(ROYAL_HAVEN_DESIGNS[0].id);
    const [unit, setUnit] = useState("IN"); // 'IN' | 'CM'

    const activeDesign = ROYAL_HAVEN_DESIGNS.find(d => d.id === selectedDesignId) || ROYAL_HAVEN_DESIGNS[0];
    const chartData = activeDesign.measurements[unit];

    const thStyle = {
        padding: "0.9rem 0.85rem",
        border: "1px solid #e5e7eb",
        background: "#f9fafb",
        fontWeight: 700,
        color: "#111827",
        fontFamily: "var(--font-body, sans-serif)",
        fontSize: "0.88rem",
        textAlign: "center",
    };

    const tdStyle = (isFirst) => ({
        padding: "0.85rem 0.85rem",
        border: "1px solid #e5e7eb",
        fontFamily: "var(--font-body, sans-serif)",
        fontSize: "0.88rem",
        textAlign: isFirst ? "left" : "center",
        background: isFirst ? "#f9fafb" : "#ffffff",
        fontWeight: isFirst ? 600 : 400,
        color: isFirst ? "#111827" : "#374151",
        paddingLeft: isFirst ? "1.1rem" : "0.85rem",
    });

    return (
        <section style={{ marginTop: "1rem" }}>
            {/* Main Tabs: size charts vs measuring tips */}
            <div style={{
                display: "flex",
                borderBottom: "2px solid #e5e7eb",
                marginBottom: "2rem",
                gap: "1rem",
            }}>
                <button
                    onClick={() => setActiveTab("charts")}
                    style={{
                        padding: "0.9rem 1.5rem",
                        background: "none",
                        border: "none",
                        borderBottom: activeTab === "charts" ? "2px solid var(--obsidian, #0B0B0B)" : "2px solid transparent",
                        fontFamily: "var(--font-body, sans-serif)",
                        fontSize: "1rem",
                        fontWeight: activeTab === "charts" ? 700 : 500,
                        color: activeTab === "charts" ? "var(--obsidian, #0B0B0B)" : "#6b7280",
                        cursor: "pointer",
                        textTransform: "lowercase",
                        marginBottom: "-2px",
                        transition: "all 0.2s",
                    }}
                >
                    size charts
                </button>
                <button
                    onClick={() => setActiveTab("tips")}
                    style={{
                        padding: "0.9rem 1.5rem",
                        background: "none",
                        border: "none",
                        borderBottom: activeTab === "tips" ? "2px solid var(--obsidian, #0B0B0B)" : "2px solid transparent",
                        fontFamily: "var(--font-body, sans-serif)",
                        fontSize: "1rem",
                        fontWeight: activeTab === "tips" ? 700 : 500,
                        color: activeTab === "tips" ? "var(--obsidian, #0B0B0B)" : "#6b7280",
                        cursor: "pointer",
                        textTransform: "lowercase",
                        marginBottom: "-2px",
                        transition: "all 0.2s",
                    }}
                >
                    measuring tips
                </button>
            </div>

            {activeTab === "charts" ? (
                <div>
                    {/* Unit Switcher & Design Selector Bar */}
                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: "1rem",
                        marginBottom: "1.5rem",
                    }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <span style={{
                                fontFamily: "var(--font-body)",
                                fontSize: "0.85rem",
                                fontWeight: 600,
                                textTransform: "uppercase",
                                letterSpacing: "0.05em",
                                color: "#6b7280",
                            }}>
                                Select Garment:
                            </span>
                        </div>

                        {/* Unit Toggle IN | CM */}
                        <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                            <button
                                onClick={() => setUnit("IN")}
                                style={{
                                    background: "none",
                                    border: "none",
                                    fontFamily: "var(--font-body)",
                                    fontSize: "0.95rem",
                                    fontWeight: unit === "IN" ? 800 : 500,
                                    color: unit === "IN" ? "var(--obsidian, #0B0B0B)" : "#9ca3af",
                                    cursor: "pointer",
                                    padding: "0.25rem 0.5rem",
                                }}
                            >
                                IN
                            </button>
                            <span style={{ color: "#d1d5db" }}>|</span>
                            <button
                                onClick={() => setUnit("CM")}
                                style={{
                                    background: "none",
                                    border: "none",
                                    fontFamily: "var(--font-body)",
                                    fontSize: "0.95rem",
                                    fontWeight: unit === "CM" ? 800 : 500,
                                    color: unit === "CM" ? "var(--obsidian, #0B0B0B)" : "#9ca3af",
                                    cursor: "pointer",
                                    padding: "0.25rem 0.5rem",
                                }}
                            >
                                CM
                            </button>
                        </div>
                    </div>

                    {/* Garment Design Pills Selector */}
                    <div style={{
                        display: "flex",
                        gap: "0.5rem",
                        flexWrap: "wrap",
                        marginBottom: "2rem",
                    }}>
                        {ROYAL_HAVEN_DESIGNS.map((d, index) => {
                            const isSelected = d.id === selectedDesignId;
                            return (
                                <button
                                    key={d.id}
                                    onClick={() => setSelectedDesignId(d.id)}
                                    style={{
                                        padding: "0.55rem 1rem",
                                        borderRadius: "20px",
                                        border: `1.5px solid ${isSelected ? "var(--obsidian, #0B0B0B)" : "#d1d5db"}`,
                                        background: isSelected ? "var(--obsidian, #0B0B0B)" : "#ffffff",
                                        color: isSelected ? "#FAF9F6" : "var(--obsidian, #0B0B0B)",
                                        fontFamily: "var(--font-body)",
                                        fontSize: "0.85rem",
                                        fontWeight: isSelected ? 600 : 500,
                                        cursor: "pointer",
                                        transition: "all 0.2s ease",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "0.35rem",
                                    }}
                                >
                                    <span>{index + 1}. {d.name}</span>
                                    {isSelected && <Check size={14} color="var(--gold, #D4AF37)" />}
                                </button>
                            );
                        })}
                    </div>

                    {/* Active Design Measurement Card */}
                    <div style={{
                        background: "#ffffff",
                        border: "1.5px solid #e5e7eb",
                        borderRadius: "12px",
                        padding: "1.75rem",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
                        marginBottom: "2rem",
                    }}>
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            flexWrap: "wrap",
                            marginBottom: "1.25rem",
                            borderBottom: "1px solid #f3f4f6",
                            paddingBottom: "1rem",
                        }}>
                            <div>
                                <span style={{
                                    fontSize: "0.72rem",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.15em",
                                    color: "var(--gold, #D4AF37)",
                                    fontWeight: 700,
                                    display: "block",
                                    marginBottom: "0.25rem",
                                }}>
                                    Official Garment Chart
                                </span>
                                <h3 style={{
                                    fontFamily: "var(--font-heritage, serif)",
                                    fontSize: "1.6rem",
                                    color: "var(--obsidian, #0B0B0B)",
                                    margin: 0,
                                    fontWeight: 400,
                                }}>
                                    {activeDesign.name}
                                </h3>
                            </div>

                            <span style={{
                                background: "rgba(212, 175, 55, 0.12)",
                                color: "var(--obsidian, #0B0B0B)",
                                border: "1px solid var(--gold, #D4AF37)",
                                padding: "0.3rem 0.75rem",
                                borderRadius: "30px",
                                fontSize: "0.78rem",
                                fontWeight: 600,
                                letterSpacing: "0.05em",
                            }}>
                                Units: {unit === "IN" ? "Inches (in)" : "Centimeters (cm)"}
                            </span>
                        </div>

                        {/* Primary Size Matrix Table */}
                        <div style={{
                            width: "100%",
                            overflowX: "auto",
                            border: "1px solid #e5e7eb",
                            borderRadius: "8px",
                            marginBottom: "1.5rem",
                        }}>
                            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "520px" }}>
                                <thead>
                                    <tr>
                                        <th style={{ ...thStyle, textAlign: "left", paddingLeft: "1.1rem" }}>
                                            Body part / Size ({unit.toLowerCase()})
                                        </th>
                                        {chartData.sizes.map((s, idx) => (
                                            <th key={idx} style={thStyle}>{s}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {chartData.rows.map((row, rIdx) => (
                                        <tr key={rIdx}>
                                            <td style={tdStyle(true)}>{row.label}</td>
                                            {row.values.map((v, vIdx) => (
                                                <td key={vIdx} style={tdStyle(false)}>{v}</td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Length & Fit Breakdown Table (if available) */}
                        {chartData.lengths && (
                            <div style={{ marginTop: "1.25rem" }}>
                                <h4 style={{
                                    fontFamily: "var(--font-body)",
                                    fontSize: "0.88rem",
                                    fontWeight: 700,
                                    textTransform: "uppercase",
                                    letterSpacing: "0.08em",
                                    color: "var(--obsidian, #0B0B0B)",
                                    marginBottom: "0.75rem",
                                }}>
                                    Length Breakdown by Fit ({chartData.lengths.label})
                                </h4>
                                <div style={{
                                    width: "100%",
                                    overflowX: "auto",
                                    border: "1px solid #e5e7eb",
                                    borderRadius: "8px",
                                }}>
                                    <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "400px" }}>
                                        <thead>
                                            <tr>
                                                <th style={{ ...thStyle, textAlign: "left", paddingLeft: "1.1rem" }}>Fit Type</th>
                                                {chartData.lengths.values.map((l, lIdx) => (
                                                    <th key={lIdx} style={thStyle}>{l.fit}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td style={tdStyle(true)}>{chartData.lengths.label}</td>
                                                {chartData.lengths.values.map((l, lIdx) => (
                                                    <td key={lIdx} style={tdStyle(false)}>{l.val}</td>
                                                ))}
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                /* Measuring Tips */
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                    {[
                        {
                            num: "01",
                            title: "Bust / Chest",
                            desc: "Measure under your arms around the fullest part of your bust, keeping the measuring tape comfortably level and flat across your shoulder blades."
                        },
                        {
                            num: "02",
                            title: "Natural Waist",
                            desc: "Measure around your natural waistline (the narrowest point of your torso, typically 1 inch above your navel), keeping the tape comfortably loose."
                        },
                        {
                            num: "03",
                            title: "Hips",
                            desc: "Stand with your feet together and measure around the fullest part of your hips and seat (typically 7–9 inches below your natural waistline)."
                        },
                        {
                            num: "04",
                            title: "Petit, Regular & Tall Fit Selection",
                            desc: "Petit is tailored for heights under 5'4\" with proportionate inseam/hem reductions. Regular is tailored for heights 5'4\" to 5'8\". Tall is tailored for heights 5'8\" and above with extra length in the torso and hem."
                        }
                    ].map(({ num, title, desc }) => (
                        <div key={num} style={{
                            display: "flex",
                            gap: "1.25rem",
                            padding: "1.5rem",
                            background: "#f9fafb",
                            borderRadius: "10px",
                            border: "1px solid #e5e7eb",
                        }}>
                            <div style={{
                                fontFamily: "var(--font-heritage, serif)",
                                fontSize: "2.2rem",
                                fontWeight: 300,
                                color: "var(--gold, #D4AF37)",
                                lineHeight: 1,
                                flexShrink: 0,
                                width: "2.8rem",
                            }}>
                                {num}
                            </div>
                            <div>
                                <div style={{
                                    fontWeight: 700,
                                    fontSize: "0.98rem",
                                    color: "var(--obsidian, #0B0B0B)",
                                    marginBottom: "0.35rem",
                                    fontFamily: "var(--font-body, sans-serif)",
                                }}>
                                    {title}
                                </div>
                                <p style={{
                                    fontSize: "0.9rem",
                                    lineHeight: 1.6,
                                    color: "#4b5563",
                                    margin: 0,
                                    fontFamily: "var(--font-body, sans-serif)",
                                }}>
                                    {desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}
