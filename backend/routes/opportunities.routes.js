/**
 * JOBLEX Opportunities & Micro-Gigs Routes (JavaScript / Node.js)
 * Supports:
 * - Filtering by type ('Internship', 'Job', 'Micro-Gig', 'Hackathon')
 * - Direct Student Application Dispatch (`POST /apply`)
 * - Student's Own Applications List (`GET /my-applications`)
 */
const express = require('express');
const router = express.Router();
const { supabase, isConfigured } = require('../config/supabase');
const DB = require('../data/database');
const { authenticateToken, requireRole } = require('../middleware/auth.middleware');
const { clearRecommendationCache } = require('../services/matching.service');

// GET /api/opportunities
router.get('/', async (req, res) => {
  const { type } = req.query;

  if (isConfigured && supabase) {
    try {
      let query = supabase.from('opportunities').select('*');
      if (type && type !== 'All') {
        query = query.ilike('type', type);
      }
      const { data, error } = await query;
      if (!error && data) {
        const localItems = DB.opportunities || [];
        const combined = [...data];
        for (const loc of localItems) {
          if (!combined.some(s => s.id === loc.id || (s.title && loc.title && s.title.toLowerCase() === loc.title.toLowerCase()))) {
            combined.unshift(loc);
          }
        }
        const filteredCombined = (type && type !== 'All')
          ? combined.filter(o => o.type && o.type.toLowerCase() === type.toLowerCase())
          : combined;
        return res.json({ opportunities: filteredCombined });
      }
    } catch (err) {
      console.warn('[Opportunities GET] Supabase query warning, using fallback:', err.message);
    }
  }

  const filtered = (type && type !== 'All')
    ? (DB.opportunities || []).filter(o => o.type && o.type.toLowerCase() === type.toLowerCase())
    : (DB.opportunities || []);
  return res.json({ opportunities: filtered });
});

// POST /api/opportunities/apply (Student sends application to Industry)
router.post('/apply', authenticateToken, requireRole(['student']), async (req, res) => {
  const { 
    opportunityId, 
    opportunityTitle, 
    company, 
    type, 
    studentName, 
    studentEmail, 
    college, 
    skills, 
    match,
    coverNote 
  } = req.body || {};

  const authenticatedEmail = (req.user.email || '').trim().toLowerCase();
  const authenticatedName = req.user.name || authenticatedEmail.split('@')[0];

  if (!opportunityTitle) {
    return res.status(400).json({ success: false, error: 'Opportunity title is required to apply.' });
  }

  let newApp = {
    id: `app-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
    opportunity_id: opportunityId || 'opp-tech-01',
    opportunity_title: opportunityTitle,
    company: company || 'Corporate Industry Partner',
    type: type || 'Internship',
    student_name: authenticatedName,
    student_email: authenticatedEmail,
    college: college || 'Accredited Higher Education Institution',
    skills: Array.isArray(skills) ? skills : ['Technical Skills', 'Research', 'Communication'],
    match: parseInt(match, 10) || 85,
    applied_date: new Date().toISOString().split('T')[0],
    status: 'Pending Review',
    verified_badge: `JOBLEX-CERT-${Date.now().toString(36).toUpperCase()}`,
    cover_note: coverNote || 'Application submitted with verified institutional credentials.'
  };

  if (isConfigured && supabase) {
    try {
      let validOppId = opportunityId;
      if (validOppId) {
        const { data: existing } = await supabase.from('opportunities').select('id').eq('id', validOppId).maybeSingle();
        if (!existing) validOppId = null;
      }
      if (!validOppId) {
        const { data: firstOpp } = await supabase.from('opportunities').select('id').limit(1).maybeSingle();
        validOppId = firstOpp?.id || 'opp-tech-01';
      }
      newApp.opportunity_id = validOppId;

      const { data, error } = await supabase.from('applications').insert([newApp]).select().single();
      if (!error && data) {
        newApp = { ...newApp, ...data };
      } else if (error) {
        console.warn('[Opportunities Apply] Supabase insert error:', error.message);
      }
    } catch (err) {
      console.warn('[Opportunities Apply] Supabase error, saving locally:', err.message);
    }
  }

  // Ensure camelCase aliases for client backwards compatibility
  newApp.opportunityId = newApp.opportunity_id;
  newApp.opportunityTitle = newApp.opportunity_title;
  newApp.studentName = newApp.student_name;
  newApp.studentEmail = newApp.student_email;
  newApp.appliedDate = newApp.applied_date;
  newApp.verifiedBadge = newApp.verified_badge;
  newApp.coverNote = newApp.cover_note;

  if (!DB.applications) DB.applications = [];
  DB.applications.unshift(newApp);

  // Dispatch In-Portal Notification to Recruiter / Industry
  if (!DB.inPortalNotifications) DB.inPortalNotifications = [];
  DB.inPortalNotifications.unshift({
    id: `notif-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
    recipientId: 'usr-industry-01',
    senderId: newApp.studentEmail || 'usr-student-01',
    title: `New Candidate: ${newApp.studentName}`,
    message: `${newApp.studentName} applied for "${newApp.opportunityTitle}" at ${newApp.company} (${newApp.match}% Match).`,
    actionUrl: '/industry.html',
    category: 'application_submitted',
    isRead: false,
    createdAt: new Date().toISOString()
  });

  // Dispatch In-Portal Notification to Student
  const studentRecipId = newApp.studentEmail || 'usr-student-01';
  DB.inPortalNotifications.unshift({
    id: `notif-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
    recipientId: studentRecipId,
    senderId: 'usr-industry-01',
    title: `Application Transmitted: ${newApp.opportunityTitle}`,
    message: `Your dossier has been transmitted to ${newApp.company}. Current status: Pending Review.`,
    actionUrl: '/student.html#applications',
    category: 'application_submitted',
    isRead: false,
    createdAt: new Date().toISOString()
  });

  // Inject a Contextual To-Do for the Student
  if (!DB.todos) DB.todos = [];
  DB.todos.unshift({
    id: `todo-app-${Date.now().toString(36)}`,
    studentId: studentRecipId,
    title: `Track Application: ${newApp.opportunityTitle} (${newApp.company})`,
    description: `Submitted on ${newApp.appliedDate}. Review company profile and prepare pharmacognosy lab portfolio.`,
    category: 'Application',
    priority: 'Medium',
    dueDate: new Date(Date.now() + 86400000 * 5).toISOString(),
    isCompleted: false,
    completedAt: null,
    sourceType: 'application_tracking',
    sourceRefId: newApp.id
  });

  res.status(201).json({
    success: true,
    message: `Application for "${newApp.opportunityTitle}" successfully transmitted to ${newApp.company}!`,
    application: newApp
  });
});

// GET /api/opportunities/my-applications
router.get('/my-applications', async (req, res) => {
  const email = (req.query.email || '').trim().toLowerCase();

  if (!email) {
    return res.status(400).json({ success: false, error: 'Student email required to fetch applications.' });
  }

  if (isConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .ilike('student_email', email)
        .order('created_at', { ascending: false });

      if (!error && data) {
        return res.json({ applications: data });
      }
    } catch (err) {
      console.warn('[My Applications] Supabase error, falling back:', err.message);
    }
  }

  const list = DB.applications || [];
  const studentApps = list.filter(a => (a.studentEmail || a.student_email || '').toLowerCase() === email);
  res.json({ applications: studentApps });
});

// POST /api/opportunities (Post an opportunity)
router.post('/', authenticateToken, requireRole(['industry']), async (req, res) => {
  const { title, company, type, skills, location, stipend, deadline, description } = req.body || {};

  if (!title || !company) {
    return res.status(400).json({ success: false, error: 'Title and company are required to post an opportunity.' });
  }

  const newOpp = {
    id: `opp-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
    title: title.trim(),
    company: company.trim(),
    type: type || 'Internship',
    skills: Array.isArray(skills) ? skills : (skills ? skills.split(',').map(s => s.trim()) : ['Herbal Formulation']),
    location: location || 'Hybrid / New Delhi',
    stipend: stipend || '₹20,000/mo',
    deadline: deadline || '2026-11-30',
    match: 85,
    description: description || 'Verified opportunity published through JOBLEX portal.'
  };

  let savedOpp = newOpp;
  if (isConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('opportunities').insert([newOpp]).select().single();
      if (!error && data) {
        savedOpp = data;
      }
    } catch (err) {
      console.warn('[Post Opportunity] Supabase error, saving locally:', err.message);
    }
  }

  if (!DB.opportunities) DB.opportunities = [];
  DB.opportunities.unshift(savedOpp);

  // Invalidate matching/recommendation cache so students see newly posted openings immediately
  clearRecommendationCache();

  // Broadcast in-portal notification to every known student account.
  if (!DB.inPortalNotifications) DB.inPortalNotifications = [];
  const students = (DB.users || []).filter(user => (user.role || '').toLowerCase() === 'student');
  const recipients = students.length ? students : [{ id: 'usr-student-01' }];
  recipients.forEach(student => DB.inPortalNotifications.unshift({
      id: `notif-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      recipientId: student.email || student.id,
      senderId: req.user.id || req.user.email || 'usr-industry-01',
      title: `New Opening: ${savedOpp.title}`,
      message: `${savedOpp.company} has published a new ${savedOpp.type} requisition. Check your match score!`,
      actionUrl: '/student.html#opportunities',
      category: 'new_opportunity',
      isRead: false,
      createdAt: new Date().toISOString()
    }));

  res.status(201).json({ success: true, message: 'Opportunity published successfully!', opportunity: savedOpp });
});

// PATCH /api/opportunities/applications/:id/status (Recruiter updates candidate status)
router.patch('/applications/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, interviewSlot = null, notes = '' } = req.body || {};

    if (!status) {
      return res.status(400).json({ success: false, error: 'Status is required.' });
    }

    const apps = DB.applications || [];
    const app = apps.find(a => a.id === id || a.applicationId === id);

    if (app) {
      app.status = status;
      if (interviewSlot) app.interviewSlot = interviewSlot;
    }

    if (isConfigured && supabase) {
      try {
        await supabase.from('applications').update({
          status,
          interview_slot: interviewSlot
        }).eq('id', id);
      } catch (err) {
        console.warn('[Application Status Update] Supabase warning:', err.message);
      }
    }

    // Auto-dispatch in-portal alert to student
    if (!DB.inPortalNotifications) DB.inPortalNotifications = [];
    const studentId = (app && app.studentId) || 'usr-student-01';
    const compName = (app && app.company) || 'Ayush Employer';
    const oppTitle = (app && (app.opportunityTitle || app.opportunity_title)) || 'Position';

    DB.inPortalNotifications.unshift({
      id: `notif-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      recipientId: studentId,
      senderId: 'usr-industry-01',
      title: `Status Update: ${status} (${compName})`,
      message: `Your application for "${oppTitle}" has been updated to "${status}".${interviewSlot ? ` Scheduled slot: ${interviewSlot}` : ''}`,
      actionUrl: '/student.html#applications',
      category: status.includes('Interview') ? 'interview_invite' : 'application_update',
      isRead: false,
      createdAt: new Date().toISOString()
    });

    // Auto-inject a To-Do if an interview is scheduled
    if (status.includes('Interview') || status.includes('Shortlist')) {
      if (!DB.todos) DB.todos = [];
      DB.todos.unshift({
        id: `todo-app-${Date.now().toString(36)}`,
        studentId,
        title: `Prepare for ${compName} Interview (${oppTitle})`,
        description: `Review domain fundamentals, technical competencies, and project portfolio. Scheduled for: ${interviewSlot || 'Upcoming Date'}.`,
        category: 'Application',
        priority: 'Urgent',
        dueDate: interviewSlot || new Date(Date.now() + 86400000 * 3).toISOString(),
        isCompleted: false,
        completedAt: null,
        sourceType: 'system_interview',
        sourceRefId: id
      });
    }

    return res.json({
      success: true,
      message: `Application status updated to "${status}" and in-portal notifications dispatched.`,
      application: app
    });
  } catch (err) {
    console.error('[Application Status Update Error]:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;

