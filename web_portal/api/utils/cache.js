const redisClient = require('../config/redisConfig');
const logger = require('./logger');

const CACHE_TTL = 3600; // 1 soat (sekundda)

const cache = {
  async get(key) {
    try {
      const data = await redisClient.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      logger.error('Keshdan olishda xato', error);
      return null;
    }
  },

  async set(key, value, ttl = CACHE_TTL) {
    try {
      await redisClient.setEx(key, ttl, JSON.stringify(value));
      logger.info(`Keshga yozildi: ${key}`);
    } catch (error) {
      logger.error('Keshga yozishda xato', error);
    }
  },

  async clear(key) {
    try {
      await redisClient.del(key);
      logger.info(`Kesh o‘chirildi: ${key}`);
    } catch (error) {
      logger.error('Keshni o‘chirishda xato', error);
    }
  }
};

module.exports = cache;