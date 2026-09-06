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
const recommendationsRoutes = require('./routes/recommendations.routes');
const assessmentRoutes = require('./routes/assessment.routes');
const todoRoutes = require('./routes/todo.routes');
const notificationRoutes = require('./routes/notification.routes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API Routes (Support both /api/* and direct prefix for Vercel Serverless Function rewrites)
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);

app.use('/api/roadmap', roadmapRoutes);
app.use('/roadmap', roadmapRoutes);

app.use('/api/todos', todoRoutes);
app.use('/todos', todoRoutes);

app.use('/api/notifications', notificationRoutes);
app.use('/notifications', notificationRoutes);

app.use('/api/resume', resumeRoutes);
app.use('/resume', resumeRoutes);

app.use('/api/opportunities', opportunitiesRoutes);
app.use('/opportunities', opportunitiesRoutes);

app.use('/api/recommendations', recommendationsRoutes);
app.use('/recommendations', recommendationsRoutes);

app.use('/api/assessment', assessmentRoutes);
app.use('/assessment', assessmentRoutes);

app.use('/api/profile', assessmentRoutes);
app.use('/profile', assessmentRoutes);

app.use('/api/zulu', zuluRoutes);
app.use('/zulu', zuluRoutes);

app.use('/api/academy', academyRoutes);
app.use('/academy-api', academyRoutes);

app.use('/api/academician', academyRoutes);
app.use('/academician', academyRoutes);

app.use('/api/analytics', academyRoutes);
app.use('/analytics', academyRoutes);

app.use('/api/industry', industryRoutes);
app.use('/industry-api', industryRoutes);

// Security Guard: Prevent direct HTTP access to sensitive project files
const BLOCKED_PATHS = ['.env', 'backend', 'package.json', 'package-lock.json', 'pyproject.toml', 'requirements.txt', '.git', '.code-review-graph', '.agents'];
app.use((req, res, next) => {
  const reqPath = req.path.toLowerCase();
  if (BLOCKED_PATHS.some(blocked => reqPath === `/${blocked}` || reqPath.startsWith(`/${blocked}/`))) {
    return res.status(403).json({ success: false, error: 'Access forbidden: Protected system resource.' });
  }
  next();
});

// Prevent client browser caching in local development
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

// Serve static frontend assets from specific public directories
const ROOT_DIR = path.resolve(__dirname, '..');
const fs = require('fs');

app.use('/css', express.static(path.join(ROOT_DIR, 'css'), { maxAge: 0 }));
app.use('/js', express.static(path.join(ROOT_DIR, 'js'), { maxAge: 0 }));
app.use('/src', express.static(path.join(ROOT_DIR, 'src'), { extensions: ['html'], maxAge: 0 }));

// Pre-cache Portal Clean URL Route Mappings at startup to avoid synchronous disk I/O per request
const portalRoutes = [
  'student', 'academy', 'industry', 'auth',
  'student-roadmap', 'student-internships', 'student-jobs',
  'student-quiz', 'student-resume', 'student-skilltree',
  'student-portfolio', 'student-zulu',
  'industry-candidates', 'industry-calibrator', 'industry-requisitions',
  'industry-mous', 'industry-bootcamps', 'industry-grants', 'industry-post-opportunity',
  'academy-readiness', 'academy-curriculum', 'academy-benchmarking',
  'academy-mous', 'academy-grants', 'academy-fdp'
];

const routeCache = new Map();
portalRoutes.forEach(route => {
  const candidatePaths = [
    path.join(ROOT_DIR, 'src', 'students', `${route}.html`),
    path.join(ROOT_DIR, 'src', 'industry', `${route}.html`),
    path.join(ROOT_DIR, 'src', 'academy', `${route}.html`),
    path.join(ROOT_DIR, `${route}.html`)
  ];
  for (const p of candidatePaths) {
    if (fs.existsSync(p)) {
      routeCache.set(route, p);
      break;
    }
  }
});

// Portal route handlers (supports both clean URLs and .html extensions)
portalRoutes.forEach(route => {
  const servePortal = (req, res) => {
    const filePath = routeCache.get(route);
    if (filePath) {
      return res.sendFile(filePath);
    }
    return res.status(404).sendFile(path.join(ROOT_DIR, 'index.html'));
  };

  app.get(`/${route}`, servePortal);
  app.get(`/${route}.html`, servePortal);
});

// Dynamic fallback for any other .html page requests
app.get('/:page.html', (req, res, next) => {
  const page = req.params.page;
  const filePath = routeCache.get(page) || [
    path.join(ROOT_DIR, `${page}.html`),
    path.join(ROOT_DIR, 'src', 'students', `${page}.html`),
    path.join(ROOT_DIR, 'src', 'industry', `${page}.html`),
    path.join(ROOT_DIR, 'src', 'academy', `${page}.html`)
  ].find(p => fs.existsSync(p));

  if (filePath) {
    return res.sendFile(filePath);
  }
  next();
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

// Start Server if run directly (standalone Node process)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`========================================================`);
    console.log(` JOBLEX Node.js Backend Server running on port ${PORT}`);
    console.log(`Frontend: http://localhost:${PORT}`);
    console.log(`API Base: http://localhost:${PORT}/api`);
    console.log(`========================================================`);
  });
}

module.exports = app;
