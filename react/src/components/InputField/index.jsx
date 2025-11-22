import React from 'react';

const InputField = ({ id, label, type = 'text', value, onChange, placeholder, disabled, error, ...rest }) => {
  return (
    <div className="input-field" data-easytag="id3-src/components/InputField/index.jsx">
      {label && (
        <label htmlFor={id} className="input-label">
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        {...rest}
      />
      {error && <p className="field-error">{error}</p>}
    </div>
  );
};

export default InputField;
