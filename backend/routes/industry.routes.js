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
const { supabase, isConfigured } = require('../config/supabase');
const DB = require('../data/database');

// GET /api/industry/all-data
router.get('/all-data', async (req, res) => {
  try {
    const [oppRes, mouRes, candRes, bootRes] = await Promise.allSettled([
      supabase.from('opportunities').select('*').order('created_at', { ascending: false }),
      supabase.from('mou_partnerships').select('*'),
      supabase.from('candidates').select('*'),
      supabase.from('sponsored_bootcamps').select('*')
    ]);

    const opportunities = oppRes.status === 'fulfilled' && !oppRes.value.error && oppRes.value.data?.length
      ? oppRes.value.data
      : (DB.opportunities || []);

    const mouPartnerships = mouRes.status === 'fulfilled' && !mouRes.value.error && mouRes.value.data?.length
      ? mouRes.value.data
      : (DB.mou_partnerships || []);

    const candidates = candRes.status === 'fulfilled' && !candRes.value.error && candRes.value.data?.length
      ? candRes.value.data
      : (DB.candidates || []);

    const bootcamps = bootRes.status === 'fulfilled' && !bootRes.value.error && bootRes.value.data?.length
      ? bootRes.value.data
      : (DB.sponsoredBootcamps || []);

    return res.json({
      success: true,
      opportunities,
      mouPartnerships,
      candidates,
      forecast: DB.talentForecast || {},
      bootcamps,
      skillRoi: DB.skillRoiMetrics || {}
    });
  } catch (err) {
    console.warn('[Industry all-data] Query warning:', err.message);
    return res.json({
      success: true,
      opportunities: DB.opportunities || [],
      mouPartnerships: DB.mou_partnerships || [],
      candidates: DB.candidates || [],
      forecast: DB.talentForecast || {},
      bootcamps: DB.sponsoredBootcamps || [],
      skillRoi: DB.skillRoiMetrics || {}
    });
  }
});

// POST /api/industry/post-opportunity
router.post('/post-opportunity', (req, res) => {
  const data = req.body || {};
  const newOpp = {
    id: `opp-${Date.now().toString(36)}`,
    title: data.title || 'Research Associate',
    company: data.company || 'Ayush Industry Partner',
    type: data.type || 'Internship',
    skills: Array.isArray(data.skills) ? data.skills : (data.skills ? data.skills.split(',').map(s => s.trim()) : ['Herbal Formulation', 'Research']),
    location: data.location || 'New Delhi / Hybrid',
    stipend: data.stipend || '₹18,000/mo',
    deadline: data.deadline || '2026-11-30',
    match: 88,
    description: data.description || 'Opportunity posted via JOBLEX Industry Portal.'
  };

  if (!DB.opportunities) DB.opportunities = [];
  DB.opportunities.unshift(newOpp);
  res.status(201).json({
    success: true,
    message: 'Opportunity published successfully!',
    opportunity: newOpp
  });
});

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

// GET /api/industry/applications (Received from students applying to jobs/internships)
router.get('/applications', async (req, res) => {
  const { company, type } = req.query;

  try {
    let query = supabase.from('applications').select('*').order('created_at', { ascending: false });
    if (company && company !== 'All') {
      query = query.ilike('company', `%${company}%`);
    }
    if (type && type !== 'All') {
      query = query.ilike('type', type);
    }
    const { data, error } = await query;
    if (!error && data) {
      return res.json({
        totalApplications: data.length,
        applications: data
      });
    }
  } catch (err) {
    console.warn('[Industry applications] Supabase warning:', err.message);
  }

  let list = DB.applications || [];
  if (company && company !== 'All') {
    list = list.filter(a => a.company.toLowerCase().includes(company.toLowerCase()));
  }
  if (type && type !== 'All') {
    list = list.filter(a => a.type.toLowerCase() === type.toLowerCase());
  }
  res.json({
    totalApplications: list.length,
    applications: list
  });
});

// POST /api/industry/applications/:id/status
router.post('/applications/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body || {};
  const updatedStatus = status || 'Shortlisted';

  try {
    const { data, error } = await supabase
      .from('applications')
      .update({ status: updatedStatus })
      .eq('id', id)
      .select()
      .single();

    if (!error && data) {
      return res.json({
        success: true,
        message: `Application status updated to "${data.status}" for ${data.student_name || data.studentName}!`,
        application: data
      });
    }
  } catch (err) {
    console.warn('[Update app status] Supabase error:', err.message);
  }

  const app = (DB.applications || []).find(a => a.id === id);
  if (!app) {
    return res.status(404).json({ success: false, message: 'Application not found.', error: 'Application not found.' });
  }

  app.status = updatedStatus;
  res.json({
    success: true,
    message: `Application status updated to "${app.status}" for ${app.studentName || app.student_name}!`,
    application: app
  });
});

module.exports = router;
