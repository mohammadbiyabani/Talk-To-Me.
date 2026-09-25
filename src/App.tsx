import React, { useState } from 'react';
import { ChatApp } from './components/ChatApp';
import { SignIn } from './components/SignIn';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return <SignIn onSignIn={() => setIsAuthenticated(true)} />;
  }

  return <ChatApp onSignOut={() => setIsAuthenticated(false)} />;
}
