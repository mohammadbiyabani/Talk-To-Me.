import React, { useState } from 'react';
import { UserProfile } from './types/chat';
import { SignInScreen } from './components/auth/SignInScreen';
import { ChatDashboard } from './components/chat/ChatDashboard';
import { LegalTerms } from './components/LegalTerms';

export default function App() {
  // Main starting page: functional Sign-In screen (user is null initially)
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('ttm_authenticated_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Only restore session if terms were agreed upon
        if (parsed && parsed.hasAcceptedTerms) {
          return parsed;
        }
      }
      return null;
    } catch {
      return null;
    }
  });

  const [showGlobalLegalModal, setShowGlobalLegalModal] = useState<boolean>(false);
  const [legalTab, setLegalTab] = useState<'all' | 'terms' | 'privacy' | 'dpdp'>('all');

  const openLegalModal = (tab: 'all' | 'terms' | 'privacy' | 'dpdp' = 'all') => {
    setLegalTab(tab);
    setShowGlobalLegalModal(true);
  };

  const handleSignIn = (user: UserProfile) => {
    // Strictly validate that user has agreed to the Terms of Service & Privacy Policy
    if (!user.hasAcceptedTerms) {
      console.warn('Authentication halted: Mandatory acceptance of Terms & Conditions required.');
      return;
    }

    const verifiedUser: UserProfile = {
      ...user,
      hasAcceptedTerms: true,
      termsAcceptedAt: user.termsAcceptedAt || new Date().toISOString(),
    };

    setCurrentUser(verifiedUser);
    try {
      localStorage.setItem('ttm_authenticated_user', JSON.stringify(verifiedUser));
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
        <SignInScreen 
          onSignIn={handleSignIn} 
          onOpenLegalTerms={() => openLegalModal('all')}
        />
      ) : (
        <ChatDashboard
          currentUser={currentUser}
          onUpdateUser={handleUpdateUser}
          onSignOut={handleSignOut}
          onOpenLegalTerms={() => openLegalModal('all')}
        />
      )}

      {/* Global Terms & Privacy Policy Modal */}
      <LegalTerms
        isOpen={showGlobalLegalModal}
        onClose={() => setShowGlobalLegalModal(false)}
        hasAccepted={Boolean(currentUser?.hasAcceptedTerms)}
        initialTab={legalTab}
      />
    </div>
  );
}
