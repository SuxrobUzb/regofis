const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const logger = require('../utils/logger');

const authController = {
  async login(req, res) {
    const { username, password } = req.body;
    try {
      const user = await User.findByUsername(username);
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'Login yoki parol xato' });
      }

      const token = jwt.sign(
        { id: user.id, role: user.role, orgId: user.org_id },
        req.app.locals.SECRET_KEY,
        { expiresIn: '1h' }
      );
      res.json({ token });
    } catch (error) {
      logger.error('Login xatosi:', error);
      res.status(500).json({ message: 'Server xatosi' });
    }
  },

  async register(req, res) {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Faqat adminlar uchun ruxsat' });
    }
    const { username, password, role, orgId } = req.body;
    try {
      const user = await User.create({ username, password, role, orgId });
      res.json({ message: 'Foydalanuvchi yaratildi', userId: user.id });
    } catch (error) {
      logger.error('Ro‘yxatdan o‘tish xatosi:', error);
      res.status(500).json({ message: 'Server xatosi' });
    }
  }
};

module.exports = authController;