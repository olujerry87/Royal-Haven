"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
    ChevronLeft, 
    ChevronRight, 
    Minus, 
    Plus, 
    ShoppingBag, 
    CheckCircle2, 
    ArrowRight, 
    Maximize2, 
    X,
    Ruler,
    XCircle,
    Download,
    ExternalLink
} from "lucide-react";
import styles from "./page.module.css";
import { useCart } from "@/context/CartContext";
import { ROYAL_HAVEN_DESIGNS, getDesignForProduct } from "@/lib/sizeGuideData";

function getMeta(meta_data = [], key) {
    const entry = meta_data.find(m => m.key === key);
    return entry?.value || null;
}

// NOTE: Fit options and size lists are derived dynamically from the
// product's variation records at runtime, NOT from static maps.
// This ensures only actually-configured combinations are shown.


function decodeHtml(html) {
    if (!html || typeof html !== 'string') return '';
    return html
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'")
        .replace(/&#038;/g, '&')
        .replace(/&nbsp;/g, ' ')
        .trim();
}

// Default fabric/color options when product doesn't have explicit WooCommerce color attribute
const DEFAULT_FABRIC_OPTIONS = ["Raw Indigo", "Fringe Denim", "Obsidian Black", "Gold Ochre"];

// Helper: extract unique attribute options from product attributes
function getAttrOptions(attributes, attrName) {
    const attr = attributes?.find(a => 
        a.name.toLowerCase() === attrName.toLowerCase() || 
        a.name.toLowerCase() === `pa_${attrName.toLowerCase()}` ||
        a.name.toLowerCase().includes(attrName.toLowerCase())
    );
    return attr?.options || [];
}

export default function ProductDetailClient({ product, variations = [], relatedProducts = [] }) {
    const [activeImage, setActiveImage] = useState(0);
    
    // Matched size chart design from official PDF
    const matchedDesign = useMemo(() => {
        return getDesignForProduct(product.name, product.slug);
    }, [product.name, product.slug]);

    // ── Extract Color / Fabric Options (decoded) ──────────────────────────────
    const colorOptions = useMemo(() => {
        let rawOptions = [];
        const fromColor = getAttrOptions(product.attributes, 'color');
        if (fromColor.length > 0) rawOptions = fromColor;
        else {
            const fromFabric = getAttrOptions(product.attributes, 'fabric');
            if (fromFabric.length > 0) rawOptions = fromFabric;
            else {
                const fromMaterial = getAttrOptions(product.attributes, 'material');
                if (fromMaterial.length > 0) rawOptions = fromMaterial;
                else {
                    const fromPattern = getAttrOptions(product.attributes, 'pattern');
                    if (fromPattern.length > 0) rawOptions = fromPattern;
                }
            }
        }

        // Also check if any variation attributes contain colors/fabrics not in parent
        if (variations.length > 0) {
            variations.forEach(v => {
                const opt = v.attributes.find(a => 
                    a.name.toLowerCase().includes('color') || a.name.toLowerCase().includes('fabric') || a.name.toLowerCase().includes('material')
                )?.option;
                if (opt && !rawOptions.some(r => decodeHtml(r).toLowerCase() === decodeHtml(opt).toLowerCase())) {
                    rawOptions.push(opt);
                }
            });
        }

        if (rawOptions.length === 0) rawOptions = DEFAULT_FABRIC_OPTIONS;
        return rawOptions.map(opt => decodeHtml(opt));
    }, [product.attributes, variations]);

    // Map each color/fabric to its variation thumbnail image from WordPress (if uploaded)
    const colorImageMap = useMemo(() => {
        const map = {};
        for (const v of variations) {
            const vColor = decodeHtml(v.attributes.find(a => 
                a.name.toLowerCase().includes('color') || a.name.toLowerCase().includes('fabric') || a.name.toLowerCase().includes('material')
            )?.option || '').toLowerCase();
            if (vColor && v.image && !map[vColor]) {
                map[vColor] = v.image;
            }
        }
        return map;
    }, [variations]);

    // ── Fit Options: show all standard fits (Regular, Tall, Petite) or custom fits ──
    const fitOptions = useMemo(() => {
        const standardFits = ["Regular", "Tall", "Petite"];
        const customFits = getAttrOptions(product.attributes, 'fit').map(f => decodeHtml(f));
        if (customFits.length > 0) {
            const merged = new Set([...standardFits, ...customFits]);
            return [...merged];
        }
        return standardFits;
    }, [product.attributes]);

    // ── All Sizes defined on the product or variations in canonical order ───────
    const allSizes = useMemo(() => {
        const SIZE_ORDER = ["XS", "S", "M", "L", "XL", "XXL", "2X", "3X", "One Size"];
        const sizesSet = new Set();

        // 1. From WooCommerce size attribute
        const wooSizes = getAttrOptions(product.attributes, 'size').map(s => decodeHtml(s));
        wooSizes.forEach(s => sizesSet.add(s));

        // 2. From all variation records
        variations.forEach(v => {
            const s = v.attributes.find(a => a.name.toLowerCase().includes('size'))?.option;
            if (s) sizesSet.add(decodeHtml(s));
        });

        // 3. Fallback standard sizes if none found
        if (sizesSet.size === 0) {
            ["S", "M", "L", "XL"].forEach(s => sizesSet.add(s));
        }

        return [...sizesSet].sort((a, b) => {
            const ai = SIZE_ORDER.findIndex(s => s.toLowerCase() === a.toLowerCase());
            const bi = SIZE_ORDER.findIndex(s => s.toLowerCase() === b.toLowerCase());
            return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
        });
    }, [product.attributes, variations]);

    // Selection States — selectedFit initialises to first available fit for initial color
    const [selectedColor, setSelectedColor] = useState(colorOptions[0] || null);
    const [selectedFit, setSelectedFit] = useState(() => {
        if (variations.length === 0) return "Regular";
        const firstFit = variations.find(v =>
            v.attributes.find(a => a.name.toLowerCase().includes('fit'))
        )?.attributes.find(a => a.name.toLowerCase().includes('fit'))?.option;
        return decodeHtml(firstFit) || "Regular";
    });
    const [selectedSize, setSelectedSize] = useState(null);
    const [sizeError, setSizeError] = useState(false);
    const [quantity, setQuantity] = useState(1);

    // Gallery & Lightbox states
    const [isZoomOpen, setIsZoomOpen] = useState(false);
    const [zoomImageSrc, setZoomImageSrc] = useState(null);

    // Size Guide Modal States
    const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
    const [modalDesignId, setModalDesignId] = useState(matchedDesign.id);
    const [activeModalTab, setActiveModalTab] = useState("charts"); // 'charts' | 'tips'
    const [unit, setUnit] = useState("IN"); // 'IN' | 'CM'

    // Cart feedback states
    const [addedStatus, setAddedStatus] = useState(false);
    const [showCartDrawer, setShowCartDrawer] = useState(false);

    const { addToCart } = useCart();
    const images = product.images && product.images.length > 0 ? product.images : ["/images/spotlight.jpg"];

    const touchStartX = useRef(null);

    const handleNextImage = useCallback(() => {
        setActiveImage((prev) => (prev + 1) % images.length);
    }, [images.length]);

    const handlePrevImage = useCallback(() => {
        setActiveImage((prev) => (prev - 1 + images.length) % images.length);
    }, [images.length]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "ArrowRight") handleNextImage();
            if (e.key === "ArrowLeft") handlePrevImage();
            if (e.key === "Escape") {
                setIsZoomOpen(false);
                setIsSizeGuideOpen(false);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleNextImage, handlePrevImage]);

    const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
    const handleTouchEnd = (e) => {
        if (!touchStartX.current) return;
        const diffX = touchStartX.current - e.changedTouches[0].clientX;
        if (diffX > 40) handleNextImage();
        if (diffX < -40) handlePrevImage();
        touchStartX.current = null;
    };

    // ── Check if a color has any in-stock variation ───────────────────────────
    const isColorAvailable = useCallback((color) => {
        if (variations.length === 0) return product.stock_status !== 'outofstock';
        const c = decodeHtml(color).toLowerCase();
        return variations.some(v => {
            const vColor = decodeHtml(v.attributes.find(a =>
                a.name.toLowerCase().includes('color') || a.name.toLowerCase().includes('fabric') || a.name.toLowerCase().includes('material')
            )?.option || '').toLowerCase();
            return (!vColor || vColor === c) && v.stock_status === 'instock';
        });
    }, [variations, product.stock_status]);

    // ── Check if a fit has at least 1 in-stock variation for the selected color ──
    const isFitAvailable = useCallback((fit) => {
        if (variations.length === 0) return fit === "Regular"; // simple product
        const selColor = decodeHtml(selectedColor || '').toLowerCase();
        const f = decodeHtml(fit).toLowerCase();

        return variations.some(v => {
            const vColor = decodeHtml(v.attributes.find(a => 
                a.name.toLowerCase().includes('color') || a.name.toLowerCase().includes('fabric') || a.name.toLowerCase().includes('material')
            )?.option || '').toLowerCase();
            const vFit = decodeHtml(v.attributes.find(a => 
                a.name.toLowerCase().includes('fit')
            )?.option || '').toLowerCase();

            const colorMatches = !selColor || !vColor || vColor === selColor;
            const fitMatches = !vFit || vFit === f;
            const inStock = v.stock_status === 'instock';

            return colorMatches && fitMatches && inStock;
        });
    }, [variations, selectedColor]);

    // ── Check if a given size is in stock for the current color + fit selection ──
    const isSizeInStock = useCallback((size) => {
        if (variations.length === 0) {
            // Simple product fallback: check WooCommerce size attribute list
            const wooSizes = getAttrOptions(product.attributes, 'size').map(s => decodeHtml(s).toLowerCase());
            if (wooSizes.length > 0) {
                return wooSizes.includes(decodeHtml(size).toLowerCase()) && product.stock_status !== 'outofstock';
            }
            return product.stock_status !== 'outofstock';
        }

        const color = decodeHtml(selectedColor || '').toLowerCase();
        const fit   = decodeHtml(selectedFit || '').toLowerCase();
        const sz    = decodeHtml(size).toLowerCase();

        return variations.some(v => {
            const vColor = decodeHtml(v.attributes.find(a =>
                a.name.toLowerCase().includes('color') || a.name.toLowerCase().includes('fabric') || a.name.toLowerCase().includes('material')
            )?.option || '').toLowerCase();
            const vFit = decodeHtml(v.attributes.find(a =>
                a.name.toLowerCase().includes('fit')
            )?.option || '').toLowerCase();
            const vSize = decodeHtml(v.attributes.find(a =>
                a.name.toLowerCase().includes('size')
            )?.option || '').toLowerCase();

            const colorMatches = !vColor || !color || vColor === color;
            const fitMatches = !vFit || !fit || vFit === fit;
            const sizeMatches = vSize === sz;
            const inStock = v.stock_status === 'instock';

            return colorMatches && fitMatches && sizeMatches && inStock;
        });
    }, [variations, selectedColor, selectedFit, product.attributes, product.stock_status]);

    // Active variation price calculation — matches on color + fit + size
    const activeVariation = useMemo(() => {
        if (variations.length === 0 || !selectedSize) return null;
        const color = decodeHtml(selectedColor || '').toLowerCase();
        const fit   = decodeHtml(selectedFit || '').toLowerCase();
        const sz    = decodeHtml(selectedSize).toLowerCase();

        return variations.find(v => {
            const vColor = decodeHtml(v.attributes.find(a =>
                a.name.toLowerCase().includes('color') || a.name.toLowerCase().includes('fabric')
            )?.option || '').toLowerCase();
            const vFit = decodeHtml(v.attributes.find(a =>
                a.name.toLowerCase().includes('fit')
            )?.option || '').toLowerCase();
            const vSize = decodeHtml(v.attributes.find(a =>
                a.name.toLowerCase().includes('size')
            )?.option || '').toLowerCase();

            const colorOk = !vColor || vColor === color;
            const fitOk   = !vFit   || vFit   === fit;
            return colorOk && fitOk && vSize === sz;
        });
    }, [variations, selectedSize, selectedColor, selectedFit]);

    const displayPrice = activeVariation?.price ?? product.price;
    const displayRegularPrice = activeVariation?.regular_price ?? product.regular_price;
    const isOnSale = displayRegularPrice && Number(displayRegularPrice) > Number(displayPrice);
    const savingsAmount = isOnSale ? (Number(displayRegularPrice) - Number(displayPrice)).toFixed(2) : null;


    // Changing fit resets size
    const handleFitSelect = (fit) => {
        setSelectedFit(fit);
        setSelectedSize(null);
    };

    // Changing color resets size, and auto-switches to an available fit if current fit is unavailable
    const handleColorSelect = (color) => {
        const decodedColor = decodeHtml(color);
        setSelectedColor(decodedColor);
        setSelectedSize(null);

        // Check if selected fit is available for this new color
        const cLower = decodedColor.toLowerCase();
        const fLower = decodeHtml(selectedFit).toLowerCase();
        const currentFitStillValid = variations.length === 0 || variations.some(v => {
            const vColor = decodeHtml(v.attributes.find(a => a.name.toLowerCase().includes('color') || a.name.toLowerCase().includes('fabric'))?.option || '').toLowerCase();
            const vFit = decodeHtml(v.attributes.find(a => a.name.toLowerCase().includes('fit'))?.option || '').toLowerCase();
            return (!vColor || vColor === cLower) && (!vFit || vFit === fLower) && v.stock_status === 'instock';
        });

        if (!currentFitStillValid) {
            // Pick first fit that has stock for this color
            const firstValidFit = fitOptions.find(fit => {
                const fitLower = decodeHtml(fit).toLowerCase();
                return variations.some(v => {
                    const vColor = decodeHtml(v.attributes.find(a => a.name.toLowerCase().includes('color') || a.name.toLowerCase().includes('fabric'))?.option || '').toLowerCase();
                    const vFit = decodeHtml(v.attributes.find(a => a.name.toLowerCase().includes('fit'))?.option || '').toLowerCase();
                    return (!vColor || vColor === cLower) && (!vFit || vFit === fitLower) && v.stock_status === 'instock';
                });
            });
            if (firstValidFit) setSelectedFit(firstValidFit);
        }
    };

    const handleSizeSelect = (size) => {
        if (!isSizeInStock(size)) return;
        setSelectedSize(size);
        setSizeError(false);
    };



    const handleAddToCart = () => {
        if (!selectedSize) {
            setSizeError(true);
            return;
        }
        if (!selectedColor) {
            setSizeError(true);
            return;
        }

        const sizeFormatted = `${selectedSize} (${selectedFit})`;
        addToCart(
            { ...product, price: displayPrice },
            sizeFormatted,
            quantity,
            selectedColor,
            selectedFit
        );

        setAddedStatus(true);
        setShowCartDrawer(true);
        setSizeError(false);

        setTimeout(() => { setAddedStatus(false); }, 3000);
    };

    // Accordion state & toggle
    const [openSection, setOpenSection] = useState('story');
    const toggleSection = (section) => {
        setOpenSection(openSection === section ? null : section);
    };

    // WordPress ACF custom fields
    const meta = product.meta_data || [];
    const fabricRaw  = getMeta(meta, 'rh_fabric') || product.acf?.rh_fabric || product.rh_fabric;
    const careRaw    = getMeta(meta, 'rh_care') || product.acf?.rh_care || product.rh_care;
    const stylingRaw = getMeta(meta, 'rh_styling') || product.acf?.rh_styling || product.rh_styling;
    const originRaw  = getMeta(meta, 'rh_origin') || product.acf?.rh_origin || product.rh_origin;
    const ntagId     = getMeta(meta, 'rh_ntag_id') || product.acf?.rh_ntag_id || product.rh_ntag_id;

    let fabricData = null;
    try { fabricData = fabricRaw ? JSON.parse(fabricRaw) : null; } catch { fabricData = null; }

    const careItems = careRaw ? careRaw.split('\n').filter(Boolean) : null;

    // Active modal design & measurement table
    const modalDesign = ROYAL_HAVEN_DESIGNS.find(d => d.id === modalDesignId) || matchedDesign;
    const modalChart = modalDesign.measurements[unit];

    return (
        <main className={styles.container}>
            {/* Breadcrumb */}
            <div className={styles.breadcrumb}>
                <Link href="/shop" className={styles.backLink}>
                    <ChevronLeft size={16} /> Back to Shop
                </Link>
            </div>

            <div className={styles.grid}>
                {/* ── Left Column: Gallery ──────────────────────────────────── */}
                <div className={styles.gallery}>
                    <div 
                        className={styles.mainImageWrapper}
                        onTouchStart={handleTouchStart}
                        onTouchEnd={handleTouchEnd}
                    >
                        <Image
                            src={images[activeImage]}
                            alt={product.name}
                            fill
                            sizes="(max-width: 899px) 100vw, 55vw"
                            className={styles.mainImage}
                            priority
                            onClick={() => {
                                setZoomImageSrc(images[activeImage]);
                                setIsZoomOpen(true);
                            }}
                        />
                        {images.length > 1 && (
                            <>
                                <button className={`${styles.navArrow} ${styles.navPrev}`} onClick={handlePrevImage} aria-label="Previous photo">
                                    <ChevronLeft size={22} />
                                </button>
                                <button className={`${styles.navArrow} ${styles.navNext}`} onClick={handleNextImage} aria-label="Next photo">
                                    <ChevronRight size={22} />
                                </button>
                                <span className={styles.imageCounter}>{activeImage + 1} / {images.length}</span>
                            </>
                        )}
                        <button 
                            className={styles.zoomBadge} 
                            onClick={() => {
                                setZoomImageSrc(images[activeImage]);
                                setIsZoomOpen(true);
                            }}
                        >
                            <Maximize2 size={13} /> Zoom
                        </button>

                    </div>

                    {images.length > 1 && (
                        <div className={styles.thumbnails}>
                            {images.map((img, index) => (
                                <button
                                    key={index}
                                    className={`${styles.thumbBtn} ${activeImage === index ? styles.activeThumb : ''}`}
                                    onClick={() => setActiveImage(index)}
                                >
                                    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                                        <Image src={img} alt={`Thumbnail ${index + 1}`} fill sizes="80px" className={styles.thumbImg} />
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* ── Right Column: Configuration & Details ──────────────────── */}
                <div className={styles.details}>
                    <h1 className={styles.title}>{product.name}</h1>
                    
                    {/* Price with Sale Strikethrough & Savings Badge */}
                    {isOnSale ? (
                        <div className={styles.priceRow}>
                            <span className={styles.salePrice}>${displayPrice ? displayPrice.toFixed(2) : '0.00'} CAD</span>
                            <span className={styles.regularPriceStrikethrough}>${displayRegularPrice ? Number(displayRegularPrice).toFixed(2) : '0.00'} CAD</span>
                            <span className={styles.saleBadge}>Save ${savingsAmount} CAD</span>
                        </div>
                    ) : (
                        <p className={styles.price}>${displayPrice ? displayPrice.toFixed(2) : '0.00'} CAD</p>
                    )}

                    {product.short_description && (
                        <div style={{ width: '100%', overflowX: 'hidden' }}>
                            <div className={styles.shortDescription} dangerouslySetInnerHTML={{ __html: product.short_description }} />
                        </div>
                    )}

                    <div className={styles.divider}></div>

                    {/* ── 1. COLOR / FABRIC SELECTION (ALWAYS VISIBLE) ───────────── */}
                    <div className={styles.optionGroup}>
                        <label className={styles.label}>
                            Color / Fabric: {selectedColor && <span style={{ fontWeight: 600, color: "var(--obsidian, #0B0B0B)", textTransform: "none", letterSpacing: 0 }}>{selectedColor}</span>}
                        </label>
                        <div className={styles.colorSwatchRow}>
                            {colorOptions.map((color) => {
                                const isSelected = selectedColor === color;
                                const isAvailable = isColorAvailable(color);
                                const swatchImg = colorImageMap[color.toLowerCase()];
                                return (
                                    <button
                                        key={color}
                                        className={`${styles.colorSwatch} ${isSelected ? styles.selectedColorSwatch : ''} ${!isAvailable ? styles.outOfStockSwatch : ''}`}
                                        onClick={() => handleColorSelect(color)}
                                        title={color}
                                        aria-label={`${color}${!isAvailable ? ' (Out of Stock)' : ''}`}
                                    >
                                        <span 
                                            className={styles.swatchInner} 
                                            style={swatchImg ? {
                                                backgroundImage: `url(${swatchImg})`,
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center',
                                            } : {
                                                background: getSwatchColor(color),
                                            }} 
                                        />
                                        {!isAvailable && <span className={styles.swatchStrikethrough} />}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Fabric Inspection Card for Touch / Mobile and Desktop */}
                        {selectedColor && (
                            <div 
                                className={styles.fabricInspectionCard}
                                onClick={() => {
                                    const swatchImg = colorImageMap[selectedColor.toLowerCase()];
                                    if (swatchImg) {
                                        setZoomImageSrc(swatchImg);
                                        setIsZoomOpen(true);
                                    }
                                }}
                                title={colorImageMap[selectedColor.toLowerCase()] ? "Tap to inspect fabric texture up-close" : selectedColor}
                            >
                                {colorImageMap[selectedColor.toLowerCase()] ? (
                                    <img 
                                        src={colorImageMap[selectedColor.toLowerCase()]} 
                                        alt={selectedColor} 
                                        className={styles.fabricInspectionThumb} 
                                    />
                                ) : (
                                    <span 
                                        className={styles.fabricInspectionThumb} 
                                        style={{ background: getSwatchColor(selectedColor) }} 
                                    />
                                )}
                                <div className={styles.fabricInspectionInfo}>
                                    <span className={styles.fabricInspectionTitle}>{selectedColor}</span>
                                    {colorImageMap[selectedColor.toLowerCase()] && (
                                        <span className={styles.fabricInspectionAction}>
                                            🔍 Tap to inspect fabric texture
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>


                    {/* ── 2. FIT SELECTION (REGULAR, TALL, PETITE) ──────────────── */}
                    <div className={styles.optionGroup}>
                        <label className={styles.label}>Fit</label>
                        <div className={styles.fitRow}>
                            {fitOptions.map((fit) => {
                                const isAvailable = isFitAvailable(fit);
                                const isSelected = selectedFit === fit;
                                return (
                                    <button
                                        key={fit}
                                        className={`${styles.fitPill} ${isSelected ? styles.selectedFitPill : ''} ${!isAvailable ? styles.disabledFitPill : ''}`}
                                        onClick={() => isAvailable && handleFitSelect(fit)}
                                        disabled={!isAvailable}
                                        aria-label={`Fit: ${fit}${!isAvailable ? ' (Unavailable for selected color)' : ''}`}
                                    >
                                        {fit}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* ── 3. SIZE SELECTION & SIZE GUIDE LINKS ───────────────────── */}
                    <div className={styles.optionGroup}>
                        <div className={styles.sizeHeaderContainer}>
                            <label className={styles.label} style={{ marginBottom: 0 }}>Size</label>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
                                <button 
                                    className={styles.sizeGuideLink}
                                    onClick={() => {
                                        setModalDesignId(matchedDesign.id);
                                        setIsSizeGuideOpen(true);
                                    }}
                                    title="Quick size chart from official PDF"
                                >
                                    <Ruler size={14} /> Quick Guide
                                </button>
                                <Link
                                    href="/size-guide"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.sizeGuideLink}
                                    style={{ color: "var(--gold, #D4AF37)", textDecoration: "underline" }}
                                    title="Open full size guide page in new tab"
                                >
                                    Full Size Guide ↗
                                </Link>
                            </div>
                        </div>

                        <div className={styles.sizes}>
                            {allSizes.map((size) => {
                                const inStock = isSizeInStock(size);
                                const isSelected = selectedSize === size;
                                return (
                                    <button
                                        key={size}
                                        className={`${styles.sizeCircle} ${isSelected ? styles.selectedSizeCircle : ''} ${!inStock ? styles.outOfStockSize : ''}`}
                                        onClick={() => inStock && handleSizeSelect(size)}
                                        disabled={!inStock}
                                        aria-label={`${size}${!inStock ? ' (Unavailable for selected color/fit)' : ''}`}
                                    >
                                        {size}
                                        {!inStock && <span className={styles.sizeStrikethrough} />}
                                    </button>
                                );
                            })}
                        </div>

                        {sizeError && (
                            <div className={styles.sizeErrorNotice}>
                                <XCircle size={15} /> Select a color/fabric and size before adding to bag
                            </div>
                        )}
                    </div>


                    {/* ── 4. Quantity Selector ──────────────────────────────────── */}
                    <div className={styles.optionGroup}>
                        <label className={styles.label}>Quantity</label>
                        <div className={styles.quantityControl}>
                            <button className={styles.qtyBtn} onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus size={16} /></button>
                            <span className={styles.qtyValue}>{quantity}</span>
                            <button className={styles.qtyBtn} onClick={() => setQuantity(quantity + 1)}><Plus size={16} /></button>
                        </div>
                    </div>

                    {/* ── 5. Add to Cart CTA ───────────────────────────────────── */}
                    <button
                        className={`${styles.addToCart} ${addedStatus ? styles.addToCartSuccess : ''}`}
                        disabled={product.stock_status === 'outofstock'}
                        onClick={handleAddToCart}
                    >
                        {addedStatus ? (
                            <><CheckCircle2 size={20} color="#FAF9F6" /> Added to Shopping Bag!</>
                        ) : (
                            <><ShoppingBag size={20} />
                            {product.stock_status === 'outofstock'
                                ? 'Out of Stock'
                                : `Add to Cart - $${((displayPrice || 0) * quantity).toFixed(2)} CAD`}</>
                        )}
                    </button>

                    {/* Post-Add Action Drawer */}
                    {showCartDrawer && (
                        <div className={styles.cartActionDrawer}>
                            <div className={styles.drawerTitle}>
                                <CheckCircle2 size={18} /> Item added to your shopping bag
                            </div>
                            <div className={styles.drawerButtons}>
                                <Link href="/checkout" className={styles.checkoutDrawerBtn}>
                                    Proceed to Checkout <ArrowRight size={14} />
                                </Link>
                                <button className={styles.continueDrawerBtn} onClick={() => setShowCartDrawer(false)}>
                                    Continue Shopping
                                </button>
                            </div>
                        </div>
                    )}

                    {/* WooCommerce Description */}
                    {product.description && (
                        <div style={{ width: '100%', overflowX: 'hidden' }}>
                            <div className={styles.description} style={{ marginTop: '1.5rem' }} dangerouslySetInnerHTML={{ __html: product.description }} />
                        </div>
                    )}

                    {/* ── WordPress ACF Custom Fields Accordions ────────────────── */}
                    <div className={styles.accordionGroup}>
                        
                        {/* 1. Story Behind the Style */}
                        <div className={styles.accordion}>
                            <button className={styles.accordionHeader} onClick={() => toggleSection('story')}>
                                <span>Story Behind the Style</span>
                                <span>{openSection === 'story' ? '−' : '+'}</span>
                            </button>
                            {openSection === 'story' && (
                                <div className={styles.accordionContent}>
                                    {originRaw ? (
                                        <div dangerouslySetInnerHTML={{ __html: originRaw.replace(/\n/g, '<br/>') }} />
                                    ) : (
                                        <p>This piece is crafted with heritage in mind, weaving traditional motifs into modern silhouettes.</p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* 2. Fabric & Design */}
                        <div className={styles.accordion}>
                            <button className={styles.accordionHeader} onClick={() => toggleSection('fabric')}>
                                <span>Fabric &amp; Design</span>
                                <span>{openSection === 'fabric' ? '−' : '+'}</span>
                            </button>
                            {openSection === 'fabric' && (
                                <div className={styles.accordionContent}>
                                    {fabricData ? (
                                        <>
                                            {fabricData.material && <p><strong>Material:</strong> {fabricData.material}</p>}
                                            {fabricData.craftsmanship && <p><strong>Craftsmanship:</strong> {fabricData.craftsmanship}</p>}
                                            {fabricData.design && <p><strong>Design:</strong> {fabricData.design}</p>}
                                        </>
                                    ) : fabricRaw ? (
                                        <div dangerouslySetInnerHTML={{ __html: fabricRaw.replace(/\n/g, '<br/>') }} />
                                    ) : (
                                        <>
                                            <p><strong>Material:</strong> Premium Silk / Cotton Blend.</p>
                                            <p><strong>Craftsmanship:</strong> Handmade in Lagos by master artisans.</p>
                                            <p><strong>Design:</strong> Features intricate embroidery symbolizing prosperity and strength.</p>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* 3. Care Details */}
                        <div className={styles.accordion}>
                            <button className={styles.accordionHeader} onClick={() => toggleSection('care')}>
                                <span>Care Details</span>
                                <span>{openSection === 'care' ? '−' : '+'}</span>
                            </button>
                            {openSection === 'care' && (
                                <div className={styles.accordionContent}>
                                    {careItems ? (
                                        <ul style={{ paddingLeft: '1.2rem', margin: 0 }}>
                                            {careItems.map((item, i) => <li key={i}>{item}</li>)}
                                        </ul>
                                    ) : (
                                        <ul style={{ paddingLeft: '1.2rem', margin: 0 }}>
                                            <li>Dry clean recommended to preserve fabric sheen.</li>
                                            <li>Cool iron on reverse side.</li>
                                            <li>Do not bleach or tumble dry.</li>
                                            <li>Store in a cool, dry place away from direct sunlight.</li>
                                        </ul>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* 4. Styling Options */}
                        <div className={styles.accordion}>
                            <button className={styles.accordionHeader} onClick={() => toggleSection('styling')}>
                                <span>Styling Options</span>
                                <span>{openSection === 'styling' ? '−' : '+'}</span>
                            </button>
                            {openSection === 'styling' && (
                                <div className={styles.accordionContent}>
                                    {stylingRaw ? (
                                        <div dangerouslySetInnerHTML={{ __html: stylingRaw.replace(/\n/g, '<br/>') }} />
                                    ) : (
                                        <>
                                            <p><strong>Day Look:</strong> Pair with simple leather sandals and minimal jewelry.</p>
                                            <p><strong>Evening Glam:</strong> Elevate with statement gold accessories and heels.</p>
                                            <p><strong>Traditional:</strong> Complement with a matching Gele (headtie) for a complete regal look.</p>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* 5. Lookbook & VR Experience / Passport */}
                        <div className={styles.accordion}>
                            <button className={styles.accordionHeader} onClick={() => toggleSection('lookbook')}>
                                <span>Lookbook &amp; VR Experience</span>
                                <span>{openSection === 'lookbook' ? '−' : '+'}</span>
                            </button>
                            {openSection === 'lookbook' && (
                                <div className={styles.accordionContent}>
                                    {ntagId ? (
                                        <div style={{ marginTop: '0.5rem' }}>
                                            <p>This garment is linked to a digital provenance identity.</p>
                                            <Link 
                                                href={`/passport/${ntagId}`}
                                                style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '0.4rem',
                                                    color: 'var(--gold, #D4AF37)',
                                                    fontWeight: 600,
                                                    textDecoration: 'none',
                                                    marginTop: '0.5rem'
                                                }}
                                            >
                                                View Digital Product Passport →
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className={styles.placeholderVR}>
                                            <p style={{ margin: 0, fontWeight: 600, color: 'var(--obsidian, #0B0B0B)' }}>✨ Virtual Reality Experience Coming Soon.</p>
                                            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: '#6b7280' }}>Immerse yourself in the Royal Haven runway.</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>

            {/* ── YOU MAY ALSO LIKE — Related Products ─────────────────────── */}
            {relatedProducts.length > 0 && (
                <section className={styles.relatedSection}>
                    <h2 className={styles.relatedTitle}>You May Also Like</h2>
                    <div className={styles.relatedGrid}>
                        {relatedProducts.slice(0, 5).map((rp) => (
                            <Link key={rp.id} href={`/shop/${rp.slug}`} className={styles.relatedCard}>
                                <div className={styles.relatedImageWrap}>
                                    <Image
                                        src={rp.image}
                                        alt={rp.name}
                                        fill
                                        sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 220px"
                                        className={styles.relatedImage}
                                    />
                                    {rp.stock_status === 'outofstock' && (
                                        <span className={styles.relatedBadgeOOS}>Sold Out</span>
                                    )}
                                </div>
                                <div className={styles.relatedInfo}>
                                    <span className={styles.relatedName}>{rp.name}</span>
                                    <span className={styles.relatedPrice}>
                                        {rp.sale_price && rp.regular_price ? (
                                            <>
                                                <span style={{ textDecoration: 'line-through', color: '#9ca3af', marginRight: '0.4rem' }}>
                                                    ${rp.regular_price.toFixed(2)}
                                                </span>
                                                <span style={{ color: '#DC2626' }}>${rp.sale_price.toFixed(2)} CAD</span>
                                            </>
                                        ) : (
                                            `$${rp.price.toFixed(2)} CAD`
                                        )}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* ── LIGHTBOX ZOOM MODAL ────────────────────────────────────── */}
            {isZoomOpen && (
                <div className={styles.lightboxOverlay} onClick={() => setIsZoomOpen(false)}>
                    <button className={styles.lightboxClose} onClick={() => setIsZoomOpen(false)} aria-label="Close image zoom">
                        <X size={24} />
                    </button>
                    <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
                        <img src={zoomImageSrc || images[activeImage]} alt={product.name} className={styles.lightboxImage} />
                    </div>

                </div>
            )}

            {/* ── INTERACTIVE SIZE GUIDE MODAL (REFLECTS ACTUAL PDF) ───────── */}
            {isSizeGuideOpen && (
                <div className={styles.sizeGuideOverlay} onClick={() => setIsSizeGuideOpen(false)}>
                    <div className={styles.sizeGuideModal} onClick={(e) => e.stopPropagation()}>
                        
                        {/* Modal Header */}
                        <div className={styles.modalHeader}>
                            <div>
                                <h2 className={styles.modalTitle}>SIZE GUIDE</h2>
                                <span style={{ fontSize: "0.8rem", color: "var(--gold, #D4AF37)", fontWeight: 600 }}>
                                    Official Royal Haven PDF Specifications
                                </span>
                            </div>
                            <button className={styles.modalCloseBtn} onClick={() => setIsSizeGuideOpen(false)} aria-label="Close size guide">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Navigation Tabs */}
                        <div className={styles.modalNavTabs}>
                            <button 
                                className={`${styles.modalTabBtn} ${activeModalTab === 'charts' ? styles.modalTabActive : ''}`} 
                                onClick={() => setActiveModalTab('charts')}
                            >
                                size charts
                            </button>
                            <button 
                                className={`${styles.modalTabBtn} ${activeModalTab === 'tips' ? styles.modalTabActive : ''}`} 
                                onClick={() => setActiveModalTab('tips')}
                            >
                                measuring tips
                            </button>
                        </div>

                        <div className={styles.modalBody}>
                            {activeModalTab === 'charts' ? (
                                <>
                                    {/* Design Selector & Unit Switcher */}
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
                                        <select
                                            value={modalDesignId}
                                            onChange={(e) => setModalDesignId(e.target.value)}
                                            style={{
                                                padding: "0.45rem 0.85rem",
                                                borderRadius: "6px",
                                                border: "1.5px solid #d1d5db",
                                                fontFamily: "var(--font-body)",
                                                fontSize: "0.85rem",
                                                fontWeight: 600,
                                                color: "var(--obsidian, #0B0B0B)",
                                                background: "#f9fafb",
                                                maxWidth: "320px"
                                            }}
                                        >
                                            {ROYAL_HAVEN_DESIGNS.map(d => (
                                                <option key={d.id} value={d.id}>{d.name}</option>
                                            ))}
                                        </select>

                                        {/* Unit Toggle */}
                                        <div className={styles.unitToggleRow} style={{ marginBottom: 0 }}>
                                            <button className={`${styles.unitToggleBtn} ${unit === 'IN' ? styles.unitActive : ''}`} onClick={() => setUnit('IN')}>IN</button>
                                            <span style={{ color: '#d1d5db', fontWeight: 300 }}>|</span>
                                            <button className={`${styles.unitToggleBtn} ${unit === 'CM' ? styles.unitActive : ''}`} onClick={() => setUnit('CM')}>CM</button>
                                        </div>
                                    </div>

                                    {/* Primary Measurement Table */}
                                    <div className={styles.tableContainer} style={{ marginBottom: "1.25rem" }}>
                                        <table className={styles.sizeMatrixTable}>
                                            <thead>
                                                <tr>
                                                    <th>Body Part / Size ({unit.toLowerCase()})</th>
                                                    {modalChart.sizes.map((s, i) => <th key={i}>{s}</th>)}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {modalChart.rows.map((r, rIdx) => (
                                                    <tr key={rIdx}>
                                                        <td>{r.label}</td>
                                                        {r.values.map((v, vIdx) => <td key={vIdx}>{v}</td>)}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Length Breakdown by Fit */}
                                    {modalChart.lengths && (
                                        <div style={{ marginBottom: "1.5rem" }}>
                                            <span style={{ fontSize: "0.82rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#374151", display: "block", marginBottom: "0.5rem" }}>
                                                Length by Fit ({modalChart.lengths.label})
                                            </span>
                                            <div className={styles.tableContainer}>
                                                <table className={styles.sizeMatrixTable}>
                                                    <thead>
                                                        <tr>
                                                            <th>Fit Type</th>
                                                            {modalChart.lengths.values.map((l, i) => <th key={i}>{l.fit}</th>)}
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>{modalChart.lengths.label}</td>
                                                            {modalChart.lengths.values.map((l, i) => <td key={i}>{l.val}</td>)}
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}

                                    {/* PDF Links inside Modal */}
                                    <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", paddingTop: "0.75rem", borderTop: "1px solid #f3f4f6" }}>
                                        <a
                                            href="/docs/royal-haven-size-guide.pdf"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{
                                                display: "inline-flex",
                                                alignItems: "center",
                                                gap: "0.4rem",
                                                fontSize: "0.82rem",
                                                color: "var(--obsidian, #0B0B0B)",
                                                textDecoration: "underline",
                                                fontWeight: 600,
                                            }}
                                        >
                                            <ExternalLink size={13} /> Open PDF In New Window
                                        </a>
                                        <a
                                            href="/docs/royal-haven-size-guide.pdf"
                                            download="Royal-Haven-Size-Guide.pdf"
                                            style={{
                                                display: "inline-flex",
                                                alignItems: "center",
                                                gap: "0.4rem",
                                                fontSize: "0.82rem",
                                                color: "var(--gold, #D4AF37)",
                                                textDecoration: "underline",
                                                fontWeight: 600,
                                            }}
                                        >
                                            <Download size={13} /> Download PDF
                                        </a>
                                    </div>
                                </>
                            ) : (
                                <div className={styles.tipsContainer}>
                                    {[
                                        { t: "1. Bust / Chest", d: "Measure around the fullest part of your chest/bust, keeping the measuring tape horizontal under your arms and flat across your back." },
                                        { t: "2. Natural Waist", d: "Measure around your natural waistline (typically the narrowest part of your torso, usually 1 inch above your belly button), keeping the tape comfortably loose." },
                                        { t: "3. Hips", d: "Stand with your heels together and measure around the fullest part of your hips, keeping the tape level." },
                                        { t: "4. Fit Lengths", d: "Petit is proportioned with shorter hem/inseam lengths; Regular is standard length; Tall features extended torso, inseam, and hem lengths." }
                                    ].map(({ t, d }, i) => (
                                        <div key={i} className={styles.tipCard}>
                                            <div className={styles.tipTitle}>{t}</div>
                                            <p className={styles.tipDesc}>{d}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}

// ── Helper: Convert color / fabric name to CSS color or pattern for swatch display ──
function getSwatchColor(name) {
    if (!name) return '#0B0B0B';
    const n = decodeHtml(name).toLowerCase().trim();
    
    // Explicit Fabric and Color Mapping
    const colorMap = {
        // Royal Haven Signature African Fabrics & Collections
        'olive & gold abstract adire': 'linear-gradient(135deg, #6b7a2c 0%, #D4AF37 100%)',
        'carnival fiesta patchwork ankara': 'conic-gradient(from 45deg, #7c3aed, #ec4899, #f97316, #eab308, #7c3aed)',
        'autumn earth branch ankara': 'linear-gradient(135deg, #8B4513 0%, #d2b48c 50%, #C5A059 100%)',
        'chocolate blossom': 'linear-gradient(135deg, #3E2723 0%, #D7CCC8 50%, #8D6E63 100%)',
        'tangerine mod circles': 'radial-gradient(circle, #f97316 40%, #ffffff 45%, #f97316 55%, #1e3a5f 70%)',
        'regal mosaic artistry': 'conic-gradient(#D4AF37, #1e3a5f, #7c3aed, #800020, #D4AF37)',
        'tropical noir leaves': 'linear-gradient(135deg, #0B0B0B 0%, #16a34a 50%, #0B0B0B 100%)',
        'heritage crimson': '#800020',
        'adire': 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 50%, #ffffff 100%)',
        'ankara': 'conic-gradient(from 0deg, #f97316, #eab308, #16a34a, #dc2626, #f97316)',
        'aso oke': 'linear-gradient(90deg, #D4AF37 0%, #800020 30%, #1e3a5f 70%, #D4AF37 100%)',
        'kente': 'linear-gradient(45deg, #eab308 25%, #16a34a 25%, #16a34a 50%, #dc2626 50%, #dc2626 75%, #0B0B0B 75%)',
        'batik': 'radial-gradient(ellipse at center, #1e3a5f 0%, #6b7280 60%, #0B0B0B 100%)',

        // Solids and Tones
        'black': '#0B0B0B', 'obsidian black': '#0B0B0B', 'white': '#ffffff', 'red': '#DC2626',
        'burgundy': '#800020', 'navy': '#1e3a5f', 'blue': '#2563eb', 'green': '#16a34a',
        'olive': '#6b7a2c', 'brown': '#8B4513', 'tan': '#d2b48c', 'beige': '#f5f5dc',
        'cream': '#fffdd0', 'grey': '#6b7280', 'gray': '#6b7280', 'charcoal': '#333333',
        'pink': '#ec4899', 'purple': '#7c3aed', 'gold': '#D4AF37', 'gold ochre': '#C5A059',
        'yellow': '#eab308', 'orange': '#f97316', 'ivory': '#fffff0', 'denim': '#3b5998',
        'raw indigo': '#1C2833', 'fringe denim': '#4A6572', 'medium wash': '#5b7eab',
        'dark wash': '#2c4f7c', 'light wash': '#a8c4e0', 'signature fabric': '#2E4053',
        'woven denim': '#34495E', 'plaid': 'repeating-conic-gradient(#8B4513 0% 25%, #d2b48c 0% 50%) 50% / 12px 12px',
        'leopard': '#c4a35a', 'floral': '#ec4899', 'stripe': 'repeating-linear-gradient(90deg, #0B0B0B 0px, #0B0B0B 3px, #fff 3px, #fff 6px)',
    };

    if (colorMap[n]) return colorMap[n];

    // Substring matcher for compound names (e.g., "Tangerine Silk", "Dark Indigo Denim", "Olive Ankara")
    for (const [key, value] of Object.entries(colorMap)) {
        if (n.includes(key)) return value;
    }

    // Deterministic Fallback Hash
    return `hsl(${n.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % 360}, 50%, 40%)`;
}

