-- RLS Tests: Include wrongful_death_forms and wrongful_termination_forms
-- Validates firm-wide SELECT/UPDATE, no DELETE
BEGIN;

-- Choose three existing auth users
WITH users AS (
  SELECT id, row_number() OVER () rn FROM auth.users LIMIT 3
)
SELECT CASE WHEN COUNT(*) < 3 THEN (RAISE NOTICE 'Need at least 3 users in auth.users'; 0) ELSE 1 END FROM users;

-- Setup firms (idempotent)
INSERT INTO public.firms (id, name, domain) VALUES 
  ('wf111111-1111-1111-1111-111111111111', 'WF Firm 1', 'wfirm1.com')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.firms (id, name, domain) VALUES 
  ('wf222222-2222-2222-2222-222222222222', 'WF Firm 2', 'wfirm2.com')
ON CONFLICT (id) DO NOTHING;

-- Upsert profiles
INSERT INTO public.user_profiles (id, user_id, firm_id, role)
VALUES (gen_random_uuid(), (SELECT id FROM users WHERE rn=1), 'wf111111-1111-1111-1111-111111111111', 'user')
ON CONFLICT (user_id) DO UPDATE SET firm_id=EXCLUDED.firm_id, role=EXCLUDED.role;
INSERT INTO public.user_profiles (id, user_id, firm_id, role)
VALUES (gen_random_uuid(), (SELECT id FROM users WHERE rn=2), 'wf111111-1111-1111-1111-111111111111', 'firm_admin')
ON CONFLICT (user_id) DO UPDATE SET firm_id=EXCLUDED.firm_id, role=EXCLUDED.role;
INSERT INTO public.user_profiles (id, user_id, firm_id, role)
VALUES (gen_random_uuid(), (SELECT id FROM users WHERE rn=3), 'wf222222-2222-2222-2222-222222222222', 'user')
ON CONFLICT (user_id) DO UPDATE SET firm_id=EXCLUDED.firm_id, role=EXCLUDED.role;

-- Seed forms
INSERT INTO public.wrongful_death_forms (id, form_data, submitted_by, firm_id) VALUES
  ('wd111111-1111-1111-1111-111111111111', '{"wd":1}', (SELECT id FROM users WHERE rn=1), 'wf111111-1111-1111-1111-111111111111')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.wrongful_death_forms (id, form_data, submitted_by, firm_id) VALUES
  ('wd222222-2222-2222-2222-222222222222', '{"wd":2}', (SELECT id FROM users WHERE rn=3), 'wf222222-2222-2222-2222-222222222222')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.wrongful_termination_forms (id, form_data, submitted_by, firm_id) VALUES
  ('wt111111-1111-1111-1111-111111111111', '{"wt":1}', (SELECT id FROM users WHERE rn=1), 'wf111111-1111-1111-1111-111111111111')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.wrongful_termination_forms (id, form_data, submitted_by, firm_id) VALUES
  ('wt222222-2222-2222-2222-222222222222', '{"wt":2}', (SELECT id FROM users WHERE rn=3), 'wf222222-2222-2222-2222-222222222222')
ON CONFLICT (id) DO NOTHING;

-- Act as user in Firm 1
SELECT set_config('request.jwt.claims', json_build_object('sub',(SELECT id FROM users WHERE rn=1))::text, true);

-- SELECT visibility limited to firm
SELECT 'User F1 sees only F1 wrongful_death_forms' AS test_name;
SELECT count(*) AS cnt FROM public.wrongful_death_forms; -- Expect: 1

SELECT 'User F1 sees only F1 wrongful_termination_forms' AS test_name;
SELECT count(*) AS cnt FROM public.wrongful_termination_forms; -- Expect: 1

-- UPDATE allowed within firm
UPDATE public.wrongful_death_forms SET form_data = '{"wd":"updated"}' WHERE id = 'wd111111-1111-1111-1111-111111111111' RETURNING id; -- succeeds
UPDATE public.wrongful_termination_forms SET form_data = '{"wt":"updated"}' WHERE id = 'wt111111-1111-1111-1111-111111111111' RETURNING id; -- succeeds

-- DELETE forbidden
DO $$
DECLARE v_err1 TEXT;
BEGIN
  BEGIN
    DELETE FROM public.wrongful_death_forms WHERE id = 'wd111111-1111-1111-1111-111111111111';
  EXCEPTION WHEN insufficient_privilege THEN
    v_err1 := 'ok';
  END;
  IF v_err1 IS NULL THEN
    RAISE EXCEPTION 'Expected DELETE forbidden for wrongful_death_forms';
  END IF;
END $$;

DO $$
DECLARE v_err2 TEXT;
BEGIN
  BEGIN
    DELETE FROM public.wrongful_termination_forms WHERE id = 'wt111111-1111-1111-1111-111111111111';
  EXCEPTION WHEN insufficient_privilege THEN
    v_err2 := 'ok';
  END;
  IF v_err2 IS NULL THEN
    RAISE EXCEPTION 'Expected DELETE forbidden for wrongful_termination_forms';
  END IF;
END $$;

-- Cross-firm isolation
SELECT 'No access to Firm 2 rows' AS test_name;
SELECT count(*) AS cnt FROM public.wrongful_death_forms WHERE id = 'wd222222-2222-2222-2222-222222222222'; -- Expect: 0
SELECT count(*) AS cnt FROM public.wrongful_termination_forms WHERE id = 'wt222222-2222-2222-2222-222222222222'; -- Expect: 0

-- Cleanup
SELECT set_config('request.jwt.claims', NULL, true);
BEGIN;
  DELETE FROM public.wrongful_termination_forms WHERE id IN ('wt111111-1111-1111-1111-111111111111','wt222222-2222-2222-2222-222222222222');
  DELETE FROM public.wrongful_death_forms WHERE id IN ('wd111111-1111-1111-1111-111111111111','wd222222-2222-2222-2222-222222222222');
  -- Keep user_profiles and firms for reuse
COMMIT;

ROLLBACK;

