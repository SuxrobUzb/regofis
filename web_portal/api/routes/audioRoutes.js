const express = require('express');
const router = express.Router();
const audioController = require('../controllers/audioController');
const authMiddleware = require('../middleware/authMiddleware');
const fileUpload = require('express-fileupload');

router.post('/upload', authMiddleware, fileUpload(), audioController.uploadAudio);
router.get('/:orgId', authMiddleware, audioController.getAudioSettings);
router.get('/org-:orgId/:key', authMiddleware, audioController.downloadAudio);

module.exports = router;