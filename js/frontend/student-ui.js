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
let currentXp = 1450;
let currentStreak = 7;
let activeModule = 'Roadmap';

const SAMPLE_RESUMES = {
  herbal: `Ashay Verma | BAMS 3rd Year | All India Institute of Ayurveda
Skills: Herbal Formulation, Ayurvedic Pharmacognosy, Good Laboratory Practice (GLP), Basic Phytochemistry, Python fundamentals.
Projects: Standardization of classical Ashwagandha Kwatha, Phytochemical screening of Withania somnifera.
Certifications: GLP Certificate - NMPB 2025.`,
  tech: `Kavya Singh | Health Informatics & Ayurvedic Data Science
Skills: Python, Machine Learning, Data Analysis, Health Informatics, Pandas, SQL, Sanskrit Lexicon Processing.
Projects: NLP Model for Classical Charaka Samhita Text Extraction, Predictive Model for Ayurvedic Prakriti Assessment.`
};

const QUIZ_DATA = [
  { question: "Which of the following is considered one of the three primary doshas in classical Ayurveda?", options: ["Prana", "Vata", "Chakra", "Ojas"], correct: 1 },
  { question: "What is the primary pharmacological role of Withania somnifera (Ashwagandha)?", options: ["Digestive stimulant", "Adaptogen for stress modulation", "Cooling purgative", "Antacid"], correct: 1 },
  { question: "In Python, which library is the industry standard for tabular data manipulation?", options: ["Django", "TensorFlow", "Pandas", "PyGame"], correct: 2 },
  { question: "What analytical chromatography technique is mandated by pharmacopeia for herbal fingerprinting?", options: ["HPTLC / HPLC", "Simple Distillation", "Gram Staining", "Paper Chromatography"], correct: 0 },
  { question: "Which classical treatise forms the core foundation of Ayurvedic internal medicine (Kayachikitsa)?", options: ["Charaka Samhita", "Arthashastra", "Rigveda", "Kama Sutra"], correct: 0 }
];

let quizState = { started: false, currentIndex: 0, selectedAnswer: null, score: 0, finished: false };

document.addEventListener('DOMContentLoaded', async () => {
  initSidebarState();

  const user = JoblexApiClient.getCurrentUser();
  if (user) {
    document.querySelectorAll('.user-name-display').forEach(el => el.innerText = user.name);
    if (user.xp) currentXp = user.xp;
    if (user.streak) currentStreak = user.streak;
  }

  updateHeaderMetrics();

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

  const resumeTextarea = document.getElementById('resume-textarea');
  if (resumeTextarea) resumeTextarea.value = SAMPLE_RESUMES.herbal;
});

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
    sidebar.classList.add('sidebar-collapsed', 'w-20');
    sidebar.classList.remove('w-64');
    if (toggleBtn) toggleBtn.innerHTML = '<span>▶</span>';
    document.querySelectorAll('.sidebar-text-label').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.sidebar-badge-label').forEach(el => el.classList.add('hidden'));
  } else {
    sidebar.classList.remove('sidebar-collapsed', 'w-20');
    sidebar.classList.add('w-64');
    if (toggleBtn) toggleBtn.innerHTML = '<span>◀</span>';
    document.querySelectorAll('.sidebar-text-label').forEach(el => el.classList.remove('hidden'));
    document.querySelectorAll('.sidebar-badge-label').forEach(el => el.classList.remove('hidden'));
  }
}

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
  if (xpEl) xpEl.innerText = `🔥 ${currentXp} XP`;
  if (streakEl) streakEl.innerText = `🎯 ${currentStreak}-Day Streak`;
}

// ─────────────────────────────────────────────────────────────
// INTERNSHIPS & MICRO-GIGS MODULE
// ─────────────────────────────────────────────────────────────
async function renderInternshipsBoard(typeFilter = 'All') {
  const container = document.getElementById('internships-container');
  if (!container) return;

  const res = await JoblexApiClient.getOpportunities('All');
  const allOpps = res.opportunities || [];
  
  // Filter for Internships & Micro-Gigs only
  const filtered = allOpps.filter(o => {
    const isInternshipOrGig = o.type === 'Internship' || o.type === 'Micro-Gig';
    if (!isInternshipOrGig) return false;
    if (typeFilter === 'Internship') return o.type === 'Internship';
    if (typeFilter === 'Micro-Gig') return o.type === 'Micro-Gig';
    return true;
  });

  container.innerHTML = filtered.map((opp, idx) => `
    <div class="p-5 rounded-2xl bg-gray-900/70 border border-purple-500/30 hover:border-purple-500/60 transition shadow-md flex flex-col justify-between space-y-4">
      <div>
        <div class="flex justify-between items-start gap-2">
          <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            opp.type === 'Micro-Gig' 
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
              : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
          }">
            ${opp.type === 'Micro-Gig' ? '⚡ ' + opp.type : opp.type}
          </span>
          <span class="text-xs font-mono font-bold text-cyan-300">${opp.match}% Skill Fit</span>
        </div>

        <h3 class="font-bold text-base text-white mt-2 mb-0.5">${opp.title}</h3>
        <p class="text-xs text-purple-300 font-medium">${opp.company}</p>
        <p class="text-xs text-gray-400 mt-2 line-clamp-2 leading-relaxed">${opp.description}</p>

        <div class="flex flex-wrap gap-1.5 mt-3">
          ${opp.skills.map(s => `
            <span class="px-2 py-0.5 rounded-md bg-purple-950/40 border border-purple-500/20 text-[11px] text-purple-200">${s}</span>
          `).join('')}
        </div>
      </div>

      <div class="pt-3 border-t border-gray-800/80 flex justify-between items-center text-xs">
        <div>
          <span class="text-gray-400 block text-[10px]">Stipend / Bounty</span>
          <span class="font-bold text-white font-mono">${opp.stipend}</span>
        </div>
        <button id="apply-btn-${opp.id}" onclick="handleApplyOpportunity('${opp.id}', '${opp.title}', '${opp.company}', '${opp.type}', ${opp.match})" class="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold text-xs shadow-md transition hover:scale-105">
          Apply for ${opp.type} ➔
        </button>
      </div>
    </div>
  `).join('');
}

// ─────────────────────────────────────────────────────────────
// JOBS MODULE
// ─────────────────────────────────────────────────────────────
async function renderJobsBoard() {
  const container = document.getElementById('jobs-container');
  if (!container) return;

  const res = await JoblexApiClient.getOpportunities('All');
  const allOpps = res.opportunities || [];
  
  // Filter for Full-Time Jobs
  const jobs = allOpps.filter(o => o.type === 'Job');

  container.innerHTML = jobs.map((opp, idx) => `
    <div class="p-6 rounded-3xl bg-gray-900/80 border border-blue-500/40 hover:border-blue-500 transition shadow-xl flex flex-col justify-between space-y-4">
      <div>
        <div class="flex justify-between items-start gap-2">
          <span class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            Full-Time Corporate Placement
          </span>
          <span class="text-xs font-mono font-bold text-cyan-300">${opp.match}% Skill Fit</span>
        </div>

        <h3 class="font-black text-lg text-white mt-2.5 mb-1">${opp.title}</h3>
        <p class="text-xs text-blue-300 font-semibold">${opp.company} • ${opp.location}</p>
        <p class="text-xs text-gray-300 mt-2.5 leading-relaxed">${opp.description}</p>

        <div class="flex flex-wrap gap-1.5 mt-3.5">
          ${opp.skills.map(s => `
            <span class="px-2.5 py-1 rounded-lg bg-blue-950/40 border border-blue-500/30 text-xs text-blue-200">${s}</span>
          `).join('')}
        </div>
      </div>

      <div class="pt-4 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <span class="text-gray-400 block text-[10px]">Compensation Package</span>
          <span class="font-bold text-emerald-400 text-sm font-mono">${opp.stipend}</span>
          <span class="text-[10px] text-gray-500 block">Deadline: ${opp.deadline}</span>
        </div>
        <button id="apply-btn-${opp.id}" onclick="handleApplyOpportunity('${opp.id}', '${opp.title}', '${opp.company}', '${opp.type}', ${opp.match})" class="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs shadow-lg transition hover:scale-105">
          Apply for Job ➔
        </button>
      </div>
    </div>
  `).join('');
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
    name: 'Ashay Verma',
    email: 'student@nexus.edu',
    institution: 'All India Institute of Ayurveda (AIIA), New Delhi'
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
    btn.innerText = '✓ Applied';
    btn.className = 'px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs cursor-default';
  }

  alert(`Application Transmitted! 🚀\n\nYour verified institutional dossier has been submitted to ${company} for the "${oppTitle}" position. The recruiter will review it in their Industry Portal dashboard.`);
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
    phaseDiv.className = 'p-5 rounded-2xl bg-gray-900/60 border border-gray-800 backdrop-blur-md space-y-3';

    const pTotal = phase.tasks.length;
    const pDone = phase.tasks.filter(t => t.completed).length;
    totalTasks += pTotal;
    completedTasks += pDone;

    phaseDiv.innerHTML = `
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <span class="text-[10px] uppercase font-bold text-purple-400 tracking-wider">Phase 0${phase.phaseNumber}</span>
          <h3 class="font-bold text-sm sm:text-base text-white">${phase.title}</h3>
        </div>
        <span class="text-xs font-mono px-2.5 py-0.5 rounded-full bg-purple-950/60 text-purple-300 border border-purple-500/30">
          ${pDone} / ${pTotal} Tasks
        </span>
      </div>
      <div class="space-y-2 pt-1">
        ${phase.tasks.map(t => `
          <div class="flex items-start gap-3 p-2.5 rounded-xl bg-black/40 border border-gray-800/80 hover:border-purple-500/30 transition">
            <input type="checkbox" ${t.completed ? 'checked' : ''} onchange="handleTaskToggle(${t.id})" class="mt-1 w-4 h-4 rounded text-purple-600 bg-gray-950 border-gray-700 focus:ring-purple-500 cursor-pointer">
            <div class="flex-1">
              <span class="text-xs sm:text-sm font-medium ${t.completed ? 'line-through text-gray-500' : 'text-gray-200'}">${t.title}</span>
              <div class="flex items-center gap-2 mt-0.5">
                <span class="text-[10px] text-purple-400 font-mono">+${t.xpReward} XP</span>
                <span class="text-[10px] text-gray-500">• ${t.skill}</span>
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
  alert('Streak Protected! ❄️ Your competencies are frozen against decay for the next 72 hours.');
}

// ─────────────────────────────────────────────────────────────
// AI RESUME ANALYZER MODULE
// ─────────────────────────────────────────────────────────────
async function handleAnalyzeResume() {
  const textarea = document.getElementById('resume-textarea');
  const roleSelect = document.getElementById('target-role-select');
  const resultsBox = document.getElementById('resume-results-box');

  const text = textarea ? textarea.value : '';
  const role = roleSelect ? roleSelect.value : 'Herbal Formulation Scientist';

  const res = await JoblexApiClient.analyzeResume(text, role);

  if (resultsBox && res) {
    resultsBox.classList.remove('hidden');

    const scoreEl = document.getElementById('resume-match-score');
    if (scoreEl) scoreEl.innerText = `${res.matchPercentage}%`;

    const extractedBox = document.getElementById('resume-extracted-skills');
    if (extractedBox && res.extractedSkills) {
      extractedBox.innerHTML = res.extractedSkills.map(s => `
        <span class="px-2.5 py-1 rounded-lg bg-emerald-950/50 border border-emerald-500/40 text-xs text-emerald-200">✓ ${s}</span>
      `).join('');
    }

    const missingBox = document.getElementById('resume-missing-skills');
    if (missingBox && res.missingSkills) {
      missingBox.innerHTML = res.missingSkills.map(s => `
        <span class="px-2.5 py-1 rounded-lg bg-amber-950/50 border border-amber-500/40 text-xs text-amber-200">⚠️ ${s}</span>
      `).join('');
    }

    resultsBox.scrollIntoView({ behavior: 'smooth' });
  }
}

// ─────────────────────────────────────────────────────────────
// QUIZ ARENA MODULE
// ─────────────────────────────────────────────────────────────
function startQuiz() {
  quizState = { started: true, currentIndex: 0, selectedAnswer: null, score: 0, finished: false };
  renderQuiz();
}

function renderQuiz() {
  const container = document.getElementById('quiz-arena-container');
  if (!container) return;

  if (!quizState.started) {
    container.innerHTML = `
      <div class="text-center py-12 space-y-4 max-w-md mx-auto">
        <div class="w-16 h-16 rounded-3xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-3xl mx-auto shadow-inner">
          ⚡
        </div>
        <h3 class="text-xl font-black text-white">Ayush Technical Mastery Arena</h3>
        <p class="text-xs sm:text-sm text-gray-400">Validate pharmacognosy and bio-data science competencies. Earn up to +250 XP to boost recruiter rankings.</p>
        <button onclick="startQuiz()" class="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs uppercase tracking-wider shadow-lg transition hover:scale-105">
          Start Assessment (+250 XP) ➔
        </button>
      </div>
    `;
    return;
  }

  if (quizState.finished) {
    const xpWon = quizState.score * 50;
    container.innerHTML = `
      <div class="text-center py-12 space-y-4 max-w-md mx-auto">
        <div class="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-3xl mx-auto">
          🏆
        </div>
        <h3 class="text-2xl font-black text-white">Quiz Completed!</h3>
        <p class="text-sm text-gray-300">Score: <strong class="text-emerald-400 font-mono text-lg">${quizState.score} / ${QUIZ_DATA.length}</strong></p>
        <div class="p-3.5 rounded-2xl bg-purple-950/40 border border-purple-500/30 text-purple-300 text-xs font-mono">
          +${xpWon} XP Awarded to Student Profile!
        </div>
        <button onclick="startQuiz()" class="px-6 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-white text-xs font-bold transition">
          Retake Quiz ↺
        </button>
      </div>
    `;
    return;
  }

  const q = QUIZ_DATA[quizState.currentIndex];
  container.innerHTML = `
    <div class="space-y-5 max-w-xl mx-auto py-4">
      <div class="flex justify-between items-center text-xs text-gray-400">
        <span>Question ${quizState.currentIndex + 1} of ${QUIZ_DATA.length}</span>
        <span class="font-mono text-purple-400">+50 XP</span>
      </div>
      <div class="w-full bg-gray-900 rounded-full h-1.5 overflow-hidden">
        <div class="bg-purple-600 h-full transition-all" style="width: ${((quizState.currentIndex + 1) / QUIZ_DATA.length) * 100}%"></div>
      </div>
      <h3 class="text-base sm:text-lg font-bold text-white">${q.question}</h3>
      <div class="space-y-2.5 pt-2">
        ${q.options.map((opt, i) => `
          <button onclick="selectQuizAnswer(${i})" class="w-full p-3.5 rounded-2xl text-left text-xs sm:text-sm transition flex items-center justify-between ${
            quizState.selectedAnswer === i 
              ? 'bg-purple-600 border border-purple-400 text-white font-bold' 
              : 'bg-black/40 border border-gray-800 text-gray-300 hover:border-purple-500/40'
          }">
            <span>${opt}</span>
            <span class="w-4 h-4 rounded-full border border-gray-700 flex items-center justify-center text-[10px]">
              ${quizState.selectedAnswer === i ? '✓' : ''}
            </span>
          </button>
        `).join('')}
      </div>
      <div class="flex justify-end pt-3">
        <button onclick="nextQuizQuestion()" class="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition">
          ${quizState.currentIndex === QUIZ_DATA.length - 1 ? 'Submit Answers ➔' : 'Next Question ➔'}
        </button>
      </div>
    </div>
  `;
}

function selectQuizAnswer(idx) {
  quizState.selectedAnswer = idx;
  renderQuiz();
}

function nextQuizQuestion() {
  if (quizState.selectedAnswer === null) {
    alert('Please select an option before continuing.');
    return;
  }

  if (quizState.selectedAnswer === QUIZ_DATA[quizState.currentIndex].correct) {
    quizState.score += 1;
  }

  if (quizState.currentIndex < QUIZ_DATA.length - 1) {
    quizState.currentIndex += 1;
    quizState.selectedAnswer = null;
    renderQuiz();
  } else {
    quizState.finished = true;
    currentXp += quizState.score * 50;
    updateHeaderMetrics();
    renderQuiz();
  }
}

// ─────────────────────────────────────────────────────────────
// ZULU AI GEMINI-STYLE CHAT CONTROLLER
// ─────────────────────────────────────────────────────────────
function formatZuluMarkdown(text) {
  if (!text) return '';
  return text
    .replace(/^### (.*$)/gim, '<h4 class="font-bold text-white text-base my-2 text-purple-300">$1</h4>')
    .replace(/^## (.*$)/gim, '<h3 class="font-bold text-white text-lg my-2 text-purple-200">$1</h3>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong class="text-white font-semibold">$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em class="text-purple-200">$1</em>')
    .replace(/`([^`]+)`/gim, '<code class="bg-black/60 px-1.5 py-0.5 rounded text-cyan-300 font-mono text-[11px]">$1</code>')
    .replace(/^• (.*$)/gim, '<li class="ml-4 list-disc text-gray-200 text-sm my-1">$1</li>')
    .replace(/^- (.*$)/gim, '<li class="ml-4 list-disc text-gray-200 text-sm my-1">$1</li>')
    .replace(/\n\n/g, '<br/><br/>')
    .replace(/\n/g, '<br/>');
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

  // Render User Message (clean, spacious right-aligned bubble)
  const userDiv = document.createElement('div');
  userDiv.className = 'flex justify-end';
  userDiv.innerHTML = `
    <div class="max-w-[85%] sm:max-w-[75%] p-4 rounded-3xl rounded-br-md bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm leading-relaxed shadow-lg">
      ${text}
    </div>
  `;
  messagesBox.appendChild(userDiv);
  messagesBox.scrollTop = messagesBox.scrollHeight;

  // Typing Indicator
  const typingDiv = document.createElement('div');
  typingDiv.id = 'zulu-typing-indicator';
  typingDiv.className = 'flex justify-start items-center gap-3';
  typingDiv.innerHTML = `
    <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-cyan-500 flex items-center justify-center text-xs text-white shrink-0">✨</div>
    <div class="bg-gray-900/90 border border-purple-500/30 px-4 py-2.5 rounded-2xl flex items-center gap-2 shadow-sm">
      <span class="text-xs text-purple-300 font-medium">Zulu is thinking...</span>
      <div class="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce"></div>
      <div class="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
      <div class="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
    </div>
  `;
  messagesBox.appendChild(typingDiv);
  messagesBox.scrollTop = messagesBox.scrollHeight;

  const studentContext = {
    studentName: 'Ashay Verma',
    institution: 'All India Institute of Ayurveda (AIIA)',
    department: 'Ayurvedic Pharmacology & Health-AI',
    xp: currentXp,
    streak: currentStreak,
    targetRole: 'Herbal Formulation Scientist'
  };

  const res = await JoblexApiClient.askZulu(text, studentContext);

  const ind = document.getElementById('zulu-typing-indicator');
  if (ind) ind.remove();

  // Render Zulu Response (Gemini-style open text with avatar)
  const formattedReply = formatZuluMarkdown(res.reply);
  const zuluDiv = document.createElement('div');
  zuluDiv.className = 'flex justify-start items-start gap-3';
  zuluDiv.innerHTML = `
    <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-xs text-white shrink-0 shadow-[0_0_10px_rgba(168,85,247,0.4)]">
      ✨
    </div>
    <div class="max-w-[85%] sm:max-w-[78%] p-4 sm:p-5 rounded-3xl rounded-tl-md bg-gray-900/90 border border-gray-800 text-gray-100 text-sm leading-relaxed shadow-md space-y-2">
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
    <div class="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-purple-950/60 via-indigo-950/50 to-gray-900 border border-purple-500/40 shadow-xl space-y-3">
      <div class="flex justify-between items-start">
        <span class="text-[10px] uppercase font-bold text-purple-300 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/40">
          Anonymized Peer Benchmark
        </span>
        <span class="text-xs font-mono font-black text-cyan-300">78th Percentile</span>
      </div>
      <h3 class="text-base sm:text-lg font-bold text-white">Compare With Scholars Placed at Dabur & Himalaya</h3>
      <p class="text-xs text-gray-300 leading-relaxed">
        Scholars with verified offers averaged an <strong>86% Competency Score</strong>. Your profile matches 3 out of 5 required industrial skills.
      </p>
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 text-xs">
        <div class="p-2.5 rounded-xl bg-black/40 border border-gray-800"><span class="text-gray-400 block text-[10px]">Your Score</span><strong class="text-purple-400">74%</strong></div>
        <div class="p-2.5 rounded-xl bg-black/40 border border-gray-800"><span class="text-gray-400 block text-[10px]">Placed Peers</span><strong class="text-emerald-400">86% Avg</strong></div>
        <div class="p-2.5 rounded-xl bg-black/40 border border-gray-800 col-span-2 sm:col-span-1"><span class="text-gray-400 block text-[10px]">Delta</span><strong class="text-amber-400">-12% Gap</strong></div>
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

  // Draw Edges
  edges.forEach(([from, to]) => {
    ctx.beginPath();
    ctx.moveTo(nodes[from].x, nodes[from].y);
    ctx.lineTo(nodes[to].x, nodes[to].y);
    ctx.strokeStyle = '#4b5563';
    ctx.lineWidth = 2;
    ctx.stroke();
  });

  // Draw Nodes
  nodes.forEach(n => {
    ctx.beginPath();
    ctx.arc(n.x, n.y, 14, 0, Math.PI * 2);
    ctx.fillStyle = n.acquired ? '#a855f7' : '#374151';
    ctx.fill();
    ctx.strokeStyle = n.acquired ? '#c084fc' : '#6b7280';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Node Text
    ctx.fillStyle = n.acquired ? '#ffffff' : '#9ca3af';
    ctx.font = 'bold 11px Segoe UI, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(n.name, n.x, n.y + 28);
  });
}
