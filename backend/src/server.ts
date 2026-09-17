import { createApp } from './app';
import { env } from '@/config/env';
import { assertDatabaseConnection, sequelize } from '@/config/database';
import '@/db/models';

async function start() {
  await assertDatabaseConnection();

  // Schema is still moving; migrations arrive once it settles.
  if (!env.isProduction) await sequelize.sync();

  createApp().listen(env.port, () => {
    const dialect = sequelize.getDialect();
    console.log(`API listening on http://localhost:${env.port} (${dialect})`);
  });
}

start().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
