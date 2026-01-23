import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BookOpen, Clock, Users, Play, CheckCircle, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const courses = [
  {
    id: 1,
    title: "Prompt Engineering Fundamentals",
    description: "Master the core principles of effective prompt design and AI communication.",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&q=80",
    duration: "4 hours",
    lessons: 12,
    students: 2453,
    level: "Beginner",
    progress: 100,
  },
  {
    id: 2,
    title: "Advanced Prompting Techniques",
    description: "Chain-of-thought, few-shot learning, and sophisticated prompting strategies.",
    image: "https://images.unsplash.com/photo-1676299081847-824916de030a?w=600&q=80",
    duration: "6 hours",
    lessons: 18,
    students: 1876,
    level: "Advanced",
    progress: 45,
  },
  {
    id: 3,
    title: "AI for Code Generation",
    description: "Learn to write prompts that generate clean, efficient, and documented code.",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80",
    duration: "5 hours",
    lessons: 15,
    students: 3201,
    level: "Intermediate",
    progress: 0,
  },
  {
    id: 4,
    title: "Creative Writing with AI",
    description: "Unlock AI creativity for storytelling, content creation, and artistic expression.",
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&q=80",
    duration: "3 hours",
    lessons: 10,
    students: 1542,
    level: "Intermediate",
    progress: 0,
  },
  {
    id: 5,
    title: "Building AI Assistants",
    description: "Design conversational AI experiences with personality and purpose.",
    image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=600&q=80",
    duration: "7 hours",
    lessons: 20,
    students: 982,
    level: "Advanced",
    progress: 0,
    locked: true,
  },
  {
    id: 6,
    title: "AI Ethics & Safety",
    description: "Build responsible AI interactions with guardrails and ethical considerations.",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&q=80",
    duration: "2 hours",
    lessons: 6,
    students: 4521,
    level: "All Levels",
    progress: 0,
  },
];

const levelColors: Record<string, string> = {
  Beginner: "bg-green-500/20 text-green-400 border-green-500/30",
  Intermediate: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  Advanced: "bg-red-500/20 text-red-400 border-red-500/30",
  "All Levels": "bg-neon-blue/20 text-neon-blue border-neon-blue/30",
};

const Learn = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Learning <span className="text-gradient">Paths</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Structured courses designed to take you from beginner to expert in prompt engineering.
            </p>
          </div>

          {/* Course Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course.id}
                className={cn(
                  "group relative rounded-2xl glass border overflow-hidden transition-all duration-500",
                  "hover:border-neon-blue/50 hover:shadow-lg hover:shadow-neon-blue/10",
                  course.locked && "opacity-60"
                )}
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                  {course.locked && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/60">
                      <Lock className="w-10 h-10 text-muted-foreground" />
                    </div>
                  )}
                  {course.progress > 0 && !course.locked && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-background/80 text-xs font-medium">
                      {course.progress === 100 ? (
                        <>
                          <CheckCircle className="w-3 h-3 text-green-400" />
                          <span className="text-green-400">Complete</span>
                        </>
                      ) : (
                        <span className="text-neon-blue">{course.progress}%</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium border", levelColors[course.level])}>
                      {course.level}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-neon-blue transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {course.description}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>{course.lessons} lessons</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      <span>{course.students.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {course.progress > 0 && (
                    <div className="h-1.5 bg-muted rounded-full mb-4 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-neon-blue to-neon-purple rounded-full transition-all"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  )}

                  <Button
                    variant={course.locked ? "outline" : "neon"}
                    className="w-full"
                    disabled={course.locked}
                  >
                    {course.locked ? (
                      "Unlock Course"
                    ) : course.progress === 100 ? (
                      "Review Course"
                    ) : course.progress > 0 ? (
                      <>
                        <Play className="w-4 h-4" />
                        Continue
                      </>
                    ) : (
                      "Start Learning"
                    )}
                  </Button>
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

export default Learn;
