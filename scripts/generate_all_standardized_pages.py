import os
import re

# Read base templates from standardize_all_portals.py
with open('scripts/standardize_all_portals.py', 'r', encoding='utf-8') as f:
    code = f.read()

exec(code, globals())

# ─────────────────────────────────────────────────────────────
# PAGE CONTENT DEFINITIONS
# ─────────────────────────────────────────────────────────────

PAGES = {}

# 1. STUDENT.HTML (DASHBOARD & CENTRAL OVERVIEW)
PAGES["student.html"] = {
    "title": "Student Overview & Command Dashboard",
    "content": """
      <!-- WELCOME HERO BANNER -->
      <div class="rounded-2xl border border-[#E2E8F0] dark:border-white/10 bg-white dark:bg-white/[0.03] p-6 sm:p-8 shadow-sm mb-8 relative overflow-hidden">
        <div class="absolute -right-16 -top-16 w-64 h-64 bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div class="space-y-2">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-semibold border border-emerald-200 dark:border-emerald-800/60">
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              AIIA Verified Scholar · Anti-Decay Freeze Active
            </div>
            <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0F172A] dark:text-white">
              Welcome back, <span class="user-name-display text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 dark:from-purple-400 dark:via-indigo-300 dark:to-cyan-400">Ashay Verma</span>
            </h1>
            <p class="text-sm text-[#475569] dark:text-gray-300 max-w-2xl leading-relaxed">
              BAMS 3rd Year · All India Institute of Ayurveda (AIIA), New Delhi. Your verified institutional dossier is synced with NAAC Criterion 3.4 & Corporate Mandates.
            </p>
          </div>
          <div class="flex flex-wrap items-center gap-3">
            <a href="student-roadmap.html" class="px-5 py-2.5 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] dark:bg-white/10 dark:hover:bg-white/20 text-white font-semibold text-sm transition-colors shadow-sm flex items-center gap-2">
              <span>Continue Roadmap</span>
              <span>➔</span>
            </a>
            <a href="student-zulu.html" class="px-5 py-2.5 rounded-xl border border-[#E2E8F0] dark:border-white/10 bg-transparent hover:bg-slate-50 dark:hover:bg-white/5 text-[#0F172A] dark:text-white font-semibold text-sm transition-colors flex items-center gap-2">
              <span>🤖 Ask Zulu AI</span>
            </a>
          </div>
        </div>
      </div>

      <!-- 4 KPI STATS -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div class="rounded-2xl border border-[#E2E8F0] dark:border-white/10 bg-white dark:bg-white/[0.03] p-5 shadow-sm space-y-1">
          <div class="flex items-center justify-between text-xs text-[#64748B] dark:text-gray-400">
            <span class="uppercase tracking-wider font-semibold">Mastered Skills</span>
            <span class="material-symbols-outlined text-[18px] text-purple-600 dark:text-purple-400">verified</span>
          </div>
          <div class="text-3xl font-extrabold text-[#0F172A] dark:text-white font-mono">12</div>
          <div class="text-xs text-emerald-600 dark:text-emerald-400 font-medium">✓ AIIA BoS Verified</div>
        </div>

        <div class="rounded-2xl border border-[#E2E8F0] dark:border-white/10 bg-white dark:bg-white/[0.03] p-5 shadow-sm space-y-1">
          <div class="flex items-center justify-between text-xs text-[#64748B] dark:text-gray-400">
            <span class="uppercase tracking-wider font-semibold">Assessments</span>
            <span class="material-symbols-outlined text-[18px] text-cyan-600 dark:text-cyan-400">bolt</span>
          </div>
          <div class="text-3xl font-extrabold text-[#0F172A] dark:text-white font-mono">8</div>
          <div class="text-xs text-purple-600 dark:text-purple-400 font-medium">+400 XP Earned</div>
        </div>

        <div class="rounded-2xl border border-[#E2E8F0] dark:border-white/10 bg-white dark:bg-white/[0.03] p-5 shadow-sm space-y-1">
          <div class="flex items-center justify-between text-xs text-[#64748B] dark:text-gray-400">
            <span class="uppercase tracking-wider font-semibold">Applications</span>
            <span class="material-symbols-outlined text-[18px] text-blue-600 dark:text-blue-400">work</span>
          </div>
          <div class="text-3xl font-extrabold text-[#0F172A] dark:text-white font-mono">3</div>
          <div class="text-xs text-blue-600 dark:text-blue-400 font-medium">1 Job · 2 Fellowships</div>
        </div>

        <div class="rounded-2xl border border-[#E2E8F0] dark:border-white/10 bg-white dark:bg-white/[0.03] p-5 shadow-sm space-y-1">
          <div class="flex items-center justify-between text-xs text-[#64748B] dark:text-gray-400">
            <span class="uppercase tracking-wider font-semibold">Readiness Index</span>
            <span class="material-symbols-outlined text-[18px] text-emerald-600 dark:text-emerald-400">trending_up</span>
          </div>
          <div class="text-3xl font-extrabold text-[#0F172A] dark:text-white font-mono">78%</div>
          <div class="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Top 22% of Cohort</div>
        </div>
      </div>

      <!-- MODULAR STUDENT PORTAL NAVIGATOR (8 HUBS) -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h2 class="text-xl sm:text-2xl font-bold text-[#0F172A] dark:text-white">Academic &amp; Placement Modules</h2>
            <p class="text-xs sm:text-sm text-[#64748B] dark:text-gray-400">Direct access to career roadmaps, AI diagnostics, assessment arenas, and corporate recruitment.</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Card 1: Roadmap -->
          <a href="student-roadmap.html" class="rounded-2xl border border-[#E2E8F0] dark:border-white/10 bg-white dark:bg-white/[0.03] p-5 hover:border-purple-300 dark:hover:border-purple-500/40 transition-all shadow-sm group flex flex-col justify-between">
            <div>
              <div class="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800/60 flex items-center justify-center text-xl mb-3 group-hover:scale-110 transition-transform">
                🗺️
              </div>
              <h3 class="text-base font-bold text-[#0F172A] dark:text-white mb-1">Career Roadmap</h3>
              <p class="text-xs text-[#64748B] dark:text-gray-400 line-clamp-2">4-Phase milestone tracker from classical foundations to industrial pharmacology.</p>
            </div>
            <div class="mt-4 pt-3 border-t border-[#E2E8F0] dark:border-white/5 flex items-center justify-between text-xs text-purple-600 dark:text-purple-400 font-semibold">
              <span>Phase 01 Active</span>
              <span>➔</span>
            </div>
          </a>

          <!-- Card 2: Resume Analyzer -->
          <a href="student-resume.html" class="rounded-2xl border border-[#E2E8F0] dark:border-white/10 bg-white dark:bg-white/[0.03] p-5 hover:border-purple-300 dark:hover:border-purple-500/40 transition-all shadow-sm group flex flex-col justify-between">
            <div>
              <div class="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-950/50 border border-cyan-200 dark:border-cyan-800/60 flex items-center justify-center text-xl mb-3 group-hover:scale-110 transition-transform">
                📄
              </div>
              <h3 class="text-base font-bold text-[#0F172A] dark:text-white mb-1">AI Resume Analyzer</h3>
              <p class="text-xs text-[#64748B] dark:text-gray-400 line-clamp-2">Benchmark credentials against corporate mandates from Dabur &amp; Himalaya.</p>
            </div>
            <div class="mt-4 pt-3 border-t border-[#E2E8F0] dark:border-white/5 flex items-center justify-between text-xs text-cyan-600 dark:text-cyan-400 font-semibold">
              <span>78% Fit Score</span>
              <span>➔</span>
            </div>
          </a>

          <!-- Card 3: Quiz Arena -->
          <a href="student-quiz.html" class="rounded-2xl border border-[#E2E8F0] dark:border-white/10 bg-white dark:bg-white/[0.03] p-5 hover:border-purple-300 dark:hover:border-purple-500/40 transition-all shadow-sm group flex flex-col justify-between">
            <div>
              <div class="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/60 flex items-center justify-center text-xl mb-3 group-hover:scale-110 transition-transform">
                ⚡
              </div>
              <h3 class="text-base font-bold text-[#0F172A] dark:text-white mb-1">Quiz Arena</h3>
              <p class="text-xs text-[#64748B] dark:text-gray-400 line-clamp-2">Validate pharmacognosy and bio-data science competencies for XP.</p>
            </div>
            <div class="mt-4 pt-3 border-t border-[#E2E8F0] dark:border-white/5 flex items-center justify-between text-xs text-amber-600 dark:text-amber-400 font-semibold">
              <span>+250 XP Bounty</span>
              <span>➔</span>
            </div>
          </a>

          <!-- Card 4: Internships & Gigs -->
          <a href="student-internships.html" class="rounded-2xl border border-[#E2E8F0] dark:border-white/10 bg-white dark:bg-white/[0.03] p-5 hover:border-purple-300 dark:hover:border-purple-500/40 transition-all shadow-sm group flex flex-col justify-between">
            <div>
              <div class="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/60 flex items-center justify-center text-xl mb-3 group-hover:scale-110 transition-transform">
                💼
              </div>
              <h3 class="text-base font-bold text-[#0F172A] dark:text-white mb-1">Apply for Internships</h3>
              <p class="text-xs text-[#64748B] dark:text-gray-400 line-clamp-2">Funded research fellowships and task bounties with institutional stipend.</p>
            </div>
            <div class="mt-4 pt-3 border-t border-[#E2E8F0] dark:border-white/5 flex items-center justify-between text-xs text-blue-600 dark:text-blue-400 font-semibold">
              <span>8 Opportunities</span>
              <span>➔</span>
            </div>
          </a>

          <!-- Card 5: Corporate Jobs -->
          <a href="student-jobs.html" class="rounded-2xl border border-[#E2E8F0] dark:border-white/10 bg-white dark:bg-white/[0.03] p-5 hover:border-purple-300 dark:hover:border-purple-500/40 transition-all shadow-sm group flex flex-col justify-between">
            <div>
              <div class="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800/60 flex items-center justify-center text-xl mb-3 group-hover:scale-110 transition-transform">
                🏢
              </div>
              <h3 class="text-base font-bold text-[#0F172A] dark:text-white mb-1">Apply for Jobs</h3>
              <p class="text-xs text-[#64748B] dark:text-gray-400 line-clamp-2">Full-time corporate placements with AIIA MoU partners (₹8.5 - 12 LPA).</p>
            </div>
            <div class="mt-4 pt-3 border-t border-[#E2E8F0] dark:border-white/5 flex items-center justify-between text-xs text-purple-600 dark:text-purple-400 font-semibold">
              <span>Verified Mandates</span>
              <span>➔</span>
            </div>
          </a>

          <!-- Card 6: Zulu AI Companion -->
          <a href="student-zulu.html" class="rounded-2xl border border-[#E2E8F0] dark:border-white/10 bg-white dark:bg-white/[0.03] p-5 hover:border-purple-300 dark:hover:border-purple-500/40 transition-all shadow-sm group flex flex-col justify-between">
            <div>
              <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600/20 to-cyan-500/20 border border-purple-300 dark:border-purple-500/40 flex items-center justify-center text-xl mb-3 group-hover:scale-110 transition-transform">
                🤖
              </div>
              <h3 class="text-base font-bold text-[#0F172A] dark:text-white mb-1">Zulu AI Companion</h3>
              <p class="text-xs text-[#64748B] dark:text-gray-400 line-clamp-2">Interactive AI career counselor tuned on Ayush industry pathways.</p>
            </div>
            <div class="mt-4 pt-3 border-t border-[#E2E8F0] dark:border-white/5 flex items-center justify-between text-xs text-purple-600 dark:text-purple-400 font-semibold">
              <span>Ready to Advise</span>
              <span>➔</span>
            </div>
          </a>

          <!-- Card 7: Skill Constellation -->
          <a href="student-skilltree.html" class="rounded-2xl border border-[#E2E8F0] dark:border-white/10 bg-white dark:bg-white/[0.03] p-5 hover:border-purple-300 dark:hover:border-purple-500/40 transition-all shadow-sm group flex flex-col justify-between">
            <div>
              <div class="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800/60 flex items-center justify-center text-xl mb-3 group-hover:scale-110 transition-transform">
                🌐
              </div>
              <h3 class="text-base font-bold text-[#0F172A] dark:text-white mb-1">Skill Constellation</h3>
              <p class="text-xs text-[#64748B] dark:text-gray-400 line-clamp-2">2D interactive canvas visualizing competencies and dependency graphs.</p>
            </div>
            <div class="mt-4 pt-3 border-t border-[#E2E8F0] dark:border-white/5 flex items-center justify-between text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
              <span>Interactive View</span>
              <span>➔</span>
            </div>
          </a>

          <!-- Card 8: Verified Portfolio -->
          <a href="student-portfolio.html" class="rounded-2xl border border-[#E2E8F0] dark:border-white/10 bg-white dark:bg-white/[0.03] p-5 hover:border-purple-300 dark:hover:border-purple-500/40 transition-all shadow-sm group flex flex-col justify-between">
            <div>
              <div class="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-center text-xl mb-3 group-hover:scale-110 transition-transform">
                🏆
              </div>
              <h3 class="text-base font-bold text-[#0F172A] dark:text-white mb-1">Verified Portfolio</h3>
              <p class="text-xs text-[#64748B] dark:text-gray-400 line-clamp-2">Tamper-proof digital credential ledger verified on National Ayush Registry.</p>
            </div>
            <div class="mt-4 pt-3 border-t border-[#E2E8F0] dark:border-white/5 flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
              <span>AIIA Certified</span>
              <span>➔</span>
            </div>
          </a>
        </div>
      </div>

      <!-- ACTIVE MILESTONE + RECOMMENDED SPLIT ROW -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <!-- Roadmap Milestone Snapshot (2 Cols) -->
        <div class="lg:col-span-2 rounded-2xl border border-[#E2E8F0] dark:border-white/10 bg-white dark:bg-white/[0.03] p-6 shadow-sm space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <span class="text-[10px] uppercase font-bold text-purple-600 dark:text-purple-400 tracking-wider">Active Milestone Progression</span>
              <h3 class="text-lg font-bold text-[#0F172A] dark:text-white">Phase 01: Classical Foundations &amp; Phytochemistry</h3>
            </div>
            <span class="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60">
              3 / 4 Completed (75%)
            </span>
          </div>

          <div class="w-full bg-slate-100 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
            <div class="bg-gradient-to-r from-purple-600 to-indigo-600 h-full rounded-full" style="width: 75%"></div>
          </div>

          <div class="space-y-2 pt-1">
            <div class="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-[#E2E8F0] dark:border-white/5">
              <div class="flex items-center gap-3">
                <span class="text-emerald-600 dark:text-emerald-400">✓</span>
                <span class="text-xs text-[#475569] dark:text-gray-300 line-through">Standardization of Classical Ashwagandha Kwatha</span>
              </div>
              <span class="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">+50 XP</span>
            </div>
            <div class="flex items-center justify-between p-3 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800/40">
              <div class="flex items-center gap-3">
                <span class="w-2 h-2 rounded-full bg-purple-600 animate-ping"></span>
                <span class="text-xs font-semibold text-[#0F172A] dark:text-white">Current: HPTLC Fingerprinting of Withania somnifera</span>
              </div>
              <span class="text-[10px] font-mono font-bold text-purple-600 dark:text-purple-400">+100 XP</span>
            </div>
          </div>

          <div class="pt-2 flex justify-end">
            <a href="student-roadmap.html" class="text-xs font-bold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 flex items-center gap-1 transition-colors">
              <span>Open Detailed Interactive Roadmap</span>
              <span>➔</span>
            </a>
          </div>
        </div>

        <!-- Recommended Opportunity (1 Col) -->
        <div class="rounded-2xl border border-[#E2E8F0] dark:border-white/10 bg-white dark:bg-white/[0.03] p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div class="flex justify-between items-start">
              <span class="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 tracking-wider">Top Recommendation</span>
              <span class="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">94% Fit</span>
            </div>
            <h3 class="text-base font-bold text-[#0F172A] dark:text-white mt-2">Phytochemical Research Fellow</h3>
            <p class="text-xs text-purple-600 dark:text-purple-400 font-medium">Dabur India Ltd. R&amp;D Division</p>
            <p class="text-xs text-[#64748B] dark:text-gray-400 mt-2 leading-relaxed">
              Fast-track corporate fellowship directly validating HPTLC and herbal standardization.
            </p>
            <div class="mt-3 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
              ₹15,000 / month · 6 Months
            </div>
          </div>

          <a href="student-internships.html" class="w-full py-2.5 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] dark:bg-white/10 dark:hover:bg-white/20 text-white font-semibold text-xs text-center transition-colors shadow-sm block">
            Apply with Verified Dossier ➔
          </a>
        </div>
      </div>

      <!-- PEER BENCHMARKING COMPONENT -->
      <div id="peer-benchmarking-card"></div>
    """
}

# 2. STUDENT-ROADMAP.HTML (DEDICATED 4-PHASE PROGRESSION & CHECK-IN)
PAGES["student-roadmap.html"] = {
    "title": "Ayush Career Roadmap & Competency Progression",
    "content": """
      <!-- ROADMAP HERO BANNER -->
      <div class="rounded-2xl border border-[#E2E8F0] dark:border-white/10 bg-white dark:bg-white/[0.03] p-6 sm:p-8 shadow-sm mb-6">
        <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <span class="text-xs font-semibold uppercase tracking-wider text-[#64748B] dark:text-gray-400">Milestone Progression Framework</span>
              <span class="text-slate-300 dark:text-gray-700">•</span>
              <span class="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 px-2.5 py-0.5 rounded-full">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Anti-Decay Engine Active
              </span>
            </div>
            <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0F172A] dark:text-white">
              Ayush Career Roadmap &amp; Competency Progress
            </h1>
            <p class="text-sm text-[#475569] dark:text-gray-300 max-w-3xl leading-relaxed">
              Curriculum-to-industry pathway aligned with the National Commission for Indian System of Medicine (NCISM) syllabus and AIIA Industry Partners. Check in regularly to protect competencies against decay.
            </p>
          </div>
          <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <div class="text-left sm:text-right px-4 py-2 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-[#E2E8F0] dark:border-white/5">
              <span class="text-[10px] text-[#64748B] dark:text-gray-400 uppercase tracking-wider block font-semibold">Anti-Decay Cycle</span>
              <span id="streak-freeze-status" class="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">Freeze Active: 48h remaining</span>
            </div>
            <button id="streak-checkin-btn" onclick="handleStreakCheckin()" class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md transition-all hover:scale-105 flex items-center justify-center gap-2">
              <span>❄️ Check-in (+50 XP)</span>
            </button>
          </div>
        </div>
      </div>

      <!-- ROADMAP PHASES CONTAINER (RENDERED VIA API) -->
      <div id="roadmap-phases-container" class="space-y-5 mb-8">
        <!-- Dynamically rendered by student-ui.js -->
      </div>

      <!-- PEER BENCHMARKING COMPONENT -->
      <div id="peer-benchmarking-card"></div>
    """
}

# 3. STUDENT-JOBS.HTML (APPLY FOR JOBS)
PAGES["student-jobs.html"] = {
    "title": "Apply for Full-Time Corporate Placements",
    "content": """
      <!-- HERO BANNER -->
      <div class="rounded-2xl border border-[#E2E8F0] dark:border-white/10 bg-white dark:bg-white/[0.03] p-6 sm:p-8 shadow-sm mb-6">
        <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <span class="text-xs font-semibold uppercase tracking-wider text-[#64748B] dark:text-gray-400">Institutional Placement Gateway</span>
              <span class="text-slate-300 dark:text-gray-700">•</span>
              <span class="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 px-2.5 py-0.5 rounded-full">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Corporate Mandates Active — AIIA MoU Partners
              </span>
            </div>
            <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0F172A] dark:text-white">
              Apply for Full-Time Corporate Placements
            </h1>
            <p class="text-sm text-[#475569] dark:text-gray-300 max-w-3xl leading-relaxed">
              Submit verified credentials directly to corporate hiring portals for permanent R&amp;D roles. Fast-track technical interviews validated by the AIIA Dean's office.
            </p>
          </div>
          <div class="flex items-center gap-4 shrink-0">
            <div class="text-right">
              <div class="text-xs text-[#64748B] dark:text-gray-400">Verified Fit Level</div>
              <div class="text-xl font-extrabold text-[#0F172A] dark:text-white font-mono">92% Average</div>
            </div>
            <a href="student-portfolio.html" class="px-5 py-2.5 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] dark:bg-white/10 dark:hover:bg-white/20 text-white font-semibold text-xs transition-colors shadow-sm flex items-center gap-2">
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
    """
}

# 4. STUDENT-INTERNSHIPS.HTML (APPLY FOR INTERNSHIPS)
PAGES["student-internships.html"] = {
    "title": "Apply for Research Internships & Micro-Gigs",
    "content": """
      <!-- HERO BANNER -->
      <div class="rounded-2xl border border-[#E2E8F0] dark:border-white/10 bg-white dark:bg-white/[0.03] p-6 sm:p-8 shadow-sm mb-6">
        <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <span class="text-xs font-semibold uppercase tracking-wider text-[#64748B] dark:text-gray-400">Corporate Research Fellowships &amp; Micro-Gigs</span>
              <span class="text-slate-300 dark:text-gray-700">•</span>
              <span class="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 px-2.5 py-0.5 rounded-full">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Paid Task Bounties Open
              </span>
            </div>
            <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0F172A] dark:text-white">
              Apply for Research Internships &amp; Micro-Gigs
            </h1>
            <p class="text-sm text-[#475569] dark:text-gray-300 max-w-3xl leading-relaxed">
              Browse funded corporate research fellowships and 1-2 week task-based micro-gigs. Submitting applications transmits your verified AIIA credential package directly to corporate recruiters.
            </p>
          </div>
          <div class="flex items-center gap-4 shrink-0">
            <div class="text-right">
              <div class="text-xs text-[#64748B] dark:text-gray-400">Active Bounties</div>
              <div class="text-xl font-extrabold text-[#0F172A] dark:text-white font-mono">₹10,500 Total</div>
            </div>
          </div>
        </div>

        <!-- Filter Segmented Buttons -->
        <div class="mt-6 pt-5 border-t border-[#E2E8F0] dark:border-white/5 flex items-center gap-2 overflow-x-auto">
          <button id="filter-btn-all" onclick="filterInternshipTabs('All', this)" class="px-4 py-2 rounded-xl text-xs font-bold bg-[#0F172A] text-white dark:bg-white/10 dark:text-white transition shadow-sm">
            All Opportunities
          </button>
          <button id="filter-btn-internship" onclick="filterInternshipTabs('Internship', this)" class="px-4 py-2 rounded-xl text-xs font-medium bg-slate-50 dark:bg-white/[0.02] border border-[#E2E8F0] dark:border-white/10 text-[#475569] dark:text-gray-300 hover:border-purple-300 dark:hover:border-purple-500/40 transition">
            Corporate Internships
          </button>
          <button id="filter-btn-gig" onclick="filterInternshipTabs('Micro-Gig', this)" class="px-4 py-2 rounded-xl text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition">
            ⚡ Micro-Gigs (Task Bounties)
          </button>
        </div>
      </div>

      <!-- INTERNSHIPS GRID CONTAINER -->
      <div id="internships-container" class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <!-- Rendered dynamically by student-ui.js -->
      </div>
    """
}

# 5. STUDENT-QUIZ.HTML (QUIZ ARENA)
PAGES["student-quiz.html"] = {
    "title": "Interactive Quiz Arena & Knowledge Validation",
    "content": """
      <!-- HERO BANNER -->
      <div class="rounded-2xl border border-[#E2E8F0] dark:border-white/10 bg-white dark:bg-white/[0.03] p-6 sm:p-8 shadow-sm mb-6">
        <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <span class="text-xs font-semibold uppercase tracking-wider text-[#64748B] dark:text-gray-400">Technical Competency Validation</span>
              <span class="text-slate-300 dark:text-gray-700">•</span>
              <span class="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 px-2.5 py-0.5 rounded-full">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Anti-Decay Multiplier Active
              </span>
            </div>
            <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0F172A] dark:text-white">
              Interactive Quiz Arena &amp; Competency Assessment
            </h1>
            <p class="text-sm text-[#475569] dark:text-gray-300 max-w-3xl leading-relaxed">
              Verify competencies in Ayurvedic pharmacology, chromatography, and healthcare informatics. Complete assessments to earn +250 XP and renew your 72-hour decay freeze.
            </p>
          </div>
          <div class="flex items-center gap-4 shrink-0">
            <div class="text-right">
              <div class="text-xs text-[#64748B] dark:text-gray-400">Assessment Bounty</div>
              <div class="text-xl font-extrabold text-purple-600 dark:text-purple-400 font-mono">+250 XP Available</div>
            </div>
          </div>
        </div>
      </div>

      <!-- QUIZ ARENA CONTAINER -->
      <div class="rounded-2xl border border-[#E2E8F0] dark:border-white/10 bg-white dark:bg-white/[0.03] p-6 sm:p-8 shadow-sm">
        <div id="quiz-arena-container">
          <!-- Rendered dynamically by student-ui.js -->
        </div>
      </div>
    """
}

# 6. STUDENT-RESUME.HTML (AI RESUME ANALYZER)
PAGES["student-resume.html"] = {
    "title": "AI Resume Analyzer & Skill Gap Discovery",
    "content": """
      <!-- HERO BANNER -->
      <div class="rounded-2xl border border-[#E2E8F0] dark:border-white/10 bg-white dark:bg-white/[0.03] p-6 sm:p-8 shadow-sm mb-6">
        <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <span class="text-xs font-semibold uppercase tracking-wider text-[#64748B] dark:text-gray-400">AI Competency Benchmarking</span>
              <span class="text-slate-300 dark:text-gray-700">•</span>
              <span class="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 px-2.5 py-0.5 rounded-full">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Automated Curriculum Mapping Active
              </span>
            </div>
            <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0F172A] dark:text-white">
              AI Resume Analyzer &amp; Skill Gap Discovery
            </h1>
            <p class="text-sm text-[#475569] dark:text-gray-300 max-w-3xl leading-relaxed">
              Benchmark your credentials against industrial job descriptions from Dabur, Himalaya, and Patanjali. Missing skills are automatically flagged and injected into your Career Roadmap.
            </p>
          </div>
          <div class="flex items-center gap-4 shrink-0">
            <div class="text-right">
              <div class="text-xs text-[#64748B] dark:text-gray-400">Current Readiness</div>
              <div class="text-xl font-extrabold text-[#0F172A] dark:text-white font-mono">78% Match</div>
            </div>
          </div>
        </div>
      </div>

      <!-- RESUME SCANNER CONSOLE -->
      <div class="rounded-2xl border border-[#E2E8F0] dark:border-white/10 bg-white dark:bg-white/[0.03] p-6 shadow-sm space-y-5">
        <div>
          <label class="block text-xs font-bold text-[#0F172A] dark:text-gray-200 mb-2">Target Corporate Role Benchmark</label>
          <select id="target-role-select" class="w-full p-3 rounded-xl bg-slate-50 dark:bg-gray-900 border border-[#E2E8F0] dark:border-gray-700 text-xs sm:text-sm text-[#0F172A] dark:text-white focus:ring-2 focus:ring-purple-500 transition">
            <option value="Herbal Formulation Scientist">Herbal Formulation Scientist (Dabur India Ltd. R&amp;D)</option>
            <option value="Phytochemical Quality Control Officer">Phytochemical QC Officer (Patanjali Research Foundation)</option>
            <option value="Ayush Clinical Data Specialist">Ayush Clinical Data Specialist (Himalaya Wellness)</option>
            <option value="Bio-Informatics Research Associate">Bio-Informatics Research Associate (AIIA Digital Cell)</option>
          </select>
        </div>

        <div>
          <div class="flex items-center justify-between mb-2">
            <label class="text-xs font-bold text-[#0F172A] dark:text-gray-200">Candidate Qualifications &amp; Research Portfolio</label>
            <div class="flex items-center gap-2">
              <button onclick="document.getElementById('resume-textarea').value = SAMPLE_RESUMES.herbal" class="text-[11px] font-semibold text-purple-600 dark:text-purple-400 hover:underline">Load Herbal Sample</button>
              <span class="text-slate-300 dark:text-gray-700">•</span>
              <button onclick="document.getElementById('resume-textarea').value = SAMPLE_RESUMES.tech" class="text-[11px] font-semibold text-purple-600 dark:text-purple-400 hover:underline">Load Health-AI Sample</button>
            </div>
          </div>
          <textarea id="resume-textarea" rows="6" class="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-gray-900 border border-[#E2E8F0] dark:border-gray-700 text-xs sm:text-sm font-mono text-[#0F172A] dark:text-gray-200 focus:ring-2 focus:ring-purple-500 transition" placeholder="Paste your academic and technical resume text here..."></textarea>
        </div>

        <div class="flex justify-end pt-2">
          <button onclick="handleAnalyzeResume()" class="px-6 py-2.5 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] dark:bg-white/10 dark:hover:bg-white/20 text-white font-semibold text-xs transition-colors shadow-sm flex items-center gap-2">
            <span class="material-symbols-outlined text-[18px]">document_scanner</span>
            <span>Execute AI Skill Gap Discovery</span>
          </button>
        </div>

        <!-- RESULTS REPORT BOX -->
        <div id="resume-results-box" class="hidden mt-6 pt-6 border-t border-[#E2E8F0] dark:border-white/5 space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-base font-bold text-[#0F172A] dark:text-white">Diagnostic Skill Gap Report</h3>
            <span class="text-sm font-mono font-bold text-emerald-600 dark:text-emerald-400">Match Score: <span id="resume-match-score">0%</span></span>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 space-y-2">
              <span class="text-xs font-bold text-emerald-800 dark:text-emerald-300 block">✓ Validated Industrial Competencies</span>
              <div id="resume-extracted-skills" class="flex flex-wrap gap-1.5"></div>
            </div>
            <div class="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 space-y-2">
              <span class="text-xs font-bold text-amber-800 dark:text-amber-300 block">⚠️ Critical Missing Competencies</span>
              <div id="resume-missing-skills" class="flex flex-wrap gap-1.5"></div>
            </div>
          </div>
        </div>
      </div>
    """
}

# 7. STUDENT-ZULU.HTML (ZULU AI COMPANION)
PAGES["student-zulu.html"] = {
    "title": "Zulu AI Career Counselor",
    "content": """
      <!-- GEMINI-STYLE ZULU CHAT CONSOLE -->
      <div class="max-w-4xl mx-auto flex flex-col h-[calc(100vh-140px)]">
        <!-- CHAT MESSAGES SCROLLER -->
        <div id="zulu-messages-box" class="flex-1 overflow-y-auto space-y-4 pr-1 pb-4 custom-scrollbar">
          <!-- WELCOME HERO -->
          <div id="zulu-welcome-hero" class="text-center py-10 space-y-4">
            <div class="w-16 h-16 rounded-3xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-3xl text-white mx-auto shadow-lg">
              ✨
            </div>
            <h1 class="text-2xl sm:text-3xl font-extrabold text-[#0F172A] dark:text-white">
              Hello, <span class="user-name-display">Ashay</span>
            </h1>
            <p class="text-xs sm:text-sm text-[#64748B] dark:text-gray-400 max-w-md mx-auto">
              I am Zulu, your specialized Ayush Career &amp; Pharmacognosy AI Advisor. How can I assist your career roadmap today?
            </p>

            <!-- SUGGESTION CHIPS -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto pt-4 text-left">
              <button onclick="sendQuickPrompt('What are high-demand competencies for Dabur R&D?')" class="p-3.5 rounded-2xl bg-white dark:bg-white/[0.03] border border-[#E2E8F0] dark:border-white/10 hover:border-purple-300 dark:hover:border-purple-500/40 text-xs text-[#475569] dark:text-gray-300 transition shadow-sm">
                🌿 What are high-demand competencies for Dabur R&amp;D?
              </button>
              <button onclick="sendQuickPrompt('How do I prevent my skill decay freeze from expiring?')" class="p-3.5 rounded-2xl bg-white dark:bg-white/[0.03] border border-[#E2E8F0] dark:border-white/10 hover:border-purple-300 dark:hover:border-purple-500/40 text-xs text-[#475569] dark:text-gray-300 transition shadow-sm">
                ❄️ How do I prevent my skill decay freeze from expiring?
              </button>
              <button onclick="sendQuickPrompt('Recommend a research fellowship matching my phytochemistry profile')" class="p-3.5 rounded-2xl bg-white dark:bg-white/[0.03] border border-[#E2E8F0] dark:border-white/10 hover:border-purple-300 dark:hover:border-purple-500/40 text-xs text-[#475569] dark:text-gray-300 transition shadow-sm">
                💼 Recommend a research fellowship for my profile
              </button>
              <button onclick="sendQuickPrompt('Explain HPTLC fingerprinting standards under Ayurvedic Pharmacopoeia')" class="p-3.5 rounded-2xl bg-white dark:bg-white/[0.03] border border-[#E2E8F0] dark:border-white/10 hover:border-purple-300 dark:hover:border-purple-500/40 text-xs text-[#475569] dark:text-gray-300 transition shadow-sm">
                🔬 Explain HPTLC fingerprinting standards
              </button>
            </div>
          </div>
        </div>

        <!-- INPUT BOX -->
        <div class="pt-3">
          <form id="zulu-form" onsubmit="handleZuluSend(event)" class="relative flex items-center">
            <input id="zulu-input" type="text" placeholder="Ask Zulu anything about Ayush career paths, skills, or research internships..." class="w-full pl-5 pr-24 py-3.5 rounded-2xl bg-white dark:bg-[#0c0e14] border border-[#E2E8F0] dark:border-white/10 text-xs sm:text-sm text-[#0F172A] dark:text-white placeholder-[#94A3B8] dark:placeholder-gray-500 shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition" />
            <button type="submit" class="absolute right-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-sm transition">
              Send
            </button>
          </form>
        </div>
      </div>
    """
}

# 8. STUDENT-SKILLTREE.HTML (SKILL CONSTELLATION)
PAGES["student-skilltree.html"] = {
    "title": "Ayush Skill Constellation & Dependency Graph",
    "content": """
      <!-- HERO BANNER -->
      <div class="rounded-2xl border border-[#E2E8F0] dark:border-white/10 bg-white dark:bg-white/[0.03] p-6 sm:p-8 shadow-sm mb-6">
        <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <span class="text-xs font-semibold uppercase tracking-wider text-[#64748B] dark:text-gray-400">Interactive Competency Constellation</span>
              <span class="text-slate-300 dark:text-gray-700">•</span>
              <span class="inline-flex items-center gap-1 text-[11px] font-mono text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 px-2.5 py-0.5 rounded-full">
                6 Core Competency Nodes
              </span>
            </div>
            <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0F172A] dark:text-white">
              Ayush Skill Constellation &amp; Dependency Map
            </h1>
            <p class="text-sm text-[#475569] dark:text-gray-300 max-w-3xl leading-relaxed">
              Visual dependency map illustrating foundational classical botany prerequisites connecting to modern chromatographic standardized testing and bio-data science.
            </p>
          </div>
          <div class="flex items-center gap-3 shrink-0">
            <span class="inline-flex items-center gap-1.5 text-xs text-purple-600 dark:text-purple-400 font-bold">
              <span class="w-3 h-3 rounded-full bg-purple-600"></span> Acquired
            </span>
            <span class="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-gray-400 font-bold">
              <span class="w-3 h-3 rounded-full bg-slate-300 dark:bg-gray-700"></span> In Progress
            </span>
          </div>
        </div>
      </div>

      <!-- CANVAS CONSTELLATION CONTAINER -->
      <div class="rounded-2xl border border-[#E2E8F0] dark:border-white/10 bg-white dark:bg-[#0c0e14] p-4 sm:p-6 shadow-sm h-[480px] sm:h-[560px] relative">
        <canvas id="skill-tree-canvas" class="w-full h-full block"></canvas>
      </div>
    """
}

# 9. STUDENT-PORTFOLIO.HTML (VERIFIED PORTFOLIO)
PAGES["student-portfolio.html"] = {
    "title": "Verified Digital Portfolio & Tamper-Proof Ledger",
    "content": """
      <!-- HERO BANNER -->
      <div class="rounded-2xl border border-[#E2E8F0] dark:border-white/10 bg-white dark:bg-white/[0.03] p-6 sm:p-8 shadow-sm mb-6">
        <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <span class="text-xs font-semibold uppercase tracking-wider text-[#64748B] dark:text-gray-400">National Ayush Academic Registry (NAAR)</span>
              <span class="text-slate-300 dark:text-gray-700">•</span>
              <span class="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 px-2.5 py-0.5 rounded-full">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Cryptographic Ledger Verified
              </span>
            </div>
            <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0F172A] dark:text-white">
              Verified Digital Portfolio &amp; Tamper-Proof Credentials
            </h1>
            <p class="text-sm text-[#475569] dark:text-gray-300 max-w-3xl leading-relaxed">
              All credentials and assessment outcomes are cryptographically signed by the All India Institute of Ayurveda Dean's Office and registered on the Ministry of Ayush Academic Ledger.
            </p>
          </div>
          <div class="flex items-center gap-3 shrink-0">
            <button onclick="window.print()" class="px-5 py-2.5 rounded-xl border border-[#E2E8F0] dark:border-white/10 bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 text-xs font-bold text-[#0F172A] dark:text-white transition shadow-sm flex items-center gap-2">
              <span class="material-symbols-outlined text-[18px]">download</span>
              <span>Export Dossier (PDF)</span>
            </button>
          </div>
        </div>
      </div>

      <!-- CREDENTIALS GRID -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        <!-- Credential 1 -->
        <div class="rounded-2xl border border-[#E2E8F0] dark:border-white/10 bg-white dark:bg-white/[0.03] p-5 shadow-sm space-y-3">
          <div class="flex items-center justify-between">
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">Verified Certificate</span>
            <span class="text-xs font-mono text-[#64748B] dark:text-gray-500">Jan 2025</span>
          </div>
          <h3 class="text-base font-bold text-[#0F172A] dark:text-white">Good Laboratory Practices (GLP) &amp; Phytochemical Extraction</h3>
          <p class="text-xs text-[#64748B] dark:text-gray-400">National Medicinal Plants Board (NMPB) &amp; AIIA Central Lab</p>
          <div class="pt-3 border-t border-[#E2E8F0] dark:border-white/5 font-mono text-[10px] text-slate-500 dark:text-gray-400 truncate">
            Hash: 0x8F92...B41C (NAAR Verified)
          </div>
        </div>

        <!-- Credential 2 -->
        <div class="rounded-2xl border border-[#E2E8F0] dark:border-white/10 bg-white dark:bg-white/[0.03] p-5 shadow-sm space-y-3">
          <div class="flex items-center justify-between">
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60">Micro-Credential</span>
            <span class="text-xs font-mono text-[#64748B] dark:text-gray-500">Feb 2025</span>
          </div>
          <h3 class="text-base font-bold text-[#0F172A] dark:text-white">HPTLC Analytical Chromatography &amp; Standardization</h3>
          <p class="text-xs text-[#64748B] dark:text-gray-400">Department of Dravyaguna, AIIA New Delhi</p>
          <div class="pt-3 border-t border-[#E2E8F0] dark:border-white/5 font-mono text-[10px] text-slate-500 dark:text-gray-400 truncate">
            Hash: 0x3E11...A799 (NAAR Verified)
          </div>
        </div>

        <!-- Credential 3 -->
        <div class="rounded-2xl border border-[#E2E8F0] dark:border-white/10 bg-white dark:bg-white/[0.03] p-5 shadow-sm space-y-3">
          <div class="flex items-center justify-between">
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60">Digital Badge</span>
            <span class="text-xs font-mono text-[#64748B] dark:text-gray-500">Mar 2025</span>
          </div>
          <h3 class="text-base font-bold text-[#0F172A] dark:text-white">Health Informatics &amp; Sanskrit Natural Language Processing</h3>
          <p class="text-xs text-[#64748B] dark:text-gray-400">Ayush Digital Grid Collaboration</p>
          <div class="pt-3 border-t border-[#E2E8F0] dark:border-white/5 font-mono text-[10px] text-slate-500 dark:text-gray-400 truncate">
            Hash: 0x9B44...F022 (NAAR Verified)
          </div>
        </div>
      </div>
    """
}

# ─────────────────────────────────────────────────────────────
# GENERATE ALL STUDENT PAGES
# ─────────────────────────────────────────────────────────────
for filename, meta in PAGES.items():
    head = HEAD_TEMPLATE.replace("{page_title}", meta["title"])
    header = STUDENT_HEADER
    drawer = make_student_drawer(filename)
    sidebar = make_student_sidebar(filename)
    footer = FOOTER_TEMPLATE
    scripts = SCRIPTS_TEMPLATE

    full_html = f"""{head}
{header}
{drawer}
<div class="flex-1 flex overflow-hidden">
{sidebar}
  <!-- WORKSPACE -->
  <main class="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 custom-scrollbar">
    <div class="w-full max-w-6xl mx-auto">
{meta["content"]}
    </div>
{footer}
  </main>
</div>
{scripts}"""

    with open(filename, 'w', encoding='utf-8') as f:
        f.write(full_html)
    with open(os.path.join('public', filename), 'w', encoding='utf-8') as f:
        f.write(full_html)

    print(f"Generated and synced: {filename}")

print("All 9 student portal pages generated successfully.")
