import { useEffect, useRef } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

const HEARTBEAT_INTERVAL_MS = 30 * 1000; // 30 seconds
const IDLE_THRESHOLD_MS = 120 * 1000;    // 2 minutes (120 seconds)

/**
 * useActiveTracker
 *
 * Implements conservative, authenticated session-based active time tracking:
 * - Sends periodic heartbeats (every 30s) to Supabase RPC record_activity_heartbeat_rpc.
 * - Enforces document visibility checks (pauses when browser tab is hidden).
 * - Tracks recent user interactions (mouse, key, scroll, touch).
 * - Automatically pauses when idle for > 2 minutes.
 * - Server validates actual elapsed time and enforces a 60s max award per heartbeat.
 */
export function useActiveTracker(user: User | null) {
  const sessionTokenRef = useRef<string | null>(null);
  const lastInteractionTimeRef = useRef<number>(Date.now());
  const heartbeatTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Initialize or reset session token when user logs in/out
  useEffect(() => {
    if (user) {
      if (!sessionTokenRef.current) {
        sessionTokenRef.current = crypto.randomUUID();
      }
    } else {
      sessionTokenRef.current = null;
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;

    // 1. User Interaction Listeners to monitor genuine activity
    const recordUserActivity = () => {
      lastInteractionTimeRef.current = Date.now();
    };

    const activityEvents = ['mousemove', 'keydown', 'scroll', 'click', 'touchstart', 'pointerdown'];
    for (const ev of activityEvents) {
      window.addEventListener(ev, recordUserActivity, { passive: true });
    }

    // 2. Heartbeat sender function
    const sendHeartbeat = async () => {
      if (!user || !sessionTokenRef.current) return;

      // Check if document is hidden (background tab)
      if (typeof document !== 'undefined' && document.visibilityState === 'hidden') {
        return;
      }

      // Check if user has been idle for longer than 2 minutes
      const now = Date.now();
      const timeSinceLastInteraction = now - lastInteractionTimeRef.current;
      if (timeSinceLastInteraction > IDLE_THRESHOLD_MS) {
        return;
      }

      try {
        await supabase.rpc('record_activity_heartbeat_rpc', {
          p_session_token: sessionTokenRef.current,
          p_active_delta_seconds: 30,
        });
      } catch (err) {
        // Silently catch network or temporary abort errors so UX is never interrupted
        console.debug('Heartbeat sync deferred:', err);
      }
    };

    // Initial heartbeat on mount
    sendHeartbeat();

    // 3. Periodic timer
    heartbeatTimerRef.current = setInterval(sendHeartbeat, HEARTBEAT_INTERVAL_MS);

    // 4. Handle visibility changes: send heartbeat immediately when tab becomes visible if active
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        lastInteractionTimeRef.current = Date.now();
        sendHeartbeat();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (heartbeatTimerRef.current) {
        clearInterval(heartbeatTimerRef.current);
      }
      for (const ev of activityEvents) {
        window.removeEventListener(ev, recordUserActivity);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [user]);
}
