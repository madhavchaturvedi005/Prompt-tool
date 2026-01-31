import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useState, useEffect } from "react";
import { 
  Play, 
  Sparkles, 
  Copy, 
  Check, 
  Zap, 
  Target, 
  Brain,
  Clock,
  Trophy,
  RotateCcw,
  Loader2,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { generateChallenge, executeUserPrompt, gradeResult } from "@/lib/practiceGenerator";
import type { GeneratedChallenge, GradingResult } from "@/lib/practiceGenerator";

const FloatingPaths = ({ position }: { position: number }) => {
  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${380 - i * 5 * position} -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${152 - i * 5 * position} ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${684 - i * 5 * position} ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
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
};

const difficultyColors = {
  Easy: "bg-emerald-500/20 text-emerald-400 border-emerald-400/30",
  Medium: "bg-amber-500/20 text-amber-400 border-amber-400/30",
  Hard: "bg-rose-500/20 text-rose-400 border-rose-400/30",
};

const PracticeNew = () => {
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Easy');
  const [challenge, setChallenge] = useState<GeneratedChallenge | null>(null);
  const [userPrompt, setUserPrompt] = useState("");
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [isActive, setIsActive] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<GradingResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0 && !result) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            // Time's up - trigger submission
            setIsActive(false);
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, result]);

  // Separate effect to handle timeout submission
  useEffect(() => {
    if (timeLeft === 0 && isActive && !result && !isSubmitting) {
      handleSubmit();
    }
  }, [timeLeft, isActive, result, isSubmitting]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartChallenge = async () => {
    setIsGenerating(true);
    setError(null);
    setResult(null);
    setUserPrompt("");

    try {
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
      if (!apiKey) {
        throw new Error("OpenAI API key not configured");
      }

      const newChallenge = await generateChallenge(difficulty, apiKey);
      setChallenge(newChallenge);
      setTimeLeft(300); // Reset timer
      setIsActive(true);
    } catch (err) {
      console.error('Error generating challenge:', err);
      setError('Failed to generate challenge. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async () => {
    if (!challenge) return;
    
    // If prompt is blank, return zero score immediately
    if (!userPrompt.trim()) {
      setIsActive(false);
      setResult({
        score: 0,
        feedback: "No prompt submitted. You must write a prompt to receive a score.",
        passed: false,
        workerOutput: "No output - prompt was empty",
        improvements: [
          "Write a clear system prompt that defines the AI's role and task",
          "Include specific instructions about what the AI should do",
          "Add constraints or formatting requirements to guide the output",
          "Consider using examples to clarify your expectations"
        ],
        strengths: []
      });
      return;
    }

    setIsSubmitting(true);
    setIsActive(false);
    setError(null);

    try {
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
      if (!apiKey) {
        throw new Error("OpenAI API key not configured");
      }

      // Step 1: Execute user's prompt with hidden test input
      const workerOutput = await executeUserPrompt(
        userPrompt,
        challenge.hidden_test_input,
        apiKey
      );

      // Step 2: Grade the result
      const gradingResult = await gradeResult(
        challenge.task,
        challenge.constraints,
        challenge.success_criteria,
        workerOutput,
        apiKey
      );

      setResult(gradingResult);
    } catch (err) {
      console.error('Error submitting:', err);
      setError('Failed to evaluate your prompt. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setChallenge(null);
    setUserPrompt("");
    setTimeLeft(300);
    setIsActive(false);
    setResult(null);
    setError(null);
  };

  const handleCopy = () => {
    if (result?.workerOutput) {
      navigator.clipboard.writeText(result.workerOutput);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[40vh] flex items-center justify-center overflow-hidden border-b border-border/50">
        <FloatingPaths position={1} />
        
        <div className="container mx-auto px-4 py-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-4 leading-tight">
              Practice Arena
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-6 leading-relaxed max-w-2xl mx-auto">
              Test your prompt engineering skills with AI-generated challenges
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            
            {/* No Challenge - Difficulty Selection */}
            {!challenge && !isGenerating && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <h2 className="text-2xl font-semibold mb-4">Choose Your Difficulty</h2>
                  <p className="text-muted-foreground mb-8">
                    Select a difficulty level to generate a unique challenge
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(['Easy', 'Medium', 'Hard'] as const).map((level) => (
                    <button
                      key={level}
                      onClick={() => setDifficulty(level)}
                      className={`p-6 rounded-2xl border-2 transition-all ${
                        difficulty === level
                          ? difficultyColors[level] + ' border-2'
                          : 'bg-card/60 border-border/50 hover:border-foreground/30'
                      }`}
                    >
                      <div className="text-center">
                        <h3 className="text-xl font-semibold mb-2">{level}</h3>
                        <p className="text-sm text-muted-foreground">
                          {level === 'Easy' && 'Simple persona & formatting'}
                          {level === 'Medium' && 'Logic & tone constraints'}
                          {level === 'Hard' && 'Complex reasoning & rules'}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="text-center">
                  <Button
                    onClick={handleStartChallenge}
                    size="lg"
                    className="bg-foreground hover:bg-foreground/90 text-background"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Start Challenge
                  </Button>
                </div>

                {error && (
                  <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-rose-400">{error}</p>
                  </div>
                )}
              </motion.div>
            )}

            {/* Generating Challenge */}
            {isGenerating && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-foreground" />
                <h3 className="text-xl font-semibold mb-2">Generating Your Challenge...</h3>
                <p className="text-muted-foreground">Creating a unique {difficulty} challenge</p>
              </motion.div>
            )}

            {/* Active Challenge */}
            {challenge && !result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Challenge Header */}
                <div className="bg-card/60 backdrop-blur-sm rounded-2xl border border-border/50 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${difficultyColors[challenge.difficulty]}`}>
                          {challenge.difficulty}
                        </span>
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-foreground/10">
                          {challenge.category}
                        </span>
                      </div>
                      <h2 className="text-2xl font-semibold mb-2">{challenge.title}</h2>
                      <p className="text-muted-foreground">{challenge.scenario}</p>
                    </div>
                    <div className={`flex items-center gap-2 ${timeLeft <= 60 ? 'text-rose-400 animate-pulse' : 'text-foreground'}`}>
                      <Clock className="w-5 h-5" />
                      <span className="text-2xl font-mono font-bold">{formatTime(timeLeft)}</span>
                    </div>
                  </div>

                  <div className="space-y-4 mt-6">
                    <div>
                      <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        Your Task
                      </h3>
                      <p className="text-sm text-muted-foreground bg-muted/30 rounded-lg p-3">
                        {challenge.task}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                        <Zap className="w-4 h-4" />
                        Constraints
                      </h3>
                      <ul className="space-y-2">
                        {challenge.constraints.map((constraint, index) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="text-foreground mt-0.5">•</span>
                            {constraint}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Prompt Editor */}
                <div className="bg-card/60 backdrop-blur-sm rounded-2xl border border-border/50 p-6">
                  <h3 className="text-lg font-semibold mb-4">Write Your Prompt</h3>
                  <textarea
                    value={userPrompt}
                    onChange={(e) => setUserPrompt(e.target.value)}
                    placeholder="Write your prompt here...

Think about:
• How to achieve the task
• How to satisfy all constraints
• What role or persona to use
• How to structure the output"
                    className="w-full h-64 p-4 rounded-xl bg-muted/30 border border-border/50 focus:border-foreground/50 focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all resize-none text-sm font-mono"
                    disabled={isSubmitting}
                  />

                  <div className="flex items-center justify-between mt-4">
                    <span className="text-sm text-muted-foreground">
                      {userPrompt.length} characters
                    </span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={handleReset}
                        disabled={isSubmitting}
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Reset
                      </Button>
                      <Button
                        onClick={handleSubmit}
                        disabled={!userPrompt.trim() || isSubmitting}
                        className="bg-foreground hover:bg-foreground/90 text-background"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Evaluating...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 mr-2" />
                            Submit & Grade
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-rose-400">{error}</p>
                  </div>
                )}
              </motion.div>
            )}

            {/* Results */}
            {result && challenge && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Score Card */}
                <div className={`rounded-2xl border-2 p-8 text-center ${
                  result.score === 0
                    ? 'bg-muted/20 border-muted'
                    : result.passed 
                      ? 'bg-emerald-500/10 border-emerald-500/30' 
                      : 'bg-rose-500/10 border-rose-500/30'
                }`}>
                  <Trophy className={`w-16 h-16 mx-auto mb-4 ${
                    result.score === 0
                      ? 'text-muted-foreground'
                      : result.passed 
                        ? 'text-emerald-400' 
                        : 'text-rose-400'
                  }`} />
                  <h2 className="text-4xl font-bold mb-2">{result.score}/100</h2>
                  <p className={`text-lg font-semibold mb-4 ${
                    result.score === 0
                      ? 'text-muted-foreground'
                      : result.passed 
                        ? 'text-emerald-400' 
                        : 'text-rose-400'
                  }`}>
                    {result.score === 0 ? '⏱️ Time\'s Up!' : result.passed ? '✓ Passed!' : '✗ Failed'}
                  </p>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    {result.feedback}
                  </p>
                </div>

                {/* Strengths & Improvements */}
                {((result.strengths && result.strengths.length > 0) || (result.improvements && result.improvements.length > 0)) && (
                  <div className={`grid gap-6 ${
                    result.strengths && result.strengths.length > 0 && result.improvements && result.improvements.length > 0
                      ? 'md:grid-cols-2'
                      : 'md:grid-cols-1 max-w-2xl mx-auto'
                  }`}>
                    {/* Strengths */}
                    {result.strengths && result.strengths.length > 0 && (
                      <div className="bg-emerald-500/10 backdrop-blur-sm rounded-2xl border border-emerald-500/30 p-6">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-emerald-400">
                          <CheckCircle className="w-5 h-5" />
                          What You Did Well
                        </h3>
                        <ul className="space-y-3">
                          {result.strengths.map((strength, index) => (
                            <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                              <span className="text-emerald-400 mt-0.5">✓</span>
                              <span>{strength}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Improvements */}
                    {result.improvements && result.improvements.length > 0 && (
                      <div className="bg-amber-500/10 backdrop-blur-sm rounded-2xl border border-amber-500/30 p-6">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-amber-400">
                          <Target className="w-5 h-5" />
                          How to Improve Your Prompt
                        </h3>
                        <ul className="space-y-3">
                          {result.improvements.map((improvement, index) => (
                            <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                              <span className="text-amber-400 mt-0.5 font-bold">→</span>
                              <span>{improvement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Challenge Details */}
                <div className="bg-card/60 backdrop-blur-sm rounded-2xl border border-border/50 p-6">
                  <h3 className="text-lg font-semibold mb-4">Challenge Details</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="font-medium text-foreground">Task:</span>
                      <p className="text-muted-foreground mt-1">{challenge.task}</p>
                    </div>
                    <div>
                      <span className="font-medium text-foreground">Constraints:</span>
                      <ul className="mt-1 space-y-1">
                        {challenge.constraints.map((c, i) => (
                          <li key={i} className="text-muted-foreground">• {c}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <span className="font-medium text-foreground">Test Input:</span>
                      <p className="text-muted-foreground mt-1 bg-muted/30 rounded p-2 font-mono text-xs">
                        {challenge.hidden_test_input}
                      </p>
                    </div>
                  </div>
                </div>

                {/* AI Output */}
                {result.workerOutput && (
                  <div className="bg-card/60 backdrop-blur-sm rounded-2xl border border-border/50 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">AI Output</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCopy}
                      >
                        {copied ? (
                          <>
                            <Check className="w-4 h-4 mr-2" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 mr-2" />
                            Copy
                          </>
                        )}
                      </Button>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-4 text-sm text-muted-foreground whitespace-pre-wrap font-mono">
                      {result.workerOutput}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-center gap-4">
                  <Button
                    variant="outline"
                    onClick={handleReset}
                    size="lg"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Try Another Challenge
                  </Button>
                  {!result.passed && (
                    <Button
                      onClick={() => {
                        setResult(null);
                        setIsActive(true);
                        setTimeLeft(300);
                      }}
                      size="lg"
                      className="bg-foreground hover:bg-foreground/90 text-background"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Try Again
                    </Button>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PracticeNew;
