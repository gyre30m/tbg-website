-- Add new education fields to wrongful death forms tables
-- To support separation of Education and Employment sections

-- Add education_plans and parent_education fields to main forms table
ALTER TABLE public.wrongful_death_forms_normalized 
ADD COLUMN IF NOT EXISTS education_plans TEXT NOT NULL DEFAULT 'N/A',
ADD COLUMN IF NOT EXISTS parent_education TEXT NOT NULL DEFAULT 'N/A';

-- Add education_plans and parent_education fields to drafts table (nullable for drafts)
ALTER TABLE public.wrongful_death_drafts_normalized 
ADD COLUMN IF NOT EXISTS education_plans TEXT,
ADD COLUMN IF NOT EXISTS parent_education TEXT;

-- Add comments for documentation
COMMENT ON COLUMN public.wrongful_death_forms_normalized.education_plans IS 'Detail any plans the decedent had to attain further educational degrees, licenses, or training at the time of death';
COMMENT ON COLUMN public.wrongful_death_forms_normalized.parent_education IS 'If the decedent was a minor or had yet to finish formal education at the time of the death, list the education levels and occupations of the decedent''s parents';

COMMENT ON COLUMN public.wrongful_death_drafts_normalized.education_plans IS 'Detail any plans the decedent had to attain further educational degrees, licenses, or training at the time of death';
COMMENT ON COLUMN public.wrongful_death_drafts_normalized.parent_education IS 'If the decedent was a minor or had yet to finish formal education at the time of the death, list the education levels and occupations of the decedent''s parents';

-- Remove default constraint after adding the columns (we want them to be required for new submissions)
ALTER TABLE public.wrongful_death_forms_normalized 
ALTER COLUMN education_plans DROP DEFAULT,
ALTER COLUMN parent_education DROP DEFAULT;

-- Verify the new columns were added
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name IN ('wrongful_death_forms_normalized', 'wrongful_death_drafts_normalized')
AND column_name IN ('education_plans', 'parent_education')
ORDER BY table_name, column_name;