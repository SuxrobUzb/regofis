import React, { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const UserManagement = () => {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [orgId, setOrgId] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        'http://localhost:3000/api/auth/register',
        { username, password, role, orgId },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      alert('Foydalanuvchi yaratildi');
    } catch (error) {
      alert('Xato yuz berdi');
    }
  };

  return (
    <div>
      <h1>{t('userManagement')}</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Login"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Parol"
          required
        />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="user">Foydalanuvchi</option>
          <option value="admin">Admin</option>
        </select>
        <input
          type="text"
          value={orgId}
          onChange={(e) => setOrgId(e.target.value)}
          placeholder="Tashkilot ID"
          required
        />
        <button type="submit">{t('createUser')}</button>
      </form>
    </div>
  );
};

export default UserManagement;