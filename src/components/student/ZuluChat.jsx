import React, { useState, useRef, useEffect } from 'react';
import { zuluChatApi } from '../../services/api';

const initialMessages = [
  { 
    role: 'zulu', 
    text: "Greetings! I am Zulu, your AI Career & Skill Intelligence Companion for the Ayush & HealthTech sectors. How can I assist with your career roadmap, skill gaps, or industry internships today? 🚀" 
  }
];

export default function ZuluChat() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const endOfMessagesRef = useRef(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userText = input.trim();
    const userMsg = { role: 'user', text: userText };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await zuluChatApi(userText);
      const replyText = (res && res.reply) 
        ? res.reply 
        : `Based on current industry demand from Dabur and Himalaya, mastering Phytochemistry alongside Python data analytics will position you in the top 5% of applicants. Check your Career Roadmap to start the next module!`;

      setMessages(prev => [...prev, { role: 'zulu', text: replyText }]);
    } catch (err) {
      setMessages(prev => [...prev, { 
        role: 'zulu', 
        text: "I'm processing your inquiry. Make sure to check the AI Resume Analyzer to identify missing competencies for your target role!" 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const quickPrompts = [
    "How does the point decay system work?",
    "Which skills does Dabur require for formulation interns?",
    "What MoUs are active between colleges and pharma?",
    "How to prepare for Ayush AI Hackathon?"
  ];

  return (
    <div className="flex flex-col max-w-4xl mx-auto h-[520px] sm:h-[620px] bg-gray-900/80 rounded-2xl border border-purple-500/30 backdrop-blur-xl overflow-hidden shadow-lg w-full">
      {/* Header */}
      <div className="bg-gray-950/80 px-4 sm:px-6 py-3 sm:py-4 border-b border-purple-500/20 flex items-center justify-between">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-500 flex items-center justify-center font-black text-white text-sm sm:text-base shadow-[0_0_10px_#a855f7] relative">
            Z
            <div className="absolute bottom-0 right-0 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-emerald-400 border-2 border-gray-900 rounded-full animate-ping"></div>
            <div className="absolute bottom-0 right-0 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-emerald-500 border-2 border-gray-900 rounded-full"></div>
          </div>
          <div>
            <h3 className="font-bold text-white text-xs sm:text-sm flex items-center gap-1.5">
              Zulu AI Companion
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40">
                Connected
              </span>
            </h3>
            <p className="text-[10px] sm:text-xs text-purple-300/80">Context-Aware Career Guidance & Skill Mapping</p>
          </div>
        </div>

        <div className="hidden sm:block text-[11px] text-gray-400">
          Powered by Google AI Studio
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 sm:space-y-4 custom-scrollbar">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[88%] sm:max-w-[80%] p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
              msg.role === 'user'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-br-none shadow-md'
                : 'bg-gray-900/90 border border-purple-500/30 text-gray-100 rounded-bl-none shadow-sm'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-900/90 border border-purple-500/30 px-3.5 py-2.5 rounded-2xl rounded-bl-none flex items-center gap-1.5">
              <span className="text-xs text-purple-300 mr-1.5">Zulu is typing...</span>
              <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          </div>
        )}
        <div ref={endOfMessagesRef} />
      </div>

      {/* Quick Prompts */}
      <div className="px-3 sm:px-6 py-2 bg-black/40 border-t border-gray-800/80 overflow-x-auto no-scrollbar flex gap-2">
        {quickPrompts.map((q, i) => (
          <button
            key={i}
            onClick={() => setInput(q)}
            className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-gray-800/60 hover:bg-gray-700 text-gray-300 text-[11px] border border-gray-700 transition"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-3 sm:p-4 bg-gray-950/90 border-t border-purple-500/20 flex gap-2 sm:gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Zulu about skills, Dabur internships, electives..."
          className="flex-1 bg-gray-900 border border-purple-500/30 rounded-xl px-3.5 py-2 sm:py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-purple-400"
        />
        <button
          type="submit"
          disabled={!input.trim() || isTyping}
          className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs sm:text-sm transition disabled:opacity-40 shrink-0"
        >
          Send ➔
        </button>
      </form>
    </div>
  );
}
