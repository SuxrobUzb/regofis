const { Pool, Client } = require('pg');

const dbConfig = {
  user: 'queue_user',
  host: 'localhost',
  database: 'queue_system',
  password: 'secure_password',
  port: 5432,
};

const initDb = async () => {
  const rootClient = new Client({
    user: dbConfig.user,
    host: dbConfig.host,
    password: dbConfig.password,
    port: dbConfig.port,
  });

  try {
    await rootClient.connect();
    const dbCheck = await rootClient.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [dbConfig.database]
    );
    if (dbCheck.rowCount === 0) {
      await rootClient.query(`CREATE DATABASE ${dbConfig.database}`);
      console.log(`Database ${dbConfig.database} created`);
    }
  } catch (error) {
    console.error('Error creating database:', error);
  } finally {
    await rootClient.end();
  }

  const pool = new Pool(dbConfig);
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          username VARCHAR(50) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          role VARCHAR(20) NOT NULL DEFAULT 'user',
          org_id INTEGER REFERENCES organizations(id)
        );

      CREATE TABLE IF NOT EXISTS tariffs (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        features JSONB,
        price DECIMAL(10,2) NOT NULL
      );

      CREATE TABLE IF NOT EXISTS licenses (
        id SERIAL PRIMARY KEY,
        key VARCHAR(32) UNIQUE NOT NULL,
        user_id INTEGER REFERENCES users(id),
        tariff_id INTEGER REFERENCES tariffs(id),
        expires_at TIMESTAMP NOT NULL,
        max_workstations INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS tickets (
          id SERIAL PRIMARY KEY,
          number INTEGER NOT NULL,
          status VARCHAR(20) NOT NULL DEFAULT 'waiting',
          org_id INTEGER REFERENCES organizations(id),
          operator_id INTEGER REFERENCES users(id),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

      CREATE TABLE IF NOT EXISTS content (
        id SERIAL PRIMARY KEY,
        key VARCHAR(50) UNIQUE NOT NULL,
        value JSONB NOT NULL
      );

      CREATE TABLE IF NOT EXISTS admin_logs (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        action VARCHAR(100) NOT NULL,
        details JSONB,
        created_at TIMESTAMP NOT NULL
      );
      CREATE TABLE IF NOT EXISTS organizations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        styles JSONB NOT NULL,
        tariff_id INTEGER REFERENCES tariffs(id)
      );
      CREATE TABLE IF NOT EXISTS audio_settings (
        id SERIAL PRIMARY KEY,
        org_id INTEGER REFERENCES organizations(id),
        key VARCHAR(50) NOT NULL,
        file_path VARCHAR(255) NOT NULL
      );
    `);
    console.log('Tables created successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
  }

  return pool;
};

module.exports = { dbConfig, initDb };