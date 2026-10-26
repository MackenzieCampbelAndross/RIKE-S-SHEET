-- Migration: Fix nested aggregate function error in get_friend_progress
-- Description: Replaces invalid nested aggregate call (jsonb_object_agg over count) with CTE-based aggregation

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

  -- Course progress & task counts (no nested aggregates)
  WITH courses AS (
    SELECT unnest(ARRAY['cpp-heavy', 'java-heavy', 'python']) AS course_id
  ),
  task_counts AS (
    SELECT course_id, count(*)::int AS completed_count
    FROM public.completed_tasks
    WHERE user_id = p_friend_id
    GROUP BY course_id
  ),
  course_stats AS (
    SELECT
      c.course_id,
      COALESCE(cp.current_day, 1) AS current_day,
      COALESCE(tc.completed_count, 0) AS completed_count
    FROM courses c
    LEFT JOIN public.course_progress cp ON cp.user_id = p_friend_id AND cp.course_id = c.course_id
    LEFT JOIN task_counts tc ON tc.course_id = c.course_id
  )
  SELECT COALESCE(
    jsonb_object_agg(
      course_id,
      jsonb_build_object(
        'current_day', current_day,
        'completed_count', completed_count
      )
    ),
    '{}'::jsonb
  ) INTO v_courses
  FROM course_stats;

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
$$ LANGUAGE plpgsql SECURITY DEFINER;
