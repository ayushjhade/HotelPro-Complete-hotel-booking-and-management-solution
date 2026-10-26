import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('hotelpro_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('hotelpro_token') || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token && user) {
      localStorage.setItem('hotelpro_token', token);
      localStorage.setItem('hotelpro_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('hotelpro_token');
      localStorage.removeItem('hotelpro_user');
    }
  }, [token, user]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await API.post('/users/login', { email, password });
      const { token: receivedToken, user: receivedUser } = response.data;
      setToken(receivedToken);
      setUser(receivedUser);
      localStorage.setItem('hotelpro_token', receivedToken);
      localStorage.setItem('hotelpro_user', JSON.stringify(receivedUser));
      return { success: true, user: receivedUser };
    } catch (error) {
      const msg = error.response?.data?.message || 'Login failed. Please check your credentials.';
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const response = await API.post('/users/signup', userData);
      const { token: receivedToken, user: receivedUser } = response.data;
      if (receivedToken && receivedUser) {
        setToken(receivedToken);
        setUser(receivedUser);
        localStorage.setItem('hotelpro_token', receivedToken);
        localStorage.setItem('hotelpro_user', JSON.stringify(receivedUser));
      }
      return { success: true, message: response.data.message || 'Account created successfully' };
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed. Please try again.';
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('hotelpro_token');
    localStorage.removeItem('hotelpro_user');
  };

  const isAdmin = user?.type === 'admin';
  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
