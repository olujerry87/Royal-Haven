"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./PromoBanner.module.css";

export default function PromoBanner({ slides = [] }) {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (!slides || slides.length === 0) return;
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % slides.length);
        }, 5000); // 5 seconds for better viewing of images
        return () => clearInterval(timer);
    }, [slides]);

    if (!slides || slides.length === 0) {
        return null; // Don't try to render if Builder hasn't passed slides yet
    }

    return (
        <section className={styles.banner}>
            <AnimatePresence mode="wait">
                <motion.div
                    key={index}
                    className={styles.slideContainer}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    {slides[index].type === 'text' ? (
                        <div className={styles.container}>
                            <h2 className={styles.text}>{slides[index].content}</h2>
                            <Link href="/shop" className={styles.link}>
                                {slides[index].sub}
                            </Link>
                        </div>
                    ) : (
                        <Link href={slides[index].link} className={styles.imageLink}>
                            {/* 
                  Using a simple div with background image for the banner 
                  rendering for valid HTML structure inside the anchor 
               */}
                            <div
                                className={styles.bannerImage}
                                style={{ backgroundImage: `url(${slides[index].image})` }}
                            />

                            {/* Fallback text if image missing is handled by CSS background color */}
                            <span className="sr-only">{slides[index].alt}</span>
                        </Link>
                    )}
                </motion.div>
            </AnimatePresence>

            {/* Indicators */}
            {slides.length > 1 && (
                <div className={styles.dots}>
                    {slides.map((_, i) => (
                        <button
                            key={i}
                            className={`${styles.dot} ${i === index ? styles.activeDot : ''}`}
                            onClick={() => setIndex(i)}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}
