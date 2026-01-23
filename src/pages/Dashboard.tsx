import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Trophy, Flame, Star, Target, TrendingUp, BookOpen, Clock, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const recentActivity = [
  { type: "challenge", title: "Completed Email Assistant", points: 100, time: "2 hours ago" },
  { type: "lesson", title: "Finished Advanced Techniques Lesson 5", points: 25, time: "5 hours ago" },
  { type: "streak", title: "7 Day Streak Achievement!", points: 50, time: "1 day ago" },
  { type: "challenge", title: "Started Code Debugger Pro", points: 0, time: "1 day ago" },
];

const achievements = [
  { icon: "🎯", title: "First Steps", description: "Complete your first challenge", unlocked: true },
  { icon: "🔥", title: "On Fire", description: "7 day learning streak", unlocked: true },
  { icon: "📚", title: "Bookworm", description: "Complete 5 learning modules", unlocked: false },
  { icon: "🏆", title: "Champion", description: "Reach top 100 on leaderboard", unlocked: false },
  { icon: "⭐", title: "Expert", description: "Score 100% on any challenge", unlocked: true },
  { icon: "🚀", title: "Speedster", description: "Complete a challenge in half the time", unlocked: false },
];

const weeklyProgress = [
  { day: "Mon", value: 80 },
  { day: "Tue", value: 45 },
  { day: "Wed", value: 90 },
  { day: "Thu", value: 60 },
  { day: "Fri", value: 75 },
  { day: "Sat", value: 30 },
  { day: "Sun", value: 0 },
];

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Welcome back, <span className="text-gradient">Learner</span>
            </h1>
            <p className="text-muted-foreground">
              Track your progress and keep improving your prompt engineering skills.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { icon: Trophy, label: "Global Rank", value: "#127", color: "text-yellow-400" },
              { icon: Flame, label: "Current Streak", value: "7 days", color: "text-orange-400" },
              { icon: Star, label: "Total Points", value: "2,450", color: "text-neon-blue" },
              { icon: Target, label: "Challenges Done", value: "12", color: "text-green-400" },
            ].map((stat, i) => (
              <div key={i} className="glass rounded-xl border p-5 transition-all hover:border-neon-blue/50">
                <stat.icon className={cn("w-8 h-8 mb-3", stat.color)} />
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Weekly Progress */}
            <div className="lg:col-span-2 glass rounded-2xl border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Weekly Progress</h2>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <span>+23% vs last week</span>
                </div>
              </div>
              
              <div className="flex items-end justify-between h-48 gap-2">
                {weeklyProgress.map((day, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full bg-muted rounded-t-lg relative overflow-hidden" style={{ height: `${Math.max(day.value, 5)}%` }}>
                      <div className="absolute inset-0 bg-gradient-to-t from-neon-blue to-neon-purple opacity-80" />
                    </div>
                    <span className="text-xs text-muted-foreground">{day.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Continue Learning */}
            <div className="glass rounded-2xl border p-6">
              <h2 className="text-xl font-semibold mb-4">Continue Learning</h2>
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-muted/50">
                  <div className="flex items-center gap-3 mb-2">
                    <BookOpen className="w-5 h-5 text-neon-blue" />
                    <span className="font-medium">Advanced Techniques</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden mb-2">
                    <div className="h-full bg-gradient-to-r from-neon-blue to-neon-purple w-[45%]" />
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>45% complete</span>
                    <span>8/18 lessons</span>
                  </div>
                </div>
                <Button variant="neon" className="w-full">
                  Continue Course
                </Button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="glass rounded-2xl border p-6">
              <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {recentActivity.map((activity, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center",
                      activity.type === "challenge" && "bg-neon-blue/20",
                      activity.type === "lesson" && "bg-neon-purple/20",
                      activity.type === "streak" && "bg-orange-400/20"
                    )}>
                      {activity.type === "challenge" && <Target className="w-5 h-5 text-neon-blue" />}
                      {activity.type === "lesson" && <BookOpen className="w-5 h-5 text-neon-purple" />}
                      {activity.type === "streak" && <Flame className="w-5 h-5 text-orange-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                    {activity.points > 0 && (
                      <span className="text-sm font-medium text-neon-blue">+{activity.points}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div className="lg:col-span-2 glass rounded-2xl border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Achievements</h2>
                <span className="text-sm text-muted-foreground">3/6 unlocked</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {achievements.map((badge, i) => (
                  <div
                    key={i}
                    className={cn(
                      "p-4 rounded-xl text-center transition-all",
                      badge.unlocked
                        ? "bg-muted/50 hover:bg-muted"
                        : "bg-muted/20 opacity-50"
                    )}
                  >
                    <span className="text-3xl mb-2 block">{badge.icon}</span>
                    <p className="font-medium text-sm">{badge.title}</p>
                    <p className="text-xs text-muted-foreground">{badge.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
