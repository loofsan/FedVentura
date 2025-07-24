"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  DollarSign,
  Users,
  MapPin,
  BookOpen,
  Briefcase,
  Building,
  ExternalLink,
  Search,
  Handshake,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SharedNavigation } from "@/components/shared-navigation";
import { useAuth } from "@/contexts/auth-context";
import { LocationPicker } from "@/components/location-picker";
import { createClient } from "@/lib/supabase/client";

interface Resource {
  id: string;
  title: string;
  description: string;
  category: ResourceCategory;
  type: string;
  link?: string;
  location?: string;
  requirements?: string[];
  tags: string[];
  featured?: boolean;
}

type ResourceCategory =
  | "funding"
  | "networking"
  | "bootcamps"
  | "mentorship"
  | "workspace"
  | "tools"
  | "legal"
  | "local";

const categoryConfig = {
  funding: {
    icon: DollarSign,
    color: "text-green-600",
    bgColor: "bg-green-100",
    title: "Funding & Grants",
    description: "Loans, grants, and investment opportunities",
  },
  networking: {
    icon: Users,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    title: "Networking",
    description: "Connect with like-minded entrepreneurs",
  },
  bootcamps: {
    icon: GraduationCap,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
    title: "Bootcamps & Programs",
    description: "Intensive training and accelerator programs",
  },
  mentorship: {
    icon: Handshake,
    color: "text-orange-600",
    bgColor: "bg-orange-100",
    title: "Mentorship",
    description: "Get guidance from experienced entrepreneurs",
  },
  workspace: {
    icon: Building,
    color: "text-indigo-600",
    bgColor: "bg-indigo-100",
    title: "Workspace",
    description: "Co-working spaces and office solutions",
  },
  tools: {
    icon: Briefcase,
    color: "text-red-600",
    bgColor: "bg-red-100",
    title: "Business Tools",
    description: "Essential tools and software for startups",
  },
  legal: {
    icon: BookOpen,
    color: "text-gray-600",
    bgColor: "bg-gray-100",
    title: "Legal & Compliance",
    description: "Legal resources and business registration",
  },
  local: {
    icon: MapPin,
    color: "text-teal-600",
    bgColor: "bg-teal-100",
    title: "Local Resources",
    description: "Resources in your area",
  },
};

// Mock data - In production, this would come from an API or database
const mockResources: Resource[] = [
  // Funding Resources
  {
    id: "1",
    title: "SBA Small Business Loans",
    description:
      "Government-backed loans with competitive rates for small businesses. Get up to $5 million in funding.",
    category: "funding",
    type: "Government Loan",
    link: "https://www.sba.gov/funding-programs/loans",
    requirements: ["US-based business", "Good credit score", "Business plan"],
    tags: ["loan", "government", "low-interest"],
    featured: true,
  },
  {
    id: "2",
    title: "Kiva Microlending",
    description:
      "Crowdfunded microloans up to $15,000 with 0% interest for entrepreneurs.",
    category: "funding",
    type: "Microloan",
    link: "https://www.kiva.org",
    requirements: ["Business plan", "Community support"],
    tags: ["microloan", "0% interest", "crowdfunded"],
  },
  {
    id: "3",
    title: "SCORE Mentorship & Grants",
    description:
      "Free mentorship and access to grant opportunities for small businesses.",
    category: "funding",
    type: "Grants",
    link: "https://www.score.org",
    requirements: ["US-based", "Small business"],
    tags: ["grants", "free", "mentorship"],
  },

  // Networking Resources
  {
    id: "4",
    title: "Startup Grind",
    description:
      "Global startup community with 600+ chapters worldwide. Monthly events and networking.",
    category: "networking",
    type: "Community",
    link: "https://www.startupgrind.com",
    location: "Global",
    tags: ["events", "global", "community"],
    featured: true,
  },
  {
    id: "5",
    title: "LinkedIn Local",
    description: "Local meetups for LinkedIn members to connect in person.",
    category: "networking",
    type: "Meetup",
    link: "https://www.linkedin.com",
    location: "Various cities",
    tags: ["local", "professional", "in-person"],
  },
  {
    id: "6",
    title: "Entrepreneurs' Organization (EO)",
    description: "Peer-to-peer network for entrepreneurs with $1M+ in revenue.",
    category: "networking",
    type: "Professional Network",
    link: "https://www.eonetwork.org",
    requirements: ["$1M+ annual revenue", "Business owner"],
    tags: ["high-growth", "peer-to-peer", "exclusive"],
  },

  // Bootcamp Resources
  {
    id: "7",
    title: "Y Combinator Startup School",
    description:
      "Free online program for early-stage founders with lectures and group sessions.",
    category: "bootcamps",
    type: "Online Program",
    link: "https://www.startupschool.org",
    tags: ["free", "online", "YC"],
    featured: true,
  },
  {
    id: "8",
    title: "Techstars Accelerator",
    description:
      "3-month mentorship-driven accelerator programs in various cities.",
    category: "bootcamps",
    type: "Accelerator",
    link: "https://www.techstars.com",
    requirements: ["Scalable business", "Team", "MVP"],
    location: "Multiple cities",
    tags: ["accelerator", "mentorship", "funding"],
  },
  {
    id: "9",
    title: "Google for Startups",
    description: "Programs and resources to help startups build and grow.",
    category: "bootcamps",
    type: "Program",
    link: "https://startup.google.com",
    tags: ["Google", "free resources", "global"],
  },

  // Local Resources
  {
    id: "10",
    title: "Local SBDC Office",
    description:
      "Small Business Development Centers offer free consulting and training.",
    category: "local",
    type: "Government Service",
    link: "https://americassbdc.org/find-your-sbdc/",
    location: "Find nearest location",
    tags: ["free", "consulting", "local"],
    featured: true,
  },
  {
    id: "11",
    title: "Chamber of Commerce",
    description: "Local business networks and resources in your community.",
    category: "local",
    type: "Business Association",
    link: "https://www.uschamber.com",
    location: "Local chapters",
    tags: ["networking", "local", "advocacy"],
  },

  // Mentorship Resources
  {
    id: "12",
    title: "MicroMentor",
    description: "Free online mentoring for entrepreneurs worldwide.",
    category: "mentorship",
    type: "Online Mentoring",
    link: "https://www.micromentor.org",
    tags: ["free", "online", "global"],
    featured: true,
  },
  {
    id: "13",
    title: "Founders Network",
    description: "Peer mentorship community for tech startup founders.",
    category: "mentorship",
    type: "Peer Network",
    link: "https://foundersnetwork.com",
    requirements: ["Tech startup", "Revenue or funding"],
    tags: ["tech", "peer-mentorship", "exclusive"],
  },

  // Workspace Resources
  {
    id: "14",
    title: "WeWork",
    description: "Flexible workspace solutions with locations worldwide.",
    category: "workspace",
    type: "Coworking",
    link: "https://www.wework.com",
    location: "Global",
    tags: ["coworking", "flexible", "global"],
  },
  {
    id: "15",
    title: "Impact Hub",
    description: "Coworking spaces focused on social impact entrepreneurs.",
    category: "workspace",
    type: "Coworking",
    link: "https://impacthub.net",
    location: "100+ locations",
    tags: ["social-impact", "community", "global"],
  },

  // Business Tools
  {
    id: "16",
    title: "Canva for Business",
    description: "Design platform with templates for marketing materials.",
    category: "tools",
    type: "Design Tool",
    link: "https://www.canva.com/business",
    tags: ["design", "marketing", "easy-to-use"],
  },
  {
    id: "17",
    title: "HubSpot for Startups",
    description: "Up to 90% off HubSpot software for eligible startups.",
    category: "tools",
    type: "CRM/Marketing",
    link: "https://www.hubspot.com/startups",
    requirements: ["Under $2M funding"],
    tags: ["CRM", "marketing", "discount"],
  },

  // Legal Resources
  {
    id: "18",
    title: "LegalZoom",
    description: "Online legal services for business formation and compliance.",
    category: "legal",
    type: "Legal Service",
    link: "https://www.legalzoom.com",
    tags: ["incorporation", "legal", "online"],
  },
  {
    id: "19",
    title: "Nolo Legal Resources",
    description: "Free legal information and DIY legal forms for businesses.",
    category: "legal",
    type: "Legal Information",
    link: "https://www.nolo.com",
    tags: ["free resources", "DIY", "legal guides"],
  },
];

export default function Resources() {
  const [resources, setResources] = useState<Resource[]>(mockResources);
  const [filteredResources, setFilteredResources] =
    useState<Resource[]>(mockResources);
  const [selectedCategory, setSelectedCategory] = useState<
    ResourceCategory | "all"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();
  const supabase = createClient();

  const [userLocation, setUserLocation] = useState<string>("");
  const [userCoords, setUserCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const handleLocationChange = async (
    location: string,
    coords?: { lat: number; lng: number }
  ) => {
    setUserLocation(location);
    if (coords) {
      setUserCoords(coords);
    }

    // Save to database
    if (user) {
      const { error } = await supabase
        .from("profiles")
        .update({
          location: location,
          location_coords: coords || null,
        })
        .eq("id", user.id);

      if (error) {
        console.error("Error saving location:", error);
      }
    }
  };

  useEffect(() => {
    const loadUserLocation = async () => {
      if (user) {
        const { data, error } = await supabase
          .from("profiles")
          .select("location, location_coords")
          .eq("id", user.id)
          .single();

        if (data?.location) {
          setUserLocation(data.location);
          if (data.location_coords) {
            setUserCoords(data.location_coords);
          }
        }
      }
    };

    loadUserLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Filter resources based on category and search
  useEffect(() => {
    let filtered = resources;

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (resource) => resource.category === selectedCategory
      );
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (resource) =>
          resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          resource.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          resource.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    // Filter by location - prioritize local resources if location is set
    if (userLocation && selectedCategory === "local") {
      // Sort local resources to show nearby ones first
      filtered = filtered.sort((a, b) => {
        // This is a simple example - in production, you'd calculate actual distances
        const aIsLocal = a.location
          ?.toLowerCase()
          .includes(userLocation.toLowerCase().split(",")[0]);
        const bIsLocal = b.location
          ?.toLowerCase()
          .includes(userLocation.toLowerCase().split(",")[0]);

        if (aIsLocal && !bIsLocal) return -1;
        if (!aIsLocal && bIsLocal) return 1;
        return 0;
      });
    }

    setFilteredResources(filtered);
  }, [selectedCategory, searchQuery, resources, userLocation]);

  // Get featured resources
  const featuredResources = resources.filter((r) => r.featured).slice(0, 3);

  // Group resources by category
  const groupedResources = filteredResources.reduce((acc, resource) => {
    if (!acc[resource.category]) {
      acc[resource.category] = [];
    }
    acc[resource.category].push(resource);
    return acc;
  }, {} as Record<ResourceCategory, Resource[]>);

  return (
    <div className="min-h-screen bg-gray-50">
      <SharedNavigation />

      <div className="section-container py-12">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-gray-900">
              Entrepreneur Resources
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to start and grow your business - from funding
              to networking, bootcamps to local support.
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <LocationPicker
              onLocationChange={handleLocationChange}
              initialLocation={userLocation}
            />
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 w-full"
              />
            </div>
            <Select
              value={selectedCategory}
              onValueChange={(value) =>
                setSelectedCategory(value as ResourceCategory | "all")
              }
            >
              <SelectTrigger className="w-full md:w-[200px] h-12">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {Object.entries(categoryConfig).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    {config.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Featured Resources */}
          {selectedCategory === "all" && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">
                Featured Resources
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {featuredResources.map((resource) => {
                  const config = categoryConfig[resource.category];
                  const Icon = config.icon;

                  return (
                    <Card
                      key={resource.id}
                      className="hover:shadow-lg transition-shadow duration-200"
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div
                            className={`w-10 h-10 ${config.bgColor} rounded-lg flex items-center justify-center`}
                          >
                            <Icon className={`w-5 h-5 ${config.color}`} />
                          </div>
                          <Badge variant="secondary">Featured</Badge>
                        </div>
                        <CardTitle className="text-lg mt-3">
                          {resource.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm text-gray-600">
                          {resource.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {resource.tags.slice(0, 3).map((tag, idx) => (
                            <span
                              key={idx}
                              className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        {resource.link && (
                          <Button
                            asChild
                            className="w-full bg-primary hover:bg-primary/90"
                          >
                            <a
                              href={resource.link}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Learn More
                              <ExternalLink className="w-4 h-4 ml-2" />
                            </a>
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Category Sections */}
          <div className="space-y-12">
            {Object.entries(groupedResources).map(
              ([category, categoryResources]) => {
                const config = categoryConfig[category as ResourceCategory];
                const Icon = config.icon;

                return (
                  <div key={category} className="space-y-6">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-10 h-10 ${config.bgColor} rounded-lg flex items-center justify-center`}
                      >
                        <Icon className={`w-5 h-5 ${config.color}`} />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                          {config.title}
                        </h2>
                        <p className="text-gray-600">{config.description}</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {categoryResources.map((resource) => (
                        <Card
                          key={resource.id}
                          className="hover:shadow-md transition-shadow duration-200"
                        >
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <CardTitle className="text-lg">
                                {resource.title}
                              </CardTitle>
                              <Badge variant="outline" className="text-xs">
                                {resource.type}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <p className="text-sm text-gray-600">
                              {resource.description}
                            </p>

                            {resource.location && (
                              <div className="flex items-center text-sm text-gray-500">
                                <MapPin className="w-4 h-4 mr-1" />
                                {resource.location}
                              </div>
                            )}

                            {resource.requirements &&
                              resource.requirements.length > 0 && (
                                <div className="space-y-1">
                                  <p className="text-xs font-medium text-gray-700">
                                    Requirements:
                                  </p>
                                  <ul className="text-xs text-gray-600 list-disc list-inside">
                                    {resource.requirements.map((req, idx) => (
                                      <li key={idx}>{req}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                            <div className="flex flex-wrap gap-1">
                              {resource.tags.map((tag, idx) => (
                                <span
                                  key={idx}
                                  className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>

                            {resource.link && (
                              <Button
                                asChild
                                size="sm"
                                className="w-full bg-primary hover:bg-primary/90"
                              >
                                <a
                                  href={resource.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  Visit Website
                                  <ExternalLink className="w-3 h-3 ml-2" />
                                </a>
                              </Button>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                );
              }
            )}
          </div>

          {/* Empty State */}
          {filteredResources.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">
                No resources found matching your criteria.
              </p>
              <Button
                onClick={() => {
                  setSelectedCategory("all");
                  setSearchQuery("");
                }}
                variant="outline"
                className="mt-4"
              >
                Clear Filters
              </Button>
            </div>
          )}

          {/* Call to Action */}
          <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-xl mx-auto flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">
              Can&#39;t Find What You&#39;re Looking For?
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We&#39;re constantly adding new resources. If you know of a great
              resource that should be included, or need help finding something
              specific, let us know!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-xl"
              >
                <Link href="/contact">Suggest a Resource</Link>
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
