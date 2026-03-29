"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import styles from "./FeaturedSpotlight.module.css";

export default function FeaturedSpotlight({
    imagePath = "/images/spotlight.jpg",
    title = "Set For Effortless Intentions",
    description = "Move with purpose. Breathe with ease. <br /> Our new Heritage collection is designed for moments of pure clarity and effortless intention.",
    ctaText = "Explore",
    ctaLink = "/shop/unisex",
    hasGlassCard = true
}) {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    // Parallax effect: Faster speed as requested (-40% to 10%)
    const y = useTransform(scrollYProgress, [0, 1], ["-40%", "10%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.5, 1, 0.5]);

    return (
        <section ref={ref} className={styles.parallaxContainer}>
            <motion.div style={{ y }} className={styles.backgroundImageWrapper}>
                <Image
                    src={imagePath}
                    alt={title || "Featured Image"}
                    fill
                    sizes="100vw"
                    className={styles.image}
                    priority={false} // Lazy load unless it's the first fold (usually not)
                />
            </motion.div>

            <div className={styles.overlay}>
                {title && (
                    <motion.div
                        className={hasGlassCard ? styles.glassContent : styles.transparentContent}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className={styles.title}>{title}</h2>
                        {description && (
                            <p className={styles.description} dangerouslySetInnerHTML={{ __html: description }} />
                        )}
                        {ctaText && ctaLink && (
                            <Link href={ctaLink} className="btn-primary">
                                {ctaText}
                            </Link>
                        )}
                    </motion.div>
                )}
            </div>
        </section>
    );
}
