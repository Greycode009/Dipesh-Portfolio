import { Sequelize } from 'sequelize';
import { env } from './env';

/**
 * Postgres in production (Neon), a local SQLite file otherwise so the API can
 * be run and tested without provisioning a database first.
 *
 * Because of that, models stick to column types both dialects support —
 * arrays are stored as JSON rather than Postgres ARRAY.
 */
export const sequelize = env.databaseUrl
  ? new Sequelize(env.databaseUrl, {
      dialect: 'postgres',
      logging: false,
      dialectOptions: env.isProduction
        ? { ssl: { require: true, rejectUnauthorized: false } }
        : {},
      pool: { max: 5, min: 0, idle: 10_000 },
    })
  : new Sequelize({
      dialect: 'sqlite',
      storage: 'portfolio.dev.sqlite',
      logging: false,
    });

export async function assertDatabaseConnection(): Promise<void> {
  await sequelize.authenticate();
}
