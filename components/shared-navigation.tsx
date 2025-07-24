"use client";

import Link from "next/link";
import { Sparkles, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { ProfileDropdown } from "./profile-dropdown";

interface SharedNavigationProps {
  showBackButton?: boolean;
  backButtonHref?: string;
  backButtonText?: string;
}

export function SharedNavigation({
  showBackButton = false,
  backButtonHref = "/dashboard",
  backButtonText = "Back to Dashboard",
}: SharedNavigationProps) {
  const { user, loading } = useAuth();

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="section-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text">FedVentura</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {loading ? (
              <div className="h-8 w-24 bg-gray-200 animate-pulse rounded" />
            ) : user ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/profile"
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  Profile
                </Link>
                <Link
                  href="/business-ideas"
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  Business Ideas
                </Link>
                <Link
                  href="/resources"
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  Resources
                </Link>
                <ProfileDropdown />
              </>
            ) : (
              <>
                <Link
                  href="/signin"
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  Sign in
                </Link>
              </>
            )}
          </div>

          {/* Back Button or Mobile Menu */}
          {showBackButton && (
            <Link
              href={backButtonHref}
              className="flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors md:hidden"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{backButtonText}</span>
            </Link>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden py-2 border-t border-gray-200">
          <div className="flex items-center justify-between">
            {user ? (
              <>
                <div className="flex space-x-4 text-sm">
                  <Link
                    href="/dashboard"
                    className="text-gray-600 hover:text-primary"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    className="text-gray-600 hover:text-primary"
                  >
                    Profile
                  </Link>
                  <Link
                    href="/business-ideas"
                    className="text-gray-600 hover:text-primary"
                  >
                    Ideas
                  </Link>
                </div>
                <ProfileDropdown />
              </>
            ) : (
              <Link href="/signin" className="text-sm text-primary font-medium">
                Sign in
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
