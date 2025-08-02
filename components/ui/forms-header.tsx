"use client";

import Link from "next/link";
import Image from "next/image";
import { AuthButton } from "@/components/ui/auth-button";

export function FormsHeader() {
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
          <AuthButton />
        </div>
      </div>
    </header>
  );
}