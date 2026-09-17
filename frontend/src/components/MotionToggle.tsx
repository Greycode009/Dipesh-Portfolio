import { useEffect, useState } from 'react';
import {
  getMotionPreference,
  subscribeMotion,
  systemPrefersReduced,
  toggleMotionPreference,
} from '@/lib/motion';

/**
 * Motion runs by default for everyone, so this is the control that makes that
 * defensible: anyone who finds the movement uncomfortable can switch it off,
 * and the choice is remembered.
 */
export default function MotionToggle() {
  const [preference, setPreference] = useState(getMotionPreference);

  useEffect(
    () => subscribeMotion(() => setPreference(getMotionPreference())),
    [],
  );

  const isOn = preference === 'on';

  return (
    <button
      type="button"
      onClick={toggleMotionPreference}
      role="switch"
      aria-checked={isOn}
      aria-label={`Turn animations ${isOn ? 'off' : 'on'}`}
      title={
        systemPrefersReduced() && isOn
          ? 'Your system asks for reduced motion. Animations are on anyway — switch them off here.'
          : `Animations are ${isOn ? 'on' : 'off'}`
      }
      className={`nb-box nb-shadow nb-press px-4 py-2 font-mono text-[0.7rem] font-bold uppercase tracking-wider ${
        isOn ? 'bg-primary text-on-primary' : 'bg-surface'
      }`}
    >
      Motion {isOn ? 'on' : 'off'}
    </button>
  );
}
