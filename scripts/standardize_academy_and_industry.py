import os
import re

# Read base templates
with open('scripts/standardize_all_portals.py', 'r', encoding='utf-8') as f:
    code = f.read()

exec(code, globals())

ACADEMY_HEADER = """
<header class="sticky top-0 z-50 w-full bg-white/90 dark:bg-[#07071A]/95 backdrop-blur-md border-b border-[#E2E8F0] dark:border-white/5 transition-colors duration-200">
  <div class="max-w-6xl mx-auto px-5 sm:px-8 py-3 flex items-center justify-between">
    <!-- Mobile Hamburger + Brand Logo -->
    <div class="flex items-center gap-3">
      <button onclick="toggleAcademyMobileMenu()" class="lg:hidden p-2 rounded-xl text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/5 border border-slate-200 dark:border-gray-800 transition" aria-label="Toggle Navigation">
        <span class="material-symbols-outlined text-[20px]">menu</span>
      </button>
      <a href="academy.html" class="flex items-center gap-2.5 cursor-pointer select-none">
        <div class="w-1.5 h-8 bg-gradient-to-b from-emerald-400 to-teal-600 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.7)]"></div>
        <div>
          <span class="text-xl font-extrabold tracking-widest text-[#0F172A] dark:text-white uppercase block">JOBLEX</span>
          <span class="hidden sm:block text-[9px] text-[#64748B] dark:text-gray-400 tracking-widest uppercase font-semibold">Ministry of Ayush · Academic Dean &amp; TPO</span>
        </div>
      </a>
    </div>

    <!-- Navigation Links + Status + Notification + Theme + Avatar -->
    <div class="flex items-center gap-2 sm:gap-3">
      <a href="javascript:void(0)" onclick="JoblexApiClient.navigateToPortal('student')" class="hidden sm:block px-3 py-1.5 text-xs text-[#475569] dark:text-gray-400 hover:text-[#0F172A] dark:hover:text-white border border-[#E2E8F0] dark:border-gray-800 hover:border-[#CBD5E1] dark:hover:border-gray-600 rounded-lg transition font-medium">
        🎓 Student
      </a>
      <a href="javascript:void(0)" onclick="JoblexApiClient.navigateToPortal('industry')" class="hidden sm:block px-3 py-1.5 text-xs text-[#475569] dark:text-gray-400 hover:text-[#0F172A] dark:hover:text-white border border-[#E2E8F0] dark:border-gray-800 hover:border-[#CBD5E1] dark:hover:border-gray-600 rounded-lg transition font-medium">
        🏢 Industry
      </a>

      <!-- NAAC Badge -->
      <span class="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-mono text-xs font-bold border border-emerald-200 dark:border-emerald-800/60">
        🏛️ NAAC Cycle IV
      </span>

      <!-- Notification Bell -->
      <button id="notification-bell-btn" type="button" aria-label="Open Notifications" class="relative p-2 rounded-xl text-[#475569] dark:text-gray-300 hover:text-[#0F172A] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 border border-[#E2E8F0] dark:border-white/10 transition-colors">
        <span class="material-symbols-outlined text-[20px]">notifications</span>
        <span class="notification-badge-indicator absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-emerald-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
          3
        </span>
      </button>

      <!-- Theme Switcher -->
      <button id="theme-toggle-btn" onclick="toggleTheme()" aria-label="Toggle Light/Dark Theme" title="Toggle Light/Dark Theme" class="p-2 rounded-xl border border-[#E2E8F0] dark:border-white/10 bg-white dark:bg-white/5 text-[#475569] dark:text-gray-300 hover:text-[#0F172A] dark:hover:text-white transition-colors duration-150 flex items-center justify-center">
        <span id="theme-toggle-icon" class="material-symbols-outlined text-[18px]">dark_mode</span>
      </button>

      <!-- Dean Avatar Chip -->
      <div class="flex items-center gap-2 pl-2 border-l border-[#E2E8F0] dark:border-white/10">
        <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
          AD
        </div>
        <div class="hidden xl:flex flex-col text-left">
          <span class="text-xs font-bold text-[#0F172A] dark:text-white truncate">Dean (Acad.)</span>
          <span class="text-[10px] text-[#64748B] dark:text-gray-400 font-mono">AIIA Delhi</span>
        </div>
      </div>
    </div>
  </div>
</header>
"""

INDUSTRY_HEADER = """
<header class="sticky top-0 z-50 w-full bg-white/90 dark:bg-[#07071A]/95 backdrop-blur-md border-b border-[#E2E8F0] dark:border-white/5 transition-colors duration-200">
  <div class="max-w-6xl mx-auto px-5 sm:px-8 py-3 flex items-center justify-between">
    <!-- Mobile Hamburger + Brand Logo -->
    <div class="flex items-center gap-3">
      <button onclick="toggleIndustryMobileMenu()" class="lg:hidden p-2 rounded-xl text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/5 border border-slate-200 dark:border-gray-800 transition" aria-label="Toggle Navigation">
        <span class="material-symbols-outlined text-[20px]">menu</span>
      </button>
      <a href="industry.html" class="flex items-center gap-2.5 cursor-pointer select-none">
        <div class="w-1.5 h-8 bg-gradient-to-b from-blue-400 to-cyan-600 rounded-full shadow-[0_0_12px_rgba(59,130,246,0.7)]"></div>
        <div>
          <span class="text-xl font-extrabold tracking-widest text-[#0F172A] dark:text-white uppercase block">JOBLEX</span>
          <span class="hidden sm:block text-[9px] text-[#64748B] dark:text-gray-400 tracking-widest uppercase font-semibold">Ministry of Ayush · Industry Gateway</span>
        </div>
      </a>
    </div>

    <!-- Navigation Links + Status + Notification + Theme + Avatar -->
    <div class="flex items-center gap-2 sm:gap-3">
      <a href="javascript:void(0)" onclick="JoblexApiClient.navigateToPortal('student')" class="hidden sm:block px-3 py-1.5 text-xs text-[#475569] dark:text-gray-400 hover:text-[#0F172A] dark:hover:text-white border border-[#E2E8F0] dark:border-gray-800 hover:border-[#CBD5E1] dark:hover:border-gray-600 rounded-lg transition font-medium">
        🎓 Student
      </a>
      <a href="javascript:void(0)" onclick="JoblexApiClient.navigateToPortal('academy')" class="hidden sm:block px-3 py-1.5 text-xs text-[#475569] dark:text-gray-400 hover:text-[#0F172A] dark:hover:text-white border border-[#E2E8F0] dark:border-gray-800 hover:border-[#CBD5E1] dark:hover:border-gray-600 rounded-lg transition font-medium">
        🏛️ Academy
      </a>

      <!-- Corporate Node Badge -->
      <span class="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-mono text-xs font-bold border border-blue-200 dark:border-blue-800/60">
        🏢 AIIA-NCR-04 Node
      </span>

      <!-- Notification Bell -->
      <button id="notification-bell-btn" type="button" aria-label="Open Notifications" class="relative p-2 rounded-xl text-[#475569] dark:text-gray-300 hover:text-[#0F172A] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 border border-[#E2E8F0] dark:border-white/10 transition-colors">
        <span class="material-symbols-outlined text-[20px]">notifications</span>
        <span class="notification-badge-indicator absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
          3
        </span>
      </button>

      <!-- Theme Switcher -->
      <button id="theme-toggle-btn" onclick="toggleTheme()" aria-label="Toggle Light/Dark Theme" title="Toggle Light/Dark Theme" class="p-2 rounded-xl border border-[#E2E8F0] dark:border-white/10 bg-white dark:bg-white/5 text-[#475569] dark:text-gray-300 hover:text-[#0F172A] dark:hover:text-white transition-colors duration-150 flex items-center justify-center">
        <span id="theme-toggle-icon" class="material-symbols-outlined text-[18px]">dark_mode</span>
      </button>

      <!-- Recruiter Avatar Chip -->
      <div class="flex items-center gap-2 pl-2 border-l border-[#E2E8F0] dark:border-white/10">
        <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
          IP
        </div>
        <div class="hidden xl:flex flex-col text-left">
          <span class="text-xs font-bold text-[#0F172A] dark:text-white truncate">Dabur R&amp;D</span>
          <span class="text-[10px] text-[#64748B] dark:text-gray-400 font-mono">Talent Lead</span>
        </div>
      </div>
    </div>
  </div>
</header>
"""

REPLACEMENTS = [
    # Surface & background tokens
    (r'\bbg-surface-container-lowest\b', 'bg-white dark:bg-white/[0.03] shadow-sm'),
    (r'\bbg-surface-container-low\b', 'bg-slate-50 dark:bg-white/[0.02]'),
    (r'\bbg-surface-container-high\b', 'bg-slate-100 dark:bg-white/[0.06]'),
    (r'\bbg-surface-container-highest\b', 'bg-slate-200 dark:bg-white/[0.08]'),
    (r'\bbg-surface-container\b', 'bg-slate-100 dark:bg-white/[0.04]'),
    (r'\bbg-surface-bright\b', 'bg-white dark:bg-[#0A0C14]'),
    (r'\bbg-surface\b', 'bg-white dark:bg-white/[0.03]'),
    (r'\bbg-background\b', 'bg-[#F8F9FA] dark:bg-[#07071A]'),
    (r'\bbg-primary-container\b', 'bg-[#1E293B] dark:bg-white/20'),
    (r'\bbg-primary\b', 'bg-[#0F172A] dark:bg-white/10'),
    (r'\bbg-secondary\b', 'bg-slate-500 dark:bg-gray-600'),
    (r'\bbg-tertiary-container\b', 'bg-emerald-500'),
    
    # Text tokens
    (r'\btext-on-surface-variant\b', 'text-[#64748B] dark:text-gray-400'),
    (r'\btext-on-surface\b', 'text-[#0F172A] dark:text-white'),
    (r'\btext-on-primary-container\b', 'text-white dark:text-gray-100'),
    (r'\btext-on-primary\b', 'text-white dark:text-gray-100'),
    (r'\btext-secondary\b', 'text-[#64748B] dark:text-gray-400'),
    (r'\btext-on-tertiary-container\b', 'text-emerald-600 dark:text-emerald-400'),
    (r'\btext-primary\b', 'text-purple-600 dark:text-purple-400'),
    (r'\btext-inverse-on-surface\b', 'text-white'),
    
    # Borders & Dividers
    (r'\bborder-outline-variant\b', 'border-[#E2E8F0] dark:border-white/10'),
    (r'\bborder-outline\b', 'border-[#CBD5E1] dark:border-white/20'),
    (r'\bdivide-outline-variant\b', 'divide-[#E2E8F0] dark:divide-white/10'),
    
    # Layout & container tokens
    (r'\bmax-w-max-width-canvas\b', 'max-w-6xl'),
    (r'\bpx-gutter-desktop\b', 'px-5 sm:px-8'),
    (r'\bpy-unit-lg\b', 'py-6'),
    (r'\bgap-unit-xl\b', 'gap-6'),
    (r'\bgap-unit-lg\b', 'gap-5'),
    (r'\bgap-unit-md\b', 'gap-4'),
    (r'\bgap-unit-sm\b', 'gap-2'),
    (r'\bgap-unit-xs\b', 'gap-1'),
    (r'\bspace-x-unit-lg\b', 'space-x-5'),
    (r'\bspace-x-unit-md\b', 'space-x-3'),
    (r'\bspace-x-unit-sm\b', 'space-x-2'),
    (r'\bspace-x-unit-xs\b', 'space-x-1'),
    (r'\bspace-y-unit-lg\b', 'space-y-5'),
    (r'\bspace-y-unit-md\b', 'space-y-4'),
    (r'\bspace-y-unit-sm\b', 'space-y-2'),
    (r'\bspace-y-unit-xs\b', 'space-y-1'),
    (r'\bp-unit-xl\b', 'p-8'),
    (r'\bp-unit-lg\b', 'p-6'),
    (r'\bp-unit-base\b', 'p-5'),
    (r'\bpx-unit-base\b', 'px-5'),
    (r'\bpy-unit-base\b', 'py-3'),
    (r'\bp-unit-sm\b', 'p-2'),
    (r'\bp-unit-xs\b', 'p-1'),
    (r'\bpy-unit-sm\b', 'py-2'),
    (r'\bpx-unit-sm\b', 'px-3'),
    (r'\bmb-unit-xl\b', 'mb-8'),
    (r'\bmb-unit-lg\b', 'mb-6'),
    (r'\bmb-unit-md\b', 'mb-4'),
    (r'\bmb-unit-sm\b', 'mb-2'),
    (r'\bmb-unit-xs\b', 'mb-1'),
    (r'\bmt-unit-xl\b', 'mt-8'),
    (r'\bmt-unit-lg\b', 'mt-6'),
    (r'\bmt-unit-md\b', 'mt-4'),
    (r'\bmt-unit-sm\b', 'mt-2'),
    (r'\bmt-unit-xs\b', 'mt-1'),
    (r'\bpt-unit-md\b', 'pt-4'),
    (r'\bpt-unit-xs\b', 'pt-1'),
    (r'\bpb-unit-md\b', 'pb-4'),
    (r'\bpb-unit-sm\b', 'pb-2'),
    (r'\bpb-unit-xs\b', 'pb-1'),

    # Typography tokens
    (r'\bfont-display-lg\b', 'font-extrabold'),
    (r'\btext-display-lg\b', 'text-3xl sm:text-4xl font-extrabold font-mono'),
    (r'\bfont-headline-lg\b', 'font-bold'),
    (r'\btext-headline-lg\b', 'text-2xl sm:text-3xl font-bold'),
    (r'\bfont-headline-md\b', 'font-bold'),
    (r'\btext-headline-md\b', 'text-xl sm:text-2xl font-bold'),
    (r'\bfont-headline-sm\b', 'font-bold'),
    (r'\btext-headline-sm\b', 'text-base sm:text-lg font-bold'),
    (r'\bfont-body-lg\b', 'font-normal'),
    (r'\btext-body-lg\b', 'text-base'),
    (r'\bfont-body-md\b', 'font-normal'),
    (r'\btext-body-md\b', 'text-sm'),
    (r'\bfont-body-sm\b', 'font-normal'),
    (r'\btext-body-sm\b', 'text-xs'),
    (r'\bfont-label-md\b', 'font-semibold'),
    (r'\btext-label-md\b', 'text-xs font-semibold'),
    (r'\bfont-label-sm\b', 'font-semibold'),
    (r'\btext-label-sm\b', 'text-[11px] font-semibold uppercase tracking-wider'),
    (r'\bfont-mono-data\b', 'font-mono'),
    (r'\btext-mono-data\b', 'font-mono text-xs'),
]

def apply_replacements(html):
    for pattern, repl in REPLACEMENTS:
        html = re.sub(pattern, repl, html)
    return html

# ─────────────────────────────────────────────────────────────
# 1. PROCESS ACADEMY.HTML
# ─────────────────────────────────────────────────────────────
with open('academy.html', 'r', encoding='utf-8') as f:
    orig_academy = f.read()

main_match = re.search(r'<main[^>]*>(.*?)</main>', orig_academy, re.DOTALL)
if not main_match:
    print("ERROR: could not find <main> in academy.html")
else:
    academy_main_content = main_match.group(1)
    academy_main_content = re.sub(r'<footer[^>]*>.*?</footer>', '', academy_main_content, flags=re.DOTALL)
    academy_main_content = apply_replacements(academy_main_content)

    academy_head = HEAD_TEMPLATE.replace("{page_title}", "Academic Dean & Accreditation Audit Command Center")
    academy_header = ACADEMY_HEADER
    
    academy_drawer = """<!-- MOBILE SLIDE-OUT DRAWER -->
<div id="academy-mobile-drawer" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm hidden lg:hidden">
  <div class="fixed inset-y-0 left-0 w-72 bg-white dark:bg-[#0c0e14] p-5 flex flex-col justify-between shadow-2xl border-r border-[#E2E8F0] dark:border-white/10 overflow-y-auto">
    <div class="space-y-4">
      <div class="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-gray-800">
        <span class="text-xs uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-bold">Academic Navigation</span>
        <button onclick="closeAcademyMobileMenu()" class="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white">✕</button>
      </div>
      <div class="space-y-1 pt-1">
        <a href="academy.html" class="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs font-bold transition bg-[#0F172A] text-white dark:bg-white/10 dark:text-white shadow-sm">
          <span class="flex items-center gap-3"><span>🏛️</span> <span>Command Center</span></span>
          <span class="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500 text-white font-bold">Active</span>
        </a>
        <a href="#dept-readiness-section" onclick="closeAcademyMobileMenu()" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-xs font-medium text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/5 transition">
          <span>📊</span> <span>Departmental Readiness</span>
        </a>
        <a href="#curriculum-gap-section" onclick="closeAcademyMobileMenu()" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-xs font-medium text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/5 transition">
          <span>🧠</span> <span>Curriculum Gap Audit</span>
        </a>
        <a href="#peer-benchmarking-section" onclick="closeAcademyMobileMenu()" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-xs font-medium text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/5 transition">
          <span>🌐</span> <span>Peer Benchmarking</span>
        </a>
        <a href="student-quiz.html" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-xs font-medium text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/5 transition">
          <span>⚡</span> <span>Quiz Arena</span>
        </a>
        <a href="student-resume.html" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-xs font-medium text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/5 transition">
          <span>📄</span> <span>AI Resume Analyzer</span>
        </a>
        <a href="student-skilltree.html" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-xs font-medium text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/5 transition">
          <span>🌌</span> <span>Skill Constellations</span>
        </a>
        <a href="student-portfolio.html" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-xs font-medium text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/5 transition">
          <span>🏆</span> <span>Verified Dossier Ledger</span>
        </a>
      </div>
    </div>
    <div class="pt-4 border-t border-slate-200 dark:border-gray-800">
      <button onclick="JoblexApiClient.logout()" class="w-full py-2.5 rounded-xl text-center text-xs font-semibold text-slate-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition flex items-center justify-center gap-2">
        <span>🚪</span> <span>Sign Out</span>
      </button>
    </div>
  </div>
</div>"""

    academy_sidebar = """  <!-- COLLAPSIBLE SIDEBAR -->
  <aside id="academy-sidebar" class="hidden lg:flex w-64 bg-white/90 dark:bg-[#080812]/90 border-r border-[#E2E8F0] dark:border-white/5 backdrop-blur-md p-3.5 flex-col justify-between shrink-0 transition-all duration-300">
    <div class="space-y-1">
      <div class="flex items-center justify-between px-2 pb-2 mb-2 border-b border-slate-200 dark:border-gray-800/80">
        <span class="sidebar-text-label text-[10px] uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-bold">Academic Modules</span>
        <button id="academy-sidebar-collapse-btn" onclick="toggleAcademySidebarCollapse()" title="Minimize / Expand Sidebar" class="p-1.5 rounded-lg bg-slate-100 dark:bg-gray-900 border border-slate-200 dark:border-gray-800 text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white text-xs transition">
          <span>◀</span>
        </button>
      </div>
      <a href="academy.html" class="academy-sidebar-btn sidebar-nav-btn w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all bg-[#0F172A] text-white dark:bg-white/10 dark:text-white shadow-sm">
        <span class="text-base shrink-0">🏛️</span>
        <div class="sidebar-text-label flex flex-col text-left overflow-hidden">
          <span class="font-bold text-xs truncate">Command Center</span>
          <span class="text-[10px] text-gray-300 dark:text-gray-400 truncate">Council &amp; TPO Overview</span>
        </div>
      </a>
      <a href="#dept-readiness-section" class="academy-sidebar-btn sidebar-nav-btn w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all text-[#475569] dark:text-gray-400 hover:text-[#0F172A] dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-white/5 border border-transparent">
        <span class="text-base shrink-0">📊</span>
        <span class="sidebar-text-label font-bold text-xs">Departmental Readiness</span>
      </a>
      <a href="#curriculum-gap-section" class="academy-sidebar-btn sidebar-nav-btn w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all text-[#475569] dark:text-gray-400 hover:text-[#0F172A] dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-white/5 border border-transparent">
        <span class="text-base shrink-0">🧠</span>
        <span class="sidebar-text-label font-bold text-xs">Curriculum Gap Audit</span>
      </a>
      <a href="#peer-benchmarking-section" class="academy-sidebar-btn sidebar-nav-btn w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all text-[#475569] dark:text-gray-400 hover:text-[#0F172A] dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-white/5 border border-transparent">
        <span class="text-base shrink-0">🌐</span>
        <span class="sidebar-text-label font-bold text-xs">Peer Benchmarking</span>
      </a>
      <a href="student-quiz.html" class="academy-sidebar-btn sidebar-nav-btn w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all text-[#475569] dark:text-gray-400 hover:text-[#0F172A] dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-white/5 border border-transparent">
        <span class="text-base shrink-0">⚡</span>
        <span class="sidebar-text-label font-bold text-xs">Quiz Arena</span>
      </a>
      <a href="student-resume.html" class="academy-sidebar-btn sidebar-nav-btn w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all text-[#475569] dark:text-gray-400 hover:text-[#0F172A] dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-white/5 border border-transparent">
        <span class="text-base shrink-0">📄</span>
        <span class="sidebar-text-label font-bold text-xs">AI Resume Analyzer</span>
      </a>
      <a href="student-skilltree.html" class="academy-sidebar-btn sidebar-nav-btn w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all text-[#475569] dark:text-gray-400 hover:text-[#0F172A] dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-white/5 border border-transparent">
        <span class="text-base shrink-0">🌌</span>
        <span class="sidebar-text-label font-bold text-xs">Skill Constellations</span>
      </a>
      <a href="student-portfolio.html" class="academy-sidebar-btn sidebar-nav-btn w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all text-[#475569] dark:text-gray-400 hover:text-[#0F172A] dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-white/5 border border-transparent">
        <span class="text-base shrink-0">🏆</span>
        <span class="sidebar-text-label font-bold text-xs">Verified Dossier Ledger</span>
      </a>
    </div>
    <div class="mt-4 pt-3 border-t border-slate-200 dark:border-gray-800/80">
      <button onclick="JoblexApiClient.logout()" class="w-full py-2 rounded-xl text-center text-xs font-semibold text-slate-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition flex items-center justify-center gap-2">
        <span>🚪</span> <span class="sidebar-text-label">Sign Out</span>
      </button>
    </div>
  </aside>"""

    academy_scripts = """
<script>
  function toggleTheme() {
    const isDark = document.documentElement.classList.toggle('dark');
    try {
      localStorage.setItem('joblex_theme', isDark ? 'dark' : 'light');
    } catch(e) {}
    updateThemeIcon();
  }

  function updateThemeIcon() {
    const icon = document.getElementById('theme-toggle-icon');
    if (!icon) return;
    const isDark = document.documentElement.classList.contains('dark');
    icon.textContent = isDark ? 'light_mode' : 'dark_mode';
  }

  function toggleAcademyMobileMenu() {
    const drawer = document.getElementById('academy-mobile-drawer');
    if (drawer) drawer.classList.toggle('hidden');
  }

  function closeAcademyMobileMenu() {
    const drawer = document.getElementById('academy-mobile-drawer');
    if (drawer) drawer.classList.add('hidden');
  }

  function toggleAcademySidebarCollapse() {
    const sidebar = document.getElementById('academy-sidebar');
    if (!sidebar) return;
    sidebar.classList.toggle('sidebar-collapsed');
    const btn = document.getElementById('academy-sidebar-collapse-btn');
    if (btn) {
      btn.innerHTML = sidebar.classList.contains('sidebar-collapsed') ? '<span>▶</span>' : '<span>◀</span>';
    }
  }

  function handleExportAQAR() {
    alert("Generating Statutory NAAC AQAR Criterion 3.4 & OBE Data Dossier (PDF/CSV)...\\nRegistry Reference: AIIA-AC-2025/Q1\\nNAAC Cycle: Statutory Cycle IV");
  }

  function handleSyndicateChanges() {
    alert("Curriculum Modernization Proposal successfully submitted to the Academic Council Syndicate.\\nRatification queued for upcoming BoS review session.");
  }

  function handleAdoptSyllabus(name) {
    alert(`Success: "${name}" curriculum add-on adopted for Academic Council BoS ratification.`);
  }

  function viewAuditLog() {
    alert("Statutory Audit Log:\\nNode: AIIA Central Verification Hub\\nCryptographic Ledger Hash: SHA-256 (0x7F2A...B94C)\\nVerified Status: Compliant under Ministry of Ayush Standards");
  }

  function downloadPeerMatrix() {
    alert("Downloading Cross-College Institutional Outcome Benchmark Matrix (CSV)...\\nPercentile: Top 1.2% Nationally");
  }

  document.addEventListener('DOMContentLoaded', () => {
    updateThemeIcon();
    if (window.JoblexApiClient && typeof JoblexApiClient.requireAuth === 'function') {
      JoblexApiClient.requireAuth('academy');
    }
  });
</script>
<script src="js/frontend/api-client.js"></script>
<script src="js/frontend/notifications.js"></script>
<script src="js/frontend/academy-ui.js"></script>
</body>
</html>
"""

    full_academy_html = f"""{academy_head}
{academy_header}
{academy_drawer}
<div class="flex-1 flex overflow-hidden">
{academy_sidebar}
  <!-- WORKSPACE -->
  <main class="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 custom-scrollbar">
    <div class="w-full max-w-6xl mx-auto flex flex-col gap-6">
{academy_main_content}
    </div>
{FOOTER_TEMPLATE}
  </main>
</div>
{academy_scripts}"""

    with open('academy.html', 'w', encoding='utf-8') as f:
        f.write(full_academy_html)
    with open('public/academy.html', 'w', encoding='utf-8') as f:
        f.write(full_academy_html)
    print("academy.html standardized and synced successfully.")

# ─────────────────────────────────────────────────────────────
# 2. PROCESS INDUSTRY.HTML
# ─────────────────────────────────────────────────────────────
with open('industry.html', 'r', encoding='utf-8') as f:
    orig_industry = f.read()

main_match = re.search(r'<main[^>]*>(.*?)</main>', orig_industry, re.DOTALL)
if not main_match:
    print("ERROR: could not find <main> in industry.html")
else:
    industry_main_content = main_match.group(1)
    industry_main_content = re.sub(r'<footer[^>]*>.*?</footer>', '', industry_main_content, flags=re.DOTALL)
    industry_main_content = apply_replacements(industry_main_content)

    industry_head = HEAD_TEMPLATE.replace("{page_title}", "Industry & Corporate Talent Gateway")
    industry_header = INDUSTRY_HEADER

    industry_drawer = """<!-- MOBILE SLIDE-OUT DRAWER -->
<div id="industry-mobile-drawer" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm hidden lg:hidden">
  <div class="fixed inset-y-0 left-0 w-72 bg-white dark:bg-[#0c0e14] p-5 flex flex-col justify-between shadow-2xl border-r border-[#E2E8F0] dark:border-white/10 overflow-y-auto">
    <div class="space-y-4">
      <div class="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-gray-800">
        <span class="text-xs uppercase tracking-wider text-blue-600 dark:text-blue-400 font-bold">Enterprise Navigation</span>
        <button onclick="closeIndustryMobileMenu()" class="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white">✕</button>
      </div>
      <div class="space-y-1 pt-1">
        <a href="industry.html" class="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs font-bold transition bg-[#0F172A] text-white dark:bg-white/10 dark:text-white shadow-sm">
          <span class="flex items-center gap-3"><span>🏢</span> <span>Talent Gateway</span></span>
          <span class="text-[9px] px-1.5 py-0.5 rounded-full bg-blue-500 text-white font-bold">Active</span>
        </a>
        <a href="#candidate-dossiers-section" onclick="closeIndustryMobileMenu()" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-xs font-medium text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/5 transition">
          <span>👥</span> <span>Candidate Dossiers</span>
        </a>
        <a href="#skill-calibrator-section" onclick="closeIndustryMobileMenu()" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-xs font-medium text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/5 transition">
          <span>🎯</span> <span>AI Talent Calibrator</span>
        </a>
        <a href="#corporate-requisitions-section" onclick="closeIndustryMobileMenu()" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-xs font-medium text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/5 transition">
          <span>💼</span> <span>Corporate Requisitions</span>
        </a>
        <a href="student-resume.html" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-xs font-medium text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/5 transition">
          <span>📄</span> <span>Resume Benchmark</span>
        </a>
        <a href="student-skilltree.html" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-xs font-medium text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/5 transition">
          <span>🌐</span> <span>Skill Constellations</span>
        </a>
        <a href="student-portfolio.html" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-xs font-medium text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/5 transition">
          <span>🏆</span> <span>Verified Dossier Ledger</span>
        </a>
      </div>
    </div>
    <div class="pt-4 border-t border-slate-200 dark:border-gray-800">
      <button onclick="JoblexApiClient.logout()" class="w-full py-2.5 rounded-xl text-center text-xs font-semibold text-slate-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition flex items-center justify-center gap-2">
        <span>🚪</span> <span>Sign Out</span>
      </button>
    </div>
  </div>
</div>"""

    industry_sidebar = """  <!-- COLLAPSIBLE SIDEBAR -->
  <aside id="industry-sidebar" class="hidden lg:flex w-64 bg-white/90 dark:bg-[#080812]/90 border-r border-[#E2E8F0] dark:border-white/5 backdrop-blur-md p-3.5 flex-col justify-between shrink-0 transition-all duration-300">
    <div class="space-y-1">
      <div class="flex items-center justify-between px-2 pb-2 mb-2 border-b border-slate-200 dark:border-gray-800/80">
        <span class="sidebar-text-label text-[10px] uppercase tracking-wider text-blue-600 dark:text-blue-400 font-bold">Enterprise Modules</span>
        <button id="industry-sidebar-collapse-btn" onclick="toggleIndustrySidebarCollapse()" title="Minimize / Expand Sidebar" class="p-1.5 rounded-lg bg-slate-100 dark:bg-gray-900 border border-slate-200 dark:border-gray-800 text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white text-xs transition">
          <span>◀</span>
        </button>
      </div>
      <a href="industry.html" class="industry-sidebar-btn sidebar-nav-btn w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all bg-[#0F172A] text-white dark:bg-white/10 dark:text-white shadow-sm">
        <span class="text-base shrink-0">🏢</span>
        <div class="sidebar-text-label flex flex-col text-left overflow-hidden">
          <span class="font-bold text-xs truncate">Talent Gateway</span>
          <span class="text-[10px] text-gray-300 dark:text-gray-400 truncate">Corporate Recruitment</span>
        </div>
      </a>
      <a href="industry-candidates.html" class="industry-sidebar-btn sidebar-nav-btn w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all text-[#475569] dark:text-gray-400 hover:text-[#0F172A] dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-white/5 border border-transparent">
        <span class="text-base shrink-0">👥</span>
        <span class="sidebar-text-label font-bold text-xs">Candidate Dossiers</span>
      </a>
      <a href="industry-calibrator.html" class="industry-sidebar-btn sidebar-nav-btn w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all text-[#475569] dark:text-gray-400 hover:text-[#0F172A] dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-white/5 border border-transparent">
        <span class="text-base shrink-0">🎯</span>
        <span class="sidebar-text-label font-bold text-xs">AI Talent Calibrator</span>
      </a>
      <a href="industry-requisitions.html" class="industry-sidebar-btn sidebar-nav-btn w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all text-[#475569] dark:text-gray-400 hover:text-[#0F172A] dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-white/5 border border-transparent">
        <span class="text-base shrink-0">💼</span>
        <span class="sidebar-text-label font-bold text-xs">Corporate Requisitions</span>
      </a>
      <a href="industry-mous.html" class="industry-sidebar-btn sidebar-nav-btn w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all text-[#475569] dark:text-gray-400 hover:text-[#0F172A] dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-white/5 border border-transparent">
        <span class="text-base shrink-0">🤝</span>
        <span class="sidebar-text-label font-bold text-xs">Bilateral MoUs</span>
      </a>
      <a href="industry-bootcamps.html" class="industry-sidebar-btn sidebar-nav-btn w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all text-[#475569] dark:text-gray-400 hover:text-[#0F172A] dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-white/5 border border-transparent">
        <span class="text-base shrink-0">🚀</span>
        <span class="sidebar-text-label font-bold text-xs">Sponsored Bootcamps</span>
      </a>
      <a href="industry-grants.html" class="industry-sidebar-btn sidebar-nav-btn w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all text-[#475569] dark:text-gray-400 hover:text-[#0F172A] dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-white/5 border border-transparent">
        <span class="text-base shrink-0">🔬</span>
        <span class="sidebar-text-label font-bold text-xs">Consultancy Grants</span>
      </a>
    </div>
    <div class="mt-4 pt-3 border-t border-slate-200 dark:border-gray-800/80">
      <button onclick="JoblexApiClient.logout()" class="w-full py-2 rounded-xl text-center text-xs font-semibold text-slate-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition flex items-center justify-center gap-2">
        <span>🚪</span> <span class="sidebar-text-label">Sign Out</span>
      </button>
    </div>
  </aside>"""

    industry_scripts = """
<script>
  function toggleTheme() {
    const isDark = document.documentElement.classList.toggle('dark');
    try {
      localStorage.setItem('joblex_theme', isDark ? 'dark' : 'light');
    } catch(e) {}
    updateThemeIcon();
  }

  function updateThemeIcon() {
    const icon = document.getElementById('theme-toggle-icon');
    if (!icon) return;
    const isDark = document.documentElement.classList.contains('dark');
    icon.textContent = isDark ? 'light_mode' : 'dark_mode';
  }

  function toggleIndustryMobileMenu() {
    const drawer = document.getElementById('industry-mobile-drawer');
    if (drawer) drawer.classList.toggle('hidden');
  }

  function closeIndustryMobileMenu() {
    const drawer = document.getElementById('industry-mobile-drawer');
    if (drawer) drawer.classList.add('hidden');
  }

  function toggleIndustrySidebarCollapse() {
    const sidebar = document.getElementById('industry-sidebar');
    if (!sidebar) return;
    sidebar.classList.toggle('sidebar-collapsed');
    const btn = document.getElementById('industry-sidebar-collapse-btn');
    if (btn) {
      btn.innerHTML = sidebar.classList.contains('sidebar-collapsed') ? '<span>▶</span>' : '<span>◀</span>';
    }
  }

  function handleAuditExport() {
    alert("Exporting Corporate Recruitment Audit Ledger (CSV)...\\nLedger Node: AIIA-NCR-04\\nProtocol: ISO-27001 Certified");
  }

  function handleNewRequisition() {
    const title = prompt("Enter Corporate Requisition Title (e.g. Lead Ayush Clinical Pharmacologist):");
    if (title) {
      alert(`Requisition "${title}" drafted.\\nDispatched to AIIA & Ministry of Ayush Dean Syndicate.`);
    }
  }

  function handleViewLedger(candidate) {
    alert(`AIIA Cryptographic Ledger Validated:\\nCandidate: ${candidate}\\nStatus: Block-Validated on National Ayush Academic Registry (NAAR)\\nSignatures: Dean Academic Affairs & Central Testing Lab`);
  }

  function handleScheduleInterview(candidate) {
    alert(`Technical Interview request sent for ${candidate}.\\nInterview notification dispatched to candidate dashboard and AIIA Placement Cell.`);
  }

  function handleConfirmSlot(candidate) {
    alert(`Interview slot confirmed for ${candidate}.\\nSession details: Virtual Ayush R&D Panel • Calendar invite dispatched.`);
  }

  function handleExamineDossier(candidate) {
    alert(`Opening Full Validated Dossier for ${candidate}...\\nIncluded: HPTLC Spectral Plates, AutoDock Binding Logs, and NABL Lab Hours.`);
  }

  function handleRequestAssessment(candidate) {
    alert(`Custom technical assessment request issued to ${candidate} through AIIA Health Informatics portal.`);
  }

  function handleDispatchInquiry() {
    alert("Direct Corporate Inbound Inquiry dispatched to 14 unreleased scholars at AIIA New Delhi, GAU Jamnagar, and NIA Jaipur.");
  }

  function handleSubmitCalibration() {
    alert("Updated AI Scoring Weights successfully submitted to AYUSH-ML Talent Recommendation Model.");
  }

  function filterCandidateDossiers(query) {
    const q = (query || '').toLowerCase();
    const cards = document.querySelectorAll('#candidate-dossiers-section > div');
    cards.forEach(card => {
      const text = card.textContent.toLowerCase();
      if (!q || text.includes(q)) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    updateThemeIcon();
    if (window.JoblexApiClient && typeof JoblexApiClient.requireAuth === 'function') {
      JoblexApiClient.requireAuth('industry');
    }
  });
</script>
<script src="js/frontend/api-client.js"></script>
<script src="js/frontend/notifications.js"></script>
<script src="js/frontend/industry-ui.js"></script>
</body>
</html>
"""

    full_industry_html = f"""{industry_head}
{industry_header}
{industry_drawer}
<div class="flex-1 flex overflow-hidden">
{industry_sidebar}
  <!-- WORKSPACE -->
  <main class="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 custom-scrollbar">
    <div class="w-full max-w-6xl mx-auto flex flex-col gap-6">
{industry_main_content}
    </div>
{FOOTER_TEMPLATE}
  </main>
</div>
{industry_scripts}"""

    with open('industry.html', 'w', encoding='utf-8') as f:
        f.write(full_industry_html)
    with open('public/industry.html', 'w', encoding='utf-8') as f:
        f.write(full_industry_html)
    print("industry.html standardized and synced successfully.")
