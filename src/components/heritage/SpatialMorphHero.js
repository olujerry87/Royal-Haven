"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import styles from "./SpatialMorphHero.module.css";
import { getHeritageMorphData } from "@/lib/heritageSupabase";

export default function SpatialMorphHero({ initialConfig, initialCards }) {
    const trackRef = useRef(null);
    const stickyBoxRef = useRef(null);
    const textContainerRef = useRef(null);
    const gridRef = useRef(null);
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

    // ── HIGH-PERFORMANCE DIRECT DOM SCROLL ENGINE (ZERO REACT RE-RENDERS ON SCROLL) ──
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

        // ── Phase 1: Hero Overlay Title Fade Out (P: 0.0 -> 0.20) ────────────────
        if (videoHeroOverlayRef.current) {
            const overlayOpacity = Math.max(0, 1 - (P / 0.20));
            videoHeroOverlayRef.current.style.opacity = overlayOpacity.toString();
            videoHeroOverlayRef.current.style.transform = `translateY(${P * -60}px)`;
        }

        // ── Phase 2: Main Section Headline Fade In (P: 0.25 -> 0.55) ─────────────
        if (textContainerRef.current) {
            const textOpacity = Math.max(0, Math.min(1, (P - 0.22) / 0.30));
            textContainerRef.current.style.opacity = textOpacity.toString();
            textContainerRef.current.style.transform = `translateY(${(1 - textOpacity) * 30}px)`;
        }

        // ── Phase 3: Grid Mosaic Cards Slide & Fade In (P: 0.45 -> 0.75) ─────────
        if (gridRef.current) {
            const gridProgress = Math.max(0, Math.min(1, (P - 0.42) / 0.32));
            gridRef.current.style.opacity = gridProgress.toString();
            gridRef.current.style.transform = `translateY(${(1 - gridProgress) * 70}px)`;
        }

        // ── Scroll Indicator Fade Out ─────────────────────────────────────────────
        if (scrollIndicatorRef.current) {
            const indicatorOpacity = Math.max(0, 1 - (P / 0.25));
            scrollIndicatorRef.current.style.opacity = indicatorOpacity.toString();
        }

        // ── THE SPATIAL MORPH MATRIX (Video scaling from 100vw x 100vh -> Slot 2) ─
        if (slotTargetRef.current && heroVideoCardRef.current) {
            // Morph progress clamped between P=0.15 and P=0.65
            const morphT = Math.max(0, Math.min(1, (P - 0.15) / 0.48));

            const slotRect = slotTargetRef.current.getBoundingClientRect();
            const stickyRect = stickyBoxRef.current.getBoundingClientRect();

            // Calculate precise pixel destination coordinates of Slot 2 inside sticky frame
            const targetLeft = slotRect.left - stickyRect.left;
            const targetTop = slotRect.top - stickyRect.top;
            const targetWidth = slotRect.width;
            const targetHeight = slotRect.height;

            // Interpolate width, height, position, and border-radius
            const currentWidth = windowWidth + (targetWidth - windowWidth) * morphT;
            const currentHeight = windowHeight + (targetHeight - windowHeight) * morphT;
            const currentLeft = targetLeft * morphT;
            const currentTop = targetTop * morphT;
            const currentRadius = morphT * 20; // 0px -> 20px
            const shadowAlpha = morphT * 0.5;

            heroVideoCardRef.current.style.width = `${currentWidth}px`;
            heroVideoCardRef.current.style.height = `${currentHeight}px`;
            heroVideoCardRef.current.style.left = `${currentLeft}px`;
            heroVideoCardRef.current.style.top = `${currentTop}px`;
            heroVideoCardRef.current.style.borderRadius = `${currentRadius}px`;
            heroVideoCardRef.current.style.boxShadow = morphT > 0.1
                ? `0 ${morphT * 20}px ${morphT * 40}px rgba(0, 0, 0, ${shadowAlpha}), 0 0 0 1px rgba(212, 175, 55, ${morphT * 0.35})`
                : "none";
        }
    }, []);

    // Passive Scroll Event Listener Engine
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
        <div ref={trackRef} className={styles.trackContainer}>
            <div ref={stickyBoxRef} className={styles.stickyBox}>

                {/* ── LAYER 1: HEADLINE & SUBTITLE (Phase 2 Reveal) ────────────────── */}
                <div ref={textContainerRef} className={styles.textContainer} style={{ opacity: 0 }}>
                    <span className={styles.badge}>{currentConfig.badge_text || "ROYAL HAVEN — EST. 2017"}</span>
                    <h1 className={styles.heading}>Two Worlds. One Vision.</h1>
                    <p className={styles.subheading}>
                        Merging the tactile elegance of indigenous fashion with the ethereal beauty of modern artistry.
                    </p>
                </div>

                {/* ── LAYER 2: SPATIAL GRID MOSAIC (Phase 3 Emergence) ─────────────── */}
                <div ref={gridRef} className={styles.gridCanvas} style={{ opacity: 0 }}>

                    {/* Card Slot 1: Wura Couture (Top Left) */}
                    <Link 
                        href={displayCards[0]?.link_url || "/shop"} 
                        className={styles.cardBase}
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

                    {/* Card Slot 2 (CENTER TARGET): BOUNDING BOX ANCHOR FOR MORPHING VIDEO CARD */}
                    <div ref={slotTargetRef} className={styles.heroSlotTarget} />

                    {/* Card Slot 3: Ewa Artistry (Top Right) */}
                    <Link 
                        href={displayCards[1]?.link_url || "/services"} 
                        className={styles.cardBase}
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

                    {/* Card Slot 4: NTAG Digital Passport (Bottom Left) */}
                    <Link 
                        href={displayCards[2]?.link_url || "#styling"} 
                        className={styles.cardBase}
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

                    {/* Card Slot 5: Royal Archives (Bottom Center) */}
                    <Link 
                        href={displayCards[3]?.link_url || "/lookbook"} 
                        className={styles.cardBase}
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

                    {/* Card Slot 6: Besano Atelier (Bottom Right) */}
                    <Link 
                        href={displayCards[4]?.link_url || "/services/book"} 
                        className={styles.cardBase}
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

                {/* ── LAYER 3: THE MORPHING HERO VIDEO CARD (GPU Isolated Compositor Layer) ── */}
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
                    
                    {/* Hero Title Overlay — Fades Out during Phase 1 */}
                    <div ref={videoHeroOverlayRef} className={styles.videoHeroOverlay}>
                        <span className={styles.badge}>{currentConfig.badge_text || "ROYAL HAVEN — EST. 2017"}</span>
                        <h1 className={styles.heroTitle}>{currentConfig.hero_title || "Our Heritage"}</h1>
                        <p className={styles.heroSubtitle}>
                            {currentConfig.hero_subtitle || "The Convergence of Fashion & Artistry"}
                        </p>
                    </div>
                </div>

                {/* Scroll Helper Indicator */}
                <div ref={scrollIndicatorRef} className={styles.scrollIndicator}>
                    <span>Scroll To Morph Matrix</span>
                    <ChevronDown size={15} />
                    <div className={styles.scrollLine} />
                </div>

            </div>
        </div>
    );
}
