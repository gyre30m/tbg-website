-- Fix infinite recursion in user_profiles RLS policies
-- The issue: policies check user_profiles to determine access to user_profiles = infinite loop

-- STEP 1: Drop all existing problematic policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can create their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Admin can create admin profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Site admins can manage all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Firm admins can view users in their firm" ON public.user_profiles;
DROP POLICY IF EXISTS "Firm admins can create profiles for their firm" ON public.user_profiles;

-- STEP 2: Create simple, non-recursive policies

-- Allow users to view their own profile (simple, no recursion)
CREATE POLICY "Users can view their own profile" ON public.user_profiles
    FOR SELECT USING (user_id = auth.uid());

-- Allow users to update their own profile (simple, no recursion)
CREATE POLICY "Users can update their own profile" ON public.user_profiles
    FOR UPDATE USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- Allow users to insert their own profile (simple, no recursion)
CREATE POLICY "Users can insert their own profile" ON public.user_profiles
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- Special policy for site admin email to create admin profile
CREATE POLICY "Bradley can create admin profile" ON public.user_profiles
    FOR INSERT WITH CHECK (
        auth.jwt() ->> 'email' = 'bradley@the-bradley-group.com'
        AND user_id = auth.uid()
    );

-- STEP 3: For firm/admin access, we'll use a different approach
-- Instead of checking user_profiles recursively, we'll use JWT claims or separate functions

-- For now, let's create a simple admin override policy using email
CREATE POLICY "Admin email can manage all profiles" ON public.user_profiles
    FOR ALL USING (auth.jwt() ->> 'email' = 'bradley@the-bradley-group.com');

-- STEP 4: Verify the policies
SELECT policyname, cmd, qual, with_check 
FROM pg_policies 
WHERE schemaname = 'public' AND tablename = 'user_profiles'
ORDER BY policyname;