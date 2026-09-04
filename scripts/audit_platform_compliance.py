import os
import re
import urllib.request

HTML_FILES = [
    'index.html',
    'auth.html',
    'student.html',
    'student-roadmap.html',
    'student-jobs.html',
    'student-internships.html',
    'student-quiz.html',
    'student-resume.html',
    'student-zulu.html',
    'student-skilltree.html',
    'student-portfolio.html',
    'academy.html',
    'industry.html'
]

print("=" * 70)
print("JOBLEX PLATFORM UI STANDARDIZATION AUDIT REPORT")
print("=" * 70)

all_passed = True

print("\n1. CHECKING MATERIAL DESIGN CSS VARIABLES (var(--...)):")
for f in HTML_FILES:
    with open(f, 'r', encoding='utf-8') as fl:
        c = fl.read()
    vars_found = re.findall(r'var\(--[a-zA-Z0-9_-]+\)', c)
    if vars_found:
        print(f"  [FAIL] {f:25} has {len(vars_found)} CSS variables! {vars_found[:3]}")
        all_passed = False
    else:
        print(f"  [PASS] {f:25} ZERO custom CSS variables")

print("\n2. CHECKING ROOT <-> PUBLIC SYNCHRONIZATION:")
for f in HTML_FILES:
    root_path = f
    pub_path = os.path.join('public', f)
    if not os.path.exists(pub_path):
        print(f"  [FAIL] Missing public copy: {pub_path}")
        all_passed = False
        continue
    with open(root_path, 'r', encoding='utf-8') as rf, open(pub_path, 'r', encoding='utf-8') as pf:
        rc = rf.read()
        pc = pf.read()
    if rc != pc:
        print(f"  [FAIL] Mismatch between root and public for: {f}")
        all_passed = False
    else:
        print(f"  [PASS] {f:25} 100% In-Sync (Size: {len(rc)} bytes)")

print("\n3. CHECKING INDUSTRY HTML FOR 'class=\"light\"':")
with open('industry.html', 'r', encoding='utf-8') as f:
    c = f.read()
if 'class="light"' in c[:200]:
    print("  [FAIL] industry.html has class='light' on html tag")
    all_passed = False
else:
    print("  [PASS] industry.html: class='light' cleanly removed")

print("\n4. CHECKING STUDENT PORTAL TOP NAVBAR REMOVAL:")
for f in HTML_FILES:
    if f.startswith('student'):
        with open(f, 'r', encoding='utf-8') as fl:
            c = fl.read()
        has_nav_switcher = ('Academic Dean & TPO' in c and 'nav-switcher' in c) or ('Dean & TPO' in c and 'portal-switcher' in c)
        header_m = re.search(r'<header.*?</header>', c, re.DOTALL)
        header_text = header_m.group(0) if header_m else ''
        has_switcher = 'navigateToPortal' in header_text
        if has_switcher:
            print(f"  [FAIL] {f:25} contains cross-portal switcher in header!")
            all_passed = False
        else:
            print(f"  [PASS] {f:25} Top cross-portal switcher REMOVED")

print("\n5. CHECKING NOTIFICATION BELL & NOTIFICATIONS ENGINE:")
for f in HTML_FILES:
    if f not in ['index.html', 'auth.html']:
        with open(f, 'r', encoding='utf-8') as fl:
            c = fl.read()
        has_bell = 'id="notification-bell-btn"' in c
        has_script = 'notifications.js' in c
        if has_bell and has_script:
            print(f"  [PASS] {f:25} Working notification bell + notifications.js")
        else:
            print(f"  [FAIL] {f:25} Missing bell: {has_bell}, Missing script: {has_script}")
            all_passed = False

print("\n6. CHECKING LIVE SERVER ROUTES ON PORT 5000:")
routes = [
    '/', '/auth', '/student', '/student-roadmap', '/student-jobs',
    '/student-internships', '/student-quiz', '/student-resume',
    '/student-zulu', '/student-skilltree', '/student-portfolio',
    '/academy', '/industry'
]

for r in routes:
    try:
        url = f"http://localhost:5000{r}"
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=3) as resp:
            if resp.status == 200:
                print(f"  [PASS] Route {r:22} -> 200 OK")
            else:
                print(f"  [FAIL] Route {r:22} -> Status {resp.status}")
                all_passed = False
    except Exception as e:
        print(f"  [FAIL] Route {r:22} -> Connection Error: {e}")
        all_passed = False

print("\n" + "=" * 70)
if all_passed:
    print("ALL AUDIT CHECKS PASSED PERFECTLY! 100% STANDARDIZED.")
else:
    print("SOME AUDIT CHECKS FAILED! Please inspect errors above.")
print("=" * 70)
