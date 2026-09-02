'use client';

import { useEffect, useRef, useState } from 'react';

export default function SpatialMorphHero({
  videoSrc = "https://bezaleelgroup.ca/wp-content/uploads/2026/02/wura-ewa-hero-loop.mp4"
}) {
  const containerRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const totalScrollableDistance = rect.height - window.innerHeight;
      
      // Compute normalized progress factor strictly clamped between 0.0 and 1.0
      const progress = Math.max(0, Math.min(1, -rect.top / totalScrollableDistance));
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // PERFORMANCE INTERPOLATION MATRIX (GPU Layer Isolated)
  // Phase 1: Video shrinks linearly into the center grid container layout slot
  const currentVideoScale = Math.max(1, 2.2 - (scrollProgress * 2.4)); 
  const elementBorderRadius = `${Math.min(24, scrollProgress * 48)}px`;

  // Phase 2: Structural text copy and side grids slide up seamlessly (Progress 0.35 -> 0.75)
  const elementsOpacity = Math.max(0, Math.min(1, (scrollProgress - 0.35) * 2.5));
  const elementsTranslateY = Math.max(0, 30 - (scrollProgress - 0.35) * 85);

  return (
    <div 
      ref={containerRef} 
      className="relative h-[250vh] bg-black select-none w-full"
      style={{
        position: 'relative',
        height: '250vh',
        backgroundColor: '#000000',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        width: '100%',
      }}
    >
      {/* Sticky tracking viewport box provides header clearance natively */}
      <div 
        className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center pt-[90px]"
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          width: '100%',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: '90px',
          boxSizing: 'border-box',
        }}
      >
        
        {/* Fixed Structural Layout Matrix Grid */}
        <div 
          className="relative w-full max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 items-center z-10 h-full max-h-[55vh]"
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '72rem',
            margin: '0 auto',
            paddingLeft: '1.5rem',
            paddingRight: '1.5rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem',
            alignItems: 'center',
            zIndex: 10,
            height: '100%',
            maxHeight: '55vh',
            boxSizing: 'border-box',
          }}
        >
          
          {/* Left Text Block */}
          <div 
            style={{ 
              opacity: elementsOpacity, 
              transform: `translate3d(0, ${elementsTranslateY}px, 0)`,
              transition: 'all 75ms ease-out',
              willChange: 'transform, opacity',
              color: '#ffffff',
            }}
            className="text-white hidden md:block transition-all duration-75 ease-out will-change-transform"
          >
            <h2 
              className="text-4xl font-extrabold tracking-tight mb-4"
              style={{
                fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
                fontWeight: 800,
                letterSpacing: '-0.025em',
                marginBottom: '1rem',
                fontFamily: 'var(--font-heritage, serif)',
                color: '#ffffff',
                lineHeight: 1.2,
              }}
            >
              WURA (CLOTHING)
            </h2>
            <p 
              className="text-zinc-400 text-lg leading-relaxed"
              style={{
                color: '#a1a1aa',
                fontSize: '1.05rem',
                lineHeight: 1.6,
                fontFamily: 'var(--font-body, sans-serif)',
              }}
            >
              Experience the natural visual movement of luxury identity layouts.
            </p>
          </div>

          {/* Center Column: Rigid, non-moving spatial anchor slot */}
          <div 
            className="relative w-full h-full min-h-[45vh] flex items-center justify-center z-20"
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              minHeight: '45vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 20,
            }}
          >
            {/* The wrapper handles the scale and rounded borders exclusively via GPU */}
            <div 
              style={{
                transform: `translate3d(0,0,0) scale(${currentVideoScale})`,
                borderRadius: elementBorderRadius,
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
                transition: 'transform 75ms ease-out',
                willChange: 'transform',
                backgroundColor: '#09090b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              className="w-full h-full overflow-hidden shadow-2xl transition-transform duration-75 ease-out will-change-transform bg-zinc-950"
            >
              <video
                src={videoSrc}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover pointer-events-none scale-105"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  pointerEvents: 'none',
                  transform: 'scale(1.05)',
                }}
              />
            </div>
          </div>

          {/* Right Text / Thumbnail Block */}
          <div 
            style={{ 
              opacity: elementsOpacity, 
              transform: `translate3d(0, ${elementsTranslateY}px, 0)`,
              transition: 'all 75ms ease-out',
              willChange: 'transform, opacity',
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '1rem',
              color: '#ffffff',
            }}
            className="grid grid-cols-2 gap-4 text-white transition-all duration-75 ease-out will-change-transform"
          >
            <div 
              className="bg-zinc-900/60 backdrop-blur p-4 rounded-xl border border-zinc-800/80 aspect-square flex flex-col justify-end"
              style={{
                backgroundColor: 'rgba(24, 24, 27, 0.6)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                padding: '1rem',
                borderRadius: '0.75rem',
                border: '1px solid rgba(39, 39, 42, 0.8)',
                aspectRatio: '1 / 1',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
              }}
            >
              <span 
                className="font-semibold text-sm tracking-wide"
                style={{
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  letterSpacing: '0.025em',
                  color: '#FAF9F6',
                  fontFamily: 'var(--font-body, sans-serif)',
                }}
              >
                EWA (ARTISTRY)
              </span>
            </div>
            <div 
              className="bg-zinc-900/60 backdrop-blur p-4 rounded-xl border border-zinc-800/80 aspect-square flex flex-col justify-end"
              style={{
                backgroundColor: 'rgba(24, 24, 27, 0.6)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                padding: '1rem',
                borderRadius: '0.75rem',
                border: '1px solid rgba(39, 39, 42, 0.8)',
                aspectRatio: '1 / 1',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
              }}
            >
              <span 
                className="font-semibold text-sm tracking-wide"
                style={{
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  letterSpacing: '0.025em',
                  color: '#FAF9F6',
                  fontFamily: 'var(--font-body, sans-serif)',
                }}
              >
                HERITAGE
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
