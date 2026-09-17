import { useEffect, useState, type FormEvent } from 'react';
import { ApiError } from '@/api/client';
import { cms } from '@/api/cms';
import type { Bio } from '@/types/content';

const inputClass =
  'w-full rounded-lg border border-border bg-background px-3 py-2 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20';

/** Bio is a singleton, so it gets a plain form rather than a resource list. */
export default function BioAdmin() {
  const [bio, setBio] = useState<Bio | null>(null);
  const [storyText, setStoryText] = useState('');
  const [rolesText, setRolesText] = useState('');
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
        setStoryText(loaded.story.join('\n\n'));
        setRolesText(loaded.roles.join(', '));
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

  const set = <K extends keyof Bio>(key: K, value: Bio[K]) =>
    setBio({ ...bio, [key]: value });

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setStatus('saving');
    setError('');
    setMessage('');
    try {
      const saved = await cms.bio.update({
        ...bio,
        roles: rolesText
          .split(',')
          .map((role) => role.trim())
          .filter(Boolean),
        // Blank lines separate paragraphs, matching how the About page renders.
        story: storyText
          .split(/\n\s*\n/)
          .map((paragraph) => paragraph.trim())
          .filter(Boolean),
      });
      setBio(saved);
      setMessage('Saved.');
    } catch (cause) {
      setError(cause instanceof ApiError ? cause.message : String(cause));
    } finally {
      setStatus('idle');
    }
  };

  const text = (label: string, key: keyof Bio) => (
    <div>
      <label htmlFor={key} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      <input
        id={key}
        type="text"
        value={String(bio[key] ?? '')}
        onChange={(event) => set(key, event.target.value as never)}
        className={inputClass}
      />
    </div>
  );

  return (
    <section>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-primary">Bio</h1>
        <p className="mt-1 text-muted">
          Shown on the home and about pages, and in the contact details. The
          hero and game pictures are on the Pictures page.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-xl border border-primary/20 bg-surface p-6"
      >
        {text('Name', 'name')}
        {text('Headline', 'headline')}

        <div>
          <label htmlFor="roles" className="mb-1.5 block text-sm font-medium">
            Roles
          </label>
          <input
            id="roles"
            type="text"
            value={rolesText}
            onChange={(event) => setRolesText(event.target.value)}
            className={inputClass}
          />
          <p className="mt-1 text-xs text-muted">Comma separated.</p>
        </div>

        <div>
          <label
            htmlFor="homeIntro"
            className="mb-1.5 block text-sm font-medium"
          >
            Home intro
          </label>
          <textarea
            id="homeIntro"
            rows={3}
            value={bio.homeIntro ?? ''}
            onChange={(event) => set('homeIntro' as keyof Bio, event.target.value as never)}
            className={`${inputClass} resize-y`}
          />
        </div>

        <div>
          <label htmlFor="story" className="mb-1.5 block text-sm font-medium">
            Story
          </label>
          <textarea
            id="story"
            rows={8}
            value={storyText}
            onChange={(event) => setStoryText(event.target.value)}
            className={`${inputClass} resize-y`}
          />
          <p className="mt-1 text-xs text-muted">
            Separate paragraphs with a blank line.
          </p>
        </div>

        <div>
          <label htmlFor="quote" className="mb-1.5 block text-sm font-medium">
            Quote
          </label>
          <textarea
            id="quote"
            rows={3}
            value={bio.quote}
            onChange={(event) => set('quote', event.target.value)}
            className={`${inputClass} resize-y`}
          />
        </div>

        {text('Location', 'location')}
        {text('Email', 'email')}
        {text('Phone', 'phone')}

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={bio.availableForWork}
            onChange={(event) => set('availableForWork', event.target.checked)}
            className="h-4 w-4 accent-[rgb(var(--color-primary))]"
          />
          Available for freelance work
        </label>

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
          disabled={status === 'saving'}
          className="rounded-lg bg-primary px-5 py-2 font-medium text-on-primary transition-colors hover:bg-secondary disabled:opacity-60"
        >
          {status === 'saving' ? 'Saving...' : 'Save changes'}
        </button>
      </form>
    </section>
  );
}
