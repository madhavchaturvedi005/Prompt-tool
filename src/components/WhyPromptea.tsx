import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { 
  Zap, 
  Target, 
  TrendingUp, 
  Shield,
  Users,
  Award
} from "lucide-react";

const reasons = [
  {
    icon: Zap,
    title: "AI-Powered Learning",
    description: "Get instant, intelligent feedback on your prompts with real-time AI evaluation that helps you improve faster."
  },
  {
    icon: Target,
    title: "Structured Approach",
    description: "Follow a proven learning path from beginner to expert with carefully designed challenges and exercises."
  },
  {
    icon: TrendingUp,
    title: "Track Your Progress",
    description: "Monitor your improvement with detailed analytics, achievements, and personalized insights."
  },
  {
    icon: Shield,
    title: "Curated Resources",
    description: "Access 100+ hand-picked resources from top organizations, researchers, and industry experts."
  },
  {
    icon: Users,
    title: "Community Driven",
    description: "Learn from a growing community of prompt engineers and share your knowledge with others."
  },
  {
    icon: Award,
    title: "Professional Tools",
    description: "Use advanced developer tools for testing, optimization, and performance analysis."
  }
];

const ReasonCard = ({ reason, index }: { reason: typeof reasons[0]; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative"
    >
      <div className="relative p-8 bg-card border border-border rounded-xl transition-all duration-300 hover:border-foreground/30 hover:shadow-lg h-full">
        {/* Icon */}
        <div className="mb-6">
          <div className="w-14 h-14 rounded-lg bg-foreground/5 flex items-center justify-center group-hover:bg-foreground/10 transition-colors">
            <reason.icon className="w-7 h-7 text-foreground" />
          </div>
        </div>

        {/* Content */}
        <h3 className="text-xl font-heading font-semibold mb-3 text-foreground">
          {reason.title}
        </h3>
        <p className="text-muted-foreground leading-relaxed text-sm">
          {reason.description}
        </p>
      </div>
    </motion.div>
  );
};

export function WhyPromptea() {
  const titleRef = useRef(null);
  const isTitleInView = useInView(titleRef, { once: true });

  return (
    <section className="py-24 relative overflow-hidden bg-muted/30">
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isTitleInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.span 
            className="text-muted-foreground text-sm font-medium tracking-widest uppercase mb-4 block"
            initial={{ opacity: 0 }}
            animate={isTitleInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Why Choose Us
          </motion.span>
          
          <motion.h2 
            className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold mb-6 text-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={isTitleInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Why <span className="text-foreground">Promptea</span>?
          </motion.h2>
          
          <motion.div 
            className="h-px w-32 sm:w-48 mx-auto mb-6 bg-gradient-to-r from-transparent via-foreground/30 to-transparent"
            initial={{ scaleX: 0 }}
            animate={isTitleInView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          />
          
          <motion.p 
            className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto px-4"
            initial={{ opacity: 0 }}
            animate={isTitleInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            We're not just another learning platform. Promptea combines cutting-edge AI technology 
            with proven educational methods to help you master prompt engineering faster and more effectively.
          </motion.p>
        </motion.div>

        {/* Reasons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
          {reasons.map((reason, index) => (
            <ReasonCard key={reason.title} reason={reason} index={index} />
          ))}
        </div>

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-20 text-center"
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 sm:gap-8 p-6 sm:p-8 bg-card border border-border rounded-xl">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-heading font-bold text-foreground mb-2">
                10x
              </div>
              <div className="text-sm text-muted-foreground">Faster Learning</div>
            </div>
            
            <div className="hidden sm:block w-px h-12 bg-border" />
            
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-heading font-bold text-foreground mb-2">
                100%
              </div>
              <div className="text-sm text-muted-foreground">Practical Focus</div>
            </div>
            
            <div className="hidden sm:block w-px h-12 bg-border" />
            
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-heading font-bold text-foreground mb-2">
                24/7
              </div>
              <div className="text-sm text-muted-foreground">AI Feedback</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
