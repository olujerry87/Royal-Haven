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

    // Creative suggestive copy
    const ADVICE_MAP = {
        blazer: "A well-tailored blazer ties the whole silhouette together, giving you that 'Royal' authority.",
        trenchcoat: "The trench is the ultimate layering piece for weather shifts — functional yet incredibly sharp.",
        loafers: "Switching to a loafer elevates the look instantly. It's the standard for 'effortless' luxury.",
        dress_shoes: "A crisp pair of dress shoes is the anchor of this executive formula.",
        sneakers: "Stay grounded. A clean sneaker keeps the look modern and ready for movement.",
        ankle_boots: "Boots add a rugged sophistication that works perfectly for cooler evenings.",
        hoodie: "The right hoodie adds a high-street edge to your minimalist layers.",
    };

    const advice = ADVICE_MAP[missingCategory] || `Adding a quality ${missingCategory.replace(/_/g, " ")} is the finishing touch this outfit needs to go from good to exceptional.`;

    return (
        <motion.div
            className={styles.nudge}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
        >
            <div className={styles.header}>
                <p className={styles.tagline}>The Stylist&apos;s Finishing Touch</p>
                <h4 className={styles.advice}>&ldquo;{advice}&rdquo;</h4>
            </div>

            {product && (
                <div className={styles.productSection}>
                    <p className={styles.suggestionLabel}>Suggested from our Collection:</p>
                    <div className={styles.card}>
                        {img && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={img} alt={name} className={styles.productImg} />
                        )}
                        <div className={styles.info}>
                            <p className={styles.category}>{missingCategory.replace(/_/g, " ")}</p>
                            <h5 className={styles.productName}>{name}</h5>
                            {price && <p className={styles.price}>{price}</p>}
                        </div>
                        {slug && (
                            <Link href={`/shop/${slug}`} className={styles.miniCta}>
                                View Item
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </motion.div>
    );
}
