const { Pool } = require('pg');
const dbConfig = require('../config/dbConfig');
const pool = new Pool(dbConfig);

class Organization {
  static async create({ name, styles, tariffId }) {
    const query = `
      INSERT INTO organizations (name, styles, tariff_id)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const values = [name, JSON.stringify(styles), tariffId];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async getById(id) {
    const query = 'SELECT * FROM organizations WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = Organization;