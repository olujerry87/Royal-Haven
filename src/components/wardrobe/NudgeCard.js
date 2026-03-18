"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import styles from "./NudgeCard.module.css";

export default function NudgeCard({ missingCategory, product }) {
    if (!missingCategory) return null;

    const price = product?.prices?.regular_price
        ? `$${(product.prices.regular_price / 100).toFixed(2)}`
        : product?.price
        ? `$${product.price}`
        : null;

    const img = product?.images?.[0]?.src || null;
    const name = product?.name || `${missingCategory.replace(/_/g, " ")}`;
    const slug = product?.slug || "";

    return (
        <motion.div
            className={styles.nudge}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
        >
            <div className={styles.header}>
                <span className={styles.badge}>Missing Piece</span>
                <p className={styles.tagline}>Finish the look →</p>
            </div>

            <div className={styles.card}>
                {img && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={img} alt={name} className={styles.productImg} />
                )}
                <div className={styles.info}>
                    <p className={styles.category}>{missingCategory.replace(/_/g, " ")}</p>
                    <h4 className={styles.productName}>{name}</h4>
                    {price && <p className={styles.price}>{price}</p>}
                </div>
            </div>

            {slug && (
                <Link href={`/shop/${slug}`} className={styles.cta}>
                    Add to Wardrobe
                </Link>
            )}
        </motion.div>
    );
}
