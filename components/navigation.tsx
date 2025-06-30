'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Sparkles } from 'lucide-react';

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="section-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text">FedVentura</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/signin" className="text-gray-600 hover:text-primary transition-colors">
              Sign in
            </Link>
            <span className="text-gray-400">/</span>
            <Link href="/profile" className="text-gray-600 hover:text-primary transition-colors">
              Profile
            </Link>
            <span className="text-gray-400">/</span>
            <Link href="/dashboard" className="text-gray-600 hover:text-primary transition-colors">
              Dashboard
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-primary"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <Link href="/signin" className="text-gray-600 hover:text-primary transition-colors">
                Sign in
              </Link>
              <Link href="/profile" className="text-gray-600 hover:text-primary transition-colors">
                Profile
              </Link>
              <Link href="/dashboard" className="text-gray-600 hover:text-primary transition-colors">
                Dashboard
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}