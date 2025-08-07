'use client'

import { useAuth } from '@/lib/auth-context'
import { LogOut, User } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PersonalInjuryHeaderProps {
  onSaveDraft: () => void;
  onSubmit: () => void;
  isSaving: boolean;
  isPending: boolean;
  saveMessage: string;
}

export function PersonalInjuryHeader({ 
  onSaveDraft, 
  onSubmit, 
  isSaving, 
  isPending, 
  saveMessage 
}: PersonalInjuryHeaderProps) {
  const { user, userProfile, userFirm, signOut } = useAuth()

  if (!user) return null

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-gray-600" />
              <span className="text-sm text-gray-700">{user.email}</span>
            </div>
            {userFirm && (
              <div className="text-sm text-gray-500">
                {userFirm.name}
              </div>
            )}
            {userProfile?.role && (
              <div className="px-2 py-1 bg-gray-100 rounded-md text-xs text-gray-600">
                {userProfile.role.replace('_', ' ').toUpperCase()}
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            {saveMessage && (
              <div className={`px-3 py-1 rounded-md text-sm ${
                saveMessage.includes("success") 
                  ? "bg-green-50 text-green-700 border border-green-200" 
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}>
                {saveMessage}
              </div>
            )}
            
            <Button 
              variant="outline"
              size="sm"
              disabled={isSaving}
              onClick={onSaveDraft}
            >
              {isSaving ? "Saving..." : "Save Draft"}
            </Button>
            
            <Button 
              size="sm"
              disabled={isPending || isSaving}
              onClick={onSubmit}
            >
              {isPending ? "Submitting..." : "Submit Form"}
            </Button>
            
            <button
              onClick={signOut}
              className="flex items-center space-x-2 rounded-md bg-gray-100 px-3 py-2 text-sm text-gray-700 hover:bg-gray-200 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}