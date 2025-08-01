-- Create the missing audit trail function
CREATE OR REPLACE FUNCTION public.create_form_audit_entry(
  p_form_id TEXT,
  p_form_type TEXT,
  p_submitted_by UUID,
  p_firm_id UUID,
  p_action_type TEXT,
  p_metadata JSONB
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert into form_audit_trail table
  INSERT INTO public.form_audit_trail (
    form_id,
    form_type,
    submitted_by,
    firm_id,
    action_type,
    metadata,
    created_at
  ) VALUES (
    p_form_id,
    p_form_type,
    p_submitted_by,
    p_firm_id,
    p_action_type,
    p_metadata,
    NOW()
  );
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.create_form_audit_entry TO authenticated;

-- Create the form_audit_trail table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.form_audit_trail (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    form_id TEXT NOT NULL,
    form_type TEXT NOT NULL CHECK (form_type IN ('personal_injury', 'wrongful_death', 'wrongful_termination')),
    submitted_by UUID REFERENCES auth.users(id) NOT NULL,
    firm_id UUID REFERENCES public.firms(id),
    action_type TEXT NOT NULL CHECK (action_type IN ('submitted', 'updated', 'deleted', 'viewed')),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Enable RLS on the audit trail table
ALTER TABLE public.form_audit_trail ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for audit trail
DROP POLICY IF EXISTS "Users can view their own audit entries" ON public.form_audit_trail;
DROP POLICY IF EXISTS "Firm members can view firm audit entries" ON public.form_audit_trail;
DROP POLICY IF EXISTS "Site admins can view all audit entries" ON public.form_audit_trail;

CREATE POLICY "Users can view their own audit entries" ON public.form_audit_trail
    FOR SELECT USING (submitted_by = auth.uid());

CREATE POLICY "Firm members can view firm audit entries" ON public.form_audit_trail
    FOR SELECT USING (
        firm_id IN (
            SELECT firm_id FROM public.user_profiles 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Site admins can view all audit entries" ON public.form_audit_trail
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE user_id = auth.uid() AND role = 'site_admin'
        )
    );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_form_audit_trail_form_id ON public.form_audit_trail(form_id);
CREATE INDEX IF NOT EXISTS idx_form_audit_trail_submitted_by ON public.form_audit_trail(submitted_by);
CREATE INDEX IF NOT EXISTS idx_form_audit_trail_firm_id ON public.form_audit_trail(firm_id);
CREATE INDEX IF NOT EXISTS idx_form_audit_trail_action_type ON public.form_audit_trail(action_type);
CREATE INDEX IF NOT EXISTS idx_form_audit_trail_created_at ON public.form_audit_trail(created_at);

-- Create GIN index for JSONB metadata column
CREATE INDEX IF NOT EXISTS idx_form_audit_trail_metadata ON public.form_audit_trail USING GIN (metadata);