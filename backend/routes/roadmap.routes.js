const express = require('express');
const router = express.Router();
const { supabase, isConfigured } = require('../config/supabase');
const DB = require('../data/database');

// Helper to get or initialize a student's in-memory roadmap
function getStudentRoadmap(studentId) {
  if (!DB.student_roadmaps) {
    DB.student_roadmaps = {};
  }
  if (!DB.student_roadmaps[studentId]) {
    // Clone default template with clean initial state for student
    const roadmap = JSON.parse(JSON.stringify(DB.student_roadmap));
    roadmap.userId = studentId;
    roadmap.totalXp = 0;
    roadmap.streakDays = 0;
    roadmap.currentLevel = "Level 1 - Aspiring Scholar";
    if (Array.isArray(roadmap.phases)) {
      roadmap.phases.forEach(p => {
        if (Array.isArray(p.tasks)) {
          p.tasks.forEach(t => t.completed = false);
        }
      });
    }
    DB.student_roadmaps[studentId] = roadmap;
  }
  return DB.student_roadmaps[studentId];
}

// GET /api/roadmap
router.get('/', async (req, res) => {
  const studentId = req.query.studentId || req.user?.id || req.user?.email || 'guest-student';

  if (isConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('student_roadmaps')
        .select('*')
        .eq('student_id', studentId)
        .maybeSingle();

      if (!error && data) {
        return res.json(data);
      }
    } catch (err) {
      console.warn('[Roadmap GET] Supabase warning:', err.message);
    }
  }

  res.json(getStudentRoadmap(studentId));
});

// GET /api/roadmap/get (alias)
router.get('/get', async (req, res) => {
  const studentId = req.query.studentId || req.user?.id || req.user?.email || 'guest-student';

  if (isConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('student_roadmaps')
        .select('*')
        .eq('student_id', studentId)
        .maybeSingle();

      if (!error && data) {
        return res.json(data);
      }
    } catch (err) {
      console.warn('[Roadmap get] Supabase warning:', err.message);
    }
  }

  res.json(getStudentRoadmap(studentId));
});

// GET /api/roadmap/peer-benchmarking (Idea #2)
router.get('/peer-benchmarking', async (req, res) => {
  if (isConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('peer_benchmarking').select('*').limit(1).maybeSingle();
      if (!error && data) {
        return res.json(data);
      }
    } catch (err) {
      console.warn('[Peer benchmarking] Supabase warning:', err.message);
    }
  }
  res.json(DB.peerBenchmarking);
});

// POST /api/roadmap/toggle-task
router.post('/toggle-task', async (req, res) => {
  const { taskId, phaseIdx, studentId: explicitStudentId } = req.body || {};
  const studentId = explicitStudentId || req.user?.id || 'usr-student-01';
  const rm = getStudentRoadmap(studentId);
  let updated = false;
  let xpGained = 0;

  const pIdx = parseInt(phaseIdx, 10);
  if (rm.phases) {
    // Find phase either by index or by searching inside phases
    let targetPhase = !isNaN(pIdx) && rm.phases[pIdx] ? rm.phases[pIdx] : null;
    if (!targetPhase && taskId) {
      targetPhase = rm.phases.find(p => p.tasks && p.tasks.some(t => t.id === taskId));
    }

    if (targetPhase && targetPhase.tasks) {
      const task = targetPhase.tasks.find(t => t.id === taskId);
      if (task) {
        task.completed = !task.completed;
        updated = true;
        const taskXp = task.xp || 50;
        if (task.completed) {
          xpGained = taskXp;
          rm.totalXp = (rm.totalXp || 0) + xpGained;
        } else {
          xpGained = -taskXp;
          rm.totalXp = Math.max(0, (rm.totalXp || 0) - taskXp);
        }
      }
    }
  }

  if (isConfigured && supabase && updated) {
    try {
      await supabase
        .from('student_roadmaps')
        .update({ total_xp: rm.totalXp, phases: rm.phases })
        .eq('student_id', studentId);
    } catch (err) {
      console.warn('[Toggle task] Supabase sync warning:', err.message);
    }
  }

  res.json({
    success: updated,
    xpGained,
    newTotalXp: rm.totalXp,
    roadmap: rm
  });
});

// POST /api/roadmap/check-in (Anti-decay freeze)
router.post('/check-in', async (req, res) => {
  const studentId = req.body?.studentId || req.user?.id || 'usr-student-01';
  const rm = getStudentRoadmap(studentId);

  rm.streakDays = (typeof rm.streakDays === 'number' ? rm.streakDays : 7) + 1;
  rm.totalXp = (typeof rm.totalXp === 'number' ? rm.totalXp : 1450) + 50;
  rm.decayStatus = 'Active - Decay Frozen for 72 hrs';
  rm.decayFrozenUntil = new Date(Date.now() + 72 * 3600 * 1000).toISOString();

  if (isConfigured && supabase) {
    try {
      await supabase
        .from('student_roadmaps')
        .update({
          streak_days: rm.streakDays,
          total_xp: rm.totalXp,
          decay_status: rm.decayStatus
        })
        .eq('student_id', studentId);
    } catch (err) {
      console.warn('[Check-in] Supabase sync warning:', err.message);
    }
  }

  res.json({
    success: true,
    message: 'Daily Check-in recorded! +50 XP awarded, Streak incremented, and Point Decay frozen for 72 hours.',
    streak: rm.streakDays,
    totalXp: rm.totalXp,
    decayFrozenUntil: rm.decayFrozenUntil
  });
});

module.exports = router;
