-- Complete migration script to replace ALL form tables with normalized versions
-- WARNING: This will drop all existing data in all form tables

-- Step 1: Drop all existing form tables completely
DROP TABLE IF EXISTS public.personal_injury_forms CASCADE;
DROP TABLE IF EXISTS public.personal_injury_drafts CASCADE;
DROP TABLE IF EXISTS public.wrongful_death_forms CASCADE;
DROP TABLE IF EXISTS public.wrongful_death_drafts CASCADE;
DROP TABLE IF EXISTS public.wrongful_termination_forms CASCADE;
DROP TABLE IF EXISTS public.wrongful_termination_drafts CASCADE;

-- Step 2: Rename all normalized tables to replace the old ones
ALTER TABLE public.personal_injury_forms_normalized RENAME TO personal_injury_forms;
ALTER TABLE public.personal_injury_drafts_normalized RENAME TO personal_injury_drafts;
ALTER TABLE public.wrongful_death_forms_normalized RENAME TO wrongful_death_forms;
ALTER TABLE public.wrongful_death_drafts_normalized RENAME TO wrongful_death_drafts;
ALTER TABLE public.wrongful_termination_forms_normalized RENAME TO wrongful_termination_forms;
ALTER TABLE public.wrongful_termination_drafts_normalized RENAME TO wrongful_termination_drafts;

-- Step 3: Update RLS policies to use correct names (remove "normalized" from policy names)

-- Personal Injury Policies
DROP POLICY IF EXISTS "Users can manage their own normalized forms" ON public.personal_injury_forms;
DROP POLICY IF EXISTS "Firm members can view normalized forms from their firm" ON public.personal_injury_forms;
DROP POLICY IF EXISTS "Site admins can view all normalized forms" ON public.personal_injury_forms;
DROP POLICY IF EXISTS "Site admins can manage all normalized forms" ON public.personal_injury_forms;
DROP POLICY IF EXISTS "Users can manage their own normalized drafts" ON public.personal_injury_drafts;
DROP POLICY IF EXISTS "Firm members can view normalized drafts from their firm" ON public.personal_injury_drafts;
DROP POLICY IF EXISTS "Site admins can view all normalized drafts" ON public.personal_injury_drafts;
DROP POLICY IF EXISTS "Site admins can manage all normalized drafts" ON public.personal_injury_drafts;

-- Wrongful Death Policies
DROP POLICY IF EXISTS "Users can manage their own normalized wrongful death forms" ON public.wrongful_death_forms;
DROP POLICY IF EXISTS "Firm members can view normalized wrongful death forms from their firm" ON public.wrongful_death_forms;
DROP POLICY IF EXISTS "Site admins can view all normalized wrongful death forms" ON public.wrongful_death_forms;
DROP POLICY IF EXISTS "Site admins can manage all normalized wrongful death forms" ON public.wrongful_death_forms;
DROP POLICY IF EXISTS "Users can manage their own normalized wrongful death drafts" ON public.wrongful_death_drafts;
DROP POLICY IF EXISTS "Firm members can view normalized wrongful death drafts from their firm" ON public.wrongful_death_drafts;
DROP POLICY IF EXISTS "Site admins can view all normalized wrongful death drafts" ON public.wrongful_death_drafts;
DROP POLICY IF EXISTS "Site admins can manage all normalized wrongful death drafts" ON public.wrongful_death_drafts;

-- Wrongful Termination Policies
DROP POLICY IF EXISTS "Users can manage their own normalized wrongful termination forms" ON public.wrongful_termination_forms;
DROP POLICY IF EXISTS "Firm members can view normalized wrongful termination forms from their firm" ON public.wrongful_termination_forms;
DROP POLICY IF EXISTS "Site admins can view all normalized wrongful termination forms" ON public.wrongful_termination_forms;
DROP POLICY IF EXISTS "Site admins can manage all normalized wrongful termination forms" ON public.wrongful_termination_forms;
DROP POLICY IF EXISTS "Users can manage their own normalized wrongful termination drafts" ON public.wrongful_termination_drafts;
DROP POLICY IF EXISTS "Firm members can view normalized wrongful termination drafts from their firm" ON public.wrongful_termination_drafts;
DROP POLICY IF EXISTS "Site admins can view all normalized wrongful termination drafts" ON public.wrongful_termination_drafts;
DROP POLICY IF EXISTS "Site admins can manage all normalized wrongful termination drafts" ON public.wrongful_termination_drafts;

-- Step 4: Create policies with standard names

-- Personal Injury Forms Policies
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

-- Personal Injury Drafts Policies
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

-- Wrongful Death Forms Policies
CREATE POLICY "Users can manage their own wrongful death forms" ON public.wrongful_death_forms
    FOR ALL USING (submitted_by = auth.uid());

CREATE POLICY "Firm members can view wrongful death forms from their firm" ON public.wrongful_death_forms
    FOR SELECT USING (
        firm_id IN (
            SELECT firm_id FROM public.user_profiles 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Site admins can view all wrongful death forms" ON public.wrongful_death_forms
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE user_id = auth.uid() AND role = 'site_admin'
        )
    );

CREATE POLICY "Site admins can manage all wrongful death forms" ON public.wrongful_death_forms
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE user_id = auth.uid() AND role = 'site_admin'
        )
    );

-- Wrongful Death Drafts Policies
CREATE POLICY "Users can manage their own wrongful death drafts" ON public.wrongful_death_drafts
    FOR ALL USING (submitted_by = auth.uid());

CREATE POLICY "Firm members can view wrongful death drafts from their firm" ON public.wrongful_death_drafts
    FOR SELECT USING (
        firm_id IN (
            SELECT firm_id FROM public.user_profiles 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Site admins can view all wrongful death drafts" ON public.wrongful_death_drafts
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE user_id = auth.uid() AND role = 'site_admin'
        )
    );

CREATE POLICY "Site admins can manage all wrongful death drafts" ON public.wrongful_death_drafts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE user_id = auth.uid() AND role = 'site_admin'
        )
    );

-- Wrongful Termination Forms Policies
CREATE POLICY "Users can manage their own wrongful termination forms" ON public.wrongful_termination_forms
    FOR ALL USING (submitted_by = auth.uid());

CREATE POLICY "Firm members can view wrongful termination forms from their firm" ON public.wrongful_termination_forms
    FOR SELECT USING (
        firm_id IN (
            SELECT firm_id FROM public.user_profiles 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Site admins can view all wrongful termination forms" ON public.wrongful_termination_forms
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE user_id = auth.uid() AND role = 'site_admin'
        )
    );

CREATE POLICY "Site admins can manage all wrongful termination forms" ON public.wrongful_termination_forms
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE user_id = auth.uid() AND role = 'site_admin'
        )
    );

-- Wrongful Termination Drafts Policies
CREATE POLICY "Users can manage their own wrongful termination drafts" ON public.wrongful_termination_drafts
    FOR ALL USING (submitted_by = auth.uid());

CREATE POLICY "Firm members can view wrongful termination drafts from their firm" ON public.wrongful_termination_drafts
    FOR SELECT USING (
        firm_id IN (
            SELECT firm_id FROM public.user_profiles 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Site admins can view all wrongful termination drafts" ON public.wrongful_termination_drafts
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE user_id = auth.uid() AND role = 'site_admin'
        )
    );

CREATE POLICY "Site admins can manage all wrongful termination drafts" ON public.wrongful_termination_drafts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE user_id = auth.uid() AND role = 'site_admin'
        )
    );

-- Step 5: Verification queries
SELECT 'Migration completed successfully!' as status;

SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name IN ('personal_injury_forms', 'personal_injury_drafts', 'wrongful_death_forms', 'wrongful_death_drafts', 'wrongful_termination_forms', 'wrongful_termination_drafts')
AND column_name IN ('first_name', 'last_name', 'email', 'matter_no')
ORDER BY table_name, ordinal_position;

SELECT 'All tables ready for normalized data!' as message;

-- Show record counts (should be 0 initially)
SELECT 'personal_injury_forms' as table_name, COUNT(*) as record_count FROM public.personal_injury_forms
UNION ALL
SELECT 'personal_injury_drafts' as table_name, COUNT(*) as record_count FROM public.personal_injury_drafts
UNION ALL
SELECT 'wrongful_death_forms' as table_name, COUNT(*) as record_count FROM public.wrongful_death_forms
UNION ALL
SELECT 'wrongful_death_drafts' as table_name, COUNT(*) as record_count FROM public.wrongful_death_drafts
UNION ALL
SELECT 'wrongful_termination_forms' as table_name, COUNT(*) as record_count FROM public.wrongful_termination_forms
UNION ALL
SELECT 'wrongful_termination_drafts' as table_name, COUNT(*) as record_count FROM public.wrongful_termination_drafts;