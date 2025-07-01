"use client";

import { useState, useTransition } from "react";
import { PersonalInjuryHeader } from "@/components/ui/personal-injury-header";
import { PersonalInjuryForm } from "@/components/ui/personal-injury-form";
import {
  submitPersonalInjuryForm,
  saveDraftPersonalInjuryForm,
} from "@/lib/actions";

export default function PersonalInjuryPage() {
  const [isPending, startTransition] = useTransition();
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const handleSaveDraft = async () => {
    const form = document.querySelector("form") as HTMLFormElement;
    if (!form) return;

    const formData = new FormData(form);
    setIsSaving(true);
    setSaveMessage("");

    try {
      await saveDraftPersonalInjuryForm(formData);
      setSaveMessage("Draft saved successfully!");
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (error) {
      setSaveMessage("Failed to save draft. Please try again.");
      setTimeout(() => setSaveMessage(""), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = () => {
    const submitButton = document.getElementById(
      "submit-form-hidden"
    ) as HTMLButtonElement;
    if (submitButton) {
      startTransition(() => {
        submitButton.click();
      });
    }
  };

  const handleFormSubmit = (formData: FormData) => {
    startTransition(() => {
      submitPersonalInjuryForm(formData);
    });
  };

  return (
    <>
      <PersonalInjuryHeader
        onSaveDraft={handleSaveDraft}
        onSubmit={handleSubmit}
        isSaving={isSaving}
        isPending={isPending}
        saveMessage={saveMessage}
      />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                Personal Injury Form
              </h1>
              <p className="text-gray-600 mt-2">
                Please tell us more about your pending personal injury case. You
                may save a draft and come back to it later. To submit your form,
                all required fields must be completed. Once the form has been
                successfully submitted, The Bradley Group will be notified and a
                copy of the completed form will be sent to you and the site
                admin for your firm. The timestamp of the submitted form marks
                the beginning of any tolling period for time-sensitive actions.
              </p>
            </div>
            <PersonalInjuryForm
              onSaveDraft={() => handleSaveDraft()}
              onSubmit={handleFormSubmit}
            />
          </div>
        </div>
      </div>
    </>
  );
}
