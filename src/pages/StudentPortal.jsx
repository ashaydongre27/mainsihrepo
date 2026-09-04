import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Dynamic3DScene from '../components/3d/Dynamic3DScene';
import CareerRoadmap from '../components/student/CareerRoadmap';
import ResumeAnalyzer from '../components/student/ResumeAnalyzer';
import SkillTree from '../components/student/SkillTree';
import QuizArena from '../components/student/QuizArena';
import OpportunitiesBoard from '../components/student/OpportunitiesBoard';
import ZuluChat from '../components/student/ZuluChat';
import Portfolio from '../components/student/Portfolio';

export default function StudentPortal() {
  const [activeSection, setActiveSection] = useState('Roadmap');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [xp, setXp] = useState(1450);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const sidebarModules = [
    { id: 'Roadmap', label: '🗺️ Career Roadmap', desc: 'Milestones & Tasks', badge: 'Anti-Decay' },
    { id: 'Resume', label: '📄 AI Resume Analyzer', desc: 'Gap discovery & sync', badge: 'AI Tool' },
    { id: 'Dashboard', label: '📊 Student Overview', desc: 'Profile & metrics' },
    { id: 'Quiz', label: '⚡ Quiz Arena', desc: 'Knowledge tests', badge: '+XP' },
    { id: 'Opportunities', label: '💼 Opportunities Board', desc: 'Internships & jobs', badge: '4 New' },
    { id: 'Zulu', label: '🤖 Zulu AI Companion', desc: '24/7 AI Counselor' },
    { id: 'SkillTree', label: '🌐 Skill Constellation', desc: 'Visual 2D tree' },
    { id: 'Portfolio', label: '🏆 Verified Portfolio', desc: 'Digital certificates' },
  ];

  const handleSelectModule = (id) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen w-full bg-[#05050a] flex flex-col font-sans text-white relative overflow-x-hidden">
      {/* 3D Background */}
      <Dynamic3DScene theme="student" showTotem={true} totemPosition={[4, 0, -6]} />

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 border-b border-gray-800 bg-[#080814]/95 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-3">
          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-gray-900 border border-purple-500/30 text-purple-300 text-xs font-bold flex items-center gap-1.5"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? '✕ Close' : '☰ Modules'}
          </button>

          <div 
            onClick={() => navigate('/')} 
            className="cursor-pointer flex items-center gap-2 group"
          >
            <div className="w-2.5 h-6 sm:h-7 bg-purple-500 rounded-sm shadow-[0_0_10px_#a855f7] group-hover:scale-110 transition"></div>
            <div>
              <span className="text-lg sm:text-xl font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-300 uppercase">
                JOBLEX
              </span>
              <span className="hidden sm:block text-[9px] text-gray-400 tracking-widest uppercase font-semibold">
                Student Portal
              </span>
            </div>
          </div>
        </div>

        {/* User Status Bar & Role Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-gray-900/90 border border-purple-500/30 text-[11px] sm:text-xs">
            <span className="text-purple-400 font-bold">🔥 {xp} XP</span>
            <span className="text-gray-600 hidden sm:inline">|</span>
            <span className="text-cyan-400 font-semibold hidden sm:inline">🎯 7-Day Streak</span>
          </div>

          <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-xl bg-gray-900/90 border border-gray-800 text-xs">
            <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center font-bold text-white text-[10px]">
              {user?.name ? user.name[0] : 'S'}
            </div>
            <span className="font-semibold text-gray-200">{user?.name || 'Ashay Verma'}</span>
          </div>

          <button
            onClick={() => navigate('/auth')}
            className="text-[11px] sm:text-xs px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-purple-900/30 hover:bg-purple-900/60 border border-purple-500/40 text-purple-300 font-bold transition"
          >
            Switch
          </button>

          <button
            onClick={() => navigate('/')}
            className="text-[11px] sm:text-xs px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 font-medium transition"
          >
            Hub ↵
          </button>
        </div>
      </header>

      {/* Mobile Horizontal Quick-Pills Navigation */}
      <div className="lg:hidden flex overflow-x-auto gap-2 px-3 py-2 bg-[#0a0a16] border-b border-gray-800/80 no-scrollbar z-30 shrink-0">
        {sidebarModules.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleSelectModule(item.id)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                isActive
                  ? 'bg-purple-600 text-white border-purple-400 shadow-sm'
                  : 'bg-gray-900 text-gray-400 border-gray-800 hover:text-white'
              }`}
            >
              {item.label.split(' ')[0]} {item.label.split(' ')[1]}
            </button>
          );
        })}
      </div>

      {/* Main Workspace Layout */}
      <div className="flex flex-1 relative z-10 min-h-[calc(100vh-115px)] lg:min-h-[calc(100vh-60px)]">
        {/* MOBILE DRAWER OVERLAY */}
        {mobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div 
              className="w-72 max-w-[85vw] h-full bg-[#080814] border-r border-purple-500/30 p-4 flex flex-col justify-between overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="space-y-2">
                <div className="flex justify-between items-center px-2 pb-3 border-b border-gray-800">
                  <span className="text-xs uppercase tracking-wider text-purple-400 font-bold">Student Modules</span>
                  <button 
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1 rounded-lg text-gray-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-1 pt-1">
                  {sidebarModules.map((item) => {
                    const isActive = activeSection === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSelectModule(item.id)}
                        className={`w-full flex flex-col items-start px-3.5 py-2.5 rounded-xl text-left transition-all ${
                          isActive
                            ? 'bg-purple-600/30 border border-purple-500 text-purple-100'
                            : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="font-bold text-xs text-white">{item.label}</span>
                          {item.badge && (
                            <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-purple-500 text-white">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-gray-400 mt-0.5">{item.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-800 space-y-2">
                <button
                  onClick={logout}
                  className="w-full py-2 rounded-lg text-center text-xs font-semibold text-gray-400 hover:text-red-400 hover:bg-red-950/20 transition"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}

        {/* DESKTOP PINNED SIDEBAR (Hidden on Mobile) */}
        <aside className="hidden lg:flex w-64 bg-[#080812]/90 border-r border-gray-800/80 backdrop-blur-md p-4 flex-col justify-between shrink-0">
          <div className="space-y-1">
            <div className="px-3 py-1.5 text-[11px] uppercase tracking-wider text-purple-400 font-bold">
              Student Modules
            </div>

            {sidebarModules.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex flex-col items-start px-3.5 py-2.5 rounded-xl text-left transition-all ${
                    isActive
                      ? 'bg-purple-600/25 border border-purple-500/80 text-purple-100 shadow-[0_0_15px_rgba(168,85,247,0.25)]'
                      : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-bold text-xs text-white">{item.label}</span>
                    {item.badge && (
                      <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${
                        isActive ? 'bg-purple-500 text-white' : 'bg-gray-800 text-purple-300'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-gray-400 mt-0.5">{item.desc}</span>
                </button>
              );
            })}
          </div>

          {/* Sidebar Footer */}
          <div className="mt-6 pt-4 border-t border-gray-800/80 space-y-2">
            <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/20 text-xs text-purple-200">
              <span className="font-bold block mb-0.5">Ministry of Ayush Network</span>
              <p className="text-[10px] text-gray-400 leading-tight">All India Institute of Ayurveda Affiliated Placement Hub.</p>
            </div>
            <button
              onClick={logout}
              className="w-full py-1.5 rounded-lg text-center text-xs font-semibold text-gray-400 hover:text-red-400 hover:bg-red-950/20 transition"
            >
              Sign Out
            </button>
          </div>
        </aside>

        {/* MAIN CONTENT WORKSPACE - Responsive Padding */}
        <main className="flex-1 overflow-y-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 custom-scrollbar">
          <div className="max-w-5xl mx-auto space-y-6 pb-12 w-full">
            
            {activeSection === 'Roadmap' && (
              <CareerRoadmap onUpdateXp={(newXp) => setXp(newXp)} />
            )}

            {activeSection === 'Resume' && (
              <ResumeAnalyzer onSyncRoadmap={() => setActiveSection('Roadmap')} />
            )}

            {activeSection === 'Dashboard' && (
              <div className="space-y-6 animate-fade-in">
                {/* Welcome Card */}
                <div className="p-5 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-blue-900/30 border border-purple-500/30 backdrop-blur-md relative overflow-hidden shadow-xl">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-cyan-400"></div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-2 text-white">Welcome back, {user?.name || 'Ashay Verma'}</h1>
                  <p className="text-xs sm:text-sm text-gray-300">
                    {user?.department || 'Ayurvedic Pharmacology & Data Science'} • {user?.institution || 'AIIA New Delhi'}
                  </p>
                  <div className="mt-5 sm:mt-6 flex flex-wrap gap-2.5 sm:gap-3">
                    <button
                      onClick={() => setActiveSection('Roadmap')}
                      className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition shadow-md flex items-center gap-1.5"
                    >
                      <span>🗺️ Continue Career Roadmap</span>
                      <span>➔</span>
                    </button>
                    <button
                      onClick={() => setActiveSection('Resume')}
                      className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-gray-200 text-xs font-semibold border border-gray-700 transition"
                    >
                      Upload Resume for AI Gap Analysis
                    </button>
                  </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
                  {[
                    { label: 'Skills Assessed & Verified', value: '12', note: 'Verified by Academic Faculty' },
                    { label: 'Quizzes Cleared', value: '8', note: 'Average Score: 86%' },
                    { label: 'Active Applications', value: '3', note: '1 Shortlisted by Dabur' }
                  ].map((s, i) => (
                    <div key={i} className="p-4 sm:p-5 rounded-2xl bg-gray-900/60 border border-gray-800 backdrop-blur-md shadow-md">
                      <span className="text-xs text-gray-400 block mb-1 font-medium">{s.label}</span>
                      <div className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-300">
                        {s.value}
                      </div>
                      <span className="text-[11px] text-gray-400 mt-1 block">{s.note}</span>
                    </div>
                  ))}
                </div>

                {/* Grid 2 Column */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="p-5 sm:p-6 rounded-2xl bg-gray-900/60 border border-purple-500/20 backdrop-blur-md space-y-3 shadow-md">
                    <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                      <span>🔥</span> High-Demand Industry Skills
                    </h3>
                    <p className="text-xs text-gray-400">Live requirements submitted by pharma partners:</p>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-3 rounded-xl bg-black/40 border border-gray-800 text-xs">
                        <span className="font-medium text-white">HPTLC & Chromatography</span>
                        <span className="text-emerald-400 font-bold">+25% hiring surge</span>
                      </div>
                      <div className="flex justify-between items-center p-3 rounded-xl bg-black/40 border border-gray-800 text-xs">
                        <span className="font-medium text-white">Computational Phytochemistry</span>
                        <span className="text-purple-300 font-bold">New MoU Need</span>
                      </div>
                      <div className="flex justify-between items-center p-3 rounded-xl bg-black/40 border border-gray-800 text-xs">
                        <span className="font-medium text-white">Clinical Trial Protocols (GCP)</span>
                        <span className="text-cyan-300 font-bold">High Demand</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 sm:p-6 rounded-2xl bg-gray-900/60 border border-purple-500/20 backdrop-blur-md flex flex-col justify-between shadow-md">
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-white mb-2 flex items-center gap-2">
                        <span>🤖</span> Ask Zulu AI Counselor
                      </h3>
                      <p className="text-xs text-gray-300 leading-relaxed mb-4">
                        Get personalized guidance on which elective subjects improve your placement odds and prepare for technical interviews.
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveSection('Zulu')}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:opacity-95 transition"
                    >
                      Open Zulu AI Companion ➔
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'SkillTree' && (
              <div className="min-h-[450px] sm:min-h-[550px] h-[60vh] sm:h-[70vh]">
                <SkillTree />
              </div>
            )}

            {activeSection === 'Quiz' && (
              <div className="max-w-3xl mx-auto">
                <QuizArena />
              </div>
            )}

            {activeSection === 'Opportunities' && (
              <OpportunitiesBoard />
            )}

            {activeSection === 'Zulu' && (
              <ZuluChat />
            )}

            {activeSection === 'Portfolio' && (
              <Portfolio />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
