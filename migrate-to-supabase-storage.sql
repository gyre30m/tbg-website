-- Note: This script creates the bucket and policies for Supabase Storage
-- You'll need to run this via the Supabase Dashboard SQL Editor or as a superuser

-- Create storage bucket for form documents
-- This must be done via Supabase Dashboard -> Storage -> Create Bucket
-- Bucket name: form-documents
-- Make it private (not public)
-- Set file size limit to 10MB
-- Allowed MIME types: application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, image/jpeg, image/jpg, image/png, image/gif, text/plain, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet

-- The following RLS policies need to be created via Supabase Dashboard -> Storage -> Policies
-- Or you can create them in the SQL Editor if you have the right permissions

-- These are the policies that need to be created:

/*
Policy Name: Site admins can access all documents
Table: objects (in storage schema)
Policy: 
FOR ALL USING (
  bucket_id = 'form-documents' AND
  EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE user_id = auth.uid() AND role = 'site_admin'
  )
)

Policy Name: Users can upload documents
Table: objects (in storage schema)
Policy:
FOR INSERT WITH CHECK (
  bucket_id = 'form-documents' AND
  EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE user_id = auth.uid() AND 
    firm_id IS NOT NULL
  )
)

Policy Name: Users can view own documents
Table: objects (in storage schema)
Policy:
FOR SELECT USING (
  bucket_id = 'form-documents' AND
  owner = auth.uid()
)

Policy Name: Firm members can view firm documents
Table: objects (in storage schema)
Policy:
FOR SELECT USING (
  bucket_id = 'form-documents' AND
  split_part(name, '/', 1) IN (
    SELECT firm_id::text 
    FROM public.user_profiles 
    WHERE user_id = auth.uid() AND firm_id IS NOT NULL
  )
)

Policy Name: Users can update own documents
Table: objects (in storage schema)
Policy:
FOR UPDATE USING (
  bucket_id = 'form-documents' AND
  owner = auth.uid()
)

Policy Name: Users can delete own documents  
Table: objects (in storage schema)
Policy:
FOR DELETE USING (
  bucket_id = 'form-documents' AND
  owner = auth.uid()
)
*/

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