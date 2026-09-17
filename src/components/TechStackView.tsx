import React from 'react';
import { TECH_STACK } from '../data/blueprintData';
import { 
  Cpu, 
  CheckCircle2, 
  AlertCircle, 
  Lightbulb, 
  Smartphone, 
  Server, 
  ShieldCheck,
  Zap
} from 'lucide-react';

export const TechStackView: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Cpu className="w-5 h-5 text-emerald-400" />
              <h2 className="text-xl font-bold text-white tracking-tight">Principal Architect Tech Stack Recommendations</h2>
            </div>
            <p className="text-sm text-slate-400 max-w-3xl">
              High-throughput, zero-knowledge architectural choices optimized for low-latency WebRTC, 500 MB file streams, and cryptographic isolation.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 text-xs text-slate-300">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Benchmark: Sub-100ms Latency &bull; 0% Plaintext Exposure</span>
          </div>
        </div>
      </div>

      {/* Tech Stack Cards */}
      <div className="space-y-4">
        {TECH_STACK.map((item, index) => (
          <div key={index} className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {item.category}
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  {item.recommended}
                </h3>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400">Alternatives:</span>
                {item.alternatives.map((alt, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {alt}
                  </span>
                ))}
              </div>
            </div>

            {/* Architectural Rationale */}
            <div className="text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
              <span className="font-semibold text-emerald-400">Architect's Rationale: </span>
              {item.rationale}
            </div>

            {/* Pros and Cons Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-950/40 p-3.5 rounded-lg border border-slate-800/60 space-y-2">
                <h4 className="font-semibold text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Key Architectural Strengths
                </h4>
                <ul className="space-y-1.5 text-slate-300">
                  {item.pros.map((pro, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">&bull;</span>
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-950/40 p-3.5 rounded-lg border border-slate-800/60 space-y-2">
                <h4 className="font-semibold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Engineering Trade-Offs &amp; Considerations
                </h4>
                <ul className="space-y-1.5 text-slate-300">
                  {item.cons.map((con, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold">&bull;</span>
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Production Implementation Notes */}
            <div className="flex items-start gap-2.5 text-xs text-slate-300 bg-emerald-950/20 p-3 rounded-lg border border-emerald-900/40">
              <Lightbulb className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-emerald-400">Production Tip: </strong>
                {item.productionNotes}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
