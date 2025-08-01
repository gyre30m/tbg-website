# Invitation System Debug Guide

## Problem: No email received AND no database record created

This suggests the invitation function is failing completely, likely before it gets to email sending or database insertion.

## Debugging Steps

### 1. Test Admin Client First
Visit: `https://your-domain.com/api/test-admin-client`

This will verify:
- ✅ Service role key is set correctly
- ✅ Admin client can authenticate with Supabase
- ✅ Basic admin operations work

**Expected Result**: `{"success": true, "message": "Admin client working correctly"}`

**If this fails**: The service role key is wrong or missing.

### 2. Test Full Invitation Flow
Visit: `https://your-domain.com/debug-invitation`

You'll need:
- **Email**: Any email with your firm's domain
- **Firm ID**: Get from Supabase dashboard → SQL Editor → `SELECT id, name, domain FROM firms;`
- **Firm Domain**: Your firm's domain (e.g., "example.com")

This will test the complete invitation flow and show where it fails.

### 3. Check Server Logs
After running the debug test, check your server logs (console or deployment logs) for detailed error messages.

## Common Issues & Solutions

### Issue 1: Service Role Key Problems
**Symptoms**: Admin client test fails
**Solution**: 
- Check `.env.local` has `SUPABASE_SERVICE_ROLE_KEY`
- Verify the key is correct in Supabase dashboard → Settings → API
- Restart your development server after changing env vars

### Issue 2: Database Permission Issues
**Symptoms**: Admin client works, but database operations fail
**Solution**:
- Check RLS policies on `user_invitations` table
- Verify service role has proper permissions
- Check table schema matches what the code expects

### Issue 3: Email Domain Validation
**Symptoms**: Invitation fails immediately
**Solution**:
- Ensure email domain exactly matches firm domain in database
- Check for typos in domain name

### Issue 4: Database Connection Issues
**Symptoms**: Database connection test fails
**Solution**:
- Verify `NEXT_PUBLIC_SUPABASE_URL` is correct
- Check network connectivity to Supabase
- Verify Supabase project is active

## Expected Flow When Working

1. ✅ Admin client authenticates
2. ✅ Email domain validation passes
3. ✅ User lookup completes (may find existing user or not)
4. ✅ Database insertion creates invitation record
5. ✅ Supabase Auth sends invitation email
6. ✅ OR fallback email service sends email if Supabase fails

## Debug Output Analysis

### Successful Invitation:
```json
{
  "success": true,
  "invitationResult": {
    "success": true,
    "message": "Invitation sent successfully"
  },
  "databaseCheck": {
    "data": [{
      "email": "user@domain.com",
      "firm_id": "uuid",
      "invited_at": "2025-01-01T12:00:00Z"
    }]
  }
}
```

### Failed Invitation:
```json
{
  "success": false,
  "invitationResult": {
    "success": false,
    "error": "Specific error message here"
  },
  "databaseCheck": {
    "data": null,
    "error": "Database error details"
  }
}
```

The debug output will show exactly where the process is failing, allowing for targeted fixes.