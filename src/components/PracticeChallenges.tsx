import { Trophy, Clock, Star, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Challenge data
const challenges = [
  {
    title: "Email Assistant",
    description: "Create a prompt that helps draft professional emails based on bullet points.",
    difficulty: "Easy",
    time: "15 min",
    points: 100,
    participants: 1234,
  },
  {
    title: "Code Debugger",
    description: "Design a prompt that identifies and explains bugs in code snippets.",
    difficulty: "Medium",
    time: "25 min",
    points: 250,
    participants: 856,
  },
  {
    title: "Story Generator",
    description: "Build a prompt that creates engaging short stories with specific themes.",
    difficulty: "Medium",
    time: "30 min",
    points: 300,
    participants: 2103,
  },
  {
    title: "Data Analyst",
    description: "Craft a prompt that analyzes datasets and provides actionable insights.",
    difficulty: "Hard",
    time: "45 min",
    points: 500,
    participants: 421,
  },
];

// Difficulty color mapping
const difficultyColors: Record<string, string> = {
  Easy: "text-green-400",
  Medium: "text-yellow-400",
  Hard: "text-red-400",
};

export function PracticeChallenges() {
  return (
    <section className="py-24 relative">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-purple/5 to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Practice <span className="text-gradient">Challenges</span>
            </h2>
            <p className="text-muted-foreground max-w-xl">
              Put your skills to the test with real-world prompting scenarios. 
              Earn points, climb the leaderboard, and unlock achievements.
            </p>
          </div>
          <Button variant="neon-outline" className="mt-6 md:mt-0">
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
                "group relative p-6 rounded-2xl glass border transition-all duration-300",
                "hover:border-neon-blue/50 hover:shadow-lg hover:shadow-neon-blue/10",
                "flex flex-col md:flex-row md:items-center gap-4 cursor-pointer"
              )}
            >
              {/* Challenge Number */}
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 flex items-center justify-center font-bold text-xl text-gradient">
                {String(index + 1).padStart(2, "0")}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-lg font-semibold group-hover:text-neon-blue transition-colors">
                    {challenge.title}
                  </h3>
                  <span className={cn("text-sm font-medium", difficultyColors[challenge.difficulty])}>
                    {challenge.difficulty}
                  </span>
                </div>
                <p className="text-muted-foreground text-sm truncate">
                  {challenge.description}
                </p>
              </div>

              {/* Meta */}
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-neon-blue" />
                  <span>{challenge.time}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span>{challenge.points} pts</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-neon-purple" />
                  <span>{challenge.participants.toLocaleString()}</span>
                </div>
              </div>

              {/* Arrow */}
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-neon-blue group-hover:translate-x-1 transition-all" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
