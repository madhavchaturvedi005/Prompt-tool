import { BookOpen, Code, Target, Library, Sparkles, Wrench, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

const modules = [
  {
    icon: BookOpen,
    title: "Learn",
    description: "Access curated resources from top organizations, courses, and research papers.",
    level: "All Levels",
    path: "/learn",
    color: "emerald",
  },
  {
    icon: Code,
    title: "Practice",
    description: "Interactive arena with real-time AI evaluation and instant feedback on your prompts.",
    level: "Hands-On",
    path: "/practice",
    color: "blue",
  },
  {
    icon: Target,
    title: "Challenges",
    description: "Test your skills with structured challenges across multiple difficulty levels.",
    level: "Competitive",
    path: "/challenges",
    color: "rose",
  },
  {
    icon: Library,
    title: "Library",
    description: "Browse and search through a vast collection of expert-crafted prompts with AI-powered search.",
    level: "Reference",
    path: "/library",
    color: "purple",
  },
  {
    icon: Sparkles,
    title: "Refine",
    description: "Optimize your prompts with AI-powered analysis and improvement suggestions.",
    level: "Advanced",
    path: "/refine",
    color: "amber",
  },
  {
    icon: Wrench,
    title: "DevTools",
    description: "Advanced tools for prompt testing, comparison, and performance analysis.",
    level: "Professional",
    path: "/devtools",
    color: "sky",
  },
];

const levelColors: Record<string, string> = {
  "All Levels": "text-emerald-400 border-emerald-400/30 bg-emerald-400/5",
  "Hands-On": "text-blue-400 border-blue-400/30 bg-blue-400/5",
  "Competitive": "text-rose-400 border-rose-400/30 bg-rose-400/5",
  "Reference": "text-purple-400 border-purple-400/30 bg-purple-400/5",
  "Advanced": "text-amber-400 border-amber-400/30 bg-amber-400/5",
  "Professional": "text-sky-400 border-sky-400/30 bg-sky-400/5",
};

export function LearningModules() {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-muted-foreground text-sm font-medium tracking-widest uppercase mb-4 block">
            Platform Features
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-semibold mb-4">
            Everything You Need to <span className="text-foreground">Master Prompting</span>
          </h2>
          <div className="divider max-w-xs mx-auto mb-6" />
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A comprehensive platform with learning resources, interactive practice, 
            challenges, and professional tools to elevate your prompt engineering skills.
          </p>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module, index) => (
            <Link
              key={index}
              to={module.path}
              className={cn(
                "group relative p-8 bg-card border border-border transition-all duration-500",
                "hover:border-foreground/40 hover:shadow-xl hover:shadow-foreground/5 cursor-pointer",
                "hover:-translate-y-1"
              )}
            >
              {/* Icon */}
              <div className="w-12 h-12 flex items-center justify-center border border-border mb-6 group-hover:border-foreground/40 transition-colors">
                <module.icon className="w-6 h-6 text-foreground" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-heading font-semibold mb-3 group-hover:text-foreground transition-colors">
                {module.title}
              </h3>
              <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                {module.description}
              </p>

              {/* Meta */}
              <div className="flex items-center justify-between">
                <span className={cn("px-3 py-1 text-xs font-medium border rounded-full", levelColors[module.level])}>
                  {module.level}
                </span>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 border border-foreground/0 group-hover:border-foreground/20 transition-all duration-300 pointer-events-none" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
