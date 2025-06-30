"use client";

import Link from "next/link";
import { Sparkles, ArrowLeft } from "lucide-react";
import { QuestionnaireComponent } from "@/components/questionnaire";

export default function Profile() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="section-container">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold gradient-text">
                FedVentura
              </span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="/signin"
                className="text-gray-600 hover:text-primary transition-colors"
              >
                Sign in
              </Link>
              <span className="text-gray-400">/</span>
              <Link href="/profile" className="text-primary font-medium">
                Profile
              </Link>
              <span className="text-gray-400">/</span>
              <Link
                href="/dashboard"
                className="text-gray-600 hover:text-primary transition-colors"
              >
                Dashboard
              </Link>
            </div>

            {/* Back to Dashboard */}
            <Link
              href="/dashboard"
              className="flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </Link>
          </div>
        </div>
      </nav>

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
