import { Navigation } from "@/components/navigation";
import { HeroSection } from "@/components/hero-section";
import { HowItWorks } from "@/components/how-it-works";
import { AboutUs } from "@/components/about-us";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <HeroSection />
        <HowItWorks />
        <AboutUs />
      </main>
      <Footer />
    </div>
  );
}
