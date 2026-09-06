/**
 * JOBLEX Multi-Role Recommendation & Matching Routes (Node.js / Express)
 * Powered by Hybrid Cosine-Jaccard Skill Vector Similarity
 * Ministry of Ayush & Corporate Industry Partners | Problem Statement ID: 26044
 */

const express = require('express');
const router = express.Router();
const DB = require('../data/database');
const {
  recommendOpportunitiesForStudent,
  recommendCandidatesForOpportunity,
  recommendOpportunitiesForAcademician,
  computeInstitutionSkillGaps,
  ROLE_BENCHMARK_PROFILES
} = require('../services/matching.service');
const { supabase, isConfigured } = require('../config/supabase');

/**
 * GET /api/recommendations/student
 * Returns ranked opportunities with explainable breakdown for a student
 */
router.get('/student', async (req, res) => {
  try {
    const {
      type = 'All',
      minMatch = 0,
      search = '',
      refresh = 'false',
      userId = 'usr-student-01',
      targetRole = 'Herbal Formulation Scientist'
    } = req.query;

    const bypassCache = refresh === 'true' || refresh === true;

    // Fetch user profile from DB or Supabase
    let studentProfile = (DB.users || []).find(u => u.id === userId || u.email === userId);
    if (!studentProfile) {
      studentProfile = {
        id: userId,
        name: 'Scholar',
        verified_skills: [],
        targetRole
      };
    }

    // Merge in any saved skill profile data
    const savedSkillProfile = DB.skillProfiles?.[userId];
    if (savedSkillProfile && savedSkillProfile.verifiedSkills) {
      studentProfile = {
        ...studentProfile,
        verified_skills: Array.from(new Set([...(studentProfile.verified_skills || []), ...savedSkillProfile.verifiedSkills])),
        targetRole: savedSkillProfile.targetRole || studentProfile.targetRole
      };
    }

    // Retrieve opportunities
    let allOpps = DB.opportunities || [];
    if (isConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('opportunities').select('*');
        if (!error && data && data.length) {
          allOpps = data;
        }
      } catch (e) {
        console.warn('[Recs Student] Supabase fetch fallback:', e.message);
      }
    }

    const recommended = recommendOpportunitiesForStudent(studentProfile, allOpps, {
      type,
      minMatch: parseInt(minMatch, 10) || 0,
      search,
      bypassCache,
      userId: studentProfile.id || userId
    });

    // Curated learning pathways based on target role
    const roleConfig = ROLE_BENCHMARK_PROFILES[targetRole] || ROLE_BENCHMARK_PROFILES["Herbal Formulation Scientist"];
    const recommendedCourses = roleConfig ? roleConfig.recommendedCourses : [];

    const wishlist = DB.wishlists?.[studentProfile.id] || [];

    return res.json({
      success: true,
      totalCount: recommended.length,
      targetRole: studentProfile.targetRole || targetRole,
      recommendations: recommended.map(opp => ({
        ...opp,
        isWishlisted: wishlist.includes(opp.id)
      })),
      recommendedCourses,
      wishlistCount: wishlist.length,
      cached: !bypassCache
    });
  } catch (err) {
    console.error('[Recommendations Student Error]:', err);
    res.status(500).json({ success: false, error: 'Failed to compute student recommendations.' });
  }
});

/**
 * GET /api/recommendations/industry
 * Recommends and ranks candidate scholars for an opportunity or job requisition
 */
router.get('/industry', async (req, res) => {
  try {
    const { opportunityId, roleTitle } = req.query;

    let targetOpp = null;
    if (opportunityId) {
      targetOpp = (DB.opportunities || []).find(o => o.id === opportunityId);
    }

    if (!targetOpp) {
      targetOpp = {
        id: 'opp-dynamic',
        title: roleTitle || 'Herbal Formulation Scientist',
        skills: ['Herbal Formulation', 'Ayurvedic Pharmacognosy', 'HPTLC Fingerprinting', 'Good Laboratory Practice (GLP)', 'Python']
      };
    }

    const candidates = DB.candidates || [];
    const rankedCandidates = recommendCandidatesForOpportunity(targetOpp, candidates);

    return res.json({
      success: true,
      opportunityId: targetOpp.id,
      opportunityTitle: targetOpp.title,
      requiredSkills: targetOpp.skills || [],
      totalCandidates: rankedCandidates.length,
      candidates: rankedCandidates
    });
  } catch (err) {
    console.error('[Recommendations Industry Error]:', err);
    res.status(500).json({ success: false, error: 'Failed to rank candidates for opportunity.' });
  }
});

/**
 * GET /api/recommendations/academician
 * Recommends FDPs, research grants, and student mentees for faculty
 */
router.get('/academician', async (req, res) => {
  try {
    const { facultyId = 'usr-academy-01' } = req.query;

    const faculty = (DB.users || []).find(u => u.id === facultyId || u.role === 'academy') || {
      name: 'Dr. Rajesh Sharma',
      expertise: ['Ayurvedic Pharmacognosy', 'Herbal Formulation', 'HPTLC Fingerprinting', 'GLP Compliance'],
      department: 'Dravyaguna & Ayurvedic Pharmacology'
    };

    const facultyOpps = DB.facultyOpportunities || [];
    const scoredOpps = recommendOpportunitiesForAcademician(faculty, facultyOpps);

    // Recommend top students for faculty research mentorship
    const students = (DB.candidates || []).map(cand => {
      const skills = cand.skills || cand.verified_skills || [];
      const overlap = skills.filter(s => 
        (faculty.expertise || []).some(exp => exp.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(exp.toLowerCase()))
      );
      const compatibility = Math.min(98, 70 + (overlap.length * 9));
      return {
        ...cand,
        compatibilityScore: compatibility,
        matchingAreas: overlap,
        recommendedFor: overlap.includes('HPTLC Fingerprinting') ? 'Lab Research Assistant' : 'Syllabus Micro-Sprint Scholar'
      };
    }).sort((a, b) => b.compatibilityScore - a.compatibilityScore);

    return res.json({
      success: true,
      facultyName: faculty.name,
      department: faculty.department,
      opportunities: scoredOpps,
      mentorshipScholars: students.slice(0, 5)
    });
  } catch (err) {
    console.error('[Recommendations Academician Error]:', err);
    res.status(500).json({ success: false, error: 'Failed to compute academician recommendations.' });
  }
});

/**
 * GET /api/recommendations/institution
 * Analyzes systemic student skill gaps and recommends bilateral collaborations
 */
router.get('/institution', async (req, res) => {
  try {
    const { targetRole = 'Herbal Formulation Scientist' } = req.query;
    const students = DB.candidates || [];

    const gapsDiagnostic = computeInstitutionSkillGaps(students, targetRole);

    // Recommended industry collaborations matching critical gaps
    const suggestedMoUs = [
      {
        partner: 'Dabur Research & Development Ltd.',
        synergyFocus: 'HPTLC & Spectrophotometry Automation Lab',
        readinessMatch: 92,
        potentialInternshipSeats: 25,
        targetGapAddressed: 'HPTLC Fingerprinting & Stability Protocols'
      },
      {
        partner: 'Himalaya Wellness Company Data Cell',
        synergyFocus: 'Computational In-Silico Molecular Docking Center of Excellence',
        readinessMatch: 88,
        potentialInternshipSeats: 18,
        targetGapAddressed: 'In-Silico Molecular Docking & Python Analytics'
      }
    ];

    return res.json({
      success: true,
      institution: 'All India Institute of Ayurveda (AIIA), New Delhi',
      gapsDiagnostic,
      suggestedMoUs
    });
  } catch (err) {
    console.error('[Recommendations Institution Error]:', err);
    res.status(500).json({ success: false, error: 'Failed to compute institutional recommendations.' });
  }
});

/**
 * POST /api/recommendations/wishlist
 * Toggle wishlist bookmark on an opportunity
 */
router.post('/wishlist', (req, res) => {
  try {
    const { userId = 'usr-student-01', opportunityId } = req.body || {};

    if (!opportunityId) {
      return res.status(400).json({ success: false, error: 'Opportunity ID is required to update wishlist.' });
    }

    if (!DB.wishlists) DB.wishlists = {};
    if (!Array.isArray(DB.wishlists[userId])) DB.wishlists[userId] = [];

    const userWishlist = DB.wishlists[userId];
    const index = userWishlist.indexOf(opportunityId);
    let isWishlisted = false;

    if (index > -1) {
      userWishlist.splice(index, 1);
      isWishlisted = false;
    } else {
      userWishlist.push(opportunityId);
      isWishlisted = true;
    }

    return res.json({
      success: true,
      message: isWishlisted ? 'Opportunity saved to Wishlist!' : 'Opportunity removed from Wishlist.',
      opportunityId,
      isWishlisted,
      totalWishlisted: userWishlist.length,
      wishlist: userWishlist
    });
  } catch (err) {
    console.error('[Wishlist Toggle Error]:', err);
    res.status(500).json({ success: false, error: 'Could not update wishlist.' });
  }
});

/**
 * GET /api/recommendations/wishlist
 * Fetch all wishlisted opportunities for the current student
 */
router.get('/wishlist', (req, res) => {
  try {
    const { userId = 'usr-student-01' } = req.query;
    const ids = DB.wishlists?.[userId] || [];
    const allOpps = DB.opportunities || [];
    const wishlistedOpps = allOpps.filter(o => ids.includes(o.id));

    return res.json({
      success: true,
      totalCount: wishlistedOpps.length,
      wishlist: wishlistedOpps.map(o => ({ ...o, isWishlisted: true }))
    });
  } catch (err) {
    console.error('[Wishlist GET Error]:', err);
    res.status(500).json({ success: false, error: 'Could not retrieve wishlisted opportunities.' });
  }
});

module.exports = router;
