import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  FileText, 
  Lock, 
  Globe2, 
  Scale, 
  AlertTriangle, 
  Search, 
  CheckCircle2, 
  Download, 
  ExternalLink,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { TtmLogo } from './TtmLogo';

interface LegalTermsProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept?: () => void;
  hasAccepted?: boolean;
  initialTab?: 'all' | 'terms' | 'privacy' | 'dpdp';
}

export const LegalTerms: React.FC<LegalTermsProps> = ({
  isOpen,
  onClose,
  onAccept,
  hasAccepted = false,
  initialTab = 'all',
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'terms' | 'privacy' | 'dpdp'>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedNotification, setCopiedNotification] = useState(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.origin + '#legal-terms');
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2000);
  };

  const filterMatches = (text: string) => {
    if (!searchQuery.trim()) return true;
    return text.toLowerCase().includes(searchQuery.toLowerCase());
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-hidden animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-modal-title"
    >
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <TtmLogo size="sm" />
            <div>
              <h2 id="legal-modal-title" className="text-base font-bold text-white flex items-center gap-2">
                <span>Terms of Service & Privacy Policy</span>
                <span className="text-[10px] uppercase font-mono font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-800/80 px-2 py-0.5 rounded-full">
                  v2026.3
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Effective Date: September 25, 2026 &bull; Global & Regional Regulatory Compliance
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              title="Print Documentation"
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors focus:outline-none focus:ring-1 focus:ring-emerald-500"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toolbar: Navigation Tabs & Search */}
        <div className="px-5 py-2.5 bg-slate-900 border-b border-slate-800/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
          {/* Segmented Tabs */}
          <div className="flex items-center gap-1 bg-slate-950/90 p-1 border border-slate-800 rounded-xl text-xs overflow-x-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
                activeTab === 'all'
                  ? 'bg-slate-800 text-white font-semibold shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Comprehensive View
            </button>
            <button
              onClick={() => setActiveTab('terms')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'terms'
                  ? 'bg-slate-800 text-white font-semibold shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              <span>Terms of Service</span>
            </button>
            <button
              onClick={() => setActiveTab('privacy')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'privacy'
                  ? 'bg-slate-800 text-white font-semibold shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Privacy & GDPR / CCPA</span>
            </button>
            <button
              onClick={() => setActiveTab('dpdp')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'dpdp'
                  ? 'bg-slate-800 text-white font-semibold shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Globe2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>India DPDP & Grievance</span>
            </button>
          </div>

          {/* Quick Filter */}
          <div className="relative min-w-[200px]">
            <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search compliance clauses..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-8 text-xs sm:text-sm text-slate-300 leading-relaxed">

          {/* Key Summary Notice */}
          <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-800/50 flex items-start gap-3 text-xs">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-emerald-300 mb-1">
                Zero-Knowledge Cryptographic Covenant
              </p>
              <p className="text-slate-300">
                Talk To Me (&ldquo;TTM&rdquo;) uses the Signal Protocol Double Ratchet with curve25519 and AES-256-GCM. 
                Your messages, voice notes, and media keys are strictly generated on client devices. We cannot decipher your communications, 
                we do not harvest contact graphs, and we never expose your Google email address to other peers.
              </p>
            </div>
          </div>

          {/* SECTION 1: User Rights & Account Responsibilities */}
          {(activeTab === 'all' || activeTab === 'terms') && filterMatches('user rights acceptable use conduct termination') && (
            <section className="space-y-4 border-b border-slate-800 pb-6">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-slate-800 text-emerald-400 font-mono font-bold text-xs flex items-center justify-center">
                  01
                </span>
                <h3 className="text-base font-bold text-white tracking-tight">
                  User Rights &amp; Account Responsibilities
                </h3>
              </div>

              <div className="space-y-3 pl-8 text-slate-300">
                <p>
                  <strong className="text-white">1.1 Eligibility &amp; Account Registration:</strong> By creating an account or accessing the service, you affirm that you are at least 18 years of age (or the age of majority in your jurisdiction) and possess full legal capacity to enter into these binding terms.
                </p>
                <p>
                  <strong className="text-white">1.2 Acceptable Use &amp; Strict Prohibitions:</strong> You agree not to use Talk To Me to:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-slate-400">
                  <li>Distribute child sexual abuse material (CSAM), non-consensual sexual imagery, terrorism-related material, or promote violent extremism.</li>
                  <li>Transmit malicious software, trojans, worms, keyloggers, or execute automated denial-of-service (DoS/DDoS) operations.</li>
                  <li>Engage in harassment, extortion, targeted defamation, illegal stalkerware activity, or unauthorized eavesdropping.</li>
                  <li>Attempt to bypass, decompile, reverse engineer, or forge hardware safety indicators (such as bypassing Android 14 <code>ScreenCaptureCallback</code> or <code>FLAG_SECURE</code> defenses).</li>
                </ul>
                <p>
                  <strong className="text-white">1.3 Peer Identity &amp; Display Name Privacy:</strong> Talk To Me only displays your designated Google Display Name or alias to chat partners. You remain solely responsible for the pseudonymity and information you voluntarily share inside conversation threads.
                </p>
                <p>
                  <strong className="text-white">1.4 Termination &amp; Suspension:</strong> Talk To Me reserves the right to suspend or revoke access to relay infrastructure for any identity verified to be conducting systemic protocol abuse, spam bot attacks, or severe violations of applicable criminal statutes. Users may terminate their account at any time, instantly invalidating pre-keys and cryptographic sessions.
                </p>
              </div>
            </section>
          )}

          {/* SECTION 2: International Data Protection (GDPR / CCPA) */}
          {(activeTab === 'all' || activeTab === 'privacy') && filterMatches('gdpr ccpa international data protection privacy rights erasure') && (
            <section className="space-y-4 border-b border-slate-800 pb-6">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-slate-800 text-emerald-400 font-mono font-bold text-xs flex items-center justify-center">
                  02
                </span>
                <h3 className="text-base font-bold text-white tracking-tight">
                  International Data Protection &amp; Privacy (GDPR / CCPA)
                </h3>
              </div>

              <div className="space-y-3 pl-8 text-slate-300">
                <p>
                  <strong className="text-white">2.1 Lawful Basis for Processing (GDPR Art. 6):</strong> We process minimal account identification strictly on the basis of contract fulfillment (enabling end-to-end ciphertext routing between authenticated identities) and your affirmative, explicit consent given during account initialization.
                </p>
                <p>
                  <strong className="text-white">2.2 Data Minimization &amp; Architecture:</strong>
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-slate-400">
                  <li><strong className="text-slate-200">Ephemeral Routing:</strong> Encrypted payloads are deleted immediately upon successful delivery confirmation or expiration of the negotiated disappearing message timer (1 hour, 24 hours, or 7 days).</li>
                  <li><strong className="text-slate-200">Zero Contact Book Harvesting:</strong> TTM does not upload, parse, or cross-reference your address book contacts with remote servers.</li>
                  <li><strong className="text-slate-200">Zero Metadata Selling:</strong> We do not track browsing patterns, conduct behavioural profiling, or sell any personal information under the California Consumer Privacy Act (CCPA/CPRA).</li>
                </ul>
                <p>
                  <strong className="text-white">2.3 GDPR Data Subject Rights (Articles 15&ndash;22):</strong> European Economic Area (EEA) and UK users maintain full rights to:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-slate-400">
                  <li>Access and obtain an export of public cryptographic pre-keys registered with your identity.</li>
                  <li>Rectify or alter your visible Display Name at will.</li>
                  <li>Demand total erasure of cryptographic identity records (&ldquo;Right to be Forgotten&rdquo;).</li>
                  <li>Withdraw consent at any time by signing out and purging the local cryptographic enclave.</li>
                </ul>
                <p>
                  <strong className="text-white">2.4 California Resident Disclosures (CCPA &ldquo;Do Not Sell&rdquo;):</strong> TTM explicitly certifies that it does not sell or share consumer personal information with third-party advertising networks, data brokers, or commercial analytics providers.
                </p>
              </div>
            </section>
          )}

          {/* SECTION 3: Local Jurisdiction & India DPDP Act Compliance */}
          {(activeTab === 'all' || activeTab === 'dpdp') && filterMatches('india dpdp digital personal data grievance redressal officer jurisdiction') && (
            <section className="space-y-4 border-b border-slate-800 pb-6">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-slate-800 text-emerald-400 font-mono font-bold text-xs flex items-center justify-center">
                  03
                </span>
                <h3 className="text-base font-bold text-white tracking-tight">
                  Local Jurisdiction &amp; Compliance (India DPDP Act 2023 &amp; IT Rules)
                </h3>
              </div>

              <div className="space-y-3 pl-8 text-slate-300">
                <p>
                  <strong className="text-white">3.1 Application of the DPDP Act, 2023:</strong> In accordance with the Digital Personal Data Protection Act, 2023 (&ldquo;DPDPA&rdquo;) and the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules of India, Talk To Me acts strictly as a Zero-Knowledge Electronic Intermediary and Data Fiduciary only with respect to public cryptographic routing metadata.
                </p>
                <p>
                  <strong className="text-white">3.2 Affirmative Consent Architecture:</strong> In compliance with Section 6 of the DPDP Act, consent provided upon account creation is:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-slate-400">
                  <li><strong className="text-slate-200">Specific &amp; Unconditional:</strong> Limited strictly to cryptographic session management and message delivery.</li>
                  <li><strong className="text-slate-200">Freely Revocable:</strong> Revocable with ease via local identity purge and key destruction controls.</li>
                  <li><strong className="text-slate-200">Notice Accompanied:</strong> Transparently itemized in clear, accessible language prior to authentication.</li>
                </ul>
                <p>
                  <strong className="text-white">3.3 Grievance Redressal Mechanism &amp; Statutory Officer:</strong> In compliance with Section 13 of the DPDP Act and Rule 3(2) of the Information Technology Intermediary Rules, Talk To Me provides a dedicated, accessible grievance channel:
                </p>

                {/* Grievance Officer Card */}
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 font-mono text-xs">
                  <div className="text-emerald-400 font-semibold flex items-center gap-1.5">
                    <Scale className="w-3.5 h-3.5" />
                    <span>Statutory Grievance Redressal Officer</span>
                  </div>
                  <div className="text-slate-300">Designation: Data Protection &amp; Legal Grievance Cell</div>
                  <div className="text-slate-400">
                    Direct Email:{' '}
                    <a href="mailto:grievance@talktome-secure.org" className="text-emerald-400 underline hover:text-emerald-300">
                      grievance@talktome-secure.org
                    </a>
                  </div>
                  <div className="text-slate-500 text-[11px]">
                    Turnaround: Acknowledgment within 24&ndash;48 hours; statutory investigation and resolution within 15&ndash;30 days.
                  </div>
                </div>

                <p>
                  <strong className="text-white">3.4 Intermediary Due Diligence:</strong> As an intermediary under Section 79 of the Information Technology Act, 2000, Talk To Me maintains an automated notice and takedown workflow for public-facing service abuse while honoring mathematical end-to-end encryption integrity for personal private communications.
                </p>
              </div>
            </section>
          )}

          {/* SECTION 4: Intellectual Property & Content Rights */}
          {(activeTab === 'all' || activeTab === 'terms') && filterMatches('intellectual property code assets content rights license') && (
            <section className="space-y-4 border-b border-slate-800 pb-6">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-slate-800 text-emerald-400 font-mono font-bold text-xs flex items-center justify-center">
                  04
                </span>
                <h3 className="text-base font-bold text-white tracking-tight">
                  Intellectual Property &amp; Content Rights
                </h3>
              </div>

              <div className="space-y-3 pl-8 text-slate-300">
                <p>
                  <strong className="text-white">4.1 Platform Ownership:</strong> All rights, title, and interest in and to the Talk To Me software, source code, logos, visual UI design, audio cues, and documentation are the exclusive property of Talk To Me and its licensors.
                </p>
                <p>
                  <strong className="text-white">4.2 User Content Ownership:</strong> You retain complete, unrestricted ownership of all text messages, audio recordings, images, and files you transmit through the platform. Talk To Me claims zero ownership, copyright, or moral rights over your communications.
                </p>
                <p>
                  <strong className="text-white">4.3 Technical Routing License:</strong> By sending content through the service, you grant Talk To Me only the strictly limited, non-exclusive, worldwide technical license to transmit, packetize, and cache ciphertext solely as required to deliver the message to your designated recipient(s). Because payloads are end-to-end encrypted, TTM cannot index, inspect, train AI models on, or monetize your content.
                </p>
              </div>
            </section>
          )}

          {/* SECTION 5: Limitation of Liability & Disclaimers */}
          {(activeTab === 'all' || activeTab === 'terms') && filterMatches('limitation liability disclaimers as is warranty') && (
            <section className="space-y-4 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-slate-800 text-emerald-400 font-mono font-bold text-xs flex items-center justify-center">
                  05
                </span>
                <h3 className="text-base font-bold text-white tracking-tight">
                  Limitation of Liability &amp; Disclaimers
                </h3>
              </div>

              <div className="space-y-3 pl-8 text-slate-300">
                <p>
                  <strong className="text-white">5.1 &ldquo;AS-IS&rdquo; and &ldquo;AS-AVAILABLE&rdquo; Provision:</strong> The service is provided without warranties of any kind, whether express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, or non-infringement.
                </p>
                <p>
                  <strong className="text-white">5.2 Endpoint Security Responsibility:</strong> Talk To Me provides end-to-end encryption across the wire and transient relay; however, you remain responsible for maintaining the physical and logical security of your own device, including biometric locks, passcode strength, and safeguarding against operating-system-level keyloggers or compromised device firmware.
                </p>
                <p>
                  <strong className="text-white">5.3 Maximum Extent of Liability:</strong> Under no circumstances shall Talk To Me, its developers, or affiliates be liable for any direct, indirect, incidental, special, punitive, or consequential damages resulting from lost communications, corrupted keys, device compromise, or service downtime, to the maximum extent permitted under applicable law.
                </p>
              </div>
            </section>
          )}
        </div>

        {/* Modal Footer / Action CTA */}
        <div className="px-5 py-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            {hasAccepted ? (
              <span className="text-emerald-400 flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>You have accepted these terms for your active identity.</span>
              </span>
            ) : (
              <span>
                By continuing, you agree to adhere to these legal and privacy provisions.
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={handleCopyLink}
              className="px-3 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition-colors"
            >
              {copiedNotification ? 'Link Copied!' : 'Copy Reference'}
            </button>
            <button
              onClick={() => {
                if (onAccept) onAccept();
                onClose();
              }}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-semibold text-xs rounded-xl shadow-lg shadow-emerald-950/50 hover:shadow-emerald-900/40 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-400"
            >
              {hasAccepted ? 'Close Document' : 'Accept Terms & Continue'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
