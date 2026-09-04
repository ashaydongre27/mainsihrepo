/**
 * JOBLEX Node.js / Express Backend Server (JavaScript)
 * Ministry of Ayush / All India Institute of Ayurveda | Problem Statement ID: 26044
 */

const path = require('path');
// Load environment variables from project root .env
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const roadmapRoutes = require('./routes/roadmap.routes');
const resumeRoutes = require('./routes/resume.routes');
const opportunitiesRoutes = require('./routes/opportunities.routes');
const zuluRoutes = require('./routes/zulu.routes');
const academyRoutes = require('./routes/academy.routes');
const industryRoutes = require('./routes/industry.routes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/roadmap', roadmapRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/opportunities', opportunitiesRoutes);
app.use('/api/zulu', zuluRoutes);
app.use('/api/academy', academyRoutes);
app.use('/api/industry', industryRoutes);

// Serve static frontend files from project root (with automatic .html extension resolution)
const ROOT_DIR = path.resolve(__dirname, '..');
app.use(express.static(ROOT_DIR, { extensions: ['html'] }));

// Portal Clean URL Routes (shifts navigation directly to HTML/CSS/JS architecture)
const portalRoutes = [
  'student', 'academy', 'industry', 'auth',
  'student-roadmap', 'student-internships', 'student-jobs',
  'student-quiz', 'student-resume', 'student-skilltree',
  'student-portfolio', 'student-zulu'
];

portalRoutes.forEach(route => {
  app.get(`/${route}`, (req, res) => {
    res.sendFile(path.join(ROOT_DIR, `${route}.html`));
  });
});

// Root route sends index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(ROOT_DIR, 'index.html'));
});

// Production Safe Error Handler (Never expose raw backend stack traces or internal errors to user)
app.use((err, req, res, next) => {
  console.error('[Server Error]:', err);
  res.status(err.status || 500).json({
    success: false,
    message: 'An unexpected error occurred while processing your request. Please try again later.'
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`========================================================`);
  console.log(`🚀 JOBLEX Node.js Backend Server running on port ${PORT}`);
  console.log(`Frontend: http://localhost:${PORT}`);
  console.log(`API Base: http://localhost:${PORT}/api`);
  console.log(`========================================================`);
});

module.exports = app;
