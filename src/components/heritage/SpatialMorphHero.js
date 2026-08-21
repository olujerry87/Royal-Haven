"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import styles from "./SpatialMorphHero.module.css";
import { getHeritageMorphData } from "@/lib/heritageSupabase";

export default function SpatialMorphHero({ initialConfig, initialCards }) {
    const trackRef = useRef(null);
    const videoRef = useRef(null);

    const [config, setConfig] = useState(initialConfig || null);
    const [cards, setCards] = useState(initialCards || []);
    const [progress, setProgress] = useState(0);

    // Load Supabase configuration & rich cards client-side
    useEffect(() => {
        let isMounted = true;
        async function loadData() {
            if (!config || cards.length < 4) {
                const { config: remoteConfig, cards: remoteCards } = await getHeritageMorphData();
                if (isMounted) {
                    setConfig(remoteConfig);
                    setCards(remoteCards);
                }
            }
        }
        loadData();
        return () => { isMounted = false; };
    }, [config, cards]);

    // ── SCROLL SCRUBBING PROGRESS ENGINE ──────────────────────────────────────
    const updateProgress = useCallback(() => {
        if (!trackRef.current) return;

        const trackRect = trackRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const totalScrollableDistance = trackRect.height - windowHeight;

        if (totalScrollableDistance <= 0) return;

        const currentScroll = -trackRect.top;
        const rawProgress = currentScroll / totalScrollableDistance;
        const clampedProgress = Math.max(0, Math.min(1, rawProgress));

        setProgress(clampedProgress);
    }, []);

    useEffect(() => {
        let animationFrameId;

        function handleScroll() {
            animationFrameId = requestAnimationFrame(updateProgress);
        }

        window.addEventListener("scroll", handleScroll, { passive: true });
        window.addEventListener("resize", handleScroll, { passive: true });
        updateProgress();

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleScroll);
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
        };
    }, [updateProgress]);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.play().catch(() => {});
        }
    }, [config?.video_url]);

    // ── SPATIAL MORPH INTERPOLATIONS ──────────────────────────────────────────
    // Phase 1 (0.0 to 0.15): Fullscreen Hero Video & Centered Intro
    // Phase 2 (0.15 to 0.70): Video scales down to Card 2 slot, surrounding cards expand into grid
    // Phase 3 (0.70 to 1.0): Full spatial 6-card matrix locked in place

    const morphT = Math.max(0, Math.min(1, (progress - 0.1) / 0.55)); // 0 -> 1

    // Video Dimensions: Full hero (85vw x 65vh) -> Scaled card slot (100% of slot width x 360px height)
    // We scale the hero video container down while keeping it in position
    const heroWidthVw = 85 - (morphT * 55); // 85vw -> ~30vw
    const heroHeightVh = 65 - (morphT * 25); // 65vh -> ~40vh
    const borderRadius = `${28 - (morphT * 8)}px`; // 28px -> 20px

    // Surrounding cards animation (Cards 1, 3, 4, 5, 6 expand from center out)
    const cardsOpacity = Math.max(0, Math.min(1, (progress - 0.25) / 0.45));
    const cardsScale = 0.65 + (cardsOpacity * 0.35); // 0.65 -> 1.0
    const cardsTranslateY = (1 - cardsOpacity) * 50; // 50px -> 0px

    const currentConfig = config || {
        hero_title: "Our Heritage",
        hero_subtitle: "The Convergence of Indigenous Fashion & Modern Artistry",
        badge_text: "ROYAL HAVEN — EST. 2017",
        video_url: "https://bezaleelgroup.ca/wp-content/uploads/2026/02/wura-ewa-hero-loop.mp4"
    };

    const displayCards = (cards && cards.length >= 6) ? cards : [
        { id: "1", title: "Wura Collection", subtitle: "Tactile Indigenous Couture", badge: "COUTURE", image_url: "https://bezaleelgroup.ca/wp-content/uploads/2026/02/duality-wura.jpg", link_url: "/shop" },
        { id: "3", title: "Ewa Artistry", subtitle: "Luxury Bridal & Beauty", badge: "ARTISTRY", image_url: "https://bezaleelgroup.ca/wp-content/uploads/2026/02/duality-ewa.jpg", link_url: "/services" },
        { id: "4", title: "NTAG Passport", subtitle: "Digital Provenance & Weather", badge: "INNOVATION", image_url: "https://bezaleelgroup.ca/wp-content/uploads/2026/02/heritage-hero.jpg", link_url: "#styling" },
        { id: "5", title: "Royal Archives", subtitle: "African Legacy & Craft", badge: "HERITAGE", image_url: "https://cdn.builder.io/api/v1/image/assets%2F48904b6ada2c4086ab7af82900bb21db%2Ff7dee33d8cd74ba183c59b0e10d0912d", link_url: "/lookbook" },
        { id: "6", title: "Besano Atelier", subtitle: "Custom Bespoke Tailoring", badge: "BESPOKE", image_url: "https://bezaleelgroup.ca/wp-content/uploads/2026/02/spotlight.jpg", link_url: "/services/book" }
    ];

    return (
        <div ref={trackRef} className={styles.track}>
            <div className={styles.stickyFrame}>

                {/* ── HIGH CONTRAST HEADLINE OVERLAY ────────────────────────────── */}
                <div className={styles.headerContainer}>
                    <span className={styles.badge}>{currentConfig.badge_text || "ROYAL HAVEN — EST. 2017"}</span>
                    <h1 className={styles.heading}>Two Worlds. One Vision.</h1>
                    <p className={styles.subheading}>
                        Merging the tactile elegance of indigenous fashion with the ethereal beauty of modern artistry.
                    </p>
                </div>

                {/* ── SPATIAL CANVAS MATRIX ────────────────────────────────────── */}
                <div className={styles.spatialMatrix}>

                    {/* Card 1: Wura Couture (Top Left) */}
                    <Link 
                        href={displayCards[0]?.link_url || "/shop"} 
                        className={styles.cardBase}
                        style={{ opacity: cardsOpacity, transform: `scale(${cardsScale}) translateY(${cardsTranslateY}px)` }}
                    >
                        <div className={styles.cardImageWrapper}>
                            <img src={displayCards[0]?.image_url} alt={displayCards[0]?.title} className={styles.cardImage} />
                            <span className={styles.cardBadge}>{displayCards[0]?.badge || "COUTURE"}</span>
                        </div>
                        <div className={styles.cardContent}>
                            <h3 className={styles.cardTitle}>{displayCards[0]?.title}</h3>
                            <p className={styles.cardSubtitle}>{displayCards[0]?.subtitle}</p>
                            <span className={styles.cardLinkText}>Explore Collection <ArrowUpRight size={13} /></span>
                        </div>
                    </Link>

                    {/* Card 2 (CENTER SLOT): THE MORPHING HERO VIDEO CARD */}
                    <div 
                        className={styles.cardBase}
                        style={{ 
                            position: "relative",
                            overflow: "hidden",
                            borderColor: "var(--gold)",
                            boxShadow: "0 16px 36px rgba(212, 175, 55, 0.25)"
                        }}
                    >
                        <video
                            ref={videoRef}
                            className={styles.videoElement}
                            src={currentConfig.video_url}
                            autoPlay
                            loop
                            muted
                            playsInline
                            poster={currentConfig.poster_image}
                        />
                        <div className={styles.videoCardContent}>
                            <span className={styles.cardBadge} style={{ position: "static", marginBottom: "0.4rem", display: "inline-block" }}>
                                LIVING MEDIA
                            </span>
                            <h3 className={styles.cardTitle} style={{ color: "#FFF", fontSize: "1.1rem" }}>
                                Royal Haven Vision
                            </h3>
                        </div>
                    </div>

                    {/* Card 3: Ewa Artistry (Top Right) */}
                    <Link 
                        href={displayCards[1]?.link_url || "/services"} 
                        className={styles.cardBase}
                        style={{ opacity: cardsOpacity, transform: `scale(${cardsScale}) translateY(${cardsTranslateY}px)` }}
                    >
                        <div className={styles.cardImageWrapper}>
                            <img src={displayCards[1]?.image_url} alt={displayCards[1]?.title} className={styles.cardImage} />
                            <span className={styles.cardBadge}>{displayCards[1]?.badge || "ARTISTRY"}</span>
                        </div>
                        <div className={styles.cardContent}>
                            <h3 className={styles.cardTitle}>{displayCards[1]?.title}</h3>
                            <p className={styles.cardSubtitle}>{displayCards[1]?.subtitle}</p>
                            <span className={styles.cardLinkText}>Book Services <ArrowUpRight size={13} /></span>
                        </div>
                    </Link>

                    {/* Card 4: NTAG Digital Passport (Bottom Left) */}
                    <Link 
                        href={displayCards[2]?.link_url || "#styling"} 
                        className={styles.cardBase}
                        style={{ opacity: cardsOpacity, transform: `scale(${cardsScale}) translateY(${cardsTranslateY}px)` }}
                    >
                        <div className={styles.cardImageWrapper}>
                            <img src={displayCards[2]?.image_url} alt={displayCards[2]?.title} className={styles.cardImage} />
                            <span className={styles.cardBadge}>{displayCards[2]?.badge || "INNOVATION"}</span>
                        </div>
                        <div className={styles.cardContent}>
                            <h3 className={styles.cardTitle}>{displayCards[2]?.title}</h3>
                            <p className={styles.cardSubtitle}>{displayCards[2]?.subtitle}</p>
                            <span className={styles.cardLinkText}>View Innovation <ArrowUpRight size={13} /></span>
                        </div>
                    </Link>

                    {/* Card 5: Royal Archives (Bottom Center) */}
                    <Link 
                        href={displayCards[3]?.link_url || "/lookbook"} 
                        className={styles.cardBase}
                        style={{ opacity: cardsOpacity, transform: `scale(${cardsScale}) translateY(${cardsTranslateY}px)` }}
                    >
                        <div className={styles.cardImageWrapper}>
                            <img src={displayCards[3]?.image_url} alt={displayCards[3]?.title} className={styles.cardImage} />
                            <span className={styles.cardBadge}>{displayCards[3]?.badge || "HERITAGE"}</span>
                        </div>
                        <div className={styles.cardContent}>
                            <h3 className={styles.cardTitle}>{displayCards[3]?.title}</h3>
                            <p className={styles.cardSubtitle}>{displayCards[3]?.subtitle}</p>
                            <span className={styles.cardLinkText}>View Archives <ArrowUpRight size={13} /></span>
                        </div>
                    </Link>

                    {/* Card 6: Besano Atelier (Bottom Right) */}
                    <Link 
                        href={displayCards[4]?.link_url || "/services/book"} 
                        className={styles.cardBase}
                        style={{ opacity: cardsOpacity, transform: `scale(${cardsScale}) translateY(${cardsTranslateY}px)` }}
                    >
                        <div className={styles.cardImageWrapper}>
                            <img src={displayCards[4]?.image_url} alt={displayCards[4]?.title} className={styles.cardImage} />
                            <span className={styles.cardBadge}>{displayCards[4]?.badge || "BESPOKE"}</span>
                        </div>
                        <div className={styles.cardContent}>
                            <h3 className={styles.cardTitle}>{displayCards[4]?.title}</h3>
                            <p className={styles.cardSubtitle}>{displayCards[4]?.subtitle}</p>
                            <span className={styles.cardLinkText}>Bespoke Booking <ArrowUpRight size={13} /></span>
                        </div>
                    </Link>

                </div>

                {/* Scroll Indicator */}
                {progress < 0.85 && (
                    <div 
                        className={styles.scrollIndicator} 
                        style={{ opacity: Math.max(0, 1 - progress * 2) }}
                    >
                        <span>Scroll To Morph Matrix</span>
                        <ChevronDown size={15} />
                        <div className={styles.scrollLine} />
                    </div>
                )}

            </div>
        </div>
    );
}
