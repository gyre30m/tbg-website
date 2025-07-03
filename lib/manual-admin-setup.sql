-- Manual Site Admin Setup
-- Run this AFTER signing up with bradley@the-bradley-group.com

-- First, find the user ID for bradley@the-bradley-group.com
-- Look in the auth.users table or use this query:
SELECT id, email FROM auth.users WHERE email = 'bradley@the-bradley-group.com';

-- Then insert the profile manually (replace USER_ID_HERE with the actual ID)
INSERT INTO public.user_profiles (user_id, role, first_name, last_name) 
VALUES ('USER_ID_HERE', 'site_admin', 'Bradley', 'Gibbs') 
ON CONFLICT (user_id) DO UPDATE SET role = 'site_admin';

-- Example (replace with actual user ID):
-- INSERT INTO public.user_profiles (user_id, role, first_name, last_name) 
-- VALUES ('550e8400-e29b-41d4-a716-446655440000', 'site_admin', 'Bradley', 'Gibbs') 
-- ON CONFLICT (user_id) DO UPDATE SET role = 'site_admin';