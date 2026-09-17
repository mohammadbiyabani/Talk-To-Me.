import React, { useState } from 'react';
import { ActiveTab } from './types/blueprint';
import { Header } from './components/Header';
import { ArchitectureDiagram } from './components/ArchitectureDiagram';
import { TtmMobileClientSimulator } from './components/TtmMobileClientSimulator';
import { SecurityHardeningView } from './components/SecurityHardeningView';
import { TechStackView } from './components/TechStackView';
import { E2EESimulator } from './components/E2EESimulator';
import { ChunkedFileUploaderSimulator } from './components/ChunkedFileUploaderSimulator';
import { EphemeralTimeline } from './components/EphemeralTimeline';
import { DatabaseSchemaViewer } from './components/DatabaseSchemaViewer';
import { RoadmapView } from './components/RoadmapView';
import { SpecDocumentView } from './components/SpecDocumentView';
import { TtmLogo } from './components/TtmLogo';
import { ShieldCheck, Lock, Terminal, Cpu } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Navigation */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'overview' && <ArchitectureDiagram />}
        {activeTab === 'mobile-client' && <TtmMobileClientSimulator />}
        {activeTab === 'security-hardening' && <SecurityHardeningView />}
        {activeTab === 'tech-stack' && <TechStackView />}
        {activeTab === 'e2ee' && <E2EESimulator />}
        {activeTab === 'file-handling' && <ChunkedFileUploaderSimulator />}
        {activeTab === 'ephemeral' && <EphemeralTimeline />}
        {activeTab === 'database' && <DatabaseSchemaViewer />}
        {activeTab === 'roadmap' && <RoadmapView />}
        {activeTab === 'spec-doc' && <SpecDocumentView />}
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800/80 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2.5">
            <TtmLogo size="sm" />
            <span className="font-semibold text-slate-300">Talk To Me (TTM) &bull; Security Architecture Blueprint</span>
            <span>&bull; Principal Mobile App System Architect</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-slate-500">
            <span>Zero-Knowledge Server Standard</span>
            <span>Display Name Only (No Gmail)</span>
            <span>Screenshot Detection Alert</span>
            <span>Signal Protocol E2EE</span>
            <span>AES-256 Voice Notes</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
