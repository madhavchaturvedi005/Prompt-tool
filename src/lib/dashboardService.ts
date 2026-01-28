// Dashboard service for real data integration
import { SupabaseService, isSupabaseConfigured } from './supabase';
import type { DashboardStats, WeeklyProgress, RecentActivity } from '@/types/database';

export class SupabaseDashboardService {
  // Get comprehensive dashboard statistics
  static async getDashboardStats(userId: string): Promise<DashboardStats> {
    try {
      const stats = await SupabaseService.getDashboardStats(userId);
      return stats || {
        totalPoints: 0,
        completedChallenges: 0,
        currentStreak: 0,
        globalRank: 0,
        savedPrompts: 0,
        averageScore: 0,
        practicesSessions: 0,
        achievementsEarned: 0
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Return fallback data
      return {
        totalPoints: 0,
        completedChallenges: 0,
        currentStreak: 0,
        globalRank: 0,
        savedPrompts: 0,
        averageScore: 0,
        practicesSessions: 0,
        achievementsEarned: 0
      };
    }
  }

  // Get weekly progress data
  static async getWeeklyProgress(userId: string): Promise<WeeklyProgress[]> {
    try {
      const progress = await SupabaseService.getWeeklyProgress(userId);
      return progress || [
        { day: "Mon", value: 0, points: 0, activities: 0 },
        { day: "Tue", value: 0, points: 0, activities: 0 },
        { day: "Wed", value: 0, points: 0, activities: 0 },
        { day: "Thu", value: 0, points: 0, activities: 0 },
        { day: "Fri", value: 0, points: 0, activities: 0 },
        { day: "Sat", value: 0, points: 0, activities: 0 },
        { day: "Sun", value: 0, points: 0, activities: 0 },
      ];
    } catch (error) {
      console.error('Error fetching weekly progress:', error);
      // Return fallback data
      return [
        { day: "Mon", value: 0, points: 0, activities: 0 },
        { day: "Tue", value: 0, points: 0, activities: 0 },
        { day: "Wed", value: 0, points: 0, activities: 0 },
        { day: "Thu", value: 0, points: 0, activities: 0 },
        { day: "Fri", value: 0, points: 0, activities: 0 },
        { day: "Sat", value: 0, points: 0, activities: 0 },
        { day: "Sun", value: 0, points: 0, activities: 0 },
      ];
    }
  }

  // Get recent activity feed
  static async getRecentActivity(userId: string, limit: number = 10): Promise<RecentActivity[]> {
    try {
      const activities = await SupabaseService.getRecentActivity(userId, limit);
      
      return activities.map(activity => ({
        id: activity.id,
        type: activity.source_type as any,
        title: activity.title,
        points: activity.points,
        time: formatTimeAgo(activity.created_at),
        icon: getActivityIcon(activity.source_type),
        color: getActivityColor(activity.source_type)
      }));
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      return [];
    }
  }

  // Award points for various activities
  static async awardPoints(userId: string, activity: {
    points: number;
    source_type: string;
    title: string;
    description?: string;
    source_id?: string;
  }): Promise<boolean> {
    try {
      await SupabaseService.addPoints({
        user_id: userId,
        points: activity.points,
        transaction_type: 'earned',
        source_type: activity.source_type,
        source_id: activity.source_id,
        title: activity.title,
        description: activity.description
      });
      return true;
    } catch (error) {
      console.error('Error awarding points:', error);
      return false;
    }
  }
}

// Helper functions
function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minutes ago`;
  } else if (diffInMinutes < 1440) {
    return `${Math.floor(diffInMinutes / 60)} hours ago`;
  } else {
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  }
}

function getActivityIcon(type: string): string {
  const icons: Record<string, string> = {
    challenge: 'Trophy',
    practice: 'Brain',
    achievement: 'Medal',
    streak: 'Flame',
    course: 'BookOpen',
    admin: 'Star'
  };
  return icons[type] || 'Star';
}

function getActivityColor(type: string): string {
  const colors: Record<string, string> = {
    challenge: 'text-amber-400',
    practice: 'text-purple-400',
    achievement: 'text-emerald-400',
    streak: 'text-orange-400',
    course: 'text-blue-400',
    admin: 'text-foreground'
  };
  return colors[type] || 'text-foreground';
}

// Mock service for development when database is not available
export class MockDashboardService {
  static async getDashboardStats(userId: string): Promise<DashboardStats> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      totalPoints: Math.floor(Math.random() * 2000) + 500,
      completedChallenges: Math.floor(Math.random() * 8) + 2,
      currentStreak: Math.floor(Math.random() * 15) + 3,
      globalRank: Math.floor(Math.random() * 500) + 50,
      savedPrompts: Math.floor(Math.random() * 10) + 2,
      averageScore: Math.floor(Math.random() * 25) + 75,
      practicesSessions: Math.floor(Math.random() * 15) + 5,
      achievementsEarned: Math.floor(Math.random() * 6) + 2
    };
  }

  static async getWeeklyProgress(userId: string): Promise<WeeklyProgress[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return [
      { day: "Mon", value: Math.floor(Math.random() * 80) + 20, points: Math.floor(Math.random() * 150) + 50, activities: Math.floor(Math.random() * 5) + 1 },
      { day: "Tue", value: Math.floor(Math.random() * 80) + 20, points: Math.floor(Math.random() * 150) + 50, activities: Math.floor(Math.random() * 5) + 1 },
      { day: "Wed", value: Math.floor(Math.random() * 80) + 20, points: Math.floor(Math.random() * 150) + 50, activities: Math.floor(Math.random() * 5) + 1 },
      { day: "Thu", value: Math.floor(Math.random() * 80) + 20, points: Math.floor(Math.random() * 150) + 50, activities: Math.floor(Math.random() * 5) + 1 },
      { day: "Fri", value: Math.floor(Math.random() * 80) + 20, points: Math.floor(Math.random() * 150) + 50, activities: Math.floor(Math.random() * 5) + 1 },
      { day: "Sat", value: Math.floor(Math.random() * 80) + 20, points: Math.floor(Math.random() * 150) + 50, activities: Math.floor(Math.random() * 5) + 1 },
      { day: "Sun", value: Math.floor(Math.random() * 80) + 20, points: Math.floor(Math.random() * 150) + 50, activities: Math.floor(Math.random() * 5) + 1 },
    ];
  }

  static async getRecentActivity(userId: string, limit: number = 10): Promise<RecentActivity[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const activities = [
      { type: "challenge", title: "Completed Research Paper Summarizer Pro", points: 200, icon: "Trophy", color: "text-amber-400" },
      { type: "prompt_saved", title: "Saved Advanced Prompt Engineering Guide", points: 0, icon: "Star", color: "text-blue-400" },
      { type: "practice", title: "Practiced in Prompt Arena", points: 50, icon: "Brain", color: "text-purple-400" },
      { type: "achievement", title: "Earned 'Consistent Learner' badge", points: 100, icon: "Medal", color: "text-emerald-400" },
      { type: "course", title: "Completed Prompt Engineering Basics", points: 150, icon: "BookOpen", color: "text-blue-400" }
    ];

    return activities.slice(0, limit).map((activity, i) => ({
      id: `mock-${i}`,
      type: activity.type as any,
      title: activity.title,
      points: activity.points,
      time: `${Math.floor(Math.random() * 24) + 1} hours ago`,
      icon: activity.icon,
      color: activity.color
    }));
  }

  static async getChallengeProgress(userId: string) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      attempted: Math.floor(Math.random() * 10) + 5,
      completed: Math.floor(Math.random() * 5) + 2,
      averageScore: Math.floor(Math.random() * 25) + 75,
      recentSubmissions: []
    };
  }

  static async getPracticeStats(userId: string) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      totalSessions: Math.floor(Math.random() * 20) + 10,
      completedSessions: Math.floor(Math.random() * 15) + 8,
      averageScore: Math.floor(Math.random() * 25) + 75,
      recentSessions: []
    };
  }

  static async awardPoints(userId: string, activity: any): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return true;
  }
}

// Export the appropriate service based on environment
const isDevelopment = import.meta.env.NODE_ENV === 'development';
const hasSupabase = isSupabaseConfigured();

export const dashboardService = hasSupabase ? SupabaseDashboardService : MockDashboardService;