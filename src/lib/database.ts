// Database connection and utility functions for PromptLab
import { Pool, PoolClient, QueryResult } from 'pg';
import type { 
  DatabaseConfig, 
  User, 
  UserStatistics, 
  Challenge, 
  ChallengeSubmission,
  PracticeSession,
  SavedPrompt,
  PointTransaction,
  Achievement,
  UserAchievement,
  DashboardStats,
  WeeklyProgress,
  RecentActivity
} from '@/types/database';

// Database configuration
const dbConfig: DatabaseConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'promptlab',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  ssl: process.env.NODE_ENV === 'production',
  pool: {
    min: 2,
    max: 10,
    idleTimeoutMillis: 30000,
  }
};

// Create connection pool
const pool = new Pool({
  host: dbConfig.host,
  port: dbConfig.port,
  database: dbConfig.database,
  user: dbConfig.username,
  password: dbConfig.password,
  ssl: dbConfig.ssl ? { rejectUnauthorized: false } : false,
  min: dbConfig.pool?.min,
  max: dbConfig.pool?.max,
  idleTimeoutMillis: dbConfig.pool?.idleTimeoutMillis,
});

// Database utility class
export class Database {
  private static instance: Database;
  private pool: Pool;

  private constructor() {
    this.pool = pool;
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  // Generic query method
  async query<T = any>(text: string, params?: any[]): Promise<QueryResult<T>> {
    const client = await this.pool.connect();
    try {
      const result = await client.query<T>(text, params);
      return result;
    } finally {
      client.release();
    }
  }

  // Transaction wrapper
  async transaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // Close all connections
  async close(): Promise<void> {
    await this.pool.end();
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      const result = await this.query('SELECT 1 as health');
      return result.rows[0]?.health === 1;
    } catch (error) {
      console.error('Database health check failed:', error);
      return false;
    }
  }
}

// User-related database operations
export class UserRepository {
  private db: Database;

  constructor() {
    this.db = Database.getInstance();
  }

  async createUser(userData: {
    email: string;
    username: string;
    full_name: string;
    password_hash: string;
  }): Promise<User> {
    const query = `
      INSERT INTO users (email, username, full_name, password_hash)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const result = await this.db.query<User>(query, [
      userData.email,
      userData.username,
      userData.full_name,
      userData.password_hash
    ]);
    
    // Create associated profile and statistics
    await this.createUserProfile(result.rows[0].id);
    await this.createUserStatistics(result.rows[0].id);
    
    return result.rows[0];
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE email = $1 AND is_active = true';
    const result = await this.db.query<User>(query, [email]);
    return result.rows[0] || null;
  }

  async getUserById(id: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE id = $1 AND is_active = true';
    const result = await this.db.query<User>(query, [id]);
    return result.rows[0] || null;
  }

  async updateLastLogin(userId: string): Promise<void> {
    const query = 'UPDATE users SET last_login_at = NOW() WHERE id = $1';
    await this.db.query(query, [userId]);
  }

  private async createUserProfile(userId: string): Promise<void> {
    const query = `
      INSERT INTO user_profiles (user_id)
      VALUES ($1)
      ON CONFLICT (user_id) DO NOTHING
    `;
    await this.db.query(query, [userId]);
  }

  private async createUserStatistics(userId: string): Promise<void> {
    const query = `
      INSERT INTO user_statistics (user_id)
      VALUES ($1)
      ON CONFLICT (user_id) DO NOTHING
    `;
    await this.db.query(query, [userId]);
  }

  async getUserStatistics(userId: string): Promise<UserStatistics | null> {
    const query = 'SELECT * FROM user_statistics WHERE user_id = $1';
    const result = await this.db.query<UserStatistics>(query, [userId]);
    return result.rows[0] || null;
  }

  async getDashboardStats(userId: string): Promise<DashboardStats> {
    const query = `
      SELECT 
        us.total_points,
        us.challenges_completed,
        us.current_streak,
        us.global_rank,
        us.prompts_saved,
        us.average_score,
        us.practice_sessions,
        COUNT(ua.id) FILTER (WHERE ua.is_completed = true) as achievements_earned
      FROM user_statistics us
      LEFT JOIN user_achievements ua ON us.user_id = ua.user_id
      WHERE us.user_id = $1
      GROUP BY us.user_id, us.total_points, us.challenges_completed, us.current_streak, 
               us.global_rank, us.prompts_saved, us.average_score, us.practice_sessions
    `;
    
    const result = await this.db.query(query, [userId]);
    const row = result.rows[0];
    
    return {
      totalPoints: row?.total_points || 0,
      completedChallenges: row?.challenges_completed || 0,
      currentStreak: row?.current_streak || 0,
      globalRank: row?.global_rank || 0,
      savedPrompts: row?.prompts_saved || 0,
      averageScore: row?.average_score || 0,
      practicesSessions: row?.practice_sessions || 0,
      achievementsEarned: row?.achievements_earned || 0
    };
  }
}

// Challenge-related database operations
export class ChallengeRepository {
  private db: Database;

  constructor() {
    this.db = Database.getInstance();
  }

  async getAllChallenges(): Promise<Challenge[]> {
    const query = `
      SELECT * FROM challenges 
      WHERE is_active = true 
      ORDER BY sort_order, created_at DESC
    `;
    const result = await this.db.query<Challenge>(query);
    return result.rows;
  }

  async getChallengeById(id: string): Promise<Challenge | null> {
    const query = 'SELECT * FROM challenges WHERE id = $1 AND is_active = true';
    const result = await this.db.query<Challenge>(query, [id]);
    return result.rows[0] || null;
  }

  async submitChallenge(submission: {
    user_id: string;
    challenge_id: string;
    prompt_text: string;
    submission_notes?: string;
  }): Promise<ChallengeSubmission> {
    // Get current attempt number
    const attemptQuery = `
      SELECT COALESCE(MAX(attempt_number), 0) + 1 as next_attempt
      FROM challenge_submissions 
      WHERE user_id = $1 AND challenge_id = $2
    `;
    const attemptResult = await this.db.query(attemptQuery, [submission.user_id, submission.challenge_id]);
    const attemptNumber = attemptResult.rows[0].next_attempt;

    const query = `
      INSERT INTO challenge_submissions (user_id, challenge_id, prompt_text, submission_notes, attempt_number, status)
      VALUES ($1, $2, $3, $4, $5, 'submitted')
      RETURNING *
    `;
    
    const result = await this.db.query<ChallengeSubmission>(query, [
      submission.user_id,
      submission.challenge_id,
      submission.prompt_text,
      submission.submission_notes,
      attemptNumber
    ]);

    return result.rows[0];
  }

  async updateSubmissionEvaluation(submissionId: string, evaluation: {
    overall_score: number;
    criteria_scores: Record<string, number>;
    ai_feedback: string;
    points_earned: number;
  }): Promise<void> {
    const query = `
      UPDATE challenge_submissions 
      SET 
        overall_score = $2,
        criteria_scores = $3,
        ai_feedback = $4,
        points_earned = $5,
        is_completed = true,
        status = 'completed',
        completed_at = NOW(),
        updated_at = NOW()
      WHERE id = $1
    `;
    
    await this.db.query(query, [
      submissionId,
      evaluation.overall_score,
      JSON.stringify(evaluation.criteria_scores),
      evaluation.ai_feedback,
      evaluation.points_earned
    ]);
  }

  async getUserChallengeSubmissions(userId: string): Promise<ChallengeSubmission[]> {
    const query = `
      SELECT cs.*, c.title as challenge_title
      FROM challenge_submissions cs
      JOIN challenges c ON cs.challenge_id = c.id
      WHERE cs.user_id = $1
      ORDER BY cs.created_at DESC
    `;
    const result = await this.db.query<ChallengeSubmission>(query, [userId]);
    return result.rows;
  }
}

// Practice session operations
export class PracticeRepository {
  private db: Database;

  constructor() {
    this.db = Database.getInstance();
  }

  async createPracticeSession(session: {
    user_id: string;
    session_name?: string;
    prompt_text: string;
    prompt_type?: string;
  }): Promise<PracticeSession> {
    const query = `
      INSERT INTO practice_sessions (user_id, session_name, prompt_text, prompt_type, status)
      VALUES ($1, $2, $3, $4, 'evaluating')
      RETURNING *
    `;
    
    const result = await this.db.query<PracticeSession>(query, [
      session.user_id,
      session.session_name,
      session.prompt_text,
      session.prompt_type
    ]);

    return result.rows[0];
  }

  async updatePracticeEvaluation(sessionId: string, evaluation: {
    overall_score: number;
    criteria_scores: Record<string, number>;
    applicable_criteria: string[];
    ai_feedback: string;
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
    points_earned: number;
  }): Promise<void> {
    const query = `
      UPDATE practice_sessions 
      SET 
        overall_score = $2,
        criteria_scores = $3,
        applicable_criteria = $4,
        ai_feedback = $5,
        strengths = $6,
        weaknesses = $7,
        suggestions = $8,
        points_earned = $9,
        status = 'completed',
        updated_at = NOW()
      WHERE id = $1
    `;
    
    await this.db.query(query, [
      sessionId,
      evaluation.overall_score,
      JSON.stringify(evaluation.criteria_scores),
      evaluation.applicable_criteria,
      evaluation.ai_feedback,
      evaluation.strengths,
      evaluation.weaknesses,
      evaluation.suggestions,
      evaluation.points_earned
    ]);
  }

  async getUserPracticeSessions(userId: string, limit: number = 10): Promise<PracticeSession[]> {
    const query = `
      SELECT * FROM practice_sessions 
      WHERE user_id = $1 
      ORDER BY created_at DESC 
      LIMIT $2
    `;
    const result = await this.db.query<PracticeSession>(query, [userId, limit]);
    return result.rows;
  }
}

// Saved prompts operations
export class SavedPromptsRepository {
  private db: Database;

  constructor() {
    this.db = Database.getInstance();
  }

  async savePrompt(prompt: {
    user_id: string;
    prompt_id: string;
    prompt_title: string;
    prompt_text: string;
    prompt_description?: string;
    category?: string;
    tags?: string[];
    folder_name?: string;
    user_notes?: string;
  }): Promise<SavedPrompt> {
    const query = `
      INSERT INTO saved_prompts (
        user_id, prompt_id, prompt_title, prompt_text, prompt_description,
        category, tags, folder_name, user_notes
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (user_id, prompt_id) 
      DO UPDATE SET 
        prompt_title = EXCLUDED.prompt_title,
        prompt_text = EXCLUDED.prompt_text,
        prompt_description = EXCLUDED.prompt_description,
        user_notes = EXCLUDED.user_notes,
        updated_at = NOW()
      RETURNING *
    `;
    
    const result = await this.db.query<SavedPrompt>(query, [
      prompt.user_id,
      prompt.prompt_id,
      prompt.prompt_title,
      prompt.prompt_text,
      prompt.prompt_description,
      prompt.category,
      prompt.tags || [],
      prompt.folder_name,
      prompt.user_notes
    ]);

    return result.rows[0];
  }

  async unsavePrompt(userId: string, promptId: string): Promise<void> {
    const query = 'DELETE FROM saved_prompts WHERE user_id = $1 AND prompt_id = $2';
    await this.db.query(query, [userId, promptId]);
  }

  async getUserSavedPrompts(userId: string): Promise<SavedPrompt[]> {
    const query = `
      SELECT * FROM saved_prompts 
      WHERE user_id = $1 
      ORDER BY created_at DESC
    `;
    const result = await this.db.query<SavedPrompt>(query, [userId]);
    return result.rows;
  }

  async isPromptSaved(userId: string, promptId: string): Promise<boolean> {
    const query = 'SELECT 1 FROM saved_prompts WHERE user_id = $1 AND prompt_id = $2';
    const result = await this.db.query(query, [userId, promptId]);
    return result.rows.length > 0;
  }
}

// Points and achievements operations
export class PointsRepository {
  private db: Database;

  constructor() {
    this.db = Database.getInstance();
  }

  async addPoints(transaction: {
    user_id: string;
    points: number;
    transaction_type: string;
    source_type: string;
    source_id?: string;
    title: string;
    description?: string;
    metadata?: Record<string, any>;
  }): Promise<PointTransaction> {
    const query = `
      INSERT INTO point_transactions (
        user_id, points, transaction_type, source_type, source_id, title, description, metadata
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    
    const result = await this.db.query<PointTransaction>(query, [
      transaction.user_id,
      transaction.points,
      transaction.transaction_type,
      transaction.source_type,
      transaction.source_id,
      transaction.title,
      transaction.description,
      JSON.stringify(transaction.metadata)
    ]);

    return result.rows[0];
  }

  async getUserPointHistory(userId: string, limit: number = 20): Promise<PointTransaction[]> {
    const query = `
      SELECT * FROM point_transactions 
      WHERE user_id = $1 
      ORDER BY created_at DESC 
      LIMIT $2
    `;
    const result = await this.db.query<PointTransaction>(query, [userId, limit]);
    return result.rows;
  }

  async getRecentActivity(userId: string, limit: number = 10): Promise<RecentActivity[]> {
    const query = `
      SELECT 
        pt.id,
        pt.source_type as type,
        pt.title,
        pt.points,
        pt.created_at,
        CASE 
          WHEN pt.created_at > NOW() - INTERVAL '1 hour' THEN EXTRACT(EPOCH FROM (NOW() - pt.created_at))/60 || ' minutes ago'
          WHEN pt.created_at > NOW() - INTERVAL '1 day' THEN EXTRACT(EPOCH FROM (NOW() - pt.created_at))/3600 || ' hours ago'
          ELSE EXTRACT(EPOCH FROM (NOW() - pt.created_at))/86400 || ' days ago'
        END as time
      FROM point_transactions pt
      WHERE pt.user_id = $1 AND pt.points > 0
      ORDER BY pt.created_at DESC
      LIMIT $2
    `;
    
    const result = await this.db.query(query, [userId, limit]);
    
    return result.rows.map(row => ({
      id: row.id,
      type: row.type,
      title: row.title,
      points: row.points,
      time: row.time,
      icon: this.getActivityIcon(row.type),
      color: this.getActivityColor(row.type)
    }));
  }

  private getActivityIcon(type: string): string {
    const icons: Record<string, string> = {
      challenge: 'Trophy',
      practice: 'Brain',
      achievement: 'Medal',
      streak: 'Flame',
      course: 'BookOpen'
    };
    return icons[type] || 'Star';
  }

  private getActivityColor(type: string): string {
    const colors: Record<string, string> = {
      challenge: 'text-amber-400',
      practice: 'text-purple-400',
      achievement: 'text-emerald-400',
      streak: 'text-orange-400',
      course: 'text-blue-400'
    };
    return colors[type] || 'text-foreground';
  }
}

// Export singleton instances
export const userRepository = new UserRepository();
export const challengeRepository = new ChallengeRepository();
export const practiceRepository = new PracticeRepository();
export const savedPromptsRepository = new SavedPromptsRepository();
export const pointsRepository = new PointsRepository();

// Export database instance
export const database = Database.getInstance();