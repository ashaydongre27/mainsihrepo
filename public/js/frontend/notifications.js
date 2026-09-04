/**
 * JOBLEX Institutional Real-Time Notification Engine
 * Provides live contextual alerts, unread counts, interactive dropdown,
 * and state persistence across page navigations.
 */

(function () {
  const STORAGE_KEY = 'joblex_notifications_v1';

  const DEFAULT_NOTIFICATIONS = [
    {
      id: 'notif-1',
      title: 'Corporate Dossier View',
      message: 'Dabur India Ltd. (R&D Division) reviewed your verified botanical dossier for the Phytochemical Research Intern role.',
      type: 'corporate',
      time: '12m ago',
      unread: true,
      link: 'student-internships.html',
      icon: 'business_center',
      iconBg: 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
    },
    {
      id: 'notif-2',
      title: 'Anti-Decay Cycle Alert',
      message: '72-hour competency freeze expires in 48 hours. Check in or complete a Quiz Arena module to protect your 7-Day XP streak (+50 XP).',
      type: 'decay',
      time: '1h ago',
      unread: true,
      link: 'student-roadmap.html',
      icon: 'verified_user',
      iconBg: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
    },
    {
      id: 'notif-3',
      title: 'New Full-Time Placement',
      message: 'Patanjali Research Foundation published a new corporate opening: Formulation Development Scientist (₹8.5 - 12.0 LPA).',
      type: 'job',
      time: '3h ago',
      unread: true,
      link: 'student-jobs.html',
      icon: 'work',
      iconBg: 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300'
    },
    {
      id: 'notif-4',
      title: 'Micro-Gig Task Bounty Open',
      message: 'Dabur Research Labs posted sprint: "Clean & Standardize 50 Ashwagandha Trial Records" (₹6,000 Bounty, 94% Match).',
      type: 'gig',
      time: '5h ago',
      unread: false,
      link: 'student-internships.html',
      icon: 'bolt',
      iconBg: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
    },
    {
      id: 'notif-5',
      title: 'Institutional Credential Stamped',
      message: 'AIIA Dean of Academic Affairs validated digital cryptographic hash for AIIA-CERT-2026-9842 on National Ayush Registry.',
      type: 'academic',
      time: '1d ago',
      unread: false,
      link: 'student-portfolio.html',
      icon: 'shield',
      iconBg: 'bg-teal-100 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300'
    }
  ];

  let notifications = [];
  let currentFilter = 'all';

  function loadNotifications() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        notifications = JSON.parse(stored);
      } else {
        notifications = DEFAULT_NOTIFICATIONS;
        saveNotifications();
      }
    } catch (e) {
      notifications = DEFAULT_NOTIFICATIONS;
    }
  }

  function saveNotifications() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    } catch (e) {}
  }

  function getUnreadCount() {
    return notifications.filter(n => n.unread).length;
  }

  function updateBadgeUI() {
    const count = getUnreadCount();
    document.querySelectorAll('.notification-badge-indicator').forEach(badge => {
      if (count > 0) {
        badge.classList.remove('hidden');
        badge.innerText = count > 9 ? '9+' : count;
      } else {
        badge.classList.add('hidden');
      }
    });

    const unreadPill = document.getElementById('notif-unread-count-pill');
    if (unreadPill) {
      unreadPill.innerText = `${count} Unread`;
      unreadPill.className = count > 0 
        ? 'text-[11px] font-mono px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-bold border border-rose-200 dark:border-rose-900/60'
        : 'text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-gray-800 text-slate-500 dark:text-gray-400 font-bold';
    }
  }

  function renderNotificationList() {
    const listContainer = document.getElementById('notifications-items-list');
    if (!listContainer) return;

    const items = currentFilter === 'unread' 
      ? notifications.filter(n => n.unread) 
      : notifications;

    if (items.length === 0) {
      listContainer.innerHTML = `
        <div class="py-10 text-center space-y-2 px-4">
          <div class="w-10 h-10 rounded-full bg-slate-100 dark:bg-gray-800 flex items-center justify-center text-slate-400 dark:text-gray-500 mx-auto">
            <span class="material-symbols-outlined text-[20px]">notifications_off</span>
          </div>
          <p class="text-xs font-semibold text-slate-700 dark:text-gray-300">All caught up!</p>
          <p class="text-[11px] text-slate-500 dark:text-gray-400">No ${currentFilter === 'unread' ? 'unread ' : ''}notifications at this time.</p>
        </div>
      `;
      return;
    }

    listContainer.innerHTML = items.map(n => `
      <div onclick="JoblexNotifications.handleClickItem('${n.id}', '${n.link}')" class="p-3.5 transition-all duration-150 cursor-pointer border-b border-slate-100 dark:border-gray-800/80 hover:bg-slate-50/80 dark:hover:bg-white/[0.03] flex items-start gap-3 relative ${n.unread ? 'bg-purple-50/30 dark:bg-purple-950/10' : ''}">
        <div class="w-8 h-8 rounded-xl shrink-0 flex items-center justify-center ${n.iconBg}">
          <span class="material-symbols-outlined text-[17px]">${n.icon}</span>
        </div>
        <div class="flex-1 min-w-0 pr-4">
          <div class="flex items-center justify-between gap-1 mb-0.5">
            <h4 class="text-xs font-bold ${n.unread ? 'text-slate-900 dark:text-white font-extrabold' : 'text-slate-700 dark:text-gray-300'} truncate">${n.title}</h4>
            <span class="text-[10px] font-mono text-slate-400 dark:text-gray-500 shrink-0">${n.time}</span>
          </div>
          <p class="text-[11px] text-slate-600 dark:text-gray-400 line-clamp-2 leading-relaxed">${n.message}</p>
        </div>
        ${n.unread ? `
          <span class="w-2 h-2 rounded-full bg-purple-600 dark:bg-purple-400 shrink-0 self-center absolute right-3" title="Unread"></span>
        ` : ''}
      </div>
    `).join('');
  }

  function createDropdownMarkup() {
    if (document.getElementById('joblex-notifications-dropdown')) return;

    const dropdown = document.createElement('div');
    dropdown.id = 'joblex-notifications-dropdown';
    dropdown.className = 'fixed right-4 sm:right-16 top-16 w-80 sm:w-96 max-w-[94vw] bg-white dark:bg-[#0c0e14] border border-slate-200 dark:border-gray-800 rounded-2xl shadow-2xl z-50 overflow-hidden hidden transition-all duration-200';
    dropdown.style.backdropFilter = 'blur(16px)';

    dropdown.innerHTML = `
      <div class="p-3.5 border-b border-slate-200 dark:border-gray-800 flex items-center justify-between bg-slate-50/50 dark:bg-gray-900/40">
        <div class="flex items-center gap-2">
          <h3 class="font-bold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[18px] text-purple-600 dark:text-purple-400">notifications</span>
            Notifications
          </h3>
          <span id="notif-unread-count-pill" class="text-[11px] font-mono px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-bold border border-rose-200 dark:border-rose-900/60">0 Unread</span>
        </div>
        <div class="flex items-center gap-1">
          <button onclick="JoblexNotifications.markAllRead()" class="text-[11px] font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 px-2 py-1 rounded hover:bg-purple-50 dark:hover:bg-purple-950/40 transition">
            Mark all read
          </button>
          <button onclick="JoblexNotifications.close()" class="p-1 rounded text-slate-400 hover:text-slate-700 dark:text-gray-400 dark:hover:text-white transition">
            ✕
          </button>
        </div>
      </div>

      <!-- Segmented Filter Tabs -->
      <div class="px-3 pt-2.5 pb-2 flex items-center gap-1 border-b border-slate-100 dark:border-gray-800/80 bg-white dark:bg-[#0c0e14]">
        <button id="notif-filter-all" onclick="JoblexNotifications.setFilter('all')" class="px-3 py-1 rounded-lg text-xs font-bold transition bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300">
          All
        </button>
        <button id="notif-filter-unread" onclick="JoblexNotifications.setFilter('unread')" class="px-3 py-1 rounded-lg text-xs font-medium transition text-slate-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-gray-800">
          Unread Only
        </button>
      </div>

      <!-- Scrollable Message List -->
      <div id="notifications-items-list" class="max-h-[380px] overflow-y-auto custom-scrollbar divide-y divide-slate-100 dark:divide-gray-800">
        <!-- Rendered via JS -->
      </div>

      <!-- Footer Registry Link -->
      <div class="p-2.5 bg-slate-50 dark:bg-gray-900/60 border-t border-slate-200 dark:border-gray-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-gray-400">
        <span class="flex items-center gap-1 text-[10px] font-mono">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          NAAR Live Ledger Feed
        </span>
        <button onclick="JoblexNotifications.clearAll()" class="text-slate-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 font-medium transition">
          Clear All
        </button>
      </div>
    `;

    document.body.appendChild(dropdown);
  }

  function toggleDropdown(e) {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    const dropdown = document.getElementById('joblex-notifications-dropdown');
    if (!dropdown) return;

    const isHidden = dropdown.classList.contains('hidden');
    if (isHidden) {
      openDropdown();
    } else {
      closeDropdown();
    }
  }

  function openDropdown() {
    const dropdown = document.getElementById('joblex-notifications-dropdown');
    if (!dropdown) return;
    renderNotificationList();
    updateBadgeUI();
    dropdown.classList.remove('hidden');
  }

  function closeDropdown() {
    const dropdown = document.getElementById('joblex-notifications-dropdown');
    if (dropdown) dropdown.classList.add('hidden');
  }

  function setFilter(filter) {
    currentFilter = filter;
    const btnAll = document.getElementById('notif-filter-all');
    const btnUnread = document.getElementById('notif-filter-unread');

    if (filter === 'all') {
      if (btnAll) btnAll.className = 'px-3 py-1 rounded-lg text-xs font-bold transition bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300';
      if (btnUnread) btnUnread.className = 'px-3 py-1 rounded-lg text-xs font-medium transition text-slate-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-gray-800';
    } else {
      if (btnAll) btnAll.className = 'px-3 py-1 rounded-lg text-xs font-medium transition text-slate-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-gray-800';
      if (btnUnread) btnUnread.className = 'px-3 py-1 rounded-lg text-xs font-bold transition bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300';
    }
    renderNotificationList();
  }

  function markAllRead() {
    notifications.forEach(n => n.unread = false);
    saveNotifications();
    updateBadgeUI();
    renderNotificationList();
  }

  function clearAll() {
    notifications = [];
    saveNotifications();
    updateBadgeUI();
    renderNotificationList();
  }

  function handleClickItem(id, link) {
    const item = notifications.find(n => n.id === id);
    if (item) {
      item.unread = false;
      saveNotifications();
      updateBadgeUI();
    }
    closeDropdown();
    if (link && window.location.pathname.indexOf(link) === -1) {
      window.location.href = link;
    }
  }

  // Bind outside click listener
  document.addEventListener('click', (e) => {
    const dropdown = document.getElementById('joblex-notifications-dropdown');
    if (!dropdown || dropdown.classList.contains('hidden')) return;

    const bellBtn = e.target.closest('#notification-bell-btn');
    if (!bellBtn && !dropdown.contains(e.target)) {
      closeDropdown();
    }
  });

  // Escape key listener
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDropdown();
  });

  // Init on DOM load
  document.addEventListener('DOMContentLoaded', () => {
    loadNotifications();
    createDropdownMarkup();
    updateBadgeUI();

    // Attach click to any notification bell buttons on the page
    document.querySelectorAll('#notification-bell-btn').forEach(btn => {
      btn.onclick = toggleDropdown;
    });
  });

  // Export public API
  window.JoblexNotifications = {
    toggle: toggleDropdown,
    open: openDropdown,
    close: closeDropdown,
    setFilter: setFilter,
    markAllRead: markAllRead,
    clearAll: clearAll,
    handleClickItem: handleClickItem,
    getUnreadCount: getUnreadCount
  };

  window.toggleNotificationsDropdown = toggleDropdown;
})();
