import { ArrowRight, Waves } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Warp } from "@paper-design/shaders-react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Warp Shader Background - Ocean Theme */}
      <div className="absolute inset-0 z-0">
        <Warp
          speed={0.2}
          colors={["#0a1628", "#0c4a6e", "#0891b2", "#22d3ee", "#67e8f9"]}
          shape="stripes"
          shapeScale={2}
          distortion={0.5}
          softness={0.8}
          swirl={0.4}
          swirlIterations={8}
          style={{ width: "100%", height: "100%" }}
        />
      </div>

      {/* Content - Centered with glass effect */}
      <div className="container mx-auto px-4 relative z-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge with transparency */}
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8 shadow-lg">
            <Waves className="w-4 h-4 text-cyan-300" />
            <span className="text-sm font-medium text-white/90">
              Dive Into AI Mastery
            </span>
          </div>

          {/* Main Heading - White text for contrast */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-semibold leading-tight mb-6 tracking-tight text-white drop-shadow-lg">
            Master the Art of
            <br />
            <span className="bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-400 bg-clip-text text-transparent">
              Prompt Engineering
            </span>
          </h1>

          {/* Divider */}
          <div className="h-px w-48 mx-auto mb-6 bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />

          {/* Subheading */}
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed drop-shadow-md">
            Unlock the full potential of AI with expertly curated lessons, 
            hands-on practice, and real-world challenges designed for those 
            who seek excellence.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button variant="ocean" size="xl" className="group shadow-xl">
              Begin Your Journey
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button variant="ocean-outline" size="xl">
              Explore Curriculum
            </Button>
          </div>

          {/* Stats - Glass cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { value: "50+", label: "Expert Modules" },
              { value: "200+", label: "Practice Prompts" },
              { value: "10K+", label: "Certified Learners" },
            ].map((stat, index) => (
              <div
                key={index}
                className="flex flex-col items-center gap-2 p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg transition-all duration-300 hover:bg-white/20 hover:scale-105"
              >
                <span className="text-3xl md:text-4xl font-serif font-semibold text-white">
                  {stat.value}
                </span>
                <span className="text-sm text-white/70">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom fade to background */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
}
