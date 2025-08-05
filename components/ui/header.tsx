"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/browser-client";
import { LogOut, Edit, FileText } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { AuthButton } from "@/components/ui/auth-button";

interface HeaderProps {
  formActions?: React.ReactNode;
  variant?: 'default' | 'simple';
}

export function Header({ formActions, variant = 'default' }: HeaderProps) {
  const { user, userProfile, signOut } = useAuth();
  const router = useRouter();
  const [firmFormsUrl, setFirmFormsUrl] = useState<string>('/forms');

  // Fetch firm data to construct proper forms URL
  useEffect(() => {
    const fetchFirmFormsUrl = async () => {
      if (userProfile?.firm_id) {
        try {
          const supabase = createClient();
          const { data: firmData } = await supabase
            .from('firms')
            .select('slug, name')
            .eq('id', userProfile.firm_id)
            .single();

          if (firmData) {
            const firmIdentifier = firmData.slug || encodeURIComponent(firmData.name);
            setFirmFormsUrl(`/firms/${firmIdentifier}/forms`);
          }
        } catch (error) {
          console.error('Error fetching firm for forms URL:', error);
          // Keep default /forms URL
        }
      }
    };

    fetchFirmFormsUrl();
  }, [userProfile]);

  // Simple variant for unauthenticated pages
  if (variant === 'simple') {
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

            {/* Auth Button */}
            <AuthButton />
          </div>
        </div>
      </header>
    );
  }

  if (!user) return null;

  // Custom sign out handler that redirects to home page
  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  // const getRoleBadge = () => {
  //   if (isSiteAdmin) return <Badge variant="default">Site Admin</Badge>;
  //   if (isFirmAdmin) return <Badge variant="secondary">Firm Admin</Badge>;
  //   return <Badge variant="outline">User</Badge>;
  // };

  const getUserDisplayName = () => {
    if (userProfile?.first_name && userProfile?.last_name) {
      return `${userProfile.first_name} ${userProfile.last_name}`;
    }
    return user.email;
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-4 flex-shrink-0">
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <Image
                src="/web-logo.svg"
                alt="The Bradley Group"
                width={300}
                height={75}
                className="h-12 w-auto dark:hidden"
                priority
              />
              <Image
                src="/web-logo-dark.svg"
                alt="The Bradley Group"
                width={300}
                height={75}
                className="h-12 w-auto hidden dark:block"
                priority
              />
            </Link>
          </div>

          {/* Form Actions - Center */}
          {formActions && (
            <div className="flex items-center justify-center flex-1 px-4">
              {formActions}
            </div>
          )}

          {/* User Menu */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="p-0 h-auto hover:bg-transparent"
                >
                  <AuthButton />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {getUserDisplayName()}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    href={firmFormsUrl}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <FileText className="h-4 w-4" />
                    <span>Forms</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/profile"
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <Edit className="h-4 w-4" />
                    <span>Edit Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 cursor-pointer text-red-600 focus:text-red-600"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
