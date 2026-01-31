import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { 
  Trophy, 
  Flame, 
  Star, 
  Target, 
  TrendingUp, 
  BookOpen, 
  Clock, 
  Award, 
  CheckCircle, 
  Play, 
  Calendar,
  BarChart3,
  Zap,
  Users,
  Brain,
  Sparkles,
  ArrowRight,
  Medal,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { challenges as challengesFromSchema } from "@/lib/challengesData";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { dashboardService } from "@/lib/dashboardService";
import type { DashboardStats, WeeklyProgress, RecentActivity } from "@/types/database";

// Convert challenges data for dashboard use
const challengesData = challengesFromSchema.map((challenge, index) => ({
  id: index + 1,
  title: challenge.title,
  description: challenge.description,
  difficulty: challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1),
  time: challenge.estimatedTime,
  points: challenge.points,
  participants: challenge.participants,
  status: "available" as const,
  score: null as number | null,
  featured: challenge.featured,
  category: challenge.category || "general"
}));

const Dashboard = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalPoints: 0,
    completedChallenges: 0,
    currentStreak: 0,
    globalRank: 0,
    savedPrompts: 0,
    averageScore: 0,
    practicesSessions: 0,
    achievementsEarned: 0
  });

  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [weeklyProgress, setWeeklyProgress] = useState<WeeklyProgress[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Load dashboard data when user is available
  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user) {
        console.log('No user, skipping dashboard data load');
        return;
      }
      
      console.log('Loading dashboard data for user:', user.id);
      setDataLoading(true);
      
      // Add timeout to prevent infinite loading
      const timeoutId = setTimeout(() => {
        console.error('Dashboard data loading timed out');
        setDataLoading(false);
      }, 10000);
      
      try {
        // Load all dashboard data in parallel
        console.log('Fetching stats, weekly progress, and activity...');
        const [statsData, weeklyData, activityData] = await Promise.all([
          dashboardService.getDashboardStats(user.id),
          dashboardService.getWeeklyProgress(user.id),
          dashboardService.getRecentActivity(user.id, 10)
        ]);

        console.log('Dashboard data loaded:', { statsData, weeklyData, activityData });

        setStats(statsData);
        setWeeklyProgress(weeklyData);
        
        // Convert activity data to include icon components
        const activityWithIcons = activityData.map(activity => ({
          ...activity,
          icon: getActivityIconComponent(activity.icon),
        }));
        setRecentActivity(activityWithIcons);
        
        clearTimeout(timeoutId);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        clearTimeout(timeoutId);
      } finally {
        setDataLoading(false);
      }
    };

    if (user && !loading) {
      loadDashboardData();
    } else {
      console.log('Waiting for auth...', { user: !!user, loading });
    }
  }, [user, loading]);

  // Helper function to get icon components
  const getActivityIconComponent = (iconName: string) => {
    const iconMap: Record<string, React.ComponentType<any>> = {
      Trophy,
      Star,
      Brain,
      Medal,
      BookOpen,
      Target,
      Flame,
      Activity
    };
    return iconMap[iconName] || Star;
  };

  // Get next recommended challenges
  const recommendedChallenges = challengesData
    .filter(c => c.featured || c.difficulty === "Beginner")
    .slice(0, 3);

  // Calculate achievements based on real data
  const achievements = [
    { 
      icon: "🎯", 
      title: "First Steps", 
      description: "Complete your first challenge", 
      unlocked: stats.completedChallenges > 0,
      progress: Math.min(stats.completedChallenges, 1)
    },
    { 
      icon: "🔥", 
      title: "On Fire", 
      description: "7 day learning streak", 
      unlocked: stats.currentStreak >= 7,
      progress: Math.min(stats.currentStreak / 7, 1)
    },
    { 
      icon: "📚", 
      title: "Bookworm", 
      description: "Save 5 prompts", 
      unlocked: stats.savedPrompts >= 5,
      progress: Math.min(stats.savedPrompts / 5, 1)
    },
    { 
      icon: "🏆", 
      title: "Champion", 
      description: "Reach top 100 on leaderboard", 
      unlocked: stats.globalRank <= 100 && stats.globalRank > 0,
      progress: stats.globalRank <= 100 && stats.globalRank > 0 ? 1 : Math.max(0, (500 - stats.globalRank) / 400)
    },
    { 
      icon: "⭐", 
      title: "Expert", 
      description: "Average score above 90%", 
      unlocked: stats.averageScore >= 90,
      progress: Math.min(stats.averageScore / 90, 1)
    },
    { 
      icon: "🚀", 
      title: "Speedster", 
      description: "Complete 10 challenges", 
      unlocked: stats.completedChallenges >= 10,
      progress: Math.min(stats.completedChallenges / 10, 1)
    },
  ];

  const unlockedAchievements = achievements.filter(a => a.unlocked).length;

  if (loading || dataLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[50vh] pt-24">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your dashboard...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[50vh] pt-24">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Please sign in to view your dashboard</h2>
            <p className="text-muted-foreground mb-4">Track your progress and achievements</p>
            <Link to="/login">
              <Button>Sign In</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <span className="text-muted-foreground text-sm font-medium tracking-widest uppercase mb-4 block">
              Dashboard
            </span>
            <h1 className="text-3xl md:text-4xl font-heading font-semibold mb-2">
              Welcome back, <span className="text-foreground">{user?.name}</span>
            </h1>
            <p className="text-muted-foreground">
              Track your progress and continue your path to prompt engineering mastery.
            </p>
          </motion.div>

          {/* Stats Cards */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            {[
              { 
                icon: Trophy, 
                label: "Global Rank", 
                value: `#${stats.globalRank}`, 
                color: "text-amber-400",
                change: "+12 this week"
              },
              { 
                icon: Flame, 
                label: "Current Streak", 
                value: `${stats.currentStreak} days`, 
                color: "text-orange-400",
                change: "Keep it up!"
              },
              { 
                icon: Star, 
                label: "Total Points", 
                value: stats.totalPoints.toLocaleString(), 
                color: "text-blue-400",
                change: `+${Math.floor(stats.totalPoints * 0.1)} this week`
              },
              { 
                icon: Target, 
                label: "Challenges Done", 
                value: stats.completedChallenges.toString(), 
                color: "text-emerald-400",
                change: `${challengesData.length - stats.completedChallenges} remaining`
              },
            ].map((stat, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-6 transition-all hover:border-foreground/40 hover:shadow-lg"
              >
                <div className="flex items-center justify-between mb-3">
                  <stat.icon className={cn("w-8 h-8", stat.color)} />
                  <div className="text-right">
                    <p className="text-2xl font-heading font-bold">{stat.value}</p>
                  </div>
                </div>
                <p className="text-sm font-medium text-foreground mb-1">{stat.label}</p>
                <p className="text-xs text-muted-foreground">{stat.change}</p>
              </motion.div>
            ))}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Weekly Progress */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-2 bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Weekly Progress
                </h2>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span>+{Math.floor(Math.random() * 30) + 10}% vs last week</span>
                </div>
              </div>
              
              <div className="flex items-end justify-between h-48 gap-3">
                {weeklyProgress.map((day, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full bg-muted/30 rounded-t-lg relative overflow-hidden group cursor-pointer" style={{ height: `${Math.max(day.value, 8)}%` }}>
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-t from-foreground to-foreground/80"
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                        style={{ transformOrigin: "bottom" }}
                      />
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-foreground text-background px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {day.points || 0} pts
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground font-medium">{day.day}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-muted/30 rounded-xl">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>This week's total:</span>
                  <span className="font-semibold text-foreground">
                    {weeklyProgress.reduce((sum, day) => sum + (day.points || 0), 0)} points
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-6"
            >
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Quick Actions
              </h2>
              <div className="space-y-3">
                <Link to="/challenges">
                  <Button className="w-full justify-between group">
                    <span className="flex items-center gap-2">
                      <Trophy className="w-4 h-4" />
                      New Challenge
                    </span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                
                <Link to="/practice">
                  <Button variant="outline" className="w-full justify-between group">
                    <span className="flex items-center gap-2">
                      <Brain className="w-4 h-4" />
                      Practice Arena
                    </span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                
                <Link to="/library">
                  <Button variant="outline" className="w-full justify-between group">
                    <span className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      Browse Library
                    </span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>

              {/* Performance Summary */}
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl">
                <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Performance
                </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Average Score</span>
                      <span className="font-semibold">{stats.averageScore}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Completion Rate</span>
                      <span className="font-semibold">{challengesData.length > 0 ? Math.floor((stats.completedChallenges / challengesData.length) * 100) : 0}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Saved Prompts</span>
                      <span className="font-semibold">{stats.savedPrompts}</span>
                    </div>
                  </div>
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-6"
            >
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Recent Activity
              </h2>
              <div className="space-y-4">
                {recentActivity.map((activity, i) => (
                  <motion.div 
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/30 transition-colors"
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center bg-muted/50",
                    )}>
                      <activity.icon className={cn("w-5 h-5", activity.color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                    {activity.points > 0 && (
                      <span className="text-sm font-medium text-emerald-400">+{activity.points}</span>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Recommended Challenges */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="lg:col-span-2 bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Recommended for You
                </h2>
                <Link to="/challenges">
                  <Button variant="ghost" size="sm" className="gap-1">
                    View All
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
              
              <div className="grid gap-4">
                {recommendedChallenges.map((challenge, i) => (
                  <motion.div
                    key={challenge.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + i * 0.1 }}
                    className="p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors border border-border/30 hover:border-border/60 group cursor-pointer"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={cn(
                            "px-2 py-0.5 rounded-full text-xs font-medium",
                            challenge.difficulty === "Beginner" && "bg-emerald-400/20 text-emerald-400",
                            challenge.difficulty === "Intermediate" && "bg-amber-400/20 text-amber-400",
                            challenge.difficulty === "Advanced" && "bg-rose-400/20 text-rose-400"
                          )}>
                            {challenge.difficulty}
                          </span>
                          {challenge.featured && (
                            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-400/20 text-blue-400">
                              Featured
                            </span>
                          )}
                        </div>
                        <h3 className="font-semibold text-foreground mb-1 group-hover:text-foreground transition-colors">
                          {challenge.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                          {challenge.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {challenge.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="w-3 h-3" />
                            {challenge.points} pts
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {challenge.participants.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all ml-4" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Achievements */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Achievements
                </h2>
                <span className="text-sm text-muted-foreground">{unlockedAchievements}/{achievements.length} unlocked</span>
              </div>
              
              <div className="space-y-3">
                {achievements.map((badge, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + i * 0.05 }}
                    className={cn(
                      "p-3 rounded-xl transition-all border",
                      badge.unlocked
                        ? "bg-muted/50 border-border/50 hover:bg-muted/70"
                        : "bg-muted/20 border-border/20 opacity-60"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{badge.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium text-sm">{badge.title}</p>
                          {badge.unlocked && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{badge.description}</p>
                        {!badge.unlocked && (
                          <div className="w-full bg-muted/30 rounded-full h-1.5">
                            <div 
                              className="bg-foreground/60 h-1.5 rounded-full transition-all duration-500"
                              style={{ width: `${badge.progress * 100}%` }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
