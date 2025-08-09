-- RLS Tests: Firm-wide VIEW and UPDATE on forms/drafts; no DELETE
-- Uses simulated JWT via request.jwt.claims (no SET role required)
BEGIN;

-- Choose three existing auth users (u1, u2 in Firm 1; u3 in Firm 2)
WITH users AS (
  SELECT id, row_number() OVER () rn FROM auth.users LIMIT 3
)
SELECT CASE WHEN COUNT(*) < 3 THEN (RAISE NOTICE 'Need at least 3 users in auth.users'; 0) ELSE 1 END FROM users;

-- Setup firms
INSERT INTO public.firms (id, name, domain) VALUES 
  ('f1111111-1111-1111-1111-111111111111', 'Firm 1', 'firm1.com')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.firms (id, name, domain) VALUES 
  ('f2222222-2222-2222-2222-222222222222', 'Firm 2', 'firm2.com')
ON CONFLICT (id) DO NOTHING;

-- Upsert user profiles using selected auth users
INSERT INTO public.user_profiles (id, user_id, firm_id, role)
VALUES
  (gen_random_uuid(), (SELECT id FROM users WHERE rn=1), 'f1111111-1111-1111-1111-111111111111', 'user')
ON CONFLICT (user_id) DO UPDATE SET firm_id=EXCLUDED.firm_id, role=EXCLUDED.role;

INSERT INTO public.user_profiles (id, user_id, firm_id, role)
VALUES
  (gen_random_uuid(), (SELECT id FROM users WHERE rn=2), 'f1111111-1111-1111-1111-111111111111', 'firm_admin')
ON CONFLICT (user_id) DO UPDATE SET firm_id=EXCLUDED.firm_id, role=EXCLUDED.role;

INSERT INTO public.user_profiles (id, user_id, firm_id, role)
VALUES
  (gen_random_uuid(), (SELECT id FROM users WHERE rn=3), 'f2222222-2222-2222-2222-222222222222', 'user')
ON CONFLICT (user_id) DO UPDATE SET firm_id=EXCLUDED.firm_id, role=EXCLUDED.role;

-- Create forms and drafts in both firms (idempotent)
INSERT INTO public.personal_injury_forms (id, form_data, submitted_by, firm_id) VALUES
  ('form1111-1111-1111-1111-111111111111', '{"a":1}', (SELECT id FROM users WHERE rn=1), 'f1111111-1111-1111-1111-111111111111')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.personal_injury_forms (id, form_data, submitted_by, firm_id) VALUES
  ('form2222-2222-2222-2222-222222222222', '{"b":2}', (SELECT id FROM users WHERE rn=3), 'f2222222-2222-2222-2222-222222222222')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.personal_injury_drafts (id, form_data, submitted_by, firm_id) VALUES
  ('draft111-1111-1111-1111-111111111111', '{"d":1}', (SELECT id FROM users WHERE rn=1), 'f1111111-1111-1111-1111-111111111111')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.personal_injury_drafts (id, form_data, submitted_by, firm_id) VALUES
  ('draft222-2222-2222-2222-222222222222', '{"d":2}', (SELECT id FROM users WHERE rn=3), 'f2222222-2222-2222-2222-222222222222')
ON CONFLICT (id) DO NOTHING;

-- 1) Regular user in Firm 1 can VIEW Firm 1 forms and drafts
SELECT set_config('request.jwt.claims', json_build_object('sub',(SELECT id FROM users WHERE rn=1))::text, true);

SELECT 'User F1 sees only Firm 1 forms' AS test_name;
SELECT count(*) AS cnt FROM public.personal_injury_forms;
-- Expect: 1

SELECT 'User F1 sees only Firm 1 drafts' AS test_name;
SELECT count(*) AS cnt FROM public.personal_injury_drafts;
-- Expect: 1

-- 2) Regular user in Firm 1 can UPDATE Firm 1 form
UPDATE public.personal_injury_forms
SET form_data = '{"updated":true}'
WHERE id = 'form1111-1111-1111-1111-111111111111'
RETURNING id; -- should succeed

-- 3) Regular user cannot DELETE forms
DO $$
DECLARE v_err TEXT;
BEGIN
  BEGIN
    DELETE FROM public.personal_injury_forms WHERE id = 'form1111-1111-1111-1111-111111111111';
  EXCEPTION WHEN insufficient_privilege THEN
    v_err := 'ok';
  END;
  IF v_err IS NULL THEN
    RAISE EXCEPTION 'Expected DELETE to be forbidden for regular user';
  END IF;
END $$;

-- 4) Cross-firm isolation: user from Firm 1 cannot see Firm 2 objects
SELECT 'User F1 cannot see F2 forms' AS test_name;
SELECT count(*) AS cnt FROM public.personal_injury_forms WHERE id = 'form2222-2222-2222-2222-222222222222';
-- Expect: 0

-- 5) Firm admin in Firm 1 can UPDATE Firm 1 forms
SELECT set_config('request.jwt.claims', json_build_object('sub',(SELECT id FROM users WHERE rn=2))::text, true);
UPDATE public.personal_injury_forms
SET form_data = '{"adminUpdated":true}'
WHERE id = 'form1111-1111-1111-1111-111111111111'
RETURNING id; -- should succeed

-- 6) Firm admin cannot DELETE forms (still forbidden)
DO $$
DECLARE v_err2 TEXT;
BEGIN
  BEGIN
    DELETE FROM public.personal_injury_forms WHERE id = 'form1111-1111-1111-1111-111111111111';
  EXCEPTION WHEN insufficient_privilege THEN
    v_err2 := 'ok';
  END;
  IF v_err2 IS NULL THEN
    RAISE EXCEPTION 'Expected DELETE to be forbidden for firm_admin as well';
  END IF;
END $$;

-- Cleanup
SELECT set_config('request.jwt.claims', NULL, true);
BEGIN;
  DELETE FROM public.personal_injury_drafts WHERE id IN ('draft111-1111-1111-1111-111111111111','draft222-2222-2222-2222-222222222222');
  DELETE FROM public.personal_injury_forms WHERE id IN ('form1111-1111-1111-1111-111111111111','form2222-2222-2222-2222-222222222222');
  -- Keep user_profiles and firms for possible reuse across tests
COMMIT;

ROLLBACK;
