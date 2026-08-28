/**
 * Royal Haven Official Size Guide Data
 * Extracted directly from royal-haven-size-guide.pdf
 */

export const ROYAL_HAVEN_DESIGNS = [
    {
        id: "janus-top",
        name: "Ṣadé The Janus Top",
        keywords: ["sade", "janus", "top"],
        measurements: {
            IN: {
                sizes: ["Small (S)", "Medium (M)", "Large (L)", "Extra-large (XL)"],
                rows: [
                    { label: "Bust", values: ["30-33", "34-37", "38-41", "42-45"] },
                    { label: "Waist", values: ["24-27", "28-31", "32-35", "36-39"] },
                ],
                lengths: {
                    label: "Shoulder to hem",
                    values: [
                        { fit: "Petit", val: "17\"" },
                        { fit: "Regular", val: "19\"" },
                        { fit: "Tall", val: "21\"" },
                    ]
                }
            },
            CM: {
                sizes: ["Small (S)", "Medium (M)", "Large (L)", "Extra-large (XL)"],
                rows: [
                    { label: "Bust", values: ["76-84", "86-94", "96-104", "106-114"] },
                    { label: "Waist", values: ["61-68", "71-79", "81-89", "91-99"] },
                ],
                lengths: {
                    label: "Shoulder to hem",
                    values: [
                        { fit: "Petit", val: "43 cm" },
                        { fit: "Regular", val: "48 cm" },
                        { fit: "Tall", val: "53 cm" },
                    ]
                }
            }
        }
    },
    {
        id: "flutter-skirt",
        name: "Nku: The Flutter Skirt",
        keywords: ["nku", "flutter", "skirt"],
        measurements: {
            IN: {
                sizes: ["Small (S)", "Medium (M)", "Large (L)", "Extra large (XL)"],
                rows: [
                    { label: "Waist round", values: ["24-27", "28-31", "32-35", "36-39"] },
                ],
                lengths: {
                    label: "Waist to shortest hem",
                    values: [
                        { fit: "Petit", val: "21\"" },
                        { fit: "Regular", val: "23\"" },
                        { fit: "Tall", val: "25\"" },
                    ]
                }
            },
            CM: {
                sizes: ["Small (S)", "Medium (M)", "Large (L)", "Extra large (XL)"],
                rows: [
                    { label: "Waist round", values: ["61-68", "71-79", "81-89", "91-99"] },
                ],
                lengths: {
                    label: "Waist to shortest hem",
                    values: [
                        { fit: "Petit", val: "53 cm" },
                        { fit: "Regular", val: "58 cm" },
                        { fit: "Tall", val: "64 cm" },
                    ]
                }
            }
        }
    },
    {
        id: "origami-blouse",
        name: "Afínjú The Origami Blouse",
        keywords: ["afinju", "origami", "blouse"],
        measurements: {
            IN: {
                sizes: ["Small (S)", "Medium (M)", "Large (L)"],
                rows: [
                    { label: "Width", values: ["36", "43", "50"] },
                ],
                lengths: {
                    label: "Shoulder to hem",
                    values: [
                        { fit: "Petit", val: "16\"" },
                        { fit: "Regular", val: "18\"" },
                        { fit: "Tall", val: "20\"" },
                    ]
                }
            },
            CM: {
                sizes: ["Small (S)", "Medium (M)", "Large (L)"],
                rows: [
                    { label: "Width", values: ["91", "109", "127"] },
                ],
                lengths: {
                    label: "Shoulder to hem",
                    values: [
                        { fit: "Petit", val: "41 cm" },
                        { fit: "Regular", val: "46 cm" },
                        { fit: "Tall", val: "51 cm" },
                    ]
                }
            }
        }
    },
    {
        id: "aljihun-shorts",
        name: "Aljihu: The Cargo-Shorts",
        keywords: ["aljihu", "cargo-shorts", "cargo shorts"],
        measurements: {
            IN: {
                sizes: ["Small (S)", "Medium (M)", "Large (L)", "Extra large (XL)"],
                rows: [
                    { label: "Waist", values: ["24-27", "28-31", "32-35", "36-39"] },
                    { label: "Hip", values: ["34-37", "38-41", "42-45", "46-49"] },
                ],
                lengths: {
                    label: "Length Breakdown",
                    values: [
                        { fit: "Petit (Inseam: 7\", Outseam: 17\")", val: "7\" / 17\"" },
                        { fit: "Regular (Inseam: 9\", Outseam: 19\")", val: "9\" / 19\"" },
                        { fit: "Tall (Inseam: 11\", Outseam: 21\")", val: "11\" / 21\"" },
                    ]
                }
            },
            CM: {
                sizes: ["Small (S)", "Medium (M)", "Large (L)", "Extra large (XL)"],
                rows: [
                    { label: "Waist", values: ["61-68", "71-79", "81-89", "91-99"] },
                    { label: "Hip", values: ["86-94", "96-104", "106-114", "116-124"] },
                ],
                lengths: {
                    label: "Length Breakdown",
                    values: [
                        { fit: "Petit (Inseam: 18cm, Outseam: 43cm)", val: "18cm / 43cm" },
                        { fit: "Regular (Inseam: 23cm, Outseam: 48cm)", val: "23cm / 48cm" },
                        { fit: "Tall (Inseam: 28cm, Outseam: 53cm)", val: "28cm / 53cm" },
                    ]
                }
            }
        }
    },
    {
        id: "osa-shorts",
        name: "Osa Shorts (Fringe Cargo)",
        keywords: ["osa", "fringe", "cargo", "fringe cargo", "osa shorts"],
        measurements: {
            IN: {
                sizes: ["Small (S)", "Medium (M)", "Large (L)", "Extra large (XL)"],
                rows: [
                    { label: "Waist", values: ["28-31", "32-35", "36-39", "40-43"] },
                ],
                lengths: {
                    label: "Length Breakdown",
                    values: [
                        { fit: "Petit (Inseam: 7\", Outseam: 19\")", val: "7\" / 19\"" },
                        { fit: "Regular (Inseam: 9\", Outseam: 21\")", val: "9\" / 21\"" },
                        { fit: "Tall (Inseam: 11\", Outseam: 23\")", val: "11\" / 23\"" },
                    ]
                }
            },
            CM: {
                sizes: ["Small (S)", "Medium (M)", "Large (L)", "Extra large (XL)"],
                rows: [
                    { label: "Waist", values: ["71-79", "81-89", "91-99", "101-109"] },
                ],
                lengths: {
                    label: "Length Breakdown",
                    values: [
                        { fit: "Petit (Inseam: 18cm, Outseam: 48cm)", val: "18cm / 48cm" },
                        { fit: "Regular (Inseam: 23cm, Outseam: 53cm)", val: "23cm / 53cm" },
                        { fit: "Tall (Inseam: 28cm, Outseam: 58cm)", val: "28cm / 58cm" },
                    ]
                }
            }
        }
    },
    {
        id: "huayu-kimono",
        name: "Huáyǔ Kimono (Armor-Kaftan)",
        keywords: ["huayu", "armor-kaftan", "kaftan", "kimono"],
        measurements: {
            IN: {
                sizes: ["Small (S)", "Medium (M)"],
                rows: [
                    { label: "Width", values: ["30", "40"] },
                ],
                lengths: {
                    label: "Shoulder to hem",
                    values: [
                        { fit: "Regular", val: "35\"" },
                        { fit: "Tall", val: "45\"" },
                    ]
                }
            },
            CM: {
                sizes: ["Small (S)", "Medium (M)"],
                rows: [
                    { label: "Width", values: ["76", "102"] },
                ],
                lengths: {
                    label: "Shoulder to hem",
                    values: [
                        { fit: "Regular", val: "89 cm" },
                        { fit: "Tall", val: "114 cm" },
                    ]
                }
            }
        }
    },
    {
        id: "igheghe-dress",
        name: "Igheghe: The Shadow Dress",
        keywords: ["igheghe", "shadow", "dress", "shadow dress"],
        measurements: {
            IN: {
                sizes: ["Small (S)", "Medium (M)", "Large (L)", "Extra large (XL)"],
                rows: [
                    { label: "Bust", values: ["30-33", "34-37", "38-41", "42-45"] },
                    { label: "Waist", values: ["24-27", "28-31", "32-35", "36-39"] },
                ],
                lengths: {
                    label: "Shoulder to hem",
                    values: [
                        { fit: "Petit", val: "50\"" },
                        { fit: "Regular", val: "54\"" },
                        { fit: "Tall", val: "58\"" },
                    ]
                }
            },
            CM: {
                sizes: ["Small (S)", "Medium (M)", "Large (L)", "Extra large (XL)"],
                rows: [
                    { label: "Bust", values: ["76-84", "86-94", "96-104", "106-114"] },
                    { label: "Waist", values: ["61-68", "71-79", "81-89", "91-99"] },
                ],
                lengths: {
                    label: "Shoulder to hem",
                    values: [
                        { fit: "Petit", val: "127 cm" },
                        { fit: "Regular", val: "137 cm" },
                        { fit: "Tall", val: "147 cm" },
                    ]
                }
            }
        }
    },
    {
        id: "hanfu-kimono",
        name: "Hanfu Kimono (Axis Robe)",
        keywords: ["hanfu", "axis", "robe", "axis robe"],
        measurements: {
            IN: {
                sizes: ["Small (S)", "Medium (M)", "Large (L)"],
                rows: [
                    { label: "Width", values: ["28", "32", "36"] },
                ],
                lengths: {
                    label: "Shoulder to hem",
                    values: [
                        { fit: "Petit", val: "16\"" },
                        { fit: "Regular", val: "18\"" },
                        { fit: "Tall", val: "20\"" },
                    ]
                }
            },
            CM: {
                sizes: ["Small (S)", "Medium (M)", "Large (L)"],
                rows: [
                    { label: "Width", values: ["71", "81", "91"] },
                ],
                lengths: {
                    label: "Shoulder to hem",
                    values: [
                        { fit: "Petit", val: "41 cm" },
                        { fit: "Regular", val: "46 cm" },
                        { fit: "Tall", val: "51 cm" },
                    ]
                }
            }
        }
    },
    {
        id: "boubou-nzuri",
        name: "Boubou Nzuri: Liquid Regal Dress",
        keywords: ["boubou nzuri", "liquid regal", "boubou", "nzuri", "tanzanian", "bubu"],
        measurements: {
            IN: {
                sizes: ["One Size (Fits All)"],
                rows: [
                    { label: "Chest / Width", values: ["Relaxed Comfort Fit (Free)"] },
                    { label: "Waist / Hip", values: ["Universal Flow Silhouette"] },
                ],
                lengths: {
                    label: "Length",
                    values: [
                        { fit: "Regular", val: "58\"" },
                        { fit: "Tall", val: "62\"" },
                    ]
                }
            },
            CM: {
                sizes: ["One Size (Fits All)"],
                rows: [
                    { label: "Chest / Width", values: ["Relaxed Comfort Fit (Free)"] },
                    { label: "Waist / Hip", values: ["Universal Flow Silhouette"] },
                ],
                lengths: {
                    label: "Length",
                    values: [
                        { fit: "Regular", val: "147 cm" },
                        { fit: "Tall", val: "157 cm" },
                    ]
                }
            }
        }
    },
    {
        id: "akoma-neon-prism",
        name: "Akoma: Neon Prism",
        keywords: ["akoma", "neon prism", "prism", "neon aztec"],
        measurements: {
            IN: {
                sizes: ["Small (Size 6)", "Medium (Sizes 8–12)", "Large (Sizes 14–18)", "Extra Large (Sizes 20–24)"],
                rows: [
                    { label: "Numeric Size Mapping", values: ["6", "8, 10, 12", "14, 16, 18", "20, 22, 24"] },
                    { label: "Bust", values: ["33\"", "35\" - 40\"", "42\" - 48\"", "52\" - 56\""] },
                    { label: "Waist", values: ["25\"", "28\" - 33\"", "35\" - 43\"", "46\" - 51\""] },
                    { label: "Hip", values: ["35\"", "37\" - 42.5\"", "44\" - 53\"", "56\" - 62\""] },
                ],
                lengths: {
                    label: "Length Breakdown",
                    values: [
                        { fit: "Petit", val: "52\" (-2\" proportional flow)" },
                        { fit: "Regular", val: "56\" (Standard regal flow)" },
                        { fit: "Tall", val: "60\" (+2\" extended regal flow)" },
                    ]
                }
            },
            CM: {
                sizes: ["Small (Size 6)", "Medium (Sizes 8–12)", "Large (Sizes 14–18)", "Extra Large (Sizes 20–24)"],
                rows: [
                    { label: "Numeric Size Mapping", values: ["6", "8, 10, 12", "14, 16, 18", "20, 22, 24"] },
                    { label: "Bust", values: ["84 cm", "89 - 102 cm", "107 - 122 cm", "132 - 142 cm"] },
                    { label: "Waist", values: ["64 cm", "71 - 84 cm", "89 - 109 cm", "117 - 130 cm"] },
                    { label: "Hip", values: ["89 cm", "94 - 108 cm", "112 - 135 cm", "142 - 157 cm"] },
                ],
                lengths: {
                    label: "Length Breakdown",
                    values: [
                        { fit: "Petit", val: "132 cm (-5 cm proportional flow)" },
                        { fit: "Regular", val: "142 cm (Standard regal flow)" },
                        { fit: "Tall", val: "152 cm (+5 cm extended regal flow)" },
                    ]
                }
            }
        }
    },

    {
        id: "ankara-zubair-others",
        name: "Ankara Short Dress & Zubair Bomber Jacket (Standard Sizing)",
        keywords: ["ankara", "zubair", "bomber", "jacket", "dress"],
        measurements: {
            IN: {
                sizes: ["6", "8", "10", "12", "14", "16", "18", "20", "22", "24"],
                rows: [
                    { label: "Bust", values: ["33\"", "35\"", "38\"", "40\"", "42\"", "45\"", "48\"", "52\"", "55\"", "56\""] },
                    { label: "Waist", values: ["25\"", "28\"", "30\"", "33\"", "35\"", "38\"", "43\"", "46\"", "48\"", "51\""] },
                    { label: "Hip", values: ["35\"", "37\"", "40\"", "42.5\"", "44\"", "48\"", "53\"", "56\"", "59\"", "62\""] },
                ],
                lengths: {
                    label: "Fit Profiles",
                    values: [
                        { fit: "Petit", val: "-2\" proportional inseam/hem" },
                        { fit: "Regular", val: "Standard design length" },
                        { fit: "Tall", val: "+2\" proportional inseam/hem" },
                    ]
                }
            },
            CM: {
                sizes: ["6", "8", "10", "12", "14", "16", "18", "20", "22", "24"],
                rows: [
                    { label: "Bust", values: ["84", "89", "97", "102", "107", "114", "122", "132", "140", "142"] },
                    { label: "Waist", values: ["64", "71", "76", "84", "89", "97", "109", "117", "122", "130"] },
                    { label: "Hip", values: ["89", "94", "102", "108", "112", "122", "135", "142", "150", "157"] },
                ],
                lengths: {
                    label: "Fit Profiles",
                    values: [
                        { fit: "Petit", val: "-5 cm proportional inseam/hem" },
                        { fit: "Regular", val: "Standard design length" },
                        { fit: "Tall", val: "+5 cm proportional inseam/hem" },
                    ]
                }
            }
        }
    }

];

/**
 * Match a product name or slug to its specific design size chart
 */
export function getDesignForProduct(productName = "", productSlug = "") {
    const text = `${productName} ${productSlug}`.toLowerCase();
    for (const design of ROYAL_HAVEN_DESIGNS) {
        if (design.keywords.some(kw => text.includes(kw))) {
            return design;
        }
    }
    // Default to first or standard design
    return ROYAL_HAVEN_DESIGNS[0];
}
