import { cms } from '@/api/cms';
import ResourceManager from '@/components/admin/ResourceManager';
import type { FieldSpec } from '@/components/admin/fields';
import type { Social } from '@/types/content';

const fields: readonly FieldSpec<Social>[] = [
  { name: 'label', label: 'Label', type: 'text' },
  { name: 'url', label: 'URL', type: 'url', column: true },
  {
    name: 'icon',
    label: 'Icon',
    type: 'select',
    options: [
      { value: 'github', label: 'GitHub' },
      { value: 'linkedin', label: 'LinkedIn' },
      { value: 'x', label: 'X / Twitter' },
    ],
  },
];

export default function SocialsAdmin() {
  return (
    <ResourceManager
      title="Social links"
      api={cms.socials}
      fields={fields}
      emptyDraft={{ label: '', url: '', icon: 'github' }}
      label={(social) => social.label}
    />
  );
}
