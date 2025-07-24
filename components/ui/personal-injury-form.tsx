"use client";

import { submitPersonalInjuryForm } from "@/lib/actions";
import { ContactInfo } from "@/components/ui/contact-info";
import { DemographicInfo } from "@/components/ui/demographic-info";
import { HouseholdInfo } from "@/components/ui/household-info";
import { MedicalInfo } from "@/components/ui/medical-info";
import { EducationInfo } from "@/components/ui/education-info";
import { PreInjuryEmployment } from "@/components/ui/pre-injury-employment";
import { PostInjuryEmployment } from "@/components/ui/post-injury-employment";
import { HouseholdServices } from "@/components/ui/household-services";
import { Litigation } from "@/components/ui/litigation";

interface PersonalInjuryFormProps {
  onSaveDraft?: (formData: FormData) => void;
  onSubmit?: (formData: FormData) => void;
}

export function PersonalInjuryForm({ 
  onSaveDraft, 
  onSubmit
}: PersonalInjuryFormProps) {
  const handleSubmit = (formData: FormData) => {
    if (onSubmit) {
      onSubmit(formData);
    } else {
      submitPersonalInjuryForm(formData);
    }
  };

  return (
    <>
      <form action={handleSubmit} className="space-y-6">
        <ContactInfo />
        <DemographicInfo />
        <HouseholdInfo />
        <MedicalInfo />
        <EducationInfo />
        <PreInjuryEmployment />
        <PostInjuryEmployment />
        <HouseholdServices />
        <Litigation />

        {/* Hidden buttons for form submission - actual buttons are in sticky header */}
        <div className="hidden">
          <button 
            type="button" 
            id="save-draft-hidden"
            onClick={(e) => {
              e.preventDefault();
              if (onSaveDraft) {
                const form = e.currentTarget.closest('form') as HTMLFormElement;
                if (form) {
                  const formData = new FormData(form);
                  onSaveDraft(formData);
                }
              }
            }}
          >
            Save Draft
          </button>
          <button type="submit" id="submit-form-hidden">Submit</button>
        </div>
      </form>
    </>
  );
}
