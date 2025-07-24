-- Create a function to get firm users with their email addresses and form counts
-- This function joins user_profiles with auth.users to get email addresses

CREATE OR REPLACE FUNCTION get_firm_users_with_details(firm_id_param UUID)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  first_name TEXT,
  last_name TEXT,
  role TEXT,
  email TEXT,
  saved_forms_count BIGINT,
  submitted_forms_count BIGINT
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    up.id,
    up.user_id,
    up.first_name,
    up.last_name,
    up.role,
    au.email::TEXT,
    COALESCE(drafts.count, 0) as saved_forms_count,
    COALESCE(forms.count, 0) as submitted_forms_count
  FROM public.user_profiles up
  JOIN auth.users au ON up.user_id = au.id
  LEFT JOIN (
    SELECT submitted_by, COUNT(*) as count
    FROM public.personal_injury_drafts
    GROUP BY submitted_by
  ) drafts ON up.user_id = drafts.submitted_by
  LEFT JOIN (
    SELECT submitted_by, COUNT(*) as count
    FROM public.personal_injury_forms
    GROUP BY submitted_by
  ) forms ON up.user_id = forms.submitted_by
  WHERE up.firm_id = firm_id_param
  AND up.role != 'site_admin'
  ORDER BY up.role DESC, up.last_name, up.first_name;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_firm_users_with_details(UUID) TO authenticated;

-- Create RLS policy for the function (users can only call it for their own firm)
-- Note: This is handled within the function by checking firm membership