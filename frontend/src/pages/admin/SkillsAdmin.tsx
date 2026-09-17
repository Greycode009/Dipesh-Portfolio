import { cms } from '@/api/cms';
import ResourceManager from '@/components/admin/ResourceManager';
import type { FieldSpec } from '@/components/admin/fields';
import type { Skill } from '@/types/content';

const fields: readonly FieldSpec<Skill>[] = [
  { name: 'name', label: 'Name', type: 'text' },
  { name: 'description', label: 'Description', type: 'textarea' },
  {
    name: 'icon',
    label: 'Icon',
    type: 'text',
    help: 'Font Awesome class, for example "fab fa-react".',
  },
  {
    name: 'category',
    label: 'Category',
    type: 'select',
    options: [
      { value: 'frontend', label: 'Frontend' },
      { value: 'backend', label: 'Backend' },
      { value: 'database', label: 'Database' },
      { value: 'development', label: 'Development' },
      { value: 'authentication', label: 'Authentication' },
    ],
    column: true,
  },
  {
    name: 'proficiency',
    label: 'Proficiency',
    type: 'number',
    min: 1,
    max: 5,
    help: '1-5. Becomes inventory item rarity in the pixel room.',
    column: true,
  },
  { name: 'itemSprite', label: 'Item sprite', type: 'text' },
];

const emptyDraft: Partial<Skill> = {
  name: '',
  description: '',
  icon: 'fas fa-code',
  category: 'frontend',
  proficiency: 3,
  itemSprite: 'item-default',
};

export default function SkillsAdmin() {
  return (
    <ResourceManager
      title="Skills"
      api={cms.skills}
      fields={fields}
      emptyDraft={emptyDraft}
      label={(skill) => skill.name}
    />
  );
}
