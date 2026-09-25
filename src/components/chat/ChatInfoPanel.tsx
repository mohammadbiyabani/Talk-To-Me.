import React, { useState } from 'react';
import { Conversation } from '../../types/chat';
import { 
  ShieldCheck, 
  Lock, 
  Clock, 
  QrCode, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  FileText, 
  Key, 
  Smartphone,
  EyeOff
} from 'lucide-react';

interface ChatInfoPanelProps {
  conversation: Conversation;
  onClose: () => void;
  onChangeTimer: (timer: Conversation['ephemeralTimer']) => void;
  onSimulateScreenshot: () => void;
}

export const ChatInfoPanel: React.FC<ChatInfoPanelProps> = ({
  conversation,
  onClose,
  onChangeTimer,
  onSimulateScreenshot,
}) => {
  const [isVerified, setIsVerified] = useState(false);
  const [showQrCode, setShowQrCode] = useState(false);

  return (
    <aside className="w-80 border-l border-slate-800 bg-slate-900/95 flex flex-col h-full overflow-y-auto select-none">
      {/* Top Header */}
      <div className="p-3.5 border-b border-slate-800 flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-300">
          Security & Contact Info
        </span>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-5 flex flex-col items-center text-center border-b border-slate-800">
        <div
          className={`w-16 h-16 rounded-full bg-gradient-to-tr ${conversation.peer.avatarColor} flex items-center justify-center text-white font-bold text-xl shadow-lg mb-3`}
        >
          {conversation.peer.name
            .split(' ')
            .map((n) => n[0])
            .slice(0, 2)
            .join('')}
        </div>

        <h3 className="text-base font-bold text-white mb-0.5">
          {conversation.peer.name}
        </h3>
        <p className="text-xs text-slate-400 mb-2">
          {conversation.peer.bio || 'Verified TTM Peer'}
        </p>

        <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 px-2.5 py-1 rounded-full">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Google Display Name Only</span>
        </div>
      </div>

      {/* Disappearing Messages Settings */}
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="w-4 h-4 text-emerald-400" />
          <h4 className="text-xs font-semibold text-slate-200">
            Disappearing Messages
          </h4>
        </div>
        <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">
          Messages and media automatically purge from both devices when expired.
        </p>

        <div className="grid grid-cols-4 gap-1.5">
          {(['off', '1h', '24h', '7d'] as const).map((t) => (
            <button
              key={t}
              onClick={() => onChangeTimer(t)}
              className={`py-1.5 px-2 rounded-lg text-xs font-medium transition-colors ${
                conversation.ephemeralTimer === t
                  ? 'bg-emerald-600 text-slate-950 font-bold'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* E2EE Safety Number Verification */}
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-emerald-400" />
            <h4 className="text-xs font-semibold text-slate-200">
              Safety Number
            </h4>
          </div>
          <button
            onClick={() => setShowQrCode(!showQrCode)}
            className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>{showQrCode ? 'Hide QR' : 'Show QR'}</span>
          </button>
        </div>

        {showQrCode ? (
          <div className="my-3 p-4 bg-white rounded-xl flex flex-col items-center">
            {/* SVG QR Code Simulation */}
            <svg className="w-32 h-32" viewBox="0 0 100 100">
              <rect width="100" height="100" fill="white" />
              {/* Corner markers */}
              <rect x="10" y="10" width="24" height="24" fill="black" />
              <rect x="14" y="14" width="16" height="16" fill="white" />
              <rect x="18" y="18" width="8" height="8" fill="black" />

              <rect x="66" y="10" width="24" height="24" fill="black" />
              <rect x="70" y="14" width="16" height="16" fill="white" />
              <rect x="74" y="18" width="8" height="8" fill="black" />

              <rect x="10" y="66" width="24" height="24" fill="black" />
              <rect x="14" y="70" width="16" height="16" fill="white" />
              <rect x="18" y="74" width="8" height="8" fill="black" />

              {/* Data matrix pattern */}
              <rect x="42" y="12" width="6" height="6" fill="black" />
              <rect x="52" y="18" width="6" height="6" fill="black" />
              <rect x="42" y="26" width="6" height="6" fill="black" />
              <rect x="14" y="44" width="6" height="6" fill="black" />
              <rect x="24" y="48" width="6" height="6" fill="black" />
              <rect x="44" y="44" width="12" height="12" fill="black" />
              <rect x="64" y="42" width="6" height="6" fill="black" />
              <rect x="78" y="48" width="8" height="8" fill="black" />
              <rect x="42" y="66" width="6" height="6" fill="black" />
              <rect x="54" y="74" width="6" height="6" fill="black" />
              <rect x="70" y="70" width="10" height="10" fill="black" />
            </svg>
            <span className="text-[10px] text-slate-800 font-mono mt-2">
              Scan with mobile camera to verify
            </span>
          </div>
        ) : null}

        <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl mb-3">
          <p className="text-[11px] font-mono text-emerald-400 text-center tracking-wider break-all tabular-nums select-all">
            {conversation.peer.safetyNumber}
          </p>
        </div>

        <button
          onClick={() => setIsVerified(!isVerified)}
          className={`w-full py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-colors ${
            isVerified
              ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/80'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
          }`}
        >
          <CheckCircle2 className={`w-3.5 h-3.5 ${isVerified ? 'text-emerald-400' : 'text-slate-400'}`} />
          <span>{isVerified ? 'Fingerprint Verified' : 'Mark as Verified'}</span>
        </button>
      </div>

      {/* Screenshot Alert Simulator */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <h4 className="text-xs font-semibold text-slate-200">
            Screenshot Alert Simulator
          </h4>
        </div>
        <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">
          Simulate Android 14 `ScreenCaptureCallback` or iOS screenshot detection.
        </p>

        <button
          onClick={onSimulateScreenshot}
          className="w-full py-2 px-3 bg-amber-950/40 hover:bg-amber-900/50 border border-amber-800/80 text-amber-300 hover:text-amber-200 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-colors"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Simulate Peer Screenshot</span>
        </button>
      </div>
    </aside>
  );
};
