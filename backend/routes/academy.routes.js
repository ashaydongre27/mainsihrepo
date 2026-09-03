/**
 * JOBLEX Academy & Curriculum Modernization Routes (JavaScript / Node.js)
 * Enhanced with SIH 26044 features:
 * 9. Automated Curriculum Gap Audit (NEP-2020 / NAAC)
 * 10. Placement Cell Command Center
 * 11. Cross-College Benchmarking
 */
const express = require('express');
const router = express.Router();
const DB = require('../data/database');

// GET /api/academy/all-data
router.get('/all-data', (req, res) => {
  res.json({
    syllabusSuggestions: DB.syllabus_suggestions,
    tpoMetrics: DB.tpoMetrics,
    crossCollegeBenchmarking: DB.crossCollegeBenchmarking,
    sponsoredBootcamps: DB.sponsoredBootcamps,
    studentStats: {
      totalEnrolled: 342,
      avgSkillReadiness: "74.0%",
      placedUnderMoU: 52
    }
  });
});

// GET /api/academy/cross-college-benchmarking (Idea #11)
router.get('/cross-college-benchmarking', (req, res) => {
  res.json({ institutions: DB.crossCollegeBenchmarking });
});

// POST /api/academy/adopt-syllabus
router.post('/adopt-syllabus', (req, res) => {
  const { id } = req.body || {};
  const suggestion = DB.syllabus_suggestions.find(s => s.id === id);
  if (suggestion) {
    suggestion.adopted = true;
    return res.json({ success: true, message: 'Syllabus add-on approved for Academic Council.', suggestion });
  }
  res.status(404).json({ success: false, error: 'Syllabus proposal not found.' });
});

// POST /api/academy/curriculum-audit (Idea #9)
router.post('/curriculum-audit', (req, res) => {
  const { syllabusText = '', department = 'Dravyaguna / Pharmacology' } = req.body || {};
  res.json({
    success: true,
    department,
    coverageScore: 68,
    naacCriterionScore: '3.4 / 4.0',
    matchingCompetencies: ['Classical Botany', 'Herbal Formulation Basics', 'Ayurvedic Toxicology'],
    criticalGapsIdentified: [
      { unit: 'Unit 3 (Pharmacognosy)', gap: 'High-Performance Thin-Layer Chromatography (HPTLC)', impact: 'Crucial for 82% of pharma recruitments' },
      { unit: 'Unit 5 (Formulation)', gap: 'In-Silico AutoDock Molecular Docking', impact: 'Accelerates bio-availability screening' },
      { unit: 'Unit 6 (Regulatory)', gap: 'Digital Health Records & GCP Compliance', impact: 'Mandatory under NEP-2020 digitization criteria' }
    ],
    accreditationDossierReady: true
  });
});

module.exports = router;
