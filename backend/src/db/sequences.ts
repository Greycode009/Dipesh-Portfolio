import { sequelize } from '@/config/database';

/**
 * Writing explicit ids leaves Postgres identity sequences at 1 — the next
 * insert from the admin UI would then collide with an existing row. SQLite
 * picks max(rowid)+1 and never shows this, so it has to be handled explicitly.
 */
export async function realignPostgresSequences() {
  if (sequelize.getDialect() !== 'postgres') return;

  const tables = [
    'projects',
    'skills',
    'timeline_entries',
    'socials',
    'expertise',
    'bio',
    'guestbook_entries',
    'admins',
  ];

  for (const table of tables) {
    await sequelize.query(
      `SELECT setval(
         pg_get_serial_sequence('"${table}"', 'id'),
         COALESCE((SELECT MAX(id) FROM "${table}"), 1)
       )`,
    );
  }
  console.log(`Realigned id sequences for ${tables.length} tables`);
}
