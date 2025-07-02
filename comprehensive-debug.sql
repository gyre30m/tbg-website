-- Comprehensive debugging for profile issues
-- Run each section one by one in your Supabase dashboard

-- 1. Check if RLS is causing issues by temporarily disabling it
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'user_profiles';

-- 2. Check auth.uid() function - this is what RLS policies use
SELECT auth.uid() as current_auth_uid;

-- 3. Check what auth.users contains
SELECT id, email, created_at, email_confirmed_at 
FROM auth.users 
WHERE email = 'bradley@the-bradley-group.com';

-- 4. Check what user_profiles contains (without RLS)
-- This bypasses RLS to see raw data
SET row_security = off;
SELECT * FROM public.user_profiles;
SET row_security = on;

-- 5. Check RLS policies on user_profiles
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE schemaname = 'public' AND tablename = 'user_profiles';

-- 6. Test the RLS policy manually
SELECT 
    up.*,
    au.email,
    (up.user_id = auth.uid()) as user_id_matches_auth_uid
FROM public.user_profiles up
JOIN auth.users au ON up.user_id = au.id
WHERE au.email = 'bradley@the-bradley-group.com';

-- 7. If nothing shows up, create profile with RLS disabled
-- ONLY RUN THIS IF STEPS 1-6 SHOW THE ISSUE

-- Step 7a: Temporarily disable RLS
-- ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;

-- Step 7b: Delete any existing profiles for this user
-- DELETE FROM public.user_profiles 
-- WHERE user_id = (SELECT id FROM auth.users WHERE email = 'bradley@the-bradley-group.com');

-- Step 7c: Create the correct profile
-- INSERT INTO public.user_profiles (user_id, role, first_name, last_name)
-- VALUES (
--     (SELECT id FROM auth.users WHERE email = 'bradley@the-bradley-group.com'),
--     'site_admin',
--     'Bradley',
--     'Gibbs'
-- );

-- Step 7d: Re-enable RLS
-- ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- 8. Final verification
-- SELECT 
--     up.*,
--     au.email
-- FROM public.user_profiles up
-- JOIN auth.users au ON up.user_id = au.id
-- WHERE au.email = 'bradley@the-bradley-group.com';