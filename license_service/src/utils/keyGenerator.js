const { v4: uuidv4 } = require('uuid');

function generateLicenseKey() {
  const key = uuidv4();
  return key.toUpperCase().replace(/-/g, '');
}

module.exports = { generateLicenseKey };