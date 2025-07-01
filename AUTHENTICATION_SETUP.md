# Authentication System Setup Guide

## Overview
The new authentication system implements a hierarchical structure:
- **Site Admin**: bradley@the-bradley-group.com (manages all firms)
- **Firms**: Law firms with domain-based email restrictions
- **Firm Admins**: Manage users within their firm
- **Users**: Regular users within a firm

## Database Setup

1. **Run the database initialization script** in Supabase SQL Editor:
   ```sql
   -- Copy and run the contents of lib/db-init.sql
   ```

2. **Create the Site Admin account**:
   - Sign up with bradley@the-bradley-group.com
   - The trigger will automatically create a site_admin profile

## How It Works

### Site Admin (bradley@the-bradley-group.com)
- Access admin panel at `/admin`
- Create new law firms with name and domain
- Each firm requires a unique email domain
- System creates firm admin accounts

### Firm Creation Process
1. Site Admin creates firm with:
   - Firm name (e.g., "Smith & Associates")
   - Email domain (e.g., "smithlaw.com")
   - Firm admin email (must match domain)

2. System sends invitation to firm admin email
3. Firm admin can then invite users from same domain

### User Access Control
- **Forms**: Users can only see forms from their own firm
- **Drafts**: Users can save/load their own drafts
- **Firm Isolation**: Complete separation between firms
- **Domain Validation**: Users can only join firms matching their email domain

## Required Database Tables

### `firms`
- `id`, `name`, `domain`, `firm_admin_id`
- Stores law firm information

### `user_profiles` 
- `user_id`, `firm_id`, `role`, `first_name`, `last_name`
- Links Supabase auth users to firms and roles

### `user_invitations`
- `email`, `firm_id`, `role`, `invited_by`
- Manages pending user invitations

### `personal_injury_forms` (updated)
- Added: `submitted_by`, `firm_id`, `status`
- Associates forms with users and firms

### `personal_injury_drafts` (updated)
- Added: `submitted_by`, `firm_id`, `status`  
- Associates drafts with users and firms

## Row Level Security (RLS)

All tables have RLS policies that ensure:
- Site admins can access everything
- Firm admins can manage their firm's users
- Users can only access their firm's data
- Complete isolation between firms

## Next Steps

1. Run the database migration script
2. Sign up as bradley@the-bradley-group.com
3. Access `/admin` to create first law firm
4. Test firm creation and user invitation flow
5. Verify form submissions are properly associated with firms

## Key Features

- ✅ Domain-based email validation
- ✅ Hierarchical role management
- ✅ Firm-based data isolation
- ✅ Form ownership and permissions
- ✅ Draft saving with user association
- ✅ Site admin interface
- ✅ Row-level security policies

## Security Notes

- No public sign-up (invitation only)
- Email domains must match firm domains
- All data access is firm-scoped
- Site admin has override access for support
- Secure form submission tracking