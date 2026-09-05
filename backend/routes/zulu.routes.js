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

const ZULU_SYSTEM_INSTRUCTION = `You are Zulu, the premier AI Career & Research Counselor for JOBLEX — the flagship Academia-Industry Collaboration Platform developed for the Ministry of Ayush and All India Institute of Ayurveda (AIIA) (Problem Statement ID: 26044).

Your role & expertise:
1. Provide deep, actionable guidance bridging classical Ayush traditions (Ayurveda, Yoga, Unani, Siddha, Homeopathy) with modern analytical scientific methodologies (HPLC, HPTLC fingerprinting, LC-MS, phytochemistry, in-silico AutoDock molecular docking, clinical trials, GLP/GCP standards).
2. Recommend concrete career milestones, corporate research roles at industry partners (Dabur Research, Himalaya Wellness, Patanjali, Charak, etc.), sponsored research fellowships, and paid micro-gigs.
3. Guide students on closing competency gaps identified in their resumes against corporate hiring benchmarks.
4. Support curriculum modernization initiatives aligned with the National Education Policy (NEP-2020) and NAAC criteria.
5. Emphasize gamified learning: explain how Anti-Decay XP freezes upon completing quizzes and active check-ins, boosting priority in Reverse Application inbound talent pools.

Tone & Style:
- Professional, knowledgeable, inspiring, and culturally respectful (you may greet with "Namaste 🌿").
- Structure complex advice with clear bullet points and bold highlights.
- Keep responses focused, encouraging, and free of fluff or technical jargon unless contextual.
- Never output programming syntax errors or system trace dumps.`;

/**
 * Call Google Gemini using LangGraph Orchestrator with Multi-Key Failover
 */
async function generateWithGemini(userMessage, conversationHistory = [], studentContext = null) {
  if (!isGoogleApiConfigured()) {
    return null;
  }

  let contextPrompt = '';
  if (studentContext && typeof studentContext === 'object') {
    const { name, institution, department, xp, streak, verifiedSkills, targetRole } = studentContext;
    contextPrompt = `[Student Profile Context: Name: ${name || 'Scholar'}, Institution: ${institution || 'AIIA'}, Department: ${department || 'Ayush'}, Current XP: ${xp || 0}, Streak: ${streak || 0} days, Target Role: ${targetRole || 'Research Scientist'}, Verified Skills: ${(verifiedSkills || []).join(', ') || 'Ayurvedic Pharmacognosy'}]\n\n`;
  }

  const promptToSend = contextPrompt ? `${contextPrompt}${userMessage}` : userMessage;

  const result = await generateWithFailover({
    prompt: promptToSend,
    systemInstruction: ZULU_SYSTEM_INSTRUCTION,
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
function getSystemGuidance(userMessage, studentContext) {
  return `Namaste! 🌿 I am **Zulu**, your AI Career & Research Counselor for the Ministry of Ayush & AIIA collaboration bridge.

To connect live real-time conversational responses with Google's Gemini models, please configure your **Google Gemini API Key** in the project's \`.env\` file:
\`\`\`env
GEMINI_API_KEY=your_actual_google_api_key_here
\`\`\`

### 🌟 What I Can Assist You With:
• **Career Roadmap Acceleration**: Guiding your progression from classical botany to advanced chromatographic analysis (HPTLC/HPLC) and in-silico drug discovery.
• **AI Resume Gap Discovery**: Cross-referencing your CV against real research hiring criteria from Dabur, Himalaya Wellness, and Patanjali.
• **Anti-Decay Competency XP**: Keeping your verified credentials active to maintain top placement ranking in recruiter inbound pools.
• **Academic Syllabus Modernization**: Aligning institution courses with emerging bio-technological industry demands under NEP-2020.

Once your API key is configured in \`.env\`, every query will be analyzed dynamically by Google Gemini!`;
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

    // 3. Attempt Live Google Gemini Generation
    let replyText = '';
    let providerName = 'zulu-guided-engine';

    const geminiResult = await generateWithGemini(cleanMessage, history, context);
    if (geminiResult && geminiResult.text) {
      replyText = geminiResult.text;
      providerName = geminiResult.model || 'gemini-3.6-flash';
    } else {
      replyText = getSystemGuidance(cleanMessage, context);
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
    engine: 'Zulu AI Career Companion (LangGraph Failover Orchestrator)',
    googleApiConfigured: isConfigured,
    keys: {
      mainConfigured: hasMain,
      backupConfigured: hasBackup
    },
    activeModel: isConfigured ? 'LangGraph (gemini-3.6-flash failover pool)' : 'guided-engine'
  });
});

module.exports = router;
