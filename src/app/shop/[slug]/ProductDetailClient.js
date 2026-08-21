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
    Nfc, 
    CheckCircle2, 
    ArrowRight, 
    Maximize2, 
    X 
} from "lucide-react";
import styles from "./page.module.css";
import { useCart } from "@/context/CartContext";

function getMeta(meta_data = [], key) {
    const entry = meta_data.find(m => m.key === key);
    return entry?.value || null;
}

export default function ProductDetailClient({ product }) {
    const [activeImage, setActiveImage] = useState(0);
    const [selectedSize, setSelectedSize] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [openSection, setOpenSection] = useState('story');
    
    // Gallery & Lightbox states
    const [isZoomOpen, setIsZoomOpen] = useState(false);

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

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "ArrowRight") handleNextImage();
            if (e.key === "ArrowLeft") handlePrevImage();
            if (e.key === "Escape") setIsZoomOpen(false);
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
        if (diffX > 40) handleNextImage(); // Swiped left
        if (diffX < -40) handlePrevImage(); // Swiped right
        touchStartX.current = null;
    };

    const toggleSection = (section) => {
        setOpenSection(openSection === section ? null : section);
    };

    // Extract available sizes
    const sizeAttribute = product.attributes?.find(attr =>
        attr.name.toLowerCase() === 'size' || attr.name.toLowerCase() === 'sizes'
    );
    const availableSizes = sizeAttribute?.options || ['S', 'M', 'L', 'XL'];

    const handleAddToCart = () => {
        const sizeToUse = selectedSize || availableSizes[0] || "Standard";
        if (!selectedSize) {
            setSelectedSize(sizeToUse);
        }
        addToCart(product, sizeToUse, quantity);

        // Explicit UI Feedback & Action Drawer
        setAddedStatus(true);
        setShowCartDrawer(true);

        setTimeout(() => {
            setAddedStatus(false);
        }, 3000);
    };

    const meta = product.meta_data || [];
    const fabricRaw  = getMeta(meta, 'rh_fabric');
    const careRaw    = getMeta(meta, 'rh_care');
    const stylingRaw = getMeta(meta, 'rh_styling');
    const originRaw  = getMeta(meta, 'rh_origin');
    const ntagId     = getMeta(meta, 'rh_ntag_id');

    let fabricData = null;
    try { fabricData = fabricRaw ? JSON.parse(fabricRaw) : null; } catch { fabricData = null; }

    const careItems = careRaw ? careRaw.split('\n').filter(Boolean) : null;

    return (
        <main className={styles.container}>
            {/* Breadcrumb / Back Link (With clear header clearance) */}
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

                        {/* Interactive Left / Right Chevron Overlay Buttons */}
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

                    {/* Thumbnails list */}
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

                {/* Right Column: Details */}
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

                    {/* Size Selector */}
                    <div className={styles.optionGroup}>
                        <label className={styles.label}>Size</label>
                        <div className={styles.sizes}>
                            {availableSizes.map((size) => (
                                <button
                                    key={size}
                                    className={`${styles.sizeBtn} ${selectedSize === size ? styles.selectedSize : ''}`}
                                    onClick={() => setSelectedSize(size)}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
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

                    {/* Clear Post-Add User Journey Action Drawer */}
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

                    {ntagId && (
                        <Link
                            href={`/passport/${ntagId}`}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '0.5rem',
                                marginTop: '1rem', fontSize: '0.85rem', color: 'var(--gold)',
                                fontFamily: 'var(--font-body)', textDecoration: 'none',
                                border: '1px solid rgba(212,175,55,0.3)', borderRadius: '8px',
                                padding: '0.6rem 1rem'
                            }}
                        >
                            <Nfc size={16} /> View Digital Passport for this garment
                        </Link>
                    )}

                    {/* Smart Accordion Details */}
                    <div className={styles.smartFeatures}>
                        <h3 className={styles.smartTitle}>Smart Clothing Experience</h3>
                        <p className={styles.smartSubtitle}>Scan the NFC tag on your garment to access these details anytime.</p>

                        <div className={styles.accordion}>
                            <button className={styles.accordionHeader} onClick={() => toggleSection('story')}>
                                <span>Story Behind the Style</span>
                                <span>{openSection === 'story' ? '-' : '+'}</span>
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

                        <div className={styles.accordion}>
                            <button className={styles.accordionHeader} onClick={() => toggleSection('fabric')}>
                                <span>Fabric &amp; Design</span>
                                <span>{openSection === 'fabric' ? '-' : '+'}</span>
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

                        <div className={styles.accordion}>
                            <button className={styles.accordionHeader} onClick={() => toggleSection('care')}>
                                <span>Care Details</span>
                                <span>{openSection === 'care' ? '-' : '+'}</span>
                            </button>
                            {openSection === 'care' && (
                                <div className={styles.accordionContent}>
                                    {careItems ? (
                                        <ul style={{ paddingLeft: '1.2rem' }}>
                                            {careItems.map((item, i) => <li key={i}>{item}</li>)}
                                        </ul>
                                    ) : (
                                        <ul style={{ paddingLeft: '1.2rem' }}>
                                            <li>Dry clean recommended to preserve fabric sheen.</li>
                                            <li>Cool iron on reverse side.</li>
                                            <li>Do not bleach or tumble dry.</li>
                                            <li>Store in a cool, dry place away from direct sunlight.</li>
                                        </ul>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className={styles.accordion}>
                            <button className={styles.accordionHeader} onClick={() => toggleSection('styling')}>
                                <span>Styling Options</span>
                                <span>{openSection === 'styling' ? '-' : '+'}</span>
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

                        <div className={styles.accordion}>
                            <button className={styles.accordionHeader} onClick={() => toggleSection('lookbook')}>
                                <span>Lookbook &amp; VR Experience</span>
                                <span>{openSection === 'lookbook' ? '-' : '+'}</span>
                            </button>
                            {openSection === 'lookbook' && (
                                <div className={styles.accordionContent}>
                                    <div className={styles.placeholderVR}>
                                        <p>✨ Virtual Reality Experience Coming Soon.</p>
                                        <p>Immerse yourself in the Royal Haven runway.</p>
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>

            {/* ── LIGHTBOX ZOOM MODAL ─────────────────────────────────────── */}
            {isZoomOpen && (
                <div className={styles.lightboxOverlay} onClick={() => setIsZoomOpen(false)}>
                    <button className={styles.lightboxClose} onClick={() => setIsZoomOpen(false)}>
                        <X size={24} />
                    </button>
                    <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
                        <img 
                            src={images[activeImage]} 
                            alt={product.name} 
                            className={styles.lightboxImage} 
                        />
                        {images.length > 1 && (
                            <>
                                <button 
                                    className={`${styles.navArrow} ${styles.navPrev}`}
                                    onClick={handlePrevImage}
                                >
                                    <ChevronLeft size={24} />
                                </button>
                                <button 
                                    className={`${styles.navArrow} ${styles.navNext}`}
                                    onClick={handleNextImage}
                                >
                                    <ChevronRight size={24} />
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </main>
    );
}
