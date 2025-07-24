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
          <section className="space-y-16">
            {/* Getting Started Instructions */}
            <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-8 text-center space-y-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-xl mx-auto flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-white" />
              </div>

              <h3 className="text-2xl font-semibold text-gray-900">
                How to Get Started
              </h3>

              <p className="text-gray-600 max-w-2xl mx-auto">
                Follow these simple steps to make the most of the platform:
              </p>

              <ol className="text-left max-w-2xl mx-auto space-y-4 list-decimal list-inside text-gray-700">
                <li>
                  <strong>Complete the Questionnaire:</strong> Tell us about
                  your interests, skills, and goals so we can match you with the
                  right business ideas.
                </li>
                <li>
                  <strong>Review Your Recommendations:</strong> Explore tailored
                  business ideas and click on any to view next steps and
                  required skills.
                </li>
                <li>
                  <strong>View Learning Resources:</strong> Get AI-powered
                  course recommendations from Coursera, LinkedIn Learning, and
                  Udemy.
                </li>
                <li>
                  <strong>Start Building:</strong> Use the roadmap and learning
                  resources to start developing your business today.
                </li>
              </ol>

              <p className="text-gray-600 max-w-2xl mx-auto">
                You&#39;re never alone—our platform is here to guide you from
                idea to execution.
              </p>
            </div>
            {/* FAQ Section */}
            <div className="mt-12 bg-white rounded-2xl shadow-md p-8 space-y-6">
              <h3 className="text-2xl font-bold text-center text-gray-900">
                Frequently Asked Questions
              </h3>

              <div className="space-y-4">
                {/* FAQ Item */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-800">
                    What if I don&#39;t have any business experience?
                  </h4>
                  <p className="text-gray-600">
                    No problem! Our platform is designed for everyone. The AI
                    will recommend business ideas and learning resources
                    tailored to your skill level.
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-800">
                    Are the course recommendations free?
                  </h4>
                  <p className="text-gray-600">
                    Some courses are free, while others may require a
                    subscription or one-time payment. We try to include a mix
                    from Coursera, LinkedIn Learning, and Udemy.
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-800">
                    How do I start executing my business idea?
                  </h4>
                  <p className="text-gray-600">
                    Once you&#39;ve reviewed your business idea, check the
                    &#34;Next Steps&#34; list and start learning the recommended
                    skills using the provided courses.
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-800">
                    What powers the AI recommendations?
                  </h4>
                  <p className="text-gray-600">
                    We use Google&#39;s Gemini model to generate intelligent
                    course recommendations based on your business idea and
                    required skills.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
