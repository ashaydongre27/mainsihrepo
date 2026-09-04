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
  { name: 'Ashay Verma', college: 'All India Institute of Ayurveda', match: 94, skills: ['Herbal Formulation', 'GLP', 'Phytochemistry', 'Python'], status: 'Ready for Interview' },
  { name: 'Kavya Singh', college: 'AIIA New Delhi', match: 91, skills: ['Health Informatics', 'Python', 'NLP for Classical Texts', 'SQL'], status: 'Shortlisted' },
  { name: 'Rohan Sharma', college: 'National Institute of Ayurveda, Jaipur', match: 82, skills: ['Ayurvedic Pharmacognosy', 'Standardization', 'Quality Control'], status: 'Under Review' },
  { name: 'Ananya Roy', college: 'Banaras Hindu University (IMS)', match: 88, skills: ['Clinical Research', 'Pharmacology', 'Herbal Formulation'], status: 'Shortlisted' },
  { name: 'Priya Nair', college: 'Gujarat Ayurved University, Jamnagar', match: 96, skills: ['Drug Discovery', 'Phytochemistry', 'HPTLC', 'AutoDock'], status: 'Top Applicant' }
];

document.addEventListener('DOMContentLoaded', async () => {
  renderIndustryApplications('All');
  renderCandidates();
  renderTalentForecast();
  renderReverseCandidates('');
  renderBootcamps();
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

  document.querySelectorAll('.industry-nav-tab').forEach(btn => {
    if (btn.getAttribute('data-tab') === tabId) {
      btn.className = 'industry-nav-tab pb-2 text-xs sm:text-sm font-bold border-b-2 border-blue-500 text-blue-300 transition whitespace-nowrap flex items-center gap-1.5';
    } else {
      btn.className = 'industry-nav-tab pb-2 text-xs sm:text-sm font-medium border-b-2 border-transparent text-gray-400 hover:text-gray-200 transition whitespace-nowrap flex items-center gap-1.5';
    }
  });
}

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
      <div class="col-span-full p-8 rounded-3xl bg-gray-900/40 border border-gray-800 text-center space-y-3">
        <div class="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-xl mx-auto text-blue-400">📥</div>
        <h4 class="text-base font-bold text-white">No Applications in this category yet</h4>
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
      <div class="p-5 sm:p-6 rounded-3xl bg-gray-900/80 border border-gray-800 hover:border-blue-500/50 transition shadow-lg flex flex-col justify-between space-y-4">
        <div class="space-y-3">
          <div class="flex justify-between items-start gap-2">
            <div>
              <div class="flex items-center gap-2">
                <h4 class="text-base font-extrabold text-white">${app.studentName}</h4>
                <span class="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-semibold">
                  🛡️ ${app.verifiedBadge || 'AIIA Verified'}
                </span>
              </div>
              <p class="text-xs text-gray-400 mt-0.5">${app.college}</p>
            </div>
            <div class="text-right">
              <span class="text-sm font-mono font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                ${app.match}% Match
              </span>
              <span class="text-[10px] text-gray-500 block">Applied: ${app.appliedDate}</span>
            </div>
          </div>

          <div class="p-3 rounded-2xl bg-black/40 border border-gray-800 space-y-1.5">
            <div class="flex justify-between items-center text-xs">
              <span class="text-gray-400">Position Applied:</span>
              <span class="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                isInternship ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              }">${app.type}</span>
            </div>
            <div class="font-bold text-white text-xs sm:text-sm">${app.opportunityTitle}</div>
            <div class="text-[11px] text-blue-300">${app.company}</div>
          </div>

          <p class="text-xs text-gray-300 italic border-l-2 border-purple-500/60 pl-2.5 py-0.5">
            "${app.coverNote || 'Application submitted with AIIA verified credentials.'}"
          </p>

          <div>
            <span class="text-[10px] text-gray-400 font-semibold block mb-1.5">Verified Institutional Competencies:</span>
            <div class="flex flex-wrap gap-1.5">
              ${(app.skills || []).map(s => `
                <span class="px-2 py-0.5 rounded-md bg-blue-950/40 border border-blue-500/30 text-[11px] text-blue-200">${s}</span>
              `).join('')}
            </div>
          </div>
        </div>

        <div class="pt-3 border-t border-gray-800 space-y-2.5">
          <div class="flex justify-between items-center">
            <span class="text-xs text-gray-400">Current Status:</span>
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
    <div class="p-5 rounded-2xl bg-gray-900/60 border border-gray-800 hover:border-blue-500/40 transition shadow-md flex flex-col justify-between space-y-4">
      <div>
        <div class="flex justify-between items-start mb-2">
          <div>
            <h4 class="font-bold text-sm text-white">${c.name}</h4>
            <p class="text-xs text-gray-400">${c.college}</p>
          </div>
          <div class="text-right">
            <span class="text-xs font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 font-mono text-base block">${c.match}% Match</span>
            <span class="text-[10px] text-gray-400">${c.status}</span>
          </div>
        </div>

        <div class="flex flex-wrap gap-1.5 mt-3">
          ${c.skills.map(s => `
            <span class="px-2 py-0.5 rounded-md bg-blue-950/50 border border-blue-500/30 text-[11px] text-blue-200">${s}</span>
          `).join('')}
        </div>
      </div>

      <div class="flex gap-2 pt-3 border-t border-gray-800">
        <button onclick="alert('Viewing full verified AIIA institutional dossier for ${c.name}')" class="flex-1 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-semibold text-xs transition">
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
    <div class="p-5 rounded-2xl bg-gray-900/70 border border-purple-500/30 shadow-md flex flex-col justify-between space-y-3">
      <div>
        <div class="flex justify-between items-start">
          <div>
            <div class="flex items-center gap-2">
              <h4 class="font-bold text-sm text-white">${c.name}</h4>
              <span class="text-[9px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">Never Applied (Hidden Talent)</span>
            </div>
            <p class="text-xs text-gray-400 mt-0.5">${c.college}</p>
          </div>
          <span class="text-xs font-mono font-bold text-cyan-300">${c.match}% Skill Fit</span>
        </div>

        <div class="flex flex-wrap gap-1.5 mt-3">
          ${(c.skills || []).map(s => `
            <span class="px-2 py-0.5 rounded-md bg-gray-800 border border-gray-700 text-[11px] text-purple-200">${s}</span>
          `).join('')}
        </div>
      </div>

      <div class="pt-3 border-t border-gray-800 flex justify-between items-center">
        <span class="text-[11px] text-gray-400">Open to Inbound Recruitment</span>
        <button id="inbound-btn-${i}" onclick="sendDirectInboundInvite('${c.name}', 'Herbal Formulation Scientist', this)" class="px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold text-xs transition shadow-sm">
          ⚡ Send Direct Inbound Invite
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
  alert(res.message || `Direct inbound interview invitation transmitted to ${name}!`);
}

function handleFilterReverseCandidates() {
  const input = document.getElementById('reverse-skill-search');
  renderReverseCandidates(input ? input.value : '');
}

// ─────────────────────────────────────────────────────────────
// IDEA #8: SPONSORED SKILL BOOTCAMPS
// ─────────────────────────────────────────────────────────────
async function renderBootcamps() {
  const container = document.getElementById('bootcamps-grid');
  if (!container) return;

  const res = await JoblexApiClient.getBootcamps();
  const list = res.bootcamps || [];

  container.innerHTML = list.map(b => `
    <div class="p-5 rounded-2xl bg-gray-900/60 border border-blue-500/30 backdrop-blur-md space-y-3 flex flex-col justify-between">
      <div>
        <div class="flex justify-between items-start gap-2">
          <h4 class="font-bold text-sm text-white">${b.title}</h4>
          <span class="text-[10px] uppercase font-bold text-emerald-300 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40">${b.status}</span>
        </div>
        <p class="text-xs text-gray-400 mt-1">Co-Branded Partner: <strong class="text-gray-200">${b.partnerCollege}</strong></p>
        <p class="text-xs text-cyan-300 mt-0.5">Outcome: ${b.guaranteedOutcome}</p>

        <div class="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-gray-800 text-xs text-gray-300">
          <div>Target Hires: <strong>${b.targetHires} Positions</strong></div>
          <div>Pre-Matched Scholars: <strong class="text-purple-300">${b.matchedScholars} Candidates</strong></div>
          <div class="col-span-2 text-gray-400">Bounty / Support: ${b.stipend}</div>
        </div>
      </div>

      <button onclick="alert('Viewing enrolled student cohort dossier for ${b.title}')" class="w-full py-2 rounded-xl bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/40 text-blue-200 font-bold text-xs transition">
        Manage Bootcamp Cohort
      </button>
    </div>
  `).join('');
}

async function handleCreateBootcamp(e) {
  e.preventDefault();
  const title = document.getElementById('bc-title').value;
  const partnerCollege = document.getElementById('bc-college').value;
  const targetHires = document.getElementById('bc-hires').value;

  await JoblexApiClient.createBootcamp({ title, partnerCollege, targetHires });
  alert(`Sponsored Bootcamp "${title}" co-branded with ${partnerCollege} launched! Auto-matching enrolled scholars...`);
  e.target.reset();
  renderBootcamps();
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
      <div class="p-3.5 rounded-xl bg-black/40 border border-gray-800 space-y-1 text-xs">
        <div class="flex justify-between items-center">
          <span class="font-bold text-white">${log.candidate} (Rated: ${log.actualLabRating} / 5.0)</span>
          <span class="text-[10px] text-cyan-300 font-mono">Predicted: ${log.predictedMatch}% Match</span>
        </div>
        <p class="text-gray-400">${log.note}</p>
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
  alert(`Performance feedback recorded for ${candidateName}! The AI skill weighting engine has adjusted to improve prediction precision.`);
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
    <div class="p-4 rounded-2xl bg-black/40 border border-gray-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
      <div>
        <h4 class="font-bold text-xs sm:text-sm text-white">${inst.institution}</h4>
        <span class="text-xs text-cyan-300 mt-0.5 block">Trending Competency: ${inst.trendingSkill}</span>
      </div>
      <div class="flex items-center gap-3 self-end sm:self-auto">
        <span class="text-xs text-gray-400 font-mono">Available: <strong>${inst.readyScholars} Scholars</strong></span>
        <button onclick="alert('Booking priority campus interview slot with ${inst.institution}')" class="px-3 py-1.5 rounded-xl bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/40 text-blue-200 font-bold text-xs transition">
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
  alert(`Opportunity / Micro-Gig "${title}" has been published to the student portal and verified by AIIA liaison!`);
  e.target.reset();
  switchIndustryTab('Candidates');
}

async function handleSubmitSkillDemand(e) {
  e.preventDefault();
  await JoblexApiClient.submitSkillDemand({});
  alert('Corporate Skill Demand successfully submitted to Academic Deans for curriculum modernization under NEP-2020!');
  e.target.reset();
}
