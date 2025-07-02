-- QUICK FIX for infinite recursion in user_profiles policies
-- Run this SQL immediately in your Supabase dashboard

-- 1. Drop all problematic policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Site admins can manage all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Firm admins can view users in their firm" ON public.user_profiles;
DROP POLICY IF EXISTS "Firm admins can create profiles for their firm" ON public.user_profiles;

-- 2. Create simple, non-recursive policies
CREATE POLICY "Users can view their own profile" ON public.user_profiles
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their own profile" ON public.user_profiles
    FOR UPDATE USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can insert their own profile" ON public.user_profiles
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- 3. Special admin policy using JWT email (no recursion)
CREATE POLICY "Admin email can manage all profiles" ON public.user_profiles
    FOR ALL USING (auth.jwt() ->> 'email' = 'bradley@the-bradley-group.com');

-- 4. Create the admin profile
INSERT INTO public.user_profiles (user_id, role, first_name, last_name)
VALUES (
    (SELECT id FROM auth.users WHERE email = 'bradley@the-bradley-group.com'),
    'site_admin',
    'Bradley',
    'Gibbs'
) ON CONFLICT (user_id) DO UPDATE SET
    role = EXCLUDED.role,
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name;

-- 5. Verify it worked
SELECT 
    up.user_id,
    up.role,
    up.first_name,
    up.last_name,
    au.email
FROM public.user_profiles up
JOIN auth.users au ON up.user_id = au.id
WHERE au.email = 'bradley@the-bradley-group.com';