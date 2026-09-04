import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import WelcomePage from './pages/WelcomePage';
import StudentPortal from './pages/StudentPortal';
import AcademyPortal from './pages/AcademyPortal';
import IndustryPortal from './pages/IndustryPortal';
import AuthPortal from './pages/AuthPortal';
import CleanWhiteDashboard from './pages/CleanWhiteDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <div className="w-full h-full bg-black text-white">
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/auth" element={<AuthPortal />} />
          <Route path="/clean-white-ui" element={<CleanWhiteDashboard />} />
          <Route 
            path="/student" 
            element={
              <ProtectedRoute requiredRole="student">
                <StudentPortal />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/academy" 
            element={
              <ProtectedRoute requiredRole="academy">
                <AcademyPortal />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/industry" 
            element={
              <ProtectedRoute requiredRole="industry">
                <IndustryPortal />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
