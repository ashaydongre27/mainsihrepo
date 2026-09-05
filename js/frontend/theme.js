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

if (typeof window !== 'undefined') {
  window.toggleTheme = toggleTheme;
  window.updateThemeIcon = updateThemeIcon;
}
