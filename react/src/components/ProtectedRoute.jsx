import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children }) => {
  const { token, loadingProfile } = useAuth();

  if (loadingProfile) {
    return (
      <div className="page-state" data-easytag="id10-src/components/ProtectedRoute.jsx">
        Загрузка профиля...
      </div>
    );
  }

  if (!token) {
    return (
      <div className="page-state" data-easytag="id10-src/components/ProtectedRoute.jsx">
        <Navigate to="/" replace />
        Перенаправление...
      </div>
    );
  }

  return (
    <div className="protected-route" data-easytag="id10-src/components/ProtectedRoute.jsx">
      {children}
    </div>
  );
};
