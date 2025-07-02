-- Fix firms table RLS policies to avoid recursion and enable firm creation
-- Run this SQL in your Supabase dashboard

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Site admins can manage all firms" ON public.firms;
DROP POLICY IF EXISTS "Firm admins can view their own firm" ON public.firms;

-- Create simple, non-recursive policies using JWT email for site admin
CREATE POLICY "Admin email can manage all firms" ON public.firms
    FOR ALL USING (auth.jwt() ->> 'email' = 'bradley@the-bradley-group.com');

-- For now, let's create a simple policy for firm access that doesn't depend on user_profiles
-- We'll improve this later once we have a better solution for role checking
CREATE POLICY "Users can view firms by auth" ON public.firms
    FOR SELECT USING (auth.uid() IS NOT NULL);

-- Verify the policies
SELECT policyname, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public' AND tablename = 'firms'
ORDER BY policyname;