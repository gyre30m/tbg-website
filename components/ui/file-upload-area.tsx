'use client'

import { useState } from 'react'
import { Upload, FileText, Trash2, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DocumentViewer } from '@/components/ui/document-viewer'

interface UploadedFile {
  id: string
  fileName: string
  fileUrl: string
  fileSize: number
  fileType: string
  category: string
  storagePath?: string
}

interface FileUploadAreaProps {
  category: string
  label: string
  acceptedTypes?: string
  maxSizeMB?: number
  multiple?: boolean
  uploadedFiles: UploadedFile[]
  onFilesUpload: (files: FileList, category: string) => Promise<void>
  onRemoveFile: (fileId: string) => void
  uploading?: boolean
}

export function FileUploadArea({
  category,
  label,
  acceptedTypes = '.pdf,.doc,.docx,.jpg,.jpeg,.png',
  maxSizeMB = 10,
  multiple = true,
  uploadedFiles,
  onFilesUpload,
  onRemoveFile,
  uploading = false
}: FileUploadAreaProps) {
  const [dragOver, setDragOver] = useState(false)
  
  const categoryFiles = uploadedFiles.filter(file => file.category === category)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileSelect(files)
    }
  }

  const handleFileSelect = async (files: FileList) => {
    await onFilesUpload(files, category)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">{label}</h3>
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragOver 
            ? 'border-blue-400 bg-blue-50' 
            : uploading 
            ? 'border-gray-300 bg-gray-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Upload className={`mx-auto h-12 w-12 ${uploading ? 'text-gray-400' : 'text-gray-400'}`} />
        <div className="mt-2">
          <p className="text-sm text-gray-600">
            {uploading ? 'Uploading...' : 'Click to upload or drag and drop'}
          </p>
          <p className="text-xs text-gray-500">
            {acceptedTypes.replace(/\./g, '').toUpperCase()} up to {maxSizeMB}MB each
          </p>
        </div>
        <input
          type="file"
          className="hidden"
          accept={acceptedTypes}
          multiple={multiple}
          disabled={uploading}
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              handleFileSelect(e.target.files)
            }
          }}
          onClick={(e) => {
            // Reset the input value to allow re-uploading the same file
            (e.target as HTMLInputElement).value = ''
          }}
        />
        <Button
          type="button"
          variant="outline"
          className="mt-2"
          disabled={uploading}
          onClick={() => {
            const input = document.querySelector(`input[type="file"]`) as HTMLInputElement
            input?.click()
          }}
        >
          {uploading ? 'Uploading...' : 'Choose Files'}
        </Button>
      </div>

      {categoryFiles.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Uploaded Files:</p>
          {categoryFiles.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <FileText className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{file.fileName}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(file.fileSize)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <DocumentViewer 
                  fileName={file.fileName}
                  storagePath={file.storagePath}
                  fileUrl={file.fileUrl}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveFile(file.id)}
                  className="text-red-500 hover:text-red-700 h-8 w-8 p-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}