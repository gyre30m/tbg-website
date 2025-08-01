# SMTP Configuration Guide for User Invitations

## Problem
User invitation emails are not being received because Supabase's default SMTP has severe limitations:
- Very low rate limits
- Emails often blocked by spam filters
- Default "supabase.io" domain flagged by security systems

## Solution: Configure Custom SMTP

### Step 1: Choose an SMTP Provider
Recommended providers:
- **Resend** (easiest setup, 3000 free emails/month)
- **AWS SES** (cheapest for high volume)
- **Postmark** (best deliverability)
- **SendGrid** (popular choice)

### Step 2: Configure in Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Settings** → **SMTP Settings**
3. Enable "Enable Custom SMTP"
4. Fill in the SMTP details from your provider

### Step 3: Required Settings

```
SMTP Host: [from your provider]
SMTP Port: 587 (or 465 for SSL)
SMTP User: [your SMTP username]
SMTP Pass: [your SMTP password]
Sender Email: noreply@yourdomain.com
Sender Name: The Bradley Group
```

### Step 4: DNS Configuration (Important!)

Add these DNS records to your domain:
```
SPF Record: "v=spf1 include:[provider-spf] ~all"
DKIM: [provided by your SMTP provider]
DMARC: "v=DMARC1; p=quarantine; rua=mailto:postmaster@yourdomain.com"
```

## Quick Test Setup with Resend

1. Sign up at https://resend.com
2. Add your domain and verify ownership
3. Get your SMTP credentials:
   - Host: smtp.resend.com
   - Port: 587
   - Username: resend
   - Password: [your API key]

## Alternative: Custom Email Hook

If SMTP setup is delayed, implement a custom email sending function using a service like:
- Resend API
- SendGrid API
- AWS SES API

This allows immediate testing while SMTP is being configured.