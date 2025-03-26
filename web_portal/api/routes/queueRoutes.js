const express = require('express');
const router = express.Router();
const queueController = require('../controllers/queueController');

router.post('/issue', queueController.issueTicket);
router.post('/bulk', queueController.bulkInsertTickets); // Новый маршрут
router.get('/', queueController.getQueue);
router.post('/call', queueController.callNext);

module.exports = router;