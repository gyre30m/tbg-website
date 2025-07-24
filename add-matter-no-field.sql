-- Add Matter No. field to existing form tables
-- This script adds the matterNo field to personal_injury_forms and other existing form tables
-- Note: Run create-wrongful-death-tables.sql first to create wrongful death tables

-- Add matterNo column to personal_injury_forms table
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'personal_injury_forms' 
        AND column_name = 'matter_no'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.personal_injury_forms 
        ADD COLUMN matter_no TEXT;
        
        COMMENT ON COLUMN public.personal_injury_forms.matter_no IS 'Matter number for internal use only - not required for form submission';
    END IF;
END $$;

-- Add matterNo column to wrongful_death_forms table (if it exists)
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'wrongful_death_forms'
        AND table_schema = 'public'
    ) THEN
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'wrongful_death_forms' 
            AND column_name = 'matter_no'
            AND table_schema = 'public'
        ) THEN
            ALTER TABLE public.wrongful_death_forms 
            ADD COLUMN matter_no TEXT;
            
            COMMENT ON COLUMN public.wrongful_death_forms.matter_no IS 'Matter number for internal use only - not required for form submission';
        END IF;
    END IF;
END $$;

-- Add matterNo column to wrongful_termination_forms table (if it exists)
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'wrongful_termination_forms'
        AND table_schema = 'public'
    ) THEN
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'wrongful_termination_forms' 
            AND column_name = 'matter_no'
            AND table_schema = 'public'
        ) THEN
            ALTER TABLE public.wrongful_termination_forms 
            ADD COLUMN matter_no TEXT;
            
            COMMENT ON COLUMN public.wrongful_termination_forms.matter_no IS 'Matter number for internal use only - not required for form submission';
        END IF;
    END IF;
END $$;

-- Create indexes for better query performance (only for existing tables)
CREATE INDEX IF NOT EXISTS idx_personal_injury_forms_matter_no 
ON public.personal_injury_forms(matter_no) 
WHERE matter_no IS NOT NULL;

-- Add indexes for other tables if they exist
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'wrongful_death_forms'
        AND table_schema = 'public'
    ) THEN
        CREATE INDEX IF NOT EXISTS idx_wrongful_death_forms_matter_no 
        ON public.wrongful_death_forms(matter_no) 
        WHERE matter_no IS NOT NULL;
    END IF;
END $$;

DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'wrongful_termination_forms'
        AND table_schema = 'public'
    ) THEN
        CREATE INDEX IF NOT EXISTS idx_wrongful_termination_forms_matter_no 
        ON public.wrongful_termination_forms(matter_no) 
        WHERE matter_no IS NOT NULL;
    END IF;
END $$;

-- Verify the changes
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name IN ('personal_injury_forms', 'wrongful_death_forms', 'wrongful_termination_forms')
AND column_name = 'matter_no'
ORDER BY table_name;