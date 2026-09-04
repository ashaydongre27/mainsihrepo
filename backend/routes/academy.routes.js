/**
 * JOBLEX Academy & Curriculum Modernization Routes (Node.js / Express)
 * Powered by Google Gemini AI for NEP-2020 / NAAC Curriculum Auditing
 * Ministry of Ayush / All India Institute of Ayurveda | Problem Statement ID: 26044
 */

const express = require('express');
const router = express.Router();
const { generateWithFailover, isGoogleApiConfigured } = require('../services/ai.service');
const DB = require('../data/database');

/**
 * AI-powered curriculum audit using LangGraph Failover Orchestrator
 */
async function auditCurriculumWithGemini(syllabusText, department) {
  if (!isGoogleApiConfigured()) {
    return null;
  }

  const prompt = `You are the lead Academic Accreditation and Curriculum Modernization Auditor for the Ministry of Ayush, working under the National Education Policy (NEP-2020) and NAAC guidelines.

Audit this university department syllabus for "${department}":
"""
${syllabusText}
"""

Evaluate the syllabus against modern pharmaceutical industry needs (HPTLC, HPLC, molecular docking, GLP/GCP, digital health informatics).
Return ONLY a JSON object matching this schema:
{
  "coverageScore": number (0-100 score reflecting modern industry alignment),
  "naacCriterionScore": string (e.g. "3.6 / 4.0"),
  "matchingCompetencies": string[] (up to 4 classical or modern competencies covered well),
  "criticalGapsIdentified": [
    {
      "unit": string (name of unit or section),
      "gap": string (modern technical gap),
      "impact": string (why pharma industries like Dabur/Himalaya need this)
    }
  ],
  "modernizationRecommendations": string[] (3 specific modern topics to incorporate)
}`;

  try {
    const result = await generateWithFailover({
      prompt,
      systemInstruction: 'You are an AI curriculum evaluation specialist for the Ministry of Ayush. Always return raw, valid JSON.',
      temperature: 0.2,
      jsonMode: true
    });

    if (result && result.text) {
      const cleanJson = result.text.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
      return JSON.parse(cleanJson);
    }
  } catch (err) {
    console.error('[Curriculum Audit LangGraph Error]:', err.message);
  }
  return null;
}

const { supabase, isConfigured } = require('../config/supabase');

// GET /api/academy/all-data
router.get('/all-data', async (req, res) => {
  try {
    const [mouRes, sylRes, cgRes, fdpRes, bootRes, ccbRes] = await Promise.allSettled([
      supabase.from('mou_partnerships').select('*'),
      supabase.from('syllabus_suggestions').select('*'),
      supabase.from('consultancy_grants').select('*'),
      supabase.from('fdp_programs').select('*'),
      supabase.from('sponsored_bootcamps').select('*'),
      supabase.from('cross_college_benchmarks').select('*').order('rank', { ascending: true })
    ]);

    const mouPartnerships = mouRes.status === 'fulfilled' && !mouRes.value.error && mouRes.value.data?.length
      ? mouRes.value.data
      : (DB.mou_partnerships || []);

    const syllabusSuggestions = sylRes.status === 'fulfilled' && !sylRes.value.error && sylRes.value.data?.length
      ? sylRes.value.data
      : (DB.syllabus_suggestions || []);

    const consultancyGrants = cgRes.status === 'fulfilled' && !cgRes.value.error && cgRes.value.data?.length
      ? cgRes.value.data
      : (DB.consultancy_grants || []);

    const fdpPrograms = fdpRes.status === 'fulfilled' && !fdpRes.value.error && fdpRes.value.data?.length
      ? fdpRes.value.data
      : (DB.fdp_programs || []);

    const sponsoredBootcamps = bootRes.status === 'fulfilled' && !bootRes.value.error && bootRes.value.data?.length
      ? bootRes.value.data
      : (DB.sponsoredBootcamps || []);

    const crossCollegeBenchmarking = ccbRes.status === 'fulfilled' && !ccbRes.value.error && ccbRes.value.data?.length
      ? ccbRes.value.data
      : (DB.crossCollegeBenchmarking || []);

    return res.json({
      success: true,
      mouPartnerships,
      syllabusSuggestions,
      consultancyGrants,
      fdpPrograms,
      tpoMetrics: DB.tpoMetrics || {},
      crossCollegeBenchmarking,
      sponsoredBootcamps,
      studentStats: {
        totalEnrolled: 342,
        avgSkillReadiness: "76.4%",
        placedUnderMoU: 48,
        activeResearchProjects: 14
      }
    });
  } catch (err) {
    console.error('[Academy all-data Error]:', err);
    res.status(500).json({ success: false, message: 'Unable to retrieve academic records.' });
  }
});

// GET /api/academy/cross-college-benchmarking
router.get('/cross-college-benchmarking', async (req, res) => {
  try {
    const { data, error } = await supabase.from('cross_college_benchmarks').select('*').order('rank', { ascending: true });
    if (!error && data?.length) {
      return res.json({ success: true, institutions: data });
    }
  } catch (err) {
    console.warn('[Cross-College] Supabase warning:', err.message);
  }
  res.json({ success: true, institutions: DB.crossCollegeBenchmarking || [] });
});

// POST /api/academy/adopt-syllabus
router.post('/adopt-syllabus', async (req, res) => {
  try {
    const { id } = req.body || {};

    try {
      const { data, error } = await supabase
        .from('syllabus_suggestions')
        .update({ adopted: true, status: 'Ratified by Council' })
        .eq('id', id)
        .select()
        .single();

      if (!error && data) {
        return res.json({
          success: true,
          message: 'Curriculum modernization proposal ratified for Academic Council review.',
          suggestion: data
        });
      }
    } catch (err) {
      console.warn('[Adopt syllabus] Supabase update warning:', err.message);
    }

    const suggestion = (DB.syllabus_suggestions || []).find(s => s.id === id);
    if (suggestion) {
      suggestion.adopted = true;
      return res.json({
        success: true,
        message: 'Curriculum modernization proposal ratified for Academic Council review.',
        suggestion
      });
    }
    res.status(404).json({ success: false, message: 'Curriculum proposal not found.' });
  } catch (err) {
    console.error('[Adopt Syllabus Error]:', err);
    res.status(500).json({ success: false, message: 'Could not process syllabus approval.' });
  }
});

// POST /api/academy/curriculum-audit
router.post('/curriculum-audit', async (req, res) => {
  try {
    const { syllabusText = '', department = 'Dravyaguna / Pharmacology' } = req.body || {};

    if (!syllabusText.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide course syllabus text to perform the curriculum audit.'
      });
    }

    // 1. Live Gemini AI Audit
    const aiAudit = await auditCurriculumWithGemini(syllabusText, department);
    if (aiAudit && aiAudit.criticalGapsIdentified) {
      return res.json({
        success: true,
        provider: 'google-gemini-ai',
        department,
        coverageScore: aiAudit.coverageScore || 72,
        naacCriterionScore: aiAudit.naacCriterionScore || '3.5 / 4.0',
        matchingCompetencies: aiAudit.matchingCompetencies || ['Classical Botanical Authentication', 'Pharmacognosy Basics'],
        criticalGapsIdentified: aiAudit.criticalGapsIdentified,
        accreditationDossierReady: true
      });
    }

    // 2. Analytical Audit Fallback
    const lower = syllabusText.toLowerCase();
    const gaps = [];
    if (!lower.includes('hptlc') && !lower.includes('chromatography')) {
      gaps.push({ unit: 'Analytical Pharmacognosy', gap: 'High-Performance Thin-Layer Chromatography (HPTLC)', impact: 'Required by 82% of pharma quality assurance labs.' });
    }
    if (!lower.includes('autodock') && !lower.includes('docking') && !lower.includes('in-silico')) {
      gaps.push({ unit: 'Formulation & Drug Discovery', gap: 'In-Silico AutoDock Molecular Docking', impact: 'Accelerates bioactive lead optimization.' });
    }
    if (!lower.includes('glp') && !lower.includes('regulatory') && !lower.includes('gcp')) {
      gaps.push({ unit: 'Clinical Standards', gap: 'Good Laboratory Practice (GLP) & Pharmacopeial Compliance', impact: 'Mandated under Ministry of Ayush quality guidelines.' });
    }

    const coverageScore = Math.max(55, Math.min(95, Math.round(50 + (syllabusText.length / 50))));

    return res.json({
      success: true,
      provider: 'analytical-engine',
      department,
      coverageScore,
      naacCriterionScore: `${(coverageScore / 25).toFixed(1)} / 4.0`,
      matchingCompetencies: ['Classical Botany & Nomenclature', 'Basic Herbal Formulation', 'Ayurvedic Toxicology Principles'],
      criticalGapsIdentified: gaps.length ? gaps : [
        { unit: 'Advanced Analytics', gap: 'Automated Monograph Validation', impact: 'Speeds up patent and formulation approval workflows.' }
      ],
      accreditationDossierReady: true
    });
  } catch (err) {
    console.error('[Curriculum Audit Error]:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to complete curriculum audit. Please try again.'
    });
  }
});

module.exports = router;
