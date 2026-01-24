import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useState } from "react";
import { Send, Sparkles, RotateCcw, Copy, Check, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const examplePrompts = [
  "Write a professional email declining a meeting",
  "Explain quantum computing to a 10-year-old",
  "Create a Python bubble sort with comments",
  "Generate a story about a time traveler",
];

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
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    setTimeout(() => {
      setResponse(`This is a simulated AI response to your prompt: "${prompt}"\n\nIn a real implementation, this would provide:\n\n• Clarity score\n• Specificity analysis\n• Suggestions for improvement\n• Alternative phrasings`);
      setIsLoading(false);
    }, 1500);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
            Practice
          </motion.span>
          
          <motion.h1 
            className="text-4xl md:text-6xl font-heading font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            The Practice <span className="text-foreground">Arena</span>
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
            Refine your craft with instant AI feedback and elevate your prompting skills.
          </motion.p>
        </div>
      </section>

      {/* Practice Area */}
      <main className="py-12 relative z-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Prompt Input */}
            <motion.div 
              className="bg-card/80 backdrop-blur-sm border border-border rounded-xl p-6 mb-6"
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
                placeholder="Write your prompt here..."
                className="w-full h-32 bg-muted/30 rounded-lg p-4 text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-1 focus:ring-foreground/30 transition-all border border-transparent focus:border-foreground/20"
              />
              <div className="flex items-center justify-between mt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPrompt("")}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <RotateCcw className="w-4 h-4 mr-1" />
                  Clear
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!prompt.trim() || isLoading}
                  className="rounded-full"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Analyze
                    </>
                  )}
                </Button>
              </div>
            </motion.div>

            {/* Example Prompts */}
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <p className="text-sm text-muted-foreground mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Quick examples:
              </p>
              <div className="flex flex-wrap gap-2">
                {examplePrompts.map((example, i) => (
                  <motion.button
                    key={i}
                    onClick={() => setPrompt(example)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-3 py-1.5 rounded-full text-xs bg-card border border-border hover:border-foreground/30 text-muted-foreground hover:text-foreground transition-all"
                  >
                    {example}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Response */}
            {response && (
              <motion.div 
                className="bg-card/80 backdrop-blur-sm border border-foreground/20 rounded-xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-foreground" />
                    <span className="font-heading font-medium">AI Feedback</span>
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
                        Copy
                      </>
                    )}
                  </Button>
                </div>
                <div className="whitespace-pre-wrap text-muted-foreground leading-relaxed text-sm">
                  {response}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Practice;
