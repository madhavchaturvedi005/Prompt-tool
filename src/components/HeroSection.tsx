import { ArrowRight, Sparkles, BookOpen, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
      {/* Subtle Background */}
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gold/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-gold/30 bg-gold/5 mb-8">
            <Sparkles className="w-4 h-4 text-gold" />
            <span className="text-sm font-medium text-gold">
              The Art of AI Communication
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-semibold leading-tight mb-6 tracking-tight">
            Master the Craft of
            <br />
            <span className="text-gradient-animated">Prompt Engineering</span>
          </h1>

          {/* Divider */}
          <div className="divider-gold max-w-xs mx-auto mb-6" />

          {/* Subheading */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Unlock the full potential of AI with expertly curated lessons, 
            hands-on practice, and real-world challenges designed for those 
            who seek excellence.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button variant="gold" size="xl" className="group">
              Begin Your Journey
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button variant="gold-outline" size="xl">
              Explore Curriculum
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            {[
              { icon: BookOpen, value: "50+", label: "Expert Modules" },
              { icon: Sparkles, value: "200+", label: "Practice Prompts" },
              { icon: Award, value: "10K+", label: "Certified Learners" },
            ].map((stat, index) => (
              <div
                key={index}
                className="flex flex-col items-center gap-2 p-6 border border-border bg-card/50 transition-all duration-300 hover:border-gold/30"
              >
                <stat.icon className="w-6 h-6 text-gold mb-2" />
                <span className="text-2xl md:text-3xl font-serif font-semibold text-gradient">
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

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
