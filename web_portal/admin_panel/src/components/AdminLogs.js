import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminLogs = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/admin-logs', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setLogs(response.data);
      } catch (error) {
        console.error('Error fetching admin logs:', error);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div>
      <h1>Логи действий администратора</h1>
      <ul>
        {logs.map(log => (
          <li key={log.id}>
            {log.created_at}: {log.action} (Пользователь ID: {log.user_id}) - {JSON.stringify(log.details)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminLogs;