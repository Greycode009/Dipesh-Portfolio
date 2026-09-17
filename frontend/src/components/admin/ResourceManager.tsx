import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { ApiError } from '@/api/client';
import ResourceForm from './ResourceForm';
import { formatFieldValue, type FieldSpec } from './fields';

interface ResourceApi<T> {
  list: (asAdmin?: boolean) => Promise<T[]>;
  create: (body: Partial<T>) => Promise<T>;
  update: (id: number, body: Partial<T>) => Promise<T>;
  remove: (id: number) => Promise<void>;
  reorder: (ids: number[]) => Promise<unknown>;
}

interface ResourceManagerProps<T extends { id: number }> {
  title: string;
  description?: string;
  api: ResourceApi<T>;
  fields: readonly FieldSpec<T>[];
  emptyDraft: Partial<T>;
  /** Row heading, e.g. a project's title. */
  label: (item: T) => string;
  /** Set false for resources with no sortOrder column. */
  reorderable?: boolean;
  /**
   * Rendered above the list. Receives a callback that opens the create form
   * prefilled — used by the GitHub importer.
   */
  toolbar?: (startCreate: (draft: Partial<T>) => void) => ReactNode;
}

function describeError(error: unknown): string {
  if (error instanceof ApiError) {
    const details = Array.isArray(error.details)
      ? ` (${error.details
          .map((d: { path: string; message: string }) => `${d.path}: ${d.message}`)
          .join('; ')})`
      : '';
    return `${error.message}${details}`;
  }
  return error instanceof Error ? error.message : String(error);
}

export default function ResourceManager<T extends { id: number }>({
  title,
  description,
  api,
  fields,
  emptyDraft,
  label,
  reorderable = true,
  toolbar,
}: ResourceManagerProps<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  /** null = closed, 'new' = create form, number = editing that id. */
  const [editing, setEditing] = useState<number | 'new' | null>(null);
  const [draft, setDraft] = useState<Partial<T>>(emptyDraft);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      setItems(await api.list(true));
      setError('');
    } catch (cause) {
      setError(describeError(cause));
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  useEffect(() => {
    void load();
  }, [load]);

  const run = async (action: () => Promise<unknown>) => {
    setIsSaving(true);
    setError('');
    try {
      await action();
      setEditing(null);
      await load();
    } catch (cause) {
      setError(describeError(cause));
    } finally {
      setIsSaving(false);
    }
  };

  const save = () =>
    run(() =>
      editing === 'new'
        ? api.create(draft)
        : api.update(editing as number, draft),
    );

  const move = (index: number, direction: -1 | 1) => {
    const next = [...items];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setItems(next);
    void run(() => api.reorder(next.map((item) => item.id)));
  };

  const columns = fields.filter((field) => field.column);

  return (
    <section>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-primary">{title}</h1>
        {description && <p className="mt-1 text-muted">{description}</p>}
      </header>

      {toolbar && (
        <div className="mb-6">
          {toolbar((prefilled) => {
            setDraft({ ...emptyDraft, ...prefilled });
            setEditing('new');
          })}
        </div>
      )}

      {error && (
        <p className="mb-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
          {error}
        </p>
      )}

      {editing === null ? (
        <button
          type="button"
          onClick={() => {
            setDraft(emptyDraft);
            setEditing('new');
          }}
          className="mb-6 rounded-lg bg-primary px-5 py-2 font-medium text-on-primary transition-colors hover:bg-secondary"
        >
          Add new
        </button>
      ) : (
        <div className="mb-6">
          <ResourceForm
            fields={fields}
            draft={draft}
            onChange={setDraft}
            onSubmit={save}
            onCancel={() => setEditing(null)}
            isSaving={isSaving}
            submitLabel={editing === 'new' ? 'Create' : 'Save changes'}
          />
        </div>
      )}

      {isLoading ? (
        <p className="text-muted">Loading...</p>
      ) : items.length === 0 ? (
        <p className="text-muted">Nothing here yet.</p>
      ) : (
        <ul className="space-y-3">
          {items.map((item, index) => (
            <li
              key={item.id}
              className="rounded-xl border border-border bg-surface p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium">{label(item)}</p>
                  {columns.length > 0 && (
                    <p className="mt-1 text-sm text-muted">
                      {columns
                        .map(
                          (field) =>
                            `${field.label}: ${
                              formatFieldValue(
                                field.type,
                                item[field.name],
                              ) || '—'
                            }`,
                        )
                        .join(' · ')}
                    </p>
                  )}
                </div>

                <div className="flex shrink-0 flex-wrap gap-2">
                  {reorderable && (
                    <>
                      <button
                        type="button"
                        onClick={() => move(index, -1)}
                        disabled={index === 0}
                        aria-label={`Move ${label(item)} up`}
                        className="rounded-md border border-border px-2 py-1 text-sm transition-colors hover:bg-primary/10 disabled:opacity-40"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() => move(index, 1)}
                        disabled={index === items.length - 1}
                        aria-label={`Move ${label(item)} down`}
                        className="rounded-md border border-border px-2 py-1 text-sm transition-colors hover:bg-primary/10 disabled:opacity-40"
                      >
                        ↓
                      </button>
                    </>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setDraft(item);
                      setEditing(item.id);
                    }}
                    className="rounded-md border border-border px-3 py-1 text-sm transition-colors hover:bg-primary/10"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (
                        window.confirm(`Delete "${label(item)}"? This cannot be undone.`)
                      ) {
                        void run(() => api.remove(item.id));
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
