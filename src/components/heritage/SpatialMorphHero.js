"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { ArrowDown, ChevronDown } from "lucide-react";
import styles from "./SpatialMorphHero.module.css";
import { getHeritageMorphData, DEFAULT_HERITAGE_MICRO_CARDS } from "@/lib/heritageSupabase";

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
    const [cards, setCards] = useState(initialCards || DEFAULT_HERITAGE_MICRO_CARDS);

    // Load Supabase configuration & rich cards
    useEffect(() => {
        let isMounted = true;
        async function loadData() {
            if (!config || cards.length < 8) {
                const { config: remoteConfig, cards: remoteCards } = await getHeritageMorphData();
                if (isMounted) {
                    setConfig(remoteConfig);
                    if (remoteCards && remoteCards.length >= 8) {
                        setCards(remoteCards);
                    }
                }
            }
        }
        loadData();
        return () => { isMounted = false; };
    }, [config, cards]);

    // ── STABLE CENTER-INTERPOLATED SPATIAL MORPH ENGINE ───────────────────────
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
            videoHeroOverlayRef.current.style.transform = `translateY(${P * -50}px)`;
            videoHeroOverlayRef.current.style.pointerEvents = overlayOpacity > 0.3 ? "auto" : "none";
        }

        // ── Phase 2: CENTER-INTERPOLATED HERO VIDEO MORPH (P: 0.0 -> 0.65) ──────
        const morphT = Math.max(0, Math.min(1, P / 0.65));

        if (slotTargetRef.current && heroVideoCardRef.current && stickyBoxRef.current) {
            const slotRect = slotTargetRef.current.getBoundingClientRect();
            const stickyRect = stickyBoxRef.current.getBoundingClientRect();

            // Header clearance offset (90px)
            const headerClearance = 85;

            // Target dimensions & relative coordinates inside stickyBox
            const targetLeft = slotRect.left - stickyRect.left;
            const targetTop = slotRect.top - stickyRect.top;
            const targetWidth = slotRect.width;
            const targetHeight = slotRect.height;

            // Start dimensions at P=0 (Fullscreen)
            const startLeft = 0;
            const startTop = 0;
            const startWidth = windowWidth;
            const startHeight = windowHeight;

            // Interpolate width and height
            const currentWidth = startWidth + (targetWidth - startWidth) * morphT;
            const currentHeight = startHeight + (targetHeight - startHeight) * morphT;

            // Center-point interpolation
            const startCenterX = startLeft + startWidth / 2;
            const startCenterY = startTop + startHeight / 2;
            const targetCenterX = targetLeft + targetWidth / 2;
            const targetCenterY = targetTop + targetHeight / 2;

            const currentCenterX = startCenterX + (targetCenterX - startCenterX) * morphT;
            const currentCenterY = startCenterY + (targetCenterY - startCenterY) * morphT;

            let currentLeft = currentCenterX - currentWidth / 2;
            let currentTop = currentCenterY - currentHeight / 2;

            // Header Clearance Guard: Ensure video top edge never slips behind header once morph begins!
            if (morphT > 0.05 && currentTop < headerClearance) {
                currentTop = headerClearance + (targetTop - headerClearance) * ((morphT - 0.05) / 0.95);
            }

            const currentRadius = morphT * 24; // 0px -> 24px
            const shadowAlpha = morphT * 0.18;

            heroVideoCardRef.current.style.width = `${currentWidth}px`;
            heroVideoCardRef.current.style.height = `${currentHeight}px`;
            heroVideoCardRef.current.style.left = `${currentLeft}px`;
            heroVideoCardRef.current.style.top = `${currentTop}px`;
            heroVideoCardRef.current.style.borderRadius = `${currentRadius}px`;
            heroVideoCardRef.current.style.boxShadow = morphT > 0.1
                ? `0 ${morphT * 16}px ${morphT * 32}px rgba(0, 0, 0, ${shadowAlpha}), 0 0 0 1px rgba(0, 0, 0, 0.08)`
                : "none";
        }

        // ── Scroll Indicator Fade Out ─────────────────────────────────────────────
        if (scrollIndicatorRef.current) {
            const indicatorOpacity = Math.max(0, 1 - (P / 0.18));
            scrollIndicatorRef.current.style.opacity = indicatorOpacity.toString();
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

    const activeCards = (cards && cards.length >= 8) ? cards : DEFAULT_HERITAGE_MICRO_CARDS;
    const top4 = activeCards.slice(0, 4);
    const bot4 = activeCards.slice(4, 8);

    return (
        <div ref={trackRef} className={styles.trackContainer}>
            <div ref={stickyBoxRef} className={styles.stickyBox}>
                
                {/* ── CONTENT GRID MATRIX (100% Visible Backdrop Canvas) ──────── */}
                <div className={styles.matrixContainer}>

                    {/* Top Canvas Row (4 Micro Photo Cards) */}
                    <div ref={topCanvasRef} className={styles.topCanvas}>
                        {top4.map((card, i) => (
                            <div key={card.id || `top-${i}`} className={styles.photoTile}>
                                <img src={card.image_url} alt="" className={styles.tileImg} />
                            </div>
                        ))}
                    </div>

                    {/* Middle Narrative Section */}
                    <div ref={middleDividerRef} className={styles.middleDivider}>
                        <span className={styles.badge}>{currentConfig.badge_text || "ROYAL HAVEN ARCHIVES — EST. 2017"}</span>
                        <h1 className={styles.heading}>Two Worlds. One Vision.</h1>
                        <p className={styles.subheading}>
                            Merging the tactile elegance of indigenous fashion with the ethereal beauty of modern artistry.
                        </p>
                    </div>

                    {/* Bottom Canvas Row (Center Hero Video Landing Slot + 4 Surrounding Micro Cards) */}
                    <div ref={bottomCanvasRef} className={styles.bottomCanvas}>
                        <div className={styles.photoTile}>
                            <img src={bot4[0]?.image_url} alt="" className={styles.tileImg} />
                        </div>
                        <div className={styles.photoTile}>
                            <img src={bot4[1]?.image_url} alt="" className={styles.tileImg} />
                        </div>

                        {/* HERO CENTER TARGET SLOT (Fullscale Video Morphs Down to Settle Cleanly Here!) */}
                        <div ref={slotTargetRef} className={styles.heroSlotTarget} />

                        <div className={styles.photoTile}>
                            <img src={bot4[2]?.image_url} alt="" className={styles.tileImg} />
                        </div>
                        <div className={styles.photoTile}>
                            <img src={bot4[3]?.image_url} alt="" className={styles.tileImg} />
                        </div>
                    </div>

                </div>

                {/* ── GPU ISOLATED MORPHING HERO VIDEO MODULE ─────────────────── */}
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
                    
                    <div ref={videoHeroOverlayRef} className={styles.videoHeroOverlay}>
                        <span className={styles.badge} style={{ color: "#FAF9F6", borderColor: "rgba(255,255,255,0.4)" }}>
                            {currentConfig.badge_text || "ROYAL HAVEN — EST. 2017"}
                        </span>
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
