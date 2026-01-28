import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ArenaProgressBar } from "@/components/ui/arena-progress-bar";
import { useState } from "react";
import { 
  Send, 
  Sparkles, 
  RotateCcw, 
  Copy, 
  Check, 
  Zap, 
  Shield, 
  Target, 
  Layers,
  Brain,
  Lock,
  Bug,
  TestTube,
  Eye,
  Puzzle,
  Lightbulb,
  TrendingUp,
  Anchor,
  Rocket,
  Wrench,
  RefreshCw,
  Link,
  Repeat,
  Wifi
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { evaluatePromptInArena, ARENA_CRITERIA } from "@/lib/arenaEvaluator";
import type { ArenaEvaluationResult } from "@/lib/arenaEvaluator";

const examplePrompts = [
  "You are a professional email assistant. Help users write clear, concise emails by transforming bullet points into well-structured messages with appropriate tone and formatting.",
  "Act as a code reviewer. Analyze the provided code for bugs, security issues, and optimization opportunities. Provide specific suggestions with examples.",
  "You are a creative writing mentor. Guide users in developing compelling stories by providing feedback on plot, character development, and narrative structure.",
  "Serve as a data analyst. Examine datasets and provide actionable insights with statistical analysis, trend identification, and business recommendations."
];

// Icon mapping for each criterion
const criterionIcons: Record<string, React.ReactNode> = {
  Quality: <Target className="w-5 h-5" />,
  Accuracy: <Sparkles className="w-5 h-5" />,
  Maintainability: <Wrench className="w-5 h-5" />,
  Reliability: <Anchor className="w-5 h-5" />,
  Security: <Shield className="w-5 h-5" />,
  Vulnerabilities: <Bug className="w-5 h-5" />,
  Testability: <TestTube className="w-5 h-5" />,
  Understandability: <Eye className="w-5 h-5" />,
  Modularity: <Layers className="w-5 h-5" />,
  Explainability: <Lightbulb className="w-5 h-5" />,
  Scalability: <TrendingUp className="w-5 h-5" />,
  Stability: <Anchor className="w-5 h-5" />,
  Productivity: <Rocket className="w-5 h-5" />,
  Extensibility: <Puzzle className="w-5 h-5" />,
  Changeability: <RefreshCw className="w-5 h-5" />,
  Compatibility: <Link className="w-5 h-5" />,
  Reusability: <Repeat className="w-5 h-5" />,
  Availability: <Wifi className="w-5 h-5" />
};

// Color mapping for visual variety - REMOVED, using default color only
// const criterionColors: Record<string, "blue" | "purple" | "teal" | "red" | "green" | "amber"> = {

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

const Practice = () => {
  const [prompt, setPrompt] = useState("");
  const [evaluation, setEvaluation] = useState<ArenaEvaluationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    
    try {
      const result = await evaluatePromptInArena(prompt);
      setEvaluation(result);
    } catch (error) {
      console.error('Evaluation failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (evaluation) {
      const reportText = `Prompt Arena Evaluation Report

Overall Score: ${evaluation.overallScore}/100

Detailed Scores:
${Object.entries(evaluation.criteriaScores).map(([criterion, score]) => 
  `${criterion}: ${score}/100`
).join('\n')}

Feedback: ${evaluation.feedback}

Strengths:
${evaluation.strengths.map(s => `• ${s}`).join('\n')}

Areas for Improvement:
${evaluation.weaknesses.map(w => `• ${w}`).join('\n')}

Suggestions:
${evaluation.suggestions.map(s => `• ${s}`).join('\n')}`;

      navigator.clipboard.writeText(reportText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleReset = () => {
    setPrompt("");
    setEvaluation(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-[40vh] flex items-center justify-center overflow-hidden pt-20">
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
            AI-Powered Analysis
          </motion.span>
          
          <motion.h1 
            className="text-4xl md:text-6xl font-heading font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Prompt <span className="text-foreground">Arena</span>
          </motion.h1>
          
          <motion.div 
            className="h-px w-48 mx-auto mb-6 bg-gradient-to-r from-transparent via-foreground/30 to-transparent"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          />
          
          <motion.p 
            className="text-muted-foreground max-w-xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Comprehensive prompt evaluation with intelligent criteria selection based on prompt type and purpose.
          </motion.p>
        </div>
      </section>

      {/* Practice Area */}
      <main className="py-12 relative z-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Left Panel - Input */}
              <div className="space-y-6">
                {/* Prompt Input */}
                <motion.div 
                  className="bg-card/80 backdrop-blur-sm border border-border rounded-xl p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <label className="block text-sm font-medium mb-3 text-muted-foreground">
                    Your Prompt
                  </label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Write your prompt here for intelligent evaluation based on its type and purpose..."
                    className="w-full h-48 bg-muted/30 rounded-lg p-4 text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-1 focus:ring-foreground/30 transition-all border border-transparent focus:border-foreground/20"
                  />
                  <div className="flex items-center justify-between mt-4">
                    <div className="text-xs text-muted-foreground">
                      {prompt.length} characters
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleReset}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <RotateCcw className="w-4 h-4 mr-1" />
                        Reset
                      </Button>
                      <Button
                        onClick={handleSubmit}
                        disabled={!prompt.trim() || isLoading}
                        className="rounded-full"
                      >
                        {isLoading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <Brain className="w-4 h-4 mr-2" />
                            Evaluate
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </motion.div>

                {/* Example Prompts */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <p className="text-sm text-muted-foreground mb-3 flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Professional examples:
                  </p>
                  <div className="space-y-2">
                    {examplePrompts.map((example, i) => (
                      <motion.button
                        key={i}
                        onClick={() => setPrompt(example)}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        className="w-full p-3 text-left rounded-lg text-xs bg-card border border-border hover:border-foreground/30 text-muted-foreground hover:text-foreground transition-all"
                      >
                        {example}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Right Panel - Results */}
              <div className="space-y-6">
                <AnimatePresence mode="wait">
                  {evaluation ? (
                    <motion.div
                      key="results"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      {/* Overall Score */}
                      <div className="bg-card/80 backdrop-blur-sm border border-foreground/20 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-foreground" />
                            <span className="font-heading font-medium">Arena Evaluation</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleCopy}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            {copied ? (
                              <>
                                <Check className="w-4 h-4 mr-1 text-emerald-400" />
                                Copied
                              </>
                            ) : (
                              <>
                                <Copy className="w-4 h-4 mr-1" />
                                Export
                              </>
                            )}
                          </Button>
                        </div>
                        
                        <div className="text-center mb-6">
                          <div className="text-4xl font-heading font-bold text-foreground mb-2">
                            {evaluation.overallScore}/100
                          </div>
                          <div className="text-sm text-muted-foreground mb-1">
                            Overall Quality Score
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Prompt Type: <span className="capitalize font-medium">{evaluation.promptType}</span>
                          </div>
                        </div>

                        {/* Quality Dimensions - Only show applicable criteria */}
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                          {evaluation.applicableCriteria.map((criterionName) => (
                            <ArenaProgressBar
                              key={criterionName}
                              label={criterionName}
                              value={evaluation.criteriaScores[criterionName] || 0}
                              max={100}
                              icon={criterionIcons[criterionName]}
                            />
                          ))}
                        </div>
                        
                        {/* Show count of evaluated criteria */}
                        <div className="mt-4 pt-4 border-t border-border">
                          <p className="text-xs text-muted-foreground text-center">
                            Evaluated {evaluation.applicableCriteria.length} relevant criteria out of {ARENA_CRITERIA.length} total
                          </p>
                        </div>
                      </div>

                      {/* Detailed Feedback */}
                      <div className="bg-card/80 backdrop-blur-sm border border-border rounded-xl p-6">
                        <h3 className="font-heading font-medium mb-4 flex items-center gap-2">
                          <Lightbulb className="w-5 h-5" />
                          Detailed Analysis
                        </h3>
                        
                        <div className="space-y-4">
                          {/* Feedback */}
                          <div>
                            <h4 className="text-sm font-medium text-foreground mb-2">Overall Feedback</h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {evaluation.feedback}
                            </p>
                          </div>

                          {/* Strengths */}
                          {evaluation.strengths.length > 0 && (
                            <div>
                              <h4 className="text-sm font-medium text-emerald-400 mb-2">Strengths</h4>
                              <ul className="space-y-1">
                                {evaluation.strengths.map((strength, i) => (
                                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                    <Check className="w-3 h-3 text-emerald-400 mt-0.5 shrink-0" />
                                    {strength}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Weaknesses */}
                          {evaluation.weaknesses.length > 0 && (
                            <div>
                              <h4 className="text-sm font-medium text-amber-400 mb-2">Areas for Improvement</h4>
                              <ul className="space-y-1">
                                {evaluation.weaknesses.map((weakness, i) => (
                                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                    <Target className="w-3 h-3 text-amber-400 mt-0.5 shrink-0" />
                                    {weakness}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Suggestions */}
                          {evaluation.suggestions.length > 0 && (
                            <div>
                              <h4 className="text-sm font-medium text-blue-400 mb-2">Improvement Suggestions</h4>
                              <ul className="space-y-1">
                                {evaluation.suggestions.map((suggestion, i) => (
                                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                    <Lightbulb className="w-3 h-3 text-blue-400 mt-0.5 shrink-0" />
                                    {suggestion}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="placeholder"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="bg-card/40 backdrop-blur-sm border border-dashed border-border rounded-xl p-12 text-center"
                    >
                      <Brain className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                      <h3 className="font-heading font-medium text-muted-foreground mb-2">
                        Ready for Analysis
                      </h3>
                      <p className="text-sm text-muted-foreground/70">
                        Enter your prompt and click "Evaluate" to get intelligent feedback on relevant quality dimensions.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Practice;