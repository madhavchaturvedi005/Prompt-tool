import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { LearningModules } from "@/components/LearningModules";
import { PracticeChallenges } from "@/components/PracticeChallenges";
import { ClosingCTA } from "@/components/ClosingCTA";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Navbar />
      
      {/* Hero Section - Main landing area with CTA */}
      <HeroSection />
      
      {/* Learning Modules - Course cards */}
      <LearningModules />
      
      {/* Practice Challenges - Interactive challenges */}
      <PracticeChallenges />
      
      {/* Closing CTA - Mirror of hero section */}
      <ClosingCTA />
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
