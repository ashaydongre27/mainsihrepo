/**
 * JOBLEX Academy & Curriculum Modernization Routes (JavaScript / Node.js)
 */
const express = require('express');
const router = express.Router();
const DB = require('../data/database');

// GET /api/academy/all-data
router.get('/all-data', (req, res) => {
  res.json({
    syllabusSuggestions: DB.syllabus_suggestions,
    tpoMetrics: DB.tpoMetrics,
    studentStats: {
      totalEnrolled: 342,
      avgSkillReadiness: "74.0%",
      placedUnderMoU: 52
    }
  });
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

module.exports = router;
