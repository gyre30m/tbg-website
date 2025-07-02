-- Fix profile policies to ensure admins can create/update profiles
-- Run this SQL in your Supabase dashboard

-- First, let's check what policies currently exist
SELECT policyname, cmd, qual, with_check 
FROM pg_policies 
WHERE schemaname = 'public' AND tablename = 'user_profiles';

-- Drop all existing policies for user_profiles to start fresh
DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Site admins can manage all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Firm admins can view users in their firm" ON public.user_profiles;
DROP POLICY IF EXISTS "Firm admins can create profiles for their firm" ON public.user_profiles;

-- Create comprehensive policies
-- 1. Allow users to view their own profile
CREATE POLICY "Users can view their own profile" ON public.user_profiles
    FOR SELECT USING (user_id = auth.uid());

-- 2. Allow users to update their own profile
CREATE POLICY "Users can update their own profile" ON public.user_profiles
    FOR UPDATE USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- 3. Allow anyone to insert their own profile (needed for new users)
CREATE POLICY "Users can create their own profile" ON public.user_profiles
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- 4. Special rule: Allow bradley@the-bradley-group.com to create site admin profile
CREATE POLICY "Admin can create admin profile" ON public.user_profiles
    FOR INSERT WITH CHECK (
        auth.jwt() ->> 'email' = 'bradley@the-bradley-group.com' 
        AND role = 'site_admin'
    );

-- 5. Site admins can manage all profiles
CREATE POLICY "Site admins can manage all profiles" ON public.user_profiles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE user_id = auth.uid() AND role = 'site_admin'
        )
    );

-- 6. Firm admins can view users in their firm
CREATE POLICY "Firm admins can view users in their firm" ON public.user_profiles
    FOR SELECT USING (
        firm_id IN (
            SELECT firm_id FROM public.user_profiles 
            WHERE user_id = auth.uid() AND role = 'firm_admin'
        )
    );

-- Verify policies were created
SELECT policyname, cmd, qual, with_check 
FROM pg_policies 
WHERE schemaname = 'public' AND tablename = 'user_profiles'
ORDER BY policyname;