# Proper RLS Policy Fix for Supabase

## The Real Issue
Based on Supabase documentation, users should be able to read their own profiles with this standard pattern:

```sql
CREATE POLICY "Users can view own profile" 
ON public.user_profiles 
FOR SELECT 
USING (auth.uid() = user_id);
```

## Current Problem
Our policies might be malformed or conflicting. Let's start fresh.

## Step 1: Drop All Existing Policies
```sql
-- Drop all existing policies on user_profiles
DROP POLICY IF EXISTS "Admin email can manage all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.user_profiles;  
DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Authenticated users can read their own profile" ON public.user_profiles;
```

## Step 2: Create Standard Supabase Policies
```sql
-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile
CREATE POLICY "Enable read access for users based on user_id"
ON public.user_profiles 
FOR SELECT 
USING (auth.uid() = user_id);

-- Users can insert their own profile  
CREATE POLICY "Enable insert for users based on user_id"
ON public.user_profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Users can update their own profile
CREATE POLICY "Enable update for users based on user_id"
ON public.user_profiles 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Site admin can manage all profiles
CREATE POLICY "Enable full access for site admin"
ON public.user_profiles 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE user_id = auth.uid() 
    AND role = 'site_admin'
  )
  OR auth.jwt() ->> 'email' = 'bradley@the-bradley-group.com'
);
```

## Step 3: Test
After applying these policies, test with:
```sql
-- Test as the invited user
SET LOCAL role TO 'authenticated';
SET LOCAL request.jwt.claims TO '{"sub": "USER_ID_HERE"}';
SELECT * FROM public.user_profiles WHERE user_id = 'USER_ID_HERE';
RESET role;
```

This should return the user's profile without errors.

## Why This Should Work
- Follows Supabase's standard RLS pattern
- Uses `auth.uid() = user_id` which is the recommended approach
- Separates concerns: read, write, and admin access
- No conflicting policies