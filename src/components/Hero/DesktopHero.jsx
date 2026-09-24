import { useRef } from 'react';
import { useScroll, useTransform } from 'framer-motion';
import HeroCurtainReveal from './HeroCurtainReveal';
import RamenCanvas3D from './RamenCanvas3D';
import ScrollTextOverlay from './ScrollTextOverlay';

/**
 * DesktopHero Component
 * 
 * 100% pristine, untouched desktop implementation.
 * Rendered strictly on large viewports (>=1024px / lg).
 * Contains ZERO isMobile or dynamic width hooks.
 */
export default function DesktopHero() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end end'],
  });

  // Seamless cinematic timeline:
  // Phase 1: 0.00 -> 0.28 (Sakura Curtain Reveal of Calligraphy Logo)
  // Phase 2: 0.24 -> 1.00 (3D Ramen Bowl Assembly & Editorial Quotes)
  const curtainProgress = useTransform(scrollYProgress, [0, 0.28], [0, 1]);
  const ramenProgress = useTransform(scrollYProgress, [0.24, 1.0], [0, 1]);

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative h-[550vh] w-full"
    >
      <div className="sticky top-0 h-screen h-[100dvh] w-full overflow-hidden">
        {/* Phase 1: Responsive Scroll-Driven Sakura Curtain Reveal */}
        <HeroCurtainReveal scrollProgress={curtainProgress} />

        {/* Phase 2: 3D Scroll-Driven Ramen Bowl Assembly */}
        <RamenCanvas3D scrollProgress={ramenProgress} className="absolute inset-0 w-full h-full" />

        {/* Editorial Quotes Overlay */}
        <ScrollTextOverlay scrollProgress={ramenProgress} />
      </div>
    </section>
  );
}
