import { UserPlus, FileText, Target, BookOpen } from 'lucide-react';

const steps = [
  {
    icon: UserPlus,
    title: 'Create your Profile',
    description: 'Sign up and tell us about your business goals, experience, and industry preferences.',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    icon: FileText,
    title: 'Fill out our questionnaire',
    description: 'Complete our comprehensive assessment to help our AI understand your unique situation.',
    color: 'text-secondary',
    bgColor: 'bg-secondary/10',
  },
  {
    icon: Target,
    title: 'Get personalized advice based on your answers',
    description: 'Receive tailored recommendations and strategies specifically designed for your business needs.',
    color: 'text-accent',
    bgColor: 'bg-accent/10',
  },
  {
    icon: BookOpen,
    title: 'Get resources and courses information to strengthen skills',
    description: 'Access curated learning materials, courses, and tools to develop the skills you need to succeed.',
    color: 'text-success',
    bgColor: 'bg-success/10',
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 bg-white">
      <div className="section-container">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">How it works</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our streamlined process ensures you get the most relevant and actionable business advice in just four simple steps.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 card-hover"
              >
                <div className="space-y-6">
                  <div className={`w-16 h-16 ${step.bgColor} rounded-xl flex items-center justify-center mx-auto`}>
                    <Icon className={`w-8 h-8 ${step.color}`} />
                  </div>
                  
                  <div className="text-center space-y-3">
                    <h3 className="text-xl font-semibold text-gray-900 leading-tight">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Step number */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                  {index + 1}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}