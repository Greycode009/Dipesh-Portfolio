import { sequelize } from '@/config/database';

/**
 * Adds the hero stat columns. Written as explicit additive SQL rather than
 * sequelize.sync({ alter: true }), which compares every model to every table
 * and will happily rewrite columns it thinks have drifted. This touches two
 * columns and nothing else, and re-running it is a no-op.
 */
async function migrate() {
  await sequelize.authenticate();

  await sequelize.query(`
    ALTER TABLE "bio"
      ADD COLUMN IF NOT EXISTS "heroStatValue" VARCHAR(255) NOT NULL DEFAULT '2yr',
      ADD COLUMN IF NOT EXISTS "heroStatLabel" VARCHAR(255) NOT NULL DEFAULT 'Building for the web'
  `);

  const [rows] = await sequelize.query(
    `SELECT id, "heroStatValue", "heroStatLabel" FROM "bio"`,
  );
  console.log('  bio rows now:');
  console.table(rows);

  await sequelize.close();
}

migrate().catch((error) => {
  console.error('  failed:', error.message);
  process.exit(1);
});
