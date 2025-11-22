import React, { useMemo, useState } from 'react';
import Card from '../Card';
import { useAuth } from '../../context/AuthContext';

const Profile = () => {
  const { member, refreshProfile } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const registeredAt = useMemo(() => {
    const value =
      member?.created_at ||
      member?.created ||
      member?.joined_at ||
      member?.date_joined ||
      member?.registered_at;
    if (!value) {
      return '—';
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return '—';
    }
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }, [member]);

  const handleRefresh = async () => {
    setError('');
    setRefreshing(true);
    try {
      await refreshProfile();
    } catch (err) {
      setError(err.message);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="profile-page" data-easytag="id8-src/components/Profile/index.jsx">
      <Card title="Профиль участника" description="Системные сведения о вашем аккаунте.">
        <div className="profile-row">
          <span className="profile-label">Email</span>
          <span className="profile-value">{member?.email || '—'}</span>
        </div>
        <div className="profile-row">
          <span className="profile-label">Дата регистрации</span>
          <span className="profile-value">{registeredAt}</span>
        </div>
        {error && <p className="field-error">{error}</p>}
        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={handleRefresh} disabled={refreshing}>
            {refreshing ? 'Обновляем...' : 'Обновить данные'}
          </button>
        </div>
      </Card>
    </div>
  );
};

export { Profile };
