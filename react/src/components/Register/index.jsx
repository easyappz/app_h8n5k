import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../Card';
import InputField from '../InputField';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const { register } = useAuth();
  const [form, setForm] = useState({
    fullName: '',
    workspace: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    if (!form.email || !form.password) {
      setError('Заполните обязательные поля.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Пароли не совпадают.');
      return;
    }
    setSubmitting(true);
    try {
      await register({ email: form.email, password: form.password });
      setSuccess('Учётная запись создана. Можно перейти к профилю.');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="register-page" data-easytag="id9-src/components/Register/index.jsx">
      <Card
        title="Расширенная регистрация"
        description="Заполните поля, чтобы создать аккаунт и сразу попасть в чат."
      >
        <form className="stacked-form" onSubmit={handleSubmit}>
          <InputField
            id="register-full-name"
            label="Имя и фамилия"
            value={form.fullName}
            onChange={handleChange('fullName')}
            placeholder="Например, Анна Смирнова"
            disabled={submitting}
            autoComplete="name"
          />
          <InputField
            id="register-workspace"
            label="Команда или проект"
            value={form.workspace}
            onChange={handleChange('workspace')}
            placeholder="Название команды (необязательно)"
            disabled={submitting}
            autoComplete="organization"
          />
          <InputField
            id="register-email"
            label="Email"
            type="email"
            value={form.email}
            onChange={handleChange('email')}
            placeholder="you@example.com"
            disabled={submitting}
            required
            autoComplete="email"
          />
          <InputField
            id="register-password"
            label="Пароль"
            type="password"
            value={form.password}
            onChange={handleChange('password')}
            placeholder="Минимум 8 символов"
            disabled={submitting}
            required
            autoComplete="new-password"
          />
          <InputField
            id="register-confirm-password"
            label="Повторите пароль"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange('confirmPassword')}
            placeholder="Повторите пароль"
            disabled={submitting}
            required
            autoComplete="new-password"
          />
          {error && <p className="field-error">{error}</p>}
          {success && (
            <p className="form-success">
              {success} <Link to="/profile">Открыть профиль</Link>
            </p>
          )}
          <div className="form-actions">
            <button type="submit" className="btn" disabled={submitting}>
              {submitting ? 'Создаём...' : 'Создать аккаунт'}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export { Register };
