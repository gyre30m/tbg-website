-- Add defendant column to personal injury forms table
-- This column was referenced in the code but missing from the database schema

ALTER TABLE public.personal_injury_forms 
ADD COLUMN IF NOT EXISTS defendant TEXT;

-- Also add to drafts table for consistency
ALTER TABLE public.personal_injury_drafts 
ADD COLUMN IF NOT EXISTS defendant TEXT;

-- Add to wrongful death forms as well since it has the same field
ALTER TABLE public.wrongful_death_forms 
ADD COLUMN IF NOT EXISTS defendant TEXT;

ALTER TABLE public.wrongful_death_drafts 
ADD COLUMN IF NOT EXISTS defendant TEXT;

-- Add to wrongful termination forms as well since it has the same field  
ALTER TABLE public.wrongful_termination_forms 
ADD COLUMN IF NOT EXISTS defendant TEXT;

ALTER TABLE public.wrongful_termination_drafts 
ADD COLUMN IF NOT EXISTS defendant TEXT;

-- Add comment for documentation
COMMENT ON COLUMN public.personal_injury_forms.defendant IS 'Defendant in the legal case - optional field';
COMMENT ON COLUMN public.personal_injury_drafts.defendant IS 'Defendant in the legal case - optional field';
COMMENT ON COLUMN public.wrongful_death_forms.defendant IS 'Defendant in the legal case - optional field';
COMMENT ON COLUMN public.wrongful_death_drafts.defendant IS 'Defendant in the legal case - optional field';
COMMENT ON COLUMN public.wrongful_termination_forms.defendant IS 'Defendant in the legal case - optional field';
COMMENT ON COLUMN public.wrongful_termination_drafts.defendant IS 'Defendant in the legal case - optional field';