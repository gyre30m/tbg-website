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

## Temporary Workaround
If you need to get the app working while debugging, you could temporarily add a more permissive policy:

```sql
-- TEMPORARY: Allow authenticated users to read any profile
-- REMOVE THIS AFTER DEBUGGING
CREATE POLICY "TEMP_DEBUG_allow_all_reads" ON public.user_profiles
    FOR SELECT USING (true);
```

Then test if the 406 error goes away. If it does, the issue is definitely with the RLS policy evaluation.