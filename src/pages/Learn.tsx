import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  BookOpen,
  ExternalLink,
  GraduationCap,
  FileText,
  Brain,
  Target,
  Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface LearningResource {
  id: string;
  title: string;
  description: string;
  url: string;
  type: "course" | "documentation" | "research" | "blog" | "cheatsheet";
  level: "Beginner" | "Intermediate" | "Advanced" | "All Levels";
  provider: string;
  free: boolean;
  featured?: boolean;
}

const learningResources: LearningResource[] = [
  // Free Full Courses
  {
    id: "learn-prompting",
    title: "Learn Prompting (Free Full Course)",
    description: "Comprehensive free course covering all aspects of prompt engineering from basics to advanced techniques.",
    url: "https://learnprompting.org/",
    type: "course",
    level: "All Levels",
    provider: "Learn Prompting",
    free: true,
    featured: true
  },
  {
    id: "learn-prompting-intro",
    title: "Learn Prompting Introduction",
    description: "Perfect starting point for beginners to understand the fundamentals of prompt engineering.",
    url: "https://learnprompting.org/docs/introduction",
    type: "course",
    level: "Beginner",
    provider: "Learn Prompting",
    free: true
  },
  {
    id: "coursera-prompt-engineering",
    title: "Coursera Prompt Engineering Course",
    description: "University-level course providing structured learning with assignments and certificates.",
    url: "https://www.coursera.org/learn/prompt-engineering",
    type: "course",
    level: "Intermediate",
    provider: "Coursera",
    free: false,
    featured: true
  },
  {
    id: "google-prompting-essentials",
    title: "Google Prompting Essentials Course",
    description: "Google's official course on prompting fundamentals and best practices.",
    url: "https://grow.google/prompting-essentials/",
    type: "course",
    level: "Beginner",
    provider: "Google",
    free: true
  },
  {
    id: "deeplearning-ai-course",
    title: "DeepLearning.AI Prompt Engineering Course",
    description: "Short course focused on ChatGPT prompt engineering for developers.",
    url: "https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers/",
    type: "course",
    level: "Intermediate",
    provider: "DeepLearning.AI",
    free: true
  },
  {
    id: "kaggle-prompt-engineering",
    title: "Kaggle Prompt Engineering Course",
    description: "Practical prompt engineering course with hands-on exercises and competitions.",
    url: "https://www.kaggle.com/learn/prompt-engineering",
    type: "course",
    level: "Intermediate",
    provider: "Kaggle",
    free: true
  },

  // Official Documentation
  {
    id: "huggingface-docs",
    title: "Hugging Face Prompt Engineering Documentation",
    description: "Official documentation covering prompting techniques for transformer models.",
    url: "https://huggingface.co/docs/transformers/tasks/prompting",
    type: "documentation",
    level: "Intermediate",
    provider: "Hugging Face",
    free: true
  },
  {
    id: "google-cloud-guide",
    title: "Google Cloud Prompt Engineering Guide",
    description: "Comprehensive guide to prompt engineering in cloud AI services.",
    url: "https://cloud.google.com/discover/what-is-prompt-engineering",
    type: "documentation",
    level: "Intermediate",
    provider: "Google Cloud",
    free: true
  },
  {
    id: "ibm-guide",
    title: "IBM Prompt Engineering Guide",
    description: "Enterprise-focused guide to prompt engineering best practices and strategies.",
    url: "https://www.ibm.com/think/prompt-engineering",
    type: "documentation",
    level: "Intermediate",
    provider: "IBM",
    free: true
  },
  {
    id: "anthropic-guide",
    title: "Anthropic Prompt Engineering Guide",
    description: "Official guide for building with Claude, covering advanced prompting techniques.",
    url: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering",
    type: "documentation",
    level: "Advanced",
    provider: "Anthropic",
    free: true,
    featured: true
  },
  {
    id: "microsoft-azure-guide",
    title: "Microsoft Azure AI Prompt Engineering Guide",
    description: "Microsoft's comprehensive guide for prompt engineering with Azure AI services.",
    url: "https://learn.microsoft.com/en-us/azure/ai-services/openai/concepts/prompt-engineering",
    type: "documentation",
    level: "Intermediate",
    provider: "Microsoft",
    free: true
  },
  {
    id: "openai-best-practices",
    title: "OpenAI Best Practices Guide",
    description: "Official OpenAI guide covering prompting best practices and optimization techniques.",
    url: "https://help.openai.com/en/articles/6654000-best-practices-for-prompt-engineering-with-the-openai-api",
    type: "documentation",
    level: "All Levels",
    provider: "OpenAI",
    free: true,
    featured: true
  },

  // Research Papers
  {
    id: "prompt-engineering-survey",
    title: "Prompt Engineering Survey Paper",
    description: "Comprehensive academic survey of prompt engineering techniques and methodologies.",
    url: "https://arxiv.org/abs/2406.06608",
    type: "research",
    level: "Advanced",
    provider: "arXiv",
    free: true
  },
  {
    id: "vision-language-survey",
    title: "Vision-Language Prompt Engineering Survey",
    description: "Research paper covering prompt engineering for multimodal AI systems.",
    url: "https://arxiv.org/abs/2307.12980",
    type: "research",
    level: "Advanced",
    provider: "arXiv",
    free: true
  },

  // University Courses
  {
    id: "stanford-cs25",
    title: "Stanford CS25 LLM Course",
    description: "University-level course covering large language models and advanced AI theory.",
    url: "https://web.stanford.edu/class/cs25/",
    type: "course",
    level: "Advanced",
    provider: "Stanford University",
    free: true
  },
  {
    id: "berkeley-llm-course",
    title: "Berkeley LLM Course",
    description: "Advanced AI theory course focusing on large language models and applications.",
    url: "https://rdi.berkeley.edu/llm-course/",
    type: "course",
    level: "Advanced",
    provider: "UC Berkeley",
    free: true
  },

  // Blog Resources
  {
    id: "huggingface-blog",
    title: "Hugging Face Advanced Prompt Engineering Blog",
    description: "In-depth blog posts covering advanced prompt engineering techniques and case studies.",
    url: "https://huggingface.co/blog/advanced-prompt-engineering",
    type: "blog",
    level: "Advanced",
    provider: "Hugging Face",
    free: true
  },

  // Open Source Resources
  {
    id: "prompt-engineering-guide-book",
    title: "Open Source Prompt Engineering Book",
    description: "Comprehensive open-source guide covering all aspects of prompt engineering.",
    url: "https://github.com/dair-ai/Prompt-Engineering-Guide",
    type: "documentation",
    level: "All Levels",
    provider: "DAIR.AI",
    free: true
  },
  {
    id: "openai-cookbook",
    title: "OpenAI Cookbook (Free Handbook)",
    description: "Collection of practical examples and best practices for working with OpenAI models.",
    url: "https://github.com/openai/openai-cookbook",
    type: "documentation",
    level: "Intermediate",
    provider: "OpenAI",
    free: true
  },

  // Cheat Sheets
  {
    id: "prompting-guide-cheatsheet",
    title: "Prompt Engineering Cheat Sheet",
    description: "Quick reference guide with essential prompting techniques and patterns.",
    url: "https://www.promptingguide.ai/cheat-sheet",
    type: "cheatsheet",
    level: "All Levels",
    provider: "Prompting Guide",
    free: true
  }
];

const typeIcons = {
  course: GraduationCap,
  documentation: FileText,
  research: Brain,
  blog: Globe,
  cheatsheet: Target
};

const levelColors: Record<string, string> = {
  Beginner: "text-emerald-400 border-emerald-400/30 bg-emerald-400/10",
  Intermediate: "text-amber-400 border-amber-400/30 bg-amber-400/10",
  Advanced: "text-rose-400 border-rose-400/30 bg-rose-400/10",
  "All Levels": "text-blue-400 border-blue-400/30 bg-blue-400/10",
};

function FloatingPaths({ position }: { position: number }) {
  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${380 - i * 5 * position
      } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${152 - i * 5 * position
      } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${684 - i * 5 * position
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

const Learn = () => {
  const courseResources = learningResources.filter(r => r.type === "course");
  const documentationResources = learningResources.filter(r => r.type === "documentation");
  const researchResources = learningResources.filter(r => r.type === "research");
  const blogResources = learningResources.filter(r => r.type === "blog");
  const cheatsheetResources = learningResources.filter(r => r.type === "cheatsheet");

  const stats = [
    { icon: BookOpen, label: "Resources", value: learningResources.length.toString() },
    { icon: GraduationCap, label: "Free Courses", value: courseResources.filter(r => r.free).length.toString() },
    { icon: FileText, label: "Documentation", value: documentationResources.length.toString() },
    { icon: Brain, label: "Research Papers", value: researchResources.length.toString() },
  ];

  const ResourceCard = ({ resource, index }: { resource: LearningResource; index: number }) => {
    const Icon = typeIcons[resource.type];

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
        className={cn(
          "group relative bg-card/60 backdrop-blur-sm rounded-2xl border border-border/50 overflow-hidden transition-all duration-300 min-h-[200px] md:min-h-[220px] flex flex-col",
          "hover:border-foreground/20 hover:bg-card/80 hover:scale-[1.02]"
        )}
      >
        <div className="p-4 md:p-6 flex-1 flex flex-col">
          <div className="flex items-start gap-3 md:gap-4 mb-3 md:mb-4">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-foreground/10 flex items-center justify-center flex-shrink-0 group-hover:bg-foreground/15 transition-colors">
              <Icon className="w-5 h-5 md:w-6 md:h-6 text-foreground" />
            </div>
            <div className="flex-1 min-w-0 pr-8 md:pr-12">
              <h3 className="text-base md:text-lg font-semibold mb-2 line-clamp-2 leading-tight">{resource.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-3 mb-3 leading-relaxed">{resource.description}</p>
              <div className="flex flex-wrap items-center gap-1.5 md:gap-2 text-xs">
                <span className={cn("px-1.5 md:px-2 py-1 rounded-md text-xs font-medium border", levelColors[resource.level])}>
                  {resource.level}
                </span>
                <span className="bg-muted/50 px-1.5 md:px-2 py-1 rounded-md text-xs text-muted-foreground">
                  {resource.provider}
                </span>
                {resource.free && (
                  <span className="bg-emerald-500/10 text-emerald-600 px-1.5 md:px-2 py-1 rounded-md text-xs font-medium">
                    Free
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="mt-auto pt-3 md:pt-4 border-t border-border/30">
            <Button
              variant="outline"
              size="sm"
              className="w-full border-foreground/20 hover:bg-foreground hover:text-background transition-all text-xs md:text-sm"
              onClick={() => window.open(resource.url, '_blank')}
            >
              <ExternalLink className="w-3 h-3 md:w-3.5 md:h-3.5 mr-1.5" />
              Open Resource
            </Button>
          </div>
        </div>
      </motion.div>
    );
  };

  const ResourceSection = ({
    title,
    description,
    resources,
    icon: Icon
  }: {
    title: string;
    description: string;
    resources: LearningResource[];
    icon: React.ComponentType<any>;
  }) => {
    if (resources.length === 0) return null;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <div className="flex items-center gap-2 mb-6">
          <Icon className="w-5 h-5 text-foreground" />
          <h2 className="text-xl font-semibold">{title}</h2>
          <span className="text-sm text-muted-foreground">({resources.length})</span>
        </div>
        <p className="text-muted-foreground mb-6 max-w-3xl">{description}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
          {resources.map((resource, index) => (
            <ResourceCard key={resource.id} resource={resource} index={index} />
          ))}
        </div>
      </motion.div>
    );
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
            Official & High-Quality Resources
          </motion.span>

          <motion.h1
            className="text-4xl md:text-6xl font-heading font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Learning <span className="text-foreground">Hub</span>
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
            Curated collection of the best prompt engineering resources from leading organizations and researchers.
          </motion.p>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                className="glass rounded-xl border border-border/50 p-4 text-center"
                whileHover={{ scale: 1.05 }}
              >
                <stat.icon className="w-5 h-5 text-foreground mx-auto mb-2" />
                <p className="text-xl font-heading font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Learning Resources */}
      <main className="py-12 relative z-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">

            {/* Free Courses */}
            <ResourceSection
              title="Free Courses & Training"
              description="Comprehensive courses and structured learning paths from leading educational platforms and organizations."
              resources={courseResources}
              icon={GraduationCap}
            />

            {/* Official Documentation */}
            <ResourceSection
              title="Official Documentation & Guides"
              description="Official guides and documentation from major AI companies and cloud providers."
              resources={documentationResources}
              icon={FileText}
            />

            {/* Research Papers */}
            <ResourceSection
              title="Research Papers & Academic Resources"
              description="Latest research papers and academic resources for advanced understanding of prompt engineering."
              resources={researchResources}
              icon={Brain}
            />

            {/* Blog Resources */}
            <ResourceSection
              title="Blog Posts & Articles"
              description="In-depth articles and blog posts covering advanced techniques and real-world applications."
              resources={blogResources}
              icon={Globe}
            />

            {/* Cheat Sheets */}
            <ResourceSection
              title="Cheat Sheets & Quick References"
              description="Quick reference guides and cheat sheets for immediate access to key concepts and techniques."
              resources={cheatsheetResources}
              icon={Target}
            />

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Learn;
