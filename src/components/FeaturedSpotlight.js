"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import styles from "./FeaturedSpotlight.module.css";
import { SITE_MEDIA } from "@/config/media";

export default function FeaturedSpotlight({
    imagePath = SITE_MEDIA.placeholders.spotlight,
    mobileImagePath,
    title = "Set For Effortless Intentions",
    description = "Move with purpose. Breathe with ease. <br /> Our new Heritage collection is designed for moments of pure clarity and effortless intention.",
    ctaText = "Explore",
    ctaLink = "/shop/unisex",
    hasGlassCard = true,
    imagePosition = "center center",
    imageOpacity,
    cardAlign = "center"
}) {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    // Parallax effect: Gentler shift to reveal the top of the image and hide the bottom
    const y = useTransform(scrollYProgress, [0, 1], ["-10%", "20%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.5, 1, 0.5]);

    // Generate a unique identifier for this specific instance's injected style
    const spotlightId = `spotlight-${Math.random().toString(36).substr(2, 9)}`;

    return (
        <section ref={ref} className={`${styles.parallaxContainer} ${spotlightId} ${styles[cardAlign] || ""}`}>
            <motion.div style={{ y }} className={styles.backgroundImageWrapper}>
                {/* Desktop Image */}
                <Image
                    src={imagePath}
                    alt={title || "Featured Image"}
                    fill
                    sizes="100vw"
                    className={`${styles.image} ${mobileImagePath ? styles.desktopImage : ""}`}
                    style={{
                        objectPosition: imagePosition,
                        ...(imageOpacity !== undefined ? { opacity: imageOpacity } : {})
                    }}
                    priority={false}
                />

                {/* Mobile Portrait Image */}
                {mobileImagePath && (
                    <Image
                        src={mobileImagePath}
                        alt={title || "Featured Image"}
                        fill
                        sizes="100vw"
                        className={`${styles.image} ${styles.mobileImage}`}
                        style={{
                            objectPosition: "center center",
                            ...(imageOpacity !== undefined ? { opacity: imageOpacity } : {})
                        }}
                        priority={false}
                    />
                )}
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
