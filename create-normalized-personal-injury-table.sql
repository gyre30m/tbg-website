-- Create normalized personal injury forms table
-- Based on comprehensive analysis of all form fields with proper constraints and data types

CREATE TABLE IF NOT EXISTS public.personal_injury_forms_normalized (
    -- Primary key and metadata
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    matter_no TEXT, -- Not required field
    submitted_by UUID REFERENCES auth.users(id) NOT NULL,
    firm_id UUID REFERENCES public.firms(id),
    status TEXT DEFAULT 'submitted' CHECK (status IN ('draft', 'submitted')) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    -- Contact Information (all required except address2)
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    address1 TEXT NOT NULL,
    address2 TEXT,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    zip_code TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    phone_type TEXT NOT NULL CHECK (phone_type IN ('mobile', 'home', 'work', 'other')),
    
    -- Demographics (all required)
    gender TEXT NOT NULL CHECK (gender IN ('male', 'female', 'non-binary')),
    marital_status TEXT NOT NULL CHECK (marital_status IN ('single', 'married', 'divorced', 'widowed', 'separated', 'domestic-partnership')),
    ethnicity TEXT NOT NULL CHECK (ethnicity IN ('american-indian-alaska-native', 'asian', 'black-african-american', 'hispanic-latino', 'native-hawaiian-pacific-islander', 'white', 'two-or-more-races')),
    date_of_birth DATE NOT NULL,
    
    -- Medical Information (all required)
    incident_date DATE NOT NULL,
    injury_description TEXT NOT NULL,
    caregiver_claim TEXT NOT NULL,
    life_expectancy TEXT NOT NULL,
    future_medical TEXT NOT NULL,
    
    -- Education (all required)
    pre_injury_education TEXT NOT NULL CHECK (pre_injury_education IN ('high-school', 'some-college', 'associates', 'bachelors', 'masters', 'doctorate', 'professional', 'other')),
    pre_injury_skills TEXT NOT NULL,
    education_plans TEXT NOT NULL,
    parent_education TEXT NOT NULL,
    post_injury_education TEXT NOT NULL,
    
    -- Pre-Injury Employment (most required, some optional)
    pre_injury_employment_status TEXT NOT NULL CHECK (pre_injury_employment_status IN ('full-time', 'part-time', 'self-employed', 'unemployed', 'student', 'retired')),
    pre_injury_job_title TEXT NOT NULL,
    pre_injury_employer TEXT NOT NULL,
    pre_injury_start_date DATE NOT NULL,
    pre_injury_salary TEXT NOT NULL,
    pre_injury_duties TEXT NOT NULL,
    pre_injury_advancements TEXT NOT NULL,
    pre_injury_overtime TEXT NOT NULL,
    pre_injury_work_steady TEXT NOT NULL,
    pre_injury_life_insurance TEXT, -- Optional
    pre_injury_individual_health TEXT, -- Optional
    pre_injury_family_health TEXT, -- Optional
    pre_injury_retirement_plan TEXT, -- Optional
    pre_injury_investment_plan TEXT, -- Optional
    pre_injury_bonus TEXT, -- Optional
    pre_injury_stock_options TEXT, -- Optional
    pre_injury_other_benefits TEXT, -- Optional
    pre_injury_retirement_age TEXT NOT NULL,
    pre_injury_career_trajectory TEXT NOT NULL,
    pre_injury_job_expenses TEXT NOT NULL,
    
    -- Post-Injury Employment (most required, some optional)
    disability_rating TEXT NOT NULL,
    post_injury_employment_status TEXT NOT NULL CHECK (post_injury_employment_status IN ('full-time', 'part-time', 'self-employed', 'unemployed', 'disabled', 'retired')),
    post_injury_job_title TEXT NOT NULL,
    post_injury_employer TEXT NOT NULL,
    post_injury_start_date DATE NOT NULL,
    post_injury_salary TEXT NOT NULL,
    post_injury_duties TEXT NOT NULL,
    post_injury_advancements TEXT NOT NULL,
    post_injury_overtime TEXT NOT NULL,
    post_injury_work_steady TEXT NOT NULL,
    post_injury_life_insurance TEXT, -- Optional
    post_injury_individual_health TEXT, -- Optional
    post_injury_family_health TEXT, -- Optional
    post_injury_retirement_plan TEXT, -- Optional
    post_injury_investment_plan TEXT, -- Optional
    post_injury_bonus TEXT, -- Optional
    post_injury_stock_options TEXT, -- Optional
    post_injury_other_benefits TEXT, -- Optional
    post_injury_retirement_age TEXT NOT NULL,
    post_injury_job_expenses TEXT NOT NULL,
    additional_info TEXT NOT NULL,
    
    -- Household Services (all required, scale 0-5)
    dependent_care TEXT NOT NULL CHECK (dependent_care IN ('0', '1', '2', '3', '4', '5')),
    pet_care TEXT NOT NULL CHECK (pet_care IN ('0', '1', '2', '3', '4', '5')),
    indoor_housework TEXT NOT NULL CHECK (indoor_housework IN ('0', '1', '2', '3', '4', '5')),
    meal_prep TEXT NOT NULL CHECK (meal_prep IN ('0', '1', '2', '3', '4', '5')),
    home_maintenance TEXT NOT NULL CHECK (home_maintenance IN ('0', '1', '2', '3', '4', '5')),
    vehicle_maintenance TEXT NOT NULL CHECK (vehicle_maintenance IN ('0', '1', '2', '3', '4', '5')),
    errands TEXT NOT NULL CHECK (errands IN ('0', '1', '2', '3', '4', '5')),
    
    -- Litigation (all required except matter_no)
    settlement_date DATE NOT NULL,
    trial_date DATE NOT NULL,
    trial_location TEXT NOT NULL,
    opposing_counsel_firm TEXT NOT NULL,
    opposing_economist TEXT NOT NULL,
    
    -- Complex data stored as JSONB arrays
    household_members JSONB DEFAULT '[]'::jsonb, -- Array of {fullName, dateOfBirth, relationship}
    pre_injury_years JSONB DEFAULT '[]'::jsonb,  -- Array of {year, income, percentEmployed}
    post_injury_years JSONB DEFAULT '[]'::jsonb, -- Array of {year, income, percentEmployed}
    
    -- File uploads stored as JSONB array
    -- Each file: {fileName, fileUrl, fileSize, fileType, category, description}
    uploaded_files JSONB DEFAULT '[]'::jsonb
);

-- Create corresponding drafts table with same structure but different status constraint
CREATE TABLE IF NOT EXISTS public.personal_injury_drafts_normalized (
    -- Primary key and metadata
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    matter_no TEXT,
    submitted_by UUID REFERENCES auth.users(id) NOT NULL,
    firm_id UUID REFERENCES public.firms(id),
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft')) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    -- All other fields same as main table but NOT NULL constraints removed for drafts
    -- Contact Information
    first_name TEXT,
    last_name TEXT,
    address1 TEXT,
    address2 TEXT,
    city TEXT,
    state TEXT,
    zip_code TEXT,
    email TEXT,
    phone TEXT,
    phone_type TEXT CHECK (phone_type IS NULL OR phone_type IN ('mobile', 'home', 'work', 'other')),
    
    -- Demographics
    gender TEXT CHECK (gender IS NULL OR gender IN ('male', 'female', 'non-binary')),
    marital_status TEXT CHECK (marital_status IS NULL OR marital_status IN ('single', 'married', 'divorced', 'widowed', 'separated', 'domestic-partnership')),
    ethnicity TEXT CHECK (ethnicity IS NULL OR ethnicity IN ('american-indian-alaska-native', 'asian', 'black-african-american', 'hispanic-latino', 'native-hawaiian-pacific-islander', 'white', 'two-or-more-races')),
    date_of_birth DATE,
    
    -- Medical Information
    incident_date DATE,
    injury_description TEXT,
    caregiver_claim TEXT,
    life_expectancy TEXT,
    future_medical TEXT,
    
    -- Education
    pre_injury_education TEXT CHECK (pre_injury_education IS NULL OR pre_injury_education IN ('high-school', 'some-college', 'associates', 'bachelors', 'masters', 'doctorate', 'professional', 'other')),
    pre_injury_skills TEXT,
    education_plans TEXT,
    parent_education TEXT,
    post_injury_education TEXT,
    
    -- Pre-Injury Employment
    pre_injury_employment_status TEXT CHECK (pre_injury_employment_status IS NULL OR pre_injury_employment_status IN ('full-time', 'part-time', 'self-employed', 'unemployed', 'student', 'retired')),
    pre_injury_job_title TEXT,
    pre_injury_employer TEXT,
    pre_injury_start_date DATE,
    pre_injury_salary TEXT,
    pre_injury_duties TEXT,
    pre_injury_advancements TEXT,
    pre_injury_overtime TEXT,
    pre_injury_work_steady TEXT,
    pre_injury_life_insurance TEXT,
    pre_injury_individual_health TEXT,
    pre_injury_family_health TEXT,
    pre_injury_retirement_plan TEXT,
    pre_injury_investment_plan TEXT,
    pre_injury_bonus TEXT,
    pre_injury_stock_options TEXT,
    pre_injury_other_benefits TEXT,
    pre_injury_retirement_age TEXT,
    pre_injury_career_trajectory TEXT,
    pre_injury_job_expenses TEXT,
    
    -- Post-Injury Employment
    disability_rating TEXT,
    post_injury_employment_status TEXT CHECK (post_injury_employment_status IS NULL OR post_injury_employment_status IN ('full-time', 'part-time', 'self-employed', 'unemployed', 'disabled', 'retired')),
    post_injury_job_title TEXT,
    post_injury_employer TEXT,
    post_injury_start_date DATE,
    post_injury_salary TEXT,
    post_injury_duties TEXT,
    post_injury_advancements TEXT,
    post_injury_overtime TEXT,
    post_injury_work_steady TEXT,
    post_injury_life_insurance TEXT,
    post_injury_individual_health TEXT,
    post_injury_family_health TEXT,
    post_injury_retirement_plan TEXT,
    post_injury_investment_plan TEXT,
    post_injury_bonus TEXT,
    post_injury_stock_options TEXT,
    post_injury_other_benefits TEXT,
    post_injury_retirement_age TEXT,
    post_injury_job_expenses TEXT,
    additional_info TEXT,
    
    -- Household Services
    dependent_care TEXT CHECK (dependent_care IS NULL OR dependent_care IN ('0', '1', '2', '3', '4', '5')),
    pet_care TEXT CHECK (pet_care IS NULL OR pet_care IN ('0', '1', '2', '3', '4', '5')),
    indoor_housework TEXT CHECK (indoor_housework IS NULL OR indoor_housework IN ('0', '1', '2', '3', '4', '5')),
    meal_prep TEXT CHECK (meal_prep IS NULL OR meal_prep IN ('0', '1', '2', '3', '4', '5')),
    home_maintenance TEXT CHECK (home_maintenance IS NULL OR home_maintenance IN ('0', '1', '2', '3', '4', '5')),
    vehicle_maintenance TEXT CHECK (vehicle_maintenance IS NULL OR vehicle_maintenance IN ('0', '1', '2', '3', '4', '5')),
    errands TEXT CHECK (errands IS NULL OR errands IN ('0', '1', '2', '3', '4', '5')),
    
    -- Litigation
    settlement_date DATE,
    trial_date DATE,
    trial_location TEXT,
    opposing_counsel_firm TEXT,
    opposing_economist TEXT,
    
    -- Complex data stored as JSONB arrays
    household_members JSONB DEFAULT '[]'::jsonb,
    pre_injury_years JSONB DEFAULT '[]'::jsonb,
    post_injury_years JSONB DEFAULT '[]'::jsonb,
    uploaded_files JSONB DEFAULT '[]'::jsonb
);

-- Add comments for documentation
COMMENT ON COLUMN public.personal_injury_forms_normalized.matter_no IS 'Matter number for law firm internal use only - not required for form submission';
COMMENT ON COLUMN public.personal_injury_forms_normalized.household_members IS 'JSONB array of household members: [{fullName, dateOfBirth, relationship}, ...]';
COMMENT ON COLUMN public.personal_injury_forms_normalized.pre_injury_years IS 'JSONB array of pre-injury employment years: [{year, income, percentEmployed}, ...]';
COMMENT ON COLUMN public.personal_injury_forms_normalized.post_injury_years IS 'JSONB array of post-injury employment years: [{year, income, percentEmployed}, ...]';
COMMENT ON COLUMN public.personal_injury_forms_normalized.uploaded_files IS 'JSONB array of uploaded files: [{fileName, fileUrl, fileSize, fileType, category, description}, ...]';

COMMENT ON COLUMN public.personal_injury_drafts_normalized.matter_no IS 'Matter number for law firm internal use only - not required for form submission';
COMMENT ON COLUMN public.personal_injury_drafts_normalized.household_members IS 'JSONB array of household members: [{fullName, dateOfBirth, relationship}, ...]';
COMMENT ON COLUMN public.personal_injury_drafts_normalized.pre_injury_years IS 'JSONB array of pre-injury employment years: [{year, income, percentEmployed}, ...]';
COMMENT ON COLUMN public.personal_injury_drafts_normalized.post_injury_years IS 'JSONB array of post-injury employment years: [{year, income, percentEmployed}, ...]';
COMMENT ON COLUMN public.personal_injury_drafts_normalized.uploaded_files IS 'JSONB array of uploaded files: [{fileName, fileUrl, fileSize, fileType, category, description}, ...]';

-- Drop existing policies if they exist and recreate them
DROP POLICY IF EXISTS "Users can manage their own normalized forms" ON public.personal_injury_forms_normalized;
DROP POLICY IF EXISTS "Firm members can view normalized forms from their firm" ON public.personal_injury_forms_normalized;
DROP POLICY IF EXISTS "Site admins can view all normalized forms" ON public.personal_injury_forms_normalized;
DROP POLICY IF EXISTS "Site admins can manage all normalized forms" ON public.personal_injury_forms_normalized;

DROP POLICY IF EXISTS "Users can manage their own normalized drafts" ON public.personal_injury_drafts_normalized;
DROP POLICY IF EXISTS "Firm members can view normalized drafts from their firm" ON public.personal_injury_drafts_normalized;
DROP POLICY IF EXISTS "Site admins can view all normalized drafts" ON public.personal_injury_drafts_normalized;
DROP POLICY IF EXISTS "Site admins can manage all normalized drafts" ON public.personal_injury_drafts_normalized;

-- Row Level Security Policies for normalized forms table
CREATE POLICY "Users can manage their own normalized forms" ON public.personal_injury_forms_normalized
    FOR ALL USING (submitted_by = auth.uid());

CREATE POLICY "Firm members can view normalized forms from their firm" ON public.personal_injury_forms_normalized
    FOR SELECT USING (
        firm_id IN (
            SELECT firm_id FROM public.user_profiles 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Site admins can view all normalized forms" ON public.personal_injury_forms_normalized
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE user_id = auth.uid() AND role = 'site_admin'
        )
    );

CREATE POLICY "Site admins can manage all normalized forms" ON public.personal_injury_forms_normalized
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE user_id = auth.uid() AND role = 'site_admin'
        )
    );

-- Row Level Security Policies for normalized drafts table
CREATE POLICY "Users can manage their own normalized drafts" ON public.personal_injury_drafts_normalized
    FOR ALL USING (submitted_by = auth.uid());

CREATE POLICY "Firm members can view normalized drafts from their firm" ON public.personal_injury_drafts_normalized
    FOR SELECT USING (
        firm_id IN (
            SELECT firm_id FROM public.user_profiles 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Site admins can view all normalized drafts" ON public.personal_injury_drafts_normalized
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE user_id = auth.uid() AND role = 'site_admin'
        )
    );

CREATE POLICY "Site admins can manage all normalized drafts" ON public.personal_injury_drafts_normalized
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE user_id = auth.uid() AND role = 'site_admin'
        )
    );

-- Enable RLS on the new tables
ALTER TABLE public.personal_injury_forms_normalized ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personal_injury_drafts_normalized ENABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_pi_forms_normalized_submitted_by ON public.personal_injury_forms_normalized(submitted_by);
CREATE INDEX IF NOT EXISTS idx_pi_forms_normalized_firm_id ON public.personal_injury_forms_normalized(firm_id);
CREATE INDEX IF NOT EXISTS idx_pi_forms_normalized_matter_no ON public.personal_injury_forms_normalized(matter_no) WHERE matter_no IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_pi_forms_normalized_incident_date ON public.personal_injury_forms_normalized(incident_date);
CREATE INDEX IF NOT EXISTS idx_pi_forms_normalized_last_name ON public.personal_injury_forms_normalized(last_name);
CREATE INDEX IF NOT EXISTS idx_pi_forms_normalized_email ON public.personal_injury_forms_normalized(email);

CREATE INDEX IF NOT EXISTS idx_pi_drafts_normalized_submitted_by ON public.personal_injury_drafts_normalized(submitted_by);
CREATE INDEX IF NOT EXISTS idx_pi_drafts_normalized_firm_id ON public.personal_injury_drafts_normalized(firm_id);
CREATE INDEX IF NOT EXISTS idx_pi_drafts_normalized_matter_no ON public.personal_injury_drafts_normalized(matter_no) WHERE matter_no IS NOT NULL;

-- Create GIN indexes for JSONB columns for better query performance
CREATE INDEX IF NOT EXISTS idx_pi_forms_normalized_household_members ON public.personal_injury_forms_normalized USING GIN (household_members);
CREATE INDEX IF NOT EXISTS idx_pi_forms_normalized_pre_injury_years ON public.personal_injury_forms_normalized USING GIN (pre_injury_years);
CREATE INDEX IF NOT EXISTS idx_pi_forms_normalized_post_injury_years ON public.personal_injury_forms_normalized USING GIN (post_injury_years);
CREATE INDEX IF NOT EXISTS idx_pi_forms_normalized_uploaded_files ON public.personal_injury_forms_normalized USING GIN (uploaded_files);

CREATE INDEX IF NOT EXISTS idx_pi_drafts_normalized_household_members ON public.personal_injury_drafts_normalized USING GIN (household_members);
CREATE INDEX IF NOT EXISTS idx_pi_drafts_normalized_pre_injury_years ON public.personal_injury_drafts_normalized USING GIN (pre_injury_years);
CREATE INDEX IF NOT EXISTS idx_pi_drafts_normalized_post_injury_years ON public.personal_injury_drafts_normalized USING GIN (post_injury_years);
CREATE INDEX IF NOT EXISTS idx_pi_drafts_normalized_uploaded_files ON public.personal_injury_drafts_normalized USING GIN (uploaded_files);

-- Verify the tables were created
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name IN ('personal_injury_forms_normalized', 'personal_injury_drafts_normalized')
AND column_name IN ('first_name', 'last_name', 'email', 'incident_date', 'matter_no', 'household_members')
ORDER BY table_name, ordinal_position;