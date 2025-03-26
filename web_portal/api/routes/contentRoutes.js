const express = require('express');
const router = express.Router();
const contentController = require('../controllers/contentController');

router.get('/', contentController.getContent);
router.post('/update', contentController.updateContent);

module.exports = router;