/**
 * Pulls published content from the CMS and rewrites src/content/*.ts.
 *
 * This is what makes an edit in the admin UI reach the site: edit, run this,
 * rebuild, deploy. Content ships as part of the bundle rather than being
 * fetched at runtime, so the site stays fast and keeps working if the API is
 * down.
 *
 *   npm run sync:content
 */
import { writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const API = process.env.VITE_API_URL ?? 'http://localhost:4000';
const contentDir = join(dirname(dirname(fileURLToPath(import.meta.url))), 'src', 'content');

const BANNER = `/**
 * GENERATED FILE — do not edit by hand.
 * Written by scripts/sync-content.mjs from ${API}.
 * Edit this content in the CMS at /admin, then run \`npm run sync:content\`.
 */`;

async function get(path) {
  const response = await fetch(`${API}${path}`);
  if (!response.ok) {
    throw new Error(`GET ${path} failed with ${response.status}`);
  }
  return response.json();
}

/** Keeps only the fields the content types declare, in a stable order. */
const pick = (source, keys) =>
  Object.fromEntries(keys.map((key) => [key, source[key]]));

const serialize = (value) => JSON.stringify(value, null, 2);

const PROJECT_KEYS = [
  'id', 'slug', 'title', 'description', 'technologies', 'image',
  'githubUrl', 'liveUrl', 'featured', 'type', 'category', 'date',
  'sortOrder', 'status', 'worldX', 'worldY', 'sprite',
];

const SKILL_KEYS = [
  'id', 'name', 'icon', 'description', 'category', 'proficiency',
  'itemSprite', 'sortOrder',
];

const TIMELINE_KEYS = ['id', 'year', 'title', 'description', 'highlight', 'sortOrder'];
const SOCIAL_KEYS = ['id', 'label', 'url', 'icon', 'sortOrder'];
const EXPERTISE_KEYS = ['id', 'title', 'description', 'icon', 'technologies', 'sortOrder'];
const BIO_KEYS = [
  'name', 'headline', 'roles', 'story', 'homeIntro', 'quote', 'avatarUrl',
  'portraitUrl', 'location', 'email', 'phone', 'availableForWork',
];

async function sync() {
  const [projects, skills, timeline, socials, expertise, bio] =
    await Promise.all([
      get('/api/projects'),
      get('/api/skills'),
      get('/api/timeline'),
      get('/api/socials'),
      get('/api/expertise'),
      get('/api/bio'),
    ]);

  await writeFile(
    join(contentDir, 'projects.ts'),
    `${BANNER}
import type { Project } from '@/types/content';

export const projects: Project[] = ${serialize(
      projects.map((item) => pick(item, PROJECT_KEYS)),
    )};
`,
    'utf8',
  );

  await writeFile(
    join(contentDir, 'skills.ts'),
    `${BANNER}
import type { Skill } from '@/types/content';

export const skills: Skill[] = ${serialize(
      skills.map((item) => pick(item, SKILL_KEYS)),
    )};
`,
    'utf8',
  );

  await writeFile(
    join(contentDir, 'bio.ts'),
    `${BANNER}
import type { Bio, Expertise, Social, TimelineEntry } from '@/types/content';

export const bio: Bio = ${serialize(pick(bio, BIO_KEYS))};

export const homeIntro = bio.homeIntro;

export const socials: Social[] = ${serialize(
      socials.map((item) => pick(item, SOCIAL_KEYS)),
    )};

export const timeline: TimelineEntry[] = ${serialize(
      timeline.map((item) => pick(item, TIMELINE_KEYS)),
    )};

export const expertise: Expertise[] = ${serialize(
      expertise.map((item) => pick(item, EXPERTISE_KEYS)),
    )};
`,
    'utf8',
  );

  console.log(
    `Synced from ${API}: ${projects.length} projects, ${skills.length} skills, ` +
      `${timeline.length} timeline entries, ${socials.length} socials, ` +
      `${expertise.length} expertise cards, bio for ${bio.name}`,
  );
}

sync().catch((error) => {
  console.error(`Content sync failed: ${error.message}`);
  console.error('Is the API running, and is VITE_API_URL set correctly?');
  process.exit(1);
});
