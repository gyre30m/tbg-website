# Missing RLS Policy for User Invitations

## Issue
Users cannot update their own invitations when accepting them because there's no RLS policy allowing it.

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
- **Missing**: Users can accept their own invitations

## Current Schema Analysis
The table design is sufficient for invitation tracking:
- `email + firm_id` uniquely identifies invitations (enforced by UNIQUE constraint)
- `accepted_at` timestamp tracks when invitation was accepted
- No additional `user_id` column needed - users can be identified by email

## Required Database Change

Add this RLS policy to the `user_invitations` table:

```sql
-- Allow users to accept their own invitations
CREATE POLICY "Users can accept their own invitations" ON public.user_invitations
    FOR UPDATE USING (
        email = auth.jwt() ->> 'email'
    );
```

## Current Workaround
Created `/api/accept-invitation` endpoint that uses admin client to bypass RLS and update invitations when users complete their profiles.

## Why This is Needed
When users click invitation links and complete their profiles, they need to mark the invitation as accepted by setting `accepted_at` timestamp. Without this policy, the update fails due to RLS restrictions.

## Alternative Policy (More Restrictive)
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