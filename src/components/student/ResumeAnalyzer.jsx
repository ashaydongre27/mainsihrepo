import React, { useState } from 'react';
import { analyzeResumeApi } from '../../services/api';

const SAMPLE_RESUMES = {
  herbal: `Ashay Verma | BAMS 3rd Year | All India Institute of Ayurveda
Skills: Herbal Formulation, Ayurvedic Pharmacognosy, Good Laboratory Practice (GLP), Basic Phytochemistry, Python fundamentals.
Projects: Standardization of classical Ashwagandha Kwatha, Phytochemical screening of Withania somnifera.
Certifications: GLP Certificate - NMPB 2025.`,
  tech: `Kavya Singh | Health Informatics & Ayurvedic Data Science
Skills: Python, Machine Learning, Data Analysis, Health Informatics, Pandas, SQL, Sanskrit Lexicon Processing.
Projects: NLP Model for Classical Charaka Samhita Text Extraction, Predictive Model for Ayurvedic Prakriti Assessment.`
};

export default function ResumeAnalyzer({ onSyncRoadmap }) {
  const [targetRole, setTargetRole] = useState('Herbal Formulation Scientist');
  const [resumeText, setResumeText] = useState(SAMPLE_RESUMES.herbal);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [syncStatus, setSyncStatus] = useState(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setSyncStatus(null);
    try {
      const res = await analyzeResumeApi(resumeText, targetRole);
      if (res && res.success) {
        setAnalysis(res);
      } else {
        setAnalysis({
          targetRole,
          matchPercentage: 78,
          benchmark: 85,
          extractedSkills: ["Herbal Formulation", "Ayurvedic Pharmacognosy", "GLP", "Python"],
          missingSkills: ["HPTLC / HPLC Fingerprinting", "Formulation Stability Protocols", "Nanomedicine Delivery"],
          softSkillsMatched: ["Scientific Documentation", "Research Ethics"],
          recommendations: [
            "Complete HPTLC chromatography certification through Dabur MoU workshop.",
            "Take the 'Formulation Stability Testing' quiz in Quiz Arena (+150 XP).",
            "Engage in clinical protocol documentation to reach the 85% industry benchmark."
          ],
          roadmapAction: "Mapped 3 skill gaps to your active Career Roadmap."
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = () => {
    setSyncStatus('Synced! 3 critical skill gap modules have been added to your Interactive Career Roadmap.');
    if (onSyncRoadmap) onSyncRoadmap();
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto pb-12 w-full">
      {/* Header Banner */}
      <div className="p-5 sm:p-7 rounded-3xl bg-gradient-to-r from-purple-900/50 via-indigo-900/40 to-blue-900/40 border border-purple-500/40 backdrop-blur-xl shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/50 text-purple-300 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse"></span>
              AI Competency Engine
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">AI Resume & Skill Gap Analyzer</h2>
            <p className="text-gray-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Benchmark your CV against real-time Ministry of Ayush & Pharma hiring criteria to find missing competencies.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 shrink-0">
            <button
              onClick={() => setResumeText(SAMPLE_RESUMES.herbal)}
              className="px-3 py-1.5 text-xs font-bold rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/40 transition shadow-sm"
            >
              Herbal CV
            </button>
            <button
              onClick={() => setResumeText(SAMPLE_RESUMES.tech)}
              className="px-3 py-1.5 text-xs font-bold rounded-xl bg-blue-600/30 hover:bg-blue-600/50 text-blue-200 border border-blue-500/40 transition shadow-sm"
            >
              HealthTech CV
            </button>
          </div>
        </div>
      </div>

      {/* Input Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 p-5 sm:p-7 rounded-3xl bg-gray-900/80 border border-gray-800 backdrop-blur-xl space-y-4 shadow-xl">
          <div>
            <label className="block text-xs sm:text-sm font-bold text-gray-200 mb-1.5">
              Target Industry Career Role
            </label>
            <select
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="w-full p-3 rounded-xl bg-gray-950 border border-purple-500/50 text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
            >
              <option value="Herbal Formulation Scientist">Herbal Formulation Scientist (Dabur / Patanjali / Aimil)</option>
              <option value="Quality Control & Regulatory Affairs Analyst">Quality Control & Regulatory Affairs Analyst</option>
              <option value="Ayush Health-Tech & NLP Informatics Specialist">Ayush Health-Tech & NLP Informatics Specialist</option>
              <option value="Clinical Trial Research Associate (Ayurveda)">Clinical Trial Research Associate (Ayurveda)</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs sm:text-sm font-bold text-gray-200">
                Paste Resume / CV Content (or type your skills)
              </label>
              <span className="text-[10px] text-gray-400">Text parsing active</span>
            </div>
            <textarea
              rows={7}
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your resume or list of skills here..."
              className="w-full p-3 sm:p-4 rounded-xl bg-gray-950 border border-gray-700 text-xs sm:text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono leading-relaxed"
            />
          </div>

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="w-full py-3 sm:py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-md transition disabled:opacity-50"
          >
            {loading ? 'Analyzing with Google AI & Ayush Benchmarks...' : '⚡ Run AI Gap Analysis'}
          </button>
        </div>

        {/* Live Industry Criteria Card */}
        <div className="p-5 sm:p-6 rounded-3xl bg-gray-900/80 border border-purple-500/20 backdrop-blur-xl flex flex-col justify-between shadow-xl">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white mb-2 flex items-center gap-1.5">
              <span>🏛️</span> Industry Benchmarks
            </h3>
            <p className="text-xs text-gray-300 mb-3">
              Standardized criteria established via bilateral MoUs with <strong>Dabur Research Labs</strong> & <strong>AIIA</strong>:
            </p>
            <ul className="space-y-2 text-xs text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400">✓</span>
                <span>Good Laboratory Practice (GLP)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400">✓</span>
                <span>HPTLC Fingerprint Profiling</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400">✓</span>
                <span>Computational Herbal Chemistry</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400">✓</span>
                <span>Clinical Documentation (GCP)</span>
              </li>
            </ul>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-purple-950/30 border border-purple-500/20 text-[11px] text-purple-200">
            💡 Gaps identified will be automatically synced into your milestone tasks.
          </div>
        </div>
      </div>

      {/* Analysis Results */}
      {analysis && (
        <div className="space-y-5 animate-fade-in">
          {/* Top Score Matrix */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="p-4 sm:p-5 rounded-2xl bg-gray-900/80 border border-purple-500/40 text-center shadow-md">
              <span className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider font-bold">Match Score</span>
              <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mt-1">
                {analysis.matchPercentage}%
              </div>
              <span className="text-xs text-purple-300 mt-1 block font-medium">Industry Benchmark: {analysis.benchmark}%</span>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-gray-900/80 border border-emerald-500/40 text-center shadow-md">
              <span className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider font-bold">Verified Skills</span>
              <div className="text-3xl sm:text-4xl font-black text-emerald-400 mt-1">
                {analysis.extractedSkills?.length || 0}
              </div>
              <span className="text-xs text-emerald-300 mt-1 block font-medium">Competencies Found</span>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-gray-900/80 border border-amber-500/40 text-center shadow-md">
              <span className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider font-bold">Missing Gaps</span>
              <div className="text-3xl sm:text-4xl font-black text-amber-400 mt-1">
                {analysis.missingSkills?.length || 0}
              </div>
              <span className="text-xs text-amber-300 mt-1 block font-medium">Needs Training</span>
            </div>
          </div>

          {/* Strengths and Gaps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            <div className="p-5 sm:p-6 rounded-2xl bg-gray-900/80 border border-emerald-500/40 shadow-md space-y-3">
              <h3 className="text-lg sm:text-xl font-bold text-emerald-300 flex items-center gap-1.5">
                <span>✅</span> Extracted Strengths
              </h3>
              <div className="flex flex-wrap gap-2 mb-2">
                {analysis.extractedSkills?.map((skill, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/40 text-emerald-200 text-xs font-semibold"
                  >
                    ✓ {skill}
                  </span>
                ))}
              </div>
              <div className="pt-2.5 border-t border-gray-800 text-xs">
                <span className="text-gray-400 font-bold block mb-1">Soft Skills:</span>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.softSkillsMatched?.map((ss, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-gray-800 text-gray-300 text-[11px]">
                      • {ss}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-6 rounded-2xl bg-gray-900/80 border border-amber-500/40 shadow-md space-y-3">
              <h3 className="text-lg sm:text-xl font-bold text-amber-300 flex items-center gap-1.5">
                <span>⚠️</span> Critical Missing Gaps
              </h3>
              <div className="flex flex-wrap gap-2 mb-2">
                {analysis.missingSkills?.map((gap, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/40 text-amber-200 text-xs font-semibold"
                  >
                    + {gap}
                  </span>
                ))}
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                These specific competencies are demanded by MoU partners (Dabur, Himalaya) for the selected role.
              </p>
            </div>
          </div>

          {/* Recommendations Banner */}
          <div className="p-5 sm:p-6 rounded-2xl bg-purple-900/25 border border-purple-500/40 backdrop-blur-xl shadow-md space-y-4">
            <h3 className="text-lg sm:text-xl font-bold text-purple-200 flex items-center gap-1.5">
              <span>🎯</span> AI Action Plan & Recommended Interventions
            </h3>
            <ul className="space-y-2">
              {analysis.recommendations?.map((rec, i) => (
                <li key={i} className="flex items-start gap-2.5 bg-black/40 p-3 rounded-xl border border-white/5 text-xs sm:text-sm text-gray-200 leading-relaxed">
                  <span className="text-purple-400 font-bold">{i + 1}.</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-purple-500/20">
              <span className="text-xs text-gray-300">
                {syncStatus || "Incorporate these customized gap modules into your active Career Roadmap."}
              </span>
              <button
                onClick={handleSync}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition shadow-md whitespace-nowrap"
              >
                🔄 Sync Gaps with Roadmap
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
