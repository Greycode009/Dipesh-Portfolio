import { useLayoutEffect } from 'react';
import Lenis from 'lenis';
import { ScrollTrigger, gsap } from '@/lib/animations';
import { motionEnabled, subscribeMotion } from '@/lib/motion';

let active: Lenis | null = null;

/** The running instance, if smooth scrolling is on. */
export const getLenis = () => active;

/**
 * Interpolated scrolling.
 *
 * A mouse wheel jumps roughly 100px per notch, and the browser applies that in
 * one step — which reads as choppy however fast the page renders. Lenis
 * absorbs each jump and eases it out over several frames.
 *
 * Lenis and ScrollTrigger must share one clock, or they run a frame apart and
 * scrubbed elements visibly lag the page. So Lenis is driven from GSAP's
 * ticker rather than its own requestAnimationFrame loop.
 */
export function useSmoothScroll() {
  useLayoutEffect(() => {
    const stop = () => {
      if (!active) return;
      active.destroy();
      active = null;
    };

    const start = () => {
      if (active || !motionEnabled()) return;

      const lenis = new Lenis({
        duration: 1.05,
        // Fast to respond, gentle to settle.
        easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
        smoothWheel: true,
        // Touch devices already have native inertia; hijacking it feels worse.
        syncTouch: false,
      });

      active = lenis;
      lenis.on('scroll', ScrollTrigger.update);
      ScrollTrigger.refresh();
    };

    // Lenis only emits for scrolls it drives. Anything else that moves the
    // page — find-in-page, a focus jump, an assistive tool, another script
    // calling scrollTo — would otherwise leave triggers measuring a stale
    // position. Updating is idempotent, so covering both is cheap.
    const onNativeScroll = () => ScrollTrigger.update();
    window.addEventListener('scroll', onNativeScroll, { passive: true });

    // One ticker serves both states: the callback is a no-op while smooth
    // scrolling is off, so toggling never adds or removes ticker callbacks.
    const raf = (time: number) => active?.raf(time * 1000);
    gsap.ticker.add(raf);
    // GSAP fakes a 33ms frame after a stall, which makes Lenis lurch.
    gsap.ticker.lagSmoothing(0);

    const apply = () => (motionEnabled() ? start() : stop());
    apply();
    const unsubscribe = subscribeMotion(apply);

    return () => {
      unsubscribe();
      window.removeEventListener('scroll', onNativeScroll);
      gsap.ticker.remove(raf);
      gsap.ticker.lagSmoothing(500, 33); // GSAP's default
      stop();
    };
  }, []);
}
