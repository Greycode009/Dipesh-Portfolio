import { useLayoutEffect, useRef } from 'react';
import {
  MOTION_OK,
  ScrollTrigger,
  gsap,
  revealOnScroll,
} from '@/lib/animations';

/**
 * Wires a page up to GSAP. Returns a ref to put on the page's outermost
 * element; everything animated is scoped to inside it.
 *
 * `setup` adds animations beyond the shared [data-reveal] pass. It runs inside
 * a matchMedia block, so it is skipped entirely — and reverted if it was
 * already running — when the visitor prefers reduced motion.
 */
export function usePageAnimations(
  setup?: (scope: HTMLElement) => void | (() => void),
) {
  const scopeRef = useRef<HTMLDivElement>(null);
  const setupRef = useRef(setup);
  setupRef.current = setup;

  useLayoutEffect(() => {
    const scope = scopeRef.current;
    if (!scope) return;

    const media = gsap.matchMedia();

    media.add(MOTION_OK, () => {
      const stopReveals = revealOnScroll(scope);
      const stopSetup = setupRef.current?.(scope);
      return () => {
        stopReveals?.();
        stopSetup?.();
      };
    });

    // Images and webfonts change element positions after first layout, which
    // would leave every trigger measuring against stale coordinates.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
    void fonts?.ready.then(refresh);

    return () => {
      window.removeEventListener('load', refresh);
      media.revert();
    };
  }, []);

  return scopeRef;
}
