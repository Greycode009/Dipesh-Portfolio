import { useLayoutEffect } from 'react';
import Lenis from 'lenis';
import { MOTION_OK, ScrollTrigger, gsap } from '@/lib/animations';

/**
 * Interpolated scrolling.
 *
 * A mouse wheel jumps roughly 100px per notch, and the browser applies that in
 * one step — which reads as choppy however fast the page renders. Lenis
 * absorbs each jump and eases it out over several frames.
 *
 * Lenis and ScrollTrigger must share one clock, or they run a frame apart and
 * pinned/scrubbed elements visibly lag the page. So Lenis is driven from GSAP's
 * ticker rather than its own requestAnimationFrame loop, and ScrollTrigger is
 * updated from Lenis's scroll event instead of the native one.
 */
let active: Lenis | null = null;

/** The running instance, if smooth scrolling is on. */
export const getLenis = () => active;

export function useSmoothScroll() {
  useLayoutEffect(() => {
    const media = gsap.matchMedia();

    media.add(MOTION_OK, () => {
      const lenis = new Lenis({
        duration: 1.05,
        // Slightly overshooting ease-out: fast to respond, gentle to settle.
        easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
        smoothWheel: true,
        // Touch devices already have native inertia; hijacking it feels worse.
        syncTouch: false,
      });

      active = lenis;
      lenis.on('scroll', ScrollTrigger.update);

      // Lenis only emits for scrolls it drives. Anything else that moves the
      // page — find-in-page, a focus jump, an assistive tool, another script
      // calling scrollTo — would otherwise leave triggers measuring a stale
      // position. Updating is idempotent, so covering both is cheap.
      const onNativeScroll = () => ScrollTrigger.update();
      window.addEventListener('scroll', onNativeScroll, { passive: true });

      const raf = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(raf);

      // GSAP fakes a 33ms frame after a stall, which makes Lenis jump.
      gsap.ticker.lagSmoothing(0);

      ScrollTrigger.refresh();

      return () => {
        window.removeEventListener('scroll', onNativeScroll);
        gsap.ticker.remove(raf);
        gsap.ticker.lagSmoothing(500, 33); // GSAP's default
        lenis.destroy();
        active = null;
      };
    });

    return () => media.revert();
  }, []);
}
