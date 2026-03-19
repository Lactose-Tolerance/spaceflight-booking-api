import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import navigate to redirect after login
import LoginForm from '../../components/organisms/login-form/LoginForm';
import RegisterForm from '../../components/organisms/register-form/RegisterForm';
import { authService } from '../../services/authService';
import './AuthPage.css';

const AuthPage = () => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [globalError, setGlobalError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (credentials) => {
    setIsLoading(true);
    setGlobalError(null);
    
    try {
      await authService.login(credentials);
      console.log("Login successful!");
      navigate('/flights'); // Redirect to a protected page (we'll build this next!)
    } catch (error) {
      // 1. Check if the server is completely unreachable (Network Error)
      if (!error.response) {
        setGlobalError("Network Error: Could not connect to the server. Is the backend running?");
        return;
      }

      // 2. Check if the backend sent a map of validation errors (e.g., bad password length)
      if (error.response.data?.validationErrors) {
        // Grab the first validation error value and show it to the user
        const firstErrorMsg = Object.values(error.response.data.validationErrors)[0];
        setGlobalError(firstErrorMsg);
        return;
      }

      // 3. Fallback to the standard message sent by your GlobalExceptionHandler, or a generic string
      const message = error.response.data?.message || "Registration failed. Please try again.";
      setGlobalError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (credentials) => {
    setIsLoading(true);
    setGlobalError(null);
    
    try {
      await authService.register(credentials);
      console.log("Registration successful!");
      navigate('/flights'); // Redirect after successful registration
    } catch (error) {
      // 1. Check if the server is completely unreachable (Network Error)
      if (!error.response) {
        setGlobalError("Network Error: Could not connect to the server. Is the backend running?");
        return;
      }

      // 2. Check if the backend sent a map of validation errors (e.g., bad password length)
      if (error.response.data?.validationErrors) {
        // Grab the first validation error value and show it to the user
        const firstErrorMsg = Object.values(error.response.data.validationErrors)[0];
        setGlobalError(firstErrorMsg);
        return;
      }

      // 3. Fallback to the standard message sent by your GlobalExceptionHandler, or a generic string
      const message = error.response.data?.message || "Registration failed. Please try again.";
      setGlobalError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      {isLoginView ? (
        <LoginForm 
          onLogin={handleLogin}
          onNavigateRegister={() => {
            setIsLoginView(false);
            setGlobalError(null);
          }}
          isLoading={isLoading}
          globalError={globalError}
        />
      ) : (
        <RegisterForm 
          onRegister={handleRegister}
          onNavigateLogin={() => {
            setIsLoginView(true);
            setGlobalError(null);
          }}
          isLoading={isLoading}
          globalError={globalError}
        />
      )}
    </div>
  );
};

export default AuthPage;