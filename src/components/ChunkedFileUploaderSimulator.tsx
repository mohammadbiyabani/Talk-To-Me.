import React, { useState, useEffect, useRef } from 'react';
import { 
  HardDrive, 
  UploadCloud, 
  Play, 
  Pause, 
  RotateCcw, 
  Lock, 
  CheckCircle2, 
  FileText, 
  ShieldCheck, 
  Cpu, 
  Layers,
  ArrowDownCircle,
  FileCheck
} from 'lucide-react';

export const ChunkedFileUploaderSimulator: React.FC = () => {
  const [fileSizeMb, setFileSizeMb] = useState<number>(500);
  const [chunkSizeMb, setChunkSizeMb] = useState<number>(10);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [uploadedChunks, setUploadedChunks] = useState<number>(0);
  const [currentSpeed, setCurrentSpeed] = useState<number>(0); // MB/s
  const [activeStage, setActiveStage] = useState<string>('idle');
  const [fileKey, setFileKey] = useState<string>('fkey_256_aes_gcm_' + Math.random().toString(36).substring(2, 10));

  const totalChunks = Math.ceil(fileSizeMb / chunkSizeMb);
  const progressPercent = Math.min(100, Math.round((uploadedChunks / totalChunks) * 100));

  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isUploading && !isPaused) {
      intervalRef.current = window.setInterval(() => {
        setUploadedChunks((prev) => {
          if (prev >= totalChunks) {
            clearInterval(intervalRef.current!);
            setIsUploading(false);
            setActiveStage('completed');
            setCurrentSpeed(0);
            return totalChunks;
          }
          // Simulate dynamic network speed between 14 MB/s and 38 MB/s
          const simulatedSpeed = Math.floor(Math.random() * 24) + 14;
          setCurrentSpeed(simulatedSpeed);
          return prev + 1;
        });
      }, 350);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isUploading, isPaused, totalChunks]);

  const handleStart = () => {
    setActiveStage('encrypting_and_uploading');
    setIsUploading(true);
    setIsPaused(false);
  };

  const handlePauseToggle = () => {
    setIsPaused(!isPaused);
  };

  const handleReset = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsUploading(false);
    setIsPaused(false);
    setUploadedChunks(0);
    setCurrentSpeed(0);
    setActiveStage('idle');
    setFileKey('fkey_256_aes_gcm_' + Math.random().toString(36).substring(2, 10));
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <HardDrive className="w-5 h-5 text-emerald-400" />
              <h2 className="text-xl font-bold text-white tracking-tight">500 MB Large File Chunked Transfer Pipeline</h2>
            </div>
            <p className="text-sm text-slate-400 max-w-3xl">
              Zero-knowledge client-side AES-256-GCM chunked encryption, presigned S3 multi-part parallel upload, and resilient resumable background streaming.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-lg text-xs text-emerald-400">
            <Lock className="w-4 h-4" />
            <span>Zero-Knowledge: Files encrypted in-flight &amp; at-rest</span>
          </div>
        </div>
      </div>

      {/* 6-Step Technical Pipeline */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
            <span className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-[10px]">1</span>
            <span>Local Disk Slicing</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Kotlin stream reader slices 500 MB file into 10 MB chunks via OkHttp <code className="text-emerald-400">ChunkedRequestBody</code>. Never loads entire 500 MB into memory, avoiding Android Out-Of-Memory (OOM) crashes.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-blue-400 uppercase tracking-wider">
            <span className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center text-[10px]">2</span>
            <span>Client AES-256-GCM</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Generates random 256-bit symmetric key <code className="text-blue-400">K_file</code>. Each chunk is encrypted with <code className="text-blue-400">IV_n = IV_base XOR chunk_index</code>, producing ciphertext + 128-bit authentication tag.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-purple-400 uppercase tracking-wider">
            <span className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center text-[10px]">3</span>
            <span>Presigned S3 Multi-Part</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Mobile client asks backend gateway for S3 Multipart Upload ID and N presigned PUT URLs. Server has zero access to the file data or encryption key.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
            <span className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center text-[10px]">4</span>
            <span>Concurrent Parallel Upload</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Kotlin Coroutines upload 4 chunks in parallel directly to S3 bucket. Each chunk completion saves an ETag into local Room DB for instant resume if network drops.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider">
            <span className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center text-[10px]">5</span>
            <span>E2EE Descriptor In Chat</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            After S3 assembles the parts, client sends an E2EE Double Ratchet message containing <code className="text-indigo-400">{`{ s3_key, file_key, iv, sha256 }`}</code> to the recipient.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-rose-400 uppercase tracking-wider">
            <span className="w-5 h-5 rounded-full bg-rose-500/20 flex items-center justify-center text-[10px]">6</span>
            <span>Streaming Client Decryption</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Recipient downloads encrypted chunks directly from S3, streams them through AES-256-GCM cipher, verifies authentication tags, and writes decrypted file to storage.
          </p>
        </div>
      </div>

      {/* Interactive Transfer Simulator */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-emerald-400" />
              Interactive 500 MB Chunked Transfer Simulator
            </h3>
            <p className="text-xs text-slate-400">
              Simulate high-capacity encrypted uploads with real chunk progression, pause/resume, and speed benchmarks.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {!isUploading && uploadedChunks === 0 && (
              <button
                onClick={handleStart}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-colors shadow-sm"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Start 500 MB Transfer</span>
              </button>
            )}

            {isUploading && (
              <button
                onClick={handlePauseToggle}
                className={`flex items-center gap-1.5 px-4 py-2 font-bold text-xs rounded-lg transition-colors ${
                  isPaused 
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950' 
                    : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                }`}
              >
                {isPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5 fill-current" />}
                <span>{isPaused ? 'Resume Upload' : 'Pause Stream'}</span>
              </button>
            )}

            {(uploadedChunks > 0 || isUploading) && (
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg transition-colors border border-slate-700"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Configuration Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-950/70 p-4 rounded-xl border border-slate-800">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              File Payload Size
            </label>
            <div className="flex gap-2">
              {[100, 250, 500].map((size) => (
                <button
                  key={size}
                  disabled={isUploading}
                  onClick={() => { setFileSizeMb(size); setUploadedChunks(0); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    fileSizeMb === size
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {size} MB
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Chunk Slicing Size
            </label>
            <div className="flex gap-2">
              {[5, 10, 20].map((chunk) => (
                <button
                  key={chunk}
                  disabled={isUploading}
                  onClick={() => { setChunkSizeMb(chunk); setUploadedChunks(0); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    chunkSizeMb === chunk
                      ? 'bg-blue-500 text-slate-950 font-bold'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {chunk} MB
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Calculated Multi-Part Plan
            </label>
            <div className="text-xs font-mono text-slate-300 mt-1">
              <span className="text-emerald-400 font-bold">{totalChunks} Chunks</span> @ {chunkSizeMb} MB each
            </div>
          </div>
        </div>

        {/* Progress Display */}
        <div className="space-y-2">
          <div className="flex justify-between items-end text-xs">
            <div className="space-y-0.5">
              <span className="font-semibold text-white">
                {uploadedChunks >= totalChunks ? 'Upload & Integrity Verification Complete' : isPaused ? 'Upload Paused (ETags Cached in Room DB)' : isUploading ? 'Streaming Encrypted Chunks to AWS S3...' : 'Ready for Upload'}
              </span>
              <div className="text-slate-400 text-[11px] font-mono">
                Transferred: {Math.min(fileSizeMb, Math.round(uploadedChunks * chunkSizeMb))} MB of {fileSizeMb} MB ({uploadedChunks}/{totalChunks} chunks)
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold font-mono text-emerald-400">{progressPercent}%</div>
              {isUploading && !isPaused && (
                <div className="text-[11px] text-blue-400 font-mono">{currentSpeed} MB/s &bull; 4 Parallel Threads</div>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
            <div
              className={`h-full transition-all duration-300 ${
                uploadedChunks >= totalChunks
                  ? 'bg-emerald-500'
                  : isPaused
                  ? 'bg-amber-500'
                  : 'bg-gradient-to-r from-teal-500 to-emerald-400'
              }`}
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Visual Chunk Matrix */}
        <div>
          <div className="flex justify-between items-center text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            <span>Visual Chunk Grid ({totalChunks} parts)</span>
            <span className="text-[11px] text-slate-500 font-normal">Green = Encrypted &amp; Uploaded to S3</span>
          </div>

          <div className="grid grid-cols-10 sm:grid-cols-25 gap-1.5 p-3 rounded-xl bg-slate-950 border border-slate-800 max-h-40 overflow-y-auto">
            {Array.from({ length: totalChunks }).map((_, index) => {
              const isDone = index < uploadedChunks;
              const isCurrent = index === uploadedChunks && isUploading && !isPaused;
              return (
                <div
                  key={index}
                  title={`Chunk #${index + 1} (${chunkSizeMb} MB)`}
                  className={`h-6 rounded flex items-center justify-center text-[10px] font-mono transition-all ${
                    isDone
                      ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/50'
                      : isCurrent
                      ? 'bg-amber-500 text-slate-950 font-bold animate-pulse'
                      : 'bg-slate-900 text-slate-600 border border-slate-800'
                  }`}
                >
                  {index + 1}
                </div>
              );
            })}
          </div>
        </div>

        {/* Local Security & Key Zeroization Details */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Client Symmetric Encryption Key (Random 256-bit AES)
            </span>
            <span className="font-mono text-[11px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
              {fileKey}
            </span>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            * This key is generated on the sender's mobile device via <code className="text-slate-300">SecureRandom()</code>. It is never transmitted to S3 or signaling servers. Only the recipient receives it inside the E2EE chat envelope.
          </p>
        </div>
      </div>
    </div>
  );
};
