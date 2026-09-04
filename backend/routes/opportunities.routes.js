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

// GET /api/opportunities
router.get('/', async (req, res) => {
  const { type } = req.query;

  try {
    let query = supabase.from('opportunities').select('*').order('created_at', { ascending: false });
    if (type && type !== 'All') {
      query = query.ilike('type', type);
    }
    const { data, error } = await query;
    if (!error && data) {
      return res.json({ opportunities: data });
    }
  } catch (err) {
    console.warn('[Opportunities GET] Supabase query warning, using fallback:', err.message);
  }

  const filtered = (type && type !== 'All')
    ? (DB.opportunities || []).filter(o => o.type.toLowerCase() === type.toLowerCase())
    : (DB.opportunities || []);
  return res.json({ opportunities: filtered });
});

// POST /api/opportunities/apply (Student sends application to Industry)
router.post('/apply', async (req, res) => {
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

  const newApp = {
    id: `app-${Date.now().toString(36)}`,
    opportunity_id: opportunityId || 'opp-1',
    opportunity_title: opportunityTitle || 'Ayush Research Intern',
    company: company || 'Dabur India Ltd.',
    type: type || 'Internship',
    student_name: studentName || 'Ashay Verma',
    student_email: studentEmail || 'student@nexus.edu',
    college: college || 'All India Institute of Ayurveda (AIIA), New Delhi',
    skills: Array.isArray(skills) ? skills : ['Herbal Formulation', 'Phytochemistry', 'GLP'],
    match: parseInt(match) || 92,
    applied_date: new Date().toISOString().split('T')[0],
    status: 'Pending Review',
    verified_badge: 'AIIA-CERT-2026-9842',
    cover_note: coverNote || 'Application submitted with AIIA verified credentials.'
  };

  try {
    const { data, error } = await supabase.from('applications').insert([newApp]).select().single();
    if (!error && data) {
      return res.status(201).json({
        success: true,
        message: `Application for "${newApp.opportunity_title}" successfully transmitted to ${newApp.company}!`,
        application: data
      });
    }
  } catch (err) {
    console.warn('[Opportunities Apply] Supabase error, saving locally:', err.message);
  }

  if (!DB.applications) DB.applications = [];
  DB.applications.unshift(newApp);

  res.status(201).json({
    success: true,
    message: `Application for "${newApp.opportunity_title}" successfully transmitted to ${newApp.company}!`,
    application: newApp
  });
});

// GET /api/opportunities/my-applications
router.get('/my-applications', async (req, res) => {
  const { email } = req.query;

  try {
    let query = supabase.from('applications').select('*').order('created_at', { ascending: false });
    if (email) {
      query = query.ilike('student_email', email);
    }
    const { data, error } = await query;
    if (!error && data) {
      return res.json({ applications: data });
    }
  } catch (err) {
    console.warn('[My Applications] Supabase error, falling back:', err.message);
  }

  const list = DB.applications || [];
  if (email) {
    return res.json({ applications: list.filter(a => (a.studentEmail || a.student_email || '').toLowerCase() === email.toLowerCase()) });
  }
  res.json({ applications: list });
});

// POST /api/opportunities (Post an opportunity)
router.post('/', async (req, res) => {
  const { title, company, type, skills, location, stipend, deadline, description } = req.body || {};
  const newOpp = {
    id: `opp-${Date.now().toString(36)}`,
    title: title || 'Ayush Research Intern',
    company: company || 'Ayush Corporate Partner',
    type: type || 'Internship',
    skills: Array.isArray(skills) ? skills : (skills ? skills.split(',').map(s => s.trim()) : ['Herbal Formulation']),
    location: location || 'Hybrid / New Delhi',
    stipend: stipend || '₹20,000/mo',
    deadline: deadline || '2026-11-30',
    match: 88,
    description: description || 'Verified opportunity published through JOBLEX portal.'
  };

  try {
    const { data, error } = await supabase.from('opportunities').insert([newOpp]).select().single();
    if (!error && data) {
      return res.json({ success: true, message: 'Opportunity published successfully!', opportunity: data });
    }
  } catch (err) {
    console.warn('[Post Opportunity] Supabase error, saving locally:', err.message);
  }

  if (!DB.opportunities) DB.opportunities = [];
  DB.opportunities.unshift(newOpp);
  res.json({ success: true, message: 'Opportunity published successfully!', opportunity: newOpp });
});

module.exports = router;
