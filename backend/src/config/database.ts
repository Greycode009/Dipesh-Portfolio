import { Sequelize } from 'sequelize';
import { env } from './env';

/**
 * Postgres in production (Neon), a local SQLite file otherwise so the API can
 * be run and tested without provisioning a database first.
 *
 * Because of that, models stick to column types both dialects support —
 * arrays are stored as JSON rather than Postgres ARRAY.
 */
/**
 * Hosted Postgres (Neon, Supabase, Railway) requires TLS, and that has nothing
 * to do with NODE_ENV: connecting to Neon from a laptop in development needs it
 * just as much as production does. Only a database on this machine does not.
 */
const isLocalDatabase = (url: string) =>
  /@(localhost|127\.0\.0\.1|\[::1\])[:/]/.test(url);

export const sequelize = env.databaseUrl
  ? new Sequelize(env.databaseUrl, {
      dialect: 'postgres',
      logging: false,
      dialectOptions: isLocalDatabase(env.databaseUrl)
        ? {}
        : { ssl: { require: true, rejectUnauthorized: false } },
      // Neon's pooler drops idle connections; keep the pool small and let it.
      pool: { max: 5, min: 0, idle: 10_000, acquire: 30_000 },
    })
  : new Sequelize({
      dialect: 'sqlite',
      storage: 'portfolio.dev.sqlite',
      logging: false,
    });

export async function assertDatabaseConnection(): Promise<void> {
  await sequelize.authenticate();
}
