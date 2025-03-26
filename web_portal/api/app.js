const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const redis = require('redis');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const tariffRoutes = require('./routes/tariffRoutes');
const licenseRoutes = require('./routes/licenseRoutes');
const contentRoutes = require('./routes/contentRoutes');
const authMiddleware = require('./middleware/authMiddleware');
const errorMiddleware = require('./middleware/errorMiddleware');
const logger = require('./utils/logger');
const dbConfig = require('./config/dbConfig');

const app = express();
const port = 3000;

// Подключение к PostgreSQL
const pool = new Pool(dbConfig);

// Подключение к Redis
const redisClient = redis.createClient({
  url: 'redis://localhost:6379'
});
redisClient.connect().catch(err => logger.error('Redis connection error:', err));

// Middleware
app.use(bodyParser.json());
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Маршруты
app.use('/api/auth', authRoutes);
app.use('/api/users', authMiddleware, userRoutes);
app.use('/api/tariffs', authMiddleware, tariffRoutes);
app.use('/api/licenses', authMiddleware, licenseRoutes);
app.use('/api/content', authMiddleware, contentRoutes);

// Обработка ошибок
app.use(errorMiddleware);

// Запуск сервера
app.listen(port, () => {
  logger.info(`API server running on port ${port}`);
});

module.exports = app;