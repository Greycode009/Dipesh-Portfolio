import { createApp } from './app';
import { env } from '@/config/env';
import { assertDatabaseConnection, sequelize } from '@/config/database';
import '@/db/models';

async function start() {
  await assertDatabaseConnection();

  // Schema is still moving; migrations arrive once it settles.
  if (!env.isProduction) await sequelize.sync();

  const server = createApp().listen(env.port, () => {
    const dialect = sequelize.getDialect();
    console.log(`API listening on http://localhost:${env.port} (${dialect})`);
  });

  // Chat streams are long-lived by design; the default 5s headers timeout and
  // 2 minute keep-alive would cut them off mid-conversation.
  server.keepAliveTimeout = 0;
  server.headersTimeout = 0;
}

start().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
