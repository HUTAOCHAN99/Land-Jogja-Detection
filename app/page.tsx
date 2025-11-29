import HeroSection from "@/components/HeroSection"; 
import FeaturesGrid from "@/components/FeaturesGrid";
import AboutSection from "@/components/AboutSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50"> {/* Changed to gray-50 */}
      <div className="container mx-auto px-6 py-16">
        <HeroSection />
        <FeaturesGrid />
        <AboutSection />
      </div>
    </div>
  );
}

