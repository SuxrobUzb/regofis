const { Pool } = require('pg');
const dbConfig = require('../config/dbConfig');
const pool = new Pool(dbConfig);

class AdminLog {
  static async create({ userId, action, details }) {
    const query = `
      INSERT INTO admin_logs (user_id, action, details, created_at)
      VALUES ($1, $2, $3, NOW())
      RETURNING *
    `;
    const values = [userId, action, details];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async getAll() {
    const query = 'SELECT * FROM admin_logs ORDER BY created_at DESC LIMIT 100';
    const result = await pool.query(query);
    return result.rows;
  }
}

module.exports = AdminLog;