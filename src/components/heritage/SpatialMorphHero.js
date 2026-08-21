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

    // Load Supabase config client-side if not preloaded
    useEffect(() => {
        let isMounted = true;
        async function loadData() {
            if (!config || cards.length === 0) {
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
    // Maps viewport scroll position directly to CSS transforms via requestAnimationFrame
    const updateProgress = useCallback(() => {
        if (!trackRef.current) return;

        const trackRect = trackRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const totalScrollableDistance = trackRect.height - windowHeight;

        if (totalScrollableDistance <= 0) return;

        // Calculate progress normalized from 0.0 (top) to 1.0 (bottom of track)
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
        updateProgress(); // Initial calculation

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleScroll);
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
        };
    }, [updateProgress]);

    // Ensure video attempts autoplay safely
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.play().catch(() => {
                // Ignore browser autoplay policy restriction if muted
            });
        }
    }, [config?.video_url]);

    // ── THREE PHASES INTERPOLATION ───────────────────────────────────────────
    // Phase 1: Fullscreen Hero Freeze (0.0 to 0.25)
    // Phase 2: Spatial Morphing & Aspect Ratio Shrink (0.25 to 0.70)
    // Phase 3: Content & Micro Cards Reveal (0.70 to 1.0)

    // Hero overlay text opacity: 1 -> 0 (Fades out during Phase 2)
    const heroTextOpacity = Math.max(0, 1 - (progress / 0.3));
    const heroTextTransform = `translateY(${progress * -80}px)`;

    // Media Wrapper morphing: 100vw x 100vh -> 360px x 460px
    const morphProgress = Math.max(0, Math.min(1, (progress - 0.2) / 0.5)); // 0 to 1 between P=0.2 and 0.7
    
    // Width: 100vw -> 360px (desktop) or 280px (mobile)
    // Height: 100vh -> 440px
    // Border Radius: 0px -> 24px
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const targetWidthPx = isMobile ? 290 : 360;
    const targetHeightPx = isMobile ? 380 : 440;
    const targetRadiusPx = 24;

    const mediaWidth = morphProgress === 0 ? "100vw" : `calc(100vw - ${(100 - (targetWidthPx / (typeof window !== "undefined" ? window.innerWidth : 1400) * 100)) * morphProgress}vw)`;
    const mediaHeight = morphProgress === 0 ? "100vh" : `calc(100vh - ${(100 - (targetHeightPx / (typeof window !== "undefined" ? window.innerHeight : 900) * 100)) * morphProgress}vh)`;
    const borderRadius = `${morphProgress * targetRadiusPx}px`;

    const mediaBoxShadow = morphProgress > 0.5
        ? `0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(212, 175, 55, ${morphProgress * 0.4})`
        : "0 0 0 rgba(0,0,0,0)";

    // Phase 2 & 3 Content Reveals
    const headerOpacity = Math.max(0, Math.min(1, (progress - 0.35) / 0.3));
    const headerTransform = `translateY(${(1 - headerOpacity) * 30}px)`;

    const gridOpacity = Math.max(0, Math.min(1, (progress - 0.65) / 0.3));
    const gridTransform = `translateY(${(1 - gridOpacity) * 60}px)`;

    const currentConfig = config || {
        hero_title: "Our Heritage",
        hero_subtitle: "The Convergence of Indigenous Fashion & Modern Artistry",
        badge_text: "ROYAL HAVEN ARCHIVES — EST. 2017",
        video_url: "https://bezaleelgroup.ca/wp-content/uploads/2026/02/wura-ewa-hero-loop.mp4"
    };

    return (
        <div ref={trackRef} className={styles.track}>
            <div className={styles.stickyFrame}>

                {/* ── PHASE 1: HERO TYPOGRAPHY OVERLAY ────────────────────────── */}
                <div 
                    className={styles.heroContentOverlay}
                    style={{ 
                        opacity: heroTextOpacity, 
                        transform: heroTextTransform,
                        pointerEvents: heroTextOpacity > 0.2 ? "auto" : "none" 
                    }}
                >
                    <span className={styles.badge}>{currentConfig.badge_text || "ROYAL HAVEN — EST. 2017"}</span>
                    <h1 className={styles.heroTitle}>{currentConfig.hero_title || "Our Heritage"}</h1>
                    <p className={styles.heroSubtitle}>
                        {currentConfig.hero_subtitle || "The Convergence of Fashion & Artistry"}
                    </p>
                </div>

                {/* ── PHASE 2: SPATIAL MORPHING MEDIA CONTAINER ──────────────────── */}
                <div
                    className={styles.morphMediaWrapper}
                    style={{
                        width: mediaWidth,
                        height: mediaHeight,
                        borderRadius: borderRadius,
                        boxShadow: mediaBoxShadow,
                    }}
                >
                    <video
                        ref={videoRef}
                        className={styles.heroVideo}
                        src={currentConfig.video_url}
                        autoPlay
                        loop
                        muted
                        playsInline
                        poster={currentConfig.poster_image}
                    />
                    <div className={styles.videoOverlay} />
                </div>

                {/* ── PHASE 3: SPATIAL REVEAL & MICRO CARDS GRID ─────────────────── */}
                <div className={styles.spatialLayoutWrapper}>
                    {/* Header Reveal */}
                    <div 
                        className={styles.revealHeader}
                        style={{ opacity: headerOpacity, transform: headerTransform }}
                    >
                        <h2 className={styles.revealHeading}>Two Worlds. One Vision.</h2>
                        <p className={styles.lead}>
                            Merging the tactile elegance of indigenous fashion with the ethereal beauty of modern artistry.
                        </p>
                    </div>

                    {/* Micro Cards Grid Reveal */}
                    <div 
                        className={styles.spatialGrid}
                        style={{ opacity: gridOpacity, transform: gridTransform }}
                    >
                        {cards.map((card, idx) => (
                            <Link 
                                key={card.id || idx} 
                                href={card.link_url || "/shop"} 
                                className={styles.microCard}
                            >
                                <div className={styles.cardImageWrapper}>
                                    <img 
                                        src={card.image_url} 
                                        alt={card.title} 
                                        className={styles.cardImage} 
                                    />
                                    {card.badge && (
                                        <span className={styles.cardBadge}>{card.badge}</span>
                                    )}
                                </div>
                                <div className={styles.cardContent}>
                                    <h3 className={styles.cardTitle}>{card.title}</h3>
                                    <p className={styles.cardSubtitle}>{card.subtitle}</p>
                                    <span className={styles.cardLinkText}>
                                        Explore Collection <ArrowUpRight size={14} />
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Scroll Helper Indicator */}
                {progress < 0.8 && (
                    <div 
                        className={styles.scrollIndicator} 
                        style={{ opacity: Math.max(0, 1 - progress * 2) }}
                    >
                        <span>Scroll To Explore</span>
                        <ChevronDown size={16} />
                        <div className={styles.scrollLine} />
                    </div>
                )}

            </div>
        </div>
    );
}
