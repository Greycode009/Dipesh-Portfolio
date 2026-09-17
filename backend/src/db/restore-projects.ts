import { sequelize } from '@/config/database';
import { Project } from '@/features/projects/project.model';
import seedData from './seed-data.json';
import { realignPostgresSequences } from './sequences';

/**
 * Puts back projects that exist in the seed file but not in the database,
 * leaving anything already there untouched.
 */
async function restore() {
  await sequelize.authenticate();

  const present = new Set(
    (await Project.findAll({ attributes: ['id'] })).map((p) => p.id),
  );

  const missing = seedData.projects.filter((p) => !present.has(p.id));
  if (missing.length === 0) {
    console.log('  nothing missing');
  }

  for (const project of missing) {
    await Project.create(project as never);
    console.log(`  restored id ${project.id}  ${project.title}`);
  }

  await realignPostgresSequences();

  const after = await Project.findAll({ order: [['id', 'ASC']] });
  console.log(`  projects now: ${after.length}`);
  for (const p of after) {
    console.log(`     ${p.id}  ${p.status.padEnd(9)} ${p.type.padEnd(9)} ${p.title}`);
  }

  await sequelize.close();
}

restore().catch((e) => {
  console.error('  failed:', e.message);
  process.exit(1);
});
