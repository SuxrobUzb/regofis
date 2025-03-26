const Content = require('../models/Content');
const logger = require('../utils/logger');

const contentController = {
  async getContent(req, res) {
    try {
      const content = await Content.getAll();
      res.json(content);
    } catch (error) {
      logger.error('Error fetching content:', error);
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  },

  async updateContent(req, res) {
    const { key, value } = req.body;

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Доступ только для администраторов' });
    }

    try {
      const updatedContent = await Content.create({ key, value });
      logger.info(`Content updated: ${key}`);
      res.json(updatedContent);
    } catch (error) {
      logger.error('Error updating content:', error);
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  }
};

module.exports = contentController;