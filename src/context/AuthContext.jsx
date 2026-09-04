import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginApi, registerApi } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('joblex_user') || localStorage.getItem('nexus_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('joblex_user', JSON.stringify(user));
      localStorage.setItem('nexus_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('joblex_user');
      localStorage.removeItem('nexus_user');
    }
  }, [user]);

  const login = async (email, password, role) => {
    const res = await loginApi(email, password, role);
    if (res && res.user) {
      setUser(res.user);
      if (res.token) {
        localStorage.setItem('joblex_token', res.token);
        localStorage.setItem('nexus_token', res.token);
      }
      return { success: true, user: res.user };
    }
    throw new Error(res?.error || 'Invalid credentials or user not found');
  };

  const register = async (userData) => {
    const res = await registerApi(userData);
    if (res && res.user) {
      setUser(res.user);
      if (res.token) {
        localStorage.setItem('joblex_token', res.token);
        localStorage.setItem('nexus_token', res.token);
      }
      return { success: true, user: res.user };
    }
    throw new Error(res?.error || 'Registration failed');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('joblex_user');
    localStorage.removeItem('nexus_user');
    localStorage.removeItem('joblex_token');
    localStorage.removeItem('nexus_token');
  };

  const switchRole = (newRole) => {
    if (user) {
      setUser(prev => ({ ...prev, role: newRole }));
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
