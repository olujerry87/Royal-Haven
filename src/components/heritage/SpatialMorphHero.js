"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { ArrowDown, ChevronDown } from "lucide-react";
import styles from "./SpatialMorphHero.module.css";
import { getHeritageMorphData } from "@/lib/heritageSupabase";

// ── Default 4 right-column thumbnail cards (Square-style 2x2 grid) ─────────
const DEFAULT_GRID_CARDS = [
    { id: "c1", title: "Wura Clothing",   subtitle: "Indigenous Fashion" },
    { id: "c2", title: "Ewa Artistry",    subtitle: "Bridal & Couture"  },
    { id: "c3", title: "Heritage Studio", subtitle: "Bespoke Tailoring" },
    { id: "c4", title: "Lookbook",        subtitle: "The Collection"    },
];

export default function SpatialMorphHero({ initialConfig }) {
    const trackRef            = useRef(null);
    const stickyBoxRef        = useRef(null);
    const slotTargetRef       = useRef(null);
    const heroVideoCardRef    = useRef(null);
    const videoHeroOverlayRef = useRef(null);
    const videoRef            = useRef(null);
    const scrollIndicatorRef  = useRef(null);
    const leftColRef          = useRef(null);
    const rightColRef         = useRef(null);

    const [config, setConfig] = useState(initialConfig || null);

    useEffect(() => {
        let isMounted = true;
        async function loadData() {
            if (!config) {
                const { config: remoteConfig } = await getHeritageMorphData();
                if (isMounted && remoteConfig) setConfig(remoteConfig);
            }
        }
        loadData();
        return () => { isMounted = false; };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // SQUARE GRID REVEAL ENGINE
    //  Phase 1  P 0.00-0.30  Full-bleed video theater. Sides: opacity 0, translated off-screen.
    //  Phase 2  P 0.30-0.60  Video morphs fullscreen to center slot.
    //                         Left slides in from left, right glides up from below.
    //  Phase 3  P 0.60-1.00  All elements fully locked in 3-column mosaic.
    const updateScrollState = useCallback(() => {
        if (!trackRef.current || !stickyBoxRef.current || !heroVideoCardRef.current) return;

        const trackRect = trackRef.current.getBoundingClientRect();
        const wh        = window.innerHeight;
        const ww        = window.innerWidth;
        const totalDist = trackRect.height - wh;
        if (totalDist <= 0) return;

        const P = Math.max(0, Math.min(1, -trackRect.top / totalDist));

        // Hero overlay fade-out (P: 0.0 to 0.20)
        if (videoHeroOverlayRef.current) {
            const oOpacity = Math.max(0, 1 - P / 0.20);
            videoHeroOverlayRef.current.style.opacity       = oOpacity.toString();
            videoHeroOverlayRef.current.style.transform     = "translateY(" + (P * -60) + "px)";
            videoHeroOverlayRef.current.style.pointerEvents = oOpacity > 0.2 ? "auto" : "none";
        }

        // Spatial collapse: fullscreen to center slot (P: 0.0 to 0.60)
        const morphT = Math.max(0, Math.min(1, P / 0.60));

        if (slotTargetRef.current && heroVideoCardRef.current && stickyBoxRef.current) {
            const slotRect   = slotTargetRef.current.getBoundingClientRect();
            const stickyRect = stickyBoxRef.current.getBoundingClientRect();

            const targetLeft   = slotRect.left   - stickyRect.left;
            const targetTop    = slotRect.top    - stickyRect.top;
            const targetWidth  = slotRect.width;
            const targetHeight = slotRect.height;

            const cw = ww + (targetWidth  - ww) * morphT;
            const ch = wh + (targetHeight - wh) * morphT;
            const cl = 0  + (targetLeft   - 0)  * morphT;
            const ct = 0  + (targetTop    - 0)  * morphT;

            heroVideoCardRef.current.style.width        = cw + "px";
            heroVideoCardRef.current.style.height       = ch + "px";
            heroVideoCardRef.current.style.left         = cl + "px";
            heroVideoCardRef.current.style.top          = ct + "px";
            heroVideoCardRef.current.style.borderRadius = (morphT * 20) + "px";
            heroVideoCardRef.current.style.boxShadow    = morphT > 0.05
                ? "0 " + (morphT * 20) + "px " + (morphT * 40) + "px rgba(0,0,0," + (morphT * 0.25) + ")"
                : "none";
        }

        // Side elements emerge (P: 0.30 to 0.65)
        const elemT = Math.max(0, Math.min(1, (P - 0.30) / 0.35));

        if (leftColRef.current) {
            leftColRef.current.style.opacity   = elemT.toString();
            leftColRef.current.style.transform = "translate3d(" + ((1 - elemT) * -30) + "px, 0, 0)";
        }

        if (rightColRef.current) {
            rightColRef.current.style.opacity   = elemT.toString();
            rightColRef.current.style.transform = "translate3d(0, " + ((1 - elemT) * 40) + "px, 0)";
        }

        if (scrollIndicatorRef.current) {
            scrollIndicatorRef.current.style.opacity = Math.max(0, 1 - P / 0.15).toString();
        }
    }, []);

    useEffect(() => {
        let raf;
        const onScroll = () => { raf = requestAnimationFrame(updateScrollState); };
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll, { passive: true });
        updateScrollState();
        return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
            if (raf) cancelAnimationFrame(raf);
        };
    }, [updateScrollState]);

    useEffect(() => {
        videoRef.current && videoRef.current.play().catch(function() {});
    }, [config && config.video_url]);

    const cfg = config || {
        hero_title:    "Our Heritage",
        hero_subtitle: "The Convergence of Indigenous Fashion & Modern Artistry",
        badge_text:    "ROYAL HAVEN — EST. 2017",
        video_url:     "https://bezaleelgroup.ca/wp-content/uploads/2026/02/wura-ewa-hero-loop.mp4",
        cta_text:      "Explore Living Heritage",
        cta_link:      "#duality",
    };

    return (
        <div ref={trackRef} className={styles.trackContainer}>
            <div ref={stickyBoxRef} className={styles.stickyBox}>

                <div className={styles.matrixContainer}>

                    <div
                        ref={leftColRef}
                        className={styles.leftColumn}
                        style={{ opacity: 0, transform: "translate3d(-30px, 0, 0)", willChange: "transform, opacity" }}
                    >
                        <span
                            className={styles.badge}
                            style={{ color: "#FAF9F6", borderColor: "rgba(212,175,55,0.5)", background: "rgba(212,175,55,0.1)" }}
                        >
                            {cfg.badge_text}
                        </span>
                        <h2 className={styles.leftHeading}>Two Worlds.<br />One Vision.</h2>
                        <p className={styles.leftSubtext}>
                            Where indigenous luxury fashion converges with modern bridal and couture artistry.
                        </p>
                    </div>

                    <div className={styles.centerColumn}>
                        <div ref={slotTargetRef} className={styles.heroSlotTarget} />
                    </div>

                    <div
                        ref={rightColRef}
                        className={styles.rightColumn}
                        style={{ opacity: 0, transform: "translate3d(0, 40px, 0)", willChange: "transform, opacity" }}
                    >
                        <div className={styles.cardGrid}>
                            {DEFAULT_GRID_CARDS.map(function(card) {
                                return (
                                    <div key={card.id} className={styles.gridCard}>
                                        <span className={styles.gridCardTitle}>{card.title}</span>
                                        <span className={styles.gridCardSub}>{card.subtitle}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                </div>

                <div ref={heroVideoCardRef} className={styles.morphHeroVideoCard}>
                    <video
                        ref={videoRef}
                        className={styles.heroVideoMedia}
                        src={cfg.video_url}
                        autoPlay
                        loop
                        muted
                        playsInline
                        poster={cfg.poster_image}
                    />
                    <div ref={videoHeroOverlayRef} className={styles.videoHeroOverlay}>
                        <span className={styles.badge} style={{ color: "#FAF9F6", borderColor: "rgba(255,255,255,0.4)" }}>
                            {cfg.badge_text}
                        </span>
                        <h1 className={styles.heroTitle}>{cfg.hero_title}</h1>
                        <p className={styles.heroSubtitle}>{cfg.hero_subtitle}</p>
                        <a href={cfg.cta_link} className={styles.heroCtaBtn}>
                            {cfg.cta_text} <ArrowDown size={14} />
                        </a>
                    </div>
                </div>

                <div ref={scrollIndicatorRef} className={styles.scrollIndicator}>
                    <span>Scroll</span>
                    <ChevronDown size={15} />
                    <div className={styles.scrollLine} />
                </div>

            </div>
        </div>
    );
}
