import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Dynamic3DScene from '../components/3d/Dynamic3DScene';
import { getIndustryDataApi, postOpportunityApi, submitSkillDemandApi } from '../services/api';

export default function IndustryPortal() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  // Form states
  const [postTitle, setPostTitle] = useState('');
  const [postCompany, setPostCompany] = useState('Dabur India Ltd.');
  const [postType, setPostType] = useState('Internship');
  const [postSkills, setPostSkills] = useState('Herbal Formulation, Phytochemistry, GLP');
  const [postStipend, setPostStipend] = useState('₹22,000/mo');
  const [postLocation, setPostLocation] = useState('New Delhi / Hybrid');

  // Skill demand state
  const [demandDomain, setDemandDomain] = useState('Phytopharmaceuticals');
  const [demandSkills, setDemandSkills] = useState('Automated Supercritical Fluid Extraction & Nanomedicine');
  const [demandReason, setDemandReason] = useState('Critical bottleneck in commercializing modern Ayurvedic extracts');

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const sidebarModules = [
    { id: 'Dashboard', label: '📊 Recruitment Dashboard', desc: 'Pipeline & applicants' },
    { id: 'Post', label: '📢 Post Opportunity', desc: 'Internships & entry roles', badge: 'Publish' },
    { id: 'SkillDemand', label: '🎯 Submit Skill Demand', desc: 'Influence college syllabus', badge: 'MoU' },
    { id: 'Candidates', label: '🔍 Candidate Discovery', desc: 'Pre-screened verified talent' },
    { id: 'MoU', label: '📜 Academic Partnerships', desc: 'Bilateral university ties' },
    { id: 'Challenges', label: '💡 Innovation Challenges', desc: 'Host hackathons & bounties' }
  ];

  const handleSelectModule = (id) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await getIndustryDataApi();
    if (res) {
      setData(res);
    } else {
      setData({
        opportunities: [
          { id: 'opp-1', title: 'Phytochemical Research Intern', company: 'Dabur India Ltd.', type: 'Internship', skills: ['Herbal Formulation', 'GLP'], location: 'Ghaziabad', stipend: '₹22,000/mo', match: 92 },
          { id: 'opp-2', title: 'Ayush AI Innovation Challenge', company: 'Ministry of Ayush & AIIA', type: 'Hackathon', skills: ['Python', 'NLP'], location: 'New Delhi', stipend: '₹3 Lakhs Bounty', match: 88 },
          { id: 'opp-3', title: 'Formulation Development Scientist', company: 'Patanjali Ayurved', type: 'Job', skills: ['Pharmacognosy', 'QC'], location: 'Haridwar', stipend: '₹8-12 LPA', match: 75 },
          { id: 'opp-4', title: 'Health Informatics & EHR Intern', company: 'Himalaya Wellness', type: 'Internship', skills: ['Python', 'EHR'], location: 'Bengaluru', stipend: '₹25,000/mo', match: 84 }
        ],
        candidates: [
          { name: "Ashay Verma", dept: "Ayurvedic Pharmacology & AI", score: 92, status: "Shortlisted", skills: ["Herbal Formulation", "Python", "GLP"] },
          { name: "Pooja Verma", dept: "Phytochemistry", score: 86, status: "Interview Scheduled", skills: ["HPTLC", "Spectroscopy", "GLP"] },
          { name: "Arjun Reddy", dept: "Dravyaguna", score: 79, status: "Under Review", skills: ["Classical Botany", "Clinical Trials"] },
          { name: "Kavya Singh", dept: "Health Informatics", score: 94, status: "Offer Extended", skills: ["Machine Learning", "EHR", "Python"] }
        ]
      });
    }
    setLoading(false);
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      title: postTitle,
      company: postCompany,
      type: postType,
      skills: postSkills.split(',').map(s => s.trim()),
      stipend: postStipend,
      location: postLocation
    };

    const res = await postOpportunityApi(payload);
    if (res && res.success) {
      setData(prev => ({
        ...prev,
        opportunities: [res.opportunity, ...prev.opportunities]
      }));
      setNotification(`Opportunity '${postTitle}' successfully published to the Student Portal!`);
    } else {
      setData(prev => ({
        ...prev,
        opportunities: [{ id: `opp-${Date.now()}`, ...payload, match: 88 }, ...prev.opportunities]
      }));
      setNotification(`Opportunity '${postTitle}' published!`);
    }
    setPostTitle('');
    setTimeout(() => setNotification(null), 5000);
  };

  const handleDemandSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      domain: demandDomain,
      skillsNeeded: demandSkills,
      company: user?.company || 'Dabur Research Labs'
    };

    const res = await submitSkillDemandApi(payload);
    setNotification(res?.message || "Skill Demand transmitted to Board of Studies of all affiliated Ayush Colleges!");
    setTimeout(() => setNotification(null), 5000);
  };

  const handleCandidateAction = (candName, newStatus) => {
    setData(prev => ({
      ...prev,
      candidates: prev.candidates.map(c => c.name === candName ? { ...c, status: newStatus } : c)
    }));
    setNotification(`Updated ${candName}'s recruitment status to: ${newStatus}`);
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div className="min-h-screen w-full bg-[#05050a] flex flex-col font-sans text-white relative overflow-x-hidden">
      {/* 3D Background */}
      <Dynamic3DScene theme="industry" showTotem={true} totemPosition={[4, 0, -6]} />

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 border-b border-gray-800 bg-[#080814]/95 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-3">
          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-gray-900 border border-blue-500/30 text-blue-300 text-xs font-bold flex items-center gap-1.5"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? '✕ Close' : '☰ Modules'}
          </button>

          <div 
            onClick={() => navigate('/')} 
            className="cursor-pointer flex items-center gap-2 group"
          >
            <div className="w-2.5 h-6 sm:h-7 bg-blue-500 rounded-sm shadow-[0_0_10px_#3b82f6] group-hover:scale-110 transition"></div>
            <div>
              <span className="text-lg sm:text-xl font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300 uppercase">
                JOBLEX
              </span>
              <span className="hidden sm:block text-[9px] text-gray-400 tracking-widest uppercase font-semibold">
                Industry Portal
              </span>
            </div>
          </div>
        </div>

        {/* Corporate Status & Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-xl bg-gray-900/90 border border-blue-500/30 text-xs">
            <span className="text-blue-400 font-bold">🏢 {user?.company || 'Dabur Labs'}</span>
          </div>

          <button
            onClick={() => navigate('/auth')}
            className="text-[11px] sm:text-xs px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-blue-900/30 hover:bg-blue-900/60 border border-blue-500/40 text-blue-300 font-bold transition"
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
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleSelectModule(item.id)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                isActive
                  ? 'bg-blue-600 text-white border-blue-400 shadow-sm'
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
              className="w-72 max-w-[85vw] h-full bg-[#080814] border-r border-blue-500/30 p-4 flex flex-col justify-between overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="space-y-2">
                <div className="flex justify-between items-center px-2 pb-3 border-b border-gray-800">
                  <span className="text-xs uppercase tracking-wider text-blue-400 font-bold">Industry Modules</span>
                  <button 
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1 rounded-lg text-gray-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-1 pt-1">
                  {sidebarModules.map((item) => {
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSelectModule(item.id)}
                        className={`w-full flex flex-col items-start px-3.5 py-2.5 rounded-xl text-left transition-all ${
                          isActive
                            ? 'bg-blue-600/30 border border-blue-500 text-blue-100'
                            : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="font-bold text-xs text-white">{item.label}</span>
                          {item.badge && (
                            <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-blue-500 text-white">
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
            <div className="px-3 py-1.5 text-[11px] uppercase tracking-wider text-blue-400 font-bold">
              Industry Modules
            </div>

            {sidebarModules.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex flex-col items-start px-3.5 py-2.5 rounded-xl text-left transition-all ${
                    isActive
                      ? 'bg-blue-600/25 border border-blue-500/80 text-blue-100 shadow-[0_0_15px_rgba(59,130,246,0.25)]'
                      : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-bold text-xs text-white">{item.label}</span>
                    {item.badge && (
                      <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${
                        isActive ? 'bg-blue-500 text-white' : 'bg-gray-800 text-blue-300'
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
            <div className="p-3 rounded-xl bg-blue-950/20 border border-blue-500/20 text-xs text-blue-200">
              <span className="font-bold block mb-0.5">Direct College Synergy</span>
              <p className="text-[10px] text-gray-400 leading-tight">Curriculum proposals are reviewed directly by academic Deans.</p>
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
            
            {/* Notification Banner */}
            {notification && (
              <div className="p-3.5 sm:p-4 rounded-xl bg-blue-500/20 border border-blue-500/50 text-blue-100 text-xs sm:text-sm font-medium animate-fade-in flex justify-between items-center shadow-md">
                <span>🔔 {notification}</span>
                <button onClick={() => setNotification(null)} className="text-xs opacity-70 hover:opacity-100 font-bold ml-2">✕</button>
              </div>
            )}

            {/* TAB 1: RECRUITMENT DASHBOARD */}
            {activeTab === 'Dashboard' && data && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white">Recruitment & Placement Overview</h2>
                  <p className="text-xs sm:text-sm text-gray-400 mt-1">Track applicant volume, pre-screened compatibility scores, and active student offers.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  {[
                    { label: 'Active Postings', value: data.opportunities?.length || 4, sub: 'Internships & Jobs', color: 'from-blue-400 to-cyan-300' },
                    { label: 'Applications', value: '168', sub: 'Past 14 Days', color: 'from-purple-400 to-indigo-300' },
                    { label: 'Avg Match Score', value: '84.2%', sub: 'Pre-screened via JOBLEX', color: 'from-emerald-400 to-teal-300' },
                    { label: 'Shortlisted', value: '24', sub: 'Across 3 Colleges', color: 'from-amber-400 to-orange-400' }
                  ].map((s, i) => (
                    <div key={i} className="p-4 sm:p-5 rounded-2xl bg-gray-900/60 border border-blue-500/20 backdrop-blur-md shadow-md">
                      <span className="text-xs font-semibold text-gray-400 block mb-1">{s.label}</span>
                      <div className={`text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r ${s.color}`}>
                        {s.value}
                      </div>
                      <span className="text-[11px] text-gray-400 mt-1 block">{s.sub}</span>
                    </div>
                  ))}
                </div>

                {/* Active Postings Overview */}
                <div className="p-5 sm:p-6 rounded-2xl bg-gray-900/60 border border-gray-800 backdrop-blur-md space-y-4 shadow-md">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                        <span>📢</span> Live Company Postings
                      </h3>
                      <p className="text-xs text-gray-400">Opportunities currently visible to verified students:</p>
                    </div>
                    <button
                      onClick={() => setActiveTab('Post')}
                      className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-sm"
                    >
                      + Post New
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.opportunities?.map((opp) => (
                      <div key={opp.id} className="p-4 sm:p-5 rounded-xl bg-black/40 border border-gray-800 flex flex-col justify-between space-y-3">
                        <div>
                          <div className="flex justify-between items-start mb-1.5">
                            <h4 className="font-bold text-white text-sm sm:text-base">{opp.title}</h4>
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40">
                              {opp.type}
                            </span>
                          </div>
                          <div className="text-xs text-gray-400 mb-2">{opp.company} • {opp.location} • <strong className="text-emerald-400">{opp.stipend}</strong></div>
                          <div className="flex flex-wrap gap-1.5">
                            {opp.skills.map((sk, i) => (
                              <span key={i} className="px-2 py-0.5 rounded-md bg-gray-800 text-[10px] text-gray-300">
                                {sk}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="pt-3 border-t border-gray-800 flex justify-between items-center text-xs">
                          <span className="text-emerald-400 font-semibold">{opp.match}% Match</span>
                          <button
                            onClick={() => setActiveTab('Candidates')}
                            className="text-blue-400 hover:text-blue-300 font-semibold"
                          >
                            Applicants ➔
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: POST OPPORTUNITY */}
            {activeTab === 'Post' && (
              <div className="max-w-3xl mx-auto p-5 sm:p-8 rounded-3xl bg-gray-900/70 border border-blue-500/30 backdrop-blur-xl animate-fade-in space-y-5 shadow-xl">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white">Publish Internship or Entry-Level Job</h2>
                  <p className="text-xs text-gray-400 mt-1">
                    Posted opportunities are immediately matched with students on their Career Roadmap and ranked by competency scores.
                  </p>
                </div>

                <form onSubmit={handlePostSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-300 block mb-1">Opportunity Title</label>
                      <input
                        type="text"
                        required
                        value={postTitle}
                        onChange={e => setPostTitle(e.target.value)}
                        placeholder="e.g. Phytochemical Quality Control Intern"
                        className="w-full p-2.5 sm:p-3 rounded-xl bg-gray-950 border border-gray-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-300 block mb-1">Opportunity Type</label>
                      <select
                        value={postType}
                        onChange={e => setPostType(e.target.value)}
                        className="w-full p-2.5 sm:p-3 rounded-xl bg-gray-950 border border-gray-700 text-xs text-white focus:outline-none"
                      >
                        <option value="Internship">Industrial Internship</option>
                        <option value="Job">Full-Time Entry Role</option>
                        <option value="Hackathon">Innovation Challenge / Hackathon</option>
                        <option value="Apprenticeship">Apprenticeship</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-300 block mb-1">Company</label>
                      <input
                        type="text"
                        value={postCompany}
                        onChange={e => setPostCompany(e.target.value)}
                        className="w-full p-2.5 sm:p-3 rounded-xl bg-gray-950 border border-gray-700 text-xs text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-300 block mb-1">Stipend / CTC</label>
                      <input
                        type="text"
                        value={postStipend}
                        onChange={e => setPostStipend(e.target.value)}
                        placeholder="e.g. ₹22,000/mo"
                        className="w-full p-2.5 sm:p-3 rounded-xl bg-gray-950 border border-gray-700 text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-300 block mb-1">
                      Required Skills (Comma separated)
                    </label>
                    <input
                      type="text"
                      value={postSkills}
                      onChange={e => setPostSkills(e.target.value)}
                      placeholder="Herbal Formulation, HPTLC, Clinical Research, Python"
                      className="w-full p-2.5 sm:p-3 rounded-xl bg-gray-950 border border-gray-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-300 block mb-1">Location / Work Mode</label>
                    <input
                      type="text"
                      value={postLocation}
                      onChange={e => setPostLocation(e.target.value)}
                      placeholder="e.g. Ghaziabad R&D Center or Hybrid"
                      className="w-full p-2.5 sm:p-3 rounded-xl bg-gray-950 border border-gray-700 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 text-white font-bold text-xs shadow-md transition mt-2"
                  >
                    🚀 Publish to All Student Portals
                  </button>
                </form>
              </div>
            )}

            {/* TAB 3: SUBMIT SKILL DEMAND TO ACADEMIA */}
            {activeTab === 'SkillDemand' && (
              <div className="max-w-3xl mx-auto p-5 sm:p-8 rounded-3xl bg-gray-900/70 border border-blue-500/30 backdrop-blur-xl animate-fade-in space-y-5 shadow-xl">
                <div>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-bold uppercase tracking-wider">
                    Curriculum Shaping Engine
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-white mt-2">Submit Industry Skill Needs to University Deans</h2>
                  <p className="text-xs text-gray-400 mt-1">
                    Your technical skill requirements are analyzed by AI and transmitted directly to Academic Deans as syllabus modernization proposals.
                  </p>
                </div>

                <form onSubmit={handleDemandSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-300 block mb-1">Industrial Sector / Domain</label>
                    <select
                      value={demandDomain}
                      onChange={e => setDemandDomain(e.target.value)}
                      className="w-full p-2.5 sm:p-3 rounded-xl bg-gray-950 border border-gray-700 text-xs text-white focus:outline-none"
                    >
                      <option value="Phytopharmaceuticals">Phytopharmaceuticals & Herbal Extraction</option>
                      <option value="Ayush HealthTech & EHR">Ayush HealthTech & Digital Registries</option>
                      <option value="Clinical Trials & Pharmacovigilance">Clinical Trials & Pharmacovigilance</option>
                      <option value="Traditional Food & Nutraceuticals">Traditional Food & Nutraceuticals</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-300 block mb-1">
                      Emerging Technologies & Skills Needed in Graduates
                    </label>
                    <textarea
                      rows={3}
                      value={demandSkills}
                      onChange={e => setDemandSkills(e.target.value)}
                      placeholder="e.g. Nanotechnology drug delivery, High-Throughput HPTLC, AI molecular docking..."
                      className="w-full p-2.5 sm:p-3 rounded-xl bg-gray-950 border border-gray-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-300 block mb-1">Industry Rationale / Market Need</label>
                    <textarea
                      rows={3}
                      value={demandReason}
                      onChange={e => setDemandReason(e.target.value)}
                      placeholder="Why should universities adopt this? e.g. 50+ job openings anticipated..."
                      className="w-full p-2.5 sm:p-3 rounded-xl bg-gray-950 border border-gray-700 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-blue-600 hover:opacity-90 text-white font-bold text-xs shadow-md transition"
                  >
                    📨 Transmit Skill Demand to Academic Deans
                  </button>
                </form>
              </div>
            )}

            {/* TAB 4: CANDIDATE TALENT DISCOVERY */}
            {activeTab === 'Candidates' && data && (
              <div className="space-y-6 animate-fade-in">
                <div className="p-5 sm:p-6 rounded-2xl bg-gray-900/70 border border-gray-800">
                  <h2 className="text-xl sm:text-2xl font-black text-white">Pre-Screened Talent Discovery</h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Candidates evaluated through AI resume screening, verified laboratory tests, and digital portfolio achievements.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                  {data.candidates?.map((cand, i) => (
                    <div key={i} className="p-5 sm:p-6 rounded-2xl bg-gray-900/70 border border-blue-500/20 backdrop-blur-md flex flex-col justify-between space-y-4 shadow-md">
                      <div>
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-1.5">
                              {cand.name}
                              <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                                ✓ Verified
                              </span>
                            </h3>
                            <p className="text-xs text-gray-400 mt-0.5">{cand.dept}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-lg sm:text-xl font-black text-blue-400">{cand.score}%</span>
                            <span className="text-[10px] text-gray-400 block">Match Score</span>
                          </div>
                        </div>

                        <div className="mt-3">
                          <span className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1 font-bold">Core Competencies:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {cand.skills.map((sk, idx) => (
                              <span key={idx} className="px-2 py-0.5 rounded-md bg-black/60 text-gray-200 text-xs border border-gray-800">
                                {sk}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-gray-800 flex items-center justify-between">
                        <span className="text-xs text-purple-300 font-semibold">{cand.status}</span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleCandidateAction(cand.name, 'Shortlisted')}
                            className="px-2.5 py-1 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition shadow-sm"
                          >
                            Shortlist
                          </button>
                          <button
                            onClick={() => handleCandidateAction(cand.name, 'Interview Scheduled')}
                            className="px-2.5 py-1 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/60 text-emerald-300 border border-emerald-500/40 text-xs font-semibold transition"
                          >
                            Interview
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: ACADEMIC MoUs */}
            {activeTab === 'MoU' && (
              <div className="p-5 sm:p-8 rounded-3xl bg-gray-900/70 border border-blue-500/20 backdrop-blur-md animate-fade-in space-y-5 shadow-md">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-white">Academic Institution MoUs</h2>
                    <p className="text-xs text-gray-400 mt-0.5">Manage institutional bilateral pacts for student internships and patenting.</p>
                  </div>
                  <button
                    onClick={() => setNotification("Initiated bilateral MoU proposal transmission to AIIA New Delhi.")}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition shadow-md"
                  >
                    + Propose MoU
                  </button>
                </div>

                <div className="p-5 rounded-2xl bg-black/40 border border-gray-800 space-y-2.5">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-white text-sm sm:text-base">All India Institute of Ayurveda (AIIA), New Delhi</h3>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/40">Active</span>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    Bilateral pact signed June 2025 focusing on joint phytochemical standardization, laboratory faculty training, and 20 guaranteed annual internships.
                  </p>
                  <div className="pt-2 flex flex-wrap gap-3 text-xs text-gray-400">
                    <span>📅 Expiry: June 2028</span>
                    <span>🔬 18 Interns Hosted</span>
                    <span>📄 2 Joint Patents Filed</span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: INNOVATION CHALLENGES */}
            {activeTab === 'Challenges' && (
              <div className="p-5 sm:p-8 rounded-3xl bg-gray-900/70 border border-blue-500/20 backdrop-blur-md animate-fade-in space-y-5 shadow-md">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-white">Host Innovation Challenges & Hackathons</h2>
                    <p className="text-xs text-gray-400 mt-0.5">Crowdsource student solutions for complex formulation and chemical hurdles.</p>
                  </div>
                  <button
                    onClick={() => setNotification("Drafted new R&D Innovation Challenge bounty!")}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition shadow-md"
                  >
                    + Create Bounty
                  </button>
                </div>

                <div className="p-5 rounded-2xl bg-black/40 border border-purple-500/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold uppercase">Active National Challenge</span>
                    <h3 className="text-base sm:text-lg font-bold text-white mt-1">Ayush AI Innovation Challenge 2026</h3>
                    <p className="text-xs text-gray-300 mt-0.5">Bounty: ₹3,00,000 • In Collaboration with Ministry of Ayush</p>
                  </div>
                  <span className="text-xs text-emerald-400 font-bold bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-500/30">
                    142 Student Teams Registered
                  </span>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
