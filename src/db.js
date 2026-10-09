const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

const query = async (sql, params) => {
  const [rows] = await pool.execute(sql, params || []);
  return rows;
};

const queryOne = async (sql, params) => {
  const rows = await query(sql, params);
  return rows[0] || null;
};

module.exports = { query, queryOne, pool };
