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

  // 3000 is the dev server, 4173 is `vite preview` — the built output, which
  // is what actually ships, so it needs to reach the API locally too.
  corsOrigins: (
    process.env.CORS_ORIGINS ?? 'http://localhost:3000,http://localhost:4173'
  )
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),

  /**
   * Whether a signed message appears straight away. Set to 'false' to hold
   * everything for approval in the admin queue instead.
   */
  guestbookAutoApprove: process.env.GUESTBOOK_AUTO_APPROVE !== 'false',

  /** Optional. Raises the GitHub API rate limit from 60 to 5000 per hour. */
  githubToken: process.env.GITHUB_TOKEN,

  adminEmail: process.env.ADMIN_EMAIL,
  adminPassword: process.env.ADMIN_PASSWORD,
} as const;

if (env.isProduction && !env.databaseUrl) {
  throw new Error('DATABASE_URL is required in production');
}
