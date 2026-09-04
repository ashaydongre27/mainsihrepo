import os
import urllib.request

files = [
    'student.html', 'student-roadmap.html', 'student-jobs.html', 'student-internships.html',
    'student-quiz.html', 'student-resume.html', 'student-zulu.html', 'student-skilltree.html',
    'student-portfolio.html', 'academy.html', 'industry.html', 'auth.html'
]

print("=== CHECKING FILES IN ROOT & PUBLIC ===")
all_pass = True
for f in files:
    root_path = f
    pub_path = os.path.join('public', f)
    
    if not os.path.exists(root_path):
        print(f"MISSING root: {root_path}")
        all_pass = False
        continue
    if not os.path.exists(pub_path):
        print(f"MISSING public: {pub_path}")
        all_pass = False
        continue
        
    with open(root_path, 'r', encoding='utf-8') as rf:
        rc = rf.read()
    with open(pub_path, 'r', encoding='utf-8') as pf:
        pc = pf.read()
        
    if rc != pc:
        print(f"MISMATCH between root and public for: {f}")
        all_pass = False
    else:
        if f.startswith('student'):
            has_nav_switcher = ('Academic Dean & TPO' in rc) or ('Industry & Pharma R&D' in rc)
            has_bell = 'id="notification-bell-btn"' in rc
            has_notif_js = 'notifications.js' in rc
            has_theme_toggle = 'toggleTheme' in rc
            print(f"[OK] {f:25} | nav_switcher_removed: {not has_nav_switcher} | bell: {has_bell} | notif_js: {has_notif_js} | theme: {has_theme_toggle}")
            if has_nav_switcher or not has_bell or not has_notif_js or not has_theme_toggle:
                all_pass = False
        else:
            has_bell = 'id="notification-bell-btn"' in rc
            has_notif_js = 'notifications.js' in rc
            print(f"[OK] {f:25} | bell: {has_bell} | notif_js: {has_notif_js}")
            if not has_bell or not has_notif_js:
                all_pass = False

print("\n=== VERIFYING SERVER ON PORT 5000 ===")
routes = [
    '/', '/student', '/student-roadmap', '/student-jobs', '/student-internships',
    '/student-quiz', '/student-resume', '/student-zulu', '/student-skilltree',
    '/student-portfolio', '/academy', '/industry', '/auth'
]

server_running = False
try:
    with urllib.request.urlopen('http://localhost:5000/', timeout=2) as res:
        if res.status == 200:
            server_running = True
            print("Server is RUNNING on http://localhost:5000")
except Exception as e:
    print(f"Server check failed: {e}")

if server_running:
    for r in routes:
        try:
            with urllib.request.urlopen(f'http://localhost:5000{r}', timeout=2) as res:
                print(f"Route {r:22} -> {res.status} OK")
        except Exception as e:
            print(f"Route {r:22} -> ERROR: {e}")
            all_pass = False

print(f"\nFinal Check Status: {'ALL PASSED' if all_pass else 'SOME CHECKS FAILED'}")
