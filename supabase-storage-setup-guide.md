# Supabase Storage Setup Guide

Since you don't have superuser permissions to create storage policies via SQL, you'll need to set this up through the Supabase Dashboard.

## Step 1: Create the Storage Bucket

1. Go to your Supabase Dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **Create bucket**
4. Set the following:
   - **Name**: `form-documents`
   - **Public bucket**: **OFF** (keep private)
   - **File size limit**: `10 MB`
   - **Allowed MIME types**: Add these types:
     - `application/pdf`
     - `application/msword`
     - `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
     - `image/jpeg`
     - `image/jpg`
     - `image/png`
     - `image/gif`
     - `text/plain`
     - `application/vnd.ms-excel`
     - `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
5. Click **Create bucket**

## Step 2: Create RLS Policies

1. In the Supabase Dashboard, go to **Storage**
2. Click on **Policies** tab
3. Click **Create policy**

Create the following 6 policies:

### Policy 1: Site admins can access all documents
- **Policy name**: `Site admins can access all documents`
- **Allowed operation**: `All`
- **Policy definition**:
```sql
bucket_id = 'form-documents' AND
EXISTS (
  SELECT 1 FROM public.user_profiles 
  WHERE user_id = auth.uid() AND role = 'site_admin'
)
```

### Policy 2: Users can upload documents
- **Policy name**: `Users can upload documents`
- **Allowed operation**: `INSERT`
- **Policy definition**:
```sql
bucket_id = 'form-documents' AND
EXISTS (
  SELECT 1 FROM public.user_profiles
  WHERE user_id = auth.uid() AND 
  firm_id IS NOT NULL
)
```

### Policy 3: Users can view own documents
- **Policy name**: `Users can view own documents`
- **Allowed operation**: `SELECT`
- **Policy definition**:
```sql
bucket_id = 'form-documents' AND
owner = auth.uid()
```

### Policy 4: Firm members can view firm documents
- **Policy name**: `Firm members can view firm documents`
- **Allowed operation**: `SELECT`
- **Policy definition**:
```sql
bucket_id = 'form-documents' AND
split_part(name, '/', 1) IN (
  SELECT firm_id::text 
  FROM public.user_profiles 
  WHERE user_id = auth.uid() AND firm_id IS NOT NULL
)
```

### Policy 5: Users can update own documents
- **Policy name**: `Users can update own documents`
- **Allowed operation**: `UPDATE`
- **Policy definition**:
```sql
bucket_id = 'form-documents' AND
owner = auth.uid()
```

### Policy 6: Users can delete own documents
- **Policy name**: `Users can delete own documents`
- **Allowed operation**: `DELETE`
- **Policy definition**:
```sql
bucket_id = 'form-documents' AND
owner = auth.uid()
```

## Step 3: Run the Helper Function SQL

After creating the bucket and policies, you can run this SQL in the Supabase SQL Editor:

```sql
-- Create a function to get the document URL
CREATE OR REPLACE FUNCTION get_document_url(path text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN (
    SELECT 
      CASE 
        WHEN EXISTS (
          SELECT 1 FROM storage.objects 
          WHERE bucket_id = 'form-documents' AND name = path
        ) THEN
          -- Generate signed URL valid for 1 hour
          storage.get_signed_url('form-documents', path, 3600)
        ELSE
          NULL
      END
  );
END;
$$;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION get_document_url TO authenticated;
```

## Verification

After completing these steps, the document upload and access should work with the new Supabase Storage system. The policies ensure:

- ✅ Site admins can access all documents
- ✅ Firm members can only access documents from their firm
- ✅ Users can manage their own uploads
- ✅ Private bucket with signed URLs for security