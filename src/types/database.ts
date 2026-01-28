// Database Types for PromptLab
// TypeScript interfaces corresponding to the database schema

export interface User {
  id: string;
  email: string;
  username: string;
  full_name: string;
  password_hash: string;
  email_verified: boolean;
  avatar_url?: string;
  bio?: string;
  location?: string;
  website_url?: string;
  github_username?: string;
  twitter_username?: string;
  linkedin_url?: string;
  created_at: Date;
  updated_at: Date;
  last_login_at?: Date;
  is_active: boolean;
  is_premium: boolean;
  premium_expires_at?: Date;
}

export interface UserSession {
  id: string;
  user_id: string;
  session_token: string;
  refresh_token?: string;
  expires_at: Date;
  created_at: Date;
  last_accessed_at: Date;
  ip_address?: string;
  user_agent?: string;
  is_active: boolean;
}

export interface UserProfile {
  id: string;
  user_id: string;
  preferred_difficulty: 'beginner' | 'intermediate' | 'advanced';
  learning_goals: string[];
  interests: string[];
  skill_level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  email_notifications: boolean;
  challenge_reminders: boolean;
  achievement_notifications: boolean;
  weekly_digest: boolean;
  marketing_emails: boolean;
  profile_visibility: 'public' | 'friends' | 'private';
  show_progress: boolean;
  show_achievements: boolean;
  show_leaderboard: boolean;
  timezone: string;
  locale: string;
  created_at: Date;
  updated_at: Date;
}

export interface UserStatistics {
  id: string;
  user_id: string;
  total_points: number;
  current_streak: number;
  longest_streak: number;
  global_rank?: number;
  challenges_completed: number;
  challenges_attempted: number;
  average_score: number;
  total_time_spent: number; // minutes
  practice_sessions: number;
  prompts_evaluated: number;
  prompts_saved: number;
  prompts_shared: number;
  courses_completed: number;
  lessons_completed: number;
  last_activity_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface PointTransaction {
  id: string;
  user_id: string;
  points: number;
  transaction_type: 'earned' | 'bonus' | 'penalty' | 'refund' | 'adjustment';
  source_type: 'challenge' | 'practice' | 'achievement' | 'streak' | 'referral' | 'admin' | 'course' | 'daily_login';
  source_id?: string;
  title: string;
  description?: string;
  metadata?: Record<string, any>;
  created_at: Date;
}

export interface Achievement {
  id: string;
  name: string;
  title: string;
  description: string;
  icon: string;
  category: 'challenges' | 'practice' | 'learning' | 'social' | 'streak' | 'special';
  requirement_type: 'count' | 'streak' | 'score' | 'time' | 'percentage' | 'custom';
  requirement_value?: number;
  requirement_data?: Record<string, any>;
  points_reward: number;
  badge_tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  is_active: boolean;
  is_hidden: boolean;
  sort_order: number;
  created_at: Date;
  updated_at: Date;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  progress_current: number;
  progress_required: number;
  is_completed: boolean;
  completed_at?: Date;
  points_earned: number;
  created_at: Date;
  updated_at: Date;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  full_description?: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimated_time?: string;
  points: number;
  max_attempts: number;
  time_limit?: number; // minutes
  objectives: string[];
  requirements: Record<string, any>;
  test_cases: Record<string, any>;
  evaluation_criteria: Record<string, any>;
  hints: string[];
  tags: string[];
  sample_solution?: Record<string, any>;
  is_active: boolean;
  is_featured: boolean;
  is_premium: boolean;
  sort_order: number;
  week_number?: number;
  total_attempts: number;
  total_completions: number;
  average_score: number;
  created_by?: string;
  created_at: Date;
  updated_at: Date;
  published_at?: Date;
}

export interface ChallengeSubmission {
  id: string;
  user_id: string;
  challenge_id: string;
  prompt_text: string;
  submission_notes?: string;
  overall_score?: number;
  criteria_scores?: Record<string, number>;
  ai_feedback?: string;
  evaluation_metadata?: Record<string, any>;
  attempt_number: number;
  time_spent?: number; // minutes
  is_completed: boolean;
  points_earned: number;
  bonus_points: number;
  status: 'draft' | 'submitted' | 'evaluating' | 'completed' | 'failed';
  started_at: Date;
  submitted_at?: Date;
  completed_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface PracticeSession {
  id: string;
  user_id: string;
  session_name?: string;
  prompt_text: string;
  prompt_type?: string;
  overall_score?: number;
  criteria_scores?: Record<string, number>;
  applicable_criteria: string[];
  ai_feedback?: string;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  evaluation_model: string;
  evaluation_time?: number; // milliseconds
  session_duration?: number; // minutes
  status: 'draft' | 'evaluating' | 'completed' | 'failed';
  points_earned: number;
  created_at: Date;
  updated_at: Date;
}

export interface SavedPrompt {
  id: string;
  user_id: string;
  prompt_id: string; // External ID
  prompt_title: string;
  prompt_text: string;
  prompt_description?: string;
  category?: string;
  tags: string[];
  difficulty?: string;
  folder_name?: string;
  user_notes?: string;
  is_favorite: boolean;
  times_used: number;
  last_used_at?: Date;
  source_url?: string;
  source_provider?: string;
  original_author?: string;
  created_at: Date;
  updated_at: Date;
}

export interface PromptCollection {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  is_public: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CollectionPrompt {
  id: string;
  collection_id: string;
  saved_prompt_id: string;
  sort_order: number;
  created_at: Date;
}

export interface CourseProgress {
  id: string;
  user_id: string;
  course_id: string;
  course_title: string;
  course_provider?: string;
  lessons_completed: number;
  total_lessons: number;
  completion_percentage: number;
  is_completed: boolean;
  time_spent: number; // minutes
  last_lesson_completed?: string;
  started_at: Date;
  completed_at?: Date;
  certificate_url?: string;
  created_at: Date;
  updated_at: Date;
}

export interface UserFollow {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: Date;
}

export interface ActivityFeed {
  id: string;
  user_id: string;
  activity_type: 'challenge_completed' | 'achievement_earned' | 'course_completed' | 'streak_milestone' | 'rank_improved';
  title: string;
  description?: string;
  reference_type?: string;
  reference_id?: string;
  is_public: boolean;
  metadata?: Record<string, any>;
  created_at: Date;
}

export interface Notification {
  id: string;
  user_id: string;
  type: 'achievement' | 'challenge' | 'reminder' | 'system' | 'social' | 'course';
  title: string;
  message: string;
  action_url?: string;
  action_text?: string;
  is_read: boolean;
  is_sent: boolean;
  metadata?: Record<string, any>;
  created_at: Date;
  read_at?: Date;
  sent_at?: Date;
}

export interface SystemSetting {
  id: string;
  key: string;
  value: Record<string, any>;
  description?: string;
  is_public: boolean;
  created_at: Date;
  updated_at: Date;
}

// View Types
export interface UserLeaderboard {
  id: string;
  username: string;
  full_name: string;
  avatar_url?: string;
  total_points: number;
  global_rank?: number;
  challenges_completed: number;
  current_streak: number;
  average_score: number;
  current_rank: number;
}

export interface UserProgressSummary {
  user_id: string;
  username: string;
  full_name: string;
  total_points: number;
  challenges_completed: number;
  current_streak: number;
  average_score: number;
  achievements_earned: number;
  prompts_saved: number;
  practice_sessions: number;
}

export interface ChallengeStatistics {
  id: string;
  title: string;
  difficulty: string;
  category: string;
  points: number;
  total_submissions: number;
  completions: number;
  average_score: number;
  average_time_minutes: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Dashboard Data Types
export interface DashboardStats {
  totalPoints: number;
  completedChallenges: number;
  currentStreak: number;
  globalRank: number;
  savedPrompts: number;
  averageScore: number;
  practicesSessions: number;
  achievementsEarned: number;
}

export interface WeeklyProgress {
  day: string;
  value: number;
  points: number;
  activities: number;
}

export interface RecentActivity {
  id: string;
  type: 'challenge' | 'practice' | 'achievement' | 'prompt_saved' | 'course';
  title: string;
  points: number;
  time: string;
  icon: string;
  color: string;
}

// Form Types
export interface CreateUserRequest {
  email: string;
  username: string;
  full_name: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UpdateProfileRequest {
  full_name?: string;
  bio?: string;
  location?: string;
  website_url?: string;
  github_username?: string;
  twitter_username?: string;
  linkedin_url?: string;
}

export interface UpdatePreferencesRequest {
  preferred_difficulty?: 'beginner' | 'intermediate' | 'advanced';
  learning_goals?: string[];
  interests?: string[];
  email_notifications?: boolean;
  challenge_reminders?: boolean;
  achievement_notifications?: boolean;
  weekly_digest?: boolean;
  profile_visibility?: 'public' | 'friends' | 'private';
  show_progress?: boolean;
  show_achievements?: boolean;
  show_leaderboard?: boolean;
  timezone?: string;
  locale?: string;
}

export interface SubmitChallengeRequest {
  challenge_id: string;
  prompt_text: string;
  submission_notes?: string;
}

export interface CreatePracticeSessionRequest {
  session_name?: string;
  prompt_text: string;
  prompt_type?: string;
}

export interface SavePromptRequest {
  prompt_id: string;
  prompt_title: string;
  prompt_text: string;
  prompt_description?: string;
  category?: string;
  tags?: string[];
  folder_name?: string;
  user_notes?: string;
}

// Database Connection Types
export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl?: boolean;
  pool?: {
    min: number;
    max: number;
    idleTimeoutMillis: number;
  };
}

// Migration Types
export interface Migration {
  id: string;
  name: string;
  up: string;
  down: string;
  created_at: Date;
  executed_at?: Date;
}