const AdminLog = require('../models/AdminLog');
const logger = require('../utils/logger');

const adminLogController = {
  async getLogs(req, res) {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Доступ только для администраторов' });
    }

    try {
      const logs = await AdminLog.getAll();
      res.json(logs);
    } catch (error) {
      logger.error('Error fetching admin logs:', error);
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  }
};

module.exports = adminLogController;