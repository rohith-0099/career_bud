const { getPool } = require('../utils/db');
const { randomUUID } = require('crypto');

async function saveSession(doc) {
  const pool = getPool();
  const id = randomUUID();
  const { interests = [], careers = [], graph = {}, email = null } = doc || {};
  const { rows } = await pool.query(
    'insert into sessions (id, interests, careers, graph, email) values ($1, $2, $3, $4, $5) returning id',
    [id, interests, JSON.stringify(careers), JSON.stringify(graph), email]
  );
  return { _id: rows[0].id };
}

async function getSession(id) {
  const pool = getPool();
  const { rows } = await pool.query('select * from sessions where id=$1 limit 1', [id]);
  return rows[0] || null;
}

module.exports = { saveSession, getSession };


