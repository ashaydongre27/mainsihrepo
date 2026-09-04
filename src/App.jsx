import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import WelcomePage from './pages/WelcomePage';
import StudentPortal from './pages/StudentPortal';
import AcademyPortal from './pages/AcademyPortal';
import IndustryPortal from './pages/IndustryPortal';
import AuthPortal from './pages/AuthPortal';

function App() {
  return (
    <AuthProvider>
      <div className="w-full h-full bg-black text-white">
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/auth" element={<AuthPortal />} />
          <Route path="/student" element={<StudentPortal />} />
          <Route path="/academy" element={<AcademyPortal />} />
          <Route path="/industry" element={<IndustryPortal />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
