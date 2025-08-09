-- RLS Test: Require firm association for non-site_admin users
-- Run inside a transaction for isolation
BEGIN;

-- Fetch two existing auth users to satisfy FK on user_profiles.user_id
WITH users AS (
  SELECT id, row_number() OVER () rn
  FROM auth.users
  LIMIT 2
)
SELECT
  CASE WHEN COUNT(*) < 2 THEN
    (RAISE NOTICE 'Need at least 2 users in auth.users to run this test'; 0)
  ELSE 1 END
FROM users;

-- Setup: create a temporary firm (idempotent)
INSERT INTO public.firms (id, name, domain)
VALUES ('10000000-0000-0000-0000-000000000001', 'Temp Firm', 'tempfirm.com')
ON CONFLICT (id) DO NOTHING;

-- 1) Non-site_admin without firm_id should FAIL
DO $$
DECLARE v_error TEXT;
DECLARE u1 UUID;
BEGIN
  SELECT id INTO u1 FROM auth.users LIMIT 1;
  BEGIN
    INSERT INTO public.user_profiles (id, user_id, firm_id, role, first_name, last_name)
    VALUES (
      gen_random_uuid(),
      u1,
      NULL,
      'user',
      'NoFirm',
      'User'
    );
  EXCEPTION WHEN check_violation THEN
    v_error := 'ok';
  END;
  IF v_error IS NULL THEN
    RAISE EXCEPTION 'Expected CHECK violation for non-site_admin without firm_id';
  END IF;
END $$;

-- 2) site_admin without firm_id should PASS (per current rule)
DO $$
DECLARE u2 UUID;
BEGIN
  SELECT id INTO u2 FROM auth.users OFFSET 1 LIMIT 1;
  INSERT INTO public.user_profiles (id, user_id, firm_id, role, first_name, last_name)
  VALUES (
    gen_random_uuid(),
    u2,
    NULL,
    'site_admin',
    'Site',
    'Admin'
  )
  ON CONFLICT (user_id) DO UPDATE SET role = EXCLUDED.role;
END $$;

-- 3) Non-site_admin with firm_id should PASS
DO $$
DECLARE u3 UUID;
BEGIN
  SELECT id INTO u3 FROM auth.users LIMIT 1;
  INSERT INTO public.user_profiles (id, user_id, firm_id, role, first_name, last_name)
  VALUES (
    gen_random_uuid(),
    u3,
    '10000000-0000-0000-0000-000000000001',
    'user',
    'HasFirm',
    'User'
  )
  ON CONFLICT (user_id) DO UPDATE SET firm_id = EXCLUDED.firm_id, role = EXCLUDED.role;
END $$;

ROLLBACK;
