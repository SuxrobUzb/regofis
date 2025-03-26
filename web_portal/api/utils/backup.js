const { Pool } = require('pg');
const dbConfig = require('../config/dbConfig');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const logger = require('./logger');

const pool = new Pool(dbConfig);
const backupDir = path.join(__dirname, '../backups');

// Backup funksiyasi (avvalgi kod)
function backupDatabase() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupFile = path.join(backupDir, `backup-${timestamp}.sql`);

  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir);
  }

  const backupCommand = `pg_dump -U ${dbConfig.user} -h ${dbConfig.host} -p ${dbConfig.port} ${dbConfig.database} > ${backupFile}`;
  exec(backupCommand, (error, stdout, stderr) => {
    if (error) {
      logger.error(`Backup xatosi: ${error.message}`);
      return;
    }
    if (stderr) {
      logger.error(`Backup stderr: ${stderr}`);
      return;
    }
    logger.info(`Ma'lumotlar bazasi muvaffaqiyatli saqlandi: ${backupFile}`);
  });
}

// Rezerv nusxadan tiklash funksiyasi
async function restoreDatabase(backupFileName) {
  const backupFile = path.join(backupDir, backupFileName);

  if (!fs.existsSync(backupFile)) {
    logger.error(`Rezerv nusxa topilmadi: ${backupFile}`);
    throw new Error('Rezerv nusxa fayli mavjud emas');
  }

  try {
    // Avval joriy bazani tozalash
    await pool.query('DROP SCHEMA public CASCADE; CREATE SCHEMA public;');
    logger.info('Joriy ma\'lumotlar bazasi tozalandi');

    // Rezerv nusxadan tiklash
    const restoreCommand = `psql -U ${dbConfig.user} -h ${dbConfig.host} -p ${dbConfig.port} -d ${dbConfig.database} -f ${backupFile}`;
    exec(restoreCommand, (error, stdout, stderr) => {
      if (error) {
        logger.error(`Tiklash xatosi: ${error.message}`);
        throw error;
      }
      if (stderr) {
        logger.error(`Tiklash stderr: ${stderr}`);
        throw new Error(stderr);
      }
      logger.info(`Ma'lumotlar bazasi muvaffaqiyatli tiklandi: ${backupFile}`);
    });
  } catch (error) {
    logger.error(`Tiklash jarayonida xato: ${error.message}`);
    throw error;
  }
}

module.exports = { backupDatabase, restoreDatabase };