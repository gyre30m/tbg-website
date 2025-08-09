-- Policy and constraint updates to align with the new authorization model
-- Date: 2025-08-07
-- Summary:
-- 1) Require firm association for all non-site_admin users
-- 2) Any user may VIEW and UPDATE any form that belongs to their firm; users may NOT DELETE forms
-- 3) firm_admin may UPDATE all fields in their firm's profile
-- 4) Keep site_admin with global manage permissions

-- 0. Safety: ensure schema exists
SET search_path = public;

-- 1) Require firm association for all non-site_admin users
--    Enforce at the database level with a CHECK constraint that allows
--    site_admin to have NULL firm_id (if desired), but requires firm_id for others.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'user_profiles_role_firm_requirement_chk'
  ) THEN
    ALTER TABLE public.user_profiles
    ADD CONSTRAINT user_profiles_role_firm_requirement_chk
      CHECK (role = 'site_admin' OR firm_id IS NOT NULL);
  END IF;
END $$;

-- Optional (commented): If you truly want even site_admin to belong to a firm, uncomment:
-- ALTER TABLE public.user_profiles ALTER COLUMN firm_id SET NOT NULL;

-- 2) Forms policies
--    Ensure firm-wide SELECT and UPDATE for all users in the firm.
--    Disallow DELETE for regular users and firm_admins (only site_admin can delete via existing site_admin manage-all policies).

-- Helper note: Some policies may already exist. We DROP conflicting ones by name if present,
-- then CREATE OR REPLACE the intended policies.

-- Personal Injury Forms
-- Remove per-user FOR ALL policy that implicitly allowed DELETE
DROP POLICY IF EXISTS "Users can manage their own forms" ON public.personal_injury_forms;
DROP POLICY IF EXISTS "Firm admins can delete forms from their firm" ON public.personal_injury_forms;
-- Ensure firm members can SELECT all firm forms
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'personal_injury_forms'
      AND policyname = 'Firm members can view forms from their firm'
  ) THEN
    CREATE POLICY "Firm members can view forms from their firm" ON public.personal_injury_forms
      FOR SELECT USING (
        firm_id IN (
          SELECT firm_id FROM public.user_profiles WHERE user_id = auth.uid()
        )
      );
  END IF;
END $$;
-- Ensure firm members can UPDATE all firm forms
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'personal_injury_forms'
      AND policyname = 'Firm members can update forms from their firm'
  ) THEN
    CREATE POLICY "Firm members can update forms from their firm" ON public.personal_injury_forms
      FOR UPDATE USING (
        firm_id IN (
          SELECT firm_id FROM public.user_profiles WHERE user_id = auth.uid()
        )
      )
      WITH CHECK (
        firm_id IN (
          SELECT firm_id FROM public.user_profiles WHERE user_id = auth.uid()
        )
      );
  END IF;
END $$;

-- Personal Injury Drafts (treat drafts as forms for firm-wide collaboration)
-- Remove per-user FOR ALL policy that implicitly allowed DELETE
DROP POLICY IF EXISTS "Users can manage their own drafts" ON public.personal_injury_drafts;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'personal_injury_drafts'
      AND policyname = 'Firm members can view drafts from their firm'
  ) THEN
    CREATE POLICY "Firm members can view drafts from their firm" ON public.personal_injury_drafts
      FOR SELECT USING (
        firm_id IN (
          SELECT firm_id FROM public.user_profiles WHERE user_id = auth.uid()
        )
      );
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'personal_injury_drafts'
      AND policyname = 'Firm members can update drafts from their firm'
  ) THEN
    CREATE POLICY "Firm members can update drafts from their firm" ON public.personal_injury_drafts
      FOR UPDATE USING (
        firm_id IN (
          SELECT firm_id FROM public.user_profiles WHERE user_id = auth.uid()
        )
      )
      WITH CHECK (
        firm_id IN (
          SELECT firm_id FROM public.user_profiles WHERE user_id = auth.uid()
        )
      );
  END IF;
END $$;

-- Wrongful Death Forms
DROP POLICY IF EXISTS "Firm admins can delete wrongful death forms from their firm" ON public.wrongful_death_forms;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'wrongful_death_forms'
      AND policyname = 'Firm members can view wrongful death forms from their firm'
  ) THEN
    CREATE POLICY "Firm members can view wrongful death forms from their firm" ON public.wrongful_death_forms
      FOR SELECT USING (
        firm_id IN (
          SELECT firm_id FROM public.user_profiles WHERE user_id = auth.uid()
        )
      );
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'wrongful_death_forms'
      AND policyname = 'Firm members can update wrongful death forms from their firm'
  ) THEN
    CREATE POLICY "Firm members can update wrongful death forms from their firm" ON public.wrongful_death_forms
      FOR UPDATE USING (
        firm_id IN (
          SELECT firm_id FROM public.user_profiles WHERE user_id = auth.uid()
        )
      )
      WITH CHECK (
        firm_id IN (
          SELECT firm_id FROM public.user_profiles WHERE user_id = auth.uid()
        )
      );
  END IF;
END $$;

-- Wrongful Termination Forms
DROP POLICY IF EXISTS "Firm admins can delete wrongful termination forms from their firm" ON public.wrongful_termination_forms;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'wrongful_termination_forms'
      AND policyname = 'Firm members can view wrongful termination forms from their firm'
  ) THEN
    CREATE POLICY "Firm members can view wrongful termination forms from their firm" ON public.wrongful_termination_forms
      FOR SELECT USING (
        firm_id IN (
          SELECT firm_id FROM public.user_profiles WHERE user_id = auth.uid()
        )
      );
  END IF;
END $$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'wrongful_termination_forms'
      AND policyname = 'Firm members can update wrongful termination forms from their firm'
  ) THEN
    CREATE POLICY "Firm members can update wrongful termination forms from their firm" ON public.wrongful_termination_forms
      FOR UPDATE USING (
        firm_id IN (
          SELECT firm_id FROM public.user_profiles WHERE user_id = auth.uid()
        )
      )
      WITH CHECK (
        firm_id IN (
          SELECT firm_id FROM public.user_profiles WHERE user_id = auth.uid()
        )
      );
  END IF;
END $$;

-- Note on DELETE: No firm-level DELETE policy is created for these tables.
-- Site admin retains the ability to delete if you have a site-admin "manage all" policy already defined.

-- 3) Firm profile UPDATE by firm_admin
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'firms'
      AND policyname = 'Firm admins can update their own firm'
  ) THEN
    CREATE POLICY "Firm admins can update their own firm" ON public.firms
      FOR UPDATE USING (
        id IN (
          SELECT firm_id FROM public.user_profiles 
          WHERE user_id = auth.uid() AND role = 'firm_admin'
        )
      )
      WITH CHECK (
        id IN (
          SELECT firm_id FROM public.user_profiles 
          WHERE user_id = auth.uid() AND role = 'firm_admin'
        )
      );
  END IF;
END $$;

-- 4) Verification queries
-- Inspect effective policies for the affected tables
SELECT schemaname, tablename, policyname, cmd
FROM pg_policies
WHERE tablename IN (
  'personal_injury_forms',
  'wrongful_death_forms',
  'wrongful_termination_forms',
  'firms',
  'user_profiles'
)
ORDER BY tablename, policyname;

