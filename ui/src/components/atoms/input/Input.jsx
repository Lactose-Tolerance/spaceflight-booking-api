import React from 'react';
import './Input.css';

const Input = ({
  type = 'text',
  placeholder = 'Enter text...',
  value,
  onChange,
  disabled = false,
  hasError = false,
  className = '',
  ...props
}) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`input-atom ${hasError ? 'input-error' : ''} ${className}`}
      {...props}
    />
  );
};

export default Input;