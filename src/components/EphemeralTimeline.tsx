import React, { useState } from 'react';
import { 
  Clock, 
  Flame, 
  Trash2, 
  ShieldAlert, 
  Smartphone, 
  Server, 
  Database, 
  CheckCircle2, 
  AlertTriangle,
  Lock,
  RefreshCw
} from 'lucide-react';

export const EphemeralTimeline: React.FC = () => {
  const [selectedHour, setSelectedHour] = useState<number>(0);

  const getStatusForHour = (hour: number) => {
    if (hour < 24) {
      const remainingHours = 24 - hour;
      return {
        status: 'ACTIVE_EPHEMERAL',
        badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
        label: `Active (${remainingHours}h remaining before self-destruct)`,
        clientText: `Message is cached in encrypted local Room database (SQLCipher). Decrypted plaintext is rendered in UI. Symmetric session keys are protected.`,
        serverText: `Encrypted delivery envelope in PostgreSQL queue. S3 object active. Redis presence valid.`,
        s3Text: `Encrypted 500 MB media chunks stored under s3://talktome-ephemeral-media/{uuid}. Lifecycle age: ${hour} hours.`
      };
    } else {
      return {
        status: 'HARD_PURGED',
        badgeColor: 'bg-red-500/10 text-red-400 border-red-500/30',
        label: `PERMANENTLY SHREDDED (> 24h Hard Cutoff)`,
        clientText: `WorkManager triggered: Room row deleted; cached media file bytes overwritten with zeros (0x00) via secureShred() before unlinking; decryption key destroyed.`,
        serverText: `PostgreSQL pg_cron / scheduled Cloud Run worker issued: DELETE FROM ephemeral_messages WHERE expires_at < NOW(). Zero traces remain.`,
        s3Text: `AWS S3 Lifecycle Rule executed: Object permanently deleted from bucket. Zero storage costs, zero recoverable data.`
      };
    }
  };

  const currentStatus = getStatusForHour(selectedHour);

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-5 h-5 text-emerald-400" />
              <h2 className="text-xl font-bold text-white tracking-tight">24-Hour Ephemeral Auto-Destruct Strategy</h2>
            </div>
            <p className="text-sm text-slate-400 max-w-3xl">
              Strict autonomous dual-sided self-destruct architecture ensuring messages, media attachments, and call logs vanish permanently 24 hours after dispatch.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 px-3 py-1.5 rounded-lg text-xs text-red-400">
            <Flame className="w-4 h-4" />
            <span>Hard 24-Hour TTL: Zero Long-Term Data Retention</span>
          </div>
        </div>
      </div>

      {/* Interactive Time Scrubber */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-400" />
              Interactive 24-Hour Lifecycle Scrubber
            </h3>
            <p className="text-xs text-slate-400">
              Drag the timeline to inspect client Room DB, server PostgreSQL, S3, and memory states as time elapses.
            </p>
          </div>
          <div className="text-xs font-mono px-3 py-1 rounded bg-slate-950 text-white border border-slate-800">
            T + {selectedHour} Hours ({selectedHour * 60} Minutes)
          </div>
        </div>

        {/* Range Slider */}
        <div className="space-y-2">
          <input
            type="range"
            min="0"
            max="30"
            step="1"
            value={selectedHour}
            onChange={(e) => setSelectedHour(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-emerald-400 border border-slate-800"
          />
          <div className="flex justify-between text-[11px] font-mono text-slate-500">
            <span>T+0h (Sent)</span>
            <span>T+6h</span>
            <span>T+12h</span>
            <span>T+18h</span>
            <span className="text-orange-400 font-bold">T+24h (Purge Boundary)</span>
            <span className="text-red-400">T+30h (Zero Trace)</span>
          </div>
        </div>

        {/* Current State Indicator */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${selectedHour >= 24 ? 'bg-red-500 animate-pulse' : 'bg-emerald-400'}`}></div>
            <div>
              <span className="text-xs font-bold text-white">System Lifecycle State: </span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${currentStatus.badgeColor}`}>
                {currentStatus.label}
              </span>
            </div>
          </div>
          <div className="text-xs text-slate-400 font-mono hidden sm:block">
            {selectedHour >= 24 ? 'Cryptographically Shredded' : `${(24 - selectedHour) * 3600} seconds left`}
          </div>
        </div>

        {/* Dual Architecture State: Client vs Server */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Client-Side Status */}
          <div className="bg-slate-950/70 p-5 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-emerald-400" />
                Client-Side (Android Room &amp; Disk Cache)
              </span>
              <span className="text-[10px] font-mono text-slate-400">Local SQLite / Room</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed min-h-[50px]">
              {currentStatus.clientText}
            </p>

            <div className="text-[11px] font-mono bg-slate-900 p-3 rounded-lg border border-slate-800 text-slate-400 space-y-1">
              <div className="text-emerald-400">// Client WorkManager Deletion Query:</div>
              <div>@Query("DELETE FROM local_messages WHERE expires_at &lt; :currentTime")</div>
              <div>suspend fun purgeExpiredMessages(currentTime: Long): Int</div>
            </div>
          </div>

          {/* Server-Side Status */}
          <div className="bg-slate-950/70 p-5 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <Server className="w-4 h-4 text-blue-400" />
                Backend Cloud (PostgreSQL, S3 &amp; Redis)
              </span>
              <span className="text-[10px] font-mono text-slate-400">AWS / GCP / Supabase</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed min-h-[50px]">
              {currentStatus.serverText}
            </p>

            <div className="text-[11px] font-mono bg-slate-900 p-3 rounded-lg border border-slate-800 text-slate-400 space-y-1">
              <div className="text-blue-400">// PostgreSQL pg_cron Job (Every 5 mins):</div>
              <div>SELECT cron.schedule('purge-ephemeral', '*/5 * * * *',</div>
              <div>'DELETE FROM ephemeral_messages WHERE expires_at &lt; NOW()');</div>
            </div>
          </div>
        </div>
      </div>

      {/* Deep-Dive Architectural Safeguards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-lg">
          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2 flex items-center gap-1.5">
            <Lock className="w-4 h-4" />
            1. Cryptographic Shredding
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            Standard disk deletion only unlinks file inodes, leaving raw NAND flash flash blocks intact. Talk To Me executes <strong>cryptographic shredding</strong>: deleting the 256-bit symmetric key first, rendering residual disk bytes mathematically impossible to decrypt.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-lg">
          <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-2 flex items-center gap-1.5">
            <RefreshCw className="w-4 h-4" />
            2. Offline Device Reconnection
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            If a user's phone is offline (airplane mode) for 48 hours and reconnects:
            the server has already purged the undelivered messages from the queue. Furthermore, on app launch, the local client runs a startup audit that drops any cached messages where <code className="text-blue-300">expires_at &lt; NOW()</code> before rendering the UI.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-lg">
          <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-2 flex items-center gap-1.5">
            <Database className="w-4 h-4" />
            3. AWS S3 Bucket Lifecycle Rules
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            S3 handles file deletion at the infrastructure layer via XML/JSON lifecycle rules (<code className="text-purple-300">Expiration: DaysAfterInitiation = 1</code>). Even if backend servers crash or suffer downtime, AWS S3 autonomously deletes expired 500 MB files without manual API calls.
          </p>
        </div>
      </div>
    </div>
  );
};
