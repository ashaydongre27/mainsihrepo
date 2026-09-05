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

// Serve static frontend files from project root and src subfolders
const ROOT_DIR = path.resolve(__dirname, '..');
app.use(express.static(ROOT_DIR, { extensions: ['html'] }));
app.use('/src/students', express.static(path.join(ROOT_DIR, 'src', 'students'), { extensions: ['html'] }));
app.use('/src/industry', express.static(path.join(ROOT_DIR, 'src', 'industry'), { extensions: ['html'] }));
app.use('/src/academy', express.static(path.join(ROOT_DIR, 'src', 'academy'), { extensions: ['html'] }));

const fs = require('fs');

// Portal Clean URL Routes (shifts navigation directly to HTML/CSS/JS architecture)
const portalRoutes = [
  'student', 'academy', 'industry', 'auth',
  'student-roadmap', 'student-internships', 'student-jobs',
  'student-quiz', 'student-resume', 'student-skilltree',
  'student-portfolio', 'student-zulu', 'clean-white-ui',
  'industry-candidates', 'industry-calibrator', 'industry-requisitions',
  'industry-mous', 'industry-bootcamps', 'industry-grants', 'industry-post-opportunity',
  'academy-readiness', 'academy-curriculum', 'academy-benchmarking',
  'academy-mous', 'academy-grants', 'academy-fdp'
];

portalRoutes.forEach(route => {
  app.get(`/${route}`, (req, res) => {
    const studentPath = path.join(ROOT_DIR, 'src', 'students', `${route}.html`);
    const industryPath = path.join(ROOT_DIR, 'src', 'industry', `${route}.html`);
    const academyPath = path.join(ROOT_DIR, 'src', 'academy', `${route}.html`);
    const rootPath = path.join(ROOT_DIR, `${route}.html`);

    if (fs.existsSync(studentPath)) {
      return res.sendFile(studentPath);
    } else if (fs.existsSync(industryPath)) {
      return res.sendFile(industryPath);
    } else if (fs.existsSync(academyPath)) {
      return res.sendFile(academyPath);
    } else if (fs.existsSync(rootPath)) {
      return res.sendFile(rootPath);
    } else {
      return res.sendFile(path.join(ROOT_DIR, 'index.html'));
    }
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
