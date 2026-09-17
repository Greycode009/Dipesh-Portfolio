export type MotionPreference = 'on' | 'off';

const STORAGE_KEY = 'motion';

/**
 * Motion is on by default for everyone, including visitors whose system asks
 * for reduced motion.
 *
 * That is a deliberate departure from the usual advice, so it comes with the
 * thing the advice actually exists to guarantee: a control the visitor can
 * reach. The system preference seeds nothing, but the toggle is in the footer
 * on every page and the choice is remembered.
 */
const DEFAULT: MotionPreference = 'on';

function read(): MotionPreference {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'on' || stored === 'off') return stored;
  } catch {
    // Blocked storage — fall back to the default.
  }
  return DEFAULT;
}

let current: MotionPreference =
  typeof window === 'undefined' ? DEFAULT : read();

const listeners = new Set<() => void>();

export const getMotionPreference = () => current;
export const motionEnabled = () => current === 'on';

export function setMotionPreference(next: MotionPreference) {
  if (next === current) return;
  current = next;
  try {
    localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // The choice still holds for this session.
  }
  for (const listener of listeners) listener();
}

export function toggleMotionPreference() {
  setMotionPreference(current === 'on' ? 'off' : 'on');
}

/** Notifies when the preference changes, so animations can start or revert. */
export function subscribeMotion(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** True when the visitor's system asks for reduced motion — used to explain
 *  the toggle, not to override it. */
export function systemPrefersReduced(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true
  );
}
