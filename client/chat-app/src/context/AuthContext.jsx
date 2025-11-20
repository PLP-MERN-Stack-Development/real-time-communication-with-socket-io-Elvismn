import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Check if user is logged in on app start
  useEffect(() => {
    console.log('🔵 AuthProvider initializing...');
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    console.log('🔵 Stored token exists:', !!token);
    console.log('🔵 Stored user exists:', !!userData);
    
    if (token && userData) {
      console.log('🔵 Setting user from localStorage');
      setUser(JSON.parse(userData));
    } else {
      console.log('🔵 No stored authentication found');
    }
    setLoading(false);
    console.log('🔵 AuthProvider initialized');
  }, []);

  const login = async (email, password) => {
    console.log('🔵 AuthContext.login called:', { email });
    try {
      setError('');
      console.log('🔵 Making API login request...');
      const response = await authService.login(email, password);
      console.log('🟢 Login API response received:', response.data);
      
      if (response.data.success) {
        const { user, token } = response.data.data;
        console.log('🔵 Storing token and user in localStorage');
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        console.log('🔵 Setting user in state');
        setUser(user);
        console.log('🟢 Login successful');
        return { success: true };
      } else {
        console.log('🔴 Login response not successful:', response.data);
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      console.error('🔴 Login error:', { message, error });
      setError(message);
      return { success: false, message };
    }
  };

  const register = async (username, email, password) => {
    console.log('🔵 AuthContext.register called:', { username, email });
    try {
      setError('');
      console.log('🔵 Making API register request...');
      const response = await authService.register(username, email, password);
      console.log('🟢 Register API response received:', response.data);
      
      if (response.data.success) {
        const { user, token } = response.data.data;
        console.log('🔵 Storing token and user in localStorage');
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        console.log('🔵 Setting user in state');
        setUser(user);
        console.log('🟢 Registration successful');
        return { success: true };
      } else {
        console.log('🔴 Registration response not successful:', response.data);
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      console.error('🔴 Registration error:', { message, error });
      setError(message);
      return { success: false, message };
    }
  };

  const logout = async () => {
    console.log('🔵 AuthContext.logout called');
    try {
      console.log('🔵 Making API logout request...');
      await authService.logout();
      console.log('🟢 Logout API call successful');
    } catch (error) {
      console.error('🔴 Logout API error:', error);
    } finally {
      console.log('🔵 Clearing localStorage and state');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      console.log('🟢 Logout completed');
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user
  };

  console.log('🔵 AuthContext value updated:', { 
    user: user?.username, 
    isAuthenticated: !!user,
    loading 
  });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};