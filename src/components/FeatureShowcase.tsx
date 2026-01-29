import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { 
  Sparkles, 
  Target, 
  Zap, 
  BookOpen, 
  Code2, 
  Search,
  CheckCircle2,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const features = [
  {
    id: "practice",
    icon: Zap,
    title: "AI-Powered Practice Arena",
    description: "Get instant feedback on your prompts with real-time AI evaluation",
    highlights: [
      "Real-time AI evaluation and scoring",
      "Instant feedback on prompt quality",
      "Multiple evaluation criteria",
      "Track your improvement over time"
    ],
    path: "/practice",
    color: "blue",
    gradient: "from-blue-500/20 to-cyan-500/20",
    iconColor: "text-blue-400",
    borderColor: "border-blue-400/30"
  },
  {
    id: "challenges",
    icon: Target,
    title: "Structured Challenges",
    description: "Test your skills with real-world scenarios across difficulty levels",
    highlights: [
      "Beginner to advanced challenges",
      "Real-world use cases",
      "Detailed evaluation criteria",
      "Earn achievements and badges"
    ],
    path: "/challenges",
    color: "rose",
    gradient: "from-rose-500/20 to-pink-500/20",
    iconColor: "text-rose-400",
    borderColor: "border-rose-400/30"
  },
  {
    id: "library",
    icon: Search,
    title: "Smart Prompt Library",
    description: "Browse 1000+ expert prompts with AI-powered semantic search",
    highlights: [
      "AI-powered semantic search",
      "1000+ curated expert prompts",
      "Filter by category and tags",
      "Save and organize favorites"
    ],
    path: "/library",
    color: "purple",
    gradient: "from-purple-500/20 to-violet-500/20",
    iconColor: "text-purple-400",
    borderColor: "border-purple-400/30"
  },
  {
    id: "refine",
    icon: Sparkles,
    title: "Prompt Optimizer",
    description: "Enhance your prompts with AI-powered analysis and suggestions",
    highlights: [
      "AI-powered prompt analysis",
      "Improvement suggestions",
      "Clarity and effectiveness scoring",
      "Before/after comparisons"
    ],
    path: "/refine",
    color: "amber",
    gradient: "from-amber-500/20 to-yellow-500/20",
    iconColor: "text-amber-400",
    borderColor: "border-amber-400/30"
  },
  {
    id: "devtools",
    icon: Code2,
    title: "Developer Tools",
    description: "Advanced testing, comparison, and performance analysis tools",
    highlights: [
      "A/B testing for prompts",
      "Performance metrics",
      "Batch testing capabilities",
      "Export and share results"
    ],
    path: "/devtools",
    color: "sky",
    gradient: "from-sky-500/20 to-blue-500/20",
    iconColor: "text-sky-400",
    borderColor: "border-sky-400/30"
  },
  {
    id: "learn",
    icon: BookOpen,
    title: "Curated Learning Hub",
    description: "Access 100+ resources from top organizations and researchers",
    highlights: [
      "100+ curated resources",
      "Official documentation",
      "Research papers and courses",
      "Regularly updated content"
    ],
    path: "/learn",
    color: "emerald",
    gradient: "from-emerald-500/20 to-green-500/20",
    iconColor: "text-emerald-400",
    borderColor: "border-emerald-400/30"
  }
];

const FeatureCard = ({ feature, index }: { feature: typeof features[0]; index: number }) => {
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
      <Link to={feature.path}>
        <div className={cn(
          "relative p-8 bg-card/50 backdrop-blur-sm border rounded-2xl transition-all duration-500",
          "hover:bg-card/80 hover:scale-[1.02] hover:shadow-2xl",
          feature.borderColor
        )}>
          {/* Gradient Background */}
          <div className={cn(
            "absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br",
            feature.gradient
          )} />

          {/* Content */}
          <div className="relative z-10">
            {/* Icon */}
            <motion.div 
              className={cn(
                "w-14 h-14 rounded-xl flex items-center justify-center mb-6 border",
                "bg-background/50 backdrop-blur-sm",
                feature.borderColor
              )}
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <feature.icon className={cn("w-7 h-7", feature.iconColor)} />
            </motion.div>

            {/* Title & Description */}
            <h3 className="text-2xl font-heading font-semibold mb-3 group-hover:text-foreground transition-colors">
              {feature.title}
            </h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              {feature.description}
            </p>

            {/* Highlights */}
            <ul className="space-y-3 mb-6">
              {feature.highlights.map((highlight, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 + i * 0.1 }}
                  className="flex items-start gap-3 text-sm text-muted-foreground"
                >
                  <CheckCircle2 className={cn("w-4 h-4 mt-0.5 flex-shrink-0", feature.iconColor)} />
                  <span>{highlight}</span>
                </motion.li>
              ))}
            </ul>

            {/* CTA */}
            <motion.div
              whileHover={{ x: 5 }}
              className="flex items-center gap-2 text-sm font-medium group-hover:text-foreground transition-colors"
            >
              <span>Explore Feature</span>
              <ArrowRight className="w-4 h-4" />
            </motion.div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export function FeatureShowcase() {
  const titleRef = useRef(null);
  const isTitleInView = useInView(titleRef, { once: true });

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/50 to-background pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <FeatureCard key={feature.id} feature={feature} index={index} />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-20"
        >
          <Link to="/signup">
            <Button 
              size="lg"
              className="group px-8 py-6 text-base rounded-full"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
