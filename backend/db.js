const dns = require('node:dns');
const { Pool } = require('pg');

// Ensure DNS lookup prioritizes and falls back to IPv4 to prevent IPv6 ETIMEDOUT
const origLookup = dns.lookup;
dns.lookup = function (hostname, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }
  origLookup(hostname, { ...options, all: true }, (err, addresses) => {
    if (err) return callback(err);
    const ipv4 = addresses.filter((a) => a.family === 4);
    const selected = ipv4.length ? ipv4 : addresses;
    if (options && options.all) {
      return callback(null, selected);
    }
    return callback(null, selected[0].address, selected[0].family);
  });
};

let _pool = null;

function getPool() {
  if (!_pool) {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is missing.');
    }
    _pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });
  }
  return _pool;
}

const sql = async (strings, ...values) => {
  const pool = getPool();
  let queryText = strings[0];
  for (let i = 0; i < values.length; i++) {
    queryText += `$${i + 1}${strings[i + 1]}`;
  }
  const result = await pool.query(queryText, values);
  return result.rows;
};

const initDb = async () => {
  await sql`
    CREATE TABLE IF NOT EXISTS short_urls (
      short_code VARCHAR(255) PRIMARY KEY,
      long_url TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS download_limits (
      key_name VARCHAR(255) PRIMARY KEY,
      download_limit INTEGER NOT NULL,
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
};

module.exports = { sql, initDb, getPool };
