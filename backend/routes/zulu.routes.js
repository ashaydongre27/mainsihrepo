/**
 * JOBLEX Zulu AI Career Counselor Routes (Node.js / Express)
 * Powered by Google Gemini API (@google/generative-ai & REST)
 * Integrated with Supabase Zulu Chat History System
 * Ministry of Ayush / All India Institute of Ayurveda | Problem Statement ID: 26044
 */

const express = require('express');
const router = express.Router();
const { generateWithFailover, isGoogleApiConfigured, getMainApiKey, getBackupApiKey } = require('../services/ai.service');
const zuluChatService = require('../services/zuluChat.service');

/**
 * Call Google Gemini using LangGraph Orchestrator with Multi-Key Failover
 */
async function generateWithGemini(userMessage, conversationHistory = [], studentContext = null) {
  if (!isGoogleApiConfigured()) {
    return null;
  }

  const result = await generateWithFailover({
    prompt: userMessage,
    systemInstruction: null,
    history: conversationHistory,
    temperature: 0.7
  });

  if (result && result.text) {
    return {
      text: result.text,
      model: result.provider,
      keyType: result.keyType
    };
  }

  return null;
}

/**
 * Intelligent Guided Assistant response when Google API key is pending configuration
 */
/**
 * Dynamic Intelligent Assistant response generator for offline / fallback mode
 */
function generateSmartZuluResponse(message, studentContext = {}) {
  const query = (message || '').toLowerCase();
  const name = studentContext.studentName || studentContext.name || 'Scholar';

  if (query.includes('dabur') || query.includes('patanjali') || query.includes('himalaya') || query.includes('industry') || query.includes('internship') || query.includes('job') || query.includes('company') || query.includes('competenc')) {
    return `### 🌿 Industry R&D & Competency Pathway

Namaste **${name}**! Based on active recruitment benchmarks from corporate R&D partners:

1. **Top Priority Skills**:
   - **HPTLC & HPLC Fingerprinting**: Essential for phytochemical standardization and quality assurance.
   - **GLP / GCP Compliance**: Required for clinical trials and regulatory documentation.
   - **Computational Pharmacognosy**: Using Python & In-silico AutoDock for rapid ligand-target docking.

2. **Actionable Next Steps**:
   - Apply for the **Phytochemical Research Internship** on your *Internships Board* (Stipend: ₹22,000/mo).
   - Complete Phase 2 of your **Career Roadmap** to earn +450 XP and unlock direct corporate referral.

Stay consistent with your daily modules to maintain top recruiter visibility! 🚀`;
  }

  if (query.includes('decay') || query.includes('freeze') || query.includes('xp') || query.includes('streak') || query.includes('point') || query.includes('quiz')) {
    return `### ❄️ Anti-Decay XP & Competency Freeze Engine

Greetings **${name}**! Here is how your skill verification freeze works:

- **72-Hour Freeze Window**: Every completed Quiz Arena module or daily check-in freezes your competency score for 72 hours, preventing skill decay.
- **Streak Multiplier**: Maintaining your active streak provides a 1.5x XP boost across all micro-gigs and placement applications.
- **Recruiter Priority**: Students with active freeze status appear in the **Top 5% Inbound Candidate Pool** for industry partners.

💡 *Tip*: Complete a quick 3-minute quiz in the **Quiz Arena** now to protect your current XP streak!`;
  }

  if (query.includes('hptlc') || query.includes('hplc') || query.includes('chromatograph') || query.includes('autodock') || query.includes('python') || query.includes('phytochem') || query.includes('skill')) {
    return `### 🔬 Scientific Skill & Protocol Guidance

Great question! In modern Ayush research:

- **HPTLC (High-Performance Thin-Layer Chromatography)** is the gold standard for fingerprinting botanical extract identity, purity, and active marker quantitation.
- **In-Silico Molecular Docking**: Enables virtual screening of phytochemicals against target proteins before wet-lab validation.
- **Data Analytics**: Combining traditional concepts with Python-driven statistical profiling accelerates publication in high-impact journals.

Recommended action: Review the **Skill Constellation Map** in your portal to view your verified nodes and unlock advanced certifications! 📊`;
  }

  if (query.includes('fellowship') || query.includes('grant') || query.includes('mou') || query.includes('research') || query.includes('college')) {
    return `### 🏛️ Research Fellowships & Institutional MoU Pathways

Hello **${name}**! Institutional collaboration opportunities:

- **Research Grants**: Under NAAC Criterion 3.4, students engaged in interdisciplinary projects are eligible for research travel grants and lab bounties.
- **Active MoUs**: Institutional agreements between colleges and corporate research centers enable shared access to high-end analytical instrumentation.
- **Micro-Gigs**: Check the *Micro-Gig Task Board* for short-term data annotation and trial record standardization bounties (up to ₹6,000).

Let me know if you need assistance tailoring your research proposal for upcoming grant cycles! 📜`;
  }

  const topicWords = message.split(' ').slice(0, 5).join(' ');
  return `### 💡 Zulu AI Guidance: "${topicWords}..."

Namaste **${name}**! Here is my analysis regarding your inquiry:

- **Strategic Overview**: Addressing **"${message.trim()}"** requires combining classical wisdom with verified analytical methodology.
- **Key Recommendation**: Focus on strengthening your core profile competencies in **Pharmacognosy**, **Standardization Protocols**, and **Computational Phytochemistry**.
- **Career Impact**: Completing verified practical modules in your portal increases your skill readiness index and corporate match percentage.

Feel free to ask follow-up questions about specific corporate job roles, research fellowships, or skill gap analysis! 🌟`;
}

// ─────────────────────────────────────────────────────────────
// CHAT SESSIONS & HISTORY API ENDPOINTS
// ─────────────────────────────────────────────────────────────

/**
 * GET /api/zulu/sessions
 * Fetch all chat sessions for the current student user
 */
router.get('/sessions', async (req, res) => {
  try {
    const userId = req.query.userId || req.headers['x-user-id'] || 'usr-student-01';
    const sessions = await zuluChatService.getUserSessions(userId);
    res.json({ success: true, sessions });
  } catch (err) {
    console.error('[Zulu Sessions GET Error]:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve chat sessions' });
  }
});

/**
 * POST /api/zulu/sessions
 * Create a new chat session thread
 */
router.post('/sessions', async (req, res) => {
  try {
    const { userId = 'usr-student-01', title = 'New Conversation' } = req.body || {};
    const session = await zuluChatService.createSession(userId, title);
    res.json({ success: true, session });
  } catch (err) {
    console.error('[Zulu Sessions POST Error]:', err);
    res.status(500).json({ success: false, message: 'Failed to create chat session' });
  }
});

/**
 * GET /api/zulu/sessions/:id
 * Get all messages for a specific session thread
 */
router.get('/sessions/:id', async (req, res) => {
  try {
    const sessionId = req.params.id;
    const userId = req.query.userId || req.headers['x-user-id'] || 'usr-student-01';
    const messages = await zuluChatService.getSessionMessages(sessionId, userId);
    res.json({ success: true, sessionId, messages });
  } catch (err) {
    console.error('[Zulu Session Messages GET Error]:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch session messages' });
  }
});

/**
 * DELETE /api/zulu/sessions/:id
 * Delete a specific chat session thread
 */
router.delete('/sessions/:id', async (req, res) => {
  try {
    const sessionId = req.params.id;
    const userId = req.query.userId || req.headers['x-user-id'] || 'usr-student-01';
    await zuluChatService.deleteSession(sessionId, userId);
    res.json({ success: true, message: 'Session deleted successfully' });
  } catch (err) {
    console.error('[Zulu Session DELETE Error]:', err);
    res.status(500).json({ success: false, message: 'Failed to delete chat session' });
  }
});

/**
 * POST /api/zulu/chat
 * Primary chat execution endpoint with history persistence
 */
router.post('/chat', async (req, res) => {
  try {
    const { message = '', history = [], context = {}, sessionId = null, userId = 'usr-student-01' } = req.body || {};

    const cleanMessage = (typeof message === 'string' ? message : '').trim();
    if (!cleanMessage) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid question or message for Zulu AI.'
      });
    }

    // 1. Ensure active session ID
    let targetSessionId = sessionId;
    if (!targetSessionId) {
      const newSession = await zuluChatService.createSession(userId, cleanMessage.substring(0, 35) + '...');
      targetSessionId = newSession.id;
    }

    // 2. Persist incoming user message to session history
    await zuluChatService.addMessageToSession(targetSessionId, userId, 'user', cleanMessage, null);

    // 3. Attempt Live Google Gemini Generation or Smart Response Engine
    let replyText = '';
    let providerName = 'zulu-ai-engine';

    const geminiResult = await generateWithGemini(cleanMessage, history, context);
    if (geminiResult && geminiResult.text) {
      replyText = geminiResult.text;
      providerName = geminiResult.model || 'zulu-ai-engine';
    } else {
      replyText = generateSmartZuluResponse(cleanMessage, context);
    }

    // 4. Persist Zulu AI response message to session history
    await zuluChatService.addMessageToSession(targetSessionId, userId, 'zulu', replyText, providerName);

    return res.json({
      success: true,
      sessionId: targetSessionId,
      provider: providerName,
      reply: replyText
    });
  } catch (err) {
    console.error('[Zulu Chat Handler Error]:', err);
    return res.status(500).json({
      success: false,
      message: 'Zulu AI is currently taking a brief moment to synchronize. Please try asking your question again.'
    });
  }
});

/**
 * GET /api/zulu/status
 * Health and configuration status of Zulu AI engine
 */
router.get('/status', (req, res) => {
  const isConfigured = isGoogleApiConfigured();
  const hasMain = Boolean(getMainApiKey());
  const hasBackup = Boolean(getBackupApiKey());

  res.json({
    success: true,
    engine: 'Zulu AI (LangGraph Failover Orchestrator)',
    googleApiConfigured: isConfigured,
    keys: {
      mainConfigured: hasMain,
      backupConfigured: hasBackup
    },
    activeModel: isConfigured ? 'LangGraph Orchestrator' : 'zulu-ai-engine'
  });
});

module.exports = router;
