import React, { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import LoadingSpinner from './LoadingSpinner';

const UserManagement = () => {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [orgId, setOrgId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(
        'http://localhost:3000/api/auth/register',
        { username, password, role, orgId },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      alert('Foydalanuvchi yaratildi');
    } catch (error) {
      alert('Xato yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>{t('userManagement')}</h1>
      {loading ? (
        <LoadingSpinner />
      ) : (
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
      )}
    </div>
  );
};

export default UserManagement;