import { cms } from '@/api/cms';
import ResourceManager from '@/components/admin/ResourceManager';
import type { FieldSpec } from '@/components/admin/fields';
import type { TimelineEntry } from '@/types/content';

const fields: readonly FieldSpec<TimelineEntry>[] = [
  { name: 'year', label: 'Year', type: 'text', column: true },
  { name: 'title', label: 'Title', type: 'text' },
  { name: 'description', label: 'Description', type: 'textarea' },
  { name: 'highlight', label: 'Highlight', type: 'boolean' },
];

export default function TimelineAdmin() {
  return (
    <ResourceManager
      title="Timeline"
      description="Your journey, newest first."
      api={cms.timeline}
      fields={fields}
      emptyDraft={{ year: '', title: '', description: '', highlight: true }}
      label={(entry) => `${entry.year} - ${entry.title}`}
    />
  );
}
