import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Dynamic3DScene from '../components/3d/Dynamic3DScene';

export default function AuthPortal() {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') || 'student';
  const initialMode = searchParams.get('mode') === 'register' ? false : true;
  const redirectTarget = searchParams.get('redirect');

  const [isLogin, setIsLogin] = useState(initialMode);
  const [role, setRole] = useState(
    ['student', 'academy', 'industry'].includes(initialRole) ? initialRole : 'student'
  );
  const [name, setName] = useState('');
  const [organization, setOrganization] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [department, setDepartment] = useState('');
  const [roleSpec, setRoleSpec] = useState('');
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const r = searchParams.get('role');
    if (r && ['student', 'academy', 'industry'].includes(r)) {
      setRole(r);
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!isLogin && !agreedTerms) {
      setError('Please certify your affiliation and agree to the Terms of Service.');
      setLoading(false);
      return;
    }

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
          company: role === 'industry' ? organization : undefined,
          department: department || undefined,
          designation: role !== 'student' ? roleSpec : undefined,
          year: role === 'student' ? roleSpec : undefined
        });
      }

      if (redirectTarget && !redirectTarget.includes('/auth')) {
        navigate(redirectTarget);
      } else if (role === 'student') navigate('/student');
      else if (role === 'academy') navigate('/academy');
      else if (role === 'industry') navigate('/industry');
    } catch (err) {
      setError(err.message || 'Authentication error');
    } finally {
      setLoading(false);
    }
  };

  const getRoleHint = () => {
    if (role === 'student') return { label: 'Ayush Student', color: 'bg-purple-500/15 text-purple-300 border-purple-500/30' };
    if (role === 'academy') return { label: 'Faculty / Dean', color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' };
    return { label: 'Corporate Recruiter', color: 'bg-blue-500/15 text-blue-300 border-blue-500/30' };
  };

  const roleHint = getRoleHint();
  const roleCapital = role.charAt(0).toUpperCase() + role.slice(1);

  return (
    <div className="min-h-screen w-full bg-[#05050a] flex items-center justify-center font-sans text-white p-3 sm:p-6 py-8 relative overflow-x-hidden">
      {/* 3D Background */}
      <Dynamic3DScene theme="auth" showTotem={true} totemPosition={[0, 0, -5]} />

      {/* Auth Card: Adapts layout and width between Login (max-w-md) and Register (max-w-xl) */}
      <div className={`relative z-10 w-full p-5 sm:p-8 rounded-3xl bg-gray-900/95 backdrop-blur-xl shadow-2xl my-auto transition-all duration-300 border ${
        isLogin 
          ? 'max-w-md border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.1)]' 
          : 'max-w-xl border-cyan-500/40 shadow-[0_0_35px_rgba(6,182,212,0.15)]'
      }`}>
        {/* Header Logo */}
        <div className="flex items-center justify-center mb-5 pb-3 border-b border-gray-800 text-center">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-7 bg-indigo-500 rounded-sm shadow-[0_0_10px_#6366f1]"></div>
            <div className="text-left">
              <span className="text-xl sm:text-2xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 uppercase">
                JOBLEX
              </span>
              <span className="text-[9px] text-gray-400 block tracking-widest uppercase font-semibold">
                {isLogin ? 'Secure Portal Sign-In' : 'New Scholar & Partner Registration'}
              </span>
            </div>
          </div>
        </div>

        {/* Distinct Pill Slider for Mode */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-black/60 rounded-2xl border border-gray-800 mb-5">
          <button
            type="button"
            onClick={() => setIsLogin(true)}
            className={`py-2.5 text-xs sm:text-sm font-extrabold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
              isLogin 
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <span>🔑</span>
            <span>Sign In</span>
          </button>
          <button
            type="button"
            onClick={() => setIsLogin(false)}
            className={`py-2.5 text-xs sm:text-sm font-extrabold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
              !isLogin 
                ? 'bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 text-white shadow-md' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <span>✨</span>
            <span>Create Account</span>
          </button>
        </div>

        {/* Mode Context Banner */}
        {isLogin ? (
          <div className="mb-5 p-3 rounded-2xl bg-purple-950/40 border border-purple-500/20 text-xs text-purple-200 flex items-center gap-3">
            <span className="text-xl shrink-0">🔐</span>
            <div>
              <p className="font-bold text-white text-xs">Welcome Back</p>
              <p className="text-[11px] text-gray-400">Enter your credentials to access your verified dashboard.</p>
            </div>
          </div>
        ) : (
          <div className="mb-5 p-3 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-200 flex items-center gap-3">
            <span className="text-xl shrink-0">✨</span>
            <div>
              <p className="font-bold text-white text-xs">Create New Verified Account</p>
              <p className="text-[11px] text-gray-300">Register with your academic or corporate credentials for verified credential tracking.</p>
            </div>
          </div>
        )}

        {/* Role Selector Tabs */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">
              {isLogin ? 'Sign In Portal:' : 'Register For Role:'}
            </label>
            <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${roleHint.color}`}>
              {roleHint.label}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-black/50 rounded-xl border border-gray-800">
            {[
              { id: 'student', label: '🎓 Student', color: 'text-purple-300 border-purple-500/60 bg-purple-950/50 shadow-sm' },
              { id: 'academy', label: '🏛️ Academy', color: 'text-emerald-300 border-emerald-500/60 bg-emerald-950/50 shadow-sm' },
              { id: 'industry', label: '🏢 Industry', color: 'text-blue-300 border-blue-500/60 bg-blue-950/50 shadow-sm' }
            ].map(r => (
              <button
                key={r.id}
                type="button"
                onClick={() => setRole(r.id)}
                className={`py-2 text-xs font-bold rounded-lg transition-all border cursor-pointer ${
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

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-500/50 text-red-200 text-xs font-medium flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Register-Only Extended Fields */}
          {!isLogin && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-gray-300 uppercase tracking-wider block mb-1">
                    Full Legal Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Ashay Verma"
                    className="w-full p-2.5 rounded-xl bg-gray-950 border border-gray-700/80 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-300 uppercase tracking-wider block mb-1">
                    {role === 'industry' ? 'Company / Enterprise' : 'College / University'} <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={organization}
                    onChange={e => setOrganization(e.target.value)}
                    placeholder={role === 'industry' ? 'e.g. Dabur Research Labs' : 'e.g. AIIA New Delhi'}
                    className="w-full p-2.5 rounded-xl bg-gray-950 border border-gray-700/80 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-gray-300 uppercase tracking-wider block mb-1">
                    {role === 'industry' ? 'Industry Sector' : 'Department / Faculty'}
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={e => setDepartment(e.target.value)}
                    placeholder={role === 'industry' ? 'e.g. Phytopharmaceuticals' : 'e.g. Ayurvedic Pharmacology'}
                    className="w-full p-2.5 rounded-xl bg-gray-950 border border-gray-700/80 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-300 uppercase tracking-wider block mb-1">
                    {role === 'student' ? 'Year of Study' : role === 'academy' ? 'Designation' : 'Job Title'}
                  </label>
                  <input
                    type="text"
                    value={roleSpec}
                    onChange={e => setRoleSpec(e.target.value)}
                    placeholder={role === 'student' ? 'e.g. 3rd Year BAMS' : role === 'academy' ? 'e.g. Dean / Professor' : 'e.g. Talent Acquisition Lead'}
                    className="w-full p-2.5 rounded-xl bg-gray-950 border border-gray-700/80 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Common Fields: Email & Password */}
          <div>
            <label className="text-[11px] font-bold text-gray-300 uppercase tracking-wider block mb-1">
              Email Address <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@domain.edu"
                className="w-full p-2.5 pl-9 rounded-xl bg-gray-950 border border-gray-700/80 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-mono"
              />
              <span className="absolute left-3 top-2.5 text-gray-500 text-xs">✉️</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[11px] font-bold text-gray-300 uppercase tracking-wider block">
                Password <span className="text-rose-400">*</span>
              </label>
              {isLogin && (
                <span className="text-[10px] text-purple-400 hover:text-purple-300 transition cursor-pointer">
                  Forgot Password?
                </span>
              )}
            </div>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-2.5 pl-9 rounded-xl bg-gray-950 border border-gray-700/80 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
              <span className="absolute left-3 top-2.5 text-gray-500 text-xs">🔒</span>
            </div>
          </div>

          {/* Terms Checkbox for Registration */}
          {!isLogin && (
            <div className="text-[11px] text-gray-400 flex items-start gap-2 pt-1">
              <input
                type="checkbox"
                id="terms-agree-react"
                checked={agreedTerms}
                onChange={e => setAgreedTerms(e.target.checked)}
                className="mt-0.5 rounded bg-gray-950 border-gray-700 text-purple-600 focus:ring-purple-500 cursor-pointer"
              />
              <label htmlFor="terms-agree-react" className="leading-tight cursor-pointer">
                I certify my institutional / organizational affiliation and agree to the <span className="text-purple-300 underline">Terms of Service</span>.
              </label>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-bold text-xs sm:text-sm shadow-lg transition disabled:opacity-50 mt-2 cursor-pointer flex items-center justify-center gap-2 ${
              isLogin
                ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:opacity-95 text-white'
                : 'bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 hover:opacity-95 text-white shadow-[0_0_20px_rgba(6,182,212,0.3)]'
            }`}
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : isLogin ? (
              <span>Sign In to {roleCapital} Portal ➔</span>
            ) : (
              <span>Complete Registration & Enter {roleCapital} Portal ✨</span>
            )}
          </button>

          {/* Bottom Switch Link */}
          <div className="text-center pt-2 text-xs text-gray-400">
            <span>{isLogin ? "Don't have an account yet?" : 'Already have an account?'}</span>
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="ml-1 text-purple-400 hover:text-purple-300 font-bold underline cursor-pointer"
            >
              {isLogin ? 'Create Account' : 'Sign In'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
