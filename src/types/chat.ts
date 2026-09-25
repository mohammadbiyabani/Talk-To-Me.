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
  senderId: string;
  senderName: string;
  type: 'text' | 'voice' | 'image' | 'alert' | 'system';
  content?: string;
  voiceDuration?: string;
  voiceWaveform?: number[];
  imageUrl?: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  encrypted: boolean;
  expiresIn?: string;
  alertType?: 'screenshot' | 'recording' | 'security_warning';
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
