-- Migration: Add RPC to lookup user email by username for dual email/username authentication
-- Timestamp: 2026-10-26

CREATE OR REPLACE FUNCTION public.get_email_by_username(p_username text)
RETURNS text AS $$
DECLARE
  v_clean text;
  v_email text;
BEGIN
  IF p_username IS NULL THEN RETURN NULL; END IF;
  -- Strip leading @ symbols if present, trim whitespace, and lowercase
  v_clean := lower(trim(regexp_replace(p_username, '^@+', '')));
  IF v_clean = '' THEN RETURN NULL; END IF;

  SELECT u.email INTO v_email
  FROM public.profiles p
  JOIN auth.users u ON u.id = p.id
  WHERE p.username_clean = v_clean
  LIMIT 1;

  RETURN v_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, auth;

GRANT EXECUTE ON FUNCTION public.get_email_by_username(text) TO anon, authenticated, service_role;
