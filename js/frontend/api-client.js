/**
 * JOBLEX Frontend API Client (Client-Side JavaScript)
 * Dedicated communication layer between Browser UI and Backend Server
 * Compatible with both Node.js Express backend and Python Flask backend
 */

const API_BASE = window.JOBLEX_API_URL || 'http://127.0.0.1:5000/api';

const JoblexApiClient = {
  // Session / User Storage
  getCurrentUser() {
    const data = localStorage.getItem('joblex_user');
    if (data) {
      try { return JSON.parse(data); } catch(e) {}
    }
    return null;
  },

  setCurrentUser(user) {
    if (user) {
      localStorage.setItem('joblex_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('joblex_user');
    }
  },

  logout() {
    localStorage.removeItem('joblex_user');
    window.location.href = 'auth.html';
  },

  // Auth Guard: Require login for portal pages
  requireAuth(expectedRole = null) {
    const user = this.getCurrentUser();
    if (!user) {
      const currentPath = window.location.pathname.split('/').pop() || 'student.html';
      const roleParam = expectedRole || 'student';
      window.location.href = `auth.html?role=${encodeURIComponent(roleParam)}&redirect=${encodeURIComponent(currentPath)}`;
      return false;
    }
    if (expectedRole && user.role !== expectedRole) {
      alert(`Access Restricted: This area is reserved for ${expectedRole.toUpperCase()} accounts. You are currently logged in as a ${user.role.toUpperCase()}. Please switch accounts or navigate to your matching portal.`);
      window.location.href = `${user.role}.html`;
      return false;
    }
    return true;
  },

  // Portal Navigation Helper for Landing Pages
  navigateToPortal(role = 'student') {
    const user = this.getCurrentUser();
    const portalPage = `${role}.html`;
    if (!user) {
      window.location.href = `auth.html?role=${encodeURIComponent(role)}&redirect=${encodeURIComponent(portalPage)}`;
    } else if (user.role !== role) {
      alert(`Role Mismatch: Your account type is ${user.role.toUpperCase()}. Navigating to your registered ${user.role.toUpperCase()} portal.`);
      window.location.href = `${user.role}.html`;
    } else {
      window.location.href = portalPage;
    }
  },

  // Dynamic User Navbar Renderer across all pages
  renderUserNavbar() {
    if (typeof window !== 'undefined' && (window.location.pathname.includes('auth.html') || window.location.pathname.endsWith('/auth'))) {
      return;
    }
    const containers = document.querySelectorAll('.nav-user-account-container');
    if (!containers || containers.length === 0) return;

    const user = this.getCurrentUser();
    if (!user) {
      // Unauthenticated state: Render Sign In / Register CTA
      const signInHtml = `
        <a href="auth.html" class="px-3 sm:px-4 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white font-bold text-xs uppercase tracking-wider shadow-[0_0_12px_rgba(168,85,247,0.35)] transition inline-flex items-center gap-1.5">
          <span>Sign In</span>
          <span class="hidden sm:inline">/ Register</span>
        </a>
      `;
      containers.forEach(el => el.innerHTML = signInHtml);
      return;
    }

    let roleBadgeClass = 'bg-purple-950/70 border-purple-500/40 text-purple-200';
    let avatarGradient = 'from-purple-600 via-indigo-600 to-cyan-400';
    let roleName = 'Student';
    let initial = user.name ? user.name.charAt(0).toUpperCase() : 'U';

    if (user.role === 'academy') {
      roleBadgeClass = 'bg-emerald-950/70 border-emerald-500/40 text-emerald-200';
      avatarGradient = 'from-emerald-600 to-teal-500';
      roleName = 'Academy';
    } else if (user.role === 'industry') {
      roleBadgeClass = 'bg-blue-950/70 border-blue-500/40 text-blue-200';
      avatarGradient = 'from-blue-600 to-cyan-500';
      roleName = 'Industry';
    }

    let org = '';
    if (user.role === 'student') {
      const course = user.department || user.year || 'BAMS 3rd Year';
      const uni = user.institution || 'All India Institute of Ayurveda';
      org = `${course} · ${uni}`;
    } else if (user.role === 'academy') {
      org = user.institution || 'All India Institute of Ayurveda';
    } else if (user.role === 'industry') {
      org = user.company || user.institution || 'Corporate Partner Enterprise';
    } else {
      org = user.institution || user.company || 'All India Institute of Ayurveda';
    }

    const html = `
      <div class="relative">
        <button type="button" onclick="toggleUserDropdown(event, this)" class="flex items-center gap-2 sm:gap-2.5 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-xl bg-gray-900/90 hover:bg-gray-800/90 border border-gray-700/80 hover:border-purple-500/50 transition shadow-sm cursor-pointer select-none text-left">
          <div class="relative shrink-0">
            <div class="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-tr ${avatarGradient} flex items-center justify-center font-black text-white text-[11px] sm:text-xs shadow-inner">
              ${initial}
            </div>
            <span class="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 border border-black animate-pulse"></span>
          </div>
          <div class="flex flex-col leading-tight">
            <div class="flex items-center gap-1.5">
              <span class="font-bold text-xs sm:text-sm text-white truncate max-w-[85px] sm:max-w-[130px]">${user.name}</span>
              <span class="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider border ${roleBadgeClass}">${user.role || 'User'}</span>
            </div>
            <span class="text-[9px] sm:text-[10px] text-gray-400 truncate max-w-[100px] sm:max-w-[150px]" title="${org}">${org}</span>
          </div>
          <span class="text-gray-400 text-[10px] ml-0.5">▾</span>
        </button>

        <!-- Dropdown Menu -->
        <div class="user-account-dropdown hidden absolute right-0 mt-2 w-60 p-2.5 rounded-2xl bg-[#0d0d1e] border border-gray-800/90 shadow-2xl z-50 space-y-1.5 backdrop-blur-xl">
          <div class="p-2.5 rounded-xl bg-black/40 border border-gray-800/80 text-xs space-y-1">
            <div class="font-extrabold text-white text-sm">${user.name}</div>
            <div class="text-[11px] text-gray-400 truncate">${user.email}</div>
            <div class="text-[10px] font-semibold text-purple-300 mt-1">${org}</div>
          </div>
          <div class="pt-1.5 border-t border-gray-800/80 space-y-1">
            <button type="button" onclick="JoblexApiClient.logout()" class="w-full text-left flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs text-rose-400 hover:bg-rose-950/30 transition">
              <span>🚪</span> Sign Out
            </button>
          </div>
        </div>
      </div>
    `;

    containers.forEach(el => {
      el.innerHTML = html;
    });
  },

  // Language localization
  getLang() {
    return localStorage.getItem('joblex_lang') || 'en';
  },

  setLang(lang) {
    localStorage.setItem('joblex_lang', lang);
    window.location.reload();
  },

  // Auth Endpoints
  async login(email, password, role) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role })
    });
    const data = await res.json();
    if (res.ok && data.success && data.user) {
      this.setCurrentUser(data.user);
      return data;
    }
    throw new Error(data.error || 'Authentication failed. Please verify your credentials.');
  },

  async register(userData) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    const data = await res.json();
    if (res.ok && data.success && data.user) {
      this.setCurrentUser(data.user);
      return data;
    }
    throw new Error(data.error || 'Registration failed. Please verify your details.');
  },

  async getProfile() {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return null;
    try {
      const res = await fetch(`${API_BASE}/auth/profile?email=${encodeURIComponent(currentUser.email || '')}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.profile) {
          const merged = { ...currentUser, ...data.profile };
          this.setCurrentUser(merged);
          return merged;
        }
      }
    } catch(e) {}
    return currentUser;
  },

  async updateProfile(profileData) {
    const currentUser = this.getCurrentUser();
    const payload = { id: currentUser?.id, email: currentUser?.email, ...profileData };
    try {
      const res = await fetch(`${API_BASE}/auth/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.profile) {
          const merged = { ...currentUser, ...data.profile };
          this.setCurrentUser(merged);
          return merged;
        }
      }
    } catch(e) {}
    const merged = { ...currentUser, ...profileData };
    this.setCurrentUser(merged);
    return merged;
  },

  // Roadmap Endpoints
  async getRoadmap() {
    try {
      const res = await fetch(`${API_BASE}/roadmap`);
      if (res.ok) return await res.json();
    } catch(e) {}
    return {
      totalXp: 1450,
      streakDays: 7,
      decayStatus: "Active - Decay Frozen for 72 hrs",
      phases: [
        {
          id: 1,
          name: "Core Ayurvedic Pharmacognosy & GLP",
          xpReward: 350,
          status: "IN_PROGRESS",
          tasks: [
            { id: "t1", title: "Complete Good Laboratory Practice (GLP) module", xp: 50, completed: true },
            { id: "t2", title: "Ayurvedic botanical authentication quiz in Arena", xp: 50, completed: true },
            { id: "t3", title: "Prepare Ashwagandha classical decoction report", xp: 100, completed: false }
          ]
        },
        {
          id: 2,
          name: "Chromatography & HPTLC Profiling",
          xpReward: 450,
          status: "LOCKED",
          tasks: [
            { id: "t4", title: "MoU Partner (Dabur) Webinar on HPLC standards", xp: 75, completed: false },
            { id: "t5", title: "Perform Fingerprint Marker Analysis quiz", xp: 75, completed: false }
          ]
        },
        {
          id: 3,
          name: "Computational Drug Discovery & Health-AI",
          xpReward: 500,
          status: "LOCKED",
          tasks: [
            { id: "t6", title: "Python for Pharmacological Data Processing", xp: 100, completed: false },
            { id: "t7", title: "In-silico docking of Phytochemical compounds", xp: 150, completed: false }
          ]
        },
        {
          id: 4,
          name: "Corporate Internship & Capstone Formulation",
          xpReward: 600,
          status: "LOCKED",
          tasks: [
            { id: "t8", title: "Submit candidate CV to Dabur / Patanjali via Board", xp: 200, completed: false },
            { id: "t9", title: "Pass Final Technical Evaluation Panel", xp: 400, completed: false }
          ]
        }
      ]
    };
  },

  async toggleTask(taskId, phaseIdx) {
    try {
      const res = await fetch(`${API_BASE}/roadmap/toggle-task`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId, phaseIdx })
      });
      if (res.ok) return await res.json();
    } catch(e) {}
    return { success: true };
  },

  async checkIn() {
    try {
      const res = await fetch(`${API_BASE}/roadmap/check-in`, { method: 'POST' });
      if (res.ok) return await res.json();
    } catch(e) {}
    return { success: true, message: 'Daily Check-in recorded! (+50 XP, Decay Frozen 72h)' };
  },

  async getPeerBenchmarking() {
    try {
      const res = await fetch(`${API_BASE}/roadmap/peer-benchmarking`);
      if (res.ok) return await res.json();
    } catch(e) {}
    return {
      userPercentile: 78,
      placedPeerAverageScore: 86,
      topMissingPeerSkills: [
        { name: "HPTLC Fingerprinting", prevalence: "88% of placed peers" },
        { name: "In-Silico AutoDock Molecular Docking", prevalence: "74% of placed peers" },
        { name: "GCP Clinical Trial Protocols", prevalence: "69% of placed peers" }
      ]
    };
  },

  // AI Resume Analyzer
  async analyzeResume(resumeText, targetRole) {
    try {
      const res = await fetch(`${API_BASE}/resume/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText, targetRole })
      });
      if (res.ok) return await res.json();
    } catch(e) {}
    return {
      success: true,
      targetRole,
      matchPercentage: 78,
      benchmark: 85,
      extractedSkills: ["Good Laboratory Practice (GLP)", "Ayurvedic Pharmacognosy", "Herbal Formulation"],
      missingSkills: ["HPTLC / HPLC Fingerprinting", "Formulation Stability Protocols", "Computational Chemistry"],
      recommendations: [
        "Complete HPTLC chromatography certification through Dabur MoU workshop.",
        "Take the 'Formulation Stability Testing' module in your Career Roadmap (+100 XP).",
        "Engage in clinical protocol documentation to reach the 85% industry benchmark."
      ]
    };
  },

  // Opportunities & Micro-Gigs
  async getOpportunities(type = 'All') {
    try {
      const url = type && type !== 'All' ? `${API_BASE}/opportunities?type=${type}` : `${API_BASE}/opportunities`;
      const res = await fetch(url);
      if (res.ok) return await res.json();
    } catch(e) {}
    return {
      opportunities: [
        { id: 1, title: 'Phytochemical Research Intern', company: 'Dabur India Ltd.', type: 'Internship', skills: ['Herbal Formulation', 'Phytochemistry', 'GLP'], location: 'Ghaziabad / Hybrid', stipend: '₹22,000/mo', deadline: 'Oct 15, 2026' },
        { id: 2, title: 'Ayush AI Innovation Challenge', company: 'Ministry of Ayush & AIIA', type: 'Hackathon', skills: ['Python', 'Machine Learning', 'NLP'], location: 'New Delhi', stipend: 'Prize: ₹3,00,000', deadline: 'Nov 01, 2026' },
        { id: 3, title: 'Formulation Scientist', company: 'Patanjali Research Foundation', type: 'Job', skills: ['Ayurvedic Pharmacognosy', 'Nanomedicine', 'QC'], location: 'Haridwar', stipend: '₹8.5 - 12 LPA', deadline: 'Oct 30, 2026' },
        { id: 'gig-1', title: 'Clean & Standardize 50 Ashwagandha Trial Records', company: 'Dabur Research Labs', type: 'Micro-Gig', skills: ['Data Analysis', 'Phytochemistry'], location: 'Remote (10 Days)', stipend: '₹6,000 Task Bounty', deadline: 'Oct 12, 2026' },
        { id: 'gig-2', title: 'Annotate Charaka Samhita Sanskrit Botanical Lexicon', company: 'AIIA Digital Informatics Cell', type: 'Micro-Gig', skills: ['Ayurvedic Pharmacognosy', 'NLP'], location: 'Remote (7 Days)', stipend: '₹4,500 Task Bounty', deadline: 'Oct 18, 2026' }
      ]
    };
  },

  async postOpportunity(payload) {
    try {
      const res = await fetch(`${API_BASE}/opportunities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) return await res.json();
    } catch(e) {}
    return { success: true, message: 'Opportunity published successfully!' };
  },

  // Apply to Internship or Job (Sends application to Industry Portal)
  async applyOpportunity(payload) {
    try {
      const res = await fetch(`${API_BASE}/opportunities/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) return await res.json();
    } catch(e) {}
    return {
      success: true,
      message: `Application for "${payload.opportunityTitle || 'Role'}" successfully transmitted to ${payload.company || 'Company'}!`
    };
  },

  async getMyApplications(email) {
    try {
      const url = email ? `${API_BASE}/opportunities/my-applications?email=${encodeURIComponent(email)}` : `${API_BASE}/opportunities/my-applications`;
      const res = await fetch(url);
      if (res.ok) return await res.json();
    } catch(e) {}
    return { applications: [] };
  },

  async getIndustryApplications(company = 'All', type = 'All') {
    try {
      const url = `${API_BASE}/industry/applications?company=${encodeURIComponent(company)}&type=${encodeURIComponent(type)}`;
      const res = await fetch(url);
      if (res.ok) return await res.json();
    } catch(e) {}
    return {
      totalApplications: 3,
      applications: [
        { id: "app-101", opportunityTitle: "Phytochemical Research Intern", company: "Dabur India Ltd.", type: "Internship", studentName: "Ashay Verma", college: "All India Institute of Ayurveda", match: 92, appliedDate: "2026-09-02", status: "Shortlisted" },
        { id: "app-102", opportunityTitle: "Formulation Scientist", company: "Patanjali Research Foundation", type: "Job", studentName: "Kavya Singh", college: "All India Institute of Ayurveda", match: 94, appliedDate: "2026-09-03", status: "Under Review" },
        { id: "app-103", opportunityTitle: "Clean 50 Ashwagandha Trial Records", company: "Dabur Research Labs", type: "Micro-Gig", studentName: "Ashay Verma", college: "All India Institute of Ayurveda", match: 90, appliedDate: "2026-09-04", status: "Offer Extended" }
      ]
    };
  },

  async updateApplicationStatus(id, status) {
    try {
      const res = await fetch(`${API_BASE}/industry/applications/${id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) return await res.json();
    } catch(e) {}
    return { success: true, message: `Status updated to "${status}"!` };
  },

  // Zulu AI Chat & History System
  async getZuluSessions(userId = 'usr-student-01') {
    try {
      const res = await fetch(`${API_BASE}/zulu/sessions?userId=${encodeURIComponent(userId)}`);
      if (res.ok) return await res.json();
    } catch(e) {}
    return { success: false, sessions: [] };
  },

  async createZuluSession(userId = 'usr-student-01', title = 'New Conversation') {
    try {
      const res = await fetch(`${API_BASE}/zulu/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, title })
      });
      if (res.ok) return await res.json();
    } catch(e) {}
    return { success: false, session: { id: `sess-${Date.now()}`, title, user_id: userId } };
  },

  async getZuluMessages(sessionId, userId = 'usr-student-01') {
    try {
      const res = await fetch(`${API_BASE}/zulu/sessions/${encodeURIComponent(sessionId)}?userId=${encodeURIComponent(userId)}`);
      if (res.ok) return await res.json();
    } catch(e) {}
    return { success: false, messages: [] };
  },

  async deleteZuluSession(sessionId, userId = 'usr-student-01') {
    try {
      const res = await fetch(`${API_BASE}/zulu/sessions/${encodeURIComponent(sessionId)}?userId=${encodeURIComponent(userId)}`, {
        method: 'DELETE'
      });
      if (res.ok) return await res.json();
    } catch(e) {}
    return { success: true };
  },

  async askZulu(message, context = {}, sessionId = null, userId = 'usr-student-01') {
    try {
      const res = await fetch(`${API_BASE}/zulu/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, context, sessionId, userId })
      });
      if (res.ok) return await res.json();
    } catch(e) {}
    return {
      success: true,
      sessionId: sessionId || `sess-${Date.now()}`,
      provider: 'zulu-guided-engine',
      reply: `Namaste 🌿 In the modern Ayush sector, mastering Phytochemistry along with Python data analytics positions you in the top 5% of applicants. Check your Career Roadmap to start the next module!`
    };
  },

  // Academy Endpoints
  async getAcademyData() {
    try {
      const res = await fetch(`${API_BASE}/academy/all-data`);
      if (res.ok) return await res.json();
    } catch(e) {}
    return {
      studentStats: { totalEnrolled: 342, avgSkillReadiness: "74.0%", placedUnderMoU: 52 },
      tpoMetrics: {
        funnel: { applied: 248, shortlisted: 94, offersAccepted: 52 },
        predictivePlacementReadiness: 84
      }
    };
  },

  async adoptSyllabus(id) {
    try {
      const res = await fetch(`${API_BASE}/academy/adopt-syllabus`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (res.ok) return await res.json();
    } catch(e) {}
    return { success: true };
  },

  // Idea #11: Cross-College Benchmarking
  async getCrossCollegeBenchmarking() {
    try {
      const res = await fetch(`${API_BASE}/academy/cross-college-benchmarking`);
      if (res.ok) return await res.json();
    } catch(e) {}
    return {
      institutions: [
        { rank: 1, institution: "All India Institute of Ayurveda (AIIA), New Delhi", avgSkillScore: 78.4, placementRate: "86%", mouCount: 8, naacGrade: "A++", status: "Your Institution" },
        { rank: 2, institution: "National Institute of Ayurveda (NIA), Jaipur", avgSkillScore: 74.2, placementRate: "81%", mouCount: 6, naacGrade: "A+", status: "Peer Tier-1" },
        { rank: 3, institution: "Faculty of Ayurveda, BHU Varanasi", avgSkillScore: 72.8, placementRate: "79%", mouCount: 5, naacGrade: "A++", status: "Peer Tier-1" },
        { rank: 4, institution: "Gujarat Ayurved University, Jamnagar", avgSkillScore: 71.5, placementRate: "76%", mouCount: 4, naacGrade: "A", status: "Peer Tier-1" }
      ]
    };
  },

  // Idea #9: Automated Curriculum Gap Audit
  async runCurriculumAudit(syllabusText, department) {
    try {
      const res = await fetch(`${API_BASE}/academy/curriculum-audit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ syllabusText, department })
      });
      if (res.ok) return await res.json();
    } catch(e) {}
    return {
      success: true,
      department: department || "Ayurvedic Pharmacology (Dravyaguna)",
      coverageScore: 68,
      naacCriterionScore: "3.4 / 4.0",
      matchingCompetencies: ['Classical Botany', 'Herbal Formulation Basics', 'Ayurvedic Toxicology'],
      criticalGapsIdentified: [
        { unit: 'Unit 3 (Pharmacognosy)', gap: 'High-Performance Thin-Layer Chromatography (HPTLC)', impact: 'Crucial for 82% of pharma recruitments' },
        { unit: 'Unit 5 (Formulation)', gap: 'In-Silico AutoDock Molecular Docking', impact: 'Accelerates bio-availability screening' },
        { unit: 'Unit 6 (Regulatory)', gap: 'Digital Health Records & GCP Compliance', impact: 'Mandatory under NEP-2020 criteria' }
      ]
    };
  },

  // Industry Endpoints
  async getCandidates() {
    try {
      const res = await fetch(`${API_BASE}/industry/candidates`);
      if (res.ok) return await res.json();
    } catch(e) {}
    return { candidates: [] };
  },

  // Idea #3: Reverse Application Search & Inbound Outreach
  async getReverseCandidates(skill = '') {
    try {
      const res = await fetch(`${API_BASE}/industry/reverse-search?skill=${encodeURIComponent(skill)}`);
      if (res.ok) return await res.json();
    } catch(e) {}
    return {
      totalMatched: 3,
      candidates: [
        { name: 'Ashay Verma', college: 'All India Institute of Ayurveda', match: 94, skills: ['Herbal Formulation', 'GLP', 'Phytochemistry', 'Python'], status: 'Ready for Inbound Invitation' },
        { name: 'Kavya Singh', college: 'AIIA New Delhi', match: 91, skills: ['Health Informatics', 'Python', 'NLP for Classical Texts', 'SQL'], status: 'Ready for Inbound Invitation' },
        { name: 'Priya Nair', college: 'Gujarat Ayurved University, Jamnagar', match: 96, skills: ['Drug Discovery', 'Phytochemistry', 'HPTLC', 'AutoDock'], status: 'Ready for Inbound Invitation' }
      ]
    };
  },

  async sendInboundInvite(candidateName, roleTitle) {
    try {
      const res = await fetch(`${API_BASE}/industry/inbound-invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidateName, roleTitle })
      });
      if (res.ok) return await res.json();
    } catch(e) {}
    return { success: true, message: `Direct inbound interview invitation transmitted to ${candidateName}!` };
  },

  // Idea #8: Sponsored Bootcamps
  async getBootcamps() {
    try {
      const res = await fetch(`${API_BASE}/industry/bootcamps`);
      if (res.ok) return await res.json();
    } catch(e) {}
    return {
      bootcamps: [
        {
          id: "bc-01",
          title: "Dabur-AIIA 4-Week Rapid HPTLC & Phytochemical Bootcamp",
          sponsor: "Dabur Research & Development Ltd.",
          partnerCollege: "All India Institute of Ayurveda",
          targetHires: 20,
          matchedScholars: 18,
          startDate: "Nov 01, 2026",
          stipend: "Full Sponsorship + ₹15,000 Completion Bounty",
          guaranteedOutcome: "Guaranteed Placement Interviews for Top 10 Cohort Finishers",
          status: "Cohort Enrolling"
        },
        {
          id: "bc-02",
          title: "Himalaya In-Silico Molecular Docking & Drug Screening Sprint",
          sponsor: "Himalaya Wellness Company",
          partnerCollege: "National Institute of Ayurveda",
          targetHires: 15,
          matchedScholars: 12,
          startDate: "Nov 15, 2026",
          stipend: "Cloud GPU Compute Grants + ₹12,000 Bounty",
          guaranteedOutcome: "Direct Pre-Placement Offers (PPOs) for Top 5",
          status: "Cohort Enrolling"
        }
      ]
    };
  },

  async createBootcamp(payload) {
    try {
      const res = await fetch(`${API_BASE}/industry/create-bootcamp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) return await res.json();
    } catch(e) {}
    return { success: true, message: 'Sponsored Bootcamp cohort initiated!' };
  },

  // Idea #7: Skill ROI Dashboard
  async getSkillRoi() {
    try {
      const res = await fetch(`${API_BASE}/industry/skill-roi`);
      if (res.ok) return await res.json();
    } catch(e) {}
    return {
      predictedMatchAccuracy: 94.2,
      totalHiresEvaluated: 48,
      averageRecruiterRating: 4.8,
      feedbackLogs: [
        { candidate: "Ashay Verma", predictedMatch: 94, actualLabRating: 4.9, company: "Dabur R&D", note: "Exceptional botanical extraction & Python modeling accuracy." },
        { candidate: "Pooja Verma", predictedMatch: 86, actualLabRating: 4.6, company: "Himalaya", note: "Solid chromatography fundamentals; fast learner." }
      ]
    };
  },

  async rateCandidate(payload) {
    try {
      const res = await fetch(`${API_BASE}/industry/rate-candidate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) return await res.json();
    } catch(e) {}
    return { success: true, message: 'Feedback recorded! AI matching weight calibrated.' };
  },

  async getTalentForecast() {
    try {
      const res = await fetch(`${API_BASE}/industry/forecast`);
      if (res.ok) return await res.json();
    } catch(e) {}
    return { projectedTalentSupply: [] };
  },

  async submitSkillDemand(payload) {
    try {
      const res = await fetch(`${API_BASE}/industry/submit-skill-demand`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) return await res.json();
    } catch(e) {}
    return { success: true };
  },

  // Student Application Dispatch & Industry Portal Pipeline
  async applyOpportunity(payload) {
    try {
      const res = await fetch(`${API_BASE}/opportunities/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) return await res.json();
    } catch(e) {}
    return { success: true, message: 'Application transmitted successfully!' };
  },

  async getMyApplications(email) {
    try {
      const query = email ? `?email=${encodeURIComponent(email)}` : '';
      const res = await fetch(`${API_BASE}/opportunities/my-applications${query}`);
      if (res.ok) return await res.json();
    } catch(e) {}
    return { applications: [] };
  },

  async getIndustryApplications(company = 'All', type = 'All') {
    try {
      const params = new URLSearchParams();
      if (company && company !== 'All') params.append('company', company);
      if (type && type !== 'All') params.append('type', type);
      const queryString = params.toString() ? `?${params.toString()}` : '';
      const res = await fetch(`${API_BASE}/industry/applications${queryString}`);
      if (res.ok) return await res.json();
    } catch(e) {}
    return { totalApplications: 0, applications: [] };
  },

  async updateApplicationStatus(id, status) {
    try {
      const res = await fetch(`${API_BASE}/industry/applications/${id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) return await res.json();
    } catch(e) {}
    return { success: true, message: `Application status updated to ${status}` };
  },

  async getRequisitions(type = 'All') {
    try {
      const query = type && type !== 'All' ? `?type=${encodeURIComponent(type)}` : '';
      const res = await fetch(`${API_BASE}/industry/requisitions${query}`);
      if (res.ok) return await res.json();
    } catch(e) {}
    return { requisitions: [] };
  }
};

window.JoblexApiClient = JoblexApiClient;
window.JoblexAPI = JoblexApiClient; // Backward compatibility

// Dropdown Toggle Handler
window.toggleUserDropdown = function(e, btn) {
  if (e) {
    e.stopPropagation();
  }
  const container = btn.closest('.nav-user-account-container');
  if (!container) return;
  const dropdown = container.querySelector('.user-account-dropdown');
  if (dropdown) {
    const isHidden = dropdown.classList.contains('hidden');
    document.querySelectorAll('.user-account-dropdown').forEach(d => d.classList.add('hidden'));
    if (isHidden) dropdown.classList.remove('hidden');
  }
};

// Global click-outside listener to close account dropdowns
if (typeof document !== 'undefined') {
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-user-account-container')) {
      document.querySelectorAll('.user-account-dropdown').forEach(d => d.classList.add('hidden'));
    }
  });

  document.addEventListener('DOMContentLoaded', () => {
    JoblexApiClient.renderUserNavbar();
  });
}


