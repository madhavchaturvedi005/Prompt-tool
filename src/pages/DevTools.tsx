import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ExternalLink, 
  Star, 
  GitBranch, 
  Code, 
  Search, 
  Settings, 
  Database, 
  BookOpen, 
  Terminal,
  Layers,
  Brain,
  Shield,
  Users,
  Workflow,
  X,
  Copy,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Floating paths component (same as Library page)
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

// Tool categories
const categories = [
  { id: "all", label: "All", icon: Layers },
  { id: "platforms", label: "Platforms", icon: Settings },
  { id: "libraries", label: "Libraries", icon: Database },
  { id: "learning", label: "Learning", icon: BookOpen },
  { id: "cli", label: "CLI Tools", icon: Terminal }
];

// Dev tools data
const devTools = [
  // Full Platforms
  {
    id: 1,
    name: "Langfuse",
    category: "platforms",
    description: "Open-source LLM engineering platform with prompt management, versioning, and evaluation",
    github: "https://github.com/langfuse/langfuse",
    website: "https://langfuse.com",
    stars: "5.2k",
    features: [
      "Prompt Management + Versioning",
      "Evaluation + User Feedback", 
      "SDK Integration",
      "Production-grade UI"
    ],
    tags: ["Production Ready", "Open Source", "SDK"],
    highlight: "Best for production prompt management",
    icon: Settings
  },
  {
    id: 2,
    name: "Latitude",
    category: "platforms",
    description: "Open-source prompt engineering platform with UI design and AI testing capabilities",
    github: "https://github.com/latitude-dev/latitude-llm",
    website: "https://latitude.so",
    stars: "1.8k",
    features: [
      "Visual Prompt Designer",
      "AI Testing Interface",
      "Prompt Experiments", 
      "Agent Building Support"
    ],
    tags: ["Visual Design", "Experiments", "Agents"],
    highlight: "Great for prompt experimentation",
    icon: Brain
  },
  {
    id: 3,
    name: "Agenta",
    category: "platforms",
    description: "LLMOps platform focused on prompt engineering with evaluation pipelines",
    github: "https://github.com/Agenta-AI/agenta",
    website: "https://agenta.ai",
    stars: "1.1k",
    features: [
      "Prompt Management",
      "Evaluation Pipelines",
      "Observability + Debugging",
      "Team Collaboration"
    ],
    tags: ["LLMOps", "Evaluation", "Team Collab"],
    highlight: "Perfect for team prompt engineering",
    icon: Users
  },
  {
    id: 4,
    name: "PromptBoard",
    category: "platforms",
    description: "Simple Next.js-based prompt UI tool with drag-drop workflows",
    github: "https://github.com/Justmalhar/promptboard",
    stars: "892",
    features: [
      "Web UI for Prompts",
      "Drag-drop Workflows",
      "Simple Setup",
      "MVP Ready"
    ],
    tags: ["Next.js", "Simple", "MVP"],
    highlight: "Great for startup MVPs",
    icon: Workflow
  },

  // System Prompt Libraries
  {
    id: 5,
    name: "AI Tools System Prompts",
    category: "libraries",
    description: "Real leaked system prompts from Cursor, Devin, Claude, Perplexity, and Google tools",
    github: "https://github.com/x1xhlol/system-prompts-and-models-of-ai-tools",
    stars: "3.4k",
    features: [
      "Cursor System Prompts",
      "Devin AI Prompts",
      "Claude System Prompts",
      "Perplexity Prompts"
    ],
    tags: ["Real Prompts", "Leaked", "Production"],
    highlight: "Goldmine for learning system prompt structure",
    icon: Database
  },
  {
    id: 6,
    name: "System Prompts Leaks",
    category: "libraries",
    description: "Extracted system prompts from ChatGPT, Gemini, and Claude for learning",
    github: "https://github.com/asgeirtj/system_prompts_leaks",
    stars: "2.1k",
    features: [
      "ChatGPT System Prompts",
      "Gemini Prompts",
      "Claude Prompts",
      "Learning Examples"
    ],
    tags: ["ChatGPT", "Gemini", "Claude"],
    highlight: "Perfect for system-prompt engineering learning",
    icon: Shield
  },
  {
    id: 7,
    name: "The Big Prompt Library",
    category: "libraries",
    description: "Comprehensive collection of custom instructions, jailbreaks, and protection prompts",
    github: "https://github.com/0xeb/TheBigPromptLibrary",
    stars: "4.7k",
    features: [
      "Custom Instructions",
      "Jailbreak Prompts",
      "Protection Prompts",
      "GPT System Templates"
    ],
    tags: ["Custom Instructions", "Jailbreaks", "Templates"],
    highlight: "Massive prompt collection",
    icon: BookOpen
  },

  // Learning Resources
  {
    id: 8,
    name: "OpenPrompt Framework",
    category: "learning",
    description: "Research-grade prompt engineering framework used in NLP research",
    github: "https://github.com/thunlp/OpenPrompt",
    stars: "4.2k",
    features: [
      "Research Framework",
      "NLP Integration",
      "Academic Quality",
      "Prompt Learning"
    ],
    tags: ["Research", "NLP", "Academic"],
    highlight: "Research-grade prompt engineering",
    icon: Code
  },
  {
    id: 9,
    name: "Prompt Engineering Guide",
    category: "learning",
    description: "Massive learning resource by DAIR.AI with techniques, papers, and examples",
    github: "https://github.com/dair-ai/Prompt-Engineering-Guide",
    stars: "46.8k",
    features: [
      "Comprehensive Techniques",
      "Research Papers",
      "Practical Examples",
      "Best Practices"
    ],
    tags: ["Learning", "Techniques", "Papers"],
    highlight: "Most comprehensive learning resource",
    icon: BookOpen
  },
  {
    id: 10,
    name: "Prompt Engineering Techniques Hub",
    category: "learning",
    description: "25+ prompt engineering methods implemented with examples",
    github: "https://github.com/KalyanKS-NLP/Prompt-Engineering-Techniques-Hub",
    stars: "1.9k",
    features: [
      "25+ Techniques",
      "Implementation Examples",
      "Method Comparisons",
      "Practical Code"
    ],
    tags: ["Techniques", "Examples", "Implementation"],
    highlight: "Hands-on technique implementations",
    icon: Code
  },

  // CLI Tools
  {
    id: 11,
    name: "Prompt Library CLI",
    category: "cli",
    description: "Store and version control prompts like code, run from terminal",
    github: "https://github.com/thibaultyou/prompt-library",
    stars: "567",
    features: [
      "Store Prompts as Code",
      "Version Control",
      "Terminal Interface",
      "Git Integration"
    ],
    tags: ["CLI", "Version Control", "Terminal"],
    highlight: "Manage prompts like code",
    icon: Terminal
  }
];

// Tool Modal Component
const ToolModal = ({ 
  tool, 
  isOpen, 
  onClose,
  copiedUrl,
  onCopyUrl
}: { 
  tool: typeof devTools[0] | null; 
  isOpen: boolean; 
  onClose: () => void;
  copiedUrl: string | null;
  onCopyUrl: (url: string) => void;
}) => {
  if (!tool) return null;

  const Icon = tool.icon;

  const handleCopyGitHub = () => {
    onCopyUrl(tool.github);
    navigator.clipboard.writeText(tool.github);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-4 md:inset-8 lg:inset-16 bg-background border border-border/50 rounded-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border/30">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-foreground/10 flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-heading font-bold">{tool.name}</h2>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span>{tool.stars} stars</span>
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
                className="border-foreground/20 hover:bg-foreground hover:text-background"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto p-6 space-y-6">
              {/* Highlight */}
              <div className="bg-muted/50 rounded-xl p-4 border border-border/30">
                <h3 className="font-semibold mb-2">Why Use This Tool</h3>
                <p className="text-muted-foreground">{tool.highlight}</p>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground leading-relaxed">{tool.description}</p>
              </div>

              {/* Features */}
              <div>
                <h3 className="font-semibold mb-3">Key Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {tool.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-foreground" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div>
                <h3 className="font-semibold mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {tool.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-full bg-foreground/10 text-sm font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border/30">
                <Button
                  className="flex-1 bg-foreground text-background hover:bg-foreground/90"
                  onClick={() => window.open(tool.github, '_blank')}
                >
                  <GitBranch className="w-4 h-4 mr-2" />
                  View on GitHub
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCopyGitHub}
                  className="border-foreground/20 hover:bg-foreground hover:text-background"
                >
                  {copiedUrl === tool.github ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy URL
                    </>
                  )}
                </Button>
                {tool.website && (
                  <Button
                    variant="outline"
                    onClick={() => window.open(tool.website, '_blank')}
                    className="border-foreground/20 hover:bg-foreground hover:text-background"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Website
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Tool Card Component
const ToolCard = ({ 
  tool, 
  index,
  onOpenModal
}: { 
  tool: typeof devTools[0]; 
  index: number;
  onOpenModal: (tool: typeof devTools[0]) => void;
}) => {
  const Icon = tool.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      layout
      className={cn(
        "group relative bg-card/60 backdrop-blur-sm rounded-2xl border border-border/50 overflow-hidden transition-all duration-300 cursor-pointer min-h-[280px] flex flex-col",
        "hover:border-foreground/20 hover:bg-card/80 hover:scale-[1.02]"
      )}
      onClick={() => onOpenModal(tool)}
    >
      <div className="p-6 flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-foreground/10 flex items-center justify-center">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-lg group-hover:text-foreground transition-colors">
                {tool.name}
              </h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                <span>{tool.stars}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Highlight */}
        <div className="mb-3">
          <span className="inline-block px-3 py-1 rounded-full bg-foreground/10 text-xs font-medium">
            {tool.highlight}
          </span>
        </div>

        {/* Description */}
        <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-1">
          {tool.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {tool.tags.slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              className="px-2 py-1 rounded-md bg-muted/50 text-xs text-muted-foreground"
            >
              {tag}
            </span>
          ))}
          {tool.tags.length > 3 && (
            <span className="px-2 py-1 rounded-md bg-muted/50 text-xs text-muted-foreground">
              +{tool.tags.length - 3}
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="mt-auto pt-4 border-t border-border/30">
          <Button
            size="sm"
            className="w-full bg-foreground text-background hover:bg-foreground/90"
            onClick={(e) => {
              e.stopPropagation();
              window.open(tool.github, '_blank');
            }}
          >
            <GitBranch className="w-4 h-4 mr-2" />
            View on GitHub
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

const DevTools = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedTool, setSelectedTool] = useState<typeof devTools[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const filteredTools = devTools.filter(tool => {
    const matchesCategory = activeCategory === "all" || tool.category === activeCategory;
    const matchesSearch = tool.name.toLowerCase().includes(search.toLowerCase()) ||
                         tool.description.toLowerCase().includes(search.toLowerCase()) ||
                         tool.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleOpenModal = (tool: typeof devTools[0]) => {
    setSelectedTool(tool);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTool(null);
  };

  const handleCopyUrl = (url: string) => {
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
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
            Developer Resources
          </motion.span>
          
          <motion.h1 
            className="text-4xl md:text-6xl font-heading font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Dev <span className="text-foreground">Tools</span>
          </motion.h1>
          
          <motion.div 
            className="h-px w-48 mx-auto mb-6 bg-gradient-to-r from-transparent via-foreground/30 to-transparent"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          />
          
          <motion.p 
            className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Discover the best open-source platforms, system prompt libraries, and developer tools 
            for professional prompt engineering.
          </motion.p>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 border-b border-border/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search tools..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted/30 border border-border/50 focus:border-foreground/50 focus:outline-none transition-all"
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const Icon = category.icon;
                const isActive = activeCategory === category.id;
                const count = category.id === "all" 
                  ? devTools.length 
                  : devTools.filter(tool => tool.category === category.id).length;
                
                return (
                  <Button
                    key={category.id}
                    variant={isActive ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveCategory(category.id)}
                    className={cn(
                      "h-10 px-4 rounded-lg transition-all",
                      isActive 
                        ? "bg-foreground text-background hover:bg-foreground/90" 
                        : "border-foreground/20 hover:bg-foreground/10"
                    )}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {category.label}
                    <span className="ml-2 px-2 py-0.5 rounded-full bg-muted/50 text-xs">
                      {count}
                    </span>
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredTools.map((tool, index) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                index={index}
                onOpenModal={handleOpenModal}
              />
            ))}
          </motion.div>

          {/* No Results */}
          {filteredTools.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <Search className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No tools found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Tool Modal */}
      <ToolModal
        tool={selectedTool}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        copiedUrl={copiedUrl}
        onCopyUrl={handleCopyUrl}
      />

      <Footer />
    </div>
  );
};

export default DevTools;