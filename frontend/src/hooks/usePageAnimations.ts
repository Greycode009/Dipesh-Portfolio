import { useLayoutEffect, useRef } from 'react';
import { ScrollTrigger, gsap, revealOnScroll } from '@/lib/animations';
import { motionEnabled, subscribeMotion } from '@/lib/motion';

/**
 * Wires a page up to GSAP. Returns a ref to put on the page's outermost
 * element; everything animated is scoped to inside it.
 *
 * `setup` adds animations beyond the shared [data-reveal] pass. Everything
 * runs inside a gsap.context, so reverting it restores the inline styles GSAP
 * wrote — which is what lets the motion toggle take effect immediately rather
 * than on the next reload.
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

    let context: gsap.Context | null = null;
    let disposers: (() => void)[] = [];

    const stop = () => {
      for (const dispose of disposers) dispose();
      disposers = [];
      context?.revert();
      context = null;
    };

    const start = () => {
      if (context || !motionEnabled()) return;
      // Setting up while the page is hidden would apply the opacity:0 start
      // states and then freeze, because requestAnimationFrame is throttled in
      // a background tab. The content would stay invisible until the tab is
      // focused. Wait for it to be visible instead.
      if (document.visibilityState !== 'visible') return;
      context = gsap.context(() => {
        const stopReveals = revealOnScroll(scope);
        const stopSetup = setupRef.current?.(scope);
        disposers = [stopReveals, stopSetup].filter(
          (value): value is () => void => typeof value === 'function',
        );
      }, scope);
    };

    const apply = () => (motionEnabled() ? start() : stop());

    apply();

    // Images and webfonts move elements after first layout, which would leave
    // every trigger measuring stale coordinates.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
    void fonts?.ready.then(refresh);

    const unsubscribe = subscribeMotion(apply);
    document.addEventListener('visibilitychange', apply);

    return () => {
      unsubscribe();
      document.removeEventListener('visibilitychange', apply);
      window.removeEventListener('load', refresh);
      stop();
    };
  }, []);

  return scopeRef;
}
