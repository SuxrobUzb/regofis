const express = require('express');
const bodyParser = require('body-parser');
const redis = require('redis');
const crypto = require('crypto');
const WebSocket = require('ws');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const tariffRoutes = require('./routes/tariffRoutes');
const licenseRoutes = require('./routes/licenseRoutes');
const contentRoutes = require('./routes/contentRoutes');
const queueRoutes = require('./routes/queueRoutes');
const statisticsRoutes = require('./routes/statisticsRoutes');
const adminLogRoutes = require('./routes/adminLogRoutes');
const authMiddleware = require('./middleware/authMiddleware');
const errorMiddleware = require('./middleware/errorMiddleware');
const logger = require('./utils/logger');
const { dbConfig, initDb } = require('./config/dbConfig');
const { backupDatabase } = require('./utils/backup');
const AdminLog = require('./models/AdminLog');
const backupRoutes = require('./routes/backupRoutes');
const organizationRoutes = require('./routes/organizationRoutes');
const updateRoutes = require('./routes/updateRoutes');
const fileUpload = require('express-fileupload');
const audioRoutes = require('./routes/audioRoutes');


const app = express();
const port = 3000;

// Генерация секретного ключа
const SECRET_KEY = crypto.randomBytes(32).toString('hex');
logger.info(`Generated SECRET_KEY: ${SECRET_KEY}`);
app.locals.SECRET_KEY = SECRET_KEY;

// Инициализация базы данных
let pool;
(async () => {
  pool = await initDb();
})();

// Подключение к Redis
const redisClient = redis.createClient({
  url: 'redis://localhost:6379'
});
redisClient.connect().catch(err => logger.error('Redis connection error:', err));

// Middleware для логирования действий администратора
app.use(async (req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  if (req.user && req.user.role === 'admin' && req.method !== 'GET') {
    await AdminLog.create({
      userId: req.user.id,
      action: `${req.method} ${req.path}`,
      details: req.body,
    });
  }
  next();
});

const promMid = require('express-prometheus-middleware');

app.use(promMid({
  metricsPath: '/metrics',
  collectDefaultMetrics: true,
  requestDurationBuckets: [0.1, 0.5, 1, 1.5],
}));

app.use(bodyParser.json());

app.use(fileUpload());
app.use('/api/updates', updateRoutes);

// Маршруты
app.use('/api/auth', authRoutes);
app.use('/api/users', authMiddleware, userRoutes);
app.use('/api/tariffs', authMiddleware, tariffRoutes);
app.use('/api/licenses', authMiddleware, licenseRoutes);
app.use('/api/content', authMiddleware, contentRoutes);
app.use('/api/queue', authMiddleware, queueRoutes);
app.use('/api/statistics', authMiddleware, statisticsRoutes);
app.use('/api/admin-logs', authMiddleware, adminLogRoutes);
app.use('/api/backup', backupRoutes);
app.use('/api/organizations', organizationRoutes);
app.use('/api/audio', audioRoutes);

app.post('/api/backup', authMiddleware, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Доступ только для администраторов' });
  }
  backupDatabase();
  res.json({ message: 'Резервное копирование запущено' });
});

app.use(errorMiddleware);

// Запуск сервера
const server = app.listen(port, () => {
  logger.info(`API server running on port ${port}`);
});

// WebSocket сервер
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  logger.info('New WebSocket connection');
  ws.on('message', (message) => {
    logger.info(`Received message: ${message}`);
  });
  ws.on('close', () => {
    logger.info('WebSocket connection closed');
  });
});

// Функция для отправки уведомлений всем операторам
function notifyOperators(message) {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}

// Пример интеграции с queueController
app.set('notifyOperators', notifyOperators);

module.exports = app;