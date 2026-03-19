import React from 'react';
import Label from '../../atoms/label/Label';
import Input from '../../atoms/input/Input';
import './FormField.css';

const FormField = ({
  id,
  label,
  required = false,
  type = 'text',
  placeholder,
  value,
  onChange,
  disabled = false,
  error,
  helpText,
  className = '',
  ...inputProps
}) => {
  return (
    <div className={`form-field-molecule ${className}`}>
      {/* 1. The Label Atom */}
      {label && (
        <Label htmlFor={id} required={required}>
          {label}
        </Label>
      )}

      {/* 2. The Input Atom */}
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        hasError={!!error} // If there's an error string, pass true to the Atom
        {...inputProps}
      />

      {/* 3. Feedback Text (Errors or Hints) */}
      {error ? (
        <span className="form-field-error" role="alert">{error}</span>
      ) : helpText ? (
        <span className="form-field-help">{helpText}</span>
      ) : null}
    </div>
  );
};

export default FormField;