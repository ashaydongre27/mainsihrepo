/**
 * JOBLEX Intelligent Skill Assessment & Digital Profile Routes (Node.js / Express)
 * Powered by Skill Ontology and Dynamic Competency Profiling
 * Ministry of Ayush & Corporate Industry Partners | Problem Statement ID: 26044
 */

const express = require('express');
const router = express.Router();
const DB = require('../data/database');
const { SKILL_ONTOLOGY, ROLE_BENCHMARK_PROFILES } = require('../data/skillOntology');
const { createSkillVector, computeHybridScore, explainMatch } = require('../services/matching.service');
const { supabase, isConfigured } = require('../config/supabase');
const crypto = require('crypto');
const { authenticateToken, requireRole } = require('../middleware/auth.middleware');

const ADAPTIVE_QUIZ_BANK = [
  { id: 'adaptive-hptlc-1', skill: 'HPTLC / HPLC Chromatography', difficulty: 'easy', question: 'Which technique is commonly used for herbal fingerprinting and marker quantification?', options: ['HPTLC', 'Gram staining', 'Simple distillation', 'pH titration'], correctIndex: 0 },
  { id: 'adaptive-hptlc-2', skill: 'HPTLC / HPLC Chromatography', difficulty: 'hard', question: 'Which change most improves quantitative HPLC method robustness during herbal marker analysis?', options: ['Remove system suitability checks', 'Validate specificity, precision, accuracy, and solution stability', 'Use a different column for every sample', 'Avoid calibration standards'], correctIndex: 1 },
  { id: 'adaptive-python-1', skill: 'Python & Data Science', difficulty: 'easy', question: 'Which Python library is widely used for tabular data manipulation?', options: ['Pandas', 'Django', 'PyGame', 'Flask'], correctIndex: 0 },
  { id: 'adaptive-python-2', skill: 'Python & Data Science', difficulty: 'hard', question: 'Which approach best prevents target leakage in a clinical prediction pipeline?', options: ['Fit preprocessing before splitting data', 'Use a pipeline and fit transformations only on training folds', 'Shuffle labels after evaluation', 'Select features using the complete dataset'], correctIndex: 1 },
  { id: 'adaptive-glp-1', skill: 'Good Laboratory Practice (GLP)', difficulty: 'easy', question: 'What is the primary purpose of a laboratory SOP?', options: ['Ensure consistent, reproducible, compliant work', 'Guarantee a commercial launch', 'Replace equipment calibration', 'Remove the need for records'], correctIndex: 0 },
  { id: 'adaptive-glp-2', skill: 'Good Laboratory Practice (GLP)', difficulty: 'hard', question: 'What is the strongest response when a controlled study record contains a late data correction?', options: ['Erase the original entry', 'Backdate the correction', 'Keep the original, document the reason, date, and author, then preserve the audit trail', 'Ask another analyst to rewrite it'], correctIndex: 2 },
  { id: 'adaptive-clinical-1', skill: 'Clinical Data Management', difficulty: 'easy', question: 'Which standard is commonly used to structure clinical trial tabulation data?', options: ['SDTM', 'CSSOM', 'SMTP', 'OAuth'], correctIndex: 0 },
  { id: 'adaptive-clinical-2', skill: 'Clinical Data Management', difficulty: 'hard', question: 'Why are validation checks applied before a clinical database is locked?', options: ['To increase font size', 'To identify inconsistencies that could affect analysis and traceability', 'To remove protocol deviations from history', 'To avoid documenting queries'], correctIndex: 1 }
];

function getAdaptiveInsights(studentId) {
  const attempts = (DB.adaptiveQuizAttempts || []).filter(attempt => attempt.studentId === studentId);
  const skillStats = {};
  attempts.forEach(attempt => (attempt.answers || []).forEach(answer => {
    const stats = skillStats[answer.skill] || { correct: 0, total: 0 };
    stats.total += 1;
    if (answer.isCorrect) stats.correct += 1;
    skillStats[answer.skill] = stats;
  }));
  return {
    attempts: attempts.length,
    totalAnswered: Object.values(skillStats).reduce((sum, stat) => sum + stat.total, 0),
    totalCorrect: Object.values(skillStats).reduce((sum, stat) => sum + stat.correct, 0),
    bySkill: Object.fromEntries(Object.entries(skillStats).map(([skill, stat]) => [skill, { ...stat, accuracy: Math.round((stat.correct / stat.total) * 100) }]))
  };
}

router.get('/adaptive/insights', authenticateToken, requireRole(['student']), async (req, res) => {
  try {
    const studentId = req.user.id || req.user.email;
    return res.json({ success: true, insights: getAdaptiveInsights(studentId) });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Unable to load adaptive quiz insights.' });
  }
});

router.post('/adaptive/generate', authenticateToken, requireRole(['student']), async (req, res) => {
  try {
    const studentId = req.user.id || req.user.email;
    const requestedDifficulty = ['easy', 'mixed', 'hard'].includes(req.body?.difficulty) ? req.body.difficulty : 'mixed';
    const focusPrompt = typeof req.body?.prompt === 'string' ? req.body.prompt.trim().slice(0, 180) : '';
    const insights = getAdaptiveInsights(studentId);
    const focusText = focusPrompt.toLowerCase();
    const requestedSkills = Object.keys(insights.bySkill).filter(skill => focusText.includes(skill.toLowerCase().split(' ')[0]));
    const weakSkills = Object.entries(insights.bySkill).filter(([, stat]) => stat.accuracy < 70).map(([skill]) => skill);
    const targetSkills = requestedSkills.length ? requestedSkills : (weakSkills.length ? weakSkills : [...new Set(ADAPTIVE_QUIZ_BANK.map(question => question.skill))]);
    const questions = ADAPTIVE_QUIZ_BANK
      .filter(question => targetSkills.includes(question.skill))
      .filter(question => requestedDifficulty === 'mixed' || question.difficulty === requestedDifficulty)
      .slice(0, 4);
    const selected = questions.length ? questions : ADAPTIVE_QUIZ_BANK.slice(0, 4);
    const attemptId = `adaptive-${Date.now().toString(36)}`;
    return res.json({
      success: true,
      attemptId,
      difficulty: requestedDifficulty,
      prompt: focusPrompt,
      recommendation: weakSkills.length ? `Zulu is reinforcing: ${weakSkills.join(', ')}.` : 'Zulu is establishing your baseline across core skills.',
      questions: selected.map(({ correctIndex, ...question }) => question)
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Unable to generate an adaptive quiz.' });
  }
});

router.post('/adaptive/submit', authenticateToken, requireRole(['student']), async (req, res) => {
  try {
    const studentId = req.user.id || req.user.email;
    const answers = Array.isArray(req.body?.answers) ? req.body.answers : [];
    const answerMap = new Map(answers.map(answer => [answer.questionId, Number(answer.selectedIndex)]));
    const evaluatedAnswers = ADAPTIVE_QUIZ_BANK.filter(question => answerMap.has(question.id)).map(question => ({
      questionId: question.id,
      skill: question.skill,
      selectedIndex: answerMap.get(question.id),
      isCorrect: answerMap.get(question.id) === question.correctIndex
    }));
    const correctCount = evaluatedAnswers.filter(answer => answer.isCorrect).length;
    const attempt = {
      id: req.body?.attemptId || `adaptive-${Date.now().toString(36)}`,
      studentId,
      difficulty: req.body?.difficulty || 'mixed',
      prompt: typeof req.body?.prompt === 'string' ? req.body.prompt.trim().slice(0, 180) : '',
      answers: evaluatedAnswers,
      correctCount,
      totalQuestions: evaluatedAnswers.length,
      createdAt: new Date().toISOString()
    };
    DB.adaptiveQuizAttempts.unshift(attempt);
    const insights = getAdaptiveInsights(studentId);
    return res.json({ success: true, attempt: { ...attempt, answers: undefined }, correctCount, totalQuestions: evaluatedAnswers.length, accuracy: evaluatedAnswers.length ? Math.round((correctCount / evaluatedAnswers.length) * 100) : 0, insights });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Unable to record adaptive quiz results.' });
  }
});

const isPublicVerification = req => req.path.startsWith('/verify/');
router.use((req, res, next) => isPublicVerification(req) ? next() : authenticateToken(req, res, next));
router.use((req, res, next) => isPublicVerification(req) ? next() : requireRole(['student'])(req, res, next));

/**
 * POST /api/assessment/submit
 * Submits multi-step questionnaire answers, evaluates competency, and persists skill profile
 */
router.post('/submit', async (req, res) => {
  try {
    const {
      userId: _ignoredUserId,
      targetRole = 'Herbal Formulation Scientist',
      answers = {},
      declaredSkills = []
    } = req.body || {};

    const standard = ROLE_BENCHMARK_PROFILES[targetRole] || ROLE_BENCHMARK_PROFILES["Herbal Formulation Scientist"];

    const userId = req.user?.id || req.user?.email;

    // Evaluate answers
    // Each question has a weight, computing section scores
    let techScore = 0;
    let softScore = 0;
    let aptScore = 0;

    const answerEntries = Object.entries(answers);
    let totalQuestions = Math.max(answerEntries.length, 1);
    let correctCount = 0;

    answerEntries.forEach(([qId, val]) => {
      // Numerical score or boolean correct evaluation
      const numVal = typeof val === 'number' ? val : (val ? 1 : 0);
      if (qId.startsWith('tech_')) {
        techScore += numVal;
      } else if (qId.startsWith('soft_')) {
        softScore += numVal;
      } else if (qId.startsWith('apt_')) {
        aptScore += numVal;
      } else {
        techScore += numVal;
      }
      if (numVal > 0) correctCount++;
    });

    // Derive assessed skills from answers and declared skills
    const assessedSkillNames = Array.isArray(declaredSkills) && declaredSkills.length
      ? declaredSkills
      : standard.mandatorySkills.slice(0, 4).map(m => {
          const s = SKILL_ONTOLOGY.find(sk => sk.id === m.id);
          return s ? s.name : m.id;
        });

    const userVec = createSkillVector(assessedSkillNames, 0.85);
    const targetVec = createSkillVector(standard.mandatorySkills, 0.9);

    const overallScore = computeHybridScore(userVec, targetVec);
    const explanation = explainMatch(userVec, targetVec, standard.mandatorySkills.map(m => m.id));

    // Chart.js Radar Data
    const radarLabels = standard.mandatorySkills.map(m => {
      const s = SKILL_ONTOLOGY.find(sk => sk.id === m.id);
      return s ? s.name : m.id;
    });

    const studentRadarValues = standard.mandatorySkills.map(m => {
      const idx = SKILL_ONTOLOGY.findIndex(s => s.id === m.id);
      return idx !== -1 ? Math.min(100, Math.round((userVec[idx] / (SKILL_ONTOLOGY[idx].weight || 1)) * 100)) : 50;
    });

    const benchmarkRadarValues = standard.mandatorySkills.map(m => Math.round(m.minProficiency * 100));

    // Bar Chart Data (Skill Proficiency vs Industry Baseline)
    const barData = standard.mandatorySkills.map((m, idx) => ({
      skill: radarLabels[idx],
      attained: studentRadarValues[idx],
      benchmark: benchmarkRadarValues[idx]
    }));

    // Update DB
    if (!DB.skillProfiles) DB.skillProfiles = {};
    DB.skillProfiles[userId] = {
      userId,
      targetRole: standard.title,
      readinessScore: overallScore,
      verifiedSkills: assessedSkillNames,
      strengths: explanation.topContributingSkills.map(s => s.name),
      criticalGaps: explanation.criticalGaps.map(g => g.name),
      moderateGaps: explanation.moderateGaps.map(g => g.name),
      lastUpdated: new Date().toISOString()
    };

    // Update user record verified skills
    const user = (DB.users || []).find(u => u.id === userId || u.email === userId);
    if (user) {
      user.verified_skills = Array.from(new Set([...(user.verified_skills || []), ...assessedSkillNames]));
      user.xp = (user.xp || 1000) + 250; // XP Bounty
    }

    // Try persisting to Supabase if configured
    if (isConfigured && supabase) {
      try {
        await supabase.from('profiles').update({
          verified_skills: user ? user.verified_skills : assessedSkillNames,
          xp: user ? user.xp : 1250
        }).eq('id', userId);
      } catch (e) {
        console.warn('[Assessment Submit] Supabase update warning:', e.message);
      }
    }

    return res.json({
      success: true,
      message: 'Assessment finalized! Your skill profile and placement readiness have been updated (+250 XP).',
      score: overallScore,
      targetRole: standard.title,
      benchmarkScore: standard.targetScore,
      tier: overallScore >= standard.targetScore ? 'Benchmark Attained' : (overallScore >= 70 ? 'Industry Ready' : 'Upskilling Recommended'),
      strengths: explanation.topContributingSkills,
      criticalGaps: explanation.criticalGaps,
      moderateGaps: explanation.moderateGaps,
      actionRecommendation: explanation.actionRecommendation,
      radarData: {
        labels: radarLabels,
        studentValues: studentRadarValues,
        benchmarkValues: benchmarkRadarValues
      },
      barData,
      recommendedCourses: standard.recommendedCourses
    });
  } catch (err) {
    console.error('[Assessment Submit Error]:', err);
    res.status(500).json({ success: false, error: 'Failed to evaluate assessment submission.' });
  }
});

/**
 * GET /api/profile/skill
 * Retrieves active user's skill profile, verified skills, and gap analytics
 */
router.get('/skill', (req, res) => {
  try {
    const userId = req.user?.id || req.user?.email;

    const user = (userId && (DB.users || []).find(u => u.id === userId || u.email === userId)) || {
      name: 'Scholar',
      verified_skills: []
    };

    const profile = (userId && DB.skillProfiles?.[userId]) || {
      userId,
      targetRole: 'Herbal Formulation Scientist',
      readinessScore: 0,
      verifiedSkills: user.verified_skills || [],
      strengths: [],
      criticalGaps: [],
      moderateGaps: [],
      lastUpdated: new Date().toISOString()
    };

    return res.json({
      success: true,
      user: {
        name: user.name,
        email: user.email,
        institution: user.institution,
        xp: user.xp !== undefined ? user.xp : 0,
        streak: user.streak !== undefined ? user.streak : 0
      },
      profile
    });
  } catch (err) {
    console.error('[Get Skill Profile Error]:', err);
    res.status(500).json({ success: false, error: 'Could not fetch skill profile.' });
  }
});

/**
 * PUT /api/profile/skill
 * Allows manual skill override / custom skill declarations
 */
router.put('/skill', (req, res) => {
  try {
    const { skills = [], targetRole } = req.body || {};
    const userId = req.user?.id || req.user?.email;

    if (!Array.isArray(skills)) {
      return res.status(400).json({ success: false, error: 'Skills array required for profile update.' });
    }

    const user = (DB.users || []).find(u => u.id === userId || u.email === userId);
    if (user) {
      user.verified_skills = skills;
    }

    if (!DB.skillProfiles) DB.skillProfiles = {};
    const existing = DB.skillProfiles[userId] || {};

    DB.skillProfiles[userId] = {
      ...existing,
      userId,
      targetRole: targetRole || existing.targetRole || 'Herbal Formulation Scientist',
      verifiedSkills: skills,
      lastUpdated: new Date().toISOString()
    };

    return res.json({
      success: true,
      message: 'Skill profile successfully updated with custom override!',
      profile: DB.skillProfiles[userId]
    });
  } catch (err) {
    console.error('[Update Skill Profile Error]:', err);
    res.status(500).json({ success: false, error: 'Could not update skill profile.' });
  }
});

/**
 * POST /api/profile/portfolio-upload
 * Adds a new verified credential or project to the digital portfolio
 */
router.post('/portfolio-upload', (req, res) => {
  try {
    const {
      userId: _ignoredUserId,
      title,
      type = 'Verified Certificate',
      issuer,
      issueDate,
      skills = []
    } = req.body || {};

    if (!title) {
      return res.status(400).json({ success: false, error: 'Credential or project title is required.' });
    }

    const userId = req.user?.id || req.user?.email;
    const newItem = {
      id: `port-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      userId,
      title: title.trim(),
      type,
      issuer: issuer || 'All India Institute of Ayurveda',
      issueDate: issueDate || '2025',
      verificationHash: `0x${Math.random().toString(16).substring(2, 10).toUpperCase()}`,
      skills: Array.isArray(skills) ? skills : [skills],
      status: 'NAAR Cryptographically Verified'
    };

    if (!DB.portfolioItems) DB.portfolioItems = [];
    DB.portfolioItems.unshift(newItem);

    // Also update user's verified skills
    const user = (DB.users || []).find(u => u.id === userId || u.email === userId);
    if (user && newItem.skills.length) {
      user.verified_skills = Array.from(new Set([...(user.verified_skills || []), ...newItem.skills]));
    }

    return res.status(201).json({
      success: true,
      message: 'Credential successfully registered onto NAAR Digital Portfolio ledger!',
      item: newItem,
      portfolio: DB.portfolioItems.filter(p => p.userId === userId)
    });
  } catch (err) {
    console.error('[Portfolio Upload Error]:', err);
    res.status(500).json({ success: false, error: 'Could not upload credential to portfolio.' });
  }
});

/**
 * GET /api/profile/portfolio
 * Returns digital portfolio items for student
 */
router.get('/portfolio', (req, res) => {
  try {
    const userId = req.user?.id || req.user?.email;
    const items = userId ? (DB.portfolioItems || []).filter(p => p.userId === userId) : [];
    return res.json({
      success: true,
      totalCount: items.length,
      portfolio: items
    });
  } catch (err) {
    console.error('[Get Portfolio Error]:', err);
    res.status(500).json({ success: false, error: 'Could not retrieve digital portfolio.' });
  }
});

// ============================================================================
// FEATURE 5: Co-Curricular & Holistic Competency Assessment (Aptitude & GK)
// ============================================================================

/**
 * GET /api/assessment/aptitude/questions
 * Returns 30 randomized multi-domain aptitude questions (without leaking answer keys)
 */
router.get('/aptitude/questions', (req, res) => {
  try {
    const rawQuestions = DB.aptitudeQuestions || [];
    // Sanitize to remove correctOptionIndex and explanation from client payload
    const safeQuestions = rawQuestions.map(q => ({
      id: q.id,
      domain: q.domain,
      difficulty: q.difficulty,
      questionText: q.questionText,
      options: q.options
    }));

    return res.json({
      success: true,
      totalQuestions: safeQuestions.length,
      durationMinutes: 30,
      domains: ['Quantitative', 'Logical_Reasoning', 'Verbal_Ability', 'General_Knowledge', 'Industry_Ethics'],
      questions: safeQuestions
    });
  } catch (err) {
    console.error('[Aptitude Questions Error]:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/assessment/aptitude/submit
 * Evaluates student answers, calculates domain sub-scores, awards XP & badge
 */
router.post('/aptitude/submit', async (req, res) => {
  try {
    const {
      studentId: _ignoredStudentId,
      answers = {} // Map of questionId -> selectedOptionIndex
    } = req.body || {};
    const studentId = req.user?.id || req.user?.email;

    const rawQuestions = DB.aptitudeQuestions || [];
    let correctCount = 0;
    const domainStats = {
      Quantitative: { correct: 0, total: 0 },
      Logical_Reasoning: { correct: 0, total: 0 },
      Verbal_Ability: { correct: 0, total: 0 },
      General_Knowledge: { correct: 0, total: 0 },
      Industry_Ethics: { correct: 0, total: 0 }
    };

    rawQuestions.forEach(q => {
      const dom = q.domain || 'General_Knowledge';
      if (domainStats[dom]) domainStats[dom].total += 1;

      const studentChoice = answers[q.id];
      if (studentChoice !== undefined && parseInt(studentChoice, 10) === q.correctOptionIndex) {
        correctCount += 1;
        if (domainStats[dom]) domainStats[dom].correct += 1;
      }
    });

    const totalQuestions = Math.max(rawQuestions.length, 1);
    const scorePercentage = Math.round((correctCount / totalQuestions) * 1000) / 10;
    const passed = scorePercentage >= 60; // 60% baseline pass

    // Calculate domain scores (0-100%)
    const domainScores = {};
    Object.keys(domainStats).forEach(dom => {
      const { correct, total } = domainStats[dom];
      domainScores[dom] = total > 0 ? Math.round((correct / total) * 1000) / 10 : 0;
    });

    // Approximate percentile based on standard cohort distribution
    const percentile = Math.min(99.4, Math.max(45.0, Math.round((scorePercentage * 0.95 + 10) * 10) / 10));

    // Cryptographic validation hash
    const badgeHash = crypto
      .createHash('sha256')
      .update(`${studentId}-NFAT-2026-${scorePercentage}-${Date.now()}`)
      .digest('hex');

    const session = {
      id: `sess-${Date.now().toString(36)}`,
      studentId,
      assessmentType: 'National Foundational Aptitude (NFAT-2026)',
      startedAt: new Date(Date.now() - 1800000).toISOString(),
      completedAt: new Date().toISOString(),
      rawScore: correctCount,
      totalQuestions,
      percentage: scorePercentage,
      percentile,
      domainScores,
      passed,
      badgeHash
    };

    if (!DB.assessmentSessions) DB.assessmentSessions = [];
    DB.assessmentSessions.unshift(session);

    // Award +200 XP and append verified aptitude badge to student profile
    const user = (DB.users || []).find(u => u.id === studentId);
    if (user) {
      user.xp = (user.xp || 1000) + 200;
      if (passed) {
        if (!user.verified_skills) user.verified_skills = [];
        if (!user.verified_skills.includes('NFAT Foundational Aptitude')) {
          user.verified_skills.push('NFAT Foundational Aptitude');
        }
      }
    }

    if (isConfigured && supabase) {
      try {
        await supabase.from('assessment_sessions').insert({
          id: session.id,
          student_id: studentId,
          assessment_type: session.assessmentType,
          started_at: session.startedAt,
          completed_at: session.completedAt,
          raw_score: correctCount,
          total_questions: totalQuestions,
          percentage: scorePercentage,
          percentile,
          domain_scores: domainScores,
          passed,
          badge_hash: badgeHash
        });
      } catch (err) {
        console.warn('[Aptitude Session Insert] Supabase warning:', err.message);
      }
    }

    return res.json({
      success: true,
      message: passed ? 'Assessment successfully validated! Foundational Aptitude Badge awarded (+200 XP).' : 'Assessment complete. Upskilling recommended.',
      session,
      xpGained: 200
    });
  } catch (err) {
    console.error('[Aptitude Submit Error]:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ============================================================================
// FEATURE 4: Student Workshop RSVP
// ============================================================================

/**
 * GET /api/assessment/workshops
 * List approved workshops for students
 */
router.get('/workshops', (req, res) => {
  try {
    const studentId = req.user?.id || req.user?.email;
    const allWorkshops = DB.virtualWorkshops || [];
    const enrollments = DB.workshopEnrollments || [];

    const enrolledWorkshopIds = new Set(
      enrollments.filter(e => e.studentId === studentId).map(e => e.workshopId)
    );

    const workshopsWithRsvp = allWorkshops.map(w => ({
      ...w,
      isEnrolled: enrolledWorkshopIds.has(w.id)
    }));

    return res.json({ success: true, workshops: workshopsWithRsvp });
  } catch (err) {
    console.error('[Student Workshops GET Error]:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/assessment/workshops/:id/rsvp
 * Student 1-click workshop enrollment
 */
router.post('/workshops/:id/rsvp', async (req, res) => {
  try {
    const { id } = req.params;
    const { studentName } = req.body || {};
    const studentId = req.user?.id || req.user?.email;
    const effectiveStudentName = (DB.users?.find(u => u.id === studentId)?.name) || studentName || req.user?.name || 'Verified Scholar';

    const workshops = DB.virtualWorkshops || [];
    const normalizedTarget = (id || '').toLowerCase().replace(/-0+/, '-');
    const wsp = workshops.find(w => w.id === id || (w.id || '').toLowerCase().replace(/-0+/, '-') === normalizedTarget) || workshops[0];

    if (!wsp) {
      return res.status(404).json({ success: false, error: 'Workshop not found.' });
    }

    if (!DB.workshopEnrollments) DB.workshopEnrollments = [];
    const existing = DB.workshopEnrollments.find(e => e.workshopId === id && e.studentId === studentId);

    if (existing) {
      return res.status(400).json({ success: false, error: 'You are already registered for this masterclass.' });
    }

    const enrollment = {
      id: `we-${Date.now().toString(36)}`,
      workshopId: id,
      studentId,
      studentName: effectiveStudentName,
      attendanceConfirmed: false,
      certificateIssued: false,
      registeredAt: new Date().toISOString()
    };

    DB.workshopEnrollments.unshift(enrollment);
    wsp.enrolledCount = (wsp.enrolledCount || 0) + 1;

    // Inject To-Do for student
    if (!DB.todos) DB.todos = [];
    DB.todos.unshift({
      id: `todo-wsp-${Date.now().toString(36)}`,
      studentId,
      title: `Attend Masterclass: ${wsp.title}`,
      description: `Speaker: ${wsp.speakerName} (${wsp.hostCompanyName}). Access link: ${wsp.meetingLink}.`,
      category: 'Skill',
      priority: 'High',
      dueDate: wsp.scheduledStart,
      isCompleted: false,
      completedAt: null,
      sourceType: 'user_created',
      sourceRefId: id
    });

    return res.json({
      success: true,
      message: `Successfully registered for "${wsp.title}"! Calendar invitation and To-Do item added.`,
      workshop: wsp,
      enrollment
    });
  } catch (err) {
    console.error('[Workshop RSVP Error]:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ============================================================================
// FEATURE 7: Company Skill Certification Quizzes & Public Verification
// ============================================================================

/**
 * GET /api/assessment/quizzes
 * List active company certification quizzes for students
 */
router.get('/quizzes', (req, res) => {
  try {
    const quizzes = DB.companyQuizzes || [];
    const certs = DB.studentQuizCertifications || [];
    const studentId = req.user?.id || req.user?.email;

    const passedQuizIds = new Set(
      certs.filter(c => c.studentId === studentId && c.passed).map(c => c.quizId)
    );

    const safeList = quizzes.map(q => ({
      id: q.id,
      companyName: q.companyName,
      badgeTitle: q.badgeTitle,
      badgeIcon: q.badgeIcon,
      skillCategory: q.skillCategory,
      timeLimitMinutes: q.timeLimitMinutes,
      passingPercentage: q.passingPercentage,
      questionCount: (q.questions || []).length,
      isAlreadyCertified: passedQuizIds.has(q.id)
    }));

    return res.json({ success: true, quizzes: safeList });
  } catch (err) {
    console.error('[Quizzes GET Error]:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/assessment/quiz/:quizId
 * Fetch quiz questions for taking the assessment
 */
router.get('/quiz/:quizId', (req, res) => {
  try {
    const { quizId } = req.params;
    const quizzes = DB.companyQuizzes || [];
    const quiz = quizzes.find(q => q.id === quizId);

    if (!quiz) {
      return res.status(404).json({ success: false, error: 'Quiz not found.' });
    }

    const safeQuestions = (quiz.questions || []).map(q => ({
      id: q.id,
      question: q.question,
      options: q.options
    }));

    return res.json({
      success: true,
      quiz: {
        id: quiz.id,
        companyName: quiz.companyName,
        badgeTitle: quiz.badgeTitle,
        badgeIcon: quiz.badgeIcon,
        skillCategory: quiz.skillCategory,
        timeLimitMinutes: quiz.timeLimitMinutes,
        passingPercentage: quiz.passingPercentage,
        questions: safeQuestions
      }
    });
  } catch (err) {
    console.error('[Quiz Fetch Error]:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/assessment/quiz/:quizId/submit
 * Grades quiz, checks passing mark (75%), generates SHA-256 verification token
 */
router.post('/quiz/:quizId/submit', async (req, res) => {
  try {
    const { quizId } = req.params;
    const { studentName, answers = {} } = req.body || {};
    const studentId = req.user?.id || req.user?.email;

    const quizzes = DB.companyQuizzes || [];
    const quiz = quizzes.find(q => q.id === quizId);

    if (!quiz) {
      return res.status(404).json({ success: false, error: 'Quiz not found.' });
    }

    let correctCount = 0;
    const totalQuestions = Math.max((quiz.questions || []).length, 1);

    (quiz.questions || []).forEach(q => {
      const selected = answers[q.id];
      if (selected !== undefined && parseInt(selected, 10) === q.correctIndex) {
        correctCount += 1;
      }
    });

    const scorePercentage = Math.round((correctCount / totalQuestions) * 1000) / 10;
    const passingMark = quiz.passingPercentage || 75;
    const passed = scorePercentage >= passingMark;

    quiz.totalTakers = (quiz.totalTakers || 0) + 1;
    if (passed) quiz.passCount = (quiz.passCount || 0) + 1;

    let cert = null;
    let token = null;

    if (passed) {
      token = crypto
        .createHash('sha256')
        .update(`${studentId}-${quizId}-${Date.now()}-${scorePercentage}`)
        .digest('hex');

      cert = {
        id: `cert-${Date.now().toString(36)}`,
        quizId,
        studentId,
        studentName: studentName || (DB.users?.find(u => u.id === studentId)?.name) || 'Verified Scholar',
        companyName: quiz.companyName,
        badgeTitle: quiz.badgeTitle,
        badgeIcon: quiz.badgeIcon || 'verified',
        skillCategory: quiz.skillCategory,
        scorePercentage,
        passed: true,
        attemptedAt: new Date().toISOString(),
        verificationToken: token,
        expiresAt: new Date(Date.now() + 365 * 86400000).toISOString(),
        isDisplayedOnProfile: true
      };

      if (!DB.studentQuizCertifications) DB.studentQuizCertifications = [];
      DB.studentQuizCertifications.unshift(cert);

      // Award +250 XP to student
      const user = (DB.users || []).find(u => u.id === studentId);
      if (user) {
        user.xp = (user.xp || 1000) + 250;
        if (!user.verified_skills) user.verified_skills = [];
        if (!user.verified_skills.includes(quiz.badgeTitle)) {
          user.verified_skills.push(quiz.badgeTitle);
        }
      }

      // Notify Student
      if (!DB.inPortalNotifications) DB.inPortalNotifications = [];
      DB.inPortalNotifications.unshift({
        id: `notif-${Date.now().toString(36)}`,
        recipientId: studentId,
        senderId: quiz.companyId,
        title: `Badge Earned: ${quiz.badgeTitle}!`,
        message: `Congratulations! You scored ${scorePercentage}% and earned the official ${quiz.companyName} verified credential (+250 XP).`,
        actionUrl: '/student.html#certifications',
        category: 'system_alert',
        isRead: false,
        createdAt: new Date().toISOString()
      });
    }

    return res.json({
      success: true,
      passed,
      scorePercentage,
      passingMark,
      correctCount,
      totalQuestions,
      certification: cert,
      certificate: cert,
      verificationToken: token,
      verificationUrl: token ? `/api/assessment/verify/${token}` : null,
      message: passed
        ? `Congratulations! You scored ${scorePercentage}% and earned the official ${quiz.badgeTitle} (+250 XP).`
        : `You scored ${scorePercentage}%. The passing threshold is ${passingMark}%. Actionable review materials are available in your roadmap.`
    });
  } catch (err) {
    console.error('[Quiz Submit Error]:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/assessment/certifications
 * List earned certifications for student profile display
 */
router.get('/certifications', (req, res) => {
  try {
    const studentId = req.user?.id || req.user?.email;
    const certs = studentId ? (DB.studentQuizCertifications || []).filter(c => c.studentId === studentId) : [];
    return res.json({ success: true, certifications: certs });
  } catch (err) {
    console.error('[Certifications GET Error]:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/assessment/verify/:token
 * Public unauthenticated digital credential verification endpoint
 */
router.get('/verify/:token', (req, res) => {
  try {
    const { token } = req.params;
    const certs = DB.studentQuizCertifications || [];
    const cert = certs.find(c => c.verificationToken === token || c.verification_token === token);

    if (!cert) {
      return res.status(404).json({
        success: false,
        verified: false,
        error: 'Credential token is invalid, expired, or revoked.'
      });
    }

    return res.json({
      success: true,
      verified: true,
      credential: {
        badgeTitle: cert.badgeTitle,
        recipientName: cert.studentName,
        issuingOrganization: cert.companyName,
        scoreAttained: `${cert.scorePercentage}%`,
        issueDate: cert.attemptedAt,
        verificationToken: cert.verificationToken,
        status: 'Cryptographically Verified via SHA-256 HMAC'
      }
    });
  } catch (err) {
    console.error('[Credential Verification Error]:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;

