import { Trophy, Clock, Star, ChevronRight, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
  Intermediate: "text-gold",
  Advanced: "text-rose-400",
};

export function PracticeChallenges() {
  return (
    <section className="py-24 relative bg-card/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-gold text-sm font-medium tracking-widest uppercase mb-4 block">
              Challenges
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-semibold mb-4">
              Practice <span className="text-gradient">Excellence</span>
            </h2>
            <p className="text-muted-foreground max-w-xl">
              Test your skills with real-world scenarios. Earn recognition and 
              climb the ranks of prompt engineering mastery.
            </p>
          </div>
          <Button variant="gold-outline" className="mt-6 md:mt-0">
            View All Challenges
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Challenges List */}
        <div className="space-y-4">
          {challenges.map((challenge, index) => (
            <div
              key={index}
              className={cn(
                "group p-6 bg-card border border-border transition-all duration-300",
                "hover:border-gold/40 flex flex-col md:flex-row md:items-center gap-4 cursor-pointer"
              )}
            >
              {/* Number */}
              <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center border border-gold/30 font-serif text-xl text-gold">
                {String(index + 1).padStart(2, "0")}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-lg font-serif font-semibold group-hover:text-gold transition-colors">
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
                  <Clock className="w-4 h-4 text-gold/70" />
                  <span>{challenge.time}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-gold" />
                  <span>{challenge.points} pts</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-gold/70" />
                  <span>{challenge.participants.toLocaleString()}</span>
                </div>
              </div>

              {/* Arrow */}
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-gold group-hover:translate-x-1 transition-all" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
