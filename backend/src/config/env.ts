import 'dotenv/config';

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (!value) throw new Error(`Missing required environment variable ${name}`);
  return value;
}

const nodeEnv = process.env.NODE_ENV ?? 'development';

export const env = {
  nodeEnv,
  isProduction: nodeEnv === 'production',
  port: Number(process.env.PORT ?? 4000),

  /** Unset in development falls back to a local SQLite file. */
  databaseUrl: process.env.DATABASE_URL,

  jwtSecret: required(
    'JWT_SECRET',
    nodeEnv === 'production' ? undefined : 'dev-only-insecure-secret',
  ),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '7d',

  corsOrigins: (process.env.CORS_ORIGINS ?? 'http://localhost:3000')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),

  adminEmail: process.env.ADMIN_EMAIL,
  adminPassword: process.env.ADMIN_PASSWORD,
} as const;

if (env.isProduction && !env.databaseUrl) {
  throw new Error('DATABASE_URL is required in production');
}
