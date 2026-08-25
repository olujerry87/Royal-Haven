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
    XCircle
} from "lucide-react";
import styles from "./page.module.css";
import { useCart } from "@/context/CartContext";

function getMeta(meta_data = [], key) {
    const entry = meta_data.find(m => m.key === key);
    return entry?.value || null;
}

// Fit-based Size Mappings (fallback when WooCommerce has no 'size' attribute)
const FIT_SIZES_MAP = {
    "Regular": ["XS", "S", "M", "L", "XL", "XXL", "2X"],
    "Tall": ["S", "M", "L", "XL", "XXL", "3X"],
    "Petite": ["XS", "S", "M", "L", "XL"]
};

// Size Matrix Measurement Data (IN & CM) for Quick Guide Modal
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

// Helper: extract unique attribute options from product attributes
function getAttrOptions(attributes, attrName) {
    const attr = attributes?.find(a => 
        a.name.toLowerCase() === attrName.toLowerCase() || 
        a.name.toLowerCase() === `pa_${attrName.toLowerCase()}`
    );
    return attr?.options || [];
}

export default function ProductDetailClient({ product, variations = [], relatedProducts = [] }) {
    const [activeImage, setActiveImage] = useState(0);
    
    // Advanced Configuration States
    const [selectedFit, setSelectedFit] = useState("Regular");
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    const [sizeError, setSizeError] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [openSection, setOpenSection] = useState('story');
    
    // Gallery & Lightbox states
    const [isZoomOpen, setIsZoomOpen] = useState(false);

    // Size Guide Modal States
    const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
    const [activeModalTab, setActiveModalTab] = useState("charts");
    const [unit, setUnit] = useState("IN");
    const [activeSubTab, setActiveSubTab] = useState("regular");

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

    const toggleSection = (section) => {
        setOpenSection(openSection === section ? null : section);
    };

    // ── Extract WooCommerce attributes for Color/Fabric and Size ──────────
    const colorOptions = getAttrOptions(product.attributes, 'color').length > 0
        ? getAttrOptions(product.attributes, 'color')
        : getAttrOptions(product.attributes, 'fabric');
    const colorAttrLabel = getAttrOptions(product.attributes, 'color').length > 0 ? "Color" : "Fabric";
    const hasColorOptions = colorOptions.length > 0;

    // Extract size options from WooCommerce attributes or use fit-based fallback
    const wooSizeOptions = getAttrOptions(product.attributes, 'size');
    const availableSizesForFit = wooSizeOptions.length > 0 
        ? wooSizeOptions 
        : (FIT_SIZES_MAP[selectedFit] || ["XS", "S", "M", "L", "XL"]);

    // ── Variation-based stock checking (for crossed-out sizes) ────────────
    const stockMap = useMemo(() => {
        // Build a map: "color|size" => stock_status
        // If no variations exist, everything is in stock (simple product)
        if (variations.length === 0) return null;

        const map = {};
        for (const v of variations) {
            const vColor = v.attributes.find(a => 
                a.name.toLowerCase() === 'color' || a.name.toLowerCase() === 'pa_color' ||
                a.name.toLowerCase() === 'fabric' || a.name.toLowerCase() === 'pa_fabric'
            )?.option || '';
            const vSize = v.attributes.find(a => 
                a.name.toLowerCase() === 'size' || a.name.toLowerCase() === 'pa_size'
            )?.option || '';

            const key = `${vColor.toLowerCase()}|${vSize.toLowerCase()}`;
            map[key] = v.stock_status;
        }
        return map;
    }, [variations]);

    // Check if a specific size is in stock for the currently selected color
    const isSizeInStock = useCallback((size) => {
        if (!stockMap) return product.stock_status !== 'outofstock'; // simple product
        if (!selectedColor && hasColorOptions) {
            // Check if ANY color has this size in stock
            return colorOptions.some(c => {
                const key = `${c.toLowerCase()}|${size.toLowerCase()}`;
                return stockMap[key] === 'instock';
            });
        }
        const color = selectedColor || '';
        const key = `${color.toLowerCase()}|${size.toLowerCase()}`;
        if (key in stockMap) return stockMap[key] === 'instock';
        // If this specific combination doesn't exist as a variation, treat as in-stock
        return true;
    }, [stockMap, selectedColor, hasColorOptions, colorOptions, product.stock_status]);

    // Check if a specific color is in stock for ANY size
    const isColorInStock = useCallback((color) => {
        if (!stockMap) return true;
        return availableSizesForFit.some(size => {
            const key = `${color.toLowerCase()}|${size.toLowerCase()}`;
            return stockMap[key] === 'instock';
        });
    }, [stockMap, availableSizesForFit]);

    // Get the active variation price (if applicable)
    const activeVariation = useMemo(() => {
        if (variations.length === 0 || !selectedSize) return null;
        const color = selectedColor || '';
        return variations.find(v => {
            const vColor = v.attributes.find(a => 
                a.name.toLowerCase() === 'color' || a.name.toLowerCase() === 'pa_color' ||
                a.name.toLowerCase() === 'fabric' || a.name.toLowerCase() === 'pa_fabric'
            )?.option || '';
            const vSize = v.attributes.find(a => 
                a.name.toLowerCase() === 'size' || a.name.toLowerCase() === 'pa_size'
            )?.option || '';
            return vColor.toLowerCase() === color.toLowerCase() && vSize.toLowerCase() === selectedSize.toLowerCase();
        });
    }, [variations, selectedSize, selectedColor]);

    const displayPrice = activeVariation?.price ?? product.price;

    const handleFitSelect = (fit) => {
        setSelectedFit(fit);
        if (selectedSize && !FIT_SIZES_MAP[fit]?.includes(selectedSize)) {
            setSelectedSize(null);
        }
    };

    const handleColorSelect = (color) => {
        setSelectedColor(color);
        // If currently selected size is out of stock for new color, deselect
        if (selectedSize && stockMap) {
            const key = `${color.toLowerCase()}|${selectedSize.toLowerCase()}`;
            if (stockMap[key] && stockMap[key] !== 'instock') {
                setSelectedSize(null);
            }
        }
    };

    const handleSizeSelect = (size) => {
        if (!isSizeInStock(size)) return; // can't select out-of-stock
        setSelectedSize(size);
        setSizeError(false);
    };

    const canAddToCart = () => {
        if (!selectedSize) return false;
        if (hasColorOptions && !selectedColor) return false;
        if (!isSizeInStock(selectedSize)) return false;
        return true;
    };

    const handleAddToCart = () => {
        if (!selectedSize) {
            setSizeError(true);
            return;
        }
        if (hasColorOptions && !selectedColor) {
            setSizeError(true);
            return;
        }

        const sizeFormatted = `${selectedSize} (${selectedFit})`;
        addToCart(
            { ...product, price: displayPrice },
            sizeFormatted,
            quantity,
            selectedColor || undefined,
            selectedFit || undefined
        );

        setAddedStatus(true);
        setShowCartDrawer(true);
        setSizeError(false);

        setTimeout(() => { setAddedStatus(false); }, 3000);
    };

    const currentMatrix = SIZE_MATRIX_DATA[unit];
    const meta = product.meta_data || [];
    const ntagId = getMeta(meta, 'rh_ntag_id');

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
                            onClick={() => setIsZoomOpen(true)}
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
                        <button className={styles.zoomBadge} onClick={() => setIsZoomOpen(true)}>
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
                    <p className={styles.price}>${displayPrice ? displayPrice.toFixed(2) : '0.00'} CAD</p>

                    {product.short_description && (
                        <div style={{ width: '100%', overflowX: 'hidden' }}>
                            <div className={styles.shortDescription} dangerouslySetInnerHTML={{ __html: product.short_description }} />
                        </div>
                    )}

                    <div className={styles.divider}></div>

                    {/* ── COLOR / FABRIC SELECTION ─────────────────────────────── */}
                    {hasColorOptions && (
                        <div className={styles.optionGroup}>
                            <label className={styles.label}>
                                {colorAttrLabel} {selectedColor && <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>{selectedColor}</span>}
                            </label>
                            <div className={styles.colorSwatchRow}>
                                {colorOptions.map((color) => {
                                    const inStock = isColorInStock(color);
                                    return (
                                        <button
                                            key={color}
                                            className={`${styles.colorSwatch} ${selectedColor === color ? styles.selectedColorSwatch : ''} ${!inStock ? styles.outOfStockSwatch : ''}`}
                                            onClick={() => inStock && handleColorSelect(color)}
                                            title={color}
                                            disabled={!inStock}
                                            aria-label={`${color}${!inStock ? ' (Out of Stock)' : ''}`}
                                        >
                                            <span className={styles.swatchInner} style={{ background: getSwatchColor(color) }} />
                                            {!inStock && <span className={styles.swatchStrikethrough} />}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* ── FIT SELECTION ─────────────────────────────────────────── */}
                    <div className={styles.optionGroup}>
                        <label className={styles.label}>Fit</label>
                        <div className={styles.fitRow}>
                            {["Regular", "Tall", "Petite"].map((fit) => (
                                <button
                                    key={fit}
                                    className={`${styles.fitPill} ${selectedFit === fit ? styles.selectedFitPill : ''}`}
                                    onClick={() => handleFitSelect(fit)}
                                >
                                    {fit}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* ── SIZE SELECTION ─────────────────────────────────────────── */}
                    <div className={styles.optionGroup}>
                        <div className={styles.sizeHeaderContainer}>
                            <label className={styles.label} style={{ marginBottom: 0 }}>Size</label>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
                                <button 
                                    className={styles.sizeGuideLink}
                                    onClick={() => setIsSizeGuideOpen(true)}
                                    title="Quick size chart"
                                >
                                    <Ruler size={14} /> Quick Guide
                                </button>
                                <Link
                                    href="/size-guide"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.sizeGuideLink}
                                    style={{ color: "var(--gold, #D4AF37)", textDecoration: "underline" }}
                                >
                                    Full Size Guide ↗
                                </Link>
                            </div>
                        </div>

                        <div className={styles.sizes}>
                            {availableSizesForFit.map((size) => {
                                const inStock = isSizeInStock(size);
                                return (
                                    <button
                                        key={size}
                                        className={`${styles.sizeCircle} ${selectedSize === size ? styles.selectedSizeCircle : ''} ${!inStock ? styles.outOfStockSize : ''}`}
                                        onClick={() => handleSizeSelect(size)}
                                        disabled={!inStock}
                                        aria-label={`${size}${!inStock ? ' (Out of Stock)' : ''}`}
                                    >
                                        {size}
                                        {!inStock && <span className={styles.sizeStrikethrough} />}
                                    </button>
                                );
                            })}
                        </div>

                        {sizeError && (
                            <div className={styles.sizeErrorNotice}>
                                <XCircle size={15} /> 
                                {hasColorOptions && !selectedColor 
                                    ? `Select a ${colorAttrLabel.toLowerCase()} and size before adding to bag`
                                    : 'Select a size before adding to bag'}
                            </div>
                        )}
                    </div>

                    {/* ── Quantity Selector ──────────────────────────────────────── */}
                    <div className={styles.optionGroup}>
                        <label className={styles.label}>Quantity</label>
                        <div className={styles.quantityControl}>
                            <button className={styles.qtyBtn} onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus size={16} /></button>
                            <span className={styles.qtyValue}>{quantity}</span>
                            <button className={styles.qtyBtn} onClick={() => setQuantity(quantity + 1)}><Plus size={16} /></button>
                        </div>
                    </div>

                    {/* ── Add to Cart CTA ───────────────────────────────────────── */}
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
                        <img src={images[activeImage]} alt={product.name} className={styles.lightboxImage} />
                    </div>
                </div>
            )}

            {/* ── INTERACTIVE SIZE GUIDE MODAL ─────────────────────────────── */}
            {isSizeGuideOpen && (
                <div className={styles.sizeGuideOverlay} onClick={() => setIsSizeGuideOpen(false)}>
                    <div className={styles.sizeGuideModal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2 className={styles.modalTitle}>SIZE GUIDE</h2>
                            <button className={styles.modalCloseBtn} onClick={() => setIsSizeGuideOpen(false)} aria-label="Close size guide">
                                <X size={20} />
                            </button>
                        </div>
                        <div className={styles.modalNavTabs}>
                            <button className={`${styles.modalTabBtn} ${activeModalTab === 'charts' ? styles.modalTabActive : ''}`} onClick={() => setActiveModalTab('charts')}>size charts</button>
                            <button className={`${styles.modalTabBtn} ${activeModalTab === 'tips' ? styles.modalTabActive : ''}`} onClick={() => setActiveModalTab('tips')}>measuring tips</button>
                        </div>
                        <div className={styles.modalBody}>
                            {activeModalTab === 'charts' ? (
                                <>
                                    <div className={styles.unitToggleRow}>
                                        <button className={`${styles.unitToggleBtn} ${unit === 'IN' ? styles.unitActive : ''}`} onClick={() => setUnit('IN')}>IN</button>
                                        <span style={{ color: '#d1d5db', fontWeight: 300 }}>|</span>
                                        <button className={`${styles.unitToggleBtn} ${unit === 'CM' ? styles.unitActive : ''}`} onClick={() => setUnit('CM')}>CM</button>
                                    </div>
                                    <div className={styles.subTabsRow}>
                                        {[{k:'regular',l:"women's regular"},{k:'petite',l:"women's petite"},{k:'tall',l:"women's tall"}].map(({k,l}) => (
                                            <button key={k} className={`${styles.subTabBtn} ${activeSubTab === k ? styles.subTabActive : ''}`} onClick={() => setActiveSubTab(k)}>{l}</button>
                                        ))}
                                    </div>
                                    <div className={styles.tableContainer}>
                                        <table className={styles.sizeMatrixTable}>
                                            <thead><tr><th>Size</th>{currentMatrix.sizes.map((s, i) => <th key={i}>{s}</th>)}</tr></thead>
                                            <tbody>
                                                <tr><td>Numeric</td>{currentMatrix.numeric.map((v, i) => <td key={i}>{v}</td>)}</tr>
                                                <tr><td>Chest</td>{currentMatrix.chest.map((v, i) => <td key={i}>{v}</td>)}</tr>
                                                <tr><td>Waist</td>{currentMatrix.waist.map((v, i) => <td key={i}>{v}</td>)}</tr>
                                                <tr><td>Hips</td>{currentMatrix.hips.map((v, i) => <td key={i}>{v}</td>)}</tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </>
                            ) : (
                                <div className={styles.tipsContainer}>
                                    {[
                                        { t: "1. Bust / Chest", d: "Measure around the fullest part of your chest/bust, keeping the measuring tape horizontal under your arms and flat across your back." },
                                        { t: "2. Natural Waist", d: "Measure around your natural waistline (typically the narrowest part of your torso), keeping the tape comfortably loose." },
                                        { t: "3. Hips", d: "Stand with your heels together and measure around the fullest part of your hips, keeping the tape level." },
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

// ── Helper: Convert color name to CSS color for swatch display ─────────────
function getSwatchColor(name) {
    const n = name.toLowerCase().trim();
    const colorMap = {
        'black': '#0B0B0B', 'white': '#ffffff', 'red': '#DC2626', 'burgundy': '#800020',
        'navy': '#1e3a5f', 'blue': '#2563eb', 'green': '#16a34a', 'olive': '#6b7a2c',
        'brown': '#8B4513', 'tan': '#d2b48c', 'beige': '#f5f5dc', 'cream': '#fffdd0',
        'grey': '#6b7280', 'gray': '#6b7280', 'charcoal': '#333333', 'pink': '#ec4899',
        'purple': '#7c3aed', 'gold': '#D4AF37', 'yellow': '#eab308', 'orange': '#f97316',
        'ivory': '#fffff0', 'denim': '#3b5998', 'medium wash': '#5b7eab', 'dark wash': '#2c4f7c',
        'light wash': '#a8c4e0', 'plaid': 'repeating-conic-gradient(#8B4513 0% 25%, #d2b48c 0% 50%) 50% / 12px 12px',
        'leopard': '#c4a35a', 'floral': '#ec4899', 'stripe': 'repeating-linear-gradient(90deg, #0B0B0B 0px, #0B0B0B 3px, #fff 3px, #fff 6px)',
    };
    return colorMap[n] || `hsl(${n.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % 360}, 60%, 50%)`;
}
