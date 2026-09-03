"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { ArrowDown, ChevronDown } from "lucide-react";
import styles from "./SpatialMorphHero.module.css";
import { getHeritageMorphData } from "@/lib/heritageSupabase";

// ── Default scattered surrounding cards (Square-style) ──────────────────────
// Each card has: label, sublabel, and a fixed CSS position (top/left/right/bottom in %)
// These scatter around the shrinking center video like the Square CA homepage.
const SCATTER_CARDS = [
  { id: "c1", title: "Wura Clothing",   subtitle: "Indigenous Fashion", pos: { top: "12%",  left: "3%" } },
  { id: "c2", title: "Ewa Artistry",    subtitle: "Bridal & Couture",   pos: { top: "14%",  right: "4%" } },
  { id: "c3", title: "Heritage Studio", subtitle: "Bespoke Tailoring",  pos: { bottom: "18%", left: "5%" } },
  { id: "c4", title: "Lookbook",        subtitle: "The Collection",     pos: { bottom: "16%", right: "3%" } },
];

export default function SpatialMorphHero({ initialConfig }) {
  const trackRef            = useRef(null);
  const stickyBoxRef        = useRef(null);
  const heroVideoCardRef    = useRef(null);
  const videoHeroOverlayRef = useRef(null);
  const videoRef            = useRef(null);
  const scrollIndicatorRef  = useRef(null);
  const scatterRefs         = useRef([]);

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

  // ── SQUARE GRID REVEAL ENGINE (GPU-only, no layout thrashing) ──────────────
  //
  //  APPROACH: The video card stays at position:absolute top:0 left:0 width:100% height:100%
  //  at all times. We ONLY use CSS transform: scale() + translate() — no width/height/top/left
  //  mutations during scroll. This is 100% GPU-composited.
  //
  //  The target final state of the video is a centered card ~40% of viewport width.
  //  We compute the transform needed to produce that visual without moving the element.
  //
  //  Phase 1  P 0.00 → 0.25   Full-bleed theater. Overlay text fades. Cards hidden.
  //  Phase 2  P 0.25 → 0.70   Video shrinks via transform:scale() to center card.
  //                             Scatter cards fade in and translate to their positions.
  //  Phase 3  P 0.70 → 1.00   Everything locked. Mosaic complete.

  const updateScrollState = useCallback(() => {
    if (!trackRef.current || !stickyBoxRef.current || !heroVideoCardRef.current) return;

    const trackRect = trackRef.current.getBoundingClientRect();
    const wh        = window.innerHeight;
    const ww        = window.innerWidth;
    const totalDist = trackRect.height - wh;
    if (totalDist <= 0) return;

    const P = Math.max(0, Math.min(1, -trackRect.top / totalDist));

    // ── Phase 1: Hero overlay fades out (P: 0.0 → 0.20) ──
    if (videoHeroOverlayRef.current) {
      const oOpacity = Math.max(0, 1 - P / 0.20);
      videoHeroOverlayRef.current.style.opacity       = oOpacity.toString();
      videoHeroOverlayRef.current.style.transform     = "translateY(" + (P * -50) + "px)";
      videoHeroOverlayRef.current.style.pointerEvents = oOpacity > 0.1 ? "auto" : "none";
    }

    // ── Phase 2: GPU transform-only morph (P: 0.25 → 0.70) ──
    const morphT = Math.max(0, Math.min(1, (P - 0.0) / 0.70));

    // Target card: centered, ~44vw wide, ~55vh tall
    const targetW = Math.min(ww * 0.44, 520);
    const targetH = Math.min(wh * 0.55, 480);

    // Scale factors from full viewport to target card size
    const scaleX = targetW / ww;
    const scaleY = targetH / wh;

    // The video card is top:0 left:0 width:100% height:100% of stickyBox.
    // stickyBox is 100vh tall, 100vw wide. After scaling from center (default transform-origin),
    // the card is centered automatically. We add translateY to account for the nav header (85px)
    // pushing content down — we need the final card to sit in the visual center of the content area
    // (below the 85px nav). 
    // translateY offset: push card down by half the nav height as a fraction of full height
    const navOffset = 42; // half of 85px nav — shifts card center down into content zone

    const currentScaleX = 1 + (scaleX - 1) * morphT;
    const currentScaleY = 1 + (scaleY - 1) * morphT;
    const currentTY     = navOffset * morphT; // px
    const currentRadius = 20 * morphT;

    heroVideoCardRef.current.style.transform     =
      "translateY(" + currentTY + "px) scale(" + currentScaleX + ", " + currentScaleY + ")";
    heroVideoCardRef.current.style.borderRadius  = currentRadius + "px";
    heroVideoCardRef.current.style.boxShadow     = morphT > 0.1
      ? "0 " + (morphT * 24) + "px " + (morphT * 48) + "px rgba(0,0,0," + (morphT * 0.35) + ")"
      : "none";

    // ── Phase 2+: Scatter cards fade in (P: 0.30 → 0.65) ──
    const cardT = Math.max(0, Math.min(1, (P - 0.30) / 0.35));

    scatterRefs.current.forEach(function(el, i) {
      if (!el) return;
      // Each card staggers slightly
      const stagger = Math.max(0, Math.min(1, (P - (0.30 + i * 0.04)) / 0.30));
      el.style.opacity   = stagger.toString();
      el.style.transform = "translateY(" + ((1 - stagger) * 28) + "px)";
    });

    // ── Scroll indicator fades early ──
    if (scrollIndicatorRef.current) {
      scrollIndicatorRef.current.style.opacity = Math.max(0, 1 - P / 0.12).toString();
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

        {/* The morphing video card — stays in the DOM at fixed size, only transform changes */}
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
          {/* Phase 1 overlay — fades out as scroll begins */}
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

        {/* Scatter cards — freely positioned around the viewport, Square-style */}
        {SCATTER_CARDS.map(function(card, i) {
          return (
            <div
              key={card.id}
              ref={function(el) { scatterRefs.current[i] = el; }}
              className={styles.scatterCard}
              style={{
                position: "absolute",
                opacity: 0,
                willChange: "transform, opacity",
                ...card.pos,
              }}
            >
              <span className={styles.scatterCardTitle}>{card.title}</span>
              <span className={styles.scatterCardSub}>{card.subtitle}</span>
            </div>
          );
        })}

        {/* Scroll indicator */}
        <div ref={scrollIndicatorRef} className={styles.scrollIndicator}>
          <span>Scroll</span>
          <ChevronDown size={15} />
          <div className={styles.scrollLine} />
        </div>

      </div>
    </div>
  );
}
