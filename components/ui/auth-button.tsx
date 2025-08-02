"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AuthButtonProps {
  className?: string;
  hideNameOnMobile?: boolean;
}

export function AuthButton({ className, hideNameOnMobile = true }: AuthButtonProps) {
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

  // Get user display name
  const getUserDisplayName = () => {
    if (userProfile?.first_name && userProfile?.last_name) {
      return `${userProfile.first_name} ${userProfile.last_name}`;
    }
    return user?.email || "";
  };

  if (!user) {
    return (
      <Link href="/signin" className={className}>
        <Button
          variant="default"
          className="bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200 text-white dark:text-gray-900"
        >
          Sign in
        </Button>
      </Link>
    );
  }

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {/* User initials circle - matching sign in button colors */}
      <div className="h-9 w-9 rounded-full bg-gray-900 dark:bg-gray-100 flex items-center justify-center text-white dark:text-gray-900 text-sm font-medium">
        {getUserInitials()}
      </div>
      {/* User name (optionally hidden on mobile) */}
      {userProfile && (
        <div className={cn(hideNameOnMobile && "hidden sm:block")}>
          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {getUserDisplayName()}
          </div>
        </div>
      )}
    </div>
  );
}