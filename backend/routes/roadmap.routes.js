/**
 * JOBLEX Career Roadmap & Anti-Decay Gamification Routes (JavaScript / Node.js)
 */
const express = require('express');
const router = express.Router();
const DB = require('../data/database');

// GET /api/roadmap
router.get('/', (req, res) => {
  res.json(DB.student_roadmap);
});

// GET /api/roadmap/get (alias)
router.get('/get', (req, res) => {
  res.json(DB.student_roadmap);
});

// GET /api/roadmap/peer-benchmarking (Idea #2)
router.get('/peer-benchmarking', (req, res) => {
  res.json(DB.peerBenchmarking);
});

// POST /api/roadmap/toggle-task
router.post('/toggle-task', (req, res) => {
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

  res.json({
    success: updated,
    xpGained,
    newTotalXp: rm.totalXp,
    roadmap: rm
  });
});

// POST /api/roadmap/check-in (Anti-decay freeze)
router.post('/check-in', (req, res) => {
  const rm = DB.student_roadmap;
  rm.streakDays = (rm.streakDays || 7) + 1;
  rm.totalXp = (rm.totalXp || 1450) + 50;
  rm.decayStatus = 'Active - Decay Frozen for 72 hrs';

  res.json({
    success: true,
    message: 'Daily Check-in recorded! +50 XP awarded, Streak incremented, and Point Decay frozen for 72 hours.',
    streak: rm.streakDays,
    totalXp: rm.totalXp
  });
});

module.exports = router;
