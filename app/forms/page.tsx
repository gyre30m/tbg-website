"use client";

import { FileText, ClipboardList, Users } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { AuthModal } from "@/components/ui/auth-modal";
import { Header } from "@/components/ui/header";
import { FirmFormsTable } from "@/components/ui/firm-forms-table";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";

export default function FormsPage() {
  const { user, loading, userProfile } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      setShowAuthModal(true);
    }
  }, [loading, user]);

  // Add timeout to prevent infinite loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading) {
        console.error('Auth loading timeout - forcing auth modal');
        setShowAuthModal(true);
      }
    }, 10000); // 10 second timeout

    return () => clearTimeout(timeout);
  }, [loading]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
            <button 
              onClick={() => setShowAuthModal(true)}
              className="mt-4 text-sm text-blue-600 hover:text-blue-800 underline"
            >
              Having trouble? Click to sign in
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If not loading and no user, show auth modal immediately
  if (!user) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h2>
              <p className="text-gray-600 mb-6">Please sign in to access forms.</p>
              <button 
                onClick={() => setShowAuthModal(true)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)} 
        />
      </>
    );
  }

  const forms = [
    {
      id: 1,
      icon: FileText,
      title: "Personal Injury",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.",
      href: "/forms/personal-injury",
    },
    {
      id: 2,
      icon: ClipboardList,
      title: "Wrongful Death",
      description: "Comprehensive wrongful death case information form for economic loss calculations and dependent analysis.",
      href: "/forms/wrongful-death",
    },
    {
      id: 3,
      icon: Users,
      title: "Wrongful Termination",
      description: "Comprehensive wrongful termination case information form for documenting employment history, benefits, and economic impacts.",
      href: "/forms/wrongful-termination",
    },
  ];

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Forms
        </h1>
        <p className="mt-4 text-gray-600">
          Select a form to get started with your submission.
        </p>
      </div>

      <div className="mx-auto max-w-4xl space-y-6">
        {forms.map((form) => {
          const IconComponent = form.icon;
          const content = (
            <>
              <div className="flex-shrink-0">
                <IconComponent className="h-8 w-8 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900">
                  {form.title}
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  {form.description}
                </p>
              </div>
            </>
          );

          if (form.href) {
            return (
              <Link
                key={form.id}
                href={form.href}
                className="flex items-start space-x-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md cursor-pointer"
              >
                {content}
              </Link>
            );
          }

          return (
            <div
              key={form.id}
              className="flex items-start space-x-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
            >
              {content}
            </div>
          );
        })}
        
        {user && userProfile && (
          <>
            <div className="my-8">
              <Separator />
            </div>
            <FirmFormsTable />
          </>
        )}
        
        {user && !userProfile && (
          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-yellow-800">
              Your account is set up but your profile is still being created. 
              Please contact your administrator if this persists.
            </p>
          </div>
        )}
      </div>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
      </div>
    </>
  );
}