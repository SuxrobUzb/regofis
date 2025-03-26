import React, { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const UpdateManagement = () => {
  const { t } = useTranslation();
  const [orgId, setOrgId] = useState('');
  const [appType, setAppType] = useState('kiosk');
  const [version, setVersion] = useState('');
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('orgId', orgId);
    formData.append('appType', appType);
    formData.append('version', version);
    formData.append('file', file);

    try {
      await axios.post('http://localhost:3000/api/updates/upload', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Yangilanish yuklandi');
    } catch (error) {
      alert('Yangilanish yuklashda xato');
    }
  };

  return (
    <div>
      <h1>{t('updateManagement')}</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Tashkilot ID:</label>
          <input type="text" value={orgId} onChange={(e) => setOrgId(e.target.value)} required />
        </div>
        <div>
          <label>Dastur turi:</label>
          <select value={appType} onChange={(e) => setAppType(e.target.value)}>
            <option value="kiosk">Infokiiosk</option>
            <option value="tv_panel">TV Panel</option>
            <option value="operator">Operator</option>
          </select>
        </div>
        <div>
          <label>Versiya:</label>
          <input type="text" value={version} onChange={(e) => setVersion(e.target.value)} required />
        </div>
        <div>
          <label>Fayl:</label>
          <input type="file" onChange={(e) => setFile(e.target.files[0])} required />
        </div>
        <button type="submit">{t('uploadUpdate')}</button>
      </form>
    </div>
  );
};

export default UpdateManagement;