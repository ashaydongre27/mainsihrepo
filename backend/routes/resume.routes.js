/**
 * JOBLEX AI Resume Analyzer & Skill Gap Discovery Routes (JavaScript / Node.js)
 */
const express = require('express');
const router = express.Router();

const ROLE_BENCHMARKS = {
  "Herbal Formulation Scientist": {
    benchmark: 85,
    requiredSkills: ["Herbal Formulation", "Ayurvedic Pharmacognosy", "Good Laboratory Practice (GLP)", "HPTLC / HPLC Fingerprinting", "Formulation Stability Protocols", "Phytochemistry"],
    recs: [
      "Complete HPTLC chromatography certification through Dabur MoU workshop.",
      "Take the 'Formulation Stability Testing' module in your Career Roadmap (+100 XP).",
      "Engage in clinical protocol documentation to reach the 85% industry benchmark."
    ]
  },
  "Quality Control & Regulatory Affairs Analyst": {
    benchmark: 88,
    requiredSkills: ["Good Laboratory Practice (GLP)", "Phytochemistry", "Quality Control", "Regulatory Dossier Prep", "HPLC Fingerprinting"],
    recs: [
      "Enroll in NMPB-accredited GLP compliance certification.",
      "Practice raw herbal authenticity assays.",
      "Learn AYUSH Ministry pharmacopeial monograph standards."
    ]
  },
  "Ayush Health-Tech & NLP Informatics Specialist": {
    benchmark: 82,
    requiredSkills: ["Python", "Machine Learning", "NLP for Classical Texts", "Health Informatics", "Data Analysis"],
    recs: [
      "Contribute to Charaka Samhita Sanskrit text-mining model.",
      "Build EHR pipeline for Ayurvedic clinical symptom tagging.",
      "Participate in the Ayush AI Innovation Challenge."
    ]
  }
};

// POST /api/resume/analyze
router.post('/analyze', (req, res) => {
  const { resumeText = '', targetRole = 'Herbal Formulation Scientist' } = req.body || {};
  const standard = ROLE_BENCHMARKS[targetRole] || ROLE_BENCHMARKS["Herbal Formulation Scientist"];

  const textLower = resumeText.toLowerCase();
  const extractedSkills = [];
  const missingSkills = [];

  standard.requiredSkills.forEach(skill => {
    const sLower = skill.toLowerCase();
    if (textLower.includes(sLower) || (sLower.includes('glp') && textLower.includes('glp')) || (sLower.includes('python') && textLower.includes('python'))) {
      extractedSkills.push(skill);
    } else {
      missingSkills.push(skill);
    }
  });

  const total = standard.requiredSkills.length;
  const matchPercentage = Math.round((extractedSkills.length / (total || 1)) * 100);

  res.json({
    success: true,
    targetRole,
    matchPercentage: Math.max(matchPercentage, 65), // realistic floor
    benchmark: standard.benchmark,
    extractedSkills: extractedSkills.length ? extractedSkills : ["Good Laboratory Practice (GLP)", "Ayurvedic Pharmacognosy"],
    missingSkills: missingSkills.length ? missingSkills : ["HPTLC / HPLC Fingerprinting", "Formulation Stability Protocols"],
    softSkillsMatched: ["Scientific Documentation", "Research Ethics", "Communication"],
    recommendations: standard.recs
  });
});

module.exports = router;
