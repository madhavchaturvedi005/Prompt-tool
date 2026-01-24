import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Trophy, Clock, Star, Users, Flame, Medal, Target, Lock, ChevronLeft, Send, CheckCircle, Lightbulb, Play, RotateCcw, Copy, Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";

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
  examples: { input: string; output: string }[];
  constraints: string[];
}

const challengesData: Challenge[] = [
  {
    id: 1,
    title: "Email Assistant Challenge",
    description: "Create a prompt that helps draft professional emails from bullet points.",
    fullDescription: "Your task is to create a prompt that takes a list of bullet points and transforms them into a well-structured, professional email. The prompt should handle different email types (formal, informal, follow-up) and maintain appropriate tone throughout the message.",
    difficulty: "Easy",
    time: "15 min",
    points: 100,
    participants: 1234,
    status: "completed",
    score: 95,
    hints: ["Consider specifying the email tone", "Include instructions for greeting and sign-off", "Handle edge cases like empty bullet points"],
    examples: [
      { input: "Bullet points: Meeting tomorrow, 2pm, Conference Room B", output: "A professional email scheduling the meeting with all details" },
      { input: "Bullet points: Thank client, Great presentation, Follow up next week", output: "A grateful follow-up email with clear next steps" }
    ],
    constraints: ["Must handle 3+ email types", "Output should be ready to send", "Maintain professional tone"]
  },
  {
    id: 2,
    title: "Code Debugger Pro",
    description: "Design a prompt that identifies bugs and suggests fixes across languages.",
    fullDescription: "Create a prompt that can analyze code snippets, identify potential bugs, explain why they're problematic, and suggest fixes. Your prompt should work across multiple programming languages including Python, JavaScript, and TypeScript.",
    difficulty: "Medium",
    time: "25 min",
    points: 250,
    participants: 856,
    status: "in-progress",
    score: null,
    hints: ["Ask for step-by-step analysis", "Request explanations for each bug found", "Include language-specific considerations"],
    examples: [
      { input: "function add(a, b) { return a + b }", output: "Analysis: Missing type safety, potential NaN issues..." },
      { input: "for i in range(len(list)):", output: "Suggestion: Use enumerate() for cleaner iteration..." }
    ],
    constraints: ["Support 3+ programming languages", "Explain severity of each bug", "Provide working fix"]
  },
  {
    id: 3,
    title: "Creative Story Generator",
    description: "Build a prompt system that creates engaging short stories with themes.",
    fullDescription: "Design a prompt that generates creative short stories based on given themes, characters, and settings. The stories should have proper structure with a compelling beginning, engaging middle, and satisfying end.",
    difficulty: "Medium",
    time: "30 min",
    points: 300,
    participants: 2103,
    status: "available",
    score: null,
    hints: ["Define story structure requirements", "Include character development guidelines", "Specify word count or length"],
    examples: [
      { input: "Theme: Redemption, Setting: Space station", output: "A story about a former criminal finding purpose..." },
      { input: "Theme: First love, Setting: 1920s Paris", output: "A romantic tale set in the Jazz Age..." }
    ],
    constraints: ["300-500 words", "Must include dialogue", "Clear narrative arc"]
  },
  {
    id: 4,
    title: "Data Analyst Bot",
    description: "Craft a prompt that analyzes datasets and provides actionable insights.",
    fullDescription: "Create a prompt that can take data in various formats (CSV, JSON, tables), analyze patterns and trends, and provide actionable insights with clear explanations. Include visualization suggestions where appropriate.",
    difficulty: "Hard",
    time: "45 min",
    points: 500,
    participants: 421,
    status: "available",
    score: null,
    hints: ["Handle different data formats", "Request statistical analysis", "Ask for visualization recommendations"],
    examples: [
      { input: "Sales data with monthly figures", output: "Trend analysis with growth predictions..." },
      { input: "User engagement metrics", output: "Insights on peak usage times and recommendations..." }
    ],
    constraints: ["Support CSV/JSON input", "Include confidence levels", "Suggest visualizations"]
  },
  {
    id: 5,
    title: "Multi-Turn Conversation",
    description: "Create a prompt that maintains context across multiple conversation turns.",
    fullDescription: "Design a system prompt that maintains context and memory across multiple conversation turns, providing coherent and contextually aware responses throughout a dialogue while maintaining consistent personality.",
    difficulty: "Hard",
    time: "40 min",
    points: 450,
    participants: 312,
    status: "locked",
    score: null,
    hints: ["Define memory management", "Handle context switching", "Maintain personality consistency"],
    examples: [
      { input: "User mentions their name early in conversation", output: "AI uses name naturally throughout..." },
      { input: "User references earlier topic", output: "AI connects current and past context..." }
    ],
    constraints: ["Track 5+ conversation turns", "Handle topic changes", "Remember user preferences"]
  },
  {
    id: 6,
    title: "Weekly Boss Challenge",
    description: "The ultimate test: Create an AI tutor that teaches any subject adaptively.",
    fullDescription: "Create an adaptive AI tutor prompt that can teach any subject, adjust to the learner's level, provide examples, quiz the student, and track progress. This is the ultimate prompt engineering challenge requiring mastery of all techniques!",
    difficulty: "Expert",
    time: "60 min",
    points: 1000,
    participants: 89,
    status: "available",
    featured: true,
    score: null,
    hints: ["Implement adaptive difficulty", "Include assessment mechanisms", "Design feedback loops"],
    examples: [
      { input: "Student struggles with fractions", output: "Tutor simplifies explanation, uses visual examples..." },
      { input: "Advanced student asks complex question", output: "Tutor provides in-depth analysis with challenges..." }
    ],
    constraints: ["Adaptive difficulty", "Include quizzes", "Track progress metrics"]
  },
];

const difficultyColors: Record<string, string> = {
  Easy: "text-emerald-400 border-emerald-400/30",
  Medium: "text-amber-400 border-amber-400/30",
  Hard: "text-rose-400 border-rose-400/30",
  Expert: "text-foreground border-foreground/30",
};

const difficultyBg: Record<string, string> = {
  Easy: "bg-emerald-400/10",
  Medium: "bg-amber-400/10",
  Hard: "bg-rose-400/10",
  Expert: "bg-foreground/10",
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

// LeetCode-style Workspace Component
function ChallengeWorkspace({ 
  challenge, 
  onBack,
  onComplete 
}: { 
  challenge: Challenge;
  onBack: () => void;
  onComplete: (id: number, score: number) => void;
}) {
  const [prompt, setPrompt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ score: number; message: string } | null>(null);
  const [activeTab, setActiveTab] = useState<"description" | "hints" | "submissions">("description");
  const [copied, setCopied] = useState(false);

  const handleSubmit = () => {
    if (!prompt.trim()) return;
    setIsSubmitting(true);
    
    setTimeout(() => {
      const score = Math.floor(Math.random() * 30) + 70;
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
    }
  };

  const handleReset = () => {
    setPrompt("");
    setFeedback(null);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <Navbar />
      
      {/* Workspace Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack} className="gap-1">
            <ChevronLeft className="w-4 h-4" /> Back to Challenges
          </Button>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-2">
            <span className={cn("px-2 py-0.5 rounded text-xs font-medium border", difficultyColors[challenge.difficulty], difficultyBg[challenge.difficulty])}>
              {challenge.difficulty}
            </span>
            <h1 className="font-heading font-bold text-lg">{challenge.title}</h1>
          </div>
        </div>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" /> {challenge.time}
          </span>
          <span className="flex items-center gap-1 text-amber-400">
            <Star className="w-4 h-4" /> {challenge.points} pts
          </span>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Left Panel - Problem Description */}
          <ResizablePanel defaultSize={45} minSize={30}>
            <div className="h-full flex flex-col">
              {/* Tabs */}
              <div className="flex border-b border-border bg-muted/30">
                {(["description", "hints", "submissions"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "px-4 py-3 text-sm font-medium capitalize transition-colors",
                      activeTab === tab 
                        ? "text-foreground border-b-2 border-foreground bg-background" 
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <AnimatePresence mode="wait">
                  {activeTab === "description" && (
                    <motion.div
                      key="description"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-6"
                    >
                      <div>
                        <h3 className="text-sm font-medium text-foreground mb-3">Description</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{challenge.fullDescription}</p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-foreground mb-3">Examples</h3>
                        <div className="space-y-3">
                          {challenge.examples.map((ex, i) => (
                            <div key={i} className="bg-muted/30 rounded-lg p-4 text-sm border border-border">
                              <p className="text-muted-foreground mb-2">
                                <span className="font-medium text-foreground">Input:</span> {ex.input}
                              </p>
                              <p className="text-muted-foreground">
                                <span className="font-medium text-foreground">Expected:</span> {ex.output}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-foreground mb-3">Constraints</h3>
                        <ul className="space-y-2">
                          {challenge.constraints.map((c, i) => (
                            <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                              <span className="text-foreground mt-0.5">•</span> {c}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "hints" && (
                    <motion.div
                      key="hints"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-4"
                    >
                      <p className="text-sm text-muted-foreground">
                        Use hints sparingly - they may affect your learning!
                      </p>
                      {challenge.hints.map((hint, i) => (
                        <div key={i} className="flex items-start gap-3 bg-amber-400/5 border border-amber-400/20 rounded-lg p-4">
                          <Lightbulb className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                          <p className="text-sm text-muted-foreground">{hint}</p>
                        </div>
                      ))}
                    </motion.div>
                  )}

                  {activeTab === "submissions" && (
                    <motion.div
                      key="submissions"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {challenge.score ? (
                        <div className="bg-emerald-400/10 border border-emerald-400/30 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className="w-5 h-5 text-emerald-400" />
                            <span className="font-medium text-emerald-400">Previously Completed</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Best score: <span className="font-bold text-foreground">{challenge.score}/100</span>
                          </p>
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">No submissions yet. Write your solution and submit!</p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Right Panel - Editor */}
          <ResizablePanel defaultSize={55} minSize={35}>
            <div className="h-full flex flex-col">
              {/* Editor Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
                <span className="text-sm font-medium">Prompt Editor</span>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleCopy}
                    disabled={!prompt}
                    className="h-8 gap-1"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span className="hidden sm:inline">{copied ? "Copied" : "Copy"}</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleReset}
                    disabled={!prompt && !feedback}
                    className="h-8 gap-1"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span className="hidden sm:inline">Reset</span>
                  </Button>
                </div>
              </div>

              {/* Editor Area */}
              <div className="flex-1 p-4 overflow-hidden">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Write your prompt solution here...

Think about:
• What role should the AI take?
• What specific instructions does it need?
• How should the output be formatted?
• What edge cases should be handled?"
                  className="w-full h-full bg-muted/20 rounded-lg p-4 text-sm text-foreground placeholder:text-muted-foreground/60 resize-none focus:outline-none focus:ring-1 focus:ring-foreground/30 border border-border focus:border-foreground/20 font-mono"
                  disabled={!!feedback}
                />
              </div>

              {/* Feedback Section */}
              <AnimatePresence>
                {feedback && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="p-4 border-t border-border bg-muted/30"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-emerald-400" />
                        <span className="font-medium">Evaluation Complete</span>
                      </div>
                      <span className={cn(
                        "text-2xl font-heading font-bold",
                        feedback.score >= 90 ? "text-emerald-400" : feedback.score >= 80 ? "text-amber-400" : "text-foreground"
                      )}>
                        {feedback.score}/100
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">{feedback.message}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-sm">
                        <Star className="w-4 h-4 inline mr-1 text-amber-400" />
                        Earned: <span className="font-bold">{Math.floor(challenge.points * feedback.score / 100)}</span> points
                      </p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={handleReset}>
                          Try Again
                        </Button>
                        <Button size="sm" onClick={handleComplete}>
                          Complete & Exit
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              {!feedback && (
                <div className="p-4 border-t border-border bg-muted/30 flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    {prompt.length > 0 ? `${prompt.length} characters` : "Start typing your solution..."}
                  </p>
                  <Button 
                    onClick={handleSubmit} 
                    disabled={!prompt.trim() || isSubmitting}
                    className="gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                        Evaluating...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        Run & Submit
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}

// Original Challenges List View
function ChallengesListView({ 
  challenges, 
  onSelectChallenge,
  totalPoints,
  stats
}: { 
  challenges: Challenge[];
  onSelectChallenge: (c: Challenge) => void;
  totalPoints: number;
  stats: { icon: any; label: string; value: string }[];
}) {
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
                onClick={() => challenge.status !== "locked" && onSelectChallenge(challenge)}
                className={cn(
                  "group p-5 bg-card/80 backdrop-blur-sm border border-border rounded-xl transition-all duration-300 cursor-pointer",
                  challenge.featured && "border-foreground/40 bg-foreground/5",
                  challenge.status === "locked" && "opacity-50 cursor-not-allowed",
                  challenge.status !== "locked" && "hover:border-foreground/30"
                )}
              >
                <div className="flex items-start gap-4">
                  {/* Challenge Number/Status */}
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center font-heading font-bold text-lg shrink-0",
                    challenge.status === "completed" ? "bg-emerald-400/20 text-emerald-400" :
                    challenge.status === "in-progress" ? "bg-amber-400/20 text-amber-400" :
                    challenge.status === "locked" ? "bg-muted text-muted-foreground" :
                    "bg-foreground/10 text-foreground"
                  )}>
                    {challenge.status === "completed" ? <CheckCircle className="w-5 h-5" /> :
                     challenge.status === "locked" ? <Lock className="w-5 h-5" /> :
                     `#${challenge.id}`}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium border", difficultyColors[challenge.difficulty])}>
                        {challenge.difficulty}
                      </span>
                      {challenge.featured && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-foreground text-background">
                          Featured
                        </span>
                      )}
                      {challenge.status === "completed" && challenge.score && (
                        <span className="text-xs text-emerald-400">Score: {challenge.score}/100</span>
                      )}
                    </div>
                    <h3 className="font-heading font-semibold text-foreground mb-1">{challenge.title}</h3>
                    <p className="text-sm text-muted-foreground">{challenge.description}</p>
                  </div>

                  {/* Meta */}
                  <div className="text-right shrink-0 hidden sm:block">
                    <div className="flex items-center gap-1 text-amber-400 text-sm font-medium mb-1">
                      <Star className="w-4 h-4" /> {challenge.points} pts
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground text-xs">
                      <Clock className="w-3 h-3" /> {challenge.time}
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground text-xs mt-1">
                      <Users className="w-3 h-3" /> {challenge.participants.toLocaleString()}
                    </div>
                  </div>

                  {/* Arrow */}
                  {challenge.status !== "locked" && (
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all shrink-0 self-center" />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
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

  const handleCompleteChallenge = (id: number, score: number) => {
    setChallenges(prev => prev.map(c => 
      c.id === id ? { ...c, status: "completed" as const, score } : c
    ));
    const challenge = challenges.find(c => c.id === id);
    if (challenge) {
      const earnedPoints = Math.floor(challenge.points * score / 100);
      setTotalPoints(prev => prev + earnedPoints);
    }
    setActiveChallenge(null);
  };

  // Show workspace when a challenge is selected
  if (activeChallenge) {
    return (
      <ChallengeWorkspace 
        challenge={activeChallenge}
        onBack={() => setActiveChallenge(null)}
        onComplete={handleCompleteChallenge}
      />
    );
  }

  // Show the original challenges list
  return (
    <ChallengesListView 
      challenges={challenges}
      onSelectChallenge={setActiveChallenge}
      totalPoints={totalPoints}
      stats={stats}
    />
  );
};

export default Challenges;
