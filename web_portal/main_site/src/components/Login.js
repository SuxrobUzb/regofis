import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ setToken }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [requires2FA, setRequires2FA] = useState(false);
  const [userId, setUserId] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/auth/login', {
        username,
        password,
      });
      if (response.data.requires2FA) {
        setRequires2FA(true);
        setUserId(response.data.userId);
      } else {
        setToken(response.data.token);
        setError('');
      }
    } catch (err) {
      setError('Ошибка входа. Проверьте данные.');
    }
  };

  const handle2FA = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/auth/verify-2fa', {
        userId,
        code,
      });
      setToken(response.data.token);
      setError('');
      setRequires2FA(false);
    } catch (err) {
      setError('Неверный код 2FA');
    }
  };

  return (
    <div>
      <h2>Вход</h2>
      {!requires2FA ? (
        <form onSubmit={handleLogin}>
          <div>
            <label>Имя пользователя:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Пароль:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button type="submit">Войти</button>
        </form>
      ) : (
        <form onSubmit={handle2FA}>
          <div>
            <label>Код 2FA:</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button type="submit">Подтвердить</button>
        </form>
      )}
    </div>
  );
};

export default Login;