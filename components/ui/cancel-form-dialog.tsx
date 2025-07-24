'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

interface CancelFormDialogProps {
  isOpen: boolean
  onClose: () => void
  onEraseForm: () => void
}

export function CancelFormDialog({
  isOpen,
  onClose,
  onEraseForm
}: CancelFormDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-amber-600">
            <AlertTriangle className="h-5 w-5" />
            Cancel Form
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-sm text-amber-800 font-medium mb-2">
              ⚠️ You will lose all progress
            </p>
            <p className="text-sm text-amber-700">
              All form data, uploaded files, and progress will be permanently lost if you continue. 
              This action cannot be undone.
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-gray-700">
              Are you sure you want to cancel and erase all form data?
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
          >
            Go Back
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onEraseForm}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Erase Form
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}