import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Warp } from "@paper-design/shaders-react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Warp Shader Background */}
      <div className="absolute inset-0 z-0">
        <Warp
          speed={0.3}
          colors={["#f5f0e6", "#c9a227", "#d4af37", "#f0e6d2"]}
          shape="stripes"
          shapeScale={1.5}
          distortion={0.4}
          softness={0.6}
          swirl={0.3}
          swirlIterations={5}
          style={{ width: "100%", height: "100%" }}
        />
      </div>

      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background z-10" />

      {/* Content */}
      <div className="container mx-auto px-4 relative z-20 pt-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-gold/40 bg-card/80 backdrop-blur-sm mb-8 shadow-sm">
            <Sparkles className="w-4 h-4 text-gold" />
            <span className="text-sm font-medium text-gold-dark">
              The Art of AI Communication
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-semibold leading-tight mb-6 tracking-tight text-foreground">
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
            <Button variant="gold" size="xl" className="group shadow-lg">
              Begin Your Journey
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button variant="gold-outline" size="xl" className="bg-card/80 backdrop-blur-sm">
              Explore Curriculum
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { value: "50+", label: "Expert Modules" },
              { value: "200+", label: "Practice Prompts" },
              { value: "10K+", label: "Certified Learners" },
            ].map((stat, index) => (
              <div
                key={index}
                className="flex flex-col items-center gap-2 p-6 rounded-xl border border-gold/20 bg-card/80 backdrop-blur-sm shadow-sm transition-all duration-300 hover:border-gold/40 hover:shadow-md"
              >
                <span className="text-3xl md:text-4xl font-serif font-semibold text-gradient">
                  {stat.value}
                </span>
                <span className="text-sm text-muted-foreground">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
