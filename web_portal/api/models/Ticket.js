const { Pool } = require('pg');
const dbConfig = require('../config/dbConfig');
const pool = new Pool(dbConfig);

class Ticket {
  static async create({ number, orgId }) {
    const query = `
      INSERT INTO tickets (number, status, org_id)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const values = [number, 'waiting', orgId];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findById(id) {
    const query = 'SELECT * FROM tickets WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async updateStatus(id, status, operatorId) {
    const query = `
      UPDATE tickets
      SET status = $1, operator_id = $2
      WHERE id = $3
      RETURNING *
    `;
    const result = await pool.query(query, [status, operatorId, id]);
    return result.rows[0];
  }
}

module.exports = Ticket;