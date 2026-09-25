import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Environment variables or custom user overrides from localStorage
const storedUrl = typeof window !== 'undefined' ? localStorage.getItem('ttm_custom_supabase_url') : null;
const storedAnonKey = typeof window !== 'undefined' ? localStorage.getItem('ttm_custom_supabase_anon_key') : null;

const envUrl = import.meta.env.VITE_SUPABASE_URL;
const envAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabaseUrl: string = storedUrl || envUrl || '';
export const supabaseAnonKey: string = storedAnonKey || envAnonKey || '';

export const isConfiguredUrl = (url: string | undefined): boolean => {
  if (!url) return false;
  if (url.includes('your-project-ref') || url.includes('placeholder')) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

export const isConfiguredKey = (key: string | undefined): boolean => {
  if (!key) return false;
  if (key.includes('your-anon-key') || key.length < 20) return false;
  return true;
};

export const isSupabaseConfigured = Boolean(
  isConfiguredUrl(supabaseUrl) && isConfiguredKey(supabaseAnonKey)
);

// Fallback dummy URL to prevent createClient crashes if config is absent
const safeUrl = isSupabaseConfigured ? supabaseUrl : 'https://placeholder-project.supabase.co';
const safeKey = isSupabaseConfigured ? supabaseAnonKey : 'placeholder-anon-key-0123456789abcdef0123456789';

export const supabase: SupabaseClient = createClient(safeUrl, safeKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

export const saveCustomSupabaseConfig = (url: string, anonKey: string) => {
  try {
    localStorage.setItem('ttm_custom_supabase_url', url.trim());
    localStorage.setItem('ttm_custom_supabase_anon_key', anonKey.trim());
    window.location.reload();
  } catch (err) {
    console.error('Failed to save Supabase config in localStorage', err);
  }
};

export const clearCustomSupabaseConfig = () => {
  try {
    localStorage.removeItem('ttm_custom_supabase_url');
    localStorage.removeItem('ttm_custom_supabase_anon_key');
    window.location.reload();
  } catch (err) {
    console.error('Failed to clear Supabase config', err);
  }
};

/**
 * Upload a media attachment (voice, image, file) to Supabase Storage
 */
export async function uploadAttachment(
  file: File | Blob,
  folder: 'voices' | 'images' | 'documents' = 'images',
  customFileName?: string
): Promise<{ publicUrl: string | null; error: Error | null }> {
  if (!isSupabaseConfigured) {
    // If Supabase is not configured, create a local Object URL for immediate preview
    const localUrl = URL.createObjectURL(file);
    return { publicUrl: localUrl, error: null };
  }

  try {
    const ext = file instanceof File ? file.name.split('.').pop() || 'bin' : folder === 'voices' ? 'webm' : 'bin';
    const fileName = customFileName || `${folder}/${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${ext}`;

    const { data, error: uploadError } = await supabase.storage
      .from('chat-attachments')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      console.warn('Storage upload error (fallback to local URL):', uploadError);
      // Fallback to local object URL so user experience is not disrupted
      return { publicUrl: URL.createObjectURL(file), error: new Error(uploadError.message) };
    }

    const { data: urlData } = supabase.storage
      .from('chat-attachments')
      .getPublicUrl(data.path);

    return { publicUrl: urlData.publicUrl, error: null };
  } catch (err) {
    console.error('Failed to upload attachment:', err);
    return { publicUrl: URL.createObjectURL(file), error: err as Error };
  }
}

/**
 * SQL Blueprint schema to set up Supabase tables, storage buckets, and realtime
 */
export const SUPABASE_SETUP_SQL = `-- 1. Create the 'messages' table
CREATE TABLE IF NOT EXISTS public.messages (
  id TEXT PRIMARY KEY,
  conversation_id TEXT NOT NULL,
  sender_id TEXT NOT NULL,
  sender_name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'text',
  content TEXT,
  voice_duration TEXT,
  voice_waveform JSONB,
  image_url TEXT,
  file_url TEXT,
  file_name TEXT,
  file_size BIGINT,
  timestamp TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'delivered',
  encrypted BOOLEAN DEFAULT true,
  expires_in TEXT,
  alert_type TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row Level Security (RLS) and permit public read/write
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public access to messages" ON public.messages;
CREATE POLICY "Public access to messages" ON public.messages FOR ALL USING (true) WITH CHECK (true);

-- 3. Enable Supabase Realtime broadcast for 'messages' table
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- 4. Create public storage bucket 'chat-attachments' for voice notes and images
INSERT INTO storage.buckets (id, name, public)
VALUES ('chat-attachments', 'chat-attachments', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public access to chat-attachments" ON storage.objects;
CREATE POLICY "Public access to chat-attachments" ON storage.objects
FOR ALL USING (bucket_id = 'chat-attachments') WITH CHECK (bucket_id = 'chat-attachments');
`;
