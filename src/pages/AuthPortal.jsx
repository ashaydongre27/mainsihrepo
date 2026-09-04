import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Dynamic3DScene from '../components/3d/Dynamic3DScene';

export default function AuthPortal() {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [organization, setOrganization] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleDemoLogin = async (demoRole) => {
    setLoading(true);
    setError(null);
    const demoAccounts = {
      student: { email: 'student@nexus.edu', pass: 'password123', target: '/student' },
      academy: { email: 'dean@aiia.gov.in', pass: 'password123', target: '/academy' },
      industry: { email: 'hr@dabur-research.com', pass: 'password123', target: '/industry' }
    };

    const targetAccount = demoAccounts[demoRole];
    await login(targetAccount.email, targetAccount.pass, demoRole);
    setLoading(false);
    navigate(targetAccount.target);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        await login(email, password, role);
      } else {
        await register({
          name,
          email,
          password,
          role,
          institution: role !== 'industry' ? organization : undefined,
          company: role === 'industry' ? organization : undefined
        });
      }

      if (role === 'student') navigate('/student');
      else if (role === 'academy') navigate('/academy');
      else if (role === 'industry') navigate('/industry');
    } catch (err) {
      setError(err.message || 'Authentication error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#05050a] flex items-center justify-center font-sans text-white p-3 sm:p-6 py-8 relative overflow-x-hidden">
      {/* 3D Background */}
      <Dynamic3DScene theme="auth" showTotem={true} totemPosition={[0, 0, -5]} />

      {/* Auth Card with Responsive Padding */}
      <div className="relative z-10 w-full max-w-lg p-5 sm:p-8 rounded-3xl bg-gray-900/90 border border-purple-500/30 backdrop-blur-xl shadow-2xl my-auto">
        {/* Header Logo */}
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-800">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-7 bg-indigo-500 rounded-sm shadow-[0_0_10px_#6366f1]"></div>
            <div>
              <span className="text-xl sm:text-2xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 uppercase">
                JOBLEX
              </span>
              <span className="text-[9px] text-gray-400 block tracking-widest uppercase font-semibold">
                Access Gateway
              </span>
            </div>
          </div>
          <button
            onClick={() => navigate('/')}
            className="text-xs text-gray-400 hover:text-white px-3 py-1.5 rounded-xl border border-gray-700 hover:border-gray-500 transition font-medium"
          >
            ← Welcome
          </button>
        </div>

        {/* Role Selector Tabs */}
        <div className="mb-5">
          <label className="text-[11px] text-gray-400 block mb-1.5 font-bold uppercase tracking-wider">
            Select Your User Persona:
          </label>
          <div className="grid grid-cols-3 gap-2 p-1.5 bg-black/50 rounded-xl border border-gray-800">
            {[
              { id: 'student', label: '🎓 Student', color: 'text-purple-300 border-purple-500/60 bg-purple-950/50 shadow-sm' },
              { id: 'academy', label: '🏛️ Academy', color: 'text-emerald-300 border-emerald-500/60 bg-emerald-950/50 shadow-sm' },
              { id: 'industry', label: '🏢 Industry', color: 'text-blue-300 border-blue-500/60 bg-blue-950/50 shadow-sm' }
            ].map(r => (
              <button
                key={r.id}
                type="button"
                onClick={() => setRole(r.id)}
                className={`py-2 text-xs font-bold rounded-lg transition-all border ${
                  role === r.id 
                    ? r.color 
                    : 'text-gray-400 border-transparent hover:text-gray-200'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Toggle Login vs Register */}
        <div className="flex border-b border-gray-800 mb-5">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 pb-2.5 text-sm font-bold transition-all border-b-2 ${
              isLogin ? 'border-purple-500 text-purple-300' : 'border-transparent text-gray-500 hover:text-gray-300'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 pb-2.5 text-sm font-bold transition-all border-b-2 ${
              !isLogin ? 'border-purple-500 text-purple-300' : 'border-transparent text-gray-500 hover:text-gray-300'
            }`}
          >
            Create Account
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-500/50 text-red-200 text-xs font-medium">
            {error}
          </div>
        )}

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {!isLogin && (
            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Ashay Verma"
                className="w-full p-3 rounded-xl bg-gray-950 border border-gray-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          )}

          {!isLogin && (
            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1">
                {role === 'industry' ? 'Company Name' : 'College / University'}
              </label>
              <input
                type="text"
                required
                value={organization}
                onChange={e => setOrganization(e.target.value)}
                placeholder={role === 'industry' ? 'e.g. Dabur Labs' : 'e.g. AIIA New Delhi'}
                className="w-full p-3 rounded-xl bg-gray-950 border border-gray-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="user@nexus.edu"
              className="w-full p-3 rounded-xl bg-gray-950 border border-gray-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-3 rounded-xl bg-gray-950 border border-gray-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:opacity-95 text-white font-bold text-xs sm:text-sm shadow-md transition disabled:opacity-50 mt-2"
          >
            {loading ? 'Authenticating...' : isLogin ? `Sign In as ${role.toUpperCase()}` : 'Register & Enter JOBLEX'}
          </button>
        </form>

        {/* 1-Click Fast Login Section */}
        <div className="mt-6 pt-4 border-t border-gray-800">
          <p className="text-[11px] text-center text-gray-400 mb-2 font-semibold">
            ⚡ 1-Click Demo Logins for SIH Judges:
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin('student')}
              className="p-2 text-[11px] rounded-lg bg-purple-900/30 hover:bg-purple-900/60 border border-purple-500/40 text-purple-200 font-bold transition text-center"
            >
              Demo Student
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('academy')}
              className="p-2 text-[11px] rounded-lg bg-emerald-900/30 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-200 font-bold transition text-center"
            >
              Demo Academic
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('industry')}
              className="p-2 text-[11px] rounded-lg bg-blue-900/30 hover:bg-blue-900/60 border border-blue-500/40 text-blue-200 font-bold transition text-center"
            >
              Demo Industry
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
