import React, { useState, useEffect } from 'react';
import { getRoadmapApi, toggleTaskApi, checkInRoadmapApi } from '../../services/api';

export default function CareerRoadmap({ onUpdateXp }) {
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeNode, setActiveNode] = useState('m2');
  const [checkInMsg, setCheckInMsg] = useState(null);

  useEffect(() => {
    loadRoadmap();
  }, []);

  const loadRoadmap = async () => {
    const data = await getRoadmapApi();
    if (data) {
      setRoadmap(data);
    } else {
      setRoadmap({
        careerGoal: "Ayush Health-Tech & Formulation Specialist",
        currentLevel: "Level 3 - Intermediate Innovator",
        totalXp: 1450,
        streakDays: 7,
        decayStatus: "Active - Decay Frozen for 72 hrs",
        milestones: [
          {
            id: "m1",
            phase: "Phase 1: Foundations & Classical Fundamentals",
            status: "Completed",
            xp: 300,
            description: "Master foundational botany, Dravyaguna principles, and basic laboratory chemistry.",
            tasks: [
              { id: "t1-1", title: "Complete Classical Taxonomy Assessment", done: true },
              { id: "t1-2", title: "Good Laboratory Practices (GLP) Safety Certification", done: true },
              { id: "t1-3", title: "Herbal Raw Material Identification Practicum", done: true }
            ]
          },
          {
            id: "m2",
            phase: "Phase 2: Modern Analytical Tools & Phytochemistry",
            status: "In Progress",
            xp: 450,
            description: "Learn chromatography, UV-Vis spectroscopy, and bio-marker extraction standards.",
            tasks: [
              { id: "t2-1", title: "HPTLC Fingerprinting for Herbal Formulations", done: true },
              { id: "t2-2", title: "Python for Chemical Data Analysis & Plotting", done: true },
              { id: "t2-3", title: "Complete Formulation Stability Testing Quiz", done: false }
            ]
          },
          {
            id: "m3",
            phase: "Phase 3: AI in Herbal Drug Discovery & NLP",
            status: "Locked",
            xp: 500,
            description: "Explore text mining on Charaka & Sushruta Samhita, and molecular docking algorithms.",
            tasks: [
              { id: "t3-1", title: "NLP for Classical Ayurvedic Sanskrit & Translation Models", done: false },
              { id: "t3-2", title: "Virtual Screening of Phytoconstituents vs Receptor Targets", done: false },
              { id: "t3-3", title: "Submit Ayush Innovation Challenge Mini-Project", done: false }
            ]
          },
          {
            id: "m4",
            phase: "Phase 4: Industry Capstone & Placement Readiness",
            status: "Locked",
            xp: 600,
            description: "Direct internship placement with partner companies and institutional verification.",
            tasks: [
              { id: "t4-1", title: "Verified Digital Portfolio Audit & Recommendation Letter", done: false },
              { id: "t4-2", title: "Complete Dabur / Patanjali Industry Internship Application", done: false },
              { id: "t4-3", title: "Clear AI Mock Technical Interview with Zulu", done: false }
            ]
          }
        ]
      });
    }
    setLoading(false);
  };

  const handleToggleTask = async (milestoneId, taskId) => {
    const res = await toggleTaskApi(milestoneId, taskId);
    if (res && res.success) {
      setRoadmap(res.roadmap);
      if (onUpdateXp) onUpdateXp(res.newTotalXp);
    } else {
      setRoadmap(prev => {
        const next = { ...prev };
        next.milestones = next.milestones.map(m => {
          if (m.id === milestoneId) {
            const updatedTasks = m.tasks.map(t => {
              if (t.id === taskId) {
                const newDone = !t.done;
                next.totalXp += newDone ? 50 : -50;
                return { ...t, done: newDone };
              }
              return t;
            });
            const allDone = updatedTasks.every(t => t.done);
            return {
              ...m,
              tasks: updatedTasks,
              status: allDone ? 'Completed' : 'In Progress'
            };
          }
          return m;
        });
        if (onUpdateXp) onUpdateXp(next.totalXp);
        return next;
      });
    }
  };

  const handleCheckIn = async () => {
    const res = await checkInRoadmapApi();
    if (res && res.success) {
      setRoadmap(prev => ({
        ...prev,
        streakDays: res.streak,
        totalXp: res.totalXp,
        decayStatus: "Active - Decay Frozen for 72 hrs"
      }));
      setCheckInMsg(res.message);
      if (onUpdateXp) onUpdateXp(res.totalXp);
    } else {
      setRoadmap(prev => {
        const newXp = prev.totalXp + 75;
        if (onUpdateXp) onUpdateXp(newXp);
        return {
          ...prev,
          streakDays: prev.streakDays + 1,
          totalXp: newXp,
          decayStatus: "Active - Decay Frozen for 72 hrs"
        };
      });
      setCheckInMsg("Daily Check-in recorded! +75 XP earned & inactivity decay timer frozen for 72 hours.");
    }
    setTimeout(() => setCheckInMsg(null), 5000);
  };

  if (loading || !roadmap) {
    return (
      <div className="p-8 sm:p-16 text-center text-purple-300 text-sm sm:text-base">
        <div className="w-8 h-8 border-3 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        Synthesizing personalized Career Roadmap...
      </div>
    );
  }

  const selectedMilestone = roadmap.milestones.find(m => m.id === activeNode) || roadmap.milestones[1];

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto pb-12 w-full">
      {/* Top Banner with Anti-Decay Gamification Status */}
      <div className="p-5 sm:p-7 rounded-3xl bg-gradient-to-r from-purple-900/50 via-indigo-900/40 to-cyan-900/40 border border-purple-500/40 backdrop-blur-xl shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/50 text-purple-300 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                Target: {roadmap.careerGoal}
              </span>
              <span className="text-xs text-cyan-300 font-bold">
                {roadmap.currentLevel}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Interactive Skill Roadmap</h2>
            <p className="text-gray-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Progress through milestone checkpoints, complete laboratory tasks, and preserve your points against inactivity decay.
            </p>
          </div>

          <div className="flex items-center justify-between sm:justify-start gap-4 shrink-0 pt-2 lg:pt-0">
            <div>
              <div className="text-2xl sm:text-3xl font-black text-purple-300">🔥 {roadmap.totalXp} XP</div>
              <div className="text-xs text-emerald-400 font-bold mt-0.5">🎯 {roadmap.streakDays}-Day Streak</div>
            </div>
            <button
              onClick={handleCheckIn}
              className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold text-xs shadow-md transition hover:scale-105 active:scale-95"
            >
              ⚡ Daily Check-In
            </button>
          </div>
        </div>

        {/* Anti-Inactivity Rule Callout */}
        <div className="mt-5 pt-3.5 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs">
          <div className="flex items-center gap-2 text-amber-300 font-medium">
            <span>⏳</span>
            <span><strong>Anti-Inactivity Gamification:</strong> Inactivity beyond 3 days triggers -50 XP/day decay.</span>
          </div>
          <span className="text-emerald-300 bg-emerald-950/60 px-3 py-1 rounded-lg border border-emerald-500/40 font-bold text-[11px]">
            {roadmap.decayStatus}
          </span>
        </div>

        {checkInMsg && (
          <div className="mt-3.5 p-3 rounded-xl bg-emerald-500/25 border border-emerald-500/50 text-emerald-100 text-xs font-medium animate-fade-in shadow-md">
            ✅ {checkInMsg}
          </div>
        )}
      </div>

      {/* Roadmap Phase Timeline / Steps */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {roadmap.milestones.map((m, idx) => {
          const isSelected = activeNode === m.id;
          const isCompleted = m.status === 'Completed';
          const isInProgress = m.status === 'In Progress';

          return (
            <div
              key={m.id}
              onClick={() => setActiveNode(m.id)}
              className={`p-4 sm:p-5 rounded-2xl cursor-pointer transition-all duration-200 border flex flex-col justify-between shadow-md ${
                isSelected
                  ? 'bg-purple-900/50 border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.3)] scale-[1.01]'
                  : isCompleted
                  ? 'bg-emerald-950/30 border-emerald-500/40 hover:border-emerald-400'
                  : isInProgress
                  ? 'bg-blue-950/30 border-blue-500/40 hover:border-blue-400'
                  : 'bg-gray-900/50 border-gray-800 opacity-60 hover:opacity-90'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-gray-400 font-bold tracking-wider uppercase text-[10px]">Step {idx + 1}</span>
                  <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                    isCompleted ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                    isInProgress ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 animate-pulse' :
                    'bg-gray-800 text-gray-400'
                  }`}>
                    {m.status}
                  </span>
                </div>
                <h4 className="font-bold text-white text-sm mb-1 leading-snug">{m.phase}</h4>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-center text-xs font-semibold">
                <span className="text-purple-300 font-bold">+{m.xp} XP</span>
                <span className="text-gray-400 text-[11px]">
                  {m.tasks.filter(t => t.done).length}/{m.tasks.length} Tasks
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Phase Details & Task Checklists */}
      <div className="p-5 sm:p-7 rounded-3xl bg-gray-900/80 border border-purple-500/30 backdrop-blur-xl shadow-xl space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-gray-800">
          <div>
            <span className="text-[10px] text-purple-400 font-bold uppercase tracking-widest block mb-0.5">Inspecting Phase</span>
            <h3 className="text-xl sm:text-2xl font-black text-white">{selectedMilestone.phase}</h3>
            <p className="text-gray-300 text-xs sm:text-sm mt-1 max-w-3xl leading-relaxed">{selectedMilestone.description}</p>
          </div>
          <div className="px-4 py-2 rounded-xl bg-purple-600/20 border border-purple-500/50 text-purple-300 text-xs font-bold whitespace-nowrap self-start md:self-auto">
            Reward: +{selectedMilestone.xp} XP
          </div>
        </div>

        {/* Task List */}
        <div>
          <h4 className="text-xs sm:text-sm font-bold text-gray-200 mb-3 uppercase tracking-wider flex items-center gap-1.5">
            <span>📋</span> Competency Tasks (Click to Toggle & Earn +50 XP):
          </h4>

          <div className="space-y-2.5">
            {selectedMilestone.tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => handleToggleTask(selectedMilestone.id, task.id)}
                className={`p-3.5 sm:p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                  task.done
                    ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-100 shadow-sm'
                    : 'bg-gray-900/90 border-gray-700 hover:border-purple-500/60 text-gray-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-lg flex items-center justify-center font-bold text-xs border transition-all shrink-0 ${
                    task.done 
                      ? 'bg-emerald-500 border-emerald-400 text-black shadow-[0_0_8px_#10b981]' 
                      : 'bg-gray-800 border-gray-600 text-transparent'
                  }`}>
                    ✓
                  </div>
                  <span className={`text-xs sm:text-sm font-medium ${task.done ? 'line-through text-gray-400' : 'text-white'}`}>
                    {task.title}
                  </span>
                </div>
                <span className="text-xs font-bold text-purple-400 shrink-0">
                  {task.done ? 'Earned +50 XP ✓' : '+50 XP'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
