import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

/**
 * Every animation in the app runs inside this. `gsap.matchMedia` re-runs the
 * setup when the media query changes and reverts everything it created when it
 * stops matching, so a visitor who turns on "reduce motion" gets a static site
 * without a reload — and nothing is left half-animated.
 */
/**
 * Development escape hatch: `?motion` forces animations on even when the OS
 * asks for reduced motion, so they can be checked on a machine that has the
 * setting enabled. Stripped from production builds.
 */
const forceMotion =
  import.meta.env.DEV &&
  typeof window !== 'undefined' &&
  new URLSearchParams(window.location.search).has('motion');

export const MOTION_OK = forceMotion
  ? 'all'
  : '(prefers-reduced-motion: no-preference)';

/** gsap.to on an empty array warns; this keeps the console honest. */
function animateIn(targets: HTMLElement[], stagger: number) {
  if (targets.length === 0) return;
  gsap.to(targets, {
    opacity: 1,
    y: 0,
    duration: 0.7,
    ease: 'power3.out',
    stagger,
    overwrite: 'auto',
  });
}

/**
 * Reveals every [data-reveal] descendant as it scrolls into view, batched so
 * one ScrollTrigger serves a whole group rather than one each.
 *
 * Anything already in or above the viewport is revealed immediately, and that
 * is re-checked on every ScrollTrigger refresh. This is what makes reloading
 * part-way down the page work: those elements are above the viewport and will
 * never be scrolled *into*, so waiting for an onEnter that cannot come would
 * leave them invisible for good.
 */
export function revealOnScroll(scope: HTMLElement) {
  const targets = gsap.utils.toArray<HTMLElement>('[data-reveal]', scope);
  if (targets.length === 0) return;

  gsap.set(targets, { opacity: 0, y: 28 });

  /** Takes ownership of elements not yet revealed, so nothing animates twice. */
  const claim = (elements: HTMLElement[]) =>
    elements.filter((element) => {
      if (element.dataset.revealed) return false;
      element.dataset.revealed = 'true';
      return true;
    });

  const revealAlreadyInView = () =>
    animateIn(
      claim(
        targets.filter(
          (element) =>
            element.getBoundingClientRect().top < window.innerHeight * 0.92,
        ),
      ),
      0.07,
    );

  ScrollTrigger.batch(targets, {
    start: 'top 88%',
    once: true,
    onEnter: (batch) => animateIn(claim(batch as HTMLElement[]), 0.09),
  });

  revealAlreadyInView();
  ScrollTrigger.addEventListener('refresh', revealAlreadyInView);

  return () => {
    ScrollTrigger.removeEventListener('refresh', revealAlreadyInView);
    for (const element of targets) delete element.dataset.revealed;
  };
}

/**
 * Infinite marquee. Driven by GSAP rather than a CSS keyframe so it can react
 * to scrolling: the page's scroll velocity speeds it up and flips its
 * direction, which is what stops a ticker feeling like wallpaper.
 *
 * The track must contain the same content twice; it wraps at -50%.
 */
export function infiniteMarquee(track: HTMLElement, baseSpeed = 0.6) {
  /**
   * Distance to travel before the second copy sits exactly where the first
   * started. Not scrollWidth/2: a flex `gap` sits between every item, so half
   * the total width is half a gap short and the wrap visibly jumps.
   */
  const wrapDistance = () => {
    const items = track.children;
    const perSet = Math.floor(items.length / 2);
    if (perSet < 1) return track.scrollWidth / 2;
    return (
      (items[perSet] as HTMLElement).offsetLeft -
      (items[0] as HTMLElement).offsetLeft
    );
  };

  const setX = gsap.quickSetter(track, 'x', 'px');
  let offset = 0;
  let direction = 1;
  let velocityBoost = 0;

  const tick = (_time: number, delta: number) => {
    // delta is milliseconds; normalise to a per-frame step at any refresh rate.
    const step = (baseSpeed + velocityBoost) * (delta / 16.6667);
    offset -= step * direction;

    const width = wrapDistance();
    if (width > 0) {
      // Wrap in both directions so a scroll-up flip never leaves a gap.
      if (offset <= -width) offset += width;
      if (offset > 0) offset -= width;
    }

    setX(offset);
    velocityBoost *= 0.94; // ease back to the resting speed
  };

  gsap.ticker.add(tick);

  const trigger = ScrollTrigger.create({
    trigger: track,
    start: 'top bottom',
    end: 'bottom top',
    onUpdate: (self) => {
      direction = self.direction;
      velocityBoost = Math.min(Math.abs(self.getVelocity()) / 240, 14);
    },
  });

  return () => {
    gsap.ticker.remove(tick);
    trigger.kill();
    gsap.set(track, { x: 0 });
  };
}
