const AudioSetting = require('../models/AudioSetting');
const logger = require('../utils/logger');
const path = require('path');
const fs = require('fs');

const audioController = {
  async uploadAudio(req, res) {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Faqat adminlar uchun ruxsat' });
    }
    const { orgId, key } = req.body;
    const file = req.files?.file;

    if (!file) {
      return res.status(400).json({ message: 'Fayl yuklanmadi' });
    }

    const audioDir = path.join(__dirname, '../audio', `org-${orgId}`);
    if (!fs.existsSync(audioDir)) {
      fs.mkdirSync(audioDir, { recursive: true });
    }

    const filePath = path.join(audioDir, `${key}.mp3`);
    file.mv(filePath, async (err) => {
      if (err) {
        logger.error('Audio faylni saqlashda xato:', err);
        return res.status(500).json({ message: 'Server xatosi' });
      }

      try {
        const setting = await AudioSetting.create({ orgId, key, filePath });
        res.json({ message: 'Audio yuklandi', setting });
      } catch (error) {
        logger.error('Audio sozlamasini yaratishda xato:', error);
        res.status(500).json({ message: 'Server xatosi' });
      }
    });
  },

  async getAudioSettings(req, res) {
    const { orgId } = req.params;
    try {
      const settings = await AudioSetting.getByOrgId(orgId);
      res.json(settings.map(s => ({
        key: s.key,
        url: `http://localhost:3000/api/audio/org-${orgId}/${s.key}.mp3`,
      })));
    } catch (error) {
      logger.error('Audio sozlamalarini olishda xato:', error);
      res.status(500).json({ message: 'Server xatosi' });
    }
  },

  async downloadAudio(req, res) {
    const { orgId, key } = req.params;
    const filePath = path.join(__dirname, '../audio', `org-${orgId}`, `${key}.mp3`);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'Fayl topilmadi' });
    }

    res.download(filePath);
  }
};

module.exports = audioController;