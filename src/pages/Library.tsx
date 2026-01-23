import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useState } from "react";
import { Search, Copy, Check, Tag, Star, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const categories = ["All", "Coding", "Writing", "Business", "Creative", "Analysis", "Education"];

const prompts = [
  {
    id: 1,
    title: "Code Review Assistant",
    description: "Analyze code for bugs, performance issues, and best practices.",
    prompt: "Review this [LANGUAGE] code and provide:\n1. Bug identification\n2. Performance suggestions\n3. Best practice recommendations\n4. Security concerns\n\nCode:\n[PASTE CODE HERE]",
    category: "Coding",
    stars: 234,
    uses: 1523,
  },
  {
    id: 2,
    title: "Blog Post Outliner",
    description: "Generate structured blog post outlines with SEO considerations.",
    prompt: "Create a detailed blog post outline for the topic: [TOPIC]\n\nInclude:\n- Compelling headline options\n- Introduction hook\n- 5-7 main sections with subpoints\n- SEO keywords to target\n- Call-to-action suggestions",
    category: "Writing",
    stars: 189,
    uses: 982,
  },
  {
    id: 3,
    title: "Email Tone Adjuster",
    description: "Rewrite emails to match different professional tones.",
    prompt: "Rewrite this email in a [TONE: professional/casual/formal/friendly] tone while keeping the core message:\n\n[PASTE EMAIL HERE]",
    category: "Business",
    stars: 156,
    uses: 2341,
  },
  {
    id: 4,
    title: "Story Opening Generator",
    description: "Create captivating story openings in various genres.",
    prompt: "Write 3 different opening paragraphs for a [GENRE] story featuring:\n- Setting: [SETTING]\n- Main character: [CHARACTER BRIEF]\n- Mood: [MOOD]\n\nEach opening should use a different narrative technique.",
    category: "Creative",
    stars: 312,
    uses: 876,
  },
  {
    id: 5,
    title: "Data Analysis Framework",
    description: "Structure data analysis with clear insights and recommendations.",
    prompt: "Analyze this dataset/information and provide:\n1. Key patterns and trends\n2. Anomalies or outliers\n3. Statistical summary\n4. Actionable insights\n5. Visualization recommendations\n\nData:\n[PASTE DATA HERE]",
    category: "Analysis",
    stars: 198,
    uses: 654,
  },
  {
    id: 6,
    title: "Lesson Plan Creator",
    description: "Design comprehensive lesson plans for any subject.",
    prompt: "Create a lesson plan for teaching [TOPIC] to [AGE GROUP/LEVEL]:\n\n- Learning objectives\n- Duration: [TIME]\n- Materials needed\n- Warm-up activity\n- Main content delivery\n- Interactive exercises\n- Assessment method\n- Homework/extension",
    category: "Education",
    stars: 267,
    uses: 1102,
  },
];

const Library = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const filteredPrompts = prompts.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "All" || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCopy = (id: number, prompt: string) => {
    navigator.clipboard.writeText(prompt);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Prompt <span className="text-gradient">Library</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A curated collection of high-quality prompts for every use case.
            </p>
          </div>

          {/* Search & Filters */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search prompts..."
                className="w-full h-12 pl-12 pr-4 rounded-xl bg-muted/50 border border-border focus:border-neon-blue/50 focus:outline-none focus:ring-2 focus:ring-neon-blue/20 transition-all"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                    activeCategory === cat
                      ? "bg-neon-blue text-background"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Prompts Grid */}
          <div className="max-w-4xl mx-auto space-y-4">
            {filteredPrompts.map((p) => (
              <div
                key={p.id}
                className="glass rounded-2xl border p-6 transition-all duration-300 hover:border-neon-blue/50"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold">{p.title}</h3>
                      <span className="px-2 py-0.5 rounded-full text-xs bg-muted text-muted-foreground">
                        {p.category}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{p.description}</p>
                  </div>
                  <Button
                    variant="neon-outline"
                    size="sm"
                    onClick={() => handleCopy(p.id, p.prompt)}
                  >
                    {copiedId === p.id ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>

                <div className="bg-muted/50 rounded-xl p-4 mb-4">
                  <pre className="text-sm text-muted-foreground whitespace-pre-wrap font-mono">
                    {p.prompt}
                  </pre>
                </div>

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-yellow-400" />
                    <span>{p.stars}</span>
                  </div>
                  <span>•</span>
                  <span>{p.uses.toLocaleString()} uses</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Library;
