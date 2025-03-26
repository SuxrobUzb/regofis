const express = require('express');
const router = express.Router();
const adminLogController = require('../controllers/adminLogController');

router.get('/', adminLogController.getLogs);

module.exports = router;