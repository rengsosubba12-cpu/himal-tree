import { useState, useEffect } from 'react';

/**
 * Safe Client-Side Screen Detection Hook
 * Never reads window.innerWidth directly in the component render cycle or R3F Canvas root.
 * Defaults to false for SSR stability, updates safely in useEffect after mount.
 *
 * @param {number} breakpoint - Screen width threshold in pixels (default: 768)
 * @returns {boolean} Whether viewport width is strictly below breakpoint
 */
export function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < breakpoint);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [breakpoint]);

  return isMobile;
}

export default useIsMobile;
