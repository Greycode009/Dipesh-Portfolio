/**
 * One-time bridge: snapshots the frontend's hand-written content modules into
 * the JSON the seeder loads, so the first database matches what the live site
 * shows today. After seeding, the database is the source of truth and the
 * frontend content files become generated output.
 *
 *   npx tsx scripts/generate-seed.ts
 */
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { projects } from '../../frontend/src/content/projects';
import { skills } from '../../frontend/src/content/skills';
import {
  bio,
  expertise,
  homeIntro,
  socials,
  timeline,
} from '../../frontend/src/content/bio';

const seed = {
  projects,
  skills,
  timeline,
  socials,
  expertise,
  bio: { ...bio, homeIntro },
};

const target = join(__dirname, '..', 'src', 'db', 'seed-data.json');
writeFileSync(target, `${JSON.stringify(seed, null, 2)}\n`, 'utf8');

console.log(
  `Wrote ${target}\n` +
    `  ${seed.projects.length} projects, ${seed.skills.length} skills, ` +
    `${seed.timeline.length} timeline entries, ${seed.socials.length} socials, ` +
    `${seed.expertise.length} expertise cards`,
);
