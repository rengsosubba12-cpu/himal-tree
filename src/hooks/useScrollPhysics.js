import { useScroll, useTransform, useSpring } from 'framer-motion';

/**
 * Spring-based smooth scroll physics hook.
 * Wraps a MotionValue in spring physics configured for luxury editorial deceleration.
 *
 * @param {import('framer-motion').MotionValue<number>} value - Input MotionValue to smooth
 * @returns {import('framer-motion').MotionValue<number>} Smoothed MotionValue
 */
export function useSmoothScroll(value) {
  return useSpring(value, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });
}

/**
 * Parallax transform hook for depth and layered movement.
 * Takes a MotionValue and a distance number, returning a transformed MotionValue
 * mapping [0, 1] to [-distance, distance].
 *
 * @param {import('framer-motion').MotionValue<number>} value - Scroll progress or motion value (typically 0 to 1)
 * @param {number} distance - Maximum parallax travel distance in pixels
 * @returns {import('framer-motion').MotionValue<number>}
 */
export function useParallax(value, distance) {
  return useTransform(value, [0, 1], [-distance, distance]);
}

/**
 * Maps scroll progress to keyframe-based opacity and vertical translation ranges.
 * Perfect for editorial magazine fade-in and slide-up/out scene transitions.
 *
 * @param {import('framer-motion').MotionValue<number>} scrollYProgress - Normalized scroll progress MotionValue
 * @param {number} start - Progress value when entry begins
 * @param {number} end - Progress value when exit completes
 * @returns {{ opacity: import('framer-motion').MotionValue<number>, y: import('framer-motion').MotionValue<number> }}
 */
export function useScrollRange(scrollYProgress, start, end) {
  const opacity = useTransform(
    scrollYProgress,
    [start, start + 0.05, end - 0.05, end],
    [0, 1, 1, 0]
  );

  const y = useTransform(
    scrollYProgress,
    [start, start + 0.05, end - 0.05, end],
    [60, 0, 0, -60]
  );

  return { opacity, y };
}

/**
 * Primary scroll physics hook for HIMAL TREE.
 * Wraps framer-motion's useScroll with editorial physics and transform helpers.
 *
 * @param {React.RefObject<HTMLElement | null>} [containerRef] - Optional target container ref
 * @returns {{
 *   scrollYProgress: import('framer-motion').MotionValue<number>,
 *   scrollY: import('framer-motion').MotionValue<number>,
 *   createScrollTransform: (inputRange: number[], outputRange: any[]) => import('framer-motion').MotionValue<any>
 * }}
 */
export function useScrollPhysics(containerRef) {
  const { scrollYProgress, scrollY } = useScroll(
    containerRef ? { target: containerRef } : {}
  );

  const createScrollTransform = (inputRange, outputRange) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useTransform(scrollYProgress, inputRange, outputRange);
  };

  return {
    scrollYProgress,
    scrollY,
    createScrollTransform,
  };
}

export default useScrollPhysics;
