import { useState } from 'react'

interface UploadResponse {
  success: boolean
  fileUrl?: string
  fileName?: string
  fileSize?: number
  fileType?: string
  storagePath?: string
  error?: string
}

export function useDocumentUpload() {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const uploadDocument = async (file: File, category?: string): Promise<UploadResponse> => {
    setUploading(true)
    setUploadProgress(0)

    try {
      const formData = new FormData()
      formData.append('file', file)
      if (category) {
        formData.append('category', category)
      }

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90))
      }, 100)

      const response = await fetch('/api/upload-document', {
        method: 'POST',
        body: formData,
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Upload failed')
      }

      return result
    } catch (error) {
      console.error('Upload error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed'
      }
    } finally {
      setUploading(false)
      setTimeout(() => setUploadProgress(0), 1000)
    }
  }

  const uploadMultipleDocuments = async (
    files: File[], 
    category?: string
  ): Promise<UploadResponse[]> => {
    const results: UploadResponse[] = []
    
    for (const file of files) {
      const result = await uploadDocument(file, category)
      results.push(result)
    }
    
    return results
  }

  const getDocumentUrl = async (storagePath: string): Promise<string | null> => {
    try {
      const response = await fetch('/api/get-document-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ storagePath }),
      })

      const result = await response.json()

      if (!response.ok) {
        console.error('Error getting document URL:', result.error)
        return null
      }

      return result.signedUrl
    } catch (error) {
      console.error('Error getting document URL:', error)
      return null
    }
  }

  return {
    uploadDocument,
    uploadMultipleDocuments,
    getDocumentUrl,
    uploading,
    uploadProgress
  }
}