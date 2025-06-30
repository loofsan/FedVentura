'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Zap, Shield, Brain, Target, Users } from 'lucide-react';

const slides = [
  {
    icon: TrendingUp,
    title: "Business Intelligence",
    description: "Powered by advanced AI algorithms to provide personalized business insights",
    color: "from-primary to-secondary"
  },
  {
    icon: Brain,
    title: "Smart Analytics",
    description: "Deep learning models analyze market trends and opportunities for your success",
    color: "from-secondary to-accent"
  },
  {
    icon: Target,
    title: "Targeted Strategies",
    description: "Customized business plans tailored to your unique goals and market position",
    color: "from-accent to-primary"
  },
  {
    icon: Users,
    title: "Market Insights",
    description: "Real-time data analysis to identify your ideal customers and market opportunities",
    color: "from-primary to-success"
  }
];

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, []);

  const currentSlideData = slides[currentSlide];
  const Icon = currentSlideData.icon;

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="section-container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Welcome to{' '}
                <span className="gradient-text">FedVentura</span>
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                Get professional personalized advice to start your business using our cutting-edge AI technology. 
                Transform your entrepreneurial dreams into reality with intelligent guidance tailored just for you.
              </p>
            </div>

            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center space-x-2 text-secondary">
                <TrendingUp className="w-5 h-5" />
                <span className="font-medium">Growth-Focused</span>
              </div>
              <div className="flex items-center space-x-2 text-primary">
                <Zap className="w-5 h-5" />
                <span className="font-medium">AI-Powered</span>
              </div>
              <div className="flex items-center space-x-2 text-accent">
                <Shield className="w-5 h-5" />
                <span className="font-medium">Secure & Trusted</span>
              </div>
            </div>
          </div>

          {/* Interactive Visual Carousel */}
          <div className="relative">
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-3xl p-8 h-96 flex items-center justify-center">
              <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm text-center space-y-4 transition-all duration-500 transform">
                <div className={`w-16 h-16 bg-gradient-to-br ${currentSlideData.color} rounded-xl mx-auto flex items-center justify-center transition-all duration-500`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 transition-all duration-300">
                  {currentSlideData.title}
                </h3>
                <p className="text-gray-600 text-sm transition-all duration-300">
                  {currentSlideData.description}
                </p>
                <div className="flex justify-center space-x-2">
                  {slides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentSlide ? 'bg-primary scale-125' : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}