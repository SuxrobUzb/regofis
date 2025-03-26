const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');

const SECRET_KEY = 'your-secret-key'; // В реальном проекте используйте переменные окружения

const authController = {
  async login(req, res) {
    const { username, password } = req.body;

    try {
      const user = await User.findByUsername(username);
      if (!user) {
        return res.status(401).json({ message: 'Неверное имя пользователя или пароль' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Неверное имя пользователя или пароль' });
      }

      const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
      logger.info(`User ${username} logged in`);
      res.json({ token });
    } catch (error) {
      logger.error('Login error:', error);
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  },

  async register(req, res) {
    const { username, password, role } = req.body;

    try {
      const existingUser = await User.findByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: 'Пользователь уже существует' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({ username, password: hashedPassword, role });
      logger.info(`User ${username} created`);
      res.status(201).json(newUser);
    } catch (error) {
      logger.error('Registration error:', error);
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  }
};

module.exports = authController;