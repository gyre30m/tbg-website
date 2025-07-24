'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertTriangle } from 'lucide-react'

interface DeleteConfirmationDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (lastNameConfirmation: string) => Promise<void>
  expectedLastName: string
  isDeleting: boolean
}

export function DeleteConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  expectedLastName,
  isDeleting
}: DeleteConfirmationDialogProps) {
  const [lastNameInput, setLastNameInput] = useState('')
  const [error, setError] = useState('')

  const handleConfirm = async () => {
    if (lastNameInput.toLowerCase().trim() !== expectedLastName.toLowerCase().trim()) {
      setError('Last name does not match. Please verify and try again.')
      return
    }

    setError('')
    try {
      await onConfirm(lastNameInput)
      setLastNameInput('')
      onClose()
    } catch {
      setError('Failed to delete form. Please try again.')
    }
  }

  const handleClose = () => {
    setLastNameInput('')
    setError('')
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Delete Form Permanently
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800 font-medium mb-2">
              ⚠️ This action cannot be undone
            </p>
            <p className="text-sm text-red-700">
              Deleting this form will permanently remove all data associated with it. 
              This includes all form responses, uploaded documents, and saved drafts.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastNameConfirmation" className="text-sm font-medium">
              To confirm deletion, please type the <strong>Last Name</strong> from the Contact section:
            </Label>
            <div className="bg-gray-50 border rounded-md p-2 mb-2">
              <p className="text-sm font-mono text-gray-700">Expected: {expectedLastName}</p>
            </div>
            
            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-2">
                {error}
              </div>
            )}
            
            <Input
              id="lastNameConfirmation"
              value={lastNameInput}
              onChange={(e) => setLastNameInput(e.target.value)}
              placeholder="Enter last name to confirm"
              className={error ? 'border-red-300 focus:border-red-500' : ''}
              disabled={isDeleting}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={isDeleting || !lastNameInput.trim()}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isDeleting ? 'Deleting...' : 'Delete Form'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}