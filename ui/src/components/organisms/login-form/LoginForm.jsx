import React, { useState } from 'react';
import FormField from '../../molecules/form-field/FormField';
import Button from '../../atoms/button/Button';
import './LoginForm.css';

const LoginForm = ({ onLogin, onNavigateRegister, isLoading = false, globalError = null }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic frontend validation before sending to the parent
    if (!username || !password) {
      return; // You could set local specific errors here if you wanted
    }

    // Pass the credentials up to the Page level
    onLogin({ username, password });
  };

  return (
    <form className="login-form-organism" onSubmit={handleSubmit}>
      <div className="login-form-header">
        <h2>Welcome Back</h2>
        <p>Enter your credentials to access your terminal.</p>
      </div>

      {/* Global Error Message (e.g., "Invalid username or password" from the server) */}
      {globalError && <div className="login-form-global-error">{globalError}</div>}

      <FormField
        id="username"
        label="Username"
        placeholder="Enter your username"
        required={true}
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        disabled={isLoading}
      />

      <FormField
        id="password"
        label="Password"
        type="password"
        placeholder="••••••••"
        required={true}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={isLoading}
      />

      <div className="login-form-actions">
        <Button 
          type="submit" 
          variant="primary" 
          className="login-btn-full"
          disabled={isLoading || !username || !password}
        >
          {isLoading ? 'Authenticating...' : 'Login'}
        </Button>

        <Button 
          type="button" 
          variant="ghost" 
          onClick={onNavigateRegister}
          disabled={isLoading}
        >
          Don't have an account? Register here!
        </Button>
      </div>
    </form>
  );
};

export default LoginForm;