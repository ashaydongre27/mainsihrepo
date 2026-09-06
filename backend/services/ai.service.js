/**
 * JOBLEX AI Orchestration Service
 * Powered by LangChain & LangGraph with Multi-Key Failover (Main + Backup)
 * Ministry of Ayush / All India Institute of Ayurveda | Problem Statement ID: 26044
 */

let ChatGoogleGenerativeAI, SystemMessage, HumanMessage, AIMessage, StateGraph, END, START, Annotation, GoogleGenerativeAI;
try { ({ ChatGoogleGenerativeAI } = require('@langchain/google-genai')); } catch (e) {}
try { ({ SystemMessage, HumanMessage, AIMessage } = require('@langchain/core/messages')); } catch (e) {}
try { ({ StateGraph, END, START, Annotation } = require('@langchain/langgraph')); } catch (e) {}
try { ({ GoogleGenerativeAI } = require('@google/generative-ai')); } catch (e) {}

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
 * Retrieve NVIDIA NIM API Key
 */
function getNvidiaApiKey() {
  const key = process.env.NVIDIA_API_KEY;
  if (!key || typeof key !== 'string' || key.trim() === '' || key.includes('placeholder')) {
    return null;
  }
  return key.trim();
}

/**
 * Call NVIDIA via NVCF pexec endpoint (verified working with this key)
 * Primary: ai-gpt-oss-20b (function 24d90582, version 701ca393)
 * Fallback: ai-deepseek-v4-pro-0813 (function 6e70713f)
 */
async function callNvidiaModel({ prompt, systemInstruction = '', history = [], temperature = 0.7 }) {
  const apiKey = getNvidiaApiKey();
  if (!apiKey) return null;

  const NVCF_MODELS = [
    {
      name: 'gpt-oss-20b',
      url: 'https://api.nvcf.nvidia.com/v2/nvcf/pexec/functions/24d90582-d41c-4fc6-adc0-53c97f5a710f/versions/701ca393-dc00-4457-a769-c3147960cc3a'
    },
    {
      name: 'deepseek-v4-pro',
      url: 'https://api.nvcf.nvidia.com/v2/nvcf/pexec/functions/6e70713f-4eeb-4ef7-b4f8-2d984f4141f6'
    }
  ];

  const messages = [];
  if (systemInstruction) messages.push({ role: 'system', content: systemInstruction });
  for (const h of history) {
    if (h.role && h.content) messages.push({ role: h.role === 'model' ? 'assistant' : h.role, content: h.content });
  }
  messages.push({ role: 'user', content: prompt });

  for (const { name, url } of NVCF_MODELS) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ messages, max_tokens: 1024, stream: false }),
        signal: AbortSignal.timeout(25000)
      });
      if (!res.ok) {
        console.warn(`[NVIDIA] ${name} returned HTTP ${res.status}`);
        continue;
      }
      const data = await res.json();
      const choice = data?.choices?.[0]?.message;
      // gpt-oss-20b uses reasoning_content when content is null
      const text = choice?.content || choice?.reasoning_content || choice?.reasoning;
      if (text && text.trim()) {
        return { text: text.trim(), provider: `nvidia-${name}`, keyType: 'nvidia' };
      }
    } catch (err) {
      console.warn(`[NVIDIA] ${name} error:`, err.message);
    }
  }
  return null;
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
      const modelConfig = {
        model: modelName,
        generationConfig: {
          temperature: temperature,
          responseMimeType: jsonMode ? 'application/json' : undefined
        }
      };
      if (systemInstruction) {
        modelConfig.systemInstruction = { parts: [{ text: systemInstruction }] };
      }
      const model = genAI.getGenerativeModel(modelConfig);

      let responseText = null;
      let timerId;
      const timeoutPromise = new Promise((_, r) => {
        timerId = setTimeout(() => r(new Error('SDK timeout')), 8000);
      });

      try {
        let opPromise;
        if (Array.isArray(history) && history.length > 0) {
          const formattedHistory = history
            .filter(h => h.role && h.text)
            .map(h => ({
              role: h.role === 'user' ? 'user' : 'model',
              parts: [{ text: h.text }]
            }));

          const chat = model.startChat({ history: formattedHistory });
          opPromise = chat.sendMessage(prompt);
        } else {
          opPromise = model.generateContent(prompt);
        }

        const result = await Promise.race([opPromise, timeoutPromise]);
        responseText = result.response.text();
      } finally {
        clearTimeout(timerId);
      }

      if (responseText && responseText.trim()) {
        return { text: responseText.trim(), model: modelName };
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
      if (systemInstruction) {
        messages.push(new SystemMessage(systemInstruction));
      }
      if (Array.isArray(history) && history.length > 0) {
        history.forEach(h => {
          if (h.role === 'user' && h.text) messages.push(new HumanMessage(h.text));
          else if (h.text) messages.push(new AIMessage(h.text));
        });
      }
      messages.push(new HumanMessage(prompt));

      let lcTimerId;
      const lcTimeout = new Promise((_, reject) => {
        lcTimerId = setTimeout(() => reject(new Error(`LangChain ${modelName} timeout`)), 6000);
      });

      try {
        const response = await Promise.race([chat.invoke(messages), lcTimeout]);
        const text = typeof response.content === 'string' ? response.content : JSON.stringify(response.content);
        if (text && text.trim()) {
          return { text: text.trim(), model: `langchain-${modelName}` };
        }
      } finally {
        clearTimeout(lcTimerId);
      }
    } catch (lcErr) {
      console.warn(`[LangChain ${modelName}]:`, lcErr.message);
    }
  }

  // 3. Direct REST Fallback with timeout and secure header authentication
  for (const modelName of candidateModels) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent`;
      const ctrl = new AbortController();
      const timeoutId = setTimeout(() => ctrl.abort(), 6000);

      const reqBody = {
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: temperature,
          responseMimeType: jsonMode ? 'application/json' : undefined
        }
      };
      if (systemInstruction) {
        reqBody.systemInstruction = { parts: [{ text: systemInstruction }] };
      }

      const restRes = await fetch(endpoint, {
        method: 'POST',
        signal: ctrl.signal,
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey
        },
        body: JSON.stringify(reqBody)
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
    return { error: 'Backup API key not configured' };
  }

  console.log(' [LangGraph]: Main key exhausted. Seamlessly routing request to Backup Google API Key...');

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
 * LangGraph State Definition and Compilation for Failover Orchestration
 */
let failoverGraph = null;
if (StateGraph && Annotation && typeof Annotation.Root === 'function') {
  try {
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

    failoverGraph = new StateGraph(OrchestrationState)
      .addNode('main_key_worker', runWithMainKey)
      .addNode('backup_key_worker', runWithBackupKey)
      .addEdge(START, 'main_key_worker')
      .addConditionalEdges('main_key_worker', routeAfterMain, {
        [END]: END,
        backup_key_worker: 'backup_key_worker'
      })
      .addEdge('backup_key_worker', END)
      .compile();
  } catch (err) {
    console.warn('[LangGraph Init Notice]: Could not compile LangGraph, falling back to direct failover executor:', err.message);
    failoverGraph = null;
  }
}

/**
 * Public Orchestrator Entrypoint
 * Accepts prompt, systemInstruction, history, temperature, jsonMode
 * Chain: Gemini main → Gemini backup → NVIDIA NIM
 */
async function generateWithFailover({ prompt, systemInstruction = '', history = [], temperature = 0.7, jsonMode = false }) {
  const hasGemini = isGoogleApiConfigured();
  const hasNvidia = Boolean(getNvidiaApiKey());

  // Nothing configured at all — bail immediately
  if (!hasGemini && !hasNvidia) {
    return null;
  }

  if (hasGemini) {
    if (failoverGraph) {
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
        console.warn('[LangGraph Orchestrator Execution Failure]:', graphErr.message);
      }
    }

    // Direct Gemini failover
    const mainRes = await runWithMainKey({ prompt, systemInstruction, history, temperature, jsonMode });
    if (mainRes && mainRes.resultText) {
      return { text: mainRes.resultText, provider: mainRes.provider || 'gemini-primary', keyType: 'main' };
    }

    const backupRes = await runWithBackupKey({ prompt, systemInstruction, history, temperature, jsonMode });
    if (backupRes && backupRes.resultText) {
      return { text: backupRes.resultText, provider: backupRes.provider || 'gemini-backup', keyType: 'backup' };
    }
  }

  // NVIDIA NIM fallback (or primary when Gemini is not configured)
  if (hasNvidia) {
    console.log('[AI] Falling back to NVIDIA NIM...');
    const nvidiaRes = await callNvidiaModel({ prompt, systemInstruction, history, temperature });
    if (nvidiaRes) return nvidiaRes;
  }

  return null;
}

module.exports = {
  getMainApiKey,
  getBackupApiKey,
  getNvidiaApiKey,
  isGoogleApiConfigured,
  callNvidiaModel,
  generateWithFailover
};
