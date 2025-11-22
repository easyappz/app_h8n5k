import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { member, logout } = useAuth();

  const resolveNavClass = ({ isActive }) => (isActive ? 'nav-link active' : 'nav-link');

  return (
    <header className="app-header" data-easytag="id2-src/components/Header/index.jsx">
      <div className="brand">EasyChat</div>
      <nav className="nav-group">
        <NavLink to="/" className={resolveNavClass}>
          Главная
        </NavLink>
        <NavLink to="/profile" className={resolveNavClass}>
          Профиль
        </NavLink>
        <NavLink to="/register" className={resolveNavClass}>
          Регистрация
        </NavLink>
      </nav>
      <div className="header-auth">
        {member ? (
          <>
            <span className="header-email">{member.email}</span>
            <button type="button" className="btn btn-ghost" onClick={logout}>
              Выйти
            </button>
          </>
        ) : (
          <NavLink to="/register" className="btn btn-ghost">
            Создать аккаунт
          </NavLink>
        )}
      </div>
    </header>
  );
};

export default Header;
