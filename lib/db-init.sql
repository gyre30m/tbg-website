-- Database Schema for Hierarchical Authentication System

-- Enable Row Level Security
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

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
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    firm_id UUID REFERENCES public.firms(id),
    role TEXT NOT NULL CHECK (role IN ('site_admin', 'firm_admin', 'user')),
    first_name TEXT,
    last_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
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

-- Update personal injury forms table
CREATE TABLE IF NOT EXISTS public.personal_injury_forms (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    form_data JSONB NOT NULL,
    submitted_by UUID REFERENCES auth.users(id),
    firm_id UUID REFERENCES public.firms(id),
    status TEXT DEFAULT 'submitted' CHECK (status IN ('draft', 'submitted')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Update personal injury drafts table
CREATE TABLE IF NOT EXISTS public.personal_injury_drafts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    form_data JSONB NOT NULL,
    submitted_by UUID REFERENCES auth.users(id),
    firm_id UUID REFERENCES public.firms(id),
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security Policies

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

-- Personal injury drafts policies (same as forms)
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

-- Function to automatically create user profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if this is the site admin email
    IF NEW.email = 'bradley@the-bradley-group.com' THEN
        INSERT INTO public.user_profiles (user_id, role)
        VALUES (NEW.id, 'site_admin');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile for new users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable RLS on all tables
ALTER TABLE public.firms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personal_injury_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personal_injury_drafts ENABLE ROW LEVEL SECURITY;

-- Insert initial site admin if not exists (replace with actual user ID after creation)
-- This should be run after bradley@the-bradley-group.com creates an account
-- INSERT INTO public.user_profiles (user_id, role) 
-- VALUES ('REPLACE_WITH_ACTUAL_USER_ID', 'site_admin') 
-- ON CONFLICT (user_id) DO NOTHING;