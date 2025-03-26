const { backupDatabase, restoreDatabase } = require('../utils/backup');

const backupController = {
  async createBackup(req, res) {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Faqat adminlar uchun ruxsat' });
    }
    try {
      backupDatabase();
      res.json({ message: 'Rezerv nusxa yaratish boshlandi' });
    } catch (error) {
      res.status(500).json({ message: 'Rezerv nusxa yaratishda xato' });
    }
  },

  async restoreBackup(req, res) {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Faqat adminlar uchun ruxsat' });
    }
    const { backupFileName } = req.body;
    if (!backupFileName) {
      return res.status(400).json({ message: 'Rezerv nusxa fayli nomi kiritilmadi' });
    }

    try {
      await restoreDatabase(backupFileName);
      res.json({ message: `Ma'lumotlar bazasi ${backupFileName} dan tiklandi` });
    } catch (error) {
      res.status(500).json({ message: 'Tiklashda xato yuz berdi' });
    }
  },

  async listBackups(req, res) {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Faqat adminlar uchun ruxsat' });
    }
    try {
      const backups = fs.readdirSync(backupDir).filter(file => file.endsWith('.sql'));
      res.json({ backups });
    } catch (error) {
      res.status(500).json({ message: 'Rezerv nusxalarni ro‘yxatini olishda xato' });
    }
  }
};

module.exports = backupController;