import { useCallback, useEffect, useState } from 'react';
import { ApiError } from '@/api/client';
import { cms, type GuestbookEntry } from '@/api/cms';

export default function GuestbookAdmin() {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      setEntries(await cms.guestbook.list(true));
      setError('');
    } catch (cause) {
      setError(cause instanceof ApiError ? cause.message : String(cause));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const act = async (action: () => Promise<unknown>) => {
    try {
      await action();
      await load();
    } catch (cause) {
      setError(cause instanceof ApiError ? cause.message : String(cause));
    }
  };

  const pending = entries.filter((entry) => !entry.approved);

  return (
    <section>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-primary">Guestbook</h1>
        <p className="mt-1 text-muted">
          Messages stay hidden until approved.
          {pending.length > 0 && ` ${pending.length} waiting.`}
        </p>
      </header>

      {error && (
        <p className="mb-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
          {error}
        </p>
      )}

      {isLoading ? (
        <p className="text-muted">Loading...</p>
      ) : entries.length === 0 ? (
        <p className="text-muted">Nobody has signed yet.</p>
      ) : (
        <ul className="space-y-3">
          {entries.map((entry) => (
            <li
              key={entry.id}
              className="rounded-xl border border-border bg-surface p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium">
                    {entry.name}
                    <span
                      className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
                        entry.approved
                          ? 'bg-primary/10 text-primary'
                          : 'bg-amber-500/10 text-amber-400'
                      }`}
                    >
                      {entry.approved ? 'Approved' : 'Pending'}
                    </span>
                  </p>
                  <p className="mt-1 break-words text-muted">{entry.message}</p>
                  <p className="mt-1 text-xs text-muted">
                    {new Date(entry.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      void act(() =>
                        cms.guestbook.moderate(entry.id, !entry.approved),
                      )
                    }
                    className="rounded-md border border-border px-3 py-1 text-sm transition-colors hover:bg-primary/10"
                  >
                    {entry.approved ? 'Unapprove' : 'Approve'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`Delete the message from ${entry.name}?`)) {
                        void act(() => cms.guestbook.remove(entry.id));
                      }
                    }}
                    className="rounded-md border border-red-500/40 px-3 py-1 text-sm text-red-400 transition-colors hover:bg-red-500/10"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
