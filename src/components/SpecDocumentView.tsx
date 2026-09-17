import React, { useState } from 'react';
import { 
  FileText, 
  Copy, 
  Check, 
  Download, 
  Printer, 
  ShieldCheck, 
  Lock, 
  HardDrive, 
  Clock, 
  Smartphone, 
  Server, 
  Database 
} from 'lucide-react';

export const SpecDocumentView: React.FC = () => {
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const fullMarkdownDoc = `# TALK TO ME (TTM) — SYSTEM ARCHITECTURE BLUEPRINT & TECHNICAL SPECIFICATION
Author: Principal Mobile App System Architect & Full-Stack Developer
Version: 2.0.0-PROD
Classification: Zero-Knowledge Architecture & Security Hardening Specification

---

## 1. EXECUTIVE SUMMARY & ARCHITECTURAL FOUNDATION

"Talk To Me (TTM)" is a privacy-first, zero-knowledge real-time mobile communications platform providing:
- Google Sign-In with Strict Privacy Enforcement: Google Account Display Name (Profile Name) ONLY; zero raw Gmail address exposure in any UI or API payload.
- Visual Identity: Distinctive TTM Shield Logo (Dark Slate & Glowing Emerald #020617 / #10B981) integrated with active screen toolbar headers.
- E2EE 1-on-1 and Group Real-time Messaging powered by Signal Protocol (Double Ratchet + X3DH).
- Press-and-Hold Voice Recording (Voice Notes) with live waveform buffer, preview playback, and client-side AES-256 encryption.
- Real-Time Screenshot & Screen Recording Alert Engine utilizing Android 14+ ScreenCaptureCallback and DisplayManager Virtual Display listeners to broadcast instant chat alerts.
- Privacy-Preserving Contact Sync using on-device HMAC-SHA256 phone normalization and backend Private Set Intersection (PSI).
- High-fidelity 1-on-1 Audio and Video Calling via WebRTC (DTLS-SRTP).
- High-capacity 500 MB Chunked File Transfer with Client-side AES-256-GCM.
- Autonomous 24-Hour Ephemeral Self-Destruct across Mobile Client & Cloud Backend.
- Comprehensive Anti-Hacker Hardening: SSL/TLS Certificate Pinning, Root Detection, R8/ProGuard Obfuscation, and Android Keystore SQLCipher database encryption.

---

## 2. PRIVACY & IDENTITY SPECIFICATION (CRUCIAL)

### 2.1 Display Name Policy
- Mobile clients retrieve and display strictly the authenticated user's Google Account Display Name (\`displayName\`).
- UI components (TopAppBar, message bubbles, friend suggestion lists, profile drawers) NEVER render, store, or serialize raw Gmail addresses (\`user@gmail.com\`).
- Backend databases store only an internal UUID, Firebase UID subject token, and one-way salted HMAC-SHA256 hash for deduplication. Raw email is excluded from client-facing API responses.

---

## 3. REAL-TIME SCREENSHOT & SCREEN RECORDING ALERT SYSTEM

### 3.1 Android Detection Architecture
1. **Android 14+ (API 34):** Registers \`Activity.registerScreenCaptureCallback()\` for hardware-level screenshot detection.
2. **Android 10-13 (API 29-33):** Fallback \`ContentObserver\` on \`MediaStore.Images.Media.EXTERNAL_CONTENT_URI\` checking for recent files containing 'screenshot'.
3. **Screen Recording Detection:** \`DisplayManager.DisplayListener\` monitors active displays. Any virtual display created by \`MediaProjectionManager\` triggers a screen recording flag.
4. **WebSocket Alert Dispatch:** Instantly fires a system payload into the active chat session:
   \`ALERT: Screenshot or Screen Recording Detected.\` to notify both conversation participants.
5. **Hardening Toggle:** Supports dynamic \`WindowManager.LayoutParams.FLAG_SECURE\` enforcement.

---

## 4. VOICE RECORDING (VOICE NOTES) ARCHITECTURE

### 4.1 Audio Capture & Client-Side Encryption
- **Capture Pipeline:** Android \`AudioRecord\` captures 48kHz, 16-bit PCM stereo, encoded to Opus.
- **Waveform Buffer:** Live 16-bar amplitude visualizer rendered in Jetpack Compose.
- **Preview & Discard:** User can pause, review playback, or swipe to trash.
- **Encryption:** Audio payload is symmetrically encrypted on-device via AES-256-GCM before socket transmission.

---

## 5. PRIVACY-PRESERVING CONTACT SYNC & FRIEND SUGGESTIONS

### 5.1 Private Set Intersection (PSI) Protocol
1. **Local Address Book Extraction:** Client queries device \`ContactsContract.CommonDataKinds.Phone\`.
2. **Normalization:** Numbers normalized to strict E.164 format (\`+14155550192\`).
3. **Blinded Hashing:** On-device \`HMAC-SHA256(E.164, TTM_PEPPER)\`. Raw numbers never leave client RAM.
4. **Blind PSI Query:** Client transmits array of hashes. Server matches against \`user_phone_hashes\` table.
5. **Display Name Result:** Server returns ONLY matched Google Account Display Names and avatars.

---

## 6. ANTI-HACKER & SECURITY HARDENING SPECIFICATIONS

- **Signal Protocol E2EE:** Enforced across all chat messages, voice notes, 500MB chunked files, and WebRTC media streams.
- **SSL/TLS Certificate Pinning:** Enforced via OkHttp \`CertificatePinner\` with SHA-256 public key pins for primary and backup endpoints.
- **Root Detection:** \`RootBeer\` heuristics detect \`su\` binary, Magisk mounts, and Frida DBI hooks, triggering zeroization of master keys and immediate termination.
- **R8 / ProGuard Obfuscation:** Strips logging, renames package/class/method symbols, encrypts strings, and discards unused bytecodes.
- **Android Keystore & SQLCipher:** Local SQLite database encrypted transparently with 256-bit AES via SQLCipher. Key is held strictly inside Android StrongBox Keymaster.

---

## 7. 24-HOUR AUTO-DELETION & EPHEMERAL STORAGE STRATEGY

### 7.1 Client-Side Deletion (Android Room + WorkManager)
- Every message, media record, and call log carries: \`expires_at = sent_at + 86400000\` (24 hours).
- **Periodic Cleanup:** Android WorkManager triggers a periodic background job every 15 minutes:
  \`DELETE FROM local_messages WHERE expires_at < :currentTimeMs\`
- **Cryptographic Shredding:** For cached media files, the app overwrites physical file bytes with zeros (0x00) before invoking \`file.delete()\`.
- **App Launch Audit:** On cold launch, an immediate SQL vacuum removes all expired records before rendering the UI.

### 7.2 Backend Server Deletion (PostgreSQL + S3 + Redis)
- **PostgreSQL pg_cron:** Runs every 5 minutes:
  \`DELETE FROM ephemeral_messages WHERE expires_at < NOW();\`
- **AWS S3 Bucket Lifecycle Rules:**
  - Expiration: \`<Days>1</Days>\`
  - AbortIncompleteMultipartUpload: \`<DaysAfterInitiation>1</DaysAfterInitiation>\`
- **Redis TTL:** Transient presence keys expire in 45 seconds; queue notifications carry a hard 86400s TTL.

---

## 8. 500 MB LARGE FILE HANDLING PIPELINE

1. **Client Partitioning:** Sender slices 500 MB file into 50 chunks of 10 MB each using streaming input buffers.
2. **Key Generation:** Generates K_file (AES-256).
3. **Chunk Encryption:** Computes IV_n = IV_base XOR n. Encrypts chunk #n -> outputs Ciphertext_n + 16-byte AuthTag_n.
4. **Presigned Multi-Part Request:** Client calls \`POST /api/media/multipart/init\`. Backend initiates S3 Multipart Upload and returns 50 presigned PUT URLs.
5. **Parallel Chunk Streaming:** OkHttp uploads 4 chunks concurrently directly to S3. Local Room DB caches ETags for pause/resume resilience.
6. **Completion & Integrity:** Client issues S3 CompleteMultipartUpload and sends E2EE payload to recipient:
   \`{ s3_object_key, file_key, iv_base, sha256_checksum, mime_type, file_name }\`
7. **Streaming Decryption:** Recipient downloads chunks directly from S3, streams them through AES-256-GCM, verifies SHA-256 integrity, and saves to secure sandbox.

---

## 9. STEP-BY-STEP DEVELOPMENT ROADMAP (14 WEEKS)

- **Phase 1 (Weeks 1-3):** Cryptographic Core & Identity Foundation (Google Sign-In, Android Keystore, X3DH key registration, libsignal bindings).
- **Phase 2 (Weeks 4-6):** Real-Time Messaging, Voice Notes & 24H Auto-Destruct Engine (WebSocket gateway, Room SQLCipher DB, WorkManager + pg_cron purge).
- **Phase 3 (Weeks 7-9):** 500 MB Encrypted Chunked File Transfer & PSI Contact Sync (OkHttp streaming slicer, S3 multipart presigned API, pause/resume, HMAC-SHA256 contact matcher).
- **Phase 4 (Weeks 10-12):** WebRTC 1-on-1 Voice & Video Calling (COTURN cluster, DTLS-SRTP, Opus/VP8 hardware encoders).
- **Phase 5 (Weeks 13-14):** Security Hardening, Real-time Screenshot Alerts, SSL Pinning & Production Release (ScreenCaptureCallback, RootBeer, R8, Play Store deployment).
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullMarkdownDoc);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <FileText className="w-5 h-5 text-emerald-400" />
              <h2 className="text-xl font-bold text-white tracking-tight">System Architecture Whitepaper &amp; Technical Spec</h2>
            </div>
            <p className="text-sm text-slate-400 max-w-3xl">
              Complete, production-ready engineering documentation ready to copy into your repository's <code className="text-slate-300">ARCHITECTURE.md</code> or share with development teams.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-colors shadow-sm"
            >
              {isCopied ? <Check className="w-4 h-4 text-slate-950" /> : <Copy className="w-4 h-4 text-slate-950" />}
              <span>{isCopied ? 'Copied Full Markdown!' : 'Copy Markdown Whitepaper'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Styled Document Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-xl max-w-5xl mx-auto space-y-8 text-slate-300 text-sm leading-relaxed">
        {/* Document Title Header */}
        <div className="border-b border-slate-800 pb-6">
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-widest mb-2">
            <span>Production Architecture Document &bull; Ver 1.0</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Talk To Me — Mobile System Architecture Blueprint
          </h1>
          <p className="text-xs text-slate-400 mt-2">
            Prepared by: Principal Mobile App System Architect &amp; Full-Stack Developer &bull; Zero-Knowledge E2EE Standard
          </p>
        </div>

        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800/80 pb-2">
            <span className="text-emerald-400 font-mono">1.</span>
            Tech Stack Selection &amp; Strategic Rationale
          </h2>
          <p>
            To deliver real-time E2EE messaging, WebRTC hardware-accelerated audio/video calls, and streaming 500 MB file transfers without memory crashes, we select a decoupled, zero-knowledge topology:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <strong className="text-white block mb-1">Frontend: Native Android (Kotlin) / Flutter</strong>
              Hardware-backed Android Keystore for Curve25519 identity keys, low-level ByteBuffer file chunking, native WebRTC C++ bindings, and WorkManager background task reliability.
            </div>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <strong className="text-white block mb-1">Signaling Backend: Go / Fastify (Node.js)</strong>
              Stateless WebSocket &amp; gRPC gateway sustaining 250k+ persistent concurrent connections with sub-millisecond dispatching. Redis 7 Pub/Sub bus for inter-node routing.
            </div>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <strong className="text-white block mb-1">Media Relay: COTURN (STUN/TURN)</strong>
              Distributed TURN cluster facilitating peer-to-peer WebRTC DTLS-SRTP calls across restrictive symmetric NATs without decrypting media payloads.
            </div>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <strong className="text-white block mb-1">Storage &amp; DB: AWS S3 / R2 + PostgreSQL + Room</strong>
              Presigned multi-part S3 upload pipeline with 24-hour Lifecycle auto-destruct. PostgreSQL stores public prekey bundles; Room with SQLCipher stores local encrypted client cache.
            </div>
          </div>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800/80 pb-2">
            <span className="text-emerald-400 font-mono">2.</span>
            End-to-End Encryption (E2EE) Architecture
          </h2>
          <p>
            The system employs a strict <strong>Zero-Knowledge Server Architecture</strong> where the backend operates as a blind routing channel:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-xs text-slate-300">
            <li>
              <strong>Text &amp; Group Chat:</strong> The Signal Protocol (X3DH key agreement + Double Ratchet). Each message advances a symmetric KDF ratchet (generating single-use message keys) and an asymmetric Diffie-Hellman ratchet (providing Break-in Recovery and Forward Secrecy).
            </li>
            <li>
              <strong>Audio &amp; Video Streams:</strong> Direct WebRTC peer-to-peer encrypted media streams via DTLS 1.3 and SRTP (AES-GCM-256). TURN relay nodes handle only opaque encrypted UDP datagrams.
            </li>
            <li>
              <strong>500 MB File Attachments:</strong> Envelope Encryption. The mobile client generates a random 256-bit symmetric key (<code className="text-emerald-400">K_file</code>), encrypts chunks locally before upload, and passes <code className="text-emerald-400">K_file</code> exclusively through the E2EE chat envelope.
            </li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800/80 pb-2">
            <span className="text-emerald-400 font-mono">3.</span>
            24-Hour Ephemeral Auto-Destruct Strategy
          </h2>
          <p>
            Both mobile client and backend cloud execute coordinated, autonomous 24-hour self-destruction:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
              <strong className="text-emerald-400 block">Client-Side (Mobile)</strong>
              <p>1. WorkManager runs every 15 minutes: <code className="text-slate-300">DELETE FROM local_messages WHERE expires_at &lt; NOW()</code>.</p>
              <p>2. Cryptographic Shredding: Cached media files undergo byte-level zero-fill overwriting before filesystem unlinking.</p>
              <p>3. Cold-boot vacuum ensures offline devices drop expired messages immediately upon wake-up.</p>
            </div>
            <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
              <strong className="text-blue-400 block">Server-Side (Cloud)</strong>
              <p>1. PostgreSQL <code className="text-slate-300">pg_cron</code> worker runs every 5 minutes to purge expired queue records.</p>
              <p>2. AWS S3 Lifecycle Rules automatically permanently delete media objects after 24 hours.</p>
              <p>3. Incomplete multi-part uploads are aborted and shredded after 24 hours.</p>
            </div>
          </div>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800/80 pb-2">
            <span className="text-emerald-400 font-mono">4.</span>
            500 MB Large File Handling Pipeline
          </h2>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 space-y-2">
            <div className="text-emerald-400">// Client Streaming &amp; Upload Sequence:</div>
            <div>1. [Client] Slices 500 MB file into 50 x 10 MB chunks via OkHttp ChunkedRequestBody.</div>
            <div>2. [Client] Generates random 256-bit K_file and computes IV_n for each chunk.</div>
            <div>3. [Client] Encrypts chunk n with AES-256-GCM -&gt; Ciphertext + 16-byte Auth Tag.</div>
            <div>4. [Client -&gt; Server] Requests S3 multi-part Upload ID &amp; 50 presigned PUT URLs.</div>
            <div>5. [Client -&gt; S3] Streams 4 chunks concurrently directly to S3; saves ETags in Room DB.</div>
            <div>6. [Client -&gt; Recipient] Transmits E2EE chat envelope with {`{ s3_key, K_file, iv, sha256 }`}.</div>
            <div>7. [Recipient -&gt; S3] Streams encrypted chunks, verifies auth tags, reconstructs file.</div>
          </div>
        </section>

        {/* Section 5 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800/80 pb-2">
            <span className="text-emerald-400 font-mono">5.</span>
            Phased 14-Week Development Roadmap
          </h2>
          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded bg-slate-950 border border-slate-800 flex justify-between">
              <span className="font-bold text-white">Phase 1 (Weeks 1-3): Cryptographic Core &amp; Identity</span>
              <span className="text-emerald-400 font-mono">Google OAuth, Keystore, X3DH, Libsignal</span>
            </div>
            <div className="p-2.5 rounded bg-slate-950 border border-slate-800 flex justify-between">
              <span className="font-bold text-white">Phase 2 (Weeks 4-6): Real-Time Messaging &amp; 24H TTL</span>
              <span className="text-emerald-400 font-mono">Go WebSocket gateway, Room SQLCipher, pg_cron</span>
            </div>
            <div className="p-2.5 rounded bg-slate-950 border border-slate-800 flex justify-between">
              <span className="font-bold text-white">Phase 3 (Weeks 7-9): 500 MB Encrypted Chunked Transfers</span>
              <span className="text-emerald-400 font-mono">S3 presigned multipart, OkHttp Flow, resume</span>
            </div>
            <div className="p-2.5 rounded bg-slate-950 border border-slate-800 flex justify-between">
              <span className="font-bold text-white">Phase 4 (Weeks 10-12): WebRTC Voice &amp; Video Calling</span>
              <span className="text-emerald-400 font-mono">COTURN cluster, DTLS-SRTP, Opus/VP8 codecs</span>
            </div>
            <div className="p-2.5 rounded bg-slate-950 border border-slate-800 flex justify-between">
              <span className="font-bold text-white">Phase 5 (Weeks 13-14): Security Audits &amp; Play Store MVP</span>
              <span className="text-emerald-400 font-mono">FLAG_SECURE, memory zeroing, production release</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
