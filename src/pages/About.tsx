import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Sparkles, Users, Target, Zap, Github, Twitter, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";

const team = [
  {
    name: "Alex Chen",
    role: "Founder & CEO",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80",
    bio: "Former AI researcher at DeepMind, passionate about democratizing AI education.",
  },
  {
    name: "Sarah Mitchell",
    role: "Head of Curriculum",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80",
    bio: "10+ years in education technology, designed courses for 500K+ students.",
  },
  {
    name: "Marcus Johnson",
    role: "Lead Engineer",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80",
    bio: "Full-stack developer with expertise in AI/ML systems and scalable platforms.",
  },
];

const values = [
  {
    icon: Users,
    title: "Community First",
    description: "We believe learning is better together. Our platform fosters collaboration and peer learning.",
  },
  {
    icon: Target,
    title: "Practical Skills",
    description: "Every lesson is designed with real-world applications in mind. Learn by doing, not just reading.",
  },
  {
    icon: Zap,
    title: "Always Evolving",
    description: "AI moves fast. We update our curriculum weekly to reflect the latest techniques and best practices.",
  },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Hero */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-border mb-6">
              <Sparkles className="w-4 h-4 text-foreground" />
              <span className="text-sm text-muted-foreground">Our Story</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Making AI Skills <br />
              <span className="text-foreground">Accessible to Everyone</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We started PromptLab with a simple mission: to help anyone master the art of 
              communicating with AI, regardless of their technical background.
            </p>
          </div>

          {/* Values */}
          <div className="grid md:grid-cols-3 gap-6 mb-20">
            {values.map((value, i) => (
              <div key={i} className="glass rounded-2xl border p-8 text-center transition-all hover:border-foreground/50">
                <div className="w-14 h-14 mx-auto rounded-xl bg-accent flex items-center justify-center mb-4">
                  <value.icon className="w-7 h-7 text-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="glass rounded-2xl border p-8 mb-20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { value: "50K+", label: "Active Learners" },
                { value: "200+", label: "Learning Modules" },
                { value: "95%", label: "Satisfaction Rate" },
                { value: "40+", label: "Countries Reached" },
              ].map((stat, i) => (
                <div key={i}>
                  <p className="text-3xl md:text-4xl font-bold text-foreground mb-1">{stat.value}</p>
                  <p className="text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Team */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Meet the <span className="text-foreground">Team</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              We're a small team of educators, engineers, and AI enthusiasts dedicated to making 
              prompt engineering accessible.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-20">
            {team.map((member, i) => (
              <div key={i} className="glass rounded-2xl border p-6 text-center transition-all hover:border-foreground/50 group">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                  <div className="absolute inset-0 rounded-full bg-foreground/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="text-lg font-semibold">{member.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{member.role}</p>
                <p className="text-sm text-muted-foreground mb-4">{member.bio}</p>
                <div className="flex justify-center gap-2">
                  {[Twitter, Linkedin, Github].map((Icon, j) => (
                    <button
                      key={j}
                      className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-all"
                    >
                      <Icon className="w-4 h-4" />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center glass rounded-2xl border p-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Join thousands of learners mastering prompt engineering with PromptLab.
            </p>
            <Button variant="default" size="lg">
              Get Started Free
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
