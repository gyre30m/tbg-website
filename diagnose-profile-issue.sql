-- Diagnose profile linking issue
-- Run this SQL in your Supabase dashboard to find the problem

-- 1. Check what users exist in auth.users
SELECT 
    id as auth_user_id,
    email,
    created_at,
    email_confirmed_at
FROM auth.users 
WHERE email = 'bradley@the-bradley-group.com';

-- 2. Check what profiles exist in user_profiles
SELECT 
    id as profile_id,
    user_id,
    role,
    first_name,
    last_name,
    created_at
FROM public.user_profiles;

-- 3. Check if there's a mismatch between auth.users.id and user_profiles.user_id
SELECT 
    au.id as auth_user_id,
    au.email,
    up.id as profile_id,
    up.user_id as profile_user_id,
    up.role,
    up.first_name,
    up.last_name,
    CASE 
        WHEN au.id = up.user_id THEN 'MATCHED' 
        ELSE 'MISMATCH' 
    END as link_status
FROM auth.users au
FULL OUTER JOIN public.user_profiles up ON au.id = up.user_id
WHERE au.email = 'bradley@the-bradley-group.com' OR up.user_id IS NOT NULL;

-- 4. If there's a mismatch, delete the incorrect profile
-- DELETE FROM public.user_profiles WHERE user_id != (SELECT id FROM auth.users WHERE email = 'bradley@the-bradley-group.com');

-- 5. Create the correct profile
-- INSERT INTO public.user_profiles (user_id, role, first_name, last_name)
-- VALUES (
--     (SELECT id FROM auth.users WHERE email = 'bradley@the-bradley-group.com'),
--     'site_admin',
--     'Bradley',
--     'Gibbs'
-- ) ON CONFLICT (user_id) DO UPDATE SET
--     role = EXCLUDED.role,
--     first_name = EXCLUDED.first_name,
--     last_name = EXCLUDED.last_name;