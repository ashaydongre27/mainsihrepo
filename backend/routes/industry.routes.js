/**
 * JOBLEX Industry Recruitment & Forecasting Routes (JavaScript / Node.js)
 * Enhanced with SIH 26044 features:
 * 3. Reverse Application & Inbound Talent Outreach
 * 6. Talent Pipeline Forecasting
 * 7. Skill ROI Dashboard & AI Calibration
 * 8. Sponsored Skill Bootcamps
 */
const express = require('express');
const router = express.Router();
const DB = require('../data/database');

// GET /api/industry/candidates
router.get('/candidates', (req, res) => {
  res.json({ candidates: DB.candidates });
});

// GET /api/industry/forecast (Idea #6)
router.get('/forecast', (req, res) => {
  res.json(DB.talentForecast);
});

// GET /api/industry/reverse-search (Idea #3: Reverse Application)
router.get('/reverse-search', (req, res) => {
  const { skill = '' } = req.query;
  const filtered = DB.candidates.filter(c => 
    !skill || c.skills.some(s => s.toLowerCase().includes(skill.toLowerCase()))
  );
  res.json({
    totalMatched: filtered.length,
    candidates: filtered.map(c => ({
      ...c,
      isReverseDiscovery: true,
      hasApplied: false,
      outreachStatus: 'Ready for Inbound Invitation'
    }))
  });
});

// POST /api/industry/inbound-invite (Idea #3)
router.post('/inbound-invite', (req, res) => {
  const { candidateName, roleTitle } = req.body || {};
  res.json({
    success: true,
    message: `Direct inbound interview invitation transmitted to ${candidateName || 'candidate'} for role "${roleTitle || 'Research Associate'}"!`
  });
});

// GET /api/industry/bootcamps (Idea #8: Sponsored Bootcamps)
router.get('/bootcamps', (req, res) => {
  res.json({ bootcamps: DB.sponsoredBootcamps });
});

// POST /api/industry/create-bootcamp (Idea #8)
router.post('/create-bootcamp', (req, res) => {
  const { title, partnerCollege, targetHires, stipend } = req.body || {};
  const newBootcamp = {
    id: `bc-${Date.now().toString(36)}`,
    title: title || 'Ayush Industrial Immersion Bootcamp',
    sponsor: 'Dabur India Ltd.',
    partnerCollege: partnerCollege || 'All India Institute of Ayurveda',
    targetHires: parseInt(targetHires) || 20,
    matchedScholars: 14,
    startDate: 'Dec 01, 2026',
    stipend: stipend || 'Full Sponsorship + ₹10,000 Bounty',
    guaranteedOutcome: 'Direct PPOs for Top Finishers',
    status: 'Cohort Active'
  };

  DB.sponsoredBootcamps.unshift(newBootcamp);
  res.json({ success: true, message: 'Sponsored Bootcamp cohort initiated!', bootcamp: newBootcamp });
});

// GET /api/industry/skill-roi (Idea #7: Skill ROI Dashboard)
router.get('/skill-roi', (req, res) => {
  res.json(DB.skillRoiMetrics);
});

// POST /api/industry/rate-candidate (Idea #7)
router.post('/rate-candidate', (req, res) => {
  const { candidateName, actualRating, comments } = req.body || {};
  DB.skillRoiMetrics.totalHiresEvaluated += 1;
  DB.skillRoiMetrics.feedbackLogs.unshift({
    candidate: candidateName || 'Scholar',
    predictedMatch: 92,
    actualLabRating: parseFloat(actualRating) || 4.8,
    company: 'Dabur R&D',
    note: comments || 'Verified lab performance matches platform skill prediction.'
  });

  res.json({
    success: true,
    message: 'Feedback recorded! AI matching weight calibrated.',
    skillRoi: DB.skillRoiMetrics
  });
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
