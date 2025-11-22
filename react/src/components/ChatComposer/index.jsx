import React from 'react';

const ChatComposer = ({ value, onChange, onSubmit, disabled, placeholder, error }) => {
  return (
    <form className="chat-composer" data-easytag="id6-src/components/ChatComposer/index.jsx" onSubmit={onSubmit}>
      <textarea value={value} onChange={onChange} placeholder={placeholder} rows={3} disabled={disabled} />
      {error && <p className="field-error">{error}</p>}
      <div className="form-actions">
        <button type="submit" className="btn" disabled={disabled || !value.trim()}>
          Отправить
        </button>
      </div>
    </form>
  );
};

export default ChatComposer;
