import {
  Sparkles,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Linkedin,
  Twitter,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="section-container space-y-12">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 place-items-center">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 flex items-center justify-center bg-gradient-to-br from-primary to-secondary rounded-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold">FedVentura</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Empowering entrepreneurs with AI-driven business insights and
              personalized guidance for sustainable growth.
            </p>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Get in Touch</h3>
            <div className="space-y-3 text-sm text-gray-400">
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4" />
                <span>foobar@fedventura.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4" />
                <span>+1 (555) 555-5555</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4" />
                <span>San Francisco, CA</span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-gray-400 space-y-4 md:space-y-0">
          <p>&copy; 2025 FedVentura. All rights reserved.</p>
          <div className="flex items-center space-x-4">
            <a
              href="https://fedventura.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
