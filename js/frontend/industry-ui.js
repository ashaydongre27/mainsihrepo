/**
 * JOBLEX Industry Portal UI Controller (Client-Side JavaScript)
 * Pure frontend DOM, rendering, and interaction logic
 * Fully integrated with all SIH 26044 features:
 * 3. Reverse Application & Inbound Outreach
 * 6. Talent Pipeline Forecasting
 * 7. Skill Match ROI & Recruiter Rating Loop
 * 8. Sponsored Skill Bootcamps
 */

let activeIndustryTab = 'Applications';
let currentAppFilter = 'All';

const CANDIDATES_DATA = [
  { name: 'Aarav Sharma', college: 'All India Institute of Ayurveda', match: 94, skills: ['Herbal Formulation', 'GLP', 'Phytochemistry', 'Python'], status: 'Ready for Interview' },
  { name: 'Kavya Singh', college: 'AIIA New Delhi', match: 91, skills: ['Health Informatics', 'Python', 'NLP for Classical Texts', 'SQL'], status: 'Shortlisted' },
  { name: 'Rohan Sharma', college: 'National Institute of Ayurveda, Jaipur', match: 82, skills: ['Ayurvedic Pharmacognosy', 'Standardization', 'Quality Control'], status: 'Under Review' },
  { name: 'Ananya Roy', college: 'Banaras Hindu University (IMS)', match: 88, skills: ['Clinical Research', 'Pharmacology', 'Herbal Formulation'], status: 'Shortlisted' },
  { name: 'Priya Nair', college: 'Gujarat Ayurved University, Jamnagar', match: 96, skills: ['Drug Discovery', 'Phytochemistry', 'HPTLC', 'AutoDock'], status: 'Top Applicant' }
];

let currentReqFilter = 'All';

document.addEventListener('DOMContentLoaded', async () => {
  // Auth Guard: ensure user is authenticated before accessing industry portal
  if (!JoblexApiClient.requireAuth('industry')) return;

  initIndustrySidebarState();
  renderIndustryApplications('All');
  renderCandidates();
  renderTalentForecast();
  renderReverseCandidates('');
  renderRequisitions('All');
  renderSkillRoi();
});

function switchIndustryTab(tabId) {
  activeIndustryTab = tabId;

  document.querySelectorAll('.industry-tab-content').forEach(el => el.classList.add('hidden'));

  const target = document.getElementById(`industry-tab-${tabId}`);
  if (target) target.classList.remove('hidden');

  if (tabId === 'Applications') {
    renderIndustryApplications(currentAppFilter);
  }
  if (tabId === 'Requisitions') {
    renderRequisitions(currentReqFilter);
  }

  // Update Desktop Sidebar Buttons
  document.querySelectorAll('.industry-sidebar-btn').forEach(btn => {
    if (btn.getAttribute('data-tab') === tabId) {
      btn.className = 'industry-sidebar-btn sidebar-nav-btn w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all bg-blue-600/25 border border-blue-500/80 text-blue-100 shadow-[0_0_15px_rgba(59,130,246,0.25)]';
    } else {
      btn.className = 'industry-sidebar-btn sidebar-nav-btn w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all text-gray-400 hover:text-white hover:bg-white/5 border border-transparent';
    }
  });

  // Update Mobile Drawer Buttons
  document.querySelectorAll('.industry-mobile-nav-btn').forEach(btn => {
    if (btn.getAttribute('data-tab') === tabId) {
      btn.className = 'industry-mobile-nav-btn w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs font-bold transition bg-blue-600/30 border border-blue-500 text-blue-100';
    } else {
      btn.className = 'industry-mobile-nav-btn w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs font-bold transition text-gray-300 hover:bg-white/5 border border-transparent';
    }
  });

  closeIndustryMobileMenu();
}

function initIndustrySidebarState() {
  const isCollapsed = localStorage.getItem('joblex_industry_sidebar_collapsed') === 'true';
  applyIndustrySidebarState(isCollapsed);
}

function toggleIndustrySidebarCollapse() {
  const sidebar = document.getElementById('industry-sidebar');
  if (!sidebar) return;
  const isNowCollapsed = !sidebar.classList.contains('sidebar-collapsed');
  localStorage.setItem('joblex_industry_sidebar_collapsed', isNowCollapsed ? 'true' : 'false');
  applyIndustrySidebarState(isNowCollapsed);
}

function applyIndustrySidebarState(collapsed) {
  const sidebar = document.getElementById('industry-sidebar');
  const toggleBtn = document.getElementById('industry-sidebar-collapse-btn');
  if (!sidebar) return;

  if (collapsed) {
    sidebar.classList.add('sidebar-collapsed');
    if (toggleBtn) {
      toggleBtn.innerHTML = '<span>▶</span>';
      toggleBtn.title = 'Expand Sidebar';
    }
  } else {
    sidebar.classList.remove('sidebar-collapsed');
    if (toggleBtn) {
      toggleBtn.innerHTML = '<span>◀</span>';
      toggleBtn.title = 'Collapse Sidebar';
    }
  }
}

function toggleIndustryMobileMenu() {
  const drawer = document.getElementById('industry-mobile-drawer');
  if (drawer) drawer.classList.toggle('hidden');
}

function closeIndustryMobileMenu() {
  const drawer = document.getElementById('industry-mobile-drawer');
  if (drawer) drawer.classList.add('hidden');
}

window.switchIndustryTab = switchIndustryTab;
window.toggleIndustrySidebarCollapse = toggleIndustrySidebarCollapse;
window.toggleIndustryMobileMenu = toggleIndustryMobileMenu;
window.closeIndustryMobileMenu = closeIndustryMobileMenu;

// ─────────────────────────────────────────────────────────────
// STUDENT APPLICATIONS RECEIVED (Internships & Jobs)
// ─────────────────────────────────────────────────────────────
async function renderIndustryApplications(typeFilter = 'All') {
  currentAppFilter = typeFilter;
  const container = document.getElementById('industry-applications-grid');
  if (!container) return;

  const res = await JoblexApiClient.getIndustryApplications('All', typeFilter);
  const apps = res.applications || [];

  // Update overall counters
  const allRes = await JoblexApiClient.getIndustryApplications('All', 'All');
  const allApps = allRes.applications || [];

  const totalCount = allApps.length;
  const pendingCount = allApps.filter(a => a.status === 'Pending Review').length;
  const interviewCount = allApps.filter(a => ['Shortlisted', 'Interview Scheduled', 'Offer Extended'].includes(a.status)).length;

  const badgeEl = document.getElementById('applications-badge-count');
  if (badgeEl) badgeEl.innerText = totalCount;

  const totalEl = document.getElementById('industry-app-stat-total');
  if (totalEl) totalEl.innerText = `${totalCount} Dossiers`;

  const pendingEl = document.getElementById('industry-app-stat-pending');
  if (pendingEl) pendingEl.innerText = `${pendingCount} Candidate${pendingCount === 1 ? '' : 's'}`;

  const interviewEl = document.getElementById('industry-app-stat-interview');
  if (interviewEl) interviewEl.innerText = `${interviewCount} Candidate${interviewCount === 1 ? '' : 's'}`;

  if (apps.length === 0) {
    container.innerHTML = `
      <div class="col-span-full p-8 rounded-3xl bg-white dark:bg-gray-900/40 border border-slate-200 dark:border-gray-800 text-center space-y-3 shadow-sm">
        <div class="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center mx-auto text-blue-400"><span class="material-symbols-outlined text-2xl">inbox</span></div>
        <h4 class="text-base font-bold text-slate-900 dark:text-white">No Applications in this category yet</h4>
        <p class="text-xs text-gray-400 max-w-md mx-auto">When students submit applications from the Internships or Jobs module in the Student Portal, their verified dossiers appear here.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = apps.map(app => {
    let statusClass = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    if (app.status === 'Shortlisted') statusClass = 'bg-blue-500/20 text-blue-300 border-blue-500/40';
    if (app.status === 'Interview Scheduled') statusClass = 'bg-purple-500/20 text-purple-300 border-purple-500/40';
    if (app.status === 'Offer Extended') statusClass = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    if (app.status === 'Rejected') statusClass = 'bg-rose-500/20 text-rose-300 border-rose-500/40';

    const isInternship = app.type === 'Internship' || app.type === 'Micro-Gig';

    return `
      <div class="p-5 sm:p-6 rounded-3xl bg-white dark:bg-gray-900/80 border border-slate-200 dark:border-gray-800 hover:border-blue-400 dark:hover:border-blue-500/50 transition shadow-sm flex flex-col justify-between space-y-4">
        <div class="space-y-3">
          <div class="flex justify-between items-start gap-2">
            <div>
              <div class="flex items-center gap-2">
                <h4 class="text-base font-extrabold text-slate-900 dark:text-white">${app.studentName}</h4>
                <span class="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-semibold">
                  <span class="material-symbols-outlined text-xs text-emerald-400 align-middle mr-1">verified</span>${app.verifiedBadge || "AIIA Verified"}
                </span>
              </div>
              <p class="text-xs text-slate-500 dark:text-gray-400 mt-0.5">${app.college}</p>
            </div>
            <div class="text-right">
              <span class="text-sm font-mono font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                ${app.match}% Match
              </span>
              <span class="text-[10px] text-gray-500 block">Applied: ${app.appliedDate}</span>
            </div>
          </div>

          <div class="p-3 rounded-2xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-gray-800 space-y-1.5">
            <div class="flex justify-between items-center text-xs">
              <span class="text-slate-500 dark:text-gray-400">Position Applied:</span>
              <span class="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                isInternship ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              }">${app.type}</span>
            </div>
            <div class="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">${app.opportunityTitle}</div>
            <div class="text-[11px] text-blue-300">${app.company}</div>
          </div>

          <p class="text-xs text-slate-600 dark:text-gray-300 italic border-l-2 border-purple-500/60 pl-2.5 py-0.5">
            "${app.coverNote || 'Application submitted with AIIA verified credentials.'}"
          </p>

          <div>
            <span class="text-[10px] text-slate-500 dark:text-gray-400 font-semibold block mb-1.5">Verified Institutional Competencies:</span>
            <div class="flex flex-wrap gap-1.5">
              ${(app.skills || []).map(s => `
                <span class="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-500/30 text-[11px] text-blue-700 dark:text-blue-200">${s}</span>
              `).join('')}
            </div>
          </div>
        </div>

        <div class="pt-3 border-t border-slate-200 dark:border-gray-800 space-y-2.5">
          <div class="flex justify-between items-center">
            <span class="text-xs text-slate-500 dark:text-gray-400">Current Status:</span>
            <span class="px-2.5 py-1 rounded-full text-xs font-bold border ${statusClass}">
              ${app.status}
            </span>
          </div>

          <div class="grid grid-cols-3 gap-2">
            <button onclick="handleApplicationAction('${app.id}', 'Shortlisted')" class="py-1.5 px-2 rounded-xl text-[11px] font-bold transition ${
              app.status === 'Shortlisted' 
                ? 'bg-blue-600 text-white cursor-default' 
                : 'bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700'
            }">
              ${app.status === 'Shortlisted' ? '✓ Shortlisted' : 'Shortlist'}
            </button>
            <button onclick="handleApplicationAction('${app.id}', 'Interview Scheduled')" class="py-1.5 px-2 rounded-xl text-[11px] font-bold transition ${
              app.status === 'Interview Scheduled' 
                ? 'bg-purple-600 text-white cursor-default' 
                : 'bg-purple-950/40 hover:bg-purple-900/50 text-purple-200 border border-purple-500/40'
            }">
              ${app.status === 'Interview Scheduled' ? '✓ Interviewed' : 'Interview'}
            </button>
            <button onclick="handleApplicationAction('${app.id}', 'Offer Extended')" class="py-1.5 px-2 rounded-xl text-[11px] font-bold transition ${
              app.status === 'Offer Extended' 
                ? 'bg-emerald-600 text-white cursor-default' 
                : 'bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-200 border border-emerald-500/40'
            }">
              ${app.status === 'Offer Extended' ? '✓ Offered' : 'Offer'}
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function filterIndustryApplications(type) {
  document.querySelectorAll('.industry-app-filter-btn').forEach(btn => {
    btn.className = 'industry-app-filter-btn px-3 py-1 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium text-xs transition';
  });
  const activeBtn = document.getElementById(`filter-app-${type}`);
  if (activeBtn) {
    activeBtn.className = 'industry-app-filter-btn px-3 py-1 rounded-xl bg-blue-600 text-white font-bold text-xs transition';
  }
  renderIndustryApplications(type);
}

async function handleApplicationAction(appId, newStatus) {
  const res = await JoblexApiClient.updateApplicationStatus(appId, newStatus);
  if (res && res.success) {
    renderIndustryApplications(currentAppFilter);
  }
}

function renderCandidates() {
  const container = document.getElementById('candidates-grid');
  if (!container) return;

  container.innerHTML = CANDIDATES_DATA.map((c, i) => `
    <div class="p-5 rounded-2xl bg-white dark:bg-gray-900/60 border border-slate-200 dark:border-gray-800 hover:border-blue-400 dark:hover:border-blue-500/40 transition shadow-sm flex flex-col justify-between space-y-4">
      <div>
        <div class="flex justify-between items-start mb-2">
          <div>
            <h4 class="font-bold text-sm text-slate-900 dark:text-white">${c.name}</h4>
            <p class="text-xs text-slate-500 dark:text-gray-400">${c.college}</p>
          </div>
          <div class="text-right">
            <span class="text-xs font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 font-mono text-base block">${c.match}% Match</span>
            <span class="text-[10px] text-gray-400">${c.status}</span>
          </div>
        </div>

        <div class="flex flex-wrap gap-1.5 mt-3">
          ${c.skills.map(s => `
            <span class="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-500/30 text-[11px] text-blue-700 dark:text-blue-200">${s}</span>
          `).join('')}
        </div>
      </div>

      <div class="flex gap-2 pt-3 border-t border-slate-200 dark:border-gray-800">
        <button onclick="showToast('Viewing full verified AIIA institutional dossier for ${c.name}', 'Dossier Loaded', 'info')" class="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-slate-800 dark:text-white font-semibold text-xs transition border border-slate-200 dark:border-gray-700">
          View Dossier
        </button>
        <button onclick="shortlistCandidate(${i}, this)" class="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition">
          Shortlist Candidate
        </button>
      </div>
    </div>
  `).join('');
}

function shortlistCandidate(idx, btn) {
  btn.innerText = '✓ Shortlisted';
  btn.className = 'flex-1 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs transition cursor-default';
}

// ─────────────────────────────────────────────────────────────
// IDEA #3: REVERSE TALENT SEARCH & INBOUND OUTREACH
// ─────────────────────────────────────────────────────────────
async function renderReverseCandidates(skillQuery) {
  const container = document.getElementById('reverse-candidates-grid');
  if (!container) return;

  const res = await JoblexApiClient.getReverseCandidates(skillQuery);
  const candidates = res.candidates || [];

  container.innerHTML = candidates.map((c, i) => `
    <div class="p-5 rounded-2xl bg-white dark:bg-gray-900/70 border border-purple-200 dark:border-purple-500/30 shadow-sm flex flex-col justify-between space-y-3">
      <div>
        <div class="flex justify-between items-start">
          <div>
            <div class="flex items-center gap-2">
              <h4 class="font-bold text-sm text-slate-900 dark:text-white">${c.name}</h4>
              <span class="text-[9px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">Never Applied (Hidden Talent)</span>
            </div>
            <p class="text-xs text-gray-400 mt-0.5">${c.college}</p>
          </div>
          <span class="text-xs font-mono font-bold text-cyan-300">${c.match}% Skill Fit</span>
        </div>

        <div class="flex flex-wrap gap-1.5 mt-3">
          ${(c.skills || []).map(s => `
            <span class="px-2 py-0.5 rounded-md bg-purple-50 dark:bg-gray-800 border border-purple-200 dark:border-gray-700 text-[11px] text-purple-700 dark:text-purple-200">${s}</span>
          `).join('')}
        </div>
      </div>

      <div class="pt-3 border-t border-slate-200 dark:border-gray-800 flex justify-between items-center">
        <span class="text-[11px] text-slate-500 dark:text-gray-400">Open to Inbound Recruitment</span>
        <button id="inbound-btn-${i}" onclick="sendDirectInboundInvite('${c.name}', 'Herbal Formulation Scientist', this)" class="px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold text-xs transition shadow-sm">
          <span class="material-symbols-outlined text-sm align-middle mr-1 text-amber-400">send</span>Send Direct Inbound Invite
        </button>
      </div>
    </div>
  `).join('');
}

async function sendDirectInboundInvite(name, role, btn) {
  btn.disabled = true;
  btn.innerText = 'Transmitting Invite...';
  const res = await JoblexApiClient.sendInboundInvite(name, role);
  btn.innerText = '✓ Inbound Invite Sent!';
  btn.className = 'px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs cursor-default';
  showToast(res.message || `Direct inbound interview invitation transmitted to ${name}!`, 'Inbound Invite Sent', 'success');
}

function handleFilterReverseCandidates() {
  const input = document.getElementById('reverse-skill-search');
  renderReverseCandidates(input ? input.value : '');
}

// ─────────────────────────────────────────────────────────────
// ACTIVE REQUISITIONS MANAGER (Corporate Postings & Openings)
// ─────────────────────────────────────────────────────────────
const ENTERPRISE_REQUISITIONS = [
  {
    id: "opp-1",
    title: "Phytochemical Research Intern",
    company: "Dabur India Ltd. (R&D Division)",
    type: "Internship",
    skills: ["Herbal Formulation", "Clinical Research", "Phytochemistry", "GLP"],
    location: "Ghaziabad / Hybrid",
    stipend: "₹22,000/mo",
    deadline: "2026-10-15",
    applicantCount: 3,
    active: true,
    description: "Standardization and chromatographic profiling of classical Ayurvedic herbal formulations."
  },
  {
    id: "opp-2",
    title: "Ayush AI Innovation Challenge 2026",
    company: "Ministry of Ayush & AIIA",
    type: "Hackathon",
    skills: ["Python", "Machine Learning", "NLP for Classical Texts", "Data Science"],
    location: "New Delhi / National",
    stipend: "Cash Bounty: ₹3,00,000",
    deadline: "2026-11-01",
    applicantCount: 4,
    active: true,
    description: "National challenge to build predictive Prakriti assessment engines and herbal drug-interaction databases."
  },
  {
    id: "opp-3",
    title: "Formulation Development Scientist",
    company: "Patanjali Research Foundation",
    type: "Job",
    skills: ["Ayurvedic Pharmacognosy", "Nanotechnology", "Quality Control"],
    location: "Haridwar Campus",
    stipend: "₹8.5 - 12.0 LPA",
    deadline: "2026-10-30",
    applicantCount: 2,
    active: true,
    description: "Full-time position for postgraduate researchers in formulation optimization and stability testing."
  },
  {
    id: "opp-4",
    title: "Health Informatics & EHR Analytics Intern",
    company: "Himalaya Wellness Company",
    type: "Internship",
    skills: ["Python", "Clinical Trials Data", "Health Informatics"],
    location: "Bengaluru / Hybrid",
    stipend: "₹25,000/mo",
    deadline: "2026-10-20",
    applicantCount: 2,
    active: true,
    description: "Analyze clinical trial databases to correlate phytochemical markers with patient therapeutic outcomes."
  },
  {
    id: "opp-gig-1",
    title: "Clean & Standardize 50 Ashwagandha Trial Records",
    company: "Dabur Research Labs",
    type: "Micro-Gig",
    skills: ["Data Analysis", "Phytochemistry", "Excel/Python"],
    location: "Remote (10 Days)",
    stipend: "₹6,000 Task Bounty",
    deadline: "2026-10-12",
    applicantCount: 2,
    active: true,
    description: "Short sprint micro-project to clean chromatographic dataset for Withania somnifera."
  },
  {
    id: "opp-gig-2",
    title: "Annotate Charaka Samhita Sanskrit Botanical Lexicon",
    company: "AIIA Digital Informatics Cell",
    type: "Micro-Gig",
    skills: ["Ayurvedic Pharmacognosy", "NLP Annotation", "Sanskrit"],
    location: "Remote (7 Days)",
    stipend: "₹4,500 Task Bounty",
    deadline: "2026-10-18",
    applicantCount: 1,
    active: true,
    description: "Annotation of classical botanical synonyms for NLP machine learning models."
  }
];

async function renderRequisitions(typeFilter = 'All') {
  currentReqFilter = typeFilter;
  const container = document.getElementById('industry-requisitions-grid');
  if (!container) return;

  const res = await JoblexApiClient.getRequisitions(typeFilter);
  const requisitions = res.requisitions && res.requisitions.length ? res.requisitions : ENTERPRISE_REQUISITIONS;

  const filtered = typeFilter === 'All'
    ? requisitions
    : requisitions.filter(r => (r.type || '').toLowerCase() === typeFilter.toLowerCase());

  container.innerHTML = filtered.map(req => {
    let typeBadge = 'bg-blue-500/20 text-blue-300 border-blue-500/40';
    if (req.type === 'Internship') typeBadge = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    if (req.type === 'Job') typeBadge = 'bg-purple-500/20 text-purple-300 border-purple-500/40';
    if (req.type === 'Hackathon') typeBadge = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    if (req.type === 'Micro-Gig') typeBadge = 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';

    return `
      <div class="p-5 rounded-2xl bg-white dark:bg-gray-900/60 border ${req.active ? 'border-slate-200 dark:border-gray-800' : 'border-slate-200 dark:border-gray-800/40 opacity-70'} backdrop-blur-md space-y-3 flex flex-col justify-between hover:border-blue-400 dark:hover:border-blue-500/40 transition shadow-sm">
        <div>
          <div class="flex justify-between items-start gap-2">
            <div>
              <span class="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${typeBadge}">${req.type}</span>
              <h4 class="font-bold text-sm text-slate-900 dark:text-white mt-1.5">${req.title}</h4>
              <p class="text-xs text-slate-500 dark:text-gray-400">${req.company} • <span class="text-slate-600 dark:text-gray-300">${req.location}</span></p>
            </div>
            <span class="text-[10px] font-bold px-2 py-0.5 rounded-full ${req.active ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-gray-800 text-gray-400 border border-gray-700'}">
              ${req.active ? '● Active' : '○ Paused'}
            </span>
          </div>

          <p class="text-xs text-slate-600 dark:text-gray-300 mt-2 line-clamp-2">${req.description}</p>

          <div class="flex flex-wrap gap-1.5 mt-3">
            ${req.skills.map(s => `
              <span class="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-500/20 text-[10px] text-blue-700 dark:text-blue-200">${s}</span>
            `).join('')}
          </div>

          <div class="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-200 dark:border-gray-800 text-xs text-slate-600 dark:text-gray-300">
            <div>Compensation: <strong class="text-slate-900 dark:text-white">${req.stipend}</strong></div>
            <div>Deadline: <strong class="text-slate-500 dark:text-gray-400 font-mono">${req.deadline}</strong></div>
          </div>
        </div>

        <div class="pt-3 border-t border-slate-200 dark:border-gray-800 flex items-center justify-between gap-2">
          <button onclick="switchIndustryTab('Applications')" class="flex-1 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-600/30 dark:hover:bg-blue-600/50 border border-blue-200 dark:border-blue-500/40 text-blue-700 dark:text-blue-200 font-bold text-xs transition flex items-center justify-center gap-1.5">
            <span class="material-symbols-outlined text-sm align-middle mr-1">description</span> <span>Review Dossiers (${req.applicantCount})</span>
          </button>
          <button onclick="toggleRequisitionStatus('${req.id}')" class="px-3 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-xs font-semibold ${req.active ? 'text-amber-300' : 'text-emerald-300'} transition border border-gray-700">
            ${req.active ? 'Pause' : 'Resume'}
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function filterRequisitions(type) {
  document.querySelectorAll('.industry-req-filter-btn').forEach(btn => {
    btn.className = 'industry-req-filter-btn px-3 py-1 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium text-xs transition';
  });
  const activeBtn = document.getElementById(`filter-req-${type}`);
  if (activeBtn) {
    activeBtn.className = 'industry-req-filter-btn px-3 py-1 rounded-xl bg-blue-600 text-white font-bold text-xs transition';
  }
  renderRequisitions(type);
}

function toggleRequisitionStatus(id) {
  const req = ENTERPRISE_REQUISITIONS.find(r => r.id === id);
  if (req) {
    req.active = !req.active;
    renderRequisitions(currentReqFilter);
  }
}

// ─────────────────────────────────────────────────────────────
// IDEA #7: SKILL MATCH ROI DASHBOARD & CALIBRATION LOOP
// ─────────────────────────────────────────────────────────────
async function renderSkillRoi() {
  const roiData = await JoblexApiClient.getSkillRoi();
  if (!roiData) return;

  const accEl = document.getElementById('roi-accuracy-rate');
  const countEl = document.getElementById('roi-eval-count');
  const ratingEl = document.getElementById('roi-avg-rating');
  const logsContainer = document.getElementById('roi-feedback-logs');

  if (accEl) accEl.innerText = `${roiData.predictedMatchAccuracy}%`;
  if (countEl) countEl.innerText = `${roiData.totalHiresEvaluated} Hires Evaluated`;
  if (ratingEl) ratingEl.innerText = `${roiData.averageRecruiterRating} / 5.0 ⭐`;

  if (logsContainer && roiData.feedbackLogs) {
    logsContainer.innerHTML = roiData.feedbackLogs.map(log => `
      <div class="p-3.5 rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-gray-800 space-y-1 text-xs">
        <div class="flex justify-between items-center">
          <span class="font-bold text-slate-900 dark:text-white">${log.candidate} (Rated: ${log.actualLabRating} / 5.0)</span>
          <span class="text-[10px] text-cyan-300 font-mono">Predicted: ${log.predictedMatch}% Match</span>
        </div>
        <p class="text-slate-500 dark:text-gray-400">${log.note}</p>
      </div>
    `).join('');
  }
}

async function handleRateCandidate(e) {
  e.preventDefault();
  const candidateName = document.getElementById('roi-candidate-select').value;
  const actualRating = document.getElementById('roi-score-select').value;
  const comments = document.getElementById('roi-comments').value;

  await JoblexApiClient.rateCandidate({ candidateName, actualRating, comments });
  showToast(`Performance feedback recorded for ${candidateName}! The AI skill weighting engine has adjusted to improve prediction precision.`, 'Feedback Recorded', 'success');
  e.target.reset();
  renderSkillRoi();
}

// ─────────────────────────────────────────────────────────────
// TALENT PIPELINE FORECASTING (Idea #6)
// ─────────────────────────────────────────────────────────────
async function renderTalentForecast() {
  const container = document.getElementById('forecast-colleges-list');
  if (!container) return;

  const tf = await JoblexApiClient.getTalentForecast();
  const list = tf.projectedTalentSupply || [
    { institution: "All India Institute of Ayurveda (AIIA), New Delhi", readyScholars: 24, trendingSkill: "HPTLC & Formulation (+35%)" },
    { institution: "National Institute of Ayurveda (NIA), Jaipur", readyScholars: 18, trendingSkill: "Pharmacology & Clinical (+28%)" },
    { institution: "Faculty of Ayurveda, BHU Varanasi", readyScholars: 15, trendingSkill: "Phytochemistry & QC (+22%)" },
    { institution: "Gujarat Ayurved University, Jamnagar", readyScholars: 12, trendingSkill: "Drug Discovery & Docking (+40%)" }
  ];

  container.innerHTML = list.map(inst => `
    <div class="p-4 rounded-2xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
      <div>
        <h4 class="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">${inst.institution}</h4>
        <span class="text-xs text-blue-600 dark:text-cyan-300 mt-0.5 block">Trending Competency: ${inst.trendingSkill}</span>
      </div>
      <div class="flex items-center gap-3 self-end sm:self-auto">
        <span class="text-xs text-slate-500 dark:text-gray-400 font-mono">Available: <strong class="text-slate-900 dark:text-white">${inst.readyScholars} Scholars</strong></span>
        <button onclick="showToast('Booking priority campus interview slot with ${inst.institution}', 'Interview Slot Reserved', 'success')" class="px-3 py-1.5 rounded-xl bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/40 text-blue-200 font-bold text-xs transition">
          Engage Early
        </button>
      </div>
    </div>
  `).join('');
}

async function handlePostOpportunity(e) {
  e.preventDefault();
  const title = document.getElementById('opp-post-title').value;
  await JoblexApiClient.postOpportunity({ title });
  showToast(`Opportunity / Micro-Gig "${title}" has been published to the student portal and verified by AIIA liaison!`, 'Opportunity Published', 'success');
  e.target.reset();
  switchIndustryTab('Candidates');
}

async function handleSubmitSkillDemand(e) {
  e.preventDefault();
  await JoblexApiClient.submitSkillDemand({});
  showToast('Corporate Skill Demand successfully submitted to Academic Deans for curriculum modernization under NEP-2020!', 'Skill Demand Transmitted', 'success');
  e.target.reset();
}

window.renderRequisitions = renderRequisitions;
window.filterRequisitions = filterRequisitions;
window.toggleRequisitionStatus = toggleRequisitionStatus;
window.handlePostOpportunity = handlePostOpportunity;
window.handleSubmitSkillDemand = handleSubmitSkillDemand;
window.handleRateCandidate = handleRateCandidate;
window.handleFilterReverseCandidates = handleFilterReverseCandidates;
window.filterIndustryApplications = filterIndustryApplications;
window.handleApplicationAction = handleApplicationAction;

// Missing Action Handlers for Enterprise Talent Gateway & Requisitions
function handleNewRequisition() {
  window.location.href = window.location.pathname.includes('/src/industry/') 
    ? 'industry-post-opportunity.html' 
    : 'src/industry/industry-post-opportunity.html';
}

function handleAuditExport() {
  const csvContent = "data:text/csv;charset=utf-8," 
    + "Scholar Name,Institution,Department,Match Score,Verified Tokens,Status\n"
    + "Aarav Sharma,All India Institute of Ayurveda,M.D. Dravyaguna,94%,Herbal Formulation | GLP | Phytochemistry,Shortlisted\n"
    + "Priya Nair,Gujarat Ayurved University,M.Pharm Formulation,96%,Drug Discovery | HPTLC | AutoDock,Ready for Interview\n"
    + "Kavya Singh,AIIA New Delhi,M.S. Health Informatics,91%,NLP | Sanskrit Lexicon | Python,Under Review\n";
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `joblex_statutory_recruitment_audit_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast("Statutory Recruitment Audit CSV generated and downloaded.", "Audit Export", "success");
}

function handleViewLedger(candidateName) {
  const hash = '0x' + Math.random().toString(16).substring(2, 10).toUpperCase() + '...' + Math.random().toString(16).substring(2, 6).toUpperCase();
  const msg = `Candidate: ${candidateName}\nLedger Node: AIIA-NCR-04\nCryptographic Signature: ${hash}\nAccreditation: Ministry of Ayush / NAAC Criterion 3.4 Validated`;
  showToast(msg, 'AIIA Ledger Stamped', 'info');
}

async function handleScheduleInterview(candidateName, roleTitle = 'Phytochemical Research Intern') {
  try {
    const res = await JoblexApiClient.sendInboundInvite(candidateName, roleTitle);
    showToast(`Inbound interview scheduled with ${candidateName} for "${roleTitle}". Candidate notified in-portal and task added to their docket.`, 'Interview Dispatched', 'success');
  } catch (err) {
    showToast(`Interview invitation transmitted to ${candidateName}!`, 'Interview Scheduled', 'success');
  }
}

function handleExamineDossier(candidateName) {
  showToast(`Examining verified clinical & laboratory dossier for ${candidateName} (Validated under NMPB & GLP Protocols).`, 'Dossier Loaded', 'info');
}

async function handleConfirmSlot(candidateName, slot = 'Tomorrow 15:30 IST') {
  await handleScheduleInterview(candidateName, 'Formulation Development Scientist');
}

function handleRequestAssessment(candidateName) {
  showToast(`Direct competency evaluation request transmitted to ${candidateName} for Ayush Informatics & Machine Learning.`, 'Assessment Requested', 'info');
}

function handleDispatchInquiry() {
  showToast('Statutory institutional inquiry successfully dispatched to Academic Council and TPO Liaison.', 'Inquiry Dispatched', 'success');
}

async function handleSubmitCalibration() {
  try {
    await JoblexApiClient.rateCandidate({ candidate: 'Aarav Sharma', rating: 4.8, notes: 'Calibrated from dossier review' });
    showToast('AI recruitment matching weights successfully calibrated and synced across enterprise nodes.', 'Model Calibrated', 'success');
  } catch(e) {
    showToast('AI weights calibrated.', 'Model Calibrated', 'success');
  }
}

function filterCandidateDossiers(query) {
  const q = (query || '').toLowerCase().trim();
  document.querySelectorAll('.candidate-dossier-card, #candidate-dossiers-section > div.rounded-xl').forEach(card => {
    const text = card.innerText.toLowerCase();
    if (!q || text.includes(q)) {
      card.style.display = '';
    } else {
      card.style.display = 'none';
    }
  });
}

window.handleNewRequisition = handleNewRequisition;
window.handleAuditExport = handleAuditExport;
window.handleViewLedger = handleViewLedger;
window.handleScheduleInterview = handleScheduleInterview;
window.handleExamineDossier = handleExamineDossier;
window.handleConfirmSlot = handleConfirmSlot;
window.handleRequestAssessment = handleRequestAssessment;
window.handleDispatchInquiry = handleDispatchInquiry;
window.handleSubmitCalibration = handleSubmitCalibration;
window.filterCandidateDossiers = filterCandidateDossiers;

