import React, { useState, useEffect } from 'react';
import Login from './components/login';
import Signup from './components/signup';
import Dashboard from './components/Dashboard'; // 👈 Dashboard import ചെയ്തു

const API_BASE_URL = 'http://localhost:5000/api/auth';

function App() {
  const [currentScreen, setCurrentScreen] = useState('login');

  // ആപ്പ് ലോഡ് ചെയ്യുമ്പോൾ ടോക്കൺ ഉണ്ടോ എന്ന് നോക്കി ഓട്ടോമാറ്റിക് ലോഗിൻ ചെയ്യും
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setCurrentScreen('dashboard');
    }
  }, []);

  const registerUser = async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      return await response.json();
    } catch (error) {
      return { success: false, message: 'Server connection failed' };
    }
  };

  const loginUser = async (credentials) => {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      const data = await response.json();
      
      if (response.ok && data.accessToken) {
        setCurrentScreen('dashboard'); // 👈 വിജയകരമായാൽ ഡാഷ്‌ബോർഡിലേക്ക് പോകും
        return { success: true, data: data.data, accessToken: data.accessToken };
      } else {
        return { success: false, message: data.message || 'Invalid credentials' };
      }
    } catch (error) {
      return { success: false, message: 'Server connection failed' };
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentScreen('login'); // 👈 ലോഗൗട്ട് ചെയ്യുമ്പോൾ തിരിച്ച് ലോഗിനിലേക്ക്
  };

  const handleUserNotFound = () => {
    alert("Account not found! Taking you to the Create Account window.");
    setCurrentScreen('signup'); 
  };

  return (
    <div style={currentScreen !== 'dashboard' ? appStyles.pageContainer : {}}>
      {currentScreen === 'login' && (
        <Login 
          onLogin={loginUser} 
          onSwitchToSignup={() => setCurrentScreen('signup')} 
          onUserNotFound={handleUserNotFound} 
        />
      )}
      {currentScreen === 'signup' && (
        <Signup 
          onRegister={registerUser} 
          onSwitchToLogin={() => setCurrentScreen('login')} 
        />
      )}
      {currentScreen === 'dashboard' && (
        <Dashboard onLogout={handleLogout} />
      )}
    </div>
  );
}

const appStyles = {
  pageContainer: {
    minHeight: '100vh',
    backgroundColor: '#ecfdf5', 
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    boxSizing: 'border-box'
  }
};

export default App;