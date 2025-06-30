import { Sparkles, Mail, Phone, MapPin } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="section-container">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold">FedVentura</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Empowering entrepreneurs with AI-driven business insights and personalized guidance for sustainable growth.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Link href="/about" className="text-gray-400 hover:text-white transition-colors block">
                About Us
              </Link>
              <Link href="/services" className="text-gray-400 hover:text-white transition-colors block">
                Services
              </Link>
              <Link href="/pricing" className="text-gray-400 hover:text-white transition-colors block">
                Pricing
              </Link>
              <Link href="/contact" className="text-gray-400 hover:text-white transition-colors block">
                Contact
              </Link>
            </div>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <div className="space-y-2">
              <Link href="/help" className="text-gray-400 hover:text-white transition-colors block">
                Help Center
              </Link>
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors block">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors block">
                Terms of Service
              </Link>
              <Link href="/faq" className="text-gray-400 hover:text-white transition-colors block">
                FAQ
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Get in Touch</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-400 text-sm">
                <Mail className="w-4 h-4" />
                <span>hello@fedventura.com</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400 text-sm">
                <Phone className="w-4 h-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400 text-sm">
                <MapPin className="w-4 h-4" />
                <span>San Francisco, CA</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; 2024 FedVentura. All rights reserved. Built with innovation and care.</p>
        </div>
      </div>
    </footer>
  );
}