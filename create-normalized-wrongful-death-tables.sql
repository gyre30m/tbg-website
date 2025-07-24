-- Create normalized wrongful death forms tables
-- Based on comprehensive analysis of all wrongful death form fields

-- Create normalized wrongful death forms table
CREATE TABLE IF NOT EXISTS public.wrongful_death_forms_normalized (
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
    
    -- Demographics (all required)
    gender TEXT NOT NULL CHECK (gender IN ('male', 'female', 'non-binary')),
    marital_status TEXT NOT NULL CHECK (marital_status IN ('single', 'married', 'divorced', 'widowed', 'separated', 'domestic-partnership')),
    date_of_birth DATE NOT NULL,
    date_of_death DATE NOT NULL,
    ethnicity TEXT NOT NULL CHECK (ethnicity IN ('american-indian-alaska-native', 'asian', 'black-african-american', 'hispanic-latino', 'native-hawaiian-pacific-islander', 'white', 'two-or-more-races')),
    
    -- Medical Information (all required)
    health_issues TEXT NOT NULL,
    work_missed TEXT NOT NULL,
    
    -- Education and Employment (all required except benefits)
    education_level TEXT NOT NULL,
    skills_licenses TEXT NOT NULL,
    employment_status TEXT NOT NULL CHECK (employment_status IN ('full-time', 'part-time', 'self-employed', 'unemployed', 'student', 'retired')),
    job_title TEXT NOT NULL,
    employer_name TEXT NOT NULL,
    start_date DATE NOT NULL,
    salary TEXT NOT NULL,
    work_duties TEXT NOT NULL,
    advancements TEXT NOT NULL,
    overtime TEXT NOT NULL,
    work_steady TEXT NOT NULL,
    retirement_age TEXT NOT NULL,
    career_trajectory TEXT NOT NULL,
    job_expenses TEXT NOT NULL,
    
    -- Benefits (optional)
    life_insurance TEXT,
    individual_health TEXT,
    family_health TEXT,
    retirement_plan TEXT,
    investment_plan TEXT,
    bonus TEXT,
    stock_options TEXT,
    other_benefits TEXT,
    
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
    
    -- Other Information (required)
    additional_info TEXT NOT NULL,
    
    -- Complex data stored as JSONB arrays
    household_dependents JSONB DEFAULT '[]'::jsonb, -- Array of {fullName, dateOfBirth, relationship}
    other_dependents JSONB DEFAULT '[]'::jsonb,     -- Array of {fullName, dateOfBirth, relationship}
    employment_years JSONB DEFAULT '[]'::jsonb,     -- Array of {year, income, percentEmployed}
    
    -- File uploads stored as JSONB array
    -- Each file: {fileName, fileUrl, fileSize, fileType, category, description}
    uploaded_files JSONB DEFAULT '[]'::jsonb
);

-- Create corresponding drafts table with same structure but different status constraint
CREATE TABLE IF NOT EXISTS public.wrongful_death_drafts_normalized (
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
    
    -- Demographics
    gender TEXT CHECK (gender IS NULL OR gender IN ('male', 'female', 'non-binary')),
    marital_status TEXT CHECK (marital_status IS NULL OR marital_status IN ('single', 'married', 'divorced', 'widowed', 'separated', 'domestic-partnership')),
    date_of_birth DATE,
    date_of_death DATE,
    ethnicity TEXT CHECK (ethnicity IS NULL OR ethnicity IN ('american-indian-alaska-native', 'asian', 'black-african-american', 'hispanic-latino', 'native-hawaiian-pacific-islander', 'white', 'two-or-more-races')),
    
    -- Medical Information
    health_issues TEXT,
    work_missed TEXT,
    
    -- Education and Employment
    education_level TEXT,
    skills_licenses TEXT,
    employment_status TEXT CHECK (employment_status IS NULL OR employment_status IN ('full-time', 'part-time', 'self-employed', 'unemployed', 'student', 'retired')),
    job_title TEXT,
    employer_name TEXT,
    start_date DATE,
    salary TEXT,
    work_duties TEXT,
    advancements TEXT,
    overtime TEXT,
    work_steady TEXT,
    retirement_age TEXT,
    career_trajectory TEXT,
    job_expenses TEXT,
    
    -- Benefits
    life_insurance TEXT,
    individual_health TEXT,
    family_health TEXT,
    retirement_plan TEXT,
    investment_plan TEXT,
    bonus TEXT,
    stock_options TEXT,
    other_benefits TEXT,
    
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
    
    -- Other Information
    additional_info TEXT,
    
    -- Complex data stored as JSONB arrays
    household_dependents JSONB DEFAULT '[]'::jsonb,
    other_dependents JSONB DEFAULT '[]'::jsonb,
    employment_years JSONB DEFAULT '[]'::jsonb,
    uploaded_files JSONB DEFAULT '[]'::jsonb
);

-- Add comments for documentation
COMMENT ON COLUMN public.wrongful_death_forms_normalized.matter_no IS 'Matter number for law firm internal use only - not required for form submission';
COMMENT ON COLUMN public.wrongful_death_forms_normalized.household_dependents IS 'JSONB array of household dependents: [{fullName, dateOfBirth, relationship}, ...]';
COMMENT ON COLUMN public.wrongful_death_forms_normalized.other_dependents IS 'JSONB array of other dependents: [{fullName, dateOfBirth, relationship}, ...]';
COMMENT ON COLUMN public.wrongful_death_forms_normalized.employment_years IS 'JSONB array of employment years: [{year, income, percentEmployed}, ...]';
COMMENT ON COLUMN public.wrongful_death_forms_normalized.uploaded_files IS 'JSONB array of uploaded files: [{fileName, fileUrl, fileSize, fileType, category, description}, ...]';

COMMENT ON COLUMN public.wrongful_death_drafts_normalized.matter_no IS 'Matter number for law firm internal use only - not required for form submission';
COMMENT ON COLUMN public.wrongful_death_drafts_normalized.household_dependents IS 'JSONB array of household dependents: [{fullName, dateOfBirth, relationship}, ...]';
COMMENT ON COLUMN public.wrongful_death_drafts_normalized.other_dependents IS 'JSONB array of other dependents: [{fullName, dateOfBirth, relationship}, ...]';
COMMENT ON COLUMN public.wrongful_death_drafts_normalized.employment_years IS 'JSONB array of employment years: [{year, income, percentEmployed}, ...]';
COMMENT ON COLUMN public.wrongful_death_drafts_normalized.uploaded_files IS 'JSONB array of uploaded files: [{fileName, fileUrl, fileSize, fileType, category, description}, ...]';

-- Row Level Security Policies for normalized forms table
CREATE POLICY "Users can manage their own normalized wrongful death forms" ON public.wrongful_death_forms_normalized
    FOR ALL USING (submitted_by = auth.uid());

CREATE POLICY "Firm members can view normalized wrongful death forms from their firm" ON public.wrongful_death_forms_normalized
    FOR SELECT USING (
        firm_id IN (
            SELECT firm_id FROM public.user_profiles 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Site admins can view all normalized wrongful death forms" ON public.wrongful_death_forms_normalized
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE user_id = auth.uid() AND role = 'site_admin'
        )
    );

CREATE POLICY "Site admins can manage all normalized wrongful death forms" ON public.wrongful_death_forms_normalized
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE user_id = auth.uid() AND role = 'site_admin'
        )
    );

-- Row Level Security Policies for normalized drafts table
CREATE POLICY "Users can manage their own normalized wrongful death drafts" ON public.wrongful_death_drafts_normalized
    FOR ALL USING (submitted_by = auth.uid());

CREATE POLICY "Firm members can view normalized wrongful death drafts from their firm" ON public.wrongful_death_drafts_normalized
    FOR SELECT USING (
        firm_id IN (
            SELECT firm_id FROM public.user_profiles 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Site admins can view all normalized wrongful death drafts" ON public.wrongful_death_drafts_normalized
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE user_id = auth.uid() AND role = 'site_admin'
        )
    );

CREATE POLICY "Site admins can manage all normalized wrongful death drafts" ON public.wrongful_death_drafts_normalized
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE user_id = auth.uid() AND role = 'site_admin'
        )
    );

-- Enable RLS on the new tables
ALTER TABLE public.wrongful_death_forms_normalized ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wrongful_death_drafts_normalized ENABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_wd_forms_normalized_submitted_by ON public.wrongful_death_forms_normalized(submitted_by);
CREATE INDEX IF NOT EXISTS idx_wd_forms_normalized_firm_id ON public.wrongful_death_forms_normalized(firm_id);
CREATE INDEX IF NOT EXISTS idx_wd_forms_normalized_matter_no ON public.wrongful_death_forms_normalized(matter_no) WHERE matter_no IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_wd_forms_normalized_date_of_death ON public.wrongful_death_forms_normalized(date_of_death);
CREATE INDEX IF NOT EXISTS idx_wd_forms_normalized_last_name ON public.wrongful_death_forms_normalized(last_name);

CREATE INDEX IF NOT EXISTS idx_wd_drafts_normalized_submitted_by ON public.wrongful_death_drafts_normalized(submitted_by);
CREATE INDEX IF NOT EXISTS idx_wd_drafts_normalized_firm_id ON public.wrongful_death_drafts_normalized(firm_id);
CREATE INDEX IF NOT EXISTS idx_wd_drafts_normalized_matter_no ON public.wrongful_death_drafts_normalized(matter_no) WHERE matter_no IS NOT NULL;

-- Create GIN indexes for JSONB columns for better query performance
CREATE INDEX IF NOT EXISTS idx_wd_forms_normalized_household_dependents ON public.wrongful_death_forms_normalized USING GIN (household_dependents);
CREATE INDEX IF NOT EXISTS idx_wd_forms_normalized_other_dependents ON public.wrongful_death_forms_normalized USING GIN (other_dependents);
CREATE INDEX IF NOT EXISTS idx_wd_forms_normalized_employment_years ON public.wrongful_death_forms_normalized USING GIN (employment_years);
CREATE INDEX IF NOT EXISTS idx_wd_forms_normalized_uploaded_files ON public.wrongful_death_forms_normalized USING GIN (uploaded_files);

CREATE INDEX IF NOT EXISTS idx_wd_drafts_normalized_household_dependents ON public.wrongful_death_drafts_normalized USING GIN (household_dependents);
CREATE INDEX IF NOT EXISTS idx_wd_drafts_normalized_other_dependents ON public.wrongful_death_drafts_normalized USING GIN (other_dependents);
CREATE INDEX IF NOT EXISTS idx_wd_drafts_normalized_employment_years ON public.wrongful_death_drafts_normalized USING GIN (employment_years);
CREATE INDEX IF NOT EXISTS idx_wd_drafts_normalized_uploaded_files ON public.wrongful_death_drafts_normalized USING GIN (uploaded_files);

-- Verify the tables were created
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name IN ('wrongful_death_forms_normalized', 'wrongful_death_drafts_normalized')
AND column_name IN ('first_name', 'last_name', 'date_of_death', 'matter_no', 'household_dependents')
ORDER BY table_name, ordinal_position;