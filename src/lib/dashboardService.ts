// Dashboard service for real data integration
import { SupabaseService, isSupabaseConfigured, supabase, supabaseAdmin } from './supabase';
import type { DashboardStats, WeeklyProgress, RecentActivity } from '@/types/database';

export class SupabaseDashboardService {
  // Get comprehensive dashboard statistics
  static async getDashboardStats(userId: string): Promise<DashboardStats> {
    try {
      // Get total points from point_transactions
      const client = supabaseAdmin || supabase;
      if (!client) {
        console.warn('Supabase not configured, returning default stats');
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

      console.log('Fetching dashboard stats for user:', userId);

      // Calculate total points
      const { data: pointsData, error: pointsError } = await client
        .from('point_transactions')
        .select('points')
        .eq('user_id', userId);

      if (pointsError) {
        console.error('Error fetching points:', pointsError);
      }

      const totalPoints = pointsData?.reduce((sum, t) => sum + t.points, 0) || 0;
      console.log('Total points:', totalPoints);

      // Get challenge completions count (unique challenge titles)
      const { data: challengeData, error: challengeError } = await client
        .from('point_transactions')
        .select('title')
        .eq('user_id', userId)
        .eq('source_type', 'challenge');

      if (challengeError) {
        console.error('Error fetching challenges:', challengeError);
      }

      const completedChallenges = challengeData?.length || 0;
      console.log('Completed challenges:', completedChallenges);

      return {
        totalPoints,
        completedChallenges,
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
    const defaultWeek = [
      { day: "Mon", value: 0, points: 0, activities: 0 },
      { day: "Tue", value: 0, points: 0, activities: 0 },
      { day: "Wed", value: 0, points: 0, activities: 0 },
      { day: "Thu", value: 0, points: 0, activities: 0 },
      { day: "Fri", value: 0, points: 0, activities: 0 },
      { day: "Sat", value: 0, points: 0, activities: 0 },
      { day: "Sun", value: 0, points: 0, activities: 0 },
    ];

    try {
      const client = supabaseAdmin || supabase;
      if (!client) {
        console.warn('Supabase not configured, returning default week');
        return defaultWeek;
      }

      console.log('Fetching weekly progress for user:', userId);

      // Get points from the last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data, error } = await client
        .from('point_transactions')
        .select('points, created_at')
        .eq('user_id', userId)
        .gte('created_at', sevenDaysAgo.toISOString())
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching weekly progress:', error);
        return defaultWeek;
      }

      // Group by day of week
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const today = new Date().getDay();
      const weekData: WeeklyProgress[] = [];

      // Initialize all days
      for (let i = 0; i < 7; i++) {
        const dayIndex = (today - 6 + i + 7) % 7;
        weekData.push({
          day: dayNames[dayIndex],
          value: 0,
          points: 0,
          activities: 0
        });
      }

      // Fill in actual data
      data?.forEach(transaction => {
        const date = new Date(transaction.created_at);
        const daysAgo = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysAgo < 7) {
          const index = 6 - daysAgo;
          if (index >= 0 && index < 7) {
            weekData[index].points += transaction.points;
            weekData[index].activities += 1;
          }
        }
      });

      // Calculate value as percentage of max
      const maxPoints = Math.max(...weekData.map(d => d.points), 1);
      weekData.forEach(day => {
        day.value = Math.round((day.points / maxPoints) * 100);
      });

      console.log('Weekly progress:', weekData);
      return weekData;
    } catch (error) {
      console.error('Error fetching weekly progress:', error);
      return defaultWeek;
    }
  }

  // Get recent activity feed
  static async getRecentActivity(userId: string, limit: number = 10): Promise<RecentActivity[]> {
    try {
      const client = supabaseAdmin || supabase;
      if (!client) {
        console.warn('Supabase not configured, returning empty activity');
        return [];
      }

      console.log('Fetching recent activity for user:', userId);

      const { data: activities, error } = await client
        .from('point_transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching recent activity:', error);
        return [];
      }
      
      const result = (activities || []).map(activity => ({
        id: activity.id,
        type: activity.source_type as any,
        title: activity.title,
        points: activity.points,
        time: formatTimeAgo(activity.created_at),
        icon: getActivityIcon(activity.source_type),
        color: getActivityColor(activity.source_type)
      }));

      console.log('Recent activity:', result);
      return result;
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
    source_id?: string | null;
    metadata?: Record<string, any>;
  }): Promise<boolean> {
    try {
      await SupabaseService.addPoints({
        user_id: userId,
        points: activity.points,
        transaction_type: 'earned',
        source_type: activity.source_type,
        source_id: activity.source_id || null,
        title: activity.title,
        description: activity.description,
        metadata: activity.metadata
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

console.log('Dashboard Service Configuration:', {
  isDevelopment,
  hasSupabase,
  usingService: hasSupabase ? 'SupabaseDashboardService' : 'MockDashboardService'
});

export const dashboardService = hasSupabase ? SupabaseDashboardService : MockDashboardService;