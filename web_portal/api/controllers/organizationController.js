const Organization = require('../models/Organization');
const cache = require('../utils/cache');
const logger = require('../utils/logger');

const organizationController = {
  async createOrganization(req, res) {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Faqat adminlar uchun ruxsat' });
    }
    const { name, styles, tariffId } = req.body;
    try {
      const org = await Organization.create({ name, styles, tariffId });
      await cache.set(`org:${org.id}`, org); // Yangi tashkilotni keshlash
      logger.action(req.user.id, 'create_organization', { orgId: org.id });
      res.json(org);
    } catch (error) {
      logger.error('Tashkilot yaratishda xato:', error);
      res.status(500).json({ message: 'Server xatosi' });
    }
  },

  async getOrganization(req, res) {
    const { id } = req.params;
    try {
      const cacheKey = `org:${id}`;
      let org = await cache.get(cacheKey);

      if (!org) {
        org = await Organization.getById(id);
        if (!org) return res.status(404).json({ message: 'Tashkilot topilmadi' });
        await cache.set(cacheKey, org);
      }

      logger.action(req.user.id, 'get_organization', { orgId: id });
      res.json(org);
    } catch (error) {
      logger.error('Tashkilot olishda xato:', error);
      res.status(500).json({ message: 'Server xatosi' });
    }
  }
};

module.exports = organizationController;