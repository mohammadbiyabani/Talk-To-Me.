import React, { useState, useEffect } from 'react';
import { UserProfile } from './types/chat';
import { SignInScreen } from './components/auth/SignInScreen';
import { ChatDashboard } from './components/chat/ChatDashboard';

export default function App() {
  // Main starting page: functional Sign-In screen (user is null initially)
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('ttm_authenticated_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const handleSignIn = (user: UserProfile) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('ttm_authenticated_user', JSON.stringify(user));
    } catch {
      // ignore storage errors
    }
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('ttm_authenticated_user');
    } catch {
      // ignore storage errors
    }
  };

  const handleUpdateUser = (updatedUser: UserProfile) => {
    setCurrentUser(updatedUser);
    try {
      localStorage.setItem('ttm_authenticated_user', JSON.stringify(updatedUser));
    } catch {
      // ignore storage errors
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950">
      {!currentUser ? (
        <SignInScreen onSignIn={handleSignIn} />
      ) : (
        <ChatDashboard
          currentUser={currentUser}
          onUpdateUser={handleUpdateUser}
          onSignOut={handleSignOut}
        />
      )}
    </div>
  );
}
