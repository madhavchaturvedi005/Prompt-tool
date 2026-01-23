import { BookOpen, Code, MessageSquare, Lightbulb, Rocket, Shield, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const modules = [
  {
    icon: BookOpen,
    title: "Fundamentals",
    description: "Master the core principles of prompt structure, context, and clarity.",
    level: "Foundation",
    lessons: 12,
  },
  {
    icon: MessageSquare,
    title: "Conversational AI",
    description: "Craft prompts for chatbots, assistants, and multi-turn dialogues.",
    level: "Foundation",
    lessons: 8,
  },
  {
    icon: Code,
    title: "Code Generation",
    description: "Write prompts that generate clean, efficient, and documented code.",
    level: "Intermediate",
    lessons: 15,
  },
  {
    icon: Lightbulb,
    title: "Creative Writing",
    description: "Unlock AI creativity for storytelling and artistic expression.",
    level: "Intermediate",
    lessons: 10,
  },
  {
    icon: Rocket,
    title: "Advanced Techniques",
    description: "Chain-of-thought, few-shot learning, and sophisticated strategies.",
    level: "Advanced",
    lessons: 18,
  },
  {
    icon: Shield,
    title: "Ethics & Safety",
    description: "Build responsible AI interactions with proper guardrails.",
    level: "Essential",
    lessons: 6,
  },
];

const levelColors: Record<string, string> = {
  Foundation: "text-emerald-400 border-emerald-400/30",
  Intermediate: "text-foreground border-foreground/30",
  Advanced: "text-rose-400 border-rose-400/30",
  Essential: "text-sky-400 border-sky-400/30",
};

export function LearningModules() {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-muted-foreground text-sm font-medium tracking-widest uppercase mb-4 block">
            Curriculum
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-semibold mb-4">
            Structured <span className="text-foreground">Learning Paths</span>
          </h2>
          <div className="divider max-w-xs mx-auto mb-6" />
          <p className="text-muted-foreground max-w-2xl mx-auto">
            From foundations to advanced techniques, our curated modules guide you 
            through every aspect of prompt engineering with precision.
          </p>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module, index) => (
            <div
              key={index}
              className={cn(
                "group relative p-8 bg-card border border-border transition-all duration-500",
                "hover:border-foreground/40 hover:shadow-xl hover:shadow-foreground/5 cursor-pointer"
              )}
            >
              {/* Icon */}
              <div className="w-12 h-12 flex items-center justify-center border border-border mb-6">
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
                <span className={cn("px-3 py-1 text-xs font-medium border", levelColors[module.level])}>
                  {module.level}
                </span>
                <span className="text-xs text-muted-foreground">
                  {module.lessons} lessons
                </span>
              </div>

              {/* Hover Arrow */}
              <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                <ArrowRight className="w-5 h-5 text-foreground" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
