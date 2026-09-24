import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

/**
 * MobileHeroCurtainReveal Component
 * 
 * Mobile-dedicated version of the Sakura curtain reveal.
 * Completely isolated from the desktop HeroCurtainReveal — no shared code paths.
 * 
 * Mobile-specific fixes:
 * - Branch images at 85vw with max-w-[100vw] to prevent horizontal overflow
 *   at the element level (NOT on any parent wrapper).
 * - 100dvh container for smooth address-bar-aware height.
 * - Same scroll-driven animation logic as desktop but tuned for portrait viewports.
 */
export default function MobileHeroCurtainReveal({ scrollProgress }) {
  const containerRef = useRef(null);
  
  // Fallback to internal scroll tracking if not passed from parent
  const { scrollYProgress: localProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const progress = scrollProgress || localProgress;

  // --- Scroll Motion Transforms (Curtain Opening Phase: 0.0 -> 0.70) ---
  
  // Left Sakura Branch (Anchored top-left): exits left and slightly upward
  const leftX = useTransform(progress, [0, 0.70], ['0%', '-135%']);
  const leftY = useTransform(progress, [0, 0.70], ['0%', '-35%']);
  const leftScale = useTransform(progress, [0, 0.70], [1.0, 1.08]);
  const leftOpacity = useTransform(progress, [0, 0.50, 0.70], [1.0, 0.85, 0.0]);

  // Right Sakura Branch (Anchored top-right): exits right and slightly upward
  const rightX = useTransform(progress, [0, 0.70], ['0%', '135%']);
  const rightY = useTransform(progress, [0, 0.70], ['0%', '-35%']);
  const rightScale = useTransform(progress, [0, 0.70], [1.0, 1.08]);
  const rightOpacity = useTransform(progress, [0, 0.50, 0.70], [1.0, 0.85, 0.0]);

  // Center Calligraphy Logo: gently emerges from behind the branches
  const logoScale = useTransform(progress, [0, 0.65], [0.88, 1.0]);
  const logoIntroOpacity = useTransform(progress, [0, 0.35], [0.45, 1.0]);

  // Seamless Handoff Phase (0.78 -> 0.98): logo gracefully floats up and fades as 3D bowl enters
  const logoHandoffOpacity = useTransform(progress, [0.78, 0.98], [1.0, 0.0]);
  const logoHandoffY = useTransform(progress, [0.78, 0.98], [0, -35]);

  // Combined logo opacity (intro fade-in * handoff fade-out)
  const logoOpacity = useTransform(
    [logoIntroOpacity, logoHandoffOpacity],
    ([intro, exit]) => Number(intro) * Number(exit)
  );

  // Subtle Scroll Indicator at bottom: disappears right after user starts scrolling
  const hintOpacity = useTransform(progress, [0, 0.08], [1.0, 0.0]);
  const hintY = useTransform(progress, [0, 0.08], [0, 15]);

  // Visibility toggle to keep GPU/compositor lean after reveal phase completes
  const containerVisibility = useTransform(progress, (v) => (v >= 0.99 ? 'hidden' : 'visible'));

  return (
    <motion.div
      ref={containerRef}
      style={{ visibility: containerVisibility }}
      className="absolute inset-0 z-10 w-full h-full pointer-events-none select-none overflow-hidden flex items-center justify-center"
      aria-label="Himal Tree Curtain Reveal"
    >
      {/* ================================================================
          LAYER 1: Centered Calligraphy Logo & Tagline (z-index: 1)
          ================================================================ */}
      <motion.div
        style={{
          scale: logoScale,
          opacity: logoOpacity,
          y: logoHandoffY,
        }}
        className="relative z-1 flex flex-col items-center justify-center px-4 max-w-full"
      >
        <img
          src="/assets/logo.png"
          alt="Himal Tree — Himal 나무"
          className="w-[clamp(280px,50vw,720px)] max-w-[85vw] h-auto object-contain filter drop-shadow-[0_4px_24px_rgba(139,38,38,0.12)]"
          loading="eager"
          decoding="async"
        />
        
        {/* Subtle Luxury Korean Editorial Tagline */}
        <motion.div
          style={{ opacity: logoOpacity }}
          className="mt-4 text-center space-y-1"
        >
          <p className="font-script italic text-lg tracking-widest text-ink/80">
            A Korean Café in Siliguri
          </p>
          <p className="font-sans text-[11px] tracking-[0.4em] uppercase text-ink/50">
            실리구리의 한국 카페
          </p>
        </motion.div>
      </motion.div>

      {/* ================================================================
          LAYER 2: Left Sakura Branch (Anchored Top-Left, z-index: 10)
          max-w-[100vw] on the motion.img directly prevents horizontal overflow.
          ================================================================ */}
      <motion.img
        src="/assets/covers/CoverLeft.png"
        alt="Sakura Branch Left"
        style={{
          x: leftX,
          y: leftY,
          scale: leftScale,
          opacity: leftOpacity,
          willChange: 'transform, opacity',
        }}
        className="absolute top-0 left-0 z-10 origin-top-left pointer-events-none w-[85vw] max-w-[100vw] h-auto object-contain filter drop-shadow-[0_12px_32px_rgba(0,0,0,0.06)]"
        loading="eager"
        decoding="async"
      />

      {/* ================================================================
          LAYER 3: Right Sakura Branch (Anchored Top-Right, z-index: 10)
          max-w-[100vw] on the motion.img directly prevents horizontal overflow.
          ================================================================ */}
      <motion.img
        src="/assets/covers/CoverRight.png"
        alt="Sakura Branch Right"
        style={{
          x: rightX,
          y: rightY,
          scale: rightScale,
          opacity: rightOpacity,
          willChange: 'transform, opacity',
        }}
        className="absolute top-0 right-0 z-10 origin-top-right pointer-events-none w-[85vw] max-w-[100vw] h-auto object-contain filter drop-shadow-[0_12px_32px_rgba(0,0,0,0.06)]"
        loading="eager"
        decoding="async"
      />

      {/* ================================================================
          LAYER 4: Subtle Scroll-to-Explore Cue (z-index: 20)
          ================================================================ */}
      <motion.div
        style={{
          opacity: hintOpacity,
          y: hintY,
        }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center pointer-events-none"
      >
        <span className="font-sans text-[10px] tracking-[0.35em] uppercase text-ink/40 mb-2">
          Scroll to Explore
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-[1px] h-6 bg-ink/25"
        />
      </motion.div>
    </motion.div>
  );
}
