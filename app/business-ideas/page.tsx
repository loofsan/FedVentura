"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowLeft,
  BookOpen,
  ExternalLink,
  Clock,
  Star,
  Users,
  Award,
  Target,
  Brain,
  DollarSign,
  ArrowRight,
  Loader2,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GoogleGenerativeAI } from "@google/generative-ai";

interface BusinessIdea {
  title: string;
  description: string;
  startupCost: string;
  timeToProfit: string;
  skillsNeeded: string[];
  nextSteps: string[];
}

interface Course {
  title: string;
  provider: "LinkedIn Learning" | "Udemy" | "Coursera";
  instructor: string;
  duration: string;
  rating: number;
  students: string;
  price: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  description: string;
  url: string;
  skills: string[];
}

interface CourseRecommendations {
  foundational: Course[];
  specialized: Course[];
  advanced: Course[];
}

// Mock business ideas for demonstration
const mockBusinessIdeas: BusinessIdea[] = [
  {
    title: "Freelance Creative Services",
    description:
      "Start a freelance business offering design, content creation, or marketing services based on your creative skills.",
    startupCost: "$200-$800",
    timeToProfit: "1-3 months",
    skillsNeeded: [
      "Creative skills",
      "Client communication",
      "Project management",
    ],
    nextSteps: [
      "Build a portfolio of your best work",
      "Set up profiles on freelance platforms",
      "Network with potential clients",
      "Create pricing packages",
    ],
  },
  {
    title: "Consulting & Coaching",
    description:
      "Leverage your people skills and professional experience to offer consulting or coaching services.",
    startupCost: "$300-$1,000",
    timeToProfit: "2-4 months",
    skillsNeeded: ["Industry expertise", "Communication", "Problem-solving"],
    nextSteps: [
      "Define your niche and target market",
      "Create a simple website",
      "Develop service packages",
      "Reach out to your professional network",
    ],
  },
  {
    title: "Online Course Creation",
    description:
      "Create and sell online courses teaching skills you've mastered in your career or personal interests.",
    startupCost: "$300-$1,000",
    timeToProfit: "3-6 months",
    skillsNeeded: [
      "Subject expertise",
      "Content creation",
      "Basic video editing",
    ],
    nextSteps: [
      "Choose your course topic and validate demand",
      "Outline your course curriculum",
      "Record pilot lessons",
      "Choose a platform like Teachable or Udemy",
    ],
  },
];

// Helper function to extract JSON from AI response
function extractJSON(text: string): any {
  try {
    return JSON.parse(text);
  } catch (e) {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch (e2) {
        let cleaned = jsonMatch[0]
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .replace(/\n/g, " ")
          .replace(/\s+/g, " ")
          .trim();
        return JSON.parse(cleaned);
      }
    }
    throw new Error("No valid JSON found in response");
  }
}

// Fallback course recommendations
const getFallbackCourses = (businessTitle: string): CourseRecommendations => {
  const isCreative =
    businessTitle.toLowerCase().includes("creative") ||
    businessTitle.toLowerCase().includes("design");
  const isConsulting =
    businessTitle.toLowerCase().includes("consulting") ||
    businessTitle.toLowerCase().includes("coaching");
  const isCourse =
    businessTitle.toLowerCase().includes("course") ||
    businessTitle.toLowerCase().includes("teaching");

  if (isCreative) {
    return {
      foundational: [
        {
          title: "Graphic Design Fundamentals",
          provider: "Coursera",
          instructor: "California Institute of the Arts",
          duration: "4 weeks",
          rating: 4.7,
          students: "150K+",
          price: "$49/month",
          level: "Beginner",
          description:
            "Learn the fundamentals of graphic design including typography, color theory, and composition.",
          url: "https://coursera.org/learn/fundamentals-of-graphic-design",
          skills: ["Typography", "Color Theory", "Adobe Creative Suite"],
        },
        {
          title: "Freelancing Fundamentals",
          provider: "LinkedIn Learning",
          instructor: "John Doe",
          duration: "2 hours",
          rating: 4.5,
          students: "50K+",
          price: "$29.99/month",
          level: "Beginner",
          description:
            "Essential skills for starting and managing a successful freelance business.",
          url: "https://linkedin.com/learning/freelancing-fundamentals",
          skills: ["Client Management", "Pricing", "Contracts"],
        },
      ],
      specialized: [
        {
          title: "Advanced Adobe Photoshop",
          provider: "Udemy",
          instructor: "Jane Smith",
          duration: "12 hours",
          rating: 4.8,
          students: "75K+",
          price: "$84.99",
          level: "Intermediate",
          description:
            "Master advanced Photoshop techniques for professional design work.",
          url: "https://udemy.com/course/advanced-photoshop",
          skills: ["Photo Manipulation", "Digital Art", "Retouching"],
        },
      ],
      advanced: [
        {
          title: "Building a Creative Agency",
          provider: "LinkedIn Learning",
          instructor: "Creative Director Pro",
          duration: "3 hours",
          rating: 4.6,
          students: "25K+",
          price: "$29.99/month",
          level: "Advanced",
          description:
            "Scale your creative services into a full-service agency.",
          url: "https://linkedin.com/learning/building-creative-agency",
          skills: [
            "Team Management",
            "Business Development",
            "Client Relations",
          ],
        },
      ],
    };
  }

  if (isConsulting) {
    return {
      foundational: [
        {
          title: "Consulting Fundamentals",
          provider: "Coursera",
          instructor: "University of Virginia",
          duration: "6 weeks",
          rating: 4.6,
          students: "100K+",
          price: "$49/month",
          level: "Beginner",
          description:
            "Learn the core principles of management consulting and problem-solving.",
          url: "https://coursera.org/learn/consulting-fundamentals",
          skills: ["Problem Solving", "Client Relations", "Business Analysis"],
        },
      ],
      specialized: [
        {
          title: "Executive Coaching Certification",
          provider: "Udemy",
          instructor: "Coaching Institute",
          duration: "20 hours",
          rating: 4.7,
          students: "30K+",
          price: "$129.99",
          level: "Intermediate",
          description:
            "Become a certified executive coach with proven methodologies.",
          url: "https://udemy.com/course/executive-coaching",
          skills: ["Leadership Development", "Communication", "Goal Setting"],
        },
      ],
      advanced: [
        {
          title: "Strategic Business Consulting",
          provider: "LinkedIn Learning",
          instructor: "Strategy Expert",
          duration: "4 hours",
          rating: 4.8,
          students: "40K+",
          price: "$29.99/month",
          level: "Advanced",
          description:
            "Advanced strategies for high-level business consulting.",
          url: "https://linkedin.com/learning/strategic-consulting",
          skills: [
            "Strategic Planning",
            "Change Management",
            "Executive Presence",
          ],
        },
      ],
    };
  }

  // Default/Course Creation fallback
  return {
    foundational: [
      {
        title: "Online Course Creation",
        provider: "Udemy",
        instructor: "Course Creator Pro",
        duration: "8 hours",
        rating: 4.5,
        students: "80K+",
        price: "$94.99",
        level: "Beginner",
        description: "Complete guide to creating and selling online courses.",
        url: "https://udemy.com/course/online-course-creation",
        skills: ["Course Design", "Video Production", "Student Engagement"],
      },
    ],
    specialized: [
      {
        title: "Video Production for Educators",
        provider: "LinkedIn Learning",
        instructor: "Video Expert",
        duration: "3 hours",
        rating: 4.6,
        students: "35K+",
        price: "$29.99/month",
        level: "Intermediate",
        description:
          "Professional video production techniques for online education.",
        url: "https://linkedin.com/learning/video-production-educators",
        skills: ["Video Editing", "Lighting", "Audio Production"],
      },
    ],
    advanced: [
      {
        title: "Building an Online Education Empire",
        provider: "Coursera",
        instructor: "EdTech University",
        duration: "8 weeks",
        rating: 4.7,
        students: "20K+",
        price: "$79/month",
        level: "Advanced",
        description:
          "Scale your online education business to multiple revenue streams.",
        url: "https://coursera.org/learn/education-empire",
        skills: ["Business Scaling", "Marketing", "Platform Management"],
      },
    ],
  };
};

export default function BusinessIdeas() {
  const [selectedIdea, setSelectedIdea] = useState<BusinessIdea | null>(null);
  const [courses, setCourses] = useState<CourseRecommendations | null>(null);
  const [isLoadingCourses, setIsLoadingCourses] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get business idea from URL params or use first mock idea
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const ideaIndex = urlParams.get("idea");

    if (ideaIndex && mockBusinessIdeas[parseInt(ideaIndex)]) {
      setSelectedIdea(mockBusinessIdeas[parseInt(ideaIndex)]);
    } else {
      setSelectedIdea(mockBusinessIdeas[0]);
    }
  }, []);

  const generateCourseRecommendations = async (businessIdea: BusinessIdea) => {
    setIsLoadingCourses(true);
    setError(null);

    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("Gemini API key not found");
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

      const prompt = `Based on the business idea "${
        businessIdea.title
      }" with required skills: ${businessIdea.skillsNeeded.join(
        ", "
      )}, recommend specific courses from LinkedIn Learning, Udemy, and Coursera that would help someone develop the necessary skills.

Business Description: ${businessIdea.description}

Please provide course recommendations in three categories:
1. Foundational (2-3 courses for beginners)
2. Specialized (2-3 intermediate courses for specific skills)
3. Advanced (1-2 advanced courses for scaling/mastery)

IMPORTANT: Provide response in valid JSON format only:

{
  "foundational": [
    {
      "title": "Course Title",
      "provider": "LinkedIn Learning" | "Udemy" | "Coursera",
      "instructor": "Instructor Name",
      "duration": "X hours/weeks",
      "rating": 4.5,
      "students": "50K+",
      "price": "$XX.XX",
      "level": "Beginner",
      "description": "Course description",
      "url": "https://platform.com/course-url",
      "skills": ["skill1", "skill2", "skill3"]
    }
  ],
  "specialized": [...],
  "advanced": [...]
}

Make the courses realistic and relevant to the business idea. Include a mix of all three platforms.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      try {
        const parsedResponse = extractJSON(text);
        setCourses(parsedResponse);
      } catch (parseError) {
        console.error("Error parsing course recommendations:", parseError);
        setCourses(getFallbackCourses(businessIdea.title));
      }
    } catch (error) {
      console.error("Error generating course recommendations:", error);
      setError(
        "Unable to generate course recommendations. Showing general suggestions."
      );
      setCourses(getFallbackCourses(businessIdea.title));
    } finally {
      setIsLoadingCourses(false);
    }
  };

  const handleIdeaSelect = (idea: BusinessIdea) => {
    setSelectedIdea(idea);
    setCourses(null);
    generateCourseRecommendations(idea);
  };

  useEffect(() => {
    if (selectedIdea) {
      generateCourseRecommendations(selectedIdea);
    }
  }, [selectedIdea]);

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case "LinkedIn Learning":
        return "💼";
      case "Udemy":
        return "🎓";
      case "Coursera":
        return "🏛️";
      default:
        return "📚";
    }
  };

  const getProviderColor = (provider: string) => {
    switch (provider) {
      case "LinkedIn Learning":
        return "bg-blue-100 text-blue-800";
      case "Udemy":
        return "bg-purple-100 text-purple-800";
      case "Coursera":
        return "bg-indigo-100 text-indigo-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="section-container">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold gradient-text">
                FedVentura
              </span>
            </Link>

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
              <Link
                href="/dashboard"
                className="text-gray-600 hover:text-primary transition-colors"
              >
                Dashboard
              </Link>
            </div>

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
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-gray-900">
              Business Ideas & Learning Path
            </h1>
            <p className="text-xl text-gray-600">
              Explore your personalized business recommendations and discover
              courses to build the skills you need.
            </p>
          </div>

          {/* Business Ideas Selection */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {mockBusinessIdeas.map((idea, index) => (
              <Card
                key={index}
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  selectedIdea?.title === idea.title
                    ? "ring-2 ring-primary shadow-lg"
                    : "hover:shadow-md"
                }`}
                onClick={() => handleIdeaSelect(idea)}
              >
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    {idea.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-gray-600 text-sm">{idea.description}</p>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>💰 {idea.startupCost}</span>
                    <span>⏱️ {idea.timeToProfit}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {selectedIdea && (
            <>
              {/* Selected Business Idea Details */}
              <Card className="shadow-xl border-0 bg-white">
                <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5 p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-bold text-gray-900">
                        {selectedIdea.title}
                      </CardTitle>
                      <p className="text-gray-600 mt-2">
                        {selectedIdea.description}
                      </p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-6">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                          <DollarSign className="w-4 h-4 mr-2 text-primary" />
                          Investment & Timeline
                        </h4>
                        <div className="space-y-2">
                          <p className="text-gray-600">
                            <strong>Startup Cost:</strong>{" "}
                            {selectedIdea.startupCost}
                          </p>
                          <p className="text-gray-600">
                            <strong>Time to Profit:</strong>{" "}
                            {selectedIdea.timeToProfit}
                          </p>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                          <Brain className="w-4 h-4 mr-2 text-secondary" />
                          Skills Needed
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedIdea.skillsNeeded.map((skill, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="bg-gray-100 text-gray-700"
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <ArrowRight className="w-4 h-4 mr-2 text-success" />
                        Next Steps
                      </h4>
                      <div className="space-y-3">
                        {selectedIdea.nextSteps.map((step, index) => (
                          <div
                            key={index}
                            className="flex items-start space-x-3"
                          >
                            <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold text-sm mt-0.5">
                              {index + 1}
                            </div>
                            <p className="text-gray-600 text-sm">{step}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Course Recommendations */}
              <div className="space-y-8">
                <div className="text-center space-y-4">
                  <h2 className="text-3xl font-bold text-gray-900 flex items-center justify-center">
                    <BookOpen className="w-8 h-8 mr-3 text-primary" />
                    Recommended Learning Path
                  </h2>
                  <p className="text-lg text-gray-600">
                    Build the skills you need with these carefully selected
                    courses from top platforms.
                  </p>
                  {error && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 max-w-2xl mx-auto">
                      <p className="text-yellow-800 text-sm">{error}</p>
                    </div>
                  )}
                </div>

                {isLoadingCourses ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center space-y-4">
                      <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
                      <p className="text-gray-600">
                        Generating personalized course recommendations...
                      </p>
                    </div>
                  </div>
                ) : courses ? (
                  <div className="space-y-12">
                    {/* Foundational Courses */}
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                          <span className="text-green-600 font-bold">1</span>
                        </div>
                        Foundational Courses
                      </h3>
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.foundational.map((course, index) => (
                          <Card
                            key={index}
                            className="shadow-lg hover:shadow-xl transition-shadow duration-200"
                          >
                            <CardHeader className="pb-4">
                              <div className="flex items-start justify-between mb-2">
                                <Badge
                                  className={getProviderColor(course.provider)}
                                >
                                  {getProviderIcon(course.provider)}{" "}
                                  {course.provider}
                                </Badge>
                                <Badge variant="outline">{course.level}</Badge>
                              </div>
                              <CardTitle className="text-lg font-semibold text-gray-900 leading-tight">
                                {course.title}
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <p className="text-gray-600 text-sm">
                                {course.description}
                              </p>

                              <div className="space-y-2 text-sm">
                                <div className="flex items-center justify-between">
                                  <span className="text-gray-500">
                                    Instructor:
                                  </span>
                                  <span className="font-medium">
                                    {course.instructor}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-gray-500 flex items-center">
                                    <Clock className="w-3 h-3 mr-1" />
                                    Duration:
                                  </span>
                                  <span className="font-medium">
                                    {course.duration}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-gray-500 flex items-center">
                                    <Star className="w-3 h-3 mr-1" />
                                    Rating:
                                  </span>
                                  <span className="font-medium">
                                    {course.rating}/5
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-gray-500 flex items-center">
                                    <Users className="w-3 h-3 mr-1" />
                                    Students:
                                  </span>
                                  <span className="font-medium">
                                    {course.students}
                                  </span>
                                </div>
                              </div>

                              <div className="flex flex-wrap gap-1">
                                {course.skills.map((skill, skillIndex) => (
                                  <Badge
                                    key={skillIndex}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {skill}
                                  </Badge>
                                ))}
                              </div>

                              <div className="flex items-center justify-between pt-2">
                                <span className="text-lg font-bold text-primary">
                                  {course.price}
                                </span>
                                <Button
                                  asChild
                                  size="sm"
                                  className="bg-primary hover:bg-primary/90"
                                >
                                  <a
                                    href={course.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <Play className="w-3 h-3 mr-1" />
                                    Start Course
                                    <ExternalLink className="w-3 h-3 ml-1" />
                                  </a>
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>

                    {/* Specialized Courses */}
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                          <span className="text-blue-600 font-bold">2</span>
                        </div>
                        Specialized Skills
                      </h3>
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.specialized.map((course, index) => (
                          <Card
                            key={index}
                            className="shadow-lg hover:shadow-xl transition-shadow duration-200"
                          >
                            <CardHeader className="pb-4">
                              <div className="flex items-start justify-between mb-2">
                                <Badge
                                  className={getProviderColor(course.provider)}
                                >
                                  {getProviderIcon(course.provider)}{" "}
                                  {course.provider}
                                </Badge>
                                <Badge variant="outline">{course.level}</Badge>
                              </div>
                              <CardTitle className="text-lg font-semibold text-gray-900 leading-tight">
                                {course.title}
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <p className="text-gray-600 text-sm">
                                {course.description}
                              </p>

                              <div className="space-y-2 text-sm">
                                <div className="flex items-center justify-between">
                                  <span className="text-gray-500">
                                    Instructor:
                                  </span>
                                  <span className="font-medium">
                                    {course.instructor}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-gray-500 flex items-center">
                                    <Clock className="w-3 h-3 mr-1" />
                                    Duration:
                                  </span>
                                  <span className="font-medium">
                                    {course.duration}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-gray-500 flex items-center">
                                    <Star className="w-3 h-3 mr-1" />
                                    Rating:
                                  </span>
                                  <span className="font-medium">
                                    {course.rating}/5
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-gray-500 flex items-center">
                                    <Users className="w-3 h-3 mr-1" />
                                    Students:
                                  </span>
                                  <span className="font-medium">
                                    {course.students}
                                  </span>
                                </div>
                              </div>

                              <div className="flex flex-wrap gap-1">
                                {course.skills.map((skill, skillIndex) => (
                                  <Badge
                                    key={skillIndex}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {skill}
                                  </Badge>
                                ))}
                              </div>

                              <div className="flex items-center justify-between pt-2">
                                <span className="text-lg font-bold text-primary">
                                  {course.price}
                                </span>
                                <Button
                                  asChild
                                  size="sm"
                                  className="bg-primary hover:bg-primary/90"
                                >
                                  <a
                                    href={course.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <Play className="w-3 h-3 mr-1" />
                                    Start Course
                                    <ExternalLink className="w-3 h-3 ml-1" />
                                  </a>
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>

                    {/* Advanced Courses */}
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                          <span className="text-purple-600 font-bold">3</span>
                        </div>
                        Advanced & Scaling
                      </h3>
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.advanced.map((course, index) => (
                          <Card
                            key={index}
                            className="shadow-lg hover:shadow-xl transition-shadow duration-200"
                          >
                            <CardHeader className="pb-4">
                              <div className="flex items-start justify-between mb-2">
                                <Badge
                                  className={getProviderColor(course.provider)}
                                >
                                  {getProviderIcon(course.provider)}{" "}
                                  {course.provider}
                                </Badge>
                                <Badge variant="outline">{course.level}</Badge>
                              </div>
                              <CardTitle className="text-lg font-semibold text-gray-900 leading-tight">
                                {course.title}
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <p className="text-gray-600 text-sm">
                                {course.description}
                              </p>

                              <div className="space-y-2 text-sm">
                                <div className="flex items-center justify-between">
                                  <span className="text-gray-500">
                                    Instructor:
                                  </span>
                                  <span className="font-medium">
                                    {course.instructor}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-gray-500 flex items-center">
                                    <Clock className="w-3 h-3 mr-1" />
                                    Duration:
                                  </span>
                                  <span className="font-medium">
                                    {course.duration}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-gray-500 flex items-center">
                                    <Star className="w-3 h-3 mr-1" />
                                    Rating:
                                  </span>
                                  <span className="font-medium">
                                    {course.rating}/5
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-gray-500 flex items-center">
                                    <Users className="w-3 h-3 mr-1" />
                                    Students:
                                  </span>
                                  <span className="font-medium">
                                    {course.students}
                                  </span>
                                </div>
                              </div>

                              <div className="flex flex-wrap gap-1">
                                {course.skills.map((skill, skillIndex) => (
                                  <Badge
                                    key={skillIndex}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {skill}
                                  </Badge>
                                ))}
                              </div>

                              <div className="flex items-center justify-between pt-2">
                                <span className="text-lg font-bold text-primary">
                                  {course.price}
                                </span>
                                <Button
                                  asChild
                                  size="sm"
                                  className="bg-primary hover:bg-primary/90"
                                >
                                  <a
                                    href={course.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <Play className="w-3 h-3 mr-1" />
                                    Start Course
                                    <ExternalLink className="w-3 h-3 ml-1" />
                                  </a>
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </>
          )}

          {/* Call to Action */}
          <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-xl mx-auto flex items-center justify-center">
              <Award className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">
              Ready to Start Your Journey?
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Take the first step towards building your business by enrolling in
              the foundational courses. Remember, every expert was once a
              beginner.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-xl"
              >
                <Link href="/profile">Retake Assessment</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-white px-8 py-3 rounded-xl"
              >
                <Link href="/dashboard">Back to Dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
