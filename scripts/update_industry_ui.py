import re

with open('js/frontend/industry-ui.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Applications empty state
content = content.replace(
    '<div class="col-span-full p-8 rounded-3xl bg-gray-900/40 border border-gray-800 text-center space-y-3">',
    '<div class="col-span-full p-8 rounded-3xl bg-white dark:bg-gray-900/40 border border-slate-200 dark:border-gray-800 text-center space-y-3 shadow-sm">'
)
content = content.replace(
    '<h4 class="text-base font-bold text-white">No Applications in this category yet</h4>',
    '<h4 class="text-base font-bold text-slate-900 dark:text-white">No Applications in this category yet</h4>'
)

# 2. Application card
content = content.replace(
    '<div class="p-5 sm:p-6 rounded-3xl bg-gray-900/80 border border-gray-800 hover:border-blue-500/50 transition shadow-lg flex flex-col justify-between space-y-4">',
    '<div class="p-5 sm:p-6 rounded-3xl bg-white dark:bg-gray-900/80 border border-slate-200 dark:border-gray-800 hover:border-blue-400 dark:hover:border-blue-500/50 transition shadow-sm flex flex-col justify-between space-y-4">'
)
content = content.replace(
    '<h4 class="text-base font-extrabold text-white">${app.studentName}</h4>',
    '<h4 class="text-base font-extrabold text-slate-900 dark:text-white">${app.studentName}</h4>'
)
content = content.replace(
    '<p class="text-xs text-gray-400 mt-0.5">${app.college}</p>',
    '<p class="text-xs text-slate-500 dark:text-gray-400 mt-0.5">${app.college}</p>'
)
content = content.replace(
    '<div class="p-3 rounded-2xl bg-black/40 border border-gray-800 space-y-1.5">',
    '<div class="p-3 rounded-2xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-gray-800 space-y-1.5">'
)
content = content.replace(
    '<span class="text-gray-400">Position Applied:</span>',
    '<span class="text-slate-500 dark:text-gray-400">Position Applied:</span>'
)
content = content.replace(
    '<div class="font-bold text-white text-xs sm:text-sm">${app.opportunityTitle}</div>',
    '<div class="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">${app.opportunityTitle}</div>'
)
content = content.replace(
    '<p class="text-xs text-gray-300 italic border-l-2 border-purple-500/60 pl-2.5 py-0.5">',
    '<p class="text-xs text-slate-600 dark:text-gray-300 italic border-l-2 border-purple-500/60 pl-2.5 py-0.5">'
)
content = content.replace(
    '<span class="text-[10px] text-gray-400 font-semibold block mb-1.5">Verified Institutional Competencies:</span>',
    '<span class="text-[10px] text-slate-500 dark:text-gray-400 font-semibold block mb-1.5">Verified Institutional Competencies:</span>'
)
content = content.replace(
    '<span class="px-2 py-0.5 rounded-md bg-blue-950/40 border border-blue-500/30 text-[11px] text-blue-200">${s}</span>',
    '<span class="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-500/30 text-[11px] text-blue-700 dark:text-blue-200">${s}</span>'
)
content = content.replace(
    '<div class="pt-3 border-t border-gray-800 space-y-2.5">',
    '<div class="pt-3 border-t border-slate-200 dark:border-gray-800 space-y-2.5">'
)
content = content.replace(
    '<span class="text-xs text-gray-400">Current Status:</span>',
    '<span class="text-xs text-slate-500 dark:text-gray-400">Current Status:</span>'
)

# 3. Candidates
content = content.replace(
    '<div class="p-5 rounded-2xl bg-gray-900/60 border border-gray-800 hover:border-blue-500/40 transition shadow-md flex flex-col justify-between space-y-4">',
    '<div class="p-5 rounded-2xl bg-white dark:bg-gray-900/60 border border-slate-200 dark:border-gray-800 hover:border-blue-400 dark:hover:border-blue-500/40 transition shadow-sm flex flex-col justify-between space-y-4">'
)
content = content.replace(
    '<h4 class="font-bold text-sm text-white">${c.name}</h4>',
    '<h4 class="font-bold text-sm text-slate-900 dark:text-white">${c.name}</h4>'
)
content = content.replace(
    '<p class="text-xs text-gray-400">${c.college}</p>',
    '<p class="text-xs text-slate-500 dark:text-gray-400">${c.college}</p>'
)
content = content.replace(
    '<span class="px-2 py-0.5 rounded-md bg-blue-950/50 border border-blue-500/30 text-[11px] text-blue-200">${s}</span>',
    '<span class="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-500/30 text-[11px] text-blue-700 dark:text-blue-200">${s}</span>'
)
content = content.replace(
    '<div class="flex gap-2 pt-3 border-t border-gray-800">',
    '<div class="flex gap-2 pt-3 border-t border-slate-200 dark:border-gray-800">'
)
content = content.replace(
    'class="flex-1 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-semibold text-xs transition"',
    'class="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-slate-800 dark:text-white font-semibold text-xs transition border border-slate-200 dark:border-gray-700"'
)

# 4. Reverse candidates
content = content.replace(
    '<div class="p-5 rounded-2xl bg-gray-900/70 border border-purple-500/30 shadow-md flex flex-col justify-between space-y-3">',
    '<div class="p-5 rounded-2xl bg-white dark:bg-gray-900/70 border border-purple-200 dark:border-purple-500/30 shadow-sm flex flex-col justify-between space-y-3">'
)
content = content.replace(
    '<span class="px-2 py-0.5 rounded-md bg-gray-800 border border-gray-700 text-[11px] text-purple-200">${s}</span>',
    '<span class="px-2 py-0.5 rounded-md bg-purple-50 dark:bg-gray-800 border border-purple-200 dark:border-gray-700 text-[11px] text-purple-700 dark:text-purple-200">${s}</span>'
)
content = content.replace(
    '<div class="pt-3 border-t border-gray-800 flex justify-between items-center">',
    '<div class="pt-3 border-t border-slate-200 dark:border-gray-800 flex justify-between items-center">'
)
content = content.replace(
    '<span class="text-[11px] text-gray-400">Open to Inbound Recruitment</span>',
    '<span class="text-[11px] text-slate-500 dark:text-gray-400">Open to Inbound Recruitment</span>'
)

# 5. Requisitions
content = content.replace(
    """<div class="p-5 rounded-2xl bg-gray-900/60 border ${req.active ? 'border-gray-800' : 'border-gray-800/40 opacity-70'} backdrop-blur-md space-y-3 flex flex-col justify-between hover:border-blue-500/40 transition">""",
    """<div class="p-5 rounded-2xl bg-white dark:bg-gray-900/60 border ${req.active ? 'border-slate-200 dark:border-gray-800' : 'border-slate-200 dark:border-gray-800/40 opacity-70'} backdrop-blur-md space-y-3 flex flex-col justify-between hover:border-blue-400 dark:hover:border-blue-500/40 transition shadow-sm">"""
)
content = content.replace(
    '<h4 class="font-bold text-sm text-white mt-1.5">${req.title}</h4>',
    '<h4 class="font-bold text-sm text-slate-900 dark:text-white mt-1.5">${req.title}</h4>'
)
content = content.replace(
    '<p class="text-xs text-gray-400">${req.company} • <span class="text-gray-300">${req.location}</span></p>',
    '<p class="text-xs text-slate-500 dark:text-gray-400">${req.company} • <span class="text-slate-600 dark:text-gray-300">${req.location}</span></p>'
)
content = content.replace(
    '<p class="text-xs text-gray-300 mt-2 line-clamp-2">${req.description}</p>',
    '<p class="text-xs text-slate-600 dark:text-gray-300 mt-2 line-clamp-2">${req.description}</p>'
)
content = content.replace(
    '<span class="px-2 py-0.5 rounded-md bg-blue-950/40 border border-blue-500/20 text-[10px] text-blue-200">${s}</span>',
    '<span class="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-500/20 text-[10px] text-blue-700 dark:text-blue-200">${s}</span>'
)
content = content.replace(
    '<div class="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-gray-800 text-xs text-gray-300">',
    '<div class="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-200 dark:border-gray-800 text-xs text-slate-600 dark:text-gray-300">'
)
content = content.replace(
    '<div>Compensation: <strong class="text-white">${req.stipend}</strong></div>',
    '<div>Compensation: <strong class="text-slate-900 dark:text-white">${req.stipend}</strong></div>'
)
content = content.replace(
    '<div>Deadline: <strong class="text-gray-400 font-mono">${req.deadline}</strong></div>',
    '<div>Deadline: <strong class="text-slate-500 dark:text-gray-400 font-mono">${req.deadline}</strong></div>'
)
content = content.replace(
    '<div class="pt-3 border-t border-gray-800 flex items-center justify-between gap-2">',
    '<div class="pt-3 border-t border-slate-200 dark:border-gray-800 flex items-center justify-between gap-2">'
)
content = content.replace(
    """<button onclick="switchIndustryTab('Applications')" class="flex-1 py-1.5 rounded-xl bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/40 text-blue-200 font-bold text-xs transition flex items-center justify-center gap-1.5">""",
    """<button onclick="switchIndustryTab('Applications')" class="flex-1 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-600/30 dark:hover:bg-blue-600/50 border border-blue-200 dark:border-blue-500/40 text-blue-700 dark:text-blue-200 font-bold text-xs transition flex items-center justify-center gap-1.5">"""
)

# 6. Skill ROI & Talent Forecast
content = content.replace(
    '<div class="p-3.5 rounded-xl bg-black/40 border border-gray-800 space-y-1 text-xs">',
    '<div class="p-3.5 rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-gray-800 space-y-1 text-xs">'
)
content = content.replace(
    '<span class="font-bold text-white">${log.candidate} (Rated: ${log.actualLabRating} / 5.0)</span>',
    '<span class="font-bold text-slate-900 dark:text-white">${log.candidate} (Rated: ${log.actualLabRating} / 5.0)</span>'
)
content = content.replace(
    '<p class="text-gray-400">${log.note}</p>',
    '<p class="text-slate-500 dark:text-gray-400">${log.note}</p>'
)
content = content.replace(
    '<div class="p-4 rounded-2xl bg-black/40 border border-gray-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">',
    '<div class="p-4 rounded-2xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">'
)
content = content.replace(
    '<h4 class="font-bold text-xs sm:text-sm text-white">${inst.institution}</h4>',
    '<h4 class="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">${inst.institution}</h4>'
)
content = content.replace(
    '<span class="text-xs text-cyan-300 mt-0.5 block">Trending Competency: ${inst.trendingSkill}</span>',
    '<span class="text-xs text-blue-600 dark:text-cyan-300 mt-0.5 block">Trending Competency: ${inst.trendingSkill}</span>'
)
content = content.replace(
    '<span class="text-xs text-gray-400 font-mono">Available: <strong>${inst.readyScholars} Scholars</strong></span>',
    '<span class="text-xs text-slate-500 dark:text-gray-400 font-mono">Available: <strong class="text-slate-900 dark:text-white">${inst.readyScholars} Scholars</strong></span>'
)

with open('js/frontend/industry-ui.js', 'w', encoding='utf-8') as f:
    f.write(content)

with open('public/js/frontend/industry-ui.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("industry-ui.js updated and synced successfully.")
