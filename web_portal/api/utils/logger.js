const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

const infoStream = fs.createWriteStream(path.join(logDir, 'info.log'), { flags: 'a' });
const errorStream = fs.createWriteStream(path.join(logDir, 'error.log'), { flags: 'a' });

const logger = {
  info: (message, meta = {}) => {
    const log = `${new Date().toISOString()} [INFO] ${message} ${JSON.stringify(meta)}\n`;
    infoStream.write(log);
    console.log(log);
  },
  error: (message, error = {}) => {
    const log = `${new Date().toISOString()} [ERROR] ${message} ${error.stack || JSON.stringify(error)}\n`;
    errorStream.write(log);
    console.error(log);
  },
  action: (userId, action, details = {}) => {
    const log = `${new Date().toISOString()} [ACTION] User:${userId} Action:${action} Details:${JSON.stringify(details)}\n`;
    infoStream.write(log);
    console.log(log);
  }
};

module.exports = logger;