import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BackgroundPaths } from "./BackgroundPaths";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export function HeroSection() {
  const { isAuthenticated } = useAuth();
  const title = "Master the Craft of Prompt Engineering";
  const words = title.split(" ");

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 md:pt-0">
      {/* Animated Paths Background */}
      <BackgroundPaths />

      {/* Content */}
      <div className="container mx-auto px-4 py-8 md:py-0 relative z-20">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center justify-center">
          {/* Main Heading with letter animation */}
          <motion.h1 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-heading font-bold leading-tight mb-6 md:mb-8 tracking-tight px-4"
          >
            {words.map((word, wordIndex) => (
              <motion.span
                key={wordIndex}
                className="inline-block mr-2 sm:mr-3 md:mr-4 last:mr-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: wordIndex * 0.1,
                  duration: 0.5,
                  ease: "easeOut",
                }}
              >
                {word.split("").map((letter, letterIndex) => (
                  <motion.span
                    key={letterIndex}
                    className="inline-block text-foreground"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: wordIndex * 0.1 + letterIndex * 0.03,
                      duration: 0.4,
                      ease: "easeOut",
                    }}
                    whileHover={{
                      scale: 1.1,
                      transition: { duration: 0.2 },
                    }}
                  >
                    {letter}
                  </motion.span>
                ))}
              </motion.span>
            ))}
          </motion.h1>

          {/* Divider */}
          <motion.div 
            className="h-px w-32 sm:w-48 mx-auto mb-6 md:mb-8 bg-gradient-to-r from-transparent via-foreground/30 to-transparent"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          />

          {/* Subheading */}
          <motion.p 
            className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 md:mb-10 leading-relaxed px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            Learn from curated resources, practice with AI evaluation, tackle challenges, 
            and access professional tools—all in one comprehensive platform.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full px-4 max-w-md sm:max-w-none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            {isAuthenticated ? (
              <>
                <Link to="/practice" className="w-full sm:w-auto">
                  <Button 
                    size="lg" 
                    className="group w-full sm:w-auto px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base bg-primary text-primary-foreground hover:bg-primary/90 rounded-full"
                  >
                    Start Practicing
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link to="/learn" className="w-full sm:w-auto">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="w-full sm:w-auto px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base border-border text-foreground hover:bg-accent rounded-full"
                  >
                    Explore Resources
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/signup" className="w-full sm:w-auto">
                  <Button 
                    size="lg" 
                    className="group w-full sm:w-auto px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base bg-primary text-primary-foreground hover:bg-primary/90 rounded-full"
                  >
                    Begin Your Journey
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link to="/learn" className="w-full sm:w-auto">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="w-full sm:w-auto px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base border-border text-foreground hover:bg-accent rounded-full"
                  >
                    Explore Features
                  </Button>
                </Link>
              </>
            )}
          </motion.div>
        </div>
      </div>

      {/* Bottom fade to background */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
}
