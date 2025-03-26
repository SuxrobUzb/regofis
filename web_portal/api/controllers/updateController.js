const { getLatestUpdate, saveUpdate } = require('../utils/updater');
const logger = require('../utils/logger');
const path = require('path');

const updateController = {
  async checkUpdate(req, res) {
    const { orgId, appType, currentVersion } = req.query;
    try {
      const latest = getLatestUpdate(orgId, appType);
      if (!latest || latest.version <= currentVersion) {
        return res.status(204).json({ message: 'Yangi versiya mavjud emas' });
      }
      res.json({
        version: latest.version,
        url: `http://localhost:3000${latest.url}`,
        path: latest.path,
      });
    } catch (error) {
      logger.error('Yangilanishni tekshirishda xato:', error);
      res.status(500).json({ message: 'Server xatosi' });
    }
  },

  async uploadUpdate(req, res) {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Faqat adminlar uchun ruxsat' });
    }
    const { orgId, appType, version } = req.body;
    const file = req.files?.file;

    if (!file) {
      return res.status(400).json({ message: 'Fayl yuklanmadi' });
    }

    try {
      const update = saveUpdate(orgId, appType, version, file.tempFilePath);
      res.json({ message: 'Yangilanish yuklandi', update });
    } catch (error) {
      logger.error('Yangilanish yuklashda xato:', error);
      res.status(500).json({ message: 'Server xatosi' });
    }
  },

  async downloadUpdate(req, res) {
    const { orgId, fileName } = req.params;
    const filePath = path.join(__dirname, '../updates', `org-${orgId}`, fileName);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'Fayl topilmadi' });
    }

    res.download(filePath);
  }
};

module.exports = updateController;