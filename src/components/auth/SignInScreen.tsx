import React, { useState } from 'react';
import { TtmLogo } from '../TtmLogo';
import { UserProfile } from '../../types/chat';
import { 
  ShieldCheck, 
  Lock, 
  Key, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Eye, 
  EyeOff, 
  User, 
  Mail, 
  AlertCircle
} from 'lucide-react';

interface SignInScreenProps {
  onSignIn: (user: UserProfile) => void;
}

export const SignInScreen: React.FC<SignInScreenProps> = ({ onSignIn }) => {
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('mohammadbiyabani126@gmail.com');
  const [displayName, setDisplayName] = useState('Mohammad B.');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }

    if (authMode === 'signup' && !displayName.trim()) {
      setError('Please provide a Display Name for your secure identity.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const user: UserProfile = {
        id: 'usr-current',
        name: displayName.trim() || (email.split('@')[0] || 'Secure User'),
        email: email.trim(),
        avatarColor: 'from-emerald-600 to-teal-700',
        status: 'online',
        safetyNumber: '48921-03948-28104-94021-39481-94820',
        joinDate: 'September 2026',
      };
      onSignIn(user);
    }, 450);
  };

  const handleGoogleSignIn = () => {
    setIsLoading(true);
    setError(null);

    setTimeout(() => {
      setIsLoading(false);
      const user: UserProfile = {
        id: 'usr-google',
        name: 'Mohammad B.',
        email: 'mohammadbiyabani126@gmail.com',
        avatarColor: 'from-emerald-600 to-teal-700',
        status: 'online',
        safetyNumber: '48921-03948-28104-94021-39481-94820',
        joinDate: 'September 2026',
      };
      onSignIn(user);
    }, 400);
  };

  const handleDemoSignIn = (name: string, mail: string, color: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onSignIn({
        id: `usr-${name.toLowerCase().replace(/\s+/g, '')}`,
        name,
        email: mail,
        avatarColor: color,
        status: 'online',
        safetyNumber: '73920-19482-94810-38491-20394-81920',
        joinDate: 'September 2026',
      });
    }, 300);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Bar */}
      <header className="border-b border-slate-800/80 px-6 py-4 bg-slate-950/70 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TtmLogo size="sm" />
            <span className="text-base font-bold tracking-tight text-white">
              Talk To Me
            </span>
            <span className="text-xs text-slate-500 hidden sm:inline-block">
              · Zero-Knowledge Encrypted Messaging
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-emerald-400">Signal Protocol v3</span>
          </div>
        </div>
      </header>

      {/* Main Authentication Container */}
      <div className="flex-1 flex items-center justify-center px-4 py-10 sm:px-6">
        <div className="w-full max-w-md">
          {/* Card Surface */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-sm">
            {/* Header Lockup */}
            <div className="text-center mb-6">
              <div className="inline-flex justify-center mb-4">
                <TtmLogo size="lg" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
                {authMode === 'signin' ? 'Sign in to Talk To Me' : 'Create Secure Identity'}
              </h1>
              <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                Zero-Knowledge architecture. Your private email is never visible to peers.
              </p>
            </div>

            {/* Google Fast Auth Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-slate-800 hover:bg-slate-700/80 border border-slate-700 rounded-xl text-sm font-medium text-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 shadow-sm"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Divider */}
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-slate-900 px-3 text-slate-500 font-medium">
                  or sign in with credentials
                </span>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {authMode === 'signup' && (
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Display Name <span className="text-slate-500 font-normal">(Visible to peers)</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="e.g. Mohammad B."
                      className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                      required={authMode === 'signup'}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-medium text-slate-300">
                    Password
                  </label>
                  {authMode === 'signin' && (
                    <button
                      type="button"
                      onClick={() => alert('Password reset link sent to registered device.')}
                      className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-9 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-semibold rounded-xl text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-950/50 hover:shadow-emerald-900/40 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              >
                {isLoading ? (
                  <span className="inline-block w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{authMode === 'signin' ? 'Sign In' : 'Create Account'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Mode switch */}
            <div className="mt-5 text-center text-xs text-slate-400">
              {authMode === 'signin' ? (
                <span>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('signup');
                      setError(null);
                    }}
                    className="text-emerald-400 hover:text-emerald-300 font-medium ml-1"
                  >
                    Sign up
                  </button>
                </span>
              ) : (
                <span>
                  Already registered?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('signin');
                      setError(null);
                    }}
                    className="text-emerald-400 hover:text-emerald-300 font-medium ml-1"
                  >
                    Sign in
                  </button>
                </span>
              )}
            </div>

            {/* Quick Demo Switcher */}
            <div className="mt-6 pt-5 border-t border-slate-800">
              <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
                Quick Demo Identities
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleDemoSignIn('Mohammad B.', 'mohammadbiyabani126@gmail.com', 'from-emerald-600 to-teal-700')}
                  className="p-2 text-left bg-slate-950/80 hover:bg-slate-800 border border-slate-800/80 hover:border-slate-700 rounded-lg transition-colors group"
                >
                  <div className="text-xs font-medium text-slate-200 group-hover:text-emerald-400 truncate">
                    Mohammad B.
                  </div>
                  <div className="text-[10px] text-slate-500 truncate">Primary Account</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoSignIn('Alex Rivera', 'alex.rivera@signal-lab.io', 'from-blue-600 to-indigo-700')}
                  className="p-2 text-left bg-slate-950/80 hover:bg-slate-800 border border-slate-800/80 hover:border-slate-700 rounded-lg transition-colors group"
                >
                  <div className="text-xs font-medium text-slate-200 group-hover:text-emerald-400 truncate">
                    Alex Rivera
                  </div>
                  <div className="text-[10px] text-slate-500 truncate">Security Lead</div>
                </button>
              </div>
            </div>
          </div>

          {/* Privacy & E2EE Assurance Footer */}
          <div className="mt-5 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Double Ratchet E2EE · Screenshot Detection Active</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-4 px-6 text-center text-xs text-slate-500">
        Talk To Me (TTM) &bull; Zero-Knowledge Encrypted Communication
      </footer>
    </div>
  );
};
