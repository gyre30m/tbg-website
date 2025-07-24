-- Simple migration script to replace existing tables with normalized versions
-- WARNING: This will drop all existing data in personal_injury_forms and personal_injury_drafts

-- Step 1: Drop existing tables completely
DROP TABLE IF EXISTS public.personal_injury_forms CASCADE;
DROP TABLE IF EXISTS public.personal_injury_drafts CASCADE;

-- Step 2: Rename normalized tables to replace the old ones
ALTER TABLE public.personal_injury_forms_normalized RENAME TO personal_injury_forms;
ALTER TABLE public.personal_injury_drafts_normalized RENAME TO personal_injury_drafts;

-- Step 3: Update RLS policies to use correct names (remove "normalized" from policy names)
-- Drop old policy names
DROP POLICY IF EXISTS "Users can manage their own normalized forms" ON public.personal_injury_forms;
DROP POLICY IF EXISTS "Firm members can view normalized forms from their firm" ON public.personal_injury_forms;
DROP POLICY IF EXISTS "Site admins can view all normalized forms" ON public.personal_injury_forms;
DROP POLICY IF EXISTS "Site admins can manage all normalized forms" ON public.personal_injury_forms;

DROP POLICY IF EXISTS "Users can manage their own normalized drafts" ON public.personal_injury_drafts;
DROP POLICY IF EXISTS "Firm members can view normalized drafts from their firm" ON public.personal_injury_drafts;
DROP POLICY IF EXISTS "Site admins can view all normalized drafts" ON public.personal_injury_drafts;
DROP POLICY IF EXISTS "Site admins can manage all normalized drafts" ON public.personal_injury_drafts;

-- Create policies with standard names
CREATE POLICY "Users can manage their own forms" ON public.personal_injury_forms
    FOR ALL USING (submitted_by = auth.uid());

CREATE POLICY "Firm members can view forms from their firm" ON public.personal_injury_forms
    FOR SELECT USING (
        firm_id IN (
            SELECT firm_id FROM public.user_profiles 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Site admins can view all forms" ON public.personal_injury_forms
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE user_id = auth.uid() AND role = 'site_admin'
        )
    );

CREATE POLICY "Site admins can manage all forms" ON public.personal_injury_forms
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE user_id = auth.uid() AND role = 'site_admin'
        )
    );

CREATE POLICY "Users can manage their own drafts" ON public.personal_injury_drafts
    FOR ALL USING (submitted_by = auth.uid());

CREATE POLICY "Firm members can view drafts from their firm" ON public.personal_injury_drafts
    FOR SELECT USING (
        firm_id IN (
            SELECT firm_id FROM public.user_profiles 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Site admins can view all drafts" ON public.personal_injury_drafts
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE user_id = auth.uid() AND role = 'site_admin'
        )
    );

CREATE POLICY "Site admins can manage all drafts" ON public.personal_injury_drafts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE user_id = auth.uid() AND role = 'site_admin'
        )
    );

-- Step 4: Verify the migration
SELECT 'Migration completed successfully!' as status;

SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name IN ('personal_injury_forms', 'personal_injury_drafts')
AND column_name IN ('first_name', 'last_name', 'email', 'incident_date', 'matter_no')
ORDER BY table_name, ordinal_position;

SELECT 'Tables ready for normalized data!' as message;