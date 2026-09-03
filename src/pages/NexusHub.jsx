import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import Starfield from '../components/3d/Starfield';
import NexusCore from '../components/3d/NexusCore';
import SectorPortal from '../components/3d/SectorPortal';

export default function NexusHub() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden font-sans">
      {/* Top Bar Overlay */}
      <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-8 py-5 pointer-events-none">
        <div className="flex items-center gap-3 pointer-events-auto">
          <div className="w-3 h-8 bg-gradient-to-b from-blue-400 to-purple-500 rounded-sm shadow-[0_0_15px_rgba(99,102,241,0.8)]"></div>
          <div>
            <span className="text-xl font-black tracking-widest text-white uppercase block">
              JOBLEX
            </span>
            <span className="text-[10px] text-gray-400 block tracking-wider uppercase">
              Ministry of Ayush • PS 26044
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 pointer-events-auto">
          {user ? (
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900/80 border border-purple-500/40 text-xs text-purple-200 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Logged in as <strong>{user.name}</strong> ({user.role.toUpperCase()})</span>
              <button
                onClick={() => navigate('/auth')}
                className="ml-2 underline text-gray-400 hover:text-white"
              >
                Switch
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate('/auth')}
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-[0_0_20px_rgba(168,85,247,0.4)] transition uppercase tracking-wider"
            >
              Sign In / Register
            </button>
          )}
        </div>
      </header>

      {/* 3D Canvas Scene */}
      <Canvas camera={{ position: [0, 2, 14], fov: 60 }}>
        <Starfield />
        <NexusCore />
        <SectorPortal />
        
        <Environment preset="night" />
        <OrbitControls 
          autoRotate 
          autoRotateSpeed={0.35} 
          enableZoom={false} 
          maxPolarAngle={Math.PI / 1.8} 
          minPolarAngle={Math.PI / 3} 
        />
        
        <EffectComposer>
          <Bloom luminanceThreshold={0.2} intensity={1.5} />
        </EffectComposer>
      </Canvas>

      {/* Center 2D HUD Overlay with Generous Spacing */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none px-6 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-bold uppercase tracking-widest mb-4 backdrop-blur-md">
          <span>⚡</span> Academia-Industry Collaborative Nexus
        </div>

        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-teal-300 to-emerald-400 drop-shadow-[0_0_35px_rgba(59,130,246,0.3)] mb-4 uppercase tracking-tight">
          The Nexus
        </h1>

        <p className="text-sm sm:text-lg md:text-xl text-slate-300 font-light mb-10 max-w-2xl px-4 leading-relaxed drop-shadow">
          AI-Powered Skill Mapping, Dynamic Curriculum Modernization & Direct Industry Recruitment for the Ayush Ecosystem.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pointer-events-auto max-w-3xl">
          <button
            onClick={() => navigate('/student')}
            className="px-7 py-3.5 rounded-2xl bg-purple-950/40 border border-purple-500/60 text-purple-200 hover:bg-purple-600 hover:text-white hover:border-purple-400 transition-all duration-300 uppercase tracking-wider text-xs font-extrabold backdrop-blur-md shadow-[0_0_20px_rgba(168,85,247,0.25)] flex items-center gap-2 group"
          >
            <span>🎓</span>
            <span>Student Sector</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>

          <button
            onClick={() => navigate('/academy')}
            className="px-7 py-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/60 text-emerald-200 hover:bg-emerald-600 hover:text-white hover:border-emerald-400 transition-all duration-300 uppercase tracking-wider text-xs font-extrabold backdrop-blur-md shadow-[0_0_20px_rgba(16,185,129,0.25)] flex items-center gap-2 group"
          >
            <span>🏛️</span>
            <span>Academy Sector</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>

          <button
            onClick={() => navigate('/industry')}
            className="px-7 py-3.5 rounded-2xl bg-blue-950/40 border border-blue-500/60 text-blue-200 hover:bg-blue-600 hover:text-white hover:border-blue-400 transition-all duration-300 uppercase tracking-wider text-xs font-extrabold backdrop-blur-md shadow-[0_0_20px_rgba(59,130,246,0.25)] flex items-center gap-2 group"
          >
            <span>🏢</span>
            <span>Industry Sector</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>

          <button
            onClick={() => navigate('/auth')}
            className="px-7 py-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/60 text-indigo-200 hover:bg-indigo-600 hover:text-white hover:border-indigo-400 transition-all duration-300 uppercase tracking-wider text-xs font-extrabold backdrop-blur-md shadow-[0_0_20px_rgba(99,102,241,0.25)] flex items-center gap-2 group"
          >
            <span>🔐</span>
            <span>Role Sign In</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
