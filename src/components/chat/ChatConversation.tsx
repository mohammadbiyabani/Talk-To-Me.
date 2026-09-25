import React, { useState, useRef, useEffect } from 'react';
import { Conversation, ChatMessage, UserProfile } from '../../types/chat';
import { 
  Send, 
  Mic, 
  Square, 
  Play, 
  Pause, 
  Paperclip, 
  ShieldCheck, 
  Lock, 
  Clock, 
  Info, 
  Phone, 
  Video, 
  AlertTriangle, 
  Check, 
  CheckCheck, 
  Trash2,
  Image as ImageIcon
} from 'lucide-react';

interface ChatConversationProps {
  conversation: Conversation;
  currentUser: UserProfile;
  onSendMessage: (text: string) => void;
  onSendVoiceNote: (duration: string, waveform: number[]) => void;
  onSendImageMessage: (caption: string) => void;
  onToggleInfoPanel: () => void;
  onSimulateScreenshot: () => void;
}

export const ChatConversation: React.FC<ChatConversationProps> = ({
  conversation,
  currentUser,
  onSendMessage,
  onSendVoiceNote,
  onSendImageMessage,
  onToggleInfoPanel,
  onSimulateScreenshot,
}) => {
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);
  const [playbackProgress, setPlaybackProgress] = useState<{ [id: string]: number }>({});
  const [callNotification, setCallNotification] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const playbackTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation.messages]);

  // Voice recording timer
  useEffect(() => {
    if (isRecording) {
      setRecordingSeconds(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    }
    return () => {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    };
  }, [isRecording]);

  // Voice note playback simulation
  const handleTogglePlayVoice = (msgId: string, durationStr = '0:06') => {
    if (playingMessageId === msgId) {
      // Pause
      setPlayingMessageId(null);
      if (playbackTimerRef.current) clearInterval(playbackTimerRef.current);
      return;
    }

    if (playbackTimerRef.current) clearInterval(playbackTimerRef.current);
    setPlayingMessageId(msgId);
    setPlaybackProgress((prev) => ({ ...prev, [msgId]: 0 }));

    const totalSeconds = parseInt(durationStr.split(':')[1] || '6', 10);
    let currentStep = 0;
    const intervalMs = 200;
    const totalSteps = (totalSeconds * 1000) / intervalMs;

    playbackTimerRef.current = setInterval(() => {
      currentStep++;
      const pct = Math.min((currentStep / totalSteps) * 100, 100);
      setPlaybackProgress((prev) => ({ ...prev, [msgId]: pct }));

      if (pct >= 100) {
        if (playbackTimerRef.current) clearInterval(playbackTimerRef.current);
        setPlayingMessageId(null);
      }
    }, intervalMs);
  };

  const handleSendText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const handleStartRecording = () => {
    setIsRecording(true);
  };

  const handleCancelRecording = () => {
    setIsRecording(false);
    setRecordingSeconds(0);
  };

  const handleFinishRecording = () => {
    const mins = Math.floor(recordingSeconds / 60);
    const secs = recordingSeconds % 60;
    const formatted = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    const waveform = [25, 45, 80, 60, 95, 75, 40, 90, 65, 85, 30, 70, 50];
    onSendVoiceNote(formatted || '0:03', waveform);
    setIsRecording(false);
    setRecordingSeconds(0);
  };

  const handleCall = (type: 'Audio' | 'Video') => {
    setCallNotification(`Encrypted ${type} Call with ${conversation.peer.name} connecting...`);
    setTimeout(() => {
      setCallNotification(null);
    }, 3500);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 overflow-hidden relative">
      {/* Call notification banner */}
      {callNotification && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-40 bg-emerald-950 border border-emerald-500/80 text-emerald-200 px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-2xl animate-fade-in">
          <Phone className="w-3.5 h-3.5 text-emerald-400 animate-bounce" />
          <span>{callNotification}</span>
        </div>
      )}

      {/* Conversation Top Header */}
      <header className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative shrink-0">
            <div
              className={`w-9 h-9 rounded-full bg-gradient-to-tr ${conversation.peer.avatarColor} flex items-center justify-center text-white font-semibold text-xs`}
            >
              {conversation.peer.name
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')}
            </div>
            <span
              className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-slate-900 ${
                conversation.peer.status === 'online'
                  ? 'bg-emerald-500'
                  : conversation.peer.status === 'away'
                  ? 'bg-amber-500'
                  : 'bg-slate-500'
              }`}
            />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white truncate">
                {conversation.peer.name}
              </h2>
              <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                <Lock className="w-2.5 h-2.5" />
                <span>E2EE</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate">
              {conversation.peer.lastSeen || 'Active now'} · Signal Protocol
            </p>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Quick Screenshot Simulation Button */}
          <button
            onClick={onSimulateScreenshot}
            title="Simulate Screenshot Capture Detection"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-950/40 hover:bg-amber-900/50 border border-amber-800/80 text-amber-300 text-xs font-medium transition-colors"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Test Alert</span>
          </button>

          <button
            onClick={() => handleCall('Audio')}
            title="Secure Voice Call"
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <Phone className="w-4 h-4" />
          </button>

          <button
            onClick={() => handleCall('Video')}
            title="Secure Video Call"
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <Video className="w-4 h-4" />
          </button>

          <button
            onClick={onToggleInfoPanel}
            title="Chat Security Details"
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Ephemeral Notice Banner */}
      <div className="bg-slate-900/50 border-b border-slate-800/60 px-4 py-1.5 text-center text-[11px] text-slate-400 flex items-center justify-center gap-2">
        <Clock className="w-3 h-3 text-emerald-400" />
        <span>
          Disappearing messages:{' '}
          <strong className="text-slate-200 font-medium">
            {conversation.ephemeralTimer === 'off' ? 'Off' : `${conversation.ephemeralTimer} timer`}
          </strong>
        </span>
        <span aria-hidden="true">·</span>
        <span>Screenshot detection active</span>
      </div>

      {/* Messages Timeline */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {conversation.messages.map((msg) => {
          const isMe = msg.senderId === currentUser.id;

          // Alert Message (e.g. Screenshot taken)
          if (msg.type === 'alert') {
            return (
              <div key={msg.id} className="flex justify-center my-2">
                <div className="bg-amber-950/70 border border-amber-800/80 rounded-xl px-4 py-2 text-xs text-amber-200 flex items-center gap-2 max-w-md shadow-md">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <span className="font-semibold">{msg.content}</span>
                    <span className="block text-[10px] text-amber-400/80 font-mono mt-0.5">
                      {msg.timestamp} · Android ScreenCaptureCallback event
                    </span>
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-end gap-2 max-w-[85%] sm:max-w-[70%]">
                {/* Bubble Container */}
                <div
                  className={`rounded-2xl px-4 py-2.5 shadow-sm text-xs sm:text-sm ${
                    isMe
                      ? 'bg-emerald-700 text-white rounded-br-xs'
                      : 'bg-slate-900 border border-slate-800 text-slate-100 rounded-bl-xs'
                  }`}
                >
                  {/* Sender Display Name (if not me) */}
                  {!isMe && (
                    <div className="text-[10px] font-semibold text-emerald-400 mb-1 flex items-center gap-1">
                      <span>{msg.senderName}</span>
                      <span className="text-[9px] text-slate-500 font-normal">
                        (Google Display Name)
                      </span>
                    </div>
                  )}

                  {/* Text Message */}
                  {msg.type === 'text' && (
                    <p className="whitespace-pre-wrap leading-relaxed select-text">
                      {msg.content}
                    </p>
                  )}

                  {/* Voice Note */}
                  {msg.type === 'voice' && (
                    <div className="flex items-center gap-3 py-1">
                      <button
                        onClick={() => handleTogglePlayVoice(msg.id, msg.voiceDuration)}
                        className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-transform ${
                          isMe
                            ? 'bg-emerald-950 hover:bg-emerald-900 text-white'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold'
                        }`}
                      >
                        {playingMessageId === msg.id ? (
                          <Pause className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4 ml-0.5" />
                        )}
                      </button>

                      {/* Waveform Visualization */}
                      <div className="flex-1 min-w-[140px] sm:min-w-[180px]">
                        <div className="flex items-center gap-0.5 h-6">
                          {(msg.voiceWaveform || [30, 60, 45, 80, 50, 90, 40, 70]).map(
                            (height, idx) => {
                              const progress = playbackProgress[msg.id] || 0;
                              const barPct = (idx / (msg.voiceWaveform?.length || 8)) * 100;
                              const isPlayed = barPct <= progress;
                              return (
                                <div
                                  key={idx}
                                  className={`w-1 rounded-full transition-all ${
                                    isPlayed
                                      ? isMe
                                        ? 'bg-white'
                                        : 'bg-emerald-400'
                                      : isMe
                                      ? 'bg-emerald-900/80'
                                      : 'bg-slate-700'
                                  }`}
                                  style={{ height: `${Math.max(20, height)}%` }}
                                />
                              );
                            }
                          )}
                        </div>

                        <div className="flex items-center justify-between text-[10px] mt-1 font-mono text-slate-300">
                          <span>{msg.voiceDuration || '0:06'}</span>
                          <span className="text-[9px] opacity-75">AES-256 Voice</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Image Attachment */}
                  {msg.type === 'image' && (
                    <div className="space-y-1.5">
                      <div className="w-60 h-36 bg-slate-950 rounded-lg flex items-center justify-center border border-slate-800 text-slate-400 text-xs">
                        <div className="flex flex-col items-center gap-1.5">
                          <ImageIcon className="w-6 h-6 text-emerald-400" />
                          <span className="font-mono text-[10px]">Encrypted Image Payload</span>
                        </div>
                      </div>
                      {msg.content && <p className="text-xs pt-1">{msg.content}</p>}
                    </div>
                  )}

                  {/* Metadata: Timestamp & Delivery Status */}
                  <div
                    className={`flex items-center justify-end gap-1.5 mt-1 text-[10px] ${
                      isMe ? 'text-emerald-200' : 'text-slate-400'
                    }`}
                  >
                    {msg.expiresIn && (
                      <span className="font-mono opacity-80 flex items-center gap-0.5">
                        <Clock className="w-2.5 h-2.5" />
                        {msg.expiresIn}
                      </span>
                    )}
                    <span className="font-mono tabular-nums">{msg.timestamp}</span>
                    {isMe && (
                      <span>
                        {msg.status === 'read' ? (
                          <CheckCheck className="w-3.5 h-3.5 text-white" />
                        ) : (
                          <Check className="w-3.5 h-3.5 opacity-80" />
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Bottom Message Input Bar */}
      <div className="p-3 sm:p-4 bg-slate-900 border-t border-slate-800 shrink-0">
        {isRecording ? (
          /* Live Voice Recording UI */
          <div className="flex items-center justify-between bg-slate-950 border border-emerald-500/50 rounded-2xl px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
              <span className="text-xs font-mono font-semibold text-emerald-400">
                Recording Voice Note: {Math.floor(recordingSeconds / 60)}:
                {recordingSeconds % 60 < 10 ? '0' : ''}
                {recordingSeconds % 60}
              </span>
              <span className="text-[11px] text-slate-400 hidden sm:inline">
                · Hardware AES-256 encryption
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCancelRecording}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                title="Discard"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={handleFinishRecording}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-xl text-xs transition-colors"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Send Note</span>
              </button>
            </div>
          </div>
        ) : (
          /* Standard Input Form */
          <form onSubmit={handleSendText} className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onSendImageMessage('Confidential document payload')}
              title="Attach Encrypted Media"
              className="p-2.5 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Message ${conversation.peer.name}...`}
              className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
            />

            {inputText.trim() ? (
              <button
                type="submit"
                className="p-2.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-xl transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-400"
              >
                <Send className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleStartRecording}
                title="Record Encrypted Voice Note"
                className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-emerald-400 rounded-xl transition-colors focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <Mic className="w-4 h-4" />
              </button>
            )}
          </form>
        )}
      </div>
    </div>
  );
};
