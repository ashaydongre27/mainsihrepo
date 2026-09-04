import React, { useState } from 'react';

const questions = [
  {
    question: "Which of the following is considered one of the three primary doshas in Ayurveda?",
    options: ["Prana", "Vata", "Chakra", "Ojas"],
    correct: 1
  },
  {
    question: "What is the primary function of Ashwagandha in herbal formulations?",
    options: ["Digestive aid", "Adaptogen for stress", "Cooling agent", "Respiratory clearer"],
    correct: 1
  },
  {
    question: "In Python, which library is most commonly used for basic Data Manipulation?",
    options: ["Django", "TensorFlow", "Pandas", "PyGame"],
    correct: 2
  },
  {
    question: "What does NLP stand for in the context of Machine Learning?",
    options: ["Neural Logic Processing", "Natural Language Processing", "Node Level Programming", "New Learning Protocol"],
    correct: 1
  },
  {
    question: "Which ancient text is considered a foundational treatise on Ayurveda?",
    options: ["Charaka Samhita", "Arthashastra", "Rigveda", "Upanishads"],
    correct: 0
  }
];

const QuizArena = () => {
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [score, setScore] = useState(0);

  const startQuiz = () => {
    setStarted(true);
    setFinished(false);
    setCurrentIdx(0);
    setScore(0);
    setSelectedOpt(null);
  };

  const handleSelect = (idx) => {
    setSelectedOpt(idx);
  };

  const handleNext = () => {
    if (selectedOpt === questions[currentIdx].correct) {
      setScore(score + 1);
    }
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setSelectedOpt(null);
    } else {
      setFinished(true);
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center p-2 sm:p-4">
      {!started && !finished && (
        <div className="w-full text-center bg-gray-900/60 p-6 sm:p-10 rounded-2xl border border-purple-500/30 backdrop-blur-md max-w-lg shadow-[0_0_40px_rgba(168,85,247,0.15)]">
          <div className="w-16 sm:w-20 h-16 sm:h-20 mx-auto mb-4 sm:mb-6 bg-gradient-to-br from-purple-600 to-cyan-500 rounded-full flex items-center justify-center shadow-[0_0_20px_#a855f7] animate-pulse">
            <span className="text-3xl sm:text-4xl">⚔️</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Quiz Arena</h2>
          <p className="text-xs sm:text-sm text-gray-300 mb-6 sm:mb-8">Test your knowledge across Technology and Ayush domains to earn XP and unlock new skill nodes.</p>
          <button 
            onClick={startQuiz}
            className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all transform hover:scale-105"
          >
            Start Challenge
          </button>
        </div>
      )}

      {started && !finished && (
        <div className="w-full max-w-2xl bg-gray-900/60 p-5 sm:p-8 rounded-2xl border border-gray-700 backdrop-blur-md">
          <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-3">
            <span className="text-purple-400 font-mono font-bold tracking-widest text-xs sm:text-sm">QUESTION {currentIdx + 1}/{questions.length}</span>
            <span className="text-cyan-400 font-mono text-xs sm:text-sm">Score: {score}</span>
          </div>
          
          <h3 className="text-lg sm:text-xl font-semibold mb-6 text-white leading-snug">{questions[currentIdx].question}</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6">
            {questions[currentIdx].options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                className={`p-3.5 sm:p-4 rounded-xl text-left transition-all border text-xs sm:text-sm ${
                  selectedOpt === idx 
                    ? 'bg-purple-900/40 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.4)] text-white' 
                    : 'bg-gray-800/50 border-gray-700 hover:border-gray-500 text-gray-300'
                }`}
              >
                <span className="inline-block w-6 font-mono text-purple-400 opacity-70">
                  {['A', 'B', 'C', 'D'][idx]}.
                </span>
                {opt}
              </button>
            ))}
          </div>
          
          <div className="flex justify-end">
            <button
              disabled={selectedOpt === null}
              onClick={handleNext}
              className={`w-full sm:w-auto px-8 py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                selectedOpt !== null 
                  ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.5)]' 
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              }`}
            >
              {currentIdx === questions.length - 1 ? 'Submit' : 'Next'}
            </button>
          </div>
        </div>
      )}

      {finished && (
        <div className="w-full text-center bg-gray-900/80 p-6 sm:p-10 rounded-2xl border border-cyan-500/50 backdrop-blur-md max-w-lg shadow-[0_0_40px_rgba(6,182,212,0.2)]">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Assessment Complete</h2>
          <div className="text-4xl sm:text-5xl font-black my-6 text-white">
            {score}/{questions.length}
          </div>
          <div className="bg-purple-900/30 border border-purple-500/30 p-3 sm:p-4 rounded-xl mb-6 inline-block">
            <span className="text-purple-400 font-bold text-base sm:text-lg">Earned {score * 50} XP 🔥</span>
          </div>
          <div>
            <button 
              onClick={startQuiz}
              className="px-6 py-2.5 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-xl transition-colors text-xs sm:text-sm font-semibold text-white"
            >
              Retry Quiz
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizArena;
