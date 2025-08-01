"use client";

import { FileText, ClipboardList, Users, Download } from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/ui/header";

export default function FormsPage() {
  const forms = [
    {
      id: 1,
      icon: FileText,
      title: "Personal Injury",
      description:
        "Economic loss information form for personal injury cases. Includes sections for medical, employment, education, and household services impacts.",
      href: "/personal-injury-form-printable.html",
    },
    {
      id: 2,
      icon: ClipboardList,
      title: "Wrongful Death",
      description:
        "Economic loss information form for wrongful death cases. Includes sections for dependents, employment history, and household services.",
      href: "/wrongful-death-form-printable.html",
    },
    {
      id: 3,
      icon: Users,
      title: "Wrongful Termination",
      description:
        "Economic loss information form for wrongful termination cases. Includes sections for employment history, job search efforts, and economic impacts.",
      href: "/wrongful-termination-form-printable.html",
    },
  ];

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Economic Loss Information Forms
          </h1>
          <p className="mt-4 text-gray-600">
            Download and complete the appropriate form for your case type.
          </p>
        </div>

        <div className="mx-auto max-w-4xl">
          {/* Printable Forms Section */}

          <div className="space-y-4">
            {forms.map((form) => {
              const IconComponent = form.icon;
              return (
                <Link
                  key={form.id}
                  href={form.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start space-x-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-blue-300 cursor-pointer group"
                >
                  <div className="flex-shrink-0">
                    <IconComponent className="h-8 w-8 text-blue-600 group-hover:text-blue-700" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-700">
                        {form.title}
                      </h3>
                      <Download className="h-5 w-5 text-gray-400 group-hover:text-blue-600" />
                    </div>
                    <p className="mt-2 text-sm text-gray-600">
                      {form.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">
              Instructions for Printable Forms:
            </h3>
            <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
              <li>Click on the form you need above to open it in a new tab</li>
              <li>
                You can either fill it out digitally and then print, or print it
                blank to fill by hand
              </li>
              <li>Complete all required fields (marked with *)</li>
              <li>Gather all supporting documents listed in the form</li>
              <li>
                Email the completed form and documents to:
                forms@the-bradley-group.com
              </li>
            </ol>
          </div>
        </div>
      </div>
    </>
  );
}
