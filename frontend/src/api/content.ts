import type {
  Bio,
  Expertise,
  Project,
  Skill,
  Social,
  TimelineEntry,
} from '@/types/content';
import { request } from './client';

export interface SiteContent {
  projects: Project[];
  skills: Skill[];
  timeline: TimelineEntry[];
  socials: Social[];
  expertise: Expertise[];
  bio: Bio;
}

/**
 * Everything the site renders, straight from the CMS.
 *
 * One call fans out to the public endpoints in parallel. It is used in two
 * places: the prerenderer runs it at build time so the HTML ships with real
 * content, and the browser runs it again on load so an edit in the admin is
 * live without a redeploy.
 */
export async function fetchSiteContent(): Promise<SiteContent> {
  const [projects, skills, timeline, socials, expertise, bio] =
    await Promise.all([
      request<Project[]>('/api/projects'),
      request<Skill[]>('/api/skills'),
      request<TimelineEntry[]>('/api/timeline'),
      request<Social[]>('/api/socials'),
      request<Expertise[]>('/api/expertise'),
      request<Bio>('/api/bio'),
    ]);

  return { projects, skills, timeline, socials, expertise, bio };
}

/** Filter tabs on the About page, derived from whatever skills exist. */
export function skillCategoriesOf(skills: Skill[]) {
  const seen: string[] = [];
  for (const skill of skills) {
    if (!seen.includes(skill.category)) seen.push(skill.category);
  }
  return [
    { key: 'all' as const, label: 'All' },
    ...seen.map((key) => ({
      key,
      label: key.charAt(0).toUpperCase() + key.slice(1),
    })),
  ];
}
