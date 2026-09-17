export type FieldType =
  | 'text'
  | 'textarea'
  | 'url'
  | 'number'
  | 'boolean'
  | 'select'
  | 'tags'
  | 'date';

export interface FieldSpec<T> {
  name: Extract<keyof T, string>;
  label: string;
  type: FieldType;
  options?: readonly { value: string; label: string }[];
  placeholder?: string;
  help?: string;
  min?: number;
  max?: number;
  /** Render this field as a column in the list. */
  column?: boolean;
}

/** Coerces a form input value back to the type the API expects. */
export function parseFieldValue(type: FieldType, raw: string): unknown {
  switch (type) {
    case 'number':
      return raw === '' ? 0 : Number(raw);
    case 'tags':
      return raw
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
    default:
      return raw;
  }
}

/** Renders a stored value into something an input can display. */
export function formatFieldValue(type: FieldType, value: unknown): string {
  if (value === null || value === undefined) return '';
  if (type === 'tags' && Array.isArray(value)) return value.join(', ');
  return String(value);
}
