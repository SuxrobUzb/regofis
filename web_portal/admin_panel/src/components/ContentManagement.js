import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const ContentManagement = () => {
  const { t } = useTranslation();
  const [content, setContent] = useState([]);
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/content', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setContent(response.data);
      } catch (error) {
        console.error('Error fetching content:', error);
      }
    };
    fetchContent();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:3000/api/content/update',
        { key, value: JSON.parse(value) },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setContent(prev => [...prev.filter(c => c.key !== key), response.data]);
      setKey('');
      setValue('');
    } catch (error) {
      console.error('Error updating content:', error);
    }
  };

  return (
    <div>
      <h1>{t('contentManagement')}</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Ключ:</label>
          <input
            type="text"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Значение (JSON):</label>
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            rows="5"
            required
          />
        </div>
        <button type="submit">Обновить</button>
      </form>
      <h2>Текущий контент</h2>
      <ul>
        {content.map(item => (
          <li key={item.key}>
            {item.key}: {JSON.stringify(item.value)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContentManagement;