-- Create wrongful death forms tables
-- Based on the personal injury forms structure with matter_no field included

-- Create wrongful death forms table
CREATE TABLE IF NOT EXISTS public.wrongful_death_forms (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    form_data JSONB NOT NULL,
    matter_no TEXT,
    submitted_by UUID REFERENCES auth.users(id),
    firm_id UUID REFERENCES public.firms(id),
    status TEXT DEFAULT 'submitted' CHECK (status IN ('draft', 'submitted')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create wrongful death drafts table
CREATE TABLE IF NOT EXISTS public.wrongful_death_drafts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    form_data JSONB NOT NULL,
    matter_no TEXT,
    submitted_by UUID REFERENCES auth.users(id),
    firm_id UUID REFERENCES public.firms(id),
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add comments
COMMENT ON COLUMN public.wrongful_death_forms.matter_no IS 'Matter number for law firm internal use only - not required for form submission';
COMMENT ON COLUMN public.wrongful_death_drafts.matter_no IS 'Matter number for law firm internal use only - not required for form submission';

-- Row Level Security Policies for wrongful death forms
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

-- Row Level Security Policies for wrongful death drafts
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

-- Enable RLS on the new tables
ALTER TABLE public.wrongful_death_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wrongful_death_drafts ENABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_wrongful_death_forms_submitted_by ON public.wrongful_death_forms(submitted_by);
CREATE INDEX IF NOT EXISTS idx_wrongful_death_forms_firm_id ON public.wrongful_death_forms(firm_id);
CREATE INDEX IF NOT EXISTS idx_wrongful_death_forms_matter_no ON public.wrongful_death_forms(matter_no) WHERE matter_no IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_wrongful_death_drafts_submitted_by ON public.wrongful_death_drafts(submitted_by);
CREATE INDEX IF NOT EXISTS idx_wrongful_death_drafts_firm_id ON public.wrongful_death_drafts(firm_id);
CREATE INDEX IF NOT EXISTS idx_wrongful_death_drafts_matter_no ON public.wrongful_death_drafts(matter_no) WHERE matter_no IS NOT NULL;

-- Verify the tables were created
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name IN ('wrongful_death_forms', 'wrongful_death_drafts')
ORDER BY table_name, ordinal_position;