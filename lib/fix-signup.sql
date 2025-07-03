-- Fix signup issues by temporarily relaxing RLS policies

-- Temporarily allow anyone to insert into user_profiles during signup
CREATE POLICY "Allow signup profile creation" ON public.user_profiles
    FOR INSERT WITH CHECK (true);

-- Update the user creation function to handle potential RLS issues
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if this is the site admin email
    IF NEW.email = 'bradley@the-bradley-group.com' THEN
        INSERT INTO public.user_profiles (user_id, role, first_name, last_name)
        VALUES (NEW.id, 'site_admin', 'Bradley', 'Gibbs');
    END IF;
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Log the error but don't fail the user creation
        RAISE WARNING 'Failed to create user profile: %', SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Make sure the trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();