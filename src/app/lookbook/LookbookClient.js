"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import styles from "./LookbookClient.module.css";
import { SITE_MEDIA } from "@/config/media";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const TABS = ["All", "Hair", "Makeup", "Gele", "Fashion"];

export default function LookbookClient() {
    const [activeTab, setActiveTab] = useState("All");
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Lightbox State
    const [selectedIndex, setSelectedIndex] = useState(null);

    useEffect(() => {
        async function fetchImages() {
            setLoading(true);
            try {
                // If table doesn't exist, this will quietly fail and we show empty state or fallbacks.
                const { data, error } = await supabase
                    .from("lookbook_images")
                    .select("*")
                    .order('created_at', { ascending: false });

                if (error) {
                    // Fail gracefully and use robust fallbacks if table isn't created yet by user
                    console.warn("Portfolio DB missing/empty. Using highly-curated UI fallbacks.");
                    setImages([
                        { id: 1, category: "Makeup", image_url: "https://images.unsplash.com/photo-1512496015851-a1dc8a477858?auto=format&fit=crop&q=80&w=800", title: "Bridal Soft Glam" },
                        { id: 2, category: "Makeup", image_url: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=800", title: "Editorial Look" },
                        { id: 3, category: "Hair", image_url: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&q=80&w=800", title: "Bridal Updo" },
                        { id: 4, category: "Gele", image_url: "https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?auto=format&fit=crop&q=80&w=800", title: "Traditional Headtie" },
                        { id: 5, category: "Fashion", image_url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800", title: "Heritage Shoot" },
                        { id: 6, category: "Hair", image_url: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&q=80&w=800", title: "Sleek Ponytail" }
                    ]);
                } else if (data) {
                    setImages(data);
                }
            } catch (err) {
                console.error("Fetch failed", err);
            } finally {
                setLoading(false);
            }
        }
        fetchImages();
    }, []);

    const filteredImages = activeTab === "All" 
        ? images 
        : images.filter(img => {
            if (!img.category) return false;
            // Support comma-separated categories (e.g. "Hair, Makeup") and case-insensitivity
            const categories = img.category.split(',').map(c => c.trim().toLowerCase());
            return categories.includes(activeTab.toLowerCase());
        });

    // Lightbox Keyboard Listeners
    const handleKeyDown = useCallback(
        (e) => {
            if (selectedIndex === null) return;
            if (e.key === "Escape") setSelectedIndex(null);
            if (e.key === "ArrowRight") handleNext();
            if (e.key === "ArrowLeft") handlePrev();
        },
        [selectedIndex, filteredImages.length]
    );

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleKeyDown]);

    // Body scroll lock when lightbox is open
    useEffect(() => {
        if (selectedIndex !== null) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
    }, [selectedIndex]);

    const handleNext = () => {
        setSelectedIndex((prev) => (prev + 1) % filteredImages.length);
    };

    const handlePrev = () => {
        setSelectedIndex((prev) => (prev === 0 ? filteredImages.length - 1 : prev - 1));
    };

    const handleImageClick = (idx) => {
        setSelectedIndex(idx);
    };

    return (
        <div className={styles.container}>
            <motion.div 
                className={styles.header}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                style={{ 
                    backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${SITE_MEDIA.lookbook.hero})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    padding: '8rem 2rem',
                    borderRadius: '12px',
                    marginBottom: '3rem'
                }}
            >
                <h1 className={styles.title} style={{ color: 'var(--off-white)' }}>The Artistry</h1>
                <p className={styles.subtitle} style={{ color: 'rgba(255,255,255,0.8)' }}>
                    A curated reflection of our signature styling, crafted to elevate heritage into modern luxury.
                </p>
            </motion.div>

            {/* Glass Navigation Tabs */}
            <motion.div 
                className={styles.tabContainer}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                {TABS.map(tab => (
                    <button 
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`${styles.tab} ${activeTab === tab ? styles.activeTab : ''}`}
                    >
                        {tab}
                    </button>
                ))}
            </motion.div>

            {/* Gallery Grid */}
            {loading ? (
                <div className={styles.loading}>Curating Gallery...</div>
            ) : (
                <motion.div className={styles.grid} layout>
                    <AnimatePresence mode="popLayout">
                        {filteredImages.map((img, index) => (
                            <motion.div
                                key={img.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.4 }}
                                className={styles.imageCard}
                                onClick={() => handleImageClick(index)}
                            >
                                <Image
                                    src={img.image_url}
                                    alt={img.title || "Portfolio Work"}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    className={styles.image}
                                />
                                <div className={styles.imageOverlay}>
                                    <h3 className={styles.imageTitle}>{img.title}</h3>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            )}
            
            {/* Extremely graceful empty state handler for when tabs yield 0 results */}
            {!loading && filteredImages.length === 0 && (
                <div style={{ textAlign: "center", color: "var(--stone)", marginTop: "3rem" }}>
                    No works catalogued strictly under "{activeTab}" yet.
                </div>
            )}

            {/* Lightbox Overlay */}
            <AnimatePresence>
                {selectedIndex !== null && (
                    <motion.div
                        className={styles.lightboxOverlay}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <button className={styles.lightboxCloseButton} onClick={() => setSelectedIndex(null)}>
                            <X size={40} />
                        </button>

                        <button className={`${styles.lightboxNavButton} ${styles.lightboxNavLeft}`} onClick={(e) => { e.stopPropagation(); handlePrev(); }}>
                            <ChevronLeft size={32} />
                        </button>

                        <div className={styles.lightboxImageContainer}>
                            <Image
                                src={filteredImages[selectedIndex].image_url}
                                alt={filteredImages[selectedIndex].title || "Lookbook HD"}
                                fill
                                className={styles.lightboxImage}
                                unoptimized={true} // bypasses Next.js image resizing so it loads max-res
                            />
                        </div>

                        <button className={`${styles.lightboxNavButton} ${styles.lightboxNavRight}`} onClick={(e) => { e.stopPropagation(); handleNext(); }}>
                            <ChevronRight size={32} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
