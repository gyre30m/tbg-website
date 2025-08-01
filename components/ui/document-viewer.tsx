'use client'

import { useState } from 'react'
import { Eye, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useDocumentUpload } from '@/hooks/useDocumentUpload'

interface DocumentViewerProps {
  fileName: string
  storagePath?: string
  fileUrl?: string // Fallback for legacy files
}

export function DocumentViewer({ fileName, storagePath, fileUrl }: DocumentViewerProps) {
  const [loading, setLoading] = useState(false)
  const { getDocumentUrl } = useDocumentUpload()

  const handleView = async () => {
    if (!storagePath && !fileUrl) return

    setLoading(true)
    try {
      let viewUrl = fileUrl

      // If we have a storagePath, get a signed URL
      if (storagePath) {
        const signedUrl = await getDocumentUrl(storagePath)
        if (signedUrl) {
          viewUrl = signedUrl
        }
      }

      if (viewUrl) {
        window.open(viewUrl, '_blank')
      }
    } catch (error) {
      console.error('Error viewing document:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async () => {
    if (!storagePath && !fileUrl) return

    setLoading(true)
    try {
      let downloadUrl = fileUrl

      // If we have a storagePath, get a signed URL
      if (storagePath) {
        const signedUrl = await getDocumentUrl(storagePath)
        if (signedUrl) {
          downloadUrl = signedUrl
        }
      }

      if (downloadUrl) {
        const link = document.createElement('a')
        link.href = downloadUrl
        link.download = fileName
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    } catch (error) {
      console.error('Error downloading document:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={handleView}
        disabled={loading || (!storagePath && !fileUrl)}
        className="h-8 w-8 p-0"
      >
        <Eye className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={handleDownload}
        disabled={loading || (!storagePath && !fileUrl)}
        className="h-8 w-8 p-0"
      >
        <Download className="h-4 w-4" />
      </Button>
    </div>
  )
}