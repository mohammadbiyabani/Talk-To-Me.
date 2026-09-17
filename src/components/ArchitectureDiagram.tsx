import React, { useState } from 'react';
import { 
  Smartphone, 
  Server, 
  Database, 
  Cloud, 
  PhoneCall, 
  ShieldAlert, 
  Lock, 
  ArrowRight, 
  RefreshCw, 
  CheckCircle2,
  HardDriveDownload,
  Flame
} from 'lucide-react';

interface ArchNode {
  id: string;
  title: string;
  category: string;
  icon: React.ReactNode;
  protocols: string[];
  role: string;
  securityGuarantee: string;
  implementationHighlights: string[];
}

export const ArchitectureDiagram: React.FC = () => {
  const nodes: ArchNode[] = [
    {
      id: 'client',
      title: 'Mobile App Client (Talk To Me)',
      category: 'Native Android / Kotlin / Flutter',
      icon: <Smartphone className="w-5 h-5 text-emerald-400" />,
      protocols: ['Android Keystore', 'WebRTC DTLS-SRTP', 'WSS (TLS 1.3)', 'AES-256-GCM'],
      role: 'Hardware-protected root of trust. Encrypts and decrypts all messages, audio/video streams, and 500 MB file chunks locally on-device. Manages local Room database with SQLCipher encryption.',
      securityGuarantee: 'Zero-Knowledge: Plaintext, private prekeys, and media decryption keys NEVER leave the device memory.',
      implementationHighlights: [
        'Android Keystore (StrongBox Keymaster) stores Curve25519 Identity Private Key',
        'Direct ByteBuffer chunking for streaming 500 MB files without OOM crashes',
        'Native WebRTC C++ bindings for hardware-accelerated VP8/H.264 video rendering',
        'WorkManager periodic job cleans local Room DB rows older than 24 hours'
      ]
    },
    {
      id: 'gateway',
      title: 'Real-Time Signaling Gateway',
      category: 'Go / Fastify WebSocket Cluster',
      icon: <Server className="w-5 h-5 text-blue-400" />,
      protocols: ['WSS', 'gRPC', 'JWT (OAuth 2.0)', 'TLS 1.3'],
      role: 'High-throughput stateless signaling orchestrator. Handles user authentication, public prekey distribution, WebRTC SDP offer/answer/ICE exchange, and encrypted message delivery envelopes.',
      securityGuarantee: 'Blind Relay: Gateway inspects only metadata (recipient ID, message envelope timestamp); cannot inspect message ciphertexts or media content.',
      implementationHighlights: [
        'Go goroutines maintain 200k+ concurrent low-latency WebSocket connections',
        'Verifies Firebase Auth JWT tokens on initial WSS connection handshake',
        'Issues short-lived HMAC-SHA1 tokens for COTURN TURN relay access',
        'Generates AWS S3 / Cloudflare R2 multi-part presigned URLs for client chunk uploads'
      ]
    },
    {
      id: 'redis',
      title: 'Distributed Pub/Sub & Presence',
      category: 'Redis 7 Sentinel / Cluster',
      icon: <RefreshCw className="w-5 h-5 text-red-400" />,
      protocols: ['Redis RESP3', 'In-Memory Key-Value'],
      role: 'Cross-node message routing bus and transient user presence tracker. Routes signaling envelopes between multiple gateway instances and manages temporary call session states.',
      securityGuarantee: 'Volatile In-Memory Storage: Keys are configured with strict TTL (max 60 seconds for presence, 24 hours max for transient queues).',
      implementationHighlights: [
        'Redis Pub/Sub channels keyed by recipient user UUID: `channel:user:{uuid}`',
        'Heartbeat presence keys: `presence:{user_id}` with 45-second auto-expiry',
        'WebRTC signaling rendezvous for fast peer-to-peer session matching'
      ]
    },
    {
      id: 'webrtc',
      title: 'WebRTC P2P & COTURN Relay',
      category: 'COTURN (STUN/TURN) Cluster',
      icon: <PhoneCall className="w-5 h-5 text-amber-400" />,
      protocols: ['DTLS 1.3', 'SRTP (AES-GCM-256)', 'STUN/TURN (RFC 5766)'],
      role: 'Enables high-fidelity 1-on-1 audio and video calls. Attempts direct peer-to-peer connection first via STUN NAT traversal. If symmetric NAT restricts direct P2P, COTURN relays encrypted media packets.',
      securityGuarantee: 'End-to-End Media Encryption: COTURN relays encrypted UDP datagrams without possessing the DTLS-SRTP session keys.',
      implementationHighlights: [
        'Direct P2P latency typically 30ms - 80ms',
        'Opus audio codec with Dynamic Jitter Buffering & Packet Loss Concealment (PLC)',
        'Adaptive Bitrate (ABR) switching between 720p/1080p video based on real-time RTCP feedback',
        'Ephemeral TURN credentials generated per-call preventing unauthorized relay usage'
      ]
    },
    {
      id: 's3',
      title: 'Object Storage (500 MB Encrypted Files)',
      category: 'AWS S3 / Cloudflare R2 / GCS',
      icon: <HardDriveDownload className="w-5 h-5 text-indigo-400" />,
      protocols: ['HTTPS REST', 'Multi-Part Upload API', 'Presigned URLs'],
      role: 'Direct destination for encrypted 500 MB file chunks. Mobile clients upload and download chunks directly without routing payloads through backend servers.',
      securityGuarantee: 'Zero-Knowledge Blob Storage: Objects stored in S3 are opaque AES-256-GCM ciphertexts. The decryption key is sent only through E2EE chat messages.',
      implementationHighlights: [
        'S3 Multi-Part upload supports up to 10,000 parts of 5 MB - 20 MB each',
        'Client requests presigned PUT URLs for each chunk; uploads 4 chunks concurrently',
        'Automated S3 Lifecycle Rule permanently deletes all objects 24 hours after creation',
        'Incomplete multi-part uploads aborted and purged automatically after 24 hours'
      ]
    },
    {
      id: 'postgres',
      title: 'Database & Public Key Registry',
      category: 'PostgreSQL 16 + Row-Level Security',
      icon: <Database className="w-5 h-5 text-teal-400" />,
      protocols: ['PostgreSQL Wire', 'TLS 1.3', 'ACID Transactions'],
      role: 'Maintains user accounts, published X3DH Prekey Bundles, undelivered encrypted message queues, and ephemeral call logs.',
      securityGuarantee: 'No Plaintext Storage: Zero plaintext messages, zero symmetric keys, zero audio/video recordings.',
      implementationHighlights: [
        'Stores Curve25519 Identity Keys and batches of One-Time Prekeys for X3DH',
        'Ephemeral message records carry hard `expires_at = sent_at + INTERVAL 24 hours`',
        'Scheduled pg_cron background worker purges expired records every 5 minutes',
        'Row-Level Security (RLS) ensures users can only query their own queued envelopes'
      ]
    },
    {
      id: 'cleaner',
      title: '24-Hour Ephemeral Janitor Worker',
      category: 'Background Cloud Worker & Client WorkManager',
      icon: <Flame className="w-5 h-5 text-orange-400" />,
      protocols: ['Automated TTL Engine', 'Cryptographic Shredding'],
      role: 'Dual-sided autonomous garbage collection. On the backend, purges database rows and synchronizes storage deletions. On the client, scrubs local Room database and overwrites cached media files.',
      securityGuarantee: 'Cryptographic Shredding: Deletes decryption keys first so even un-overwritten disk blocks are rendered mathematically unrecoverable.',
      implementationHighlights: [
        'Server: pg_cron runs `DELETE FROM ephemeral_messages WHERE expires_at < NOW()`',
        'Client: Android WorkManager with PeriodicWorkRequestBuilder runs every 15 minutes',
        'Zero-fill byte overwrite before calling Java `File.delete()` for cached media files',
        'Immediate deletion of ephemeral Double Ratchet skipped message keys upon receipt'
      ]
    }
  ];

  const [selectedNode, setSelectedNode] = useState<ArchNode>(nodes[0]);

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <h2 className="text-xl font-bold text-white tracking-tight">Zero-Knowledge System Topology</h2>
            </div>
            <p className="text-sm text-slate-400 max-w-3xl">
              End-to-End Encrypted mobile communication architecture with hardware-backed client keys, direct peer-to-peer WebRTC media, presigned multi-part 500 MB file streams, and autonomous 24-hour cryptographic shredding.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-2 rounded-lg border border-slate-700 text-xs text-slate-300">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span>Zero-Knowledge Principle: Server cannot decrypt any content</span>
          </div>
        </div>
      </div>

      {/* Visual Topology Diagram */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl overflow-hidden">
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4 flex items-center justify-between">
          <span>Interactive Component Map (Click to inspect)</span>
          <span className="text-slate-500">Arrows indicate data &amp; signaling flow</span>
        </div>

        {/* Nodes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-3">
          {nodes.map((node) => {
            const isSelected = selectedNode.id === node.id;
            return (
              <button
                key={node.id}
                id={`arch-node-${node.id}`}
                onClick={() => setSelectedNode(node)}
                className={`flex flex-col items-center text-center p-4 rounded-xl border transition-all duration-200 text-left ${
                  isSelected
                    ? 'bg-slate-800 border-emerald-500 shadow-md shadow-emerald-500/10 ring-1 ring-emerald-500'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                }`}
              >
                <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-700/80 flex items-center justify-center mb-2 shadow-inner">
                  {node.icon}
                </div>
                <h3 className="font-semibold text-xs text-white line-clamp-2 leading-tight mb-1">{node.title}</h3>
                <span className="text-[10px] text-slate-400 line-clamp-1">{node.category}</span>
                {isSelected && (
                  <span className="mt-2 text-[10px] font-semibold text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded border border-emerald-400/20">
                    Active
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Connection Flow Bar */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
          <span className="bg-slate-800 px-2.5 py-1 rounded-md text-slate-300">Client Alice</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
          <span className="bg-slate-800 px-2.5 py-1 rounded-md text-blue-300">Signaling Gateway</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
          <span className="bg-slate-800 px-2.5 py-1 rounded-md text-teal-300">Direct S3 / WebRTC P2P</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
          <span className="bg-slate-800 px-2.5 py-1 rounded-md text-slate-300">Client Bob</span>
        </div>
      </div>

      {/* Detailed Node Inspector */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center">
              {selectedNode.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">{selectedNode.title}</h3>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {selectedNode.category}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Component Architectural Profile &amp; Implementation Contract</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5 justify-end">
            {selectedNode.protocols.map((proto, idx) => (
              <span key={idx} className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-950 text-emerald-400 border border-slate-800">
                {proto}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-slate-400" />
                Primary Role in "Talk To Me"
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-lg border border-slate-800">
                {selectedNode.role}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-1.5 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                Zero-Knowledge Security Guarantee
              </h4>
              <p className="text-sm text-emerald-300/90 leading-relaxed bg-emerald-950/20 p-3.5 rounded-lg border border-emerald-900/40">
                {selectedNode.securityGuarantee}
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
              Technical Implementation Highlights
            </h4>
            <ul className="space-y-2.5">
              {selectedNode.implementationHighlights.map((highlight, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/80">
                  <span className="w-5 h-5 rounded-full bg-slate-800 flex-shrink-0 flex items-center justify-center text-[10px] font-mono text-slate-400">
                    {idx + 1}
                  </span>
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
