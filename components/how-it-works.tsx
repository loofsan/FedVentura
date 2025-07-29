"use client";

import { UserPlus, FileText, Target, BookOpen } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";

const steps = [
  {
    icon: UserPlus,
    title: "Create your Profile",
    description:
      "Sign up and tell us about your business goals, experience, and industry preferences.",
    color: "text-primary",
    bgColor: "bg-primary/10",
    link: "/profile",
    requiresAuth: true,
  },
  {
    icon: FileText,
    title: "Fill out our questionnaire",
    description:
      "Complete our comprehensive assessment to help our AI understand your unique situation.",
    color: "text-secondary",
    bgColor: "bg-secondary/10",
    link: "/profile",
    requiresAuth: true,
  },
  {
    icon: Target,
    title: "Get personalized advice based on your answers",
    description:
      "Receive tailored recommendations and strategies specifically designed for your business needs.",
    color: "text-accent",
    bgColor: "bg-accent/10",
    link: "/business-ideas",
    requiresAuth: true,
  },
  {
    icon: BookOpen,
    title: "Get resources and courses information to strengthen skills",
    description:
      "Access curated learning materials, courses, and tools to develop the skills you need to succeed.",
    color: "text-success",
    bgColor: "bg-success/10",
    link: "/resources",
    requiresAuth: true,
  },
];

export function HowItWorks() {
  const { user } = useAuth();

  return (
    <section className="py-20 bg-white">
      <div className="section-container">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            How it works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our streamlined process ensures you get the most relevant and
            actionable business advice in just four simple steps.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isClickable = user && step.requiresAuth;

            const CardContent = (
              <>
                <div className="space-y-6">
                  <div
                    className={`w-16 h-16 ${step.bgColor} rounded-xl flex items-center justify-center mx-auto`}
                  >
                    <Icon className={`w-8 h-8 ${step.color}`} />
                  </div>

                  <div className="text-center space-y-3">
                    <h3 className="text-xl font-semibold text-gray-900 leading-tight">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Step number */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                  {index + 1}
                </div>

                {/* Visual indicator for clickable cards */}
                {isClickable && (
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs text-primary font-medium">
                      Click to go →
                    </span>
                  </div>
                )}
              </>
            );

            // Render as Link if user is authenticated, otherwise as div
            if (isClickable) {
              return (
                <Link
                  key={index}
                  href={step.link}
                  className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 card-hover group cursor-pointer"
                >
                  {CardContent}
                </Link>
              );
            }

            return (
              <div
                key={index}
                className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 card-hover"
              >
                {CardContent}
              </div>
            );
          })}
        </div>

        {/* Call to action based on auth state */}
        {user ? (
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">
              Click any step above to jump directly to that section!
            </p>
            <Link href="/dashboard">
              <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-xl">
                Go to Dashboard
              </Button>
            </Link>
          </div>
        ) : (
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">
              Ready to start your entrepreneurial journey?
            </p>
            <Link href="/signin">
              <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-xl">
                Get Started
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
