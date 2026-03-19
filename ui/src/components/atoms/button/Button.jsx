import React from 'react';
import './Button.css';

const Button = ({ 
  children, 
  variant = 'primary', // 'primary', 'secondary', 'danger', 'ghost'
  type = 'button', 
  disabled = false, 
  onClick, 
  className = '', 
  ...props 
}) => {
  return (
    <button
      type={type}
      className={`btn btn-${variant} ${className}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;