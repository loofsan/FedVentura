import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  CheckCircle,
  BookOpen,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const dashboardItems = [
  {
    id: 1,
    title: "Complete your profile to get personalized recommendations!",
    description:
      "Fill out your business profile to receive tailored advice and insights.",
    buttonText: "Complete Profile",
    icon: Target,
    completed: false,
    href: "/profile",
  },
  {
    id: 2,
    title:
      "Completed your profile? Go to your top 3 personalized business ideas",
    description:
      "Discover business opportunities that match your skills and interests.",
    buttonText: "View Ideas",
    icon: CheckCircle,
    completed: false,
    href: "/business-ideas",
  },
  {
    id: 3,
    title:
      "Check our resources page to get personalized tips, courses and skills needed to get your business thriving",
    description:
      "Access curated learning materials and tools to develop your entrepreneurial skills.",
    buttonText: "Browse Resources",
    icon: BookOpen,
    completed: false,
    href: "/resources",
  },
];

export default function Dashboard() {
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
              <Link
                href="/profile"
                className="text-gray-600 hover:text-primary transition-colors"
              >
                Profile
              </Link>
              <span className="text-gray-400">/</span>
              <Link href="/dashboard" className="text-primary font-medium">
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="section-container py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-xl text-gray-600">
              Welcome to your FedVentura dashboard. Complete the steps below to
              get started on your entrepreneurial journey.
            </p>
          </div>

          {/* Dashboard Items */}
          <div className="space-y-6">
            {dashboardItems.map((item) => {
              const Icon = item.icon;
              return (
                <Card
                  key={item.id}
                  className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <CardContent className="p-8">
                    <div className="flex items-center justify-between">
                      <div className="flex items-start space-x-6 flex-1">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl flex items-center justify-center">
                            <Icon className="w-6 h-6 text-primary" />
                          </div>
                        </div>

                        <div className="flex-1 space-y-3">
                          <h3 className="text-lg font-semibold text-gray-900 leading-tight">
                            {item.title}
                          </h3>
                          <p className="text-gray-600 text-sm leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex-shrink-0 ml-6">
                        <Button
                          asChild
                          className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                        >
                          <Link
                            href={item.href}
                            className="flex items-center space-x-2"
                          >
                            <span>{item.buttonText}</span>
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Additional Info */}
          <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-xl mx-auto flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">
              Need Help Getting Started?
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our AI-powered platform is designed to guide you through every
              step of your entrepreneurial journey. Complete your profile first
              to unlock personalized recommendations.
            </p>
            <Button
              asChild
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-white transition-colors duration-200"
            >
              <Link href="/help">Get Help</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
