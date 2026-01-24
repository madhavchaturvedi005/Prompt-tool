import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Trophy, Clock, Star, Users, Flame, Medal, Target, Lock, X, Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface Challenge {
  id: number;
  title: string;
  description: string;
  fullDescription: string;
  difficulty: string;
  time: string;
  points: number;
  participants: number;
  status: "completed" | "in-progress" | "available" | "locked";
  score: number | null;
  featured?: boolean;
  hints: string[];
}

const challengesData: Challenge[] = [
  {
    id: 1,
    title: "Email Assistant Challenge",
    description: "Create a prompt that helps draft professional emails from bullet points.",
    fullDescription: "Your task is to create a prompt that takes a list of bullet points and transforms them into a well-structured, professional email. The prompt should handle different email types (formal, informal, follow-up) and maintain appropriate tone.",
    difficulty: "Easy",
    time: "15 min",
    points: 100,
    participants: 1234,
    status: "completed",
    score: 95,
    hints: ["Consider specifying the email tone", "Include instructions for greeting and sign-off", "Handle edge cases like empty bullet points"],
  },
  {
    id: 2,
    title: "Code Debugger Pro",
    description: "Design a prompt that identifies bugs and suggests fixes across languages.",
    fullDescription: "Create a prompt that can analyze code snippets, identify potential bugs, explain why they're problematic, and suggest fixes. Your prompt should work across multiple programming languages.",
    difficulty: "Medium",
    time: "25 min",
    points: 250,
    participants: 856,
    status: "in-progress",
    score: null,
    hints: ["Ask for step-by-step analysis", "Request explanations for each bug found", "Include language-specific considerations"],
  },
  {
    id: 3,
    title: "Creative Story Generator",
    description: "Build a prompt system that creates engaging short stories with themes.",
    fullDescription: "Design a prompt that generates creative short stories based on given themes, characters, and settings. The stories should have proper structure with beginning, middle, and end.",
    difficulty: "Medium",
    time: "30 min",
    points: 300,
    participants: 2103,
    status: "available",
    score: null,
    hints: ["Define story structure requirements", "Include character development guidelines", "Specify word count or length"],
  },
  {
    id: 4,
    title: "Data Analyst Bot",
    description: "Craft a prompt that analyzes datasets and provides actionable insights.",
    fullDescription: "Create a prompt that can take data in various formats, analyze patterns and trends, and provide actionable insights with clear explanations. Include visualization suggestions.",
    difficulty: "Hard",
    time: "45 min",
    points: 500,
    participants: 421,
    status: "available",
    score: null,
    hints: ["Handle different data formats", "Request statistical analysis", "Ask for visualization recommendations"],
  },
  {
    id: 5,
    title: "Multi-Turn Conversation",
    description: "Create a prompt that maintains context across multiple conversation turns.",
    fullDescription: "Design a system prompt that maintains context and memory across multiple conversation turns, providing coherent and contextually aware responses throughout a dialogue.",
    difficulty: "Hard",
    time: "40 min",
    points: 450,
    participants: 312,
    status: "locked",
    score: null,
    hints: ["Define memory management", "Handle context switching", "Maintain personality consistency"],
  },
  {
    id: 6,
    title: "Weekly Boss Challenge",
    description: "The ultimate test: Create an AI tutor that teaches any subject adaptively.",
    fullDescription: "Create an adaptive AI tutor prompt that can teach any subject, adjust to the learner's level, provide examples, quiz the student, and track progress. This is the ultimate prompt engineering challenge!",
    difficulty: "Expert",
    time: "60 min",
    points: 1000,
    participants: 89,
    status: "available",
    featured: true,
    score: null,
    hints: ["Implement adaptive difficulty", "Include assessment mechanisms", "Design feedback loops"],
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

function ChallengeModal({ 
  challenge, 
  onClose, 
  onComplete 
}: { 
  challenge: Challenge; 
  onClose: () => void;
  onComplete: (id: number, score: number) => void;
}) {
  const [prompt, setPrompt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ score: number; message: string } | null>(null);
  const [showHints, setShowHints] = useState(false);

  const handleSubmit = () => {
    if (!prompt.trim()) return;
    setIsSubmitting(true);
    
    // Simulate AI evaluation
    setTimeout(() => {
      const score = Math.floor(Math.random() * 30) + 70; // Random score 70-100
      setFeedback({
        score,
        message: score >= 90 
          ? "Excellent work! Your prompt demonstrates clear understanding of the requirements and handles edge cases well."
          : score >= 80
          ? "Great job! Your prompt covers the main requirements. Consider adding more specificity for edge cases."
          : "Good attempt! Your prompt addresses the basic requirements. Try being more specific about output format and handling edge cases."
      });
      setIsSubmitting(false);
    }, 2000);
  };

  const handleComplete = () => {
    if (feedback) {
      onComplete(challenge.id, feedback.score);
      onClose();
    }
  };

  return (
    <motion.div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/90 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal */}
      <motion.div 
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-card border border-border rounded-2xl shadow-2xl"
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
      >
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border p-6 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium border", difficultyColors[challenge.difficulty])}>
                {challenge.difficulty}
              </span>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" /> {challenge.time}
              </span>
              <span className="text-xs text-amber-400 flex items-center gap-1">
                <Star className="w-3 h-3" /> {challenge.points} pts
              </span>
            </div>
            <h2 className="text-xl font-heading font-bold">{challenge.title}</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="rounded-full">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Description */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Challenge Description</h3>
            <p className="text-foreground">{challenge.fullDescription}</p>
          </div>

          {/* Hints */}
          <div>
            <button 
              onClick={() => setShowHints(!showHints)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              {showHints ? "Hide hints" : "Show hints"} →
            </button>
            <AnimatePresence>
              {showHints && (
                <motion.ul 
                  className="mt-3 space-y-2"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  {challenge.hints.map((hint, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-foreground">•</span> {hint}
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>

          {/* Prompt Input */}
          {!feedback && (
            <div>
              <label className="block text-sm font-medium mb-2">Your Prompt</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Write your prompt solution here..."
                className="w-full h-40 bg-muted/30 rounded-lg p-4 text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-1 focus:ring-foreground/30 transition-all border border-border focus:border-foreground/20"
              />
              <div className="flex justify-end mt-4">
                <Button 
                  onClick={handleSubmit} 
                  disabled={!prompt.trim() || isSubmitting}
                  className="rounded-full"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Submit Solution
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Feedback */}
          {feedback && (
            <motion.div 
              className="bg-muted/30 rounded-xl p-6 border border-foreground/20"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  <span className="font-heading font-medium">Challenge Complete!</span>
                </div>
                <div className={cn(
                  "text-2xl font-heading font-bold",
                  feedback.score >= 90 ? "text-emerald-400" : feedback.score >= 80 ? "text-amber-400" : "text-foreground"
                )}>
                  {feedback.score}/100
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{feedback.message}</p>
              <div className="flex items-center justify-between">
                <p className="text-sm text-foreground">
                  <Star className="w-4 h-4 inline mr-1 text-amber-400" />
                  You earned <span className="font-bold">{Math.floor(challenge.points * feedback.score / 100)}</span> points!
                </p>
                <Button onClick={handleComplete} className="rounded-full">
                  Continue
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

const Challenges = () => {
  const [challenges, setChallenges] = useState(challengesData);
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null);
  const [totalPoints, setTotalPoints] = useState(2450);

  const stats = [
    { icon: Trophy, label: "Rank", value: "#127" },
    { icon: Flame, label: "Streak", value: "7 days" },
    { icon: Star, label: "Points", value: totalPoints.toLocaleString() },
    { icon: Medal, label: "Badges", value: "12" },
  ];

  const handleStartChallenge = (challenge: Challenge) => {
    if (challenge.status === "locked") return;
    setActiveChallenge(challenge);
  };

  const handleCompleteChallenge = (id: number, score: number) => {
    setChallenges(prev => prev.map(c => 
      c.id === id ? { ...c, status: "completed" as const, score } : c
    ));
    const challenge = challenges.find(c => c.id === id);
    if (challenge) {
      const earnedPoints = Math.floor(challenge.points * score / 100);
      setTotalPoints(prev => prev + earnedPoints);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
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
          >
            Compete & Conquer
          </motion.span>
          
          <motion.h1 
            className="text-4xl md:text-6xl font-heading font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
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
            transition={{ delay: 0.4 }}
          >
            Test your skills, compete with others, and climb the leaderboard.
          </motion.p>

          {/* Stats */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {stats.map((stat, i) => (
              <motion.div 
                key={i} 
                className="glass rounded-xl border border-border/50 p-4 text-center"
                whileHover={{ scale: 1.05 }}
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
                onClick={() => handleStartChallenge(challenge)}
                className={cn(
                  "group p-5 bg-card/80 backdrop-blur-sm border border-border rounded-xl transition-all duration-300",
                  challenge.featured && "border-foreground/40 bg-foreground/5",
                  challenge.status === "locked" && "opacity-40 cursor-not-allowed",
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

      {/* Challenge Modal */}
      <AnimatePresence>
        {activeChallenge && (
          <ChallengeModal 
            challenge={activeChallenge} 
            onClose={() => setActiveChallenge(null)}
            onComplete={handleCompleteChallenge}
          />
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default Challenges;
