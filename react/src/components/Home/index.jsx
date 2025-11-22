import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../Card';
import InputField from '../InputField';
import ChatMessage from '../ChatMessage';
import ChatComposer from '../ChatComposer';
import { useAuth } from '../../context/AuthContext';
import { listMessages } from '../../api/listMessages';
import { sendMessage } from '../../api/sendMessage';

const POLL_INTERVAL = 5000;

const normalizeMessages = (payload) => {
  if (!payload) {
    return [];
  }
  if (Array.isArray(payload)) {
    return payload;
  }
  if (Array.isArray(payload.results)) {
    return payload.results;
  }
  if (Array.isArray(payload.data)) {
    return payload.data;
  }
  if (Array.isArray(payload.items)) {
    return payload.items;
  }
  return [];
};

const detectMessageKey = (message) => {
  if (!message) {
    return 'content';
  }
  if (typeof message.content === 'string') {
    return 'content';
  }
  if (typeof message.text === 'string') {
    return 'text';
  }
  if (typeof message.body === 'string') {
    return 'body';
  }
  if (typeof message.message === 'string') {
    return 'message';
  }
  return 'content';
};

export const Home = () => {
  const { login, register, member, token } = useAuth();

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const [quickForm, setQuickForm] = useState({ email: '', password: '' });
  const [quickError, setQuickError] = useState('');
  const [quickSuccess, setQuickSuccess] = useState('');
  const [quickLoading, setQuickLoading] = useState(false);

  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(true);
  const [chatAlert, setChatAlert] = useState('');
  const [composerError, setComposerError] = useState('');
  const [messageText, setMessageText] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [messageField, setMessageField] = useState('content');

  const fetchMessages = useCallback(async () => {
    try {
      const response = await listMessages(token);
      const normalized = normalizeMessages(response);
      setMessages(normalized);
      if (normalized.length > 0) {
        setMessageField(detectMessageKey(normalized[0]));
      }
      setChatAlert('');
    } catch (error) {
      setChatAlert(error?.message || 'Не удалось обновить чат.');
    } finally {
      setMessagesLoading(false);
    }
  }, [token]);

  useEffect(() => {
    setMessagesLoading(true);
    fetchMessages();
    const interval = setInterval(() => {
      fetchMessages();
    }, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    setLoginError('');
    setLoginSuccess('');
    setLoginLoading(true);
    try {
      const memberData = await login({
        email: loginForm.email.trim(),
        password: loginForm.password,
      });
      setLoginSuccess(`С возвращением, ${memberData.email}!`);
      setLoginForm((prev) => ({ ...prev, password: '' }));
    } catch (error) {
      setLoginError(error.message);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleQuickRegisterSubmit = async (event) => {
    event.preventDefault();
    setQuickError('');
    setQuickSuccess('');
    if (!quickForm.email || !quickForm.password) {
      setQuickError('Укажите email и пароль.');
      return;
    }
    setQuickLoading(true);
    try {
      const memberData = await register({
        email: quickForm.email.trim(),
        password: quickForm.password,
      });
      setQuickSuccess(`Готово! Вы вошли как ${memberData.email}.`);
      setQuickForm({ email: '', password: '' });
    } catch (error) {
      setQuickError(error.message);
    } finally {
      setQuickLoading(false);
    }
  };

  const handleSendMessage = async (event) => {
    event.preventDefault();
    setComposerError('');
    if (!messageText.trim()) {
      setComposerError('Введите сообщение.');
      return;
    }
    if (!token) {
      setComposerError('Необходимо войти, чтобы отправлять сообщения.');
      return;
    }
    setSendingMessage(true);
    try {
      const payloadKey = messageField || 'content';
      await sendMessage({ [payloadKey]: messageText.trim() }, token);
      setMessageText('');
      await fetchMessages();
    } catch (error) {
      setComposerError(error.message);
    } finally {
      setSendingMessage(false);
    }
  };

  return (
    <div className="home-page" data-easytag="id7-src/components/Home/index.jsx">
      <Card
        title="Общий чат команды"
        description="Войдите или зарегистрируйтесь, чтобы присоединиться к разговору и отслеживать прогресс в реальном времени."
      >
        <p className="hero-text">
          Сервис поддерживает мгновенное обновление ленты каждые несколько секунд, поэтому вы всегда в курсе новых сообщений.
        </p>
      </Card>

      <div className="home-grid">
        <Card title="Вход" description="Используйте почту и пароль, чтобы вернуться в чат.">
          <form className="stacked-form" onSubmit={handleLoginSubmit}>
            <InputField
              id="login-email"
              label="Email"
              type="email"
              value={loginForm.email}
              onChange={(event) =>
                setLoginForm((prev) => ({
                  ...prev,
                  email: event.target.value,
                }))
              }
              placeholder="you@example.com"
              disabled={loginLoading}
              required
              autoComplete="email"
            />
            <InputField
              id="login-password"
              label="Пароль"
              type="password"
              value={loginForm.password}
              onChange={(event) =>
                setLoginForm((prev) => ({
                  ...prev,
                  password: event.target.value,
                }))
              }
              placeholder="Введите пароль"
              disabled={loginLoading}
              required
              autoComplete="current-password"
            />
            {loginError && <p className="field-error">{loginError}</p>}
            {loginSuccess && <p className="form-success">{loginSuccess}</p>}
            <div className="form-actions">
              <button type="submit" className="btn" disabled={loginLoading}>
                {loginLoading ? 'Входим...' : 'Войти'}
              </button>
            </div>
          </form>
        </Card>

        <Card
          title="Быстрая регистрация"
          description="Создайте учётную запись за минуту и сразу получите доступ к переписке."
        >
          <form className="stacked-form" onSubmit={handleQuickRegisterSubmit}>
            <InputField
              id="quick-email"
              label="Email"
              type="email"
              value={quickForm.email}
              onChange={(event) =>
                setQuickForm((prev) => ({
                  ...prev,
                  email: event.target.value,
                }))
              }
              placeholder="you@example.com"
              disabled={quickLoading}
              required
              autoComplete="email"
            />
            <InputField
              id="quick-password"
              label="Пароль"
              type="password"
              value={quickForm.password}
              onChange={(event) =>
                setQuickForm((prev) => ({
                  ...prev,
                  password: event.target.value,
                }))
              }
              placeholder="Придумайте пароль"
              disabled={quickLoading}
              required
              autoComplete="new-password"
            />
            {quickError && <p className="field-error">{quickError}</p>}
            {quickSuccess && <p className="form-success">{quickSuccess}</p>}
            <div className="form-actions">
              <button type="submit" className="btn-secondary" disabled={quickLoading}>
                {quickLoading ? 'Создаём...' : 'Создать аккаунт'}
              </button>
            </div>
            <p className="helper-text">
              Нужна анкета с дополнительными полями? <Link to="/register">Перейдите к расширенной форме</Link>.
            </p>
          </form>
        </Card>
      </div>

      <Card
        title="Групповой чат"
        description="Лента автоматически обновляется каждые 5 секунд."
        className="chat-card"
      >
        {chatAlert && <p className="field-error">{chatAlert}</p>}
        <div className="chat-list">
          {messagesLoading ? (
            <p className="chat-placeholder">Загружаем переписку...</p>
          ) : messages.length === 0 ? (
            <p className="chat-placeholder">Сообщений пока нет. Напишите первым!</p>
          ) : (
            messages.map((message, index) => (
              <ChatMessage key={message.id || message.pk || index} message={message} />
            ))
          )}
        </div>
        {member ? (
          <ChatComposer
            value={messageText}
            onChange={(event) => setMessageText(event.target.value)}
            onSubmit={handleSendMessage}
            disabled={sendingMessage}
            placeholder="Напишите что-нибудь для команды..."
            error={composerError}
          />
        ) : (
          <div className="chat-guest">
            <p>
              Чтобы участвовать в беседе, войдите или создайте аккаунт. Используйте формы выше или{' '}
              <Link to="/register">перейдите к расширенной регистрации</Link>.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};
