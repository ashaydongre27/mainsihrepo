import os
import re

# ─────────────────────────────────────────────────────────────
# 1. STANDARDIZED HEAD TEMPLATE (ZERO CSS VARIABLES, STANDARD TAILWIND)
# ─────────────────────────────────────────────────────────────
HEAD_TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>JOBLEX | {page_title}</title>
  <!-- Material Symbols Outlined -->
  <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
  <!-- Google Fonts: Inter & JetBrains Mono -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <!-- Early Theme Detection Script to prevent FOUC -->
  <script>
    (function() {
      try {
        const saved = localStorage.getItem('joblex_theme');
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (saved === 'dark' || (!saved && prefersDark)) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      } catch(e) {}
    })();
  </script>
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: "class",
      theme: {
        extend: {
          fontFamily: {
            sans: ['Inter', 'sans-serif'],
            mono: ['JetBrains Mono', 'monospace']
          }
        }
      }
    }
  </script>
  <!-- Custom Styles -->
  <link rel="stylesheet" href="css/styles.css">
  <style>
    .material-symbols-outlined {
      font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 20;
      display: inline-block;
      vertical-align: middle;
      line-height: 1;
    }
    .custom-scrollbar::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: transparent;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: rgba(148, 163, 184, 0.3);
      border-radius: 9999px;
    }
    .dark .custom-scrollbar::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.1);
    }
    .sidebar-collapsed {
      width: 5rem !important;
    }
    .sidebar-collapsed .sidebar-text-label,
    .sidebar-collapsed .sidebar-badge-label {
      display: none !important;
    }
    .sidebar-collapsed .sidebar-nav-btn {
      justify-content: center !important;
      padding-left: 0.5rem !important;
      padding-right: 0.5rem !important;
    }
  </style>
</head>
<body class="bg-gradient-to-b from-[#FFFFFF] via-[#F8F9FA] to-[#F1F3F5] dark:from-[#07071A] dark:via-[#090924] dark:to-[#07071A] text-[#0F172A] dark:text-slate-100 font-sans min-h-screen flex flex-col antialiased transition-colors duration-200">
"""

# ─────────────────────────────────────────────────────────────
# 2. STANDARDIZED HEADER FOR STUDENT PORTAL
# ─────────────────────────────────────────────────────────────
STUDENT_HEADER = """
<header class="sticky top-0 z-50 w-full bg-white/90 dark:bg-[#07071A]/95 backdrop-blur-md border-b border-[#E2E8F0] dark:border-white/5 transition-colors duration-200">
  <div class="max-w-6xl mx-auto px-5 sm:px-8 py-3 flex items-center justify-between">
    <!-- Mobile Hamburger + Brand Logo -->
    <div class="flex items-center gap-3">
      <button onclick="toggleMobileMenu()" class="lg:hidden p-2 rounded-xl text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/5 border border-slate-200 dark:border-gray-800 transition" aria-label="Toggle Navigation">
        <span class="material-symbols-outlined text-[20px]">menu</span>
      </button>
      <a href="student.html" class="flex items-center gap-2.5 cursor-pointer select-none">
        <div class="w-1.5 h-8 bg-gradient-to-b from-cyan-400 to-purple-600 rounded-full shadow-[0_0_12px_rgba(99,102,241,0.7)]"></div>
        <div>
          <span class="text-xl font-extrabold tracking-widest text-[#0F172A] dark:text-white uppercase block">JOBLEX</span>
          <span class="hidden sm:block text-[9px] text-[#64748B] dark:text-gray-400 tracking-widest uppercase font-semibold">Ministry of Ayush · Student Portal</span>
        </div>
      </a>
    </div>

    <!-- Student Stats + Notifications + Theme Toggle + Avatar -->
    <div class="flex items-center gap-2 sm:gap-3">
      <!-- Live Metrics -->
      <span id="header-xp-badge" class="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-mono text-xs font-bold border border-purple-200 dark:border-purple-800/60">
        🔥 1,450 XP
      </span>
      <span id="header-streak-badge" class="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-mono text-xs font-bold border border-emerald-200 dark:border-emerald-800/60">
        🎯 7-Day Streak
      </span>

      <!-- Notification Bell -->
      <button id="notification-bell-btn" type="button" aria-label="Open Notifications" class="relative p-2 rounded-xl text-[#475569] dark:text-gray-300 hover:text-[#0F172A] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 border border-[#E2E8F0] dark:border-white/10 transition-colors">
        <span class="material-symbols-outlined text-[20px]">notifications</span>
        <span class="notification-badge-indicator absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-purple-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
          3
        </span>
      </button>

      <!-- Theme Switcher -->
      <button id="theme-toggle-btn" onclick="toggleTheme()" aria-label="Toggle Light/Dark Theme" title="Toggle Light/Dark Theme" class="p-2 rounded-xl border border-[#E2E8F0] dark:border-white/10 bg-white dark:bg-white/5 text-[#475569] dark:text-gray-300 hover:text-[#0F172A] dark:hover:text-white transition-colors duration-150 flex items-center justify-center">
        <span id="theme-toggle-icon" class="material-symbols-outlined text-[18px]">dark_mode</span>
      </button>

      <!-- Student Profile Chip -->
      <div class="flex items-center gap-2 pl-2 border-l border-[#E2E8F0] dark:border-white/10">
        <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
          AV
        </div>
        <div class="hidden xl:flex flex-col text-left">
          <span class="user-name-display text-xs font-bold text-[#0F172A] dark:text-white truncate max-w-[120px]">Ashay Verma</span>
          <span class="text-[10px] text-[#64748B] dark:text-gray-400 font-mono">BAMS 3rd Year</span>
        </div>
      </div>
    </div>
  </div>
</header>
"""

# ─────────────────────────────────────────────────────────────
# 3. STUDENT SIDEBAR BUILDER
# ─────────────────────────────────────────────────────────────
NAV_ITEMS = [
    ("student.html", "dashboard", "📊", "Student Overview", "Central Dashboard"),
    ("student-roadmap.html", "timeline", "🗺️", "Career Roadmap", "4-Phase Progression"),
    ("student-resume.html", "description", "📄", "AI Resume Analyzer", "Skill Gap Discovery"),
    ("student-quiz.html", "bolt", "⚡", "Quiz Arena", "Knowledge Validation"),
    ("student-internships.html", "business_center", "💼", "Apply for Internships", "Fellowships & Bounties"),
    ("student-jobs.html", "work", "🏢", "Apply for Jobs", "Corporate Placements"),
    ("student-zulu.html", "smart_toy", "🤖", "Zulu AI Companion", "Career Counselor"),
    ("student-skilltree.html", "hub", "🌐", "Skill Constellation", "Interactive 2D Map"),
    ("student-portfolio.html", "military_tech", "🏆", "Verified Portfolio", "Tamper-Proof Ledger"),
]

def make_student_sidebar(active_href):
    items_html = []
    for href, icon, emoji, label, sub in NAV_ITEMS:
        is_active = (href == active_href)
        if is_active:
            btn_class = "bg-[#0F172A] text-white dark:bg-white/10 dark:text-white shadow-sm"
            sub_class = "text-gray-300 dark:text-gray-400"
        else:
            btn_class = "text-[#475569] dark:text-gray-400 hover:text-[#0F172A] dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-white/5 border border-transparent"
            sub_class = "text-[#64748B] dark:text-gray-500"

        items_html.append(f"""      <a href="{href}" class="sidebar-nav-btn w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all {btn_class}">
        <span class="text-base shrink-0">{emoji}</span>
        <div class="sidebar-text-label flex flex-col text-left overflow-hidden">
          <span class="font-bold text-xs truncate">{label}</span>
          <span class="text-[10px] {sub_class} truncate">{sub}</span>
        </div>
      </a>""")

    sidebar_body = "\n".join(items_html)
    return f"""  <!-- COLLAPSIBLE SIDEBAR -->
  <aside id="student-sidebar" class="hidden lg:flex w-64 bg-white/90 dark:bg-[#080812]/90 border-r border-[#E2E8F0] dark:border-white/5 backdrop-blur-md p-3.5 flex-col justify-between shrink-0 transition-all duration-300">
    <div class="space-y-1">
      <div class="flex items-center justify-between px-2 pb-2 mb-2 border-b border-slate-200 dark:border-gray-800/80">
        <span class="sidebar-text-label text-[10px] uppercase tracking-wider text-purple-600 dark:text-purple-400 font-bold">Student Modules</span>
        <button id="sidebar-collapse-btn" onclick="toggleSidebarCollapse()" title="Minimize / Expand Sidebar" class="p-1.5 rounded-lg bg-slate-100 dark:bg-gray-900 border border-slate-200 dark:border-gray-800 text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white text-xs transition">
          <span>◀</span>
        </button>
      </div>
{sidebar_body}
    </div>
    <div class="mt-4 pt-3 border-t border-slate-200 dark:border-gray-800/80">
      <button onclick="JoblexApiClient.logout()" class="w-full py-2 rounded-xl text-center text-xs font-semibold text-slate-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition flex items-center justify-center gap-2">
        <span>🚪</span> <span class="sidebar-text-label">Sign Out</span>
      </button>
    </div>
  </aside>"""

def make_student_drawer(active_href):
    items_html = []
    for href, icon, emoji, label, sub in NAV_ITEMS:
        is_active = (href == active_href)
        if is_active:
            btn_class = "bg-[#0F172A] text-white dark:bg-white/10 dark:text-white font-bold"
        else:
            btn_class = "text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/5"

        items_html.append(f"""        <a href="{href}" onclick="closeMobileMenu()" class="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs font-medium transition {btn_class}">
          <span class="flex items-center gap-3"><span>{emoji}</span> <span>{label}</span></span>
          {f'<span class="text-[9px] px-1.5 py-0.5 rounded-full bg-purple-500 text-white font-bold">Active</span>' if is_active else ''}
        </a>""")

    drawer_body = "\n".join(items_html)
    return f"""<!-- MOBILE SLIDE-OUT DRAWER -->
<div id="mobile-drawer" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm hidden lg:hidden">
  <div class="fixed inset-y-0 left-0 w-72 bg-white dark:bg-[#0c0e14] p-5 flex flex-col justify-between shadow-2xl border-r border-[#E2E8F0] dark:border-white/10 overflow-y-auto">
    <div class="space-y-4">
      <div class="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-gray-800">
        <span class="text-xs uppercase tracking-wider text-purple-600 dark:text-purple-400 font-bold">Student Navigation</span>
        <button onclick="closeMobileMenu()" class="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white">✕</button>
      </div>
      <div class="space-y-1 pt-1">
{drawer_body}
      </div>
    </div>
    <div class="pt-4 border-t border-slate-200 dark:border-gray-800">
      <button onclick="JoblexApiClient.logout()" class="w-full py-2.5 rounded-xl text-center text-xs font-semibold text-slate-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition flex items-center justify-center gap-2">
        <span>🚪</span> <span>Sign Out</span>
      </button>
    </div>
  </div>
</div>"""

# ─────────────────────────────────────────────────────────────
# 4. FOOTER TEMPLATE
# ─────────────────────────────────────────────────────────────
FOOTER_TEMPLATE = """
<footer class="bg-white/90 dark:bg-[#07071A]/95 border-t border-[#E2E8F0] dark:border-white/5 mt-12 transition-colors duration-200">
  <div class="max-w-6xl mx-auto px-5 sm:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#64748B] dark:text-gray-400">
    <div class="text-center md:text-left space-y-1">
      <div class="font-bold text-[#0F172A] dark:text-white uppercase tracking-wider">JOBLEX Platform</div>
      <div>© 2025 JOBLEX. All India Institute of Ayurveda &amp; Ministry of Ayush, Government of India.</div>
    </div>
    <nav class="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs">
      <a href="#" class="hover:text-[#0F172A] dark:hover:text-white transition-colors">NAAC Statutory Governance</a>
      <a href="#" class="hover:text-[#0F172A] dark:hover:text-white transition-colors">AIIA Verification Protocol</a>
      <a href="#" class="hover:text-[#0F172A] dark:hover:text-white transition-colors">Terms of Institutional Access</a>
      <a href="#" class="hover:text-[#0F172A] dark:hover:text-white transition-colors">National Ayush Registry</a>
    </nav>
  </div>
</footer>
"""

# ─────────────────────────────────────────────────────────────
# 5. SCRIPTS TEMPLATE
# ─────────────────────────────────────────────────────────────
SCRIPTS_TEMPLATE = """
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

  document.addEventListener('DOMContentLoaded', () => {
    updateThemeIcon();
  });
</script>
<script src="js/frontend/api-client.js"></script>
<script src="js/frontend/notifications.js"></script>
<script src="js/frontend/student-ui.js"></script>
</body>
</html>
"""

print("Base templates defined successfully.")
