import React from 'react';
import './Label.css';

const Label = ({ htmlFor, children, required = false, className = '', ...props }) => {
  return (
    <label 
      htmlFor={htmlFor} 
      className={`label-atom ${className}`} 
      {...props}
    >
      {children}
      {required && <span className="label-required" aria-hidden="true">*</span>}
    </label>
  );
};

export default Label;