import { useEffect, useState, useCallback } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import {
  supabase,
  setRememberMe,
  getRememberMe,
  type UserProfileData,
} from '../lib/supabase';

export interface AuthState {
  user: User | null;
  profile: UserProfileData | null;
  session: Session | null;
  loading: boolean;
  rememberMe: boolean;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [rememberMe, setRememberMeState] = useState<boolean>(getRememberMe());

  // Fetch or ensure profile for an authenticated user
  const fetchProfile = useCallback(async (userId: string, userMeta?: Record<string, any>) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      if (data) {
        setProfile(data as UserProfileData);
        return data as UserProfileData;
      }

      // If no profile found (e.g. legacy user or trigger delay), initialize one safely
      const rawUsername = userMeta?.username || `user_${userId.slice(0, 8)}`;
      const fallbackProfile = {
        id: userId,
        username: rawUsername,
        username_clean: rawUsername.toLowerCase().trim(),
        display_name: userMeta?.display_name || rawUsername,
        avatar_id: userMeta?.avatar_id || 'lion',
        elo_rating: 1000,
      };

      const { data: created, error: createError } = await supabase
        .from('profiles')
        .upsert(fallbackProfile, { onConflict: 'id' })
        .select()
        .single();

      if (!createError && created) {
        setProfile(created as UserProfileData);
        return created as UserProfileData;
      }

      return null;
    } catch (err) {
      console.error('Failed to resolve profile:', err);
      return null;
    }
  }, []);

  // Initialize and listen to auth state changes
  useEffect(() => {
    let mounted = true;

    async function initSession() {
      try {
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        if (!mounted) return;

        if (error) {
          console.error('Session restoration error:', error);
        }

        if (initialSession?.user) {
          setSession(initialSession);
          setUser(initialSession.user);
          await fetchProfile(initialSession.user.id, initialSession.user.user_metadata);
        } else {
          setSession(null);
          setUser(null);
          setProfile(null);
        }
      } catch (err) {
        console.error('Failed to init session:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    initSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      if (!mounted) return;
      setSession(newSession);
      setUser(newSession?.user || null);

      if (newSession?.user) {
        await fetchProfile(newSession.user.id, newSession.user.user_metadata);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const checkUsernameAvailable = async (rawUsername: string): Promise<boolean> => {
    const clean = rawUsername.toLowerCase().trim();
    if (clean.length < 3 || clean.length > 30) return false;
    if (!/^[a-z0-9][a-z0-9_]*[a-z0-9]$/.test(clean)) return false;

    const { data, error } = await supabase.rpc('check_username_available', {
      p_username: clean,
    });

    if (error) {
      console.error('Username check error:', error);
      // Fallback direct check
      const { data: existing } = await supabase
        .from('profiles')
        .select('id')
        .eq('username_clean', clean)
        .maybeSingle();
      return !existing;
    }

    return Boolean(data);
  };

  const login = async (email: string, password: string, remember: boolean) => {
    setRememberMe(remember);
    setRememberMeState(remember);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      throw error;
    }

    if (data.user) {
      setUser(data.user);
      setSession(data.session);
      await fetchProfile(data.user.id, data.user.user_metadata);
    }

    return data;
  };

  const signUp = async (
    email: string,
    password: string,
    username: string,
    remember: boolean
  ) => {
    const trimmedUsername = username.trim();
    const cleanUsername = trimmedUsername.toLowerCase();

    // Check availability first
    const isAvail = await checkUsernameAvailable(cleanUsername);
    if (!isAvail) {
      throw new Error(`Username "${trimmedUsername}" is already taken or invalid.`);
    }

    setRememberMe(remember);
    setRememberMeState(remember);

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          username: trimmedUsername,
          display_name: trimmedUsername,
          avatar_id: 'lion',
        },
      },
    });

    if (error) {
      throw error;
    }

    if (data.user) {
      setUser(data.user);
      setSession(data.session);
      await fetchProfile(data.user.id, { username: trimmedUsername });
    }

    return data;
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      setSession(null);
      setProfile(null);
    }
  };

  const refreshProfile = async () => {
    if (!user) return;
    await fetchProfile(user.id);
  };

  const updateProfile = async (fields: {
    display_name?: string;
    avatar_id?: string;
    username?: string;
  }) => {
    if (!user) throw new Error('Not authenticated');

    const updates: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (fields.display_name !== undefined) {
      updates.display_name = fields.display_name.trim();
    }
    if (fields.avatar_id !== undefined) {
      updates.avatar_id = fields.avatar_id;
    }
    if (fields.username !== undefined) {
      const clean = fields.username.toLowerCase().trim();
      const isAvail = await checkUsernameAvailable(clean);
      if (!isAvail && clean !== profile?.username_clean) {
        throw new Error(`Username "${fields.username}" is unavailable.`);
      }
      updates.username = fields.username.trim();
      updates.username_clean = clean;
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw error;
    if (data) {
      setProfile(data as UserProfileData);
    }
    return data;
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: window.location.origin,
    });
    if (error) throw error;
  };

  const deleteAccount = async () => {
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase.rpc('delete_user_account_rpc');
    if (error) throw error;

    if (typeof window !== 'undefined') {
      localStorage.removeItem('placementOS_multi_v1');
      localStorage.removeItem('placementOS_v1');
      localStorage.removeItem('ad2_attendance_v2');
      localStorage.removeItem('ad2_attendance_v1');
      localStorage.removeItem('ad2_profile_v2');
      localStorage.removeItem('ad2_profile_v1');
      localStorage.removeItem('rike_remember_me');
    }

    try {
      await supabase.auth.signOut();
    } catch {
      // Ignored if session is already dropped
    }

    setUser(null);
    setSession(null);
    setProfile(null);
  };

  return {
    user,
    profile,
    session,
    loading,
    rememberMe,
    login,
    signUp,
    logout,
    deleteAccount,
    refreshProfile,
    updateProfile,
    checkUsernameAvailable,
    resetPassword,
  };
}
