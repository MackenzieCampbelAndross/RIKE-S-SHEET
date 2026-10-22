-- Migration: 20261023_weekly_elo_system.sql
-- RIKE'S SHEET: Authoritative Weekly ELO Rating System & Active Time Tracking

-- 1. Ensure pg_cron extension is enabled
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- 2. Extend completed_tasks table with verification & timing columns
ALTER TABLE public.completed_tasks
  ADD COLUMN IF NOT EXISTS is_verified boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS active_solving_seconds integer DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS expected_solving_seconds integer DEFAULT NULL;

CREATE INDEX IF NOT EXISTS idx_completed_tasks_user_time 
  ON public.completed_tasks(user_id, completed_at);

-- 3. Activity Sessions Table (Conservatively tracked authenticated sessions)
CREATE TABLE IF NOT EXISTS public.user_activity_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  session_token uuid NOT NULL,
  started_at timestamptz NOT NULL DEFAULT now(),
  last_heartbeat_at timestamptz NOT NULL DEFAULT now(),
  active_seconds integer NOT NULL DEFAULT 0,
  is_closed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_activity_sessions_user_token 
  ON public.user_activity_sessions(user_id, session_token);

-- 4. Daily Activity Aggregate Table (Aggregated by Asia/Kolkata date)
CREATE TABLE IF NOT EXISTS public.user_daily_activity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  activity_date date NOT NULL,
  active_seconds integer NOT NULL DEFAULT 0,
  last_heartbeat_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, activity_date)
);

CREATE INDEX IF NOT EXISTS idx_user_daily_activity_user_date 
  ON public.user_daily_activity(user_id, activity_date);

-- 5. Activity Heartbeat Logs Table (Granular audit log of verified active increments)
CREATE TABLE IF NOT EXISTS public.user_activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  session_id uuid REFERENCES public.user_activity_sessions(id) ON DELETE CASCADE,
  heartbeat_at timestamptz NOT NULL DEFAULT now(),
  awarded_seconds integer NOT NULL,
  activity_date date NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_user_activity_logs_user_hb 
  ON public.user_activity_logs(user_id, heartbeat_at);

-- 6. Weekly Rating Snapshots Table (Idempotent, auditable rating logs)
CREATE TABLE IF NOT EXISTS public.weekly_rating_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  period_start timestamptz NOT NULL,
  period_end timestamptz NOT NULL,
  rating_before integer NOT NULL,
  work_score numeric(6,4) NOT NULL,
  time_score numeric(6,4) NOT NULL,
  efficiency_score numeric(6,4) NOT NULL,
  consistency_score numeric(6,4) NOT NULL,
  performance_score numeric(6,4) NOT NULL,
  p_min_threshold numeric(6,4) NOT NULL,
  is_eligible boolean NOT NULL,
  ineligibility_reason text,
  rating_gain integer NOT NULL DEFAULT 0,
  rating_after integer NOT NULL,
  formula_version text NOT NULL DEFAULT '1.0.0-weekly',
  processed_at timestamptz NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'completed',
  UNIQUE (user_id, period_start, period_end)
);

CREATE INDEX IF NOT EXISTS idx_weekly_snapshots_user_period 
  ON public.weekly_rating_snapshots(user_id, period_end);

-- 7. Fix task completion RPC: Toggling task checkboxes MUST NOT award immediate rating points
CREATE OR REPLACE FUNCTION public.record_task_completion_rpc(
  p_course_id text,
  p_day_number integer,
  p_task_id text,
  p_difficulty text DEFAULT 'EASY',
  p_total_day_tasks integer DEFAULT 0,
  p_is_verified boolean DEFAULT false,
  p_active_solving_seconds integer DEFAULT NULL,
  p_expected_solving_seconds integer DEFAULT NULL
)
RETURNS jsonb AS $$
DECLARE
  v_user_id uuid;
  v_task_inserted boolean := false;
  v_current_rating integer;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  IF p_course_id NOT IN ('cpp-heavy', 'java-heavy', 'python') THEN
    RAISE EXCEPTION 'Invalid course';
  END IF;
  IF p_day_number < 1 OR p_day_number > 180 THEN
    RAISE EXCEPTION 'Invalid day';
  END IF;

  -- Record task completion.
  -- Idempotent: If already completed, nothing is changed.
  INSERT INTO public.completed_tasks (
    user_id, 
    course_id, 
    day_number, 
    task_id, 
    difficulty, 
    is_verified, 
    active_solving_seconds, 
    expected_solving_seconds, 
    completed_at
  )
  VALUES (
    v_user_id, 
    p_course_id, 
    p_day_number, 
    p_task_id, 
    COALESCE(p_difficulty, 'EASY'),
    COALESCE(p_is_verified, false),
    p_active_solving_seconds,
    p_expected_solving_seconds,
    now()
  )
  ON CONFLICT (user_id, course_id, task_id) DO UPDATE SET
    completed_at = now(),
    is_verified = EXCLUDED.is_verified,
    active_solving_seconds = COALESCE(EXCLUDED.active_solving_seconds, public.completed_tasks.active_solving_seconds),
    expected_solving_seconds = COALESCE(EXCLUDED.expected_solving_seconds, public.completed_tasks.expected_solving_seconds)
  RETURNING true INTO v_task_inserted;

  -- Authoritative rating is preserved and NEVER updated immediately upon clicking checkbox
  SELECT elo_rating INTO v_current_rating FROM public.profiles WHERE id = v_user_id;

  RETURN jsonb_build_object(
    'success', true,
    'taskInserted', COALESCE(v_task_inserted, false),
    'eloRating', v_current_rating
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Fix revoke task completion RPC: Unchecking must not deduct ratings (ratings never decrease)
CREATE OR REPLACE FUNCTION public.revoke_task_completion_rpc(
  p_course_id text,
  p_day_number integer,
  p_task_id text
)
RETURNS jsonb AS $$
DECLARE
  v_user_id uuid;
  v_current_rating integer;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  DELETE FROM public.completed_tasks
  WHERE user_id = v_user_id AND course_id = p_course_id AND task_id = p_task_id;

  SELECT elo_rating INTO v_current_rating FROM public.profiles WHERE id = v_user_id;

  RETURN jsonb_build_object(
    'success', true,
    'eloRating', v_current_rating
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. Active Heartbeat RPC: Anti-tamper, server-side validated active session logging
CREATE OR REPLACE FUNCTION public.record_activity_heartbeat_rpc(
  p_session_token uuid,
  p_active_delta_seconds integer DEFAULT 30
)
RETURNS jsonb AS $$
DECLARE
  v_user_id uuid;
  v_session_id uuid;
  v_last_hb timestamptz;
  v_elapsed_sec double precision;
  v_awarded_sec integer := 0;
  v_ist_date date;
  v_now timestamptz := now();
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  v_ist_date := (v_now AT TIME ZONE 'Asia/Kolkata')::date;

  -- Locate or create active session
  SELECT id, last_heartbeat_at INTO v_session_id, v_last_hb
  FROM public.user_activity_sessions
  WHERE user_id = v_user_id AND session_token = p_session_token AND is_closed = false
  LIMIT 1;

  IF v_session_id IS NULL THEN
    INSERT INTO public.user_activity_sessions (user_id, session_token, started_at, last_heartbeat_at, active_seconds)
    VALUES (v_user_id, p_session_token, v_now, v_now, 0)
    RETURNING id, last_heartbeat_at INTO v_session_id, v_last_hb;

    RETURN jsonb_build_object('success', true, 'awarded_seconds', 0);
  END IF;

  -- Validate elapsed time since last recorded heartbeat on server
  v_elapsed_sec := EXTRACT(EPOCH FROM (v_now - v_last_hb));

  -- 1. Anti-spam throttling (< 10 seconds)
  IF v_elapsed_sec < 10 THEN
    RETURN jsonb_build_object('success', true, 'awarded_seconds', 0, 'throttled', true);
  END IF;

  -- 2. Idle detection threshold (2 minutes / 120 seconds of server gap)
  -- If client was idle, tab backgrounded or computer asleep, do not award elapsed gap
  IF v_elapsed_sec > 120 THEN
    UPDATE public.user_activity_sessions
    SET last_heartbeat_at = v_now
    WHERE id = v_session_id;

    RETURN jsonb_build_object('success', true, 'awarded_seconds', 0, 'idle_reset', true);
  END IF;

  -- 3. Server-side validated active award: min of client claim, server elapsed, and 60 seconds
  v_awarded_sec := LEAST(COALESCE(p_active_delta_seconds, 30), floor(v_elapsed_sec)::int, 60);
  IF v_awarded_sec < 0 THEN
    v_awarded_sec := 0;
  END IF;

  IF v_awarded_sec > 0 THEN
    UPDATE public.user_activity_sessions
    SET active_seconds = active_seconds + v_awarded_sec,
        last_heartbeat_at = v_now
    WHERE id = v_session_id;

    INSERT INTO public.user_daily_activity (user_id, activity_date, active_seconds, last_heartbeat_at)
    VALUES (v_user_id, v_ist_date, v_awarded_sec, v_now)
    ON CONFLICT (user_id, activity_date)
    DO UPDATE SET
      active_seconds = public.user_daily_activity.active_seconds + EXCLUDED.active_seconds,
      last_heartbeat_at = EXCLUDED.last_heartbeat_at;

    INSERT INTO public.user_activity_logs (user_id, session_id, heartbeat_at, awarded_seconds, activity_date)
    VALUES (v_user_id, v_session_id, v_now, v_awarded_sec, v_ist_date);
  END IF;

  RETURN jsonb_build_object('success', true, 'awarded_seconds', v_awarded_sec);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. Helper function: Get the most recent closed Wednesday 00:00:00 IST boundary
CREATE OR REPLACE FUNCTION public.get_last_wednesday_boundary(p_ref_time timestamptz DEFAULT now())
RETURNS timestamptz AS $$
DECLARE
  v_ist_ts timestamp;
  v_dow integer;
  v_days_back integer;
  v_wed_ist timestamp;
BEGIN
  -- Convert to Asia/Kolkata
  v_ist_ts := p_ref_time AT TIME ZONE 'Asia/Kolkata';
  -- In Postgres: 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
  v_dow := EXTRACT(DOW FROM v_ist_ts)::integer;

  -- If today is Wednesday and time is >= 00:00:00, days_back is 0; otherwise distance to previous Wednesday
  v_days_back := (v_dow - 3 + 7) % 7;
  v_wed_ist := date_trunc('day', v_ist_ts) - (v_days_back * INTERVAL '1 day');

  RETURN (v_wed_ist AT TIME ZONE 'Asia/Kolkata');
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 11. Authoritative Weekly ELO Calculation Engine
CREATE OR REPLACE FUNCTION public.process_weekly_elo_ratings(
  p_target_period_end timestamptz DEFAULT NULL
)
RETURNS jsonb AS $$
DECLARE
  v_period_end timestamptz;
  v_period_start timestamptz;
  v_user_record RECORD;
  v_user_id uuid;
  v_current_rating integer;
  
  -- Component metrics
  v_distinct_tasks_count integer;
  v_verified_credits numeric;
  v_self_credits numeric;
  v_effective_self_credits numeric;
  v_total_work_credits numeric;
  v_work_score numeric;
  
  v_period_active_seconds integer;
  v_active_minutes numeric;
  v_time_score numeric;
  
  v_timed_count integer;
  v_weighted_eff_sum numeric;
  v_weight_sum numeric;
  v_efficiency_score numeric;
  
  v_productive_days integer;
  v_consistency_score numeric;
  
  v_performance_score numeric;
  v_D numeric;
  v_x numeric;
  v_p_min numeric;
  
  v_is_eligible boolean;
  v_ineligibility_reason text;
  v_raw_gain integer;
  v_gain integer;
  v_new_rating integer;
  
  v_processed_count integer := 0;
  v_gained_count integer := 0;
BEGIN
  -- Determine period boundary (defaults to most recent Wednesday 00:00 IST)
  IF p_target_period_end IS NOT NULL THEN
    v_period_end := p_target_period_end;
  ELSE
    v_period_end := public.get_last_wednesday_boundary(now());
  END IF;
  v_period_start := v_period_end - INTERVAL '7 days';

  -- Iterate through all users in profiles
  FOR v_user_record IN 
    SELECT p.id, COALESCE(p.elo_rating, 1000) AS elo_rating 
    FROM public.profiles p 
    ORDER BY p.created_at ASC
  LOOP
    v_user_id := v_user_record.id;
    v_current_rating := GREATEST(1000, LEAST(3000, v_user_record.elo_rating));

    -- Idempotency check: Skip if user already has an audit snapshot for this exact period
    IF EXISTS (
      SELECT 1 FROM public.weekly_rating_snapshots 
      WHERE user_id = v_user_id 
        AND period_start = v_period_start 
        AND period_end = v_period_end
    ) THEN
      CONTINUE;
    END IF;

    -- =========================================================
    -- COMPONENT A: Difficulty weighted work (40%)
    -- =========================================================
    -- Easy=1, Medium=2, Hard/Assessment=4
    -- Self-reported tasks capped at max 25% of 30 credits = 7.5 credits
    -- Each distinct task contributes at most once
    SELECT 
      COALESCE(count(DISTINCT task_id), 0),
      COALESCE(sum(CASE WHEN is_verified THEN credits ELSE 0 END), 0),
      COALESCE(sum(CASE WHEN NOT is_verified THEN credits ELSE 0 END), 0)
    INTO v_distinct_tasks_count, v_verified_credits, v_self_credits
    FROM (
      SELECT 
        task_id,
        bool_or(is_verified) as is_verified,
        MAX(CASE 
          WHEN difficulty IN ('HARD', 'ASSESSMENT') THEN 4
          WHEN difficulty = 'MEDIUM' THEN 2
          ELSE 1
        END) as credits
      FROM public.completed_tasks
      WHERE user_id = v_user_id
        AND completed_at >= v_period_start
        AND completed_at < v_period_end
      GROUP BY task_id
    ) task_summary;

    v_effective_self_credits := LEAST(v_self_credits, 7.5);
    v_total_work_credits := LEAST(30.0, v_verified_credits + v_effective_self_credits);
    v_work_score := LEAST(1.0, v_total_work_credits / 30.0);

    -- =========================================================
    -- COMPONENT B: Genuine active working time (25%)
    -- =========================================================
    -- Cap is 480 minutes (8 hours)
    SELECT COALESCE(sum(awarded_seconds), 0)
    INTO v_period_active_seconds
    FROM public.user_activity_logs
    WHERE user_id = v_user_id
      AND heartbeat_at >= v_period_start
      AND heartbeat_at < v_period_end;

    v_active_minutes := v_period_active_seconds / 60.0;
    v_time_score := LEAST(1.0, v_active_minutes / 480.0);

    -- =========================================================
    -- COMPONENT C: Solving efficiency (20%)
    -- =========================================================
    -- For eligible verified problems with actual & expected times:
    -- r = actual / expected
    -- e = clamp(1.2 - 0.2*r, 0.5, 1.1)
    -- E_task = (e - 0.5) / 0.6
    -- If too few eligible tasks, neutral value E = 0.5
    SELECT 
      COALESCE(count(*), 0),
      COALESCE(sum(
        (CASE difficulty 
          WHEN 'HARD' THEN 4 
          WHEN 'ASSESSMENT' THEN 4
          WHEN 'MEDIUM' THEN 2 
          ELSE 1 
        END) * (
          (GREATEST(0.5, LEAST(1.1, 1.2 - 0.2 * (active_solving_seconds::numeric / NULLIF(expected_solving_seconds, 0)))) - 0.5) / 0.6
        )
      ), 0),
      COALESCE(sum(CASE 
        WHEN difficulty IN ('HARD', 'ASSESSMENT') THEN 4 
        WHEN difficulty = 'MEDIUM' THEN 2 
        ELSE 1 
      END), 0)
    INTO v_timed_count, v_weighted_eff_sum, v_weight_sum
    FROM public.completed_tasks
    WHERE user_id = v_user_id
      AND completed_at >= v_period_start
      AND completed_at < v_period_end
      AND is_verified = true
      AND active_solving_seconds IS NOT NULL
      AND expected_solving_seconds IS NOT NULL
      AND expected_solving_seconds > 0;

    IF v_timed_count < 1 OR v_weight_sum = 0 THEN
      v_efficiency_score := 0.5;
    ELSE
      v_efficiency_score := GREATEST(0.0, LEAST(1.0, v_weighted_eff_sum / v_weight_sum));
    END IF;

    -- =========================================================
    -- COMPONENT D: Weekly consistency (15%)
    -- =========================================================
    -- Productive study day = on that Asia/Kolkata date:
    --   >= 15 active minutes (900s) AND >= 1 completed task
    -- Reaches 1.0 at 5 productive study days
    SELECT COALESCE(count(*), 0)
    INTO v_productive_days
    FROM (
      SELECT d.act_date
      FROM (
        SELECT activity_date as act_date, sum(awarded_seconds) as total_sec
        FROM public.user_activity_logs
        WHERE user_id = v_user_id
          AND heartbeat_at >= v_period_start
          AND heartbeat_at < v_period_end
        GROUP BY activity_date
        HAVING sum(awarded_seconds) >= 900
      ) d
      INNER JOIN (
        SELECT (completed_at AT TIME ZONE 'Asia/Kolkata')::date as task_date
        FROM public.completed_tasks
        WHERE user_id = v_user_id
          AND completed_at >= v_period_start
          AND completed_at < v_period_end
        GROUP BY (completed_at AT TIME ZONE 'Asia/Kolkata')::date
      ) t ON d.act_date = t.task_date
    ) p_days;

    v_consistency_score := LEAST(1.0, v_productive_days / 5.0);

    -- =========================================================
    -- Combined Performance Score P
    -- =========================================================
    v_performance_score := GREATEST(0.0, LEAST(1.0, 
      0.40 * v_work_score + 
      0.25 * v_time_score + 
      0.20 * v_efficiency_score + 
      0.15 * v_consistency_score
    ));

    -- =========================================================
    -- Progressively Harder Difficulty Multiplier & Threshold
    -- =========================================================
    -- D = ((3000 - R) / 2000) ^ 1.5
    -- x = (R - 1000) / 2000
    -- P_min = 0.15 + 0.84 * (x ^ 2)
    v_D := ((3000.0 - v_current_rating) / 2000.0) ^ 1.5;
    v_x := (v_current_rating - 1000.0) / 2000.0;
    v_p_min := 0.15 + 0.84 * (v_x ^ 2);

    -- Minimum Eligibility Requirements:
    -- 1. At least 60 eligible active minutes
    -- 2. At least 3 distinct eligible completion events
    -- 3. At least 2 productive study days
    IF v_active_minutes < 60.0 THEN
      v_is_eligible := false;
      v_ineligibility_reason := 'Active minutes (' || round(v_active_minutes, 1) || ') below minimum requirement (60 mins)';
      v_gain := 0;
    ELSIF v_distinct_tasks_count < 3 THEN
      v_is_eligible := false;
      v_ineligibility_reason := 'Distinct completed tasks (' || v_distinct_tasks_count || ') below minimum requirement (3 tasks)';
      v_gain := 0;
    ELSIF v_productive_days < 2 THEN
      v_is_eligible := false;
      v_ineligibility_reason := 'Productive study days (' || v_productive_days || ') below minimum requirement (2 days)';
      v_gain := 0;
    ELSIF v_performance_score < v_p_min THEN
      v_is_eligible := false;
      v_ineligibility_reason := 'Performance score (' || round(v_performance_score, 4) || ') below threshold (' || round(v_p_min, 4) || ')';
      v_gain := 0;
    ELSE
      v_is_eligible := true;
      v_ineligibility_reason := NULL;

      v_raw_gain := round(50.0 * v_performance_score * v_D);
      IF v_current_rating < 3000 THEN
        v_gain := LEAST(3000 - v_current_rating, GREATEST(1, v_raw_gain));
      ELSE
        v_gain := 0;
      END IF;
    END IF;

    -- Compute new rating (ratings never decrease and never exceed 3000)
    v_new_rating := LEAST(3000, v_current_rating + v_gain);

    -- Authoritative update if gained
    IF v_gain > 0 THEN
      UPDATE public.profiles
      SET elo_rating = v_new_rating, updated_at = now()
      WHERE id = v_user_id;

      INSERT INTO public.rating_ledger (user_id, event_key, points, reason)
      VALUES (
        v_user_id, 
        'weekly_elo:' || to_char(v_period_start, 'YYYYMMDD') || '_' || to_char(v_period_end, 'YYYYMMDD'),
        v_gain, 
        'Weekly ELO Gain (P=' || round(v_performance_score, 3) || ', Gain=+' || v_gain || ')'
      )
      ON CONFLICT (user_id, event_key) DO NOTHING;

      v_gained_count := v_gained_count + 1;
    END IF;

    -- Persist full snapshot for audibility and idempotency
    INSERT INTO public.weekly_rating_snapshots (
      user_id,
      period_start,
      period_end,
      rating_before,
      work_score,
      time_score,
      efficiency_score,
      consistency_score,
      performance_score,
      p_min_threshold,
      is_eligible,
      ineligibility_reason,
      rating_gain,
      rating_after,
      formula_version,
      processed_at,
      status
    ) VALUES (
      v_user_id,
      v_period_start,
      v_period_end,
      v_current_rating,
      round(v_work_score, 4),
      round(v_time_score, 4),
      round(v_efficiency_score, 4),
      round(v_consistency_score, 4),
      round(v_performance_score, 4),
      round(v_p_min, 4),
      v_is_eligible,
      v_ineligibility_reason,
      v_gain,
      v_new_rating,
      '1.0.0-weekly',
      now(),
      'completed'
    )
    ON CONFLICT (user_id, period_start, period_end) DO NOTHING;

    v_processed_count := v_processed_count + 1;
  END LOOP;

  RETURN jsonb_build_object(
    'success', true,
    'period_start', v_period_start,
    'period_end', v_period_end,
    'users_processed', v_processed_count,
    'users_gained', v_gained_count
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 12. Client Query RPC: Inspect current weekly status & progress
CREATE OR REPLACE FUNCTION public.get_weekly_status_rpc()
RETURNS jsonb AS $$
DECLARE
  v_user_id uuid;
  v_current_rating integer;
  v_period_start timestamptz;
  v_period_end timestamptz;
  v_active_seconds integer := 0;
  v_active_minutes numeric := 0;
  v_task_count integer := 0;
  v_productive_days integer := 0;
  v_x numeric;
  v_p_min numeric;
  v_last_snapshot jsonb;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT COALESCE(elo_rating, 1000) INTO v_current_rating FROM public.profiles WHERE id = v_user_id;
  v_current_rating := GREATEST(1000, LEAST(3000, v_current_rating));

  -- Current ongoing weekly window:
  -- Current period starts at most recent Wednesday 00:00 IST and ends at next Wednesday 00:00 IST
  v_period_start := public.get_last_wednesday_boundary(now());
  v_period_end := v_period_start + INTERVAL '7 days';

  -- Active seconds in current ongoing week
  SELECT COALESCE(sum(awarded_seconds), 0) INTO v_active_seconds
  FROM public.user_activity_logs
  WHERE user_id = v_user_id AND heartbeat_at >= v_period_start AND heartbeat_at < v_period_end;
  v_active_minutes := round(v_active_seconds / 60.0, 1);

  -- Distinct tasks completed in current ongoing week
  SELECT count(DISTINCT task_id) INTO v_task_count
  FROM public.completed_tasks
  WHERE user_id = v_user_id AND completed_at >= v_period_start AND completed_at < v_period_end;

  -- Productive study days in current ongoing week
  SELECT count(*) INTO v_productive_days
  FROM (
    SELECT d.act_date
    FROM (
      SELECT activity_date as act_date, sum(awarded_seconds) as total_sec
      FROM public.user_activity_logs
      WHERE user_id = v_user_id AND heartbeat_at >= v_period_start AND heartbeat_at < v_period_end
      GROUP BY activity_date
      HAVING sum(awarded_seconds) >= 900
    ) d
    INNER JOIN (
      SELECT (completed_at AT TIME ZONE 'Asia/Kolkata')::date as task_date
      FROM public.completed_tasks
      WHERE user_id = v_user_id AND completed_at >= v_period_start AND completed_at < v_period_end
      GROUP BY (completed_at AT TIME ZONE 'Asia/Kolkata')::date
    ) t ON d.act_date = t.task_date
  ) p_days;

  v_x := (v_current_rating - 1000.0) / 2000.0;
  v_p_min := round(0.15 + 0.84 * (v_x ^ 2), 4);

  -- Last calculated snapshot
  SELECT to_jsonb(s) INTO v_last_snapshot
  FROM (
    SELECT 
      period_start, period_end, rating_before, rating_gain, rating_after,
      work_score, time_score, efficiency_score, consistency_score, performance_score,
      p_min_threshold, is_eligible, ineligibility_reason, processed_at
    FROM public.weekly_rating_snapshots
    WHERE user_id = v_user_id
    ORDER BY period_end DESC
    LIMIT 1
  ) s;

  RETURN jsonb_build_object(
    'current_rating', v_current_rating,
    'period_start', v_period_start,
    'period_end', v_period_end,
    'active_minutes', v_active_minutes,
    'completed_tasks_count', v_task_count,
    'productive_days', v_productive_days,
    'p_min_threshold', v_p_min,
    'last_snapshot', v_last_snapshot
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 13. Row Level Security Policies
ALTER TABLE public.user_activity_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_daily_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_rating_snapshots ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS users_view_own_activity_sessions ON public.user_activity_sessions;
CREATE POLICY users_view_own_activity_sessions
  ON public.user_activity_sessions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS users_view_own_daily_activity ON public.user_daily_activity;
CREATE POLICY users_view_own_daily_activity
  ON public.user_daily_activity FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS users_view_own_activity_logs ON public.user_activity_logs;
CREATE POLICY users_view_own_activity_logs
  ON public.user_activity_logs FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS users_view_own_weekly_snapshots ON public.weekly_rating_snapshots;
CREATE POLICY users_view_own_weekly_snapshots
  ON public.weekly_rating_snapshots FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- 14. Sequential Recovery Engine for Missed Weekly Periods
CREATE OR REPLACE FUNCTION public.recover_missed_weekly_elo_ratings()
RETURNS jsonb AS $$
DECLARE
  v_earliest_period_start timestamptz;
  v_current_wednesday timestamptz;
  v_cursor_end timestamptz;
  v_recovered_periods integer := 0;
  v_res jsonb;
BEGIN
  v_current_wednesday := public.get_last_wednesday_boundary(now());

  SELECT MIN(earliest_time) INTO v_earliest_period_start
  FROM (
    SELECT MIN(completed_at) AS earliest_time FROM public.completed_tasks
    UNION ALL
    SELECT MIN(heartbeat_at) AS earliest_time FROM public.user_activity_logs
    UNION ALL
    SELECT MIN(created_at) AS earliest_time FROM public.profiles
  ) t;

  IF v_earliest_period_start IS NULL THEN
    RETURN public.process_weekly_elo_ratings(v_current_wednesday);
  END IF;

  v_cursor_end := public.get_last_wednesday_boundary(v_earliest_period_start) + INTERVAL '7 days';

  WHILE v_cursor_end <= v_current_wednesday LOOP
    v_res := public.process_weekly_elo_ratings(v_cursor_end);
    v_recovered_periods := v_recovered_periods + 1;
    v_cursor_end := v_cursor_end + INTERVAL '7 days';
  END LOOP;

  RETURN jsonb_build_object(
    'success', true,
    'recovered_periods', v_recovered_periods,
    'last_period_end', v_current_wednesday
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 15. Register pg_cron schedule
-- Runs Tuesday at 18:30 UTC = Wednesday at 00:00 (12:00 AM) IST
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'weekly-elo-calculation') THEN
    PERFORM cron.unschedule('weekly-elo-calculation');
  END IF;
  PERFORM cron.schedule('weekly-elo-calculation', '30 18 * * 2', 'SELECT public.process_weekly_elo_ratings();');
END $$;

