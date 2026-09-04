/**
 * JOBLEX Academy Portal UI Controller (Client-Side JavaScript)
 * Pure frontend DOM, rendering, and interaction logic
 * Fully integrated with all SIH 26044 features:
 * 9. Automated Curriculum Gap Audit (NEP-2020 / NAAC)
 * 10. Placement Cell Command Center
 * 11. Cross-College Benchmarking (Opt-In & Anonymized)
 * 8. Academic Co-Branded Bootcamps
 */

let activeAcademyTab = 'Progress';

const DEPARTMENTAL_READINESS_DATA = [
  { dept: 'Ayurvedic Pharmacology (Dravyaguna)', head: 'Dr. Rajeshwari Rao', obe: 94, labIndex: 'High (GLP / HPTLC)', bosStatus: 'Approved (NEP-2020)', naacCriterion: 'Criterion 3.4 Compliant' },
  { dept: 'Rasashastra & Bhaishajya Kalpana (Pharmaceutics)', head: 'Prof. Alok Tripathi', obe: 91, labIndex: 'High (Extraction Core)', bosStatus: 'BoS Review Scheduled', naacCriterion: 'Criterion 3.4 Compliant' },
  { dept: 'Ayush Health Informatics & Data Science', head: 'Dr. Sneha Kulkarni', obe: 96, labIndex: 'Active (Python/EHR)', bosStatus: 'Approved (NEP-2020)', naacCriterion: 'Criterion 1.2 Compliant' },
  { dept: 'Swasthavritta & Preventive Medicine', head: 'Dr. Manoj Sharma', obe: 88, labIndex: 'Moderate (Community)', bosStatus: 'In Audit Stage', naacCriterion: 'Criterion 2.1 Compliant' },
  { dept: 'Kaya Chikitsa & Clinical Diagnostics', head: 'Prof. Virendra Sen', obe: 93, labIndex: 'High (Hospital Link)', bosStatus: 'Approved (NEP-2020)', naacCriterion: 'Criterion 3.4 Compliant' }
];

const SYLLABUS_PROPOSALS = [
  {
    id: 'syl-101',
    currentTopic: 'Traditional Herbal Pharmacognosy (Unit 3)',
    suggestedAddition: 'Computational Molecular Docking of Botanicals using Python & AutoDock',
    source: 'MoU Partner: Dabur Research & Development Ltd.',
    impact: 'Closes 68% candidate gap for Formulation Scientist positions',
    adopted: false
  },
  {
    id: 'syl-102',
    currentTopic: 'Herbal Standardization & Quality Control (Unit 5)',
    suggestedAddition: 'Automated High-Performance Thin-Layer Chromatography (HPTLC) Fingerprinting Protocols',
    source: 'MoU Partner: Himalaya Wellness R&D',
    impact: 'Required for Good Laboratory Practice (GLP) industrial compliance',
    adopted: false
  },
  {
    id: 'syl-103',
    currentTopic: 'Clinical Medicine Protocols (Unit 2)',
    suggestedAddition: 'Digital Health Records & AI-Powered Prakriti Profiling Databases',
    source: 'National AYUSH Mission Initiative 2026',
    impact: 'Meets NEP-2020 technology integration benchmarks',
    adopted: false
  }
];

document.addEventListener('DOMContentLoaded', async () => {
  // Auth Guard: ensure user is authenticated before accessing academy portal
  if (!JoblexApiClient.requireAuth('academy')) return;

  initAcademySidebarState();
  renderDepartmentalReadiness();
  renderSyllabusProposals();
  renderTPOMetrics();
  renderCrossCollegeBenchmarking();
  renderConsultancyGrants();
});

function switchAcademyTab(tabId) {
  activeAcademyTab = tabId;

  document.querySelectorAll('.academy-tab-content').forEach(el => el.classList.add('hidden'));

  const target = document.getElementById(`academy-tab-${tabId}`);
  if (target) target.classList.remove('hidden');

  // Update Desktop Sidebar Buttons
  document.querySelectorAll('.academy-sidebar-btn').forEach(btn => {
    if (btn.getAttribute('data-tab') === tabId) {
      btn.className = 'academy-sidebar-btn sidebar-nav-btn w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all bg-emerald-600/25 border border-emerald-500/80 text-emerald-100 shadow-[0_0_15px_rgba(16,185,129,0.25)]';
    } else {
      btn.className = 'academy-sidebar-btn sidebar-nav-btn w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all text-gray-400 hover:text-white hover:bg-white/5 border border-transparent';
    }
  });

  // Update Mobile Drawer Buttons
  document.querySelectorAll('.academy-mobile-nav-btn').forEach(btn => {
    if (btn.getAttribute('data-tab') === tabId) {
      btn.className = 'academy-mobile-nav-btn w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs font-bold transition bg-emerald-600/30 border border-emerald-500 text-emerald-100';
    } else {
      btn.className = 'academy-mobile-nav-btn w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs font-bold transition text-gray-300 hover:bg-white/5 border border-transparent';
    }
  });

  closeAcademyMobileMenu();
}

function initAcademySidebarState() {
  const isCollapsed = localStorage.getItem('joblex_academy_sidebar_collapsed') === 'true';
  applyAcademySidebarState(isCollapsed);
}

function toggleAcademySidebarCollapse() {
  const sidebar = document.getElementById('academy-sidebar');
  if (!sidebar) return;
  const isNowCollapsed = !sidebar.classList.contains('sidebar-collapsed');
  localStorage.setItem('joblex_academy_sidebar_collapsed', isNowCollapsed ? 'true' : 'false');
  applyAcademySidebarState(isNowCollapsed);
}

function applyAcademySidebarState(collapsed) {
  const sidebar = document.getElementById('academy-sidebar');
  const toggleBtn = document.getElementById('academy-sidebar-collapse-btn');
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

function toggleAcademyMobileMenu() {
  const drawer = document.getElementById('academy-mobile-drawer');
  if (drawer) drawer.classList.toggle('hidden');
}

function closeAcademyMobileMenu() {
  const drawer = document.getElementById('academy-mobile-drawer');
  if (drawer) drawer.classList.add('hidden');
}

window.switchAcademyTab = switchAcademyTab;
window.toggleAcademySidebarCollapse = toggleAcademySidebarCollapse;
window.toggleAcademyMobileMenu = toggleAcademyMobileMenu;
window.closeAcademyMobileMenu = closeAcademyMobileMenu;

function renderDepartmentalReadiness() {
  const tbody = document.getElementById('dept-readiness-table-body');
  if (!tbody) return;

  tbody.innerHTML = DEPARTMENTAL_READINESS_DATA.map(d => {
    const obeColor = d.obe >= 90 ? 'text-emerald-400' : 'text-cyan-400';
    let bosBadge = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    if (d.bosStatus.includes('Review') || d.bosStatus.includes('Audit')) {
      bosBadge = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    }

    return `
      <tr class="border-b border-gray-800 hover:bg-white/[0.02] transition">
        <td class="py-3 px-4 text-xs font-semibold text-white">${d.dept}</td>
        <td class="py-3 px-4 text-xs text-gray-300">${d.head}</td>
        <td class="py-3 px-4 text-xs font-mono font-bold ${obeColor}">${d.obe}% Attained</td>
        <td class="py-3 px-4 text-xs text-gray-300">${d.labIndex}</td>
        <td class="py-3 px-4 text-xs">
          <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${bosBadge}">
            ${d.bosStatus}
          </span>
        </td>
        <td class="py-3 px-4 text-xs">
          <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold border bg-purple-500/20 text-purple-300 border-purple-500/40">
            ${d.naacCriterion}
          </span>
        </td>
      </tr>
    `;
  }).join('');
}

function renderSyllabusProposals() {
  const container = document.getElementById('syllabus-proposals-grid');
  if (!container) return;

  container.innerHTML = SYLLABUS_PROPOSALS.map(prop => `
    <div class="p-5 rounded-2xl bg-gray-900/60 border ${prop.adopted ? 'border-emerald-500/50 bg-emerald-950/20' : 'border-gray-800'} backdrop-blur-md space-y-3">
      <div class="flex items-center justify-between">
        <span class="text-[10px] uppercase font-bold text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30">
          AI Curriculum Recommendation
        </span>
        <span class="text-xs text-gray-400 font-mono">${prop.source}</span>
      </div>
      <div>
        <h4 class="text-xs text-gray-400 font-semibold mb-0.5">Target Course Topic:</h4>
        <p class="text-xs text-gray-200">${prop.currentTopic}</p>
      </div>
      <div class="p-3 rounded-xl bg-black/40 border border-emerald-500/20">
        <h4 class="text-xs text-emerald-300 font-bold mb-1">💡 Proposed Syllabus Modernization:</h4>
        <p class="text-xs sm:text-sm text-white font-medium">${prop.suggestedAddition}</p>
        <span class="text-[11px] text-gray-400 mt-1 block">Impact: ${prop.impact}</span>
      </div>
      <div class="flex items-center justify-end gap-2 pt-2">
        ${prop.adopted 
          ? `<span class="text-xs text-emerald-400 font-bold px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40">✓ Adopted for Academic Council</span>`
          : `
            <button onclick="adoptProposal('${prop.id}')" class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition">
              Adopt Syllabus Add-on
            </button>
          `
        }
      </div>
    </div>
  `).join('');
}

async function adoptProposal(id) {
  const p = SYLLABUS_PROPOSALS.find(x => x.id === id);
  if (p) {
    p.adopted = true;
    renderSyllabusProposals();
    await JoblexApiClient.adoptSyllabus(id);
  }
}

async function renderTPOMetrics() {
  const data = await JoblexApiClient.getAcademyData();
  const tpo = data.tpoMetrics || {
    funnel: { applied: 248, shortlisted: 94, offersAccepted: 52 },
    predictivePlacementReadiness: 84
  };

  const appliedEl = document.getElementById('tpo-applied');
  const shortEl = document.getElementById('tpo-shortlisted');
  const placedEl = document.getElementById('tpo-placed');
  const readinessEl = document.getElementById('tpo-readiness');

  if (appliedEl) appliedEl.innerText = tpo.funnel.applied;
  if (shortEl) shortEl.innerText = tpo.funnel.shortlisted;
  if (placedEl) placedEl.innerText = tpo.funnel.offersAccepted;
  if (readinessEl) readinessEl.innerText = `${tpo.predictivePlacementReadiness}% Placement Ready`;
}

// ─────────────────────────────────────────────────────────────
// IDEA #11: CROSS-COLLEGE BENCHMARKING
// ─────────────────────────────────────────────────────────────
async function renderCrossCollegeBenchmarking() {
  const container = document.getElementById('cross-college-table-body');
  if (!container) return;

  const data = await JoblexApiClient.getCrossCollegeBenchmarking();
  const institutions = data.institutions || [];

  container.innerHTML = institutions.map(inst => `
    <tr class="border-b border-gray-800 ${inst.status === 'Your Institution' ? 'bg-emerald-950/20 font-semibold' : 'hover:bg-white/[0.02]'} transition">
      <td class="py-3.5 px-4 text-xs font-mono font-bold text-emerald-400">#${inst.rank}</td>
      <td class="py-3.5 px-4 text-xs text-white">
        ${inst.institution}
        ${inst.status === 'Your Institution' ? '<span class="ml-2 text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">Your Campus</span>' : ''}
      </td>
      <td class="py-3.5 px-4 text-xs font-mono text-cyan-300 font-bold">${inst.avgSkillScore}%</td>
      <td class="py-3.5 px-4 text-xs font-mono text-emerald-300">${inst.placementRate}</td>
      <td class="py-3.5 px-4 text-xs text-gray-300">${inst.mouCount} Active MoUs</td>
      <td class="py-3.5 px-4 text-xs">
        <span class="px-2 py-0.5 rounded bg-gray-800 border border-purple-500/30 text-purple-200 text-[10px] font-bold">
          ${inst.naacGrade}
        </span>
      </td>
    </tr>
  `).join('');
}

// ─────────────────────────────────────────────────────────────
// IDEA #9: INTERACTIVE CURRICULUM GAP AUDIT
// ─────────────────────────────────────────────────────────────
async function handleRunCurriculumAudit(e) {
  if (e) e.preventDefault();
  const dept = document.getElementById('audit-dept-select') ? document.getElementById('audit-dept-select').value : 'Dravyaguna';
  const text = document.getElementById('audit-syllabus-text') ? document.getElementById('audit-syllabus-text').value : '';
  const resultBox = document.getElementById('audit-results-box');

  const res = await JoblexApiClient.runCurriculumAudit(text, dept);

  if (resultBox && res) {
    resultBox.classList.remove('hidden');

    document.getElementById('audit-coverage-score').innerText = `${res.coverageScore}%`;
    document.getElementById('audit-naac-score').innerText = res.naacCriterionScore;

    const gapsBox = document.getElementById('audit-critical-gaps-list');
    if (gapsBox && res.criticalGapsIdentified) {
      gapsBox.innerHTML = res.criticalGapsIdentified.map(g => `
        <div class="p-3 rounded-xl bg-black/40 border border-amber-500/30 space-y-1 text-xs">
          <div class="flex justify-between items-center">
            <span class="font-bold text-amber-300">${g.unit}</span>
            <span class="text-[10px] text-gray-400">Missing Competency</span>
          </div>
          <p class="font-semibold text-white">${g.gap}</p>
          <span class="text-[11px] text-gray-400 mt-0.5 block">${g.impact}</span>
        </div>
      `).join('');
    }

    resultBox.scrollIntoView({ behavior: 'smooth' });
  }
}

// ─────────────────────────────────────────────────────────────
// R&D CONSULTANCY GRANTS & CORPORATE PROBLEM BIDS
// ─────────────────────────────────────────────────────────────
async function renderConsultancyGrants() {
  const container = document.getElementById('academy-grants-grid');
  if (!container) return;

  const academyData = await JoblexApiClient.getAcademyData();
  const grants = (academyData && academyData.consultancyGrants && academyData.consultancyGrants.length)
    ? academyData.consultancyGrants
    : [
      {
        id: "cg-01",
        title: "Standardization of Ashwagandha Active Withanolides in Water-Soluble Matrix",
        industry: "Dabur R&D",
        grantAmount: "₹18,50,000",
        deadline: "2026-11-15",
        targetDept: "Dravyaguna / Pharmaceutical Sciences",
        status: "Open for Faculty Proposals"
      },
      {
        id: "cg-02",
        title: "Bio-Efficacy Validation of Triphala Nano-Suspension in Gut Microbiome Models",
        industry: "Himalaya Drug Co.",
        grantAmount: "₹24,00,000",
        deadline: "2026-12-01",
        targetDept: "Kaya Chikitsa & Microbiology",
        status: "Open for Faculty Proposals"
      },
      {
        id: "cg-03",
        title: "Phytochemical Characterization & Stability Testing of Classical Polyherbal Extracts",
        industry: "Aimil Pharmaceuticals",
        grantAmount: "₹12,00,000",
        deadline: "2026-12-15",
        targetDept: "Rasashastra & Bhaishajya Kalpana",
        status: "Open for Faculty Proposals"
      }
    ];

  container.innerHTML = grants.map(g => `
    <div class="p-5 rounded-2xl bg-gray-900/60 border border-amber-500/30 backdrop-blur-md space-y-3 flex flex-col justify-between">
      <div>
        <div class="flex justify-between items-start gap-2">
          <h4 class="font-bold text-sm text-white">${g.title}</h4>
          <span class="text-[10px] font-bold text-amber-300 px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 whitespace-nowrap">${g.status || 'Open for Bids'}</span>
        </div>
        <p class="text-xs text-gray-400 mt-1">Funding Partner: <strong class="text-white">${g.industry}</strong></p>
        <p class="text-xs text-cyan-300 mt-0.5">Target Department: ${g.targetDept}</p>

        <div class="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-gray-800 text-xs text-gray-300">
          <div>Grant Amount: <strong class="text-amber-400 text-sm font-black">${g.grantAmount}</strong></div>
          <div>Proposal Deadline: <strong class="text-gray-300 font-mono">${g.deadline}</strong></div>
          <div class="col-span-2 text-[11px] text-gray-400">Includes 15% Institutional Overhead + Lab Equipment Grant</div>
        </div>
      </div>

      <div class="pt-2 border-t border-gray-800 flex items-center justify-between">
        <button onclick="prefillGrantBid('${g.id}', '${g.industry} — ${g.title}')" class="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-gray-950 font-black text-xs transition">
          Draft Departmental Bid
        </button>
        <button onclick="alert('Downloading Grant R&D Specifications & RFP Document for: ${g.title}')" class="px-3.5 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium text-xs transition border border-gray-700">
          Download RFP Specs 📄
        </button>
      </div>
    </div>
  `).join('');
}

function prefillGrantBid(grantId, grantTitle) {
  const select = document.getElementById('grant-target-select');
  if (select) {
    select.value = grantId;
  }
  const form = document.querySelector('#academy-tab-Grants form');
  if (form) form.scrollIntoView({ behavior: 'smooth' });
}

function handleGrantProposalSubmit(e) {
  e.preventDefault();
  const pi = document.getElementById('grant-pi-name').value;
  const budget = document.getElementById('grant-budget').value;
  alert(`Research proposal submitted by ${pi} for ${budget}! The Corporate Research Committee will review within 5 business days.`);
  e.target.reset();
}

window.prefillGrantBid = prefillGrantBid;
window.handleGrantProposalSubmit = handleGrantProposalSubmit;
window.handleRunCurriculumAudit = handleRunCurriculumAudit;
window.adoptProposal = adoptProposal;
