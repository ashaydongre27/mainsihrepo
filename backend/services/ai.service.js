/**
 * JOBLEX AI Orchestration Service
 * Powered by LangChain & LangGraph with Multi-Key Failover (Main + Backup)
 * Ministry of Ayush / All India Institute of Ayurveda | Problem Statement ID: 26044
 */

const { ChatGoogleGenerativeAI } = require('@langchain/google-genai');
const { SystemMessage, HumanMessage, AIMessage } = require('@langchain/core/messages');
const { StateGraph, END, START, Annotation } = require('@langchain/langgraph');
const { GoogleGenerativeAI } = require('@google/generative-ai');

/**
 * Retrieve sanitized Main API Key
 */
function getMainApiKey() {
  const key = process.env.GEMINI_API_KEY || 
              process.env.GOOGLE_API_KEY_MAIN || 
              process.env.GOOGLE_API_KEY;
  if (!key || typeof key !== 'string' || key.trim() === '' || key.includes('your_gemini') || key.includes('placeholder')) {
    return null;
  }
  return key.trim();
}

/**
 * Retrieve sanitized Backup API Key
 */
function getBackupApiKey() {
  const key = process.env.GEMINI_API_KEY_BACKUP || 
              process.env.GOOGLE_API_KEY_BACKUP;
  if (!key || typeof key !== 'string' || key.trim() === '' || key.includes('your_gemini') || key.includes('placeholder')) {
    return null;
  }
  return key.trim();
}

/**
 * Check if at least one Google API key is configured
 */
function isGoogleApiConfigured() {
  return Boolean(getMainApiKey() || getBackupApiKey());
}

/**
 * Low-level generator using LangChain with SDK/REST fallback for a specific key
 */
async function callGoogleModelWithKey(apiKey, { prompt, systemInstruction, history = [], temperature = 0.7, jsonMode = false }) {
  if (!apiKey) return null;

  const candidateModels = [
    'gemini-2.5-flash',
    'gemini-2.0-flash',
    'gemini-1.5-flash',
    'gemini-2.0-flash-lite',
    'gemini-1.5-pro'
  ];

  // 1. Direct High-Speed Google Generative AI SDK (sub-3s latency)
  for (const modelName of candidateModels) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          temperature: temperature,
          responseMimeType: jsonMode ? 'application/json' : undefined
        }
      });

      let responseText = null;
      if (Array.isArray(history) && history.length > 0) {
        const formattedHistory = history
          .filter(h => h.role && h.text)
          .map(h => ({
            role: h.role === 'user' ? 'user' : 'model',
            parts: [{ text: h.text }]
          }));

        const chat = model.startChat({ history: formattedHistory });
        const result = await Promise.race([
          chat.sendMessage(prompt),
          new Promise((_, r) => setTimeout(() => r(new Error('SDK chat timeout')), 8000))
        ]);
        responseText = result.response.text();
      } else {
        const result = await Promise.race([
          model.generateContent(prompt),
          new Promise((_, r) => setTimeout(() => r(new Error('SDK generateContent timeout')), 8000))
        ]);
        responseText = result.response.text();
      }

      if (responseText && responseText.trim()) {
        return { text: responseText.trim(), model: `gemini-${modelName}` };
      }
    } catch (sdkErr) {
      console.warn(`[Google SDK ${modelName}]:`, sdkErr.message);
    }
  }

  // 2. LangChain ChatGoogleGenerativeAI
  for (const modelName of candidateModels) {
    try {
      const chat = new ChatGoogleGenerativeAI({
        apiKey: apiKey,
        model: modelName,
        temperature: temperature,
        maxRetries: 0
      });

      const messages = [];
      if (Array.isArray(history) && history.length > 0) {
        history.forEach(h => {
          if (h.role === 'user' && h.text) messages.push(new HumanMessage(h.text));
          else if (h.text) messages.push(new AIMessage(h.text));
        });
      }
      messages.push(new HumanMessage(prompt));

      const response = await Promise.race([
        chat.invoke(messages),
        new Promise((_, reject) => setTimeout(() => reject(new Error(`LangChain ${modelName} timeout`)), 6000))
      ]);
      const text = typeof response.content === 'string' ? response.content : JSON.stringify(response.content);
      if (text && text.trim()) {
        return { text: text.trim(), model: `langchain-${modelName}` };
      }
    } catch (lcErr) {
      console.warn(`[LangChain ${modelName}]:`, lcErr.message);
    }
  }

  // 3. Direct REST Fallback with timeout
  for (const modelName of candidateModels) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
      const ctrl = new AbortController();
      const timeoutId = setTimeout(() => ctrl.abort(), 6000);

      const restRes = await fetch(endpoint, {
        method: 'POST',
        signal: ctrl.signal,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: temperature,
            responseMimeType: jsonMode ? 'application/json' : undefined
          }
        })
      });
      clearTimeout(timeoutId);

      if (restRes.ok) {
        const data = await restRes.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text && text.trim()) {
          return { text: text.trim(), model: `${modelName}-rest` };
        }
      }
    } catch (restErr) {
      console.warn(`[Google REST ${modelName}]:`, restErr.message);
    }
  }

  return null;
}

/**
 * LangGraph State Definition for Failover Orchestration
 */
const OrchestrationState = Annotation.Root({
  prompt: Annotation(),
  systemInstruction: Annotation(),
  history: Annotation(),
  temperature: Annotation(),
  jsonMode: Annotation(),
  resultText: Annotation(),
  provider: Annotation(),
  usedKeyType: Annotation(),
  error: Annotation()
});

/**
 * Node: Execute with Main API Key
 */
async function runWithMainKey(state) {
  const mainKey = getMainApiKey();
  if (!mainKey) {
    return { error: 'Main API key not configured' };
  }

  try {
    const res = await callGoogleModelWithKey(mainKey, {
      prompt: state.prompt,
      systemInstruction: state.systemInstruction,
      history: state.history,
      temperature: state.temperature,
      jsonMode: state.jsonMode
    });

    if (res && res.text) {
      return {
        resultText: res.text,
        provider: `${res.model}-primary`,
        usedKeyType: 'main'
      };
    }
  } catch (err) {
    console.warn('[LangGraph Main Key Error]:', err.message);
    return { error: err.message };
  }

  return { error: 'Main key generation returned empty' };
}

/**
 * Node: Execute with Backup API Key
 */
async function runWithBackupKey(state) {
  const backupKey = getBackupApiKey();
  if (!backupKey) {
    console.warn('[LangGraph]: Main key failed and no backup key is configured in .env.');
    return { error: 'Backup API key not configured' };
  }

  console.log('🔄 [LangGraph]: Main key failed/exhausted. Seamlessly routing request to Backup Google API Key...');

  try {
    const res = await callGoogleModelWithKey(backupKey, {
      prompt: state.prompt,
      systemInstruction: state.systemInstruction,
      history: state.history,
      temperature: state.temperature,
      jsonMode: state.jsonMode
    });

    if (res && res.text) {
      return {
        resultText: res.text,
        provider: `${res.model}-backup-failover`,
        usedKeyType: 'backup'
      };
    }
  } catch (err) {
    console.error('[LangGraph Backup Key Error]:', err.message);
    return { error: err.message };
  }

  return { error: 'Backup key generation returned empty' };
}

/**
 * Conditional router: Decide whether to invoke backup key or terminate
 */
function routeAfterMain(state) {
  if (state.resultText && state.resultText.trim()) {
    return END;
  }
  const hasBackup = Boolean(getBackupApiKey());
  if (hasBackup) {
    return 'backup_key_worker';
  }
  return END;
}

/**
 * Compile the LangGraph Failover Graph
 */
const failoverGraph = new StateGraph(OrchestrationState)
  .addNode('main_key_worker', runWithMainKey)
  .addNode('backup_key_worker', runWithBackupKey)
  .addEdge(START, 'main_key_worker')
  .addConditionalEdges('main_key_worker', routeAfterMain, {
    [END]: END,
    backup_key_worker: 'backup_key_worker'
  })
  .addEdge('backup_key_worker', END)
  .compile();

/**
 * Public Orchestrator Entrypoint
 * Accepts prompt, systemInstruction, history, temperature, jsonMode
 */
async function generateWithFailover({ prompt, systemInstruction = '', history = [], temperature = 0.7, jsonMode = false }) {
  if (!isGoogleApiConfigured()) {
    return null;
  }

  try {
    const finalState = await failoverGraph.invoke({
      prompt,
      systemInstruction,
      history,
      temperature,
      jsonMode
    });

    if (finalState && finalState.resultText) {
      return {
        text: finalState.resultText,
        provider: finalState.provider || 'langgraph-orchestrator',
        keyType: finalState.usedKeyType || 'main'
      };
    }
  } catch (graphErr) {
    console.error('[LangGraph Orchestrator Execution Failure]:', graphErr);
  }

  return null;
}

module.exports = {
  getMainApiKey,
  getBackupApiKey,
  isGoogleApiConfigured,
  generateWithFailover
};
