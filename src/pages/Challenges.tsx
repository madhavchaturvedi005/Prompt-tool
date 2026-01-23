import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Trophy, Clock, Star, Users, Flame, Medal, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const challenges = [
  {
    id: 1,
    title: "Email Assistant Challenge",
    description: "Create a prompt that helps draft professional emails from bullet points. Your prompt should handle various email types and tones.",
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
    description: "Design a prompt that identifies bugs, explains them clearly, and suggests fixes across multiple programming languages.",
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
    description: "Build a prompt system that creates engaging short stories with specific themes, characters, and plot elements.",
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
    description: "Craft a prompt that analyzes datasets, identifies patterns, and provides actionable insights with visualization suggestions.",
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
    description: "Create a prompt that maintains context across multiple conversation turns while providing helpful responses.",
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
    description: "The ultimate test: Create an AI tutor that teaches any subject adaptively based on student responses.",
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
  Easy: "text-green-400 bg-green-400/10",
  Medium: "text-yellow-400 bg-yellow-400/10",
  Hard: "text-red-400 bg-red-400/10",
  Expert: "text-ocean-light bg-ocean-light/10",
};

const Challenges = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Weekly <span className="text-gradient">Challenges</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Test your skills, compete with others, and climb the leaderboard.
            </p>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-12">
            {[
              { icon: Trophy, label: "Rank", value: "#127" },
              { icon: Flame, label: "Streak", value: "7 days" },
              { icon: Star, label: "Total Points", value: "2,450" },
              { icon: Medal, label: "Badges", value: "12" },
            ].map((stat, i) => (
              <div key={i} className="glass rounded-xl border p-4 text-center">
                <stat.icon className="w-6 h-6 text-ocean mx-auto mb-2" />
                <p className="text-2xl font-bold text-gradient">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Challenges List */}
          <div className="max-w-4xl mx-auto space-y-4">
            {challenges.map((challenge) => (
              <div
                key={challenge.id}
                className={cn(
                  "glass rounded-2xl border p-6 transition-all duration-300",
                  challenge.featured && "border-ocean-light/50 shadow-lg shadow-ocean-light/10",
                  challenge.status === "locked" && "opacity-50",
                  challenge.status !== "locked" && "hover:border-ocean/50"
                )}
              >
                {challenge.featured && (
                  <div className="flex items-center gap-2 mb-3">
                    <Flame className="w-4 h-4 text-ocean-light" />
                    <span className="text-xs font-medium text-ocean-light">Featured Challenge</span>
                  </div>
                )}

                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  {/* Challenge Number */}
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-ocean/20 to-ocean-light/20 flex items-center justify-center">
                    {challenge.status === "completed" ? (
                      <Trophy className="w-6 h-6 text-yellow-400" />
                    ) : (
                      <Target className="w-6 h-6 text-ocean" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold">{challenge.title}</h3>
                      <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", difficultyColors[challenge.difficulty])}>
                        {challenge.difficulty}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{challenge.description}</p>
                  </div>

                  {/* Meta & Action */}
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{challenge.time}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span>{challenge.points} pts</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{challenge.participants}</span>
                      </div>
                    </div>

                    {challenge.status === "completed" ? (
                      <div className="text-sm font-medium text-green-400">
                        Score: {challenge.score}/100
                      </div>
                    ) : challenge.status === "in-progress" ? (
                      <Button variant="ocean" size="sm">
                        Continue
                      </Button>
                    ) : challenge.status === "locked" ? (
                      <Button variant="outline" size="sm" disabled>
                        Locked
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm" className="border-ocean text-ocean hover:bg-ocean/10">
                        Start
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Challenges;
