const { Pool } = require('pg');
const dbConfig = require('../config/dbConfig');
const cache = require('../utils/cache');
const logger = require('../utils/logger');

const pool = new Pool(dbConfig);

const queueController = {
  async getQueue(req, res) {
    const cacheKey = `queue:org:${req.user.orgId}`;
    try {
      let queueData = await cache.get(cacheKey);

      if (!queueData) {
        const queue = await pool.query(
          'SELECT * FROM tickets WHERE status = $1 AND org_id = $2 ORDER BY created_at ASC',
          ['waiting', req.user.orgId]
        );
        const current = await pool.query(
          'SELECT * FROM tickets WHERE status = $1 AND org_id = $2 ORDER BY updated_at DESC LIMIT 1',
          ['called', req.user.orgId]
        );
        queueData = { queue: queue.rows, current: current.rows[0] || null };
        await cache.set(cacheKey, queueData, 60); // 1 daqiqa TTL
      }

      logger.action(req.user.id, 'get_queue', { orgId: req.user.orgId });
      res.json(queueData);
    } catch (error) {
      logger.error('Ocheredni olishda xato', error);
      res.status(500).json({ message: 'Server xatosi' });
    }
  },

  async callNext(req, res) {
    const { operatorId } = req.body;
    const cacheKey = `queue:org:${req.user.orgId}`;
    try {
      const nextTicket = await pool.query(
        'UPDATE tickets SET status = $1, operator_id = $2 WHERE id = (SELECT id FROM tickets WHERE status = $3 AND org_id = $4 ORDER BY created_at ASC LIMIT 1) RETURNING *',
        ['called', operatorId, 'waiting', req.user.orgId]
      );
      const ticket = nextTicket.rows[0];
      if (!ticket) return res.status(404).json({ message: 'Ochered bo‘sh' });

      await cache.clear(cacheKey); // Ochered yangilanganda keshni o‘chirish
      logger.action(req.user.id, 'call_next_ticket', { ticketId: ticket.id, operatorId });
      req.app.get('notifyOperators')({
        type: 'ticket_called',
        ticket: ticket.number,
        operatorId,
      });
      res.json({ ticket });
    } catch (error) {
      logger.error('Keyingi talonni chaqirishda xato', error);
      res.status(500).json({ message: 'Server xatosi' });
    }
  }
};

module.exports = queueController;