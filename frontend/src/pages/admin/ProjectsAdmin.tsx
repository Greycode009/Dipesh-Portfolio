import { cms } from '@/api/cms';
import GitHubImport from '@/components/admin/GitHubImport';
import ResourceManager from '@/components/admin/ResourceManager';
import type { FieldSpec } from '@/components/admin/fields';
import type { Project } from '@/types/content';

const fields: readonly FieldSpec<Project>[] = [
  { name: 'title', label: 'Title', type: 'text' },
  {
    name: 'slug',
    label: 'Slug',
    type: 'text',
    help: 'Lowercase letters, numbers and hyphens. Used in URLs.',
  },
  { name: 'description', label: 'Description', type: 'textarea' },
  {
    name: 'technologies',
    label: 'Technologies',
    type: 'tags',
    help: 'Comma separated.',
    column: true,
  },
  {
    name: 'type',
    label: 'Project type',
    type: 'select',
    options: [
      { value: 'frontend', label: 'Frontend' },
      { value: 'backend', label: 'Backend — usually no demo or screenshot' },
      { value: 'fullstack', label: 'Full-stack' },
      { value: 'mobile', label: 'Mobile' },
      { value: 'other', label: 'Other' },
    ],
    column: true,
  },
  {
    name: 'image',
    label: 'Screenshot URL',
    type: 'url',
    help: 'Leave blank if there is nothing to show — the card falls back to a code block.',
  },
  { name: 'githubUrl', label: 'GitHub URL', type: 'url' },
  {
    name: 'liveUrl',
    label: 'Live demo URL',
    type: 'url',
    help: 'Leave blank for an API, CLI or library. The Live button is then hidden.',
  },
  { name: 'category', label: 'Category', type: 'text' },
  { name: 'date', label: 'Date', type: 'date', help: 'YYYY-MM-DD' },
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'draft', label: 'Draft — hidden from the site' },
      { value: 'published', label: 'Published' },
    ],
    column: true,
  },
  { name: 'featured', label: 'Featured', type: 'boolean', column: true },
  {
    name: 'worldX',
    label: 'Room position X',
    type: 'number',
    help: 'Where this cabinet sits in the pixel room.',
  },
  { name: 'worldY', label: 'Room position Y', type: 'number' },
  { name: 'sprite', label: 'Cabinet sprite', type: 'text' },
];

const emptyDraft: Partial<Project> = {
  title: '',
  slug: '',
  description: '',
  technologies: [],
  image: '',
  githubUrl: '',
  liveUrl: '',
  type: 'frontend',
  category: 'frontend',
  date: new Date().toISOString().slice(0, 10),
  status: 'draft',
  featured: false,
  worldX: 0,
  worldY: 3,
  sprite: 'cabinet-default',
};

export default function ProjectsAdmin() {
  return (
    <ResourceManager
      title="Projects"
      description="Drafts stay hidden until you publish them."
      api={cms.projects}
      fields={fields}
      emptyDraft={emptyDraft}
      label={(project) => project.title}
      toolbar={(startCreate) => <GitHubImport onDraft={startCreate} />}
    />
  );
}
