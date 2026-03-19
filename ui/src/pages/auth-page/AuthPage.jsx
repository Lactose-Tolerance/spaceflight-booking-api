import React, { useState } from 'react';
// 1. Add useLocation to your react-router-dom imports
import { useNavigate, useLocation } from 'react-router-dom'; 
import LoginForm from '../../components/organisms/login-form/LoginForm';
import RegisterForm from '../../components/organisms/register-form/RegisterForm';
import { authService } from '../../services/authService';
import './AuthPage.css';

const AuthPage = () => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [globalError, setGlobalError] = useState(null);
  
  const navigate = useNavigate();
  const location = useLocation(); // 2. Get the location object

  // 3. Extract the 'from' path, or default to '/flights' if they came directly to /auth
  const from = location.state?.from?.pathname || '/flights';

  const handleLogin = async (credentials) => {
    setIsLoading(true);
    setGlobalError(null);
    
    try {
      await authService.login(credentials);      
      // 4. Navigate to the dynamic 'from' path! Use replace: true so they can't hit "Back" to return to the login screen.
      navigate(from, { replace: true }); 
    } catch (error) {
      if (!error.response) {
        setGlobalError("Network Error: Could not connect to the server. Is the backend running?");
        return;
      }

      if (error.response.data?.validationErrors) {
        const firstErrorMsg = Object.values(error.response.data.validationErrors)[0];
        setGlobalError(firstErrorMsg);
        return;
      }

      const message = error.response.data?.message || "Login failed. Please try again.";
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
      
      // Navigate to the dynamic 'from' path here too!
      navigate(from, { replace: true }); 
    } catch (error) {
      if (!error.response) {
        setGlobalError("Network Error: Could not connect to the server. Is the backend running?");
        return;
      }

      if (error.response.data?.validationErrors) {
        const firstErrorMsg = Object.values(error.response.data.validationErrors)[0];
        setGlobalError(firstErrorMsg);
        return;
      }

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