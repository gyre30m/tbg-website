-- Database Schema for Hierarchical Authentication System
-- Run this script to recreate all tables, policies, and triggers

-- First, ensure we're working in the public schema
SET search_path = public;

-- Create firms table
CREATE TABLE IF NOT EXISTS public.firms (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    domain TEXT NOT NULL UNIQUE,
    firm_admin_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user profiles table
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    firm_id UUID REFERENCES public.firms(id),
    role TEXT NOT NULL CHECK (role IN ('site_admin', 'firm_admin', 'user')),
    first_name TEXT,
    last_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Create user invitations table
CREATE TABLE IF NOT EXISTS public.user_invitations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL,
    firm_id UUID REFERENCES public.firms(id),
    role TEXT NOT NULL CHECK (role IN ('firm_admin', 'user')),
    invited_by UUID REFERENCES auth.users(id),
    invited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    accepted_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(email, firm_id)
);

-- Create personal injury forms table
CREATE TABLE IF NOT EXISTS public.personal_injury_forms (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    form_data JSONB NOT NULL,
    submitted_by UUID REFERENCES auth.users(id),
    firm_id UUID REFERENCES public.firms(id),
    status TEXT DEFAULT 'submitted' CHECK (status IN ('draft', 'submitted')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create personal injury drafts table
CREATE TABLE IF NOT EXISTS public.personal_injury_drafts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    form_data JSONB NOT NULL,
    submitted_by UUID REFERENCES auth.users(id),
    firm_id UUID REFERENCES public.firms(id),
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON public.user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_firm_id ON public.user_profiles(firm_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_personal_injury_forms_submitted_by ON public.personal_injury_forms(submitted_by);
CREATE INDEX IF NOT EXISTS idx_personal_injury_forms_firm_id ON public.personal_injury_forms(firm_id);
CREATE INDEX IF NOT EXISTS idx_personal_injury_drafts_submitted_by ON public.personal_injury_drafts(submitted_by);
CREATE INDEX IF NOT EXISTS idx_personal_injury_drafts_firm_id ON public.personal_injury_drafts(firm_id);
CREATE INDEX IF NOT EXISTS idx_user_invitations_email ON public.user_invitations(email);
CREATE INDEX IF NOT EXISTS idx_user_invitations_firm_id ON public.user_invitations(firm_id);

-- Enable Row Level Security on all tables
ALTER TABLE public.firms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personal_injury_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personal_injury_drafts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Site admins can manage all firms" ON public.firms;
DROP POLICY IF EXISTS "Firm admins can view their own firm" ON public.firms;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Site admins can manage all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Firm admins can view users in their firm" ON public.user_profiles;
DROP POLICY IF EXISTS "Firm admins can create profiles for their firm" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can manage their own forms" ON public.personal_injury_forms;
DROP POLICY IF EXISTS "Firm members can view forms from their firm" ON public.personal_injury_forms;
DROP POLICY IF EXISTS "Site admins can view all forms" ON public.personal_injury_forms;
DROP POLICY IF EXISTS "Users can manage their own drafts" ON public.personal_injury_drafts;
DROP POLICY IF EXISTS "Firm members can view drafts from their firm" ON public.personal_injury_drafts;
DROP POLICY IF EXISTS "Site admins can view all drafts" ON public.personal_injury_drafts;
DROP POLICY IF EXISTS "Site admins can manage all invitations" ON public.user_invitations;
DROP POLICY IF EXISTS "Firm admins can manage invitations for their firm" ON public.user_invitations;

-- Firms table policies
CREATE POLICY "Site admins can manage all firms" ON public.firms
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE user_id = auth.uid() AND role = 'site_admin'
        )
    );

CREATE POLICY "Firm admins can view their own firm" ON public.firms
    FOR SELECT USING (
        id IN (
            SELECT firm_id FROM public.user_profiles 
            WHERE user_id = auth.uid() AND role IN ('firm_admin', 'user')
        )
    );

-- User profiles policies
CREATE POLICY "Users can view their own profile" ON public.user_profiles
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their own profile" ON public.user_profiles
    FOR UPDATE USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Site admins can manage all profiles" ON public.user_profiles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE user_id = auth.uid() AND role = 'site_admin'
        )
    );

CREATE POLICY "Firm admins can view users in their firm" ON public.user_profiles
    FOR SELECT USING (
        firm_id IN (
            SELECT firm_id FROM public.user_profiles 
            WHERE user_id = auth.uid() AND role = 'firm_admin'
        )
    );

CREATE POLICY "Firm admins can create profiles for their firm" ON public.user_profiles
    FOR INSERT WITH CHECK (
        firm_id IN (
            SELECT firm_id FROM public.user_profiles 
            WHERE user_id = auth.uid() AND role = 'firm_admin'
        )
    );

-- User invitations policies
CREATE POLICY "Site admins can manage all invitations" ON public.user_invitations
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE user_id = auth.uid() AND role = 'site_admin'
        )
    );

CREATE POLICY "Firm admins can manage invitations for their firm" ON public.user_invitations
    FOR ALL USING (
        firm_id IN (
            SELECT firm_id FROM public.user_profiles 
            WHERE user_id = auth.uid() AND role = 'firm_admin'
        )
    );

-- Personal injury forms policies
CREATE POLICY "Users can manage their own forms" ON public.personal_injury_forms
    FOR ALL USING (submitted_by = auth.uid());

CREATE POLICY "Firm members can view forms from their firm" ON public.personal_injury_forms
    FOR SELECT USING (
        firm_id IN (
            SELECT firm_id FROM public.user_profiles 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Site admins can view all forms" ON public.personal_injury_forms
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE user_id = auth.uid() AND role = 'site_admin'
        )
    );

-- Personal injury drafts policies
CREATE POLICY "Users can manage their own drafts" ON public.personal_injury_drafts
    FOR ALL USING (submitted_by = auth.uid());

CREATE POLICY "Firm members can view drafts from their firm" ON public.personal_injury_drafts
    FOR SELECT USING (
        firm_id IN (
            SELECT firm_id FROM public.user_profiles 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Site admins can view all drafts" ON public.personal_injury_drafts
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE user_id = auth.uid() AND role = 'site_admin'
        )
    );

-- Function to automatically create user profile for site admin
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if this is the site admin email
    IF NEW.email = 'bradley@the-bradley-group.com' THEN
        INSERT INTO public.user_profiles (user_id, role, first_name, last_name)
        VALUES (NEW.id, 'site_admin', 'Bradley', 'Gibbs')
        ON CONFLICT (user_id) DO NOTHING;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger to automatically create profile for new users
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at columns
CREATE TRIGGER update_firms_updated_at BEFORE UPDATE ON public.firms
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_personal_injury_forms_updated_at BEFORE UPDATE ON public.personal_injury_forms
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_personal_injury_drafts_updated_at BEFORE UPDATE ON public.personal_injury_drafts
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Grant permissions for the service role (for admin operations)
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- Enable realtime for tables that might need it
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.personal_injury_forms;
ALTER PUBLICATION supabase_realtime ADD TABLE public.personal_injury_drafts;

-- Verify setup
SELECT 'Database setup completed successfully!' as status;