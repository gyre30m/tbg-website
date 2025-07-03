# S3 Image Upload Implementation

## Overview

This implementation provides complete server-side image upload functionality using AWS S3 for storage and automatic database updates via Supabase.

## Features Implemented

### ✅ Server-Side Components

1. **API Route** (`/app/api/upload/route.ts`)
   - Handles file upload to S3
   - Validates file type and size
   - Generates unique filenames
   - Returns public S3 URLs

2. **Custom Hook** (`/hooks/useImageUpload.ts`)
   - Provides upload functionality with progress tracking
   - Error handling and status management
   - Reusable across components

3. **Form Integration**
   - Firm creation form with image upload
   - Firm editing form with image replacement
   - Real-time upload progress and preview

### ✅ Security & Validation

- **File Type Validation**: Only image formats (JPG, PNG, GIF, WebP)
- **File Size Limit**: 5MB maximum
- **Unique Filenames**: UUID-based naming prevents conflicts
- **S3 Security**: Configurable bucket permissions

### ✅ User Experience

- **Progress Indicators**: Real-time upload progress bars
- **Image Preview**: Immediate preview of uploaded images
- **Error Handling**: Clear error messages for failures
- **Loading States**: Disabled inputs during uploads

## Setup Requirements

### 1. AWS S3 Configuration

Create an S3 bucket with the following settings:

```bash
# 1. Create S3 bucket
aws s3 mb s3://your-firm-images-bucket

# 2. Configure bucket for public read access
aws s3api put-bucket-policy --bucket your-firm-images-bucket --policy '{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-firm-images-bucket/*"
    }
  ]
}'

# 3. Configure CORS
aws s3api put-bucket-cors --bucket your-firm-images-bucket --cors-configuration '{
  "CORSRules": [
    {
      "AllowedHeaders": ["*"],
      "AllowedMethods": ["GET", "POST", "PUT"],
      "AllowedOrigins": ["*"],
      "MaxAgeSeconds": 3000
    }
  ]
}'
```

### 2. Environment Variables

Add to your `.env.local`:

```bash
# AWS Configuration
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=your-firm-images-bucket
```

### 3. IAM User Permissions

Create an IAM user with these permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:PutObjectAcl",
        "s3:GetObject"
      ],
      "Resource": "arn:aws:s3:::your-firm-images-bucket/*"
    }
  ]
}
```

## Database Schema

The `firms` table already includes the `image_url` column. Run this if needed:

```sql
-- Add image_url column if not exists
ALTER TABLE public.firms 
ADD COLUMN IF NOT EXISTS image_url text;

COMMENT ON COLUMN public.firms.image_url IS 'URL to firm logo/image stored in S3';
```

## API Endpoints

### POST /api/upload

Uploads an image file to S3 and returns the public URL.

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body: File field named 'file'

**Response:**
```json
{
  "success": true,
  "imageUrl": "https://bucket.s3.region.amazonaws.com/firm-images/uuid.jpg",
  "fileName": "firm-images/uuid.jpg",
  "fileSize": 1234567,
  "fileType": "image/jpeg"
}
```

**Error Response:**
```json
{
  "error": "File too large. Maximum size: 5MB"
}
```

## Usage Examples

### In React Components

```tsx
import { useImageUpload } from '@/hooks/useImageUpload'

function MyComponent() {
  const { uploadImage, uploading, uploadProgress } = useImageUpload()

  const handleFileUpload = async (file: File) => {
    const result = await uploadImage(file)
    if (result.success) {
      console.log('Image URL:', result.imageUrl)
      // Save to database via Supabase
    }
  }

  return (
    <input 
      type="file" 
      accept="image/*"
      onChange={(e) => {
        const file = e.target.files?.[0]
        if (file) handleFileUpload(file)
      }}
      disabled={uploading}
    />
  )
}
```

### Direct API Call

```javascript
const uploadToS3 = async (file) => {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  })

  return await response.json()
}
```

## File Organization

- **Storage Path**: `firm-images/{uuid}.{extension}`
- **Naming Convention**: UUID v4 + original file extension
- **Cache Headers**: 1 year cache for better performance

## Error Handling

The implementation handles these error cases:

1. **Missing AWS credentials**
2. **Invalid file types**
3. **File size exceeded**
4. **S3 upload failures**
5. **Network connectivity issues**

## Security Considerations

1. **File Type Validation**: Server-side validation prevents malicious uploads
2. **Size Limits**: Prevents large file abuse
3. **Unique Filenames**: Prevents file collision attacks
4. **S3 Permissions**: Read-only public access for images only
5. **No Direct File Access**: All uploads go through validated API

## Performance Optimizations

1. **Progress Tracking**: Real-time upload feedback
2. **Async Processing**: Non-blocking uploads
3. **CDN Ready**: S3 URLs work with CloudFront
4. **Optimized Images**: Consider adding image resizing in the future

## Troubleshooting

### Common Issues

1. **403 Forbidden**: Check IAM permissions and bucket policy
2. **CORS Errors**: Verify bucket CORS configuration
3. **Upload Timeout**: Check file size and network connection
4. **Invalid Credentials**: Verify environment variables

### Debug Mode

Add logging to the API route for debugging:

```typescript
console.log('Upload attempt:', {
  fileName: file.name,
  fileSize: file.size,
  fileType: file.type
})
```

## Future Enhancements

Consider these improvements:

1. **Image Resizing**: Automatic thumbnail generation
2. **CDN Integration**: CloudFront for faster delivery
3. **Image Optimization**: WebP conversion for better compression
4. **Bulk Upload**: Multiple image selection
5. **Image Editing**: Crop/resize before upload