"use client";

import { useState } from "react";

const SIZE_MATRIX_DATA = {
    IN: {
        sizes: ["XXS", "XS", "S", "M", "L", "XL"],
        numeric: ["00", "0-2", "4-6", "8-10", "12-14", "16"],
        chest: ["31.5\"", "32.5-33.5\"", "34.5-35.5\"", "36.5-38\"", "39.5-41\"", "42.5\""],
        waist: ["24\"", "25-26\"", "27-28\"", "29-30.5\"", "32-33.5\"", "35\""],
        hips: ["34.5\"", "35.5-36.5\"", "37.5-38.5\"", "39.5-41\"", "42.5-44\"", "45.5\""]
    },
    CM: {
        sizes: ["XXS", "XS", "S", "M", "L", "XL"],
        numeric: ["00", "0-2", "4-6", "8-10", "12-14", "16"],
        chest: ["80", "83-85", "88-90", "93-97", "100-104", "108"],
        waist: ["61", "64-66", "69-71", "74-78", "81-85", "89"],
        hips: ["88", "90-93", "95-98", "100-104", "108-112", "116"]
    }
};

// Petite sizes are typically shorter lengths but similar bust/waist as regular
const PETITE_MATRIX_DATA = {
    IN: {
        sizes: ["XXS", "XS", "S", "M", "L", "XL"],
        numeric: ["00P", "0P-2P", "4P-6P", "8P-10P", "12P-14P", "16P"],
        chest: ["31.5\"", "32.5-33.5\"", "34.5-35.5\"", "36.5-38\"", "39.5-41\"", "42.5\""],
        waist: ["24\"", "25-26\"", "27-28\"", "29-30.5\"", "32-33.5\"", "35\""],
        hips: ["34.5\"", "35.5-36.5\"", "37.5-38.5\"", "39.5-41\"", "42.5-44\"", "45.5\""]
    },
    CM: {
        sizes: ["XXS", "XS", "S", "M", "L", "XL"],
        numeric: ["00P", "0P-2P", "4P-6P", "8P-10P", "12P-14P", "16P"],
        chest: ["80", "83-85", "88-90", "93-97", "100-104", "108"],
        waist: ["61", "64-66", "69-71", "74-78", "81-85", "89"],
        hips: ["88", "90-93", "95-98", "100-104", "108-112", "116"]
    }
};

const TALL_MATRIX_DATA = {
    IN: {
        sizes: ["XS", "S", "M", "L", "XL", "XXL"],
        numeric: ["2T", "4T-6T", "8T-10T", "12T-14T", "16T", "18T"],
        chest: ["33.5\"", "35.5\"", "37.5\"", "40\"", "42.5\"", "45\""],
        waist: ["26\"", "28\"", "30.5\"", "33.5\"", "36\"", "39\""],
        hips: ["36.5\"", "38.5\"", "40.5\"", "43\"", "45.5\"", "48\""]
    },
    CM: {
        sizes: ["XS", "S", "M", "L", "XL", "XXL"],
        numeric: ["2T", "4T-6T", "8T-10T", "12T-14T", "16T", "18T"],
        chest: ["85", "90", "95", "102", "108", "114"],
        waist: ["66", "71", "77", "85", "92", "99"],
        hips: ["93", "98", "103", "109", "116", "122"]
    }
};

const DATA_BY_FIT = {
    regular: SIZE_MATRIX_DATA,
    petite: PETITE_MATRIX_DATA,
    tall: TALL_MATRIX_DATA,
};

export default function SizeGuideClient() {
    const [activeTab, setActiveTab] = useState("charts"); // 'charts' | 'tips'
    const [unit, setUnit] = useState("IN");
    const [activeSubTab, setActiveSubTab] = useState("regular");

    const currentMatrix = DATA_BY_FIT[activeSubTab][unit];

    const thStyle = {
        padding: "0.9rem 0.75rem",
        border: "1px solid #e5e7eb",
        background: "#f3f4f6",
        fontWeight: 700,
        color: "#111827",
        fontFamily: "var(--font-body, sans-serif)",
        fontSize: "0.88rem",
        textAlign: "center",
    };

    const tdStyle = (isFirst) => ({
        padding: "0.85rem 0.75rem",
        border: "1px solid #e5e7eb",
        fontFamily: "var(--font-body, sans-serif)",
        fontSize: "0.88rem",
        textAlign: isFirst ? "left" : "center",
        background: isFirst ? "#f9fafb" : "#ffffff",
        fontWeight: isFirst ? 600 : 400,
        color: isFirst ? "#111827" : "#374151",
        paddingLeft: isFirst ? "1rem" : "0.75rem",
    });

    return (
        <section>
            {/* Section Title */}
            <h2 style={{
                fontFamily: "var(--font-heritage, serif)",
                fontSize: "1.75rem",
                fontWeight: 300,
                color: "var(--obsidian, #0B0B0B)",
                marginBottom: "1.5rem",
                borderBottom: "1px solid #e5e7eb",
                paddingBottom: "1rem",
            }}>
                Interactive Measurement Charts
            </h2>

            {/* Main Tab Navigation */}
            <div style={{
                display: "flex",
                borderBottom: "1px solid #e5e7eb",
                marginBottom: "1.5rem",
            }}>
                {[
                    { key: "charts", label: "size charts" },
                    { key: "tips", label: "measuring tips" },
                ].map(({ key, label }) => (
                    <button
                        key={key}
                        onClick={() => setActiveTab(key)}
                        style={{
                            flex: 1,
                            padding: "0.9rem",
                            background: "none",
                            border: "none",
                            borderBottom: activeTab === key ? "2px solid var(--obsidian, #0B0B0B)" : "2px solid transparent",
                            fontFamily: "var(--font-body, sans-serif)",
                            fontSize: "0.95rem",
                            fontWeight: activeTab === key ? 700 : 500,
                            color: activeTab === key ? "var(--obsidian, #0B0B0B)" : "#6b7280",
                            cursor: "pointer",
                            textAlign: "center",
                            transition: "all 0.2s",
                        }}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {activeTab === "charts" ? (
                <>
                    {/* Unit Toggle */}
                    <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "0.25rem", marginBottom: "1.25rem" }}>
                        {["IN", "CM"].map((u, i) => (
                            <>
                                {i > 0 && <span key="sep" style={{ color: "#d1d5db", fontSize: "1rem" }}>|</span>}
                                <button
                                    key={u}
                                    onClick={() => setUnit(u)}
                                    style={{
                                        background: "none",
                                        border: "none",
                                        fontFamily: "var(--font-body, sans-serif)",
                                        fontSize: "0.9rem",
                                        fontWeight: unit === u ? 800 : 500,
                                        color: unit === u ? "var(--obsidian, #0B0B0B)" : "#9ca3af",
                                        cursor: "pointer",
                                        padding: "0.2rem 0.5rem",
                                        letterSpacing: "0.05em",
                                    }}
                                >
                                    {u}
                                </button>
                            </>
                        ))}
                    </div>

                    {/* Sub-Tab Category Buttons */}
                    <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
                        {[
                            { key: "regular", label: "Women's Regular" },
                            { key: "petite", label: "Women's Petite" },
                            { key: "tall", label: "Women's Tall" },
                        ].map(({ key, label }) => (
                            <button
                                key={key}
                                onClick={() => setActiveSubTab(key)}
                                style={{
                                    padding: "0.55rem 1.1rem",
                                    border: `1.5px solid ${activeSubTab === key ? "var(--obsidian, #0B0B0B)" : "#d1d5db"}`,
                                    background: activeSubTab === key ? "var(--obsidian, #0B0B0B)" : "#ffffff",
                                    color: activeSubTab === key ? "#ffffff" : "var(--obsidian, #0B0B0B)",
                                    fontFamily: "var(--font-body, sans-serif)",
                                    fontSize: "0.88rem",
                                    fontWeight: 600,
                                    cursor: "pointer",
                                    transition: "all 0.2s",
                                    borderRadius: "4px",
                                }}
                            >
                                {label}
                            </button>
                        ))}
                    </div>

                    {/* Measurement Matrix Table */}
                    <div style={{
                        width: "100%",
                        overflowX: "auto",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                    }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "500px" }}>
                            <thead>
                                <tr>
                                    <th style={{ ...thStyle, textAlign: "left", paddingLeft: "1rem" }}>Size</th>
                                    {currentMatrix.sizes.map((s, idx) => (
                                        <th key={idx} style={thStyle}>{s}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td style={tdStyle(true)}>Numeric</td>
                                    {currentMatrix.numeric.map((val, idx) => <td key={idx} style={tdStyle(false)}>{val}</td>)}
                                </tr>
                                <tr>
                                    <td style={tdStyle(true)}>Chest {unit === "IN" ? "(in)" : "(cm)"}</td>
                                    {currentMatrix.chest.map((val, idx) => <td key={idx} style={tdStyle(false)}>{val}</td>)}
                                </tr>
                                <tr>
                                    <td style={tdStyle(true)}>Waist {unit === "IN" ? "(in)" : "(cm)"}</td>
                                    {currentMatrix.waist.map((val, idx) => <td key={idx} style={tdStyle(false)}>{val}</td>)}
                                </tr>
                                <tr>
                                    <td style={tdStyle(true)}>Hips {unit === "IN" ? "(in)" : "(cm)"}</td>
                                    {currentMatrix.hips.map((val, idx) => <td key={idx} style={tdStyle(false)}>{val}</td>)}
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <p style={{
                        marginTop: "1rem",
                        fontSize: "0.8rem",
                        color: "#9ca3af",
                        fontFamily: "var(--font-body, sans-serif)",
                        lineHeight: 1.5,
                    }}>
                        All measurements are in {unit === "IN" ? "inches" : "centimeters"}. Sizes may vary slightly by style. When between sizes, we recommend sizing up. Contact us at <a href="mailto:royalhaven@bezaleelgroup.ca" style={{ color: "var(--gold, #D4AF37)" }}>royalhaven@bezaleelgroup.ca</a> for personalized fitting assistance.
                    </p>
                </>
            ) : (
                /* Measuring Tips Content */
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                    {[
                        {
                            num: "01",
                            title: "Bust / Chest",
                            desc: "Measure around the fullest part of your chest/bust, keeping the measuring tape horizontal under your arms and flat across your back. Do not pull too tight — keep it comfortably snug."
                        },
                        {
                            num: "02",
                            title: "Natural Waist",
                            desc: "Measure around your natural waistline (typically the narrowest part of your torso, usually 1 inch above your belly button), keeping the tape comfortably loose."
                        },
                        {
                            num: "03",
                            title: "Hips",
                            desc: "Stand with your heels together and measure around the fullest part of your hips and seat, keeping the tape level and measuring about 7–9 inches below your natural waistline."
                        },
                        {
                            num: "04",
                            title: "Inseam",
                            desc: "Measure from the crotch seam to the bottom of your leg along the inner thigh. It is easiest to have someone help with this measurement."
                        },
                        {
                            num: "05",
                            title: "Use a Flexible Tape",
                            desc: "Always use a soft, flexible measuring tape (like a sewing tape) for body measurements. Never use a rigid tape measure. Measure over underwear or form-fitting clothing."
                        },
                    ].map(({ num, title, desc }) => (
                        <div key={num} style={{
                            display: "flex",
                            gap: "1.25rem",
                            padding: "1.25rem",
                            background: "#f9fafb",
                            borderRadius: "8px",
                            border: "1px solid #e5e7eb",
                        }}>
                            <div style={{
                                fontFamily: "var(--font-heritage, serif)",
                                fontSize: "2.5rem",
                                fontWeight: 300,
                                color: "var(--gold, #D4AF37)",
                                lineHeight: 1,
                                flexShrink: 0,
                                width: "3rem",
                            }}>
                                {num}
                            </div>
                            <div>
                                <div style={{
                                    fontWeight: 700,
                                    fontSize: "0.95rem",
                                    color: "var(--obsidian, #0B0B0B)",
                                    marginBottom: "0.4rem",
                                    fontFamily: "var(--font-body, sans-serif)",
                                }}>
                                    {title}
                                </div>
                                <p style={{
                                    fontSize: "0.88rem",
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
