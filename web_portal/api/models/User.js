const { Pool } = require('pg');
const dbConfig = require('../config/dbConfig');
const bcrypt = require('bcrypt');
const pool = new Pool(dbConfig);

class User {
  static async create({ username, password, role, orgId }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `
      INSERT INTO users (username, password, role, org_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const values = [username, hashedPassword, role, orgId];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findByUsername(username) {
    const query = 'SELECT * FROM users WHERE username = $1';
    const result = await pool.query(query, [username]);
    return result.rows[0];
  }
}

module.exports = User;