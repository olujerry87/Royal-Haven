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
            if (!config || cards.length < 10) {
                const { config: remoteConfig, cards: remoteCards } = await getHeritageMorphData();
                if (isMounted) {
                    setConfig(remoteConfig);
                    if (remoteCards && remoteCards.length >= 10) {
                        setCards(remoteCards);
                    }
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

        // ── Phase 2: Middle Headline Divider Fade In (P: 0.12 -> 0.55) ─────────────
        if (middleDividerRef.current) {
            const textOpacity = Math.max(0, Math.min(1, (P - 0.12) / 0.38));
            middleDividerRef.current.style.opacity = textOpacity.toString();
            middleDividerRef.current.style.transform = `translateY(${(1 - textOpacity) * 20}px)`;
        }

        // ── Phase 3: Synchronized 10-Top & 10-Bottom Canvas Expansion (P: 0.08 -> 0.68)
        const canvasProgress = Math.max(0, Math.min(1, (P - 0.08) / 0.60));
        const canvasScale = 0.35 + (canvasProgress * 0.65); // 0.35 -> 1.0
        const canvasTranslateY = (1 - canvasProgress) * 45; // 45px -> 0px

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

        // ── HERO VIDEO MORPH (100vw x 100vh -> Bounding Slot Target at Row 4 Col 3) ─
        if (slotTargetRef.current && heroVideoCardRef.current) {
            const morphT = Math.max(0, Math.min(1, (P - 0.08) / 0.60));

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
            const currentRadius = morphT * 20; // 0px -> 20px
            const shadowAlpha = morphT * 0.2;

            heroVideoCardRef.current.style.width = `${currentWidth}px`;
            heroVideoCardRef.current.style.height = `${currentHeight}px`;
            heroVideoCardRef.current.style.left = `${currentLeft}px`;
            heroVideoCardRef.current.style.top = `${currentTop}px`;
            heroVideoCardRef.current.style.borderRadius = `${currentRadius}px`;
            heroVideoCardRef.current.style.boxShadow = morphT > 0.1
                ? `0 ${morphT * 12}px ${morphT * 28}px rgba(0, 0, 0, ${shadowAlpha}), 0 0 0 1px rgba(0, 0, 0, ${morphT * 0.1})`
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

    // Always fallback to DEFAULT_HERITAGE_MICRO_CARDS if cards array is loading or incomplete
    const activeCards = (cards && cards.length >= 10) ? cards : DEFAULT_HERITAGE_MICRO_CARDS;
    const top10 = activeCards.slice(0, 10);
    const bot9  = activeCards.slice(10, 19);

    return (
        <div ref={trackRef} className={styles.trackContainer}>
            <div ref={stickyBoxRef} className={styles.stickyBox}>

                {/* ── TOP CANVAS (10 Visual Non-Clickable Photo Cards in Staggered Grid) ── */}
                <div ref={topCanvasRef} className={styles.topCanvas} style={{ opacity: 0 }}>
                    {/* Row 1 (4 Cards: Cols 1, 3, 4, 6) */}
                    <div className={styles.photoTile} style={{ gridColumn: '1' }}>
                        <img src={top10[0]?.image_url || DEFAULT_HERITAGE_MICRO_CARDS[0].image_url} alt="" className={styles.tileImg} />
                    </div>
                    <div className={styles.photoTile} style={{ gridColumn: '3' }}>
                        <img src={top10[1]?.image_url || DEFAULT_HERITAGE_MICRO_CARDS[1].image_url} alt="" className={styles.tileImg} />
                    </div>
                    <div className={styles.photoTile} style={{ gridColumn: '4' }}>
                        <img src={top10[2]?.image_url || DEFAULT_HERITAGE_MICRO_CARDS[2].image_url} alt="" className={styles.tileImg} />
                    </div>
                    <div className={styles.photoTile} style={{ gridColumn: '6' }}>
                        <img src={top10[3]?.image_url || DEFAULT_HERITAGE_MICRO_CARDS[3].image_url} alt="" className={styles.tileImg} />
                    </div>

                    {/* Row 2 (6 Cards: Cols 1, 2, 3, 4, 5, 6) */}
                    <div className={styles.photoTile} style={{ gridColumn: '1' }}>
                        <img src={top10[4]?.image_url || DEFAULT_HERITAGE_MICRO_CARDS[4].image_url} alt="" className={styles.tileImg} />
                    </div>
                    <div className={styles.photoTile} style={{ gridColumn: '2' }}>
                        <img src={top10[5]?.image_url || DEFAULT_HERITAGE_MICRO_CARDS[5].image_url} alt="" className={styles.tileImg} />
                    </div>
                    <div className={styles.photoTile} style={{ gridColumn: '3' }}>
                        <img src={top10[6]?.image_url || DEFAULT_HERITAGE_MICRO_CARDS[6].image_url} alt="" className={styles.tileImg} />
                    </div>
                    <div className={styles.photoTile} style={{ gridColumn: '4' }}>
                        <img src={top10[7]?.image_url || DEFAULT_HERITAGE_MICRO_CARDS[7].image_url} alt="" className={styles.tileImg} />
                    </div>
                    <div className={styles.photoTile} style={{ gridColumn: '5' }}>
                        <img src={top10[8]?.image_url || DEFAULT_HERITAGE_MICRO_CARDS[8].image_url} alt="" className={styles.tileImg} />
                    </div>
                    <div className={styles.photoTile} style={{ gridColumn: '6' }}>
                        <img src={top10[9]?.image_url || DEFAULT_HERITAGE_MICRO_CARDS[9].image_url} alt="" className={styles.tileImg} />
                    </div>
                </div>

                {/* ── MIDDLE DIVIDER SECTION (Headline & Subtitle) ───────────────── */}
                <div ref={middleDividerRef} className={styles.middleDivider} style={{ opacity: 0 }}>
                    <span className={styles.badge}>{currentConfig.badge_text || "ROYAL HAVEN ARCHIVES — EST. 2017"}</span>
                    <h1 className={styles.heading}>Two Worlds. One Vision.</h1>
                    <p className={styles.subheading}>
                        Merging the tactile elegance of indigenous fashion with the ethereal beauty of modern artistry.
                    </p>
                </div>

                {/* ── BOTTOM CANVAS (10 Cards Total: 9 Photo Tiles + 1 Hero Target) ── */}
                <div ref={bottomCanvasRef} className={styles.bottomCanvas} style={{ opacity: 0 }}>
                    {/* Row 3 (5 Cards: Cols 1, 2, 4, 5, 6) */}
                    <div className={styles.photoTile} style={{ gridColumn: '1' }}>
                        <img src={bot9[0]?.image_url || DEFAULT_HERITAGE_MICRO_CARDS[10].image_url} alt="" className={styles.tileImg} />
                    </div>
                    <div className={styles.photoTile} style={{ gridColumn: '2' }}>
                        <img src={bot9[1]?.image_url || DEFAULT_HERITAGE_MICRO_CARDS[11].image_url} alt="" className={styles.tileImg} />
                    </div>
                    <div className={styles.photoTile} style={{ gridColumn: '4' }}>
                        <img src={bot9[2]?.image_url || DEFAULT_HERITAGE_MICRO_CARDS[12].image_url} alt="" className={styles.tileImg} />
                    </div>
                    <div className={styles.photoTile} style={{ gridColumn: '5' }}>
                        <img src={bot9[3]?.image_url || DEFAULT_HERITAGE_MICRO_CARDS[13].image_url} alt="" className={styles.tileImg} />
                    </div>
                    <div className={styles.photoTile} style={{ gridColumn: '6' }}>
                        <img src={bot9[4]?.image_url || DEFAULT_HERITAGE_MICRO_CARDS[14].image_url} alt="" className={styles.tileImg} />
                    </div>

                    {/* Row 4 (5 Cards: Cols 1, 2, HERO TARGET AT COL 3, Cols 4, 5) */}
                    <div className={styles.photoTile} style={{ gridColumn: '1' }}>
                        <img src={bot9[5]?.image_url || DEFAULT_HERITAGE_MICRO_CARDS[15].image_url} alt="" className={styles.tileImg} />
                    </div>
                    <div className={styles.photoTile} style={{ gridColumn: '2' }}>
                        <img src={bot9[6]?.image_url || DEFAULT_HERITAGE_MICRO_CARDS[16].image_url} alt="" className={styles.tileImg} />
                    </div>
                    
                    {/* Morphing Video Target Slot at Center Column 3! */}
                    <div ref={slotTargetRef} className={styles.heroSlotTarget} style={{ gridColumn: '3' }} />

                    <div className={styles.photoTile} style={{ gridColumn: '4' }}>
                        <img src={bot9[7]?.image_url || DEFAULT_HERITAGE_MICRO_CARDS[17].image_url} alt="" className={styles.tileImg} />
                    </div>
                    <div className={styles.photoTile} style={{ gridColumn: '5' }}>
                        <img src={bot9[8]?.image_url || DEFAULT_HERITAGE_MICRO_CARDS[18].image_url} alt="" className={styles.tileImg} />
                    </div>
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
