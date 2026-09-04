const express = require('express');
const router = express.Router();
const { supabase, isConfigured } = require('../config/supabase');
const DB = require('../data/database');

// GET /api/roadmap
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase.from('student_roadmaps').select('*').limit(1).single();
    if (!error && data) {
      return res.json(data);
    }
  } catch (err) {
    console.warn('[Roadmap GET] Supabase warning:', err.message);
  }
  res.json(DB.student_roadmap);
});

// GET /api/roadmap/get (alias)
router.get('/get', async (req, res) => {
  try {
    const { data, error } = await supabase.from('student_roadmaps').select('*').limit(1).single();
    if (!error && data) {
      return res.json(data);
    }
  } catch (err) {
    console.warn('[Roadmap get] Supabase warning:', err.message);
  }
  res.json(DB.student_roadmap);
});

// GET /api/roadmap/peer-benchmarking (Idea #2)
router.get('/peer-benchmarking', async (req, res) => {
  try {
    const { data, error } = await supabase.from('peer_benchmarking').select('*').limit(1).single();
    if (!error && data) {
      return res.json(data);
    }
  } catch (err) {
    console.warn('[Peer benchmarking] Supabase warning:', err.message);
  }
  res.json(DB.peerBenchmarking);
});

// POST /api/roadmap/toggle-task
router.post('/toggle-task', async (req, res) => {
  const { taskId, phaseIdx } = req.body || {};
  const rm = DB.student_roadmap;
  let updated = false;
  let xpGained = 0;

  if (rm.phases && rm.phases[phaseIdx]) {
    const task = rm.phases[phaseIdx].tasks.find(t => t.id === taskId);
    if (task) {
      task.completed = !task.completed;
      updated = true;
      if (task.completed) {
        xpGained = task.xp || 50;
        rm.totalXp += xpGained;
      } else {
        xpGained = -(task.xp || 50);
        rm.totalXp = Math.max(0, rm.totalXp - (task.xp || 50));
      }
    }
  }

  try {
    await supabase
      .from('student_roadmaps')
      .update({ total_xp: rm.totalXp, phases: rm.phases })
      .not('id', 'is', null);
  } catch (err) {
    console.warn('[Toggle task] Supabase sync warning:', err.message);
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
  const rm = DB.student_roadmap;
  rm.streakDays = (rm.streakDays || 7) + 1;
  rm.totalXp = (rm.totalXp || 1450) + 50;
  rm.decayStatus = 'Active - Decay Frozen for 72 hrs';

  try {
    await supabase
      .from('student_roadmaps')
      .update({
        streak_days: rm.streakDays,
        total_xp: rm.totalXp,
        decay_status: rm.decayStatus
      })
      .not('id', 'is', null);
  } catch (err) {
    console.warn('[Check-in] Supabase sync warning:', err.message);
  }

  res.json({
    success: true,
    message: 'Daily Check-in recorded! +50 XP awarded, Streak incremented, and Point Decay frozen for 72 hours.',
    streak: rm.streakDays,
    totalXp: rm.totalXp
  });
});

module.exports = router;
