"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

export function FormsHeader() {
  const { user, userProfile } = useAuth();

  // Get user initials for the circle
  const getUserInitials = () => {
    if (userProfile?.first_name && userProfile?.last_name) {
      return `${userProfile.first_name[0]}${userProfile.last_name[0]}`.toUpperCase();
    }
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return "U";
  };

  return (
    <header className="print:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <Image
                src="/web-logo.svg"
                alt="The Bradley Group"
                width={300}
                height={75}
                className="h-10 w-auto dark:hidden"
                priority
              />
              <Image
                src="/web-logo-dark.svg"
                alt="The Bradley Group"
                width={300}
                height={75}
                className="h-10 w-auto hidden dark:block"
                priority
              />
            </Link>
          </div>

          {/* Sign In / User Info */}
          <div className="flex items-center">
            {user ? (
              <div className="flex items-center space-x-3">
                {/* User initials circle */}
                <div className="h-9 w-9 rounded-full bg-blue-600 dark:bg-blue-500 flex items-center justify-center text-white text-sm font-medium">
                  {getUserInitials()}
                </div>
                {/* User name (hidden on mobile) */}
                <div className="hidden sm:block">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {userProfile?.first_name && userProfile?.last_name 
                      ? `${userProfile.first_name} ${userProfile.last_name}`
                      : user.email
                    }
                  </div>
                </div>
              </div>
            ) : (
              <Link href="/signin">
                <Button variant="default" className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>Sign In</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}