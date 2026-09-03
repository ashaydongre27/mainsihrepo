/**
 * JOBLEX Auth Routes (JavaScript / Node.js)
 */
const express = require('express');
const router = express.Router();
const DB = require('../data/database');

// GET /api/auth/demo-users
router.get('/demo-users', (req, res) => {
  const demoUsers = DB.users.map(u => ({
    name: u.name,
    email: u.email,
    role: u.role,
    label: `${u.role.charAt(0).toUpperCase() + u.role.slice(1)} (${u.institution || u.company})`
  }));
  res.json({ demoUsers });
});

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password, role } = req.body || {};
  const normalizedEmail = (email || '').trim().toLowerCase();

  let user = DB.users.find(u => u.email.toLowerCase() === normalizedEmail);
  if (!user) {
    user = {
      id: `usr-${Date.now().toString(36)}`,
      name: normalizedEmail.split('@')[0].replace('.', ' ').toUpperCase(),
      email: normalizedEmail,
      role: role || 'student',
      institution: role === 'industry' ? 'Dabur India Ltd.' : 'All India Institute of Ayurveda',
      xp: 1200,
      streak: 3
    };
    DB.users.push(user);
  }

  const { password: _, ...safeUser } = user;
  res.json({
    success: true,
    token: `jwt-token-${user.id}-${Date.now()}`,
    user: safeUser
  });
});

// POST /api/auth/register
router.post('/register', (req, res) => {
  const { name, email, password, role, institution, company } = req.body || {};
  if (!name || !email) {
    return res.status(400).json({ success: false, error: 'Name and Email are required.' });
  }

  const existing = DB.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ success: false, error: 'Email already registered.' });
  }

  const newUser = {
    id: `usr-${Date.now().toString(36)}`,
    name,
    email,
    password: password || 'password123',
    role: role || 'student',
    institution: institution || 'All India Institute of Ayurveda',
    company: company || 'Ayush Industry Partner',
    xp: 1000,
    streak: 1
  };
  DB.users.push(newUser);

  const { password: _, ...safeUser } = newUser;
  res.json({ success: true, user: safeUser, token: `jwt-${newUser.id}` });
});

module.exports = router;
