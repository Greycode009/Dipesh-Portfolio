import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getLenis } from '@/hooks/useSmoothScroll';

/**
 * Resets scroll position on navigation. Renders nothing.
 *
 * Lenis keeps its own target position, so a bare window.scrollTo would be
 * undone on the next frame as it eased back to where it thought it was.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
