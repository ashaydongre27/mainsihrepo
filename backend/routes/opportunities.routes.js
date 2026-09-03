/**
 * JOBLEX Opportunities & Micro-Gigs Routes (JavaScript / Node.js)
 */
const express = require('express');
const router = express.Router();
const DB = require('../data/database');

// GET /api/opportunities
router.get('/', (req, res) => {
  const { type } = req.query;
  if (type && type !== 'All') {
    const filtered = DB.opportunities.filter(o => o.type.toLowerCase() === type.toLowerCase());
    return res.json({ opportunities: filtered });
  }
  res.json({ opportunities: DB.opportunities });
});

// POST /api/opportunities
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

  DB.opportunities.unshift(newOpp);
  res.json({ success: true, message: 'Opportunity published successfully!', opportunity: newOpp });
});

module.exports = router;
