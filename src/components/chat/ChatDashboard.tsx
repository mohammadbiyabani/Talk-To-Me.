import React, { useState } from 'react';
import { Conversation, UserProfile, ChatMessage } from '../../types/chat';
import { INITIAL_CONVERSATIONS } from '../../data/chatData';
import { ChatSidebar } from './ChatSidebar';
import { ChatConversation } from './ChatConversation';
import { ChatInfoPanel } from './ChatInfoPanel';

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

  const activeConversation = conversations.find((c) => c.id === activeConversationId) || conversations[0];

  const formatCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleSendMessage = (text: string) => {
    if (!activeConversation) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      type: 'text',
      content: text,
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
  };

  const handleSendVoiceNote = (duration: string, waveform: number[]) => {
    if (!activeConversation) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      type: 'voice',
      voiceDuration: duration,
      voiceWaveform: waveform,
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
  };

  const handleSendImageMessage = (caption: string) => {
    if (!activeConversation) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      type: 'image',
      content: caption,
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
              text: 'Encrypted document payload',
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
  };

  const handleSimulateScreenshot = () => {
    if (!activeConversation) return;

    const alertMsg: ChatMessage = {
      id: `alert-${Date.now()}`,
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
    <div className="flex h-screen w-full bg-slate-950 overflow-hidden text-slate-100 font-sans">
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
      />

      {/* Center Chat Viewport */}
      {activeConversation ? (
        <ChatConversation
          conversation={activeConversation}
          currentUser={currentUser}
          onSendMessage={handleSendMessage}
          onSendVoiceNote={handleSendVoiceNote}
          onSendImageMessage={handleSendImageMessage}
          onToggleInfoPanel={() => setShowInfoPanel(!showInfoPanel)}
          onSimulateScreenshot={handleSimulateScreenshot}
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
  );
};
