import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Trophy, Clock, Star, Users, Flame, Medal, ChevronLeft, Send, CheckCircle, Lightbulb, Play, RotateCcw, Copy, Check } from "lucide-react";
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
  Easy: "text-emerald-400 border-emerald-400/30 bg-emerald-400/10",
  Medium: "text-amber-400 border-amber-400/30 bg-amber-400/10",
  Hard: "text-rose-400 border-rose-400/30 bg-rose-400/10",
  Expert: "text-foreground border-foreground/30 bg-foreground/10",
};

const difficultyDot: Record<string, string> = {
  Easy: "bg-emerald-400",
  Medium: "bg-amber-400",
  Hard: "bg-rose-400",
  Expert: "bg-foreground",
};

// Challenge List Component
function ChallengeList({ 
  challenges, 
  onSelect, 
  selectedId,
  totalPoints 
}: { 
  challenges: Challenge[]; 
  onSelect: (c: Challenge) => void;
  selectedId: number | null;
  totalPoints: number;
}) {
  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="font-heading font-bold text-lg">Challenges</h2>
        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Star className="w-4 h-4 text-amber-400" />
            {totalPoints.toLocaleString()} pts
          </span>
          <span className="flex items-center gap-1">
            <Flame className="w-4 h-4 text-rose-400" />
            7 day streak
          </span>
        </div>
      </div>

      {/* Challenge List */}
      <div className="flex-1 overflow-y-auto">
        {challenges.map((challenge) => (
          <button
            key={challenge.id}
            onClick={() => challenge.status !== "locked" && onSelect(challenge)}
            disabled={challenge.status === "locked"}
            className={cn(
              "w-full p-4 border-b border-border text-left transition-all hover:bg-muted/50",
              selectedId === challenge.id && "bg-muted/80 border-l-2 border-l-foreground",
              challenge.status === "locked" && "opacity-50 cursor-not-allowed"
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={cn("w-2 h-2 rounded-full", difficultyDot[challenge.difficulty])} />
                  <span className="text-xs text-muted-foreground">{challenge.difficulty}</span>
                  {challenge.status === "completed" && (
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  )}
                  {challenge.featured && (
                    <span className="text-xs px-1.5 py-0.5 rounded bg-foreground/10 text-foreground font-medium">Featured</span>
                  )}
                </div>
                <p className="font-medium text-sm truncate">{challenge.title}</p>
                <p className="text-xs text-muted-foreground mt-1 truncate">{challenge.description}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs text-amber-400 font-medium">{challenge.points} pts</p>
                <p className="text-xs text-muted-foreground">{challenge.time}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// Challenge Workspace Component
function ChallengeWorkspace({ 
  challenge, 
  onBack,
  onComplete 
}: { 
  challenge: Challenge | null;
  onBack: () => void;
  onComplete: (id: number, score: number) => void;
}) {
  const [prompt, setPrompt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ score: number; message: string } | null>(null);
  const [activeTab, setActiveTab] = useState<"description" | "hints" | "submissions">("description");
  const [copied, setCopied] = useState(false);

  const handleSubmit = () => {
    if (!prompt.trim() || !challenge) return;
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
    if (feedback && challenge) {
      onComplete(challenge.id, feedback.score);
      setFeedback(null);
      setPrompt("");
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

  if (!challenge) {
    return (
      <div className="h-full flex items-center justify-center bg-background text-muted-foreground">
        <div className="text-center">
          <Trophy className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium">Select a challenge to begin</p>
          <p className="text-sm mt-1">Choose from the list on the left</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-background">
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        {/* Left Panel - Problem Description */}
        <ResizablePanel defaultSize={45} minSize={30}>
          <div className="h-full flex flex-col border-r border-border">
            {/* Problem Header */}
            <div className="p-4 border-b border-border">
              <button 
                onClick={onBack}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-3 md:hidden"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <div className="flex items-center gap-2 mb-2">
                <span className={cn("px-2 py-0.5 rounded text-xs font-medium", difficultyColors[challenge.difficulty])}>
                  {challenge.difficulty}
                </span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {challenge.time}
                </span>
                <span className="text-xs text-amber-400 flex items-center gap-1">
                  <Star className="w-3 h-3" /> {challenge.points} pts
                </span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Users className="w-3 h-3" /> {challenge.participants.toLocaleString()}
                </span>
              </div>
              <h1 className="text-xl font-heading font-bold">{challenge.title}</h1>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-border">
              {(["description", "hints", "submissions"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "px-4 py-2 text-sm font-medium capitalize transition-colors",
                    activeTab === tab 
                      ? "text-foreground border-b-2 border-foreground" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-4">
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
                      <h3 className="text-sm font-medium mb-2">Description</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{challenge.fullDescription}</p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium mb-2">Examples</h3>
                      <div className="space-y-3">
                        {challenge.examples.map((ex, i) => (
                          <div key={i} className="bg-muted/30 rounded-lg p-3 text-sm border border-border">
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
                      <h3 className="text-sm font-medium mb-2">Constraints</h3>
                      <ul className="space-y-1">
                        {challenge.constraints.map((c, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="text-foreground mt-1">•</span> {c}
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
                    className="space-y-3"
                  >
                    <p className="text-sm text-muted-foreground mb-4">
                      Use hints sparingly - they may reduce your final score!
                    </p>
                    {challenge.hints.map((hint, i) => (
                      <div key={i} className="flex items-start gap-3 bg-muted/30 rounded-lg p-3 border border-border">
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
                          <span className="font-medium text-emerald-400">Completed</span>
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
            <div className="flex items-center justify-between p-3 border-b border-border bg-muted/30">
              <span className="text-sm font-medium">Prompt Editor</span>
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleCopy}
                  disabled={!prompt}
                  className="h-8"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleReset}
                  disabled={!prompt && !feedback}
                  className="h-8"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Editor Area */}
            <div className="flex-1 p-4">
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
                  <p className="text-sm text-muted-foreground mb-3">{feedback.message}</p>
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
                        Complete & Continue
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
  );
}

const Challenges = () => {
  const [challenges, setChallenges] = useState(challengesData);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [totalPoints, setTotalPoints] = useState(2450);
  const [showMobileList, setShowMobileList] = useState(true);

  const handleSelectChallenge = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setShowMobileList(false);
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
    <div className="h-screen flex flex-col bg-background">
      <Navbar />
      
      {/* Main Content - Full Height Below Navbar */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop: Side-by-side layout */}
        <div className="hidden md:flex flex-1">
          {/* Challenge List Sidebar */}
          <div className="w-80 border-r border-border shrink-0">
            <ChallengeList 
              challenges={challenges} 
              onSelect={handleSelectChallenge}
              selectedId={selectedChallenge?.id || null}
              totalPoints={totalPoints}
            />
          </div>
          
          {/* Workspace */}
          <div className="flex-1">
            <ChallengeWorkspace 
              challenge={selectedChallenge}
              onBack={() => setSelectedChallenge(null)}
              onComplete={handleCompleteChallenge}
            />
          </div>
        </div>

        {/* Mobile: Toggle between list and workspace */}
        <div className="flex md:hidden flex-1">
          <AnimatePresence mode="wait">
            {showMobileList ? (
              <motion.div 
                key="list"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="w-full"
              >
                <ChallengeList 
                  challenges={challenges} 
                  onSelect={handleSelectChallenge}
                  selectedId={selectedChallenge?.id || null}
                  totalPoints={totalPoints}
                />
              </motion.div>
            ) : (
              <motion.div 
                key="workspace"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 20, opacity: 0 }}
                className="w-full"
              >
                <ChallengeWorkspace 
                  challenge={selectedChallenge}
                  onBack={() => setShowMobileList(true)}
                  onComplete={handleCompleteChallenge}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Challenges;
