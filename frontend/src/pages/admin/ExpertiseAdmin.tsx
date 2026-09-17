import { cms } from '@/api/cms';
import ResourceManager from '@/components/admin/ResourceManager';
import type { FieldSpec } from '@/components/admin/fields';
import type { Expertise } from '@/types/content';

const fields: readonly FieldSpec<Expertise>[] = [
  { name: 'title', label: 'Title', type: 'text' },
  { name: 'description', label: 'Description', type: 'textarea' },
  { name: 'icon', label: 'Icon', type: 'text', help: 'Font Awesome class.' },
  {
    name: 'technologies',
    label: 'Technologies',
    type: 'tags',
    help: 'Comma separated.',
    column: true,
  },
];

export default function ExpertiseAdmin() {
  return (
    <ResourceManager
      title="Expertise"
      description="The three cards on the home page."
      api={cms.expertise}
      fields={fields}
      emptyDraft={{
        title: '',
        description: '',
        icon: 'fas fa-code',
        technologies: [],
      }}
      label={(card) => card.title}
    />
  );
}
