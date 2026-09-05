/**
 * JOBLEX Zulu AI Chat History Service
 * Handles persistent storage of student-specific chat threads & messages
 * Integrates with Supabase (zulu_chat_sessions & zulu_chat_messages)
 * with user-isolated in-memory fallback for offline/pre-migration usage.
 */

const { supabase, isConfigured } = require('../config/supabase');

// Fallback in-memory chat store mapped by userId
const memorySessions = [
  {
    id: 'sess-student-01',
    user_id: 'usr-student-01',
    title: 'Dabur R&D Competencies',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 3600000).toISOString()
  }
];

const memoryMessages = {
  'sess-student-01': [
    {
      id: 'msg-01',
      session_id: 'sess-student-01',
      user_id: 'usr-student-01',
      sender: 'zulu',
      message: 'Namaste 🌿 I am **Zulu**, your specialized Ayush Career & Research Counselor. How can I assist your career roadmap today?',
      provider: 'zulu-guided-engine',
      created_at: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: 'msg-02',
      session_id: 'sess-student-01',
      user_id: 'usr-student-01',
      sender: 'user',
      message: 'What are high-demand competencies for Dabur R&D?',
      provider: null,
      created_at: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: 'msg-03',
      session_id: 'sess-student-01',
      user_id: 'usr-student-01',
      sender: 'zulu',
      message: '🌿 **Key Competencies for Dabur R&D Roles**:\n\n• **Analytical Standardization**: High-Performance Thin-Layer Chromatography (HPTLC) fingerprinting and HPLC quantification.\n• **Regulatory Compliance**: Good Laboratory Practice (GLP) and Ayurvedic Pharmacopoeia of India (API) standards.\n• **In-Silico Drug Discovery**: Molecular docking using AutoDock and Python phytochemical analytics.\n• **Formulation Stability**: Accelerated thermal and humidity stability testing for botanical extracts.',
      provider: 'gemini-3.6-flash',
      created_at: new Date(Date.now() - 3590000).toISOString()
    }
  ]
};

/**
 * Fetch all sessions for a specific user
 */
async function getUserSessions(userId = 'usr-student-01') {
  if (isConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('zulu_chat_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        return data;
      }
    } catch (e) {
      console.warn('[ZuluChatService] Supabase session fetch fallback:', e.message);
    }
  }

  // Filter in-memory sessions strictly by userId
  const userSessions = memorySessions.filter(s => s.user_id === userId);
  
  // Auto-seed initial welcome session if user has no sessions yet
  if (userSessions.length === 0) {
    const defaultSess = {
      id: `sess-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      user_id: userId,
      title: 'New Conversation',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    memorySessions.unshift(defaultSess);
    memoryMessages[defaultSess.id] = [
      {
        id: `msg-${Date.now()}`,
        session_id: defaultSess.id,
        user_id: userId,
        sender: 'zulu',
        message: 'Namaste 🌿 I am **Zulu**, your specialized Ayush Career & Research Counselor. How can I assist your career roadmap today?',
        provider: 'zulu-guided-engine',
        created_at: new Date().toISOString()
      }
    ];
    return [defaultSess];
  }

  return userSessions;
}

/**
 * Create a new chat session for a specific user
 */
async function createSession(userId = 'usr-student-01', initialTitle = 'New Conversation') {
  const newId = `sess-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const now = new Date().toISOString();

  if (isConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('zulu_chat_sessions')
        .insert([{ user_id: userId, title: initialTitle }])
        .select()
        .single();

      if (!error && data) {
        return data;
      }
    } catch (e) {
      console.warn('[ZuluChatService] Supabase session insert fallback:', e.message);
    }
  }

  const memSession = {
    id: newId,
    user_id: userId,
    title: initialTitle,
    created_at: now,
    updated_at: now
  };
  memorySessions.unshift(memSession);
  memoryMessages[newId] = [
    {
      id: `msg-${Date.now()}`,
      session_id: newId,
      user_id: userId,
      sender: 'zulu',
      message: 'Namaste 🌿 I am **Zulu**, your specialized Ayush Career & Research Counselor. How can I assist your career roadmap today?',
      provider: 'zulu-guided-engine',
      created_at: now
    }
  ];
  return memSession;
}

/**
 * Fetch messages for a session (with user ownership validation)
 */
async function getSessionMessages(sessionId, userId = 'usr-student-01') {
  if (isConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('zulu_chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

      if (!error && Array.isArray(data)) {
        return data;
      }
    } catch (e) {
      console.warn('[ZuluChatService] Supabase messages fetch fallback:', e.message);
    }
  }

  return memoryMessages[sessionId] || [];
}

/**
 * Add a message exchange to a session for a specific user
 */
async function addMessageToSession(sessionId, userId, sender, messageText, provider = null) {
  const now = new Date().toISOString();

  if (isConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('zulu_chat_messages')
        .insert([{
          session_id: sessionId,
          user_id: userId,
          sender: sender,
          message: messageText,
          provider: provider
        }])
        .select()
        .single();

      // Update session updated_at timestamp and title if default
      if (sender === 'user') {
        const titleSnippet = messageText.length > 35 ? messageText.substring(0, 35) + '...' : messageText;
        await supabase
          .from('zulu_chat_sessions')
          .update({ updated_at: now, title: titleSnippet })
          .eq('id', sessionId)
          .eq('user_id', userId);
      }

      if (!error && data) {
        return data;
      }
    } catch (e) {
      console.warn('[ZuluChatService] Supabase message insert fallback:', e.message);
    }
  }

  if (!memoryMessages[sessionId]) {
    memoryMessages[sessionId] = [];
  }

  const msgObj = {
    id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    session_id: sessionId,
    user_id: userId,
    sender: sender,
    message: messageText,
    provider: provider,
    created_at: now
  };
  memoryMessages[sessionId].push(msgObj);

  const sessionObj = memorySessions.find(s => s.id === sessionId && s.user_id === userId);
  if (sessionObj) {
    sessionObj.updated_at = now;
    if (sender === 'user' && (sessionObj.title === 'New Conversation' || sessionObj.title === 'Zulu AI')) {
      sessionObj.title = messageText.length > 35 ? messageText.substring(0, 35) + '...' : messageText;
    }
  }

  return msgObj;
}

/**
 * Delete a chat session for a specific user
 */
async function deleteSession(sessionId, userId = 'usr-student-01') {
  if (isConfigured && supabase) {
    try {
      await supabase
        .from('zulu_chat_sessions')
        .delete()
        .eq('id', sessionId)
        .eq('user_id', userId);
    } catch (e) {
      console.warn('[ZuluChatService] Supabase session delete fallback:', e.message);
    }
  }

  const idx = memorySessions.findIndex(s => s.id === sessionId && s.user_id === userId);
  if (idx !== -1) memorySessions.splice(idx, 1);
  delete memoryMessages[sessionId];

  return { success: true };
}

module.exports = {
  getUserSessions,
  createSession,
  getSessionMessages,
  addMessageToSession,
  deleteSession
};
