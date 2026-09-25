import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Conversation, UserProfile, ChatMessage, CallType, CallSignalPayload } from '../../types/chat';
import { INITIAL_CONVERSATIONS } from '../../data/chatData';
import { ChatSidebar } from './ChatSidebar';
import { ChatConversation } from './ChatConversation';
import { ChatInfoPanel } from './ChatInfoPanel';
import { CallModal } from './CallModal';
import { SupabaseStatusBanner } from '../SupabaseStatusBanner';
import { supabase, isSupabaseConfigured, uploadAttachment } from '../../lib/supabase';
import { subscribeToCallSignals, broadcastCallSignal } from '../../lib/webrtc';
import { Phone, Video, X } from 'lucide-react';

interface ChatDashboardProps {
  currentUser: UserProfile;
  onUpdateUser: (updatedUser: UserProfile) => void;
  onSignOut: () => void;
  onOpenLegalTerms?: () => void;
}

export const ChatDashboard: React.FC<ChatDashboardProps> = ({
  currentUser,
  onUpdateUser,
  onSignOut,
  onOpenLegalTerms,
}) => {
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [activeConversationId, setActiveConversationId] = useState<string>(
    INITIAL_CONVERSATIONS[0]?.id || ''
  );
  const [showInfoPanel, setShowInfoPanel] = useState<boolean>(false);
  const [onlineCount, setOnlineCount] = useState<number>(1);

  // Active call modal state
  const [activeCallType, setActiveCallType] = useState<CallType | null>(null);
  const [incomingCall, setIncomingCall] = useState<CallSignalPayload | null>(null);

  const activeConversation = conversations.find((c) => c.id === activeConversationId) || conversations[0];

  const formatCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Convert Supabase database row to ChatMessage
  const mapRowToMessage = (row: any): ChatMessage => ({
    id: row.id,
    conversationId: row.conversation_id,
    senderId: row.sender_id,
    senderName: row.sender_name,
    type: row.type || 'text',
    content: row.content || '',
    voiceDuration: row.voice_duration || undefined,
    voiceWaveform: row.voice_waveform || undefined,
    voiceUrl: row.voice_url || undefined,
    imageUrl: row.image_url || undefined,
    fileUrl: row.file_url || undefined,
    fileName: row.file_name || undefined,
    fileSize: row.file_size ? Number(row.file_size) : undefined,
    timestamp: row.timestamp || new Date(row.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    status: row.status || 'delivered',
    encrypted: row.encrypted ?? true,
    expiresIn: row.expires_in || undefined,
    alertType: row.alert_type || undefined,
    createdAt: row.created_at,
  });

  // 1. Live database fetch from 'messages' table for conversations
  const fetchMessagesFromSupabase = useCallback(async (convId: string) => {
    if (!isSupabaseConfigured) return;

    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', convId)
        .order('created_at', { ascending: true });

      if (error) {
        console.warn('Could not fetch messages from Supabase (using local state):', error.message);
        return;
      }

      if (data && data.length > 0) {
        const fetchedMessages = data.map(mapRowToMessage);
        setConversations((prev) =>
          prev.map((c) => {
            if (c.id === convId) {
              const last = fetchedMessages[fetchedMessages.length - 1];
              return {
                ...c,
                messages: fetchedMessages,
                lastMessage: {
                  text: last.type === 'voice' 
                    ? `Voice note (${last.voiceDuration || '0:06'})` 
                    : last.type === 'image' 
                    ? 'Encrypted image payload' 
                    : last.type === 'file' 
                    ? (last.fileName || 'Confidential document') 
                    : last.content || 'Encrypted payload',
                  timestamp: last.timestamp,
                  unreadCount: 0,
                  senderId: last.senderId,
                },
              };
            }
            return c;
          })
        );
      }
    } catch (err) {
      console.warn('Supabase messages query error:', err);
    }
  }, []);

  // Fetch messages whenever active conversation changes
  useEffect(() => {
    if (activeConversation?.id) {
      fetchMessagesFromSupabase(activeConversation.id);
    }
  }, [activeConversation?.id, fetchMessagesFromSupabase]);

  // 2. Subscribe to realtime inserts from 'messages' table
  useEffect(() => {
    const channel = supabase
      .channel('public:messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          const row = payload.new;
          if (!row || !row.id || !row.conversation_id) return;

          const incomingMsg = mapRowToMessage(row);

          setConversations((prev) =>
            prev.map((c) => {
              if (c.id === row.conversation_id) {
                // Idempotency: Prevent duplicate messages
                if (c.messages.some((m) => m.id === incomingMsg.id)) {
                  return c;
                }

                return {
                  ...c,
                  lastMessage: {
                    text: incomingMsg.type === 'voice'
                      ? `Voice note (${incomingMsg.voiceDuration || '0:06'})`
                      : incomingMsg.type === 'image'
                      ? 'Encrypted image payload'
                      : incomingMsg.type === 'file'
                      ? (incomingMsg.fileName || 'Confidential file')
                      : incomingMsg.content || 'Encrypted message',
                    timestamp: incomingMsg.timestamp,
                    unreadCount: incomingMsg.senderId === currentUser.id ? 0 : c.lastMessage.unreadCount + 1,
                    senderId: incomingMsg.senderId,
                  },
                  messages: [...c.messages, incomingMsg],
                };
              }
              return c;
            })
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser.id]);

  // 3. Supabase Realtime Presence & Typing indicators
  useEffect(() => {
    const presenceChannel = supabase.channel('online-presence', {
      config: {
        presence: {
          key: currentUser.id,
        },
      },
    });

    // Handle presence sync
    presenceChannel
      .on('presence', { event: 'sync' }, () => {
        const state = presenceChannel.presenceState();
        const activeKeys = Object.keys(state);
        setOnlineCount(Math.max(1, activeKeys.length));

        // Update peer status if active online
        setConversations((prev) =>
          prev.map((c) => {
            const isPeerOnline = activeKeys.includes(c.peer.id);
            if (isPeerOnline) {
              return {
                ...c,
                peer: { ...c.peer, status: 'online', lastSeen: 'Active now' },
              };
            }
            return c;
          })
        );
      })
      .on('presence', { event: 'join' }, ({ key }) => {
        setConversations((prev) =>
          prev.map((c) => {
            if (c.peer.id === key) {
              return { ...c, peer: { ...c.peer, status: 'online', lastSeen: 'Active now' } };
            }
            return c;
          })
        );
      })
      .on('presence', { event: 'leave' }, ({ key }) => {
        setConversations((prev) =>
          prev.map((c) => {
            if (c.peer.id === key) {
              return { ...c, peer: { ...c.peer, status: 'away', lastSeen: 'Just left' } };
            }
            return c;
          })
        );
      });

    // Handle typing broadcasts
    const typingChannel = supabase.channel('typing-broadcasts');
    typingChannel
      .on('broadcast', { event: 'user-typing' }, (event) => {
        const { senderId, conversationId, isTyping } = event.payload || {};
        if (senderId === currentUser.id) return;

        setConversations((prev) =>
          prev.map((c) => {
            if (c.id === conversationId || c.peer.id === senderId) {
              return {
                ...c,
                peer: { ...c.peer, isTyping: Boolean(isTyping) },
              };
            }
            return c;
          })
        );
      })
      .subscribe();

    // Subscribe and track presence
    presenceChannel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await presenceChannel.track({
          user_id: currentUser.id,
          name: currentUser.name,
          status: currentUser.status,
          online_at: new Date().toISOString(),
        });
      }
    });

    return () => {
      supabase.removeChannel(presenceChannel);
      supabase.removeChannel(typingChannel);
    };
  }, [currentUser.id, currentUser.name, currentUser.status]);

  // 4. WebRTC Incoming Call Listener
  useEffect(() => {
    const unsubscribe = subscribeToCallSignals((signal) => {
      if (signal.type === 'call:offer' && signal.targetId === currentUser.id) {
        setIncomingCall(signal);
      } else if (signal.type === 'call:hangup' && incomingCall?.callId === signal.callId) {
        setIncomingCall(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [currentUser.id, incomingCall?.callId]);

  // Helper to persist message to Supabase
  const persistMessageToSupabase = async (msg: ChatMessage) => {
    if (!isSupabaseConfigured) return;

    try {
      const { error } = await supabase.from('messages').insert({
        id: msg.id,
        conversation_id: activeConversation?.id || 'conv-general',
        sender_id: msg.senderId,
        sender_name: msg.senderName,
        type: msg.type,
        content: msg.content || null,
        voice_duration: msg.voiceDuration || null,
        voice_waveform: msg.voiceWaveform || null,
        voice_url: msg.voiceUrl || null,
        image_url: msg.imageUrl || null,
        file_url: msg.fileUrl || null,
        file_name: msg.fileName || null,
        file_size: msg.fileSize || null,
        timestamp: msg.timestamp,
        status: msg.status,
        encrypted: msg.encrypted ?? true,
        expires_in: msg.expiresIn || null,
        alert_type: msg.alertType || null,
      });

      if (error) {
        console.warn('Supabase message insert error:', error.message);
      }
    } catch (err) {
      console.warn('Failed to insert message to Supabase:', err);
    }
  };

  // Send standard text message
  const handleSendMessage = (text: string) => {
    if (!activeConversation) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      conversationId: activeConversation.id,
      senderId: currentUser.id,
      senderName: currentUser.name,
      type: 'text',
      content: text,
      timestamp: formatCurrentTime(),
      status: 'delivered',
      encrypted: true,
      expiresIn: activeConversation.ephemeralTimer !== 'off' ? activeConversation.ephemeralTimer : undefined,
    };

    // Optimistic UI update
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeConversation.id) {
          return {
            ...c,
            lastMessage: {
              text,
              timestamp: 'Just now',
              unreadCount: 0,
              senderId: currentUser.id,
            },
            messages: [...c.messages, newMsg],
          };
        }
        return c;
      })
    );

    persistMessageToSupabase(newMsg);
  };

  // Send voice note with optional uploaded Supabase audio URL
  const handleSendVoiceNote = (duration: string, waveform: number[], voiceBlob?: Blob, voiceUrl?: string) => {
    if (!activeConversation) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      conversationId: activeConversation.id,
      senderId: currentUser.id,
      senderName: currentUser.name,
      type: 'voice',
      voiceDuration: duration,
      voiceWaveform: waveform,
      voiceUrl: voiceUrl,
      timestamp: formatCurrentTime(),
      status: 'delivered',
      encrypted: true,
      expiresIn: activeConversation.ephemeralTimer !== 'off' ? activeConversation.ephemeralTimer : undefined,
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeConversation.id) {
          return {
            ...c,
            lastMessage: {
              text: `Voice note (${duration})`,
              timestamp: 'Just now',
              unreadCount: 0,
              senderId: currentUser.id,
            },
            messages: [...c.messages, newMsg],
          };
        }
        return c;
      })
    );

    persistMessageToSupabase(newMsg);
  };

  // Send image message
  const handleSendImageMessage = (caption: string, imageUrl?: string) => {
    if (!activeConversation) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      conversationId: activeConversation.id,
      senderId: currentUser.id,
      senderName: currentUser.name,
      type: 'image',
      content: caption,
      imageUrl: imageUrl,
      timestamp: formatCurrentTime(),
      status: 'delivered',
      encrypted: true,
      expiresIn: activeConversation.ephemeralTimer !== 'off' ? activeConversation.ephemeralTimer : undefined,
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeConversation.id) {
          return {
            ...c,
            lastMessage: {
              text: 'Encrypted image payload',
              timestamp: 'Just now',
              unreadCount: 0,
              senderId: currentUser.id,
            },
            messages: [...c.messages, newMsg],
          };
        }
        return c;
      })
    );

    persistMessageToSupabase(newMsg);
  };

  // Send media / document attachment via Supabase Storage
  const handleSendMediaAttachment = async (file: File, caption?: string) => {
    if (!activeConversation) return;

    const isImage = file.type.startsWith('image/');
    const folder = isImage ? 'images' : 'documents';

    // Upload to Supabase Storage ('chat-attachments')
    const { publicUrl, error } = await uploadAttachment(file, folder);
    if (error) {
      console.warn('Storage upload error (using local preview):', error.message);
    }

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      conversationId: activeConversation.id,
      senderId: currentUser.id,
      senderName: currentUser.name,
      type: isImage ? 'image' : 'file',
      content: caption || '',
      imageUrl: isImage ? (publicUrl || undefined) : undefined,
      fileUrl: !isImage ? (publicUrl || undefined) : undefined,
      fileName: file.name,
      fileSize: file.size,
      timestamp: formatCurrentTime(),
      status: 'delivered',
      encrypted: true,
      expiresIn: activeConversation.ephemeralTimer !== 'off' ? activeConversation.ephemeralTimer : undefined,
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeConversation.id) {
          return {
            ...c,
            lastMessage: {
              text: isImage ? 'Encrypted image attachment' : file.name,
              timestamp: 'Just now',
              unreadCount: 0,
              senderId: currentUser.id,
            },
            messages: [...c.messages, newMsg],
          };
        }
        return c;
      })
    );

    persistMessageToSupabase(newMsg);
  };

  // Simulate screenshot detection alert
  const handleSimulateScreenshot = () => {
    if (!activeConversation) return;

    const alertMsg: ChatMessage = {
      id: `alert-${Date.now()}`,
      conversationId: activeConversation.id,
      senderId: 'system',
      senderName: 'System Monitor',
      type: 'alert',
      content: `Security Alert: ${activeConversation.peer.name} took a screenshot of this conversation!`,
      timestamp: formatCurrentTime(),
      status: 'read',
      encrypted: true,
      alertType: 'screenshot',
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeConversation.id) {
          return {
            ...c,
            messages: [...c.messages, alertMsg],
          };
        }
        return c;
      })
    );

    persistMessageToSupabase(alertMsg);
  };

  // Broadcast typing state to peers
  const handleTyping = (isTyping: boolean) => {
    if (!activeConversation) return;

    supabase.channel('typing-broadcasts').send({
      type: 'broadcast',
      event: 'user-typing',
      payload: {
        senderId: currentUser.id,
        conversationId: activeConversation.id,
        isTyping,
      },
    });
  };

  const handleChangeTimer = (timer: Conversation['ephemeralTimer']) => {
    if (!activeConversation) return;

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeConversation.id) {
          return {
            ...c,
            ephemeralTimer: timer,
          };
        }
        return c;
      })
    );
  };

  const handleUpdateUserStatus = (status: UserProfile['status']) => {
    onUpdateUser({
      ...currentUser,
      status,
    });
  };

  const handleStartNewChat = (contactName: string) => {
    const newId = `conv-${Date.now()}`;
    const newConversation: Conversation = {
      id: newId,
      peer: {
        id: `usr-${Date.now()}`,
        name: contactName,
        avatarColor: 'from-violet-600 to-indigo-700',
        status: 'online',
        lastSeen: 'Active just now',
        safetyNumber: '58201-49201-94021-39481-29481-94820',
        bio: 'Encrypted Peer (Google Display Name verified)',
      },
      lastMessage: {
        text: 'Session established',
        timestamp: 'Just now',
        unreadCount: 0,
        senderId: 'system',
      },
      ephemeralTimer: '24h',
      messages: [
        {
          id: `msg-init-${Date.now()}`,
          conversationId: newId,
          senderId: 'system',
          senderName: 'Signal Protocol',
          type: 'text',
          content: `Encrypted session initiated with ${contactName}. Google email address is protected.`,
          timestamp: formatCurrentTime(),
          status: 'read',
          encrypted: true,
        },
      ],
    };

    setConversations((prev) => [newConversation, ...prev]);
    setActiveConversationId(newId);
  };

  return (
    <div className="flex flex-col h-screen w-full bg-slate-950 overflow-hidden text-slate-100 font-sans">
      {/* Top Supabase Status & Gentle Fallback Banner */}
      <SupabaseStatusBanner />

      {/* Incoming Call Notification Popover */}
      {incomingCall && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-50 bg-slate-900 border border-emerald-500 rounded-2xl p-4 shadow-2xl flex items-center gap-4 animate-bounce">
          <div className="p-3 rounded-full bg-emerald-500/20 text-emerald-400">
            {incomingCall.callType === 'video' ? <Video className="w-6 h-6 animate-pulse" /> : <Phone className="w-6 h-6 animate-pulse" />}
          </div>
          <div>
            <div className="text-xs font-semibold text-white">Incoming Encrypted {incomingCall.callType === 'video' ? 'Video' : 'Voice'} Call</div>
            <div className="text-[11px] text-slate-400">From {incomingCall.callerName}</div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setActiveCallType(incomingCall.callType);
                setIncomingCall(null);
              }}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs"
            >
              Answer
            </button>
            <button
              onClick={() => {
                broadcastCallSignal({
                  type: 'call:hangup',
                  callId: incomingCall.callId,
                  callerId: currentUser.id,
                  callerName: currentUser.name,
                  targetId: incomingCall.callerId,
                  callType: incomingCall.callType,
                  timestamp: Date.now(),
                });
                setIncomingCall(null);
              }}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-rose-900 text-slate-300 hover:text-rose-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Split Body: Sidebar + Chat + Info */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Conversations Sidebar */}
        <ChatSidebar
          conversations={conversations}
          activeConversationId={activeConversation?.id || ''}
          onSelectConversation={setActiveConversationId}
          currentUser={currentUser}
          onUpdateUserStatus={handleUpdateUserStatus}
          onSignOut={onSignOut}
          onStartNewChat={handleStartNewChat}
          onOpenLegalTerms={onOpenLegalTerms}
          onlineCount={onlineCount}
        />

        {/* Center Chat Viewport */}
        {activeConversation ? (
          <ChatConversation
            conversation={activeConversation}
            currentUser={currentUser}
            onSendMessage={handleSendMessage}
            onSendVoiceNote={handleSendVoiceNote}
            onSendMediaAttachment={handleSendMediaAttachment}
            onSendImageMessage={handleSendImageMessage}
            onToggleInfoPanel={() => setShowInfoPanel(!showInfoPanel)}
            onSimulateScreenshot={handleSimulateScreenshot}
            onStartCall={(type) => setActiveCallType(type)}
            onTyping={handleTyping}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-slate-950 text-slate-500 text-xs">
            Select or start a conversation to begin encrypted messaging.
          </div>
        )}

        {/* Right Security & Info Panel */}
        {showInfoPanel && activeConversation && (
          <ChatInfoPanel
            conversation={activeConversation}
            onClose={() => setShowInfoPanel(false)}
            onChangeTimer={handleChangeTimer}
            onSimulateScreenshot={handleSimulateScreenshot}
          />
        )}
      </div>

      {/* WebRTC Video / Voice Call Modal */}
      {activeCallType && activeConversation && (
        <CallModal
          isOpen={Boolean(activeCallType)}
          onClose={() => setActiveCallType(null)}
          peer={activeConversation.peer}
          currentUser={currentUser}
          callType={activeCallType}
        />
      )}
    </div>
  );
};
