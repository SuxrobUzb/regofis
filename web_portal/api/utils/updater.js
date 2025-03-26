const fs = require('fs');
const path = require('path');
const logger = require('./logger');

const updatesDir = path.join(__dirname, '../updates');

function getLatestUpdate(orgId, appType) {
  if (!fs.existsSync(updatesDir)) {
    fs.mkdirSync(updatesDir);
  }

  const orgDir = path.join(updatesDir, `org-${orgId}`);
  if (!fs.existsSync(orgDir)) {
    logger.error(`Tashkilot uchun yangilanishlar topilmadi: org-${orgId}`);
    return null;
  }

  const files = fs.readdirSync(orgDir).filter(file => file.startsWith(appType) && file.endsWith('.exe'));
  if (!files.length) return null;

  const latestFile = files.sort().reverse()[0];
  return {
    version: latestFile.split('-')[2].replace('.exe', ''),
    path: path.join(orgDir, latestFile),
    url: `/updates/org-${orgId}/${latestFile}`,
  };
}

function saveUpdate(orgId, appType, version, filePath) {
  const orgDir = path.join(updatesDir, `org-${orgId}`);
  if (!fs.existsSync(orgDir)) {
    fs.mkdirSync(orgDir);
  }

  const newFileName = `${appType}-v${version}.exe`;
  const destination = path.join(orgDir, newFileName);
  fs.copyFileSync(filePath, destination);
  logger.info(`Yangilanish saqlandi: ${destination}`);
  return { version, url: `/updates/org-${orgId}/${newFileName}` };
}

module.exports = { getLatestUpdate, saveUpdate };