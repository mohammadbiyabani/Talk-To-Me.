import React, { useState } from 'react';
import { UserProfile } from './types/chat';
import { SignIn } from './components/SignIn';
import { ChatDashboard } from './components/chat/ChatDashboard';
import { LegalTerms } from './components/LegalTerms';

export default function App() {
  // Explicit state management for authentication session
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem('ttm_authenticated_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.hasAcceptedTerms) {
          return parsed;
        }
      }
      return null;
    } catch {
      return null;
    }
  });

  const [showLegalModal, setShowLegalModal] = useState<boolean>(false);
  const [legalModalTab, setLegalModalTab] = useState<'all' | 'terms' | 'privacy' | 'dpdp'>('all');

  const isAuthenticated = Boolean(user && user.hasAcceptedTerms);

  const handleSignIn = (newUser: UserProfile) => {
    // Validate terms acceptance before setting authenticated state
    if (!newUser.hasAcceptedTerms) {
      console.warn('Authentication rejected: User must accept legal terms.');
      return;
    }

    const verifiedUser: UserProfile = {
      ...newUser,
      hasAcceptedTerms: true,
      termsAcceptedAt: newUser.termsAcceptedAt || new Date().toISOString(),
    };

    setUser(verifiedUser);
    try {
      localStorage.setItem('ttm_authenticated_user', JSON.stringify(verifiedUser));
    } catch {
      // ignore local storage errors
    }
  };

  const handleSignOut = () => {
    setUser(null);
    try {
      localStorage.removeItem('ttm_authenticated_user');
    } catch {
      // ignore local storage errors
    }
  };

  const handleUpdateUser = (updatedUser: UserProfile) => {
    setUser(updatedUser);
    try {
      localStorage.setItem('ttm_authenticated_user', JSON.stringify(updatedUser));
    } catch {
      // ignore local storage errors
    }
  };

  const handleOpenLegalModal = (tab: 'all' | 'terms' | 'privacy' | 'dpdp' = 'all') => {
    setLegalModalTab(tab);
    setShowLegalModal(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* 
        Authentication Flow:
        If user is not authenticated, render <SignIn /> as the default starting view.
        Once the user agrees to terms and logs in, switch to the main chat dashboard.
      */}
      {!isAuthenticated || !user ? (
        <SignIn
          onSignIn={handleSignIn}
          onOpenLegalModal={() => handleOpenLegalModal('all')}
        />
      ) : (
        <ChatDashboard
          currentUser={user}
          onUpdateUser={handleUpdateUser}
          onSignOut={handleSignOut}
          onOpenLegalTerms={() => handleOpenLegalModal('all')}
        />
      )}

      {/* Global Legal Disclosures & Compliance Modal */}
      <LegalTerms
        isOpen={showLegalModal}
        onClose={() => setShowLegalModal(false)}
        hasAccepted={Boolean(user?.hasAcceptedTerms)}
        initialTab={legalModalTab}
      />
    </div>
  );
}
