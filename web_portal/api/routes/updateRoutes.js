const express = require('express');
const router = express.Router();
const updateController = require('../controllers/updateController');
const authMiddleware = require('../middleware/authMiddleware');
const fileUpload = require('express-fileupload');

router.get('/check', authMiddleware, updateController.checkUpdate);
router.post('/upload', authMiddleware, fileUpload(), updateController.uploadUpdate);
router.get('/org-:orgId/:fileName', authMiddleware, updateController.downloadUpdate);

module.exports = router;