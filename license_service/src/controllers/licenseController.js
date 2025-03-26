const License = require('../models/License');
const logger = require('../utils/logger');

const licenseController = {
  async verifyLicense(req, res) {
    const { key, orgId } = req.body;
    try {
      const license = await License.findByKey(key);
      if (!license || license.org_id !== parseInt(orgId) || new Date(license.expires_at) < new Date()) {
        return res.json({ valid: false });
      }
      res.json({
        valid: true,
        tariffId: license.tariff_id,
        maxWorkstations: license.max_workstations,
      });
    } catch (error) {
      logger.error('Litsenziya tekshirishda xato:', error);
      res.status(500).json({ message: 'Server xatosi' });
    }
  }
};

module.exports = licenseController;