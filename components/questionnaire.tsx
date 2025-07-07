"use client";

import { useState } from "react";
import {
  Brain,
  Lightbulb,
  Target,
  DollarSign,
  Settings,
  BarChart,
  Compass,
  Globe,
  Zap,
  Sparkles,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { GoogleGenerativeAI } from "@google/generative-ai";

const questions = [
  {
    id: "motivation",
    title:
      "What motivates you to start a business now, and what are you hoping to achieve?",
    icon: Target,
    options: [
      "Gain income quickly",
      "Greater work-life flexibility",
      "Follow a passion or purpose",
      "Make a community or social impact",
      "Not sure yet — just exploring",
    ],
  },
  {
    id: "skills",
    title:
      "What types of work energize you, and what skills or experiences from your previous job could carry over into a business?",
    icon: Brain,
    options: [
      "Creative work (design, content, marketing)",
      "Hands-on or technical tasks (crafts, repair, IT)",
      "People-focused roles (customer service, teaching, sales)",
      "Business or financial management",
      "I'm still figuring out what I'm good at",
    ],
  },
  {
    id: "idea",
    title: "Do you already have a business idea, or are you open to exploring?",
    icon: Lightbulb,
    options: ["Yes", "No", "Somewhat"],
  },
  {
    id: "commitment",
    title:
      "How much time, energy, and money can you commit, and how long can you operate without a profit?",
    icon: DollarSign,
    options: [
      "10 hours/week and little to no savings — needs to be low-risk",
      "10–20 hours/week and can invest a small budget",
      "20–40 hours/week with moderate funding or savings",
      "Full-time commitment and willing to self-fund or raise money",
      "Eligible for unemployment, grants, or other support",
      "Still figuring this out",
      "Other",
    ],
    hasOther: true,
  },
  {
    id: "resources",
    title:
      "What resources do you have or need to launch your Minimum Viable Product (MVP)?",
    icon: Settings,
    options: [
      "I have most tools and can start solo",
      "I need a partner or part-time help",
      "I'll need to raise funds or find low-cost solutions",
      "I don't know",
    ],
  },
  {
    id: "location",
    title:
      "Can your business operate online or from home, and are there legal/logistical constraints?",
    icon: Globe,
    options: [
      "Yes, home-based and online-friendly",
      "Requires physical space (storefront, workshop, storage, shipping)",
      "Need to check on permits, zoning, or home business rules",
      "Not sure about legal requirements yet",
    ],
  },
  {
    id: "structure",
    title: "Have you planned the basics of your business structure?",
    icon: BarChart,
    options: [
      "Yes, I've registered my business and opened a bank account",
      "I've picked a structure (LLC, Sole Prop, etc.), but haven't registered",
      "I have nothing in place yet",
      "Not sure where to start with legal stuff",
    ],
  },
  {
    id: "goals",
    title:
      "What are your goals would you like to achieve with this project by month 12?",
    icon: Compass,
    options: [
      "Launch a working product/service and get my first paying customers",
      "Earn consistent monthly income that replaces or supplements my job",
      "Build a loyal customer base and grow through word of mouth or marketing",
      "All of the above",
      "Not sure yet",
    ],
  },
];

interface BusinessRecommendation {
  title: string;
  description: string;
  startupCost: string;
  timeToProfit: string;
  skillsNeeded: string[];
  nextSteps: string[];
}

// Helper function to extract JSON from text that might have markdown or extra content
function extractJSON(text: string): any {
  try {
    // First try to parse as-is
    return JSON.parse(text);
  } catch (e) {
    // Try to find JSON within the text
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch (e2) {
        // If that fails, try to clean up common issues
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

// Fallback recommendations
const getFallbackRecommendations = (
  answers: Record<string, string>
): BusinessRecommendation[] => {
  const isLowRisk = answers.commitment?.includes(
    "10 hours/week and little to no savings"
  );
  const isCreative = answers.skills?.includes("Creative work");
  const isPeopleFocused = answers.skills?.includes("People-focused roles");
  const isTechnical = answers.skills?.includes("technical tasks");

  const recommendations: BusinessRecommendation[] = [];

  if (isCreative) {
    recommendations.push({
      title: "Freelance Creative Services",
      description:
        "Start a freelance business offering design, content creation, or marketing services based on your creative skills.",
      startupCost: isLowRisk ? "$0-$200" : "$200-$800",
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
    });
  }

  if (isPeopleFocused) {
    recommendations.push({
      title: "Consulting & Coaching",
      description:
        "Leverage your people skills and professional experience to offer consulting or coaching services.",
      startupCost: isLowRisk ? "$0-$300" : "$300-$1,000",
      timeToProfit: "2-4 months",
      skillsNeeded: ["Industry expertise", "Communication", "Problem-solving"],
      nextSteps: [
        "Define your niche and target market",
        "Create a simple website",
        "Develop service packages",
        "Reach out to your professional network",
      ],
    });
  }

  if (isTechnical) {
    recommendations.push({
      title: "Technical Services Business",
      description:
        "Offer technical services like IT support, repairs, or digital solutions to local businesses or consumers.",
      startupCost: isLowRisk ? "$100-$500" : "$500-$2,000",
      timeToProfit: "2-6 months",
      skillsNeeded: [
        "Technical expertise",
        "Problem-solving",
        "Customer service",
      ],
      nextSteps: [
        "Identify your core technical services",
        "Create marketing materials",
        "Network with local businesses",
        "Set up a simple booking system",
      ],
    });
  }

  // Always include a general recommendation
  recommendations.push({
    title: "Online Course Creation",
    description:
      "Create and sell online courses teaching skills you've mastered in your career or personal interests.",
    startupCost: isLowRisk ? "$50-$300" : "$300-$1,000",
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
  });

  return recommendations.slice(0, 3);
};

export function QuestionnaireComponent() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [otherAnswer, setOtherAnswer] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [recommendations, setRecommendations] = useState<
    BusinessRecommendation[]
  >([]);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const generateRecommendations = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("Gemini API key not found");
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

      const finalAnswers = {
        ...answers,
        ...(answers.commitment === "Other" && otherAnswer
          ? { commitmentOther: otherAnswer }
          : {}),
      };

      const prompt = `Based on the following questionnaire responses from someone who was recently laid off and wants to start a business, provide exactly 3 specific business recommendations. Each recommendation should be realistic, actionable, and tailored to their responses.

Questionnaire Responses:
${Object.entries(finalAnswers)
  .map(([key, value]) => `${key}: ${value}`)
  .join("\n")}

IMPORTANT: Please provide your response in valid JSON format only. No markdown, no extra text, just the JSON object:

{
  "recommendations": [
    {
      "title": "Business Name/Type",
      "description": "2-3 sentence description of the business and why it fits their profile",
      "startupCost": "Estimated range (e.g., $500-$2,000)",
      "timeToProfit": "Realistic timeline (e.g., 3-6 months)",
      "skillsNeeded": ["skill1", "skill2", "skill3"],
      "nextSteps": ["step1", "step2", "step3", "step4"]
    },
    {
      "title": "Business Name/Type 2",
      "description": "2-3 sentence description of the business and why it fits their profile",
      "startupCost": "Estimated range (e.g., $500-$2,000)",
      "timeToProfit": "Realistic timeline (e.g., 3-6 months)",
      "skillsNeeded": ["skill1", "skill2", "skill3"],
      "nextSteps": ["step1", "step2", "step3", "step4"]
    },
    {
      "title": "Business Name/Type 3",
      "description": "2-3 sentence description of the business and why it fits their profile",
      "startupCost": "Estimated range (e.g., $500-$2,000)",
      "timeToProfit": "Realistic timeline (e.g., 3-6 months)",
      "skillsNeeded": ["skill1", "skill2", "skill3"],
      "nextSteps": ["step1", "step2", "step3", "step4"]
    }
  ]
}

Make sure each recommendation is:
1. Specific and actionable
2. Aligned with their motivation, skills, and constraints
3. Realistic given their time/money commitment
4. Includes concrete next steps they can take immediately

Focus on businesses that can realistically be started by someone transitioning from employment to entrepreneurship.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      console.log("AI Response:", text); // Debug log

      try {
        const parsedResponse = extractJSON(text);
        if (
          parsedResponse.recommendations &&
          Array.isArray(parsedResponse.recommendations)
        ) {
          setRecommendations(parsedResponse.recommendations);
          setShowResults(true);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (parseError) {
        console.error("Error parsing AI response:", parseError);
        console.log("Using fallback recommendations");
        setRecommendations(getFallbackRecommendations(finalAnswers));
        setShowResults(true);
      }
    } catch (error) {
      console.error("Error generating recommendations:", error);
      setError(
        "Unable to generate personalized recommendations. Using general suggestions."
      );
      setRecommendations(getFallbackRecommendations(answers));
      setShowResults(true);
    } finally {
      setIsGenerating(false);
    }
  };

  const isFormComplete = () => {
    const requiredAnswers = questions.length;
    const completedAnswers = Object.keys(answers).length;
    const hasOtherAnswer =
      answers.commitment === "Other" ? otherAnswer.trim() !== "" : true;
    return completedAnswers === requiredAnswers && hasOtherAnswer;
  };

  const resetForm = () => {
    setAnswers({});
    setOtherAnswer("");
    setRecommendations([]);
    setShowResults(false);
    setError(null);
  };

  if (showResults) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-xl mx-auto flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            Your Personalized Business Recommendations
          </h2>
          <p className="text-lg text-gray-600">
            Based on your responses, here are the top 3 business opportunities
            tailored specifically for you.
          </p>
          {error && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-yellow-800 text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* Recommendations */}
        <div className="grid gap-8">
          {recommendations.map((rec, index) => (
            <Card
              key={index}
              className="shadow-xl border-0 bg-white overflow-hidden"
            >
              <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5 p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center text-white font-bold text-lg">
                    {index + 1}
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold text-gray-900">
                      {rec.title}
                    </CardTitle>
                    <p className="text-gray-600 mt-2">{rec.description}</p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                        <DollarSign className="w-4 h-4 mr-2 text-primary" />
                        Startup Cost
                      </h4>
                      <p className="text-gray-600">{rec.startupCost}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                        <Target className="w-4 h-4 mr-2 text-secondary" />
                        Time to Profit
                      </h4>
                      <p className="text-gray-600">{rec.timeToProfit}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                      <Brain className="w-4 h-4 mr-2 text-accent" />
                      Skills Needed
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {rec.skillsNeeded.map((skill, skillIndex) => (
                        <span
                          key={skillIndex}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <ArrowRight className="w-4 h-4 mr-2 text-success" />
                    Next Steps
                  </h4>
                  <div className="grid gap-2">
                    {rec.nextSteps.map((step, stepIndex) => (
                      <div
                        key={stepIndex}
                        className="flex items-start space-x-3"
                      >
                        <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold text-sm mt-0.5">
                          {stepIndex + 1}
                        </div>
                        <p className="text-gray-600 text-sm">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={resetForm}
            variant="outline"
            className="px-8 py-3 rounded-xl border-gray-200 hover:bg-gray-50"
          >
            Take Quiz Again
          </Button>
          <Button
            asChild
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <a href="/dashboard">Back to Dashboard</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-medium text-gray-600">
            Question {Object.keys(answers).length} of {questions.length}
          </span>
          <span className="text-sm text-gray-500">
            {Math.round((Object.keys(answers).length / questions.length) * 100)}
            % Complete
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-300"
            style={{
              width: `${
                (Object.keys(answers).length / questions.length) * 100
              }%`,
            }}
          ></div>
        </div>
      </div>

      {/* Main Questionnaire Card */}
      <Card className="shadow-xl border-0 bg-white">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-t-lg p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Business Assessment Questionnaire
              </CardTitle>
              <p className="text-gray-600 mt-1">
                Help us understand your goals and situation to provide
                personalized recommendations
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-8">
          <div className="space-y-8">
            {questions.map((question, index) => {
              const Icon = question.icon;
              const isAnswered = answers[question.id];

              return (
                <div key={question.id} className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        isAnswered
                          ? "bg-gradient-to-br from-primary to-secondary"
                          : "bg-gray-100"
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 ${
                          isAnswered ? "text-white" : "text-gray-400"
                        }`}
                      />
                    </div>
                    <div className="flex-1 space-y-3">
                      <Label className="text-lg font-medium text-gray-900 leading-relaxed block">
                        {index + 1}. {question.title}
                      </Label>

                      <Select
                        value={answers[question.id] || ""}
                        onValueChange={(value) =>
                          handleAnswerChange(question.id, value)
                        }
                      >
                        <SelectTrigger className="w-full h-12 rounded-xl border-gray-200 focus:border-primary focus:ring-primary/20">
                          <SelectValue placeholder="Select an option..." />
                        </SelectTrigger>
                        <SelectContent>
                          {question.options.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {question.hasOther &&
                        answers[question.id] === "Other" && (
                          <Textarea
                            placeholder="Please specify..."
                            className="min-h-[80px] rounded-xl border-gray-200 focus:border-primary focus:ring-primary/20 resize-none"
                            value={otherAnswer}
                            onChange={(e) => setOtherAnswer(e.target.value)}
                          />
                        )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>

        {/* Submit Button */}
        <div className="p-8 bg-gray-50 rounded-b-lg">
          <div className="flex justify-center">
            <Button
              onClick={generateRecommendations}
              disabled={!isFormComplete() || isGenerating}
              className="px-12 py-4 rounded-xl bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Generating Your Business Plan...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Get My Business Recommendations
                </>
              )}
            </Button>
          </div>

          {!isFormComplete() && (
            <p className="text-center text-sm text-gray-500 mt-3">
              Please answer all questions to get your personalized
              recommendations
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}
