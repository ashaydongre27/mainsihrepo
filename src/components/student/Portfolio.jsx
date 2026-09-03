import React from 'react';

const Portfolio = () => {
  return (
    <div className="space-y-6 pb-8 w-full">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-gray-900/80 to-purple-900/40 p-5 sm:p-7 rounded-3xl border border-purple-500/30 backdrop-blur-sm flex flex-col sm:flex-row items-center gap-5 sm:gap-7 shadow-lg">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-purple-600 to-cyan-500 flex items-center justify-center text-3xl sm:text-4xl font-bold text-white border-4 border-gray-900 shadow-[0_0_15px_#a855f7] shrink-0">
          A
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">Ashay Verma</h1>
          <p className="text-sm text-gray-400 mb-3">Student • All India Institute of Ayurveda</p>
          <div className="flex flex-wrap justify-center sm:justify-start gap-2 sm:gap-3">
            <span className="px-3 py-1.5 bg-gray-800/80 rounded-xl border border-gray-700 font-mono text-xs text-purple-400">🔥 1450 XP Points</span>
            <span className="px-3 py-1.5 bg-gray-800/80 rounded-xl border border-gray-700 font-mono text-xs text-cyan-400">🎯 7-Day Streak</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
        {/* Left Column */}
        <div className="lg:col-span-1 space-y-5">
          <div className="bg-gray-900/60 p-5 rounded-2xl border border-gray-700 backdrop-blur-sm shadow-md">
            <h3 className="text-base font-bold mb-3 border-b border-gray-700 pb-2 text-white">Verified Skills</h3>
            <div className="space-y-2">
              {[
                { name: 'Python', stars: '⭐⭐⭐⭐' },
                { name: 'Communication', stars: '⭐⭐⭐⭐' },
                { name: 'Ayurvedic Pharmacognosy', stars: '⭐⭐⭐' },
                { name: 'Data Analysis', stars: '⭐⭐⭐' },
                { name: 'NLP', stars: '⭐⭐' }
              ].map(skill => (
                <div key={skill.name} className="flex justify-between items-center bg-gray-800/50 p-2.5 rounded-xl border border-gray-700/50 text-xs">
                  <span className="text-gray-300 font-medium">{skill.name}</span>
                  <span>{skill.stars}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-900/60 p-5 rounded-2xl border border-gray-700 backdrop-blur-sm shadow-md">
            <h3 className="text-base font-bold mb-3 border-b border-gray-700 pb-2 text-white">Achievements</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-purple-900/20 p-3 rounded-xl border border-purple-500/20 flex flex-col items-center text-center">
                <span className="text-2xl mb-1">🏆</span>
                <span className="text-[11px] text-purple-300 font-medium">Quiz Master</span>
              </div>
              <div className="bg-cyan-900/20 p-3 rounded-xl border border-cyan-500/20 flex flex-col items-center text-center">
                <span className="text-2xl mb-1">🔥</span>
                <span className="text-[11px] text-cyan-300 font-medium">7-Day Streak</span>
              </div>
              <div className="bg-green-900/20 p-3 rounded-xl border border-green-500/20 flex flex-col items-center text-center col-span-2">
                <span className="text-2xl mb-1">📚</span>
                <span className="text-[11px] text-green-300 font-medium">10 Skills Assessed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-gray-900/60 p-5 sm:p-6 rounded-2xl border border-gray-700 backdrop-blur-sm shadow-md">
            <h3 className="text-base font-bold mb-3 border-b border-gray-700 pb-2 text-white">Projects</h3>
            <div className="space-y-3">
              <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700 hover:border-cyan-500/50 transition-colors">
                <h4 className="text-sm sm:text-base font-bold text-cyan-400 mb-1">Ayush Herb Identifier App</h4>
                <p className="text-gray-400 text-xs mb-3 leading-relaxed">A mobile application utilizing machine learning (CNNs) to identify medicinal plants from images and provide usage information based on classical texts.</p>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 bg-gray-900 rounded-md text-[10px] border border-gray-700 text-gray-300">Python</span>
                  <span className="px-2 py-0.5 bg-gray-900 rounded-md text-[10px] border border-gray-700 text-gray-300">Machine Learning</span>
                  <span className="px-2 py-0.5 bg-gray-900 rounded-md text-[10px] border border-gray-700 text-gray-300">React Native</span>
                </div>
              </div>
              <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700 hover:border-purple-500/50 transition-colors">
                <h4 className="text-sm sm:text-base font-bold text-purple-400 mb-1">Clinical Data Dashboard</h4>
                <p className="text-gray-400 text-xs mb-3 leading-relaxed">An interactive web dashboard for visualizing clinical trial data related to Ayurvedic formulations, highlighting efficacy metrics and patient demographics.</p>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 bg-gray-900 rounded-md text-[10px] border border-gray-700 text-gray-300">Data Analysis</span>
                  <span className="px-2 py-0.5 bg-gray-900 rounded-md text-[10px] border border-gray-700 text-gray-300">React</span>
                  <span className="px-2 py-0.5 bg-gray-900 rounded-md text-[10px] border border-gray-700 text-gray-300">D3.js</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-900/60 p-5 sm:p-6 rounded-2xl border border-gray-700 backdrop-blur-sm shadow-md">
            <h3 className="text-base font-bold mb-3 border-b border-gray-700 pb-2 text-white">Certifications</h3>
            <div className="space-y-3">
              {[
                { title: 'Ayurvedic Pharmacology Basics', issuer: 'All India Institute of Ayurveda (AIIA)', date: 'Jan 2026' },
                { title: 'Applied Data Science with Python', issuer: 'Coursera', date: 'Nov 2025' },
                { title: 'Introduction to Natural Language Processing', issuer: 'NPTEL', date: 'Aug 2025' }
              ].map((cert, i) => (
                <div key={i} className="flex items-start bg-gray-800/30 p-3.5 rounded-xl border border-gray-700/50">
                  <div className="w-8 h-8 rounded-lg bg-gray-700 flex items-center justify-center mr-3 text-lg shrink-0">📜</div>
                  <div>
                    <h4 className="font-bold text-gray-200 text-xs sm:text-sm">{cert.title}</h4>
                    <p className="text-xs text-gray-400">{cert.issuer}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">Issued: {cert.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
