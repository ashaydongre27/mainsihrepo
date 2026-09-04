/**
 * JOBLEX Opportunities & Micro-Gigs Routes (JavaScript / Node.js)
 * Supports:
 * - Filtering by type ('Internship', 'Job', 'Micro-Gig', 'Hackathon')
 * - Direct Student Application Dispatch (`POST /apply`)
 * - Student's Own Applications List (`GET /my-applications`)
 */
const express = require('express');
const router = express.Router();
const DB = require('../data/database');

// GET /api/opportunities
router.get('/', (req, res) => {
  const { type } = req.query;
  if (type && type !== 'All') {
    const filtered = (DB.opportunities || []).filter(o => o.type.toLowerCase() === type.toLowerCase());
    return res.json({ opportunities: filtered });
  }
  res.json({ opportunities: DB.opportunities || [] });
});

// POST /api/opportunities/apply (Student sends application to Industry)
router.post('/apply', (req, res) => {
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

  if (!DB.applications) DB.applications = [];

  const newApp = {
    id: `app-${Date.now().toString(36)}`,
    opportunityId: opportunityId || 'opp-custom',
    opportunityTitle: opportunityTitle || 'Ayush Research Intern',
    company: company || 'Dabur India Ltd.',
    type: type || 'Internship',
    studentName: studentName || 'Ashay Verma',
    studentEmail: studentEmail || 'student@nexus.edu',
    college: college || 'All India Institute of Ayurveda (AIIA), New Delhi',
    skills: skills || ['Herbal Formulation', 'Phytochemistry', 'GLP'],
    match: parseInt(match) || 92,
    appliedDate: new Date().toISOString().split('T')[0],
    status: 'Pending Review',
    verifiedBadge: 'AIIA-CERT-2026-9842',
    coverNote: coverNote || 'Application submitted with AIIA verified credentials.'
  };

  DB.applications.unshift(newApp);

  res.status(201).json({
    success: true,
    message: `Application for "${newApp.opportunityTitle}" successfully transmitted to ${newApp.company}!`,
    application: newApp
  });
});

// GET /api/opportunities/my-applications
router.get('/my-applications', (req, res) => {
  const { email } = req.query;
  const list = DB.applications || [];
  if (email) {
    return res.json({ applications: list.filter(a => a.studentEmail.toLowerCase() === email.toLowerCase()) });
  }
  res.json({ applications: list });
});

// POST /api/opportunities (Post an opportunity)
router.post('/', (req, res) => {
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

  if (!DB.opportunities) DB.opportunities = [];
  DB.opportunities.unshift(newOpp);
  res.json({ success: true, message: 'Opportunity published successfully!', opportunity: newOpp });
});

module.exports = router;
