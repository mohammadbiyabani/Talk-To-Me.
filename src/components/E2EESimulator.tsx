import React, { useState } from 'react';
import { 
  Lock, 
  Key, 
  ShieldCheck, 
  ArrowRight, 
  Send, 
  Eye, 
  EyeOff, 
  RefreshCw, 
  Check, 
  FileLock2, 
  Cpu, 
  Sparkles 
} from 'lucide-react';

export const E2EESimulator: React.FC = () => {
  const [messageText, setMessageText] = useState('Hey Bob, let us review the confidential financial report.');
  const [messageCounter, setMessageCounter] = useState(1);
  const [currentRootKey, setCurrentRootKey] = useState('rk_0x9f4a8b71c2e5d360');
  const [currentChainKey, setCurrentChainKey] = useState('ck_0x3e1d5a79f0b284c6');
  const [messageKey, setMessageKey] = useState('mk_0x7b2c9e4a1f803d51');
  const [ciphertext, setCiphertext] = useState(
    'v1:gcm:IV_9b3e1f:CT_a8f4c2e9b1d3057e62a4d9f1c83b27e0491d6c8b3f2e1a90bc74de:TAG_5e82b4a1'
  );
  const [isServerView, setIsServerView] = useState(false);
  const [ratchetLog, setRatchetLog] = useState<string[]>([
    'Initialized X3DH session with Bob: Combined Identity, Signed Prekey & One-time Prekey.',
    'Derived Master Secret via HKDF(DH1 || DH2 || DH3 || DH4).',
    'Root Key & Sender Chain initialized.'
  ]);

  const handleSimulateRatchet = () => {
    const nextCounter = messageCounter + 1;
    setMessageCounter(nextCounter);

    // Simulated cryptographic hash rotation
    const randHex = (len: number) => Array.from({ length: len }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const newRootKey = `rk_0x${randHex(16)}`;
    const newChainKey = `ck_0x${randHex(16)}`;
    const newMsgKey = `mk_0x${randHex(16)}`;
    const iv = randHex(8);
    const ct = randHex(48);
    const tag = randHex(8);
    const newCiphertext = `v1:gcm:IV_${iv}:CT_${ct}:TAG_${tag}`;

    setCurrentRootKey(newRootKey);
    setCurrentChainKey(newChainKey);
    setMessageKey(newMsgKey);
    setCiphertext(newCiphertext);

    setRatchetLog(prev => [
      `[Msg #${nextCounter}] Symmetric Ratchet stepped forward: ChainKey = HMAC-SHA256(ChainKey, 0x02)`,
      `[Msg #${nextCounter}] Generated single-use MessageKey = HMAC-SHA256(ChainKey, 0x01)`,
      `[Msg #${nextCounter}] Encrypted payload with AES-256-GCM + 96-bit IV. Erased MessageKey from RAM.`
    ]);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Lock className="w-5 h-5 text-emerald-400" />
              <h2 className="text-xl font-bold text-white tracking-tight">End-to-End Encryption (E2EE) Architecture</h2>
            </div>
            <p className="text-sm text-slate-400 max-w-3xl">
              Signal Protocol / Double Ratchet with X3DH for messaging, AES-256-GCM envelope encryption for 500 MB attachments, and WebRTC DTLS 1.3 / SRTP for peer-to-peer voice and video.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsServerView(!isServerView)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 transition-colors"
            >
              {isServerView ? <EyeOff className="w-3.5 h-3.5 text-amber-400" /> : <Eye className="w-3.5 h-3.5 text-emerald-400" />}
              <span>{isServerView ? 'Viewing as: Cloud Server (Zero-Knowledge)' : 'Viewing as: Authorized Client (Alice)'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Protocol Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-lg">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-3">
            <Key className="w-4 h-4 text-emerald-400" />
          </div>
          <h3 className="font-bold text-sm text-white mb-1">1. Text &amp; Group Messaging</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Powered by the <strong className="text-slate-200">Double Ratchet Protocol</strong> with X3DH key agreement. Generates unique ephemeral keys per message. Forward Secrecy prevents retrospective decryption; Break-in recovery restores secrecy if a key is compromised.
          </p>
          <div className="mt-3 text-[11px] font-mono text-emerald-400/80 bg-slate-950 p-2 rounded border border-slate-800/80">
            Curve25519 + HKDF-SHA256 + AES-256-GCM
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-lg">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-3">
            <Cpu className="w-4 h-4 text-blue-400" />
          </div>
          <h3 className="font-bold text-sm text-white mb-1">2. 1-on-1 Audio &amp; Video Calling</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Protected via <strong className="text-slate-200">WebRTC DTLS-SRTP</strong>. Audio (Opus) and Video (VP8/VP9) streams are encrypted directly between mobile peer endpoints. TURN relays see only encrypted UDP packets.
          </p>
          <div className="mt-3 text-[11px] font-mono text-blue-400/80 bg-slate-950 p-2 rounded border border-slate-800/80">
            DTLS 1.3 Handshake &bull; SRTP AES-128/256-GCM
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-lg">
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-3">
            <FileLock2 className="w-4 h-4 text-purple-400" />
          </div>
          <h3 className="font-bold text-sm text-white mb-1">3. 500 MB File Attachments</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Dual-layer <strong className="text-slate-200">Envelope Encryption</strong>. The client generates a random 256-bit symmetric key, encrypts file chunks locally before upload to S3, and transmits the key only via the E2EE chat envelope.
          </p>
          <div className="mt-3 text-[11px] font-mono text-purple-400/80 bg-slate-950 p-2 rounded border border-slate-800/80">
            Random 256-bit AES Key + In-Band Ratchet Exchange
          </div>
        </div>
      </div>

      {/* Interactive Cryptographic Ratchet Simulator */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              Double Ratchet Key Evolution Simulator
            </h3>
            <p className="text-xs text-slate-400">
              Type a message and click "Send &amp; Step Ratchet" to see how symmetric and asymmetric ratchets advance.
            </p>
          </div>
          <div className="text-xs font-mono text-slate-400 bg-slate-950 px-3 py-1 rounded-md border border-slate-800">
            Message #{messageCounter}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input and Cryptographic Keys */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Client Plaintext Input (Alice)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  placeholder="Enter secret message..."
                />
                <button
                  onClick={handleSimulateRatchet}
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-colors shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send &amp; Step Ratchet</span>
                </button>
              </div>
            </div>

            {/* Current Derived Keys in Device RAM */}
            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                <span>Client Ephemeral Cryptographic State (In-Memory)</span>
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Protected in RAM
                </span>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between items-center bg-slate-900/90 p-2 rounded border border-slate-800">
                  <span className="text-slate-400">Root Key (KDF):</span>
                  <span className="text-emerald-400 truncate max-w-[200px]">{currentRootKey}</span>
                </div>
                <div className="flex justify-between items-center bg-slate-900/90 p-2 rounded border border-slate-800">
                  <span className="text-slate-400">Sender Chain Key:</span>
                  <span className="text-blue-400 truncate max-w-[200px]">{currentChainKey}</span>
                </div>
                <div className="flex justify-between items-center bg-slate-900/90 p-2 rounded border border-slate-800">
                  <span className="text-slate-400">Single-Use Message Key:</span>
                  <span className="text-amber-400 truncate max-w-[200px]">{messageKey}</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-500">
                * Message Key is mathematically zeroized from RAM immediately after AES-256-GCM encryption.
              </p>
            </div>
          </div>

          {/* Wire Payload (What Server Sees) */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  What The Backend Server &amp; Interceptors See
                </label>
                <span className="text-[10px] text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                  Zero-Knowledge Proof
                </span>
              </div>
              <div className={`p-3.5 rounded-xl border text-xs font-mono leading-relaxed transition-all ${
                isServerView 
                  ? 'bg-red-950/20 border-red-900/50 text-red-300' 
                  : 'bg-slate-950 border-slate-800 text-slate-300'
              }`}>
                <div className="text-[11px] text-slate-500 mb-1.5">// Wire Transmission Envelope</div>
                <div className="break-all">
                  <span className="text-slate-500">"envelope": </span>
                  <span className="text-amber-400">"{ciphertext}"</span>
                </div>
                <div className="mt-2 text-[11px] text-slate-500">
                  Plaintext is completely opaque. Without Bob's Curve25519 private ratchet key, brute-forcing 256-bit AES would require billions of years.
                </div>
              </div>
            </div>

            {/* Cryptographic Execution Log */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Cryptographic Ratchet Execution Log
              </label>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80 space-y-1 text-[11px] font-mono text-slate-400 max-h-32 overflow-y-auto">
                {ratchetLog.map((log, idx) => (
                  <div key={idx} className="text-slate-300 flex items-start gap-1.5">
                    <span className="text-emerald-500">&gt;</span>
                    <span>{log}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Security Guarantees Callout */}
        <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/40 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <h4 className="font-bold text-emerald-400 mb-1 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              Forward Secrecy (FS)
            </h4>
            <p className="text-slate-300">
              Each message key is deleted immediately after use. Even if an attacker compromises a phone's physical memory tomorrow, past encrypted messages can NEVER be decrypted.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-emerald-400 mb-1 flex items-center gap-1.5">
              <RefreshCw className="w-4 h-4" />
              Break-In Recovery (Future Secrecy)
            </h4>
            <p className="text-slate-300">
              Asymmetric DH ratchet steps introduce fresh random entropy on every round-trip reply. If a current state is compromised, the attacker loses access the moment the other party responds.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
