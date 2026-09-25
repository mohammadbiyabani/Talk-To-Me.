import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from './supabase';
import { CallSignalPayload, CallType } from '../types/chat';

export const RTC_CONFIG: RTCConfiguration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
  ],
};

// Singleton channel for call signaling
let signalingChannel: RealtimeChannel | null = null;
const listeners = new Set<(signal: CallSignalPayload) => void>();

export function getCallSignalingChannel(): RealtimeChannel {
  if (signalingChannel) {
    return signalingChannel;
  }

  signalingChannel = supabase.channel('call-signaling', {
    config: {
      broadcast: { self: false },
    },
  });

  signalingChannel
    .on('broadcast', { event: 'webrtc-signal' }, (response) => {
      const payload = response.payload as CallSignalPayload;
      listeners.forEach((listener) => {
        try {
          listener(payload);
        } catch (err) {
          console.error('Signaling listener error:', err);
        }
      });
    })
    .subscribe();

  return signalingChannel;
}

export function subscribeToCallSignals(callback: (signal: CallSignalPayload) => void): () => void {
  getCallSignalingChannel();
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

export async function broadcastCallSignal(payload: CallSignalPayload) {
  const channel = getCallSignalingChannel();

  // If Supabase is configured, broadcast via channel
  if (isSupabaseConfigured) {
    await channel.send({
      type: 'broadcast',
      event: 'webrtc-signal',
      payload,
    });
  } else {
    // If not configured, dispatch a custom browser event so two tabs/windows or local loopback can communicate!
    window.dispatchEvent(new CustomEvent('ttm-local-webrtc-signal', { detail: payload }));
  }
}

// Local loopback listener for offline or single-browser testing
if (typeof window !== 'undefined') {
  window.addEventListener('ttm-local-webrtc-signal', ((e: CustomEvent<CallSignalPayload>) => {
    listeners.forEach((listener) => {
      try {
        listener(e.detail);
      } catch (err) {
        console.error('Local signaling listener error:', err);
      }
    });
  }) as EventListener);
}

/**
 * Creates a synthetic media stream for headless/testing environments
 * or when user declines camera/microphone permissions.
 */
export function createSyntheticStream(isVideo: boolean): MediaStream {
  const canvas = document.createElement('canvas');
  canvas.width = 640;
  canvas.height = 480;
  const ctx = canvas.getContext('2d');

  let animFrameId: number;
  let frame = 0;

  const draw = () => {
    if (!ctx) return;
    frame++;
    // Gradient animated background
    const grad = ctx.createLinearGradient(0, 0, 640, 480);
    grad.addColorStop(0, '#064e3b');
    grad.addColorStop(1, '#0f172a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 640, 480);

    // Glowing circle
    const radius = 60 + Math.sin(frame * 0.05) * 15;
    ctx.beginPath();
    ctx.arc(320, 220, radius, 0, Math.PI * 2);
    ctx.fillStyle = '#10b981';
    ctx.fill();

    // Text
    ctx.font = 'bold 20px monospace';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText('Encrypted WebRTC Stream', 320, 220);

    ctx.font = '14px monospace';
    ctx.fillStyle = '#6ee7b7';
    ctx.fillText(`STUN: stun.l.google.com:19302 [${frame}]`, 320, 320);

    animFrameId = requestAnimationFrame(draw);
  };
  draw();

  const stream = canvas.captureStream(25);

  // Add synthetic audio track using AudioContext oscillator
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      const audioCtx = new AudioContextClass();
      const osc = audioCtx.createOscillator();
      const dst = audioCtx.createMediaStreamDestination();
      const gain = audioCtx.createGain();
      gain.gain.value = 0.001; // nearly silent tone
      osc.connect(gain);
      gain.connect(dst);
      osc.start();
      dst.stream.getAudioTracks().forEach((track) => stream.addTrack(track));
    }
  } catch (e) {
    console.warn('Synthetic audio creation failed', e);
  }

  // Attach cleanup helper to stream
  (stream as unknown as { _cleanup?: () => void })._cleanup = () => {
    cancelAnimationFrame(animFrameId);
    stream.getTracks().forEach((t) => t.stop());
  };

  return stream;
}
