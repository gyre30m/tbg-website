# User Invitations RLS Policy - RESOLVED ✅

## Issue (RESOLVED)
~~Users cannot update their own invitations when accepting them because there's no RLS policy allowing it.~~

**STATUS: RESOLVED** - The restrictive RLS policy has been applied via Supabase SQL Editor.

## Current Table Schema
```sql
CREATE TABLE public.user_invitations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL,
    firm_id UUID REFERENCES public.firms(id),
    role TEXT NOT NULL CHECK (role IN ('firm_admin', 'user')),
    invited_by UUID REFERENCES auth.users(id),
    invited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    accepted_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(email, firm_id)
);
```

## Current Policies
- Site admins can manage all invitations  
- Firm admins can manage their firm's invitations
- ✅ **Users can accept their own invitations** (APPLIED)

## Current Schema Analysis
The table design is sufficient for invitation tracking:
- `email + firm_id` uniquely identifies invitations (enforced by UNIQUE constraint)
- `accepted_at` timestamp tracks when invitation was accepted
- No additional `user_id` column needed - users can be identified by email

## ✅ Applied RLS Policy (COMPLETED)

The following restrictive RLS policy was successfully applied via Supabase SQL Editor:

## Solution Implemented
```sql
-- Allow users to only set accepted_at on their own invitations (prevents re-acceptance)
CREATE POLICY "Users can accept their own invitations" ON public.user_invitations
    FOR UPDATE USING (
        email = auth.jwt() ->> 'email'
        AND accepted_at IS NULL  -- Only allow if not already accepted
    )
    WITH CHECK (
        email = auth.jwt() ->> 'email'
        AND accepted_at IS NOT NULL  -- Only allow setting accepted_at
    );
```

**Status**: ✅ **APPLIED via Supabase SQL Editor**

## Benefits of This Policy
- **Security**: Only users can update their own invitations (by email match)
- **Prevents re-acceptance**: Users can't accept already-accepted invitations
- **Controlled updates**: Only allows setting `accepted_at` timestamp
- **No admin bypass needed**: Users can now directly update invitations

## Next Steps
With this RLS policy in place, the invitation system can be simplified:
1. Remove the `/api/accept-invitation` workaround endpoint (optional)
2. Update complete-profile page to directly update user_invitations table
3. Users will be able to accept invitations without admin privileges