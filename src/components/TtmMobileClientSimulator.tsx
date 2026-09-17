import React, { useState, useEffect, useRef } from 'react';
import { TtmLogo } from './TtmLogo';
import { 
  Mic, 
  Square, 
  Play, 
  Pause, 
  Send, 
  Trash2, 
  AlertTriangle, 
  Camera, 
  Paperclip, 
  ShieldCheck, 
  Lock, 
  EyeOff, 
  UserPlus, 
  Check, 
  RefreshCw, 
  Smartphone, 
  Radio, 
  Volume2, 
  Key, 
  FileLock2,
  Users,
  Video,
  Phone,
  MoreVertical,
  ChevronRight,
  Info
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'peer' | 'system';
  senderName: string; // STRICTLY Google Display Name, NO email
  type: 'text' | 'voice' | 'alert';
  text?: string;
  voiceDuration?: string;
  voiceWaveform?: number[];
  timestamp: string;
  expiresIn: string;
  encrypted: boolean;
  alertType?: 'screenshot' | 'recording';
}

interface ContactSuggestion {
  id: string;
  displayName: string; // STRICTLY Google Display Name
  avatarColor: string;
  hashedPhone: string;
  mutualFriends: number;
  status: 'suggested' | 'request_sent' | 'friends';
}

export const TtmMobileClientSimulator: React.FC = () => {
  const [activeScreen, setActiveScreen] = useState<'chat' | 'contacts'>('chat');
  
  // Voice Recording States
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingTime, setRecordingTime] = useState<number>(0);
  const [recordedAudio, setRecordedAudio] = useState<{ duration: string; waveform: number[] } | null>(null);
  const [isPlayingPreview, setIsPlayingPreview] = useState<boolean>(false);
  const [audioInputText, setAudioInputText] = useState<string>('');
  
  // Flag Secure Mode
  const [flagSecureEnabled, setFlagSecureEnabled] = useState<boolean>(false);

  // System Event Logs
  const [systemLogs, setSystemLogs] = useState<string[]>([
    '[INIT] TTM Android App started. FLAG_SECURE: OFF',
    '[IDENTITY] Authenticated with Google Account. Display Name: "Mohammad B." (Raw Gmail hidden)',
    '[CRYPTO] Signal Double Ratchet session established with "Alex Rivera".',
    '[LISTENER] ScreenCaptureCallback (API 34) & ContentObserver registered.'
  ]);

  // Messages List
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'peer',
      senderName: 'Alex Rivera',
      type: 'text',
      text: 'Hey! The confidential protocol looks solid. Ready to test voice notes and screenshot detection?',
      timestamp: '10:42 AM',
      expiresIn: '23h 48m',
      encrypted: true
    },
    {
      id: 'm-2',
      sender: 'user',
      senderName: 'Mohammad B.',
      type: 'text',
      text: 'Yes, remember our rule: Google Display Names only, zero email leakage, and instant alerts if any capture occurs.',
      timestamp: '10:43 AM',
      expiresIn: '23h 49m',
      encrypted: true
    },
    {
      id: 'm-3',
      sender: 'peer',
      senderName: 'Alex Rivera',
      type: 'voice',
      voiceDuration: '0:06',
      voiceWaveform: [35, 60, 85, 40, 95, 70, 50, 80, 65, 90, 45, 30],
      timestamp: '10:44 AM',
      expiresIn: '23h 50m',
      encrypted: true
    }
  ]);

  // Friend Suggestions
  const [suggestions, setSuggestions] = useState<ContactSuggestion[]>([
    {
      id: 'c-1',
      displayName: 'Tariq Mahmood',
      avatarColor: 'from-blue-500 to-indigo-600',
      hashedPhone: 'sha256:8f9a2e...b41c',
      mutualFriends: 5,
      status: 'suggested'
    },
    {
      id: 'c-2',
      displayName: 'Sarah Chen',
      avatarColor: 'from-emerald-500 to-teal-600',
      hashedPhone: 'sha256:3d1b7c...90e2',
      mutualFriends: 8,
      status: 'suggested'
    },
    {
      id: 'c-3',
      displayName: 'Elena Rostova',
      avatarColor: 'from-purple-500 to-pink-600',
      hashedPhone: 'sha256:e4029f...65d8',
      mutualFriends: 3,
      status: 'suggested'
    },
    {
      id: 'c-4',
      displayName: 'Zayd Vance',
      avatarColor: 'from-amber-500 to-orange-600',
      hashedPhone: 'sha256:7c881a...33f1',
      mutualFriends: 12,
      status: 'suggested'
    }
  ]);

  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);

  // Recording Timer Effect
  useEffect(() => {
    let interval: any = null;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      setRecordingTime(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const addLog = (log: string) => {
    const time = new Date().toLocaleTimeString();
    setSystemLogs((prev) => [`[${time}] ${log}`, ...prev.slice(0, 19)]);
  };

  // Start Voice Recording
  const handleStartRecording = () => {
    setIsRecording(true);
    setRecordedAudio(null);
    setIsPlayingPreview(false);
    addLog('VOICE: AudioRecord started (48kHz, Opus/PCM, 16-bit stereo).');
  };

  // Stop Recording
  const handleStopRecording = () => {
    if (!isRecording) return;
    setIsRecording(false);
    
    // Generate simulated waveform
    const durationSec = Math.max(1, recordingTime);
    const waveform = Array.from({ length: 14 }, () => Math.floor(Math.random() * 65) + 25);
    const formatted = `0:${durationSec < 10 ? '0' : ''}${durationSec}`;
    
    setRecordedAudio({
      duration: formatted,
      waveform
    });
    addLog(`VOICE: Audio recording stopped. Duration: ${formatted}. Generated AES-256-GCM symmetric session key.`);
  };

  // Send Recorded Voice Note
  const handleSendVoiceNote = () => {
    if (!recordedAudio) return;

    addLog('E2EE: Encrypting Voice Note locally via Signal Protocol (AES-256-GCM).');
    addLog('NETWORK: Transmitting encrypted voice ciphertext to recipient WebSocket.');

    const newMsg: ChatMessage = {
      id: `v-${Date.now()}`,
      sender: 'user',
      senderName: 'Mohammad B.',
      type: 'voice',
      voiceDuration: recordedAudio.duration,
      voiceWaveform: recordedAudio.waveform,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      expiresIn: '24h 00m',
      encrypted: true
    };

    setMessages((prev) => [...prev, newMsg]);
    setRecordedAudio(null);
    setIsPlayingPreview(false);
  };

  // Cancel Voice Note
  const handleCancelVoiceNote = () => {
    setIsRecording(false);
    setRecordedAudio(null);
    setIsPlayingPreview(false);
    addLog('VOICE: Recording canceled & memory zeroized.');
  };

  // Send Text Message
  const handleSendText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!audioInputText.trim()) return;

    const newMsg: ChatMessage = {
      id: `t-${Date.now()}`,
      sender: 'user',
      senderName: 'Mohammad B.',
      type: 'text',
      text: audioInputText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      expiresIn: '24h 00m',
      encrypted: true
    };

    setMessages((prev) => [...prev, newMsg]);
    setAudioInputText('');
    addLog('E2EE: Text message encrypted with Double Ratchet message key & sent.');
  };

  // Trigger Screenshot Alert
  const handleSimulateScreenshot = () => {
    if (flagSecureEnabled) {
      addLog('BLOCKED: Screenshot prevented by WindowManager.FLAG_SECURE.');
      return;
    }

    addLog('ALERT: Screenshot detected via native Android 14 ScreenCaptureCallback & MediaStore ContentObserver.');
    addLog('DISPATCH: Real-time event "SCREENSHOT_DETECTED" sent to chat room session.');

    const alertMsg: ChatMessage = {
      id: `alert-${Date.now()}`,
      sender: 'system',
      senderName: 'System Security Event',
      type: 'alert',
      alertType: 'screenshot',
      text: 'ALERT: Screenshot Detected on Device.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      expiresIn: '24h 00m',
      encrypted: false
    };

    setMessages((prev) => [...prev, alertMsg]);
  };

  // Trigger Screen Recording Alert
  const handleSimulateScreenRecording = () => {
    if (flagSecureEnabled) {
      addLog('BLOCKED: Screen recording output blacked out by WindowManager.FLAG_SECURE.');
      return;
    }

    addLog('ALERT: Active Screen Recording detected via DisplayManager (Virtual Display detected).');
    addLog('DISPATCH: Real-time event "SCREEN_RECORDING_DETECTED" sent to chat room session.');

    const alertMsg: ChatMessage = {
      id: `alert-${Date.now()}`,
      sender: 'system',
      senderName: 'System Security Event',
      type: 'alert',
      alertType: 'recording',
      text: 'ALERT: Screen Recording Detected in Active Session.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      expiresIn: '24h 00m',
      encrypted: false
    };

    setMessages((prev) => [...prev, alertMsg]);
  };

  // Add Friend Handler
  const handleAddFriend = (id: string, name: string) => {
    setSuggestions((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'request_sent' } : c))
    );
    addLog(`FRIEND_REQUEST: Sent E2EE handshake invitation to "${name}". Raw phone/email never exposed.`);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Architecture Context */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <TtmLogo size="md" />
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Talk To Me (TTM) Mobile Client Simulator
                </h2>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Android Native UI
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-300 max-w-3xl">
              Live interactive demonstration of the TTM Android interface featuring the <span className="text-emerald-400 font-medium">TTM Shield Logo</span>, <span className="text-emerald-400 font-medium">Google Display Name only</span> (zero Gmail leakage), <span className="text-emerald-400 font-medium">press-and-hold Voice Notes</span> with real-time waveform, and <span className="text-emerald-400 font-medium">native Screenshot & Screen Recording alerts</span>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveScreen('chat')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeScreen === 'chat'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Active Chat & Voice Notes</span>
            </button>
            <button
              onClick={() => setActiveScreen('contacts')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeScreen === 'contacts'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Contact Sync & Suggestions</span>
            </button>
          </div>
        </div>

        {/* Privacy Enforcement Notice Box */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-emerald-400 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Strict Privacy Rule: Display Names Only &bull; Raw Gmail address (user@gmail.com) is NEVER exposed or stored</span>
          </div>
          <div className="flex items-center gap-3 text-slate-400">
            <span className="flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              Signal Protocol E2EE
            </span>
            <span className="flex items-center gap-1">
              <EyeOff className="w-3.5 h-3.5 text-teal-400" />
              Zero-Knowledge PSI
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Device Simulator & System Security Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left/Center: Phone Mockup Frame (7 cols) */}
        <div className="lg:col-span-7 flex justify-center">
          <div className="w-full max-w-md bg-slate-950 border-4 border-slate-800 rounded-[40px] shadow-2xl overflow-hidden flex flex-col h-[740px] relative ring-1 ring-emerald-500/20">
            
            {/* Android Status Bar with Punch Hole Camera */}
            <div className="bg-slate-950 px-6 pt-3 pb-2 flex items-center justify-between text-[11px] text-slate-400 select-none z-30">
              <span className="font-semibold text-white">10:45</span>
              {/* Camera cutout */}
              <div className="w-3.5 h-3.5 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>5G</span>
                <span>100%</span>
              </div>
            </div>

            {/* TTM Mobile Toolbar / Header */}
            <div className="bg-slate-900/95 backdrop-blur border-b border-slate-800 px-4 py-2.5 flex items-center justify-between z-20">
              <div className="flex items-center gap-2.5">
                {/* TTM Shield Logo */}
                <TtmLogo size="sm" />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-white tracking-tight">
                      {activeScreen === 'chat' ? 'Alex Rivera' : 'Friend Suggestions'}
                    </span>
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-emerald-400">
                    <Lock className="w-2.5 h-2.5" />
                    <span>
                      {activeScreen === 'chat' ? 'Google Profile Name &bull; Signal E2EE' : 'Private Set Intersection'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Icons */}
              <div className="flex items-center gap-1 text-slate-400">
                {activeScreen === 'chat' ? (
                  <>
                    <button className="p-1.5 hover:bg-slate-800 rounded-full hover:text-white transition-colors" title="Start E2EE Voice Call">
                      <Phone className="w-4 h-4 text-emerald-400" />
                    </button>
                    <button className="p-1.5 hover:bg-slate-800 rounded-full hover:text-white transition-colors" title="Start E2EE Video Call">
                      <Video className="w-4 h-4 text-emerald-400" />
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={() => setActiveScreen('chat')}
                    className="text-xs text-emerald-400 font-semibold px-2 py-1 bg-emerald-500/10 rounded-lg border border-emerald-500/30"
                  >
                    Open Chat
                  </button>
                )}
              </div>
            </div>

            {/* SCREEN A: ACTIVE CHAT VIEW */}
            {activeScreen === 'chat' && (
              <div className="flex-1 flex flex-col justify-between bg-slate-950 overflow-hidden">
                
                {/* Chat Session Messages Scroll Area */}
                <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs scrollbar-thin">
                  {/* Encrypted Session Banner */}
                  <div className="text-center my-1">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[10px] text-slate-400">
                      <Lock className="w-3 h-3 text-emerald-400" />
                      End-to-End Encrypted &bull; 24h Ephemeral Auto-Destruct
                    </span>
                  </div>

                  {messages.map((msg) => {
                    // Alert System Message
                    if (msg.type === 'alert') {
                      return (
                        <div key={msg.id} className="my-2 p-2.5 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-200 flex items-start gap-2.5 animate-bounce shadow-lg shadow-rose-950/50">
                          <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <div className="font-bold text-[11px] text-rose-300 flex items-center justify-between">
                              <span>{msg.text}</span>
                              <span className="text-[9px] text-rose-400/80">{msg.timestamp}</span>
                            </div>
                            <p className="text-[10px] text-rose-300/80 mt-0.5">
                              {msg.alertType === 'screenshot' 
                                ? 'Screenshot detected on client display via native Android ContentObserver / ScreenCaptureCallback.'
                                : 'Screen recording detected via Android DisplayManager Virtual Display API.'}
                            </p>
                          </div>
                        </div>
                      );
                    }

                    const isMe = msg.sender === 'user';
                    return (
                      <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                        {/* Display Name Label (NO EMAIL) */}
                        <div className="flex items-center gap-1 text-[10px] text-slate-400 mb-1 px-1">
                          <span className="font-medium text-slate-300">{msg.senderName}</span>
                          <span className="text-slate-600">&bull;</span>
                          <span className="text-slate-500">{msg.timestamp}</span>
                        </div>

                        {/* Message Bubble */}
                        <div className={`max-w-[82%] rounded-2xl p-3 shadow-md ${
                          isMe 
                            ? 'bg-emerald-600 text-white rounded-br-none' 
                            : 'bg-slate-800 text-slate-100 rounded-bl-none border border-slate-700/60'
                        }`}>
                          {msg.type === 'text' && (
                            <p className="leading-relaxed">{msg.text}</p>
                          )}

                          {msg.type === 'voice' && (
                            <div className="flex items-center gap-3 min-w-[200px]">
                              <button
                                onClick={() => setPlayingMessageId(playingMessageId === msg.id ? null : msg.id)}
                                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-transform ${
                                  isMe ? 'bg-white text-emerald-700' : 'bg-emerald-500 text-slate-950'
                                }`}
                              >
                                {playingMessageId === msg.id ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                              </button>

                              {/* Waveform Visualizer */}
                              <div className="flex-1 flex items-center gap-1 h-7">
                                {(msg.voiceWaveform || [40, 70, 50, 90, 60, 40, 80]).map((h, i) => (
                                  <div
                                    key={i}
                                    style={{ height: `${h}%` }}
                                    className={`w-1 rounded-full transition-all duration-200 ${
                                      playingMessageId === msg.id 
                                        ? isMe ? 'bg-white animate-pulse' : 'bg-emerald-400 animate-pulse'
                                        : isMe ? 'bg-emerald-200' : 'bg-slate-400'
                                    }`}
                                  />
                                ))}
                              </div>

                              <span className={`text-[10px] font-mono ${isMe ? 'text-emerald-100' : 'text-slate-400'}`}>
                                {msg.voiceDuration || '0:05'}
                              </span>
                            </div>
                          )}

                          {/* Footer with Encrypted & Ephemeral countdown */}
                          <div className={`flex items-center justify-between gap-2 mt-1.5 pt-1 border-t text-[9px] ${
                            isMe ? 'border-emerald-500/50 text-emerald-100/90' : 'border-slate-700/60 text-slate-400'
                          }`}>
                            <span className="flex items-center gap-0.5">
                              <Lock className="w-2.5 h-2.5" />
                              AES-256
                            </span>
                            <span>TTL: {msg.expiresIn}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* BOTTOM CHAT INPUT BAR & VOICE RECORDER */}
                <div className="p-3 bg-slate-900 border-t border-slate-800">
                  
                  {/* Active Recording or Preview State */}
                  {isRecording ? (
                    <div className="flex items-center justify-between gap-3 p-2 bg-slate-950 rounded-2xl border border-rose-500/50">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
                        <span className="text-xs font-mono font-bold text-rose-400">
                          0:{recordingTime < 10 ? '0' : ''}{recordingTime}
                        </span>
                      </div>

                      {/* Animated live waveform during recording */}
                      <div className="flex-1 flex items-center justify-center gap-1 h-6 px-2">
                        {[30, 60, 90, 45, 75, 100, 50, 80, 40, 95, 60, 35].map((val, idx) => (
                          <div
                            key={idx}
                            style={{ height: `${val}%` }}
                            className="w-1 bg-rose-500 rounded-full animate-pulse"
                          />
                        ))}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={handleCancelVoiceNote}
                          className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full"
                          title="Cancel recording"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={handleStopRecording}
                          className="px-3 py-1 bg-emerald-500 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1 shadow-md shadow-emerald-500/30"
                        >
                          <Square className="w-3.5 h-3.5 fill-current" />
                          <span>Stop</span>
                        </button>
                      </div>
                    </div>
                  ) : recordedAudio ? (
                    /* Preview Mode before Sending */
                    <div className="flex items-center justify-between gap-2 p-2 bg-slate-950 rounded-2xl border border-emerald-500/50">
                      <button
                        onClick={() => setIsPlayingPreview(!isPlayingPreview)}
                        className="w-8 h-8 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center flex-shrink-0"
                      >
                        {isPlayingPreview ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                      </button>

                      <div className="flex-1 flex items-center gap-1 h-6">
                        {recordedAudio.waveform.map((h, i) => (
                          <div
                            key={i}
                            style={{ height: `${h}%` }}
                            className={`w-1 rounded-full ${isPlayingPreview ? 'bg-emerald-400 animate-pulse' : 'bg-slate-400'}`}
                          />
                        ))}
                      </div>

                      <span className="text-[10px] font-mono text-emerald-400">{recordedAudio.duration}</span>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={handleCancelVoiceNote}
                          className="p-1.5 text-slate-400 hover:text-rose-400 rounded-full"
                          title="Discard"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={handleSendVoiceNote}
                          className="p-2 bg-emerald-500 text-slate-950 rounded-xl hover:bg-emerald-400 transition-colors shadow-md shadow-emerald-500/30"
                          title="Encrypt & Send"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Standard Input Bar with Press-and-Hold Voice Mic */
                    <form onSubmit={handleSendText} className="flex items-center gap-2">
                      <div className="flex items-center gap-1 text-slate-400">
                        <button type="button" className="p-1.5 hover:text-white hover:bg-slate-800 rounded-full" title="500MB Chunked Encrypted Attachment">
                          <Paperclip className="w-4 h-4" />
                        </button>
                      </div>

                      <input
                        type="text"
                        value={audioInputText}
                        onChange={(e) => setAudioInputText(e.target.value)}
                        placeholder="Encrypted message (Alex Rivera)..."
                        className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                      />

                      {audioInputText.trim().length > 0 ? (
                        <button
                          type="submit"
                          className="p-2 bg-emerald-500 text-slate-950 rounded-xl hover:bg-emerald-400 transition-colors"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={handleStartRecording}
                          className="p-2.5 bg-emerald-500 text-slate-950 rounded-xl hover:bg-emerald-400 active:scale-95 transition-all shadow-md shadow-emerald-500/30 flex items-center justify-center group"
                          title="Press to Record Voice Note"
                        >
                          <Mic className="w-4 h-4 stroke-[2.5]" />
                        </button>
                      )}
                    </form>
                  )}

                  <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2 px-1">
                    <span>Press Mic to record Voice Note with AES-256</span>
                    <span className="text-emerald-400 font-medium">Display Name Only</span>
                  </div>
                </div>
              </div>
            )}

            {/* SCREEN B: CONTACT SYNC & FRIEND SUGGESTIONS */}
            {activeScreen === 'contacts' && (
              <div className="flex-1 flex flex-col bg-slate-950 overflow-hidden p-4">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 mb-4">
                  <div className="flex items-center gap-2 mb-1 text-emerald-400 font-bold text-xs">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Zero-Knowledge Contact Matching (PSI)</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Contacts on this phone were hashed locally via <code className="text-emerald-300 font-mono">SHA-256(E.164 + Salt)</code>. Only registered TTM users match via Private Set Intersection. Raw numbers and emails are never disclosed.
                  </p>
                </div>

                <div className="flex items-center justify-between mb-2 px-1">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Friend Suggestions ({suggestions.length})
                  </span>
                  <span className="text-[10px] text-emerald-400">Display Names Only</span>
                </div>

                <div className="flex-1 overflow-y-auto space-y-2.5 scrollbar-thin">
                  {suggestions.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-2xl bg-slate-900 border border-slate-800/80 hover:border-emerald-500/40 transition-colors flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-tr ${item.avatarColor} flex items-center justify-center font-bold text-white text-xs shadow-md`}>
                          {item.displayName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-bold text-xs text-white flex items-center gap-1.5">
                            <span>{item.displayName}</span>
                            <span className="text-[9px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                              Verified
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                            <span>{item.mutualFriends} mutual friends</span>
                            <span className="text-slate-600">&bull;</span>
                            <span className="font-mono text-[9px] text-slate-500">{item.hashedPhone}</span>
                          </div>
                        </div>
                      </div>

                      {item.status === 'suggested' ? (
                        <button
                          onClick={() => handleAddFriend(item.id, item.displayName)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-emerald-500/20"
                        >
                          <UserPlus className="w-3.5 h-3.5" />
                          <span>Add</span>
                        </button>
                      ) : (
                        <span className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-800 text-emerald-400 font-semibold text-xs border border-emerald-500/30">
                          <Check className="w-3.5 h-3.5" />
                          <span>Invited</span>
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => {
                    addLog('CONTACT_SYNC: Triggered fresh local SHA-256 hash scan against Android ContactsContract.');
                  }}
                  className="mt-3 w-full py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-xs font-semibold text-slate-300 flex items-center justify-center gap-2 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Rescan Local Address Book (SHA-256)</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right: Security & Alert Injection Control Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Real-Time Attack / Alert Test Station */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-sm text-white">Native Android Alert Test Station</h3>
              </div>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                Interactive
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Simulate native Android OS events. TTM intercepts capture attempts in real time and broadcasts a system warning to both chat participants.
            </p>

            <div className="space-y-2.5">
              {/* Screenshot Trigger */}
              <button
                onClick={handleSimulateScreenshot}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-rose-500/60 text-left transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 group-hover:bg-rose-500 group-hover:text-slate-950 transition-colors">
                    <Camera className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-xs text-white block">Capture Screenshot</span>
                    <span className="text-[10px] text-slate-400">Triggers ContentObserver / ScreenCaptureCallback</span>
                  </div>
                </div>
                <span className="text-xs text-rose-400 font-semibold group-hover:translate-x-0.5 transition-transform">Fire Alert &rarr;</span>
              </button>

              {/* Screen Recording Trigger */}
              <button
                onClick={handleSimulateScreenRecording}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/60 text-left transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                    <Video className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-xs text-white block">Start Screen Recording</span>
                    <span className="text-[10px] text-slate-400">Triggers DisplayManager Virtual Display Listener</span>
                  </div>
                </div>
                <span className="text-xs text-amber-400 font-semibold group-hover:translate-x-0.5 transition-transform">Fire Alert &rarr;</span>
              </button>

              {/* Toggle FLAG_SECURE */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center gap-2.5">
                  <Lock className={`w-4 h-4 ${flagSecureEnabled ? 'text-emerald-400' : 'text-slate-500'}`} />
                  <div>
                    <span className="text-xs font-bold text-white block">WindowManager.FLAG_SECURE</span>
                    <span className="text-[10px] text-slate-400">Hard-blocks OS frame capture (black screen)</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    const next = !flagSecureEnabled;
                    setFlagSecureEnabled(next);
                    addLog(`CONFIG: FLAG_SECURE turned ${next ? 'ON (Capture physically blocked)' : 'OFF (Detection mode active)'}`);
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                    flagSecureEnabled ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {flagSecureEnabled ? 'ENABLED' : 'DISABLED'}
                </button>
              </div>
            </div>
          </div>

          {/* Privacy & Identity Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <EyeOff className="w-4 h-4 text-emerald-400" />
              <h3 className="font-bold text-sm text-white">Google Identity & Zero Email Policy</h3>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2 text-xs text-slate-300">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Google Display Name:</span>
                <span className="font-semibold text-emerald-400">Mohammad B. (Shown in UI)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Raw Gmail Address:</span>
                <span className="font-mono text-rose-400 line-through">mohammadbiyabani126@...</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Status:</span>
                <span className="font-semibold text-emerald-400">STRICTLY OBFUSCATED / PURGED</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-2.5">
              The client code strips all email identifiers during OAuth JWT token acquisition. Only the authenticated Google <code className="text-emerald-400">displayName</code> is utilized for peer discovery, chat headers, and contact pairing.
            </p>
          </div>

          {/* Real-time System Security Log */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">Audit Event Stream</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">{systemLogs.length} events</span>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 h-44 overflow-y-auto font-mono text-[10px] text-slate-300 space-y-1.5 scrollbar-thin">
              {systemLogs.map((log, index) => (
                <div key={index} className="leading-snug">
                  {log.includes('ALERT') || log.includes('SCREENSHOT') || log.includes('RECORDING') ? (
                    <span className="text-rose-400 font-bold">{log}</span>
                  ) : log.includes('VOICE') || log.includes('E2EE') ? (
                    <span className="text-emerald-400">{log}</span>
                  ) : log.includes('IDENTITY') ? (
                    <span className="text-teal-300">{log}</span>
                  ) : (
                    <span className="text-slate-400">{log}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
