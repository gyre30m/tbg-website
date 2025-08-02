# Debugging 406 Error on user_profiles

## Current Situation
- Profile creation succeeds ✅
- Invitation acceptance succeeds ✅  
- Reading profile fails with 406 ❌

## The 406 Error
HTTP 406 "Not Acceptable" in Supabase context usually means:
- RLS policy evaluation failed
- JWT token doesn't have expected claims
- Row-level security is blocking access

## Key Debugging Queries

### 1. Verify RLS is Enabled
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'user_profiles';
```

### 2. Check if Profile Exists (as superuser)
```sql
-- Run this as database owner/superuser
SELECT * FROM public.user_profiles 
WHERE user_id = '29a637b1-5b11-4c96-9735-5e4ae25d2436';
```

### 3. Test RLS Policy Directly
```sql
-- Simulate the authenticated user
SET LOCAL role TO 'authenticated';
SET LOCAL request.jwt.claim.sub TO '29a637b1-5b11-4c96-9735-5e4ae25d2436';

-- Try to select the profile
SELECT * FROM public.user_profiles 
WHERE user_id = '29a637b1-5b11-4c96-9735-5e4ae25d2436';

-- Reset
RESET role;
```

### 4. Check auth.uid() Function
```sql
-- Test what auth.uid() returns for the user
SET LOCAL role TO 'authenticated';
SET LOCAL request.jwt.claim.sub TO '29a637b1-5b11-4c96-9735-5e4ae25d2436';

SELECT auth.uid();

RESET role;
```

## Potential Issues

### 1. JWT Token Mismatch
The auth.uid() function reads from `request.jwt.claim.sub`. If the JWT token doesn't have the correct structure, the RLS policy `user_id = auth.uid()` will fail.

### 2. Timing Issue
The profile might be created in a transaction that hasn't committed yet when the read attempt happens.

### 3. RLS Policy Issue
The SELECT policy might not be evaluating correctly.

## Issue Found: Anon Key vs Authenticated Role

The 406 error is likely because:
1. The request uses both `apikey` (anon key) and `authorization` (user JWT)
2. Supabase might be evaluating policies based on the anon role instead of authenticated

## Fix: Ensure Authenticated Role Access

### 1. Check Current RLS Policies
```sql
-- See which roles have access
SELECT policyname, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'user_profiles' 
ORDER BY policyname;
```

### 2. Ensure Policies Apply to Authenticated Users
The policies should have `roles = {public}` or `roles = {authenticated}`. If they only show `{public}`, that might be the issue.

### 3. Test with Exact Supabase Context
```sql
-- Test as authenticated user with proper claims
BEGIN;
SET LOCAL role TO 'authenticated';
SET LOCAL request.jwt.claims TO '{"sub": "29a637b1-5b11-4c96-9735-5e4ae25d2436"}';

SELECT current_setting('request.jwt.claims', true)::json->>'sub' as jwt_sub,
       auth.uid() as auth_uid,
       current_user;

SELECT * FROM public.user_profiles WHERE user_id = '29a637b1-5b11-4c96-9735-5e4ae25d2436';
ROLLBACK;
```

## Temporary Workaround
If the policies are correct but still failing:

```sql
-- TEMPORARY: Explicitly allow authenticated role
CREATE POLICY "Authenticated users can view their own profile" ON public.user_profiles
    FOR SELECT 
    TO authenticated
    USING (user_id = auth.uid());
```