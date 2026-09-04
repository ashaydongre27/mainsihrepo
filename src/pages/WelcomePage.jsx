import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Starfield from '../components/3d/Starfield';

export default function WelcomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const features = [
    {
      icon: '🎯',
      title: 'AI Skill Gap Discovery',
      tag: 'AI ENGINE',
      tagColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
      desc: 'Benchmark student CVs against live pharmaceutical and Ayush industrial standards (GLP, HPTLC, Phytochemistry) with instant gap diagnosis.',
    },
    {
      icon: '🗺️',
      title: 'Gamified Career Roadmap',
      tag: 'ANTI-DECAY',
      tagColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
      desc: 'Follow 4 progressive milestones, earn +50 XP per laboratory competency, and prevent point decay through active streak check-ins.',
    },
    {
      icon: '🧠',
      title: 'AI Syllabus Modernization',
      tag: 'NEP-2020',
      tagColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      desc: 'Bridges college curriculums with industrial advancements. Academic Deans review and adopt automated syllabus add-ons sponsored by MoU partners.',
    },
    {
      icon: '💼',
      title: 'Direct Industry Hiring Pipeline',
      tag: 'RECRUITMENT',
      tagColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
      desc: 'Verified candidate portfolios are pre-screened and matched directly with top corporate recruiters including Dabur, Himalaya Wellness, and Patanjali.',
    },
    {
      icon: '📜',
      title: 'Bilateral MoUs & R&D Grants',
      tag: 'COLLABORATION',
      tagColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      desc: 'Institutions bid for corporate-funded research grants (₹24L+) and nominate faculty members for specialized industrial immersion (FDP).',
    },
    {
      icon: '🤖',
      title: 'Zulu AI Career Counselor',
      tag: '24/7 ADVISOR',
      tagColor: 'bg-pink-500/20 text-pink-300 border-pink-500/40',
      desc: 'Context-aware intelligence companion powered by Google AI Studio, offering real-time guidance on internships, electives, and interview readiness.',
    },
  ];

  return (
    <div className="min-h-screen w-full bg-[#07071a] text-slate-100 font-sans relative overflow-x-hidden">

      {/* ── Background: Starfield ONLY – very subtle ───────────────── */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20">
        <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
          <Starfield />
          <Environment preset="night" />
        </Canvas>
      </div>

      {/* ── Sticky Navbar ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 w-full bg-[#07071a]/95 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-3 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5 cursor-pointer select-none" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-1 h-8 bg-gradient-to-b from-cyan-400 to-purple-600 rounded-full shadow-[0_0_12px_rgba(99,102,241,0.7)]" />
            <div>
              <span className="text-lg sm:text-xl font-extrabold tracking-widest text-white uppercase">JOBLEX</span>
              <span className="hidden sm:block text-[9px] text-gray-400 tracking-widest uppercase">Ministry of Ayush · PS 26044</span>
            </div>
          </div>

          {/* Nav right */}
          <div className="flex items-center gap-2 sm:gap-3">
            {user ? (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-900 border border-purple-500/30 text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="hidden sm:inline text-gray-300">{user.name}</span>
                <button onClick={() => navigate('/auth')} className="text-purple-400 font-bold underline">Switch</button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => navigate('/student')}
                  className="hidden sm:block px-3 py-1.5 text-xs text-gray-400 hover:text-white border border-gray-800 hover:border-gray-600 rounded-lg transition font-medium"
                >
                  Student
                </button>
                <button
                  onClick={() => navigate('/academy')}
                  className="hidden sm:block px-3 py-1.5 text-xs text-gray-400 hover:text-white border border-gray-800 hover:border-gray-600 rounded-lg transition font-medium"
                >
                  Academy
                </button>
                <button
                  onClick={() => navigate('/auth')}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white font-bold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(168,85,247,0.35)] transition"
                >
                  Sign In
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ── Main Content ───────────────────────────────────────────── */}
      <main className="relative z-10">

        {/* ── HERO ──────────────────────────────────────────────────── */}
        <section className="pt-16 sm:pt-24 lg:pt-32 pb-16 sm:pb-20 text-center">
          <div className="max-w-4xl mx-auto px-5 sm:px-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-300 text-[11px] sm:text-xs font-semibold uppercase tracking-widest mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              Academia-Industry Collaborative Portal
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-5">
              Next-Gen Skill Synergy on{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400">
                JOBLEX
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base md:text-lg text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Bridging academia and industries with AI skill mapping, gamified career roadmaps, dynamic syllabus modernization, and verified placement pipelines.
            </p>

            {/* CTA Button */}
            <div className="flex flex-col items-center gap-4">
              <button
                onClick={() => navigate('/auth')}
                className="w-full sm:w-auto relative inline-flex items-center justify-center gap-3 px-8 sm:px-12 py-4 sm:py-5 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 hover:from-cyan-400 hover:via-indigo-400 hover:to-purple-500 text-white font-bold text-base sm:text-lg shadow-[0_0_40px_rgba(99,102,241,0.55)] hover:shadow-[0_0_60px_rgba(99,102,241,0.7)] transition-all duration-300 hover:scale-[1.03] active:scale-[0.97]"
              >
                <span className="text-xl animate-bounce">⚡</span>
                <span>Enter JOBLEX Portal / Access Roles</span>
                <span className="text-lg">➔</span>
              </button>

              {/* Quick-access pills */}
              <div className="flex flex-wrap justify-center gap-2 text-xs">
                <span className="text-gray-500 self-center font-medium">Quick access:</span>
                {[
                  { label: '🎓 Student', path: '/student', cls: 'border-purple-500/40 text-purple-300 hover:bg-purple-900/40' },
                  { label: '🏛️ Academy', path: '/academy', cls: 'border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/40' },
                  { label: '🏢 Industry', path: '/industry', cls: 'border-blue-500/40 text-blue-300 hover:bg-blue-900/40' },
                ].map(b => (
                  <button
                    key={b.path}
                    onClick={() => navigate(b.path)}
                    className={`px-4 py-1.5 rounded-full border bg-white/5 font-semibold transition ${b.cls}`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── CHOOSE YOUR PORTAL ────────────────────────────────────── */}
        <section className="py-16 sm:py-20 border-t border-white/5">
          <div className="max-w-6xl mx-auto px-5 sm:px-8">
            {/* Section header */}
            <div className="text-center mb-10 sm:mb-14">
              <p className="text-xs uppercase font-bold text-cyan-400 tracking-widest mb-2">Role-Based Gateways</p>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white">Choose Your Portal</h2>
              <p className="text-gray-500 text-sm mt-2 max-w-xl mx-auto">
                Dedicated workspaces tailored to learners, institutional leaders, and corporate recruiters.
              </p>
            </div>

            {/* 3-column card grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
              {/* Student */}
              <div
                onClick={() => navigate('/student')}
                className="group cursor-pointer rounded-2xl border border-purple-500/30 bg-white/[0.03] hover:bg-purple-950/30 hover:border-purple-400/60 p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-lg"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-2xl mb-5 group-hover:scale-110 transition-transform">🎓</div>
                  <h3 className="text-xl font-bold text-white mb-2">Student Sector</h3>
                  <p className="text-sm text-gray-400 leading-relaxed mb-5">Interactive career milestones with anti-decay XP preservation, AI resume gap discovery, skill tests, and verified internships.</p>
                  <ul className="space-y-2 text-xs text-gray-500 mb-6">
                    <li className="flex items-center gap-2"><span className="text-purple-400">✓</span> Gamified Career Roadmap</li>
                    <li className="flex items-center gap-2"><span className="text-purple-400">✓</span> AI Resume Competency Analyzer</li>
                    <li className="flex items-center gap-2"><span className="text-purple-400">✓</span> Zulu AI Career Counselor</li>
                  </ul>
                </div>
                <span className="block w-full text-center py-2.5 rounded-xl bg-purple-600/20 group-hover:bg-purple-600/40 text-purple-300 border border-purple-500/40 font-bold text-xs uppercase tracking-wider transition">
                  Enter Student Portal ➔
                </span>
              </div>

              {/* Academy */}
              <div
                onClick={() => navigate('/academy')}
                className="group cursor-pointer rounded-2xl border border-emerald-500/30 bg-white/[0.03] hover:bg-emerald-950/30 hover:border-emerald-400/60 p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-lg"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-2xl mb-5 group-hover:scale-110 transition-transform">🏛️</div>
                  <h3 className="text-xl font-bold text-white mb-2">Academy Sector</h3>
                  <p className="text-sm text-gray-400 leading-relaxed mb-5">Curriculum modernization engine aligning college syllabi with industry needs under NEP-2020, student skill analytics, and FDP nominations.</p>
                  <ul className="space-y-2 text-xs text-gray-500 mb-6">
                    <li className="flex items-center gap-2"><span className="text-emerald-400">✓</span> AI-Driven Syllabus Modernization</li>
                    <li className="flex items-center gap-2"><span className="text-emerald-400">✓</span> Student Skill Matrix & Verification</li>
                    <li className="flex items-center gap-2"><span className="text-emerald-400">✓</span> Bilateral Corporate MoUs & FDP</li>
                  </ul>
                </div>
                <span className="block w-full text-center py-2.5 rounded-xl bg-emerald-600/20 group-hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/40 font-bold text-xs uppercase tracking-wider transition">
                  Enter Academy Portal ➔
                </span>
              </div>

              {/* Industry */}
              <div
                onClick={() => navigate('/industry')}
                className="group cursor-pointer rounded-2xl border border-blue-500/30 bg-white/[0.03] hover:bg-blue-950/30 hover:border-blue-400/60 p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-lg"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-2xl mb-5 group-hover:scale-110 transition-transform">🏢</div>
                  <h3 className="text-xl font-bold text-white mb-2">Industry Sector</h3>
                  <p className="text-sm text-gray-400 leading-relaxed mb-5">Direct recruitment gateway for posting internships, submitting emerging technological skill requirements to colleges, and sponsoring R&D.</p>
                  <ul className="space-y-2 text-xs text-gray-500 mb-6">
                    <li className="flex items-center gap-2"><span className="text-blue-400">✓</span> Pre-Screened Talent Discovery</li>
                    <li className="flex items-center gap-2"><span className="text-blue-400">✓</span> Submit Skill Demands to Colleges</li>
                    <li className="flex items-center gap-2"><span className="text-blue-400">✓</span> Sponsor R&D Grants & Hackathons</li>
                  </ul>
                </div>
                <span className="block w-full text-center py-2.5 rounded-xl bg-blue-600/20 group-hover:bg-blue-600/40 text-blue-300 border border-blue-500/40 font-bold text-xs uppercase tracking-wider transition">
                  Enter Industry Portal ➔
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ── PLATFORM FEATURES ─────────────────────────────────────── */}
        <section className="py-16 sm:py-20 border-t border-white/5">
          <div className="max-w-6xl mx-auto px-5 sm:px-8">
            <div className="text-center mb-10 sm:mb-14">
              <p className="text-xs uppercase font-bold text-purple-400 tracking-widest mb-2">Platform Features</p>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white">Built for the Ayush Ecosystem</h2>
              <p className="text-gray-500 text-sm mt-2 max-w-xl mx-auto">
                Solving Ministry of Ayush Problem Statement 26044 with production-ready AI tools, anti-decay gamification, and institutional synergy.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {features.map((feat, idx) => (
                <div
                  key={idx}
                  className="group p-5 sm:p-6 rounded-2xl bg-white/[0.03] border border-white/8 hover:border-white/15 hover:bg-white/[0.05] flex flex-col transition-all duration-300 hover:-translate-y-0.5 shadow-md"
                >
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-2xl sm:text-3xl">{feat.icon}</span>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${feat.tagColor}`}>{feat.tag}</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white mb-2">{feat.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-400 leading-relaxed flex-1">{feat.desc}</p>
                  <div className="mt-4 pt-3 border-t border-white/5 text-[11px] text-gray-600 font-medium">
                    Verified Feature · Live on JOBLEX ✓
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── STATS STRIP ───────────────────────────────────────────── */}
        <section className="py-10 border-t border-white/5">
          <div className="max-w-6xl mx-auto px-5 sm:px-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 text-center">
              {[
                { value: '15,000+', label: 'Students Registered' },
                { value: '48', label: 'Partner Institutions' },
                { value: '₹24L+', label: 'R&D Grants Active' },
                { value: '92%', label: 'Placement Accuracy' },
              ].map((stat, i) => (
                <div key={i} className="p-5 rounded-2xl bg-white/[0.03] border border-white/8">
                  <div className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-1">{stat.value}</div>
                  <div className="text-xs text-gray-500 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CALL TO ACTION ─────────────────────────────────────────── */}
        <section className="py-16 sm:py-20 border-t border-white/5">
          <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center">
            <div className="p-8 sm:p-12 rounded-3xl border border-white/10 bg-gradient-to-br from-purple-950/50 via-indigo-950/50 to-blue-950/50 backdrop-blur-md space-y-5 sm:space-y-6 shadow-2xl">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white">Ready to Experience JOBLEX?</h2>
              <p className="text-sm sm:text-base text-gray-400 max-w-lg mx-auto leading-relaxed">
                Join students, academic deans, and pharma industry leaders in transforming skill readiness and placement outcomes.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 pt-1">
                <button
                  onClick={() => navigate('/auth')}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white text-gray-950 font-black text-sm uppercase tracking-wider hover:bg-gray-100 shadow-lg transition hover:scale-105"
                >
                  ⚡ Access Portal & Demos
                </button>
                <button
                  onClick={() => navigate('/student')}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-white font-bold text-sm transition"
                >
                  Explore Career Roadmap →
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ── FOOTER ─────────────────────────────────────────────────── */}
        <footer className="py-8 border-t border-white/5 text-center text-xs text-gray-600 px-5 space-y-1">
          <p className="font-bold text-gray-400">JOBLEX · Academia–Industry Collaboration Portal</p>
          <p>Developed for Ministry of Ayush · AIIA New Delhi · Problem Statement ID 26044</p>
        </footer>
      </main>
    </div>
  );
}
