"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Minus, Plus, ShoppingBag, Nfc } from "lucide-react";
import styles from "./page.module.css";
import { useCart } from "@/context/CartContext";

// Helper: extract a value from WooCommerce product meta_data array by key
function getMeta(meta_data = [], key) {
    const entry = meta_data.find(m => m.key === key);
    return entry?.value || null;
}

export default function ProductDetailClient({ product }) {
    const [activeImage, setActiveImage] = useState(0);
    const [selectedSize, setSelectedSize] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [openSection, setOpenSection] = useState('story');

    const { addToCart } = useCart();

    const toggleSection = (section) => {
        setOpenSection(openSection === section ? null : section);
    };

    const handleAddToCart = () => {
        if (!selectedSize) return;
        addToCart(product, selectedSize, quantity);
        alert(`Added ${quantity} x ${product.name} (${selectedSize}) to bag.`);
    };

    // Extract available sizes from product attributes
    const sizeAttribute = product.attributes?.find(attr =>
        attr.name.toLowerCase() === 'size' || attr.name.toLowerCase() === 'sizes'
    );
    const availableSizes = sizeAttribute?.options || ['S', 'M', 'L', 'XL'];

    // ── Extract garment detail fields from WooCommerce meta_data ──────────────
    // To populate these: in WooCommerce wp-admin → Edit Product → Custom Fields
    // Keys to add:
    //   rh_origin    → Story / origin text (plain text)
    //   rh_fabric    → Fabric & Design (plain text or JSON: {"material":"...","craftsmanship":"...","design":"..."})
    //   rh_care      → Care instructions, one per line (use Enter/newline)
    //   rh_styling   → Styling tips (plain text)
    //   rh_ntag_id   → The NTAG serial / Supabase garment ID (links to /passport/[id])
    const meta = product.meta_data || [];
    const fabricRaw  = getMeta(meta, 'rh_fabric');
    const careRaw    = getMeta(meta, 'rh_care');
    const stylingRaw = getMeta(meta, 'rh_styling');
    const originRaw  = getMeta(meta, 'rh_origin');
    const ntagId     = getMeta(meta, 'rh_ntag_id');

    // Fabric may be JSON (structured) or plain text
    let fabricData = null;
    try { fabricData = fabricRaw ? JSON.parse(fabricRaw) : null; } catch { fabricData = null; }

    // Care may be a newline-separated list or plain text
    const careItems = careRaw ? careRaw.split('\n').filter(Boolean) : null;

    return (
        <main className={styles.container}>
            {/* Breadcrumb / Back */}
            <div className={styles.breadcrumb}>
                <Link href="/shop" className={styles.backLink}>
                    <ChevronLeft size={16} /> Back to Shop
                </Link>
            </div>

            <div className={styles.grid}>
                {/* Left Column: Gallery */}
                <div className={styles.gallery}>
                    <div className={styles.mainImageWrapper}>
                        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                            <Image
                                src={product.images[activeImage]}
                                alt={product.name}
                                fill
                                sizes="(max-width: 768px) 100vw, 50vw"
                                style={{ objectFit: 'cover' }}
                                priority
                            />
                        </div>
                    </div>
                    <div className={styles.thumbnails}>
                        {product.images.map((img, index) => (
                            <button
                                key={index}
                                className={`${styles.thumbBtn} ${activeImage === index ? styles.activeThumb : ''}`}
                                onClick={() => setActiveImage(index)}
                            >
                                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                                    <Image
                                        src={img}
                                        alt={`View ${index + 1}`}
                                        fill
                                        sizes="100px"
                                        style={{ objectFit: 'cover' }}
                                    />
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right Column: Details */}
                <div className={styles.details}>
                    <h1 className={styles.title}>{product.name}</h1>
                    <p className={styles.price}>${product.price ? product.price.toFixed(2) : '0.00'}</p>

                    {/* Short Description */}
                    {product.short_description && (
                        <div
                            className={styles.shortDescription}
                            dangerouslySetInnerHTML={{ __html: product.short_description }}
                        />
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

                    {/* Quantity */}
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

                    <button
                        className={styles.addToCart}
                        disabled={!selectedSize || product.stock_status === 'outofstock'}
                        onClick={handleAddToCart}
                    >
                        <ShoppingBag size={20} />
                        {product.stock_status === 'outofstock'
                            ? 'Out of Stock'
                            : selectedSize
                                ? `Add to Cart - $${(product.price * quantity).toFixed(2)}`
                                : 'Select a Size'}
                    </button>

                    {/* NFC Passport Link — shows only if rh_ntag_id is set on the product */}
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

                    {/* Smart Clothing / NFC Features */}
                    <div className={styles.smartFeatures}>
                        <h3 className={styles.smartTitle}>Smart Clothing Experience</h3>
                        <p className={styles.smartSubtitle}>Scan the NFC tag on your garment to access these details anytime.</p>

                        {/* Story Behind the Style — from rh_origin meta or WooCommerce long description */}
                        <div className={styles.accordion}>
                            <button className={styles.accordionHeader} onClick={() => toggleSection('story')}>
                                <span>Story Behind the Style</span>
                                <span>{openSection === 'story' ? '-' : '+'}</span>
                            </button>
                            {openSection === 'story' && (
                                <div className={styles.accordionContent}>
                                    {originRaw ? (
                                        <p>{originRaw}</p>
                                    ) : product.description ? (
                                        <div dangerouslySetInnerHTML={{ __html: product.description }} />
                                    ) : (
                                        <p>This piece is crafted with heritage in mind, weaving traditional motifs into modern silhouettes.</p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Fabric & Design — from rh_fabric meta */}
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
                                        <p>{fabricRaw}</p>
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

                        {/* Care Details — from rh_care meta (one line per bullet) */}
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

                        {/* Styling Options — from rh_styling meta */}
                        <div className={styles.accordion}>
                            <button className={styles.accordionHeader} onClick={() => toggleSection('styling')}>
                                <span>Styling Options</span>
                                <span>{openSection === 'styling' ? '-' : '+'}</span>
                            </button>
                            {openSection === 'styling' && (
                                <div className={styles.accordionContent}>
                                    {stylingRaw ? (
                                        <p>{stylingRaw}</p>
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

                        {/* Lookbook / VR */}
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
        </main>
    );
}
