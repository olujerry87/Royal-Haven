'use client';

import { useEffect, useRef, useState } from 'react';

export default function SpatialMorphHero({
  heading = "Two Worlds. One Vision.",
  subheading = "Where indigenous luxury fashion converges with modern bridal and couture artistry.",
  videoSrc = "https://bezaleelgroup.ca/wp-content/uploads/2026/02/wura-ewa-hero-loop.mp4",
  cards = [
    { title: "Wura Fashion" },
    { title: "Ewa Artistry" },
    { title: "Heritage Studio" },
    { title: "Bespoke Tailoring" }
  ]
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

  // MATRICES MAP (All animations derive directly from a single math model)
  // Phase 1: Video drops from full screen to layout card (Progress 0.0 -> 0.5)
  const isPastShrinkStart = scrollProgress > 0.45;
  const currentVideoScale = Math.max(1, 1.5 - (scrollProgress * 2 * 0.5));
  const currentVideoWidth = isPastShrinkStart ? '100%' : `${100 - (scrollProgress * 2 * 30)}vw`;
  const currentVideoHeight = isPastShrinkStart ? '100%' : `${100 - (scrollProgress * 2 * 40)}vh`;
  const currentBorderRadius = `${Math.min(16, scrollProgress * 36)}px`;

  // Phase 2: Surrounding assets fade and glide upward smoothly (Progress 0.3 -> 0.7)
  const subElementsOpacity = Math.max(0, Math.min(1, (scrollProgress - 0.3) * 2.5));
  const subElementsTranslateY = Math.max(0, 40 - (scrollProgress - 0.3) * 100);

  return (
    <div 
      ref={containerRef} 
      className="relative h-[300vh] bg-black select-none"
      style={{
        position: 'relative',
        height: '300vh',
        backgroundColor: '#000000',
        userSelect: 'none',
        WebkitUserSelect: 'none',
      }}
    >
      {/* Sticky box prevents layout jumping while internal pieces morph */}
      <div 
        className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center pt-[85px]"
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          width: '100%',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: '85px',
          boxSizing: 'border-box',
        }}
      >
        
        {/* Core Layout Framework */}
        <div 
          className="relative w-full max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 items-center z-10"
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
            boxSizing: 'border-box',
          }}
        >
          
          {/* Left Narrative Frame */}
          <div 
            style={{ 
              opacity: subElementsOpacity, 
              transform: `translateY(${subElementsTranslateY}px)`,
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
              {heading}
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
              {subheading}
            </p>
          </div>

          {/* Center Column: Target Shrinking Video Wrapper Container */}
          <div 
            className="relative h-[50vh] w-full flex items-center justify-center"
            style={{
              position: 'relative',
              height: '50vh',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div 
              style={{
                transform: `scale(${currentVideoScale})`,
                width: currentVideoWidth,
                height: currentVideoHeight,
                borderRadius: currentBorderRadius,
                overflow: 'hidden',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
                transition: 'all 75ms ease-out',
                willChange: 'transform, width, height, border-radius',
                backgroundColor: '#09090b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              className="overflow-hidden shadow-2xl transition-all duration-75 ease-out will-change-[transform,width,height,border-radius] bg-zinc-950 flex items-center justify-center"
            >
              <video
                src={videoSrc}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover pointer-events-none"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  pointerEvents: 'none',
                }}
              />
            </div>
          </div>

          {/* Right Column: Surrounding Grid Cards */}
          <div 
            style={{ 
              opacity: subElementsOpacity, 
              transform: `translateY(${subElementsTranslateY}px)`,
              transition: 'all 75ms ease-out',
              willChange: 'transform, opacity',
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '1rem',
              color: '#ffffff',
            }}
            className="grid grid-cols-2 gap-4 text-white transition-all duration-75 ease-out will-change-transform"
          >
            {cards.map((card, idx) => (
              <div 
                key={idx}
                className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 aspect-square flex flex-col justify-end"
                style={{
                  backgroundColor: '#18181b',
                  padding: '1rem',
                  borderRadius: '0.75rem',
                  border: '1px solid #27272a',
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
                  {card.title}
                </span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
