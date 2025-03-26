const express = require('express');
const router = express.Router();
const statisticsController = require('../controllers/statisticsController');

router.get('/', statisticsController.getStats);
router.get('/export/pdf', statisticsController.exportStatsPDF);
router.get('/export/excel', statisticsController.exportStatsExcel);

module.exports = router;