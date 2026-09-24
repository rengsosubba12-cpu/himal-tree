import { useRef } from 'react';
import { useScroll, useTransform } from 'framer-motion';
import MobileHeroCurtainReveal from './MobileHeroCurtainReveal';
import MobileRamenCanvas3D from './MobileRamenCanvas3D';
import ScrollTextOverlay from './ScrollTextOverlay';

/**
 * MobileHero Component
 * 
 * Completely isolated mobile hero implementation (<1024px).
 * - No overflow-x-hidden on the section tag (preserves scroll observers).
 * - Dedicated MobileHeroCurtainReveal with max-w-[100vw] on branch images.
 * - Dedicated MobileRamenCanvas3D with hardcoded h-[80dvh] min-h-[500px]
 *   and static portrait-optimized camera (fov: 55, pos: [0, 6.5, 6.5]).
 */
export default function MobileHero() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end end'],
  });

  const curtainProgress = useTransform(scrollYProgress, [0, 0.28], [0, 1]);
  const ramenProgress = useTransform(scrollYProgress, [0.24, 1.0], [0, 1]);

  return (
    <section
      ref={heroRef}
      className="relative h-[550vh] w-full"
    >
      <div className="sticky top-0 h-screen h-[100dvh] w-full flex items-center justify-center">
        {/* Phase 1: Mobile Sakura Curtain Reveal with element-level bounds */}
        <MobileHeroCurtainReveal scrollProgress={curtainProgress} />

        {/* Phase 2: Dedicated Mobile 3D Ramen Canvas (hardcoded height, fov 55) */}
        <MobileRamenCanvas3D scrollProgress={ramenProgress} />

        {/* Editorial Quotes Overlay */}
        <ScrollTextOverlay scrollProgress={ramenProgress} />
      </div>
    </section>
  );
}
