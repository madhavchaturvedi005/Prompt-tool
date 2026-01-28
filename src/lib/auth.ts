// Authentication service with Supabase integration (Frontend-compatible)
import { SupabaseService, isSupabaseConfigured, supabase } from './supabase';
import type { CreateUserRequest, LoginRequest } from '@/types/database';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  username: string;
  avatar_url?: string;
  savedPrompts: string[];
}

export interface AuthResponse {
  success: boolean;
  user?: AuthUser;
  token?: string;
  error?: string;
  requiresConfirmation?: boolean;
}

export class SupabaseAuthService {
  // Get current session
  static async getCurrentSession(): Promise<AuthUser | null> {
    if (!supabase) return null;
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        return null;
      }

      return {
        id: session.user.id,
        email: session.user.email!,
        name: session.user.user_metadata?.full_name || session.user.email!.split('@')[0],
        username: session.user.user_metadata?.username || session.user.email!.split('@')[0],
        avatar_url: session.user.user_metadata?.avatar_url,
        savedPrompts: []
      };
    } catch (error) {
      console.error('Session check error:', error);
      return null;
    }
  }

  // Register new user using Supabase Auth + custom profile
  static async register(data: CreateUserRequest): Promise<AuthResponse> {
    if (!supabase) {
      return { success: false, error: 'Supabase not configured' };
    }
    
    try {
      console.log('Starting Supabase registration for:', data.email);
      
      // Use Supabase Auth for user creation with email confirmation
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.full_name,
            username: data.username
          },
          emailRedirectTo: `${window.location.origin}/login?confirmed=true`
        }
      });

      if (authError) {
        console.error('Supabase auth error:', authError);
        
        // Handle specific error types
        if (authError.message.includes('Failed to fetch') || authError.name === 'AuthRetryableFetchError') {
          return { 
            success: false, 
            error: 'Network connection error. Please check your internet connection and try again.' 
          };
        }
        
        if (authError.message.includes('rate limit') || authError.message.includes('429')) {
          return { 
            success: false, 
            error: 'Too many requests. Please wait a moment and try again.' 
          };
        }
        
        if (authError.message.includes('User already registered')) {
          return { 
            success: false, 
            error: 'An account with this email already exists. Please try logging in instead.' 
          };
        }
        
        return { success: false, error: authError.message };
      }

      if (!authData.user) {
        return { success: false, error: 'Failed to create user account' };
      }

      console.log('Supabase user created:', authData.user.id);

      // If user is immediately confirmed (email confirmation disabled), create profile
      if (authData.user.email_confirmed_at || authData.session) {
        try {
          await SupabaseService.createUser({
            email: data.email,
            username: data.username,
            full_name: data.full_name,
            password_hash: 'supabase_auth' // Placeholder since Supabase handles auth
          });

          // Award welcome points
          await SupabaseService.addPoints({
            user_id: authData.user.id,
            points: 50,
            transaction_type: 'earned',
            source_type: 'admin',
            title: 'Welcome to PromptLab!',
            description: 'Welcome bonus for joining PromptLab'
          });
          
          console.log('User profile and welcome points created');
        } catch (profileError) {
          console.log('Profile creation skipped (may already exist):', profileError);
        }
      }

      // Convert to AuthUser format
      const authUser: AuthUser = {
        id: authData.user.id,
        email: authData.user.email!,
        name: data.full_name,
        username: data.username,
        avatar_url: authData.user.user_metadata?.avatar_url,
        savedPrompts: []
      };

      // Return success with user data (session may be null if email confirmation required)
      return { 
        success: true, 
        user: authUser, 
        token: authData.session?.access_token,
        requiresConfirmation: !authData.session // True if email confirmation is required
      };
    } catch (error: any) {
      console.error('Registration error:', error);
      
      // Handle network errors
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        return { 
          success: false, 
          error: 'Network connection error. Please check your internet connection and try again.' 
        };
      }
      
      if (error.name === 'AuthRetryableFetchError') {
        return { 
          success: false, 
          error: 'Connection timeout. Please check your internet connection and try again.' 
        };
      }
      
      return { success: false, error: 'Registration failed. Please try again.' };
    }
  }

  // Login user using Supabase Auth
  static async login(data: LoginRequest): Promise<AuthResponse> {
    if (!supabase) {
      return { success: false, error: 'Supabase not configured' };
    }
    
    try {
      console.log('Starting Supabase login for:', data.email);
      
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password
      });

      if (authError) {
        console.error('Supabase login error:', authError);
        
        // Handle specific error types
        if (authError.message.includes('Failed to fetch') || authError.name === 'AuthRetryableFetchError') {
          return { 
            success: false, 
            error: 'Network connection error. Please check your internet connection and try again.' 
          };
        }
        
        if (authError.message.includes('rate limit') || authError.message.includes('429')) {
          return { 
            success: false, 
            error: 'Too many requests. Please wait a moment and try again.' 
          };
        }
        
        // Check if it's an email not confirmed error
        if (authError.message.includes('Email not confirmed') || authError.message.includes('email_not_confirmed')) {
          return { 
            success: false, 
            error: 'Please verify your email address before logging in. Check your inbox for a confirmation email.',
            requiresConfirmation: true
          };
        }
        
        if (authError.message.includes('Invalid login credentials')) {
          return { 
            success: false, 
            error: 'Invalid email or password. Please check your credentials and try again.' 
          };
        }
        
        return { success: false, error: authError.message };
      }

      if (!authData.user) {
        return { success: false, error: 'Login failed' };
      }

      // Check if email is confirmed
      if (!authData.user.email_confirmed_at) {
        console.log('Email not confirmed for user:', authData.user.id);
        
        // Sign out the user since they shouldn't be logged in without confirmation
        await supabase.auth.signOut();
        
        return { 
          success: false, 
          error: 'Please verify your email address before logging in. Check your inbox for a confirmation email.',
          requiresConfirmation: true
        };
      }

      console.log('Supabase login successful:', authData.user.id);

      // Update last login in our custom table
      try {
        await SupabaseService.updateLastLogin(authData.user.id);
        console.log('Last login updated');
      } catch (error) {
        console.log('Last login update skipped:', error);
      }

      // Convert to AuthUser format
      const authUser: AuthUser = {
        id: authData.user.id,
        email: authData.user.email!,
        name: authData.user.user_metadata?.full_name || authData.user.email!.split('@')[0],
        username: authData.user.user_metadata?.username || authData.user.email!.split('@')[0],
        avatar_url: authData.user.user_metadata?.avatar_url,
        savedPrompts: []
      };

      return { 
        success: true, 
        user: authUser, 
        token: authData.session?.access_token 
      };
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Handle network errors
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        return { 
          success: false, 
          error: 'Network connection error. Please check your internet connection and try again.' 
        };
      }
      
      if (error.name === 'AuthRetryableFetchError') {
        return { 
          success: false, 
          error: 'Connection timeout. Please check your internet connection and try again.' 
        };
      }
      
      return { success: false, error: 'Login failed. Please try again.' };
    }
  }

  // Verify current session
  static async verifyToken(token?: string): Promise<AuthUser | null> {
    if (!supabase) return null;
    
    try {
      const { data: { user }, error } = await supabase.auth.getUser(token);
      
      if (error || !user) {
        return null;
      }

      // Convert to AuthUser format
      return {
        id: user.id,
        email: user.email!,
        name: user.user_metadata?.full_name || user.email!.split('@')[0],
        username: user.user_metadata?.username || user.email!.split('@')[0],
        avatar_url: user.user_metadata?.avatar_url,
        savedPrompts: []
      };
    } catch (error) {
      console.error('Token verification error:', error);
      return null;
    }
  }

  // Logout
  static async logout(): Promise<void> {
    if (!supabase) return;
    
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  // Resend confirmation email
  static async resendConfirmation(email: string): Promise<{ success: boolean; error?: string }> {
    if (!supabase) {
      return { success: false, error: 'Supabase not configured' };
    }
    
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/login?confirmed=true`
        }
      });

      if (error) {
        console.error('Resend confirmation error:', error);
        
        // Handle specific error types
        if (error.message.includes('Failed to fetch') || error.name === 'AuthRetryableFetchError') {
          return { 
            success: false, 
            error: 'Network connection error. Please check your internet connection and try again.' 
          };
        }
        
        if (error.message.includes('rate limit') || error.message.includes('429')) {
          return { 
            success: false, 
            error: 'Too many requests. Please wait a moment before requesting another email.' 
          };
        }
        
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      console.error('Resend confirmation error:', error);
      
      // Handle network errors
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        return { 
          success: false, 
          error: 'Network connection error. Please check your internet connection and try again.' 
        };
      }
      
      if (error.name === 'AuthRetryableFetchError') {
        return { 
          success: false, 
          error: 'Connection timeout. Please check your internet connection and try again.' 
        };
      }
      
      return { success: false, error: 'Failed to resend confirmation email' };
    }
  }

  // Get user's saved prompts
  static async getUserSavedPrompts(userId: string): Promise<string[]> {
    if (!supabase) return [];
    
    try {
      const savedPrompts = await SupabaseService.getUserSavedPrompts(userId);
      return savedPrompts.map((sp: any) => sp.prompt_id);
    } catch (error) {
      console.error('Error loading saved prompts:', error);
      return [];
    }
  }

  // Save a prompt for user
  static async savePrompt(userId: string, promptData: {
    prompt_id: string;
    prompt_title: string;
    prompt_text: string;
    prompt_description?: string;
    category?: string;
    tags?: string[];
  }): Promise<boolean> {
    if (!supabase) return false;
    
    try {
      await SupabaseService.savePrompt({
        user_id: userId,
        ...promptData
      });
      return true;
    } catch (error) {
      console.error('Error saving prompt:', error);
      return false;
    }
  }

  // Unsave a prompt for user
  static async unsavePrompt(userId: string, promptId: string): Promise<boolean> {
    if (!supabase) return false;
    
    try {
      await SupabaseService.unsavePrompt(userId, promptId);
      return true;
    } catch (error) {
      console.error('Error unsaving prompt:', error);
      return false;
    }
  }

  // Check if prompt is saved
  static async isPromptSaved(userId: string, promptId: string): Promise<boolean> {
    if (!supabase) return false;
    
    try {
      return await SupabaseService.isPromptSaved(userId, promptId);
    } catch (error) {
      console.error('Error checking saved prompt:', error);
      return false;
    }
  }
}

// Fallback for development/demo mode when Supabase is not available
export class MockAuthService {
  static async getCurrentSession(): Promise<AuthUser | null> {
    const savedUser = localStorage.getItem('mock_user');
    return savedUser ? JSON.parse(savedUser) : null;
  }

  static async register(data: CreateUserRequest): Promise<AuthResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (data.email && data.password && data.full_name) {
      const user: AuthUser = {
        id: Math.random().toString(36).substr(2, 9),
        email: data.email,
        name: data.full_name,
        username: data.username,
        savedPrompts: []
      };
      
      localStorage.setItem('mock_user', JSON.stringify(user));
      return { success: true, user, token: 'mock-token' };
    }
    
    return { success: false, error: 'Invalid registration data' };
  }

  static async login(data: LoginRequest): Promise<AuthResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (data.email && data.password) {
      const user: AuthUser = {
        id: Math.random().toString(36).substr(2, 9),
        email: data.email,
        name: data.email.split('@')[0],
        username: data.email.split('@')[0],
        savedPrompts: []
      };
      
      localStorage.setItem('mock_user', JSON.stringify(user));
      return { success: true, user, token: 'mock-token' };
    }
    
    return { success: false, error: 'Invalid credentials' };
  }

  static async verifyToken(token: string): Promise<AuthUser | null> {
    if (token === 'mock-token') {
      return this.getCurrentSession();
    }
    return null;
  }

  static async logout(): Promise<void> {
    localStorage.removeItem('mock_user');
  }

  static async getUserSavedPrompts(userId: string): Promise<string[]> {
    const savedPrompts = localStorage.getItem('mock_saved_prompts');
    return savedPrompts ? JSON.parse(savedPrompts) : [];
  }

  static async savePrompt(userId: string, promptData: any): Promise<boolean> {
    const savedPrompts = await this.getUserSavedPrompts(userId);
    if (!savedPrompts.includes(promptData.prompt_id)) {
      savedPrompts.push(promptData.prompt_id);
      localStorage.setItem('mock_saved_prompts', JSON.stringify(savedPrompts));
    }
    return true;
  }

  static async unsavePrompt(userId: string, promptId: string): Promise<boolean> {
    const savedPrompts = await this.getUserSavedPrompts(userId);
    const filtered = savedPrompts.filter(id => id !== promptId);
    localStorage.setItem('mock_saved_prompts', JSON.stringify(filtered));
    return true;
  }

  static async isPromptSaved(userId: string, promptId: string): Promise<boolean> {
    const savedPrompts = await this.getUserSavedPrompts(userId);
    return savedPrompts.includes(promptId);
  }
}

// Export the appropriate service based on environment
export const authService = isSupabaseConfigured() ? SupabaseAuthService : MockAuthService;