/**
 * JOBLEX Zulu AI Career Counselor Routes (Node.js / Express)
 * Powered by Google Gemini API (@google/generative-ai & REST)
 * Integrated with Supabase Zulu Chat History System
 * Ministry of Ayush / All India Institute of Ayurveda | Problem Statement ID: 26044
 */

const express = require('express');
const router = express.Router();
const { generateWithFailover, isGoogleApiConfigured, getMainApiKey, getBackupApiKey, getNvidiaApiKey } = require('../services/ai.service');
const zuluChatService = require('../services/zuluChat.service');

/**
 * Call AI (Gemini → NVIDIA NIM) using LangGraph Orchestrator with Multi-Key Failover
 */
async function generateWithGemini(userMessage, conversationHistory = [], studentContext = null) {
  const contextSnippet = studentContext ? `\nStudent Context: Role=${studentContext.role || 'Student'}, Year=${studentContext.year || 'N/A'}, Department=${studentContext.department || 'General'}` : '';
  const systemInstruction = `You are Zulu, an expert AI Career and Research Counselor for students across all academic disciplines and professional fields. Guide students on comprehensive career roadmaps, industry-specific research and development (R&D), academic and technical documentation, mastering domain-specific tools and methodologies, navigating institutional standards and accreditations, and securing corporate placements and internships.${contextSnippet}`;

  const result = await generateWithFailover({
    prompt: userMessage,
    systemInstruction,
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

  // 1. Tech, Software Engineering, AI & Web Development
  if (query.includes('software') || query.includes('coding') || query.includes('python') || query.includes('javascript') || query.includes('react') || query.includes('node') || query.includes('developer') || query.includes('engineer') || query.includes('ai') || query.includes('machine learning') || query.includes('data science') || query.includes('web')) {
    return `### Tech & Engineering Career Guidance

Hello **${name}**! Here is strategic guidance for technical and software development pathways:

1. **High-Demand Core Competencies**:
   - **Data Structures & Algorithms**: Fundamental for technical interviews and scalable system design.
   - **Modern Stack Proficiency**: Full-stack frameworks (React, Node.js/FastAPI) and relational/NoSQL databases.
   - **AI/ML & Cloud Integration**: Building with machine learning APIs, vector databases, and containerized deployment (Docker, CI/CD).

2. **Actionable Roadmap**:
   - Build a portfolio of 2-3 production-grade projects demonstrating end-to-end system architecture.
   - Explore active technical requisitions and hackathons on the **Opportunities Board**.
   - Check the **Career Roadmap** to log your verified coding assessments and earn XP!`;
  }

  // 2. Anti-Decay & Quiz Arena Mechanics
  if (query.includes('decay') || query.includes('freeze') || query.includes('xp') || query.includes('streak') || query.includes('point') || query.includes('quiz')) {
    return `### Anti-Decay XP & Competency Freeze Engine

Greetings **${name}**! Here is how your skill verification freeze works:

- **72-Hour Freeze Window**: Every completed Quiz Arena module or daily check-in freezes your competency score for 72 hours, preventing skill decay.
- **Streak Multiplier**: Maintaining your active streak provides a 1.5x XP boost across all micro-gigs and placement applications.
- **Recruiter Priority**: Students with active freeze status appear in the **Top 5% Inbound Candidate Pool** for industry partners.

*Tip*: Complete a quick 3-minute quiz in the **Quiz Arena** now to protect your current XP streak!`;
  }

  // 3. Research, Fellowships, Grants & Academia
  if (query.includes('fellowship') || query.includes('grant') || query.includes('mou') || query.includes('research') || query.includes('paper') || query.includes('publication')) {
    return `### Research Fellowships & Institutional MoU Pathways

Hello **${name}**! Here are actionable research and fellowship opportunities:

- **Institutional Research Grants**: Under accreditation criteria (NAAC / NIRF), students participating in sponsored research are eligible for project travel allowances and lab stipends.
- **Active Corporate MoUs**: University agreements with industry research labs enable shared access to high-performance instrumentation, supercomputing clusters, and dataset repositories.
- **Micro-Gigs & Project Bounties**: Browse the *Micro-Gig Task Board* for short-term data analysis, technical annotation, and prototyping bounties.

Let me know if you would like help drafting an abstract or project proposal!`;
  }

  // 4. Industry, Jobs & Internships
  if (query.includes('internship') || query.includes('job') || query.includes('company') || query.includes('placement') || query.includes('recruit') || query.includes('interview') || query.includes('career')) {
    return `### Industry Placement & Internship Roadmap

Hello **${name}**! Here are targeted strategies to accelerate corporate placements:

1. **Recruiter Evaluation Benchmarks**:
   - **Verified Skill Dossiers**: Employers prioritize candidates with verified project credentials over unverified resume bullet points.
   - **Practical Problem-Solving**: Demonstrating real-world project contributions and domain certifications.
   - **Domain Standards**: Familiarity with industry-standard tooling, version control, and documentation practices.

2. **Immediate Recommendations**:
   - Browse the **Internships Board** to review open requisitions aligned with your skill match.
   - Run a benchmark analysis on your resume via the **Resume Analyzer** to spot missing keywords.`;
  }

  // 5. Default General Response
  const topicWords = message.split(' ').slice(0, 5).join(' ');
  return `### Zulu AI Guidance: "${topicWords}..."

Hello **${name}**! Here is strategic guidance regarding your inquiry:

- **Strategic Overview**: Navigating **"${message.trim()}"** successfully requires pairing foundational domain knowledge with applied practical experience.
- **Key Recommendation**: Focus on strengthening your verified skill vectors in your portal profile and completing practical projects that demonstrate end-to-end execution.
- **Career Impact**: Completing verified assessments and milestones boosts your candidate readiness percentile and corporate recruiter visibility.

Feel free to ask follow-up questions about specific career pathways, technical certifications, or industry benchmark requirements!`;
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
      const titleSnippet = cleanMessage.length > 35 ? cleanMessage.substring(0, 35) + '...' : cleanMessage;
      const newSession = await zuluChatService.createSession(userId, titleSnippet);
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
  const hasNvidia = Boolean(getNvidiaApiKey());

  res.json({
    success: true,
    engine: 'Zulu AI (LangGraph Failover Orchestrator)',
    googleApiConfigured: isConfigured,
    nvidiaConfigured: hasNvidia,
    keys: {
      mainConfigured: hasMain,
      backupConfigured: hasBackup,
      nvidiaConfigured: hasNvidia
    },
    activeModel: isConfigured ? 'LangGraph Orchestrator' : (hasNvidia ? 'NVIDIA NIM' : 'offline-fallback')
  });
});

module.exports = router;
