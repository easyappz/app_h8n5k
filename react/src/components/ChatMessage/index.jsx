import React from 'react';

const formatTimestamp = (value) => {
  if (!value) {
    return 'Только что';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '—';
  }
  return date.toLocaleString('ru-RU', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const ChatMessage = ({ message }) => {
  const author =
    message?.member_email ||
    message?.email ||
    message?.author ||
    message?.author_email ||
    'Участник';
  const text = message?.content || message?.text || message?.body || message?.message || '';
  const created = message?.created_at || message?.created || message?.timestamp || message?.sent_at;
  const initials = (author || '').trim().charAt(0).toUpperCase() || '•';

  return (
    <div className="chat-message" data-easytag="id5-src/components/ChatMessage/index.jsx">
      <div className="chat-avatar">{initials}</div>
      <div className="chat-message-body">
        <div className="chat-message-header">
          <span className="chat-author">{author}</span>
          <span className="chat-time">{formatTimestamp(created)}</span>
        </div>
        <p className="chat-text">{text}</p>
      </div>
    </div>
  );
};

export default ChatMessage;
