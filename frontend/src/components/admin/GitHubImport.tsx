import { useState } from 'react';
import { ApiError } from '@/api/client';
import { github } from '@/api/cms';
import type { Project } from '@/types/content';

interface GitHubImportProps {
  /** Opens the project form prefilled with the fetched repository. */
  onDraft: (draft: Partial<Project>) => void;
}

export default function GitHubImport({ onDraft }: GitHubImportProps) {
  const [repo, setRepo] = useState('');
  const [status, setStatus] = useState<'idle' | 'fetching' | 'syncing'>('idle');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const describe = (cause: unknown) =>
    cause instanceof ApiError ? cause.message : String(cause);

  const fetchRepo = async () => {
    setStatus('fetching');
    setError('');
    setNotice('');
    try {
      const { draft, existingProjectId } = await github.preview(repo);
      if (existingProjectId) {
        setNotice(
          `That repository is already project #${existingProjectId}. The form below is prefilled from GitHub — creating it would add a duplicate.`,
        );
      }
      onDraft(draft);
      setRepo('');
    } catch (cause) {
      setError(describe(cause));
    } finally {
      setStatus('idle');
    }
  };

  const syncStats = async () => {
    setStatus('syncing');
    setError('');
    setNotice('');
    try {
      const { results } = await github.syncStats();
      const failed = results.filter((result) => !result.ok);
      setNotice(
        failed.length === 0
          ? `Updated stars and last-commit dates for ${results.length} projects.`
          : `Updated ${results.length - failed.length} of ${results.length}. Failed: ${failed
              .map((result) => `${result.title} (${result.reason})`)
              .join(', ')}`,
      );
    } catch (cause) {
      setError(describe(cause));
    } finally {
      setStatus('idle');
    }
  };

  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <h2 className="mb-1 font-semibold">Import from GitHub</h2>
      <p className="mb-4 text-sm text-muted">
        Paste a repository and the form fills itself in — title, description,
        topics, live demo, stars.
      </p>

      <div className="flex flex-wrap gap-2">
        <input
          type="text"
          value={repo}
          onChange={(event) => setRepo(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && repo.trim()) void fetchRepo();
          }}
          placeholder="Greycode009/Anime-Watchlist"
          aria-label="GitHub repository"
          className="min-w-0 flex-1 rounded-lg border border-border bg-background px-3 py-2 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
        <button
          type="button"
          onClick={() => void fetchRepo()}
          disabled={status !== 'idle' || !repo.trim()}
          className="rounded-lg bg-primary px-4 py-2 font-medium text-on-primary transition-colors hover:bg-secondary disabled:opacity-60"
        >
          {status === 'fetching' ? 'Fetching...' : 'Fetch'}
        </button>
        <button
          type="button"
          onClick={() => void syncStats()}
          disabled={status !== 'idle'}
          className="rounded-lg border border-border px-4 py-2 font-medium transition-colors hover:bg-primary/10 disabled:opacity-60"
        >
          {status === 'syncing' ? 'Syncing...' : 'Refresh all stars'}
        </button>
      </div>

      {error && (
        <p className="mt-3 rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
          {error}
        </p>
      )}
      {notice && (
        <p className="mt-3 rounded-lg bg-primary/10 p-3 text-sm text-primary">
          {notice}
        </p>
      )}
    </div>
  );
}
