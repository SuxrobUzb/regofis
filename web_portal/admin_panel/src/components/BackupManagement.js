import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const BackupManagement = () => {
  const { t } = useTranslation();
  const [backups, setBackups] = useState([]);
  const [selectedBackup, setSelectedBackup] = useState('');

  useEffect(() => {
    fetchBackups();
  }, []);

  const fetchBackups = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/backup/list', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setBackups(response.data.backups);
    } catch (error) {
      console.error('Rezerv nusxalarni olishda xato:', error);
    }
  };

  const handleCreateBackup = async () => {
    try {
      await axios.post(
        'http://localhost:3000/api/backup/create',
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      alert('Rezerv nusxa yaratish boshlandi');
      fetchBackups();
    } catch (error) {
      alert('Rezerv nusxa yaratishda xato');
    }
  };

  const handleRestoreBackup = async () => {
    if (!selectedBackup) {
      alert('Iltimos, tiklash uchun fayl tanlang');
      return;
    }
    try {
      await axios.post(
        'http://localhost:3000/api/backup/restore',
        { backupFileName: selectedBackup },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      alert('Ma\'lumotlar bazasi tiklandi');
    } catch (error) {
      alert('Tiklashda xato yuz berdi');
    }
  };

  return (
    <div>
      <h1>{t('backupManagement')}</h1>
      <button onClick={handleCreateBackup}>{t('createBackup')}</button>
      <h2>{t('availableBackups')}</h2>
      <select
        value={selectedBackup}
        onChange={(e) => setSelectedBackup(e.target.value)}
      >
        <option value="">{t('selectBackup')}</option>
        {backups.map((backup) => (
          <option key={backup} value={backup}>
            {backup}
          </option>
        ))}
      </select>
      <button onClick={handleRestoreBackup}>{t('restoreBackup')}</button>
    </div>
  );
};

export default BackupManagement;