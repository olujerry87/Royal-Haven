"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import styles from "./ProductCard.module.css";

export default function ProductCard({ product }) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className={styles.card}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Link href={`/shop/${product.slug}`}>
                <div className={styles.imageContainer}>
                    {/* Primary Image */}
                    <div className={styles.imgWrapper}>
                        <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className={`${styles.productImg} ${styles.primary}`}
                        />
                    </div>

                    {/* Secondary Image (Revealed on Hover) */}
                    {product.images[1] && (
                        <div className={`${styles.imgWrapper} ${styles.secondaryWrapper} ${isHovered ? styles.visible : ''}`}>
                            <Image
                                src={product.images[1]}
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
                    <p className={styles.price}>${product.price}</p>
                </div>
            </Link>
        </div>
    );
}
