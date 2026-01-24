import { Clock, Star, ChevronRight, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const challenges = [
  {
    title: "Email Assistant",
    description: "Create a prompt that helps draft professional emails from bullet points.",
    difficulty: "Beginner",
    time: "15 min",
    points: 100,
    participants: 1234,
  },
  {
    title: "Code Debugger",
    description: "Design a prompt that identifies and explains bugs in code snippets.",
    difficulty: "Intermediate",
    time: "25 min",
    points: 250,
    participants: 856,
  },
  {
    title: "Story Generator",
    description: "Build a prompt that creates engaging short stories with specific themes.",
    difficulty: "Intermediate",
    time: "30 min",
    points: 300,
    participants: 2103,
  },
  {
    title: "Data Analyst",
    description: "Craft a prompt that analyzes datasets and provides actionable insights.",
    difficulty: "Advanced",
    time: "45 min",
    points: 500,
    participants: 421,
  },
];

const difficultyColors: Record<string, string> = {
  Beginner: "text-emerald-400",
  Intermediate: "text-foreground",
  Advanced: "text-rose-400",
};

function FloatingPaths({ position }: { position: number }) {
  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
      380 - i * 5 * position
    } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
      152 - i * 5 * position
    } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
      684 - i * 5 * position
    } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    color: `rgba(255,255,255,${0.1 + i * 0.03})`,
    width: 0.5 + i * 0.03,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg
        className="w-full h-full text-white"
        viewBox="0 0 696 316"
        fill="none"
        aria-hidden="true"
      >
        <title>Background Paths</title>
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke={path.color}
            strokeWidth={path.width}
            strokeOpacity={0.1 + path.id * 0.02}
            initial={{ pathLength: 0.3, opacity: 0.6 }}
            animate={{
              pathLength: 1,
              opacity: [0.3, 0.6, 0.3],
              pathOffset: [0, 1, 0],
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </svg>
    </div>
  );
}

export function PracticeChallenges() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Animated Paths Background */}
      <div className="absolute inset-0 bg-background">
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />
      </div>

      {/* Top fade */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-background to-transparent z-10" />
      
      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />

      <div className="container mx-auto px-4 relative z-20">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-muted-foreground text-sm font-medium tracking-widest uppercase mb-4 block">
              Challenges
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-semibold mb-4">
              Practice <span className="text-foreground">Excellence</span>
            </h2>
            <p className="text-muted-foreground max-w-xl">
              Test your skills with real-world scenarios. Earn recognition and 
              climb the ranks of prompt engineering mastery.
            </p>
          </div>
          <Button variant="outline" className="mt-6 md:mt-0">
            View All Challenges
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Challenges List */}
        <div className="space-y-4">
          {challenges.map((challenge, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className={cn(
                "group p-6 bg-card/80 backdrop-blur-sm border border-border transition-all duration-300",
                "hover:border-foreground/40 flex flex-col md:flex-row md:items-center gap-4 cursor-pointer"
              )}
            >
              {/* Number */}
              <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center border border-border font-heading text-xl text-foreground">
                {String(index + 1).padStart(2, "0")}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-lg font-heading font-semibold group-hover:text-foreground transition-colors">
                    {challenge.title}
                  </h3>
                  <span className={cn("text-sm font-medium", difficultyColors[challenge.difficulty])}>
                    {challenge.difficulty}
                  </span>
                </div>
                <p className="text-muted-foreground text-sm">
                  {challenge.description}
                </p>
              </div>

              {/* Meta */}
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>{challenge.time}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-foreground" />
                  <span>{challenge.points} pts</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span>{challenge.participants.toLocaleString()}</span>
                </div>
              </div>

              {/* Arrow */}
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
