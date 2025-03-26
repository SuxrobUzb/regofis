const express = require('express');
const router = express.Router();
const backupController = require('../controllers/backupController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/create', authMiddleware, backupController.createBackup);
router.post('/restore', authMiddleware, backupController.restoreBackup);
router.get('/list', authMiddleware, backupController.listBackups);

module.exports = router;