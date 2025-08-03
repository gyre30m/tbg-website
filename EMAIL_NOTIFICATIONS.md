# Email Notifications for Form Submissions

## Overview

The application now automatically sends email notifications to `forms@the-bradley-group.com` whenever a form is successfully submitted through the portal.

## Implementation

### Components

1. **Email API Endpoint**: `/api/send-form-notification`
   - Handles sending emails using Resend
   - Formats form data into readable email content
   - Includes key form details and submission metadata

2. **Form Actions Integration**: `lib/actions.ts`
   - All form submission functions now include email notifications
   - Emails are sent after successful database storage
   - Email failures do not affect form submission success

3. **Supported Form Types**:
   - Personal Injury Forms
   - Wrongful Death Forms  
   - Wrongful Termination Forms

### Email Content

Each notification email has a simple one-line format:

**Body**: `[user.fullname] from [firm.firmName] submitted a [form.type] regarding [plaintiff.firstName + plaintiff.lastName] at [submittedAt.timestamp]`

Where:
- `[user.fullname]`: The full name of the user who submitted the form
- `[firm.firmName]`: The name of the law firm
- `[form.type]`: The type of form (Personal Injury, Wrongful Death, or Wrongful Termination)
- `[plaintiff.firstName + plaintiff.lastName]`: The plaintiff's name from the form's contact section
- `[submittedAt.timestamp]`: The date and time of submission

### Configuration

**Required Environment Variables**:
- `RESEND_API_KEY`: Your Resend API key
- `NEXT_PUBLIC_SITE_URL`: Base URL for form links

**Email Settings**:
- From: `The Bradley Group <noreply@forms.the-bradley-group.com>`
- To: `forms@the-bradley-group.com`
- Subject: `New [Form Type] Form Submission`

## Testing

A test endpoint is available at `/api/test-form-notification` that sends a sample email with test data to verify the email system is working correctly.

## Error Handling

- Email failures are logged but do not prevent form submission
- All email errors are captured in server logs
- Users are not notified of email delivery issues
- Form submission success is independent of email delivery

## Security

- Email content includes only essential form data
- No sensitive authentication tokens are included
- All email sending happens server-side
- Form access still requires proper authentication

## Email Format Example

```
Subject: New Personal Injury Form Submission

Body: Jane Smith from ABC Law Firm submitted a Personal Injury regarding John Doe at January 15, 2024 at 2:30 PM EST
```