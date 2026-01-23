import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useState } from "react";
import { Send, Sparkles, RotateCcw, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const examplePrompts = [
  "Write a professional email declining a meeting invitation politely",
  "Explain quantum computing to a 10-year-old",
  "Create a Python function that sorts a list using bubble sort with comments",
  "Generate a creative story opening about a time traveler",
];

const Practice = () => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    // Simulate AI response
    setTimeout(() => {
      setResponse(`This is a simulated AI response to your prompt: "${prompt}"\n\nIn a real implementation, this would connect to an AI API and provide actual feedback on your prompt quality, including:\n\n• Clarity score\n• Specificity analysis\n• Suggestions for improvement\n• Alternative phrasings`);
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
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Practice <span className="text-gradient">Arena</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Write prompts, get instant AI feedback, and improve your skills in real-time.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Prompt Input */}
            <div className="glass rounded-2xl border p-6 mb-6">
              <label className="block text-sm font-medium mb-3 text-muted-foreground">
                Your Prompt
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Write your prompt here..."
                className="w-full h-40 bg-muted/50 rounded-xl p-4 text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-neon-blue/50 transition-all"
              />
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setPrompt("")}
                    className="text-muted-foreground"
                  >
                    <RotateCcw className="w-4 h-4 mr-1" />
                    Clear
                  </Button>
                </div>
                <Button
                  variant="neon"
                  onClick={handleSubmit}
                  disabled={!prompt.trim() || isLoading}
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Submit
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Example Prompts */}
            <div className="mb-6">
              <p className="text-sm text-muted-foreground mb-3">Try an example:</p>
              <div className="flex flex-wrap gap-2">
                {examplePrompts.map((example, i) => (
                  <button
                    key={i}
                    onClick={() => setPrompt(example)}
                    className="px-3 py-1.5 rounded-lg text-xs bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-all"
                  >
                    {example.slice(0, 40)}...
                  </button>
                ))}
              </div>
            </div>

            {/* Response */}
            {response && (
              <div className="glass rounded-2xl border p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-neon-blue" />
                    <span className="font-medium">AI Feedback</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopy}
                    className="text-muted-foreground"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 mr-1 text-green-400" />
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
                <div className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
                  {response}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Practice;
