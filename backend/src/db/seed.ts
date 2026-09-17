import { sequelize } from '@/config/database';
import { env } from '@/config/env';
import { hashPassword } from '@/features/auth/auth.service';
import {
  Admin,
  Bio,
  Expertise,
  Project,
  Skill,
  Social,
  TimelineEntry,
} from '@/db/models';
import seedData from './seed-data.json';
import { realignPostgresSequences } from './sequences';

/**
 * Idempotent: every row carries an explicit id, so re-running updates rather
 * than duplicating. Safe to run against an existing database.
 */
async function seed() {
  await sequelize.authenticate();
  await sequelize.sync();

  for (const project of seedData.projects) {
    await Project.upsert(project as never);
  }
  for (const skill of seedData.skills) {
    await Skill.upsert(skill as never);
  }
  for (const entry of seedData.timeline) {
    await TimelineEntry.upsert(entry as never);
  }
  for (const social of seedData.socials) {
    await Social.upsert(social as never);
  }
  for (const card of seedData.expertise) {
    await Expertise.upsert(card as never);
  }
  await Bio.upsert({ id: 1, ...seedData.bio } as never);

  if (!env.adminEmail || !env.adminPassword) {
    console.warn(
      'Skipped admin user: set ADMIN_EMAIL and ADMIN_PASSWORD to create one.',
    );
  } else {
    const [admin, created] = await Admin.findOrCreate({
      where: { email: env.adminEmail },
      defaults: {
        email: env.adminEmail,
        passwordHash: await hashPassword(env.adminPassword),
      },
    });
    console.log(
      created
        ? `Created admin ${admin.email}`
        : `Admin ${admin.email} already exists (password unchanged)`,
    );
    if (env.adminPassword === 'change-me') {
      console.warn(
        'ADMIN_PASSWORD is still the placeholder. Change it before deploying.',
      );
    }
  }

  await realignPostgresSequences();

  const counts = {
    projects: await Project.count(),
    skills: await Skill.count(),
    timeline: await TimelineEntry.count(),
    socials: await Social.count(),
    expertise: await Expertise.count(),
    bio: await Bio.count(),
    admins: await Admin.count(),
  };
  console.log('Seeded:', counts);

  await sequelize.close();
}

seed().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
