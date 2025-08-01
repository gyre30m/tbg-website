# Supabase Auth Implementation Improvements

## Current Issues

### 1. Auth Context Timing Issues
The auth context has race conditions where `userProfile` data is stale when components first render. This causes permission checks to fail initially.

**Problem:**
```typescript
// In auth-context.tsx
const isSiteAdmin = userProfile?.role === 'site_admin'
// This is calculated once and doesn't update when userProfile changes
```

**Solution:**
Use `useMemo` to recalculate these values when userProfile changes:
```typescript
const isSiteAdmin = useMemo(() => userProfile?.role === 'site_admin', [userProfile])
const isFirmAdmin = useMemo(() => userProfile?.role === 'firm_admin', [userProfile])
```

### 2. Missing RLS Update Policies
Current RLS policies only allow firm members to VIEW forms, not UPDATE them.

**Current:**
```sql
CREATE POLICY "Firm members can view forms from their firm" ON public.wrongful_death_forms
    FOR SELECT USING (firm_id IN (
        SELECT firm_id FROM public.user_profiles 
        WHERE user_id = auth.uid()
    ));
```

**Needed:**
```sql
CREATE POLICY "Firm members can update forms from their firm" ON public.wrongful_death_forms
    FOR UPDATE USING (
        firm_id IN (
            SELECT firm_id FROM public.user_profiles 
            WHERE user_id = auth.uid()
        )
    )
    WITH CHECK (
        firm_id IN (
            SELECT firm_id FROM public.user_profiles 
            WHERE user_id = auth.uid()
        )
    );
```

### 3. Improve Auth State Management

**Current approach:** Multiple separate state variables
```typescript
const [user, setUser] = useState<User | null>(null)
const [session, setSession] = useState<Session | null>(null)
const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
const [userFirm, setUserFirm] = useState<Firm | null>(null)
```

**Better approach:** Single auth state object
```typescript
const [authState, setAuthState] = useState<{
  user: User | null
  session: Session | null
  profile: UserProfile | null
  firm: Firm | null
  isLoading: boolean
}>({
  user: null,
  session: null,
  profile: null,
  firm: null,
  isLoading: true
})
```

### 4. Add Retry Logic for Profile Fetching
The current 3-second timeout might be too aggressive. Consider:
- Exponential backoff
- Multiple retry attempts
- Better error handling for transient failures

### 5. Implement Proper Session Refresh
Add middleware to refresh sessions before they expire:
```typescript
// In middleware.ts
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}
```

## Security Best Practices Already Implemented ✅

1. **Using getUser() in server actions** - Correctly validates JWT server-side
2. **RLS enabled on all tables** - Database-level security
3. **Proper permission checks in server actions** - Double-checking permissions in code
4. **Audit trail for all form operations** - Tracking who does what

## Next Steps

1. Fix the auth context timing issues with `useMemo`
2. Add UPDATE policies for firm members
3. Implement session refresh middleware
4. Add better error handling and retry logic
5. Consider using React Query or SWR for profile data fetching with proper caching