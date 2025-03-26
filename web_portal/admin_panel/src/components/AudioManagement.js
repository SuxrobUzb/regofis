import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const AudioManagement = () => {
  const { t } = useTranslation();
  const [orgId, setOrgId] = useState('');
  const [key, setKey] = useState('ticket-call');
  const [file, setFile] = useState(null);
  const [settings, setSettings] = useState([]);

  useEffect(() => {
    if (orgId) fetchSettings();
  }, [orgId]);

  const fetchSettings = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/audio/${orgId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setSettings(response.data);
    } catch (error) {
      alert('Audio sozlamalarini olishda xato');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('orgId', orgId);
    formData.append('key', key);
    formData.append('file', file);

    try {
      await axios.post('http://localhost:3000/api/audio/upload', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Audio yuklandi');
      fetchSettings();
    } catch (error) {
      alert('Audio yuklashda xato');
    }
  };

  return (
    <div>
      <h1>{t('audioManagement')}</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Tashkilot ID:</label>
          <input type="text" value={orgId} onChange={(e) => setOrgId(e.target.value)} required />
        </div>
        <div>
          <label>Audio turi:</label>
          <select value={key} onChange={(e) => setKey(e.target.value)}>
            <option value="ticket-call">Talon chaqiruvi</option>
            <option value="welcome">Xush kelibsiz</option>
          </select>
        </div>
        <div>
          <label>Fayl:</label>
          <input type="file" accept=".mp3" onChange={(e) => setFile(e.target.files[0])} required />
        </div>
        <button type="submit">{t('uploadAudio')}</button>
      </form>
      <h2>{t('currentAudio')}</h2>
      <ul>
        {settings.map(s => (
          <li key={s.key}>
            {s.key}: <audio controls src={s.url} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AudioManagement;