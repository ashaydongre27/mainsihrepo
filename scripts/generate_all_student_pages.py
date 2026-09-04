import os
from build_student_portal_pages import (
    HEAD_TEMPLATE,
    HEADER_TEMPLATE,
    FOOTER_TEMPLATE,
    SCRIPTS_TEMPLATE,
    make_drawer,
    make_sidebar
)

# 1. student-jobs.html
jobs_workspace = f"""  <!-- WORKSPACE -->
  <main class="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 custom-scrollbar">
    <div class="w-full max-w-max-width-canvas mx-auto">

      <!-- HERO BANNER -->
      <div class="bg-surface-container-lowest border border-[#e2e8f0] dark:border-gray-800 rounded p-5 mb-6">
        <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <span class="text-label-sm font-label-sm text-[#475569] dark:text-gray-400 uppercase tracking-wider font-semibold">Institutional Placement Gateway</span>
              <span class="text-[#cbd5e1] dark:text-gray-600">•</span>
              <span class="inline-flex items-center gap-1 text-[11px] font-mono-data text-[#065f46] dark:text-emerald-300 bg-[#ecfdf5] dark:bg-emerald-950/40 border border-[#a7f3d0] dark:border-emerald-800/60 px-2 py-0.5 rounded">
                <span class="w-1.5 h-1.5 rounded-full bg-[#047857] dark:bg-emerald-400"></span>
                Corporate Mandates Active — Verified AIIA MoU Partners
              </span>
            </div>
            <h1 class="text-headline-lg font-headline-lg text-[#0f172a] dark:text-white tracking-tight">
              Apply for Full-Time Corporate Placements
            </h1>
            <p class="text-body-sm font-body-sm text-[#475569] dark:text-gray-300">
              Submit verified credentials directly to corporate hiring portals for permanent R&amp;D roles. Fast-track technical interviews validated by the AIIA Dean's office.
            </p>
          </div>
          <div class="flex items-center gap-3">
            <div class="text-right">
              <div class="text-label-sm font-label-sm text-[#64748b] dark:text-gray-400">Verified Fit Level</div>
              <div class="text-headline-sm font-headline-sm font-bold text-[#0f172a] dark:text-white font-mono-data">92% Average</div>
            </div>
            <a href="student-portfolio.html" class="px-4 py-2.5 bg-[#0f172a] hover:bg-[#1e293b] dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-label-md font-label-md rounded flex items-center gap-2 transition-colors duration-150">
              <span class="material-symbols-outlined text-[18px]">verified</span>
              <span>View Dossier</span>
            </a>
          </div>
        </div>
      </div>

      <!-- JOBS GRID CONTAINER -->
      <div id="jobs-container" class="space-y-4">
        <!-- Rendered dynamically by student-ui.js -->
      </div>

    </div>
    {FOOTER_TEMPLATE}
  </main>
"""

jobs_html = (
    HEAD_TEMPLATE.replace("{page_title}", "Student | Apply for Full-Time Corporate Placements")
    + HEADER_TEMPLATE
    + make_drawer("student-jobs.html")
    + """<div class="flex-1 flex overflow-hidden">\n"""
    + make_sidebar("student-jobs.html")
    + jobs_workspace
    + """</div>\n"""
    + SCRIPTS_TEMPLATE
    + """</body></html>\n"""
)

# 2. student-internships.html
internships_workspace = f"""  <!-- WORKSPACE -->
  <main class="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 custom-scrollbar">
    <div class="w-full max-w-max-width-canvas mx-auto">

      <!-- HERO BANNER -->
      <div class="bg-surface-container-lowest border border-[#e2e8f0] dark:border-gray-800 rounded p-5 mb-6">
        <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <span class="text-label-sm font-label-sm text-[#475569] dark:text-gray-400 uppercase tracking-wider font-semibold">Corporate Research Fellowships &amp; Micro-Gigs</span>
              <span class="text-[#cbd5e1] dark:text-gray-600">•</span>
              <span class="inline-flex items-center gap-1 text-[11px] font-mono-data text-[#065f46] dark:text-emerald-300 bg-[#ecfdf5] dark:bg-emerald-950/40 border border-[#a7f3d0] dark:border-emerald-800/60 px-2 py-0.5 rounded">
                <span class="w-1.5 h-1.5 rounded-full bg-[#047857] dark:bg-emerald-400"></span>
                Paid Task Bounties Open
              </span>
            </div>
            <h1 class="text-headline-lg font-headline-lg text-[#0f172a] dark:text-white tracking-tight">
              Apply for Research Internships &amp; Micro-Gigs
            </h1>
            <p class="text-body-sm font-body-sm text-[#475569] dark:text-gray-300">
              Browse funded corporate research fellowships and 1-2 week task-based micro-gigs. Submitting applications transmits your verified AIIA credential package directly to corporate recruiters.
            </p>
          </div>
          <div class="flex items-center gap-3">
            <div class="text-right">
              <div class="text-label-sm font-label-sm text-[#64748b] dark:text-gray-400">Active Bounties</div>
              <div class="text-headline-sm font-headline-sm font-bold text-[#0f172a] dark:text-white font-mono-data">₹10,500 Available</div>
            </div>
          </div>
        </div>

        <!-- Filter Segmented Buttons -->
        <div class="mt-5 pt-4 border-t border-[#f1f5f9] dark:border-gray-800 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button id="filter-btn-all" onclick="filterInternshipTabs('All', this)" class="px-3.5 py-1.5 rounded text-label-sm font-label-sm font-bold bg-purple-600 text-white transition shadow-sm">
            All Opportunities
          </button>
          <button id="filter-btn-internship" onclick="filterInternshipTabs('Internship', this)" class="px-3.5 py-1.5 rounded text-label-sm font-label-sm font-medium bg-[#f8fafc] dark:bg-gray-900 border border-[#e2e8f0] dark:border-gray-800 text-[#475569] dark:text-gray-300 hover:border-purple-300 dark:hover:border-purple-500 transition">
            Corporate Internships
          </button>
          <button id="filter-btn-gig" onclick="filterInternshipTabs('Micro-Gig', this)" class="px-3.5 py-1.5 rounded text-label-sm font-label-sm font-semibold bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition">
            ⚡ Micro-Gigs (Task Bounties)
          </button>
        </div>
      </div>

      <!-- INTERNSHIPS GRID CONTAINER -->
      <div id="internships-container" class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <!-- Rendered dynamically by student-ui.js -->
      </div>

    </div>
    {FOOTER_TEMPLATE}
  </main>
"""

internships_html = (
    HEAD_TEMPLATE.replace("{page_title}", "Student | Apply for Research Internships & Micro-Gigs")
    + HEADER_TEMPLATE
    + make_drawer("student-internships.html")
    + """<div class="flex-1 flex overflow-hidden">\n"""
    + make_sidebar("student-internships.html")
    + internships_workspace
    + """</div>\n"""
    + """<script>
  function filterInternshipTabs(type, btn) {
    document.querySelectorAll('#filter-btn-all, #filter-btn-internship, #filter-btn-gig').forEach(b => {
      b.className = 'px-3.5 py-1.5 rounded text-label-sm font-label-sm font-medium bg-[#f8fafc] dark:bg-gray-900 border border-[#e2e8f0] dark:border-gray-800 text-[#475569] dark:text-gray-300 hover:border-purple-300 dark:hover:border-purple-500 transition';
    });
    btn.className = 'px-3.5 py-1.5 rounded text-label-sm font-label-sm font-bold bg-purple-600 text-white transition shadow-sm';
    if (typeof renderInternshipsBoard === 'function') {
      renderInternshipsBoard(type);
    }
  }
</script>\n"""
    + SCRIPTS_TEMPLATE
    + """</body></html>\n"""
)

# 3. student-quiz.html
quiz_workspace = f"""  <!-- WORKSPACE -->
  <main class="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 custom-scrollbar">
    <div class="w-full max-w-max-width-canvas mx-auto">

      <!-- HERO BANNER -->
      <div class="bg-surface-container-lowest border border-[#e2e8f0] dark:border-gray-800 rounded p-5 mb-6">
        <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <span class="text-label-sm font-label-sm text-[#475569] dark:text-gray-400 uppercase tracking-wider font-semibold">Technical Competency Validation</span>
              <span class="text-[#cbd5e1] dark:text-gray-600">•</span>
              <span class="inline-flex items-center gap-1 text-[11px] font-mono-data text-[#065f46] dark:text-emerald-300 bg-[#ecfdf5] dark:bg-emerald-950/40 border border-[#a7f3d0] dark:border-emerald-800/60 px-2 py-0.5 rounded">
                <span class="w-1.5 h-1.5 rounded-full bg-[#047857] dark:bg-emerald-400"></span>
                Anti-Decay XP Multiplier Active
              </span>
            </div>
            <h1 class="text-headline-lg font-headline-lg text-[#0f172a] dark:text-white tracking-tight">
              Interactive Quiz Arena &amp; Competency Assessment
            </h1>
            <p class="text-body-sm font-body-sm text-[#475569] dark:text-gray-300">
              Verify competencies in Ayurvedic pharmacology, chromatography, and healthcare informatics. Complete assessments to earn +250 XP and renew your 72-hour decay freeze.
            </p>
          </div>
          <div class="flex items-center gap-3">
            <div class="text-right">
              <div class="text-label-sm font-label-sm text-[#64748b] dark:text-gray-400">Assessment Bounty</div>
              <div class="text-headline-sm font-headline-sm font-bold text-purple-600 dark:text-purple-400 font-mono-data">+250 XP Available</div>
            </div>
          </div>
        </div>
      </div>

      <!-- QUIZ ARENA CONTAINER -->
      <div class="bg-surface-container-lowest border border-[#e2e8f0] dark:border-gray-800 rounded p-6 sm:p-8 shadow-sm">
        <div id="quiz-arena-container">
          <!-- Rendered dynamically by student-ui.js -->
        </div>
      </div>

    </div>
    {FOOTER_TEMPLATE}
  </main>
"""

quiz_html = (
    HEAD_TEMPLATE.replace("{page_title}", "Student | Interactive Quiz Arena")
    + HEADER_TEMPLATE
    + make_drawer("student-quiz.html")
    + """<div class="flex-1 flex overflow-hidden">\n"""
    + make_sidebar("student-quiz.html")
    + quiz_workspace
    + """</div>\n"""
    + SCRIPTS_TEMPLATE
    + """<script>
  document.addEventListener('DOMContentLoaded', () => {
    if (typeof renderQuiz === 'function') renderQuiz();
  });
</script>
</body></html>\n"""
)

# 4. student-resume.html
resume_workspace = f"""  <!-- WORKSPACE -->
  <main class="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 custom-scrollbar">
    <div class="w-full max-w-max-width-canvas mx-auto">

      <!-- HERO BANNER -->
      <div class="bg-surface-container-lowest border border-[#e2e8f0] dark:border-gray-800 rounded p-5 mb-6">
        <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <span class="text-label-sm font-label-sm text-[#475569] dark:text-gray-400 uppercase tracking-wider font-semibold">AI Competency Benchmarking</span>
              <span class="text-[#cbd5e1] dark:text-gray-600">•</span>
              <span class="inline-flex items-center gap-1 text-[11px] font-mono-data text-[#065f46] dark:text-emerald-300 bg-[#ecfdf5] dark:bg-emerald-950/40 border border-[#a7f3d0] dark:border-emerald-800/60 px-2 py-0.5 rounded">
                <span class="w-1.5 h-1.5 rounded-full bg-[#047857] dark:bg-emerald-400"></span>
                Automated Curriculum Mapping Active
              </span>
            </div>
            <h1 class="text-headline-lg font-headline-lg text-[#0f172a] dark:text-white tracking-tight">
              AI Resume Analyzer &amp; Skill Gap Discovery
            </h1>
            <p class="text-body-sm font-body-sm text-[#475569] dark:text-gray-300">
              Benchmark your credentials against industrial job descriptions from Dabur, Himalaya, and Patanjali. Missing skills are automatically flagged and injected into your Career Roadmap.
            </p>
          </div>
          <div class="flex items-center gap-3">
            <div class="text-right">
              <div class="text-label-sm font-label-sm text-[#64748b] dark:text-gray-400">Current Readiness</div>
              <div class="text-headline-sm font-headline-sm font-bold text-[#0f172a] dark:text-white font-mono-data">78% Match</div>
            </div>
          </div>
        </div>
      </div>

      <!-- RESUME SCANNER CONSOLE -->
      <div class="bg-surface-container-lowest border border-[#e2e8f0] dark:border-gray-800 rounded p-6 shadow-sm space-y-4">
        <div>
          <label class="block text-label-sm font-label-sm font-semibold text-[#0f172a] dark:text-gray-200 mb-1.5">Target Corporate Role Benchmark</label>
          <select id="target-role-select" class="w-full p-3 rounded bg-[#f8fafc] dark:bg-gray-900 border border-[#e2e8f0] dark:border-gray-700 text-body-sm font-body-sm text-[#0f172a] dark:text-white focus:ring-2 focus:ring-purple-500">
            <option value="Herbal Formulation Scientist">Herbal Formulation Scientist (Dabur India Ltd. R&amp;D)</option>
            <option value="Phytochemical Quality Control Officer">Phytochemical QC Officer (Patanjali Research Foundation)</option>
            <option value="Ayush Clinical Data Specialist">Ayush Clinical Data Specialist (Himalaya Wellness)</option>
            <option value="Bio-Informatics Research Associate">Bio-Informatics Research Associate (AIIA Digital Cell)</option>
          </select>
        </div>

        <div>
          <label class="block text-label-sm font-label-sm font-semibold text-[#0f172a] dark:text-gray-200 mb-1.5">Your Resume Content / CV Text</label>
          <textarea id="resume-textarea" rows="6" class="w-full p-4 rounded bg-[#f8fafc] dark:bg-gray-900 border border-[#e2e8f0] dark:border-gray-700 text-body-sm font-body-sm text-[#0f172a] dark:text-white font-mono-data leading-relaxed focus:ring-2 focus:ring-purple-500"></textarea>
        </div>

        <button onclick="handleAnalyzeResume()" class="w-full py-3 bg-[#0f172a] hover:bg-[#1e293b] dark:bg-purple-600 dark:hover:bg-purple-500 text-white font-label-md font-label-md rounded flex items-center justify-center gap-2 shadow-sm transition-colors duration-150">
          <span class="material-symbols-outlined text-[18px]">bolt</span>
          <span>Run AI Benchmark Scan &amp; Sync Missing Skills</span>
        </button>
      </div>

      <!-- RESULTS BOX -->
      <div id="resume-results-box" class="hidden mt-6 bg-surface-container-lowest border border-purple-200 dark:border-purple-500/40 rounded p-6 space-y-5 shadow-sm">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-[#f1f5f9] dark:border-gray-800">
          <div>
            <span class="text-label-sm font-label-sm text-[#64748b] dark:text-gray-400">Match Score with Corporate Benchmark</span>
            <div id="resume-match-score" class="text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono-data">78%</div>
          </div>
          <span class="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-label-sm font-label-sm font-bold">
            Benchmark Target: 85%
          </span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="p-4 rounded bg-[#f8fafc] dark:bg-gray-900/60 border border-[#e2e8f0] dark:border-gray-800 space-y-2">
            <span class="text-label-sm font-label-sm font-bold text-emerald-700 dark:text-emerald-400 block">Verified Matching Skills Found</span>
            <div id="resume-extracted-skills" class="flex flex-wrap gap-1.5"></div>
          </div>
          <div class="p-4 rounded bg-[#f8fafc] dark:bg-gray-900/60 border border-[#e2e8f0] dark:border-gray-800 space-y-2">
            <span class="text-label-sm font-label-sm font-bold text-amber-700 dark:text-amber-400 block">Identified Gaps (Synced to Roadmap)</span>
            <div id="resume-missing-skills" class="flex flex-wrap gap-1.5"></div>
          </div>
        </div>

        <div class="flex justify-end pt-2">
          <a href="student-roadmap.html" class="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-label-md font-label-md rounded flex items-center gap-2 transition">
            <span>View Synced Tasks in Career Roadmap ➔</span>
          </a>
        </div>
      </div>

    </div>
    {FOOTER_TEMPLATE}
  </main>
"""

resume_html = (
    HEAD_TEMPLATE.replace("{page_title}", "Student | AI Resume Analyzer & Gap Discovery")
    + HEADER_TEMPLATE
    + make_drawer("student-resume.html")
    + """<div class="flex-1 flex overflow-hidden">\n"""
    + make_sidebar("student-resume.html")
    + resume_workspace
    + """</div>\n"""
    + SCRIPTS_TEMPLATE
    + """</body></html>\n"""
)

# 5. student-zulu.html
zulu_workspace = f"""  <!-- WORKSPACE -->
  <main class="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 custom-scrollbar flex flex-col justify-between">
    <div class="w-full max-w-4xl mx-auto flex-1 flex flex-col justify-between">

      <div class="space-y-6 pb-28">
        <!-- Gemini-Style Greeting Hero -->
        <div id="zulu-welcome-hero" class="text-center py-8 sm:py-12 space-y-3">
          <div class="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 text-xl text-white shadow-md">
            ✨
          </div>
          <h1 class="text-2xl sm:text-4xl font-black text-[#0f172a] dark:text-white tracking-tight">
            Hello, <span class="user-name-display">Ashay</span>
          </h1>
          <p class="text-slate-600 dark:text-gray-400 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
            Where should we focus your Ayush career and research goals today?
          </p>

          <!-- Suggestion Cards Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto pt-4 text-left">
            <button onclick="sendQuickPrompt('How do I close my skill gap for Dabur Formulation Scientist?')" class="p-3.5 rounded bg-surface-container-lowest dark:bg-gray-900/60 hover:bg-slate-50 dark:hover:bg-gray-900/90 border border-[#e2e8f0] dark:border-gray-800 hover:border-purple-400 dark:hover:border-purple-500/50 transition shadow-sm space-y-1 group">
              <span class="text-sm">⚡</span>
              <h4 class="text-xs font-bold text-slate-800 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-300 transition">Dabur Skill Gaps</h4>
              <p class="text-[11px] text-slate-500 dark:text-gray-400 leading-normal">Analyze requirements for Formulation Scientist internships.</p>
            </button>

            <button onclick="sendQuickPrompt('Explain HPTLC fingerprinting in simple terms.')" class="p-3.5 rounded bg-surface-container-lowest dark:bg-gray-900/60 hover:bg-slate-50 dark:hover:bg-gray-900/90 border border-[#e2e8f0] dark:border-gray-800 hover:border-purple-400 dark:hover:border-purple-500/50 transition shadow-sm space-y-1 group">
              <span class="text-sm">🧪</span>
              <h4 class="text-xs font-bold text-slate-800 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-300 transition">Explain HPTLC</h4>
              <p class="text-[11px] text-slate-500 dark:text-gray-400 leading-normal">Chromatography standardization concepts in commercial Ayurveda.</p>
            </button>

            <button onclick="sendQuickPrompt('What are Micro-Gigs and how do I earn bounties?')" class="p-3.5 rounded bg-surface-container-lowest dark:bg-gray-900/60 hover:bg-slate-50 dark:hover:bg-gray-900/90 border border-[#e2e8f0] dark:border-gray-800 hover:border-purple-400 dark:hover:border-purple-500/50 transition shadow-sm space-y-1 group">
              <span class="text-sm">💼</span>
              <h4 class="text-xs font-bold text-slate-800 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-300 transition">Micro-Gigs &amp; Bounties</h4>
              <p class="text-[11px] text-slate-500 dark:text-gray-400 leading-normal">Earn paid task bounties through 1-2 week remote sprints.</p>
            </button>

            <button onclick="sendQuickPrompt('How does the Anti-Decay XP preservation system work?')" class="p-3.5 rounded bg-surface-container-lowest dark:bg-gray-900/60 hover:bg-slate-50 dark:hover:bg-gray-900/90 border border-[#e2e8f0] dark:border-gray-800 hover:border-purple-400 dark:hover:border-purple-500/50 transition shadow-sm space-y-1 group">
              <span class="text-sm">🔥</span>
              <h4 class="text-xs font-bold text-slate-800 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-300 transition">Anti-Decay XP</h4>
              <p class="text-[11px] text-slate-500 dark:text-gray-400 leading-normal">Understand 72h decay freeze and streak preservation.</p>
            </button>
          </div>
        </div>

        <!-- Chat Message Stream -->
        <div id="zulu-messages-box" class="space-y-4"></div>
      </div>

    </div>

    <!-- Centered Bottom Input Capsule -->
    <div class="fixed bottom-4 left-0 right-0 z-30 px-4 pointer-events-none">
      <div class="max-w-3xl mx-auto w-full pointer-events-auto">
        <form id="zulu-chat-form" onsubmit="handleZuluSend(event)" class="flex items-center gap-2 p-2 sm:p-2.5 rounded-full bg-white/95 dark:bg-[#121124]/95 border border-slate-300 dark:border-purple-500/40 backdrop-blur-xl shadow-xl dark:shadow-[0_10px_35px_rgba(0,0,0,0.8)] focus-within:border-purple-500 dark:focus-within:border-purple-400 transition">
          <div class="pl-3 text-purple-600 dark:text-purple-400">✨</div>
          <input id="zulu-input" type="text" placeholder="Ask Zulu about herbal formulations, career roadmaps, or exam prep..." class="flex-1 bg-transparent border-0 text-xs sm:text-sm text-[#0f172a] dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:ring-0 focus:outline-none" autocomplete="off"/>
          <button type="submit" class="p-2 rounded-full bg-purple-600 hover:bg-purple-500 text-white transition flex items-center justify-center shadow-md">
            <span class="material-symbols-outlined text-[18px]">arrow_upward</span>
          </button>
        </form>
      </div>
    </div>
  </main>
"""

zulu_html = (
    HEAD_TEMPLATE.replace("{page_title}", "Student | Zulu AI Companion")
    + HEADER_TEMPLATE
    + make_drawer("student-zulu.html")
    + """<div class="flex-1 flex overflow-hidden">\n"""
    + make_sidebar("student-zulu.html")
    + zulu_workspace
    + """</div>\n"""
    + SCRIPTS_TEMPLATE
    + """</body></html>\n"""
)

# 6. student-skilltree.html
skilltree_workspace = f"""  <!-- WORKSPACE -->
  <main class="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 custom-scrollbar">
    <div class="w-full max-w-max-width-canvas mx-auto">

      <!-- HERO BANNER -->
      <div class="bg-surface-container-lowest border border-[#e2e8f0] dark:border-gray-800 rounded p-5 mb-6">
        <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <span class="text-label-sm font-label-sm text-[#475569] dark:text-gray-400 uppercase tracking-wider font-semibold">2D Interactive Competency Graph</span>
              <span class="text-[#cbd5e1] dark:text-gray-600">•</span>
              <span class="inline-flex items-center gap-1 text-[11px] font-mono-data text-[#065f46] dark:text-emerald-300 bg-[#ecfdf5] dark:bg-emerald-950/40 border border-[#a7f3d0] dark:border-emerald-800/60 px-2 py-0.5 rounded">
                <span class="w-1.5 h-1.5 rounded-full bg-[#047857] dark:bg-emerald-400"></span>
                Constellation Visualizer Active
              </span>
            </div>
            <h1 class="text-headline-lg font-headline-lg text-[#0f172a] dark:text-white tracking-tight">
              Ayush Skill Constellation &amp; Dependency Tree
            </h1>
            <p class="text-body-sm font-body-sm text-[#475569] dark:text-gray-300">
              Interactive node graph representing acquired pharmaceutical capabilities and pending industrial prerequisite gaps.
            </p>
          </div>
          <div class="flex items-center gap-3">
            <div class="text-right">
              <div class="text-label-sm font-label-sm text-[#64748b] dark:text-gray-400">Validated Skills</div>
              <div class="text-headline-sm font-headline-sm font-bold text-purple-600 dark:text-purple-400 font-mono-data">4 of 6 Acquired</div>
            </div>
          </div>
        </div>
      </div>

      <!-- CANVAS CONTAINER -->
      <div class="bg-surface-container-lowest border border-[#e2e8f0] dark:border-gray-800 rounded p-6 shadow-sm">
        <div class="w-full h-[520px] rounded relative overflow-hidden bg-[#f8fafc] dark:bg-[#090a12] border border-[#e2e8f0] dark:border-gray-800">
          <canvas id="skill-tree-canvas" class="w-full h-full block"></canvas>
        </div>
        <div class="mt-4 flex flex-wrap items-center justify-between gap-4 text-label-sm font-label-sm text-[#64748b] dark:text-gray-400 border-t border-[#f1f5f9] dark:border-gray-800 pt-3">
          <div class="flex items-center gap-4">
            <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-full bg-purple-600"></span> Acquired Competency</span>
            <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-full bg-slate-300 dark:bg-gray-700"></span> Prerequisite Gap</span>
          </div>
          <span>AIIA Botanical Quality Standards • NEP-2020 OBE Compliant</span>
        </div>
      </div>

    </div>
    {FOOTER_TEMPLATE}
  </main>
"""

skilltree_html = (
    HEAD_TEMPLATE.replace("{page_title}", "Student | Skill Constellation")
    + HEADER_TEMPLATE
    + make_drawer("student-skilltree.html")
    + """<div class="flex-1 flex overflow-hidden">\n"""
    + make_sidebar("student-skilltree.html")
    + skilltree_workspace
    + """</div>\n"""
    + SCRIPTS_TEMPLATE
    + """<script>
  document.addEventListener('DOMContentLoaded', () => {
    if (typeof initSkillTree === 'function') initSkillTree();
  });
</script>
</body></html>\n"""
)

# 7. student-portfolio.html
portfolio_workspace = f"""  <!-- WORKSPACE -->
  <main class="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 custom-scrollbar">
    <div class="w-full max-w-max-width-canvas mx-auto">

      <!-- HERO BANNER -->
      <div class="bg-surface-container-lowest border border-[#e2e8f0] dark:border-gray-800 rounded p-5 mb-6">
        <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <span class="text-label-sm font-label-sm text-[#475569] dark:text-gray-400 uppercase tracking-wider font-semibold">Institutional Credential Ledger</span>
              <span class="text-[#cbd5e1] dark:text-gray-600">•</span>
              <span class="inline-flex items-center gap-1 text-[11px] font-mono-data text-[#065f46] dark:text-emerald-300 bg-[#ecfdf5] dark:bg-emerald-950/40 border border-[#a7f3d0] dark:border-emerald-800/60 px-2 py-0.5 rounded">
                <span class="w-1.5 h-1.5 rounded-full bg-[#047857] dark:bg-emerald-400"></span>
                NAAR Cryptographic Ledger Validated
              </span>
            </div>
            <h1 class="text-headline-lg font-headline-lg text-[#0f172a] dark:text-white tracking-tight">
              Verified Digital Portfolio &amp; Tamper-Proof Credentials
            </h1>
            <p class="text-body-sm font-body-sm text-[#475569] dark:text-gray-300">
              Cryptographically signed by Dean of Academic Affairs (AIIA). Authorized corporate recruiters scan this digital hash for instant clearance into pharmaceutical R&amp;D mandates.
            </p>
          </div>
          <div class="flex items-center gap-3">
            <div class="text-right">
              <div class="text-label-sm font-label-sm text-[#64748b] dark:text-gray-400">Institutional ID</div>
              <div class="text-headline-sm font-headline-sm font-bold text-[#0f172a] dark:text-white font-mono-data">AIIA-CERT-2026-9842</div>
            </div>
          </div>
        </div>
      </div>

      <!-- PORTFOLIO GRID -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left: Skills & Certifications -->
        <div class="space-y-6">
          <div class="bg-surface-container-lowest border border-[#e2e8f0] dark:border-gray-800 rounded p-5 shadow-sm space-y-3">
            <h3 class="text-headline-sm font-headline-sm font-bold text-[#0f172a] dark:text-white border-b border-[#f1f5f9] dark:border-gray-800 pb-2">Verified Competencies</h3>
            <div class="space-y-2 text-body-sm">
              <div class="flex justify-between items-center p-2 rounded bg-[#f8fafc] dark:bg-gray-900 border border-[#e2e8f0] dark:border-gray-800">
                <span class="text-[#0f172a] dark:text-white font-medium">Ayurvedic Pharmacognosy</span>
                <span class="font-mono-data text-emerald-600 dark:text-emerald-400 font-bold">Grade A (94%)</span>
              </div>
              <div class="flex justify-between items-center p-2 rounded bg-[#f8fafc] dark:bg-gray-900 border border-[#e2e8f0] dark:border-gray-800">
                <span class="text-[#0f172a] dark:text-white font-medium">Herbal Formulation Practice</span>
                <span class="font-mono-data text-emerald-600 dark:text-emerald-400 font-bold">Grade A (91%)</span>
              </div>
              <div class="flex justify-between items-center p-2 rounded bg-[#f8fafc] dark:bg-gray-900 border border-[#e2e8f0] dark:border-gray-800">
                <span class="text-[#0f172a] dark:text-white font-medium">Good Laboratory Practice (GLP)</span>
                <span class="font-mono-data text-emerald-600 dark:text-emerald-400 font-bold">Certified</span>
              </div>
              <div class="flex justify-between items-center p-2 rounded bg-[#f8fafc] dark:bg-gray-900 border border-[#e2e8f0] dark:border-gray-800">
                <span class="text-[#0f172a] dark:text-white font-medium">Python for Health Data</span>
                <span class="font-mono-data text-purple-600 dark:text-purple-400 font-bold">88% (Intermediate)</span>
              </div>
            </div>
          </div>

          <div class="bg-surface-container-lowest border border-[#e2e8f0] dark:border-gray-800 rounded p-5 shadow-sm space-y-3">
            <h3 class="text-headline-sm font-headline-sm font-bold text-[#0f172a] dark:text-white border-b border-[#f1f5f9] dark:border-gray-800 pb-2">Statutory Certifications</h3>
            <div class="space-y-2 text-label-sm">
              <div class="p-3 rounded bg-[#f8fafc] dark:bg-gray-900 border border-[#e2e8f0] dark:border-gray-800">
                <div class="font-bold text-[#0f172a] dark:text-white">National Medicinal Plants Board (NMPB)</div>
                <div class="text-[#64748b] dark:text-gray-400">Botanical Raw Drug Quality Certification • 2025</div>
              </div>
              <div class="p-3 rounded bg-[#f8fafc] dark:bg-gray-900 border border-[#e2e8f0] dark:border-gray-800">
                <div class="font-bold text-[#0f172a] dark:text-white">AIIA Phytochemical Core Facility</div>
                <div class="text-[#64748b] dark:text-gray-400">Standard Extraction &amp; Marker Assay • 2026</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Middle & Right: Projects & Verification QR -->
        <div class="lg:col-span-2 space-y-6">
          <div class="bg-surface-container-lowest border border-[#e2e8f0] dark:border-gray-800 rounded p-5 shadow-sm space-y-4">
            <h3 class="text-headline-sm font-headline-sm font-bold text-[#0f172a] dark:text-white border-b border-[#f1f5f9] dark:border-gray-800 pb-2">Academic &amp; Industrial Projects</h3>
            <div class="space-y-3">
              <div class="p-4 rounded bg-[#f8fafc] dark:bg-gray-900 border border-[#e2e8f0] dark:border-gray-800 space-y-1.5">
                <div class="flex justify-between items-start">
                  <h4 class="font-bold text-sm text-[#0f172a] dark:text-white">Standardization of Classical Ashwagandha Kwatha</h4>
                  <span class="text-[10px] font-mono-data px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">Dabur MoU</span>
                </div>
                <p class="text-xs text-[#475569] dark:text-gray-400">HPTLC fingerprinting and active withanolide marker quantification under Good Laboratory Practice standards.</p>
              </div>

              <div class="p-4 rounded bg-[#f8fafc] dark:bg-gray-900 border border-[#e2e8f0] dark:border-gray-800 space-y-1.5">
                <div class="flex justify-between items-start">
                  <h4 class="font-bold text-sm text-[#0f172a] dark:text-white">NLP Extraction for Charaka Samhita Formulations</h4>
                  <span class="text-[10px] font-mono-data px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">Ayush-AI Hackathon</span>
                </div>
                <p class="text-xs text-[#475569] dark:text-gray-400">Building Sanskrit-to-chemical ontology mapper linking classical compound indications with modern IUPAC entities.</p>
              </div>
            </div>
          </div>

          <!-- Cryptographic Verification Card -->
          <div class="p-5 rounded bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-emerald-600 dark:text-emerald-400 text-[18px]">verified</span>
                <span class="text-label-sm font-label-sm text-emerald-800 dark:text-emerald-300 font-bold uppercase">National Ayush Academic Registry (NAAR)</span>
              </div>
              <h4 class="font-bold text-sm text-[#0f172a] dark:text-white">Official Cryptographic Credential Stamp</h4>
              <p class="text-xs text-[#475569] dark:text-gray-300">This hash is permanently verifiable by statutory evaluators from CCRAS, NMPB, and hiring consortium partners.</p>
              <div class="font-mono-data text-[11px] text-[#64748b] dark:text-gray-400 pt-1">SHA-256: 7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069</div>
            </div>
            <div class="w-20 h-20 bg-slate-900 dark:bg-gray-800 p-1.5 rounded flex items-center justify-center shrink-0">
              <div class="w-full h-full bg-white p-1 flex flex-col justify-between">
                <div class="flex justify-between">
                  <div class="w-4 h-4 bg-[#0f172a]"></div>
                  <div class="w-2 h-2 bg-[#0f172a]"></div>
                  <div class="w-4 h-4 bg-[#0f172a]"></div>
                </div>
                <div class="flex justify-center gap-1">
                  <div class="w-1.5 h-1.5 bg-[#0f172a]"></div>
                  <div class="w-1.5 h-1.5 bg-[#0f172a]"></div>
                </div>
                <div class="flex justify-between">
                  <div class="w-4 h-4 bg-[#0f172a]"></div>
                  <div class="w-3 h-1.5 bg-[#0f172a]"></div>
                  <div class="w-4 h-4 bg-[#0f172a]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
    {FOOTER_TEMPLATE}
  </main>
"""

portfolio_html = (
    HEAD_TEMPLATE.replace("{page_title}", "Student | Verified Digital Portfolio")
    + HEADER_TEMPLATE
    + make_drawer("student-portfolio.html")
    + """<div class="flex-1 flex overflow-hidden">\n"""
    + make_sidebar("student-portfolio.html")
    + portfolio_workspace
    + """</div>\n"""
    + SCRIPTS_TEMPLATE
    + """</body></html>\n"""
)

# Write all files
pages = {
    'student-jobs.html': jobs_html,
    'student-internships.html': internships_html,
    'student-quiz.html': quiz_html,
    'student-resume.html': resume_html,
    'student-zulu.html': zulu_html,
    'student-skilltree.html': skilltree_html,
    'student-portfolio.html': portfolio_html
}

for filename, content in pages.items():
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)
    # Also write to public/
    pub_path = os.path.join('public', filename)
    with open(pub_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Generated and synced {filename}")

print("All 7 student pages successfully built and synced to public/.")
