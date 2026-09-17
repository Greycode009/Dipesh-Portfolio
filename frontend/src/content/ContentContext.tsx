import {
  createContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { fetchSiteContent, type SiteContent } from '@/api/content';

export const ContentContext = createContext<SiteContent | null>(null);

interface ContentProviderProps {
  /**
   * Content already in hand — embedded in the prerendered HTML by the build,
   * or passed directly when rendering on the server. Rendering from this first
   * is what keeps hydration matching and stops the page flashing empty.
   */
  initial?: SiteContent | null;
  children: ReactNode;
}

/**
 * Serves the whole site's content from the CMS.
 *
 * There is no copy of this data in the repository: the database is the only
 * source. The trade is that the site needs the API — when it cannot be reached
 * and there is no embedded copy to fall back on, that is said plainly rather
 * than rendered as an empty page.
 */
export function ContentProvider({ initial = null, children }: ContentProviderProps) {
  const [content, setContent] = useState<SiteContent | null>(initial);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetchSiteContent()
      .then((fresh) => {
        if (!cancelled) setContent(fresh);
      })
      .catch(() => {
        // Keep whatever was embedded; only report failure if we have nothing.
        if (!cancelled && !initial) setFailed(true);
      });

    return () => {
      cancelled = true;
    };
    // Runs once: `initial` never changes after mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!content) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-6 text-content">
        {failed ? (
          <div className="nb-card max-w-md p-8">
            <p className="font-display text-xl uppercase">Content unavailable</p>
            <p className="mt-3 font-medium leading-snug text-muted">
              This site loads its content from the CMS API, which is not
              responding. Nothing is cached locally, so there is nothing to
              show until it is back.
            </p>
          </div>
        ) : (
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
            Loading…
          </p>
        )}
      </div>
    );
  }

  return (
    <ContentContext.Provider value={content}>{children}</ContentContext.Provider>
  );
}
