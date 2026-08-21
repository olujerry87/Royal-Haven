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
            if (!config || cards.length < 6) {
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

        // ── Phase 1: Hero Overlay Title Fade Out (P: 0.0 -> 0.18) ────────────────
        if (videoHeroOverlayRef.current) {
            const overlayOpacity = Math.max(0, 1 - (P / 0.18));
            videoHeroOverlayRef.current.style.opacity = overlayOpacity.toString();
            videoHeroOverlayRef.current.style.transform = `translateY(${P * -60}px)`;
        }

        // ── Phase 2: Headline "Two Worlds. One Vision." Fade In (P: 0.15 -> 0.55) ─
        if (textContainerRef.current) {
            const textOpacity = Math.max(0, Math.min(1, (P - 0.15) / 0.35));
            textContainerRef.current.style.opacity = textOpacity.toString();
            textContainerRef.current.style.transform = `translateY(${(1 - textOpacity) * 25}px)`;
        }

        // ── Phase 3: UNIFIED SIMULTANEOUS BACKGROUND CARDS EXPANSION (P: 0.10 -> 0.70)
        // Background cards AND hero morph together in one fluid, synchronized animation!
        if (gridRef.current) {
            const cardProgress = Math.max(0, Math.min(1, (P - 0.10) / 0.60));
            const cardScale = 0.4 + (cardProgress * 0.6); // 0.4 -> 1.0
            const cardTranslateY = (1 - cardProgress) * 60; // 60px -> 0px

            gridRef.current.style.opacity = cardProgress.toString();
            gridRef.current.style.transform = `scale(${cardScale}) translateY(${cardTranslateY}px)`;
        }

        // ── Scroll Indicator Fade Out ─────────────────────────────────────────────
        if (scrollIndicatorRef.current) {
            const indicatorOpacity = Math.max(0, 1 - (P / 0.20));
            scrollIndicatorRef.current.style.opacity = indicatorOpacity.toString();
        }

        // ── HERO VIDEO MORPH (100vw x 100vh -> Center Slot in 5-Column Matrix) ───
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
            const currentRadius = morphT * 16; // 0px -> 16px
            const shadowAlpha = morphT * 0.45;

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
        video_url: "https://bezaleelgroup.ca/wp-content/uploads/2026/02/wura-ewa-hero-loop.mp4"
    };

    const defaultItems = [
        { id: "c1", title: "Wura Couture", subtitle: "Tactile Indigenous Fashion", badge: "COUTURE", image_url: "https://bezaleelgroup.ca/wp-content/uploads/2026/02/duality-wura.jpg", link_url: "/shop" },
        { id: "c2", title: "Ewa Artistry", subtitle: "Bridal & Beauty", badge: "ARTISTRY", image_url: "https://bezaleelgroup.ca/wp-content/uploads/2026/02/duality-ewa.jpg", link_url: "/services" },
        { id: "c3", title: "NTAG Passport", subtitle: "Digital Provenance", badge: "INNOVATION", image_url: "https://bezaleelgroup.ca/wp-content/uploads/2026/02/heritage-hero.jpg", link_url: "#styling" },
        { id: "c4", title: "Royal Archives", subtitle: "African Craftsmanship", badge: "HERITAGE", image_url: "https://cdn.builder.io/api/v1/image/assets%2F48904b6ada2c4086ab7af82900bb21db%2Ff7dee33d8cd74ba183c59b0e10d0912d", link_url: "/lookbook" },
        { id: "c5", title: "Besano Atelier", subtitle: "Bespoke Tailoring", badge: "BESPOKE", image_url: "https://bezaleelgroup.ca/wp-content/uploads/2026/02/spotlight.jpg", link_url: "/services/book" },
        { id: "c6", title: "2026 Runway", subtitle: "Modern Luxury", badge: "LOOKBOOK", image_url: "https://bezaleelgroup.ca/wp-content/uploads/2026/02/duality-wura.jpg", link_url: "/lookbook" },
        { id: "c7", title: "Àṣọ-Òkè Textiles", subtitle: "Hand-Loom Fabrics", badge: "TEXTILES", image_url: "https://bezaleelgroup.ca/wp-content/uploads/2026/02/duality-ewa.jpg", link_url: "/shop" },
        { id: "c8", title: "Bridal Styling", subtitle: "Ethereal Essence", badge: "BRIDAL", image_url: "https://bezaleelgroup.ca/wp-content/uploads/2026/02/heritage-hero.jpg", link_url: "/services" },
        { id: "c9", title: "Garment NFC", subtitle: "Encrypted Auth", badge: "PASSPORT", image_url: "https://bezaleelgroup.ca/wp-content/uploads/2026/02/spotlight.jpg", link_url: "#styling" },
        { id: "c10", title: "Pop-Up Terminal", subtitle: "Ottawa Pop-up", badge: "POPUP", image_url: "https://cdn.builder.io/api/v1/image/assets%2F48904b6ada2c4086ab7af82900bb21db%2Ff7dee33d8cd74ba183c59b0e10d0912d", link_url: "/checkout" },
    ];

    const displayCards = (cards && cards.length >= 6) ? cards : defaultItems;

    return (
        <div ref={trackRef} className={styles.trackContainer}>
            <div ref={stickyBoxRef} className={styles.stickyBox}>

                {/* ── HEADLINE & SUBTITLE ────────────────────────────────────────── */}
                <div ref={textContainerRef} className={styles.textContainer} style={{ opacity: 0 }}>
                    <span className={styles.badge}>{currentConfig.badge_text || "ROYAL HAVEN — EST. 2017"}</span>
                    <h1 className={styles.heading}>Two Worlds. One Vision.</h1>
                    <p className={styles.subheading}>
                        Merging the tactile elegance of indigenous fashion with the ethereal beauty of modern artistry.
                    </p>
                </div>

                {/* ── DENSE 5-COLUMN CANVAS MATRIX ───────────────────────────────── */}
                <div ref={gridRef} className={styles.gridCanvas} style={{ opacity: 0 }}>

                    {/* Row 1 */}
                    {displayCards.slice(0, 2).map((c, i) => (
                        <Link key={c.id || i} href={c.link_url || "/shop"} className={styles.cardBase}>
                            <div className={styles.cardImageWrapper}>
                                <img src={c.image_url} alt={c.title} className={styles.cardImage} />
                                <span className={styles.cardBadge}>{c.badge}</span>
                            </div>
                            <div className={styles.cardContent}>
                                <h3 className={styles.cardTitle}>{c.title}</h3>
                                <p className={styles.cardSubtitle}>{c.subtitle}</p>
                            </div>
                        </Link>
                    ))}

                    {/* CENTER SLOT (Row 1 Col 3 or Row 2 Col 3) - HERO TARGET */}
                    <div ref={slotTargetRef} className={styles.heroSlotTarget} />

                    {displayCards.slice(2, 4).map((c, i) => (
                        <Link key={c.id || `r1-${i}`} href={c.link_url || "/shop"} className={styles.cardBase}>
                            <div className={styles.cardImageWrapper}>
                                <img src={c.image_url} alt={c.title} className={styles.cardImage} />
                                <span className={styles.cardBadge}>{c.badge}</span>
                            </div>
                            <div className={styles.cardContent}>
                                <h3 className={styles.cardTitle}>{c.title}</h3>
                                <p className={styles.cardSubtitle}>{c.subtitle}</p>
                            </div>
                        </Link>
                    ))}

                    {/* Row 2 & 3 */}
                    {displayCards.slice(4, 9).map((c, i) => (
                        <Link key={c.id || `r2-${i}`} href={c.link_url || "/shop"} className={styles.cardBase}>
                            <div className={styles.cardImageWrapper}>
                                <img src={c.image_url} alt={c.title} className={styles.cardImage} />
                                <span className={styles.cardBadge}>{c.badge}</span>
                            </div>
                            <div className={styles.cardContent}>
                                <h3 className={styles.cardTitle}>{c.title}</h3>
                                <p className={styles.cardSubtitle}>{c.subtitle}</p>
                            </div>
                        </Link>
                    ))}

                </div>

                {/* ── MORPHING HERO VIDEO CARD (GPU Compositor Layer) ─────────────── */}
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
                        <span className={styles.badge}>{currentConfig.badge_text || "ROYAL HAVEN — EST. 2017"}</span>
                        <h1 className={styles.heroTitle}>{currentConfig.hero_title || "Our Heritage"}</h1>
                        <p className={styles.heroSubtitle}>
                            {currentConfig.hero_subtitle || "The Convergence of Fashion & Artistry"}
                        </p>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div ref={scrollIndicatorRef} className={styles.scrollIndicator}>
                    <span>Scroll To Morph Matrix</span>
                    <ChevronDown size={15} />
                    <div className={styles.scrollLine} />
                </div>

            </div>
        </div>
    );
}
