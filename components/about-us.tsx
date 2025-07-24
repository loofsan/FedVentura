"use client";

import { Github, Linkedin, Mail, User, BadgeCheck } from "lucide-react";

export function AboutUs() {
  return (
    <section className="py-20 bg-white dark:bg-gray-950">
      <div className="section-container space-y-12">
        {/* About Us Heading */}
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold mb-4">About Us</h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            We’re a team of two students from Skyline College and City College,
            interning with Growth Sector at San José State University. Guided by
            our mentor and advisor, Rakesh Ranjan, we built this platform to
            help displaced workers confidently pursue entrepreneurship with a
            clear, AI-powered roadmap.
          </p>
        </div>

        {/* Team Members */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Lynn's Card */}
          <div className="bg-gray-100 dark:bg-gray-900 p-6 rounded-xl shadow-lg space-y-4 text-center">
            <div className="flex justify-center">
              <User className="w-16 h-16 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Lynn T. Aung</h3>
              <p className="text-sm text-gray-500">
                Full Stack Developer & Technical Lead
              </p>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Built complete FedVentura platform including frontend, backend,
              database design, authentication system, and AI integration for
              personalized business recommendations.
            </p>
            <div className="flex justify-center space-x-4 text-gray-600 dark:text-gray-400">
              <a
                href="https://github.com/loofsan"
                target="_blank"
                rel="noopener nonreferrer"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5 hover:text-primary" />
              </a>
              <a
                href="https://www.linkedin.com/in/lynn-aung-a1a209322/"
                target="_blank"
                rel="noopener nonreferrer"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5 hover:text-primary" />
              </a>
              <a href="mailto:lynnthikeaung@gmail.com" aria-label="Email">
                <Mail className="w-5 h-5 hover:text-primary" />
              </a>
            </div>
          </div>

          {/* Paola's Card */}
          <div className="bg-gray-100 dark:bg-gray-900 p-6 rounded-xl shadow-lg space-y-4 text-center">
            <div className="flex justify-center">
              <User className="w-16 h-16 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Paola Ayala</h3>
              <p className="text-sm text-gray-500">Team Member</p>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {/* Placeholder for future update */}
              Description coming soon.
            </p>
            <div className="flex justify-center space-x-4 text-gray-600 dark:text-gray-400">
              <a href="#" aria-label="GitHub">
                <Github className="w-5 h-5 hover:text-primary" />
              </a>
              <a href="#" aria-label="LinkedIn">
                <Linkedin className="w-5 h-5 hover:text-primary" />
              </a>
              <a href="#" aria-label="Email">
                <Mail className="w-5 h-5 hover:text-primary" />
              </a>
            </div>
          </div>

          {/* Faculty Advisor */}
          <div className="bg-gray-100 dark:bg-gray-900 p-6 rounded-xl shadow-lg space-y-4 text-center">
            <div className="flex justify-center">
              <BadgeCheck className="w-16 h-16 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Rakesh Ranjan</h3>
              <p className="text-sm text-gray-500">Faculty Advisor</p>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Professor of Computer Engineering at San José State University.
              Guided this project from concept to execution.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
