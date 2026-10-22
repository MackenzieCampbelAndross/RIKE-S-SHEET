-- Migration: Initialize RIKE'S SHEET multi-user schema
-- Supabase Project: ircqebbpasebdbwdegim
-- Timestamp: 2026-10-23

-- 1. Profiles Table with normalized unique username
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text NOT NULL,
  username_clean text NOT NULL GENERATED ALWAYS AS (lower(trim(username))) STORED,
  display_name text,
  avatar_id text NOT NULL DEFAULT 'geometric-mountain',
  elo_rating integer NOT NULL DEFAULT 1000 CHECK (elo_rating >= 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT valid_username_format CHECK (
    char_length(username) >= 3 AND
    char_length(username) <= 30 AND
    username ~ '^[a-zA-Z0-9][a-zA-Z0-9_]*[a-zA-Z0-9]$'
  )
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_username_clean ON public.profiles (username_clean);
CREATE INDEX IF NOT EXISTS idx_profiles_elo ON public.profiles (elo_rating DESC);

-- 2. Trigger for auto-profile creation upon auth.users signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  raw_username text;
  clean_username text;
  resolved_username text;
BEGIN
  raw_username := NEW.raw_user_meta_data->>'username';
  IF raw_username IS NULL OR trim(raw_username) = '' THEN
    clean_username := 'user_' || substr(NEW.id::text, 1, 8);
  ELSE
    clean_username := lower(trim(raw_username));
  END IF;

  IF EXISTS (SELECT 1 FROM public.profiles WHERE username_clean = clean_username) THEN
    resolved_username := clean_username || '_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 4);
  ELSE
    resolved_username := clean_username;
  END IF;

  INSERT INTO public.profiles (id, username, display_name, avatar_id, elo_rating)
  VALUES (
    NEW.id,
    resolved_username,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'name', resolved_username),
    COALESCE(NEW.raw_user_meta_data->>'avatar_id', 'geometric-mountain'),
    1000
  )
  ON CONFLICT (id) DO UPDATE SET
    username = EXCLUDED.username,
    display_name = EXCLUDED.display_name,
    avatar_id = EXCLUDED.avatar_id,
    updated_at = now();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Course Progress Table
CREATE TABLE IF NOT EXISTS public.course_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id text NOT NULL CHECK (course_id IN ('cpp-heavy', 'java-heavy', 'python')),
  current_day integer NOT NULL DEFAULT 1 CHECK (current_day >= 1 AND current_day <= 180),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, course_id)
);
CREATE INDEX IF NOT EXISTS idx_course_progress_user ON public.course_progress(user_id);

-- 4. Completed Tasks Table
CREATE TABLE IF NOT EXISTS public.completed_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id text NOT NULL CHECK (course_id IN ('cpp-heavy', 'java-heavy', 'python')),
  day_number integer NOT NULL CHECK (day_number >= 1 AND day_number <= 180),
  task_id text NOT NULL,
  difficulty text NOT NULL DEFAULT 'EASY' CHECK (difficulty IN ('EASY', 'MEDIUM', 'HARD', 'ASSESSMENT')),
  completed_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, course_id, task_id)
);
CREATE INDEX IF NOT EXISTS idx_completed_tasks_user_course ON public.completed_tasks(user_id, course_id);
CREATE INDEX IF NOT EXISTS idx_completed_tasks_user_day ON public.completed_tasks(user_id, course_id, day_number);

-- 5. Attendance Records Table
CREATE TABLE IF NOT EXISTS public.attendance_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  attended_date date NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, attended_date)
);
CREATE INDEX IF NOT EXISTS idx_attendance_user ON public.attendance_records(user_id, attended_date DESC);

-- 6. User Streaks Table
CREATE TABLE IF NOT EXISTS public.user_streaks (
  user_id uuid PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  current_streak integer NOT NULL DEFAULT 0,
  longest_streak integer NOT NULL DEFAULT 0,
  last_attended_date date,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 7. Connections Table (Friends & Requests)
CREATE TABLE IF NOT EXISTS public.connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  receiver_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status text NOT NULL CHECK (status IN ('pending', 'accepted', 'declined')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT sender_not_receiver CHECK (sender_id <> receiver_id)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_connections_pair ON public.connections (
  LEAST(sender_id, receiver_id),
  GREATEST(sender_id, receiver_id)
);
CREATE INDEX IF NOT EXISTS idx_connections_receiver ON public.connections(receiver_id, status);
CREATE INDEX IF NOT EXISTS idx_connections_sender ON public.connections(sender_id, status);

-- 8. Rating Ledger Table (Authoritative ELO event logs)
CREATE TABLE IF NOT EXISTS public.rating_ledger (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  event_key text NOT NULL,
  points integer NOT NULL,
  reason text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, event_key)
);
CREATE INDEX IF NOT EXISTS idx_rating_ledger_user ON public.rating_ledger(user_id);

-- 9. Helper Function: are_users_connected
CREATE OR REPLACE FUNCTION public.are_users_connected(user_a uuid, user_b uuid)
RETURNS boolean AS $$
BEGIN
  IF user_a IS NULL OR user_b IS NULL OR user_a = user_b THEN
    RETURN false;
  END IF;

  RETURN EXISTS (
    SELECT 1 FROM public.connections
    WHERE status = 'accepted'
      AND ((sender_id = user_a AND receiver_id = user_b)
        OR (sender_id = user_b AND receiver_id = user_a))
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 10. Check username availability RPC
CREATE OR REPLACE FUNCTION public.check_username_available(p_username text)
RETURNS boolean AS $$
DECLARE
  v_clean text;
BEGIN
  IF p_username IS NULL THEN RETURN false; END IF;
  v_clean := lower(trim(p_username));
  IF char_length(v_clean) < 3 OR char_length(v_clean) > 30 THEN RETURN false; END IF;
  IF NOT (v_clean ~ '^[a-z0-9][a-z0-9_]*[a-z0-9]$') THEN RETURN false; END IF;

  RETURN NOT EXISTS (SELECT 1 FROM public.profiles WHERE username_clean = v_clean);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 11. Search Users for Connections RPC
CREATE OR REPLACE FUNCTION public.search_users_for_connections(p_query text, p_limit integer DEFAULT 20)
RETURNS TABLE (
  id uuid,
  username text,
  display_name text,
  avatar_id text,
  elo_rating integer,
  connection_status text,
  connection_id uuid,
  is_sender boolean
) AS $$
DECLARE
  v_current_user uuid;
  v_search text;
BEGIN
  v_current_user := auth.uid();
  IF v_current_user IS NULL THEN RETURN; END IF;
  IF p_query IS NULL OR trim(p_query) = '' THEN RETURN; END IF;
  v_search := lower(trim(p_query));

  RETURN QUERY
  SELECT
    p.id,
    p.username,
    p.display_name,
    p.avatar_id,
    p.elo_rating,
    c.status AS connection_status,
    c.id AS connection_id,
    CASE WHEN c.sender_id = v_current_user THEN true ELSE false END AS is_sender
  FROM public.profiles p
  LEFT JOIN public.connections c ON
    (c.sender_id = v_current_user AND c.receiver_id = p.id) OR
    (c.receiver_id = v_current_user AND c.sender_id = p.id)
  WHERE p.id <> v_current_user
    AND p.username_clean LIKE '%' || v_search || '%'
  ORDER BY
    CASE WHEN p.username_clean = v_search THEN 0
         WHEN p.username_clean LIKE v_search || '%' THEN 1
         ELSE 2 END,
    p.elo_rating DESC
  LIMIT LEAST(p_limit, 50);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 12. Authoritative Task Completion & Rating RPC
CREATE OR REPLACE FUNCTION public.record_task_completion_rpc(
  p_course_id text,
  p_day_number integer,
  p_task_id text,
  p_difficulty text,
  p_total_day_tasks integer
)
RETURNS jsonb AS $$
DECLARE
  v_user_id uuid;
  v_task_points integer;
  v_day_bonus_points integer := 5;
  v_task_event_key text;
  v_day_bonus_event_key text;
  v_day_completed_count integer;
  v_task_inserted boolean := false;
  v_bonus_awarded boolean := false;
  v_new_rating integer;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Validate inputs
  IF p_course_id NOT IN ('cpp-heavy', 'java-heavy', 'python') THEN
    RAISE EXCEPTION 'Invalid course';
  END IF;
  IF p_day_number < 1 OR p_day_number > 180 THEN
    RAISE EXCEPTION 'Invalid day';
  END IF;

  -- Point determination
  IF p_difficulty = 'HARD' THEN
    v_task_points := 7;
  ELSIF p_difficulty = 'MEDIUM' THEN
    v_task_points := 4;
  ELSIF p_difficulty = 'ASSESSMENT' THEN
    v_task_points := 15;
  ELSE
    v_task_points := 2; -- EASY
  END IF;

  -- Insert task completion (idempotent)
  INSERT INTO public.completed_tasks (user_id, course_id, day_number, task_id, difficulty)
  VALUES (v_user_id, p_course_id, p_day_number, p_task_id, p_difficulty)
  ON CONFLICT (user_id, course_id, task_id) DO NOTHING
  RETURNING true INTO v_task_inserted;

  -- If newly completed, record rating ledger entry
  v_task_event_key := 'task:' || p_course_id || ':' || p_task_id;
  IF v_task_inserted THEN
    INSERT INTO public.rating_ledger (user_id, event_key, points, reason)
    VALUES (v_user_id, v_task_event_key, v_task_points, 'Completed ' || p_difficulty || ' task: ' || p_task_id)
    ON CONFLICT (user_id, event_key) DO NOTHING;

    -- Update profile rating
    UPDATE public.profiles
    SET elo_rating = elo_rating + v_task_points, updated_at = now()
    WHERE id = v_user_id;
  END IF;

  -- Check if all day tasks are now complete
  SELECT count(*) INTO v_day_completed_count
  FROM public.completed_tasks
  WHERE user_id = v_user_id AND course_id = p_course_id AND day_number = p_day_number;

  IF p_total_day_tasks > 0 AND v_day_completed_count >= p_total_day_tasks THEN
    v_day_bonus_event_key := 'day_bonus:' || p_course_id || ':' || p_day_number::text;
    INSERT INTO public.rating_ledger (user_id, event_key, points, reason)
    VALUES (v_user_id, v_day_bonus_event_key, v_day_bonus_points, 'All tasks cleared for Day ' || p_day_number)
    ON CONFLICT (user_id, event_key) DO NOTHING
    RETURNING true INTO v_bonus_awarded;

    IF v_bonus_awarded THEN
      UPDATE public.profiles
      SET elo_rating = elo_rating + v_day_bonus_points, updated_at = now()
      WHERE id = v_user_id;
    END IF;
  END IF;

  SELECT elo_rating INTO v_new_rating FROM public.profiles WHERE id = v_user_id;

  RETURN jsonb_build_object(
    'success', true,
    'taskInserted', v_task_inserted,
    'bonusAwarded', v_bonus_awarded,
    'eloRating', v_new_rating
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 13. Authoritative Revoke Task Completion & Rating RPC
CREATE OR REPLACE FUNCTION public.revoke_task_completion_rpc(
  p_course_id text,
  p_day_number integer,
  p_task_id text
)
RETURNS jsonb AS $$
DECLARE
  v_user_id uuid;
  v_task_event_key text;
  v_day_bonus_event_key text;
  v_task_points integer := 0;
  v_bonus_points integer := 0;
  v_total_deducted integer := 0;
  v_new_rating integer;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;

  -- Delete from completed tasks
  DELETE FROM public.completed_tasks
  WHERE user_id = v_user_id AND course_id = p_course_id AND task_id = p_task_id;

  -- Check and revoke task points from ledger
  v_task_event_key := 'task:' || p_course_id || ':' || p_task_id;
  SELECT points INTO v_task_points
  FROM public.rating_ledger
  WHERE user_id = v_user_id AND event_key = v_task_event_key;

  IF v_task_points IS NOT NULL AND v_task_points > 0 THEN
    DELETE FROM public.rating_ledger WHERE user_id = v_user_id AND event_key = v_task_event_key;
    v_total_deducted := v_total_deducted + v_task_points;
  END IF;

  -- Since day is now incomplete, revoke day completion bonus if previously awarded
  v_day_bonus_event_key := 'day_bonus:' || p_course_id || ':' || p_day_number::text;
  SELECT points INTO v_bonus_points
  FROM public.rating_ledger
  WHERE user_id = v_user_id AND event_key = v_day_bonus_event_key;

  IF v_bonus_points IS NOT NULL AND v_bonus_points > 0 THEN
    DELETE FROM public.rating_ledger WHERE user_id = v_user_id AND event_key = v_day_bonus_event_key;
    v_total_deducted := v_total_deducted + v_bonus_points;
  END IF;

  IF v_total_deducted > 0 THEN
    UPDATE public.profiles
    SET elo_rating = GREATEST(1000, elo_rating - v_total_deducted), updated_at = now()
    WHERE id = v_user_id;
  END IF;

  SELECT elo_rating INTO v_new_rating FROM public.profiles WHERE id = v_user_id;

  RETURN jsonb_build_object(
    'success', true,
    'deductedPoints', v_total_deducted,
    'eloRating', v_new_rating
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 14. Get Friend Permitted Progress RPC
CREATE OR REPLACE FUNCTION public.get_friend_progress(p_friend_id uuid)
RETURNS jsonb AS $$
DECLARE
  v_current_user uuid;
  v_profile jsonb;
  v_courses jsonb;
  v_attendance jsonb;
  v_streaks jsonb;
BEGIN
  v_current_user := auth.uid();
  IF v_current_user IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;

  -- Ensure friendship exists or viewing self
  IF v_current_user <> p_friend_id AND NOT public.are_users_connected(v_current_user, p_friend_id) THEN
    RAISE EXCEPTION 'Access denied. You must be accepted connections to view progress.';
  END IF;

  -- Profile details
  SELECT jsonb_build_object(
    'id', p.id,
    'username', p.username,
    'display_name', p.display_name,
    'avatar_id', p.avatar_id,
    'elo_rating', p.elo_rating
  ) INTO v_profile
  FROM public.profiles p WHERE p.id = p_friend_id;

  -- Course progress & task counts
  SELECT jsonb_object_agg(
    c.course_id,
    jsonb_build_object(
      'current_day', COALESCE(cp.current_day, 1),
      'completed_count', count(ct.task_id)
    )
  ) INTO v_courses
  FROM (VALUES ('cpp-heavy'), ('java-heavy'), ('python')) AS c(course_id)
  LEFT JOIN public.course_progress cp ON cp.user_id = p_friend_id AND cp.course_id = c.course_id
  LEFT JOIN public.completed_tasks ct ON ct.user_id = p_friend_id AND ct.course_id = c.course_id
  GROUP BY p_friend_id;

  -- Attended dates
  SELECT COALESCE(jsonb_agg(attended_date::text ORDER BY attended_date), '[]'::jsonb) INTO v_attendance
  FROM public.attendance_records
  WHERE user_id = p_friend_id;

  -- Streaks
  SELECT jsonb_build_object(
    'current_streak', COALESCE(current_streak, 0),
    'longest_streak', COALESCE(longest_streak, 0)
  ) INTO v_streaks
  FROM public.user_streaks
  WHERE user_id = p_friend_id;

  RETURN jsonb_build_object(
    'profile', v_profile,
    'courses', COALESCE(v_courses, '{}'::jsonb),
    'attendance', v_attendance,
    'streaks', COALESCE(v_streaks, jsonb_build_object('current_streak', 0, 'longest_streak', 0))
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 15. Enable Row Level Security on ALL tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.completed_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rating_ledger ENABLE ROW LEVEL SECURITY;

-- 16. Define RLS Policies

-- Profiles Policies
DROP POLICY IF EXISTS "Public profiles are viewable by authenticated users" ON public.profiles;
CREATE POLICY "Public profiles are viewable by authenticated users"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Course Progress Policies
DROP POLICY IF EXISTS "Users view own or friend course progress" ON public.course_progress;
CREATE POLICY "Users view own or friend course progress"
  ON public.course_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR public.are_users_connected(auth.uid(), user_id));

DROP POLICY IF EXISTS "Users manage own course progress" ON public.course_progress;
CREATE POLICY "Users manage own course progress"
  ON public.course_progress FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Completed Tasks Policies
DROP POLICY IF EXISTS "Users view own or friend completed tasks" ON public.completed_tasks;
CREATE POLICY "Users view own or friend completed tasks"
  ON public.completed_tasks FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR public.are_users_connected(auth.uid(), user_id));

DROP POLICY IF EXISTS "Users manage own completed tasks" ON public.completed_tasks;
CREATE POLICY "Users manage own completed tasks"
  ON public.completed_tasks FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Attendance Records Policies
DROP POLICY IF EXISTS "Users view own or friend attendance" ON public.attendance_records;
CREATE POLICY "Users view own or friend attendance"
  ON public.attendance_records FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR public.are_users_connected(auth.uid(), user_id));

DROP POLICY IF EXISTS "Users manage own attendance" ON public.attendance_records;
CREATE POLICY "Users manage own attendance"
  ON public.attendance_records FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- User Streaks Policies
DROP POLICY IF EXISTS "Users view own or friend streaks" ON public.user_streaks;
CREATE POLICY "Users view own or friend streaks"
  ON public.user_streaks FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR public.are_users_connected(auth.uid(), user_id));

DROP POLICY IF EXISTS "Users manage own streaks" ON public.user_streaks;
CREATE POLICY "Users manage own streaks"
  ON public.user_streaks FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Connections Policies
DROP POLICY IF EXISTS "Users view own connections" ON public.connections;
CREATE POLICY "Users view own connections"
  ON public.connections FOR SELECT
  TO authenticated
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

DROP POLICY IF EXISTS "Users send connection requests" ON public.connections;
CREATE POLICY "Users send connection requests"
  ON public.connections FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = sender_id AND sender_id <> receiver_id AND status = 'pending');

DROP POLICY IF EXISTS "Users update own or incoming connection requests" ON public.connections;
CREATE POLICY "Users update own or incoming connection requests"
  ON public.connections FOR UPDATE
  TO authenticated
  USING (auth.uid() = receiver_id OR auth.uid() = sender_id)
  WITH CHECK (auth.uid() = receiver_id OR auth.uid() = sender_id);

DROP POLICY IF EXISTS "Users delete connection requests or friendships" ON public.connections;
CREATE POLICY "Users delete connection requests or friendships"
  ON public.connections FOR DELETE
  TO authenticated
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- Rating Ledger Policies
DROP POLICY IF EXISTS "Users view own rating ledger" ON public.rating_ledger;
CREATE POLICY "Users view own rating ledger"
  ON public.rating_ledger FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- NOTE: No INSERT/UPDATE/DELETE policy on rating_ledger for authenticated users.
-- Direct modifications are denied. Only SECURITY DEFINER functions can write to rating_ledger.
