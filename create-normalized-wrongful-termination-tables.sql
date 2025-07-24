-- Create normalized wrongful termination forms tables
-- Based on comprehensive analysis of all wrongful termination form fields

-- Create normalized wrongful termination forms table
CREATE TABLE IF NOT EXISTS public.wrongful_termination_forms_normalized (
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
    phone_number TEXT NOT NULL,
    phone_type TEXT NOT NULL CHECK (phone_type IN ('mobile', 'home', 'work', 'other')),
    
    -- Demographics (all required)
    gender TEXT NOT NULL CHECK (gender IN ('male', 'female', 'non-binary')),
    marital_status TEXT NOT NULL CHECK (marital_status IN ('single', 'married', 'divorced', 'widowed', 'separated', 'domestic-partnership')),
    date_of_birth DATE NOT NULL,
    date_of_termination DATE NOT NULL,
    ethnicity TEXT NOT NULL CHECK (ethnicity IN ('american-indian-alaska-native', 'asian', 'black-african-american', 'hispanic-latino', 'native-hawaiian-pacific-islander', 'white', 'two-or-more-races')),
    
    -- Education (all required)
    pre_termination_education TEXT NOT NULL CHECK (pre_termination_education IN ('high-school', 'some-college', 'associates', 'bachelors', 'masters', 'doctorate', 'professional', 'other')),
    pre_termination_skills TEXT NOT NULL,
    pre_termination_education_plans TEXT NOT NULL,
    post_termination_education TEXT NOT NULL,
    
    -- Pre-Termination Employment (all required except benefits)
    pre_termination_employment_status TEXT NOT NULL CHECK (pre_termination_employment_status IN ('full-time', 'part-time', 'contract', 'temporary', 'self-employed', 'unemployed')),
    pre_termination_job_title TEXT NOT NULL,
    pre_termination_employer TEXT NOT NULL,
    pre_termination_start_date DATE NOT NULL,
    pre_termination_salary TEXT NOT NULL,
    pre_termination_duties TEXT NOT NULL,
    pre_termination_advancements TEXT NOT NULL,
    pre_termination_overtime TEXT NOT NULL,
    pre_termination_work_steady TEXT NOT NULL,
    pre_termination_retirement_age TEXT NOT NULL,
    pre_termination_career_trajectory TEXT NOT NULL,
    pre_termination_job_expenses TEXT NOT NULL,
    
    -- Pre-Termination Benefits (optional)
    pre_termination_life_insurance TEXT,
    pre_termination_individual_health TEXT,
    pre_termination_family_health TEXT,
    pre_termination_retirement_plan TEXT,
    pre_termination_investment_plan TEXT,
    pre_termination_bonus TEXT,
    pre_termination_stock_options TEXT,
    pre_termination_other_benefits TEXT,
    
    -- Post-Termination Employment (all optional)
    post_termination_employment_status TEXT CHECK (post_termination_employment_status IS NULL OR post_termination_employment_status IN ('full-time', 'part-time', 'contract', 'temporary', 'self-employed', 'unemployed', 'not-applicable')),
    post_termination_job_title TEXT,
    post_termination_employer TEXT,
    post_termination_start_date DATE,
    post_termination_salary TEXT,
    post_termination_duties TEXT,
    post_termination_advancements TEXT,
    post_termination_overtime TEXT,
    post_termination_work_steady TEXT,
    post_termination_retirement_age TEXT,
    post_termination_job_expenses TEXT,
    
    -- Post-Termination Benefits (optional)
    post_termination_life_insurance TEXT,
    post_termination_individual_health TEXT,
    post_termination_family_health TEXT,
    post_termination_retirement_plan TEXT,
    post_termination_investment_plan TEXT,
    post_termination_bonus TEXT,
    post_termination_stock_options TEXT,
    post_termination_other_benefits TEXT,
    
    -- Litigation (all required except matter_no)
    settlement_date DATE NOT NULL,
    trial_date DATE NOT NULL,
    trial_location TEXT NOT NULL,
    opposing_counsel_firm TEXT NOT NULL,
    opposing_economist TEXT NOT NULL,
    
    -- Other Information (required)
    additional_info TEXT NOT NULL,
    
    -- Complex data stored as JSONB arrays
    pre_termination_years JSONB DEFAULT '[]'::jsonb,  -- Array of {year, income, percentEmployed}
    post_termination_years JSONB DEFAULT '[]'::jsonb, -- Array of {year, income, percentEmployed}
    
    -- File uploads stored as JSONB array
    -- Each file: {fileName, fileUrl, fileSize, fileType, category, description}
    uploaded_files JSONB DEFAULT '[]'::jsonb
);

-- Create corresponding drafts table with same structure but different status constraint
CREATE TABLE IF NOT EXISTS public.wrongful_termination_drafts_normalized (
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
    phone_number TEXT,
    phone_type TEXT CHECK (phone_type IS NULL OR phone_type IN ('mobile', 'home', 'work', 'other')),
    
    -- Demographics
    gender TEXT CHECK (gender IS NULL OR gender IN ('male', 'female', 'non-binary')),
    marital_status TEXT CHECK (marital_status IS NULL OR marital_status IN ('single', 'married', 'divorced', 'widowed', 'separated', 'domestic-partnership')),
    date_of_birth DATE,
    date_of_termination DATE,
    ethnicity TEXT CHECK (ethnicity IS NULL OR ethnicity IN ('american-indian-alaska-native', 'asian', 'black-african-american', 'hispanic-latino', 'native-hawaiian-pacific-islander', 'white', 'two-or-more-races')),
    
    -- Education
    pre_termination_education TEXT CHECK (pre_termination_education IS NULL OR pre_termination_education IN ('high-school', 'some-college', 'associates', 'bachelors', 'masters', 'doctorate', 'professional', 'other')),
    pre_termination_skills TEXT,
    pre_termination_education_plans TEXT,
    post_termination_education TEXT,
    
    -- Pre-Termination Employment
    pre_termination_employment_status TEXT CHECK (pre_termination_employment_status IS NULL OR pre_termination_employment_status IN ('full-time', 'part-time', 'contract', 'temporary', 'self-employed', 'unemployed')),
    pre_termination_job_title TEXT,
    pre_termination_employer TEXT,
    pre_termination_start_date DATE,
    pre_termination_salary TEXT,
    pre_termination_duties TEXT,
    pre_termination_advancements TEXT,
    pre_termination_overtime TEXT,
    pre_termination_work_steady TEXT,
    pre_termination_retirement_age TEXT,
    pre_termination_career_trajectory TEXT,
    pre_termination_job_expenses TEXT,
    
    -- Pre-Termination Benefits
    pre_termination_life_insurance TEXT,
    pre_termination_individual_health TEXT,
    pre_termination_family_health TEXT,
    pre_termination_retirement_plan TEXT,
    pre_termination_investment_plan TEXT,
    pre_termination_bonus TEXT,
    pre_termination_stock_options TEXT,
    pre_termination_other_benefits TEXT,
    
    -- Post-Termination Employment
    post_termination_employment_status TEXT CHECK (post_termination_employment_status IS NULL OR post_termination_employment_status IN ('full-time', 'part-time', 'contract', 'temporary', 'self-employed', 'unemployed', 'not-applicable')),
    post_termination_job_title TEXT,
    post_termination_employer TEXT,
    post_termination_start_date DATE,
    post_termination_salary TEXT,
    post_termination_duties TEXT,
    post_termination_advancements TEXT,
    post_termination_overtime TEXT,
    post_termination_work_steady TEXT,
    post_termination_retirement_age TEXT,
    post_termination_job_expenses TEXT,
    
    -- Post-Termination Benefits
    post_termination_life_insurance TEXT,
    post_termination_individual_health TEXT,
    post_termination_family_health TEXT,
    post_termination_retirement_plan TEXT,
    post_termination_investment_plan TEXT,
    post_termination_bonus TEXT,
    post_termination_stock_options TEXT,
    post_termination_other_benefits TEXT,
    
    -- Litigation
    settlement_date DATE,
    trial_date DATE,
    trial_location TEXT,
    opposing_counsel_firm TEXT,
    opposing_economist TEXT,
    
    -- Other Information
    additional_info TEXT,
    
    -- Complex data stored as JSONB arrays
    pre_termination_years JSONB DEFAULT '[]'::jsonb,
    post_termination_years JSONB DEFAULT '[]'::jsonb,
    uploaded_files JSONB DEFAULT '[]'::jsonb
);

-- Add comments for documentation
COMMENT ON COLUMN public.wrongful_termination_forms_normalized.matter_no IS 'Matter number for law firm internal use only - not required for form submission';
COMMENT ON COLUMN public.wrongful_termination_forms_normalized.pre_termination_years IS 'JSONB array of pre-termination employment years: [{year, income, percentEmployed}, ...]';
COMMENT ON COLUMN public.wrongful_termination_forms_normalized.post_termination_years IS 'JSONB array of post-termination employment years: [{year, income, percentEmployed}, ...]';
COMMENT ON COLUMN public.wrongful_termination_forms_normalized.uploaded_files IS 'JSONB array of uploaded files: [{fileName, fileUrl, fileSize, fileType, category, description}, ...]';

COMMENT ON COLUMN public.wrongful_termination_drafts_normalized.matter_no IS 'Matter number for law firm internal use only - not required for form submission';
COMMENT ON COLUMN public.wrongful_termination_drafts_normalized.pre_termination_years IS 'JSONB array of pre-termination employment years: [{year, income, percentEmployed}, ...]';
COMMENT ON COLUMN public.wrongful_termination_drafts_normalized.post_termination_years IS 'JSONB array of post-termination employment years: [{year, income, percentEmployed}, ...]';
COMMENT ON COLUMN public.wrongful_termination_drafts_normalized.uploaded_files IS 'JSONB array of uploaded files: [{fileName, fileUrl, fileSize, fileType, category, description}, ...]';

-- Row Level Security Policies for normalized forms table
CREATE POLICY "Users can manage their own normalized wrongful termination forms" ON public.wrongful_termination_forms_normalized
    FOR ALL USING (submitted_by = auth.uid());

CREATE POLICY "Firm members can view normalized wrongful termination forms from their firm" ON public.wrongful_termination_forms_normalized
    FOR SELECT USING (
        firm_id IN (
            SELECT firm_id FROM public.user_profiles 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Site admins can view all normalized wrongful termination forms" ON public.wrongful_termination_forms_normalized
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE user_id = auth.uid() AND role = 'site_admin'
        )
    );

CREATE POLICY "Site admins can manage all normalized wrongful termination forms" ON public.wrongful_termination_forms_normalized
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE user_id = auth.uid() AND role = 'site_admin'
        )
    );

-- Row Level Security Policies for normalized drafts table
CREATE POLICY "Users can manage their own normalized wrongful termination drafts" ON public.wrongful_termination_drafts_normalized
    FOR ALL USING (submitted_by = auth.uid());

CREATE POLICY "Firm members can view normalized wrongful termination drafts from their firm" ON public.wrongful_termination_drafts_normalized
    FOR SELECT USING (
        firm_id IN (
            SELECT firm_id FROM public.user_profiles 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Site admins can view all normalized wrongful termination drafts" ON public.wrongful_termination_drafts_normalized
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE user_id = auth.uid() AND role = 'site_admin'
        )
    );

CREATE POLICY "Site admins can manage all normalized wrongful termination drafts" ON public.wrongful_termination_drafts_normalized
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE user_id = auth.uid() AND role = 'site_admin'
        )
    );

-- Enable RLS on the new tables
ALTER TABLE public.wrongful_termination_forms_normalized ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wrongful_termination_drafts_normalized ENABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_wt_forms_normalized_submitted_by ON public.wrongful_termination_forms_normalized(submitted_by);
CREATE INDEX IF NOT EXISTS idx_wt_forms_normalized_firm_id ON public.wrongful_termination_forms_normalized(firm_id);
CREATE INDEX IF NOT EXISTS idx_wt_forms_normalized_matter_no ON public.wrongful_termination_forms_normalized(matter_no) WHERE matter_no IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_wt_forms_normalized_date_of_termination ON public.wrongful_termination_forms_normalized(date_of_termination);
CREATE INDEX IF NOT EXISTS idx_wt_forms_normalized_last_name ON public.wrongful_termination_forms_normalized(last_name);
CREATE INDEX IF NOT EXISTS idx_wt_forms_normalized_email ON public.wrongful_termination_forms_normalized(email);

CREATE INDEX IF NOT EXISTS idx_wt_drafts_normalized_submitted_by ON public.wrongful_termination_drafts_normalized(submitted_by);
CREATE INDEX IF NOT EXISTS idx_wt_drafts_normalized_firm_id ON public.wrongful_termination_drafts_normalized(firm_id);
CREATE INDEX IF NOT EXISTS idx_wt_drafts_normalized_matter_no ON public.wrongful_termination_drafts_normalized(matter_no) WHERE matter_no IS NOT NULL;

-- Create GIN indexes for JSONB columns for better query performance
CREATE INDEX IF NOT EXISTS idx_wt_forms_normalized_pre_termination_years ON public.wrongful_termination_forms_normalized USING GIN (pre_termination_years);
CREATE INDEX IF NOT EXISTS idx_wt_forms_normalized_post_termination_years ON public.wrongful_termination_forms_normalized USING GIN (post_termination_years);
CREATE INDEX IF NOT EXISTS idx_wt_forms_normalized_uploaded_files ON public.wrongful_termination_forms_normalized USING GIN (uploaded_files);

CREATE INDEX IF NOT EXISTS idx_wt_drafts_normalized_pre_termination_years ON public.wrongful_termination_drafts_normalized USING GIN (pre_termination_years);
CREATE INDEX IF NOT EXISTS idx_wt_drafts_normalized_post_termination_years ON public.wrongful_termination_drafts_normalized USING GIN (post_termination_years);
CREATE INDEX IF NOT EXISTS idx_wt_drafts_normalized_uploaded_files ON public.wrongful_termination_drafts_normalized USING GIN (uploaded_files);

-- Verify the tables were created
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name IN ('wrongful_termination_forms_normalized', 'wrongful_termination_drafts_normalized')
AND column_name IN ('first_name', 'last_name', 'email', 'date_of_termination', 'matter_no')
ORDER BY table_name, ordinal_position;