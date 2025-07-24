-- Form Submission Audit Trail Setup
-- This script creates tables and policies for tracking form submission history

-- Create form submission audit trail table
CREATE TABLE IF NOT EXISTS public.form_submission_audit (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    form_id UUID NOT NULL, -- References personal_injury_forms.id
    form_type TEXT NOT NULL CHECK (form_type IN ('personal_injury', 'wrongful_death', 'wrongful_termination')),
    submitted_by UUID REFERENCES auth.users(id) NOT NULL,
    firm_id UUID REFERENCES public.firms(id) NOT NULL,
    submission_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    action_type TEXT NOT NULL CHECK (action_type IN ('submitted', 'resubmitted', 'updated', 'deleted')),
    metadata JSONB, -- Additional metadata like IP address, user agent, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_form_audit_form_id ON public.form_submission_audit(form_id);
CREATE INDEX IF NOT EXISTS idx_form_audit_submitted_by ON public.form_submission_audit(submitted_by);
CREATE INDEX IF NOT EXISTS idx_form_audit_firm_id ON public.form_submission_audit(firm_id);
CREATE INDEX IF NOT EXISTS idx_form_audit_timestamp ON public.form_submission_audit(submission_timestamp);
CREATE INDEX IF NOT EXISTS idx_form_audit_form_type ON public.form_submission_audit(form_type);

-- Enable Row Level Security
ALTER TABLE public.form_submission_audit ENABLE ROW LEVEL SECURITY;

-- RLS Policies for form_submission_audit table

-- Site admins can view all audit records
CREATE POLICY "Site admins can view all audit records" ON public.form_submission_audit
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE user_id = auth.uid() AND role = 'site_admin'
        )
    );

-- Site admins can manage all audit records
CREATE POLICY "Site admins can manage all audit records" ON public.form_submission_audit
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE user_id = auth.uid() AND role = 'site_admin'
        )
    );

-- Firm admins can view audit records from their firm
CREATE POLICY "Firm admins can view firm audit records" ON public.form_submission_audit
    FOR SELECT USING (
        firm_id IN (
            SELECT firm_id FROM public.user_profiles 
            WHERE user_id = auth.uid() AND role = 'firm_admin'
        )
    );

-- Users can view their own audit records
CREATE POLICY "Users can view their own audit records" ON public.form_submission_audit
    FOR SELECT USING (submitted_by = auth.uid());

-- System can insert audit records (for automated tracking)
CREATE POLICY "System can insert audit records" ON public.form_submission_audit
    FOR INSERT WITH CHECK (true);

-- Function to automatically create audit trail entries
CREATE OR REPLACE FUNCTION public.create_form_audit_entry(
    p_form_id UUID,
    p_form_type TEXT,
    p_submitted_by UUID,
    p_firm_id UUID,
    p_action_type TEXT,
    p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID AS $$
DECLARE
    audit_id UUID;
BEGIN
    INSERT INTO public.form_submission_audit (
        form_id,
        form_type,
        submitted_by,
        firm_id,
        action_type,
        metadata,
        submission_timestamp
    ) VALUES (
        p_form_id,
        p_form_type,
        p_submitted_by,
        p_firm_id,
        p_action_type,
        p_metadata,
        NOW()
    ) RETURNING id INTO audit_id;
    
    RETURN audit_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get form submission history
CREATE OR REPLACE FUNCTION public.get_form_submission_history(
    p_form_id UUID DEFAULT NULL,
    p_user_id UUID DEFAULT NULL,
    p_firm_id UUID DEFAULT NULL,
    p_form_type TEXT DEFAULT NULL
)
RETURNS TABLE (
    id UUID,
    form_id UUID,
    form_type TEXT,
    submitted_by UUID,
    firm_id UUID,
    submission_timestamp TIMESTAMP WITH TIME ZONE,
    action_type TEXT,
    metadata JSONB,
    user_email TEXT,
    user_name TEXT,
    firm_name TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        a.id,
        a.form_id,
        a.form_type,
        a.submitted_by,
        a.firm_id,
        a.submission_timestamp,
        a.action_type,
        a.metadata,
        u.email as user_email,
        COALESCE(p.first_name || ' ' || p.last_name, 'Unknown User') as user_name,
        f.name as firm_name
    FROM public.form_submission_audit a
    LEFT JOIN auth.users u ON a.submitted_by = u.id
    LEFT JOIN public.user_profiles p ON a.submitted_by = p.user_id
    LEFT JOIN public.firms f ON a.firm_id = f.id
    WHERE 
        (p_form_id IS NULL OR a.form_id = p_form_id)
        AND (p_user_id IS NULL OR a.submitted_by = p_user_id)
        AND (p_firm_id IS NULL OR a.firm_id = p_firm_id)
        AND (p_form_type IS NULL OR a.form_type = p_form_type)
    ORDER BY a.submission_timestamp DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT ON public.form_submission_audit TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_form_audit_entry TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_form_submission_history TO authenticated;

-- Create a view for easier querying of recent submissions
CREATE OR REPLACE VIEW public.recent_form_submissions AS
SELECT 
    a.id,
    a.form_id,
    a.form_type,
    a.submitted_by,
    a.firm_id,
    a.submission_timestamp,
    a.action_type,
    u.email as user_email,
    COALESCE(p.first_name || ' ' || p.last_name, 'Unknown User') as user_name,
    f.name as firm_name,
    a.metadata
FROM public.form_submission_audit a
LEFT JOIN auth.users u ON a.submitted_by = u.id
LEFT JOIN public.user_profiles p ON a.submitted_by = p.user_id
LEFT JOIN public.firms f ON a.firm_id = f.id
WHERE a.submission_timestamp >= NOW() - INTERVAL '30 days'
ORDER BY a.submission_timestamp DESC;

-- Grant access to the view
GRANT SELECT ON public.recent_form_submissions TO authenticated;