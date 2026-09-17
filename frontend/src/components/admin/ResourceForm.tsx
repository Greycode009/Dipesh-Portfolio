import type { FieldSpec } from './fields';
import { formatFieldValue, parseFieldValue } from './fields';

interface ResourceFormProps<T> {
  fields: readonly FieldSpec<T>[];
  draft: Partial<T>;
  onChange: (draft: Partial<T>) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isSaving: boolean;
  submitLabel: string;
}

const inputClass =
  'w-full rounded-lg border border-border bg-background px-3 py-2 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20';

export default function ResourceForm<T>({
  fields,
  draft,
  onChange,
  onSubmit,
  onCancel,
  isSaving,
  submitLabel,
}: ResourceFormProps<T>) {
  const set = (name: string, value: unknown) =>
    onChange({ ...draft, [name]: value } as Partial<T>);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
      className="space-y-4 rounded-xl border border-primary/20 bg-surface p-6"
    >
      {fields.map((field) => {
        const id = `field-${String(field.name)}`;
        const value = draft[field.name];

        return (
          <div key={String(field.name)}>
            <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
              {field.label}
            </label>

            {field.type === 'boolean' ? (
              <label className="flex items-center gap-2 text-sm text-muted">
                <input
                  id={id}
                  type="checkbox"
                  checked={Boolean(value)}
                  onChange={(event) => set(field.name, event.target.checked)}
                  className="h-4 w-4 accent-[rgb(var(--color-primary))]"
                />
                {field.help ?? 'Enabled'}
              </label>
            ) : field.type === 'select' ? (
              <select
                id={id}
                value={formatFieldValue(field.type, value)}
                onChange={(event) => set(field.name, event.target.value)}
                className={inputClass}
              >
                {field.options?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : field.type === 'textarea' ? (
              <textarea
                id={id}
                rows={4}
                value={formatFieldValue(field.type, value)}
                placeholder={field.placeholder}
                onChange={(event) => set(field.name, event.target.value)}
                className={`${inputClass} resize-y`}
              />
            ) : (
              <input
                id={id}
                type={field.type === 'number' ? 'number' : 'text'}
                inputMode={field.type === 'number' ? 'numeric' : undefined}
                min={field.min}
                max={field.max}
                value={formatFieldValue(field.type, value)}
                placeholder={field.placeholder}
                onChange={(event) =>
                  set(field.name, parseFieldValue(field.type, event.target.value))
                }
                className={inputClass}
              />
            )}

            {field.help && field.type !== 'boolean' && (
              <p className="mt-1 text-xs text-muted">{field.help}</p>
            )}
          </div>
        );
      })}

      <div className="flex flex-wrap gap-3 pt-2">
        <button
          type="submit"
          disabled={isSaving}
          className="rounded-lg bg-primary px-5 py-2 font-medium text-on-primary transition-colors hover:bg-secondary disabled:opacity-60"
        >
          {isSaving ? 'Saving...' : submitLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-border px-5 py-2 font-medium transition-colors hover:bg-primary/10"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
