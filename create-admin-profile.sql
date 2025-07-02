-- Create profile for bradley@the-bradley-group.com
-- Run this SQL in your Supabase dashboard

-- First, let's find the user ID for bradley@the-bradley-group.com
-- (This is just for reference - you'll need to replace the UUID below)
-- SELECT id, email FROM auth.users WHERE email = 'bradley@the-bradley-group.com';

-- Option 1: Create profile manually (replace USER_ID_HERE with actual user ID)
-- You can get the user ID from the query above or from the /debug page
INSERT INTO public.user_profiles (user_id, role, first_name, last_name)
VALUES (
    (SELECT id FROM auth.users WHERE email = 'bradley@the-bradley-group.com'),
    'site_admin',
    'Bradley',
    'Gibbs'
) ON CONFLICT (user_id) DO NOTHING;

-- Option 2: If the above doesn't work due to RLS, temporarily disable it
-- (Only run this if Option 1 fails)
/*
ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;

INSERT INTO public.user_profiles (user_id, role, first_name, last_name)
VALUES (
    (SELECT id FROM auth.users WHERE email = 'bradley@the-bradley-group.com'),
    'site_admin',
    'Bradley',
    'Gibbs'
) ON CONFLICT (user_id) DO NOTHING;

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
*/

-- Verify the profile was created
SELECT 
    up.id,
    up.user_id,
    up.role,
    up.first_name,
    up.last_name,
    au.email
FROM public.user_profiles up
JOIN auth.users au ON up.user_id = au.id
WHERE au.email = 'bradley@the-bradley-group.com';