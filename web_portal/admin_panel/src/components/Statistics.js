import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const Statistics = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/statistics', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching statistics:', error);
      }
    };
    fetchStats();
  }, []);

  const exportPDF = () => {
    window.location.href = 'http://localhost:3000/api/statistics/export/pdf';
  };

  const exportExcel = () => {
    window.location.href = 'http://localhost:3000/api/statistics/export/excel';
  };

  if (!stats) return <div>Загрузка...</div>;

  return (
    <div>
      <h1>{t('statistics')}</h1>
      <button onClick={exportPDF}>Export to PDF</button>
      <button onClick={exportExcel}>Export to Excel</button>
      <h2>Общая статистика</h2>
      <p>Всего талонов: {stats.total}</p>
      <p>В ожидании: {stats.waiting}</p>
      <p>Вызваны: {stats.called}</p>
      <p>Завершены: {stats.completed}</p>
      <h2>Статистика операторов</h2>
      <ul>
        {stats.operators.map(op => (
          <li key={op.username}>
            {op.username}: Обслужено талонов: {op.ticketsServed}, Среднее время: {op.avgTime} мин
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Statistics;