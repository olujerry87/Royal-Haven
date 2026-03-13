"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Minus, Plus, ShoppingBag } from "lucide-react";
import styles from "./page.module.css";
import { useCart } from "@/context/CartContext";

export default function ProductDetailClient({ product }) {
    const [activeImage, setActiveImage] = useState(0);
    const [selectedSize, setSelectedSize] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [openSection, setOpenSection] = useState('story'); // Default open section

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
                            <button
                                className={styles.qtyBtn}
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            >
                                <Minus size={16} />
                            </button>
                            <span className={styles.qtyValue}>{quantity}</span>
                            <button
                                className={styles.qtyBtn}
                                onClick={() => setQuantity(quantity + 1)}
                            >
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

                    {/* Smart Clothing / NFC Features */}
                    <div className={styles.smartFeatures}>
                        <h3 className={styles.smartTitle}>Smart Clothing Experience</h3>
                        <p className={styles.smartSubtitle}>Scan the NFC tag on your garment to access these details anytime.</p>

                        {/* Story Behind the Style */}
                        <div className={styles.accordion}>
                            <button className={styles.accordionHeader} onClick={() => toggleSection('story')}>
                                <span>Story Behind the Style</span>
                                <span>{openSection === 'story' ? '-' : '+'}</span>
                            </button>
                            {openSection === 'story' && (
                                <div className={styles.accordionContent}>
                                    {product.description ? (
                                        <div dangerouslySetInnerHTML={{ __html: product.description }} />
                                    ) : (
                                        <p>This piece is crafted with heritage in mind, weaving traditional motifs into modern silhouettes. Each stitch tells a story of royalty and grace.</p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Fabric & Design */}
                        <div className={styles.accordion}>
                            <button className={styles.accordionHeader} onClick={() => toggleSection('fabric')}>
                                <span>Fabric & Design</span>
                                <span>{openSection === 'fabric' ? '-' : '+'}</span>
                            </button>
                            {openSection === 'fabric' && (
                                <div className={styles.accordionContent}>
                                    <p><strong>Material:</strong> Premium Silk / Cotton Blend.</p>
                                    <p><strong>Craftsmanship:</strong> Handmade in Lagos by master artisans.</p>
                                    <p><strong>Design:</strong> Features intricate embroidery symbolizing prosperity and strength.</p>
                                </div>
                            )}
                        </div>

                        {/* Care Details */}
                        <div className={styles.accordion}>
                            <button className={styles.accordionHeader} onClick={() => toggleSection('care')}>
                                <span>Care Details</span>
                                <span>{openSection === 'care' ? '-' : '+'}</span>
                            </button>
                            {openSection === 'care' && (
                                <div className={styles.accordionContent}>
                                    <ul style={{ paddingLeft: '1.2rem' }}>
                                        <li>Dry clean recommended to preserve fabric sheen.</li>
                                        <li>Cool iron on reverse side.</li>
                                        <li>Do not bleach or tumble dry.</li>
                                        <li>Store in a cool, dry place away from direct sunlight.</li>
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* Styling Options */}
                        <div className={styles.accordion}>
                            <button className={styles.accordionHeader} onClick={() => toggleSection('styling')}>
                                <span>Styling Options</span>
                                <span>{openSection === 'styling' ? '-' : '+'}</span>
                            </button>
                            {openSection === 'styling' && (
                                <div className={styles.accordionContent}>
                                    <p><strong>Day Look:</strong> Pair with simple leather sandals and minimal jewelry.</p>
                                    <p><strong>Evening Glam:</strong> Elevate with statement gold accessories and heels.</p>
                                    <p><strong>Traditional:</strong> Complement with a matching Gele (headtie) for a complete regal look.</p>
                                </div>
                            )}
                        </div>

                        {/* Lookbook / VR (Future) */}
                        <div className={styles.accordion}>
                            <button className={styles.accordionHeader} onClick={() => toggleSection('lookbook')}>
                                <span>Lookbook & VR Experience</span>
                                <span>{openSection === 'lookbook' ? '-' : '+'}</span>
                            </button>
                            {openSection === 'lookbook' && (
                                <div className={styles.accordionContent}>
                                    <div className={styles.placeholderVR}>
                                        <p>✨ Virtual Reality Experience Coming Soon.</p>
                                        <p>Immerse yourself in the Royal Haven runway.</p>
                                    </div>
                                    {/* Placeholder for future specific lookbook images */}
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </main>
    );
}
