import { useEffect, useState, type FormEvent } from 'react';
import { ApiError } from '@/api/client';
import { cms } from '@/api/cms';
import type { Bio } from '@/types/content';

const inputClass =
  'w-full rounded-lg border border-border bg-background px-3 py-2 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20';

interface Picture {
  key: 'avatarUrl' | 'portraitUrl';
  title: string;
  where: string;
  /** The crop the site actually applies, so the preview does not flatter. */
  aspect: string;
  width: string;
}

const PICTURES: Picture[] = [
  {
    key: 'avatarUrl',
    title: 'Hero picture',
    where: 'The big portrait beside your name on the home page.',
    aspect: 'aspect-[4/5]',
    width: 'max-w-[15rem]',
  },
  {
    key: 'portraitUrl',
    title: 'Game panel picture',
    where: 'Shown when a visitor walks into the about house in the town.',
    aspect: 'aspect-square',
    width: 'max-w-[10rem]',
  },
];

type LoadState = 'loading' | 'ok' | 'broken';

function isHttpUrl(value: string): boolean {
  try {
    const { protocol } = new URL(value);
    return protocol === 'http:' || protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * The pictures used to be two bare URL fields in the middle of the bio form,
 * which gave no hint of where either one appears and no way to tell a typo
 * from a working link. Here each is previewed at the crop the site uses.
 */
export default function PicturesAdmin() {
  const [bio, setBio] = useState<Bio | null>(null);
  const [urls, setUrls] = useState<Record<string, string>>({});
  const [loadState, setLoadState] = useState<Record<string, LoadState>>({});
  const [status, setStatus] = useState<'loading' | 'idle' | 'saving'>(
    'loading',
  );
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    cms.bio
      .get()
      .then((loaded) => {
        setBio(loaded);
        setUrls(
          Object.fromEntries(
            PICTURES.map((picture) => [picture.key, loaded[picture.key] ?? '']),
          ),
        );
        setStatus('idle');
      })
      .catch((cause) => {
        setError(cause instanceof ApiError ? cause.message : String(cause));
        setStatus('idle');
      });
  }, []);

  if (status === 'loading') return <p className="text-muted">Loading...</p>;
  if (!bio) {
    return (
      <p className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
        {error || 'Bio could not be loaded.'}
      </p>
    );
  }

  const anyInvalid = PICTURES.some(
    (picture) => !isHttpUrl(urls[picture.key] ?? ''),
  );
  const changed = PICTURES.some(
    (picture) => (urls[picture.key] ?? '') !== (bio[picture.key] ?? ''),
  );

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (anyInvalid) return;

    setStatus('saving');
    setError('');
    setMessage('');
    try {
      const saved = await cms.bio.update(
        Object.fromEntries(
          PICTURES.map((picture) => [picture.key, urls[picture.key].trim()]),
        ),
      );
      setBio(saved);
      setUrls(
        Object.fromEntries(
          PICTURES.map((picture) => [picture.key, saved[picture.key] ?? '']),
        ),
      );
      setMessage('Saved. Reload the site to see it.');
    } catch (cause) {
      setError(cause instanceof ApiError ? cause.message : String(cause));
    } finally {
      setStatus('idle');
    }
  };

  return (
    <section>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-primary">Pictures</h1>
        <p className="mt-1 text-muted">
          Paste an image link and the preview updates as you type. Nothing is
          uploaded here, so the link has to point at an image that is already
          online.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-4">
        {PICTURES.map((picture) => {
          const url = urls[picture.key] ?? '';
          const usable = isHttpUrl(url);
          const state = loadState[picture.key];

          return (
            <div
              key={picture.key}
              className="rounded-xl border border-primary/20 bg-surface p-6"
            >
              <h2 className="font-semibold">{picture.title}</h2>
              <p className="mt-1 text-sm text-muted">{picture.where}</p>

              <div className="mt-5 flex flex-col gap-5 sm:flex-row">
                <div className={'w-full shrink-0 ' + picture.width}>
                  {usable ? (
                    <img
                      // Remounts on change so onLoad/onError fire per URL.
                      key={url}
                      src={url}
                      alt={picture.title + ' preview'}
                      onLoad={() =>
                        setLoadState((prev) => ({
                          ...prev,
                          [picture.key]: 'ok',
                        }))
                      }
                      onError={() =>
                        setLoadState((prev) => ({
                          ...prev,
                          [picture.key]: 'broken',
                        }))
                      }
                      className={
                        picture.aspect +
                        ' w-full rounded-lg border border-border object-cover'
                      }
                    />
                  ) : (
                    <div
                      className={
                        picture.aspect +
                        ' flex w-full items-center justify-center rounded-lg border border-dashed border-border p-4 text-center text-xs text-muted'
                      }
                    >
                      No picture
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <label
                    htmlFor={picture.key}
                    className="mb-1.5 block text-sm font-medium"
                  >
                    Image link
                  </label>
                  <input
                    id={picture.key}
                    type="url"
                    inputMode="url"
                    value={url}
                    placeholder="https://..."
                    onChange={(event) => {
                      setUrls((prev) => ({
                        ...prev,
                        [picture.key]: event.target.value,
                      }));
                      setLoadState((prev) => ({
                        ...prev,
                        [picture.key]: 'loading',
                      }));
                      setMessage('');
                    }}
                    className={inputClass}
                  />

                  {url.trim() !== '' && !usable && (
                    <p className="mt-2 text-sm text-red-400">
                      That is not an http(s) link.
                    </p>
                  )}
                  {usable && state === 'broken' && (
                    <p className="mt-2 text-sm text-red-400">
                      Nothing loaded from that link. It may be wrong, private,
                      or blocked from being shown on another site.
                    </p>
                  )}
                  {usable && state === 'ok' && (
                    <p className="mt-2 text-sm text-primary">
                      Loads fine, and this is how it will be cropped.
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {error && (
          <p className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
            {error}
          </p>
        )}
        {message && (
          <p className="rounded-lg bg-primary/10 p-3 text-sm text-primary">
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={status === 'saving' || anyInvalid || !changed}
          className="rounded-lg bg-primary px-5 py-2 font-medium text-on-primary transition-colors hover:bg-secondary disabled:opacity-60"
        >
          {status === 'saving' ? 'Saving...' : 'Save pictures'}
        </button>
      </form>
    </section>
  );
}
