import React, { useState } from 'react';
import { 
  Database, 
  CheckCircle2, 
  AlertCircle, 
  Settings, 
  Copy, 
  Check, 
  ExternalLink, 
  X,
  Radio,
  Server,
  KeyRound
} from 'lucide-react';
import { 
  isSupabaseConfigured, 
  supabaseUrl, 
  saveCustomSupabaseConfig, 
  clearCustomSupabaseConfig, 
  SUPABASE_SETUP_SQL 
} from '../lib/supabase';

interface SupabaseStatusBannerProps {
  onDismiss?: () => void;
}

export const SupabaseStatusBanner: React.FC<SupabaseStatusBannerProps> = ({ onDismiss }) => {
  const [isDismissed, setIsDismissed] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [modalTab, setModalTab] = useState<'config' | 'sql'>('config');
  
  const [inputUrl, setInputUrl] = useState(supabaseUrl.includes('placeholder') ? '' : supabaseUrl);
  const [inputKey, setInputKey] = useState(supabaseUrl.includes('placeholder') ? '' : '');
  const [copiedSql, setCopiedSql] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim() || !inputKey.trim()) return;
    saveCustomSupabaseConfig(inputUrl, inputKey);
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SETUP_SQL);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  if (isDismissed) {
    // Show mini pill trigger in top right corner if dismissed
    return (
      <button
        onClick={() => setShowConfigModal(true)}
        className={`fixed top-3 right-4 z-40 text-[10px] font-mono px-2.5 py-1 rounded-full border shadow-lg flex items-center gap-1.5 transition-all ${
          isSupabaseConfigured
            ? 'bg-emerald-950/80 border-emerald-800 text-emerald-300 hover:bg-emerald-900/80'
            : 'bg-amber-950/80 border-amber-800 text-amber-300 hover:bg-amber-900/80'
        }`}
        title="Supabase Backend Status"
      >
        <div className={`w-2 h-2 rounded-full ${isSupabaseConfigured ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`} />
        <span>{isSupabaseConfigured ? 'Supabase Live' : 'Supabase Demo'}</span>
      </button>
    );
  }

  return (
    <>
      {/* Banner Strip */}
      <div className={`w-full px-4 py-2 border-b text-xs flex items-center justify-between transition-colors z-20 shrink-0 ${
        isSupabaseConfigured
          ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-200'
          : 'bg-amber-950/40 border-amber-800/60 text-amber-200'
      }`}>
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative shrink-0">
            {isSupabaseConfigured ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-400 animate-bounce" />
            )}
          </div>

          <div className="truncate">
            <span className="font-semibold">
              {isSupabaseConfigured ? 'Supabase Realtime & Storage Connected' : 'Supabase Not Configured (Running in Local Mode)'}
            </span>
            <span className="hidden md:inline text-[11px] opacity-80 ml-2">
              {isSupabaseConfigured
                ? `Active endpoint: ${supabaseUrl.replace(/^https?:\/\//, '').split('.')[0]}.supabase.co`
                : 'Messages, WebRTC signaling & attachments are working in local real-time mode. Set VITE_SUPABASE_URL to persist to cloud.'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowConfigModal(true)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 transition-colors ${
              isSupabaseConfigured
                ? 'bg-emerald-900/50 hover:bg-emerald-800/60 text-emerald-100 border border-emerald-700/50'
                : 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold'
            }`}
          >
            <Settings className="w-3 h-3" />
            <span>{isSupabaseConfigured ? 'Configure' : 'Connect Cloud'}</span>
          </button>

          <button
            onClick={() => {
              setIsDismissed(true);
              if (onDismiss) onDismiss();
            }}
            className="p-1 rounded hover:bg-black/20 text-current opacity-70 hover:opacity-100 transition-opacity"
            title="Dismiss notice"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Configuration & SQL Schema Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-fade-in flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Database className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Supabase Realtime &amp; Database Config
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Connect an active Supabase project for persistent cloud messaging.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowConfigModal(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-slate-800 bg-slate-950/50 px-4 text-xs font-medium">
              <button
                onClick={() => setModalTab('config')}
                className={`py-2.5 px-3 border-b-2 transition-colors ${
                  modalTab === 'config'
                    ? 'border-emerald-500 text-emerald-400 font-semibold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Connection Credentials
              </button>
              <button
                onClick={() => setModalTab('sql')}
                className={`py-2.5 px-3 border-b-2 transition-colors ${
                  modalTab === 'sql'
                    ? 'border-emerald-500 text-emerald-400 font-semibold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                SQL Setup Script (Tables &amp; Realtime)
              </button>
            </div>

            {/* Tab 1: Config Form */}
            {modalTab === 'config' && (
              <form onSubmit={handleSave} className="p-5 space-y-4 overflow-y-auto">
                <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 text-xs text-slate-300 space-y-1.5">
                  <div className="font-semibold text-emerald-400 flex items-center gap-1.5">
                    <Server className="w-3.5 h-3.5" />
                    <span>How it works:</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Values can be provided through <code className="bg-slate-900 px-1 py-0.5 rounded text-emerald-300">VITE_SUPABASE_URL</code> &amp; <code className="bg-slate-900 px-1 py-0.5 rounded text-emerald-300">VITE_SUPABASE_ANON_KEY</code>, or entered here directly.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1">
                    Supabase Project URL
                  </label>
                  <div className="relative">
                    <Server className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                    <input
                      type="url"
                      value={inputUrl}
                      onChange={(e) => setInputUrl(e.target.value)}
                      placeholder="https://xyzcompany.supabase.co"
                      className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1">
                    Supabase Anon Public API Key
                  </label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      value={inputKey}
                      onChange={(e) => setInputKey(e.target.value)}
                      placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                      className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                      required
                    />
                  </div>
                </div>

                {isSupabaseConfigured && (
                  <div className="pt-1 flex items-center justify-between">
                    <span className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Currently Connected &amp; Active</span>
                    </span>
                    <button
                      type="button"
                      onClick={clearCustomSupabaseConfig}
                      className="text-xs text-rose-400 hover:text-rose-300 underline"
                    >
                      Clear custom credentials
                    </button>
                  </div>
                )}

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowConfigModal(false)}
                    className="px-4 py-2 text-xs text-slate-400 hover:text-slate-200 rounded-xl hover:bg-slate-800 transition-colors"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-slate-950 rounded-xl transition-colors shadow-md shadow-emerald-950/50"
                  >
                    Save &amp; Reload
                  </button>
                </div>
              </form>
            )}

            {/* Tab 2: SQL Blueprint Script */}
            {modalTab === 'sql' && (
              <div className="p-5 flex-1 flex flex-col overflow-hidden space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-300">
                    Paste this into your Supabase Dashboard &rarr; <strong>SQL Editor</strong>:
                  </span>
                  <button
                    onClick={handleCopySql}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors"
                  >
                    {copiedSql ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy SQL</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-3 overflow-y-auto max-h-72">
                  <pre className="text-[11px] font-mono text-emerald-300/90 whitespace-pre leading-relaxed">
                    {SUPABASE_SETUP_SQL}
                  </pre>
                </div>

                <p className="text-[11px] text-slate-500 leading-normal">
                  This script creates the <code className="text-emerald-400 font-mono">messages</code> table, enables Realtime publications for postgres_changes listeners, and provisions the <code className="text-emerald-400 font-mono">chat-attachments</code> storage bucket.
                </p>
              </div>
            )}

          </div>
        </div>
      )}
    </>
  );
};
