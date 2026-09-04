import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, requiredRole }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    const roleParam = requiredRole || 'student';
    return (
      <Navigate 
        to={`/auth?role=${encodeURIComponent(roleParam)}&redirect=${encodeURIComponent(location.pathname)}`} 
        replace 
      />
    );
  }

  return children;
}
