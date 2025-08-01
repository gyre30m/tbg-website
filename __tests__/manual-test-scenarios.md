# Manual Authentication Test Scenarios

This document outlines manual testing scenarios to verify the authentication and authorization system is working correctly.

## Test Setup

Before running these tests, ensure you have:

1. **Test Accounts Created**:
   - Site Admin: `bradley@the-bradley-group.com`
   - Firm Admin 1: `admin@testfirm1.com` 
   - Firm Admin 2: `admin@testfirm2.com`
   - User 1: `user1@testfirm1.com`
   - User 2: `user2@testfirm2.com`

2. **Test Firms Created**:
   - Test Firm 1 (domain: testfirm1.com)
   - Test Firm 2 (domain: testfirm2.com)

3. **Test Forms**: Have sample forms submitted by different users

## Site Admin Access Tests

### Test SA-1: Site Admin Dashboard Access
**Objective**: Verify site admin can access admin dashboard
**Steps**:
1. Navigate to `/admin/firms` (or `/admin` which redirects to `/admin/firms`)
2. Login as `bradley@the-bradley-group.com`
3. Verify access to admin dashboard
**Expected**: Full access to admin interface

### Test SA-2: View All Firms
**Objective**: Site admin can see all firms
**Steps**:
1. As site admin, navigate to firms section
2. Verify both Test Firm 1 and Test Firm 2 are visible
**Expected**: Can see all firms regardless of domain

### Test SA-3: Manage Any Firm
**Objective**: Site admin can edit any firm
**Steps**:
1. As site admin, select Test Firm 1
2. Edit firm name to "Modified Test Firm 1"
3. Save changes
4. Verify changes persist
**Expected**: Can modify any firm successfully

### Test SA-4: View All User Profiles
**Objective**: Site admin can see users from all firms
**Steps**:
1. As site admin, navigate to user management
2. Verify users from both firms are visible
**Expected**: Can see users across all firms

### Test SA-5: View All Forms
**Objective**: Site admin can access forms from all firms
**Steps**:
1. As site admin, navigate to forms section
2. Verify forms from both Test Firm 1 and Test Firm 2 are visible
**Expected**: Can see forms from all firms

## Firm Admin Access Tests

### Test FA-1: Firm Admin Dashboard Access
**Objective**: Firm admin can access their firm's admin area
**Steps**:
1. Navigate to `/firms/testfirm1/admin`
2. Login as `admin@testfirm1.com`
3. Verify access to firm admin interface
**Expected**: Access granted to own firm's admin area

### Test FA-2: Cross-Firm Access Denial
**Objective**: Firm admin cannot access other firms
**Steps**:
1. As `admin@testfirm1.com`, try to navigate to `/firms/testfirm2/admin`
2. Attempt to access Test Firm 2 data
**Expected**: Access denied or redirected

### Test FA-3: View Own Firm Only
**Objective**: Firm admin sees only their firm's data
**Steps**:
1. As `admin@testfirm1.com`, navigate to firm info
2. Verify only Test Firm 1 data is visible
**Expected**: Cannot see Test Firm 2 data

### Test FA-4: View Firm Users Only
**Objective**: Firm admin sees only users from their firm
**Steps**:
1. As `admin@testfirm1.com`, navigate to user list
2. Verify only users with @testfirm1.com domain are visible
**Expected**: No @testfirm2.com users visible

### Test FA-5: Invite Users to Firm
**Objective**: Firm admin can invite users to their firm
**Steps**:
1. As `admin@testfirm1.com`, navigate to user invitations
2. Invite `newuser@testfirm1.com`
3. Verify invitation is created
**Expected**: Can invite users with matching domain

### Test FA-6: Cannot Invite Cross-Domain Users
**Objective**: Firm admin cannot invite users from other domains
**Steps**:
1. As `admin@testfirm1.com`, try to invite `user@testfirm2.com`
2. Attempt to send invitation
**Expected**: Invitation blocked or fails validation

## User Access Tests

### Test U-1: User Profile Access
**Objective**: Users can view their own profile
**Steps**:
1. Navigate to `/profile`
2. Login as `user1@testfirm1.com`
3. Verify profile information is displayed
**Expected**: Can see own profile data

### Test U-2: Form Submission
**Objective**: Users can submit forms
**Steps**:
1. As `user1@testfirm1.com`, navigate to `/forms/personal-injury`
2. Fill out and submit form
3. Verify form is saved with correct user association
**Expected**: Form submitted successfully

### Test U-3: View Own Forms
**Objective**: Users can see their submitted forms
**Steps**:
1. As `user1@testfirm1.com`, navigate to forms list
2. Verify only own forms are visible
**Expected**: Can see forms they submitted

### Test U-4: View Firm Forms
**Objective**: Users can see forms from their firm
**Steps**:
1. As `user1@testfirm1.com`, navigate to forms list
2. Verify forms from other Test Firm 1 users are visible
3. Ensure no Test Firm 2 forms are visible
**Expected**: Can see firm-scoped forms only

### Test U-5: Cannot Access Admin Areas
**Objective**: Regular users cannot access admin functions
**Steps**:
1. As `user1@testfirm1.com`, try to navigate to `/admin/firms`
2. Attempt to access admin functions
**Expected**: Access denied or redirected to authorized area

### Test U-6: Cannot Modify Other Users' Forms
**Objective**: Users cannot edit forms they didn't create
**Steps**:
1. As `user1@testfirm1.com`, try to edit a form created by `user2@testfirm1.com`
2. Attempt to save changes
**Expected**: Edit operation fails or is not permitted

## Cross-Firm Data Isolation Tests

### Test CF-1: User Cannot See Other Firm's Data
**Objective**: Verify firm-level data isolation
**Steps**:
1. Login as `user1@testfirm1.com`
2. Navigate through all accessible areas
3. Verify no Test Firm 2 data is visible anywhere
**Expected**: Complete isolation from other firm's data

### Test CF-2: Form Data Isolation
**Objective**: Forms are properly isolated by firm
**Steps**:
1. Create forms as users from both firms
2. Login as `user1@testfirm1.com`
3. Verify only Test Firm 1 forms are accessible
4. Repeat test with `user2@testfirm2.com`
**Expected**: Each user sees only their firm's forms

### Test CF-3: Profile Data Isolation
**Objective**: User profiles are firm-scoped
**Steps**:
1. As `admin@testfirm1.com`, view user profiles
2. Verify only Test Firm 1 user profiles are visible
3. Repeat with `admin@testfirm2.com`
**Expected**: Profile visibility limited to firm members

## Anonymous User Tests

### Test AN-1: No Access Without Authentication
**Objective**: Anonymous users cannot access protected data
**Steps**:
1. Open incognito/private browser window
2. Try to navigate to `/admin/firms`
3. Try to navigate to `/profile`
4. Try to navigate to `/forms`
**Expected**: Redirected to login or access denied

### Test AN-2: Public Pages Accessible
**Objective**: Public pages remain accessible
**Steps**:
1. Without authentication, navigate to public pages
2. Verify homepage and public content loads
**Expected**: Public pages accessible, forms require auth

## Session Management Tests

### Test SM-1: Session Persistence
**Objective**: User sessions persist across browser refreshes
**Steps**:
1. Login as any user
2. Navigate to protected page
3. Refresh browser
4. Verify still authenticated and on correct page
**Expected**: Session maintains across refreshes

### Test SM-2: Logout Functionality
**Objective**: Logout properly clears session
**Steps**:
1. Login as any user
2. Navigate to protected area
3. Click logout
4. Try to access protected area again
**Expected**: Redirected to login, no access to protected areas

### Test SM-3: Session Timeout
**Objective**: Expired sessions are handled properly
**Steps**:
1. Login as any user
2. Wait for session to expire (or manually expire in database)
3. Try to access protected area
**Expected**: Redirected to login with appropriate message

## Error Handling Tests

### Test EH-1: Invalid Credentials
**Objective**: Invalid login attempts are handled properly
**Steps**:
1. Try to login with incorrect password
2. Try to login with non-existent email
3. Verify appropriate error messages
**Expected**: Clear error messages, no sensitive information leaked

### Test EH-2: Database Connection Issues
**Objective**: System handles database errors gracefully
**Steps**:
1. Simulate database connectivity issues
2. Try to access protected areas
3. Verify error handling
**Expected**: Graceful error handling, no application crashes

### Test EH-3: Invalid Role Assignment
**Objective**: System handles corrupted role data
**Steps**:
1. Manually corrupt a user's role in database
2. Login as that user
3. Verify system behavior
**Expected**: Defaults to most restrictive access, logs error

## Security Edge Cases

### Test SE-1: SQL Injection Attempts
**Objective**: Database queries are properly parameterized
**Steps**:
1. Try SQL injection in login forms
2. Try injection in form data fields
3. Verify no database compromise
**Expected**: All injection attempts fail safely

### Test SE-2: Cross-Site Scripting (XSS)
**Objective**: User input is properly sanitized
**Steps**:
1. Submit forms with script tags in input fields
2. Try XSS in profile information
3. Verify scripts are not executed
**Expected**: Scripts sanitized, no XSS execution

### Test SE-3: Direct URL Manipulation
**Objective**: URL-based access controls work
**Steps**:
1. As regular user, manually type admin URLs
2. Try to access other firms' data via URL manipulation
3. Verify access controls prevent unauthorized access
**Expected**: All unauthorized URL access blocked

## Performance Tests

### Test P-1: Large Dataset Handling
**Objective**: System performs well with many users/forms
**Steps**:
1. Create large number of test users and forms
2. Test loading times for different user types
3. Verify pagination and filtering work correctly
**Expected**: Acceptable performance, proper data limiting

### Test P-2: Concurrent User Access
**Objective**: System handles multiple simultaneous users
**Steps**:
1. Have multiple users login simultaneously
2. Perform various operations concurrently
3. Verify no data corruption or access issues
**Expected**: Clean concurrent access, no data issues

## Documentation and Compliance

### Test DC-1: Audit Trail
**Objective**: Important actions are logged appropriately
**Steps**:
1. Perform various admin actions
2. Check for audit logs of user management, data access
3. Verify log completeness and accuracy
**Expected**: Comprehensive audit trail of sensitive operations

### Test DC-2: Data Retention
**Objective**: Data retention policies are enforced
**Steps**:
1. Check how deleted users/firms are handled
2. Verify data cleanup processes
3. Ensure compliance with data retention requirements
**Expected**: Proper data lifecycle management

## Test Results Documentation

For each test, document:
- **Test ID**: Reference from above
- **Date/Time**: When test was performed  
- **Tester**: Who performed the test
- **Result**: Pass/Fail
- **Notes**: Any observations or issues
- **Screenshots**: For UI-related tests
- **Follow-up**: Required actions if test failed

## Automated Test Execution

The manual tests above should be complemented by running:

```bash
# Run auth unit tests
npm test __tests__/auth.test.ts

# Run integration tests  
npm test __tests__/auth-integration.test.ts

# Run full test suite
npm test
```

## Regular Testing Schedule

**Daily**: Automated test suite
**Weekly**: Core functionality manual tests (SA-1 through U-5)  
**Monthly**: Full manual test suite
**Before releases**: Complete test suite including edge cases