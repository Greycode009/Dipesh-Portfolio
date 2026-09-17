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

/**
 * Seeding writes explicit ids, which leaves Postgres identity sequences at 1 —
 * the next insert from the admin UI would then collide with a seeded row.
 * SQLite picks max(rowid)+1 and never shows this, so it has to be handled
 * explicitly.
 */
async function realignPostgresSequences() {
  if (sequelize.getDialect() !== 'postgres') return;

  const tables = [
    'projects',
    'skills',
    'timeline_entries',
    'socials',
    'expertise',
    'bio',
    'guestbook_entries',
    'admins',
  ];

  for (const table of tables) {
    await sequelize.query(
      `SELECT setval(
         pg_get_serial_sequence('"${table}"', 'id'),
         COALESCE((SELECT MAX(id) FROM "${table}"), 1)
       )`,
    );
  }
  console.log(`Realigned id sequences for ${tables.length} tables`);
}

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
