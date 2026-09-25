import React, { useState } from 'react';
import { Conversation, UserProfile } from '../../types/chat';
import { TtmLogo } from '../TtmLogo';
import { 
  Search, 
  Plus, 
  Pin, 
  Mic, 
  Clock, 
  LogOut, 
  ShieldCheck, 
  SlidersHorizontal, 
  Check, 
  CheckCheck,
  UserPlus,
  X,
  Scale,
  Radio,
  FileText,
  Image as ImageIcon
} from 'lucide-react';
import { isSupabaseConfigured } from '../../lib/supabase';

interface ChatSidebarProps {
  conversations: Conversation[];
  activeConversationId: string;
  onSelectConversation: (id: string) => void;
  currentUser: UserProfile;
  onUpdateUserStatus: (status: UserProfile['status']) => void;
  onSignOut: () => void;
  onStartNewChat: (contactName: string) => void;
  onOpenLegalTerms?: () => void;
  onlineCount?: number;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  currentUser,
  onUpdateUserStatus,
  onSignOut,
  onStartNewChat,
  onOpenLegalTerms,
  onlineCount = 1,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'unread' | 'pinned'>('all');
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [newContactName, setNewContactName] = useState('');

  const filteredConversations = conversations.filter((conv) => {
    const matchesSearch =
      conv.peer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.lastMessage.text.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterMode === 'unread') {
      return conv.lastMessage.unreadCount > 0;
    }
    if (filterMode === 'pinned') {
      return !!conv.isPinned;
    }
    return true;
  });

  const getStatusColor = (status: UserProfile['status']) => {
    switch (status) {
      case 'online':
        return 'bg-emerald-500';
      case 'away':
        return 'bg-amber-500';
      case 'busy':
        return 'bg-rose-500';
      case 'offline':
      default:
        return 'bg-slate-500';
    }
  };

  const handleCreateChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContactName.trim()) return;
    onStartNewChat(newContactName.trim());
    setNewContactName('');
    setShowNewChatModal(false);
  };

  return (
    <aside className="w-80 md:w-88 flex-shrink-0 flex flex-col bg-slate-900 border-r border-slate-800 h-full select-none">
      {/* Top Header */}
      <div className="p-3.5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <TtmLogo size="sm" />
          <div>
            <span className="font-bold tracking-tight text-white text-sm block leading-none">
              Talk To Me
            </span>
            <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1 mt-0.5">
              <Radio className="w-2.5 h-2.5 animate-pulse text-emerald-400" />
              <span>Realtime Presence ({onlineCount} Active)</span>
            </span>
          </div>
        </div>

        <button
          onClick={() => setShowNewChatModal(true)}
          title="New Secure Conversation"
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-emerald-400 transition-colors focus:outline-none focus:ring-1 focus:ring-emerald-500"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Search Input */}
      <div className="px-3 pt-3 pb-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations..."
            className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-2 text-slate-500 hover:text-slate-300"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Segmented Control */}
        <div className="flex items-center gap-1 mt-2.5 p-0.5 bg-slate-950/70 border border-slate-800 rounded-lg text-[11px] font-medium text-slate-400">
          <button
            onClick={() => setFilterMode('all')}
            className={`flex-1 py-1 rounded-md transition-colors ${
              filterMode === 'all'
                ? 'bg-slate-800 text-slate-100 font-semibold shadow-xs'
                : 'hover:text-slate-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterMode('unread')}
            className={`flex-1 py-1 rounded-md transition-colors ${
              filterMode === 'unread'
                ? 'bg-slate-800 text-slate-100 font-semibold shadow-xs'
                : 'hover:text-slate-200'
            }`}
          >
            Unread
          </button>
          <button
            onClick={() => setFilterMode('pinned')}
            className={`flex-1 py-1 rounded-md transition-colors ${
              filterMode === 'pinned'
                ? 'bg-slate-800 text-slate-100 font-semibold shadow-xs'
                : 'hover:text-slate-200'
            }`}
          >
            Pinned
          </button>
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-800/40">
        {filteredConversations.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            No conversations match your filter.
          </div>
        ) : (
          filteredConversations.map((conv) => {
            const isActive = conv.id === activeConversationId;
            const isTyping = conv.peer.isTyping;

            return (
              <button
                key={conv.id}
                onClick={() => onSelectConversation(conv.id)}
                className={`w-full text-left px-3.5 py-3 flex items-start gap-3 transition-colors ${
                  isActive
                    ? 'bg-slate-800/90 border-l-2 border-emerald-500'
                    : 'hover:bg-slate-800/50'
                }`}
              >
                {/* Avatar with Status Dot */}
                <div className="relative shrink-0 mt-0.5">
                  <div
                    className={`w-10 h-10 rounded-full bg-gradient-to-tr ${conv.peer.avatarColor} flex items-center justify-center text-white font-semibold text-xs shadow-inner`}
                  >
                    {conv.peer.name
                      .split(' ')
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join('')}
                  </div>
                  <span
                    className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-slate-900 ${getStatusColor(
                      conv.peer.status
                    )}`}
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span
                      className={`text-xs font-semibold truncate ${
                        isActive ? 'text-white' : 'text-slate-200'
                      }`}
                    >
                      {conv.peer.name}
                    </span>
                    <span className="text-[10px] text-slate-500 shrink-0 font-mono tabular-nums">
                      {conv.lastMessage.timestamp}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    {isTyping ? (
                      /* Live Typing Indicator in Sidebar */
                      <p className="text-xs text-emerald-400 font-medium flex items-center gap-1.5 animate-pulse">
                        <span className="inline-flex gap-0.5">
                          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" />
                        </span>
                        <span className="italic">typing...</span>
                      </p>
                    ) : (
                      <p className="text-xs text-slate-400 truncate flex items-center gap-1">
                        {conv.lastMessage.text.includes('Voice') ? (
                          <Mic className="w-3 h-3 text-emerald-400 shrink-0" />
                        ) : conv.lastMessage.text.includes('image') || conv.lastMessage.text.includes('Image') ? (
                          <ImageIcon className="w-3 h-3 text-teal-400 shrink-0" />
                        ) : conv.lastMessage.text.includes('file') || conv.lastMessage.text.includes('document') ? (
                          <FileText className="w-3 h-3 text-blue-400 shrink-0" />
                        ) : null}
                        <span className="truncate">{conv.lastMessage.text}</span>
                      </p>
                    )}

                    <div className="flex items-center gap-1.5 shrink-0">
                      {conv.isPinned && (
                        <Pin className="w-3 h-3 text-slate-500" />
                      )}
                      {conv.ephemeralTimer !== 'off' && (
                        <span className="text-[9px] px-1 py-0.2 rounded bg-slate-800 text-emerald-400 font-mono">
                          {conv.ephemeralTimer}
                        </span>
                      )}
                      {conv.lastMessage.unreadCount > 0 && (
                        <span className="bg-emerald-500 text-slate-950 font-bold text-[10px] rounded-full px-1.5 py-0.2 min-w-4 text-center">
                          {conv.lastMessage.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* Current User Bottom Bar */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between relative">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative shrink-0">
            <div
              className={`w-9 h-9 rounded-full bg-gradient-to-tr ${currentUser.avatarColor} flex items-center justify-center text-white font-bold text-xs`}
            >
              {currentUser.name
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')}
            </div>
            <button
              onClick={() => setShowStatusMenu(!showStatusMenu)}
              className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full ring-2 ring-slate-950 ${getStatusColor(
                currentUser.status
              )} hover:scale-110 transition-transform`}
              title="Change Status (Synced via Supabase Presence)"
            />
          </div>

          <div className="min-w-0">
            <div className="text-xs font-semibold text-white truncate flex items-center gap-1.5">
              <span>{currentUser.name}</span>
            </div>
            <div className="text-[10px] text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>E2EE Authenticated</span>
            </div>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1">
          {onOpenLegalTerms && (
            <button
              onClick={onOpenLegalTerms}
              title="Terms of Service & Privacy Policy"
              className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-slate-800/80 rounded-lg transition-colors"
            >
              <Scale className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={onSignOut}
            title="Sign Out"
            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        {/* Status Dropdown Popover */}
        {showStatusMenu && (
          <div className="absolute bottom-16 left-3 w-44 bg-slate-900 border border-slate-800 rounded-xl p-1.5 shadow-xl z-30 text-xs animate-fade-in">
            <div className="px-2 py-1 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
              Realtime Status
            </div>
            {(['online', 'away', 'busy', 'offline'] as const).map((status) => (
              <button
                key={status}
                onClick={() => {
                  onUpdateUserStatus(status);
                  setShowStatusMenu(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left capitalize transition-colors ${
                  currentUser.status === status
                    ? 'bg-slate-800 text-white font-medium'
                    : 'text-slate-300 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${getStatusColor(status)}`} />
                  <span>{status}</span>
                </div>
                {currentUser.status === status && (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* New Chat Modal */}
      {showNewChatModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-semibold text-white">Start New Secure Chat</h3>
              </div>
              <button
                onClick={() => setShowNewChatModal(false)}
                className="text-slate-400 hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400 mb-4">
              Provide peer's Google Display Name. No email address is required or stored.
            </p>

            <form onSubmit={handleCreateChat} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Contact Display Name
                </label>
                <input
                  type="text"
                  value={newContactName}
                  onChange={(e) => setNewContactName(e.target.value)}
                  placeholder="e.g. Tariq Mahmood"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  autoFocus
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewChatModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newContactName.trim()}
                  className="px-4 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-slate-950 rounded-lg transition-colors"
                >
                  Start Chat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </aside>
  );
};
