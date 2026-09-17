import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import { ApiError } from '@/api/client';
import { cms, type GuestbookEntry } from '@/api/cms';

const POLL_MS = 20_000;
const MAX_MESSAGE = 280;

function timeAgo(iso: string): string {
  const seconds = Math.round((Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

/**
 * A public wall. Unlike the rest of the site, this reads from the API at
 * runtime rather than from content baked into the bundle — it has to, since
 * the whole point is that it changes without a deploy.
 *
 * Which also means it is the one part of the site that needs the API to be up.
 * When it is not, the section says so plainly instead of rendering an empty
 * box that looks broken.
 */
export default function Guestbook() {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [state, setState] = useState<'loading' | 'ready' | 'offline'>('loading');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending'>('idle');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const listRef = useRef<HTMLUListElement>(null);

  const load = useCallback(async () => {
    try {
      setEntries(await cms.guestbook.list());
      setState('ready');
    } catch {
      setState('offline');
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  // Poll so other people's messages turn up without a refresh. Paused while
  // the tab is hidden — nobody is reading it then.
  useEffect(() => {
    const timer = window.setInterval(() => {
      if (document.visibilityState === 'visible') void load();
    }, POLL_MS);
    return () => window.clearInterval(timer);
  }, [load]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setStatus('sending');
    setError('');
    setNotice('');

    try {
      const result = await cms.guestbook.sign(name.trim(), message.trim());
      setMessage('');
      if (result.entry) setEntries((current) => [result.entry!, ...current]);
      else setNotice(result.message);
      await load();
    } catch (cause) {
      if (cause instanceof ApiError && Array.isArray(cause.details)) {
        setError(
          (cause.details as { message: string }[])
            .map((detail) => detail.message)
            .join(' · '),
        );
      } else {
        setError(
          cause instanceof ApiError ? cause.message : 'Could not post that.',
        );
      }
    } finally {
      setStatus('idle');
    }
  };

  const remaining = MAX_MESSAGE - message.length;
  const inputClass =
    'nb-box w-full bg-background px-4 py-3 font-medium outline-none placeholder:text-muted/70 focus:bg-surface';

  return (
    <section aria-labelledby="guestbook-heading">
      <p className="eyebrow" data-reveal>
        02 — The wall
      </p>
      <h2
        id="guestbook-heading"
        className="mt-4 font-display text-[clamp(1.75rem,5vw,3rem)] uppercase leading-[0.95]"
        data-reveal
      >
        Leave a <span className="nb-mark">message</span>
      </h2>
      <p className="mt-4 max-w-xl font-medium leading-snug text-muted" data-reveal>
        Public — anyone visiting this page can read what you write.
      </p>

      {state === 'offline' ? (
        <div className="nb-card mt-8 p-6" data-reveal>
          <p className="font-display text-lg uppercase">The wall is offline</p>
          <p className="mt-2 font-medium leading-snug text-muted">
            Messages are served by the CMS API, which is not reachable right
            now. Everything else on this page works.
          </p>
        </div>
      ) : (
        <>
          <form onSubmit={handleSubmit} className="nb-card mt-8 p-6" data-reveal>
            <div className="grid gap-4 sm:grid-cols-[minmax(0,14rem)_1fr]">
              <div>
                <label htmlFor="gb-name" className="eyebrow mb-2 block">
                  Name
                </label>
                <input
                  id="gb-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  maxLength={40}
                  required
                  placeholder="Who are you?"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="gb-message" className="eyebrow mb-2 block">
                  Message
                </label>
                <input
                  id="gb-message"
                  value={message}
                  onChange={(event) =>
                    setMessage(event.target.value.slice(0, MAX_MESSAGE))
                  }
                  required
                  placeholder="Say hello…"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
              <span className="font-mono text-[0.65rem] uppercase tracking-wider text-muted">
                {remaining} characters left · no links
              </span>
              <button
                type="submit"
                disabled={status === 'sending' || !name.trim() || !message.trim()}
                className="nb-btn-primary disabled:opacity-50"
              >
                {status === 'sending' ? 'Posting…' : 'Post it'}
              </button>
            </div>

            {error && (
              <p
                role="alert"
                className="nb-box mt-4 bg-primary px-4 py-3 text-sm font-bold text-on-primary"
              >
                {error}
              </p>
            )}
            {notice && (
              <p className="nb-box mt-4 bg-background px-4 py-3 text-sm font-semibold">
                {notice}
              </p>
            )}
          </form>

          <ul ref={listRef} className="mt-6 grid gap-4 sm:grid-cols-2" aria-live="polite">
            {state === 'loading' && (
              <li className="font-mono text-xs uppercase tracking-wider text-muted">
                Loading the wall…
              </li>
            )}

            {state === 'ready' && entries.length === 0 && (
              <li className="nb-card p-5 font-medium text-muted">
                Nobody has written anything yet. Be the first.
              </li>
            )}

            {entries.map((entry) => (
              <li key={entry.id} className="nb-card p-5">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="font-display text-base uppercase leading-tight">
                    {entry.name}
                  </p>
                  <span className="shrink-0 font-mono text-[0.65rem] uppercase tracking-wider text-muted">
                    {timeAgo(entry.createdAt)}
                  </span>
                </div>
                <p className="mt-2 break-words font-medium leading-snug">
                  {entry.message}
                </p>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
