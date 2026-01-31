// Supabase client configuration and services
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY || import.meta.env.SUPABASE_SERVICE_ROLE_KEY || '';

console.log('Supabase Configuration:', {
  url: supabaseUrl,
  hasAnonKey: !!supabaseAnonKey,
  anonKeyLength: supabaseAnonKey.length,
  anonKeyPrefix: supabaseAnonKey.substring(0, 20),
  hasServiceKey: !!supabaseServiceKey,
  serviceKeyLength: supabaseServiceKey.length,
  serviceKeyPrefix: supabaseServiceKey.substring(0, 20)
});

// Check if Supabase is properly configured
export const isSupabaseConfigured = (): boolean => {
  const configured = !!(supabaseUrl && supabaseAnonKey && 
    supabaseUrl.includes('supabase.co') && 
    supabaseAnonKey.startsWith('eyJ'));
  
  console.log('isSupabaseConfigured:', configured);
  return configured;
};

// Create Supabase client for frontend (uses anon key) - only if configured
export const supabase = isSupabaseConfigured() 
  ? createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    })
  : null;

console.log('Supabase client created:', !!supabase);

// Create Supabase client for backend operations (uses service role key) - only if configured
export const supabaseAdmin = isSupabaseConfigured() && supabaseServiceKey
  ? createClient<Database>(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null;

console.log('Supabase admin client created:', !!supabaseAdmin);

// Supabase service class for database operations
export class SupabaseService {
  // Test connection
  static async testConnection(): Promise<boolean> {
    if (!supabase) return false;
    
    try {
      const { data, error } = await supabase.from('users').select('count').limit(1);
      return !error;
    } catch (error) {
      console.error('Supabase connection test failed:', error);
      return false;
    }
  }

  // User operations (using anon key for basic operations)
  static async createUser(userData: {
    email: string;
    username: string;
    full_name: string;
    password_hash: string;
  }) {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await supabase
      .from('users')
      .insert([{
        email: userData.email,
        username: userData.username,
        full_name: userData.full_name,
        password_hash: userData.password_hash
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getUserByEmail(email: string) {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('is_active', true)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
    return data;
  }

  static async getUserById(id: string) {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  static async updateLastLogin(userId: string) {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { error } = await supabase
      .from('users')
      .update({ last_login_at: new Date().toISOString() })
      .eq('id', userId);

    if (error) throw error;
  }

  // Statistics operations
  static async getUserStatistics(userId: string) {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await supabase
      .from('user_statistics')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  static async getDashboardStats(userId: string) {
    if (!supabase) throw new Error('Supabase not configured');
    
    // Get user statistics with achievements count
    const { data, error } = await supabase
      .rpc('get_dashboard_stats', { user_id: userId });

    if (error) throw error;
    return data;
  }

  // Points operations
  static async addPoints(transaction: {
    user_id: string;
    points: number;
    transaction_type: string;
    source_type: string;
    source_id?: string | null;
    title: string;
    description?: string;
    metadata?: Record<string, any>;
  }) {
    // Use admin client to bypass RLS since we're using custom auth
    const client = supabaseAdmin || supabase;
    
    if (!client) {
      console.error('Supabase not configured - cannot add points');
      throw new Error('Supabase not configured');
    }
    
    console.log('SupabaseService.addPoints called with:', {
      user_id: transaction.user_id,
      user_id_type: typeof transaction.user_id,
      points: transaction.points,
      transaction_type: transaction.transaction_type,
      source_type: transaction.source_type,
      title: transaction.title,
      usingAdmin: !!supabaseAdmin
    });
    
    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(transaction.user_id)) {
      const error = `Invalid UUID format for user_id: ${transaction.user_id}`;
      console.error(error);
      throw new Error(error);
    }
    
    const insertData = {
      user_id: transaction.user_id,
      points: transaction.points,
      transaction_type: transaction.transaction_type,
      source_type: transaction.source_type,
      source_id: transaction.source_id || null,
      title: transaction.title,
      description: transaction.description || null,
      metadata: transaction.metadata || null
    };
    
    console.log('Inserting into point_transactions:', insertData);
    
    try {
      const { data, error } = await client
        .from('point_transactions')
        .insert([insertData])
        .select()
        .single();

      if (error) {
        console.error('Supabase insert error:', {
          error,
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw error;
      }
      
      console.log('Successfully inserted point transaction:', data);
      return data;
    } catch (err: any) {
      console.error('Insert failed with exception:', err);
      throw err;
    }
  }

  static async getRecentActivity(userId: string, limit: number = 10) {
    // Use admin client to bypass RLS
    const client = supabaseAdmin || supabase;
    
    if (!client) throw new Error('Supabase not configured');
    
    const { data, error } = await client
      .from('point_transactions')
      .select('*')
      .eq('user_id', userId)
      .gt('points', 0)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  }

  // Challenge operations
  static async submitChallenge(submission: {
    user_id: string;
    challenge_id: string;
    prompt_text: string;
    submission_notes?: string;
  }) {
    if (!supabase) throw new Error('Supabase not configured');
    
    // Get current attempt number
    const { data: attempts } = await supabase
      .from('challenge_submissions')
      .select('attempt_number')
      .eq('user_id', submission.user_id)
      .eq('challenge_id', submission.challenge_id)
      .order('attempt_number', { ascending: false })
      .limit(1);

    const attemptNumber = attempts && attempts.length > 0 ? attempts[0].attempt_number + 1 : 1;

    const { data, error } = await supabase
      .from('challenge_submissions')
      .insert([{
        ...submission,
        attempt_number: attemptNumber,
        status: 'submitted'
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateSubmissionEvaluation(submissionId: string, evaluation: {
    overall_score: number;
    criteria_scores: Record<string, number>;
    ai_feedback: string;
    points_earned: number;
  }) {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { error } = await supabase
      .from('challenge_submissions')
      .update({
        overall_score: evaluation.overall_score,
        criteria_scores: JSON.stringify(evaluation.criteria_scores),
        ai_feedback: evaluation.ai_feedback,
        points_earned: evaluation.points_earned,
        is_completed: true,
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .eq('id', submissionId);

    if (error) throw error;
  }

  // Practice operations
  static async createPracticeSession(session: {
    user_id: string;
    session_name?: string;
    prompt_text: string;
    prompt_type?: string;
  }) {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await supabase
      .from('practice_sessions')
      .insert([{
        ...session,
        status: 'evaluating'
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updatePracticeEvaluation(sessionId: string, evaluation: {
    overall_score: number;
    criteria_scores: Record<string, number>;
    applicable_criteria: string[];
    ai_feedback: string;
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
    points_earned: number;
  }) {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { error } = await supabase
      .from('practice_sessions')
      .update({
        overall_score: evaluation.overall_score,
        criteria_scores: JSON.stringify(evaluation.criteria_scores),
        applicable_criteria: evaluation.applicable_criteria,
        ai_feedback: evaluation.ai_feedback,
        strengths: evaluation.strengths,
        weaknesses: evaluation.weaknesses,
        suggestions: evaluation.suggestions,
        points_earned: evaluation.points_earned,
        status: 'completed'
      })
      .eq('id', sessionId);

    if (error) throw error;
  }

  // Saved prompts operations
  static async savePrompt(prompt: {
    user_id: string;
    prompt_id: string;
    prompt_title: string;
    prompt_text: string;
    prompt_description?: string;
    category?: string;
    tags?: string[];
    folder_name?: string;
    user_notes?: string;
  }) {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await supabase
      .from('saved_prompts')
      .upsert([prompt], {
        onConflict: 'user_id,prompt_id'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async unsavePrompt(userId: string, promptId: string) {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { error } = await supabase
      .from('saved_prompts')
      .delete()
      .eq('user_id', userId)
      .eq('prompt_id', promptId);

    if (error) throw error;
  }

  static async getUserSavedPrompts(userId: string) {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await supabase
      .from('saved_prompts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async isPromptSaved(userId: string, promptId: string): Promise<boolean> {
    if (!supabase) return false;
    
    const { data, error } = await supabase
      .from('saved_prompts')
      .select('id')
      .eq('user_id', userId)
      .eq('prompt_id', promptId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return !!data;
  }

  // Weekly progress
  static async getWeeklyProgress(userId: string) {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await supabase
      .rpc('get_weekly_progress', { user_id: userId });

    if (error) throw error;
    return data || [];
  }
}

export default SupabaseService;