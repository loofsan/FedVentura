"use client";

import { QuestionnaireComponent } from "@/components/questionnaire";
import { SharedNavigation } from "@/components/shared-navigation";

export default function Profile() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <SharedNavigation showBackButton backButtonHref="/dashboard" />

      {/* Main Content */}
      <div className="section-container py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-gray-900">
              Complete Your Profile
            </h1>
            <p className="text-xl text-gray-600">
              Answer these questions to help us provide personalized business
              recommendations tailored to your goals and situation.
            </p>
          </div>

          {/* Questionnaire Component */}
          <QuestionnaireComponent />
        </div>
      </div>
    </div>
  );
}
