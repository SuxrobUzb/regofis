import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const Home = () => {
  const { t } = useTranslation();
  const [content, setContent] = useState({});

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/content');
        const contentMap = response.data.reduce((acc, item) => {
          acc[item.key] = item.value;
          return acc;
        }, {});
        setContent(contentMap);
      } catch (error) {
        console.error('Error fetching content:', error);
      }
    };
    fetchContent();
  }, []);

  return (
    <div>
      <h1>{content['home_title']?.text || t('welcome')}</h1>
      <p>{content['home_description']?.text || t('description')}</p>
      {content['home_image'] && (
        <img src={content['home_image'].url} alt="Главная" style={{ maxWidth: '100%' }} />
      )}
    </div>
  );
};

export default Home;