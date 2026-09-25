import React, { useState } from 'react';
import { TtmLogo } from './TtmLogo';
import { UserProfile } from '../types/chat';
import { LegalTerms } from './LegalTerms';
import { 
  User, 
  ShieldCheck, 
  Lock, 
  ChevronDown, 
  ChevronUp, 
  ArrowRight, 
  CheckCircle2, 
  FileText, 
  Scale, 
  Globe2, 
  AlertCircle,
  ExternalLink,
  Info
} from 'lucide-react';

interface SignInProps {
  onSignIn: (user: UserProfile) => void;
  onOpenLegalModal?: () => void;
}

export const SignIn: React.FC<SignInProps> = ({ onSignIn, onOpenLegalModal }) => {
  const [displayName, setDisplayName] = useState('Mohammad B.');
  const [email, setEmail] = useState('mohammadbiyabani126@gmail.com');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [showFullModal, setShowFullModal] = useState(false);
  const [modalTab, setModalTab] = useState<'all' | 'terms' | 'privacy' | 'dpdp'>('all');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenModal = (tab: 'all' | 'terms' | 'privacy' | 'dpdp' = 'all') => {
    setModalTab(tab);
    if (onOpenLegalModal) {
      onOpenLegalModal();
    } else {
      setShowFullModal(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!displayName.trim()) {
      setError('Please enter a Display Name to identify yourself securely.');
      return;
    }

    if (!agreedToTerms) {
      setError('You must agree to the Terms of Service & Privacy Policy before entering.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const user: UserProfile = {
        id: `usr-${Date.now()}`,
        name: displayName.trim(),
        email: email.trim() || 'user@talktome-secure.internal',
        avatarColor: 'from-emerald-600 to-teal-700',
        status: 'online',
        safetyNumber: '48921-03948-28104-94021-39481-94820',
        joinDate: 'September 2026',
        hasAcceptedTerms: true,
        termsAcceptedAt: new Date().toISOString(),
      };
      onSignIn(user);
    }, 350);
  };

  const handleSelectQuickName = (name: string, mail: string) => {
    setDisplayName(name);
    setEmail(mail);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Header */}
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

          <div className="flex items-center gap-3 text-xs text-slate-400">
            <button
              type="button"
              onClick={() => handleOpenModal('all')}
              className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
            >
              <Scale className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Legal Disclosures</span>
            </button>
            <div className="flex items-center gap-1.5 font-mono text-[11px] text-emerald-400 bg-emerald-950/50 border border-emerald-800/50 px-2 py-0.5 rounded-full">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Signal Protocol v3</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:px-6">
        <div className="w-full max-w-lg">
          {/* Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-sm">
            
            {/* Header */}
            <div className="text-center mb-6">
              <div className="inline-flex justify-center mb-3">
                <TtmLogo size="md" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-white mb-1.5">
                Sign In to Chat
              </h1>
              <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                Connect with cryptographic end-to-end encryption. Only your Display Name is visible to chat partners.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs flex items-center gap-2 animate-fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span className="flex-1 leading-normal">{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Display Name Input */}
              <div>
                <label 
                  htmlFor="displayNameInput" 
                  className="block text-xs font-semibold text-slate-200 mb-1.5"
                >
                  Your Display Name <span className="text-emerald-400 font-normal">(Visible to Peers)</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  <input
                    id="displayNameInput"
                    type="text"
                    value={displayName}
                    onChange={(e) => {
                      setDisplayName(e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder="e.g. Mohammad B."
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                    required
                    autoFocus
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1.5">
                  <span>Zero-Knowledge: Email address is never revealed to peers.</span>
                </div>
              </div>

              {/* Quick Preset Names */}
              <div className="pt-0.5">
                <div className="text-[10px] uppercase font-semibold tracking-wider text-slate-500 mb-1.5">
                  Or select preset identity:
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { name: 'Mohammad B.', role: 'Primary' },
                    { name: 'Alex Rivera', role: 'Security' },
                    { name: 'Elena Vance', role: 'Cryptographer' },
                  ].map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => handleSelectQuickName(preset.name, `${preset.name.toLowerCase().replace(' ', '.')}@signal-lab.io`)}
                      className={`px-2 py-1.5 text-left rounded-lg text-xs border transition-colors ${
                        displayName === preset.name
                          ? 'bg-slate-800 border-emerald-500/80 text-emerald-400 font-medium'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                      }`}
                    >
                      <div className="font-medium truncate">{preset.name}</div>
                      <div className="text-[9px] text-slate-500">{preset.role}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Required Terms Checkbox */}
              <div className="pt-2">
                <label className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer select-none ${
                  agreedToTerms
                    ? 'bg-emerald-950/20 border-emerald-800/70 text-slate-200'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 text-slate-400'
                }`}>
                  <input
                    type="checkbox"
                    id="termsAgreementCheckbox"
                    checked={agreedToTerms}
                    onChange={(e) => {
                      setAgreedToTerms(e.target.checked);
                      if (error && error.includes('Terms')) setError(null);
                    }}
                    className="mt-0.5 w-4 h-4 rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-slate-950 accent-emerald-500 cursor-pointer shrink-0"
                  />
                  <div className="text-xs leading-relaxed">
                    <span className="font-medium text-slate-200">
                      I agree to the{' '}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleOpenModal('all');
                        }}
                        className="text-emerald-400 hover:text-emerald-300 font-semibold underline underline-offset-2 transition-colors focus:outline-none"
                      >
                        Terms of Service &amp; Privacy Policy
                      </button>
                    </span>
                    <p className="text-[11px] text-slate-400 mt-1 leading-normal">
                      Covering global data rights (GDPR Articles 15&ndash;22, CCPA &ldquo;Do Not Sell&rdquo;) and local statutory compliance under India&rsquo;s Digital Personal Data Protection (DPDP) Act 2023 with verified Grievance Redressal.
                    </p>
                  </div>
                </label>
              </div>

              {/* Expandable Legal & Compliance Drawer Trigger */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setShowDrawer(!showDrawer)}
                  className="w-full px-3.5 py-2.5 flex items-center justify-between text-xs text-slate-300 hover:text-white transition-colors text-left"
                >
                  <span className="flex items-center gap-2 font-medium">
                    <Scale className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Compliance Disclosures &amp; Statutory Details</span>
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-slate-500">
                    <span>{showDrawer ? 'Collapse' : 'Expand Details'}</span>
                    {showDrawer ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </span>
                </button>

                {/* Drawer Content */}
                {showDrawer && (
                  <div className="p-4 pt-1 border-t border-slate-800/80 text-xs text-slate-400 space-y-3 animate-fade-in bg-slate-950/80">
                    
                    {/* Item 1: Data Fiduciary Details */}
                    <div>
                      <h4 className="text-slate-200 font-semibold flex items-center gap-1.5 mb-1">
                        <Globe2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Data Fiduciary &amp; Grievance Redressal (DPDP Act 2023)</span>
                      </h4>
                      <p className="text-[11px] leading-relaxed">
                        Talk To Me operates as a Zero-Knowledge Electronic Intermediary. Data Fiduciary contact: 
                        <strong className="text-slate-300"> Data Protection &amp; Legal Grievance Cell</strong> (<a href="mailto:grievance@talktome-secure.org" className="text-emerald-400 underline">grievance@talktome-secure.org</a>). 
                        Statutory acknowledgement turnaround: 24&ndash;48 hrs; investigation resolution within 15&ndash;30 days.
                      </p>
                    </div>

                    {/* Item 2: User Consent Rights */}
                    <div>
                      <h4 className="text-slate-200 font-semibold flex items-center gap-1.5 mb-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>User Consent &amp; Privacy Rights (GDPR &amp; CCPA)</span>
                      </h4>
                      <p className="text-[11px] leading-relaxed">
                        Consent is explicit, affirmative, and strictly limited to cryptographic routing. You retain unconditional rights of access, rectification, and erasure (&ldquo;Right to be Forgotten&rdquo;) under GDPR Articles 15&ndash;22 and California CCPA/CPRA non-sale guarantees.
                      </p>
                    </div>

                    {/* Item 3: Content Usage */}
                    <div>
                      <h4 className="text-slate-200 font-semibold flex items-center gap-1.5 mb-1">
                        <FileText className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Content Usage &amp; Intellectual Property</span>
                      </h4>
                      <p className="text-[11px] leading-relaxed">
                        Users maintain 100% intellectual property ownership of all messages, audio, and media. We claim zero rights to your content and execute zero AI training or commercial indexing on encrypted payloads.
                      </p>
                    </div>

                    {/* Item 4: Liability Disclaimers */}
                    <div>
                      <h4 className="text-slate-200 font-semibold flex items-center gap-1.5 mb-1">
                        <Lock className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Limitation of Liability &amp; Disclaimers</span>
                      </h4>
                      <p className="text-[11px] leading-relaxed">
                        Services are provided on an &ldquo;AS-IS&rdquo; and &ldquo;AS-AVAILABLE&rdquo; basis. Users remain responsible for endpoint hardware security, device locks, and protecting local cryptographic seeds.
                      </p>
                    </div>

                    <div className="pt-1 text-right">
                      <button
                        type="button"
                        onClick={() => handleOpenModal('all')}
                        className="text-[11px] text-emerald-400 hover:text-emerald-300 font-medium inline-flex items-center gap-1"
                      >
                        <span>Open Comprehensive Legal Document</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>

                  </div>
                )}
              </div>

              {/* Primary Action Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading || !agreedToTerms || !displayName.trim()}
                  className={`w-full py-3 px-4 font-semibold rounded-xl text-sm flex items-center justify-center gap-2 transition-all shadow-lg focus:outline-none focus:ring-2 ${
                    !agreedToTerms || !displayName.trim()
                      ? 'bg-slate-800 text-slate-500 border border-slate-700/60 cursor-not-allowed shadow-none'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-slate-950 shadow-emerald-950/50 hover:shadow-emerald-900/40 focus:ring-emerald-400 cursor-pointer'
                  }`}
                >
                  {isLoading ? (
                    <span className="inline-block w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Sign In to Chat</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {(!agreedToTerms || !displayName.trim()) && (
                  <p className="text-[11px] text-center text-slate-500 font-mono mt-2">
                    {!displayName.trim() 
                      ? 'Please enter your Display Name' 
                      : 'Check the agreement box above to enable Sign In to Chat'}
                  </p>
                )}
              </div>
            </form>

          </div>

          {/* Privacy & E2EE Assurance Footer */}
          <div className="mt-5 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Double Ratchet E2EE · Screenshot Detection Active</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-4 px-6 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 max-w-6xl mx-auto w-full">
        <span>Talk To Me (TTM) &bull; Zero-Knowledge Encrypted Communication</span>
        <button
          type="button"
          onClick={() => handleOpenModal('all')}
          className="text-emerald-400 hover:text-emerald-300 underline font-medium cursor-pointer"
        >
          Terms of Service &amp; Privacy Policy
        </button>
      </footer>

      {/* Full Modal */}
      <LegalTerms
        isOpen={showFullModal}
        onClose={() => setShowFullModal(false)}
        onAccept={() => {
          setAgreedToTerms(true);
          if (error && error.includes('Terms')) setError(null);
        }}
        hasAccepted={agreedToTerms}
        initialTab={modalTab}
      />
    </div>
  );
};
