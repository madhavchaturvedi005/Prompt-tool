import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { LearningModules } from "@/components/LearningModules";
import { ClosingCTA } from "@/components/ClosingCTA";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <LearningModules />
      <ClosingCTA />
      <Footer />
    </div>
  );
};

export default Index;
