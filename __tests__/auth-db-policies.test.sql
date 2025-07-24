-- Database Policy Tests
-- Run these SQL statements to test Row Level Security policies

-- Test setup: Create test users and data
BEGIN;

-- Create test firms
INSERT INTO public.firms (id, name, domain) VALUES 
  ('11111111-1111-1111-1111-111111111111', 'Test Firm 1', 'testfirm1.com'),
  ('22222222-2222-2222-2222-222222222222', 'Test Firm 2', 'testfirm2.com');

-- Create test user profiles (simulating different roles)
INSERT INTO public.user_profiles (id, user_id, firm_id, role, first_name, last_name) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-2222-3333-4444-555555555555', NULL, 'site_admin', 'Site', 'Admin'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-3333-4444-5555-666666666666', '11111111-1111-1111-1111-111111111111', 'firm_admin', 'Firm', 'Admin1'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '33333333-4444-5555-6666-777777777777', '22222222-2222-2222-2222-222222222222', 'firm_admin', 'Firm', 'Admin2'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', '44444444-5555-6666-7777-888888888888', '11111111-1111-1111-1111-111111111111', 'user', 'User', 'One'),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '55555555-6666-7777-8888-999999999999', '22222222-2222-2222-2222-222222222222', 'user', 'User', 'Two');

-- Create test forms
INSERT INTO public.personal_injury_forms (id, form_data, submitted_by, firm_id) VALUES
  ('aaaaaaaa-1111-1111-1111-111111111111', '{"contact": {"name": "Form by User 1"}}', '44444444-5555-6666-7777-888888888888', '11111111-1111-1111-1111-111111111111'),
  ('bbbbbbbb-2222-2222-2222-222222222222', '{"contact": {"name": "Form by User 2"}}', '55555555-6666-7777-8888-999999999999', '22222222-2222-2222-2222-222222222222');

COMMIT;

-- Test 1: Site Admin Access
-- Should see all firms
SET role authenticated;
SET request.jwt.claims.sub TO '11111111-2222-3333-4444-555555555555';

SELECT 'Test 1a: Site admin can see all firms' as test_name;
SELECT count(*) as firm_count FROM public.firms;
-- Expected: 2

SELECT 'Test 1b: Site admin can see all user profiles' as test_name;
SELECT count(*) as profile_count FROM public.user_profiles;
-- Expected: 5

SELECT 'Test 1c: Site admin can see all forms' as test_name;
SELECT count(*) as form_count FROM public.personal_injury_forms;
-- Expected: 2

-- Test 2: Firm Admin Access (Firm 1)
SET request.jwt.claims.sub TO '22222222-3333-4444-5555-666666666666';

SELECT 'Test 2a: Firm admin 1 can see only their firm' as test_name;
SELECT count(*) as firm_count FROM public.firms;
-- Expected: 1

SELECT 'Test 2b: Firm admin 1 can see users from their firm' as test_name;
SELECT count(*) as profile_count FROM public.user_profiles WHERE firm_id = '11111111-1111-1111-1111-111111111111';
-- Expected: 2 (firm admin + user from firm 1)

SELECT 'Test 2c: Firm admin 1 can see forms from their firm' as test_name;
SELECT count(*) as form_count FROM public.personal_injury_forms WHERE firm_id = '11111111-1111-1111-1111-111111111111';
-- Expected: 1

-- Test 3: Firm Admin Access (Firm 2)
SET request.jwt.claims.sub TO '33333333-4444-5555-6666-777777777777';

SELECT 'Test 3a: Firm admin 2 can see only their firm' as test_name;
SELECT count(*) as firm_count FROM public.firms;
-- Expected: 1

SELECT 'Test 3b: Firm admin 2 can see users from their firm' as test_name;
SELECT count(*) as profile_count FROM public.user_profiles WHERE firm_id = '22222222-2222-2222-2222-222222222222';
-- Expected: 2 (firm admin + user from firm 2)

-- Test 4: Regular User Access (User 1)
SET request.jwt.claims.sub TO '44444444-5555-6666-7777-888888888888';

SELECT 'Test 4a: User 1 can see their own profile' as test_name;
SELECT count(*) as profile_count FROM public.user_profiles WHERE user_id = '44444444-5555-6666-7777-888888888888';
-- Expected: 1

SELECT 'Test 4b: User 1 can see forms from their firm' as test_name;
SELECT count(*) as form_count FROM public.personal_injury_forms WHERE firm_id = '11111111-1111-1111-1111-111111111111';
-- Expected: 1

SELECT 'Test 4c: User 1 cannot see other firm forms' as test_name;
SELECT count(*) as form_count FROM public.personal_injury_forms WHERE firm_id = '22222222-2222-2222-2222-222222222222';
-- Expected: 0

-- Test 5: Regular User Access (User 2)
SET request.jwt.claims.sub TO '55555555-6666-7777-8888-999999999999';

SELECT 'Test 5a: User 2 can see their own profile' as test_name;
SELECT count(*) as profile_count FROM public.user_profiles WHERE user_id = '55555555-6666-7777-8888-999999999999';
-- Expected: 1

SELECT 'Test 5b: User 2 can see forms from their firm' as test_name;
SELECT count(*) as form_count FROM public.personal_injury_forms WHERE firm_id = '22222222-2222-2222-2222-222222222222';
-- Expected: 1

SELECT 'Test 5c: User 2 cannot see other firm forms' as test_name;
SELECT count(*) as form_count FROM public.personal_injury_forms WHERE firm_id = '11111111-1111-1111-1111-111111111111';
-- Expected: 0

-- Test 6: Cross-firm data isolation
SET request.jwt.claims.sub TO '44444444-5555-6666-7777-888888888888';

SELECT 'Test 6a: User 1 cannot see User 2 profile' as test_name;
SELECT count(*) as profile_count FROM public.user_profiles WHERE user_id = '55555555-6666-7777-8888-999999999999';
-- Expected: 0

SELECT 'Test 6b: User 1 cannot see Firm 2 data' as test_name;
SELECT count(*) as firm_count FROM public.firms WHERE domain = 'testfirm2.com';
-- Expected: 0

-- Test 7: Anonymous user access (should fail)
RESET role;
RESET request.jwt.claims.sub;

SELECT 'Test 7a: Anonymous cannot access firms' as test_name;
-- This should throw an error due to RLS
SELECT count(*) as firm_count FROM public.firms;

SELECT 'Test 7b: Anonymous cannot access profiles' as test_name;
-- This should throw an error due to RLS
SELECT count(*) as profile_count FROM public.user_profiles;

-- Cleanup
BEGIN;
DELETE FROM public.personal_injury_forms WHERE id IN ('aaaaaaaa-1111-1111-1111-111111111111', 'bbbbbbbb-2222-2222-2222-222222222222');
DELETE FROM public.user_profiles WHERE id IN ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee');
DELETE FROM public.firms WHERE id IN ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222');
COMMIT;

-- Expected Results Summary:
-- Test 1: Site admin sees all data (2 firms, 5 profiles, 2 forms)
-- Test 2: Firm admin 1 sees only firm 1 data (1 firm, 2 profiles, 1 form)
-- Test 3: Firm admin 2 sees only firm 2 data (1 firm, 2 profiles, 1 form)
-- Test 4: User 1 sees own profile and firm 1 data (1 profile, 1 form from firm 1, 0 from firm 2)
-- Test 5: User 2 sees own profile and firm 2 data (1 profile, 1 form from firm 2, 0 from firm 1)
-- Test 6: Cross-firm isolation verified (User 1 cannot see User 2 or Firm 2)
-- Test 7: Anonymous access denied (errors expected)