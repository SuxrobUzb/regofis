const License = require('../models/License');
const { generateLicenseKey } = require('../utils/keyGenerator');
const logger = require('../utils/logger');

const licenseController = {
  async createLicense(req, res) {
    const { userId, tariffId, durationDays, maxWorkstations } = req.body;

    try {
      const key = generateLicenseKey();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + durationDays);

      const license = await License.create({
        key,
        userId,
        tariffId,
        expiresAt,
        maxWorkstations,
      });

      logger.info(`License created: ${key}`);
      res.status(201).json(license);
    } catch (error) {
      logger.error('License creation error:', error);
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  },

  async verifyLicense(req, res) {
    const { key } = req.body;

    try {
      const license = await License.findByKey(key);
      if (!license || license.expiresAt < new Date()) {
        return res.json({ valid: false, message: 'Лицензия недействительна или истекла' });
      }

      res.json({
        valid: true,
        tariffId: license.tariffId,
        maxWorkstations: license.maxWorkstations,
      });
    } catch (error) {
      logger.error('License verification error:', error);
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  }
};

module.exports = licenseController;