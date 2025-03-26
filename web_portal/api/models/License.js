const { Pool } = require('pg');
const dbConfig = require('../config/dbConfig');
const pool = new Pool(dbConfig);

class License {
  static async create({ key, userId, tariffId, expiresAt, maxWorkstations }) {
    const query = `
      INSERT INTO licenses (key, user_id, tariff_id, expires_at, max_workstations)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const values = [key, userId, tariffId, expiresAt, maxWorkstations];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findByKey(key) {
    const query = 'SELECT * FROM licenses WHERE key = $1';
    const result = await pool.query(query, [key]);
    return result.rows[0];
  }
}

module.exports = License;