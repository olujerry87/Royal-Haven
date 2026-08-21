"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { ArrowDown, ChevronDown } from "lucide-react";
import styles from "./SpatialMorphHero.module.css";
import { getHeritageMorphData } from "@/lib/heritageSupabase";

export default function SpatialMorphHero({ initialConfig, initialCards }) {
    const trackRef = useRef(null);
    const stickyBoxRef = useRef(null);
    const middleDividerRef = useRef(null);
    const topCanvasRef = useRef(null);
    const bottomCanvasRef = useRef(null);
    const slotTargetRef = useRef(null);
    const heroVideoCardRef = useRef(null);
    const videoHeroOverlayRef = useRef(null);
    const videoRef = useRef(null);
    const scrollIndicatorRef = useRef(null);

    const [config, setConfig] = useState(initialConfig || null);
    const [cards, setCards] = useState(initialCards || []);

    // Load Supabase configuration & rich cards
    useEffect(() => {
        let isMounted = true;
        async function loadData() {
            if (!config || cards.length < 10) {
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

    // ── UNIFIED HIGH-PERFORMANCE DIRECT DOM SCROLL ENGINE ─────────────────────
    const updateScrollState = useCallback(() => {
        if (!trackRef.current || !stickyBoxRef.current || !heroVideoCardRef.current) return;

        const trackRect = trackRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const windowWidth = window.innerWidth;
        const totalScrollableDistance = trackRect.height - windowHeight;

        if (totalScrollableDistance <= 0) return;

        // Normalized scroll progress float clamped strictly between 0.0 and 1.0
        const currentScroll = -trackRect.top;
        const P = Math.max(0, Math.min(1, currentScroll / totalScrollableDistance));

        // ── Phase 1: Fullscreen Hero Overlay Title & CTA Fade Out (P: 0.0 -> 0.18) 
        if (videoHeroOverlayRef.current) {
            const overlayOpacity = Math.max(0, 1 - (P / 0.18));
            videoHeroOverlayRef.current.style.opacity = overlayOpacity.toString();
            videoHeroOverlayRef.current.style.transform = `translateY(${P * -60}px)`;
            videoHeroOverlayRef.current.style.pointerEvents = overlayOpacity > 0.3 ? "auto" : "none";
        }

        // ── Phase 2: Middle Headline Divider Fade In (P: 0.15 -> 0.55) ─────────────
        if (middleDividerRef.current) {
            const textOpacity = Math.max(0, Math.min(1, (P - 0.15) / 0.35));
            middleDividerRef.current.style.opacity = textOpacity.toString();
            middleDividerRef.current.style.transform = `translateY(${(1 - textOpacity) * 25}px)`;
        }

        // ── Phase 3: Synchronized Top (9) & Bottom (10) Canvas Expansion (P: 0.10 -> 0.70)
        const canvasProgress = Math.max(0, Math.min(1, (P - 0.10) / 0.60));
        const canvasScale = 0.35 + (canvasProgress * 0.65); // 0.35 -> 1.0
        const canvasTranslateY = (1 - canvasProgress) * 50; // 50px -> 0px

        if (topCanvasRef.current) {
            topCanvasRef.current.style.opacity = canvasProgress.toString();
            topCanvasRef.current.style.transform = `scale(${canvasScale}) translateY(${-canvasTranslateY}px)`;
        }

        if (bottomCanvasRef.current) {
            bottomCanvasRef.current.style.opacity = canvasProgress.toString();
            bottomCanvasRef.current.style.transform = `scale(${canvasScale}) translateY(${canvasTranslateY}px)`;
        }

        // ── Scroll Indicator Fade Out ─────────────────────────────────────────────
        if (scrollIndicatorRef.current) {
            const indicatorOpacity = Math.max(0, 1 - (P / 0.20));
            scrollIndicatorRef.current.style.opacity = indicatorOpacity.toString();
        }

        // ── HERO VIDEO MORPH (100vw x 100vh -> Center Slot in Middle Divider) ─────
        if (slotTargetRef.current && heroVideoCardRef.current) {
            const morphT = Math.max(0, Math.min(1, (P - 0.10) / 0.60));

            const slotRect = slotTargetRef.current.getBoundingClientRect();
            const stickyRect = stickyBoxRef.current.getBoundingClientRect();

            const targetLeft = slotRect.left - stickyRect.left;
            const targetTop = slotRect.top - stickyRect.top;
            const targetWidth = slotRect.width;
            const targetHeight = slotRect.height;

            const currentWidth = windowWidth + (targetWidth - windowWidth) * morphT;
            const currentHeight = windowHeight + (targetHeight - windowHeight) * morphT;
            const currentLeft = targetLeft * morphT;
            const currentTop = targetTop * morphT;
            const currentRadius = morphT * 24; // 0px -> 24px
            const shadowAlpha = morphT * 0.5;

            heroVideoCardRef.current.style.width = `${currentWidth}px`;
            heroVideoCardRef.current.style.height = `${currentHeight}px`;
            heroVideoCardRef.current.style.left = `${currentLeft}px`;
            heroVideoCardRef.current.style.top = `${currentTop}px`;
            heroVideoCardRef.current.style.borderRadius = `${currentRadius}px`;
            heroVideoCardRef.current.style.boxShadow = morphT > 0.1
                ? `0 ${morphT * 16}px ${morphT * 32}px rgba(0, 0, 0, ${shadowAlpha}), 0 0 0 1px rgba(212, 175, 55, ${morphT * 0.35})`
                : "none";
        }
    }, []);

    useEffect(() => {
        let animationFrameId;

        function handleScroll() {
            animationFrameId = requestAnimationFrame(updateScrollState);
        }

        window.addEventListener("scroll", handleScroll, { passive: true });
        window.addEventListener("resize", handleScroll, { passive: true });
        updateScrollState();

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleScroll);
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
        };
    }, [updateScrollState]);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.play().catch(() => {});
        }
    }, [config?.video_url]);

    const currentConfig = config || {
        hero_title: "Our Heritage",
        hero_subtitle: "The Convergence of Indigenous Fashion & Modern Artistry",
        badge_text: "ROYAL HAVEN — EST. 2017",
        video_url: "https://bezaleelgroup.ca/wp-content/uploads/2026/02/wura-ewa-hero-loop.mp4",
        cta_text: "Explore Living Heritage",
        cta_link: "#duality"
    };

    // Separate into 9 Top Cards + 10 Bottom Cards
    const topCards = cards.slice(0, 9);
    const bottomCards = cards.slice(9, 19);

    return (
        <div ref={trackRef} className={styles.trackContainer}>
            <div ref={stickyBoxRef} className={styles.stickyBox}>

                {/* ── TOP CANVAS (9 Visual Non-Clickable Photo Cards) ──────────────── */}
                <div ref={topCanvasRef} className={styles.topCanvas} style={{ opacity: 0 }}>
                    {topCards.map((card, i) => (
                        <div key={card.id || `top-${i}`} className={styles.photoTile}>
                            <img src={card.image_url} alt="" className={styles.tileImg} />
                        </div>
                    ))}
                </div>

                {/* ── MIDDLE SECTION DIVIDER (Headline & Hero Target Right in Center) ── */}
                <div ref={middleDividerRef} className={styles.middleDivider} style={{ opacity: 0 }}>
                    <span className={styles.badge}>{currentConfig.badge_text || "ROYAL HAVEN — EST. 2017"}</span>
                    <h1 className={styles.heading}>Two Worlds. One Vision.</h1>
                    <p className={styles.subheading}>
                        Merging the tactile elegance of indigenous fashion with the ethereal beauty of modern artistry.
                    </p>
                    
                    {/* Landing slot where Morphing Video Card settles right in center! */}
                    <div ref={slotTargetRef} className={styles.heroSlotTarget} />
                </div>

                {/* ── BOTTOM CANVAS (10 Visual Non-Clickable Photo Cards) ────────────── */}
                <div ref={bottomCanvasRef} className={styles.bottomCanvas} style={{ opacity: 0 }}>
                    {bottomCards.map((card, i) => (
                        <div key={card.id || `bot-${i}`} className={styles.photoTile}>
                            <img src={card.image_url} alt="" className={styles.tileImg} />
                        </div>
                    ))}
                </div>

                {/* ── MORPHING HERO VIDEO CARD (GPU Isolated Compositor Layer) ─────────────── */}
                <div ref={heroVideoCardRef} className={styles.morphHeroVideoCard}>
                    <video
                        ref={videoRef}
                        className={styles.heroVideoMedia}
                        src={currentConfig.video_url}
                        autoPlay
                        loop
                        muted
                        playsInline
                        poster={currentConfig.poster_image}
                    />
                    
                    {/* Fullscreen Hero Title & Interactive Action Button at Start (P=0) */}
                    <div ref={videoHeroOverlayRef} className={styles.videoHeroOverlay}>
                        <span className={styles.badge}>{currentConfig.badge_text || "ROYAL HAVEN — EST. 2017"}</span>
                        <h1 className={styles.heroTitle}>{currentConfig.hero_title || "Our Heritage"}</h1>
                        <p className={styles.heroSubtitle}>
                            {currentConfig.hero_subtitle || "The Convergence of Fashion & Artistry"}
                        </p>

                        <a 
                            href={currentConfig.cta_link || "#duality"} 
                            className={styles.heroCtaBtn}
                        >
                            {currentConfig.cta_text || "Explore Living Heritage"} <ArrowDown size={14} />
                        </a>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div ref={scrollIndicatorRef} className={styles.scrollIndicator}>
                    <span>Scroll To Morph Canvas</span>
                    <ChevronDown size={15} />
                    <div className={styles.scrollLine} />
                </div>

            </div>
        </div>
    );
}
