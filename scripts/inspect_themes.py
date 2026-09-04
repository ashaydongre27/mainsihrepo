import os
import re

js_files = [
    'js/frontend/student-ui.js',
    'js/frontend/industry-ui.js',
    'js/frontend/academy-ui.js'
]

print("=== CHECK JS FILES FOR HARDCODED DARK BG IN LIGHT MODE ===")
for f in js_files:
    if not os.path.exists(f):
        continue
    with open(f, 'r', encoding='utf-8') as fp:
        lines = fp.readlines()
    for idx, line in enumerate(lines):
        # find bg-gray-900, bg-black without dark:
        matches = re.findall(r'(?<!dark:)(?:bg-gray-900|bg-black\b|bg-\[#0|bg-slate-900)', line)
        if matches:
            print(f"{f}:{idx+1} -> {line.strip()[:110]}")

print("\n=== CHECK JS FILES FOR text-white WITHOUT dark: ===")
for f in js_files:
    if not os.path.exists(f):
        continue
    with open(f, 'r', encoding='utf-8') as fp:
        lines = fp.readlines()
    for idx, line in enumerate(lines):
        # find text-white without dark:text-
        if 'text-white' in line:
            # check if it's on a button with colored bg like bg-blue-600 or bg-purple-600 or gradient
            # which is white text on colored button in both light and dark modes
            is_colored_btn = re.search(r'(?:bg-purple-600|bg-blue-600|bg-emerald-600|bg-indigo-600|bg-gradient|bg-slate-900|bg-gray-950)', line)
            if not is_colored_btn and 'dark:text-' not in line:
                print(f"{f}:{idx+1} -> {line.strip()[:110]}")
