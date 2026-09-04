/**
 * JOBLEX Zulu AI Career Counselor Routes (Node.js / Express)
 * Powered by Google Gemini API (@google/generative-ai & REST)
 * Ministry of Ayush / All India Institute of Ayurveda | Problem Statement ID: 26044
 */

const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

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
 * Helper to get a configured Google Generative AI client
 */
function getGeminiApiKey() {
  const key = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!key || key.trim() === '' || key.includes('your_gemini_api_key')) {
    return null;
  }
  return key.trim();
}

/**
 * Call Google Gemini using official SDK with model fallback
 */
async function generateWithGemini(userMessage, conversationHistory = [], studentContext = null) {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    return null;
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const candidateModels = ['gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-1.5-pro'];

  // Format context prefix
  let contextPrompt = '';
  if (studentContext && typeof studentContext === 'object') {
    const { name, institution, department, xp, streak, verifiedSkills, targetRole } = studentContext;
    contextPrompt = `[Student Profile Context: Name: ${name || 'Scholar'}, Institution: ${institution || 'AIIA'}, Department: ${department || 'Ayush'}, Current XP: ${xp || 1450}, Streak: ${streak || 7} days, Target Role: ${targetRole || 'Research Scientist'}, Verified Skills: ${(verifiedSkills || []).join(', ') || 'Ayurvedic Pharmacognosy'}]\n\n`;
  }

  for (const modelName of candidateModels) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: ZULU_SYSTEM_INSTRUCTION
      });

      // Format conversation history for multi-turn chat
      if (Array.isArray(conversationHistory) && conversationHistory.length > 0) {
        const formattedHistory = conversationHistory
          .filter(h => h.role && h.text)
          .map(h => ({
            role: h.role === 'user' ? 'user' : 'model',
            parts: [{ text: h.text }]
          }));

        const chat = model.startChat({
          history: formattedHistory,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1000
          }
        });

        const promptToSend = contextPrompt ? `${contextPrompt}${userMessage}` : userMessage;
        const result = await chat.sendMessage(promptToSend);
        const responseText = result.response.text();
        if (responseText) {
          return { text: responseText.trim(), model: modelName };
        }
      } else {
        // Single prompt generation
        const fullPrompt = `${contextPrompt}${userMessage}`;
        const result = await model.generateContent({
          contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1000
          }
        });

        const responseText = result.response.text();
        if (responseText) {
          return { text: responseText.trim(), model: modelName };
        }
      }
    } catch (err) {
      console.error(`[Zulu Gemini SDK Error on ${modelName}]:`, err.message);
      // Try next candidate model
      continue;
    }
  }

  // Fallback to direct REST API if SDK encountered issues
  try {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const restResponse = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: `${ZULU_SYSTEM_INSTRUCTION}\n\n${contextPrompt}${userMessage}` }]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000
        }
      })
    });

    if (restResponse.ok) {
      const data = await restResponse.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        return { text: text.trim(), model: 'gemini-1.5-flash-rest' };
      }
    } else {
      console.error('[Zulu Gemini REST API Error]: Status', restResponse.status);
    }
  } catch (restErr) {
    console.error('[Zulu Gemini REST Call Failed]:', restErr.message);
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

/**
 * POST /api/zulu/chat
 * Primary chat endpoint for Zulu AI
 */
router.post('/chat', async (req, res) => {
  try {
    const { message = '', history = [], context = {} } = req.body || {};

    const cleanMessage = (typeof message === 'string' ? message : '').trim();
    if (!cleanMessage) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid question or message for Zulu AI.'
      });
    }

    // 1. Attempt Live Google Gemini Generation
    const geminiResult = await generateWithGemini(cleanMessage, history, context);
    if (geminiResult && geminiResult.text) {
      return res.json({
        success: true,
        provider: geminiResult.model,
        reply: geminiResult.text
      });
    }

    // 2. If API Key is not set or temporarily unavailable, provide professional system guidance
    const guidanceReply = getSystemGuidance(cleanMessage, context);
    return res.json({
      success: true,
      provider: 'zulu-guided-engine',
      reply: guidanceReply
    });
  } catch (err) {
    console.error('[Zulu Chat Handler Error]:', err);
    // Return friendly, safe response without raw backend stack trace
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
  const hasKey = Boolean(getGeminiApiKey());
  res.json({
    success: true,
    engine: 'Zulu AI Career Companion',
    googleApiConfigured: hasKey,
    activeModel: hasKey ? 'gemini-1.5-flash / gemini-2.0-flash' : 'guided-engine'
  });
});

module.exports = router;
