"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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
    AlertCircle,
    XCircle
} from "lucide-react";
import styles from "./page.module.css";
import { useCart } from "@/context/CartContext";

function getMeta(meta_data = [], key) {
    const entry = meta_data.find(m => m.key === key);
    return entry?.value || null;
}

// Fit-based Size Mappings
const FIT_SIZES_MAP = {
    "Regular": ["XS", "S", "M", "L", "XL", "XXL", "2X"],
    "Tall": ["S", "M", "L", "XL", "XXL", "3X"],
    "Petite": ["XS", "S", "M", "L", "XL"]
};

// Size Matrix Measurement Data (IN & CM)
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

export default function ProductDetailClient({ product }) {
    const [activeImage, setActiveImage] = useState(0);
    
    // Advanced Configuration States
    const [selectedFit, setSelectedFit] = useState("Regular");
    const [selectedSize, setSelectedSize] = useState(null);
    const [sizeError, setSizeError] = useState(false);
    const [quantity, setQuantity] = useState(1);
    
    // Gallery & Lightbox states
    const [isZoomOpen, setIsZoomOpen] = useState(false);

    // Size Guide Modal States
    const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
    const [activeModalTab, setActiveModalTab] = useState("charts"); // 'charts' | 'tips'
    const [unit, setUnit] = useState("IN"); // 'IN' | 'CM'
    const [activeSubTab, setActiveSubTab] = useState("regular"); // 'regular' | 'petite' | 'tall'

    // Cart feedback states
    const [addedStatus, setAddedStatus] = useState(false);
    const [showCartDrawer, setShowCartDrawer] = useState(false);

    const { addToCart } = useCart();
    const images = product.images && product.images.length > 0 ? product.images : ["/images/spotlight.jpg"];

    // Touch swipe handling for image gallery
    const touchStartX = useRef(null);

    const handleNextImage = useCallback(() => {
        setActiveImage((prev) => (prev + 1) % images.length);
    }, [images.length]);

    const handlePrevImage = useCallback(() => {
        setActiveImage((prev) => (prev - 1 + images.length) % images.length);
    }, [images.length]);

    // Keyboard navigation & modal escape listener
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

    const handleTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e) => {
        if (!touchStartX.current) return;
        const diffX = touchStartX.current - e.changedTouches[0].clientX;
        if (diffX > 40) handleNextImage();
        if (diffX < -40) handlePrevImage();
        touchStartX.current = null;
    };

    // Available sizes for current selected fit
    const availableSizesForFit = FIT_SIZES_MAP[selectedFit] || ["XS", "S", "M", "L", "XL"];

    const handleFitSelect = (fit) => {
        setSelectedFit(fit);
        // Reset or adjust size if current selected size isn't in new fit options
        if (selectedSize && !FIT_SIZES_MAP[fit].includes(selectedSize)) {
            setSelectedSize(null);
        }
    };

    const handleSizeSelect = (size) => {
        setSelectedSize(size);
        setSizeError(false); // Clear error on size selection
    };

    const handleAddToCart = () => {
        if (!selectedSize) {
            setSizeError(true);
            return;
        }

        const sizeFormatted = `${selectedSize} (${selectedFit})`;
        addToCart(product, sizeFormatted, quantity);

        setAddedStatus(true);
        setShowCartDrawer(true);
        setSizeError(false);

        setTimeout(() => {
            setAddedStatus(false);
        }, 3000);
    };

    const currentMatrix = SIZE_MATRIX_DATA[unit];

    return (
        <main className={styles.container}>
            {/* Breadcrumb / Back Link */}
            <div className={styles.breadcrumb}>
                <Link href="/shop" className={styles.backLink}>
                    <ChevronLeft size={16} /> Back to Shop
                </Link>
            </div>

            <div className={styles.grid}>
                {/* Left Column: Gallery */}
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
                                <button 
                                    className={`${styles.navArrow} ${styles.navPrev}`}
                                    onClick={handlePrevImage}
                                    aria-label="Previous photo"
                                >
                                    <ChevronLeft size={22} />
                                </button>
                                <button 
                                    className={`${styles.navArrow} ${styles.navNext}`}
                                    onClick={handleNextImage}
                                    aria-label="Next photo"
                                >
                                    <ChevronRight size={22} />
                                </button>
                                <span className={styles.imageCounter}>
                                    {activeImage + 1} / {images.length}
                                </span>
                            </>
                        )}

                        <button 
                            className={styles.zoomBadge}
                            onClick={() => setIsZoomOpen(true)}
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
                                        <Image
                                            src={img}
                                            alt={`Thumbnail ${index + 1}`}
                                            fill
                                            sizes="80px"
                                            className={styles.thumbImg}
                                        />
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Column: Advanced Configuration & Details */}
                <div className={styles.details}>
                    <h1 className={styles.title}>{product.name}</h1>
                    <p className={styles.price}>${product.price ? product.price.toFixed(2) : '0.00'} CAD</p>

                    {product.short_description && (
                        <div style={{ width: '100%', overflowX: 'hidden' }}>
                            <div
                                className={styles.shortDescription}
                                dangerouslySetInnerHTML={{ __html: product.short_description }}
                            />
                        </div>
                    )}

                    <div className={styles.divider}></div>

                    {/* 1. FIT SELECTION BUTTONS */}
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

                    {/* 2. ADVANCED SIZE SELECTION & SIZE GUIDE LINK */}
                    <div className={styles.optionGroup}>
                        <div className={styles.sizeHeaderContainer}>
                            <label className={styles.label} style={{ marginBottom: 0 }}>Size</label>
                            <button 
                                className={styles.sizeGuideLink}
                                onClick={() => setIsSizeGuideOpen(true)}
                            >
                                <Ruler size={14} /> Size Guide
                            </button>
                        </div>

                        <div className={styles.sizes}>
                            {availableSizesForFit.map((size) => (
                                <button
                                    key={size}
                                    className={`${styles.sizeCircle} ${selectedSize === size ? styles.selectedSizeCircle : ''}`}
                                    onClick={() => handleSizeSelect(size)}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>

                        {/* Size Selection Error Notice */}
                        {sizeError && (
                            <div className={styles.sizeErrorNotice}>
                                <XCircle size={15} /> Select a size before adding to bag
                            </div>
                        )}
                    </div>

                    {/* Quantity Selector */}
                    <div className={styles.optionGroup}>
                        <label className={styles.label}>Quantity</label>
                        <div className={styles.quantityControl}>
                            <button className={styles.qtyBtn} onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                                <Minus size={16} />
                            </button>
                            <span className={styles.qtyValue}>{quantity}</span>
                            <button className={styles.qtyBtn} onClick={() => setQuantity(quantity + 1)}>
                                <Plus size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Add to Cart CTA Button */}
                    <button
                        className={`${styles.addToCart} ${addedStatus ? styles.addToCartSuccess : ''}`}
                        disabled={product.stock_status === 'outofstock'}
                        onClick={handleAddToCart}
                    >
                        {addedStatus ? (
                            <>
                                <CheckCircle2 size={20} color="#FAF9F6" />
                                Added to Shopping Bag!
                            </>
                        ) : (
                            <>
                                <ShoppingBag size={20} />
                                {product.stock_status === 'outofstock'
                                    ? 'Out of Stock'
                                    : `Add to Cart - $${((product.price || 0) * quantity).toFixed(2)} CAD`}
                            </>
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
                                <button 
                                    className={styles.continueDrawerBtn}
                                    onClick={() => setShowCartDrawer(false)}
                                >
                                    Continue Shopping
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Main WooCommerce Description */}
                    {product.description && (
                        <div style={{ width: '100%', overflowX: 'hidden' }}>
                            <div
                                className={styles.description}
                                style={{ marginTop: '1.5rem' }}
                                dangerouslySetInnerHTML={{ __html: product.description }}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* ── LIGHTBOX ZOOM MODAL ────────────────────────────────────── */}
            {isZoomOpen && (
                <div className={styles.lightboxOverlay} onClick={() => setIsZoomOpen(false)}>
                    <button 
                        className={styles.lightboxClose}
                        onClick={() => setIsZoomOpen(false)}
                        aria-label="Close image zoom"
                    >
                        <X size={24} />
                    </button>
                    <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
                        <img 
                            src={images[activeImage]} 
                            alt={product.name} 
                            className={styles.lightboxImage} 
                        />
                    </div>
                </div>
            )}

            {/* ── 3. INTERACTIVE SIZE GUIDE MODAL (POP-UP) ────────────────── */}
            {isSizeGuideOpen && (
                <div className={styles.sizeGuideOverlay} onClick={() => setIsSizeGuideOpen(false)}>
                    <div className={styles.sizeGuideModal} onClick={(e) => e.stopPropagation()}>
                        
                        {/* Modal Header */}
                        <div className={styles.modalHeader}>
                            <h2 className={styles.modalTitle}>SIZE GUIDE</h2>
                            <button 
                                className={styles.modalCloseBtn}
                                onClick={() => setIsSizeGuideOpen(false)}
                                aria-label="Close size guide"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Navigation Tabs: Size Charts & Measuring Tips */}
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
                                    {/* Unit Switcher IN | CM */}
                                    <div className={styles.unitToggleRow}>
                                        <button 
                                            className={`${styles.unitToggleBtn} ${unit === 'IN' ? styles.unitActive : ''}`}
                                            onClick={() => setUnit('IN')}
                                        >
                                            IN
                                        </button>
                                        <span style={{ color: '#d1d5db', fontWeight: 300 }}>|</span>
                                        <button 
                                            className={`${styles.unitToggleBtn} ${unit === 'CM' ? styles.unitActive : ''}`}
                                            onClick={() => setUnit('CM')}
                                        >
                                            CM
                                        </button>
                                    </div>

                                    {/* Sub-Tabs: Women's Regular, Petite, Tall */}
                                    <div className={styles.subTabsRow}>
                                        <button 
                                            className={`${styles.subTabBtn} ${activeSubTab === 'regular' ? styles.subTabActive : ''}`}
                                            onClick={() => setActiveSubTab('regular')}
                                        >
                                            women&apos;s regular
                                        </button>
                                        <button 
                                            className={`${styles.subTabBtn} ${activeSubTab === 'petite' ? styles.subTabActive : ''}`}
                                            onClick={() => setActiveSubTab('petite')}
                                        >
                                            women&apos;s petite
                                        </button>
                                        <button 
                                            className={`${styles.subTabBtn} ${activeSubTab === 'tall' ? styles.subTabActive : ''}`}
                                            onClick={() => setActiveSubTab('tall')}
                                        >
                                            women&apos;s tall
                                        </button>
                                    </div>

                                    {/* Measurement Matrix Table */}
                                    <div className={styles.tableContainer}>
                                        <table className={styles.sizeMatrixTable}>
                                            <thead>
                                                <tr>
                                                    <th>Size</th>
                                                    {currentMatrix.sizes.map((s, idx) => (
                                                        <th key={idx}>{s}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>Numeric</td>
                                                    {currentMatrix.numeric.map((val, idx) => (
                                                        <td key={idx}>{val}</td>
                                                    ))}
                                                </tr>
                                                <tr>
                                                    <td>Chest</td>
                                                    {currentMatrix.chest.map((val, idx) => (
                                                        <td key={idx}>{val}</td>
                                                    ))}
                                                </tr>
                                                <tr>
                                                    <td>Waist</td>
                                                    {currentMatrix.waist.map((val, idx) => (
                                                        <td key={idx}>{val}</td>
                                                    ))}
                                                </tr>
                                                <tr>
                                                    <td>Hips</td>
                                                    {currentMatrix.hips.map((val, idx) => (
                                                        <td key={idx}>{val}</td>
                                                    ))}
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </>
                            ) : (
                                /* Measuring Tips Content */
                                <div className={styles.tipsContainer}>
                                    <div className={styles.tipCard}>
                                        <div className={styles.tipTitle}>
                                            1. Bust / Chest
                                        </div>
                                        <p className={styles.tipDesc}>
                                            Measure around the fullest part of your chest/bust, keeping the measuring tape horizontal under your arms and flat across your back.
                                        </p>
                                    </div>
                                    <div className={styles.tipCard}>
                                        <div className={styles.tipTitle}>
                                            2. Natural Waist
                                        </div>
                                        <p className={styles.tipDesc}>
                                            Measure around your natural waistline (typically the narrowest part of your torso), keeping the tape comfortably loose.
                                        </p>
                                    </div>
                                    <div className={styles.tipCard}>
                                        <div className={styles.tipTitle}>
                                            3. Hips
                                        </div>
                                        <p className={styles.tipDesc}>
                                            Stand with your heels together and measure around the fullest part of your hips, keeping the tape level.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
