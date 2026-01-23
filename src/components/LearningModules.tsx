import { BookOpen, Code, MessageSquare, Lightbulb, Rocket, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

// Learning module data
const modules = [
  {
    icon: BookOpen,
    title: "Fundamentals",
    description: "Master the basics of prompt structure, context, and clarity for effective AI communication.",
    level: "Beginner",
    lessons: 12,
    color: "neon-blue",
  },
  {
    icon: MessageSquare,
    title: "Conversational AI",
    description: "Learn to craft prompts for chatbots, assistants, and multi-turn conversations.",
    level: "Beginner",
    lessons: 8,
    color: "neon-purple",
  },
  {
    icon: Code,
    title: "Code Generation",
    description: "Write prompts that generate clean, efficient, and well-documented code.",
    level: "Intermediate",
    lessons: 15,
    color: "neon-blue",
  },
  {
    icon: Lightbulb,
    title: "Creative Writing",
    description: "Unlock AI creativity for storytelling, content creation, and artistic expression.",
    level: "Intermediate",
    lessons: 10,
    color: "neon-purple",
  },
  {
    icon: Rocket,
    title: "Advanced Techniques",
    description: "Chain-of-thought, few-shot learning, and cutting-edge prompting strategies.",
    level: "Advanced",
    lessons: 18,
    color: "neon-blue",
  },
  {
    icon: Shield,
    title: "Safety & Ethics",
    description: "Build responsible AI interactions with guardrails and ethical considerations.",
    level: "All Levels",
    lessons: 6,
    color: "neon-purple",
  },
];

// Level badge color mapping
const levelColors: Record<string, string> = {
  Beginner: "bg-green-500/20 text-green-400 border-green-500/30",
  Intermediate: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  Advanced: "bg-red-500/20 text-red-400 border-red-500/30",
  "All Levels": "bg-neon-blue/20 text-neon-blue border-neon-blue/30",
};

export function LearningModules() {
  return (
    <section className="py-24 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-grid opacity-20" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Structured <span className="text-gradient">Learning Paths</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            From fundamentals to advanced techniques, our curated modules guide you 
            through every aspect of prompt engineering.
          </p>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module, index) => (
            <div
              key={index}
              className={cn(
                "group relative p-6 rounded-2xl glass border transition-all duration-500",
                "hover:border-neon-blue/50 hover:shadow-lg hover:shadow-neon-blue/10",
                "hover:-translate-y-2 cursor-pointer"
              )}
            >
              {/* Icon */}
              <div
                className={cn(
                  "w-14 h-14 rounded-xl flex items-center justify-center mb-4",
                  "bg-gradient-to-br transition-all duration-300",
                  module.color === "neon-blue"
                    ? "from-neon-blue/20 to-neon-blue/5 group-hover:from-neon-blue/30"
                    : "from-neon-purple/20 to-neon-purple/5 group-hover:from-neon-purple/30"
                )}
              >
                <module.icon
                  className={cn(
                    "w-7 h-7",
                    module.color === "neon-blue" ? "text-neon-blue" : "text-neon-purple"
                  )}
                />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold mb-2 group-hover:text-gradient transition-all">
                {module.title}
              </h3>
              <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                {module.description}
              </p>

              {/* Meta */}
              <div className="flex items-center justify-between">
                <span
                  className={cn(
                    "px-3 py-1 rounded-full text-xs font-medium border",
                    levelColors[module.level]
                  )}
                >
                  {module.level}
                </span>
                <span className="text-xs text-muted-foreground">
                  {module.lessons} lessons
                </span>
              </div>

              {/* Hover Glow Effect */}
              <div
                className={cn(
                  "absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl",
                  module.color === "neon-blue" ? "bg-neon-blue/10" : "bg-neon-purple/10"
                )}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
