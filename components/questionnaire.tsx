"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  CheckCircle,
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
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/auth-context";

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
  const [isLoadingAnswers, setIsLoadingAnswers] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [recommendations, setRecommendations] = useState<
    BusinessRecommendation[]
  >([]);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasExistingRecommendations, setHasExistingRecommendations] =
    useState(false);

  const router = useRouter();
  const supabase = createClient();
  const { user } = useAuth();

  // Load existing responses on component mount
  useEffect(() => {
    const loadExistingResponses = async () => {
      if (!user) {
        setIsLoadingAnswers(false);
        return;
      }

      setIsLoadingAnswers(true);

      try {
        // Load questionnaire responses
        const { data: responses, error: responseError } = await supabase
          .from("questionnaire_responses")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (responseError && responseError.code !== "PGRST116") {
          console.error("Error loading responses:", responseError);
        }

        if (responses) {
          const loadedAnswers: Record<string, string> = {};
          questions.forEach((q) => {
            if (responses[q.id]) {
              loadedAnswers[q.id] = responses[q.id];
            }
          });
          setAnswers(loadedAnswers);

          if (responses.commitment_other) {
            setOtherAnswer(responses.commitment_other);
          }
        }

        // Check if recommendations exist
        const { data: recs, error: recError } = await supabase
          .from("business_recommendations")
          .select("id")
          .eq("user_id", user.id)
          .limit(1);

        if (!recError && recs && recs.length > 0) {
          setHasExistingRecommendations(true);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoadingAnswers(false);
      }
    };

    loadExistingResponses();
  }, [user, supabase]);

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const saveResponses = async () => {
    if (!user) return;

    setIsSaving(true);

    try {
      const dataToSave = {
        user_id: user.id,
        motivation: answers.motivation || null,
        skills: answers.skills || null,
        idea: answers.idea || null,
        commitment: answers.commitment || null,
        commitment_other: answers.commitment === "Other" ? otherAnswer : null,
        resources: answers.resources || null,
        location: answers.location || null,
        structure: answers.structure || null,
        goals: answers.goals || null,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("questionnaire_responses")
        .upsert(dataToSave, {
          onConflict: "user_id",
        });

      if (error) throw error;
    } catch (error) {
      console.error("Error saving responses:", error);
      setError("Failed to save your responses. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const saveRecommendations = async (
    recommendationsToSave: BusinessRecommendation[]
  ) => {
    if (!user) return;

    try {
      // Delete existing recommendations
      await supabase
        .from("business_recommendations")
        .delete()
        .eq("user_id", user.id);

      // Save new recommendations
      const dataToInsert = recommendationsToSave.map((rec, index) => ({
        user_id: user.id,
        title: rec.title,
        description: rec.description,
        startup_cost: rec.startupCost,
        time_to_profit: rec.timeToProfit,
        skills_needed: rec.skillsNeeded,
        next_steps: rec.nextSteps,
        order_index: index + 1,
      }));

      const { error } = await supabase
        .from("business_recommendations")
        .insert(dataToInsert);

      if (error) throw error;
    } catch (error) {
      console.error("Error saving recommendations:", error);
      throw error;
    }
  };

  const generateRecommendations = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      // Save responses first
      await saveResponses();

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

      try {
        const parsedResponse = extractJSON(text);
        if (
          parsedResponse.recommendations &&
          Array.isArray(parsedResponse.recommendations)
        ) {
          setRecommendations(parsedResponse.recommendations);
          await saveRecommendations(parsedResponse.recommendations);
          setShowResults(true);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (parseError) {
        console.error("Error parsing AI response:", parseError);
        const fallbackRecs = getFallbackRecommendations(finalAnswers);
        setRecommendations(fallbackRecs);
        await saveRecommendations(fallbackRecs);
        setShowResults(true);
      }
    } catch (error) {
      console.error("Error generating recommendations:", error);
      setError(
        "Unable to generate personalized recommendations. Using general suggestions."
      );
      const fallbackRecs = getFallbackRecommendations(answers);
      setRecommendations(fallbackRecs);
      await saveRecommendations(fallbackRecs);
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

  const goToBusinessIdeas = () => {
    router.push("/business-ideas");
  };

  if (isLoadingAnswers) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-xl mx-auto flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            Recommendations Generated Successfully!
          </h2>
          <p className="text-lg text-gray-600">
            Your personalized business recommendations have been saved. You can
            view them anytime in your Business Ideas page.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={goToBusinessIdeas}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
          >
            View My Business Ideas
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <Button
            onClick={resetForm}
            variant="outline"
            className="px-8 py-3 rounded-xl border-gray-200 hover:bg-gray-50"
          >
            Update My Answers
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

      {/* Notice for existing recommendations */}
      {hasExistingRecommendations && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800 text-sm">
            <strong>Note:</strong> You already have business recommendations.
            You can view them in your{" "}
            <button
              onClick={goToBusinessIdeas}
              className="underline hover:text-blue-900"
            >
              Business Ideas page
            </button>
            , or complete the questionnaire again to generate new ones.
          </p>
        </div>
      )}

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
          <div className="flex flex-col items-center space-y-4">
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

            {/* Save Progress Button */}
            <Button
              onClick={saveResponses}
              disabled={isSaving || Object.keys(answers).length === 0}
              variant="outline"
              className="px-8 py-2 rounded-lg"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Save My Progress
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
