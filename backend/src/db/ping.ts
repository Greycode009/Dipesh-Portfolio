import { sequelize } from '@/config/database';

/** Confirms the configured database is reachable and reports what it is. */
async function ping() {
  await sequelize.authenticate();
  const [rows] = await sequelize.query(
    'select current_database() as db, version() as version',
  );
  const row = (rows as { db: string; version: string }[])[0];
  console.log(`  dialect:  ${sequelize.getDialect()}`);
  console.log(`  database: ${row.db}`);
  console.log(`  server:   ${row.version.split(',')[0]}`);
  await sequelize.close();
}

ping().catch((error) => {
  console.error('  connection failed:', error.message);
  process.exit(1);
});
