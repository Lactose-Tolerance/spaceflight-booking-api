import React, { useState } from 'react';
import FormField from '../../molecules/form-field/FormField';
import Button from '../../atoms/button/Button';
import './RegisterForm.css';

const RegisterForm = ({ onRegister, onNavigateLogin, isLoading = false, globalError = null }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalError(null);
    
    // Frontend Validation
    if (!username || !password || !confirmPassword) {
      setLocalError("All fields are required.");
      return;
    }

    if (username.length < 3 || username.length > 50) {
      setLocalError("Username must be between 3 and 50 characters.");
      return;
    }

    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setLocalError("Passwords do not match.");
      return;
    }

    // Pass the credentials up to the Page level (we only send what the API needs)
    onRegister({ username, password });
  };

  return (
    <form className="register-form-organism" onSubmit={handleSubmit}>
      <div className="register-form-header">
        <h2>Create an Account</h2>
        <p>Join the Interplanetary Flight Network.</p>
      </div>

      {/* Global or Local Error Messages */}
      {(globalError || localError) && (
        <div className="register-form-error">
          {localError || globalError}
        </div>
      )}

      <FormField
        id="reg-username"
        label="Username"
        placeholder="Choose a username"
        required={true}
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        disabled={isLoading}
        helpText="3 to 50 characters."
      />

      <FormField
        id="reg-password"
        label="Password"
        type="password"
        placeholder="••••••••"
        required={true}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={isLoading}
        helpText="Minimum 6 characters."
      />

      <FormField
        id="reg-confirm-password"
        label="Confirm Password"
        type="password"
        placeholder="••••••••"
        required={true}
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        disabled={isLoading}
      />

      <div className="register-form-actions">
        <Button 
          type="submit" 
          variant="primary" 
          className="register-btn-full"
          disabled={isLoading || !username || !password || !confirmPassword}
        >
          {isLoading ? 'Registering...' : 'Create Account'}
        </Button>

        <Button 
          type="button" 
          variant="ghost" 
          onClick={onNavigateLogin}
          disabled={isLoading}
        >
          Already have an account? Log in.
        </Button>
      </div>
    </form>
  );
};

export default RegisterForm;