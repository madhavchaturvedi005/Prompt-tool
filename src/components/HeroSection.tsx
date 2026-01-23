import { ArrowRight, Zap, Brain, Target } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute inset-0 bg-noise" />
      
      {/* Gradient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-blue/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-purple/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "-3s" }} />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-neon-blue/30 mb-8 animate-pulse-glow">
            <Zap className="w-4 h-4 text-neon-blue" />
            <span className="text-sm font-medium text-muted-foreground">
              Master the Art of AI Communication
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
            Learn{" "}
            <span className="text-gradient-animated">Prompt Engineering</span>
            <br />
            Like a Pro
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Unlock the full potential of AI with structured learning paths, 
            hands-on practice, and real-world challenges designed for the next 
            generation of AI practitioners.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button variant="neon" size="xl" className="group">
              Start Practicing
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button variant="neon-outline" size="xl">
              Explore Courses
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            {[
              { icon: Brain, value: "50+", label: "Learning Modules" },
              { icon: Target, value: "200+", label: "Practice Prompts" },
              { icon: Zap, value: "10K+", label: "Active Learners" },
            ].map((stat, index) => (
              <div
                key={index}
                className="flex flex-col items-center gap-2 p-4 rounded-xl glass transition-all duration-300 hover:border-neon-blue/50"
              >
                <stat.icon className="w-6 h-6 text-neon-blue mb-1" />
                <span className="text-2xl md:text-3xl font-bold text-gradient">
                  {stat.value}
                </span>
                <span className="text-xs md:text-sm text-muted-foreground">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
