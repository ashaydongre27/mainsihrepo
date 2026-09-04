import os
import re

BRAIN_DIR = r"C:\Users\Ashay\.gemini\antigravity\brain\e435a896-4db8-4890-9113-c9ffc934846f\.user_uploaded"
BASE_DIR = r"A:\ProgrammingCodes\Projects\SIH 26\mainsihrepo"

LIGHT_VARS = {
    "--secondary-fixed": "#d8e3fb",
    "--surface-dim": "#cbdbf5",
    "--surface-container-low": "#eff4ff",
    "--background": "#f8f9ff",
    "--on-primary-container": "#7c839b",
    "--outline-variant": "#c6c6cd",
    "--tertiary": "#000000",
    "--secondary-fixed-dim": "#bcc7de",
    "--on-tertiary-container": "#339471",
    "--on-primary-fixed": "#131b2e",
    "--on-tertiary-fixed-variant": "#00513a",
    "--tertiary-fixed-dim": "#7bd8b1",
    "--on-primary-fixed-variant": "#3f465c",
    "--primary-fixed-dim": "#bec6e0",
    "--surface-container-lowest": "#ffffff",
    "--primary-fixed": "#dae2fd",
    "--inverse-primary": "#bec6e0",
    "--secondary-container": "#d5e0f8",
    "--surface-tint": "#565e74",
    "--on-error-container": "#93000a",
    "--on-background": "#0b1c30",
    "--primary-container": "#131b2e",
    "--error-container": "#ffdad6",
    "--on-secondary": "#ffffff",
    "--secondary": "#545f73",
    "--on-primary": "#ffffff",
    "--on-tertiary-fixed": "#002115",
    "--tertiary-fixed": "#97f5cc",
    "--on-secondary-fixed": "#111c2d",
    "--on-error": "#ffffff",
    "--inverse-surface": "#213145",
    "--on-surface": "#0b1c30",
    "--inverse-on-surface": "#eaf1ff",
    "--outline": "#76777d",
    "--surface": "#f8f9ff",
    "--on-secondary-fixed-variant": "#3c475a",
    "--surface-container-high": "#dce9ff",
    "--error": "#ba1a1a",
    "--surface-container-highest": "#d3e4fe",
    "--primary": "#000000",
    "--surface-container": "#e5eeff",
    "--on-secondary-container": "#586377",
    "--on-surface-variant": "#45464d",
    "--tertiary-container": "#002115",
    "--surface-variant": "#d3e4fe",
    "--on-tertiary": "#ffffff",
    "--surface-bright": "#f8f9ff"
}

DARK_VARS = {
    "--secondary-fixed": "#6ffbbe",
    "--surface-dim": "#111317",
    "--surface-container-low": "#1a1c20",
    "--background": "#111317",
    "--on-primary-container": "#00285d",
    "--outline-variant": "#424754",
    "--tertiary": "#ffb786",
    "--secondary-fixed-dim": "#4edea3",
    "--on-tertiary-container": "#461f00",
    "--on-primary-fixed": "#001a42",
    "--on-tertiary-fixed-variant": "#723600",
    "--tertiary-fixed-dim": "#ffb786",
    "--on-primary-fixed-variant": "#004395",
    "--primary-fixed-dim": "#adc6ff",
    "--surface-container-lowest": "#0c0e12",
    "--primary-fixed": "#d8e2ff",
    "--inverse-primary": "#005ac2",
    "--secondary-container": "#00a572",
    "--surface-tint": "#adc6ff",
    "--on-error-container": "#ffdad6",
    "--on-background": "#e2e2e8",
    "--primary-container": "#4d8eff",
    "--error-container": "#93000a",
    "--on-secondary": "#003824",
    "--secondary": "#4edea3",
    "--on-primary": "#002e6a",
    "--on-tertiary-fixed": "#311400",
    "--tertiary-fixed": "#ffdcc6",
    "--on-secondary-fixed": "#002113",
    "--on-error": "#690005",
    "--inverse-surface": "#e2e2e8",
    "--on-surface": "#e2e2e8",
    "--inverse-on-surface": "#2f3035",
    "--outline": "#8c909f",
    "--surface": "#111317",
    "--on-secondary-fixed-variant": "#005236",
    "--surface-container-high": "#282a2e",
    "--error": "#ffb4ab",
    "--surface-container-highest": "#333539",
    "--primary": "#adc6ff",
    "--surface-container": "#1e2024",
    "--on-secondary-container": "#00311f",
    "--on-surface-variant": "#c2c6d6",
    "--tertiary-container": "#df7412",
    "--surface-variant": "#333539",
    "--on-tertiary": "#502400",
    "--surface-bright": "#37393e"
}

def generate_css_vars():
    light_str = "\n".join(f"    {k}: {v};" for k, v in LIGHT_VARS.items())
    dark_str = "\n".join(f"    {k}: {v};" for k, v in DARK_VARS.items())
    return f"""<style>
  :root {{
{light_str}
  }}

  html.dark {{
{dark_str}
  }}

  .material-symbols-outlined {{
    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 20;
    display: inline-block;
    vertical-align: middle;
    line-height: 1;
  }}
</style>"""

def generate_tailwind_config():
    color_entries = []
    for k in LIGHT_VARS.keys():
        token_name = k[2:]
        color_entries.append(f'            "{token_name}": "var({k})"')
    colors_str = ",\n".join(color_entries)

    return f"""<script id="tailwind-config">
    tailwind.config = {{
      darkMode: "class",
      theme: {{
        extend: {{
          "colors": {{
{colors_str}
          }},
          "borderRadius": {{
            "DEFAULT": "0.125rem",
            "lg": "0.25rem",
            "xl": "0.5rem",
            "full": "0.75rem"
          }},
          "spacing": {{
            "unit-md": "0.75rem",
            "unit-xs": "0.25rem",
            "unit-2xl": "3rem",
            "unit-xl": "2rem",
            "unit-sm": "0.5rem",
            "max-width-canvas": "1600px",
            "gutter-desktop": "1.5rem",
            "unit-lg": "1.5rem",
            "unit-base": "1rem",
            "unit-2xs": "0.125rem",
            "unit-3xl": "4rem",
            "margin-shell": "2rem"
          }},
          "fontFamily": {{
            "body-sm": ["Inter"],
            "label-md": ["Inter"],
            "label-sm": ["Inter"],
            "mono-data": ["JetBrains Mono"],
            "display-lg": ["Inter"],
            "headline-sm": ["Inter"],
            "headline-md": ["Inter"],
            "headline-lg": ["Inter"],
            "body-md": ["Inter"],
            "body-lg": ["Inter"]
          }},
          "fontSize": {{
            "body-sm": ["13px", {{ "lineHeight": "18px", "letterSpacing": "0em", "fontWeight": "400" }}],
            "label-md": ["12px", {{ "lineHeight": "16px", "letterSpacing": "0.02em", "fontWeight": "600" }}],
            "label-sm": ["11px", {{ "lineHeight": "14px", "letterSpacing": "0.03em", "fontWeight": "500" }}],
            "mono-data": ["12px", {{ "lineHeight": "16px", "letterSpacing": "0em", "fontWeight": "500" }}],
            "display-lg": ["32px", {{ "lineHeight": "40px", "letterSpacing": "-0.025em", "fontWeight": "700" }}],
            "headline-sm": ["16px", {{ "lineHeight": "24px", "letterSpacing": "-0.01em", "fontWeight": "600" }}],
            "headline-md": ["20px", {{ "lineHeight": "28px", "letterSpacing": "-0.015em", "fontWeight": "600" }}],
            "headline-lg": ["24px", {{ "lineHeight": "32px", "letterSpacing": "-0.02em", "fontWeight": "600" }}],
            "body-md": ["14px", {{ "lineHeight": "20px", "letterSpacing": "0em", "fontWeight": "400" }}],
            "body-lg": ["16px", {{ "lineHeight": "24px", "letterSpacing": "-0.005em", "fontWeight": "400" }}]
          }}
        }}
      }}
    }}
  </script>"""

EARLY_THEME_SCRIPT = """<script>
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
</script>"""

THEME_TOGGLE_BTN = """<!-- Theme Toggle Button -->
<button id="theme-toggle-btn" onclick="toggleTheme()" aria-label="Toggle Light/Dark Theme" title="Toggle Light/Dark Theme" class="p-1.5 text-secondary hover:text-on-surface rounded hover:bg-surface-container-low transition-colors duration-150 flex items-center justify-center">
  <span id="theme-toggle-icon" class="material-symbols-outlined text-[20px]">dark_mode</span>
</button>"""

COMMON_THEME_JS = """<script>
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
</script>"""


def build_academy():
    src_path = os.path.join(BRAIN_DIR, "media_1788544550985.html")
    with open(src_path, "r", encoding="utf-8") as f:
        html = f.read()

    # 1. Replace tailwind config with CSS variables version
    html = re.sub(r'<script id="tailwind-config">[\s\S]*?</script>', generate_tailwind_config(), html)

    # 2. Insert early theme script & CSS variables into <head>
    head_inject = f"{EARLY_THEME_SCRIPT}\n{generate_css_vars()}\n</head>"
    html = html.replace("</head>", head_inject)

    # 3. Add transition classes to body
    html = re.sub(r'<body class="([^"]*)"', r'<body class="\1 transition-colors duration-200"', html)

    # 4. Brand link
    html = html.replace(
        '<span class="text-headline-md font-headline-md font-bold tracking-tight text-on-surface uppercase">JOBLEX</span>',
        '<a href="index.html" class="text-headline-md font-headline-md font-bold tracking-tight text-on-surface uppercase">JOBLEX</a>'
    )

    # 5. Segment Switcher navigation links
    html = re.sub(
        r'<a class="text-secondary hover:text-on-surface font-label-md text-label-md py-4 transition-colors duration-150" href="#">\s*Student Portal\s*</a>',
        '<a class="text-secondary hover:text-on-surface font-label-md text-label-md py-4 transition-colors duration-150" href="student-roadmap.html">Student Portal</a>',
        html
    )
    html = re.sub(
        r'<a class="border-b-2 border-primary text-primary font-label-md text-label-md py-4 transition-colors duration-150" href="#">\s*Academic Dean &amp; TPO\s*</a>',
        '<a class="border-b-2 border-primary text-primary font-label-md text-label-md py-4 transition-colors duration-150" href="academy.html">Academic Dean &amp; TPO</a>',
        html
    )
    html = re.sub(
        r'<a class="text-secondary hover:text-on-surface font-label-md text-label-md py-4 transition-colors duration-150" href="#">\s*Industry &amp; Pharma R&amp;D\s*</a>',
        '<a class="text-secondary hover:text-on-surface font-label-md text-label-md py-4 transition-colors duration-150" href="industry.html">Industry &amp; Pharma R&amp;D</a>',
        html
    )

    # 6. Insert Theme Toggle button before System Icons
    html = html.replace(
        '<!-- System Icons -->',
        f'{THEME_TOGGLE_BTN}\n<!-- System Icons -->'
    )

    # 7. Strip reference image and replace with clean typographic avatar
    html = re.sub(
        r'<img alt="Institutional Dean and Scholar Profile Avatar"[^>]*>',
        '<div class="w-9 h-9 rounded bg-surface-container-high border border-outline-variant flex items-center justify-center font-bold text-primary font-label-md">AT</div>',
        html
    )

    # 8. Interactive Governance Action Buttons
    html = re.sub(
        r'<button class="px-3 py-1\.5 border border-outline-variant bg-surface-container-lowest hover:bg-surface-container-low text-on-surface rounded font-label-md text-label-md transition-colors duration-150 flex items-center gap-1\.5">\s*<span class="material-symbols-outlined text-\[16px\]">file_download</span>\s*NAAC AQAR Export\s*</button>',
        '<button onclick="handleExportAQAR()" class="px-3 py-1.5 border border-outline-variant bg-surface-container-lowest hover:bg-surface-container-low text-on-surface rounded font-label-md text-label-md transition-colors duration-150 flex items-center gap-1.5"><span class="material-symbols-outlined text-[16px]">file_download</span>NAAC AQAR Export</button>',
        html
    )
    html = re.sub(
        r'<button class="px-3 py-1\.5 bg-primary text-on-primary rounded font-label-md text-label-md hover:bg-primary-container transition-colors duration-150 flex items-center gap-1\.5">\s*<span class="material-symbols-outlined text-\[16px\]">verified</span>\s*Syndicate Curriculum Changes\s*</button>',
        '<button onclick="handleSyndicateChanges()" class="px-3 py-1.5 bg-primary text-on-primary rounded font-label-md text-label-md hover:bg-primary-container transition-colors duration-150 flex items-center gap-1.5"><span class="material-symbols-outlined text-[16px]">verified</span>Syndicate Curriculum Changes</button>',
        html
    )

    # 9. Syllabus Adopt Buttons
    html = re.sub(
        r'<button class="w-full sm:w-auto px-3\.5 py-1\.5 bg-primary text-on-primary rounded font-label-md text-label-md hover:bg-primary-container transition-colors duration-150 flex items-center justify-center gap-1\.5">\s*<span class="material-symbols-outlined text-\[16px\]">add_circle</span>\s*Adopt Syllabus Add-on for Academic Council\s*</button>',
        '<button onclick="handleAdoptSyllabus(\'HPTLC Fingerprinting\')" class="w-full sm:w-auto px-3.5 py-1.5 bg-primary text-on-primary rounded font-label-md text-label-md hover:bg-primary-container transition-colors duration-150 flex items-center justify-center gap-1.5"><span class="material-symbols-outlined text-[16px]">add_circle</span>Adopt Syllabus Add-on for Academic Council</button>',
        html
    )
    html = re.sub(
        r'<button class="w-full sm:w-auto px-3\.5 py-1\.5 border border-outline-variant bg-surface-container-lowest hover:bg-surface-container-low text-on-surface rounded font-label-md text-label-md transition-colors duration-150 flex items-center justify-center gap-1\.5">\s*<span class="material-symbols-outlined text-\[16px\]">visibility</span>\s*Review Unit Module\s*</button>',
        '<button onclick="handleAdoptSyllabus(\'AutoDock Vina Computational Chemistry\')" class="w-full sm:w-auto px-3.5 py-1.5 border border-outline-variant bg-surface-container-lowest hover:bg-surface-container-low text-on-surface rounded font-label-md text-label-md transition-colors duration-150 flex items-center justify-center gap-1.5"><span class="material-symbols-outlined text-[16px]">visibility</span>Review Unit Module</button>',
        html
    )

    # 10. Audit Log & Peer Matrix actions
    html = re.sub(
        r'<button class="w-full sm:w-auto px-3\.5 py-1\.5 border border-outline-variant bg-surface-container-lowest hover:bg-surface-container text-on-surface rounded font-label-md text-label-md transition-colors duration-150">\s*View Audit Log\s*</button>',
        '<button onclick="viewAuditLog()" class="w-full sm:w-auto px-3.5 py-1.5 border border-outline-variant bg-surface-container-lowest hover:bg-surface-container text-on-surface rounded font-label-md text-label-md transition-colors duration-150">View Audit Log</button>',
        html
    )
    html = re.sub(
        r'<a class="font-label-sm text-label-sm text-primary underline font-medium" href="#">\s*Download Peer Matrix\s*</a>',
        '<a class="font-label-sm text-label-sm text-primary underline font-medium" href="javascript:void(0)" onclick="downloadPeerMatrix()">Download Peer Matrix</a>',
        html
    )

    # 11. Interactive scripts before </body>
    interactive_js = f"""{COMMON_THEME_JS}
<script>
  function handleExportAQAR() {{
    alert("Generating Statutory NAAC AQAR Criterion 3.4 & OBE Data Dossier (PDF/CSV)...\\nRegistry Reference: AIIA-AC-2025/Q1\\nNAAC Cycle: Statutory Cycle IV");
  }}

  function handleSyndicateChanges() {{
    alert("Curriculum Modernization Proposal successfully submitted to the Academic Council Syndicate.\\nRatification queued for upcoming BoS review session.");
  }}

  function handleAdoptSyllabus(name) {{
    alert(`Success: "${{name}}" curriculum add-on adopted for Academic Council BoS ratification.`);
  }}

  function viewAuditLog() {{
    alert("Statutory Audit Log:\\nNode: AIIA Central Verification Hub\\nCryptographic Ledger Hash: SHA-256 (0x7F2A...B94C)\\nVerified Status: Compliant under Ministry of Ayush Standards");
  }}

  function downloadPeerMatrix() {{
    alert("Downloading Cross-College Institutional Outcome Benchmark Matrix (CSV)...\\nPercentile: Top 1.2% Nationally");
  }}

  document.addEventListener('DOMContentLoaded', () => {{
    if (window.JoblexApiClient && typeof JoblexApiClient.requireAuth === 'function') {{
      JoblexApiClient.requireAuth('academy');
    }}
  }});
</script>
"""
    html = html.replace("</body>", f"{interactive_js}\n</body>")

    # Write output
    for out_path in [os.path.join(BASE_DIR, "academy.html"), os.path.join(BASE_DIR, "public", "academy.html")]:
        os.makedirs(os.path.dirname(out_path), exist_ok=True)
        with open(out_path, "w", encoding="utf-8") as out_f:
            out_f.write(html)
        print(f"Written: {out_path} ({len(html)} bytes)")


def build_industry():
    src_path = os.path.join(BRAIN_DIR, "media_1788544550986.html")
    with open(src_path, "r", encoding="utf-8") as f:
        html = f.read()

    # 1. Replace tailwind config
    html = re.sub(r'<script id="tailwind-config">[\s\S]*?</script>', generate_tailwind_config(), html)

    # 2. Insert early theme script & CSS variables into <head>
    head_inject = f"{EARLY_THEME_SCRIPT}\n{generate_css_vars()}\n</head>"
    html = html.replace("</head>", head_inject)

    # 3. Add transition classes to body
    html = re.sub(r'<body class="([^"]*)"', r'<body class="\1 transition-colors duration-200"', html)

    # 4. Brand link
    html = html.replace(
        '<span class="text-headline-md font-headline-md font-bold tracking-tight text-on-surface dark:text-inverse-on-surface uppercase">JOBLEX</span>',
        '<a href="index.html" class="text-headline-md font-headline-md font-bold tracking-tight text-on-surface dark:text-inverse-on-surface uppercase">JOBLEX</a>'
    )

    # 5. Segment Switcher navigation links
    html = re.sub(
        r'<a class="text-secondary dark:text-secondary-fixed-dim hover:text-on-surface dark:hover:text-inverse-on-surface font-label-md text-label-md py-4" href="#">\s*Student Portal\s*</a>',
        '<a class="text-secondary dark:text-secondary-fixed-dim hover:text-on-surface dark:hover:text-inverse-on-surface font-label-md text-label-md py-4" href="student-roadmap.html">Student Portal</a>',
        html
    )
    html = re.sub(
        r'<a class="text-secondary dark:text-secondary-fixed-dim hover:text-on-surface dark:hover:text-inverse-on-surface font-label-md text-label-md py-4" href="#">\s*Academic Dean &amp; TPO\s*</a>',
        '<a class="text-secondary dark:text-secondary-fixed-dim hover:text-on-surface dark:hover:text-inverse-on-surface font-label-md text-label-md py-4" href="academy.html">Academic Dean &amp; TPO</a>',
        html
    )
    html = re.sub(
        r'<a class="border-b-2 border-primary dark:border-inverse-primary text-primary dark:text-inverse-primary font-label-md text-label-md py-4" href="#">\s*Industry &amp; Pharma R&amp;D\s*</a>',
        '<a class="border-b-2 border-primary dark:border-inverse-primary text-primary dark:text-inverse-primary font-label-md text-label-md py-4" href="industry.html">Industry &amp; Pharma R&amp;D</a>',
        html
    )

    # 6. Insert Theme Toggle button
    html = html.replace(
        '<!-- Trailing Icon Actions -->',
        f'<!-- Trailing Icon Actions -->\n{THEME_TOGGLE_BTN}'
    )

    # 7. Strip all 4 reference images and replace with clean initial chips
    # 7a. Recruiter avatar
    html = re.sub(
        r'<img class="w-8 h-8 rounded-full border border-outline-variant object-cover"[^>]*>',
        '<div class="w-8 h-8 rounded-full bg-surface-container-high border border-outline-variant flex items-center justify-center font-bold text-primary text-label-sm">AS</div>',
        html
    )
    # 7b. Ashay Verma avatar
    html = re.sub(
        r'<img class="w-12 h-12 rounded border border-outline-variant object-cover"[^>]*data-alt="[^"]*Ashay Verma[^"]*"[^>]*>',
        '<div class="w-12 h-12 rounded border border-outline-variant bg-surface-container-high flex items-center justify-center font-bold text-primary font-headline-sm">AV</div>',
        html
    )
    # 7c. Priya Nair avatar
    html = re.sub(
        r'<img class="w-12 h-12 rounded border border-outline-variant object-cover"[^>]*data-alt="[^"]*Priya Nair[^"]*"[^>]*>',
        '<div class="w-12 h-12 rounded border border-outline-variant bg-surface-container-high flex items-center justify-center font-bold text-secondary font-headline-sm">PN</div>',
        html
    )
    # 7d. Kavya Singh avatar
    html = re.sub(
        r'<img class="w-12 h-12 rounded border border-outline-variant object-cover"[^>]*data-alt="[^"]*Kavya Singh[^"]*"[^>]*>',
        '<div class="w-12 h-12 rounded border border-outline-variant bg-surface-container-high flex items-center justify-center font-bold text-tertiary font-headline-sm">KS</div>',
        html
    )
    # Safety: replace any lingering <img>
    html = re.sub(
        r'<img[^>]*>',
        '<div class="w-10 h-10 rounded bg-surface-container border border-outline-variant flex items-center justify-center text-xs font-bold text-primary">AY</div>',
        html
    )

    # 8. Interactive Action Buttons
    html = re.sub(
        r'<button class="border border-outline-variant px-unit-sm py-1 rounded text-label-sm font-label-sm text-on-surface hover:bg-surface-container-low transition-colors duration-150 flex items-center space-x-1">',
        '<button onclick="handleAuditExport()" class="border border-outline-variant px-unit-sm py-1 rounded text-label-sm font-label-sm text-on-surface hover:bg-surface-container-low transition-colors duration-150 flex items-center space-x-1">',
        html
    )
    html = re.sub(
        r'<button class="px-unit-base py-2 rounded-lg bg-primary text-on-primary font-label-md text-label-md flex items-center space-x-unit-xs hover:bg-primary-container transition-colors shadow-none">',
        '<button onclick="handleNewRequisition()" class="px-unit-base py-2 rounded-lg bg-primary text-on-primary font-label-md text-label-md flex items-center space-x-unit-xs hover:bg-primary-container transition-colors shadow-none">',
        html
    )

    # 9. Search Input
    html = re.sub(
        r'<input class="w-64 h-\[34px\] pl-8 pr-3 text-body-sm font-body-sm border border-outline-variant rounded bg-surface-container-lowest focus:outline-none focus:border-primary" placeholder="Filter by scholar or verified skill\.\.\." type="text"/>',
        '<input id="dossier-search-input" oninput="filterCandidateDossiers(this.value)" class="w-64 h-[34px] pl-8 pr-3 text-body-sm font-body-sm border border-outline-variant rounded bg-surface-container-lowest focus:outline-none focus:border-primary" placeholder="Filter by scholar or verified skill..." type="text"/>',
        html
    )

    # 10. Dossier Card Actions
    html = html.replace(
        '>Schedule Technical Interview<',
        ' onclick="handleScheduleInterview(\'Ashay Verma\')">Schedule Technical Interview<'
    )
    html = html.replace(
        '>Confirm Interview Slot<',
        ' onclick="handleConfirmSlot(\'Priya Nair\')">Confirm Interview Slot<'
    )
    html = html.replace(
        '>Request Assessment<',
        ' onclick="handleRequestAssessment(\'Kavya Singh\')">Request Assessment<'
    )
    html = html.replace(
        '>View Verified AIIA Ledger<',
        ' onclick="handleViewLedger(\'Candidate Record\')">View Verified AIIA Ledger<'
    )
    html = html.replace(
        '>Examine Full Dossier<',
        ' onclick="handleExamineDossier(\'Priya Nair\')">Examine Full Dossier<'
    )

    # 11. Reverse Headhunting & Calibrator actions
    html = html.replace(
        '>Dispatch Direct Corporate Inquiry<',
        ' onclick="handleDispatchInquiry()">Dispatch Direct Corporate Inquiry<'
    )
    html = html.replace(
        '>Submit Weight Calibration to AYUSH Model<',
        ' onclick="handleSubmitCalibration()">Submit Weight Calibration to AYUSH Model<'
    )

    # 12. Interactive scripts before </body>
    interactive_js = f"""{COMMON_THEME_JS}
<script>
  function handleAuditExport() {{
    alert("Exporting Corporate Recruitment Audit Ledger (CSV)...\\nLedger Node: AIIA-NCR-04\\nProtocol: ISO-27001 Certified");
  }}

  function handleNewRequisition() {{
    const title = prompt("Enter Corporate Requisition Title (e.g. Lead Ayush Clinical Pharmacologist):");
    if (title) {{
      alert(`Requisition "${{title}}" drafted.\\nDispatched to AIIA & Ministry of Ayush Dean Syndicate.`);
    }}
  }}

  function handleViewLedger(candidate) {{
    alert(`AIIA Cryptographic Ledger Validated:\\nCandidate: ${{candidate}}\\nStatus: Block-Validated on National Ayush Academic Registry (NAAR)\\nSignatures: Dean Academic Affairs & Central Testing Lab`);
  }}

  function handleScheduleInterview(candidate) {{
    alert(`Technical Interview request sent for ${{candidate}}.\\nInterview notification dispatched to candidate dashboard and AIIA Placement Cell.`);
  }}

  function handleConfirmSlot(candidate) {{
    alert(`Interview slot confirmed for ${{candidate}}.\\nSession details: Virtual Ayush R&D Panel • Calendar invite dispatched.`);
  }}

  function handleExamineDossier(candidate) {{
    alert(`Opening Full Validated Dossier for ${{candidate}}...\\nIncluded: HPTLC Spectral Plates, AutoDock Binding Logs, and NABL Lab Hours.`);
  }}

  function handleRequestAssessment(candidate) {{
    alert(`Custom technical assessment request issued to ${{candidate}} through AIIA Health Informatics portal.`);
  }}

  function handleDispatchInquiry() {{
    alert("Direct Corporate Inbound Inquiry dispatched to 14 unreleased scholars at AIIA New Delhi, GAU Jamnagar, and NIA Jaipur.");
  }}

  function handleSubmitCalibration() {{
    alert("Updated AI Scoring Weights successfully submitted to AYUSH-ML Talent Recommendation Model.");
  }}

  function filterCandidateDossiers(query) {{
    const q = (query || '').toLowerCase();
    const articles = document.querySelectorAll('.xl\\:col-span-8 > div.bg-surface-container-lowest');
    articles.forEach(card => {{
      const text = card.textContent.toLowerCase();
      if (!q || text.includes(q)) {{
        card.style.display = '';
      }} else {{
        card.style.display = 'none';
      }}
    }});
  }}

  document.addEventListener('DOMContentLoaded', () => {{
    if (window.JoblexApiClient && typeof JoblexApiClient.requireAuth === 'function') {{
      JoblexApiClient.requireAuth('industry');
    }}
  }});
</script>
"""
    html = html.replace("</body>", f"{interactive_js}\n</body>")

    # Write output
    for out_path in [os.path.join(BASE_DIR, "industry.html"), os.path.join(BASE_DIR, "public", "industry.html")]:
        os.makedirs(os.path.dirname(out_path), exist_ok=True)
        with open(out_path, "w", encoding="utf-8") as out_f:
            out_f.write(html)
        print(f"Written: {out_path} ({len(html)} bytes)")


def build_student():
    src_path = os.path.join(BRAIN_DIR, "media_1788544550988.html")
    with open(src_path, "r", encoding="utf-8") as f:
        html = f.read()

    # 1. Replace tailwind config
    html = re.sub(r'<script id="tailwind-config">[\s\S]*?</script>', generate_tailwind_config(), html)

    # 2. Insert early theme script & CSS variables into <head>
    head_inject = f"{EARLY_THEME_SCRIPT}\n{generate_css_vars()}\n</head>"
    html = html.replace("</head>", head_inject)

    # 3. Add transition classes to body
    html = re.sub(r'<body class="([^"]*)"', r'<body class="\1 transition-colors duration-200"', html)

    # 4. Brand link
    html = re.sub(
        r'<a class="text-headline-md font-headline-md font-bold tracking-tight text-on-surface uppercase flex items-center gap-2" href="#">',
        r'<a class="text-headline-md font-headline-md font-bold tracking-tight text-on-surface uppercase flex items-center gap-2" href="index.html">',
        html
    )

    # 5. Segment Switcher navigation links
    html = re.sub(
        r'<a class="border-b-2 border-primary text-primary font-label-md text-label-md py-4 flex items-center gap-1\.5" href="#">',
        r'<a class="border-b-2 border-primary text-primary font-label-md text-label-md py-4 flex items-center gap-1.5" href="student-roadmap.html">',
        html
    )
    html = re.sub(
        r'<a class="text-secondary hover:text-on-surface font-label-md text-label-md py-4 transition-colors duration-150" href="#">\s*Academic Dean &amp; TPO\s*</a>',
        '<a class="text-secondary hover:text-on-surface font-label-md text-label-md py-4 transition-colors duration-150" href="academy.html">Academic Dean &amp; TPO</a>',
        html
    )
    html = re.sub(
        r'<a class="text-secondary hover:text-on-surface font-label-md text-label-md py-4 transition-colors duration-150" href="#">\s*Industry &amp; Pharma R&amp;D\s*</a>',
        '<a class="text-secondary hover:text-on-surface font-label-md text-label-md py-4 transition-colors duration-150" href="industry.html">Industry &amp; Pharma R&amp;D</a>',
        html
    )

    # 6. Insert Theme Toggle button before Utility Icons
    html = html.replace(
        '<!-- Utility Icons -->',
        f'{THEME_TOGGLE_BTN}\n<!-- Utility Icons -->'
    )

    # 7. Sub-Navigation / Portal Tabs
    subnav_old = '''<a class="py-3 text-[#64748b] hover:text-[#0f172a] whitespace-nowrap border-b-2 border-transparent transition-colors" href="#">Overview</a>
<a class="py-3 text-[#0f172a] font-semibold whitespace-nowrap border-b-2 border-[#0f172a] flex items-center gap-1.5" href="#">
<span>Career Roadmap</span>
<span class="bg-[#e2e8f0] text-[#0f172a] text-[10px] font-mono-data px-1.5 py-0.5 rounded">Active</span>
</a>
<a class="py-3 text-[#64748b] hover:text-[#0f172a] whitespace-nowrap border-b-2 border-transparent transition-colors" href="#">AI Resume Analyzer</a>
<a class="py-3 text-[#64748b] hover:text-[#0f172a] whitespace-nowrap border-b-2 border-transparent transition-colors" href="#">Skill Constellation</a>
<a class="py-3 text-[#64748b] hover:text-[#0f172a] whitespace-nowrap border-b-2 border-transparent transition-colors" href="#">Quiz Arena</a>
<a class="py-3 text-[#64748b] hover:text-[#0f172a] whitespace-nowrap border-b-2 border-transparent transition-colors" href="#">Verified Portfolio</a>'''

    subnav_new = '''<a class="py-3 text-[#64748b] hover:text-[#0f172a] whitespace-nowrap border-b-2 border-transparent transition-colors" href="student.html">Overview</a>
<a class="py-3 text-[#0f172a] font-semibold whitespace-nowrap border-b-2 border-[#0f172a] flex items-center gap-1.5" href="student-roadmap.html">
<span>Career Roadmap</span>
<span class="bg-[#e2e8f0] text-[#0f172a] text-[10px] font-mono-data px-1.5 py-0.5 rounded">Active</span>
</a>
<a class="py-3 text-[#64748b] hover:text-[#0f172a] whitespace-nowrap border-b-2 border-transparent transition-colors" href="student-resume.html">AI Resume Analyzer</a>
<a class="py-3 text-[#64748b] hover:text-[#0f172a] whitespace-nowrap border-b-2 border-transparent transition-colors" href="student-skilltree.html">Skill Constellation</a>
<a class="py-3 text-[#64748b] hover:text-[#0f172a] whitespace-nowrap border-b-2 border-transparent transition-colors" href="student-quiz.html">Quiz Arena</a>
<a class="py-3 text-[#64748b] hover:text-[#0f172a] whitespace-nowrap border-b-2 border-transparent transition-colors" href="student-portfolio.html">Verified Portfolio</a>'''
    html = html.replace(subnav_old, subnav_new)

    # 8. Interactive Actions
    html = re.sub(
        r'<button class="px-4 py-2\.5 bg-\[#0f172a\] hover:bg-\[#1e293b\] text-white text-label-md font-label-md rounded flex items-center gap-2 shadow-none transition-colors duration-150">',
        '<button onclick="handleCheckInToday()" class="px-4 py-2.5 bg-[#0f172a] hover:bg-[#1e293b] text-white text-label-md font-label-md rounded flex items-center gap-2 shadow-none transition-colors duration-150">',
        html
    )
    html = re.sub(
        r'<button class="px-3 py-1\.5 bg-\[#0f172a\] text-white text-label-sm font-label-sm rounded hover:bg-\[#1e293b\] transition-colors">',
        '<button onclick="handleResumeLabRun()" class="px-3 py-1.5 bg-[#0f172a] text-white text-label-sm font-label-sm rounded hover:bg-[#1e293b] transition-colors">',
        html
    )
    html = re.sub(
        r'<input checked="" class="sr-only peer" type="checkbox"/>',
        '<input id="reverse-recruitment-toggle" checked="" onchange="handleToggleReverseRecruitment(this)" class="sr-only peer" type="checkbox"/>',
        html
    )

    # 9. Interactive scripts before </body>
    interactive_js = f"""{COMMON_THEME_JS}
<script>
  function handleCheckInToday() {{
    alert("Daily Competency Check-In Recorded!\\n+50 XP credited to Ashay Verma.\\nAnti-Decay preservation cycle renewed for 72 hours.");
  }}

  function handleResumeLabRun() {{
    alert("Resuming Lab Bench Protocol:\\nDabur MoU Standard HPTLC Fingerprint Marker Analysis\\nStation: AIIA Central Phytochemical Laboratory #3.");
  }}

  function handleToggleReverseRecruitment(el) {{
    const active = el.checked;
    alert(`Reverse Recruitment Gate is now ${{active ? 'ACTIVE' : 'PAUSED'}}.\\n${{active ? 'Partner corporate recruiters from CCRAS, Dabur, and Hamdard can query your verified competencies.' : 'Profile hidden from corporate inbound recruitment queries.'}}`);
  }}

  document.addEventListener('DOMContentLoaded', () => {{
    if (window.JoblexApiClient && typeof JoblexApiClient.requireAuth === 'function') {{
      JoblexApiClient.requireAuth('student');
    }}
  }});
</script>
"""
    html = html.replace("</body>", f"{interactive_js}\n</body>")

    # Write output to student-roadmap.html, public/student-roadmap.html, student.html, and public/student.html
    for out_path in [
        os.path.join(BASE_DIR, "student-roadmap.html"),
        os.path.join(BASE_DIR, "public", "student-roadmap.html"),
        os.path.join(BASE_DIR, "student.html"),
        os.path.join(BASE_DIR, "public", "student.html")
    ]:
        os.makedirs(os.path.dirname(out_path), exist_ok=True)
        with open(out_path, "w", encoding="utf-8") as out_f:
            out_f.write(html)
        print(f"Written: {out_path} ({len(html)} bytes)")


if __name__ == "__main__":
    print("Building Academy Portal...")
    build_academy()
    print("Building Industry Portal...")
    build_industry()
    print("Building Student Roadmap Portal...")
    build_student()
    print("All Portals Built Successfully!")
