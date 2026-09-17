import React, { useState } from 'react';
import { ROADMAP_PHASES } from '../data/blueprintData';
import { 
  Milestone, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  Package, 
  ShieldCheck,
  Target
} from 'lucide-react';

export const RoadmapView: React.FC = () => {
  const [activePhaseIndex, setActivePhaseIndex] = useState<number>(0);
  const currentPhase = ROADMAP_PHASES[activePhaseIndex];

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Milestone className="w-5 h-5 text-emerald-400" />
              <h2 className="text-xl font-bold text-white tracking-tight">Step-by-Step MVP Development Roadmap</h2>
            </div>
            <p className="text-sm text-slate-400 max-w-3xl">
              14-week phased engineering blueprint taking "Talk To Me" from zero to a hardened, production-ready Mobile MVP.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 text-xs text-slate-300">
            <Calendar className="w-4 h-4 text-emerald-400" />
            <span>5 Distinct Execution Phases &bull; 14 Weeks to MVP</span>
          </div>
        </div>
      </div>

      {/* Phase Progression Timeline Tracker */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
        {ROADMAP_PHASES.map((phase, idx) => {
          const isSelected = activePhaseIndex === idx;
          return (
            <button
              key={phase.phase}
              onClick={() => setActivePhaseIndex(idx)}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'bg-slate-800 border-emerald-500 shadow-md shadow-emerald-500/10 ring-1 ring-emerald-500'
                  : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 mb-1">
                <span>{phase.phase}</span>
                <span className="text-emerald-400 font-mono">{phase.duration}</span>
              </div>
              <h3 className="text-xs font-bold text-white line-clamp-1">{phase.title}</h3>
            </button>
          );
        })}
      </div>

      {/* Selected Phase Detail View */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                {currentPhase.phase}
              </span>
              <span className="text-xs text-slate-400">&bull; {currentPhase.duration}</span>
            </div>
            <h3 className="text-lg font-bold text-white mt-1">{currentPhase.title}</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-blue-400" />
              <span>Core Objective Focus</span>
            </span>
          </div>
        </div>

        {/* Phase Objective */}
        <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 text-sm text-slate-300 leading-relaxed">
          <strong className="text-white">Strategic Focus: </strong>
          {currentPhase.focus}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Engineering Milestones */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Engineering Milestones &amp; Implementation Tasks
            </h4>
            <ul className="space-y-2.5">
              {currentPhase.milestones.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs text-slate-300 bg-slate-950/40 p-3 rounded-lg border border-slate-800/80">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-[10px] font-mono text-emerald-400 flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tangible Deliverables */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Package className="w-4 h-4 text-blue-400" />
              Tangible Functional Deliverables
            </h4>
            <div className="space-y-2.5">
              {currentPhase.deliverables.map((item, i) => (
                <div key={i} className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-md bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0 text-blue-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">{item}</h5>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Ready for automated CI/CD unit testing and integration verification.
                    </p>
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
