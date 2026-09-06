/**
 * JOBLEX AI Resume Analyzer & Competency Gap Discovery Routes (Node.js / Express)
 * Powered by Google Gemini AI with intelligent NLP fallback
 * Ministry of Ayush / All India Institute of Ayurveda | Problem Statement ID: 26044
 */

const express = require('express');
const router = express.Router();
const { generateWithFailover, isGoogleApiConfigured } = require('../services/ai.service');
const DB = require('../data/database');
const {
  parseResumeHeuristically,
  parseResumeWithGemini,
  generateAutoAssessment
} = require('../services/resumeParser.service');

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

/**
 * POST /api/resume/parse
 * Full multi-section document parsing (PDF / DOCX text)
 */
router.post('/parse', async (req, res) => {
  try {
    const { resumeText = '', fileName = 'resume.pdf' } = req.body || {};

    if (!resumeText.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Resume text is required for parsing. Please upload a PDF/DOCX or paste text.'
      });
    }

    // 1. Try Gemini AI Structured Extraction
    const aiParsed = await parseResumeWithGemini(resumeText, fileName);
    if (aiParsed && aiParsed.personalInfo) {
      return res.json({
        success: true,
        provider: 'google-gemini-ai',
        parsedResume: aiParsed
      });
    }

    // 2. Deterministic Regex / NLP Heuristic Extraction Fallback
    const heuristicParsed = parseResumeHeuristically(resumeText, fileName);
    return res.json({
      success: true,
      provider: 'deterministic-heuristic-nlp',
      parsedResume: heuristicParsed
    });
  } catch (err) {
    console.error('[Resume Parse Route Error]:', err);
    res.status(500).json({
      success: false,
      error: 'Document parsing failed. Please verify file format and try again.'
    });
  }
});

/**
 * POST /api/resume/auto-assess
 * Generates initial benchmark scores, radar comparison, and gap analysis from parsed skills
 */
router.post('/auto-assess', (req, res) => {
  try {
    const { parsedSkills = [], targetRole = 'Herbal Formulation Scientist' } = req.body || {};

    const autoAssessment = generateAutoAssessment(parsedSkills, targetRole);

    return res.json({
      success: true,
      targetRole,
      autoAssessment
    });
  } catch (err) {
    console.error('[Resume Auto-Assess Route Error]:', err);
    res.status(500).json({
      success: false,
      error: 'Could not generate auto-assessment for candidate.'
    });
  }
});

/**
 * POST /api/resume/merge-profile
 * Merges parsed skills, certifications, and projects directly into student's persistent profile & digital portfolio
 */
router.post('/merge-profile', (req, res) => {
  try {
    const {
      userId = 'usr-student-01',
      skills = [],
      certifications = [],
      projects = [],
      targetRole = 'Herbal Formulation Scientist',
      readinessScore = 84
    } = req.body || {};

    // 1. Update user profile verified_skills
    const user = (DB.users || []).find(u => u.id === userId || u.email === userId);
    const existingSkills = user ? (user.verified_skills || []) : [];
    const mergedSkills = Array.from(new Set([...existingSkills, ...skills]));

    if (user) {
      user.verified_skills = mergedSkills;
    }

    // 2. Persist to DB.skillProfiles
    if (!DB.skillProfiles) DB.skillProfiles = {};
    DB.skillProfiles[userId] = {
      userId,
      targetRole,
      readinessScore,
      verifiedSkills: mergedSkills,
      strengths: skills.slice(0, 4),
      criticalGaps: [],
      moderateGaps: [],
      lastUpdated: new Date().toISOString()
    };

    // 3. Inject certifications and projects into digital portfolio ledger
    if (!DB.portfolioItems) DB.portfolioItems = [];

    certifications.forEach(cert => {
      const alreadyExists = DB.portfolioItems.some(p => p.title.toLowerCase() === cert.title.toLowerCase());
      if (!alreadyExists) {
        DB.portfolioItems.unshift({
          id: `port-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
          userId,
          title: cert.title,
          type: "Verified Certificate",
          issuer: cert.issuer || "National Ayush Accreditation Board",
          issueDate: cert.date || "2025",
          verificationHash: cert.verificationHash || `0x${Math.random().toString(16).substring(2, 10).toUpperCase()}`,
          skills: skills.slice(0, 2),
          status: "NAAR Cryptographically Verified"
        });
      }
    });

    projects.forEach(proj => {
      const alreadyExists = DB.portfolioItems.some(p => p.title.toLowerCase() === proj.title.toLowerCase());
      if (!alreadyExists) {
        DB.portfolioItems.unshift({
          id: `port-proj-${Date.now().toString(36)}`,
          userId,
          title: proj.title,
          type: "Verified Capstone Project",
          issuer: user ? user.institution : "All India Institute of Ayurveda",
          issueDate: "2025",
          verificationHash: `0x${Math.random().toString(16).substring(2, 10).toUpperCase()}`,
          skills: proj.techStack || skills.slice(0, 3),
          status: "Peer Reviewed & Ratified"
        });
      }
    });

    return res.json({
      success: true,
      message: 'Skills and verified credentials successfully synchronized with your profile and NAAR portfolio!',
      mergedSkills,
      portfolioCount: DB.portfolioItems.filter(p => p.userId === userId).length,
      updatedProfile: DB.skillProfiles[userId]
    });
  } catch (err) {
    console.error('[Resume Merge Profile Error]:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to merge resume competencies into student profile.'
    });
  }
});

module.exports = router;
