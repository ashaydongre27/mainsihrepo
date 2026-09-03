import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginApi, registerApi } from '../services/api';

const AuthContext = createContext();

const DEFAULT_USERS = {
  student: {
    id: 'usr-student-01',
    name: 'Ashay Verma',
    email: 'student@nexus.edu',
    role: 'student',
    institution: 'All India Institute of Ayurveda (AIIA), New Delhi',
    department: 'Ayurvedic Pharmacology & Health Informatics',
    xp: 1450,
    streak: 7
  },
  academy: {
    id: 'usr-academy-01',
    name: 'Dr. Sunita Sharma',
    email: 'dean@aiia.gov.in',
    role: 'academy',
    institution: 'All India Institute of Ayurveda',
    designation: 'Dean of Academic Affairs & Industry Liaison',
    department: 'Faculty of Ayurveda & Pharmaceutical Technology'
  },
  industry: {
    id: 'usr-industry-01',
    name: 'Rajesh Malhotra',
    email: 'hr@dabur-research.com',
    role: 'industry',
    company: 'Dabur Research & Development Ltd.',
    designation: 'Head of University Relations',
    sector: 'Ayurvedic Formulations & Phytopharmaceuticals'
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('nexus_user');
    return saved ? JSON.parse(saved) : DEFAULT_USERS.student;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('nexus_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('nexus_user');
    }
  }, [user]);

  const login = async (email, password, role) => {
    const res = await loginApi(email, password, role);
    if (res && res.user) {
      setUser(res.user);
      if (res.token) localStorage.setItem('nexus_token', res.token);
      return { success: true, user: res.user };
    }
    // Fallback if offline
    const fallbackUser = DEFAULT_USERS[role] || {
      id: `usr-${Date.now()}`,
      name: email.split('@')[0],
      email,
      role: role || 'student',
      institution: 'Ayush University'
    };
    setUser(fallbackUser);
    return { success: true, user: fallbackUser };
  };

  const register = async (userData) => {
    const res = await registerApi(userData);
    if (res && res.user) {
      setUser(res.user);
      if (res.token) localStorage.setItem('nexus_token', res.token);
      return { success: true, user: res.user };
    }
    const fallbackUser = {
      id: `usr-${Date.now()}`,
      ...userData,
      xp: 1000,
      streak: 1
    };
    setUser(fallbackUser);
    return { success: true, user: fallbackUser };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('nexus_user');
    localStorage.removeItem('nexus_token');
  };

  const switchRole = (role) => {
    if (DEFAULT_USERS[role]) {
      setUser(DEFAULT_USERS[role]);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
