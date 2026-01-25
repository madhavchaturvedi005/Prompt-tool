import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useState } from "react";
import { Search, Copy, Check, Star, Sparkles, TrendingUp, Zap, BookOpen, Code, Palette, BarChart3, GraduationCap, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const categories = [
  { id: "all", label: "All", icon: Sparkles },
  { id: "coding", label: "Coding", icon: Code },
  { id: "writing", label: "Writing", icon: BookOpen },
  { id: "business", label: "Business", icon: Briefcase },
  { id: "creative", label: "Creative", icon: Palette },
  { id: "analysis", label: "Analysis", icon: BarChart3 },
  { id: "education", label: "Education", icon: GraduationCap },
];

const prompts = [
  {
    id: 1,
    title: "Code Review Assistant",
    description: "Analyze code for bugs, performance issues, and best practices.",
    prompt: "Review this [LANGUAGE] code and provide:\n1. Bug identification\n2. Performance suggestions\n3. Best practice recommendations\n4. Security concerns\n\nCode:\n[PASTE CODE HERE]",
    category: "coding",
    stars: 234,
    uses: 1523,
    featured: true,
  },
  {
    id: 2,
    title: "Blog Post Outliner",
    description: "Generate structured blog post outlines with SEO considerations.",
    prompt: "Create a detailed blog post outline for the topic: [TOPIC]\n\nInclude:\n- Compelling headline options\n- Introduction hook\n- 5-7 main sections with subpoints\n- SEO keywords to target\n- Call-to-action suggestions",
    category: "writing",
    stars: 189,
    uses: 982,
    featured: true,
  },
  {
    id: 3,
    title: "Email Tone Adjuster",
    description: "Rewrite emails to match different professional tones.",
    prompt: "Rewrite this email in a [TONE: professional/casual/formal/friendly] tone while keeping the core message:\n\n[PASTE EMAIL HERE]",
    category: "business",
    stars: 156,
    uses: 2341,
    featured: false,
  },
  {
    id: 4,
    title: "Story Opening Generator",
    description: "Create captivating story openings in various genres.",
    prompt: "Write 3 different opening paragraphs for a [GENRE] story featuring:\n- Setting: [SETTING]\n- Main character: [CHARACTER BRIEF]\n- Mood: [MOOD]\n\nEach opening should use a different narrative technique.",
    category: "creative",
    stars: 312,
    uses: 876,
    featured: true,
  },
  {
    id: 5,
    title: "Data Analysis Framework",
    description: "Structure data analysis with clear insights and recommendations.",
    prompt: "Analyze this dataset/information and provide:\n1. Key patterns and trends\n2. Anomalies or outliers\n3. Statistical summary\n4. Actionable insights\n5. Visualization recommendations\n\nData:\n[PASTE DATA HERE]",
    category: "analysis",
    stars: 198,
    uses: 654,
    featured: false,
  },
  {
    id: 6,
    title: "Lesson Plan Creator",
    description: "Design comprehensive lesson plans for any subject.",
    prompt: "Create a lesson plan for teaching [TOPIC] to [AGE GROUP/LEVEL]:\n\n- Learning objectives\n- Duration: [TIME]\n- Materials needed\n- Warm-up activity\n- Main content delivery\n- Interactive exercises\n- Assessment method\n- Homework/extension",
    category: "education",
    stars: 267,
    uses: 1102,
    featured: false,
  },
];

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
            strokeOpacity={0.1 + path.id * 0.01}
            initial={{ pathLength: 0.3, opacity: 0.5 }}
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

const PromptCard = ({ 
  prompt, 
  index, 
  copiedId, 
  onCopy, 
  expanded, 
  onToggle 
}: { 
  prompt: typeof prompts[0]; 
  index: number; 
  copiedId: number | null; 
  onCopy: (id: number, text: string) => void;
  expanded: boolean;
  onToggle: () => void;
}) => {
  const category = categories.find(c => c.id === prompt.category);
  const Icon = category?.icon || Sparkles;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      layout
      className={cn(
        "group relative bg-card/60 backdrop-blur-sm rounded-2xl border border-border/50 overflow-hidden transition-all duration-300",
        "hover:border-foreground/20 hover:bg-card/80",
        expanded && "ring-1 ring-foreground/20"
      )}
    >
      {prompt.featured && (
        <div className="absolute top-4 right-4 z-10">
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-foreground text-background text-xs font-medium">
            <TrendingUp className="w-3 h-3" />
            Trending
          </div>
        </div>
      )}

      <div className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-foreground/10 flex items-center justify-center flex-shrink-0 group-hover:bg-foreground/15 transition-colors">
            <Icon className="w-6 h-6 text-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold mb-1 truncate">{prompt.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{prompt.description}</p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mb-4"
            >
              <div className="bg-muted/50 rounded-xl p-4 border border-border/30">
                <pre className="text-sm text-muted-foreground whitespace-pre-wrap font-mono leading-relaxed">
                  {prompt.prompt}
                </pre>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
              <span>{prompt.stars}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              <span>{prompt.uses.toLocaleString()} uses</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              {expanded ? "Collapse" : "Expand"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-foreground/20 hover:bg-foreground hover:text-background transition-all"
              onClick={() => onCopy(prompt.id, prompt.prompt)}
            >
              {copiedId === prompt.id ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Copy
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Library = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const filteredPrompts = prompts.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "all" || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPrompts = filteredPrompts.filter(p => p.featured);
  const regularPrompts = filteredPrompts.filter(p => !p.featured);

  const handleCopy = (id: number, prompt: string) => {
    navigator.clipboard.writeText(prompt);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden pt-24">
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 text-sm font-medium tracking-widest uppercase mb-6 text-muted-foreground">
              <BookOpen className="w-4 h-4" />
              Resources
            </span>
            
            <h1 className="text-5xl md:text-7xl font-serif font-semibold mb-6">
              <span className="block">Prompt</span>
              <span className="block bg-gradient-to-r from-foreground via-foreground/80 to-foreground/60 bg-clip-text text-transparent">
                Library
              </span>
            </h1>
            
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-foreground/50 to-transparent mx-auto mb-6" />
            
            <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">
              A curated collection of battle-tested prompts designed by experts for every use case.
            </p>

            {/* Stats */}
            <div className="flex items-center justify-center gap-8 text-sm">
              <div className="text-center">
                <div className="text-2xl font-semibold">{prompts.length}</div>
                <div className="text-muted-foreground">Prompts</div>
              </div>
              <div className="w-px h-8 bg-border" />
              <div className="text-center">
                <div className="text-2xl font-semibold">{categories.length - 1}</div>
                <div className="text-muted-foreground">Categories</div>
              </div>
              <div className="w-px h-8 bg-border" />
              <div className="text-center">
                <div className="text-2xl font-semibold">
                  {(prompts.reduce((acc, p) => acc + p.uses, 0) / 1000).toFixed(1)}k
                </div>
                <div className="text-muted-foreground">Total Uses</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <main className="relative z-10 pb-24">
        <div className="container mx-auto px-4">
          {/* Search & Filters */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-4xl mx-auto mb-12"
          >
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search prompts by name or description..."
                className="w-full h-14 pl-12 pr-4 rounded-2xl bg-card/60 backdrop-blur-sm border border-border/50 focus:border-foreground/30 focus:outline-none focus:ring-2 focus:ring-foreground/10 transition-all text-foreground placeholder:text-muted-foreground"
              />
            </div>
            
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                      activeCategory === cat.id
                        ? "bg-foreground text-background"
                        : "bg-card/60 text-muted-foreground hover:text-foreground hover:bg-card/80 border border-border/50"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Featured Section */}
          {featuredPrompts.length > 0 && activeCategory === "all" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="max-w-5xl mx-auto mb-12"
            >
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-5 h-5 text-foreground" />
                <h2 className="text-xl font-semibold">Trending Prompts</h2>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {featuredPrompts.map((prompt, index) => (
                  <PromptCard
                    key={prompt.id}
                    prompt={prompt}
                    index={index}
                    copiedId={copiedId}
                    onCopy={handleCopy}
                    expanded={expandedId === prompt.id}
                    onToggle={() => setExpandedId(expandedId === prompt.id ? null : prompt.id)}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* All Prompts */}
          <div className="max-w-5xl mx-auto">
            {(activeCategory !== "all" || regularPrompts.length > 0) && (
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-5 h-5 text-foreground" />
                <h2 className="text-xl font-semibold">
                  {activeCategory === "all" ? "All Prompts" : `${categories.find(c => c.id === activeCategory)?.label} Prompts`}
                </h2>
                <span className="text-sm text-muted-foreground">
                  ({activeCategory === "all" ? regularPrompts.length : filteredPrompts.length})
                </span>
              </div>
            )}
            
            <div className="grid md:grid-cols-2 gap-4">
              {(activeCategory === "all" ? regularPrompts : filteredPrompts).map((prompt, index) => (
                <PromptCard
                  key={prompt.id}
                  prompt={prompt}
                  index={index}
                  copiedId={copiedId}
                  onCopy={handleCopy}
                  expanded={expandedId === prompt.id}
                  onToggle={() => setExpandedId(expandedId === prompt.id ? null : prompt.id)}
                />
              ))}
            </div>

            {filteredPrompts.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No prompts found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
              </motion.div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Library;
