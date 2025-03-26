const { Pool } = require('pg');
const dbConfig = require('../config/dbConfig');
const pool = new Pool(dbConfig);

class AudioSetting {
  static async create({ orgId, key, filePath }) {
    const query = `
      INSERT INTO audio_settings (org_id, key, file_path)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const values = [orgId, key, filePath];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async getByOrgId(orgId) {
    const query = 'SELECT * FROM audio_settings WHERE org_id = $1';
    const result = await pool.query(query, [orgId]);
    return result.rows;
  }
}

module.exports = AudioSetting;