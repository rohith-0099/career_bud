const { Pool } = require('pg');

let pool;

function getPool() {
  if (pool) return pool;
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.PGSSL === 'true' ? { rejectUnauthorized: false } : undefined,
  });
  return pool;
}

async function initSchema() {
  if (!process.env.DATABASE_URL) return; // skip when DB not configured
  const client = await getPool().connect();
  try {
    await client.query(`
      create table if not exists sessions (
        id uuid primary key default gen_random_uuid(),
        interests text[] not null default '{}',
        careers jsonb not null default '[]',
        graph jsonb not null default '{}',
        email text,
        created_at timestamptz not null default now()
      );
    `);
  } finally {
    client.release();
  }
}

module.exports = { getPool, initSchema };


