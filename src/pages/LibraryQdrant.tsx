import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useState } from "react";
import { Search, Copy, Check, Star, Sparkles, Zap, BookOpen, Code, Palette, BarChart3, GraduationCap, Briefcase, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { usePrompts, useFeaturedPrompts, useSimilarPrompts } from "@/hooks/usePrompts";
import { useAuth } from "@/contexts/AuthContext";
import type { PromptPayload } from "@/lib/qdrant";

const categories = [
  { id: "all", label: "All", icon: Sparkles },
  { id: "coding", label: "Coding", icon: Code },
  { id: "writing", label: "Writing", icon: BookOpen },
  { id: "business", label: "Business", icon: Briefcase },
  { id: "creative", label: "Creative", icon: Palette },
  { id: "analysis", label: "Analysis", icon: BarChart3 },
  { id: "education", label: "Education", icon: GraduationCap },
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

const PromptModal = ({ 
  prompt, 
  isOpen, 
  onClose, 
  copiedId, 
  onCopy,
  onTrackUsage
}: { 
  prompt: PromptPayload | null; 
  isOpen: boolean; 
  onClose: () => void;
  copiedId: string | null;
  onCopy: (id: string, text: string) => void;
  onTrackUsage: (id: string, action: 'star' | 'use' | 'copy') => void;
}) => {
  const { prompts: similarPrompts, loading: loadingSimilar } = useSimilarPrompts(
    isOpen ? prompt?.id || null : null
  );

  if (!prompt) return null;

  const category = categories.find(c => c.id === prompt.category);
  const Icon = category?.icon || Sparkles;

  const handleCopy = () => {
    onCopy(prompt.id, prompt.prompt);
    onTrackUsage(prompt.id, 'copy');
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
            className="fixed inset-4 md:inset-8 lg:inset-16 bg-card/95 backdrop-blur-sm rounded-2xl border border-border/50 z-50 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-start gap-4 p-6 border-b border-border/30">
              <div className="w-12 h-12 rounded-xl bg-foreground/10 flex items-center justify-center flex-shrink-0">
                <Icon className="w-6 h-6 text-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-semibold mb-2">{prompt.title}</h2>
                <p className="text-muted-foreground mb-2">{prompt.description}</p>
                {prompt.contributor && (
                  <p className="text-sm text-muted-foreground/70 mb-2">
                    Contributed by @{prompt.contributor}
                  </p>
                )}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span>{prompt.stars}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Zap className="w-4 h-4" />
                    <span>{prompt.uses.toLocaleString()} uses</span>
                  </div>
                  <div className="px-2 py-1 rounded-full bg-foreground/10 text-xs font-medium capitalize">
                    {prompt.category}
                  </div>
                  {prompt.difficulty && (
                    <div className="px-2 py-1 rounded-full bg-blue-500/10 text-blue-500 text-xs font-medium capitalize">
                      {prompt.difficulty}
                    </div>
                  )}
                  {prompt.estimatedTime && (
                    <div className="text-xs text-muted-foreground">
                      ⏱️ {prompt.estimatedTime}
                    </div>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto p-6 space-y-6">
              {/* Main Prompt */}
              <div className="bg-muted/50 rounded-xl p-6 border border-border/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Prompt</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-foreground/20 hover:bg-foreground hover:text-background transition-all"
                    onClick={handleCopy}
                  >
                    {copiedId === prompt.id ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Prompt
                      </>
                    )}
                  </Button>
                </div>
                <pre className="text-sm text-muted-foreground whitespace-pre-wrap font-mono leading-relaxed">
                  {prompt.prompt}
                </pre>
              </div>

              {/* Tags */}
              {prompt.tags && prompt.tags.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {prompt.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 rounded-full bg-foreground/10 text-sm font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Similar Prompts */}
              {similarPrompts.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Similar Prompts</h3>
                  {loadingSimilar ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin" />
                    </div>
                  ) : (
                    <div className="grid gap-3">
                      {similarPrompts.map((similarPrompt) => (
                        <div
                          key={similarPrompt.id}
                          className="p-4 rounded-xl bg-card/60 border border-border/30 hover:bg-card/80 transition-colors cursor-pointer"
                          onClick={() => {
                            // You could implement navigation to similar prompt here
                            console.log('Navigate to similar prompt:', similarPrompt.id);
                          }}
                        >
                          <h4 className="font-medium mb-1">{similarPrompt.title}</h4>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {similarPrompt.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const PromptCard = ({ 
  prompt, 
  index, 
  copiedId, 
  onCopy, 
  onOpenModal,
  onTrackUsage,
  isAuthenticated,
  savePrompt,
  unsavePrompt,
  isPromptSaved
}: { 
  prompt: PromptPayload; 
  index: number; 
  copiedId: string | null; 
  onCopy: (id: string, text: string) => void;
  onOpenModal: (prompt: PromptPayload) => void;
  onTrackUsage: (id: string, action: 'star' | 'use' | 'copy') => void;
  isAuthenticated: boolean;
  savePrompt: (promptData: {
    prompt_id: string;
    prompt_title: string;
    prompt_text: string;
    prompt_description?: string;
    category?: string;
    tags?: string[];
  }) => Promise<boolean>;
  unsavePrompt: (id: string) => Promise<boolean>;
  isPromptSaved: (id: string) => boolean;
}) => {
  const category = categories.find(c => c.id === prompt.category);
  const Icon = category?.icon || Sparkles;

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCopy(prompt.id, prompt.prompt);
    onTrackUsage(prompt.id, 'copy');
  };

  const handleCardClick = () => {
    onOpenModal(prompt);
    onTrackUsage(prompt.id, 'use');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      layout
      className={cn(
        "group relative bg-card/60 backdrop-blur-sm rounded-2xl border border-border/50 overflow-hidden transition-all duration-300 cursor-pointer min-h-[240px] md:min-h-[280px] flex flex-col",
        "hover:border-foreground/20 hover:bg-card/80 hover:scale-[1.02]"
      )}
      onClick={handleCardClick}
    >
      {prompt.featured && (
        <div className="absolute top-2 md:top-3 right-2 md:right-3 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (isAuthenticated) {
                if (isPromptSaved(prompt.id)) {
                  unsavePrompt(prompt.id);
                } else {
                  savePrompt({
                    prompt_id: prompt.id,
                    prompt_title: prompt.title,
                    prompt_text: prompt.content,
                    prompt_description: prompt.description,
                    category: prompt.category,
                    tags: prompt.tags || []
                  });
                }
              }
            }}
            className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium shadow-sm transition-all",
              isAuthenticated && isPromptSaved(prompt.id)
                ? "bg-amber-500 text-white"
                : "bg-foreground/10 text-foreground hover:bg-foreground/20"
            )}
            disabled={!isAuthenticated}
          >
            <Star className={cn("w-3 h-3", isAuthenticated && isPromptSaved(prompt.id) && "fill-current")} />
            <span className="hidden sm:inline">
              {isAuthenticated ? (isPromptSaved(prompt.id) ? "Saved" : "Save") : "Save"}
            </span>
          </button>
        </div>
      )}

      <div className="p-4 md:p-6 flex-1 flex flex-col">
        <div className="flex items-start gap-3 md:gap-4 mb-3 md:mb-4">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-foreground/10 flex items-center justify-center flex-shrink-0 group-hover:bg-foreground/15 transition-colors">
            <Icon className="w-5 h-5 md:w-6 md:h-6 text-foreground" />
          </div>
          <div className="flex-1 min-w-0 pr-8 md:pr-12">
            <h3 className="text-base md:text-lg font-semibold mb-2 line-clamp-2 leading-tight">{prompt.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-3 mb-3 leading-relaxed">{prompt.description}</p>
            <div className="flex flex-wrap items-center gap-1.5 md:gap-2 text-xs text-muted-foreground/70">
              {prompt.contributor && (
                <span className="bg-muted/50 px-1.5 md:px-2 py-1 rounded-md text-xs">@{prompt.contributor}</span>
              )}
              {prompt.difficulty && (
                <span className="bg-blue-500/10 text-blue-600 px-1.5 md:px-2 py-1 rounded-md capitalize text-xs">{prompt.difficulty}</span>
              )}
              {prompt.estimatedTime && (
                <span className="bg-green-500/10 text-green-600 px-1.5 md:px-2 py-1 rounded-md text-xs">{prompt.estimatedTime}</span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between pt-3 md:pt-4 border-t border-border/30">
          <div className="flex items-center gap-3 md:gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Star className="w-3 h-3 md:w-3.5 md:h-3.5 text-yellow-500 fill-yellow-500" />
              <span className="text-xs">{prompt.stars}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="w-3 h-3 md:w-3.5 md:h-3.5" />
              <span className="text-xs hidden sm:inline">{prompt.uses.toLocaleString()} uses</span>
              <span className="text-xs sm:hidden">{prompt.uses > 1000 ? `${Math.floor(prompt.uses/1000)}k` : prompt.uses}</span>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="border-foreground/20 hover:bg-foreground hover:text-background transition-all text-xs md:text-sm px-2 md:px-3 py-1 md:py-2"
            onClick={handleCopy}
          >
            {copiedId === prompt.id ? (
              <>
                <Check className="w-3 h-3 md:w-3.5 md:h-3.5" />
                <span className="hidden sm:inline ml-1">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 md:w-3.5 md:h-3.5" />
                <span className="hidden sm:inline ml-1">Copy</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

const LibraryQdrant = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedPrompt, setSelectedPrompt] = useState<PromptPayload | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { isAuthenticated, savePrompt, unsavePrompt, isPromptSaved } = useAuth();

  // Use Qdrant-based hooks with error handling
  const {
    prompts: allPrompts,
    loading,
    error,
    hasMore,
    total,
    search: searchPrompts,
    loadMore,
    trackUsage,
  } = usePrompts({
    query: search.trim(), // Pass the search query directly
    category: activeCategory === "all" ? undefined : activeCategory,
    limit: 20,
    autoSearch: true,
  });

  const { prompts: featuredPrompts, loading: loadingFeatured, error: featuredError } = useFeaturedPrompts(10);

  // When searching or filtering by category, use all prompts
  // When on "all" category without search, filter out featured prompts to avoid duplicates
  const prompts = (search.trim() || activeCategory !== "all") 
    ? allPrompts 
    : allPrompts.filter(prompt => !featuredPrompts.some(featured => featured.id === prompt.id));

  const handleCopy = (id: string, prompt: string) => {
    navigator.clipboard.writeText(prompt);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleOpenModal = (prompt: PromptPayload) => {
    setSelectedPrompt(prompt);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPrompt(null);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchPrompts(search);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[50vh] pt-24">
          <div className="text-center">
            <div className="text-red-500 mb-4">⚠️</div>
            <h2 className="text-xl font-semibold mb-2">Error Loading Prompts</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

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
            AI-Powered Library
          </motion.span>
          
          <motion.h1 
            className="text-4xl md:text-6xl font-heading font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Prompt <span className="text-foreground">Library</span>
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
            Discover prompts through semantic search, find similar content, and explore our AI-curated collection.
          </motion.p>

          {/* Stats */}
          <motion.div 
            className="grid grid-cols-3 gap-4 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <motion.div 
              className="glass rounded-xl border border-border/50 p-4 text-center"
              whileHover={{ scale: 1.05 }}
            >
              <BookOpen className="w-5 h-5 text-foreground mx-auto mb-2" />
              <p className="text-xl font-heading font-bold text-foreground">{total || '...'}</p>
              <p className="text-xs text-muted-foreground">Prompts</p>
            </motion.div>
            <motion.div 
              className="glass rounded-xl border border-border/50 p-4 text-center"
              whileHover={{ scale: 1.05 }}
            >
              <Sparkles className="w-5 h-5 text-foreground mx-auto mb-2" />
              <p className="text-xl font-heading font-bold text-foreground">{categories.length - 1}</p>
              <p className="text-xs text-muted-foreground">Categories</p>
            </motion.div>
            <motion.div 
              className="glass rounded-xl border border-border/50 p-4 text-center"
              whileHover={{ scale: 1.05 }}
            >
              <Zap className="w-5 h-5 text-foreground mx-auto mb-2" />
              <p className="text-xl font-heading font-bold text-foreground">AI</p>
              <p className="text-xs text-muted-foreground">Powered</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <main className="py-12 relative z-20">
        <div className="container mx-auto px-4">
          {/* Search & Filters */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-4xl mx-auto mb-12"
          >
            <form onSubmit={handleSearch} className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search prompts semantically..."
                className="w-full h-12 md:h-14 pl-12 pr-4 rounded-2xl bg-card/60 backdrop-blur-sm border border-border/50 focus:border-foreground/30 focus:outline-none focus:ring-2 focus:ring-foreground/10 transition-all text-foreground placeholder:text-muted-foreground text-sm md:text-base"
              />
              {search.trim() && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </form>
            
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={cn(
                      "flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 md:py-2.5 rounded-xl text-xs md:text-sm font-medium transition-all duration-200",
                      activeCategory === cat.id
                        ? "bg-foreground text-background"
                        : "bg-card/60 text-muted-foreground hover:text-foreground hover:bg-card/80 border border-border/50"
                    )}
                  >
                    <Icon className="w-3 h-3 md:w-4 md:h-4" />
                    <span className="hidden sm:inline">{cat.label}</span>
                    <span className="sm:hidden">{cat.label.slice(0, 3)}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Featured Section - Only show when not searching and on "all" category */}
          {featuredPrompts.length > 0 && activeCategory === "all" && !search.trim() && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="max-w-5xl mx-auto mb-12"
            >
              <div className="flex items-center gap-2 mb-6">
                <Star className="w-5 h-5 text-foreground" />
                <h2 className="text-xl font-semibold">Featured Prompts</h2>
                <span className="text-sm text-muted-foreground">({featuredPrompts.length})</span>
              </div>
              {loadingFeatured ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                  {featuredPrompts.map((prompt, index) => (
                    <PromptCard
                      key={`featured-${prompt.id}`}
                      prompt={prompt}
                      index={index}
                      copiedId={copiedId}
                      onCopy={handleCopy}
                      onOpenModal={handleOpenModal}
                      onTrackUsage={trackUsage}
                      isAuthenticated={isAuthenticated}
                      savePrompt={savePrompt}
                      unsavePrompt={unsavePrompt}
                      isPromptSaved={isPromptSaved}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* All Prompts */}
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-foreground" />
                <h2 className="text-xl font-semibold">
                  {search.trim() 
                    ? `Search Results for "${search.trim()}"` 
                    : activeCategory === "all" 
                      ? "All Prompts" 
                      : `${categories.find(c => c.id === activeCategory)?.label} Prompts`
                  }
                </h2>
                {total > 0 && (
                  <span className="text-sm text-muted-foreground">
                    ({prompts.length} of {total})
                  </span>
                )}
              </div>
              
              {loading && (
                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 mb-8">
              {prompts.map((prompt, index) => (
                <PromptCard
                  key={`prompt-${prompt.id}-${Date.now()}-${index}`}
                  prompt={prompt}
                  index={index}
                  copiedId={copiedId}
                  onCopy={handleCopy}
                  onOpenModal={handleOpenModal}
                  onTrackUsage={trackUsage}
                  isAuthenticated={isAuthenticated}
                  savePrompt={savePrompt}
                  unsavePrompt={unsavePrompt}
                  isPromptSaved={isPromptSaved}
                />
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="text-center">
                <Button
                  onClick={loadMore}
                  disabled={loading}
                  variant="outline"
                  size="lg"
                  className="border-foreground/20 hover:bg-foreground hover:text-background"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    'Load More Prompts'
                  )}
                </Button>
              </div>
            )}

            {prompts.length === 0 && !loading && (
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

      <PromptModal
        prompt={selectedPrompt}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        copiedId={copiedId}
        onCopy={handleCopy}
        onTrackUsage={trackUsage}
      />

      <Footer />
    </div>
  );
};

export default LibraryQdrant;