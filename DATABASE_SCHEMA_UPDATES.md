# Database Schema Updates for Firm Profile Enhancement

## Required SQL Migration

The following SQL commands need to be executed in your Supabase database to add the new firm profile fields:

```sql
-- Add new optional fields to the firms table
ALTER TABLE public.firms 
ADD COLUMN IF NOT EXISTS address_1 text,
ADD COLUMN IF NOT EXISTS address_2 text,
ADD COLUMN IF NOT EXISTS city text,
ADD COLUMN IF NOT EXISTS state text,
ADD COLUMN IF NOT EXISTS zip_code text,
ADD COLUMN IF NOT EXISTS main_phone text,
ADD COLUMN IF NOT EXISTS image_url text;

-- Add comments for documentation
COMMENT ON COLUMN public.firms.address_1 IS 'Primary address line (street address)';
COMMENT ON COLUMN public.firms.address_2 IS 'Secondary address line (suite, apartment, etc.)';
COMMENT ON COLUMN public.firms.city IS 'City name';
COMMENT ON COLUMN public.firms.state IS 'State or province';
COMMENT ON COLUMN public.firms.zip_code IS 'Postal/ZIP code';
COMMENT ON COLUMN public.firms.main_phone IS 'Primary phone number';
COMMENT ON COLUMN public.firms.image_url IS 'URL to firm logo/image file';
```

## New Fields Added

All new fields are optional and can be left empty:

1. **address_1** (text) - Primary street address
2. **address_2** (text) - Secondary address line (suite, apartment, etc.)
3. **city** (text) - City name
4. **state** (text) - State or province
5. **zip_code** (text) - Postal/ZIP code
6. **main_phone** (text) - Primary phone number
7. **image_url** (text) - URL to firm logo/image file

## Image Upload Implementation

The image upload functionality has been added to the UI with file input fields that accept various image formats (JPG, PNG, GIF, WebP). 

**Note**: The current implementation provides the UI for image upload, but you'll need to implement the actual file upload handling and storage logic. This could be done using:

- Supabase Storage buckets
- AWS S3 or similar cloud storage
- CDN services

The `image_url` field should store the final URL where the uploaded image can be accessed.

## Form Updates

Both the firm creation form (`/admin`) and firm editing form (`/admin/firms/[firm-name]`) now include:

- Address information section with all address fields
- Phone number field with tel input type
- Image upload field with file type validation
- Proper form validation and placeholder text

## TypeScript Updates

The `Firm` interface in `/lib/types.ts` has been updated to include all new optional fields with proper typing.