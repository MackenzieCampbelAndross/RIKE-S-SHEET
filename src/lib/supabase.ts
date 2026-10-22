import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || 'https://ircqebbpasebdbwdegim.supabase.co';
const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlyY3FlYmJwYXNlYmRid2RlZ2ltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI2ODQyNjQsImV4cCI6MjEwODI2MDI2NH0.vr_uaj090ZdWySgmIE51YZP5mbsx6gHpL9HuObEMQjI';

export const REMEMBER_ME_KEY = 'rike_remember_me';

export function getRememberMe(): boolean {
  if (typeof window === 'undefined') return true;
  const val = localStorage.getItem(REMEMBER_ME_KEY);
  // Default to true unless explicitly unchecked by the user
  return val !== 'false';
}

export function setRememberMe(remember: boolean): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(REMEMBER_ME_KEY, remember ? 'true' : 'false');
}

/**
 * Storage adapter that routes session tokens to localStorage when remember=true,
 * or sessionStorage when remember=false.
 * This guarantees sessions survive browser restart ONLY if Remember Me is active.
 */
const dynamicStorageAdapter = {
  getItem: (key: string): string | null => {
    if (typeof window === 'undefined') return null;
    const remember = getRememberMe();
    if (remember) {
      return localStorage.getItem(key);
    }
    return sessionStorage.getItem(key);
  },
  setItem: (key: string, value: string): void => {
    if (typeof window === 'undefined') return;
    const remember = getRememberMe();
    if (remember) {
      localStorage.setItem(key, value);
      sessionStorage.removeItem(key);
    } else {
      sessionStorage.setItem(key, value);
      localStorage.removeItem(key);
    }
  },
  removeItem: (key: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  },
};

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: dynamicStorageAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

export interface UserProfileData {
  id: string;
  username: string;
  username_clean: string;
  display_name: string;
  avatar_id: string;
  elo_rating: number;
  created_at: string;
  updated_at: string;
}

export interface ConnectionRecord {
  id: string;
  sender_id: string;
  receiver_id: string;
  status: 'pending' | 'accepted' | 'declined' | 'blocked';
  created_at: string;
  updated_at: string;
}

export interface FriendProgressData {
  profile: {
    id: string;
    username: string;
    display_name: string;
    avatar_id: string;
    elo_rating: number;
  };
  courses: {
    [courseId: string]: {
      current_day: number;
      completed_count: number;
    };
  };
  attendance: string[];
  streaks: {
    current_streak: number;
    longest_streak: number;
  };
}
