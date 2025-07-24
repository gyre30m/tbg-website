-- Add missing site admin policies for complete forms and drafts management
-- Run this script in your Supabase SQL Editor to grant site admins full access

-- Add site admin management policy for forms
CREATE POLICY "Site admins can manage all forms" ON public.personal_injury_forms
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE user_id = auth.uid() AND role = 'site_admin'
        )
    );

-- Add site admin management policy for drafts
CREATE POLICY "Site admins can manage all drafts" ON public.personal_injury_drafts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE user_id = auth.uid() AND role = 'site_admin'
        )
    );

-- Verify policies were created
SELECT schemaname, tablename, policyname, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('personal_injury_forms', 'personal_injury_drafts')
AND policyname LIKE '%Site admins%'
ORDER BY tablename, policyname;