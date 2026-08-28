"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import styles from "./ProductCard.module.css";

// Normalize WooCommerce image format: can be { src: '...' } objects or plain strings
function getImageSrc(img) {
    if (!img) return "/images/spotlight.jpg";
    return typeof img === "string" ? img : img.src || "/images/spotlight.jpg";
}

export default function ProductCard({ product, productId }) {
    const [isHovered, setIsHovered] = useState(false);
    if (!product) return null;

    const img0 = getImageSrc(product.images?.[0]);
    const img1 = getImageSrc(product.images?.[1]);

    const isSale = Boolean(
        product.on_sale ||
        (product.regular_price && Number(product.regular_price) > Number(product.price)) ||
        (product.sale_price && product.regular_price && Number(product.regular_price) > Number(product.sale_price))
    );
    const regularPrice = product.regular_price ? Number(product.regular_price).toFixed(2) : null;
    const currentPrice = typeof product.price === "number" ? product.price.toFixed(2) : product.price;

    return (

        <div
            className={styles.card}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Link href={`/shop/${product.slug}`}>
                <div className={styles.imageContainer}>
                    {/* Sale Badge */}
                    {isSale && <span className={styles.saleBadge}>SALE</span>}

                    {/* Primary Image */}
                    <div className={styles.imgWrapper}>
                        <Image
                            src={img0}
                            alt={product.name}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className={`${styles.productImg} ${styles.primary}`}
                        />
                    </div>

                    {/* Secondary Image (Revealed on Hover) */}
                    {img1 && (
                        <div className={`${styles.imgWrapper} ${styles.secondaryWrapper} ${isHovered ? styles.visible : ''}`}>
                            <Image
                                src={img1}
                                alt={`${product.name} alternate view`}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                className={styles.productImg}
                            />
                        </div>
                    )}

                    {/* Quick Add Button */}
                    <button className={`${styles.quickAdd} ${isHovered ? styles.btnVisible : ''}`}>
                        <ShoppingBag size={18} /> Quick Add
                    </button>
                </div>

                <div className={styles.details}>
                    <h3 className={styles.name}>{product.name}</h3>
                    {isSale && regularPrice ? (
                        <p className={styles.priceRow}>
                            <span className={styles.salePrice}>${currentPrice} CAD</span>
                            <span className={styles.regularPrice}>${regularPrice} CAD</span>
                        </p>
                    ) : (
                        <p className={styles.price}>${currentPrice} CAD</p>
                    )}
                </div>
            </Link>
        </div>
    );

}
