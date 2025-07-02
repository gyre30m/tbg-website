-- Manual trigger function to create admin profile
-- Run this SQL in your Supabase dashboard

-- Create a manual trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user_manual(user_id UUID, user_email TEXT)
RETURNS VOID AS $$
BEGIN
    -- Check if this is the site admin email
    IF user_email = 'bradley@the-bradley-group.com' THEN
        INSERT INTO public.user_profiles (user_id, role, first_name, last_name)
        VALUES (user_id, 'site_admin', 'Bradley', 'Gibbs')
        ON CONFLICT (user_id) DO NOTHING;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permission to use this function
GRANT EXECUTE ON FUNCTION public.handle_new_user_manual(UUID, TEXT) TO authenticated;

-- You can now call this function manually:
-- SELECT public.handle_new_user_manual('[USER_ID]', 'bradley@the-bradley-group.com');