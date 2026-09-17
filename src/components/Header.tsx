import React from 'react';
import { ActiveTab } from '../types/blueprint';
import { TtmLogo } from './TtmLogo';
import { 
  Layers, 
  Cpu, 
  HardDrive, 
  Clock, 
  Database, 
  Milestone, 
  FileText,
  Lock,
  Smartphone,
  ShieldAlert,
  ChevronRight
} from 'lucide-react';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const tabs: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Architecture Topology', icon: <Layers className="w-4 h-4" /> },
    { id: 'mobile-client', label: 'TTM Mobile Client & Voice Notes', icon: <Smartphone className="w-4 h-4" /> },
    { id: 'security-hardening', label: 'Security Hardening & Deliverables', icon: <ShieldAlert className="w-4 h-4" /> },
    { id: 'tech-stack', label: 'Tech Stack Matrix', icon: <Cpu className="w-4 h-4" /> },
    { id: 'e2ee', label: 'E2EE & Crypto Engine', icon: <Lock className="w-4 h-4" /> },
    { id: 'file-handling', label: '500MB Chunked Transfer', icon: <HardDrive className="w-4 h-4" /> },
    { id: 'ephemeral', label: '24H Auto-Destruct', icon: <Clock className="w-4 h-4" /> },
    { id: 'database', label: 'Database & Schemas', icon: <Database className="w-4 h-4" /> },
    { id: 'roadmap', label: 'MVP Roadmap', icon: <Milestone className="w-4 h-4" /> },
    { id: 'spec-doc', label: 'Full Technical Spec', icon: <FileText className="w-4 h-4" /> },
  ];

  const currentTabObj = tabs.find(t => t.id === activeTab);

  return (
    <header className="bg-slate-950/95 backdrop-blur border-b border-slate-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Active Screen Title Bar */}
          <div className="flex items-center gap-3">
            {/* TTM Shield Logo */}
            <TtmLogo size="md" />

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-white">
                  Talk To Me (TTM)
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Architect Blueprint
                </span>
              </div>

              {/* Active Screen Title with breadcrumb */}
              <div className="flex items-center gap-1.5 text-xs text-slate-300">
                <span className="text-slate-400 font-medium">Screen:</span>
                <span className="text-emerald-400 font-bold tracking-wide">
                  {currentTabObj?.label || 'Overview'}
                </span>
              </div>
            </div>
          </div>

          {/* Right Header Security Badges */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs">
              <span className="text-slate-400">Identity:</span>
              <span className="text-emerald-400 font-semibold">Display Name Only</span>
              <span className="text-slate-600">&bull;</span>
              <span className="text-rose-400 font-mono text-[10px] line-through">user@gmail.com</span>
            </div>

            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-semibold">Zero-Knowledge E2EE</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex space-x-1 overflow-x-auto scrollbar-thin py-2 border-t border-slate-800/80">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-150 ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
