import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AuthPrompt } from "@/components/AuthPrompt";
import { Trophy, Clock, Star, Users, Flame, Medal, ChevronLeft, CheckCircle, Lightbulb, Play, RotateCcw, Copy, Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { challenges as challengesFromSchema } from "@/lib/challengesData";
import { evaluatePrompt } from "@/lib/challengeEvaluator";
import { useAuth } from "@/contexts/AuthContext";
import { SupabaseService, isSupabaseConfigured, supabase, supabaseAdmin } from "@/lib/supabase";

interface Challenge {
  id: number;
  title: string;
  description: string;
  fullDescription: string;
  difficulty: string;
  time: string;
  points: number;
  participants: number;
  status: "completed" | "available";
  score: number | null;
  criteriaScores?: Record<string, number>;
  featured?: boolean;
  hints: string[];
  examples: { input: string; output: string }[];
  constraints: string[];
  evaluationCriteria: Array<{
    name: string;
    weight: number;
    description: string;
  }>;
}

// Convert JSON schema challenges to the format expected by the component (remove locked status)
const challengesData: Challenge[] = challengesFromSchema.map((challenge, index) => ({
  id: index + 1,
  title: challenge.title,
  description: challenge.description,
  fullDescription: challenge.objectives.join(". ") + ".",
  difficulty: challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1),
  time: challenge.estimatedTime,
  points: challenge.points,
  participants: challenge.participants,
  status: "available", // All challenges are available
  score: null, // No pre-completed challenges
  featured: challenge.featured,
  hints: challenge.hints,
  examples: challenge.testCases.map(tc => ({
    input: tc.input,
    output: tc.expectedElements.join(", ")
  })),
  constraints: challenge.requirements.constraints,
  evaluationCriteria: challenge.evaluation.criteria
}));

const difficultyColors: Record<string, string> = {
  Beginner: "text-emerald-400 border-emerald-400/30",
  Intermediate: "text-amber-400 border-amber-400/30",
  Advanced: "text-rose-400 border-rose-400/30",
};

const difficultyBg: Record<string, string> = {
  Beginner: "bg-emerald-400/10",
  Intermediate: "bg-amber-400/10",
  Advanced: "bg-rose-400/10",
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

// Enhanced Workspace Component with OpenAI Evaluation
function ChallengeWorkspace({ 
  challenge, 
  onBack,
  onComplete 
}: { 
  challenge: Challenge;
  onBack: () => void;
  onComplete: (id: number, score: number, criteriaScores: Record<string, number>, promptText: string) => void;
}) {
  const [prompt, setPrompt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    overallScore: number;
    criteriaScores: Record<string, number>;
    feedback: string;
    suggestions: string[];
  } | null>(null);
  const [activeTab, setActiveTab] = useState<"description" | "hints" | "submissions">("description");
  const [copied, setCopied] = useState(false);

  const handleSubmit = async () => {
    if (!prompt.trim()) return;
    setIsSubmitting(true);
    
    try {
      const result = await evaluatePrompt(prompt, challenge.id.toString(), challenge.evaluationCriteria);
      setFeedback(result);
    } catch (error) {
      console.error('Evaluation failed:', error);
      // Fallback evaluation
      setFeedback({
        overallScore: 75,
        criteriaScores: challenge.evaluationCriteria.reduce((acc, c) => {
          acc[c.name] = Math.floor(Math.random() * 3) + 6;
          return acc;
        }, {} as Record<string, number>),
        feedback: "Evaluation service temporarily unavailable. This is an estimated score.",
        suggestions: ["Try to be more specific in your instructions", "Consider adding examples", "Think about edge cases"]
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleComplete = () => {
    if (feedback) {
      onComplete(challenge.id, feedback.overallScore, feedback.criteriaScores, prompt);
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

                      <div>
                        <h3 className="text-sm font-medium text-foreground mb-3">Evaluation Criteria</h3>
                        <div className="space-y-2">
                          {challenge.evaluationCriteria.map((criterion, i) => (
                            <div key={i} className="bg-muted/20 rounded-lg p-3 border border-border">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium text-foreground">{criterion.name}</span>
                                <span className="text-xs text-muted-foreground">{criterion.weight}%</span>
                              </div>
                              <p className="text-xs text-muted-foreground">{criterion.description}</p>
                            </div>
                          ))}
                        </div>
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
                        <div className="space-y-4">
                          <div className="bg-emerald-400/10 border border-emerald-400/30 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <CheckCircle className="w-5 h-5 text-emerald-400" />
                              <span className="font-medium text-emerald-400">Previously Completed</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Best score: <span className="font-bold text-foreground">{challenge.score}/100</span>
                            </p>
                          </div>
                          
                          {challenge.criteriaScores && (
                            <div className="space-y-3">
                              <h4 className="text-sm font-medium text-foreground">Detailed Scores</h4>
                              {Object.entries(challenge.criteriaScores).map(([criterion, score]) => (
                                <ProgressBar
                                  key={criterion}
                                  label={criterion}
                                  value={score}
                                  max={10}
                                  className="text-xs"
                                />
                              ))}
                            </div>
                          )}
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
                    className="p-4 border-t border-border bg-muted/30 max-h-96 overflow-y-auto"
                  >
                    <div className="space-y-4">
                      {/* Overall Score */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-emerald-400" />
                          <span className="font-medium">Evaluation Complete</span>
                        </div>
                        <span className={cn(
                          "text-2xl font-heading font-bold",
                          feedback.overallScore >= 90 ? "text-emerald-400" : 
                          feedback.overallScore >= 80 ? "text-amber-400" : "text-foreground"
                        )}>
                          {feedback.overallScore}/100
                        </span>
                      </div>

                      {/* Criteria Scores */}
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium text-foreground">Detailed Evaluation</h4>
                        {Object.entries(feedback.criteriaScores).map(([criterion, score]) => (
                          <ProgressBar
                            key={criterion}
                            label={criterion}
                            value={score}
                            max={10}
                            className="text-xs"
                          />
                        ))}
                      </div>

                      {/* Feedback */}
                      <div>
                        <h4 className="text-sm font-medium text-foreground mb-2">Feedback</h4>
                        <p className="text-sm text-muted-foreground">{feedback.feedback}</p>
                      </div>

                      {/* Suggestions */}
                      {feedback.suggestions.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-foreground mb-2">Suggestions</h4>
                          <ul className="space-y-1">
                            {feedback.suggestions.map((suggestion, i) => (
                              <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                <span className="text-foreground mt-0.5">•</span> {suggestion}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-2 border-t border-border">
                        <p className="text-sm">
                          <Star className="w-4 h-4 inline mr-1 text-amber-400" />
                          Earned: <span className="font-bold">{Math.floor(challenge.points * feedback.overallScore / 100)}</span> points
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
                        Evaluating with AI...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        Evaluate with AI
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

// Challenges List View
function ChallengesListView({ 
  challenges, 
  onSelectChallenge,
  totalPoints,
  completedChallenges
}: { 
  challenges: Challenge[];
  onSelectChallenge: (c: Challenge) => void;
  totalPoints: number;
  completedChallenges: number;
}) {
  const stats = [
    { icon: Trophy, label: "Completed", value: completedChallenges.toString() },
    { icon: Star, label: "Points", value: totalPoints.toLocaleString() },
    { icon: Users, label: "Total Challenges", value: challenges.length.toString() },
    { icon: Flame, label: "Available", value: (challenges.length - completedChallenges).toString() },
  ];

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
            AI-Powered Evaluation
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
            Test your prompt engineering skills with AI-powered evaluation and detailed feedback.
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
                whileHover={{ scale: 1.01 }}
                onClick={() => onSelectChallenge(challenge)}
                className={cn(
                  "group p-5 bg-card/80 backdrop-blur-sm border border-border rounded-xl transition-all duration-300 cursor-pointer",
                  challenge.featured && "border-foreground/40 bg-foreground/5",
                  "hover:border-foreground/30"
                )}
              >
                <div className="flex items-start gap-4">
                  {/* Challenge Number/Status */}
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center font-heading font-bold text-lg shrink-0",
                    challenge.status === "completed" ? "bg-emerald-400/20 text-emerald-400" :
                    "bg-foreground/10 text-foreground"
                  )}>
                    {challenge.status === "completed" ? <CheckCircle className="w-5 h-5" /> : `#${challenge.id}`}
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
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all shrink-0 self-center" />
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
  const { isAuthenticated, user } = useAuth();
  const [challenges, setChallenges] = useState(challengesData);
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null);
  const [totalPoints, setTotalPoints] = useState(0);
  const [completedChallenges, setCompletedChallenges] = useState(0);
  
  // Fetch actual stats from Supabase
  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;
      
      try {
        const client = supabaseAdmin || supabase;
        if (!client) return;

        // Get total points
        const { data: pointsData } = await client
          .from('point_transactions')
          .select('points')
          .eq('user_id', user.id);

        const points = pointsData?.reduce((sum, t) => sum + t.points, 0) || 0;
        setTotalPoints(points);

        // Get completed challenges count
        const { data: challengeData } = await client
          .from('point_transactions')
          .select('title')
          .eq('user_id', user.id)
          .eq('source_type', 'challenge');

        setCompletedChallenges(challengeData?.length || 0);
      } catch (error) {
        console.error('Error fetching challenge stats:', error);
      }
    };

    if (user) {
      fetchStats();
    }
  }, [user]);

  const handleCompleteChallenge = async (id: number, score: number, criteriaScores: Record<string, number>, promptText: string) => {
    const challenge = challenges.find(c => c.id === id);
    if (!challenge || !user) {
      console.error('Challenge or user not found', { challenge, user });
      return;
    }

    // Calculate earned points based on score
    const earnedPoints = Math.floor(challenge.points * score / 100);

    console.log('Starting challenge completion sync:', {
      challengeId: id,
      challengeTitle: challenge.title,
      score,
      earnedPoints,
      userId: user.id,
      supabaseConfigured: isSupabaseConfigured()
    });

    // Update local state first for immediate UI feedback
    setChallenges(prev => prev.map(c => 
      c.id === id ? { ...c, status: "completed" as const, score, criteriaScores } : c
    ));

    // Sync with Supabase database
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured, skipping database sync');
      setActiveChallenge(null);
      return;
    }

    try {
      console.log('Attempting to add points to Supabase...');
      
      const result = await SupabaseService.addPoints({
        user_id: user.id,
        points: earnedPoints,
        transaction_type: 'earned',
        source_type: 'challenge',
        source_id: null,
        title: `Completed ${challenge.title}`,
        description: `Scored ${score}/100 on ${challenge.difficulty} challenge`,
        metadata: {
          challenge_local_id: id,
          challenge_title: challenge.title,
          difficulty: challenge.difficulty,
          score: score,
          criteria_scores: criteriaScores,
          prompt_text: promptText
        }
      });
      
      console.log('✅ Successfully synced challenge completion to Supabase:', {
        challengeTitle: challenge.title,
        earnedPoints,
        result
      });
    } catch (error: any) {
      console.error('❌ Error syncing challenge completion to Supabase:', {
        error,
        errorMessage: error?.message,
        errorDetails: error?.details,
        errorHint: error?.hint,
        errorCode: error?.code
      });
      // Even if Supabase sync fails, keep the local state updated
    }

    setActiveChallenge(null);
  };

  // Show auth prompt for unauthenticated users
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden">
        <Navbar />
        
        {/* Blurred Background Content - Only the main content, not navbar */}
        <div className="relative">
          <div className="blur-md pointer-events-none select-none">
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
                  AI-Powered Evaluation
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
                  Test your prompt engineering skills with AI-powered evaluation and detailed feedback.
                </motion.p>

                {/* Stats */}
                <motion.div 
                  className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  {[
                    { icon: Trophy, label: "Completed", value: completedChallenges.toString() },
                    { icon: Star, label: "Points", value: totalPoints.toLocaleString() },
                    { icon: Users, label: "Total Challenges", value: challenges.length.toString() },
                    { icon: Flame, label: "Available", value: (challenges.length - completedChallenges).toString() },
                  ].map((stat, i) => (
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
                      whileHover={{ scale: 1.01 }}
                      className={cn(
                        "group p-5 bg-card/80 backdrop-blur-sm border border-border rounded-xl transition-all duration-300 cursor-pointer",
                        challenge.featured && "border-foreground/40 bg-foreground/5",
                        "hover:border-foreground/30"
                      )}
                    >
                      <div className="flex items-start gap-4">
                        {/* Challenge Number/Status */}
                        <div className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center font-heading font-bold text-lg shrink-0",
                          challenge.status === "completed" ? "bg-emerald-400/20 text-emerald-400" :
                          "bg-foreground/10 text-foreground"
                        )}>
                          {challenge.status === "completed" ? <CheckCircle className="w-5 h-5" /> : `#${challenge.id}`}
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
                        <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all shrink-0 self-center" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </main>
          </div>
          
          {/* Enhanced Auth Prompt Overlay */}
          <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center z-50" style={{ top: '64px' }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="bg-card/95 backdrop-blur-md border border-border/50 rounded-3xl p-8 max-w-lg mx-4 text-center shadow-2xl"
            >
              {/* Animated Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5, type: "spring", bounce: 0.4 }}
                className="w-20 h-20 rounded-3xl bg-gradient-to-br from-foreground/20 to-foreground/10 flex items-center justify-center mx-auto mb-6 relative overflow-hidden"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/10 to-transparent"
                />
                <Trophy className="w-10 h-10 text-foreground relative z-10" />
              </motion.div>

              {/* Content */}
              <motion.h2 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl font-heading font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent"
              >
                Unlock Weekly Challenges
              </motion.h2>
              
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-muted-foreground mb-8 leading-relaxed text-lg"
              >
                Join thousands of developers mastering prompt engineering through hands-on challenges with AI-powered evaluation.
              </motion.p>

              {/* Features List */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="grid grid-cols-2 gap-4 mb-8 text-sm"
              >
                <div className="flex items-center gap-2 text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>AI Evaluation</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-blue-400" />
                  <span>Progress Tracking</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-purple-400" />
                  <span>Skill Building</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-amber-400" />
                  <span>Earn Points</span>
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="space-y-3"
              >
                <Button 
                  onClick={() => window.location.href = '/signup'}
                  className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-foreground to-foreground/90 hover:from-foreground/90 hover:to-foreground/80 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <Trophy className="w-5 h-5 mr-2" />
                  Start Your Journey
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => window.location.href = '/login'}
                  className="w-full h-12 border-2 border-foreground/20 hover:border-foreground/40 hover:bg-foreground/5 transition-all duration-300"
                >
                  Already have an account? Sign In
                </Button>
              </motion.div>

              {/* Footer */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-8 pt-6 border-t border-border/30"
              >
                <p className="text-xs text-muted-foreground/70">
                  Free to join • No credit card required • Start learning immediately
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
        
        <Footer />
      </div>
    );
  }

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

  // Show the challenges list
  return (
    <ChallengesListView 
      challenges={challenges}
      onSelectChallenge={setActiveChallenge}
      totalPoints={totalPoints}
      completedChallenges={completedChallenges}
    />
  );
};

export default Challenges;