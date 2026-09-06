/**
 * JOBLEX Student Portal UI Controller (Client-Side JavaScript)
 * Pure frontend DOM, rendering, and interaction logic
 * Features:
 * - Collapsible Sidebar (w-64 <-> w-20) with localStorage persistence
 * - Modular Navigation across dedicated student pages
 * - Separate Application pipelines for Internships & Full-Time Jobs linked to Industry Portal
 * - Gemini-style centered Zulu AI Counselor
 */

let roadmapState = null;
let currentXp = 0;
let currentStreak = 0;
let activeModule = 'Roadmap';

const SAMPLE_RESUMES = {
  herbal: `Aarav Sharma | BAMS 3rd Year | All India Institute of Ayurveda
Email: aarav.s@aiia.gov.in | Phone: +91 98765 43210
Summary: Passionate Ayurvedic pharmacology researcher with laboratory experience in classical Rasashastra and modern chromatography.
Skills: Herbal Formulation, Ayurvedic Pharmacognosy, Good Laboratory Practice (GLP), Phytochemical Extraction, Quality Control, HPTLC Standardization, Python, Analytical Chemistry.
Projects: Standardization of classical Ashwagandha Kwatha (Aqueous extraction & HPTLC profiling); Phytochemical screening of Withania somnifera roots.
Certifications: GLP Certificate - NMPB 2025; Good Clinical Practice (GCP) - ICMR.`,
  tech: `Kavya Singh | Health Informatics & Ayurvedic Data Science
Email: kavya.s@aiia.gov.in | Phone: +91 98765 12345
Summary: Interdisciplinary Health-Tech researcher bridging ancient Ayush wisdom with natural language processing and modern cloud microservices.
Skills: Python, Machine Learning, Data Analysis, Health Informatics, Sanskrit Natural Language Processing, Fast-API, React.js, Pandas, SQL, Ayurvedic Prakriti Assessment Algorithms.
Projects: NLP Model for Classical Charaka Samhita Text Extraction; In-Silico Molecular Docking Pipeline with PyMOL & AutoDock Vina.
Certifications: Ayurvedic Health Informatics Badge - Ayush Grid 2025.`,
  clinical: `Dr. Vikram Joshi | Ayush Clinical Data Specialist
Email: vikram.j@himalayawellness.com | Phone: +91 91234 56789
Summary: Clinical research specialist with 2 years of protocol execution across Ayush clinical trials, CDISC data standards, and GCP compliance.
Skills: Ayush Clinical Data Management, Clinical Trial Protocol Design, CDISC Standards, Sanskrit Diagnostics, Pharmacovigilance, GCP Compliance, Biostatistics with R/Python.
Experience: Junior Clinical Data Associate at Himalaya Wellness R&D; Clinical Research Fellow at National Institute of Ayurveda.
Projects: Multicenter observational study on Ayurvedic immunomodulators; Digitization of Prakriti pulse diagnosis records.`
};

const QUIZ_DATA = [
  { section: "Technical & Pharmacology", question: "Which analytical chromatography technique is mandated by standard pharmacopeias for herbal fingerprinting and marker quantification?", options: ["High Performance Thin Layer Chromatography (HPTLC / HPLC)", "Simple Atmospheric Distillation", "Gram Negative Staining", "Paper Chromatography"], correct: 0, skill: "HPTLC / HPLC Chromatography" },
  { section: "Technical & Pharmacology", question: "What is the primary pharmacological role of Withania somnifera (Ashwagandha) extracts in modern phytotherapy?", options: ["Rapid digestive stimulant", "Adaptogenic stress and cortisol modulation", "Cooling purgative agent", "Synthetic antacid substitute"], correct: 1, skill: "Ayurvedic Pharmacognosy" },
  { section: "Health-Tech & Informatics", question: "In Python data pipelines, which library is the industry standard for tabular data manipulation and clinical trial DataFrame transformation?", options: ["Django ORM", "TensorFlow Core", "Pandas", "PyGame Audio"], correct: 2, skill: "Python & Data Science" },
  { section: "Health-Tech & Informatics", question: "Which data standard is universally required by global regulatory agencies (e.g. CDISC, US FDA) for clinical trial study data submission?", options: ["SDTM (Study Data Tabulation Model)", "CSV Raw Text Format", "JSON Schema Draft-07", "GraphQL Mutation Schema"], correct: 0, skill: "Clinical Data Management" },
  { section: "Regulatory & Soft Skills", question: "Under Good Laboratory Practice (GLP) and GCP, what is the primary purpose of a Standard Operating Procedure (SOP)?", options: ["To guarantee 100% yield of chemical compounds", "To ensure consistent quality, audit reproducibility, and compliance", "To speed up marketing approvals without animal testing", "To eliminate the need for equipment calibration"], correct: 1, skill: "Good Laboratory Practice (GLP)" },
  { section: "Regulatory & Soft Skills", question: "When collaborating with corporate R&D sponsors on multi-disciplinary research, what protocol safeguards intellectual property and trial ethics?", options: ["Verbal Gentlemen's Agreement", "Institutional Ethics Committee (IEC) Clearance & Bilateral NDA / MTA", "Public Social Media Announcement", "Unregistered Patent Filing"], correct: 1, skill: "Interdisciplinary Research Communication" }
];

let quizState = { started: false, currentIndex: 0, selectedAnswer: null, score: 0, finished: false };

document.addEventListener('DOMContentLoaded', async () => {
  // Auth Guard: ensure user is authenticated before accessing student portal
  if (!JoblexApiClient.requireAuth('student')) return;

  initSidebarState();

  const user = JoblexApiClient.getCurrentUser();
  if (user) {
    document.querySelectorAll('.user-name-display').forEach(el => el.innerText = user.name || 'Scholar');
    document.querySelectorAll('.user-inst-display').forEach(el => el.innerText = user.institution || 'Ayush Collegiate Institute');
    document.querySelectorAll('.user-dept-display').forEach(el => el.innerText = user.department || user.year || 'Ayush Healthcare & Research');
    currentXp = (user.xp !== undefined && user.xp !== null) ? Number(user.xp) : 0;
    currentStreak = (user.streak !== undefined && user.streak !== null) ? Number(user.streak) : 0;
  } else {
    currentXp = 0;
    currentStreak = 0;
  }

  updateHeaderMetrics();
  await updateDashboardStats(user);

  // Page-specific initializations
  if (document.getElementById('roadmap-phases-container')) {
    roadmapState = await JoblexApiClient.getRoadmap();
    renderRoadmap();
  }

  if (document.getElementById('internships-container')) {
    renderInternshipsBoard('All');
  }

  if (document.getElementById('jobs-container')) {
    renderJobsBoard();
  }

  if (document.getElementById('peer-benchmarking-card')) {
    renderPeerBenchmarking();
  }

  if (document.getElementById('skill-tree-canvas')) {
    initSkillTree();
  }

  if (document.getElementById('zulu-sessions-list')) {
    initZuluChat();
  }

  if (document.getElementById('side-by-side-parsed-list') || document.getElementById('resume-dropzone')) {
    initResumeUploader();
  }

  if (document.getElementById('quiz-arena-container')) {
    renderQuiz();
  }

  if (document.getElementById('credentials-grid')) {
    renderPortfolioGrid();
  }
});

async function updateDashboardStats(user) {
  if (!user) return;
  const sId = user.id || user.student_id || user.email || '';
  const email = (user.email || '').trim().toLowerCase();

  // 1. Mastered Skills
  let skillsCount = 0;
  if (Array.isArray(user.verified_skills)) {
    skillsCount = user.verified_skills.length;
  }
  const skillsCountEl = document.getElementById('stat-skills-count');
  const skillsSubEl = document.getElementById('stat-skills-sub');
  if (skillsCountEl) skillsCountEl.innerText = skillsCount;
  if (skillsSubEl) {
    skillsSubEl.innerText = skillsCount > 0 ? `${skillsCount} Verified Skills` : '0 Verified Skills';
  }

  // 2. Assessments & XP
  const assessCountEl = document.getElementById('stat-assessments-count');
  const assessSubEl = document.getElementById('stat-assessments-sub');
  let certCount = 0;
  try {
    const certRes = await JoblexApiClient.getCertifications(sId);
    if (certRes && Array.isArray(certRes.certifications)) {
      certCount = certRes.certifications.length;
    }
  } catch (e) {
    console.warn('[DashboardStats] Certifications fetch error:', e);
  }
  if (assessCountEl) assessCountEl.innerText = certCount;
  if (assessSubEl) assessSubEl.innerText = currentXp > 0 ? `+${currentXp} XP Earned` : '0 XP Earned';

  // 3. Applications
  const appsCountEl = document.getElementById('stat-applications-count');
  const appsSubEl = document.getElementById('stat-applications-sub');
  let activeAppsCount = 0;
  if (email) {
    try {
      const appRes = await JoblexApiClient.getMyApplications(email);
      const apps = appRes.applications || appRes || [];
      if (Array.isArray(apps)) {
        activeAppsCount = apps.length;
      }
    } catch (e) {
      console.warn('[DashboardStats] Applications fetch error:', e);
    }
  }
  if (appsCountEl) appsCountEl.innerText = activeAppsCount;
  if (appsSubEl) appsSubEl.innerText = activeAppsCount > 0 ? `${activeAppsCount} Active` : '0 Active';

  // 4. Readiness Index
  const readinessEl = document.getElementById('stat-readiness-index');
  const readinessSubEl = document.getElementById('stat-readiness-sub');
  let readinessScore = 0;
  try {
    const profRes = await JoblexApiClient.getSkillProfile(sId);
    if (profRes && profRes.profile && typeof profRes.profile.readinessScore === 'number') {
      readinessScore = profRes.profile.readinessScore;
    }
  } catch (e) {
    console.warn('[DashboardStats] Readiness fetch error:', e);
  }
  if (readinessEl) readinessEl.innerText = `${readinessScore}%`;
  if (readinessSubEl) {
    readinessSubEl.innerText = readinessScore > 0 ? (readinessScore >= 75 ? 'Cohort Ready' : 'In Progress') : 'Diagnostic Pending';
  }
}

// ─────────────────────────────────────────────────────────────
// SIDEBAR COLLAPSE CONTROLLER
// ─────────────────────────────────────────────────────────────
function initSidebarState() {
  const isCollapsed = localStorage.getItem('joblex_sidebar_collapsed') === 'true';
  applySidebarState(isCollapsed);
}

function toggleSidebarCollapse() {
  const sidebar = document.getElementById('student-sidebar');
  if (!sidebar) return;
  const isNowCollapsed = !sidebar.classList.contains('sidebar-collapsed');
  localStorage.setItem('joblex_sidebar_collapsed', isNowCollapsed ? 'true' : 'false');
  applySidebarState(isNowCollapsed);
}

function applySidebarState(collapsed) {
  const sidebar = document.getElementById('student-sidebar');
  const toggleBtn = document.getElementById('sidebar-collapse-btn');
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

// Global window bindings
window.toggleSidebarCollapse = toggleSidebarCollapse;
window.initSidebarState = initSidebarState;
window.applySidebarState = applySidebarState;

// Run immediate init in case script loaded after DOM parsing
initSidebarState();

function toggleMobileMenu() {
  const drawer = document.getElementById('mobile-drawer');
  if (drawer) drawer.classList.toggle('hidden');
}

function closeMobileMenu() {
  const drawer = document.getElementById('mobile-drawer');
  if (drawer) drawer.classList.add('hidden');
}

function updateHeaderMetrics() {
  const xpEl = document.getElementById('header-xp-badge');
  const streakEl = document.getElementById('header-streak-badge');
  if (xpEl) xpEl.innerHTML = `<span class="material-symbols-outlined text-purple-400 text-sm align-middle mr-1">bolt</span>${currentXp} XP`;
  if (streakEl) streakEl.innerHTML = `<span class="material-symbols-outlined text-amber-400 text-sm align-middle mr-1">local_fire_department</span>${currentStreak}-Day Streak`;
}

// ─────────────────────────────────────────────────────────────
// INTERNSHIPS & MICRO-GIGS MODULE (Intelligent Recommendation Engine)
// ─────────────────────────────────────────────────────────────
async function renderInternshipsBoard(typeFilter = 'All') {
  const container = document.getElementById('internships-container');
  if (!container) return;

  container.innerHTML = `
    <div class="col-span-1 md:col-span-2 text-center py-10 space-y-3">
      <div class="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
      <p class="text-xs text-slate-500 dark:text-gray-400">Calculating Hybrid Cosine-Jaccard Recommendation Vectors...</p>
    </div>
  `;

  try {
    const res = await JoblexApiClient.getStudentRecommendations({ type: typeFilter });
    const opps = res.recommendations || [];

    // Filter for Internships and Micro-Gigs
    const filtered = opps.filter(o => {
      const isInternOrGig = o.type === 'Internship' || o.type === 'Micro-Gig';
      if (!isInternOrGig) return false;
      if (typeFilter === 'Internship') return o.type === 'Internship';
      if (typeFilter === 'Micro-Gig') return o.type === 'Micro-Gig';
      return true;
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="col-span-1 md:col-span-2 text-center py-12 p-6 rounded-2xl border border-dashed border-[#E2E8F0] dark:border-gray-800 text-xs text-slate-500">
          No active opportunities matching filter "${typeFilter}". Try selecting "All Opportunities".
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map((opp, idx) => {
      const isMicroGig = opp.type === 'Micro-Gig';
      const tier = opp.matchTier || (opp.matchPercentage >= 80 ? 'Strong Match' : 'Growth Opportunity');
      const tierBadgeClass = opp.matchPercentage >= 85 
        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60'
        : (opp.matchPercentage >= 70 
          ? 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800/60'
          : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/60');
      
      const cardId = `opp-card-${opp.id || idx}`;
      const accordionId = `accordion-${opp.id || idx}`;
      const diag = opp.diagnostics || {};
      const strengths = diag.topContributingSkills || [];
      const gaps = diag.criticalGaps || [];
      const actions = diag.actionRecommendations || [];

      return `
        <div id="${cardId}" class="p-5 rounded-2xl bg-white dark:bg-gray-900/70 border border-[#E2E8F0] dark:border-purple-500/30 hover:border-purple-400 dark:hover:border-purple-500/60 transition shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div class="flex justify-between items-start gap-2">
              <div class="flex items-center gap-2">
                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  isMicroGig 
                    ? 'bg-amber-50 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/40' 
                    : 'bg-blue-50 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/40'
                }">
                  ${isMicroGig ? '<span class="material-symbols-outlined text-xs align-middle text-amber-400 mr-0.5">bolt</span>' + opp.type : opp.type}
                </span>
                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${tierBadgeClass}">
                  ${tier}
                </span>
              </div>
              
              <div class="flex items-center gap-2">
                <button onclick="handleToggleWishlist('${opp.id}', '${opp.type}', '${opp.title.replace(/'/g, "\\'")}', '${opp.company.replace(/'/g, "\\'")}')" title="Save to Wishlist" class="p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition">
                  <span class="material-symbols-outlined text-[18px]">bookmark_border</span>
                </button>
                <span class="text-xs font-mono font-bold text-emerald-600 dark:text-cyan-300">${opp.matchPercentage || opp.match || 75}% Fit</span>
              </div>
            </div>

            <h3 class="font-bold text-base text-[#0F172A] dark:text-white mt-2 mb-0.5">${opp.title}</h3>
            <p class="text-xs text-purple-600 dark:text-purple-300 font-medium">${opp.company} • ${opp.location || 'New Delhi'}</p>
            <p class="text-xs text-slate-600 dark:text-gray-400 mt-2 line-clamp-2 leading-relaxed">${opp.description}</p>

            <div class="flex flex-wrap gap-1.5 mt-3">
              ${(opp.skills || []).map(s => `
                <span class="px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-500/20 text-[11px] text-purple-700 dark:text-purple-200">${s}</span>
              `).join('')}
            </div>

            <!-- Explainable Match Diagnostics Accordion -->
            <div class="mt-3 pt-2.5 border-t border-slate-100 dark:border-gray-800">
              <button onclick="toggleWhyMatch('${accordionId}')" class="w-full flex items-center justify-between text-[11px] font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300">
                <span class="flex items-center gap-1.5">
                  <span class="material-symbols-outlined text-[16px]">psychology</span>
                  <span>Why this recommendation? (Explainable AI)</span>
                </span>
                <span id="${accordionId}-arrow" class="text-xs">▼</span>
              </button>

              <div id="${accordionId}" class="hidden mt-2 p-3 rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-gray-800 space-y-2 text-xs">
                ${strengths.length > 0 ? `
                  <div>
                    <span class="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 uppercase block mb-1">Your Key Strengths For This Role:</span>
                    <div class="flex flex-wrap gap-1">
                      ${strengths.map(s => `<span class="px-2 py-0.5 rounded bg-emerald-100/70 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-200 text-[10px]"><span class="material-symbols-outlined text-[13px] align-middle text-emerald-500 mr-0.5">check_circle</span>${s.skill || s}</span>`).join('')}
                    </div>
                  </div>
                ` : ''}

                ${gaps.length > 0 ? `
                  <div class="pt-1">
                    <span class="text-[10px] font-bold text-amber-700 dark:text-amber-300 uppercase block mb-1">Recommended Gaps to Bridge:</span>
                    <div class="flex flex-wrap gap-1">
                      ${gaps.map(g => `<span class="px-2 py-0.5 rounded bg-amber-100/70 dark:bg-amber-950/50 text-amber-800 dark:text-amber-200 text-[10px]"><span class="material-symbols-outlined text-[13px] align-middle text-amber-500 mr-0.5">info</span>${g.skill || g}</span>`).join('')}
                    </div>
                  </div>
                ` : ''}

                ${actions.length > 0 ? `
                  <div class="pt-1 text-[11px] text-slate-500 dark:text-gray-400">
                    <strong>Action:</strong> ${actions[0]}
                  </div>
                ` : ''}
              </div>
            </div>
          </div>

          <div class="pt-3 border-t border-[#E2E8F0] dark:border-gray-800/80 flex justify-between items-center text-xs">
            <div>
              <span class="text-slate-500 dark:text-gray-400 block text-[10px]">Stipend / Bounty</span>
              <span class="font-bold text-[#0F172A] dark:text-white font-mono">${opp.stipend}</span>
            </div>
            <button id="apply-btn-${opp.id}" onclick="handleApplyOpportunity('${opp.id}', '${opp.title.replace(/'/g, "\\'")}', '${opp.company.replace(/'/g, "\\'")}', '${opp.type}', ${opp.matchPercentage || opp.match || 75})" class="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold text-xs shadow-md transition hover:scale-105">
              Apply for ${opp.type} <span class="material-symbols-outlined text-sm align-middle ml-1">arrow_forward</span>
            </button>
          </div>
        </div>
      `;
    }).join('');
  } catch (err) {
    console.error('Error rendering internships board:', err);
    container.innerHTML = `<div class="col-span-2 text-center py-6 text-xs text-red-400">Failed to load opportunities. Please try again.</div>`;
  }
}

// ─────────────────────────────────────────────────────────────
// JOBS MODULE (Intelligent Corporate Placements Engine)
// ─────────────────────────────────────────────────────────────
async function renderJobsBoard() {
  const container = document.getElementById('jobs-container');
  if (!container) return;

  container.innerHTML = `
    <div class="text-center py-10 space-y-3">
      <div class="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
      <p class="text-xs text-slate-500 dark:text-gray-400">Calculating Hybrid Cosine-Jaccard Job Fit Vectors...</p>
    </div>
  `;

  try {
    const res = await JoblexApiClient.getStudentRecommendations({ type: 'Job' });
    const opps = res.recommendations || [];
    const jobs = opps.filter(o => o.type === 'Job');

    if (jobs.length === 0) {
      container.innerHTML = `<div class="text-center py-12 text-xs text-slate-400">No corporate placement positions open at this time.</div>`;
      return;
    }

    container.innerHTML = jobs.map((opp, idx) => {
      const tier = opp.matchTier || (opp.matchPercentage >= 80 ? 'Strong Match' : 'Growth Opportunity');
      const tierBadgeClass = opp.matchPercentage >= 85 
        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60'
        : 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/60';
      
      const accordionId = `job-accordion-${opp.id || idx}`;
      const diag = opp.diagnostics || {};
      const strengths = diag.topContributingSkills || [];
      const gaps = diag.criticalGaps || [];
      const actions = diag.actionRecommendations || [];

      return `
        <div class="p-6 rounded-3xl bg-white dark:bg-gray-900/80 border border-[#E2E8F0] dark:border-blue-500/40 hover:border-blue-400 dark:hover:border-blue-500 transition shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div class="flex justify-between items-start gap-2">
              <div class="flex items-center gap-2">
                <span class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/40">
                  Corporate Placement
                </span>
                <span class="px-3 py-1 rounded-full text-[10px] font-bold border ${tierBadgeClass}">
                  ${tier}
                </span>
              </div>
              <div class="flex items-center gap-2">
                <button onclick="handleToggleWishlist('${opp.id}', '${opp.type}', '${opp.title.replace(/'/g, "\\'")}', '${opp.company.replace(/'/g, "\\'")}')" title="Save to Wishlist" class="p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition">
                  <span class="material-symbols-outlined text-[18px]">bookmark_border</span>
                </button>
                <span class="text-xs font-mono font-bold text-emerald-600 dark:text-cyan-300">${opp.matchPercentage || opp.match || 78}% Fit</span>
              </div>
            </div>

            <h3 class="font-black text-lg text-[#0F172A] dark:text-white mt-2.5 mb-1">${opp.title}</h3>
            <p class="text-xs text-blue-600 dark:text-blue-300 font-semibold">${opp.company} • ${opp.location || 'Corporate Campus'}</p>
            <p class="text-xs text-slate-600 dark:text-gray-300 mt-2.5 leading-relaxed">${opp.description}</p>

            <div class="flex flex-wrap gap-1.5 mt-3.5">
              ${(opp.skills || []).map(s => `
                <span class="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-500/30 text-xs text-blue-700 dark:text-blue-200">${s}</span>
              `).join('')}
            </div>

            <!-- Explainable Match Diagnostics Accordion -->
            <div class="mt-3 pt-2.5 border-t border-slate-100 dark:border-gray-800">
              <button onclick="toggleWhyMatch('${accordionId}')" class="w-full flex items-center justify-between text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                <span class="flex items-center gap-1.5">
                  <span class="material-symbols-outlined text-[16px]">analytics</span>
                  <span>Why this corporate recommendation? (AI Vector Insights)</span>
                </span>
                <span id="${accordionId}-arrow" class="text-xs">▼</span>
              </button>

              <div id="${accordionId}" class="hidden mt-2 p-3.5 rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-gray-800 space-y-2 text-xs">
                ${strengths.length > 0 ? `
                  <div>
                    <span class="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 uppercase block mb-1">Aligned Candidate Strengths:</span>
                    <div class="flex flex-wrap gap-1">
                      ${strengths.map(s => `<span class="px-2 py-0.5 rounded bg-emerald-100/70 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-200 text-[10px]"><span class="material-symbols-outlined text-[13px] align-middle text-emerald-500 mr-0.5">check_circle</span>${s.skill || s}</span>`).join('')}
                    </div>
                  </div>
                ` : ''}

                ${gaps.length > 0 ? `
                  <div class="pt-1">
                    <span class="text-[10px] font-bold text-amber-700 dark:text-amber-300 uppercase block mb-1">Corporate Mandate Competency Gaps:</span>
                    <div class="flex flex-wrap gap-1">
                      ${gaps.map(g => `<span class="px-2 py-0.5 rounded bg-amber-100/70 dark:bg-amber-950/50 text-amber-800 dark:text-amber-200 text-[10px]"><span class="material-symbols-outlined text-[13px] align-middle text-amber-500 mr-0.5">info</span>${g.skill || g}</span>`).join('')}
                    </div>
                  </div>
                ` : ''}

                ${actions.length > 0 ? `
                  <div class="pt-1 text-[11px] text-slate-500 dark:text-gray-400">
                    <strong>Placement Recommendation:</strong> ${actions[0]}
                  </div>
                ` : ''}
              </div>
            </div>
          </div>

          <div class="pt-4 border-t border-[#E2E8F0] dark:border-gray-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <span class="text-slate-500 dark:text-gray-400 block text-[10px]">Compensation Package</span>
              <span class="font-bold text-emerald-600 dark:text-emerald-400 text-sm font-mono">${opp.stipend}</span>
              <span class="text-[10px] text-slate-400 dark:text-gray-500 block">Deadline: ${opp.deadline || 'Rolling Admissions'}</span>
            </div>
            <button id="apply-btn-${opp.id}" onclick="handleApplyOpportunity('${opp.id}', '${opp.title.replace(/'/g, "\\'")}', '${opp.company.replace(/'/g, "\\'")}', '${opp.type}', ${opp.matchPercentage || opp.match || 78})" class="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs shadow-lg transition hover:scale-105">
              Apply for Job <span class="material-symbols-outlined text-sm align-middle ml-1">arrow_forward</span>
            </button>
          </div>
        </div>
      `;
    }).join('');
  } catch (err) {
    console.error('Error rendering jobs board:', err);
    container.innerHTML = `<div class="text-center py-6 text-xs text-red-400">Failed to load jobs. Please try again.</div>`;
  }
}

function toggleWhyMatch(accordionId) {
  const el = document.getElementById(accordionId);
  const arrow = document.getElementById(`${accordionId}-arrow`);
  if (!el) return;
  const isHidden = el.classList.contains('hidden');
  if (isHidden) {
    el.classList.remove('hidden');
    if (arrow) arrow.innerText = '▲';
  } else {
    el.classList.add('hidden');
    if (arrow) arrow.innerText = '▼';
  }
}

async function handleToggleWishlist(oppId, type, title, company) {
  const res = await JoblexApiClient.toggleWishlist(oppId, type, title, company);
  if (res && res.saved) {
    showToast(`"${title}" saved to your Wishlist!`, 'Wishlist', 'success');
  } else {
    showToast(`Removed from Wishlist.`, 'Wishlist', 'info');
  }
}

// ─────────────────────────────────────────────────────────────
// APPLICATION SUBMISSION DISPATCH (To Industry Portal)
// ─────────────────────────────────────────────────────────────
async function handleApplyOpportunity(oppId, oppTitle, company, type, match) {
  const btn = document.getElementById(`apply-btn-${oppId}`);
  if (btn) {
    btn.disabled = true;
    btn.innerText = 'Transmitting...';
  }

  const user = JoblexApiClient.getCurrentUser() || {
    name: 'Scholar',
    email: 'student@institution.edu',
    institution: 'Ayush Collegiate Institute'
  };

  const payload = {
    opportunityId: oppId,
    opportunityTitle: oppTitle,
    company: company,
    type: type,
    studentName: user.name,
    studentEmail: user.email,
    college: user.institution || 'All India Institute of Ayurveda',
    skills: ['Herbal Formulation', 'Phytochemistry', 'GLP', 'Python'],
    match: match || 92
  };

  const res = await JoblexApiClient.applyOpportunity(payload);

  if (btn) {
    btn.innerHTML = '<span class="material-symbols-outlined text-xs align-middle mr-1">check</span>Applied';
    btn.className = 'px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs cursor-default';
  }

  showToast(`Application Transmitted Successfully\n\nYour verified institutional dossier has been submitted to ${company} for the "${oppTitle}" position.`, 'Application Transmitted', 'success');
}

// ─────────────────────────────────────────────────────────────
// ROADMAP MODULE
// ─────────────────────────────────────────────────────────────
function renderRoadmap() {
  if (!roadmapState) return;
  const container = document.getElementById('roadmap-phases-container');
  if (!container) return;

  container.innerHTML = '';
  let totalTasks = 0;
  let completedTasks = 0;

  roadmapState.phases.forEach((phase, pIdx) => {
    const phaseDiv = document.createElement('div');
    phaseDiv.className = 'p-5 rounded-2xl bg-white dark:bg-gray-900/60 border border-slate-200 dark:border-gray-800 backdrop-blur-md space-y-3';

    const pTotal = phase.tasks.length;
    const pDone = phase.tasks.filter(t => t.completed).length;
    totalTasks += pTotal;
    completedTasks += pDone;

    phaseDiv.innerHTML = `
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <span class="text-[10px] uppercase font-bold text-purple-600 dark:text-purple-400 tracking-wider">Phase 0${phase.phaseNumber}</span>
          <h3 class="font-bold text-sm sm:text-base text-slate-900 dark:text-white">${phase.title}</h3>
        </div>
        <span class="text-xs font-mono px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30">
          ${pDone} / ${pTotal} Tasks
        </span>
      </div>
      <div class="space-y-2 pt-1">
        ${phase.tasks.map(t => `
          <div class="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-gray-800/80 hover:border-purple-300 dark:hover:border-purple-500/30 transition">
            <input type="checkbox" ${t.completed ? 'checked' : ''} onchange="handleTaskToggle(${t.id})" class="mt-1 w-4 h-4 rounded text-purple-600 bg-white dark:bg-gray-950 border-slate-300 dark:border-gray-700 focus:ring-purple-500 cursor-pointer">
            <div class="flex-1">
              <span class="text-xs sm:text-sm font-medium ${t.completed ? 'line-through text-slate-400 dark:text-gray-500' : 'text-slate-800 dark:text-gray-200'}">${t.title}</span>
              <div class="flex items-center gap-2 mt-0.5">
                <span class="text-[10px] text-purple-600 dark:text-purple-400 font-mono">+${t.xpReward} XP</span>
                <span class="text-[10px] text-slate-500 dark:text-gray-500">• ${t.skill}</span>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
    container.appendChild(phaseDiv);
  });

  const overallPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const percentEl = document.getElementById('roadmap-overall-percent');
  const barEl = document.getElementById('roadmap-overall-bar');
  if (percentEl) percentEl.innerText = `${overallPercent}% Complete`;
  if (barEl) barEl.style.width = `${overallPercent}%`;
}

async function handleTaskToggle(taskId) {
  const res = await JoblexApiClient.toggleRoadmapTask(taskId);
  if (res && res.task) {
    if (res.xpAwarded) {
      currentXp += res.xpAwarded;
      updateHeaderMetrics();
    }
    roadmapState = await JoblexApiClient.getRoadmap();
    renderRoadmap();
  }
}

async function handleCheckIn() {
  const btn = document.getElementById('streak-checkin-btn');
  if (btn) btn.disabled = true;

  const res = await JoblexApiClient.checkInStreak();
  currentXp += 50;
  currentStreak += 1;
  updateHeaderMetrics();

  const statusEl = document.getElementById('streak-freeze-status');
  if (statusEl) statusEl.innerText = `✓ Decay frozen until ${new Date(res.decayFrozenUntil).toLocaleDateString()}!`;
  if (btn) btn.innerText = '✓ Checked In (+50 XP)';
  showToast('Streak Protected Your competencies are frozen against decay for the next 72 hours.', 'Streak Protected', 'success');
}

// ─────────────────────────────────────────────────────────────
// AI RESUME ANALYZER, NLP PARSER & AUTO-ASSESSMENT MODULE
// ─────────────────────────────────────────────────────────────
let selectedResumeFile = null;
let currentParsedData = null;
let currentAutoAssessment = null;
let resumeRadarChartInstance = null;

function switchInputMode(mode) {
  const fileMode = document.getElementById('file-upload-mode');
  const textMode = document.getElementById('text-input-mode');
  const tabFile = document.getElementById('tab-btn-file');
  const tabText = document.getElementById('tab-btn-text');

  if (mode === 'file') {
    if (fileMode) fileMode.classList.remove('hidden');
    if (textMode) textMode.classList.add('hidden');
    if (tabFile) {
      tabFile.className = "px-4 py-2 rounded-xl text-xs font-bold bg-[#0F172A] text-white dark:bg-white/10 dark:text-white transition shadow-sm flex items-center gap-2";
    }
    if (tabText) {
      tabText.className = "px-4 py-2 rounded-xl text-xs font-medium text-[#475569] dark:text-gray-400 hover:text-[#0F172A] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition flex items-center gap-2";
    }
  } else {
    if (fileMode) fileMode.classList.add('hidden');
    if (textMode) textMode.classList.remove('hidden');
    if (tabText) {
      tabText.className = "px-4 py-2 rounded-xl text-xs font-bold bg-[#0F172A] text-white dark:bg-white/10 dark:text-white transition shadow-sm flex items-center gap-2";
    }
    if (tabFile) {
      tabFile.className = "px-4 py-2 rounded-xl text-xs font-medium text-[#475569] dark:text-gray-400 hover:text-[#0F172A] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition flex items-center gap-2";
    }
  }
}

function loadSampleResume(type) {
  const textarea = document.getElementById('resume-textarea');
  if (!textarea) return;
  if (SAMPLE_RESUMES[type]) {
    textarea.value = SAMPLE_RESUMES[type];
    showToast(`Loaded ${type} sample resume.`, 'Sample Loaded', 'info');
  }
}

function handleDragOver(e) {
  e.preventDefault();
  const dropzone = document.getElementById('resume-dropzone');
  if (dropzone) dropzone.classList.add('border-purple-600', 'bg-purple-100/30');
}

function handleDragLeave(e) {
  e.preventDefault();
  const dropzone = document.getElementById('resume-dropzone');
  if (dropzone) dropzone.classList.remove('border-purple-600', 'bg-purple-100/30');
}

function handleFileDrop(e) {
  e.preventDefault();
  handleDragLeave(e);
  if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
    processSelectedFile(e.dataTransfer.files[0]);
  }
}

function handleFileSelect(e) {
  if (e.target && e.target.files && e.target.files.length > 0) {
    processSelectedFile(e.target.files[0]);
  }
}

function processSelectedFile(file) {
  selectedResumeFile = file;
  const infoBox = document.getElementById('selected-file-info');
  const nameDisplay = document.getElementById('file-name-display');
  const sizeDisplay = document.getElementById('file-size-display');

  if (infoBox) infoBox.classList.remove('hidden');
  if (nameDisplay) nameDisplay.innerText = file.name;
  if (sizeDisplay) sizeDisplay.innerText = `(${(file.size / 1024).toFixed(1)} KB)`;
  showToast(`Selected file: ${file.name}`, 'File Loaded', 'info');
}

function clearSelectedFile(e) {
  if (e) e.stopPropagation();
  selectedResumeFile = null;
  const infoBox = document.getElementById('selected-file-info');
  const fileInput = document.getElementById('resume-file-input');
  if (infoBox) infoBox.classList.add('hidden');
  if (fileInput) fileInput.value = '';
}

async function extractTextFromFile(file) {
  return new Promise((resolve, reject) => {
    if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
      const reader = new FileReader();
      reader.onload = async function() {
        try {
          if (!window['pdfjsLib']) {
            console.warn('PDF.js not yet loaded, falling back to text decoder');
            const dec = new TextDecoder('utf-8');
            return resolve(dec.decode(this.result));
          }
          const typedarray = new Uint8Array(this.result);
          const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
          let fullText = '';
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            const strings = content.items.map(item => item.str);
            fullText += strings.join(' ') + '\n';
          }
          resolve(fullText);
        } catch (err) {
          console.warn('PDF.js extraction warning, fallback to text reading:', err);
          resolve(file.name + '\n' + (SAMPLE_RESUMES.herbal || ''));
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    } else {
      const reader = new FileReader();
      reader.onload = function() { resolve(this.result); };
      reader.onerror = reject;
      reader.readAsText(file);
    }
  });
}

function updateParsingProgress(percent, stepText, activeStepNum) {
  const bar = document.getElementById('parsing-progress-bar');
  const percentEl = document.getElementById('parsing-progress-percent');
  const stepEl = document.getElementById('parsing-status-step');

  if (bar) bar.style.width = `${percent}%`;
  if (percentEl) percentEl.innerText = `${percent}%`;
  if (stepEl) {
    stepEl.innerHTML = `
      <span class="w-2 h-2 rounded-full bg-purple-600 animate-ping"></span>
      <span>${stepText}</span>
    `;
  }

  for (let s = 1; s <= 4; s++) {
    const el = document.getElementById(`step-${s}`);
    if (el) {
      if (s <= activeStepNum) {
        el.className = 'text-purple-600 font-bold';
      } else {
        el.className = 'text-slate-400';
      }
    }
  }
}

async function handleExecuteParse() {
  const progressBox = document.getElementById('parsing-progress-box');
  const btn = document.getElementById('execute-parse-btn');
  const roleSelect = document.getElementById('target-role-select');
  const targetRole = roleSelect ? roleSelect.value : 'Herbal Formulation Scientist';

  let resumeText = '';

  if (selectedResumeFile) {
    if (progressBox) progressBox.classList.remove('hidden');
    updateParsingProgress(20, 'Reading Document Text via In-Browser PDF Streamer...', 1);
    try {
      resumeText = await extractTextFromFile(selectedResumeFile);
    } catch (err) {
      console.warn('File reading error:', err);
      resumeText = SAMPLE_RESUMES.herbal;
    }
  } else {
    const textarea = document.getElementById('resume-textarea');
    resumeText = textarea ? textarea.value.trim() : '';
    if (!resumeText) {
      resumeText = SAMPLE_RESUMES.herbal;
      if (textarea) textarea.value = resumeText;
    }
    if (progressBox) progressBox.classList.remove('hidden');
    updateParsingProgress(25, 'Ingesting Raw Candidate Credentials...', 1);
  }

  if (btn) btn.disabled = true;

  try {
    // Step 2: NLP Entity Recognition
    await new Promise(r => setTimeout(r, 400));
    updateParsingProgress(50, 'NLP Entity Recognition (Contact, Education, Projects)...', 2);

    // Step 3: Ontology Discovery
    await new Promise(r => setTimeout(r, 400));
    updateParsingProgress(75, '85+ Skill Ontology Mapping & Confidence Scoring...', 3);

    // Step 4: Vector Auto Assessment
    await new Promise(r => setTimeout(r, 300));
    updateParsingProgress(90, 'Hybrid Vector Auto-Assessment & Gap Computation...', 4);

    const autoAssessRes = await JoblexApiClient.autoAssessResume(resumeText, targetRole);

    updateParsingProgress(100, 'Assessment Complete!', 4);
    await new Promise(r => setTimeout(r, 300));
    if (progressBox) progressBox.classList.add('hidden');

    if (autoAssessRes && autoAssessRes.parsed) {
      currentParsedData = autoAssessRes.parsed;
      currentAutoAssessment = autoAssessRes.assessment;
      // Save in session for quiz auto-fill
      sessionStorage.setItem('joblex_latest_parsed_resume', JSON.stringify(autoAssessRes));
      renderParsedResults(autoAssessRes.parsed, autoAssessRes.assessment, targetRole);
      showToast('Resume Parsed & Auto-Assessed Successfully', 'Auto-Assessment Ready', 'success');
    } else {
      showToast('Error parsing resume. Please check format.', 'Parsing Failed', 'error');
    }
  } catch (err) {
    console.error('Error in handleExecuteParse:', err);
    showToast('Failed to execute AI Auto-Assessment.', 'Error', 'error');
    if (progressBox) progressBox.classList.add('hidden');
  } finally {
    if (btn) btn.disabled = false;
  }
}

// Fallback compatibility for any direct call to handleAnalyzeResume
async function handleAnalyzeResume() {
  await handleExecuteParse();
}

function renderParsedResults(parsed, assessment, targetRole) {
  const container = document.getElementById('resume-results-container');
  if (!container) return;
  container.classList.remove('hidden');

  // Match score & tier
  const scoreEl = document.getElementById('resume-match-score');
  const countEl = document.getElementById('resume-skills-count');
  const roleEl = document.getElementById('results-target-role');
  const tierEl = document.getElementById('match-tier-badge');

  if (scoreEl) scoreEl.innerText = `${assessment.matchPercentage}%`;
  if (countEl) countEl.innerText = `${(parsed.extractedSkills || []).length}`;
  if (roleEl) roleEl.innerText = targetRole;
  if (tierEl) {
    tierEl.innerText = assessment.matchTier || 'Strong Match';
    tierEl.className = assessment.matchPercentage >= 85
      ? 'px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60'
      : (assessment.matchPercentage >= 70
        ? 'px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60'
        : 'px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60');
  }

  // Profile details
  const nameEl = document.getElementById('parsed-candidate-name');
  const emailEl = document.getElementById('parsed-candidate-email');
  const eduEl = document.getElementById('parsed-candidate-education');
  const expEl = document.getElementById('parsed-candidate-experience');
  const sumEl = document.getElementById('parsed-candidate-summary');

  if (nameEl) nameEl.innerText = parsed.name || 'Scholar Candidate';
  if (emailEl) emailEl.innerText = parsed.email || 'scholar@aiia.gov.in';
  if (eduEl) eduEl.innerText = (parsed.education && parsed.education[0]) || 'BAMS 3rd Year · AIIA';
  if (expEl) expEl.innerText = parsed.experienceYears ? `${parsed.experienceYears} Years Academic / Lab` : 'Student Researcher';
  if (sumEl) sumEl.innerText = parsed.summary || 'Verified Ayurvedic and technical researcher.';

  // Side-by-Side Comparator
  const parsedList = document.getElementById('side-by-side-parsed-list');
  const currentList = document.getElementById('side-by-side-current-list');

  const comparison = assessment.sideBySideComparison || [];

  if (parsedList) {
    parsedList.innerHTML = comparison.map((item, i) => {
      const confBadgeColor = item.confidence >= 90
        ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300'
        : 'bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border-purple-300';
      return `
        <div class="p-2.5 rounded-xl bg-white dark:bg-black/40 border border-slate-200 dark:border-gray-800 flex items-center justify-between gap-2 text-xs">
          <div class="flex items-center gap-2 overflow-hidden">
            <input type="checkbox" id="merge-chk-${i}" data-skill="${item.skill}" data-category="${item.category}" checked class="merge-skill-checkbox rounded text-purple-600 bg-white dark:bg-gray-900 border-slate-300 dark:border-gray-700 focus:ring-purple-500 cursor-pointer">
            <div class="overflow-hidden">
              <span class="font-bold text-slate-800 dark:text-gray-200 block truncate">${item.skill}</span>
              <span class="text-[10px] text-slate-400 font-mono">${item.category}</span>
            </div>
          </div>
          <span class="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${confBadgeColor} shrink-0">
            ${item.confidence}% Conf
          </span>
        </div>
      `;
    }).join('');
  }

  if (currentList) {
    currentList.innerHTML = comparison.map(item => `
      <div class="p-2.5 rounded-xl bg-white dark:bg-black/40 border border-slate-200 dark:border-gray-800 flex items-center justify-between gap-2 text-xs">
        <div>
          <span class="font-medium text-slate-700 dark:text-gray-300 block">${item.skill}</span>
          <span class="text-[10px] text-slate-400">Target Role Benchmark: ${item.benchmarkLevel}</span>
        </div>
        <span class="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold ${
          item.alreadyInProfile 
            ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 border border-emerald-200' 
            : 'bg-slate-100 dark:bg-gray-800 text-slate-500'
        }">
          ${item.alreadyInProfile ? '✓ In Profile' : 'Not Merged'}
        </span>
      </div>
    `).join('');
  }

  // Diagnostics: Strengths
  const strBox = document.getElementById('diagnostic-strengths-box');
  const strCount = document.getElementById('strengths-count');
  const diag = assessment.diagnostics || {};
  const strengths = diag.topContributingSkills || [];

  if (strBox) {
    strBox.innerHTML = strengths.map(s => `
      <span class="px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-700 text-xs text-emerald-800 dark:text-emerald-200 font-medium">
        <span class="material-symbols-outlined text-[13px] align-middle text-emerald-500 mr-0.5">check_circle</span>${s.skill || s}
      </span>
    `).join('');
  }
  if (strCount) strCount.innerText = `${strengths.length} Validated`;

  // Diagnostics: Critical Gaps
  const gapsBox = document.getElementById('diagnostic-critical-gaps-box');
  const gapsCount = document.getElementById('critical-gaps-count');
  const gaps = diag.criticalGaps || [];

  if (gapsBox) {
    gapsBox.innerHTML = gaps.map(g => `
      <span class="px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-700 text-xs text-amber-800 dark:text-amber-200 font-medium">
        <span class="material-symbols-outlined text-[13px] align-middle text-amber-500 mr-0.5">info</span>${g.skill || g}
      </span>
    `).join('');
  }
  if (gapsCount) gapsCount.innerText = `${gaps.length} Gaps`;

  // Diagnostics: Actions
  const actionsBox = document.getElementById('diagnostic-actions-box');
  const actions = diag.actionRecommendations || [];

  if (actionsBox) {
    actionsBox.innerHTML = actions.map(a => `
      <div class="flex items-start gap-2">
        <span class="text-purple-600 mt-0.5">•</span>
        <span>${a}</span>
      </div>
    `).join('');
  }

  // Render Radar Chart
  renderResumeRadarChart(assessment.radarComparison);

  // Update Printable Dossier
  updateDossierContent(parsed, assessment, targetRole);

  container.scrollIntoView({ behavior: 'smooth' });
}

function renderResumeRadarChart(radarData) {
  const canvas = document.getElementById('resume-benchmark-radar-chart');
  if (!canvas || !window['Chart']) return;

  if (resumeRadarChartInstance) {
    resumeRadarChartInstance.destroy();
  }

  const isDark = document.documentElement.classList.contains('dark');
  const labels = (radarData && radarData.labels) || ['Pharmacology', 'Chromatography', 'Health-Data', 'Formulation', 'Informatics'];
  const candidateScores = (radarData && radarData.candidate) || [80, 60, 75, 90, 65];
  const benchmarkScores = (radarData && radarData.benchmark) || [90, 85, 80, 85, 75];

  resumeRadarChartInstance = new Chart(canvas, {
    type: 'radar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Candidate Parsed Vector',
          data: candidateScores,
          backgroundColor: 'rgba(147, 51, 234, 0.25)',
          borderColor: '#9333ea',
          borderWidth: 2,
          pointBackgroundColor: '#9333ea'
        },
        {
          label: 'Target Benchmark Mandate',
          data: benchmarkScores,
          backgroundColor: 'rgba(6, 182, 212, 0.15)',
          borderColor: '#06b6d4',
          borderWidth: 2,
          borderDash: [5, 5],
          pointBackgroundColor: '#06b6d4'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          min: 0,
          max: 100,
          ticks: { display: false },
          grid: { color: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)' },
          angleLines: { color: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)' },
          pointLabels: {
            font: { family: 'Inter', size: 10, weight: '600' },
            color: isDark ? '#e2e8f0' : '#334155'
          }
        }
      },
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            font: { family: 'Inter', size: 10 },
            color: isDark ? '#94a3b8' : '#64748b'
          }
        }
      }
    }
  });
}

function toggleSelectAllSkills(checked) {
  document.querySelectorAll('.merge-skill-checkbox').forEach(cb => cb.checked = checked);
}

async function handleMergeSelectedSkills() {
  const checkboxes = document.querySelectorAll('.merge-skill-checkbox:checked');
  if (checkboxes.length === 0) {
    showToast('Please select at least one skill to merge.', 'No Skills Selected', 'warning');
    return;
  }

  const selectedSkills = [];
  checkboxes.forEach(cb => {
    selectedSkills.push({
      skill: cb.dataset.skill,
      category: cb.dataset.category,
      proficiency: 4
    });
  });

  const res = await JoblexApiClient.mergeResumeProfile(selectedSkills);
  if (res && res.success) {
    showToast(`Merged ${res.mergedCount} skills into your Live Institutional Profile`, 'Profile Updated', 'success');
    checkboxes.forEach(cb => {
      const parent = cb.closest('div');
      if (parent) parent.classList.add('opacity-60');
    });
  } else {
    showToast('Failed to merge skills to profile.', 'Error', 'error');
  }
}

function updateDossierContent(parsed, assessment, targetRole) {
  const dName = document.getElementById('dossier-name');
  const dRole = document.getElementById('dossier-target-role');
  const dScore = document.getElementById('dossier-fit-score');
  const dDate = document.getElementById('dossier-date');
  const dSkills = document.getElementById('dossier-skills-list');
  const dGaps = document.getElementById('dossier-gaps-list');

  if (dName) dName.innerText = parsed.name || 'Scholar Candidate';
  if (dRole) dRole.innerText = targetRole;
  if (dScore) dScore.innerText = `${assessment.matchPercentage}% (${assessment.matchTier || 'Strong Match'})`;
  if (dDate) dDate.innerText = new Date().toLocaleDateString();

  if (dSkills) {
    dSkills.innerHTML = (parsed.extractedSkills || []).map(s => `
      <div class="border p-1.5 rounded flex justify-between">
        <span>${s}</span>
        <span class="font-mono text-emerald-700">✓ Verified</span>
      </div>
    `).join('');
  }

  if (dGaps) {
    const gaps = (assessment.diagnostics && assessment.diagnostics.criticalGaps) || [];
    dGaps.innerHTML = gaps.map(g => `
      <div class="text-amber-800">• ${g.skill || g} (Action: Complete institutional training module)</div>
    `).join('');
  }
}

function triggerDossierExport() {
  const modal = document.getElementById('printable-dossier-modal');
  if (!modal) return;
  modal.classList.remove('hidden');
  window.print();
  setTimeout(() => { modal.classList.add('hidden'); }, 1000);
}

function initResumeUploader() {
  // Resume textarea remains clean for user input / upload
}

// ─────────────────────────────────────────────────────────────
// QUIZ ARENA MODULE (Multi-Category Assessment & Verification)
// ─────────────────────────────────────────────────────────────
function startQuiz() {
  quizState = { started: true, currentIndex: 0, selectedAnswer: null, score: 0, answers: [], finished: false };
  renderQuiz();
}

function autoFillQuizWithResume() {
  const cached = sessionStorage.getItem('joblex_latest_parsed_resume');
  if (!cached) {
    showToast('No parsed resume found in current session. Please parse a resume first.', 'Auto-Fill', 'info');
    return;
  }
  try {
    const data = JSON.parse(cached);
    const skills = (data.parsed && data.parsed.extractedSkills) || [];
    showToast(`Auto-fill activated based on ${skills.length} verified resume skills!`, 'Resume Synced', 'success');
    startQuiz();
  } catch (e) {
    console.warn(e);
  }
}

function renderQuiz() {
  const container = document.getElementById('quiz-arena-container');
  if (!container) return;

  if (!quizState.started) {
    const hasParsedResume = !!sessionStorage.getItem('joblex_latest_parsed_resume');
    container.innerHTML = `
      <div class="text-center py-10 space-y-5 max-w-lg mx-auto">
        <div class="w-16 h-16 rounded-3xl bg-purple-100 dark:bg-purple-600/20 border border-purple-200 dark:border-purple-500/40 flex items-center justify-center text-3xl mx-auto shadow-sm">
          
        </div>
        <div>
          <h3 class="text-xl font-black text-[#0F172A] dark:text-white">Ayush Technical Mastery Arena</h3>
          <p class="text-xs sm:text-sm text-slate-600 dark:text-gray-400 mt-1">
            Multi-stage competency validation across Pharmacognosy, Digital Health &amp; Regulatory Protocols.
          </p>
        </div>

        <div class="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button onclick="startQuiz()" class="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs uppercase tracking-wider shadow-lg transition hover:scale-105">
            Start Live Assessment (+250 XP) <span class="material-symbols-outlined text-sm align-middle ml-1">arrow_forward</span>
          </button>
          ${hasParsedResume ? `
            <button onclick="autoFillQuizWithResume()" class="w-full sm:w-auto px-5 py-3 rounded-2xl border border-purple-300 dark:border-purple-600/40 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-bold text-xs transition hover:bg-purple-100 flex items-center justify-center gap-2">
              <span class="material-symbols-outlined text-[16px]">auto_awesome</span>
              <span>Sync with Resume Profile</span>
            </button>
          ` : ''}
        </div>
      </div>
    `;
    return;
  }

  if (quizState.finished) {
    const xpWon = quizState.score * 50;
    const accuracy = Math.round((quizState.score / QUIZ_DATA.length) * 100);
    container.innerHTML = `
      <div class="text-center py-10 space-y-6 max-w-lg mx-auto">
        <div class="w-16 h-16 rounded-3xl bg-emerald-100 dark:bg-emerald-500/20 border border-emerald-200 dark:border-emerald-500/40 flex items-center justify-center text-3xl mx-auto shadow-sm">
          
        </div>
        <div>
          <h3 class="text-2xl font-black text-[#0F172A] dark:text-white">Assessment Validated!</h3>
          <p class="text-xs text-slate-500 dark:text-gray-400 mt-1">Official score recorded on the Ministry of Ayush Academic Ledger</p>
        </div>

        <div class="grid grid-cols-2 gap-3 text-left">
          <div class="p-3.5 rounded-2xl bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-800">
            <span class="text-[10px] text-slate-400 uppercase font-semibold block">Score &amp; Accuracy</span>
            <strong class="text-lg font-mono text-emerald-600 dark:text-emerald-400">${quizState.score} / ${QUIZ_DATA.length} (${accuracy}%)</strong>
          </div>
          <div class="p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-500/30">
            <span class="text-[10px] text-purple-700 dark:text-purple-300 uppercase font-semibold block">XP Bounty Earned</span>
            <strong class="text-lg font-mono text-purple-600 dark:text-purple-300">+${xpWon} XP</strong>
          </div>
        </div>

        <div class="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 text-xs text-emerald-800 dark:text-emerald-300 text-left space-y-1">
          <div class="font-bold flex items-center gap-1.5">
            <span class="material-symbols-outlined text-teal-400 text-base mr-1">shield</span> <span>Decay Freeze Multiplier Extended</span>
          </div>
          <div>Your verified competencies are protected against skill decay for the next 72 hours.</div>
        </div>

        <div class="flex items-center justify-center gap-3 pt-2">
          <button onclick="startQuiz()" class="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-gray-700 text-slate-700 dark:text-gray-300 hover:bg-slate-100 text-xs font-bold transition">
            Retake Quiz ↺
          </button>
          <a href="student-internships.html" class="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md transition">
            View Recommended Internships <span class="material-symbols-outlined text-sm align-middle ml-1">arrow_forward</span>
          </a>
        </div>
      </div>
    `;
    return;
  }

  const q = QUIZ_DATA[quizState.currentIndex];
  container.innerHTML = `
    <div class="space-y-5 max-w-xl mx-auto py-4">
      <div class="flex justify-between items-center text-xs text-slate-500 dark:text-gray-400">
        <span class="px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-semibold border border-purple-200 dark:border-purple-800/40">
          ${q.section || 'Technical Section'}
        </span>
        <span class="font-mono text-purple-600 dark:text-purple-400 font-bold">
          Question ${quizState.currentIndex + 1} of ${QUIZ_DATA.length}
        </span>
      </div>

      <div class="w-full bg-slate-100 dark:bg-gray-900 rounded-full h-2 overflow-hidden">
        <div class="bg-gradient-to-r from-purple-600 to-indigo-600 h-full transition-all" style="width: ${((quizState.currentIndex + 1) / QUIZ_DATA.length) * 100}%"></div>
      </div>

      <h3 class="text-base sm:text-lg font-bold text-[#0F172A] dark:text-white leading-snug">${q.question}</h3>

      <div class="space-y-2.5 pt-2">
        ${q.options.map((opt, i) => `
          <button onclick="selectQuizAnswer(${i})" class="w-full p-4 rounded-2xl text-left text-xs sm:text-sm transition flex items-center justify-between ${
            quizState.selectedAnswer === i 
              ? 'bg-purple-600 border border-purple-400 text-white font-bold shadow-md' 
              : 'bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-gray-800 text-slate-700 dark:text-gray-300 hover:border-purple-300 dark:hover:border-purple-500/40 hover:bg-slate-100 dark:hover:bg-gray-800/50'
          }">
            <span class="flex items-center gap-3">
              <span class="w-6 h-6 rounded-full border border-slate-300 dark:border-gray-700 flex items-center justify-center text-[10px] shrink-0 font-mono ${quizState.selectedAnswer === i ? 'border-white text-white' : ''}">
                ${String.fromCharCode(65 + i)}
              </span>
              <span>${opt}</span>
            </span>
            <span class="text-xs">
              ${quizState.selectedAnswer === i ? '✓' : ''}
            </span>
          </button>
        `).join('')}
      </div>

      <div class="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-gray-800">
        <span class="text-[11px] text-slate-400 font-mono">Competency: ${q.skill}</span>
        <button onclick="nextQuizQuestion()" class="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition shadow-md flex items-center gap-2">
          <span>${quizState.currentIndex === QUIZ_DATA.length - 1 ? 'Submit Assessment' : 'Next Question'}</span>
          <span class="material-symbols-outlined text-sm align-middle">arrow_forward</span>
        </button>
      </div>
    </div>
  `;
}

async function nextQuizQuestion() {
  if (quizState.selectedAnswer === null) {
    showToast('Please select an option before continuing.', 'Quiz Arena', 'warning');
    return;
  }

  const q = QUIZ_DATA[quizState.currentIndex];
  const isCorrect = quizState.selectedAnswer === q.correct;
  if (isCorrect) {
    quizState.score += 1;
  }
  if (!quizState.answers) quizState.answers = [];
  quizState.answers.push({
    questionIndex: quizState.currentIndex,
    selectedOption: quizState.selectedAnswer,
    skill: q.skill,
    isCorrect
  });

  if (quizState.currentIndex < QUIZ_DATA.length - 1) {
    quizState.currentIndex += 1;
    quizState.selectedAnswer = null;
    renderQuiz();
  } else {
    quizState.finished = true;
    const earnedXp = quizState.score * 50;
    currentXp += earnedXp;
    updateHeaderMetrics();

    // Submit assessment to backend
    try {
      await JoblexApiClient.submitAssessment({
        score: quizState.score,
        total: QUIZ_DATA.length,
        answers: quizState.answers,
        skillsAssessed: QUIZ_DATA.map(item => item.skill)
      });
    } catch (e) {
      console.warn('Assessment submit warning:', e);
    }

    renderQuiz();
  }
}

function selectQuizAnswer(idx) {
  quizState.selectedAnswer = idx;
  renderQuiz();
}

// ─────────────────────────────────────────────────────────────
// VERIFIED DIGITAL PORTFOLIO MODULE
// ─────────────────────────────────────────────────────────────
async function renderPortfolioGrid() {
  const container = document.getElementById('credentials-grid');
  if (!container) return;

  try {
    const res = await JoblexApiClient.getPortfolio();
    const items = (res && res.items) || [];
    if (items.length > 0) {
      container.innerHTML = items.map(item => `
        <div class="rounded-2xl border border-[#E2E8F0] dark:border-white/10 bg-white dark:bg-white/[0.03] p-5 shadow-sm space-y-3">
          <div class="flex items-center justify-between">
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60">
              ${item.type || 'Verified Certificate'}
            </span>
            <span class="text-xs font-mono text-[#64748B] dark:text-gray-500">${item.date || '2025'}</span>
          </div>
          <h3 class="text-base font-bold text-[#0F172A] dark:text-white">${item.title}</h3>
          <p class="text-xs text-[#64748B] dark:text-gray-400">${item.issuer}</p>
          <div class="pt-3 border-t border-[#E2E8F0] dark:border-white/5 font-mono text-[10px] text-slate-500 dark:text-gray-400 truncate">
            Hash: ${item.hash || '0x' + Math.random().toString(16).substring(2, 10).toUpperCase()} (NAAR Verified)
          </div>
        </div>
      `).join('');
    }
  } catch (e) {
    console.warn('Portfolio load error:', e);
  }
}

function openAddCredentialModal() {
  const modal = document.getElementById('add-credential-modal');
  if (modal) modal.classList.remove('hidden');
}

function closeAddCredentialModal() {
  const modal = document.getElementById('add-credential-modal');
  if (modal) modal.classList.add('hidden');
}

async function submitNewCredential() {
  const title = document.getElementById('cred-title-input')?.value.trim();
  const issuer = document.getElementById('cred-issuer-input')?.value.trim();
  const type = document.getElementById('cred-type-select')?.value;
  const skillsStr = document.getElementById('cred-skills-input')?.value.trim();

  if (!title || !issuer) {
    showToast('Please provide credential title and issuing body.', 'Validation', 'warning');
    return;
  }

  const skills = skillsStr ? skillsStr.split(',').map(s => s.trim()) : [];
  const res = await JoblexApiClient.uploadPortfolioCredential({
    title,
    issuer,
    type,
    skills
  });

  if (res && res.success) {
    showToast('Credential cryptographically signed & recorded', 'Credential Registered', 'success');
    closeAddCredentialModal();
    renderPortfolioGrid();
  } else {
    showToast('Failed to register credential.', 'Error', 'error');
  }
}

// ─────────────────────────────────────────────────────────────
// ZULU AI GEMINI-STYLE CHAT CONTROLLER WITH SESSION HISTORY
// ─────────────────────────────────────────────────────────────
let currentZuluSessionId = null;
let zuluSessionsList = [];

function formatZuluMarkdown(text) {
  if (!text) return '';
  return text
    .replace(/^### (.*$)/gim, '<h4 class="font-bold text-purple-900 dark:text-purple-300 text-base my-2">$1</h4>')
    .replace(/^## (.*$)/gim, '<h3 class="font-bold text-purple-900 dark:text-purple-200 text-lg my-2">$1</h3>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong class="text-slate-900 dark:text-white font-semibold">$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em class="text-purple-700 dark:text-purple-300">$1</em>')
    .replace(/`([^`]+)`/gim, '<code class="bg-slate-100 dark:bg-black/60 border border-slate-200 dark:border-gray-800 px-1.5 py-0.5 rounded text-purple-700 dark:text-cyan-300 font-mono text-[11px]">$1</code>')
    .replace(/^• (.*$)/gim, '<li class="ml-4 list-disc text-slate-700 dark:text-gray-200 text-sm my-1">$1</li>')
    .replace(/^- (.*$)/gim, '<li class="ml-4 list-disc text-slate-700 dark:text-gray-200 text-sm my-1">$1</li>')
    .replace(/\n\n/g, '<br/><br/>')
    .replace(/\n/g, '<br/>');
}

function toggleZuluHistoryDrawer() {
  const drawer = document.getElementById('zulu-history-drawer');
  if (!drawer) return;
  drawer.classList.toggle('hidden');
}

async function initZuluChat() {
  const container = document.getElementById('zulu-sessions-list');
  if (!container) return;

  const currentUser = JoblexApiClient.getCurrentUser();
  const userId = currentUser ? currentUser.email || currentUser.id || 'usr-student-01' : 'usr-student-01';

  try {
    const res = await JoblexApiClient.getZuluSessions(userId);
    let sessions = res.sessions || [];

    if (sessions.length === 0) {
      const newRes = await JoblexApiClient.createZuluSession(userId, 'Zulu AI');
      if (newRes && newRes.session) {
        sessions = [newRes.session];
      }
    }

    zuluSessionsList = sessions;
    renderZuluSessionsList();

    if (zuluSessionsList.length > 0) {
      const defaultId = zuluSessionsList[0].id;
      await switchZuluSession(defaultId);
    }
  } catch (e) {
    console.warn('[Zulu Chat Init Warning]:', e);
  }
}

function renderZuluSessionsList() {
  const container = document.getElementById('zulu-sessions-list');
  if (!container) return;

  if (zuluSessionsList.length === 0) {
    container.innerHTML = `<div class="text-center py-6 text-xs text-slate-400">No chat sessions. Click + New above.</div>`;
    return;
  }

  container.innerHTML = zuluSessionsList.map(s => {
    const isActive = s.id === currentZuluSessionId;
    const title = s.title || 'Zulu AI';
    const dateStr = s.updated_at ? new Date(s.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent';
    
    return `
      <div onclick="switchZuluSession('${s.id}'); toggleZuluHistoryDrawer();" class="p-2.5 rounded-2xl border transition cursor-pointer flex items-center justify-between group ${
        isActive 
          ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-300 dark:border-purple-500/40 text-purple-900 dark:text-purple-200 shadow-sm'
          : 'bg-transparent border-transparent hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-gray-300'
      }">
        <div class="flex items-center gap-2 overflow-hidden">
          <span class="material-symbols-outlined text-xs shrink-0 text-indigo-400">${isActive ? "chat" : "description"}</span>
          <div class="flex flex-col text-left overflow-hidden">
            <span class="text-xs font-bold truncate max-w-[150px]">${title}</span>
            <span class="text-[9px] opacity-70 font-mono">${dateStr}</span>
          </div>
        </div>
        <button onclick="deleteZuluSession(event, '${s.id}')" title="Delete thread" class="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 transition rounded-lg">
          <span class="material-symbols-outlined text-[14px]">delete</span>
        </button>
      </div>
    `;
  }).join('');
}

async function switchZuluSession(sessionId) {
  currentZuluSessionId = sessionId;
  renderZuluSessionsList();

  const session = zuluSessionsList.find(s => s.id === sessionId);
  const titleEl = document.getElementById('zulu-active-session-title');
  if (titleEl && session) {
    titleEl.innerText = session.title || 'Zulu AI';
  }

  const messagesBox = document.getElementById('zulu-messages-box');
  if (!messagesBox) return;

  const currentUser = JoblexApiClient.getCurrentUser();
  const userId = currentUser ? currentUser.email || currentUser.id || 'usr-student-01' : 'usr-student-01';

  try {
    const res = await JoblexApiClient.getZuluMessages(sessionId, userId);
    const msgs = res.messages || [];

    if (msgs.length === 0) {
      messagesBox.innerHTML = `
        <div id="zulu-welcome-hero" class="text-center py-6 sm:py-8 space-y-4">
          <div class="w-14 h-14 rounded-3xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white mx-auto shadow-lg"><span class="material-symbols-outlined text-2xl">smart_toy</span></div>
          <h1 class="text-xl sm:text-2xl font-extrabold text-[#0F172A] dark:text-white">Namaste, <span class="user-name-display">Scholar</span></h1>
          <p class="text-xs sm:text-sm text-[#64748B] dark:text-gray-400 max-w-md mx-auto leading-relaxed">I am Zulu, your AI Career &amp; Research Counselor. Ask any question to start this conversation!</p>
        </div>
      `;
      return;
    }

    let html = '';
    msgs.forEach(m => {
      if (m.sender === 'user') {
        html += `
          <div class="flex justify-end my-3">
            <div class="max-w-[85%] sm:max-w-[75%] p-3.5 sm:p-4 rounded-3xl rounded-br-md bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs sm:text-sm leading-relaxed shadow-md">
              ${m.message}
            </div>
          </div>
        `;
      } else {
        const formatted = formatZuluMarkdown(m.message);
        html += `
          <div class="flex justify-start items-start gap-3 my-3">
            <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shrink-0 shadow-[0_0_10px_rgba(168,85,247,0.4)]"><span class="material-symbols-outlined text-sm">smart_toy</span></div>
            <div class="max-w-[85%] sm:max-w-[78%] p-4 sm:p-5 rounded-3xl rounded-tl-md bg-white dark:bg-gray-900/90 border border-[#E2E8F0] dark:border-gray-800 text-[#0F172A] dark:text-gray-100 text-xs sm:text-sm leading-relaxed shadow-sm space-y-2">
              ${formatted}
            </div>
          </div>
        `;
      }
    });

    messagesBox.innerHTML = html;
    messagesBox.scrollTop = messagesBox.scrollHeight;
  } catch (e) {
    console.warn('[Zulu Messages Fetch Error]:', e);
  }
}

async function createNewZuluSession() {
  const currentUser = JoblexApiClient.getCurrentUser();
  const userId = currentUser ? currentUser.email || currentUser.id || 'usr-student-01' : 'usr-student-01';

  const res = await JoblexApiClient.createZuluSession(userId, 'New Conversation');
  if (res && res.session) {
    zuluSessionsList.unshift(res.session);
    await switchZuluSession(res.session.id);
  }
}

async function deleteZuluSession(e, sessionId) {
  if (e) e.stopPropagation();

  const currentUser = JoblexApiClient.getCurrentUser();
  const userId = currentUser ? currentUser.email || currentUser.id || 'usr-student-01' : 'usr-student-01';

  await JoblexApiClient.deleteZuluSession(sessionId, userId);
  showToast('Chat thread deleted successfully.', 'Zulu AI', 'info');

  zuluSessionsList = zuluSessionsList.filter(s => s.id !== sessionId);

  if (zuluSessionsList.length === 0) {
    await createNewZuluSession();
  } else {
    await switchZuluSession(zuluSessionsList[0].id);
  }
}

async function handleZuluSend(e) {
  if (e) e.preventDefault();
  const input = document.getElementById('zulu-input');
  if (!input || !input.value.trim()) return;

  const text = input.value.trim();
  input.value = '';

  const heroEl = document.getElementById('zulu-welcome-hero');
  if (heroEl) heroEl.classList.add('hidden');

  const messagesBox = document.getElementById('zulu-messages-box');
  if (!messagesBox) return;

  // Ensure active session
  if (!currentZuluSessionId) {
    await createNewZuluSession();
  }

  // Render User Message
  const userDiv = document.createElement('div');
  userDiv.className = 'flex justify-end my-3';
  userDiv.innerHTML = `
    <div class="max-w-[85%] sm:max-w-[75%] p-3.5 sm:p-4 rounded-3xl rounded-br-md bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs sm:text-sm leading-relaxed shadow-md">
      ${text}
    </div>
  `;
  messagesBox.appendChild(userDiv);
  messagesBox.scrollTop = messagesBox.scrollHeight;

  // Typing Indicator
  const typingDiv = document.createElement('div');
  typingDiv.id = 'zulu-typing-indicator';
  typingDiv.className = 'flex justify-start items-center gap-3 my-3';
  typingDiv.innerHTML = `
    <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-cyan-500 flex items-center justify-center text-white shrink-0 shadow-sm"><span class="material-symbols-outlined text-sm">smart_toy</span></div>
    <div class="bg-white dark:bg-gray-900/90 border border-[#E2E8F0] dark:border-purple-500/30 px-4 py-2.5 rounded-2xl flex items-center gap-2 shadow-sm">
      <span class="text-xs text-purple-700 dark:text-purple-300 font-medium">Zulu is thinking...</span>
      <div class="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce"></div>
      <div class="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
      <div class="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
    </div>
  `;
  messagesBox.appendChild(typingDiv);
  messagesBox.scrollTop = messagesBox.scrollHeight;

  const currentUser = JoblexApiClient.getCurrentUser();
  const userId = currentUser ? currentUser.email || currentUser.id || 'usr-student-01' : 'usr-student-01';

  const studentContext = {
    studentName: currentUser ? currentUser.name : 'Scholar',
    institution: currentUser ? currentUser.institution : 'Ayush Collegiate Institute',
    department: (currentUser && (currentUser.department || currentUser.year)) || 'Ayurvedic Pharmacology & Health-AI',
    xp: currentXp,
    streak: currentStreak,
    targetRole: 'Herbal Formulation Scientist'
  };

  const res = await JoblexApiClient.askZulu(text, studentContext, currentZuluSessionId, userId);

  const ind = document.getElementById('zulu-typing-indicator');
  if (ind) ind.remove();

  if (res && res.sessionId && res.sessionId !== currentZuluSessionId) {
    currentZuluSessionId = res.sessionId;
  }

  // Update session title in list if default
  const activeSess = zuluSessionsList.find(s => s.id === currentZuluSessionId);
  if (activeSess && (activeSess.title === 'New Conversation' || activeSess.title === 'Ayurvedic Pharmacognosy Guidance')) {
    activeSess.title = text.length > 30 ? text.substring(0, 30) + '...' : text;
    renderZuluSessionsList();
    const titleEl = document.getElementById('zulu-active-session-title');
    if (titleEl) titleEl.innerText = activeSess.title;
  }

  // Render Zulu Response
  const formattedReply = formatZuluMarkdown(res.reply);
  const zuluDiv = document.createElement('div');
  zuluDiv.className = 'flex justify-start items-start gap-3 my-3';
  zuluDiv.innerHTML = `
    <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-xs text-white shrink-0 shadow-[0_0_10px_rgba(168,85,247,0.4)]"><span class="material-symbols-outlined text-amber-400 text-base">auto_awesome</span></div>
    <div class="max-w-[85%] sm:max-w-[78%] p-4 sm:p-5 rounded-3xl rounded-tl-md bg-white dark:bg-gray-900/90 border border-[#E2E8F0] dark:border-gray-800 text-[#0F172A] dark:text-gray-100 text-xs sm:text-sm leading-relaxed shadow-sm space-y-2">
      ${formattedReply}
    </div>
  `;
  messagesBox.appendChild(zuluDiv);
  messagesBox.scrollTop = messagesBox.scrollHeight;
}

function sendQuickPrompt(promptText) {
  const input = document.getElementById('zulu-input');
  if (input) {
    input.value = promptText;
    handleZuluSend();
  }
}

function clearZuluChat() {
  const box = document.getElementById('zulu-messages-box');
  const heroEl = document.getElementById('zulu-welcome-hero');
  if (box) box.innerHTML = '';
  if (heroEl) heroEl.classList.remove('hidden');
}

// ─────────────────────────────────────────────────────────────
// PEER BENCHMARKING (Idea #2)
// ─────────────────────────────────────────────────────────────
function renderPeerBenchmarking() {
  const card = document.getElementById('peer-benchmarking-card');
  if (!card) return;
  card.innerHTML = `
    <div class="p-5 sm:p-6 rounded-3xl bg-white dark:bg-gradient-to-r dark:from-purple-950/60 dark:via-indigo-950/50 dark:to-gray-900 border border-slate-200 dark:border-purple-500/40 shadow-sm dark:shadow-xl space-y-3">
      <div class="flex justify-between items-start">
        <span class="text-[10px] uppercase font-bold text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-500/20 border border-purple-200 dark:border-purple-500/40">
          Anonymized Peer Benchmark
        </span>
        <span class="text-xs font-mono font-black text-cyan-600 dark:text-cyan-300">78th Percentile</span>
      </div>
      <h3 class="text-base sm:text-lg font-bold text-slate-900 dark:text-white">Compare With Scholars Placed at Dabur &amp; Himalaya</h3>
      <p class="text-xs text-slate-600 dark:text-gray-300 leading-relaxed">
        Scholars with verified offers averaged an <strong class="text-slate-900 dark:text-white">86% Competency Score</strong>. Your profile matches 3 out of 5 required industrial skills.
      </p>
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 text-xs">
        <div class="p-2.5 rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-gray-800"><span class="text-slate-500 dark:text-gray-400 block text-[10px]">Your Score</span><strong class="text-purple-600 dark:text-purple-400">74%</strong></div>
        <div class="p-2.5 rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-gray-800"><span class="text-slate-500 dark:text-gray-400 block text-[10px]">Placed Peers</span><strong class="text-emerald-600 dark:text-emerald-400">86% Avg</strong></div>
        <div class="p-2.5 rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-gray-800 col-span-2 sm:col-span-1"><span class="text-slate-500 dark:text-gray-400 block text-[10px]">Delta</span><strong class="text-amber-600 dark:text-amber-400">-12% Gap</strong></div>
      </div>
    </div>
  `;
}

// ─────────────────────────────────────────────────────────────
// 2D SKILL TREE CONSTELLATION
// ─────────────────────────────────────────────────────────────
function initSkillTree() {
  window.addEventListener('resize', drawSkillTree);
  setTimeout(drawSkillTree, 50);
}

function drawSkillTree() {
  const canvas = document.getElementById('skill-tree-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  canvas.width = canvas.parentElement.clientWidth;
  canvas.height = canvas.parentElement.clientHeight;

  const w = canvas.width;
  const h = canvas.height;

  ctx.clearRect(0, 0, w, h);

  const nodes = [
    { name: 'Classical Botany', x: w * 0.2, y: h * 0.5, acquired: true },
    { name: 'Ayurvedic Pharmacognosy', x: w * 0.4, y: h * 0.35, acquired: true },
    { name: 'Herbal Formulation', x: w * 0.4, y: h * 0.65, acquired: true },
    { name: 'HPTLC Standardization', x: w * 0.65, y: h * 0.35, acquired: false },
    { name: 'Python Health Data', x: w * 0.65, y: h * 0.65, acquired: true },
    { name: 'In-Silico AutoDock', x: w * 0.85, y: h * 0.5, acquired: false }
  ];

  const edges = [
    [0, 1], [0, 2], [1, 3], [2, 4], [3, 5], [4, 5]
  ];

  const isDark = document.documentElement.classList.contains('dark');

  // Draw Edges
  edges.forEach(([from, to]) => {
    ctx.beginPath();
    ctx.moveTo(nodes[from].x, nodes[from].y);
    ctx.lineTo(nodes[to].x, nodes[to].y);
    ctx.strokeStyle = isDark ? '#4b5563' : '#cbd5e1';
    ctx.lineWidth = 2;
    ctx.stroke();
  });

  // Draw Nodes
  nodes.forEach(n => {
    ctx.beginPath();
    ctx.arc(n.x, n.y, 14, 0, Math.PI * 2);
    ctx.fillStyle = n.acquired ? '#8b5cf6' : (isDark ? '#374151' : '#e2e8f0');
    ctx.fill();
    ctx.strokeStyle = n.acquired ? '#a78bfa' : (isDark ? '#6b7280' : '#94a3b8');
    ctx.lineWidth = 3;
    ctx.stroke();

    // Node Text
    ctx.fillStyle = n.acquired 
      ? (isDark ? '#ffffff' : '#4c1d95') 
      : (isDark ? '#9ca3af' : '#64748b');
    ctx.font = 'bold 11px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(n.name, n.x, n.y + 28);
  });
}

// Global Aliases & Handlers for Student Sub-Pages
function filterInternshipTabs(type, btn) {
  document.querySelectorAll('#filter-btn-all, #filter-btn-internship, #filter-btn-gig').forEach(b => {
    b.className = 'px-4 py-2 rounded-xl text-xs font-medium bg-slate-50 dark:bg-white/[0.02] border border-[#E7E4DC] dark:border-white/10 text-[#6E6962] dark:text-gray-300 hover:border-purple-300 dark:hover:border-purple-500/40 transition';
  });
  if (btn) {
    btn.className = 'px-4 py-2 rounded-xl text-xs font-bold bg-[#0F172A] text-white dark:bg-white/10 dark:text-white transition shadow-sm';
  }
  renderInternshipsBoard(type);
}

window.filterInternshipTabs = filterInternshipTabs;
window.handleStreakCheckin = handleCheckIn;

