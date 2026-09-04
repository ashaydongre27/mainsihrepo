/**
 * JOBLEX AI Resume Analyzer & Competency Gap Discovery Routes (Node.js / Express)
 * Powered by Google Gemini AI with intelligent NLP fallback
 * Ministry of Ayush / All India Institute of Ayurveda | Problem Statement ID: 26044
 */

const express = require('express');
const router = express.Router();
const { generateWithFailover, isGoogleApiConfigured } = require('../services/ai.service');

const ROLE_BENCHMARKS = {
  "Herbal Formulation Scientist": {
    benchmark: 85,
    requiredSkills: [
      "Herbal Formulation",
      "Ayurvedic Pharmacognosy",
      "Good Laboratory Practice (GLP)",
      "HPTLC / HPLC Fingerprinting",
      "Formulation Stability Protocols",
      "Phytochemical Extraction",
      "Spectroscopy & Quality Assurance"
    ],
    standardRecommendations: [
      "Complete advanced HPTLC fingerprinting certification through Dabur research lab modules.",
      "Complete the Formulation Stability Testing module on your Career Roadmap (+100 XP).",
      "Participate in standardized botanical extraction micro-gigs to reach the 85% industry benchmark."
    ]
  },
  "Quality Control & Regulatory Affairs Analyst": {
    benchmark: 88,
    requiredSkills: [
      "Good Laboratory Practice (GLP)",
      "Phytochemistry",
      "Quality Control",
      "Regulatory Dossier Preparation",
      "HPLC Fingerprinting",
      "Pharmacopeial Monograph Standards",
      "Raw Herb Authentication"
    ],
    standardRecommendations: [
      "Attain NMPB-accredited GLP compliance certification.",
      "Review Ministry of Ayush Pharmacopeia monograph submission guidelines.",
      "Engage in batch-to-batch consistency testing on classical formulations."
    ]
  },
  "Ayush Health-Tech & NLP Informatics Specialist": {
    benchmark: 82,
    requiredSkills: [
      "Python",
      "Machine Learning",
      "NLP for Classical Texts",
      "Health Informatics",
      "Data Analysis",
      "Classical Sanskrit Lexicon Processing",
      "In-Silico Molecular Docking"
    ],
    standardRecommendations: [
      "Contribute to Charaka Samhita Sanskrit text-mining model repositories.",
      "Develop clinical data tagging pipelines for Ayurvedic Prakriti assessment.",
      "Submit a research prototype to the Ayush AI Innovation Challenge."
    ]
  }
};

/**
 * Perform AI Resume Analysis using LangGraph Failover Orchestrator
 */
async function analyzeWithGemini(resumeText, targetRole, standard) {
  if (!isGoogleApiConfigured()) {
    return null;
  }

  const prompt = `You are the lead Technical Recruiter and AI Competency Evaluator for the Ministry of Ayush and major corporate pharmaceutical partners (Dabur, Himalaya Wellness, Patanjali).

Analyze this student resume for the role: "${targetRole}".
Required industry competency baseline: ${JSON.stringify(standard.requiredSkills)}
Corporate hiring benchmark score: ${standard.benchmark}%

Resume text:
"""
${resumeText}
"""

Evaluate the candidate and return ONLY valid JSON matching this exact schema:
{
  "matchPercentage": number (0-100 based on rigorous comparison to required skills),
  "extractedSkills": string[] (competencies and skills found in the resume),
  "missingSkills": string[] (required baseline skills absent from the resume),
  "softSkillsMatched": string[] (e.g. Research Documentation, Protocol Compliance, Teamwork),
  "recommendations": string[] (3-4 highly specific, actionable steps the student should take to reach the benchmark)
}`;

  try {
    const result = await generateWithFailover({
      prompt,
      systemInstruction: 'You are an AI competency and resume evaluation assistant for the Ministry of Ayush. Always return raw, valid JSON.',
      temperature: 0.2,
      jsonMode: true
    });

    if (result && result.text) {
      const cleanJson = result.text.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
      return JSON.parse(cleanJson);
    }
  } catch (err) {
    console.error('[Resume Analyzer LangGraph Error]:', err.message);
  }
  return null;
}

/**
 * Analytical NLP fallback when Gemini API key is pending
 */
function analyzeWithHeuristics(resumeText, targetRole, standard) {
  const textLower = resumeText.toLowerCase();
  const extractedSkills = [];
  const missingSkills = [];

  standard.requiredSkills.forEach(skill => {
    const skillTerms = skill.toLowerCase().split(/[\s/]+/);
    const isMatched = skillTerms.some(term => term.length > 2 && textLower.includes(term));
    if (isMatched) {
      extractedSkills.push(skill);
    } else {
      missingSkills.push(skill);
    }
  });

  const total = standard.requiredSkills.length;
  const matchPercentage = Math.min(100, Math.round((extractedSkills.length / (total || 1)) * 100));

  return {
    matchPercentage: Math.max(matchPercentage, 45),
    extractedSkills,
    missingSkills,
    softSkillsMatched: ["Scientific Documentation", "Research Ethics", "Technical Communication"],
    recommendations: standard.standardRecommendations
  };
}

// POST /api/resume/analyze
router.post('/analyze', async (req, res) => {
  try {
    const { resumeText = '', targetRole = 'Herbal Formulation Scientist' } = req.body || {};

    if (!resumeText.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide resume text to evaluate.'
      });
    }

    const standard = ROLE_BENCHMARKS[targetRole] || ROLE_BENCHMARKS["Herbal Formulation Scientist"];

    // 1. Try Gemini AI Evaluation
    const aiAnalysis = await analyzeWithGemini(resumeText, targetRole, standard);
    if (aiAnalysis && aiAnalysis.extractedSkills) {
      return res.json({
        success: true,
        provider: 'google-gemini-ai',
        targetRole,
        matchPercentage: aiAnalysis.matchPercentage,
        benchmark: standard.benchmark,
        extractedSkills: aiAnalysis.extractedSkills,
        missingSkills: aiAnalysis.missingSkills,
        softSkillsMatched: aiAnalysis.softSkillsMatched || ["Scientific Documentation", "Research Ethics"],
        recommendations: aiAnalysis.recommendations
      });
    }

    // 2. High-Grade Heuristic Evaluation
    const fallback = analyzeWithHeuristics(resumeText, targetRole, standard);
    return res.json({
      success: true,
      provider: 'analytical-engine',
      targetRole,
      matchPercentage: fallback.matchPercentage,
      benchmark: standard.benchmark,
      extractedSkills: fallback.extractedSkills,
      missingSkills: fallback.missingSkills,
      softSkillsMatched: fallback.softSkillsMatched,
      recommendations: fallback.recommendations
    });
  } catch (err) {
    console.error('[Resume Route Error]:', err);
    return res.status(500).json({
      success: false,
      message: 'Unable to analyze resume at this moment. Please try again shortly.'
    });
  }
});

module.exports = router;
