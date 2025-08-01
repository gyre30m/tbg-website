-- Fix foreign key relationships for form tables
-- This ensures Supabase can properly join tables for the API queries

-- First, let's check if the foreign key constraints exist and add them if missing

-- Personal Injury Forms
-- Add foreign key constraint to user_profiles if it doesn't exist
DO $$
BEGIN
    -- Check if the foreign key constraint exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'personal_injury_forms_submitted_by_fkey' 
        AND table_name = 'personal_injury_forms'
    ) THEN
        -- Add the foreign key constraint
        ALTER TABLE personal_injury_forms 
        ADD CONSTRAINT personal_injury_forms_submitted_by_fkey 
        FOREIGN KEY (submitted_by) REFERENCES auth.users(id);
    END IF;
END $$;

-- Personal Injury Drafts
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'personal_injury_drafts_submitted_by_fkey' 
        AND table_name = 'personal_injury_drafts'
    ) THEN
        ALTER TABLE personal_injury_drafts 
        ADD CONSTRAINT personal_injury_drafts_submitted_by_fkey 
        FOREIGN KEY (submitted_by) REFERENCES auth.users(id);
    END IF;
END $$;

-- Wrongful Death Forms (if table exists)
DO $$
BEGIN
    -- Check if table exists first
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'wrongful_death_forms' AND table_schema = 'public'
    ) THEN
        -- Check if foreign key exists
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.table_constraints 
            WHERE constraint_name = 'wrongful_death_forms_submitted_by_fkey' 
            AND table_name = 'wrongful_death_forms'
        ) THEN
            ALTER TABLE wrongful_death_forms 
            ADD CONSTRAINT wrongful_death_forms_submitted_by_fkey 
            FOREIGN KEY (submitted_by) REFERENCES auth.users(id);
        END IF;
    END IF;
END $$;

-- Wrongful Death Drafts (if table exists)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'wrongful_death_drafts' AND table_schema = 'public'
    ) THEN
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.table_constraints 
            WHERE constraint_name = 'wrongful_death_drafts_submitted_by_fkey' 
            AND table_name = 'wrongful_death_drafts'
        ) THEN
            ALTER TABLE wrongful_death_drafts 
            ADD CONSTRAINT wrongful_death_drafts_submitted_by_fkey 
            FOREIGN KEY (submitted_by) REFERENCES auth.users(id);
        END IF;
    END IF;
END $$;

-- Wrongful Termination Forms (if table exists)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'wrongful_termination_forms' AND table_schema = 'public'
    ) THEN
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.table_constraints 
            WHERE constraint_name = 'wrongful_termination_forms_submitted_by_fkey' 
            AND table_name = 'wrongful_termination_forms'
        ) THEN
            ALTER TABLE wrongful_termination_forms 
            ADD CONSTRAINT wrongful_termination_forms_submitted_by_fkey 
            FOREIGN KEY (submitted_by) REFERENCES auth.users(id);
        END IF;
    END IF;
END $$;

-- Wrongful Termination Drafts (if table exists)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'wrongful_termination_drafts' AND table_schema = 'public'
    ) THEN
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.table_constraints 
            WHERE constraint_name = 'wrongful_termination_drafts_submitted_by_fkey' 
            AND table_name = 'wrongful_termination_drafts'
        ) THEN
            ALTER TABLE wrongful_termination_drafts 
            ADD CONSTRAINT wrongful_termination_drafts_submitted_by_fkey 
            FOREIGN KEY (submitted_by) REFERENCES auth.users(id);
        END IF;
    END IF;
END $$;

-- Create a helper function to establish the relationship in Supabase's schema cache
-- This function creates a proper relationship that Supabase can recognize for API queries
CREATE OR REPLACE VIEW personal_injury_forms_with_users AS
SELECT 
    pif.*,
    up.first_name as user_first_name,
    up.last_name as user_last_name,
    up.role as user_role
FROM personal_injury_forms pif
LEFT JOIN user_profiles up ON pif.submitted_by = up.user_id;

-- Grant access to the view
GRANT SELECT ON personal_injury_forms_with_users TO authenticated;

-- Also create similar views for other tables if they exist
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'wrongful_death_forms' AND table_schema = 'public'
    ) THEN
        EXECUTE '
        CREATE OR REPLACE VIEW wrongful_death_forms_with_users AS
        SELECT 
            wdf.*,
            up.first_name as user_first_name,
            up.last_name as user_last_name,
            up.role as user_role
        FROM wrongful_death_forms wdf
        LEFT JOIN user_profiles up ON wdf.submitted_by = up.user_id;
        
        GRANT SELECT ON wrongful_death_forms_with_users TO authenticated;
        ';
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'wrongful_termination_forms' AND table_schema = 'public'
    ) THEN
        EXECUTE '
        CREATE OR REPLACE VIEW wrongful_termination_forms_with_users AS
        SELECT 
            wtf.*,
            up.first_name as user_first_name,
            up.last_name as user_last_name,
            up.role as user_role
        FROM wrongful_termination_forms wtf
        LEFT JOIN user_profiles up ON wtf.submitted_by = up.user_id;
        
        GRANT SELECT ON wrongful_termination_forms_with_users TO authenticated;
        ';
    END IF;
END $$;

-- Verify the relationships were created
SELECT 
    tc.table_name,
    tc.constraint_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage ccu ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
AND tc.table_name IN ('personal_injury_forms', 'personal_injury_drafts', 'wrongful_death_forms', 'wrongful_death_drafts', 'wrongful_termination_forms', 'wrongful_termination_drafts')
ORDER BY tc.table_name;