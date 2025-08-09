-- RLS Test: firm_admin can UPDATE all fields of their firm's profile
BEGIN;

-- Select two existing auth users
WITH users AS (
  SELECT id, row_number() OVER () rn FROM auth.users LIMIT 2
)
SELECT CASE WHEN COUNT(*) < 2 THEN (RAISE NOTICE 'Need at least 2 users in auth.users'; 0) ELSE 1 END FROM users;

-- Setup firm (idempotent)
INSERT INTO public.firms (id, name, domain)
VALUES ('faaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Alpha Firm', 'alphafirm.com')
ON CONFLICT (id) DO NOTHING;

-- Upsert profiles: rn=1 as firm_admin, rn=2 as user
INSERT INTO public.user_profiles (id, user_id, firm_id, role)
VALUES
  (gen_random_uuid(), (SELECT id FROM users WHERE rn=1), 'faaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'firm_admin')
ON CONFLICT (user_id) DO UPDATE SET firm_id=EXCLUDED.firm_id, role=EXCLUDED.role;

INSERT INTO public.user_profiles (id, user_id, firm_id, role)
VALUES
  (gen_random_uuid(), (SELECT id FROM users WHERE rn=2), 'faaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'user')
ON CONFLICT (user_id) DO UPDATE SET firm_id=EXCLUDED.firm_id, role=EXCLUDED.role;

-- As firm_admin, update firm
SELECT set_config('request.jwt.claims', json_build_object('sub',(SELECT id FROM users WHERE rn=1))::text, true);

UPDATE public.firms
SET name = 'Alpha Firm Updated', domain = 'alphafirm.com'
WHERE id = 'faaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
RETURNING id, name;
-- Expect: succeeds, name updated

-- As regular user, attempt the same update and expect failure
SELECT set_config('request.jwt.claims', json_build_object('sub',(SELECT id FROM users WHERE rn=2))::text, true);

DO $$
DECLARE v_err TEXT;
BEGIN
  BEGIN
    UPDATE public.firms
    SET name = 'User Should Not Update'
    WHERE id = 'faaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
  EXCEPTION WHEN insufficient_privilege THEN
    v_err := 'ok';
  END;
  IF v_err IS NULL THEN
    RAISE EXCEPTION 'Expected UPDATE to be forbidden for regular user';
  END IF;
END $$;

-- Cleanup JWT claim
SELECT set_config('request.jwt.claims', NULL, true);

-- Optional cleanup of created data
-- Keeping profiles and firm may help other tests; comment out if needed
-- BEGIN;
--   DELETE FROM public.user_profiles WHERE user_id IN ((SELECT id FROM users WHERE rn=1),(SELECT id FROM users WHERE rn=2));
--   DELETE FROM public.firms WHERE id = 'faaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
-- COMMIT;

ROLLBACK;
