import { sequelize } from '@/config/database';
import '@/db/models';

/** Creates or alters tables to match the models. Development convenience. */
async function sync() {
  await sequelize.authenticate();
  await sequelize.sync({ alter: true });
  console.log(`Schema synced (${sequelize.getDialect()})`);
  await sequelize.close();
}

sync().catch((error) => {
  console.error('Sync failed:', error);
  process.exit(1);
});
