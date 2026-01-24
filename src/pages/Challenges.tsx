import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Trophy, Clock, Star, Users, Flame, Medal, Target, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const challenges = [
  {
    id: 1,
    title: "Email Assistant Challenge",
    description: "Create a prompt that helps draft professional emails from bullet points.",
    difficulty: "Easy",
    time: "15 min",
    points: 100,
    participants: 1234,
    status: "completed",
    score: 95,
  },
  {
    id: 2,
    title: "Code Debugger Pro",
    description: "Design a prompt that identifies bugs and suggests fixes across languages.",
    difficulty: "Medium",
    time: "25 min",
    points: 250,
    participants: 856,
    status: "in-progress",
    score: null,
  },
  {
    id: 3,
    title: "Creative Story Generator",
    description: "Build a prompt system that creates engaging short stories with themes.",
    difficulty: "Medium",
    time: "30 min",
    points: 300,
    participants: 2103,
    status: "available",
    score: null,
  },
  {
    id: 4,
    title: "Data Analyst Bot",
    description: "Craft a prompt that analyzes datasets and provides actionable insights.",
    difficulty: "Hard",
    time: "45 min",
    points: 500,
    participants: 421,
    status: "available",
    score: null,
  },
  {
    id: 5,
    title: "Multi-Turn Conversation",
    description: "Create a prompt that maintains context across multiple conversation turns.",
    difficulty: "Hard",
    time: "40 min",
    points: 450,
    participants: 312,
    status: "locked",
    score: null,
  },
  {
    id: 6,
    title: "Weekly Boss Challenge",
    description: "The ultimate test: Create an AI tutor that teaches any subject adaptively.",
    difficulty: "Expert",
    time: "60 min",
    points: 1000,
    participants: 89,
    status: "available",
    featured: true,
    score: null,
  },
];

const difficultyColors: Record<string, string> = {
  Easy: "text-emerald-400 border-emerald-400/30",
  Medium: "text-amber-400 border-amber-400/30",
  Hard: "text-rose-400 border-rose-400/30",
  Expert: "text-foreground border-foreground/30",
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
      <svg className="w-full h-full" viewBox="0 0 696 316" fill="none" aria-hidden="true">
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

const Challenges = () => {
  const stats = [
    { icon: Trophy, label: "Rank", value: "#127" },
    { icon: Flame, label: "Streak", value: "7 days" },
    { icon: Star, label: "Points", value: "2,450" },
    { icon: Medal, label: "Badges", value: "12" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section with Background */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 bg-background">
          <FloatingPaths position={1} />
          <FloatingPaths position={-1} />
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />

        <div className="container mx-auto px-4 relative z-20 text-center">
          <motion.span 
            className="text-muted-foreground text-sm font-medium tracking-widest uppercase mb-4 block"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Compete & Conquer
          </motion.span>
          
          <motion.h1 
            className="text-4xl md:text-6xl font-heading font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            Weekly <span className="text-foreground">Challenges</span>
          </motion.h1>
          
          <motion.div 
            className="h-px w-48 mx-auto mb-6 bg-gradient-to-r from-transparent via-foreground/30 to-transparent"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          />
          
          <motion.p 
            className="text-muted-foreground max-w-xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Test your skills, compete with others, and climb the leaderboard.
          </motion.p>

          {/* Stats */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            {stats.map((stat, i) => (
              <motion.div 
                key={i} 
                className="glass rounded-xl border border-border/50 p-4 text-center"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <stat.icon className="w-5 h-5 text-foreground mx-auto mb-2" />
                <p className="text-xl font-heading font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Challenges List */}
      <main className="py-16 relative z-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-4">
            {challenges.map((challenge, index) => (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                whileHover={{ scale: challenge.status !== "locked" ? 1.01 : 1 }}
                className={cn(
                  "group p-5 bg-card/80 backdrop-blur-sm border border-border rounded-xl transition-all duration-300",
                  challenge.featured && "border-foreground/40 bg-foreground/5",
                  challenge.status === "locked" && "opacity-40",
                  challenge.status !== "locked" && "hover:border-foreground/40 cursor-pointer"
                )}
              >
                {challenge.featured && (
                  <div className="flex items-center gap-2 mb-3">
                    <Flame className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-medium text-amber-400">Featured Challenge</span>
                  </div>
                )}

                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  {/* Icon */}
                  <div className={cn(
                    "flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center border",
                    challenge.status === "completed" ? "border-emerald-400/30 bg-emerald-400/10" :
                    challenge.status === "locked" ? "border-border bg-muted" : "border-border bg-accent"
                  )}>
                    {challenge.status === "completed" ? (
                      <Trophy className="w-5 h-5 text-emerald-400" />
                    ) : challenge.status === "locked" ? (
                      <Lock className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <Target className="w-5 h-5 text-foreground" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="text-base font-heading font-semibold">{challenge.title}</h3>
                      <span className={cn(
                        "px-2 py-0.5 rounded-full text-xs font-medium border",
                        difficultyColors[challenge.difficulty]
                      )}>
                        {challenge.difficulty}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1">{challenge.description}</p>
                  </div>

                  {/* Meta */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{challenge.time}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-400" />
                      <span>{challenge.points}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      <span>{challenge.participants.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Action */}
                  <div className="flex-shrink-0">
                    {challenge.status === "completed" ? (
                      <span className="text-sm font-medium text-emerald-400">{challenge.score}/100</span>
                    ) : challenge.status === "in-progress" ? (
                      <Button size="sm" className="rounded-full">Continue</Button>
                    ) : challenge.status === "locked" ? (
                      <Button variant="outline" size="sm" disabled className="rounded-full">Locked</Button>
                    ) : (
                      <Button variant="outline" size="sm" className="rounded-full group-hover:bg-foreground group-hover:text-background transition-colors">
                        Start
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Challenges;
