/**
 * JOBLEX Zulu AI Career Counselor Routes (JavaScript / Node.js)
 * Features:
 * - Live Google Gemini LLM API integration (when GEMINI_API_KEY is configured in .env)
 * - Rich context-aware Ayush & HealthTech offline intelligence engine
 * - Student profile context awareness (target role, XP, missing skills)
 */

const express = require('express');
const router = express.Router();

const SYSTEM_INSTRUCTION = `You are Zulu, an intelligent, empathetic, and expert AI Career Counselor for JOBLEX — the flagship Academia-Industry bridge portal for the Ministry of Ayush and All India Institute of Ayurveda (AIIA) (SIH 26044).
Your mission is to guide students on:
1. Bridging ancient Ayush pharmacognosy with modern analytical science (HPTLC, LC-MS, HPLC, in-silico AutoDock molecular docking).
2. Career roadmaps targeting research roles in Dabur, Himalaya Wellness, Patanjali, and national institutes.
3. Micro-gigs, bilateral MoUs, NEP-2020 syllabus modernizations, and anti-decay gamified learning.
Keep answers concise (under 3-4 paragraphs), highly actionable, encouraging, and use bullet points where helpful.`;

/**
 * Query Gemini 1.5 Flash API
 */
async function queryGemini(userMessage, studentContext) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.includes('your_gemini_api_key') || apiKey === 'placeholder') {
    return null;
  }

  try {
    const prompt = studentContext 
      ? `Student Profile Context: ${JSON.stringify(studentContext)}\n\nStudent Query: "${userMessage}"`
      : `Student Query: "${userMessage}"`;

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: `${SYSTEM_INSTRUCTION}\n\n${prompt}` }]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 600
        }
      })
    });

    if (!response.ok) {
      console.warn(`[Zulu Gemini API] Request failed with status: ${response.status}`);
      return null;
    }

    const data = await response.json();
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    return candidateText ? candidateText.trim() : null;
  } catch (err) {
    console.warn('[Zulu Gemini API Error]:', err.message);
    return null;
  }
}

/**
 * Domain-Aware Offline Intelligence Engine
 */
function getDomainFallback(message, context = {}) {
  const lower = message.toLowerCase().trim();

  // Greetings
  if (lower === 'hi' || lower === 'hello' || lower === 'hey' || lower.startsWith('hello') || lower.startsWith('hi zulu')) {
    return `Namaste! 🌿 I am **Zulu**, your AI Career & Research Counselor for the Ayush sector. How can I assist you today? You can ask me about:
• Closing your skill gaps for **Dabur** or **Himalaya**
• Finding paid **Micro-Gigs** (task bounties)
• How **Anti-Decay XP** protects your verified credentials
• Recommending your next **Career Roadmap** milestone`;
  }

  // Resume & Skill Gap Analysis
  if (lower.includes('resume') || lower.includes('cv') || lower.includes('gap') || lower.includes('analyze')) {
    return `### 📄 Resume Gap Discovery
To analyze your CV against real industry criteria:
1. Navigate to the **AI Resume Analyzer** tab on your portal.
2. Paste your CV or upload your credentials, and select your target role (e.g., *Herbal Formulation Scientist*).
3. The platform cross-references your text against **Dabur** and **Patanjali** hiring standards.
4. Any missing skills (like *HPTLC Fingerprinting* or *GLP Compliance*) are automatically converted into actionable modules in your **Career Roadmap**!`;
  }

  // Anti-Decay XP & Streak
  if (lower.includes('decay') || lower.includes('streak') || lower.includes('freeze') || lower.includes('points') || lower.includes('xp')) {
    return `### 🔥 Anti-Decay XP Mechanism
In JOBLEX, skills reflect active mastery rather than static certificates:
• If you remain inactive for **72 hours**, your competency points decay at **50 XP/day**.
• Complete any module, quiz, or simply click **"Daily Check-In"** in your Career Roadmap to freeze decay for 72 hours.
• Maintaining a **7-Day Streak** grants you priority visibility in the **Reverse Application Inbound Pool** where Dabur recruiters headhunt top candidates directly!`;
  }

  // HPTLC & Chromatography / Analytical Techniques
  if (lower.includes('hptlc') || lower.includes('chromatography') || lower.includes('hplc') || lower.includes('spectroscopy')) {
    return `### 🧪 High-Performance Thin-Layer Chromatography (HPTLC)
HPTLC is the gold standard for botanical standardization in commercial Ayurveda:
• **Why It Matters**: 82% of pharma recruiters (Dabur, Himalaya) require HPTLC to verify active phytochemical markers (e.g., *Withanolides* in Ashwagandha or *Curcuminoids* in Turmeric).
• **How to Learn It**: Complete Phase 2 of your Career Roadmap and enroll in the **Dabur-AIIA 4-Week Rapid HPTLC Bootcamp** listed under your Opportunities Board to earn a verified institutional badge!`;
  }

  // Micro-Internships / Task-Based Gigs
  if (lower.includes('micro') || lower.includes('gig') || lower.includes('bounty') || lower.includes('task')) {
    return `### ⚡ Micro-Internships & Paid Task Gigs
Micro-gigs allow you to gain verified corporate experience without relocating for months:
• **Current Top Gig**: *Clean & Standardize 50 Ashwagandha Trial Records* (Dabur Research Labs) — **₹6,000 Task Bounty**.
• **Duration**: Typically 1 to 2 weeks remote.
• **Benefit**: Successful submissions are audited by AIIA faculty and immediately added to your verified digital credential ledger!`;
  }

  // Job & Internship Opportunities / Dabur / Himalaya
  if (lower.includes('internship') || lower.includes('job') || lower.includes('dabur') || lower.includes('himalaya') || lower.includes('patanjali') || lower.includes('apply')) {
    return `### 💼 Top Verified Corporate Openings
Your verified AIIA profile is currently matched with:
1. **Dabur India Ltd.**: *Phytochemical Research Intern* — ₹22,000/mo (94% Skill Fit).
2. **Patanjali Research Foundation**: *Formulation Scientist* — ₹8.5 - 12 LPA.
3. **Ministry of Ayush**: *Ayush AI Innovation Challenge 2026* — ₹3,00,000 Prize Pool.
Head to the **Opportunities Board** tab to apply with 1-click verified credentials!`;
  }

  // Reverse Application & Inbound Headhunting
  if (lower.includes('reverse') || lower.includes('headhunt') || lower.includes('inbound') || lower.includes('invite')) {
    return `### ⚡ Reverse Application Protocol
In traditional hiring, students apply and wait. In JOBLEX:
• Corporate talent teams query our verified competency database for specific skills (e.g., *AutoDock*, *Phytochemistry*, *GLP*).
• If your **Inbound Recruiter Discovery** toggle in your Portfolio is **Active**, recruiters can directly transmit interview invitations to you—even before you submit an application!`;
  }

  // MoUs, Syllabus & NEP 2020
  if (lower.includes('mou') || lower.includes('syllabus') || lower.includes('curriculum') || lower.includes('nep')) {
    return `### 🏛️ Academic-Industry Curriculum Sync
Under the **National Education Policy (NEP-2020)**:
• When partner pharma companies submit critical skill needs, our AI performs an automated audit on college syllabi.
• Dean councils receive ready-to-adopt modern syllabus add-ons (such as *In-Silico Molecular Docking* and *Digital Health Informatics*) to keep your coursework aligned with corporate job markets.`;
  }

  // Quiz Arena & Preparation
  if (lower.includes('quiz') || lower.includes('arena') || lower.includes('test') || lower.includes('exam')) {
    return `### 🎯 Quiz Arena Strategy
Taking quizzes in the **Quiz Arena** validates your practical understanding:
• Each completed quiz awards **+50 to +100 XP** and extends your Anti-Decay freeze by 24 hours.
• High scorers (above 80%) unlock the **Verified Skill Badge** on their institutional profile, visible to corporate partners.`;
  }

  // Default contextual advice
  return `### 💡 Zulu AI Career Advice
Regarding **"${message}"**:
In the modern Ayush bio-economy, the highest-compensated graduates are those who combine **classical Ayurvedic foundations** with **cutting-edge analytical techniques** (HPLC, digital health informatics, and data science).

**Recommended Next Steps**:
1. Check your **Career Roadmap** for active milestones to earn +100 XP.
2. Complete a 2-minute refresh quiz to prevent skill decay.
3. Explore active **Micro-Gigs** to earn paid task bounties while building your verified portfolio!`;
}

// POST /api/zulu/chat
router.post('/chat', async (req, res) => {
  const { message = '', context = {} } = req.body || {};

  if (!message.trim()) {
    return res.status(400).json({ success: false, error: 'Message cannot be empty.' });
  }

  // 1. Attempt Live Gemini LLM if configured
  const geminiResponse = await queryGemini(message, context);
  if (geminiResponse) {
    return res.json({
      success: true,
      provider: 'google-gemini-1.5-flash',
      reply: geminiResponse
    });
  }

  // 2. High-grade Domain Fallback Engine
  const fallbackReply = getDomainFallback(message, context);
  return res.json({
    success: true,
    provider: 'zulu-domain-engine',
    reply: fallbackReply
  });
});

module.exports = router;
