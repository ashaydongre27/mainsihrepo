import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Dynamic3DScene from '../components/3d/Dynamic3DScene';
import { getAcademyDataApi } from '../services/api';

export default function AcademyPortal() {
  const [activeTab, setActiveTab] = useState('Overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deptFilter, setDeptFilter] = useState('All');
  const [actionAlert, setActionAlert] = useState(null);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const sidebarModules = [
    { id: 'Overview', label: '📊 Executive Analytics', desc: 'Readiness & placements' },
    { id: 'Syllabus', label: '🧠 AI Syllabus Modernization', desc: 'Curriculum add-ons', badge: 'AI Sync' },
    { id: 'Students', label: '🎓 Student Skill Matrix', desc: 'Verification & readiness' },
    { id: 'MoU', label: '📜 Industry MoUs & Ties', desc: 'Bilateral pacts', badge: '3 Active' },
    { id: 'FDP', label: '🔬 Faculty Training (FDP)', desc: 'Industrial immersion' },
    { id: 'Consultancy', label: '💰 R&D Consultancy Grants', desc: 'Corporate problem bids' }
  ];

  const handleSelectModule = (id) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await getAcademyDataApi();
    if (res) {
      setData(res);
    } else {
      setData({
        mouPartnerships: [
          {
            id: "mou-01",
            partner: "Dabur Research Laboratories",
            institution: "All India Institute of Ayurveda",
            status: "Active",
            validUntil: "2028-06-12",
            focusAreas: ["Nanomedicine in Ayurveda", "Student Internships", "Joint Patents"],
            internshipsProvided: 18,
            curriculumSponsors: "Standardization of Kwatha Formulations"
          },
          {
            id: "mou-02",
            partner: "Himalaya Drug Company",
            institution: "All India Institute of Ayurveda",
            status: "Active",
            validUntil: "2027-09-20",
            focusAreas: ["Pharmacovigilance", "Clinical Trial Protocols", "Faculty Training"],
            internshipsProvided: 12,
            curriculumSponsors: "Computational Herbal Discovery"
          },
          {
            id: "mou-03",
            partner: "Aimil Pharmaceuticals",
            institution: "All India Institute of Ayurveda",
            status: "Active",
            validUntil: "2026-12-31",
            focusAreas: ["Metabolic Disorders Formulations", "Sponsored Dissertations"],
            internshipsProvided: 9,
            curriculumSponsors: "Herbal Quality Control & HPTLC"
          }
        ],
        syllabusSuggestions: [
          {
            id: "syl-01",
            currentTopic: "Traditional Dravyaguna & Pharmacognosy (Paper III)",
            suggestedAddition: "Computational Phytochemical Screening & AI Target Binding",
            source: "MoU Advisory Committee (Dabur Research Labs)",
            urgency: "High - Skill Gap",
            status: "Proposed",
            creditsImpact: "+1 Practical Credit"
          },
          {
            id: "syl-02",
            currentTopic: "Rasa Shastra & Bhaishajya Kalpana (Manufacturing)",
            suggestedAddition: "Modern GMP Standards, Cleanroom Automation & Lyophilization",
            source: "Aimil Pharma & Ministry of Ayush Industry Council",
            urgency: "Medium",
            status: "Under Review",
            creditsImpact: "Integrated Lab Module"
          },
          {
            id: "syl-03",
            currentTopic: "Clinical Diagnostic Methodology in Ayurveda",
            suggestedAddition: "Standardized Case Record Forms (CRF) & CTRI Protocols",
            source: "Himalaya Wellness & ICMR Guidelines",
            urgency: "High",
            status: "Approved by Board",
            creditsImpact: "Elective Certification"
          }
        ],
        consultancyGrants: [
          {
            id: "cg-01",
            title: "Standardization of Ashwagandha Active Withanolides in Water-Soluble Matrix",
            industry: "Dabur R&D",
            grantAmount: "₹18,50,000",
            deadline: "2026-11-15",
            targetDept: "Dravyaguna / Pharmaceutical Sciences",
            status: "Open for Faculty Bids"
          },
          {
            id: "cg-02",
            title: "Bio-Efficacy Validation of Triphala Nano-Suspension in Gut Microbiome",
            industry: "Himalaya Drug Co.",
            grantAmount: "₹24,00,000",
            deadline: "2026-12-01",
            targetDept: "Kaya Chikitsa & Microbiology",
            status: "Open for Faculty Bids"
          }
        ],
        fdpPrograms: [
          {
            id: "fdp-01",
            title: "Industrial Immersion in High-Throughput Herbal Extraction & HPTLC",
            organizer: "National Medicinal Plants Board & Dabur Labs",
            duration: "2 Weeks (Lab Immersion)",
            mode: "Offline at R&D Campus",
            enrolled: 24,
            seats: 30
          },
          {
            id: "fdp-02",
            title: "Generative AI & Data Analytics for Traditional Medicine Curriculums",
            organizer: "AIIA & IIT Delhi Ayush Cell",
            duration: "1 Week (30 Hours)",
            mode: "Hybrid",
            enrolled: 68,
            seats: 100
          }
        ],
        studentStats: {
          totalEnrolled: 342,
          avgSkillReadiness: "76.4%",
          placedUnderMoU: 48,
          activeResearchProjects: 14
        }
      });
    }
    setLoading(false);
  };

  const sampleStudents = [
    { name: 'Ashay Verma', dept: 'Pharmacognosy', score: 92, verifiedSkills: 12, status: 'Industry Ready' },
    { name: 'Pooja Sharma', dept: 'Clinical Research', score: 86, verifiedSkills: 10, status: 'Industry Ready' },
    { name: 'Arjun Reddy', dept: 'Pharmacognosy', score: 79, verifiedSkills: 8, status: 'On Track' },
    { name: 'Kavya Singh', dept: 'Health Informatics', score: 94, verifiedSkills: 14, status: 'Placed (Dabur)' },
    { name: 'Rohan Gupta', dept: 'Dravyaguna', score: 62, verifiedSkills: 5, status: 'Needs Support' },
    { name: 'Sneha Patel', dept: 'Clinical Research', score: 74, verifiedSkills: 7, status: 'On Track' }
  ];

  const filteredStudents = deptFilter === 'All' 
    ? sampleStudents 
    : sampleStudents.filter(s => s.dept === deptFilter);

  const handleAction = (msg) => {
    setActionAlert(msg);
    setTimeout(() => setActionAlert(null), 4000);
  };

  return (
    <div className="min-h-screen w-full bg-[#05050a] flex flex-col font-sans text-white relative overflow-x-hidden">
      {/* 3D Background */}
      <Dynamic3DScene theme="academy" showTotem={true} totemPosition={[4, 0, -6]} />

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 border-b border-gray-800 bg-[#080814]/95 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-3">
          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-gray-900 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-1.5"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? '✕ Close' : '☰ Modules'}
          </button>

          <div 
            onClick={() => navigate('/')} 
            className="cursor-pointer flex items-center gap-2 group"
          >
            <div className="w-2.5 h-6 sm:h-7 bg-emerald-500 rounded-sm shadow-[0_0_10px_#10b981] group-hover:scale-110 transition"></div>
            <div>
              <span className="text-lg sm:text-xl font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300 uppercase">
                JOBLEX
              </span>
              <span className="hidden sm:block text-[9px] text-gray-400 tracking-widest uppercase font-semibold">
                Academy Portal
              </span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-xl bg-gray-900/90 border border-emerald-500/30 text-xs">
            <span className="text-emerald-400 font-bold">🏛️ AIIA New Delhi</span>
          </div>

          <button
            onClick={() => navigate('/auth')}
            className="text-[11px] sm:text-xs px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-emerald-900/30 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 font-bold transition"
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
                  ? 'bg-emerald-600 text-white border-emerald-400 shadow-sm'
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
              className="w-72 max-w-[85vw] h-full bg-[#080814] border-r border-emerald-500/30 p-4 flex flex-col justify-between overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="space-y-2">
                <div className="flex justify-between items-center px-2 pb-3 border-b border-gray-800">
                  <span className="text-xs uppercase tracking-wider text-emerald-400 font-bold">Academy Modules</span>
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
                            ? 'bg-emerald-600/30 border border-emerald-500 text-emerald-100'
                            : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="font-bold text-xs text-white">{item.label}</span>
                          {item.badge && (
                            <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-emerald-500 text-black">
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
            <div className="px-3 py-1.5 text-[11px] uppercase tracking-wider text-emerald-400 font-bold">
              Academy Modules
            </div>

            {sidebarModules.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex flex-col items-start px-3.5 py-2.5 rounded-xl text-left transition-all ${
                    isActive
                      ? 'bg-emerald-600/25 border border-emerald-500/80 text-emerald-100 shadow-[0_0_15px_rgba(16,185,129,0.25)]'
                      : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-bold text-xs text-white">{item.label}</span>
                    {item.badge && (
                      <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${
                        isActive ? 'bg-emerald-500 text-black' : 'bg-gray-800 text-emerald-300'
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
            <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-xs text-emerald-200">
              <span className="font-bold block mb-0.5">Board of Studies Aligned</span>
              <p className="text-[10px] text-gray-400 leading-tight">Curriculum proposals follow National Education Policy (NEP-2020).</p>
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
            
            {/* Action Alert Banner */}
            {actionAlert && (
              <div className="p-3.5 sm:p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-100 text-xs sm:text-sm font-medium animate-fade-in flex justify-between items-center shadow-md">
                <span>✅ {actionAlert}</span>
                <button onClick={() => setActionAlert(null)} className="text-xs opacity-70 hover:opacity-100 font-bold ml-2">✕</button>
              </div>
            )}

            {/* TAB 1: EXECUTIVE OVERVIEW */}
            {activeTab === 'Overview' && data && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white">Institutional Performance Dashboard</h2>
                  <p className="text-xs sm:text-sm text-gray-400 mt-1">Real-time indicators on student employability, industry partnerships, and active sponsorships.</p>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  {[
                    { label: 'Total Enrolled Students', value: data.studentStats.totalEnrolled, sub: 'Ayush UG & PG', color: 'from-emerald-400 to-teal-300' },
                    { label: 'Avg Skill Readiness Index', value: data.studentStats.avgSkillReadiness, sub: 'Above Cutoff (70%)', color: 'from-cyan-400 to-blue-400' },
                    { label: 'MoU Placements', value: data.studentStats.placedUnderMoU, sub: 'Dabur, Himalaya, Patanjali', color: 'from-purple-400 to-indigo-300' },
                    { label: 'Active R&D Grants', value: data.studentStats.activeResearchProjects, sub: 'Valued at ₹42.5L', color: 'from-amber-400 to-orange-400' }
                  ].map((s, i) => (
                    <div key={i} className="p-4 sm:p-5 rounded-2xl bg-gray-900/60 border border-emerald-500/20 backdrop-blur-md shadow-md">
                      <span className="text-xs font-semibold text-gray-400 block mb-1">{s.label}</span>
                      <div className={`text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r ${s.color}`}>
                        {s.value}
                      </div>
                      <span className="text-[11px] text-gray-400 mt-1 block">{s.sub}</span>
                    </div>
                  ))}
                </div>

                {/* Two Column Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  {/* AI Curriculum Modernization Alert */}
                  <div className="p-5 sm:p-6 rounded-2xl bg-gray-900/60 border border-emerald-500/25 backdrop-blur-md flex flex-col justify-between shadow-md">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                          <span>🧠</span> AI Curriculum Alignment
                        </h3>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                          Active Sync
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-4">
                        Scans live job postings from pharma recruiters and flags topics where college syllabi lag behind industry lab practices.
                      </p>
                      <div className="p-3.5 sm:p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-xs text-emerald-200 space-y-1">
                        <div className="font-bold text-emerald-300">Latest AI Recommendation:</div>
                        <p className="leading-relaxed">Incorporate <strong>Computational Phytochemistry</strong> into BAMS Paper III to satisfy 2026 Dabur R&D hiring criteria.</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveTab('Syllabus')}
                      className="mt-5 w-full py-2.5 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/40 text-emerald-200 font-bold text-xs transition shadow-sm"
                    >
                      Inspect All AI Syllabus Suggestions ➔
                    </button>
                  </div>

                  {/* Active MoUs Snapshot */}
                  <div className="p-5 sm:p-6 rounded-2xl bg-gray-900/60 border border-emerald-500/25 backdrop-blur-md flex flex-col justify-between shadow-md">
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-white mb-3 flex items-center gap-2">
                        <span>📜</span> Active Institutional MoUs
                      </h3>
                      <div className="space-y-2.5">
                        {data.mouPartnerships?.map((mou) => (
                          <div key={mou.id} className="p-3 rounded-xl bg-black/40 border border-gray-800 flex justify-between items-center text-xs">
                            <div>
                              <div className="font-bold text-white">{mou.partner}</div>
                              <div className="text-[11px] text-gray-400 mt-0.5">Valid until {mou.validUntil} • {mou.internshipsProvided} Interns</div>
                            </div>
                            <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-bold text-[10px] border border-emerald-500/40">
                              {mou.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveTab('MoU')}
                      className="mt-5 w-full py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 font-semibold text-xs transition border border-gray-700"
                    >
                      Manage Industry MoUs & Proposals ➔
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: AI SYLLABUS MODERNIZATION */}
            {activeTab === 'Syllabus' && data && (
              <div className="space-y-6 animate-fade-in">
                <div className="p-5 sm:p-6 rounded-2xl bg-emerald-950/30 border border-emerald-500/30">
                  <h2 className="text-xl sm:text-2xl font-black text-white">AI-Driven Syllabus Modernization Hub</h2>
                  <p className="text-xs sm:text-sm text-gray-300 mt-1">
                    Review and adopt real-time curriculum add-ons proposed by pharmaceutical industry councils and MoU partners under NEP-2020.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
                  {data.syllabusSuggestions?.map((item) => (
                    <div key={item.id} className="p-4 sm:p-5 rounded-2xl bg-gray-900/70 border border-emerald-500/25 backdrop-blur-md flex flex-col justify-between shadow-md">
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold uppercase">
                            {item.urgency}
                          </span>
                          <span className="text-xs text-gray-400">{item.creditsImpact}</span>
                        </div>
                        
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-gray-400 block mb-1 font-semibold">Current Syllabus:</span>
                          <div className="text-white font-medium text-xs bg-black/40 p-2.5 rounded-lg border border-gray-800">
                            {item.currentTopic}
                          </div>
                        </div>

                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-emerald-400 block mb-1 font-semibold">AI Industry Add-On:</span>
                          <div className="text-emerald-200 font-bold text-xs bg-emerald-950/40 p-2.5 rounded-lg border border-emerald-500/40">
                            {item.suggestedAddition}
                          </div>
                        </div>

                        <p className="text-[11px] text-gray-400 italic">
                          Source: {item.source}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-gray-800 flex gap-2">
                        <button
                          onClick={() => handleAction(`Adopted '${item.suggestedAddition}' into semester syllabus.`)}
                          className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-sm"
                        >
                          Adopt
                        </button>
                        <button
                          onClick={() => handleAction(`Sent '${item.suggestedAddition}' for Academic Board Peer Review.`)}
                          className="flex-1 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium text-xs transition border border-gray-700"
                        >
                          Review
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: STUDENT SKILL MATRIX */}
            {activeTab === 'Students' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-5 sm:p-6 rounded-2xl bg-gray-900/70 border border-gray-800">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-white">Student Skill Matrix & Readiness</h2>
                    <p className="text-xs text-gray-400 mt-0.5">Live tracking of verified laboratory proficiencies and test benchmarks.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-300">Dept:</span>
                    <select
                      value={deptFilter}
                      onChange={(e) => setDeptFilter(e.target.value)}
                      className="px-3 py-1.5 rounded-xl bg-gray-800 border border-gray-700 text-xs text-white focus:outline-none font-medium"
                    >
                      <option value="All">All Departments</option>
                      <option value="Pharmacognosy">Pharmacognosy</option>
                      <option value="Clinical Research">Clinical Research</option>
                      <option value="Health Informatics">Health Informatics</option>
                      <option value="Dravyaguna">Dravyaguna</option>
                    </select>
                  </div>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-gray-800 bg-gray-900/60 backdrop-blur-md shadow-md w-full">
                  <table className="w-full text-left text-xs min-w-[550px]">
                    <thead className="bg-gray-950/80 border-b border-gray-800 text-emerald-300 uppercase tracking-wider font-bold">
                      <tr>
                        <th className="p-3.5 sm:p-4">Candidate Name</th>
                        <th className="p-3.5 sm:p-4">Department</th>
                        <th className="p-3.5 sm:p-4">Verified Skills</th>
                        <th className="p-3.5 sm:p-4">Readiness</th>
                        <th className="p-3.5 sm:p-4">Status</th>
                        <th className="p-3.5 sm:p-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {filteredStudents.map((st, i) => (
                        <tr key={i} className="hover:bg-white/5 transition">
                          <td className="p-3.5 sm:p-4 font-bold text-white flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-emerald-600/30 text-emerald-300 flex items-center justify-center font-bold text-xs border border-emerald-500/30">
                              {st.name[0]}
                            </div>
                            <span className="text-xs sm:text-sm">{st.name}</span>
                          </td>
                          <td className="p-3.5 sm:p-4 text-gray-300">{st.dept}</td>
                          <td className="p-3.5 sm:p-4 text-emerald-400 font-semibold">{st.verifiedSkills} Skills</td>
                          <td className="p-3.5 sm:p-4">
                            <div className="flex items-center gap-2">
                              <div className="w-16 bg-gray-800 rounded-full h-1.5">
                                <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${st.score}%` }}></div>
                              </div>
                              <span className="font-bold text-white">{st.score}%</span>
                            </div>
                          </td>
                          <td className="p-3.5 sm:p-4">
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                              st.status.includes('Placed') ? 'bg-purple-500/20 text-purple-300 border-purple-500/40' :
                              st.status === 'Industry Ready' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' :
                              'bg-blue-500/20 text-blue-300 border-blue-500/40'
                            }`}>
                              {st.status}
                            </span>
                          </td>
                          <td className="p-3.5 sm:p-4 text-right">
                            <button
                              onClick={() => handleAction(`Endorsed digital credentials for ${st.name}.`)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-200 border border-emerald-500/40 font-semibold text-xs transition"
                            >
                              Verify
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 4: INDUSTRY MoUs */}
            {activeTab === 'MoU' && data && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-5 sm:p-6 rounded-2xl bg-gray-900/70 border border-gray-800">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-white">Industry MoUs & Bilateral Institutional Ties</h2>
                    <p className="text-xs text-gray-400 mt-0.5">Formal agreements ensuring reciprocal student internships and research licensing.</p>
                  </div>
                  <button
                    onClick={() => handleAction("Initiated New Institutional MoU Drafting Workflow.")}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-md"
                  >
                    + Draft New MoU
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
                  {data.mouPartnerships?.map((mou) => (
                    <div key={mou.id} className="p-4 sm:p-5 rounded-2xl bg-gray-900/70 border border-emerald-500/25 backdrop-blur-md space-y-3 shadow-md">
                      <div className="flex justify-between items-start">
                        <h3 className="text-base font-bold text-white">{mou.partner}</h3>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/40">
                          {mou.status}
                        </span>
                      </div>

                      <div className="space-y-1 text-xs text-gray-300">
                        <div><strong>Valid:</strong> to {mou.validUntil}</div>
                        <div><strong>Interns:</strong> {mou.internshipsProvided} Placed</div>
                        <div><strong>Sponsorship:</strong> {mou.curriculumSponsors}</div>
                      </div>

                      <div className="pt-2">
                        <button
                          onClick={() => handleAction(`Downloaded verified MoU dossier for ${mou.partner}.`)}
                          className="w-full py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-semibold border border-gray-700 transition"
                        >
                          Download MoU (PDF)
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: FACULTY DEVELOPMENT PROGRAMS */}
            {activeTab === 'FDP' && data && (
              <div className="space-y-6 animate-fade-in">
                <div className="p-5 sm:p-6 rounded-2xl bg-gray-900/70 border border-gray-800">
                  <h2 className="text-xl sm:text-2xl font-black text-white">Faculty Development Programs (FDP)</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Enable professors and academicians to undergo direct corporate lab training.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {data.fdpPrograms?.map((fdp) => (
                    <div key={fdp.id} className="p-5 sm:p-6 rounded-2xl bg-gray-900/70 border border-emerald-500/25 backdrop-blur-md flex flex-col justify-between space-y-3 shadow-md">
                      <div>
                        <div className="flex justify-between items-start mb-1.5">
                          <span className="text-xs text-emerald-400 font-bold">{fdp.organizer}</span>
                          <span className="px-2 py-0.5 rounded-full bg-gray-800 text-gray-300 text-[10px] border border-gray-700">{fdp.mode}</span>
                        </div>
                        <h3 className="text-base sm:text-lg font-bold text-white mb-2">{fdp.title}</h3>
                        <div className="space-y-1 text-xs text-gray-300">
                          <div><strong>Duration:</strong> {fdp.duration}</div>
                          <div><strong>Enrolled:</strong> {fdp.enrolled} / {fdp.seats} Seats</div>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-gray-800 flex items-center justify-between">
                        <span className="text-[11px] text-gray-400">Ayush Accredited</span>
                        <button
                          onClick={() => handleAction(`Nominated faculty cohort for '${fdp.title}'.`)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-sm"
                        >
                          Nominate Cohort
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 6: R&D CONSULTANCY GRANTS */}
            {activeTab === 'Consultancy' && data && (
              <div className="space-y-6 animate-fade-in">
                <div className="p-5 sm:p-6 rounded-2xl bg-gray-900/70 border border-gray-800">
                  <h2 className="text-xl sm:text-2xl font-black text-white">Corporate R&D Problems & Sponsored Grants</h2>
                  <p className="text-xs text-gray-400 mt-0.5">University departments can submit research proposals to solve live industrial formulations.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {data.consultancyGrants?.map((grant) => (
                    <div key={grant.id} className="p-5 sm:p-6 rounded-2xl bg-gray-900/70 border border-emerald-500/25 backdrop-blur-md flex flex-col justify-between space-y-3 shadow-md">
                      <div>
                        <div className="flex justify-between items-start mb-1.5">
                          <span className="text-xs text-purple-300 font-bold">{grant.industry}</span>
                          <span className="text-base sm:text-lg font-black text-emerald-400">{grant.grantAmount}</span>
                        </div>
                        <h3 className="text-sm sm:text-base font-bold text-white mb-2">{grant.title}</h3>
                        <div className="text-xs text-gray-300 space-y-1">
                          <div><strong>Target Dept:</strong> {grant.targetDept}</div>
                          <div><strong>Deadline:</strong> {grant.deadline}</div>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-gray-800 flex justify-between items-center">
                        <span className="text-[11px] text-amber-300 font-bold">{grant.status}</span>
                        <button
                          onClick={() => handleAction(`Submitted Faculty Grant Bid for ${grant.industry}.`)}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-sm"
                        >
                          Submit Bid ➔
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
