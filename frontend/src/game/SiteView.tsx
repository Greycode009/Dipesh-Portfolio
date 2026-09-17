import { useCallback, useEffect, useState, type ComponentType } from 'react';
import PublicLayout from '@/components/PublicLayout';
import Room from './Room';

const VIEW_KEY = 'view';

/**
 * The room is the site. The readable pages are still rendered — into the
 * prerendered HTML, and for anyone who chooses them — so crawlers, screen
 * readers and visitors without JavaScript get the real content rather than an
 * empty canvas.
 *
 * On the server and on the first client render this is the page, which keeps
 * hydration honest; an effect then swaps in the room.
 */
export default function SiteView({ Page }: { Page: ComponentType }) {
  const [hydrated, setHydrated] = useState(false);
  const [preferPage, setPreferPage] = useState(false);

  useEffect(() => {
    try {
      setPreferPage(localStorage.getItem(VIEW_KEY) === 'page');
    } catch {
      // Storage blocked; the room is the default either way.
    }
    setHydrated(true);
  }, []);

  const remember = useCallback((value: 'room' | 'page') => {
    try {
      localStorage.setItem(VIEW_KEY, value);
    } catch {
      // The choice still holds for this session.
    }
  }, []);

  if (!hydrated || preferPage) {
    return (
      <PublicLayout>
        {hydrated && (
          <div className="border-b border-border bg-surface px-4 py-3 text-center md:px-8">
            <button
              type="button"
              onClick={() => {
                remember('room');
                setPreferPage(false);
              }}
              className="font-pixel text-[0.55rem] text-primary underline-offset-4 hover:underline"
            >
              ENTER THE ROOM
            </button>
          </div>
        )}
        <Page />
      </PublicLayout>
    );
  }

  return (
    <Room
      onExit={() => {
        remember('page');
        setPreferPage(true);
      }}
    />
  );
}
