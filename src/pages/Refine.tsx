import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Sparkles, Copy, Check, RefreshCw, Wand2, ArrowRight, Zap, Target, FileText, Code, Lightbulb, BookOpen, Briefcase } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const FloatingPaths = ({ position }: { position: number }) => {
  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${380 - i * 5 * position} -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${152 - i * 5 * position} ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${684 - i * 5 * position} ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    width: 0.5 + i * 0.03,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <svg className="w-full h-full" viewBox="0 0 696 316" fill="none">
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="white"
            strokeWidth={path.width}
            strokeOpacity={0.1 + path.id * 0.02}
            initial={{ pathLength: 0.3, opacity: 0.6 }}
            animate={{
              pathLength: 1,
              opacity: [0.2, 0.4, 0.2],
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

const promptTemplates = [
  {
    id: "primer",
    name: "Primer",
    description: "Quick and simple prompts",
    icon: Sparkles,
  },
  {
    id: "mastermind",
    name: "Mastermind",
    description: "Professional and well-organized",
    icon: Target,
  },
  {
    id: "amplifier",
    name: "AI Amplifier",
    description: "Detailed step-by-step help",
    icon: Zap,
    isPro: true,
  },
  {
    id: "json",
    name: "JSON",
    description: "Structured output for developers",
    icon: Code,
    isPro: true,
  },
];

const quickPrompts = [
  "Explain a concept like I'm 10...",
  "Create a study plan for...",
  "Summarize my notes on...",
  "Outline an essay about...",
  "Generate practice questions for...",
  "Help me understand the topic of...",
  "Check my understanding of...",
  "Make flashcards for...",
  "Formulate a thesis statement for...",
];

const SYSTEM_PROMPT = `You are Promptie Prompt Optimization Engine v1.

Your mission is to transform a user's raw, vague, or informal prompt into a highly optimized, expert-level prompt that maximizes AI output quality, reasoning depth, accuracy, and usefulness across all LLMs (GPT, Claude, Gemini, etc.).

Core Objectives:
- Maximize clarity, precision, and task success.
- Preserve the original user intent without distortion.
- Add missing context, constraints, and structure.
- Make the prompt model-agnostic and enterprise-grade.

Optimization Process:
1. Understand the user's goal, intent, and expected output.
2. Infer hidden requirements and context when necessary.
3. Rewrite the prompt with:
   - A clear expert role or persona when helpful.
   - Explicit task instructions and objectives.
   - Constraints (tone, length, style, format, audience).
   - Output structure (steps, bullets, JSON, tables, code, etc.).
4. Remove ambiguity and vague language.
5. Add reasoning or verification instructions for complex tasks.
6. Keep the optimized prompt concise but powerful.
7. Do NOT change the user's original meaning.
8. Do NOT explain the changes unless explicitly requested.

Output Rules:
- Return ONLY the optimized prompt.
- Do NOT add extra commentary, markdown, or explanations.`;

const Refine = () => {
  const [userPrompt, setUserPrompt] = useState("");
  const [optimizedPrompt, setOptimizedPrompt] = useState("");
  const [isRefining, setIsRefining] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("primer");
  const [showTemplates, setShowTemplates] = useState(false);

  const handleRefine = async () => {
    if (!userPrompt.trim()) return;

    setIsRefining(true);
    setOptimizedPrompt("");

    try {
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
      
      if (!apiKey) {
        throw new Error("OpenAI API key not configured");
      }

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: SYSTEM_PROMPT,
            },
            {
              role: "user",
              content: `User Prompt:\n${userPrompt}`,
            },
          ],
          temperature: 0.7,
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to refine prompt");
      }

      const data = await response.json();
      const refined = data.choices[0].message.content;
      setOptimizedPrompt(refined);
    } catch (error) {
      console.error("Refine error:", error);
      setOptimizedPrompt("Error: Failed to refine prompt. Please check your API key and try again.");
    } finally {
      setIsRefining(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(optimizedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleQuickPrompt = (prompt: string) => {
    setUserPrompt(prompt);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
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
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-foreground/10 mb-6"
            >
              <Wand2 className="w-8 h-8 text-foreground" />
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-4 leading-tight">
              Refine Your Prompts
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-6 leading-relaxed max-w-2xl mx-auto">
              Transform simple ideas into powerful AI prompts with intelligent optimization
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="flex-1 py-8">
        <div className="container mx-auto px-4 h-full">
          <div className="grid lg:grid-cols-[300px_1fr] gap-6 h-full">
            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              {/* Templates */}
              <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-4">
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Prompt Templates
                </h3>
                <div className="space-y-2">
                  {promptTemplates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => setSelectedTemplate(template.id)}
                      className={`w-full p-3 rounded-xl text-left transition-all ${
                        selectedTemplate === template.id
                          ? "bg-foreground text-background"
                          : "bg-muted/30 hover:bg-muted/50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <template.icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{template.name}</span>
                            {template.isPro && (
                              <span className="text-xs px-1.5 py-0.5 rounded bg-orange-500 text-white">
                                PRO
                              </span>
                            )}
                          </div>
                          <p className="text-xs opacity-70 mt-0.5">{template.description}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Prompts */}
              <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-4">
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" />
                  Quick Start
                </h3>
                <div className="space-y-1.5">
                  {quickPrompts.slice(0, 6).map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickPrompt(prompt)}
                      className="w-full p-2 rounded-lg text-left text-xs text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-all"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Main Area */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              {/* Input Area */}
              <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Your Prompt
                  </h2>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowTemplates(!showTemplates)}
                      className="text-xs"
                    >
                      <span className="px-2 py-1 rounded-md bg-foreground/10">
                        {selectedTemplate}
                      </span>
                    </Button>
                  </div>
                </div>

                <textarea
                  value={userPrompt}
                  onChange={(e) => setUserPrompt(e.target.value)}
                  placeholder="Type your prompt here or select a quick start template..."
                  className="w-full h-[200px] p-4 rounded-xl bg-muted/30 border border-border/50 focus:border-foreground/50 focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all resize-none text-sm"
                />

                <div className="flex items-center justify-between mt-4">
                  <span className="text-xs text-muted-foreground">
                    {userPrompt.length} characters
                  </span>
                  <Button
                    onClick={handleRefine}
                    disabled={!userPrompt.trim() || isRefining}
                    className="bg-foreground hover:bg-foreground/90 text-background"
                  >
                    {isRefining ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 border-2 border-background border-t-transparent rounded-full mr-2"
                        />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-4 h-4 mr-2" />
                        Generate Prompt
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Output Area */}
              <AnimatePresence mode="wait">
                {(optimizedPrompt || isRefining) && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold flex items-center gap-2">
                        <Sparkles className="w-5 h-5" />
                        Optimized Prompt
                      </h2>
                      {optimizedPrompt && !isRefining && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleCopy}
                        >
                          {copied ? (
                            <>
                              <Check className="w-4 h-4 mr-2" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4 mr-2" />
                              Copy
                            </>
                          )}
                        </Button>
                      )}
                    </div>

                    <div className="min-h-[200px] p-4 rounded-xl bg-muted/30 border border-border/50">
                      {isRefining ? (
                        <div className="flex flex-col items-center justify-center h-[200px]">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="w-10 h-10 border-4 border-foreground/20 border-t-foreground rounded-full mb-4"
                          />
                          <p className="text-sm text-muted-foreground">Optimizing your prompt...</p>
                        </div>
                      ) : (
                        <div className="text-sm whitespace-pre-wrap leading-relaxed">
                          {optimizedPrompt}
                        </div>
                      )}
                    </div>

                    {optimizedPrompt && !isRefining && (
                      <div className="flex items-center justify-between mt-4">
                        <span className="text-xs text-muted-foreground">
                          {optimizedPrompt.length} characters
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleRefine}
                        >
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Regenerate
                        </Button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Quick Prompts Grid (Bottom) */}
              {!optimizedPrompt && !isRefining && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="grid grid-cols-2 md:grid-cols-3 gap-3"
                >
                  {quickPrompts.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickPrompt(prompt)}
                      className="p-3 rounded-xl bg-muted/30 border border-border/50 hover:border-foreground/30 hover:bg-muted/50 transition-all text-left text-xs"
                    >
                      {prompt}
                    </button>
                  ))}
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Refine;
