'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Brain, Lightbulb, Puzzle, DollarSign, Settings, BarChart, Compass, Globe, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

const questionSections = [
  {
    id: 1,
    title: "Self-Assessment & Readiness",
    icon: Brain,
    emoji: "🧠",
    questions: [
      "Why do you want to become an entrepreneur after your layoff?",
      "What kind of work energizes you? (e.g., creative, hands-on, technical, people-focused)",
      "What do you hope to achieve through your business? (e.g., income, flexibility, community impact)",
      "What skills did you use in your previous job that could transfer into a business?",
      "Are you ready to face risk and uncertainty in exchange for ownership and control?",
      "How many hours per week can you realistically commit to starting this venture?"
    ]
  },
  {
    id: 2,
    title: "Idea Development & Fit",
    icon: Lightbulb,
    emoji: "💡",
    questions: [
      "Do you already have a business idea in mind?",
      "If not, are you open to ideas based on your skills, interests, or local demand?",
      "What problems have you personally experienced or noticed that a business could solve?",
      "Does your idea match your values, lifestyle needs, and existing skill set?"
    ]
  },
  {
    id: 3,
    title: "Market & Demand Validation",
    icon: Puzzle,
    emoji: "🧩",
    questions: [
      "Who would benefit from your product or service?",
      "Have you talked to potential customers about their needs?",
      "Are others offering similar products? If yes, what can you do better or differently?",
      "What trends or industries are growing that align with your idea?"
    ]
  },
  {
    id: 4,
    title: "Financial Planning for First-Time Entrepreneurs",
    icon: DollarSign,
    emoji: "💰",
    questions: [
      "What are your estimated startup costs (equipment, website, licenses)?",
      "What is the bare minimum you need to get started (MVP or service prototype)?",
      "How long can you operate without turning a profit?",
      "Are you eligible for unemployment, grants, or workforce retraining funds?",
      "Are you willing to use savings, or do you need outside funding (loans, crowdfunding)?"
    ]
  },
  {
    id: 5,
    title: "Setup & Operations",
    icon: Settings,
    emoji: "🛠️",
    questions: [
      "Can this business be run from home, online, or does it require a physical space?",
      "What low-cost tools or platforms can help you operate (e.g., Canva, Wix, Square)?",
      "Do you need a team right now, or can you launch solo with part-time help?",
      "Are there legal requirements like licenses, permits, or insurance?"
    ]
  },
  {
    id: 6,
    title: "Success Metrics & Milestones",
    icon: BarChart,
    emoji: "📊",
    questions: [
      "How will you know you're making progress? (e.g., first sale, 10 customers, $500/month)",
      "What are your goals for the next 3 months? (e.g., validate idea, create prototype)",
      "What are your goals for the next 6 months? (e.g., first paying customer, steady monthly income)",
      "What are your goals for the next 1-3 years? (e.g., sustainable income, hire a team, expand)"
    ]
  },
  {
    id: 7,
    title: "Long-Term Vision & Backup Plan",
    icon: Compass,
    emoji: "🧭",
    questions: [
      "Are you creating this to support your lifestyle or to build something you may sell?",
      "If this doesn't work out, do you want to try a different business?",
      "If this doesn't work out, do you want to return to the workforce?",
      "If this doesn't work out, do you want to shift to freelancing/contract work?",
      "What would success look like for you in 5 years?"
    ]
  },
  {
    id: 8,
    title: "Location & Legal Considerations",
    icon: Globe,
    emoji: "🌍",
    questions: [
      "Can you legally operate this business from your home or online?",
      "Are there local programs (incubators, grants, co-working spaces) that support new entrepreneurs?",
      "Do you need to be near suppliers, customers, or a specific market?",
      "Are you aware of zoning laws, taxes, or other region-specific rules?"
    ]
  },
  {
    id: 9,
    title: "Infrastructure & Logistics",
    icon: Zap,
    emoji: "🔌",
    questions: [
      "Does your location have what you need to run the business? (internet, electricity, quiet space)",
      "If selling products, how will you store and ship items? (home, storage, FBA, etc.)",
      "Do you need to be near a post office, UPS/FedEx, or fulfillment center?"
    ]
  }
];

export function QuestionnaireComponent() {
  const [currentSection, setCurrentSection] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const handleNext = () => {
    if (currentSection < questionSections.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const handleAnswerChange = (questionIndex: number, answer: string) => {
    const key = `${currentSection}-${questionIndex}`;
    setAnswers(prev => ({
      ...prev,
      [key]: answer
    }));
  };

  const currentSectionData = questionSections[currentSection];
  const Icon = currentSectionData.icon;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-6 sm:mb-8">
        <div className="flex justify-between items-center mb-3 sm:mb-4">
          <span className="text-xs sm:text-sm font-medium text-gray-600">
            Section {currentSection + 1} of {questionSections.length}
          </span>
          <span className="text-xs sm:text-sm text-gray-500">
            {Math.round(((currentSection + 1) / questionSections.length) * 100)}% Complete
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentSection + 1) / questionSections.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Main Questionnaire Card */}
      <Card className="shadow-xl border-0 bg-white">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-t-lg p-4 sm:p-6">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center flex-shrink-0">
              <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <CardTitle className="text-lg sm:text-2xl font-bold text-gray-900 flex items-center space-x-2">
                <span>{currentSectionData.emoji}</span>
                <span className="truncate">{currentSectionData.title}</span>
              </CardTitle>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">
                Section {currentSection + 1} of {questionSections.length}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-6 lg:p-8">
          <div className="space-y-6 sm:space-y-8">
            {currentSectionData.questions.map((question, index) => (
              <div key={index} className="space-y-3 sm:space-y-4">
                <Label className="text-base sm:text-lg font-medium text-gray-900 leading-relaxed block">
                  {index + 1}. {question}
                </Label>
                <Textarea
                  placeholder="Type your answer here..."
                  className="min-h-[100px] sm:min-h-[120px] rounded-xl border-gray-200 focus:border-primary focus:ring-primary/20 resize-none text-sm sm:text-base"
                  value={answers[`${currentSection}-${index}`] || ''}
                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                />
              </div>
            ))}
          </div>
        </CardContent>

        {/* Navigation */}
        <div className="flex items-center justify-between p-4 sm:p-6 lg:p-8 bg-gray-50 rounded-b-lg">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentSection === 0}
            className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-6 py-2 sm:py-3 rounded-xl border-gray-200 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </Button>

          <div className="flex space-x-1 sm:space-x-2">
            {questionSections.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSection(index)}
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-200 ${
                  index === currentSection
                    ? 'bg-primary scale-125'
                    : index < currentSection
                    ? 'bg-secondary'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          {currentSection === questionSections.length - 1 ? (
            <Button
              className="flex items-center space-x-1 sm:space-x-2 px-4 sm:px-8 py-2 sm:py-3 rounded-xl bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 text-sm sm:text-base"
            >
              <span>Complete</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-6 py-2 sm:py-3 rounded-xl bg-primary hover:bg-primary/90 text-white font-medium transition-all duration-200 text-sm sm:text-base"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}