/**
 * Filter tabs on the About page. Hand-maintained — these are UI groupings, not
 * content, so they are not generated from the CMS.
 */
export const skillCategories = [
  { key: 'all', label: 'All' },
  { key: 'frontend', label: 'Frontend' },
  { key: 'backend', label: 'Backend' },
  { key: 'database', label: 'Database' },
  { key: 'development', label: 'Development' },
  { key: 'authentication', label: 'Authentication' },
] as const;

export type SkillFilter = (typeof skillCategories)[number]['key'];
