import React, { useState } from 'react';

const initialOpps = [
  { id: 1, title: 'Research Intern', company: 'Dabur India Ltd.', type: 'Internship', skills: ['Herbal Formulation', 'Clinical Research'], location: 'Remote', stipend: '₹15,000/mo', deadline: 'Oct 15, 2026' },
  { id: 2, title: 'Ayush Innovation Challenge', company: 'Ministry of Ayush', type: 'Hackathon', skills: ['Python', 'Machine Learning', 'Data Analysis'], location: 'New Delhi', stipend: 'Prize: ₹2L', deadline: 'Nov 01, 2026' },
  { id: 3, title: 'Formulation Scientist', company: 'Patanjali Ayurved', type: 'Job', skills: ['Ayurvedic Pharmacognosy', 'Advanced Therapeutics'], location: 'Haridwar', stipend: '₹8-12 LPA', deadline: 'Sep 30, 2026' },
  { id: 4, title: 'AI Healthcare Intern', company: 'HealthTech Startup', type: 'Internship', skills: ['NLP', 'Python', 'Communication'], location: 'Bangalore', stipend: '₹20,000/mo', deadline: 'Oct 20, 2026' },
  { id: 5, title: 'Data Analyst (Ayush Metrics)', company: 'NITI Aayog', type: 'Job', skills: ['Data Analysis', 'Python', 'Teamwork'], location: 'New Delhi', stipend: '₹6-9 LPA', deadline: 'Dec 05, 2026' },
  { id: 6, title: 'Global Wellness Hackathon', company: 'WHO', type: 'Hackathon', skills: ['Clinical Research', 'Communication'], location: 'Online', stipend: 'Prize: $5000', deadline: 'Oct 10, 2026' }
];

const OpportunitiesBoard = () => {
  const [filter, setFilter] = useState('All');

  const filteredOpps = filter === 'All' ? initialOpps : initialOpps.filter(o => o.type === filter);

  const getTypeColor = (type) => {
    switch(type) {
      case 'Internship': return 'bg-green-900/50 text-green-400 border-green-500/50';
      case 'Job': return 'bg-blue-900/50 text-blue-400 border-blue-500/50';
      case 'Hackathon': return 'bg-purple-900/50 text-purple-400 border-purple-500/50';
      default: return 'bg-gray-800 text-gray-300 border-gray-600';
    }
  };

  return (
    <div className="w-full space-y-5">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">JOBLEX Opportunities</h2>
          <p className="text-gray-400 text-xs sm:text-sm mt-0.5">Discover internships, jobs, and hackathons tailored to your skills.</p>
        </div>
        
        <div className="flex bg-gray-900/80 p-1 rounded-xl border border-gray-700 backdrop-blur-sm overflow-x-auto no-scrollbar self-stretch sm:self-auto">
          {['All', 'Internship', 'Job', 'Hackathon'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter === f 
                  ? 'bg-gray-700 text-white shadow-sm' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 pb-6">
        {filteredOpps.map(opp => (
          <div key={opp.id} className="bg-gray-900/50 p-5 sm:p-6 rounded-2xl border border-gray-800 hover:border-cyan-500/50 transition-all flex flex-col justify-between backdrop-blur-sm group hover:-translate-y-0.5 shadow-md">
            <div>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">{opp.title}</h3>
                  <p className="text-xs text-gray-400 font-medium mt-0.5">{opp.company}</p>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getTypeColor(opp.type)}`}>
                  {opp.type}
                </span>
              </div>
              
              <div className="flex flex-wrap gap-1.5 mb-4">
                {opp.skills.map((skill, idx) => (
                  <span key={idx} className="px-2 py-0.5 bg-gray-800 rounded-md border border-gray-700 text-[11px] text-gray-300">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            
            <div>
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-400 mb-4 pt-3 border-t border-gray-800">
                <div className="flex items-center"><span className="mr-1.5 opacity-60">📍</span> {opp.location}</div>
                <div className="flex items-center"><span className="mr-1.5 opacity-60">💰</span> {opp.stipend}</div>
                <div className="flex items-center col-span-2"><span className="mr-1.5 opacity-60">⏳</span> Deadline: {opp.deadline}</div>
              </div>
              
              <button 
                onClick={() => alert(`Applying to ${opp.title}... (Mock Application via JOBLEX)`)}
                className="w-full py-2.5 bg-gray-800 hover:bg-cyan-900/40 border border-gray-700 hover:border-cyan-500 text-white rounded-xl transition-colors text-xs font-semibold"
              >
                Apply Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OpportunitiesBoard;
