const { Pool } = require('pg');
const dbConfig = require('../config/dbConfig');
const pool = new Pool(dbConfig);

class Content {
  static async create({ key, value }) {
    const query = `
      INSERT INTO content (key, value)
      VALUES ($1, $2)
      ON CONFLICT (key) DO UPDATE SET value = $2
      RETURNING *
    `;
    const values = [key, value];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findByKey(key) {
    const query = 'SELECT * FROM content WHERE key = $1';
    const result = await pool.query(query, [key]);
    return result.rows[0];
  }

  static async getAll() {
    const query = 'SELECT * FROM content';
    const result = await pool.query(query);
    return result.rows;
  }
}

module.exports = Content;