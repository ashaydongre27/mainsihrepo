/**
 * JOBLEX API Client with Built-in Fallbacks for Offline & Vercel Deployments
 */

const API_BASE = window.JOBLEX_API_URL || 'http://127.0.0.1:5000/api';

const JoblexAPI = {
  // Demo accounts
  demoUsers: {
    student: {
      name: 'Ashay Verma',
      email: 'student@nexus.edu',
      role: 'student',
      institution: 'All India Institute of Ayurveda (AIIA), New Delhi',
      department: 'Ayurvedic Pharmacology & Data Science',
      xp: 1450,
      streak: 7
    },
    academy: {
      name: 'Dr. Sunita Sharma',
      email: 'dean@aiia.gov.in',
      role: 'academy',
      institution: 'All India Institute of Ayurveda',
      designation: 'Dean of Academic Affairs & Industry Liaison'
    },
    industry: {
      name: 'Rajesh Malhotra',
      email: 'hr@dabur-research.com',
      role: 'industry',
      company: 'Dabur Research & Development Ltd.',
      designation: 'Head of University Relations'
    }
  },

  // Auth Helpers
  getCurrentUser() {
    const data = localStorage.getItem('joblex_user');
    if (data) {
      try { return JSON.parse(data); } catch(e) {}
    }
    return this.demoUsers.student; // Default to demo student
  },

  setCurrentUser(user) {
    localStorage.setItem('joblex_user', JSON.stringify(user));
  },

  logout() {
    localStorage.removeItem('joblex_user');
    window.location.href = 'auth.html';
  },

  async login(email, password, role) {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role })
      });
      if (res.ok) {
        const data = await res.json();
        this.setCurrentUser(data.user);
        return data;
      }
    } catch(e) {
      console.warn('API unreachable, using local fallback:', e);
    }
    // Fallback
    const user = this.demoUsers[role] || { name: 'Demo User', email, role };
    this.setCurrentUser(user);
    return { success: true, user };
  },

  async getRoadmap() {
    try {
      const res = await fetch(`${API_BASE}/roadmap`);
      if (res.ok) return await res.json();
    } catch(e) {}
    // Fallback Roadmap
    return {
      currentPhase: 1,
      totalXp: 1450,
      streak: 7,
      decayFrozenUntil: '2026-10-25',
      phases: [
        {
          id: 1,
          name: 'Core Ayurvedic Pharmacognosy & GLP',
          xpReward: 350,
          status: 'IN_PROGRESS',
          tasks: [
            { id: 't1', title: 'Complete Good Laboratory Practice (GLP) module', xp: 50, completed: true },
            { id: 't2', title: 'Ayurvedic botanical authentication quiz in Arena', xp: 50, completed: true },
            { id: 't3', title: 'Prepare Ashwagandha classical decoction report', xp: 100, completed: false }
          ]
        },
        {
          id: 2,
          name: 'Chromatography & HPTLC Profiling',
          xpReward: 450,
          status: 'LOCKED',
          tasks: [
            { id: 't4', title: 'MoU Partner (Dabur) Webinar on HPLC standards', xp: 75, completed: false },
            { id: 't5', title: 'Perform Fingerprint Marker Analysis quiz', xp: 75, completed: false }
          ]
        },
        {
          id: 3,
          name: 'Computational Drug Discovery & Health-AI',
          xpReward: 500,
          status: 'LOCKED',
          tasks: [
            { id: 't6', title: 'Python for Pharmacological Data Processing', xp: 100, completed: false },
            { id: 't7', title: 'In-silico docking of Phytochemical compounds', xp: 150, completed: false }
          ]
        },
        {
          id: 4,
          name: 'Corporate Internship & Capstone Formulation',
          xpReward: 600,
          status: 'LOCKED',
          tasks: [
            { id: 't8', title: 'Submit candidate CV to Dabur / Patanjali via Board', xp: 200, completed: false },
            { id: 't9', title: 'Pass Final Technical Evaluation Panel', xp: 400, completed: false }
          ]
        }
      ]
    };
  },

  async analyzeResume(text, role) {
    try {
      const res = await fetch(`${API_BASE}/resume/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText: text, targetRole: role })
      });
      if (res.ok) return await res.json();
    } catch(e) {}
    // Fallback AI Analysis
    return {
      success: true,
      targetRole: role,
      matchPercentage: 78,
      benchmark: 85,
      extractedSkills: ["Herbal Formulation", "Ayurvedic Pharmacognosy", "GLP", "Python"],
      missingSkills: ["HPTLC / HPLC Fingerprinting", "Formulation Stability Protocols", "Nanomedicine Delivery"],
      softSkillsMatched: ["Scientific Documentation", "Research Ethics"],
      recommendations: [
        "Complete HPTLC chromatography certification through Dabur MoU workshop.",
        "Take the 'Formulation Stability Testing' quiz in Quiz Arena (+150 XP).",
        "Engage in clinical protocol documentation to reach the 85% industry benchmark."
      ]
    };
  },

  async askZulu(prompt) {
    try {
      const res = await fetch(`${API_BASE}/zulu/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: prompt })
      });
      if (res.ok) return await res.json();
    } catch(e) {}
    return {
      reply: `Based on current industry demand from Dabur and Himalaya, mastering Phytochemistry alongside Python data analytics will position you in the top 5% of applicants. Check your Career Roadmap to start the next module!`
    };
  }
};

window.JoblexAPI = JoblexAPI;
