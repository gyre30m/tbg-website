# Missing RLS Policies for User Profiles

## Issue
Users getting 406 errors when trying to fetch their own profiles after creation, even though profile creation succeeds.

## Root Cause
The `user_profiles` table is missing essential RLS policies for users to manage their own profiles.

## Current Policies
```sql
-- ✅ Users can view their own profile
CREATE POLICY "Users can view their own profile" ON public.user_profiles
    FOR SELECT USING (user_id = auth.uid());

-- ⚠️ Site admins can manage all profiles (circular dependency issue)
CREATE POLICY "Site admins can manage all profiles" ON public.user_profiles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE user_id = auth.uid() AND role = 'site_admin'
        )
    );

-- ✅ Firm admins can view users in their firm
CREATE POLICY "Firm admins can view users in their firm" ON public.user_profiles
    FOR SELECT USING (
        firm_id IN (
            SELECT firm_id FROM public.user_profiles 
            WHERE user_id = auth.uid() AND role = 'firm_admin'
        )
    );
```

## Missing Policies

### 1. Users need to INSERT their own profiles
```sql
-- Allow users to create their own profile
CREATE POLICY "Users can create their own profile" ON public.user_profiles
    FOR INSERT WITH CHECK (user_id = auth.uid());
```

### 2. Users need to UPDATE their own profiles  
```sql
-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile" ON public.user_profiles
    FOR UPDATE USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());
```

### 3. Fix circular dependency in site admin policy
```sql
-- Drop the problematic policy
DROP POLICY "Site admins can manage all profiles" ON public.user_profiles;

-- Create a better site admin policy
CREATE POLICY "Site admins can manage all profiles" ON public.user_profiles
    FOR ALL USING (
        auth.jwt() ->> 'email' = 'bradley@the-bradley-group.com'
        OR EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE user_id = auth.uid() AND role = 'site_admin'
        )
    );
```

## Impact
Without these policies:
- ✅ Profile creation works (using admin client workaround)
- ❌ Users can't read their own profiles (406 errors)
- ❌ Users can't update their profiles later
- ❌ Site admin detection fails due to circular dependency

## Troubleshooting

### Check Existing Policies
First, check what policies already exist by running this in Supabase SQL Editor:

```sql
-- List all RLS policies on user_profiles table
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'user_profiles' 
ORDER BY policyname;
```

### Apply Missing Policies Only
Based on the error "policy already exists", try adding them one at a time:

```sql
-- Try INSERT policy first
CREATE POLICY "Users can create their own profile" ON public.user_profiles
    FOR INSERT WITH CHECK (user_id = auth.uid());
```

If you get "already exists" error, that policy is already there.

```sql
-- Try UPDATE policy (this one reportedly already exists)
-- CREATE POLICY "Users can update their own profile" ON public.user_profiles
--     FOR UPDATE USING (user_id = auth.uid())
--     WITH CHECK (user_id = auth.uid());
```

### Alternative: Check and Drop Existing Policies
If needed, you can drop and recreate policies:

```sql
-- Drop existing policies (if they exist but aren't working)
DROP POLICY IF EXISTS "Users can create their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;

-- Then create new ones
CREATE POLICY "Users can create their own profile" ON public.user_profiles
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own profile" ON public.user_profiles
    FOR UPDATE USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());
```

## Status
**PARTIALLY APPLIED** - Some policies may already exist. Use the troubleshooting queries above to identify which ones are missing.