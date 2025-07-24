"use client";

import { useState } from "react";
import { X, ExternalLink, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CourseSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseName: string;
  provider: string;
  skills: string[];
}

export function CourseSearchModal({
  isOpen,
  onClose,
  courseName,
  provider,
  skills,
}: CourseSearchModalProps) {
  const [searchQuery, setSearchQuery] = useState(courseName);

  if (!isOpen) return null;

  const getSearchUrl = () => {
    const query = encodeURIComponent(searchQuery);

    switch (provider) {
      case "LinkedIn Learning":
        return `https://www.linkedin.com/learning/search?keywords=${query}`;
      case "Udemy":
        return `https://www.udemy.com/courses/search/?q=${query}`;
      case "Coursera":
        return `https://www.coursera.org/search?query=${query}`;
      default:
        return `https://www.google.com/search?q=${query}+online+course`;
    }
  };

  const handleSearch = () => {
    window.open(getSearchUrl(), "_blank");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Find This Course
        </h3>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Course Name
            </label>
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter course name..."
              className="w-full"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Provider
            </label>
            <p className="text-sm text-gray-600">{provider}</p>
          </div>

          {skills.length > 0 && (
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Related Skills
              </label>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4 space-y-3">
            <Button
              onClick={handleSearch}
              className="w-full bg-primary hover:bg-primary/90"
            >
              <Search className="w-4 h-4 mr-2" />
              Search on {provider}
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>

            <div className="text-center text-sm text-gray-500">
              This will open a new tab with search results
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
