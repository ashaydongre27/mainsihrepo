/**
 * JOBLEX Industry Recruitment & Forecasting Routes (JavaScript / Node.js)
 */
const express = require('express');
const router = express.Router();
const DB = require('../data/database');

// GET /api/industry/candidates
router.get('/candidates', (req, res) => {
  res.json({ candidates: DB.candidates });
});

// GET /api/industry/forecast
router.get('/forecast', (req, res) => {
  res.json(DB.talentForecast);
});

// POST /api/industry/submit-skill-demand
router.post('/submit-skill-demand', (req, res) => {
  const { department, skill, justification } = req.body || {};
  const newSuggestion = {
    id: `syl-${Date.now().toString(36)}`,
    currentTopic: department || 'Ayurvedic Pharmaceutical Technology',
    suggestedAddition: skill || 'Automated HPTLC Monograph Standards',
    source: 'Corporate Demand (Industry Advisory Board)',
    impact: justification || 'Essential for corporate manufacturing recruitment',
    adopted: false
  };

  DB.syllabus_suggestions.unshift(newSuggestion);
  res.json({
    success: true,
    message: 'Corporate skill demand transmitted to Academic Councils under NEP-2020.',
    syllabusUpdate: newSuggestion
  });
});

module.exports = router;
