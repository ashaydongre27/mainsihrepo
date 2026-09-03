/**
 * JOBLEX Zulu AI Counselor Routes (JavaScript / Node.js)
 */
const express = require('express');
const router = express.Router();

// POST /api/zulu/chat
router.post('/chat', (req, res) => {
  const { message = '' } = req.body || {};
  const lower = message.toLowerCase();
  let reply = '';

  if (lower.includes('resume') || lower.includes('cv') || lower.includes('gap')) {
    reply = "I recommend running our AI Resume Analyzer tab! Paste your CV text and target 'Herbal Formulation Scientist'. I'll cross-reference your competencies against Dabur and Patanjali laboratory benchmarks and sync the missing skills directly into your Roadmap!";
  } else if (lower.includes('decay') || lower.includes('streak') || lower.includes('freeze')) {
    reply = "JOBLEX features Anti-Decay XP preservation: inactive competencies suffer point decay after 72 hours of inactivity. Complete daily tasks or click 'Daily Check-In' on your Career Roadmap to freeze decay and keep your streak protected! 🔥";
  } else if (lower.includes('mou') || lower.includes('syllabus') || lower.includes('curriculum')) {
    reply = "Through bilateral corporate MoUs (like Dabur & AIIA), when pharma companies submit emerging skill demands, our AI compares them against university syllabi and automatically suggests accredited course add-ons to Academic Councils under NEP-2020!";
  } else if (lower.includes('micro') || lower.includes('gig')) {
    reply = "Micro-Gigs are 1-2 week task-based projects (bounties up to ₹8,000) that let you build verified industrial credentials remotely without having to relocate for months. Check the Opportunities board to apply!";
  } else if (lower.includes('internship') || lower.includes('job') || lower.includes('dabur')) {
    reply = "Top verified opportunities include Dabur's Phytochemical Research Internship (₹22k/mo) and Himalaya Wellness Informatics (₹25k/mo). Because your portfolio is verified by AIIA credentials, your application is prioritized!";
  } else {
    reply = `Regarding "${message}": in the contemporary Ayush and HealthTech ecosystem, combining classical botanical pharmacognosy with modern analytical tools (HPTLC, Python data analysis, and in-silico molecular docking) makes applicants 3x more competitive. Follow your Career Roadmap to master these step-by-step!`;
  }

  res.json({ success: true, reply });
});

module.exports = router;
