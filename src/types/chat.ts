export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarColor: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  safetyNumber?: string;
  joinDate?: string;
  hasAcceptedTerms?: boolean;
  termsAcceptedAt?: string;
}

export interface ChatMessage {
  id: string;
  conversationId?: string;
  senderId: string;
  senderName: string;
  type: 'text' | 'voice' | 'image' | 'alert' | 'system' | 'file';
  content?: string;
  voiceDuration?: string;
  voiceWaveform?: number[];
  voiceUrl?: string;
  imageUrl?: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  encrypted: boolean;
  expiresIn?: string;
  alertType?: 'screenshot' | 'recording' | 'security_warning';
  createdAt?: string;
}

export interface Conversation {
  id: string;
  peer: {
    id: string;
    name: string;
    avatarColor: string;
    status: 'online' | 'away' | 'busy' | 'offline';
    lastSeen?: string;
    safetyNumber: string;
    bio?: string;
    isTyping?: boolean;
  };
  lastMessage: {
    text: string;
    timestamp: string;
    unreadCount: number;
    senderId: string;
  };
  ephemeralTimer: 'off' | '1h' | '24h' | '7d';
  isPinned?: boolean;
  messages: ChatMessage[];
}

export interface PresencePayload {
  user_id: string;
  name: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  online_at: string;
  typing_in?: string | null;
}

export type CallType = 'audio' | 'video';

export interface CallSignalPayload {
  type: 'call:offer' | 'call:answer' | 'call:ice-candidate' | 'call:hangup' | 'call:busy';
  callId: string;
  callerId: string;
  callerName: string;
  targetId: string;
  callType: CallType;
  sdp?: RTCSessionDescriptionInit;
  candidate?: RTCIceCandidateInit;
  timestamp: number;
}
